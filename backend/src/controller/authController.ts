// backend/src/controller/auth.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmail, updateUserPassword, deleteUser, getUserById } from '../models/user';
import { registerUserWithOptionalSeed } from '../services/registerUser';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);
        if (!user || !user.password_hash) {
            res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            return;
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'ta_cle_secrete',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                pseudo: user.pseudo,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, pseudo } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await registerUserWithOptionalSeed(email, hashedPassword, pseudo);

        const token = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET || 'ta_cle_secrete',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                pseudo: newUser.pseudo,
            },
        });
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};


export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId; 
        const { currentPassword, newPassword } = req.body;

        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }


        const match = await bcrypt.compare(currentPassword, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
        }

 
        await updateUserPassword(userId, newPassword);
        res.json({ message: 'Mot de passe mis à jour avec succès' });

    } catch (error) {
        console.error('Erreur changement mot de passe:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { password } = req.body; 

        if (!userId || !password) {
            return res.status(400).json({ error: 'Mot de passe requis pour supprimer le compte' });
        }

        const user = await getUserById(userId);
        if (!user) return res.status(404).json({ error: 'Utilisateur inconnu' });

     
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Mot de passe incorrect, suppression annulée' });
        }

        await deleteUser(userId);
        res.json({ message: 'Compte supprimé définitivement' });

    } catch (error) {
        console.error('Erreur suppression compte:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};