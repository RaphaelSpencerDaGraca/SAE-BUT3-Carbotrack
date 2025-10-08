import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Vérifie l'utilisateur
        const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userRes.rows.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const user = userRes.rows[0];

        // 2. Vérifie le mot de passe
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // 3. Génère un token JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'ta_cle_secrete',
            { expiresIn: '24h' }
        );

        // 4. Retourne le token et les données utilisateur
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName } = req.body;

        // 1. Vérifie si l'utilisateur existe déjà
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email déjà utilisé' });
        }

        // 2. Hash le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Insère l'utilisateur dans la BD
        const newUser = await pool.query(
            'INSERT INTO users (email, password_hash, first_name) VALUES ($1, $2, $3) RETURNING id, email, first_name',
            [email, hashedPassword, firstName]
        );

        // 4. Génère un token JWT
        const token = jwt.sign(
            { userId: newUser.rows[0].id },
            process.env.JWT_SECRET || 'ta_cle_secrete',
            { expiresIn: '24h' }
        );

        // 5. Retourne le token et les données utilisateur
        res.status(201).json({
            token,
            user: {
                id: newUser.rows[0].id,
                email: newUser.rows[0].email,
                firstName: newUser.rows[0].first_name,
            },
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
