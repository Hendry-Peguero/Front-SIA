import { z } from 'zod';

export const movementSchema = z.object({
    itemId: z.coerce
        .number({ invalid_type_error: "El ID del producto debe ser un número" })
        .int("El ID debe ser un número entero")
        .positive("El ID del producto debe ser positivo"),

    movementType: z.string()
        .min(1, "El tipo de movimiento es requerido")
        .refine(
            (val) => ["entrada", "salida", "ajuste"].includes(val.toLowerCase()),
            "Tipo de movimiento inválido. Debe ser: entrada, salida o ajuste"
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

    createdBy: z.coerce
        .number({ invalid_type_error: "El ID de usuario debe ser un número" })
        .int("El ID de usuario debe ser un entero")
        .positive("El ID de usuario debe ser positivo"),
});

export type MovementFormValues = z.infer<typeof movementSchema>;
