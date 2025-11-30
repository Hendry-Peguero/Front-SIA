import React from 'react';
import { InventoryMovementDto } from '../../types/inventory.types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatDate, formatNumber, getMovementTypeColor, getMovementTypeLabel } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { Package, Calendar, FileText, Hash } from 'lucide-react';

interface MovementDetailProps {
    movement: InventoryMovementDto;
}

const MovementDetail: React.FC<MovementDetailProps> = ({ movement }) => {
    const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({
        icon,
        label,
        value,
    }) => (
        <div className="flex items-start gap-3 py-3 border-b last:border-0">
            <div className="mt-0.5 text-muted-foreground">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 text-base">{value}</p>
            </div>
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Detalle del Movimiento #{movement.movementId}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    <DetailRow
                        icon={<Hash className="h-5 w-5" />}
                        label="ID del Movimiento"
                        value={movement.movementId}
                    />

                    <DetailRow
                        icon={<Package className="h-5 w-5" />}
                        label="ID del Producto"
                        value={movement.itemId}
                    />

                    <DetailRow
                        icon={<FileText className="h-5 w-5" />}
                        label="Tipo de Movimiento"
                        value={
                            <span
                                className={cn(
                                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
                                    getMovementTypeColor(movement.movementType)
                                )}
                            >
                                {getMovementTypeLabel(movement.movementType)}
                            </span>
                        }
                    />

                    <DetailRow
                        icon={<Hash className="h-5 w-5" />}
                        label="Cantidad"
                        value={<span className="font-mono font-semibold text-lg">{formatNumber(movement.quantity)}</span>}
                    />

                    <DetailRow
                        icon={<Calendar className="h-5 w-5" />}
                        label="Fecha del Movimiento"
                        value={formatDate(movement.movementDate)}
                    />

                    <DetailRow
                        icon={<FileText className="h-5 w-5" />}
                        label="Razón"
                        value={movement.reason || <span className="text-muted-foreground italic">Sin razón especificada</span>}
                    />


                </div>
            </CardContent>
        </Card>
    );
};

export default MovementDetail;
