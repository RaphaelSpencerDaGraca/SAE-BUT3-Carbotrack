//frontend\src\components\auth\authPage.tsx
import React, { ReactNode } from 'react';
interface AuthPageProps {
    title: string;
    children: ReactNode;
}

const AuthPage: React.FC<AuthPageProps> = ({ title, children }) => {
    return (
        <div>
            <h1>{title}</h1>
            {children}
        </div>
    );
};

export default AuthPage;
