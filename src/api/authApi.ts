import apiClient from './axiosConfig';
import { LoginRequest, LoginResponse } from '../types/auth.types';

const AUTH_ENDPOINT = '/Users';

export const authApi = {
    /**
     * Login user and get JWT token
     */
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>(
            `${AUTH_ENDPOINT}/login`,
            credentials
        );
        return response.data;
    },

    /**
     * Logout user (client-side only - clear token)
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        // Check if token is expired
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000; // Convert to milliseconds
            return Date.now() < exp;
        } catch {
            return false;
        }
    },

    /**
     * Get current user name from localStorage
     */
    getCurrentUser: (): string | null => {
        return localStorage.getItem('userName');
    },

    /**
     * Get JWT token from localStorage
     */
    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    /**
     * Get current user ID from localStorage or token
     */
    getUserId: (): number | null => {
        // First try to get from localStorage (set during login)
        const storedId = localStorage.getItem('userId');
        if (storedId) {
            return Number(storedId);
        }

        // Fallback: try to extract from token
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            // ASP.NET uses full claim URIs
            const nameIdentifier = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

            // Fallback to short forms if full URI not found
            const userId = nameIdentifier ?? payload.nameid ?? payload.sub ?? payload.uid;

            return userId ? Number(userId) : null;
        } catch {
            return null;
        }
    },
};
