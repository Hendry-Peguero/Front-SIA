import apiClient from './axiosConfig';

/**
 * Warehouse API Client
 * Base URL: /api/WareHouse
 */

/**
 * WarehouseDto - Response type from API
 */
export interface WarehouseDto {
    warehouseID: number;
    warehouseName: string;
    warehouseAddress: string;
}

/**
 * Get all warehouses
 */
export const getWarehouses = async (): Promise<WarehouseDto[]> => {
    const response = await apiClient.get<WarehouseDto[]>('/WareHouse');
    return response.data;
};
