// backend/src/routes/auth.ts
import { Router } from 'express';
import { login, register } from '../controller/auth';
import { validateLogin, validateRegistration } from '../middlewares/validate';

const router = Router();

// Endpoint pour la connexion
router.post('/login', validateLogin, login);

// Endpoint pour l'inscription
router.post('/register', validateRegistration, register);

export default router;
