import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { movementSchema, type MovementFormValues } from '../../utils/validators';
import { InventoryMovementDto, InventoryMovementSaveDto, AdjustInventoryDto } from '../../types/inventory.types';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { format } from 'date-fns';
import { getItems, getItemByBarcode } from '../../api/itemApi';
import { ItemInformationDto } from '../../types/item.types';
import { useToast } from '../../context/ToastContext';
import { Scan } from 'lucide-react';

interface MovementFormProps {
    // onSubmit can receive either SaveDto (for edits) or AdjustInventoryDto (for new entries)
    onSubmit: (data: any) => Promise<void>;
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
    const [selectedItemObj, setSelectedItemObj] = React.useState<ItemInformationDto | null>(null);
    const [loadingItems, setLoadingItems] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showDropdown, setShowDropdown] = React.useState(false);
    const searchContainerRef = React.useRef<HTMLDivElement>(null);

    // Handle click outside to close dropdown
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
            item.iteM_ID.toString().includes(searchTerm) ||
            item.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.barcode2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.barcode3?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [items, searchTerm]);

    const handleItemSelect = (item: ItemInformationDto) => {
        setSearchTerm(item.itemName);
        setShowDropdown(false);
        setValue('itemId', item.iteM_ID);
        setSelectedItemObj(item);
    };

    const handleBarcodeSearch = async (barcode: string) => {
        if (!barcode.trim()) return;

        try {
            const item = await getItemByBarcode(barcode);
            if (item && item.iteM_ID) {
                handleItemSelect(item);
                addToast('Producto encontrado', 'success');
                setSearchTerm(item.itemName); // Update input with item name
            } else {
                addToast('Producto no encontrado con este código de barras', 'error');
            }
        } catch (error) {
            console.error('Error searching by barcode:', error);
            // Don't show error toast for every simple search attempt (optional UX decision)
            // or perform a name filter fallback here if desired
            addToast('Producto no encontrado', 'error');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            // Try barcode search primarily on Enter
            handleBarcodeSearch(searchTerm);
        }
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
                itemId: initialData.iteM_ID,
                movementType: initialData.movement_Type as 'entrada' | 'salida' | 'ajuste',
                quantity: initialData.quantity,
                movementDate: format(new Date(initialData.movement_Date), "yyyy-MM-dd'T'HH:mm"),
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

        if (!selectedItemObj && !initialData) {
            // Try to find the item in local list if not explicitly selected but ID is present (e.g. typed)
            const found = items.find(i => i.iteM_ID === Number(data.itemId));
            if (!found) {
                console.error('No item object found to retrieve warehouseID');
                addToast('Por favor, selecciona un producto válido de la lista.', 'error');
                return;
            }
            setSelectedItemObj(found);
        }

        // Determine if creating (Adjust) or Updating
        if (!initialData) {
            // New Movement -> Use AdjustInventoryDto
            const itemToUse = selectedItemObj || items.find(i => i.iteM_ID === Number(data.itemId));

            if (!itemToUse) {
                addToast('Error interno: No se pudo obtener información del producto (WarehouseID)', 'error');
                return;
            }

            const adjustDto: AdjustInventoryDto = {
                iteM_ID: Number(data.itemId),
                movement_Type: data.movementType, // "Entrada" or "Salida"
                quantity: Number(data.quantity),
                warehouseID: itemToUse.warehouseID,
                shelF_ID: 1, // Fixed value as per requirement
                createdBy: userId,
                reason: data.reason || "null"
            };
            console.log('Submitting ADJUST data:', adjustDto);
            await onSubmit(adjustDto);

        } else {
            // Edit -> Use InventoryMovementSaveDto (Legacy/Standard)
            const saveDto: InventoryMovementSaveDto = {
                iteM_ID: Number(data.itemId),
                movement_Type: data.movementType,
                quantity: Number(data.quantity),
                movement_Date: new Date(data.movementDate as string).toISOString(),
                reason: data.reason || "null",
                createdBy: userId,
            };

            console.log('Submitting UPDATE data:', saveDto);
            await onSubmit(saveDto);
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="grid gap-4">
                <div className="space-y-4">
                    {/* Unified Item Search */}
                    <div className="space-y-2" ref={searchContainerRef}>
                        <Label htmlFor="itemSearch">
                            Producto / Código de Barras <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative flex gap-2">
                            <Input
                                id="itemSearch"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setShowDropdown(true)}
                                placeholder="Escanear código o buscar por nombre..."
                                disabled={loading || loadingItems}
                                className="flex-1"
                                autoComplete="off"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => handleBarcodeSearch(searchTerm)}
                                disabled={loading || !searchTerm}
                                title="Buscar por código de barras"
                            >
                                <Scan className="h-4 w-4" />
                            </Button>

                            <input type="hidden" {...register('itemId')} />

                            {showDropdown && searchTerm && filteredItems.length > 0 && (
                                <div className="absolute z-10 w-full top-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                                    {filteredItems.slice(0, 50).map((item) => (
                                        <div
                                            key={item.iteM_ID}
                                            onClick={() => handleItemSelect(item)}
                                            className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground border-b last:border-0"
                                        >
                                            <div className="font-medium">{item.itemName}</div>
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>ID: {item.iteM_ID}</span>
                                                <span>Stock: {item.barcode}</span>
                                            </div>
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
                        <option value="Entrada">Entrada</option>
                        <option value="Salida">Salida</option>
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
        </form >
    );
};

export default MovementForm;
