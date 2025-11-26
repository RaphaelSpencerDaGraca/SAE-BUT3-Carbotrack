// frontend/src/components/calcLifestyle/ProduitSelector.tsx
import React from 'react';
import { IProduit } from '../../types/produit';

interface ProduitSelectorProps {
  produits: IProduit[];
  categorie: string;
  selectedId: number;
  quantite: number;
  onProduitChange: (id: number) => void;
  onQuantiteChange: (quantite: number) => void;
}

export const ProduitSelector: React.FC<ProduitSelectorProps> = ({
  produits,
  categorie,
  selectedId,
  quantite,
  onProduitChange,
  onQuantiteChange,
}) => {
  const produitsFiltres = produits.filter(p => p.categorie === categorie);
  const selectedProduit = produits.find(p => p.id === selectedId);

  return (
    <div className="space-y-3">
      <select
        value={selectedId}
        onChange={(e) => onProduitChange(Number(e.target.value))}
        className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
      >
        <option value="0" className="text-slate-400">Sélectionnez un produit</option>
        {produitsFiltres.map((produit) => (
          <option key={produit.id} value={produit.id} className="text-slate-100">
            {produit.nom}
          </option>
        ))}
      </select>

      {selectedProduit && selectedProduit.id !== 0 ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={quantite}
              onChange={(e) => onQuantiteChange(Number(e.target.value))}
              min="0"
              step="1"
              className="w-20 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <span className="text-xs text-slate-400">{selectedProduit.unite}</span>
          </div>
          <p className="text-xs text-slate-400">{selectedProduit.description}</p>
          <p className="text-xs text-brand-200">
            {selectedProduit.emission_co2_par_unite} {selectedProduit.unite}
          </p>
        </div>
      ) : (
        <p className="text-xs text-slate-500">Sélectionnez un produit pour voir les détails.</p>
      )}
    </div>
  );
};
