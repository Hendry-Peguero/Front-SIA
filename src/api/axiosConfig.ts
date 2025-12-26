import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Get API base URL from environment variables or current hostname
const getApiBaseUrl = () => {
    // Si hay variable de entorno, úsala
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // En desarrollo, usar path relativo para que funcione el proxy de Vite
    if (import.meta.env.DEV) {
        return '/api';
    }

    // En producción o red local, intentar determinar la URL
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5037/api';
    }

    return `http://${window.location.hostname}:5037/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Log API configuration on initialization
console.log('🔧 Axios Config - API Base URL:', API_BASE_URL);

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Request interceptor - Add JWT token to all requests
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors and token expiration
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle common errors
        if (error.response) {
            const status = error.response.status;
            const errorData = error.response.data as { message?: string };

            // Log error for debugging
            console.error('❌ API Error:', {
                status,
                url: error.config?.url,
                method: error.config?.method,
                data: errorData
            });

            // Handle different status codes
            switch (status) {
                case 400:
                    // Bad Request - Invalid data sent
                    showToast('Datos inválidos.  Por favor verifica la información.', 'error');
                    break;

                case 401:
                    // Unauthorized - Token expired or invalid
                    console.warn('⚠️ Authentication failed - redirecting to login');
                    showToast('Sesión expirada. Por favor inicia sesión nuevamente.', 'error');
                    // Clear user data
                    localStorage.removeItem('token');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userId');
                    // Redirect to login
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1500);
                    break;

                case 403:
                    // Forbidden - User doesn't have permissions
                    showToast('No tienes permisos para realizar esta acción.', 'error');
                    break;

                case 404:
                    // Not Found - Resource doesn't exist
                    showToast('Recurso no encontrado.', 'error');
                    break;

                case 500:
                case 502:
                case 503:
                    // Server Error
                    showToast('Error del servidor. Por favor intenta nuevamente más tarde.', 'error');
                    break;

                default:
                    // Generic error
                    const message = errorData?.message || 'Ha ocurrido un error inesperado.';
                    showToast(message, 'error');
            }
        } else if (error.request) {
            // Request made but no response
            console.error('❌ Network Error: No response from server');
            showToast('Error de conexión. Verifica tu conexión a internet.', 'error');
        } else {
            // Something else happened
            console.error('❌ Error:', error.message);
            showToast('Error inesperado. Por favor intenta nuevamente.', 'error');
        }

        return Promise.reject(error);
    }
);

/**
 * Helper function to show toasts
 * This function safely interacts with the Toast system
 */
function showToast(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    // Try to dispatch custom event that ToastContext can listen to
    const event = new CustomEvent('showToast', {
        detail: { message, type }
    });
    window.dispatchEvent(event);
}

export default apiClient;

