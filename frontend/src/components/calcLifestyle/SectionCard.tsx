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
    <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
      <h3 className="font-medium text-slate-100 mb-3">{title}</h3>
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
