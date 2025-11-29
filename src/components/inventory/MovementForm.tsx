import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { movementSchema, type MovementFormValues } from '../../utils/validators';
import { InventoryMovementDto, InventoryMovementSaveDto } from '../../types/inventory.types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { format } from 'date-fns';

interface MovementFormProps {
    onSubmit: (data: InventoryMovementSaveDto) => Promise<void>;
    onCancel: () => void;
    initialData?: InventoryMovementDto;
    loading?: boolean;
}

const MovementForm: React.FC<MovementFormProps> = ({
    onSubmit,
    onCancel,
    initialData,
    loading = false,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<MovementFormValues>({
        resolver: zodResolver(movementSchema),
        defaultValues: initialData
            ? {
                itemId: initialData.itemId,
                movementType: initialData.movementType,
                quantity: initialData.quantity,
                movementDate: format(new Date(initialData.movementDate), "yyyy-MM-dd'T'HH:mm"),
                reason: initialData.reason || '',
                createdBy: initialData.createdBy,
            }
            : {
                itemId: 0,
                movementType: 'entrada',
                quantity: 0,
                movementDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
                reason: '',
                createdBy: 1,
            },
    });

    const onFormSubmit = async (data: MovementFormValues) => {
        const saveDto: InventoryMovementSaveDto = {
            itemId: Number(data.itemId),
            movementType: data.movementType,
            quantity: Number(data.quantity),
            movementDate: new Date(data.movementDate as string).toISOString(),
            reason: data.reason || null,
            createdBy: Number(data.createdBy),
        };

        await onSubmit(saveDto);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="grid gap-4">
                {/* Item ID */}
                <div className="space-y-2">
                    <Label htmlFor="itemId">
                        ID del Producto <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="itemId"
                        type="number"
                        {...register('itemId')}
                        placeholder="Ejemplo: 1001"
                        disabled={loading}
                    />
                    {errors.itemId && (
                        <p className="text-sm text-destructive">{errors.itemId.message}</p>
                    )}
                </div>

                {/* Movement Type */}
                <div className="space-y-2">
                    <Label htmlFor="movementType">
                        Tipo de Movimiento <span className="text-destructive">*</span>
                    </Label>
                    <select
                        id="movementType"
                        {...register('movementType')}
                        disabled={loading}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="entrada">Entrada</option>
                        <option value="salida">Salida</option>
                        <option value="ajuste">Ajuste</option>
                    </select>
                    {errors.movementType && (
                        <p className="text-sm text-destructive">{errors.movementType.message}</p>
                    )}
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                    <Label htmlFor="quantity">
                        Cantidad <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="quantity"
                        type="number"
                        step="0.01"
                        {...register('quantity')}
                        placeholder="Ejemplo: 50"
                        disabled={loading}
                    />
                    {errors.quantity && (
                        <p className="text-sm text-destructive">{errors.quantity.message}</p>
                    )}
                </div>

                {/* Movement Date */}
                <div className="space-y-2">
                    <Label htmlFor="movementDate">
                        Fecha del Movimiento <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="movementDate"
                        type="datetime-local"
                        {...register('movementDate')}
                        disabled={loading}
                    />
                    {errors.movementDate && (
                        <p className="text-sm text-destructive">{errors.movementDate.message}</p>
                    )}
                </div>

                {/* Reason (Optional) */}
                <div className="space-y-2">
                    <Label htmlFor="reason">Razón (Opcional)</Label>
                    <textarea
                        id="reason"
                        {...register('reason')}
                        placeholder="Ejemplo: Compra a proveedor ABC"
                        disabled={loading}
                        rows={3}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                    {errors.reason && (
                        <p className="text-sm text-destructive">{errors.reason.message}</p>
                    )}
                </div>

                {/* Created By */}
                <div className="space-y-2">
                    <Label htmlFor="createdBy">
                        ID de Usuario <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="createdBy"
                        type="number"
                        {...register('createdBy')}
                        placeholder="Ejemplo: 1"
                        disabled={loading}
                    />
                    {errors.createdBy && (
                        <p className="text-sm text-destructive">{errors.createdBy.message}</p>
                    )}
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
                </Button>
            </div>
        </form>
    );
};

export default MovementForm;
