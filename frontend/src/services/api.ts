import axios from 'axios';

const api = axios.create({
    baseURL: '/api', //proxy définit dans vite.config
    withCredentials: true,
});


api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;