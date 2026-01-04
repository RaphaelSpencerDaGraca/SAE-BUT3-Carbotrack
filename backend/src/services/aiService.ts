// backend/src/services/aiService.ts
import { Client } from "@gradio/client";
import dotenv from "dotenv";

// Imports des modèles (adaptés à ta structure)
import { getLogementsByUserId } from "../models/logement";
import { ElectromenagerModel } from "../models/electromenager";
import { getUserProfileByUserId } from "../models/userProfile";

dotenv.config();


const SPACE_ID = "RaphaelSDG1/CarboBotSpace"; 

let clientInstance: any = null; 


const getClient = async () => {
  if (!clientInstance) {
    console.log("🔌 Connexion au cerveau de l'IA (Hugging Face)...");
    try {
        clientInstance = await Client.connect(SPACE_ID, { 
            // Décommente la ligne suivante si tu as mis HF_TOKEN dans ton .env backend
            // hf_token: process.env.HF_TOKEN 
        });
        console.log("Connexion réussie !");
    } catch (e) {
        console.error("Erreur critique de connexion Hugging Face :", e);
        throw new Error("Impossible de joindre le service IA.");
    }
  }
  return clientInstance;
};


export const askQwenGradio = async (userId: string | number, userPrompt: string) => {
  const safeUserId = String(userId);
  console.log(`Préparation réponse pour User ${safeUserId}...`);


  let contextData = "";
  
  try {

      const userProfile = await getUserProfileByUserId(safeUserId);
      let profileInfo = "Profil non rempli.";
      
      if (userProfile) {
          const totalCo2 = (Number(userProfile.emission_co2_transport) || 0) + (Number(userProfile.emission_co2_lifestyle) || 0);
          profileInfo = `Pseudo: ${userProfile.pseudo || 'Utilisateur'}. Bilan Carbone estimé: ${totalCo2.toFixed(1)} kgCO2/an.`;
      }


      const logements = await getLogementsByUserId(safeUserId);
      let logementInfo = "Aucun logement enregistré.";

      if (logements && logements.length > 0) {
          const detailsLogements = await Promise.all(logements.map(async (l) => {
              try {
                  const lId = typeof l.id === 'string' ? parseInt(l.id) : l.id;
                  const apps = await ElectromenagerModel.findAllByLogementId(lId);
                  
                  const appList = apps.length > 0 
                      ? apps.map(a => `${a.nom} (Classe ${a.classeEnergetique || '?'})`).join(', ') 
                      : "Aucun appareil";
                  
                  return `- Logement ${l.typeLogement} de ${l.surface}m² (Chauffage: ${l.typeChauffage}). Équipements: ${appList}.`;
              } catch (err) {
                  return `- Logement ${l.typeLogement}: Données appareils inaccessibles.`;
              }
          }));
          logementInfo = detailsLogements.join("\n");
      }

   
      contextData = `
[DONNÉES UTILISATEUR]
${profileInfo}

[PARC IMMOBILIER]
${logementInfo}
`;

  } catch (error) {
      console.error("Erreur lors de la récupération du contexte (on continue sans) :", error);
      contextData = "[Données techniques indisponibles momentanément]";
  }


  const systemInstruction = `
ROLE : Tu es CarboBot, un coach expert en efficacité énergétique et écologie.
CONSIGNE STRICTE :
1. Réponds UNIQUEMENT à la question posée par l'utilisateur.
2. Si la question porte sur un sujet précis (ex: gaz, eau), NE PARLE PAS des autres sujets (nourriture, papier, etc.).
3. Utilise les [DONNÉES UTILISATEUR] et [PARC IMMOBILIER] ci-dessous pour personnaliser ta réponse (ex: cite ses appareils ou son type de chauffage).
4. Si les données ne sont pas pertinentes pour la question, donne un conseil d'expert généraliste mais concis.
5. Fais des listes à puces courtes.
`;

  const fullPrompt = `${systemInstruction}\n${contextData}\n\nQUESTION UTILISATEUR : "${userPrompt}"`;


  try {
    const client = await getClient();
    
    console.log("Envoi vers l'endpoint '/api_handler'...");
    

    const result = await client.predict("/api_handler", [ 
      fullPrompt, 
      [] 
    ]);


    const aiResponse = result.data[0] as string;
    
    console.log("Réponse reçue !");
    return aiResponse;

  } catch (error) {
    console.error("ERREUR LORS DE L'APPEL IA :", error);
    throw error;
  }
};