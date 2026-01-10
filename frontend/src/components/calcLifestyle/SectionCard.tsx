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

// Map simple pour les icônes (tu pourras l'étendre)
const getIconForCategory = (cat: string) => {
  switch (cat.toLowerCase()) {
    case 'alimentation':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case 'logement':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
  }
};

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  categorie,
  produits,
  selectedItems,
  onItemsChange,
}) => {
  return (
    // MODIFICATION 1 : On retire 'overflow-hidden' ici pour laisser la liste sortir
    <div className="group relative rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm transition-all hover:border-slate-700 hover:shadow-md hover:shadow-brand-900/10">
      
      {/* MODIFICATION 2 : On ajoute 'rounded-t-xl' pour que le gradient suive le bord haut sans dépasser */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r from-transparent via-brand-500/20 to-transparent opacity-50" />
      
      <div className="flex items-center gap-3 mb-5 text-brand-100">
        {/* ... le reste de l'icône et du titre ne change pas ... */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-brand-400 shadow-inner border border-slate-700/50">
           {getIconForCategory(categorie)}
        </div>
        <h3 className="font-semibold text-lg tracking-tight">{title}</h3>
      </div>
      
      <MultiProduitSelector
        produits={produits}
        categorie={categorie}
        selectedItems={selectedItems}
        onItemsChange={onItemsChange}
      />
    </div>
  );
};