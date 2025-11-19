// frontend/src/components/calcLifestyle/SectionCard.tsx
import React from 'react';
import { ProduitSelector } from './ProduitSelector';
import { IProduit } from '../../types/produit';

interface SectionCardProps {
  title: string;
  categorie: string;
  produits: IProduit[];
  selectedId: number;
  quantite: number;
  onProduitChange: (id: number) => void;
  onQuantiteChange: (quantite: number) => void;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  categorie,
  produits,
  selectedId,
  quantite,
  onProduitChange,
  onQuantiteChange,
}) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="font-semibold mb-2">{title}</h3>
      <ProduitSelector
        produits={produits}
        categorie={categorie}
        selectedId={selectedId}
        quantite={quantite}
        onProduitChange={onProduitChange}
        onQuantiteChange={onQuantiteChange}
      />
    </div>
  );
};
