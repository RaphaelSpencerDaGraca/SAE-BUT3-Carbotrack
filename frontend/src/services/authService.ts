import api from './api';
import { AuthResponse, UserData } from './types';


export const register = async (userData:UserData):Promise<AuthResponse> => {
    const response = await  api.post('/auth/register',userData);
    return response.data
};

export const login = async (userData: Omit<UserData, 'pseudo'>): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', userData);
    return response.data;
};

export const logout = (): void =>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}
