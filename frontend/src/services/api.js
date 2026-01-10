// frontend/src/services/api.js
import axios from "axios";

// En prod, on veut du same-origin => /api (Nginx reverse-proxy derrière).
// En dev, tu peux override avec VITE_API_URL si tu veux, sinon /api.
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Ajoute le token si présent
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Log propre en cas d’erreur API
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error?.response?.data || error?.message || error);
        return Promise.reject(error);
    }
);

export { api };
export default api;
