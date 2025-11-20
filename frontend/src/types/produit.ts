// frontend/src/types/produit.ts
export type ProduitSource = 'Base Carbone' | 'Open Food Facts' | 'Manuel';

export interface IProduit {
  id: number;
  nom: string;
  categorie: string;
  sous_categorie: string;
  emission_co2_par_unite: number;
  unite: string;
  source: string;
  identifiant_source: string;
  description: string;
  date_maj: string;
}