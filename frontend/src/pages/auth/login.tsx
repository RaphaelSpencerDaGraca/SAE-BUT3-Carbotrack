// frontend/src/pages/auth/login.tsx
import AuthPage from "@/components/auth/authPage";
import AuthForm from "@/components/auth/authForm";
import { useAuth } from "@/context/authContext";

const Login = () => {
    const { login } = useAuth();

    const onSubmit = async (email: string, password: string) => {
        // Le AuthContext gère déjà localStorage + navigate('/dashboard')
        await login(email, password);
    };

    return (
        <AuthPage
            title="Bienvenue 👋"
            subtitle="Connectez-vous pour suivre vos trajets et vos émissions."
            highlights={[
                "Suivi simple de vos trajets",
                "Tableau de bord clair & utile",
                "Objectifs mensuels en un coup d’œil",
            ]}
        >
            <AuthForm type="login" onSubmit={onSubmit} />
        </AuthPage>
    );
};

export default Login;