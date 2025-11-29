import { useInventory } from '../context/InventoryContext';

/**
 * Custom hook to access inventory movements and operations
 * Re-exports the context hook for consistency
 */
export const useInventoryMovements = () => {
    return useInventory();
};
