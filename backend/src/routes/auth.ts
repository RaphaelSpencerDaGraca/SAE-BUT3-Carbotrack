// backend/src/routes/auth.ts
import { Router } from 'express';

import { login, register, changePassword, deleteAccount,getMe } from '../controller/authController';
import { validateLogin, validateRegistration } from '../middlewares/validate';

import { authenticate } from '../middlewares/auth';

const router = Router();
// --- Routes Publiques ---
router.post('/login', validateLogin, login);
router.post('/register', validateRegistration, register);

// --- Routes Protégées ---
router.put('/password', authenticate as any, changePassword);
router.delete('/delete', authenticate as any, deleteAccount);
router.get('/me', authenticate, getMe);

export default router;