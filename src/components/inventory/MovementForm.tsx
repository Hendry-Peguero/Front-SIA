import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { movementSchema, type MovementFormValues } from '../../utils/validators';
import { InventoryMovementDto, InventoryMovementSaveDto } from '../../types/inventory.types';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { format } from 'date-fns';
import { getItems } from '../../api/itemApi';
import { ItemInformationDto } from '../../types/item.types';
import { useToast } from '../../context/ToastContext';

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
    const { userId } = useAuth();
    const { addToast } = useToast();
    const [items, setItems] = React.useState<ItemInformationDto[]>([]);
    const [loadingItems, setLoadingItems] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showDropdown, setShowDropdown] = React.useState(false);

    // Debug: Log userId cuando cambia
    React.useEffect(() => {
        console.log('MovementForm - Current userId:', userId);
        console.log('MovementForm - localStorage userId:', localStorage.getItem('userId'));
        console.log('MovementForm - localStorage token:', localStorage.getItem('token') ? 'EXISTS' : 'NOT FOUND');

        // Debug: Show token payload
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log('🔍 TOKEN PAYLOAD:', payload);
                console.log('Available fields in token:', Object.keys(payload));
            } catch (e) {
                console.error('Failed to decode token:', e);
            }
        }
    }, [userId]);

    React.useEffect(() => {
        const fetchItems = async () => {
            setLoadingItems(true);
            try {
                const data = await getItems();
                setItems(data);
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setLoadingItems(false);
            }
        };
        fetchItems();
    }, []);

    const filteredItems = React.useMemo(() => {
        if (!searchTerm) return items;
        return items.filter(item =>
            item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.itemId.toString().includes(searchTerm)
        );
    }, [items, searchTerm]);

    const handleItemSelect = (item: ItemInformationDto) => {
        setSearchTerm(item.itemName);
        setShowDropdown(false);
        setValue('itemId', item.itemId);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<MovementFormValues>({
        resolver: zodResolver(movementSchema),
        defaultValues: initialData
            ? {
                itemId: initialData.itemId,
                movementType: initialData.movementType,
                quantity: initialData.quantity,
                movementDate: format(new Date(initialData.movementDate), "yyyy-MM-dd'T'HH:mm"),
                reason: initialData.reason || '',
            }
            : {
                movementType: 'entrada',
                quantity: 1,
                movementDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
                reason: '',
            },
    });

    const onFormSubmit = async (data: MovementFormValues) => {
        console.log('Form data received:', data);
        console.log('Current userId:', userId);

        if (!userId) {
            console.error('No user ID available. Please re-login.');
            addToast('No hay usuario autenticado. Por favor, cierra sesión e inicia sesión nuevamente.', 'error');
            return;
        }

        if (!data.itemId || data.itemId === 0) {
            console.error('No item selected');
            addToast('Por favor, selecciona un producto válido.', 'error');
            return;
        }

        const saveDto: InventoryMovementSaveDto = {
            itemId: Number(data.itemId),
            movementType: data.movementType,
            quantity: Number(data.quantity),
            movementDate: new Date(data.movementDate as string).toISOString(),
            reason: data.reason || null,
            createdBy: userId,
        };

        console.log('Submitting movement data:', saveDto);
        await onSubmit(saveDto);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="grid gap-4">
                {/* Item Selection with Search */}
                <div className="space-y-2">
                    <Label htmlFor="itemSearch">
                        Producto <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            id="itemSearch"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
                            placeholder="Buscar producto por nombre o ID..."
                            disabled={loading || loadingItems}
                        />
                        <input type="hidden" {...register('itemId')} />
                        {showDropdown && filteredItems.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                                {filteredItems.map((item) => (
                                    <div
                                        key={item.itemId}
                                        onClick={() => handleItemSelect(item)}
                                        className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <div className="font-medium">{item.itemName}</div>
                                        <div className="text-xs text-muted-foreground">ID: {item.itemId}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {errors.itemId && (
                        <p className="text-sm text-destructive">{errors.itemId.message}</p>
                    )}
                    {items.length === 0 && !loadingItems && (
                        <p className="text-xs text-muted-foreground">
                            No hay productos disponibles. Crea uno primero.
                        </p>
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
