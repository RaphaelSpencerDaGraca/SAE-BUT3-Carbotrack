import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail, DBUser } from '../models/user';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);

        if (!user || !user.password_hash) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'ta_cle_secrete',
            { expiresIn: '24h' }
        );

        res.json({
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

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, pseudo } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createUser(email, hashedPassword, pseudo);

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
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
