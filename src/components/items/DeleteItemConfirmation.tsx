import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

interface DeleteItemConfirmationProps {
    itemId: number;
    itemName?: string;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const DeleteItemConfirmation: React.FC<DeleteItemConfirmationProps> = ({
    itemId,
    itemName,
    onConfirm,
    onCancel,
    loading = false,
}) => {
    return (
        <div className="space-y-6 py-4">
            {/* Warning Icon */}
            <div className="flex justify-center">
                <div className="rounded-full bg-destructive/10 p-4">
                    <AlertTriangle className="h-12 w-12 text-destructive" />
                </div>
            </div>

            {/* Title and Description */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">¿Eliminar Artículo?</h2>
                <p className="text-muted-foreground">
                    Esta acción no se puede deshacer. El artículo será eliminado permanentemente.
                </p>
            </div>

            {/* Item Info */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-1">
                <p className="text-sm text-muted-foreground">ID del Artículo</p>
                <p className="font-semibold text-lg">{itemId}</p>
                {itemName && (
                    <>
                        <p className="text-sm text-muted-foreground mt-2">Nombre</p>
                        <p className="font-medium">{itemName}</p>
                    </>
                )}
            </div>

            {/* Warning Message */}
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                <p className="text-sm text-destructive font-medium">
                    ⚠️ Advertencia: Esta acción eliminará permanentemente este artículo del sistema.
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    variant="destructive"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? 'Eliminando...' : 'Eliminar Artículo'}
                </Button>
            </div>
        </div>
    );
};

export default DeleteItemConfirmation;
