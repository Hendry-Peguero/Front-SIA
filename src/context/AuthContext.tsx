import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { LoginRequest } from '../types/auth.types';

interface AuthContextType {
    isAuthenticated: boolean;
    userName: string | null;
    userId: number | null;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication status on mount
        const checkAuth = () => {
            const authenticated = authApi.isAuthenticated();
            const user = authApi.getCurrentUser();
            const id = authApi.getUserId();

            setIsAuthenticated(authenticated);
            setUserName(user);
            setUserId(id);
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (credentials: LoginRequest) => {
        try {
            const response = await authApi.login(credentials);
            console.log('Login response received:', response);

            // Store token and user info
            localStorage.setItem('token', response.token);
            localStorage.setItem('userName', response.userName);

            // Extract user ID from token
            console.log('Attempting to extract userId from token...');
            const extractedUserId = authApi.getUserId();
            console.log('Extracted userId:', extractedUserId);

            if (extractedUserId) {
                localStorage.setItem('userId', extractedUserId.toString());
                console.log('userId saved to localStorage:', extractedUserId);
            } else {
                console.error('Failed to extract userId from token. Check token payload.');
                // Debug: show token payload
                try {
                    const payload = JSON.parse(atob(response.token.split('.')[1]));
                    console.log('Token payload:', payload);
                } catch (e) {
                    console.error('Failed to decode token:', e);
                }
            }

            setIsAuthenticated(true);
            setUserName(response.userName);
            setUserId(extractedUserId);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        authApi.logout();
        setIsAuthenticated(false);
        setUserName(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userName, userId, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
