import { z } from 'zod';

/**
 * Zod schema for item form validation
 */
export const itemSchema = z.object({
    itemName: z
        .string()
        .min(1, 'El nombre del artículo es requerido')
        .max(200, 'El nombre no puede exceder 200 caracteres'),

    unitOfMeasure: z
        .string()
        .min(1, 'La unidad de medida es requerida')
        .max(200, 'La unidad no puede exceder 200 caracteres'),

    batch: z
        .string()
        .max(200, 'El lote no puede exceder 200 caracteres')
        .optional()
        .default(''),

    groupId: z
        .number()
        .int('El ID del grupo debe ser un número entero')
        .min(0, 'El ID del grupo debe ser mayor o igual a 0'),

    barcode: z
        .string()
        .max(200, 'El código de barras no puede exceder 200 caracteres')
        .optional()
        .default(''),

    autoGenerateBarcode: z
        .boolean()
        .default(false),

    cost: z
        .number()
        .min(0, 'El costo debe ser mayor o igual a 0'),

    price: z
        .number()
        .min(0, 'El precio debe ser mayor o igual a 0'),

    price2: z
        .number()
        .min(0, 'El precio 2 debe ser mayor o igual a 0')
        .default(0),

    price3: z
        .number()
        .min(0, 'El precio 3 debe ser mayor o igual a 0')
        .default(0),

    reorderPoint: z
        .number()
        .min(0, 'El punto de pedido debe ser mayor o igual a 0')
        .default(0),

    vatApplicable: z
        .string()
        .max(10, 'VAT aplicable no puede exceder 10 caracteres')
        .default(''),

    warehouseId: z
        .number()
        .int('El ID del almacén debe ser un número entero')
        .min(0, 'El ID del almacén debe ser mayor o igual a 0'),

    photoFileName: z
        .string()
        .max(200, 'El nombre del archivo no puede exceder 200 caracteres')
        .default(''),

    barcode2: z
        .string()
        .max(255, 'El código de barras 2 no puede exceder 255 caracteres')
        .default(''),

    barcode3: z
        .string()
        .max(255, 'El código de barras 3 no puede exceder 255 caracteres')
        .default(''),

    comment: z
        .string()
        .default(''),

    vatId: z
        .number()
        .int('El ID del VAT debe ser un número entero')
        .min(0, 'El ID del VAT debe ser mayor o igual a 0')
        .default(0),

    allowDecimal: z
        .boolean()
        .default(false),

    margen: z
        .number()
        .min(0, 'El margen debe ser mayor o igual a 0')
        .max(100, 'El margen no puede exceder 100%')
        .default(0),
}).refine(
    (data) => data.price >= data.cost,
    {
        message: 'El precio de venta debe ser mayor o igual al costo',
        path: ['price'],
    }
);
