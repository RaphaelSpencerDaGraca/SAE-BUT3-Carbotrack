// frontend/src/components/calcLifestyle/types.ts
export interface SelectedItem {
  produitId: number;
  nom: string; 
  quantite: number;
  unite: string;
  emission_unitaire: number;
}


export interface FormData {
  alimentation: SelectedItem[]; 
}

export interface CalculationResult {
  totalKgCO2: number;
  breakdown: Record<string, number>;
}

export interface LogementInput {
    id?: number; 
    user_id: string;
    superficie: number;
    nombre_pieces: number;
    type_chauffage_id: number;
    classe_isolation: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
}