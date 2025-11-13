import { Outlet } from 'react-router-dom';
import AppDock from '@/components/nav/AppDock';

export default function AuthedLayout() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Contenu des pages */}
            <Outlet />

            {/* Dock global */}
            <AppDock />
        </div>
    );
}
