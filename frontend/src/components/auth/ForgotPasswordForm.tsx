// frontend/src/components/auth/ForgotPasswordForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../ui/inputField';
import Button from '../ui/button';
import Alert from '../ui/alert';
import api from '../../services/api';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/password-reset/request-password-reset', { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 rounded-2xl p-6">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Carbotrack" className="mx-auto h-14 w-14" />
          <h1 className="mt-3 text-2xl font-bold text-green-600">Réinitialisation du mot de passe</h1>
          <p className="text-sm text-gray-500">Entrez votre email pour recevoir un lien de réinitialisation</p>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}
        {success ? (
          <div className="text-center space-y-4">
            <div className="rounded-full bg-green-50 p-4 mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-600">
              Si un compte est associé à cet email, vous recevrez un lien de réinitialisation.
            </p>
            <Button
              onClick={() => navigate('/login')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-full transition"
            >
              Retour à la connexion
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Email
              </label>
              <InputField
                id="email"
                name="email"  
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-full transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
