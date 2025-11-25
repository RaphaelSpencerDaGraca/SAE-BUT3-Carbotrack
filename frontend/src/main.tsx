//frontend\src\main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './context/authContext';

import { LanguageProvider } from './language/LanguageContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <LanguageProvider>
            <BrowserRouter>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </BrowserRouter>
        </LanguageProvider>
    </React.StrictMode>
);
