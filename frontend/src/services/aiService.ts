// frontend/src/services/aiService.ts

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';
const CHAT_ENDPOINT = `${API_BASE}/ai/chat`;

export const sendMessageToAi = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Erreur IA:", error);
    throw error;
  }
};
