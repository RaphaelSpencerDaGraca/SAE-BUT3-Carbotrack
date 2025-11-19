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
    <div className="space-y-2">
      <select
        value={selectedId}
        onChange={(e) => onProduitChange(Number(e.target.value))}
        className="w-full p-2 border rounded"
      >
        <option value="0">Sélectionnez un produit</option>
        {produitsFiltres.map((produit) => (
          <option key={produit.id} value={produit.id}>
            {produit.nom} ({produit.emissionCO2ParUnite} {produit.unite})
          </option>
        ))}
      </select>
      {selectedProduit && (
        <>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={quantite}
              onChange={(e) => onQuantiteChange(Number(e.target.value))}
              min="0"
              step="0.1"
              className="w-20 p-2 border rounded"
            />
            <span>{selectedProduit.unite}</span>
          </div>
          <p className="text-sm text-gray-500">{selectedProduit.description}</p>
        </>
      )}
    </div>
  );
};
