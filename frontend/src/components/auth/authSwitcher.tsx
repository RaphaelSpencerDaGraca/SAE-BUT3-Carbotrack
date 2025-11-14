//frontend\src\components\auth\authSwitcher.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthSwitcherProps {
    currentMode: 'login' | 'register';
}

const AuthSwitcher: React.FC<AuthSwitcherProps> = ({ currentMode }) => {
    return (
        <div className="text-sm text-gray-600">
            {currentMode === 'login' ? (
                <p>
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                        S'inscrire
                    </Link>
                </p>
            ) : (
                <p>
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                        Se connecter
                    </Link>
                </p>
            )}
        </div>
    );
};

export default AuthSwitcher;
