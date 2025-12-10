import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { InventoryMovementDto, InventoryMovementSaveDto, AdjustInventoryDto } from '../types/inventory.types';
import { inventoryApi } from '../api/inventoryApi';
import { useToast } from './ToastContext';

interface InventoryContextType {
    movements: InventoryMovementDto[];
    loading: boolean;
    error: string | null;
    fetchMovements: () => Promise<void>;
    createMovement: (data: InventoryMovementSaveDto) => Promise<void>;
    adjustInventory: (data: AdjustInventoryDto) => Promise<void>;
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

    const adjustInventory = useCallback(async (data: AdjustInventoryDto) => {
        setLoading(true);
        console.log('🚀 Sending payload to /adjust-inventory:', JSON.stringify(data, null, 2));
        try {
            await inventoryApi.adjustInventory(data);
            // Since the endpoint doesn't return the created movement, we should fetch list again or just notify
            // User requirement said "response body: { message: ... }"
            // Ideally we re-fetch movements to show the new one
            await fetchMovements();
            addToast('Inventario ajustado correctamente', 'success');
        } catch (err: any) {
            console.error('Error adjusting inventory:', err);
            // Check for 'error' field specifically as per user report, fallback to 'message' or generic
            const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Error al ajustar inventario';
            addToast(msg, 'error');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [addToast, fetchMovements]);

    const updateMovement = useCallback(async (id: number, data: InventoryMovementSaveDto) => {
        setLoading(true);
        try {
            const updatedMovement = await inventoryApi.update(id, data);
            setMovements((prev) => prev.map((m) => (m.movement_ID === id ? updatedMovement : m)));
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
            setMovements((prev) => prev.filter((m) => m.movement_ID !== id));
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
        const existing = movements.find((m) => m.movement_ID === id);
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
                adjustInventory,
                updateMovement,
                deleteMovement,
                getMovementById,
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
};
