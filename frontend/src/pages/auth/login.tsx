import { useAuth } from '@/context/authContext';
import AuthForm from '@/components/auth/authForm';

const Login = () => {
    const { login } = useAuth(); // <- si dispo dans ton contexte

    const onSubmit = async (email: string, password: string) => {
        await login(email, password); // utilise les paramètres -> plus de TS6133
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50 dark:bg-gray-950">
            <div className="hidden lg:flex items-center justify-center p-10">
                <div className="max-w-md">
                    <img src="/auth-illustration.svg" alt="" className="w-full h-auto mb-8 opacity-90" />
                    <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
                        Suivez & réduisez votre empreinte
                    </h2>
                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                        Enregistrez vos trajets, visualisez vos émissions par poste et atteignez vos objectifs mensuels.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center p-6">
                <AuthForm type="login" onSubmit={onSubmit} />
            </div>
        </div>
    );
};

export default Login;