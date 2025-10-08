// backend/src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware pour gérer les erreurs 404 (routes non trouvées)
 */
export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        error: 'Route non trouvée',
        path: req.originalUrl
    });
};

/**
 * Middleware pour gérer les erreurs 500 et autres
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Erreur:', err.stack);

    // Erreurs de validation (ex: express-validator)
    if ('status' in err && 'errors' in err) {
        return res.status(err.status).json({ errors: err.errors });
    }

    // Erreurs connues
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }

    // Erreurs par défaut (500)
    res.status(500).json({
        error: 'Erreur serveur',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};
