import AuthForm from '../../components/auth/authForm';
import { useAuth } from '@/hooks/useAuth.ts';

const Login = () => {
    const { login } = useAuth();

    const handleLogin = async (email: string, password: string) => {
        await login(email, password);
    };

    return (
        <div>
            <AuthForm type="login" onSubmit={handleLogin} />
        </div>
    );
};

export default Login;
