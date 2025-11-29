import React from 'react';
import { Button } from '../ui/button';
import { AlertCircle } from 'lucide-react';

interface DeleteConfirmationProps {
    movementId: number;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
    movementId,
    onConfirm,
    onCancel,
    loading = false,
}) => {
    return (
        <div className="space-y-4">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-lg">¿Eliminar movimiento?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Estás a punto de eliminar el movimiento <span className="font-mono font-semibold">#{movementId}</span>.
                        Esta acción no se puede deshacer.
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? 'Eliminando...' : 'Eliminar'}
                </Button>
            </div>
        </div>
    );
};

export default DeleteConfirmation;
