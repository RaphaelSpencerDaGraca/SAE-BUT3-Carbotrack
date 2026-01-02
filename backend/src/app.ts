// backend/src/app.ts
import express from 'express';

import cors from 'cors'; 

import { authenticate } from './middlewares/auth'; 
import {notFoundHandler, errorHandler} from './middlewares/errorHandler';
import { requestLogger } from './middlewares/login';


import authRoutes from './routes/auth'; 
import routerProduits from './routes/ProduitRouter';
import vehiclesRoutes from "./routes/vehicles";
import tripsRoutes from "./routes/trips";
import debugRoutes from "./routes/debug";
import routerTypeChauffage from './routes/typeChauffage';
import logementRoutes from './routes/logementRouter';
import userProfileRouter from './routes/userProfileRouter';
import passwordResetRoutes from './routes/passwordReset';
import airouter from './routes/aiRoutes';

const app = express();


app.use(cors({
    origin: 'http://localhost:5173', // L'adresse frontend
    credentials: true,               // Autorise les cookies/tokens
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(requestLogger);

app.use('/api/auth', authRoutes);
app.use('/api/produits', routerProduits);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/type_chauffage', routerTypeChauffage);
app.use('/api/logements', logementRoutes);
app.use('/api/user_profiles', userProfileRouter);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/ai', airouter);

if (process.env.NODE_ENV !== 'production') {
    app.use('/api/debug', debugRoutes);
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;