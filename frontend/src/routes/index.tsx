//frontend\src\routes\index.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import Dashboard from '../pages/dashboard';
import VehiclesPage from "@/pages/vehicles.tsx";
import TripsPage from "@/pages/trips.tsx";
import AuthedLayout from '@/components/layout/AuthedLayout';
import ProfilePage from "@/pages/profile.tsx";
import LifestylePage from '@/pages/mode2vie';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import Carbobot from '@/pages/carbobot.tsx';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Pages publiques */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            {/* Pages connectées avec le Dock */}
            <Route element={<AuthedLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/mode2vie" element={<LifestylePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/carbobot" element={<Carbobot />} />
                {/* Tu pourras ajouter d'autres pages ici */}
            </Route>

            {/* Redirections */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
