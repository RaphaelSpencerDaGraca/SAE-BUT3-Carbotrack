import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-2xl font-bold mb-4">Bienvenue, {user?.pseudo || 'Utilisateur'} !</h1>
            <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Se déconnecter
            </button>
        </div>
    );
};

export default Dashboard;
