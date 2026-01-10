import { IProduit } from '../types/produit';
export const searchProduitsAPI = async (query: string, categorie: string): Promise<IProduit[]> => {
    const response = await fetch(`/api/produits/search?q=${encodeURIComponent(query)}&categorie=${encodeURIComponent(categorie)}`);
    
    if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
    }
    
    return response.json();
};