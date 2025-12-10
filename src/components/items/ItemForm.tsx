import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronDown, Save, Scan, X } from 'lucide-react';
import BarcodeScanner from './BarcodeScanner';
import { itemSchema } from '../../utils/itemValidators';
import { ItemInformationDto, SaveItemInformationDto, ItemFormValues } from '../../types/item.types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Modal } from '../ui/modal';
import { UNIDADES_MEDIDA_MOCK } from '../../data/mockData';
import { getItemGroups, ItemGroupDto, createItemGroup } from '../../api/itemGroupApi';
import { getVats, VatDto } from '../../api/vatApi';
import { getWarehouses, WarehouseDto } from '../../api/warehouseApi';
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
    const [warehouses, setWarehouses] = useState<WarehouseDto[]>([]);
    const [catalogsLoading, setCatalogsLoading] = useState(true);
    const [groupSearchText, setGroupSearchText] = useState(''); // State for custom group input
    const [unitSearchText, setUnitSearchText] = useState(''); // State for custom unit input
    const [warehouseSearchText, setWarehouseSearchText] = useState(''); // State for custom warehouse input
    const [showGroupDropdown, setShowGroupDropdown] = useState(false);
    const [showUnitDropdown, setShowUnitDropdown] = useState(false);
    const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
    const [vatSearchText, setVatSearchText] = useState(''); // State for custom vat input
    const [showVatDropdown, setShowVatDropdown] = useState(false);
    const groupRef = useRef<HTMLDivElement>(null);
    const unitRef = useRef<HTMLDivElement>(null);
    const warehouseRef = useRef<HTMLDivElement>(null);
    const vatRef = useRef<HTMLDivElement>(null);
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
            ? (() => {
                console.log('Raw Initial Data:', initialData);
                const vatApp = initialData.vaT_Applicable;
                // Check if it's true, 1, "1", "true", or "Y" (case insensitive)
                const isVatTrue = vatApp === true || vatApp === 1 || String(vatApp) === "1" || String(vatApp).toLowerCase() === "true" || String(vatApp).toUpperCase() === "Y";
                console.log('Parsed VAT Applicable:', { raw: vatApp, isTrue: isVatTrue });

                return {
                    ...initialData,
                    groupId: initialData.grouP_ID,
                    vatApplicable: isVatTrue,
                    warehouseId: initialData.warehouseID,
                    vatId: Number(initialData.vaT_ID),
                    allowDecimal: (initialData.allowDecimal as any) === true || (initialData.allowDecimal as any) === 1 || (initialData.allowDecimal as any) === "true" || (initialData.allowDecimal as any) === "1",
                    autoGenerateBarcode: false,
                };
            })()
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
                vatApplicable: false, // Default to boolean false
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
                const [groupsData, vatsData, warehousesData] = await Promise.all([
                    getItemGroups(),
                    getVats(),
                    getWarehouses(),
                ]);
                setGroups(groupsData);
                setVats(vatsData);
                setWarehouses(warehousesData);
            } catch (error: any) {
                console.error('Error al cargar catálogos:', error);
                addToast('Error al cargar grupos e impuestos', 'error');
            } finally {
                setCatalogsLoading(false);
            }
        };

        loadCatalogs();
    }, [addToast]);

    // Handle clicks outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (groupRef.current && !groupRef.current.contains(event.target as Node)) {
                setShowGroupDropdown(false);
            }
            if (unitRef.current && !unitRef.current.contains(event.target as Node)) {
                setShowUnitDropdown(false);
            }
            if (warehouseRef.current && !warehouseRef.current.contains(event.target as Node)) {
                setShowWarehouseDropdown(false);
            }
            if (vatRef.current && !vatRef.current.contains(event.target as Node)) {
                setShowVatDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Initialize search texts
    useEffect(() => {
        if (initialData) {
            if (initialData.grouP_ID && groups.length > 0) {
                const group = groups.find(g => g.grouP_ID === initialData.grouP_ID);
                if (group) {
                    setGroupSearchText(group.grouP_NAME);
                }
            }
            if (initialData.warehouseID && warehouses.length > 0) {
                const wh = warehouses.find(w => w.warehouseID === initialData.warehouseID);
                if (wh) {
                    setWarehouseSearchText(wh.warehouseName);
                }
            }
            if (initialData.unitOfMeasure) {
                setUnitSearchText(initialData.unitOfMeasure);
            }
            if (initialData.vaT_ID && vats.length > 0) {
                const vat = vats.find(v => v.id === Number(initialData.vaT_ID));
                if (vat) {
                    setVatSearchText(`${vat.descripcion} (${vat.vat}%)`);
                }
            }
        }
    }, [initialData, groups, warehouses, vats]);

    // Update group ID when search text changes
    const handleGroupSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setGroupSearchText(text);
        setShowGroupDropdown(true);

        const existingGroup = groups.find(g => g.grouP_NAME.toLowerCase() === text.toLowerCase());
        if (existingGroup) {
            setValue('groupId', existingGroup.grouP_ID);
        } else {
            setValue('groupId', 0); // Reset to 0 if new/not found
        }
    };

    const handleGroupSelect = (group: ItemGroupDto) => {
        setGroupSearchText(group.grouP_NAME);
        setValue('groupId', group.grouP_ID);
        setShowGroupDropdown(false);
    };

    // Update unit when search text changes
    const handleUnitSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setUnitSearchText(text);
        setValue('unitOfMeasure', text); // Directly set the value as it's a string field
        setShowUnitDropdown(true);
    };

    const handleUnitSelect = (unit: string) => {
        setUnitSearchText(unit);
        setValue('unitOfMeasure', unit);
        setShowUnitDropdown(false);
    };

    // Update warehouse ID when search text changes
    const handleWarehouseSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setWarehouseSearchText(text);
        setShowWarehouseDropdown(true);

        const existing = warehouses.find(w => w.warehouseName.toLowerCase() === text.toLowerCase());
        if (existing) {
            setValue('warehouseId', existing.warehouseID);
        } else {
            setValue('warehouseId', 0);
        }
    };

    const handleWarehouseSelect = (wh: WarehouseDto) => {
        setWarehouseSearchText(wh.warehouseName);
        setValue('warehouseId', wh.warehouseID);
        setShowWarehouseDropdown(false);
    };

    // Update vat ID when search text changes
    const handleVatSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setVatSearchText(text);
        setShowVatDropdown(true);

        const existing = vats.find(v => v.descripcion.toLowerCase() === text.toLowerCase());
        if (existing) {
            setValue('vatId', existing.id);
        } else {
            setValue('vatId', 0);
        }
    };

    const handleVatSelect = (vat: VatDto) => {
        setVatSearchText(`${vat.descripcion} (${vat.vat}%)`);
        setValue('vatId', vat.id);
        setShowVatDropdown(false);
    };

    // Watch cost and margen to auto-calculate price
    const cost = watch('cost');
    const margen = watch('margen');
    const autoGenerateBarcode = watch('autoGenerateBarcode');

    // Auto-calculate price when cost or margen changes
    useEffect(() => {
        const currentCost = cost || 0;
        const currentMargen = margen || 0;

        if (currentCost >= 0 && currentMargen >= 0) {
            const calculatedPrice = currentCost * (1 + currentMargen / 100);
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
        // Handle Group Auto-Creation
        let finalGroupId = data.groupId;
        if ((!finalGroupId || finalGroupId === 0) && groupSearchText.trim()) {
            try {
                // Double check if it exists (case insensitive) just in case
                const existing = groups.find(g => g.grouP_NAME.toLowerCase() === groupSearchText.trim().toLowerCase());

                if (existing) {
                    finalGroupId = existing.grouP_ID;
                } else {
                    // Create new group on the fly
                    console.log(`Creating new group: ${groupSearchText}`);
                    const newGroup = await createItemGroup({
                        grouP_ID: 0,
                        grouP_NAME: groupSearchText.trim()
                    });
                    finalGroupId = newGroup.grouP_ID;
                    // Optimistically update list (optional, but good UX)
                    setGroups(prev => [...prev, newGroup]);
                    addToast(`Grupo "${newGroup.grouP_NAME}" creado automáticamente`, 'success');
                }
            } catch (error) {
                console.error('Error creating group:', error);
                addToast('Error al crear el nuevo grupo', 'error');
                return; // Stop submission on error
            }
        }

        const saveDto: SaveItemInformationDto = {
            itemName: data.itemName,
            unitOfMeasure: data.unitOfMeasure || '',
            cost: data.cost || 0,
            price: data.price || 0,
            batch: data.batch || '',
            grouP_ID: finalGroupId || 0,
            barcode: data.barcode || '',
            reorderPoint: data.reorderPoint || 0,
            vaT_Applicable: data.vatApplicable ? "Y" : "N", // Convert boolean to "Y"/"N"
            warehouseID: data.warehouseId || 0,
            photoFileName: data.photoFileName || '',
            barcode2: data.barcode2 || '',
            barcode3: data.barcode3 || '',
            comment: data.comment || '',
            vaT_ID: data.vatId || 0,
            allowDecimal: data.allowDecimal || false,
            margen: data.margen || 0,
            price2: data.price2 || 0,
            price3: data.price3 || 0,
        };

        await onSubmit(saveDto);
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

                    {/* Unidad (Editable Combobox) */}
                    <div className="space-y-2" ref={unitRef}>
                        <Label htmlFor="unitOfMeasure">
                            Unidad
                        </Label>
                        <div className="relative">
                            <Input
                                id="unitOfMeasure"
                                value={unitSearchText}
                                onChange={handleUnitSearchChange}
                                onFocus={() => setShowUnitDropdown(true)}
                                placeholder="Escribir o seleccionar unidad..."
                                disabled={loading}
                                className="pr-10"
                                autoComplete="off"
                            />
                            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50 pointer-events-none" />

                            {showUnitDropdown && (
                                <div className="absolute z-10 w-full bg-popover text-popover-foreground border rounded-md shadow-md mt-1 max-h-60 overflow-auto">
                                    {UNIDADES_MEDIDA_MOCK.filter(u =>
                                        u.toLowerCase().includes(unitSearchText.toLowerCase())
                                    ).map((unidad) => (
                                        <div
                                            key={unidad}
                                            onClick={() => handleUnitSelect(unidad)}
                                            className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm"
                                        >
                                            {unidad}
                                        </div>
                                    ))}
                                    {UNIDADES_MEDIDA_MOCK.filter(u =>
                                        u.toLowerCase().includes(unitSearchText.toLowerCase())
                                    ).length === 0 && (
                                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                                Usar "{unitSearchText}"
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                        {/* Hidden input to ensure form validation works if needed, mainly relying on setValue though */}
                        <input type="hidden" {...register('unitOfMeasure')} />

                        {errors.unitOfMeasure && (
                            <p className="text-sm text-destructive">{errors.unitOfMeasure.message}</p>
                        )}
                    </div>

                    {/* Nombre del grupo (Editable Combobox) */}
                    <div className="space-y-2" ref={groupRef}>
                        <Label htmlFor="groupId">
                            Nombre del grupo
                        </Label>
                        <div className="relative">
                            <Input
                                id="groupId-search"
                                value={groupSearchText}
                                onChange={handleGroupSearchChange}
                                onFocus={() => setShowGroupDropdown(true)}
                                placeholder="Seleccionar o escribir grupo..."
                                disabled={loading || catalogsLoading}
                                className="pr-10"
                                autoComplete="off"
                            />
                            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50 pointer-events-none" />

                            {showGroupDropdown && (
                                <div className="absolute z-10 w-full bg-popover text-popover-foreground border rounded-md shadow-md mt-1 max-h-60 overflow-auto">
                                    {groups.filter(g =>
                                        g.grouP_NAME.toLowerCase().includes(groupSearchText.toLowerCase())
                                    ).map((group) => (
                                        <div
                                            key={group.grouP_ID}
                                            onClick={() => handleGroupSelect(group)}
                                            className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm"
                                        >
                                            {group.grouP_NAME}
                                        </div>
                                    ))}
                                    {groups.filter(g =>
                                        g.grouP_NAME.toLowerCase().includes(groupSearchText.toLowerCase())
                                    ).length === 0 && groupSearchText && (
                                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                                Crear nuevo: "{groupSearchText}"
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                        {/* Hidden input to hold the actual numeric ID for validation/form state */}
                        <input type="hidden" {...register('groupId', { valueAsNumber: true })} />

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
                    {/* Left Column: Cost, Margin, Reorder */}
                    <div className="space-y-4">
                        {/* Costo de la compra */}
                        <div className="space-y-2">
                            <Label htmlFor="cost">
                                Costo de la compra
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

                        {/* Margen % */}
                        <div className="space-y-2">
                            <Label htmlFor="margen">
                                Margen %
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

                    {/* Right Column: Price 1, Price 2, Price 3 */}
                    <div className="space-y-4">
                        {/* Precio de venta (auto-calculado) */}
                        <div className="space-y-2">
                            <Label htmlFor="price">
                                Precio de venta
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
                    </div>
                </div>
            </div>

            {/* Sección: Configuración */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Configuración</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Almacén por defecto (Editable Combobox) */}
                    <div className="space-y-2" ref={warehouseRef}>
                        <Label htmlFor="warehouseId">
                            Almacén por defecto
                        </Label>
                        <div className="relative">
                            <Input
                                id="warehouseId"
                                value={warehouseSearchText}
                                onChange={handleWarehouseSearchChange}
                                onFocus={() => setShowWarehouseDropdown(true)}
                                placeholder="Seleccionar almacén..."
                                disabled={loading || catalogsLoading}
                                className="pr-10"
                                autoComplete="off"
                            />
                            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50 pointer-events-none" />

                            {showWarehouseDropdown && (
                                <div className="absolute z-10 w-full bg-popover text-popover-foreground border rounded-md shadow-md mt-1 max-h-60 overflow-auto">
                                    {warehouses.filter(w =>
                                        w.warehouseName.toLowerCase().includes(warehouseSearchText.toLowerCase())
                                    ).map((wh) => (
                                        <div
                                            key={wh.warehouseID}
                                            onClick={() => handleWarehouseSelect(wh)}
                                            className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm"
                                        >
                                            {wh.warehouseName}
                                        </div>
                                    ))}
                                    {warehouses.filter(w =>
                                        w.warehouseName.toLowerCase().includes(warehouseSearchText.toLowerCase())
                                    ).length === 0 && (
                                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                                No se encontraron resultados
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                        <input type="hidden" {...register('warehouseId', { valueAsNumber: true })} />
                        {errors.warehouseId && (
                            <p className="text-sm text-destructive">{errors.warehouseId.message}</p>
                        )}
                    </div>

                    {/* VAT (Renamed to ITBIS) - Now Custom Combobox */}
                    <div className="space-y-2" ref={vatRef}>
                        <Label htmlFor="vatId">ITBIS</Label>
                        <div className="relative">
                            <Input
                                id="vatId-search"
                                value={vatSearchText}
                                // Removed onChange to prevent typing
                                readOnly // Strictly prevent typing
                                onClick={() => setShowVatDropdown(!showVatDropdown)} // Toggle on click
                                placeholder="Seleccionar ITBIS..."
                                disabled={loading || catalogsLoading}
                                className="pr-10 cursor-pointer" // Add cursor-pointer
                                autoComplete="off"
                            />
                            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50 pointer-events-none" />

                            {showVatDropdown && (
                                <div className="absolute z-10 w-full bg-popover text-popover-foreground border rounded-md shadow-md mt-1 max-h-60 overflow-auto">
                                    {vats.map((vat) => (
                                        <div
                                            key={vat.id}
                                            onClick={() => handleVatSelect(vat)}
                                            className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm"
                                        >
                                            {vat.descripcion} ({vat.vat}%)
                                        </div>
                                    ))}
                                    {vats.length === 0 && (
                                        <div className="px-3 py-2 text-sm text-muted-foreground">
                                            No se encontraron impuestos
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* Hidden input to hold state */}
                        <input type="hidden" {...register('vatId', { valueAsNumber: true })} />
                        {errors.vatId && (
                            <p className="text-sm text-destructive">{errors.vatId.message}</p>
                        )}
                    </div>

                    {/* Aplica ITBIS? (Checkbox) */}
                    <div className="flex items-center space-x-2 pt-8">
                        <input
                            type="checkbox"
                            id="vatApplicable"
                            {...register('vatApplicable')}
                            className="rounded"
                            disabled={loading}
                        />
                        <label htmlFor="vatApplicable" className="text-sm">
                            Aplica Impuesto
                        </label>
                    </div>

                    {/* Puede Fraccionar (Checkbox) */}
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
