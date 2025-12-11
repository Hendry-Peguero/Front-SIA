import React from 'react';
import { InventoryMovementDto } from '../../types/inventory.types';
import { ItemInformationDto } from '../../types/item.types';
import { formatDate, formatNumber, getMovementTypeColor, getMovementTypeLabel } from '../../utils/formatters';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MovementTableProps {
    movements: InventoryMovementDto[];
    items?: ItemInformationDto[];
    onView: (movement: InventoryMovementDto) => void;
    loading?: boolean;
}

const MovementTable: React.FC<MovementTableProps> = ({
    movements,
    items = [],
    onView,
    loading = false,
}) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    // Helper function to get item name by ID
    const getItemName = (itemId: number): string => {
        const item = items.find(i => i.iteM_ID === itemId);
        return item ? item.itemName : `ID: ${itemId}`;
    };

    // Calculate pagination
    const totalPages = Math.ceil(movements.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMovements = movements.slice(startIndex, endIndex);

    // Reset to page 1 when movements change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [movements.length]);

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
        <div className="space-y-4">
            {/* Mobile View: Cards */}
            <div className="sm:hidden space-y-2 w-full overflow-x-hidden">
                {currentMovements.map((movement) => (
                    <Card key={movement.movement_ID} className="p-3 w-full">
                        <div className="space-y-2">
                            {/* Header Row: ID + Badge + Actions */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        ID: {movement.movement_ID}
                                    </span>
                                    <span
                                        className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border",
                                            getMovementTypeColor(movement.movement_Type)
                                        )}
                                    >
                                        {getMovementTypeLabel(movement.movement_Type)}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => onView(movement)} className="h-6 w-6 p-0">
                                        <Eye className="h-3 w-3" />
                                    </Button>

                                </div>
                            </div>

                            {/* Two Column Layout */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                {/* Left Column */}
                                <div className="space-y-1">
                                    <div>
                                        <span className="text-muted-foreground text-[10px]">Producto: </span>
                                        <span className="font-medium text-primary">{getItemName(movement.iteM_ID)}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground text-[10px]">Fecha: </span>
                                        <span className="font-medium">{formatDate(movement.movement_Date)}</span>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-1">
                                    <div>
                                        <span className="text-muted-foreground text-[10px]">Cantidad: </span>
                                        <span className="font-medium text-primary">{formatNumber(movement.quantity)}</span>
                                    </div>

                                </div>

                                {/* Full Width - Reason */}
                                <div className="col-span-2 pt-0">
                                    <div className="flex gap-1">
                                        <span className="text-muted-foreground text-[10px] whitespace-nowrap">Razón:</span>
                                        <span className="font-medium line-clamp-1">{movement.reason || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden sm:block rounded-md border overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="p-2 text-left text-xs font-medium">ID</th>
                            <th className="p-2 text-left text-xs font-medium">Producto</th>
                            <th className="p-2 text-left text-xs font-medium">Tipo</th>
                            <th className="p-2 text-right text-xs font-medium">Cantidad</th>
                            <th className="p-2 text-left text-xs font-medium">Fecha</th>
                            <th className="p-2 text-left text-xs font-medium">Razón</th>

                            <th className="p-2 text-center text-xs font-medium">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentMovements.map((movement) => (
                            <tr key={movement.movement_ID} className="border-b hover:bg-muted/30 transition-colors">
                                <td className="p-2 text-xs font-medium">{movement.movement_ID}</td>
                                <td className="p-2 text-xs font-medium">{getItemName(movement.iteM_ID)}</td>
                                <td className="p-2">
                                    <span
                                        className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border",
                                            getMovementTypeColor(movement.movement_Type)
                                        )}
                                    >
                                        {getMovementTypeLabel(movement.movement_Type)}
                                    </span>
                                </td>
                                <td className="p-2 text-xs text-right font-mono">
                                    {formatNumber(movement.quantity)}
                                </td>
                                <td className="p-2 text-xs">{formatDate(movement.movement_Date)}</td>
                                <td className="p-2 text-xs text-muted-foreground max-w-xs truncate">
                                    {movement.reason || '-'}
                                </td>

                                <td className="p-2">
                                    <div className="flex items-center justify-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onView(movement)}
                                            title="Ver detalles"
                                            className="h-7 w-7 p-0"
                                        >
                                            <Eye className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-3 border-t">
                    <div className="text-sm text-muted-foreground">
                        Mostrando {startIndex + 1} a {Math.min(endIndex, movements.length)} de {movements.length} movimientos
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0"
                            title="Primera página"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0"
                            title="Página anterior"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="text-sm font-medium px-3">
                            Página {currentPage} de {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 p-0"
                            title="Página siguiente"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 p-0"
                            title="Última página"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovementTable;
