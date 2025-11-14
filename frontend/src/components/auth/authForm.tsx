//frontend\src\components\auth\authForm.tsx
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
    const isRegister = type === 'register';
    const [formData, setFormData] = useState({ email: '', password: '', pseudo: '' });
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPwd, setShowPwd] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        setError('');

        const email = formData.email.trim();
        const password = formData.password;
        const pseudo = formData.pseudo.trim();

        try {
            if (isRegister && !pseudo) throw new Error('Le pseudo est requis.');
            await onSubmit(email, password, isRegister ? pseudo : undefined);
        } catch (err: any) {
            setError(err?.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Logo + titre */}
            <div className="text-center mb-6">
                <img src="/logo.png" alt="Carbotrack" className="mx-auto h-14 w-14" />
                <h1 className="mt-3 text-2xl font-bold text-green-600">Carbotrack</h1>
                <p className="text-sm text-gray-500">Compteur de CO2 de chaque instant</p>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 rounded-2xl p-6">
                {error && <Alert type="error" message={error} className="mb-4" />}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {isRegister && (
                        <div>
                            <label htmlFor="pseudo" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Pseudo
                            </label>
                            <InputField
                                id="pseudo"
                                type="text"
                                name="pseudo"
                                value={formData.pseudo}
                                onChange={handleChange}
                                placeholder="Votre pseudo"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
                                autoComplete="nickname"
                                required={isRegister}
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Email
                        </label>
                        <InputField
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <InputField
                                id="password"
                                type={showPwd ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg pr-20 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
                                autoComplete={isRegister ? 'new-password' : 'current-password'}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd(s => !s)}
                                className="absolute inset-y-0 right-2 my-auto rounded-md px-3 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            >
                                {showPwd ? 'Masquer' : 'Afficher'}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-full transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (isRegister ? "Inscription…" : "Connexion…") : (isRegister ? "Sign Up" : "Sign In")}
                    </Button>

                    {/* or continue with */}
                    <div className="flex items-center gap-3 my-2">
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                        <span className="text-xs text-gray-500">or continue with</span>
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                    </div>

                    {/* boutons sociaux (mock) */}
                    <div className="grid grid-cols-2 gap-3">
                        <button type="button" className="rounded-lg border border-gray-300 dark:border-gray-700 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
                            Google
                        </button>
                        <button type="button" className="rounded-lg border border-gray-300 dark:border-gray-700 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
                            Facebook
                        </button>
                    </div>

                    {/* liens */}
                    <div className="mt-3 text-center">
                        {!isRegister ? (
                            <a href="#" className="text-sm text-green-600 hover:underline">Forgot Password?</a>
                        ) : null}
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {isRegister ? (
                                <>Already have an account? <a href="/login" className="text-green-600 hover:underline">Sign In</a></>
                            ) : (
                                <>Don’t have an account? <a href="/register" className="text-green-600 hover:underline">Sign Up</a></>
                            )}
                        </div>
                    </div>
                </form>

                <p className="mt-6 text-center text-xs text-gray-400">
                    <a href="/" className="hover:underline">Go to Landing Page</a>
                </p>
            </div>

            {/* mini note RGPD ou autre (optionnel) */}
            {/* <p className="mt-4 text-center text-xs text-gray-400">Protégé par chiffrement de mot de passe • Données sécurisées</p> */}
            <div className="mt-4 text-center">
                <AuthSwitcher currentMode={isRegister ? 'register' : 'login'} />
            </div>
        </div>
    );
};

export default AuthForm;
