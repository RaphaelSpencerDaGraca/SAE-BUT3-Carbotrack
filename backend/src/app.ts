import express from 'express';
//import {authenticate,} from './middlewares/auth';
//import {validateRegistration, validateLogin, validateCarbonEntry} from './middlewares/validate';
import {notFoundHandler, errorHandler} from './middlewares/errorHandler';
import { requestLogger } from './middlewares/login';
import { cors } from './middlewares/cors';

const app = express();

app.use(express.json());          // Parse le JSON
app.use(requestLogger);           // Log les requêtes
app.use(cors);                    // Configure CORS

//app.use('/api/auth/register', validateRegistration, authRoutes);
//app.use('/api/auth/login', validateLogin, authRoutes);

//app.use('/api/carbon-entries', authenticate, carbonEntryRoutes);
//app.use('/api/user', authenticate, userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
