/**
 * Movement type enum - corresponds to backend values
 */
export type MovementType = 'entrada' | 'salida' | 'ajuste';

/**
 * InventoryMovementDto - Response type (from API)
 * Used for displaying existing movements
 */
export interface InventoryMovementDto {
    movementId: number;
    itemId: number;
    movementType: string;
    quantity: number;
    movementDate: string; // ISO 8601 DateTime
    reason?: string | null;
    createdBy: number;
}

/**
 * InventoryMovementSaveDto - Request type (to API)
 * Used for creating and updating movements
 */
export interface InventoryMovementSaveDto {
    itemId: number;
    movementType: string;
    quantity: number;
    movementDate: string; // ISO 8601 DateTime
    reason?: string | null;
    createdBy: number;
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
