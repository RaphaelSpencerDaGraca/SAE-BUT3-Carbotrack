import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    status?: number;
    errors?: string[];
}

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
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Erreur:', err.stack);
    if (err.status && err.errors) {
        return res.status(err.status).json({ errors: err.errors });
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({
        error: 'Erreur serveur',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};
