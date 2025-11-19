import express from 'express';

import {authenticate,} from './middlewares/auth';
import {validateRegistration, validateLogin} from './middlewares/validate';
import {notFoundHandler, errorHandler} from './middlewares/errorHandler';
import { requestLogger } from './middlewares/login';
import { cors } from './middlewares/cors';
import authRoutes from './routes/auth';
import routerProduits from './routes/ProduitRouter';

const app = express();

app.use(express.json());          // Parse le JSON
app.use(requestLogger);           // Log les requêtes
app.use(cors);                    // Configure CORS

app.use('/api/auth', authRoutes);
app.use('/api/produits', routerProduits);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

