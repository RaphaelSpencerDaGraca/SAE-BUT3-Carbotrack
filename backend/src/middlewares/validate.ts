// backend/src/middlewares/validate.ts
import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

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

    // Gestion des erreurs de validation
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
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

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

/**
 * Middleware pour valider les entrées CO₂
 */
export const validateCarbonEntry: ValidationChain[] = [
    body('category')
        .isIn(['transport', 'logement', 'alimentation', 'divers'])
        .withMessage('Catégorie invalide'),

    body('co2_value')
        .isFloat({ min: 0 })
        .withMessage('La valeur CO₂ doit être un nombre positif'),

    body('date')
        .isISO8601()
        .withMessage('La date doit être au format ISO 8601 (YYYY-MM-DD)'),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
