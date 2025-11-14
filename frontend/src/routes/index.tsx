import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import Dashboard from '../pages/dashboard';
import AuthedLayout from '@/components/layout/AuthedLayout';
import VehiclesPage from "@/pages/vehicles.tsx";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Pages publiques */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Pages connectées avec le Dock */}
            <Route element={<AuthedLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                {/* Tu pourras ajouter d'autres pages ici */}
            </Route>

            {/* Redirections */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
