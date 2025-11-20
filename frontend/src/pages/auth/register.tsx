//frontend\src\pages\auth\register.tsx
import { useAuth } from '@/context/authContext';
import AuthForm from '@/components/auth/authForm';

const Register = () => {
    const { register } = useAuth(); // ✅ récupère la fonction du contexte

    const onSubmit = async (email: string, password: string, pseudo?: string) => {
        await register(email, password, pseudo!); // utilise le hook d’auth
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50 dark:bg-gray-950">
            {/* panneau gauche (illustration / texte) */}
            <div className="hidden lg:flex items-center justify-center p-10">
                <div className="max-w-md">
                    <img
                        src="/auth-illustration.svg"
                        alt="Inscription EcoTrack"
                        className="w-full h-auto mb-8 opacity-90"
                    />
                    <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
                        Rejoignez EcoTrack
                    </h2>
                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                        Créez un compte pour enregistrer vos trajets et suivre vos émissions en temps réel.
                    </p>
                </div>
            </div>

            {/* panneau droit (formulaire) */}
            <div className="flex items-center justify-center p-6">
                <AuthForm type="register" onSubmit={onSubmit} />
            </div>
        </div>
    );
};

export default Register;
