// backend/src/app.ts
import express from 'express';
import {
    authenticate,
} from './middlewares/auth';
import {
    validateRegistration,
    validateLogin,
    validateCarbonEntry
} from './middlewares/validate';
import {
    notFoundHandler,
    errorHandler
} from './middlewares/errorHandler';
import { requestLogger } from './middlewares/logging';
import { cors } from './middlewares/cors';

const app = express();

// 1. Middlewares globaux (appliqués à toutes les routes)
app.use(express.json());          // Parse le JSON
app.use(requestLogger);           // Log les requêtes
app.use(cors);                    // Configure CORS

// 2. Routes publiques (pas besoin d'authentification)
app.use('/api/auth/register', validateRegistration, authRoutes);
app.use('/api/auth/login', validateLogin, authRoutes);

// 3. Routes protégées (nécessitent un token valide)
app.use('/api/carbon-entries', authenticate, carbonEntryRoutes);
app.use('/api/user', authenticate, userRoutes);

// 4. Middlewares de gestion d'erreurs (doivent être après les routes)
app.use(notFoundHandler);  // Gère les 404
app.use(errorHandler);    // Gère les 500 et autres erreurs

export default app;
