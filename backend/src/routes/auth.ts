import { Router } from 'express';
import { login, register } from '../controller/auth';
import { validateLogin, validateRegistration } from '../middlewares/validate';

const router = Router();

router.post('/login', validateLogin, login);

router.post('/register', validateRegistration, register);

export default router;
