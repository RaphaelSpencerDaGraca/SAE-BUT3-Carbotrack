// backend/src/controller/aiController.ts
import { Request, Response } from "express";
import { askQwenGradio } from "../services/aiService";

export const chatWithAi = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Le champ 'prompt' est requis." });
    }

    const aiResponse = await askQwenGradio(prompt);

    return res.status(200).json({ 
      success: true, 
      response: aiResponse 
    });

  } catch (error) {
        //erreur
    return res.status(500).json({ 
      success: false, 
      message: "Erreur serveur lors de la communication avec l'IA",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};