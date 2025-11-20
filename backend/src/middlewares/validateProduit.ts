//backend\src\middlewares\validateProduit.ts
import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validateProduit: ValidationChain[] = [
    body('nom')
        .notEmpty()
        .withMessage('Le nom est requis'),
    body('categorie')
        .notEmpty()
        .withMessage('La catégorie est requise'),
    body('emissionCO2ParUnite')
        .isNumeric()
        .withMessage('L\'émission CO2 par unité doit être un nombre'),
    body('unite')
        .notEmpty()
        .withMessage('L\'unité est requise'),
];

export const withValidation = (validations: ValidationChain[]) => {
    return [validations, handleValidationErrors];
};
