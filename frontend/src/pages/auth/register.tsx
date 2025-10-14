import AuthForm from '../../components/auth/authForm';
import { useAuth } from '@/hooks/useAuth.ts';

const Register = () => {
    const { register } = useAuth();

    const handleRegister = async (email: string, password: string, name?: string) => {
        if (!name) {
            throw new Error("Le nom est requis pour l'inscription.");
        }
        await register(email, password, name);
    };

    return (
        <div>
            <AuthForm type="register" onSubmit={handleRegister} />
        </div>
    );
};

export default Register;
