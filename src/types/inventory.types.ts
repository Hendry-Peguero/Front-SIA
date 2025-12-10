/**
 * Movement type enum - corresponds to backend values
 */
export type MovementType = 'Entrada' | 'Salida'; // Updated to Capitalized as per request

/**
 * InventoryMovementDto - Response type (from API)
 * Used for displaying existing movements
 */
export interface InventoryMovementDto {
    movement_ID: number;
    iteM_ID: number;
    movement_Type: string;
    quantity: number;
    movement_Date: string; // ISO 8601 DateTime
    reason?: string | null;
    createdBy: number;
}

/**
 * InventoryMovementSaveDto - Request type (to API)
 * Used for creating and updating movements
 */
export interface InventoryMovementSaveDto {
    iteM_ID: number;
    movement_Type: string;
    quantity: number;
    movement_Date: string; // ISO 8601 DateTime
    reason?: string | null;
    createdBy: number;
}

/**
 * AdjustInventoryDto - New Request type for adjustment endpoint
 */
export interface AdjustInventoryDto {
    iteM_ID: number;
    movement_Type: string; // "Entrada" | "Salida"
    quantity: number;
    warehouseID: number;
    shelF_ID: number;
    createdBy: number;
    reason?: string | null;
}

/**
 * Form data type - matches the form structure
 */
export interface MovementFormData {
    itemId: number;
    movementType: MovementType;
    quantity: number;
    movementDate: Date;
    reason?: string;
    createdBy: number;
}
