import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Middleware pour vérifier le token JWT dans les headers.
 * Ajoute l'ID utilisateur à `req.user` si le token est valide.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header manquant' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ta_cle_secrete') as { userId: string };
        (req as any).user = { userId: decoded.userId };
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expiré' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Token invalide' });
        } else {
            return res.status(401).json({ error: 'Authentification échouée' });
        }
    }
};
