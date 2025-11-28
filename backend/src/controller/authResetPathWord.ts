// backend/src/controller/passwordResetController.ts
import { Request, Response } from 'express';
import { createPasswordResetToken, getPasswordResetToken, deletePasswordResetToken } from '../models/passwordReset';
import { getUserByEmail, updateUserPassword } from '../models/user';
import { sendPasswordResetEmail } from '../services/emailService';

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }

        const user = await getUserByEmail(email);
        if (!user) {
            // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
            res.status(200).json({ message: 'Si cet email est enregistré, un lien de réinitialisation a été envoyé.' });
            return;
        }

        const token = await createPasswordResetToken(user.id);
        const resetLink = `http://localhost:5173/reset-password?token=${token.token}`;

        await sendPasswordResetEmail(user.email, resetLink);

        res.status(200).json({ message: 'Si cet email est enregistré, un lien de réinitialisation a été envoyé.' });
    } catch (error) {
        console.error('Erreur lors de la demande de réinitialisation:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            res.status(400).json({ error: 'Token et nouveau mot de passe sont requis' });
            return;
        }

        if (newPassword.length < 6) {
            res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
            return;
        }

        const resetToken = await getPasswordResetToken(token);
        if (!resetToken) {
            res.status(400).json({ error: 'Token invalide ou expiré' });
            return;
        }

        await updateUserPassword(resetToken.user_id, newPassword);
        await deletePasswordResetToken(token);

        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
