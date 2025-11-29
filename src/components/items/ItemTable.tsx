import React from 'react';
import { ItemInformationDto } from '../../types/item.types';
import { Button } from '../ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { GRUPOS_MOCK } from '../../data/mockData';

interface ItemTableProps {
    items: ItemInformationDto[];
    onEdit: (item: ItemInformationDto) => void;
    onDelete: (itemId: number) => void;
    onView: (item: ItemInformationDto) => void;
    loading?: boolean;
}

const ItemTable: React.FC<ItemTableProps> = ({
    items,
    onEdit,
    onDelete,
    onView,
    loading = false,
}) => {
    // Helper function to get group name
    const getGroupName = (groupId: number) => {
        const group = GRUPOS_MOCK.find(g => g.id === groupId);
        return group ? group.nombre : `Grupo ${groupId}`;
    };
    if (loading && items.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Cargando artículos...</p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-muted-foreground">No hay artículos registrados</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Crea tu primer artículo usando el botón "Nuevo Artículo"
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b">
                        <tr className="text-left">
                            <th className="p-4 font-medium text-muted-foreground">ID</th>
                            <th className="p-4 font-medium text-muted-foreground">Nombre</th>
                            <th className="p-4 font-medium text-muted-foreground">Unidad</th>
                            <th className="p-4 font-medium text-muted-foreground">Código</th>
                            <th className="p-4 font-medium text-muted-foreground">Costo</th>
                            <th className="p-4 font-medium text-muted-foreground">Precio</th>
                            <th className="p-4 font-medium text-muted-foreground">Grupo</th>
                            <th className="p-4 font-medium text-muted-foreground">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.itemId} className="border-b hover:bg-muted/50">
                                <td className="p-4">{item.itemId}</td>
                                <td className="p-4 font-medium">{item.itemName}</td>
                                <td className="p-4">{item.unitOfMeasure}</td>
                                <td className="p-4">
                                    <code className="text-xs bg-muted px-2 py-1 rounded">
                                        {item.barcode || 'N/A'}
                                    </code>
                                </td>
                                <td className="p-4">${item.cost.toFixed(2)}</td>
                                <td className="p-4 font-semibold text-primary">
                                    ${item.price.toFixed(2)}
                                </td>
                                <td className="p-4">{getGroupName(item.groupId)}</td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onView(item)}
                                            title="Ver detalles"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(item)}
                                            title="Editar"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(item.itemId)}
                                            title="Eliminar"
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
                {items.map((item) => (
                    <div
                        key={item.itemId}
                        className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold">{item.itemName}</h3>
                                <p className="text-sm text-muted-foreground">ID: {item.itemId}</p>
                            </div>
                            <span className="text-lg font-bold text-primary">
                                ${item.price.toFixed(2)}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Unidad:</span>
                                <p className="font-medium">{item.unitOfMeasure}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Costo:</span>
                                <p className="font-medium">${item.cost.toFixed(2)}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Código:</span>
                                <p className="font-mono text-xs">
                                    {item.barcode || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Grupo:</span>
                                <p className="font-medium">{getGroupName(item.groupId)}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onView(item)}
                                className="flex-1"
                            >
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(item)}
                                className="flex-1"
                            >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDelete(item.itemId)}
                                className="flex-1 text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Eliminar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ItemTable;
