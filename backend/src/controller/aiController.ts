// backend/src/controller/aiController.ts
import { Response } from "express";
import { askQwenGradio } from "../services/aiService";
import { AuthenticatedRequest } from "../middlewares/auth"; // Importation de ton interface personnalisée

export const chatWithAi = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // 1. Récupération de l'ID utilisateur depuis le token décodé (req.user)
    // C'est ici qu'on fait le lien avec le middleware d'authentification
    const userId = req.user?.userId; 
    const { prompt } = req.body;

    // 2. Vérification de sécurité
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Accès refusé. Utilisateur non authentifié." 
      });
    }

    if (!prompt) {
      return res.status(400).json({ message: "Le champ 'prompt' est requis." });
    }

    // 3. Appel du service avec l'ID (pour le contexte) et le prompt
    // TypeScript acceptera userId car il est défini comme string | number dans le service
    const aiResponse = await askQwenGradio(userId, prompt);

    return res.status(200).json({ 
      success: true, 
      response: aiResponse 
    });

  } catch (error) {
    console.error("Erreur dans chatWithAi:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur serveur lors de la communication avec l'IA",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};