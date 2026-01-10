//frontend\src\services\api.ts
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const requestPasswordReset = (email: string) =>
    api.post('/password-reset/request-password-reset', { email });

export const resetPassword = (token: string, newPassword: string) =>
    api.post('/password-reset/reset-password', { token, newPassword });

export default api;
