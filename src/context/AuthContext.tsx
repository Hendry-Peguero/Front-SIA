import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { LoginRequest } from '../types/auth.types';

interface AuthContextType {
    isAuthenticated: boolean;
    userName: string | null;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication status on mount
        const checkAuth = () => {
            const authenticated = authApi.isAuthenticated();
            const user = authApi.getCurrentUser();

            setIsAuthenticated(authenticated);
            setUserName(user);
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (credentials: LoginRequest) => {
        try {
            const response = await authApi.login(credentials);

            // Store token and user info
            localStorage.setItem('token', response.token);
            localStorage.setItem('userName', response.userName);

            setIsAuthenticated(true);
            setUserName(response.userName);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        authApi.logout();
        setIsAuthenticated(false);
        setUserName(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userName, login, logout, loading }}>
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
