import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { InventoryMovementDto, InventoryMovementSaveDto } from '../types/inventory.types';
import { inventoryApi } from '../api/inventoryApi';
import { useToast } from './ToastContext';

interface InventoryContextType {
    movements: InventoryMovementDto[];
    loading: boolean;
    error: string | null;
    fetchMovements: () => Promise<void>;
    createMovement: (data: InventoryMovementSaveDto) => Promise<void>;
    updateMovement: (id: number, data: InventoryMovementSaveDto) => Promise<void>;
    deleteMovement: (id: number) => Promise<void>;
    getMovementById: (id: number) => Promise<InventoryMovementDto | undefined>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [movements, setMovements] = useState<InventoryMovementDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { addToast } = useToast();

    const fetchMovements = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await inventoryApi.getAll();
            setMovements(data);
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Error al cargar movimientos';
            setError(msg);
            addToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const createMovement = useCallback(async (data: InventoryMovementSaveDto) => {
        setLoading(true);
        try {
            const newMovement = await inventoryApi.create(data);
            setMovements((prev) => [newMovement, ...prev]);
            addToast('Movimiento creado exitosamente', 'success');
        } catch (err: any) {
            console.error('Error creating movement:', err);
            console.error('Error response:', err.response);
            console.error('Error data:', err.response?.data);
            const msg = err.response?.data?.message || err.message || 'Error al crear movimiento';
            addToast(msg, 'error');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const updateMovement = useCallback(async (id: number, data: InventoryMovementSaveDto) => {
        setLoading(true);
        try {
            const updatedMovement = await inventoryApi.update(id, data);
            setMovements((prev) => prev.map((m) => (m.movementId === id ? updatedMovement : m)));
            addToast('Movimiento actualizado exitosamente', 'success');
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Error al actualizar movimiento';
            addToast(msg, 'error');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const deleteMovement = useCallback(async (id: number) => {
        setLoading(true);
        try {
            await inventoryApi.delete(id);
            setMovements((prev) => prev.filter((m) => m.movementId !== id));
            addToast('Movimiento eliminado exitosamente', 'success');
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Error al eliminar movimiento';
            addToast(msg, 'error');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const getMovementById = useCallback(async (id: number) => {
        // First try to find in local state
        const existing = movements.find((m) => m.movementId === id);
        if (existing) return existing;

        // If not found, fetch from API
        setLoading(true);
        try {
            const movement = await inventoryApi.getById(id);
            return movement;
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Error al obtener movimiento';
            addToast(msg, 'error');
            return undefined;
        } finally {
            setLoading(false);
        }
    }, [movements, addToast]);

    // Initial fetch
    useEffect(() => {
        fetchMovements();
    }, [fetchMovements]);

    return (
        <InventoryContext.Provider
            value={{
                movements,
                loading,
                error,
                fetchMovements,
                createMovement,
                updateMovement,
                deleteMovement,
                getMovementById,
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
};
