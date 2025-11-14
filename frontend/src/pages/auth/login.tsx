import { useAuth } from '@/context/authContext';
import AuthForm from '@/components/auth/authForm';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (email: string, password: string) => {
        try {
            // On tente de se connecter
            await login(email, password);

            //Si ça passe, on redirige vers le dashboard
            navigate('/dashboard');
        } catch (error) {
            // Si login throw, AuthForm affichera sûrement déjà l’erreur,
            // mais on log quand même pour debug
            console.error('Erreur de connexion :', error);
        }
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