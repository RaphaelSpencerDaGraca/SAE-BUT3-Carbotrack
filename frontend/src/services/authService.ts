//frontend\src\services\authService.ts
import api from './api';
import { AuthResponse, UserData } from '../models/types';

export const register = async (userData: UserData): Promise<AuthResponse> => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const login = async (credentials: Omit<UserData, 'pseudo'>): Promise<AuthResponse> => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};