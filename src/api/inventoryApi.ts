import apiClient from './axiosConfig';
import { InventoryMovementDto, InventoryMovementSaveDto } from '../types/inventory.types';

/**
 * API service for inventory movements
 */
export const inventoryApi = {
    /**
     * Get all inventory movements
     */
    getAll: async (): Promise<InventoryMovementDto[]> => {
        const response = await apiClient.get<InventoryMovementDto[]>('/InventoryMovements');
        return response.data;
    },

    /**
     * Get a single inventory movement by ID
     */
    getById: async (id: number): Promise<InventoryMovementDto> => {
        const response = await apiClient.get<InventoryMovementDto>(`/InventoryMovements/${id}`);
        return response.data;
    },

    /**
     * Create a new inventory movement
     */
    create: async (data: InventoryMovementSaveDto): Promise<InventoryMovementDto> => {
        const response = await apiClient.post<InventoryMovementDto>('/InventoryMovements', data);
        return response.data;
    },

    /**
     * Update an existing inventory movement
     */
    update: async (id: number, data: InventoryMovementSaveDto): Promise<InventoryMovementDto> => {
        const response = await apiClient.put<InventoryMovementDto>(`/InventoryMovements/${id}`, data);
        return response.data;
    },

    /**
     * Delete an inventory movement
     */
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/InventoryMovements/${id}`);
    },
};
