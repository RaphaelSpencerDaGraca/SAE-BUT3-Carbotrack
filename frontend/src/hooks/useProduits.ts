// frontend/src/hooks/useProduits.ts
import { useEffect, useState } from 'react';
import { IProduit } from '../types/produit';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export const useProduits = () => {
  const [produits, setProduits] = useState<IProduit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const response = await fetch(`${API_BASE}/produits`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des produits');
        const data: IProduit[] = await response.json();
        setProduits(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    fetchProduits();
  }, []);

  const getProduitById = (id: number) => produits.find(p => p.id === id);

  return { produits, loading, error, getProduitById };
};
