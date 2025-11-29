import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '../ui/button';
import { Camera, X, Scan } from 'lucide-react';

interface BarcodeScannerProps {
    onScan: (barcode: string) => void;
    onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [cameras, setCameras] = useState<any[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>('');

    useEffect(() => {
        // Get available cameras
        Html5Qrcode.getCameras()
            .then((devices) => {
                if (devices && devices.length) {
                    setCameras(devices);
                    // Prefer back camera for mobile devices
                    const backCamera = devices.find(d => d.label.toLowerCase().includes('back'));
                    setSelectedCamera(backCamera?.id || devices[0].id);
                }
            })
            .catch((err) => {
                console.error('Error getting cameras:', err);
                setError('No se pudieron obtener las cámaras disponibles');
            });

        return () => {
            stopScanning();
        };
    }, []);

    const startScanning = async () => {
        if (!selectedCamera) {
            setError('No hay cámara seleccionada');
            return;
        }

        try {
            setError(null);
            const scanner = new Html5Qrcode('barcode-reader');
            scannerRef.current = scanner;

            await scanner.start(
                selectedCamera,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    // Success callback
                    onScan(decodedText);
                    stopScanning();
                },
                (errorMessage) => {
                    // Error callback (can be ignored for continuous scanning)
                    // console.log('Scanning...', errorMessage);
                }
            );

            setIsScanning(true);
        } catch (err: any) {
            console.error('Error starting scanner:', err);
            setError('Error al iniciar el escáner: ' + err.message);
        }
    };

    const stopScanning = async () => {
        if (scannerRef.current && isScanning) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
                scannerRef.current = null;
                setIsScanning(false);
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
            {cameras.length > 1 && !isScanning && (
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
                    className="w-full rounded-lg overflow-hidden border-2 border-primary"
                    style={{ minHeight: '300px' }}
                />
                {!isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                        <div className="text-center">
                            <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                Presiona "Iniciar Escáner" para comenzar
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-sm text-destructive">{error}</p>
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
                    • El escaneo se realizará automáticamente
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={handleClose}>
                    Cancelar
                </Button>
                {!isScanning ? (
                    <Button onClick={startScanning} disabled={!selectedCamera}>
                        <Camera className="h-4 w-4 mr-2" />
                        Iniciar Escáner
                    </Button>
                ) : (
                    <Button variant="destructive" onClick={stopScanning}>
                        Detener Escáner
                    </Button>
                )}
            </div>
        </div>
    );
};

export default BarcodeScanner;
