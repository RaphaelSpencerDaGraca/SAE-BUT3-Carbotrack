// backend/src/services/aiService.ts
import axios from 'axios';

/**
 * Interroge le modèle Mistral pour obtenir une réponse.
 * @param prompt - La question ou le message de l'utilisateur.
 * @returns La réponse générée par l'IA.
 */
export const queryMistralModel = async (prompt: string): Promise<string> => {
  try {
    // Si tu utilises une API externe (ex : Mistral hébergé)
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions', // URL de l'API Mistral
      {
        model: 'mistral-tiny', // ou le modèle que tu utilises
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Retourne la réponse générée par l'IA
    return response.data.choices[0].message.content;

    // Si tu utilises un modèle local (ex : via ONNX ou une lib Python)
    // Appelle ton script Python ou ton service local ici
    // Exemple : return await callLocalMistralModel(prompt);
  } catch (error) {
    console.error('Erreur lors de l\'appel à Mistral:', error);
    throw new Error('Impossible de générer une réponse.');
  }
};
