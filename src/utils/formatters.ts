import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Format a date string or object to a readable string
 * @param date Date string or object
 * @param formatStr Format string (default: 'dd/MM/yyyy HH:mm')
 */
export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy HH:mm'): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr, { locale: es });
};

/**
 * Format a number as currency (if needed) or just with decimals
 */
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('es-DO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(num);
};

/**
 * Get color class for movement type
 */
export const getMovementTypeColor = (type: string): string => {
    const normalizedType = type.toLowerCase();
    switch (normalizedType) {
        case 'entrada':
            return 'text-emerald-600 bg-emerald-100 border-emerald-200';
        case 'salida':
            return 'text-red-600 bg-red-100 border-red-200';
        case 'ajuste':
            return 'text-amber-600 bg-amber-100 border-amber-200';
        default:
            return 'text-gray-600 bg-gray-100 border-gray-200';
    }
};

/**
 * Get label for movement type
 */
export const getMovementTypeLabel = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
};
