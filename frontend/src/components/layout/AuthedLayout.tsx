// frontend/src/components/layout/AuthedLayout.tsx
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AppDock from '@/components/nav/AppDock';
import { useAuth } from '@/context/authContext'; 

export default function AuthedLayout() {
    const { isAuthenticated } = useAuth(); // Récupère l'état de connexion depuis votre contexte
    const location = useLocation();

    // Si l'utilisateur n'est pas connecté, on le redirige vers /login
    if (!isAuthenticated) {
        // "replace" empêche le retour arrière vers la page protégée
        // "state" permet de mémoriser où l'utilisateur voulait aller pour le rediriger après le login 
        return <Navigate to="/login" state={{ from: location }} replace />;
    }


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Contenu des pages */}
            <Outlet />

            {/* Dock global */}
            <AppDock />
        </div>
    );
}