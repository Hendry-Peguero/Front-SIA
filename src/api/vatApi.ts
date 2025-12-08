import apiClient from './axiosConfig';

/**
 * VAT (Value Added Tax / ITBIS) API Client
 * Base URL: /api/Vat
 */

/**
 * VatDto - Response type from API
 */
export interface VatDto {
    id: number;
    descripcion: string;
    vat: number; // Percentage value
}

/**
 * SaveVatDto - Request type for create/update (for future use)
 */
export interface SaveVatDto {
    descripcion: string;
    vat: number;
}

/**
 * Get all VAT types
 */
export const getVats = async (): Promise<VatDto[]> => {
    const response = await apiClient.get<VatDto[]>('/Vat');
    return response.data;
};

/**
 * Get VAT by ID (stub for future backend implementation)
 */
export const getVatById = async (id: number): Promise<VatDto> => {
    const response = await apiClient.get<VatDto>(`/Vat/${id}`);
    return response.data;
};

/**
 * Create a new VAT type (stub for future backend implementation)
 */
export const createVat = async (data: SaveVatDto): Promise<VatDto> => {
    const response = await apiClient.post<VatDto>('/Vat', data);
    return response.data;
};

/**
 * Update an existing VAT type (stub for future backend implementation)
 */
export const updateVat = async (id: number, data: SaveVatDto): Promise<VatDto> => {
    const response = await apiClient.put<VatDto>(`/Vat/${id}`, data);
    return response.data;
};

/**
 * Delete a VAT type (stub for future backend implementation)
 */
export const deleteVat = async (id: number): Promise<void> => {
    await apiClient.delete(`/Vat/${id}`);
};
