import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ItemInformationDto, SaveItemInformationDto } from '../types/item.types';
import * as itemApi from '../api/itemApi';
import { useToast } from './ToastContext';

interface ItemContextType {
    items: ItemInformationDto[];
    loading: boolean;
    error: string | null;
    fetchItems: () => Promise<void>;
    createItem: (data: SaveItemInformationDto) => Promise<void>;
    updateItem: (id: number, data: SaveItemInformationDto) => Promise<void>;
    deleteItem: (id: number) => Promise<void>;
    getItemById: (id: number) => Promise<ItemInformationDto | undefined>;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const useItems = () => {
    const context = useContext(ItemContext);
    if (!context) {
        throw new Error('useItems must be used within an ItemProvider');
    }
    return context;
};

export const ItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<ItemInformationDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { addToast } = useToast();

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await itemApi.getItems();
            setItems(data);
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Error al cargar artículos';
            setError(msg);
            addToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const createItem = useCallback(async (data: SaveItemInformationDto) => {
        setLoading(true);
        try {
            const newItem = await itemApi.createItem(data);
            setItems((prev) => [newItem, ...prev]);
            addToast('Artículo creado exitosamente', 'success');
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Error al crear artículo';
            addToast(msg, 'error');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const updateItem = useCallback(async (id: number, data: SaveItemInformationDto) => {
        setLoading(true);
        try {
            const updatedItem = await itemApi.updateItem(id, data);
            setItems((prev) => prev.map((item) => (item.itemId === id ? updatedItem : item)));
            addToast('Artículo actualizado exitosamente', 'success');
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Error al actualizar artículo';
            addToast(msg, 'error');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const deleteItem = useCallback(async (id: number) => {
        setLoading(true);
        try {
            await itemApi.deleteItem(id);
            setItems((prev) => prev.filter((item) => item.itemId !== id));
            addToast('Artículo eliminado exitosamente', 'success');
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Error al eliminar artículo';
            addToast(msg, 'error');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const getItemById = useCallback(async (id: number) => {
        // First try to find in local state
        const existing = items.find((item) => item.itemId === id);
        if (existing) return existing;

        // If not found, fetch from API
        setLoading(true);
        try {
            const item = await itemApi.getItemById(id);
            return item;
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Error al obtener artículo';
            addToast(msg, 'error');
            return undefined;
        } finally {
            setLoading(false);
        }
    }, [items, addToast]);

    // Initial fetch
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return (
        <ItemContext.Provider
            value={{
                items,
                loading,
                error,
                fetchItems,
                createItem,
                updateItem,
                deleteItem,
                getItemById,
            }}
        >
            {children}
        </ItemContext.Provider>
    );
};
