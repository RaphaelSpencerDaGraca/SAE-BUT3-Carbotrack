//backend\src\middlewares\login.ts
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware pour logger les requêtes
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(
            `[${new Date().toISOString()}] ${req.method} ${req.url} ` +
            `${res.statusCode} ${duration}ms`
        );
    });
    next();
};
