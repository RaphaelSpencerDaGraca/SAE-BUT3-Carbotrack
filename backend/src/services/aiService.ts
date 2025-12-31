// backend/src/services/aiService.ts
import { Client } from "@gradio/client";
import dotenv from "dotenv";

dotenv.config();

const SPACE_URL = "https://raphaelsdg1-carbobotspace.hf.space/"; 


let clientInstance: any = null; 


const getClient = async () => {
  if (!clientInstance) {
    console.log("Initialisation de la connexion Gradio...");
    clientInstance = await Client.connect(SPACE_URL, { 
      // hf_token: process.env.HF_ACCESS_TOKEN 
    });
    console.log("Connecté au Space Gradio !");
  }
  return clientInstance;
};

export const askQwenGradio = async (userPrompt: string) => {
  try {

    const client = await getClient();

    console.log(`Envoi du prompt : "${userPrompt.substring(0, 50)}..."`);

    const result = await client.predict("/generate_response", [ 
      userPrompt 
    ]);

    // Typage de sécurité : on force en string pour TypeScript
    const aiResponse = result.data[0] as string;
    
    return aiResponse;

  } catch (error) {
    console.error("Erreur lors de l'appel Gradio:", error);
    // Optionnel : Si l'erreur vient de la connexion, on reset l'instance pour retenter la prochaine fois
    if (clientInstance) clientInstance = null;
    throw new Error("Impossible de récupérer la réponse de l'IA.");
  }
};