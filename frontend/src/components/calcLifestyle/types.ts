import { IProduit, ProduitSource } from '../../types/produit';

export interface FormData {
  logement: {
    produitId: number;
    quantite: number;
  };
  alimentation: {
    produitId: number;
    quantite: number;
  };
  transports: {
    produitId: number;
    quantite: number;
  };
  loisirs: {
    produitId: number;
    quantite: number;
  };
}

export interface CalculationResult {
  totalKgCO2: number;
  breakdown: Record<string, number>;
}