import apiClient from './axiosConfig';
import type { BarcodeScanDto, BarcodeValidationResponse } from '../types/barcode.types';

/**
 * API service for barcode scanning and validation
 */

/**
 * Send scanned barcode to backend for validation
 * @param data - Barcode scan data
 * @returns Validation response from backend
 */
export const scanBarcode = async (data: BarcodeScanDto): Promise<BarcodeValidationResponse> => {
    const response = await apiClient.post<BarcodeValidationResponse>('/barcode/scan', data);
    return response.data;
};

/**
 * Alternative: Validate barcode without scanning timestamp
 * @param barcode - The barcode string
 * @returns Validation response
 */
export const validateBarcode = async (barcode: string): Promise<BarcodeValidationResponse> => {
    const data: BarcodeScanDto = {
        barcode,
        scannedAt: new Date().toISOString(),
    };
    return scanBarcode(data);
};

export default {
    scanBarcode,
    validateBarcode,
};
