// frontend/src/components/calcLifestyle/MultiProduitSelector.tsx
import React, { useState, useMemo } from 'react';
import { IProduit } from '../../types/produit';
import { SelectedItem } from './types';

interface MultiProduitSelectorProps {
  produits: IProduit[];
  categorie: string;
  selectedItems: SelectedItem[];
  onItemsChange: (items: SelectedItem[]) => void;
}

export const MultiProduitSelector: React.FC<MultiProduitSelectorProps> = ({
  produits,
  categorie,
  selectedItems,
  onItemsChange,
}) => {
  // États pour la recherche et l'ajout
  const [searchTerm, setSearchTerm] = useState('');
  const [currentQuantite, setCurrentQuantite] = useState(1);
  const [selectedProduitToAdd, setSelectedProduitToAdd] = useState<IProduit | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filtrer les produits selon la catégorie ET la recherche
  const filteredProduits = useMemo(() => {
    return produits.filter(p => 
      p.categorie === categorie && 
      p.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [produits, categorie, searchTerm]);

  // Ajouter un produit à la liste
  const handleAdd = () => {
    if (selectedProduitToAdd && currentQuantite > 0) {
      const newItem: SelectedItem = {
        produitId: selectedProduitToAdd.id,
        nom: selectedProduitToAdd.nom,
        quantite: currentQuantite,
        unite: selectedProduitToAdd.unite,
        emission_unitaire: selectedProduitToAdd.emission_co2_par_unite
      };
      
      onItemsChange([...selectedItems, newItem]);
      
      // Reset du formulaire d'ajout
      setSelectedProduitToAdd(null);
      setSearchTerm('');
      setCurrentQuantite(1);
      setIsDropdownOpen(false);
    }
  };

  // Supprimer un produit de la liste
  const handleRemove = (index: number) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    onItemsChange(newItems);
  };

  return (
    <div className="space-y-4">
      {/* Zone d'ajout */}
      <div className="rounded-md bg-slate-800/50 p-3 space-y-3 border border-slate-700">
        <label className="text-xs text-slate-400 font-medium uppercase">Ajouter un produit</label>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher (ex: Boeuf, Pomme...)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
              setSelectedProduitToAdd(null); // Reset si on change le texte
            }}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />

          {/* Liste déroulante des suggestions */}
          {isDropdownOpen && searchTerm && (
            <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-slate-700 bg-slate-800 shadow-lg">
              {filteredProduits.length > 0 ? (
                filteredProduits.map((prod) => (
                  <li
                    key={prod.id}
                    onClick={() => {
                      setSearchTerm(prod.nom);
                      setSelectedProduitToAdd(prod);
                      setIsDropdownOpen(false);
                    }}
                    className="cursor-pointer px-3 py-2 text-sm text-slate-200 hover:bg-slate-700"
                  >
                    {prod.nom} <span className="text-xs text-slate-500">({prod.unite})</span>
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-sm text-slate-500">Aucun produit trouvé</li>
              )}
            </ul>
          )}
        </div>

        {/* Si un produit est sélectionné (via clic ou recherche exacte), on affiche la quantité et le bouton */}
        {selectedProduitToAdd && (
          <div className="flex items-end gap-3 animate-in fade-in slide-in-from-top-1">
            <div className="flex-1">
              <label className="block text-xs text-slate-400 mb-1">Quantité ({selectedProduitToAdd.unite})</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={currentQuantite}
                onChange={(e) => setCurrentQuantite(parseFloat(e.target.value))}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <button
              onClick={handleAdd}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
            >
              Ajouter
            </button>
          </div>
        )}
      </div>

      {/* Liste des produits ajoutés */}
      {selectedItems && selectedItems.length > 0 && (
        <div className="space-y-2">
           <label className="text-xs text-slate-400 font-medium uppercase">Produits inclus dans le calcul</label>
           <div className="space-y-2">
            {selectedItems.map((item, index) => (
                <div key={`${item.produitId}-${index}`} className="flex items-center justify-between rounded-md border border-slate-700 bg-slate-800/30 px-3 py-2">
                <div>
                    <div className="text-sm font-medium text-slate-200">{item.nom}</div>
                    <div className="text-xs text-slate-400">
                    {item.quantite} {item.unite} × {item.emission_unitaire} kgCO₂
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-sm font-bold text-brand-200">
                    {(item.quantite * item.emission_unitaire).toFixed(2)} <span className="text-xs font-normal">kg</span>
                    </div>
                    <button
                    onClick={() => handleRemove(index)}
                    className="text-slate-500 hover:text-red-400"
                    title="Retirer"
                    >
                    ✕
                    </button>
                </div>
                </div>
            ))}
           </div>
           
           {/* Sous-total de la section */}
           <div className="text-right text-xs text-slate-400 pt-1">
             Sous-total section : <span className="text-slate-200 font-medium">
               {selectedItems.reduce((acc, i) => acc + (i.quantite * i.emission_unitaire), 0).toFixed(2)} kg CO₂
             </span>
           </div>
        </div>
      )}
    </div>
  );
};