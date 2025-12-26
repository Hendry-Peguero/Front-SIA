/**
 * Barcode scanning types
 */

/**
 * DTO para enviar al backend cuando se escanea un código
 */
export interface BarcodeScanDto {
    barcode: string;
    scannedAt: string; // ISO 8601 DateTime
}

/**
 * Respuesta del backend al validar un código de barras
 */
export interface BarcodeValidationResponse {
    isValid: boolean;
    itemId?: number;
    itemName?: string;
    message?: string;
}

/**
 * Estado del scanner
 */
export type ScannerStatus = 'idle' | 'scanning' | 'validating' | 'success' | 'error';

/**
 * Error del scanner
 */
export interface ScannerError {
    code: 'PERMISSION_DENIED' | 'NO_CAMERA' | 'INVALID_BARCODE' | 'NOT_FOUND' | 'SERVER_ERROR';
    message: string;
}
