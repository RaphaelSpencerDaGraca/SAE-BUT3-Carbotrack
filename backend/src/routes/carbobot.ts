// backend/src/routes/chat.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/auth'; // Middleware d'authentification
import { queryMistralModel } from '../services/aiService';
import { AuthenticatedRequest } from '../middlewares/auth'; // Importe l'interface

const router = Router();

/**
 * Route pour gérer les requêtes de chat.
 * Nécessite une authentification (middleware `authenticate`).
 */
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Vérifie que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({ error: 'Non autorisé' });
    }

    const { prompt } = req.body;

    // Vérifie que le prompt est présent
    if (!prompt) {
      return res.status(400).json({ error: 'Le prompt est requis.' });
    }

    // Appelle le service Mistral
    const response = await queryMistralModel(prompt);

    // Retourne la réponse
    res.json({ response });
  } catch (error) {
    console.error('Erreur dans la route /chat:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la génération de la réponse.' });
  }
});

export default router;
