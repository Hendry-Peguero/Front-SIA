import { z } from 'zod';

export const movementSchema = z.object({
    itemId: z.coerce
        .number({ invalid_type_error: "El ID del producto debe ser un número" })
        .int("El ID debe ser un número entero")
        .positive("El ID del producto debe ser positivo"),

    movementType: z.string()
        .min(1, "El tipo de movimiento es requerido")
        .refine(
            (val) => ["entrada", "salida"].includes(val.toLowerCase()),
            "Tipo de movimiento inválido. Debe ser: Entrada o Salida"
        ),

    quantity: z.coerce
        .number({ invalid_type_error: "La cantidad debe ser un número" })
        .positive("La cantidad debe ser mayor a 0"),

    movementDate: z.string()
        .min(1, "La fecha es requerida")
        .or(z.date()),

    reason: z.string()
        .max(500, "La razón no puede exceder los 500 caracteres")
        .optional()
        .nullable(),
});

export type MovementFormValues = z.infer<typeof movementSchema>;
