// frontend/src/components/calcLifestyle/types.ts
export interface SelectedItem {
  produitId: number;
  nom: string; 
  quantite: number;
  unite: string;
  emission_unitaire: number;
}

interface FormDataLogement {
  logementid: number;
  superficie: number;
  isolation: number;
  nombre_pieces: number;
}

export interface FormData {
  logement: FormDataLogement;
  alimentation: SelectedItem[]; 
  loisirs: SelectedItem[];
}

export interface LogementInput {
  user_id: string;
  superficie: number;
  nombre_pieces: number;
  type_chauffage_id: number;
  classe_isolation: string;
}

export interface CalculationResult {
  totalKgCO2: number;
  breakdown: Record<string, number>;
}