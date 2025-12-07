import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { itemSchema } from '../../utils/itemValidators';
import { ItemInformationDto, SaveItemInformationDto, ItemFormValues } from '../../types/item.types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Modal } from '../ui/modal';
import { Scan } from 'lucide-react';
import BarcodeScanner from './BarcodeScanner';
import { ALMACENES_MOCK, UNIDADES_MEDIDA_MOCK } from '../../data/mockData';
import { getItemGroups, ItemGroupDto } from '../../api/itemGroupApi';
import { getVats, VatDto } from '../../api/vatApi';
import { useToast } from '../../context/ToastContext';

interface ItemFormProps {
    onSubmit: (data: SaveItemInformationDto) => Promise<void>;
    onCancel: () => void;
    initialData?: ItemInformationDto;
    loading?: boolean;
}

const ItemForm: React.FC<ItemFormProps> = ({
    onSubmit,
    onCancel,
    initialData,
    loading = false,
}) => {
    const [showScanner, setShowScanner] = useState(false);
    const [scanningField, setScanningField] = useState<'barcode' | 'barcode2' | 'barcode3'>('barcode');
    const [groups, setGroups] = useState<ItemGroupDto[]>([]);
    const [vats, setVats] = useState<VatDto[]>([]);
    const [catalogsLoading, setCatalogsLoading] = useState(true);
    const { addToast } = useToast();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ItemFormValues>({
        resolver: zodResolver(itemSchema),
        defaultValues: initialData
            ? {
                ...initialData,
                autoGenerateBarcode: false,
            }
            : {
                itemName: '',
                unitOfMeasure: '',
                batch: '',
                groupId: 0,
                barcode: '',
                autoGenerateBarcode: false,
                cost: 0,
                price: 0,
                price2: 0,
                price3: 0,
                reorderPoint: 0,
                vatApplicable: '',
                warehouseId: 0,
                photoFileName: '',
                barcode2: '',
                barcode3: '',
                comment: '',
                vatId: 0,
                allowDecimal: false,
                margen: 0,
            },
    });

    // Load catalogs from API
    useEffect(() => {
        const loadCatalogs = async () => {
            try {
                setCatalogsLoading(true);
                const [groupsData, vatsData] = await Promise.all([
                    getItemGroups(),
                    getVats(),
                ]);
                setGroups(groupsData);
                setVats(vatsData);
            } catch (error: any) {
                console.error('Error al cargar catálogos:', error);
                addToast('Error al cargar grupos e impuestos', 'error');
            } finally {
                setCatalogsLoading(false);
            }
        };

        loadCatalogs();
    }, [addToast]);

    // Watch cost and margen to auto-calculate price
    const cost = watch('cost');
    const margen = watch('margen');
    const autoGenerateBarcode = watch('autoGenerateBarcode');

    // Auto-calculate price when cost or margen changes
    useEffect(() => {
        if (cost >= 0 && margen != null && margen >= 0) {
            const calculatedPrice = cost * (1 + margen / 100);
            setValue('price', Number(calculatedPrice.toFixed(2)));
        }
    }, [cost, margen, setValue]);

    // Auto-generate barcode if checkbox is checked
    useEffect(() => {
        if (autoGenerateBarcode && !initialData) {
            const generatedBarcode = `BAR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            setValue('barcode', generatedBarcode);
        }
    }, [autoGenerateBarcode, initialData, setValue]);

    const onFormSubmit = async (data: ItemFormValues) => {
        // Remove the autoGenerateBarcode field before sending to API
        const { autoGenerateBarcode: _, ...saveDto } = data;
        await onSubmit(saveDto as SaveItemInformationDto);
    };

    const handleScan = (barcode: string) => {
        setValue(scanningField, barcode);
        setShowScanner(false);
    };

    const openScanner = (field: 'barcode' | 'barcode2' | 'barcode3') => {
        setScanningField(field);
        setShowScanner(true);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Sección: Información Básica */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Información del Artículo</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombre del artículo */}
                    <div className="space-y-2">
                        <Label htmlFor="itemName">
                            Nombre del artículo <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="itemName"
                            {...register('itemName')}
                            placeholder="Ej: Funda para celular"
                            disabled={loading}
                        />
                        {errors.itemName && (
                            <p className="text-sm text-destructive">{errors.itemName.message}</p>
                        )}
                    </div>

                    {/* Unidad */}
                    <div className="space-y-2">
                        <Label htmlFor="unitOfMeasure">
                            Unidad <span className="text-destructive">*</span>
                        </Label>
                        <select
                            id="unitOfMeasure"
                            {...register('unitOfMeasure')}
                            disabled={loading}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Seleccionar unidad...</option>
                            {UNIDADES_MEDIDA_MOCK.map((unidad) => (
                                <option key={unidad} value={unidad}>
                                    {unidad}
                                </option>
                            ))}
                        </select>
                        {errors.unitOfMeasure && (
                            <p className="text-sm text-destructive">{errors.unitOfMeasure.message}</p>
                        )}
                    </div>

                    {/* Nombre del grupo */}
                    <div className="space-y-2">
                        <Label htmlFor="groupId">
                            Nombre del grupo <span className="text-destructive">*</span>
                        </Label>
                        <select
                            id="groupId"
                            {...register('groupId', { valueAsNumber: true })}
                            disabled={loading || catalogsLoading}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">
                                {catalogsLoading ? 'Cargando...' : 'Seleccionar grupo...'}
                            </option>
                            {groups.map((group) => (
                                <option key={group.GROUP_ID} value={group.GROUP_ID}>
                                    {group.GROUP_NAME}
                                </option>
                            ))}
                        </select>
                        {errors.groupId && (
                            <p className="text-sm text-destructive">{errors.groupId.message}</p>
                        )}
                    </div>

                    {/* Lote */}
                    <div className="space-y-2">
                        <Label htmlFor="batch">Lote</Label>
                        <Input
                            id="batch"
                            {...register('batch')}
                            placeholder="Ej: LOTE-2024-001"
                            disabled={loading}
                        />
                        {errors.batch && (
                            <p className="text-sm text-destructive">{errors.batch.message}</p>
                        )}
                    </div>

                    {/* Código de barras */}
                    <div className="space-y-2">
                        <Label htmlFor="barcode">Código de barras</Label>
                        <div className="flex gap-2">
                            <Input
                                id="barcode"
                                {...register('barcode')}
                                placeholder="Código principal"
                                disabled={loading || autoGenerateBarcode}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => openScanner('barcode')}
                                disabled={loading || autoGenerateBarcode}
                                title="Escanear código de barras"
                            >
                                <Scan className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="autoGenerateBarcode"
                                {...register('autoGenerateBarcode')}
                                className="rounded"
                                disabled={loading}
                            />
                            <label htmlFor="autoGenerateBarcode" className="text-sm text-muted-foreground">
                                Generar automáticamente código de barras
                            </label>
                        </div>
                        {errors.barcode && (
                            <p className="text-sm text-destructive">{errors.barcode.message}</p>
                        )}
                    </div>

                    {/* Código de Barra 2 */}
                    <div className="space-y-2">
                        <Label htmlFor="barcode2">Código de Barra 2</Label>
                        <div className="flex gap-2">
                            <Input
                                id="barcode2"
                                {...register('barcode2')}
                                placeholder="Código alternativo 1"
                                disabled={loading}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => openScanner('barcode2')}
                                disabled={loading}
                                title="Escanear código de barras 2"
                            >
                                <Scan className="h-4 w-4" />
                            </Button>
                        </div>
                        {errors.barcode2 && (
                            <p className="text-sm text-destructive">{errors.barcode2.message}</p>
                        )}
                    </div>

                    {/* Código de Barra 3 */}
                    <div className="space-y-2">
                        <Label htmlFor="barcode3">Código de Barra 3</Label>
                        <div className="flex gap-2">
                            <Input
                                id="barcode3"
                                {...register('barcode3')}
                                placeholder="Código alternativo 2"
                                disabled={loading}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => openScanner('barcode3')}
                                disabled={loading}
                                title="Escanear código de barras 3"
                            >
                                <Scan className="h-4 w-4" />
                            </Button>
                        </div>
                        {errors.barcode3 && (
                            <p className="text-sm text-destructive">{errors.barcode3.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Sección: Precios y Costos */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Precios y Costos</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Costo de la compra */}
                    <div className="space-y-2">
                        <Label htmlFor="cost">
                            Costo de la compra <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="cost"
                            type="number"
                            step="0.01"
                            {...register('cost', { valueAsNumber: true })}
                            placeholder="0.00"
                            disabled={loading}
                        />
                        {errors.cost && (
                            <p className="text-sm text-destructive">{errors.cost.message}</p>
                        )}
                    </div>

                    {/* Precio de venta (auto-calculado) */}
                    <div className="space-y-2">
                        <Label htmlFor="price">
                            Precio de venta <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            {...register('price', { valueAsNumber: true })}
                            placeholder="0.00"
                            disabled={loading}
                            className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">Auto-calculado desde costo + margen</p>
                        {errors.price && (
                            <p className="text-sm text-destructive">{errors.price.message}</p>
                        )}
                    </div>

                    {/* Margen % */}
                    <div className="space-y-2">
                        <Label htmlFor="margen">
                            Margen % <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="margen"
                            type="number"
                            step="0.01"
                            {...register('margen', { valueAsNumber: true })}
                            placeholder="0.00"
                            disabled={loading}
                        />
                        {errors.margen && (
                            <p className="text-sm text-destructive">{errors.margen.message}</p>
                        )}
                    </div>

                    {/* Precio 2 */}
                    <div className="space-y-2">
                        <Label htmlFor="price2">Precio 2</Label>
                        <Input
                            id="price2"
                            type="number"
                            step="0.01"
                            {...register('price2', { valueAsNumber: true })}
                            placeholder="0.00"
                            disabled={loading}
                        />
                        {errors.price2 && (
                            <p className="text-sm text-destructive">{errors.price2.message}</p>
                        )}
                    </div>

                    {/* Precio 3 */}
                    <div className="space-y-2">
                        <Label htmlFor="price3">Precio 3</Label>
                        <Input
                            id="price3"
                            type="number"
                            step="0.01"
                            {...register('price3', { valueAsNumber: true })}
                            placeholder="0.00"
                            disabled={loading}
                        />
                        {errors.price3 && (
                            <p className="text-sm text-destructive">{errors.price3.message}</p>
                        )}
                    </div>

                    {/* Punto de pedido */}
                    <div className="space-y-2">
                        <Label htmlFor="reorderPoint">Punto de pedido</Label>
                        <Input
                            id="reorderPoint"
                            type="number"
                            {...register('reorderPoint', { valueAsNumber: true })}
                            placeholder="0"
                            disabled={loading}
                        />
                        {errors.reorderPoint && (
                            <p className="text-sm text-destructive">{errors.reorderPoint.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Sección: Configuración */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Configuración</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Almacén por defecto */}
                    <div className="space-y-2">
                        <Label htmlFor="warehouseId">
                            Almacén por defecto <span className="text-destructive">*</span>
                        </Label>
                        <select
                            id="warehouseId"
                            {...register('warehouseId', { valueAsNumber: true })}
                            disabled={loading}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Seleccionar almacén...</option>
                            {ALMACENES_MOCK.map((almacen) => (
                                <option key={almacen.id} value={almacen.id}>
                                    {almacen.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.warehouseId && (
                            <p className="text-sm text-destructive">{errors.warehouseId.message}</p>
                        )}
                    </div>

                    {/* ITBIS (VAT Aplicable) */}
                    <div className="space-y-2">
                        <Label htmlFor="vatApplicable">ITBIS</Label>
                        <Input
                            id="vatApplicable"
                            {...register('vatApplicable')}
                            placeholder="Ej: EXENTO"
                            disabled={loading}
                        />
                        {errors.vatApplicable && (
                            <p className="text-sm text-destructive">{errors.vatApplicable.message}</p>
                        )}
                    </div>

                    {/* VAT */}
                    <div className="space-y-2">
                        <Label htmlFor="vatId">VAT</Label>
                        <select
                            id="vatId"
                            {...register('vatId', { valueAsNumber: true })}
                            disabled={loading || catalogsLoading}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">
                                {catalogsLoading ? 'Cargando...' : 'Seleccionar VAT...'}
                            </option>
                            {vats.map((vat) => (
                                <option key={vat.ID} value={vat.ID}>
                                    {vat.Descripcion} ({vat.Vat}%)
                                </option>
                            ))}
                        </select>
                        {errors.vatId && (
                            <p className="text-sm text-destructive">{errors.vatId.message}</p>
                        )}
                    </div>

                    {/* Puede Fraccionar */}
                    <div className="flex items-center space-x-2 pt-8">
                        <input
                            type="checkbox"
                            id="allowDecimal"
                            {...register('allowDecimal')}
                            className="rounded"
                            disabled={loading}
                        />
                        <label htmlFor="allowDecimal" className="text-sm">
                            Puede Fraccionar
                        </label>
                    </div>
                </div>
            </div>

            {/* Sección: Observaciones */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Observacion</h3>

                <div className="space-y-2">
                    <textarea
                        id="comment"
                        {...register('comment')}
                        placeholder="Ingrese cualquier observación adicional..."
                        disabled={loading}
                        rows={4}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                    {errors.comment && (
                        <p className="text-sm text-destructive">{errors.comment.message}</p>
                    )}
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Guardar'}
                </Button>
            </div>

            {/* Barcode Scanner Modal */}
            <Modal
                isOpen={showScanner}
                onClose={() => setShowScanner(false)}
                title="Escanear Código de Barras"
            >
                <BarcodeScanner
                    onScan={handleScan}
                    onClose={() => setShowScanner(false)}
                />
            </Modal>
        </form>
    );
};

export default ItemForm;
