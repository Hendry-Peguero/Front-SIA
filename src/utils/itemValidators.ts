import { z } from 'zod';

/**
 * Zod schema for item form validation
 * "All fields can be null except name"
 */
export const itemSchema = z.object({
    itemName: z
        .string()
        .min(1, 'El nombre del artículo es requerido')
        .max(200, 'El nombre no puede exceder 200 caracteres'),

    unitOfMeasure: z
        .string()
        .max(200, 'La unidad no puede exceder 200 caracteres')
        .optional()
        .default(''),

    batch: z
        .string()
        .max(200, 'El lote no puede exceder 200 caracteres')
        .optional()
        .default(''),

    groupId: z
        .number()
        .int()
        .min(0)
        .optional()
        .default(0),

    barcode: z
        .string()
        .max(200, 'El código de barras no puede exceder 200 caracteres')
        .optional()
        .default(''),

    autoGenerateBarcode: z
        .boolean()
        .optional()
        .default(false),

    cost: z
        .number()
        .min(0)
        .optional()
        .default(0),

    price: z
        .number()
        .min(0)
        .optional()
        .default(0),

    price2: z
        .number()
        .min(0)
        .optional()
        .default(0),

    price3: z
        .number()
        .min(0)
        .optional()
        .default(0),

    reorderPoint: z
        .number()
        .min(0)
        .optional()
        .default(0),

    vatApplicable: z
        .boolean()
        .optional()
        .default(false),

    warehouseId: z
        .number()
        .int()
        .min(0)
        .optional()
        .default(0),

    photoFileName: z
        .string()
        .max(200)
        .optional()
        .default(''),

    barcode2: z
        .string()
        .max(255)
        .optional()
        .default(''),

    barcode3: z
        .string()
        .max(255)
        .optional()
        .default(''),

    comment: z
        .string()
        .optional()
        .default(''),

    vatId: z
        .number()
        .int()
        .min(0)
        .optional()
        .default(0),

    allowDecimal: z
        .boolean()
        .optional()
        .default(false),

    margen: z
        .number()
        .min(0)
        .optional()
        .default(0),
});
// Removed .refine(price >= cost) to strictly follow "all optional" request if cost is 0 and price is 0
