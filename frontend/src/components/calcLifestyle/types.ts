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