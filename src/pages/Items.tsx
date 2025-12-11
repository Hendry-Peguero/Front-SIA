import React, { useState, useMemo } from 'react';
import { useItems } from '../context/ItemContext';
import { ItemInformationDto, SaveItemInformationDto } from '../types/item.types';
import ItemTable from '../components/items/ItemTable';
import ItemForm from '../components/items/ItemForm';
import DeleteItemConfirmation from '../components/items/DeleteItemConfirmation';
import ItemDetail from '../components/items/ItemDetail';
import { Modal } from '../components/ui/modal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, RefreshCw, Search } from 'lucide-react';

type ModalState = 'create' | 'edit' | 'delete' | 'view' | null;

const Items: React.FC = () => {
    const { items, loading, createItem, updateItem, deleteItem, fetchItems } = useItems();
    const [modalState, setModalState] = useState<ModalState>(null);
    const [selectedItem, setSelectedItem] = useState<ItemInformationDto | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter items based on search term
    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) {
            return items;
        }

        const searchLower = searchTerm.toLowerCase().trim();
        return items.filter(item =>
            // Search by ID
            item.iteM_ID.toString().includes(searchLower) ||
            // Search by name
            item.itemName.toLowerCase().includes(searchLower) ||
            // Search by barcode
            item.barcode?.toLowerCase().includes(searchLower) ||
            // Search by barcode2
            item.barcode2?.toLowerCase().includes(searchLower) ||
            // Search by barcode3
            item.barcode3?.toLowerCase().includes(searchLower)
        );
    }, [items, searchTerm]);

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

            {/* Search Bar */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Buscar por ID, nombre o código de barras..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    {searchTerm && (
                        <p className="text-sm text-muted-foreground mt-2">
                            {filteredItems.length} {filteredItems.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Artículos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ItemTable
                        items={[...filteredItems].sort((a, b) => b.iteM_ID - a.iteM_ID)}
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
