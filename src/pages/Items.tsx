import React, { useState } from 'react';
import { useItems } from '../context/ItemContext';
import { ItemInformationDto, SaveItemInformationDto } from '../types/item.types';
import ItemTable from '../components/items/ItemTable';
import ItemForm from '../components/items/ItemForm';
import DeleteItemConfirmation from '../components/items/DeleteItemConfirmation';
import ItemDetail from '../components/items/ItemDetail';
import { Modal } from '../components/ui/modal';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';

type ModalState = 'create' | 'edit' | 'delete' | 'view' | null;

const Items: React.FC = () => {
    const { items, loading, createItem, updateItem, deleteItem, fetchItems } = useItems();
    const [modalState, setModalState] = useState<ModalState>(null);
    const [selectedItem, setSelectedItem] = useState<ItemInformationDto | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const handleCreate = () => {
        setSelectedItem(null);
        setModalState('create');
    };

    const handleEdit = (item: ItemInformationDto) => {
        setSelectedItem(item);
        setModalState('edit');
    };

    const handleDelete = (itemId: number) => {
        const item = items.find((i) => i.iteM_ID === itemId);
        if (item) {
            setSelectedItem(item);
            setModalState('delete');
        }
    };

    const handleView = (item: ItemInformationDto) => {
        setSelectedItem(item);
        setModalState('view');
    };

    const handleSubmitCreate = async (data: SaveItemInformationDto) => {
        setActionLoading(true);
        try {
            await createItem(data);
            setModalState(null);
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubmitEdit = async (data: SaveItemInformationDto) => {
        if (!selectedItem) return;
        setActionLoading(true);
        try {
            await updateItem(selectedItem.iteM_ID, data);
            setModalState(null);
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedItem) return;
        setActionLoading(true);
        try {
            await deleteItem(selectedItem.iteM_ID);
            setModalState(null);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCloseModal = () => {
        if (!actionLoading) {
            setModalState(null);
            setSelectedItem(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Artículos</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona el catálogo de artículos del inventario
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fetchItems()}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={handleCreate} className="flex-1 md:flex-none">
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Artículo
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Artículos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ItemTable
                        items={[...items].sort((a, b) => b.iteM_ID - a.iteM_ID)}
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
                title="Nuevo Artículo"
                description="Completa el formulario para agregar un nuevo artículo al inventario"
            >
                <ItemForm
                    onSubmit={handleSubmitCreate}
                    onCancel={handleCloseModal}
                    loading={actionLoading}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={modalState === 'edit'}
                onClose={handleCloseModal}
                title="Editar Artículo"
                description="Modifica los datos del artículo"
            >
                {selectedItem && (
                    <ItemForm
                        onSubmit={handleSubmitEdit}
                        onCancel={handleCloseModal}
                        initialData={selectedItem}
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
                {selectedItem && (
                    <DeleteItemConfirmation
                        itemId={selectedItem.iteM_ID}
                        itemName={selectedItem.itemName}
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
                {selectedItem && <ItemDetail item={selectedItem} onClose={handleCloseModal} />}
            </Modal>
        </div>
    );
};

export default Items;
