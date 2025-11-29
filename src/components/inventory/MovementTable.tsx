import React from 'react';
import { InventoryMovementDto } from '../../types/inventory.types';
import { formatDate, formatNumber, getMovementTypeColor, getMovementTypeLabel } from '../../utils/formatters';
import { Button } from '../ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MovementTableProps {
    movements: InventoryMovementDto[];
    onEdit: (movement: InventoryMovementDto) => void;
    onDelete: (movementId: number) => void;
    onView: (movement: InventoryMovementDto) => void;
    loading?: boolean;
}

const MovementTable: React.FC<MovementTableProps> = ({
    movements,
    onEdit,
    onDelete,
    onView,
    loading = false,
}) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (movements.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <p className="text-muted-foreground mb-2">No hay movimientos registrados</p>
                <p className="text-sm text-muted-foreground">
                    Crea un nuevo movimiento para comenzar
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left text-sm font-medium">ID</th>
                        <th className="p-3 text-left text-sm font-medium">Producto ID</th>
                        <th className="p-3 text-left text-sm font-medium">Tipo</th>
                        <th className="p-3 text-right text-sm font-medium">Cantidad</th>
                        <th className="p-3 text-left text-sm font-medium">Fecha</th>
                        <th className="p-3 text-left text-sm font-medium">Razón</th>
                        <th className="p-3 text-left text-sm font-medium">Creado por</th>
                        <th className="p-3 text-center text-sm font-medium">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {movements.map((movement) => (
                        <tr key={movement.movementId} className="border-b hover:bg-muted/30 transition-colors">
                            <td className="p-3 text-sm font-medium">{movement.movementId}</td>
                            <td className="p-3 text-sm">{movement.itemId}</td>
                            <td className="p-3">
                                <span
                                    className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                        getMovementTypeColor(movement.movementType)
                                    )}
                                >
                                    {getMovementTypeLabel(movement.movementType)}
                                </span>
                            </td>
                            <td className="p-3 text-sm text-right font-mono">
                                {formatNumber(movement.quantity)}
                            </td>
                            <td className="p-3 text-sm">{formatDate(movement.movementDate)}</td>
                            <td className="p-3 text-sm text-muted-foreground">
                                {movement.reason || '-'}
                            </td>
                            <td className="p-3 text-sm">{movement.createdBy}</td>
                            <td className="p-3">
                                <div className="flex items-center justify-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onView(movement)}
                                        title="Ver detalles"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(movement)}
                                        title="Editar"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(movement.movementId)}
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
    );
};

export default MovementTable;
