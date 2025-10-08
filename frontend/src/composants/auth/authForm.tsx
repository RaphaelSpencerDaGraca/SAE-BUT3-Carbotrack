import React, { useState } from 'react';
import { useAuth } from '@/context/authContext';
import AuthSwitcher from './authSwitcher';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

const AuthForm: React.FC = () => {
    const { login, register } = useAuth();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Gère les changements des champs du formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Soumet le formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (mode === 'login') {
                await login(formData.email, formData.password);
            } else {
                await register(formData.email, formData.password, formData.firstName);
            }
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {/* Boutons pour basculer entre login/register */}
            <AuthSwitcher mode={mode} onSwitchMode={setMode} />

            {/* Affichage conditionnel du titre */}
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
                {mode === 'login' ? 'Connexion' : 'Inscription'}
            </h2>

            {/* Affichage des erreurs */}
            {error && <Alert type="error" message={error} />}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'register' && (
                    <InputField
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Prénom"
                        required={mode === 'register'}
                    />
                )}

                <InputField
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Adresse email"
                    required
                />

                <InputField
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mot de passe"
                    required
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading
                        ? mode === 'login' ? 'Connexion en cours...' : 'Inscription en cours...'
                        : mode === 'login' ? 'Se connecter' : "S'inscrire"}
                </Button>
            </form>
        </div>
    );
};

export default AuthForm;
