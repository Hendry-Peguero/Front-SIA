import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { InventoryMovementDto, InventoryMovementSaveDto } from '../types/inventory.types';
import MovementTable from '../components/inventory/MovementTable';
import MovementForm from '../components/inventory/MovementForm';
import DeleteConfirmation from '../components/inventory/DeleteConfirmation';
import MovementDetail from '../components/inventory/MovementDetail';
import { Modal } from '../components/ui/modal';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';

type ModalState = 'create' | 'edit' | 'delete' | 'view' | null;

const Movements: React.FC = () => {
    const { movements, loading, createMovement, updateMovement, deleteMovement, fetchMovements } = useInventory();
    const [modalState, setModalState] = useState<ModalState>(null);
    const [selectedMovement, setSelectedMovement] = useState<InventoryMovementDto | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const handleCreate = () => {
        setSelectedMovement(null);
        setModalState('create');
    };

    const handleEdit = (movement: InventoryMovementDto) => {
        setSelectedMovement(movement);
        setModalState('edit');
    };

    const handleDelete = (movementId: number) => {
        const movement = movements.find((m) => m.movement_ID === movementId);
        if (movement) {
            setSelectedMovement(movement);
            setModalState('delete');
        }
    };

    const handleView = (movement: InventoryMovementDto) => {
        setSelectedMovement(movement);
        setModalState('view');
    };

    const handleSubmitCreate = async (data: InventoryMovementSaveDto) => {
        setActionLoading(true);
        try {
            await createMovement(data);
            setModalState(null);
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubmitEdit = async (data: InventoryMovementSaveDto) => {
        if (!selectedMovement) return;
        setActionLoading(true);
        try {
            await updateMovement(selectedMovement.movement_ID, data);
            setModalState(null);
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedMovement) return;
        setActionLoading(true);
        try {
            await deleteMovement(selectedMovement.movement_ID);
            setModalState(null);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCloseModal = () => {
        if (!actionLoading) {
            setModalState(null);
            setSelectedMovement(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Movimientos de Inventario</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona todos los movimientos de inventario
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fetchMovements()}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={handleCreate} className="flex-1 md:flex-none">
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Movimiento
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Movimientos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <MovementTable
                        movements={movements}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                        loading={loading}
                    />
                </CardContent>
            </Card>

            {/* Create Modal */}
            <Modal
                isOpen={modalState === 'create'}
                onClose={handleCloseModal}
                title="Nuevo Movimiento"
                description="Completa el formulario para crear un nuevo movimiento de inventario"
            >
                <MovementForm
                    onSubmit={handleSubmitCreate}
                    onCancel={handleCloseModal}
                    loading={actionLoading}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={modalState === 'edit'}
                onClose={handleCloseModal}
                title="Editar Movimiento"
                description="Modifica los datos del movimiento"
            >
                {selectedMovement && (
                    <MovementForm
                        onSubmit={handleSubmitEdit}
                        onCancel={handleCloseModal}
                        initialData={selectedMovement}
                        loading={actionLoading}
                    />
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={modalState === 'delete'}
                onClose={handleCloseModal}
                title=""
            >
                {selectedMovement && (
                    <DeleteConfirmation
                        movementId={selectedMovement.movement_ID}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCloseModal}
                        loading={actionLoading}
                    />
                )}
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={modalState === 'view'}
                onClose={handleCloseModal}
                title=""
            >
                {selectedMovement && <MovementDetail movement={selectedMovement} />}
            </Modal>
        </div>
    );
};

export default Movements;
