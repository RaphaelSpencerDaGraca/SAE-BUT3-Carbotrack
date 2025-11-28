//backend\src\middlewares\validate.ts
import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/**
 * Middleware pour valider les données d'inscription
 */
export const validateRegistration: ValidationChain[] = [
    body('email')
        .isEmail()
        .withMessage('Email invalide')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Le mot de passe doit faire au moins 8 caractères'),

    body('firstName')
        .optional()
        .isString()
        .trim()
        .withMessage('Le prénom doit être une chaîne de caractères'),
];

/**
 * Middleware pour valider les données de connexion
 */
export const validateLogin: ValidationChain[] = [
    body('email')
        .isEmail()
        .withMessage('Email invalide')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Le mot de passe est requis'),
];

export const withValidation = (validations: ValidationChain[]) => {
    return [validations, handleValidationErrors];
};

export const validatePasswordResetRequest = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ error: 'Email invalide' });
    }
    next();
};

export const validatePasswordReset = (req: Request, res: Response, next: NextFunction) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'Token ou mot de passe invalide' });
    }
    next();
};