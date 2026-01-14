// frontend/src/pages/auth/register.tsx
import AuthPage from "@/components/auth/authPage";
import AuthForm from "@/components/auth/authForm";
import { useAuth } from "@/context/authContext";

const Register = () => {
    const { register } = useAuth();

    const onSubmit = async (email: string, password: string, pseudo?: string) => {
        await register(email, password, pseudo!);
    };

    return (
        <AuthPage
            title="Créer un compte ✨"
            subtitle="Rejoignez CarboTrack et commencez à suivre votre empreinte carbone."
            highlights={[
                "Historique complet de vos trajets",
                "Suivi de vos émissions dans le temps",
                "Objectifs écologiques personnalisés",
            ]}
        >
            <AuthForm type="register" onSubmit={onSubmit} />
        </AuthPage>
    );
};

export default Register;
