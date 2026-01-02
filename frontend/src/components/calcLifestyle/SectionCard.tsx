// frontend/src/components/calcLifestyle/SectionCard.tsx
import React from 'react';
import { MultiProduitSelector } from './MultiProduitSelector';
import { IProduit } from '../../types/produit';
import { SelectedItem } from './types';

interface SectionCardProps {
  title: string;
  categorie: string;
  produits: IProduit[];
  selectedItems: SelectedItem[];
  onItemsChange: (items: SelectedItem[]) => void;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  categorie,
  produits,
  selectedItems,
  onItemsChange,
}) => {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
      <h3 className="font-medium text-slate-100 mb-3">{title}</h3>
      <MultiProduitSelector
        produits={produits}
        categorie={categorie}
        selectedItems={selectedItems}
        onItemsChange={onItemsChange}
      />
    </div>
  );
};