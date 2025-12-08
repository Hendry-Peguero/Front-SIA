import apiClient from './axiosConfig';
import { ItemInformationDto, SaveItemInformationDto } from '../types/item.types';

/**
 * Item Information API Client
 * Base URL: /api/ItemInformation
 */

/**
 * Get all items
 */
export const getItems = async (): Promise<ItemInformationDto[]> => {
    const response = await apiClient.get<ItemInformationDto[]>('/ItemInformation');
    return response.data;
};

/**
 * Get item by ID
 */
export const getItemById = async (id: number): Promise<ItemInformationDto> => {
    const response = await apiClient.get<ItemInformationDto>(`/ItemInformation/${id}`);
    return response.data;
};

/**
 * Create a new item
 */
export const createItem = async (data: SaveItemInformationDto): Promise<ItemInformationDto> => {
    const response = await apiClient.post<ItemInformationDto>('/ItemInformation', data);
    return response.data;
};

/**
 * Update an existing item
 */
export const updateItem = async (
    id: number,
    data: SaveItemInformationDto
): Promise<ItemInformationDto> => {
    const response = await apiClient.put<ItemInformationDto>(`/ItemInformation/${id}`, data);
    return response.data;
};

/**
 * Delete an item
 */
export const deleteItem = async (id: number): Promise<void> => {
    await apiClient.delete(`/ItemInformation/${id}`);
};

/**
 * Get item by barcode
 */
export const getItemByBarcode = async (barcode: string): Promise<ItemInformationDto> => {
    const response = await apiClient.get<ItemInformationDto>(`/ItemInformation/barcode/${barcode}`);
    return response.data;
};
