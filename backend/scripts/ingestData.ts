// backend/scripts/ingestData.ts
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { TextLoader } from "@langchain/document_loaders/fs/text";
import { DirectoryLoader } from "@langchain/community/document_loaders/fs/directory";
import * as path from "path";

async function prepareData() {
  console.log("--- Début de la préparation des données ---");

  // 1. Charger les documents (on cible un dossier data à créer ou tes assets)
  // Tu peux adapter le loader selon tes besoins (PDF, CSV, etc.)
  const loader = new DirectoryLoader(
    path.join(__dirname, "../assets"),
    {
      ".txt": (path) => new TextLoader(path),
      // Ajoute d'autres extensions si besoin
    }
  );

  const docs = await loader.load();
  console.log(`${docs.length} documents chargés.`);

  // 2. Définir la stratégie de découpage (Chunking)
  // On découpe en morceaux de 1000 caractères avec un chevauchement (overlap)
  // pour ne pas perdre le contexte entre deux morceaux.
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.splitDocuments(docs);
  
  console.log(`${splitDocs.length} morceaux (chunks) créés.`);

  // 3. Ici, splitDocs contient ton texte prêt à être transformé en vecteurs.
  return splitDocs;
}

prepareData().catch(console.error);