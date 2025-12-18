//backend\src\carbobot.ts
import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

// URL de l'API Ollama (locale)
const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

/**
 * Middleware pour appeler Mistral via Ollama et obtenir un conseil écologique.
 */
router.post('/eco-advice', async (req: Request, res: Response) => {
  const { userInput, carbonData } = req.body;

  // Vérifie que les données sont présentes
  if (!userInput) {
    return res.status(400).json({ error: "Le champ 'userInput' est requis." });
  }

  // Construit le prompt pour Mistral
  const prompt = `
    Données utilisateur : ${carbonData ? JSON.stringify(carbonData) : 'Aucune donnée spécifique'}.
    Question : "${userInput}".
    Règles :
    - Réponds en 2-3 phrases max.
    - Propose une action concrète, réaliste et personnalisée pour réduire l'empreinte carbone.
    - Si possible, cite une source ou une statistique pour appuyer ton conseil.
  `;

  try {
    // Appel à l'API Ollama
    const response = await axios.post(OLLAMA_API_URL, {
      model: 'mistral',  
      prompt: prompt,
      stream: false,
    });

    // Renvoie la réponse de Mistral
    res.json({
      success: true,
      advice: response.data.response,
    });
  } catch (error) {
    console.error('Erreur lors de l\'appel à Mistral:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la génération du conseil écologique.",
    });
  }
});

export default router;
