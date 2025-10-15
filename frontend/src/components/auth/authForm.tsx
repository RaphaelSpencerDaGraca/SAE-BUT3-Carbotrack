import React, { useState } from 'react';
import InputField from '../ui/inputField';
import Button from '../ui/button';
import Alert from '../ui/alert';
import AuthSwitcher from './authSwitcher';

interface AuthFormProps {
    type: 'login' | 'register';
    onSubmit: (email: string, password: string, name?: string) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        pseudo: '',
    });
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (type === 'login') {
                await onSubmit(formData.email, formData.password);
            } else {
                await onSubmit(formData.email, formData.password, formData.pseudo);
            }
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-lg rounded-lg px-8 py-10">
                    {/* Titre */}
                    <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
                        {type === 'login' ? 'Connexion' : 'Inscription'}
                    </h2>

                    {/* Affichage des erreurs */}
                    {error && <Alert type="error" message={error} className="mb-4" />}

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Champ Prénom (uniquement pour l'inscription) */}
                        {type === 'register' && (
                            <div>
                                <label htmlFor="pseudo" className="block text-sm font-medium text-gray-700 mb-1">
                                    Pseudo
                                </label>
                                <InputField
                                    id="pseudo"
                                    type="text"
                                    name="pseudo"
                                    value={formData.pseudo}
                                    onChange={handleChange}
                                    placeholder="Votre prénom"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required={type === 'register'}
                                />
                            </div>
                        )}

                        {/* Champ Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <InputField
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Votre email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Champ Mot de passe */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <InputField
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Votre mot de passe"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Bouton de soumission */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                        >
                            {isLoading
                                ? type === 'login'
                                    ? 'Connexion en cours...'
                                    : 'Inscription en cours...'
                                : type === 'login'
                                    ? 'Se connecter'
                                    : "S'inscrire"}
                        </Button>
                    </form>

                    {/* Lien pour basculer entre connexion/inscription */}
                    <div className="mt-6 text-center">
                        <AuthSwitcher currentMode={type} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
