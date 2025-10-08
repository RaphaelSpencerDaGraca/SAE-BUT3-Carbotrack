import React from 'react';

interface AuthSwitcherProps {
    mode: 'login' | 'register';
    onSwitchMode: (mode: 'login' | 'register') => void;
}

const AuthSwitcher: React.FC<AuthSwitcherProps> = ({ mode, onSwitchMode }) => {
    return (
        <div className="flex justify-center mb-6">
            <button
                onClick={() => onSwitchMode('login')}
                className={`px-4 py-2 font-medium ${
                    mode === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
            >
                Connexion
            </button>
            <button
                onClick={() => onSwitchMode('register')}
                className={`px-4 py-2 font-medium ${
                    mode === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
            >
                Inscription
            </button>
        </div>
    );
};

export default AuthSwitcher;
