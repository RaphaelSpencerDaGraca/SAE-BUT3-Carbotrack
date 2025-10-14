import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from "react-router-dom";
import { login as loginService, register as registerService } from '../services/authService';
import { User } from '../models/types';
import api from "../services/api";

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, firstName: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const defaultAuthContext: AuthContextType = {
    user: null,
    isAuthenticated: false,
    login: async () => {},
    register: async () => {},
    logout: () => {},
    loading: false,
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => {
    return useContext(AuthContext);
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (token && storedUser) {
                try {
                    // Vérifie la validité du token en appelant l'API
                    await api.get('/api/auth/me');
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error('Token invalide:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await loginService({ email, password });
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setUser(response.user);
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Login failed:', error);
            throw new Error(error.response?.data?.error || 'Erreur de connexion');
        }
    };

    const register = async (email: string, password: string, pseudo: string) => {
        try {
            const response = await registerService({ email, password, pseudo });
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setUser(response.user);
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Registration failed:', error);
            throw new Error(error.response?.data?.error || "Erreur d'inscription");
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/auth');
    };

    const contextValue: AuthContextType = {
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
