import axios, { AxiosError } from 'axios';

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
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
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
            // Server responded with error status
            console.error('API Error:', error.response.status, error.response.data);

            // Handle 401 Unauthorized - Token expired or invalid
            if (error.response.status === 401) {
                console.warn('Authentication failed - redirecting to login');
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                // Redirect to login page
                window.location.href = '/login';
            }
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error: No response from server');
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
