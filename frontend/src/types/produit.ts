// frontend/src/types/produit.ts
export type ProduitSource = 'Base Carbone' | 'Open Food Facts' | 'Manuel';

export interface IProduit {
  id: number;
  nom: string;
  categorie: string;
  sousCategorie: string;
  emissionCO2ParUnite: number;
  unite: string;
  source: ProduitSource;
  identifiantSource: string;
  description: string;
  dateMaj: Date;  
}