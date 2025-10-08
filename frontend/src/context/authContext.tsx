// frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService, register as registerService, logout as logoutService } from '../services/authService';
import { AuthResponse, User } from '../services/types';

// 1. Définition des types (importés depuis types.ts)
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, firstName: string) => Promise<void>;
    logout: () => void;
    loading: boolean;  // Pour gérer l'état de chargement
}

// 2. Valeur par défaut pour le contexte
const defaultAuthContext: AuthContextType = {
    user: null,
    isAuthenticated: false,
    login: async () => {},
    register: async () => {},
    logout: () => {},
    loading: false,
};

// 3. Création du contexte avec la valeur par défaut
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// 4. Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
    return useContext(AuthContext);
};

// 5. Props pour le fournisseur du contexte
interface AuthProviderProps {
    children: ReactNode;
}

// 6. Fournisseur du contexte
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    // 7. Vérifie la session au chargement de l'application
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    // Optionnel: Vérifie le token côté backend pour plus de sécurité
                    // const response = await api.get('/api/auth/me');
                    // setUser(response.data.user);
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error('Token invalide:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // 8. Fonction de login
    const login = async (email: string, password: string) => {
        try {
            const response = await loginService({ email, password });

            // Stocke le token et les données utilisateur
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Met à jour l'état avec les vraies données utilisateur
            setUser(response.user);
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Login failed:', error);
            throw new Error(error.response?.data?.error || 'Erreur de connexion');
        }
    };

    // 9. Fonction de register
    const register = async (email: string, password: string, pseudo: string) => {
        try {
            const response = await registerService({ email, password, pseudo});

            // Stocke le token et les données utilisateur
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Met à jour l'état avec les vraies données utilisateur
            setUser(response.user);
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Registration failed:', error);
            throw new Error(error.response?.data?.error || 'Erreur d\'inscription');
        }
    };

    // 10. Fonction de logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/auth');
    };

    // 11. Valeur du contexte
    const contextValue: AuthContextType = {
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
    };

    // 12. Affiche un indicateur de chargement si nécessaire
    if (loading) {
        return <div>Chargement...</div>;
    }

    // 13. Fournit le contexte aux composants enfants
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
