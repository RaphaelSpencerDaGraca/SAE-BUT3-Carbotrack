import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import * as dotenv from "dotenv";

dotenv.config();

async function createCarboIndex() {
  const assetsPath = path.join(__dirname, "../assets");
  const SAVE_PATH = path.join(__dirname, "../carbo_index.json");

  // Initialisation des embeddings (nécessite HF_TOKEN dans .env)
  const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HF_TOKEN,
    model: "sentence-transformers/all-MiniLM-L6-v2",
  });

  const documents: Document[] = [];

  // --- 1. AJOUT DE CONSEILS PAR DÉFAUT (Pour enrichir l'IA) ---
  const initialTips = [
    "Chauffage : Réduire la température de 1°C permet d'économiser 7% d'énergie.",
    "Transport : Le covoiturage divise par deux l'empreinte carbone d'un trajet en voiture.",
    "Alimentation : La production de viande rouge émet 10x plus de CO2 que les protéines végétales.",
    "Électroménager : Utiliser le mode 'Éco' du lave-linge réduit la consommation d'eau et d'électricité de 30%."
  ];
  
  initialTips.forEach(tip => {
    documents.push(new Document({ pageContent: tip, metadata: { source: "base_knowledge" } }));
  });

  // --- 2. LECTURE DE TON EXCEL (car_labelling.xlsx) ---
  const excelPath = path.join(assetsPath, "car_labelling.xlsx");
  if (fs.existsSync(excelPath)) {
    const workbook = XLSX.readFile(excelPath);
    const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    data.forEach((row) => {
      documents.push(new Document({
        pageContent: `Le véhicule ${row.brand || ''} ${row.model || ''} émet ${row.co2 || '?'} g/km de CO2.`,
        metadata: { source: "car_labelling.xlsx" }
      }));
    });
  }

  // --- 3. LECTURE DES FICHIERS TEXTE ---
  if (fs.existsSync(assetsPath)) {
    const files = fs.readdirSync(assetsPath);
    files.filter(f => f.endsWith(".txt")).forEach(file => {
      const content = fs.readFileSync(path.join(assetsPath, file), "utf-8");
      documents.push(new Document({ pageContent: content, metadata: { source: file } }));
    });
  }

  // --- 4. CRÉATION DU FICHIER JSON ---
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
  const finalChunks = await splitter.splitDocuments(documents);

  console.log(`Vecteurs en cours de génération pour ${finalChunks.length} segments...`);
  const vectorStore = await MemoryVectorStore.fromDocuments(finalChunks, embeddings);
  
  fs.writeFileSync(SAVE_PATH, JSON.stringify(vectorStore.memoryVectors));
  console.log(`✅ Fichier carbo_index.json créé avec succès !`);
}

createCarboIndex().catch(console.error);