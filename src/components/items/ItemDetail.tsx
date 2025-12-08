import React from 'react';
import { ItemInformationDto } from '../../types/item.types';
import { X, Package, DollarSign, Barcode, Warehouse } from 'lucide-react';
import { Button } from '../ui/button';
import { GRUPOS_MOCK, ALMACENES_MOCK, VAT_MOCK } from '../../data/mockData';

interface ItemDetailProps {
    item: ItemInformationDto;
    onClose?: () => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ item, onClose }) => {
    // Helper functions to get names from IDs
    const getGroupName = (groupId: number) => {
        const group = GRUPOS_MOCK.find(g => g.id === groupId);
        return group ? group.nombre : `Grupo ${groupId}`;
    };

    const getWarehouseName = (warehouseId: number) => {
        const warehouse = ALMACENES_MOCK.find(w => w.id === warehouseId);
        return warehouse ? warehouse.nombre : `Almacén ${warehouseId}`;
    };

    const getVATName = (vatId: number) => {
        const vat = VAT_MOCK.find(v => v.id === vatId);
        return vat ? `${vat.nombre} (${vat.tasa}%)` : `VAT ${vatId}`;
    };
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-4">
                <div>
                    <h2 className="text-2xl font-bold">{item.itemName}</h2>
                    <p className="text-muted-foreground">ID: {item.iteM_ID}</p>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Información Básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                    <div>
                        <p className="text-sm text-muted-foreground">Nombre</p>
                        <p className="font-medium">{item.itemName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Unidad de Medida</p>
                        <p className="font-medium">{item.unitOfMeasure}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Lote</p>
                        <p className="font-medium">{item.batch || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Grupo</p>
                        <p className="font-medium">{getGroupName(item.grouP_ID)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Permite Decimales</p>
                        <p className="font-medium">{item.allowDecimal ? 'Sí' : 'No'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Punto de Pedido</p>
                        <p className="font-medium">{item.reorderPoint}</p>
                    </div>
                </div>
            </div>

            {/* Códigos de Barras */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Barcode className="h-5 w-5" />
                    Códigos de Barras
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Principal</p>
                        <code className="text-sm font-mono bg-background px-2 py-1 rounded block">
                            {item.barcode || 'N/A'}
                        </code>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Alternativo 1</p>
                        <code className="text-sm font-mono bg-background px-2 py-1 rounded block">
                            {item.barcode2 || 'N/A'}
                        </code>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Alternativo 2</p>
                        <code className="text-sm font-mono bg-background px-2 py-1 rounded block">
                            {item.barcode3 || 'N/A'}
                        </code>
                    </div>
                </div>
            </div>

            {/* Precios */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Precios y Costos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Costo</p>
                        <p className="text-xl font-bold">${item.cost.toFixed(2)}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Margen</p>
                        <p className="text-xl font-bold text-primary">{item.margen.toFixed(2)}%</p>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary">
                        <p className="text-sm text-muted-foreground mb-1">Precio Venta</p>
                        <p className="text-xl font-bold text-primary">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Precio 2</p>
                        <p className="text-xl font-bold">${item.price2.toFixed(2)}</p>
                    </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg w-full md:w-1/4">
                    <p className="text-sm text-muted-foreground mb-1">Precio 3</p>
                    <p className="text-xl font-bold">${item.price3.toFixed(2)}</p>
                </div>
            </div>

            {/* Configuración de Almacén y VAT */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Warehouse className="h-5 w-5" />
                    Almacén y VAT
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/50 p-4 rounded-lg">
                    <div>
                        <p className="text-sm text-muted-foreground">Almacén</p>
                        <p className="font-medium">{getWarehouseName(item.warehouseID)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">VAT</p>
                        <p className="font-medium">{getVATName(item.vaT_ID)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">ITBIS</p>
                        <p className="font-medium">{item.vaT_Applicable || 'N/A'}</p>
                    </div>
                </div>
            </div>

            {/* Observaciones */}
            {item.comment && (
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Observaciones</h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{item.comment}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetail;
