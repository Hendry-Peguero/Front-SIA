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
};
