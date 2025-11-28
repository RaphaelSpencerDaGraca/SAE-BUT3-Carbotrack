// backend/src/routes/passwordReset.ts
import { Router } from 'express';
import { requestPasswordReset, resetPassword } from '../controller/authResetPathWord';
import { validatePasswordResetRequest, validatePasswordReset } from '../middlewares/validate';

const router = Router();

router.post('/request-password-reset', validatePasswordResetRequest, requestPasswordReset);
router.post('/reset-password', validatePasswordReset, resetPassword);

export default router;