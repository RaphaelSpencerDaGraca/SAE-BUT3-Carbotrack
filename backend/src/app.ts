// backend/src/app.ts
import express from 'express';
import cors from 'cors';

import { notFoundHandler, errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/login';

import authRoutes from './routes/auth';
import routerProduits from './routes/ProduitRouter';
import vehiclesRoutes from './routes/vehicles';
import tripsRoutes from './routes/trips';
import debugRoutes from './routes/debug';
import routerTypeChauffage from './routes/typeChauffage';
import logementRoutes from './routes/logementRouter';
import userProfileRouter from './routes/userProfileRouter';
import passwordResetRoutes from './routes/passwordReset';
import airouter from './routes/aiRoutes';
import electromenagerRouter from './routes/electromenagerRouter';

const app = express();

/**
 * Origines autorisées :
 * - Dev Vite : http://localhost:5173
 * - Front docker prod local : http://localhost:8080
 * - Prod domain : https://1234910.xyz (+ www)
 * + option: CORS_ORIGIN dans .env (séparé par des virgules)
 */
const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:8080',
    'https://1234910.xyz',
    'https://www.1234910.xyz',
];

const envOrigins =
    process.env.CORS_ORIGIN?.split(',')
        .map((s) => s.trim())
        .filter(Boolean) ?? [];

// On merge (au lieu de remplacer), comme ça tu ne te tires pas une balle dans le pied
// si tu mets CORS_ORIGIN en prod et que tu veux quand même tester en local.
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Requêtes sans Origin (curl, serveur, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) return callback(null, true);

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
// Optionnel mais souvent utile pour les preflights
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(requestLogger);

app.use('/api/auth', authRoutes);
app.use('/api/produits', routerProduits);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/type_chauffage', routerTypeChauffage);
app.use('/api/logements', logementRoutes);
app.use('/api/user_profiles', userProfileRouter);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/ai', airouter);
app.use('/api/electromenager', electromenagerRouter);

// debug seulement hors production
if (process.env.NODE_ENV !== 'production') {
    app.use('/api/debug', debugRoutes);
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
