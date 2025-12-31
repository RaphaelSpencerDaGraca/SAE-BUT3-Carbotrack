// frontend/src/services/aiService.ts

const API_URL = "http://localhost:3001/api/ai/chat"; 

export const sendMessageToAi = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
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