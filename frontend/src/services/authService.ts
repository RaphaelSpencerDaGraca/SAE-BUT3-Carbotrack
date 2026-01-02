// frontend/src/services/authService.ts
import api from './api';
import { AuthResponse, UserData } from '../models/types';

export const register = async (userData: UserData): Promise<AuthResponse> => {
    try {
        const response = await api.post('/auth/register', userData);
        // CORRECTION : Double cast (unknown -> any -> AuthResponse)
        return (response.data as any) as AuthResponse;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const login = async (credentials: Omit<UserData, 'pseudo'>): Promise<AuthResponse> => {
    try {
        const response = await api.post('/auth/login', credentials);
        // CORRECTION : Double cast
        return (response.data as any) as AuthResponse;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/auth/password', { currentPassword, newPassword });
    return response.data;
};

export const deleteAccount = async (password: string) => {
    const config: any = {
        data: { password }
    };
    const response = await api.delete('/auth/delete', config);
    return response.data;
};