//backend\src\app.ts
import express from 'express';

//import {authenticate,} from './middlewares/auth';
//import {validateRegistration, validateLogin} from './middlewares/validate';
import {notFoundHandler, errorHandler} from './middlewares/errorHandler';
import { requestLogger } from './middlewares/login';
import { cors } from './middlewares/cors';
import authRoutes from './routes/auth';
import routerProduits from './routes/ProduitRouter';
import vehiclesRoutes from "./routes/vehicles";
import tripsRoutes from "./routes/routes.trips";
import debugRoutes from "./routes/debug";
import routerTypeChauffage from './routes/typeChauffage';
import logementRoutes from './routes/logementRouter';
import userProfileRouter from './routes/userProfileRouter';
import passwordResetRoutes from './routes/passwordReset';

const app = express();

app.use(express.json());          // Parse le JSON
app.use(requestLogger);           // Log les requêtes
app.use(cors);                    // Configure CORS

app.use('/api/auth', authRoutes);
app.use('/api/produits', routerProduits);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/type_chauffage',routerTypeChauffage)
app.use('/api/logements', logementRoutes);
app.use('/api/user_profiles', userProfileRouter);
app.use('/api/password-reset', passwordResetRoutes);


if (process.env.NODE_ENV !== 'production') {     // route accessible uniquement en dev
    app.use('/api/debug', debugRoutes);
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

