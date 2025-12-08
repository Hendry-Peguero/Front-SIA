/**
 * ItemInformationDto - Response type from API
 * Used for displaying existing items
 */
export interface ItemInformationDto {
    iteM_ID: number;
    itemName: string;
    unitOfMeasure: string;
    batch: string;
    grouP_ID: number;
    barcode: string;
    cost: number;
    price: number;
    price2: number;
    price3: number;
    reorderPoint: number;
    vaT_Applicable: string;
    warehouseID: number;
    photoFileName: string;
    barcode2: string;
    barcode3: string;
    comment: string;
    vaT_ID: number;
    allowDecimal: boolean;
    margen: number;
}

/**
 * SaveItemInformationDto - Request type to API
 * Used for creating and updating items
 */
export interface SaveItemInformationDto {
    itemName: string; // max 200
    unitOfMeasure: string; // max 200
    batch: string; // max 200
    grouP_ID: number;
    barcode: string; // max 200
    cost: number;
    price: number;
    price2: number;
    price3: number;
    reorderPoint: number;
    vaT_Applicable: string; // max 10
    warehouseID: number;
    photoFileName: string; // max 200
    barcode2: string; // max 255
    barcode3: string; // max 255
    comment: string;
    vaT_ID: number;
    allowDecimal: boolean;
    margen: number;
}

/**
 * ItemFormValues - Form data type (matches react-hook-form structure)
 */
export interface ItemFormValues {
    itemName: string;
    unitOfMeasure?: string;
    batch?: string;
    groupId?: number;
    barcode?: string;
    autoGenerateBarcode?: boolean; // Frontend-only field
    cost?: number;
    price?: number;
    price2?: number;
    price3?: number;
    reorderPoint?: number;
    vatApplicable?: boolean;
    warehouseId?: number;
    photoFileName?: string;
    barcode2?: string;
    barcode3?: string;
    comment?: string;
    vatId?: number;
    allowDecimal?: boolean;
    margen?: number;
}
