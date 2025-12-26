import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../utils/cn';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    addToast: (message: string, type: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    // Listen for showToast events from axios interceptor
    React.useEffect(() => {
        const handleShowToast = (event: Event) => {
            const customEvent = event as CustomEvent<{ message: string; type: ToastType }>;
            if (customEvent.detail) {
                addToast(customEvent.detail.message, customEvent.detail.type);
            }
        };

        window.addEventListener('showToast', handleShowToast);
        return () => {
            window.removeEventListener('showToast', handleShowToast);
        };
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType, duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 animate-in slide-in-from-right-full",
                            "min-w-[300px] max-w-md border",
                            toast.type === 'success' && "bg-white border-emerald-200 text-emerald-800",
                            toast.type === 'error' && "bg-white border-red-200 text-red-800",
                            toast.type === 'warning' && "bg-white border-amber-200 text-amber-800",
                            toast.type === 'info' && "bg-white border-blue-200 text-blue-800"
                        )}
                    >
                        {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                        {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-500" />}
                        {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}

                        <p className="flex-1 text-sm font-medium">{toast.message}</p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
