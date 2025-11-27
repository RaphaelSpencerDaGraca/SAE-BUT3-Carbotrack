//frontend\src\components\calcLifestyle\types.ts
interface FormDataProduit {
  produitId: number;
  quantite: number;
}

interface FormDataLogement {
  logementid: number;
  superficie: number;
  isolation: number;
  nombre_pieces: number;
}



export interface FormData {
  logement: FormDataLogement;
  alimentation: FormDataProduit;
  loisirs: FormDataProduit;
}

export interface CalculationResult {
  totalKgCO2: number;
  breakdown: Record<string, number>;
}


// frontend/src/components/calcLifestyle/types.ts
export interface LogementInput {
  user_id: string;
  superficie: number;
  nombre_pieces: number;
  type_chauffage_id: number;
  classe_isolation: string;
}
