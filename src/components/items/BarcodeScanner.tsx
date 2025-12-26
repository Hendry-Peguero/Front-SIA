import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeResult } from 'html5-qrcode';
import { Button } from '../ui/button';
import { Camera, X, Scan, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { scanBarcode } from '../../api/barcodeApi';
import type { ScannerStatus, ScannerError } from '../../types/barcode.types';

interface BarcodeScannerProps {
    onScan: (barcode: string) => void;
    onClose: () => void;
    onValidationSuccess?: (itemId?: number, itemName?: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose, onValidationSuccess }) => {
    const [status, setStatus] = useState<ScannerStatus>('idle');
    const [error, setError] = useState<ScannerError | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>('');
    const lastScanTimeRef = useRef<number>(0);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Debounce: 2 segundos entre escaneos
    const DEBOUNCE_TIME = 2000;

    useEffect(() => {
        // Inicializar AudioContext para feedback sonoro
        if (typeof window !== 'undefined' && 'AudioContext' in window) {
            audioContextRef.current = new AudioContext();
        }

        // Get available cameras
        Html5Qrcode.getCameras()
            .then((devices) => {
                if (devices && devices.length) {
                    setCameras(devices);
                    // Prefer back camera for mobile devices
                    const backCamera = devices.find(d => d.label.toLowerCase().includes('back'));
                    setSelectedCamera(backCamera?.id || devices[0].id);
                } else {
                    setError({
                        code: 'NO_CAMERA',
                        message: 'No se encontraron cámaras disponibles en este dispositivo'
                    });
                }
            })
            .catch((err) => {
                console.error('Error getting cameras:', err);
                setError({
                    code: 'NO_CAMERA',
                    message: 'No se pudieron obtener las cámaras disponibles. Verifica los permisos.'
                });
            });

        return () => {
            stopScanning();
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    /**
     * Reproduce un beep de éxito
     */
    const playSuccessSound = () => {
        if (!audioContextRef.current) return;

        try {
            const oscillator = audioContextRef.current.createOscillator();
            const gainNode = audioContextRef.current.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);

            oscillator.frequency.value = 800; // Frecuencia agradable
            gainNode.gain.value = 0.1; // Volumen bajo

            oscillator.start();
            oscillator.stop(audioContextRef.current.currentTime + 0.1);
        } catch (err) {
            console.warn('No se pudo reproducir sonido:', err);
        }
    };

    /**
     * Valida el código con el backend
     */
    const validateWithBackend = async (barcode: string) => {
        setStatus('validating');
        setError(null);

        try {
            const response = await scanBarcode({
                barcode,
                scannedAt: new Date().toISOString()
            });

            if (response.isValid) {
                setStatus('success');
                setSuccessMessage(response.message || `Código válido: ${barcode}`);
                playSuccessSound();

                // Llamar callbacks
                onScan(barcode);
                if (onValidationSuccess) {
                    onValidationSuccess(response.itemId, response.itemName);
                }

                // Auto-cerrar después de 2 segundos
                setTimeout(() => {
                    stopScanning();
                    onClose();
                }, 2000);
            } else {
                setStatus('error');
                setError({
                    code: 'INVALID_BARCODE',
                    message: response.message || 'Código de barras inválido'
                });
                // Reiniciar escaneo después de 2 segundos
                setTimeout(() => setStatus('scanning'), 2000);
            }
        } catch (err: unknown) {
            setStatus('error');

            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { status: number; data?: { message?: string } } };
                const status = axiosError.response?.status;

                if (status === 404) {
                    setError({
                        code: 'NOT_FOUND',
                        message: 'Código no encontrado en el sistema'
                    });
                } else if (status === 400) {
                    setError({
                        code: 'INVALID_BARCODE',
                        message: axiosError.response?.data?.message || 'Código de barras inválido'
                    });
                } else {
                    setError({
                        code: 'SERVER_ERROR',
                        message: 'Error al validar con el servidor'
                    });
                }
            } else {
                setError({
                    code: 'SERVER_ERROR',
                    message: 'Error de conexión con el servidor'
                });
            }

            // Reiniciar escaneo después de 3 segundos
            setTimeout(() => {
                setStatus('scanning');
                setError(null);
            }, 3000);
        }
    };

    /**
     * Callback cuando se detecta un código
     */
    const onScanSuccess = (decodedText: string, _decodedResult: Html5QrcodeResult) => {
        const now = Date.now();

        // Debounce: ignorar si han pasado menos de 2 segundos
        if (now - lastScanTimeRef.current < DEBOUNCE_TIME) {
            console.log(`Debounce: ignorando escaneo duplicado de ${decodedText}`);
            return;
        }

        lastScanTimeRef.current = now;
        console.log(`Código detectado: ${decodedText}`);

        // Validar con backend
        validateWithBackend(decodedText);
    };

    const startScanning = async () => {
        if (!selectedCamera) {
            setError({
                code: 'NO_CAMERA',
                message: 'No hay cámara seleccionada'
            });
            return;
        }

        try {
            setError(null);
            setSuccessMessage('');
            const scanner = new Html5Qrcode('barcode-reader');
            scannerRef.current = scanner;

            await scanner.start(
                selectedCamera,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                onScanSuccess,
                (_errorMessage) => {
                    // Error callback - se llama continuamente mientras escanea
                    // No hacer nada aquí
                }
            );

            setStatus('scanning');
        } catch (err: unknown) {
            console.error('Error starting scanner:', err);

            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';

            if (errorMessage.includes('Permission') || errorMessage.includes('NotAllowed')) {
                setError({
                    code: 'PERMISSION_DENIED',
                    message: 'Permisos de cámara denegados. Por favor, permite el acceso a la cámara en la configuración de tu navegador.'
                });
            } else {
                setError({
                    code: 'NO_CAMERA',
                    message: `Error al iniciar el escáner: ${errorMessage}`
                });
            }
        }
    };

    const stopScanning = async () => {
        if (scannerRef.current && status === 'scanning') {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
                scannerRef.current = null;
                setStatus('idle');
            } catch (err) {
                console.error('Error stopping scanner:', err);
            }
        }
    };

    const handleClose = async () => {
        await stopScanning();
        onClose();
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Scan className="h-5 w-5" />
                    Escanear Código de Barras
                </h3>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Camera Selection */}
            {cameras.length > 1 && status === 'idle' && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Seleccionar Cámara:</label>
                    <select
                        value={selectedCamera}
                        onChange={(e) => setSelectedCamera(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        {cameras.map((camera) => (
                            <option key={camera.id} value={camera.id}>
                                {camera.label || `Cámara ${camera.id}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Scanner Container */}
            <div className="relative">
                <div
                    id="barcode-reader"
                    className={`w-full rounded-lg overflow-hidden border-2 transition-colors ${status === 'scanning' ? 'border-primary' :
                        status === 'validating' ? 'border-yellow-500' :
                            status === 'success' ? 'border-green-500' :
                                status === 'error' ? 'border-red-500' :
                                    'border-muted'
                        }`}
                    style={{ minHeight: '300px' }}
                />

                {/* Overlay for different states */}
                {status !== 'scanning' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
                        <div className="text-center">
                            {status === 'idle' && (
                                <>
                                    <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        Presiona "Iniciar Escáner" para comenzar
                                    </p>
                                </>
                            )}
                            {status === 'validating' && (
                                <>
                                    <Loader2 className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
                                    <p className="text-sm font-medium">Validando código...</p>
                                </>
                            )}
                            {status === 'success' && (
                                <>
                                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500 animate-pulse" />
                                    <p className="text-sm font-medium text-green-600">{successMessage}</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-destructive">Error: {error.code}</p>
                        <p className="text-sm text-destructive/80">{error.message}</p>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {successMessage && !error && status === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">{successMessage}</p>
                </div>
            )}

            {/* Instructions */}
            <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">
                    <strong>Instrucciones:</strong>
                    <br />
                    • Coloca el código de barras frente a la cámara
                    <br />
                    • Mantén el código dentro del cuadro
                    <br />
                    • El escaneo y validación se realizarán automáticamente
                    <br />
                    • Espera 2 segundos entre escaneos
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={handleClose}>
                    Cancelar
                </Button>
                {status === 'idle' ? (
                    <Button onClick={startScanning} disabled={!selectedCamera}>
                        <Camera className="h-4 w-4 mr-2" />
                        Iniciar Escáner
                    </Button>
                ) : status === 'scanning' ? (
                    <Button variant="destructive" onClick={stopScanning}>
                        Detener Escáner
                    </Button>
                ) : null}
            </div>
        </div>
    );
};

export default BarcodeScanner;

