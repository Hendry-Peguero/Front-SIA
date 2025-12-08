import apiClient from './axiosConfig';

/**
 * ItemGroup API Client
 * Base URL: /api/ItemGruop (note: backend has typo "Gruop" instead of "Group")
 */

/**
 * ItemGroupDto - Response type from API
 */
export interface ItemGroupDto {
    grouP_ID: number;
    grouP_NAME: string;
}

/**
 * SaveItemGroupDto - Request type for create/update (for future use)
 */
export interface SaveItemGroupDto {
    grouP_ID: number;
    grouP_NAME: string;
}

/**
 * Get all item groups
 */
export const getItemGroups = async (): Promise<ItemGroupDto[]> => {
    const response = await apiClient.get<ItemGroupDto[]>('/ItemGruop');
    return response.data;
};

/**
 * Get item group by ID (stub for future backend implementation)
 */
export const getItemGroupById = async (id: number): Promise<ItemGroupDto> => {
    const response = await apiClient.get<ItemGroupDto>(`/ItemGruop/${id}`);
    return response.data;
};

/**
 * Create a new item group (stub for future backend implementation)
 */
export const createItemGroup = async (data: SaveItemGroupDto): Promise<ItemGroupDto> => {
    const response = await apiClient.post<ItemGroupDto>('/ItemGruop', data);
    return response.data;
};

/**
 * Update an existing item group (stub for future backend implementation)
 */
export const updateItemGroup = async (
    id: number,
    data: SaveItemGroupDto
): Promise<ItemGroupDto> => {
    const response = await apiClient.put<ItemGroupDto>(`/ItemGruop/${id}`, data);
    return response.data;
};

/**
 * Delete an item group (stub for future backend implementation)
 */
export const deleteItemGroup = async (id: number): Promise<void> => {
    await apiClient.delete(`/ItemGruop/${id}`);
};
