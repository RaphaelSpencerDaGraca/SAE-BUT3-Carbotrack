import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
// CORRECTION : On importe 'updateProfile' (le vrai nom) et non 'updateUserProfileController'
import { getUserProfileController, updateProfile } from '../controller/userProfileController';

const router = Router();

// Route pour récupérer le profil (GET)
// On ajoute 'authenticate' pour sécuriser la route
router.get('/:userId', authenticate as any, getUserProfileController);

// Route pour mettre à jour le profil (PUT)
// CORRECTION : On utilise la fonction 'updateProfile' importée correctement
router.put('/:userId', authenticate as any, updateProfile);

export default router;