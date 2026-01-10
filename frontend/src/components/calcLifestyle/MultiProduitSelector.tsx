// frontend/src/components/calcLifestyle/MultiProduitSelector.tsx
import React, { useState, useEffect } from 'react';
import { IProduit } from '../../types/produit';
import { SelectedItem } from './types';
import { searchProduitsAPI } from '../../services/produitService'; // Import du service créé étape 2

interface MultiProduitSelectorProps {
  categorie: string;
  selectedItems: SelectedItem[];
  onItemsChange: (items: SelectedItem[]) => void;
}

export const MultiProduitSelector: React.FC<MultiProduitSelectorProps> = ({
  categorie,
  selectedItems,
  onItemsChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<IProduit[]>([]); 
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentQuantite, setCurrentQuantite] = useState(1);
  const [selectedProduitToAdd, setSelectedProduitToAdd] = useState<IProduit | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  useEffect(() => {
   
    if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
    }
    if (selectedProduitToAdd && searchTerm === selectedProduitToAdd.nom) return;

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchProduitsAPI(searchTerm, categorie);
        setSuggestions(results);
      } catch (error) {
        console.error("Erreur de recherche", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, categorie, selectedProduitToAdd]);

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
      setSelectedProduitToAdd(null);
      setSearchTerm('');
      setSuggestions([]);
      setCurrentQuantite(1);
      setIsDropdownOpen(false);
    }
  };

  const handleRemove = (index: number) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    onItemsChange(newItems);
  };

  return (
    <div className="space-y-6">
      {/* Zone de recherche */}
      <div className="relative z-20">
        <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                {isLoading ? (
                    // Spinner de chargement
                    <svg className="h-5 w-5 animate-spin text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                )}
            </div>
            <input
                type="text"
                placeholder={`Rechercher dans ${categorie}...`}
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                    setSelectedProduitToAdd(null);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/50 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 shadow-sm transition-all focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
        </div>

        {/* Liste déroulante des résultats BDD */}
        {isDropdownOpen && searchTerm.length >= 2 && (
          <ul className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-slate-700 bg-slate-800 shadow-xl scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {suggestions.length > 0 ? (
              suggestions.map((prod) => (
                <li
                  key={prod.id}
                  onClick={() => {
                    setSearchTerm(prod.nom);
                    setSelectedProduitToAdd(prod);
                    setIsDropdownOpen(false);
                  }}
                  className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm text-slate-200 transition-colors hover:bg-slate-700/80 hover:text-white"
                >
                  <div className="flex flex-col">
                      <span className="font-medium">{prod.nom}</span>
                      {/* Affichage de la source (Base Carbone, etc) venant de la BDD */}
                      {prod.source && <span className="text-[10px] text-slate-500">{prod.source}</span>}
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-900/50 px-2 py-1 rounded-full">{prod.unite}</span>
                </li>
              ))
            ) : (
               !isLoading && <li className="px-4 py-3 text-sm text-slate-500 italic">Aucun résultat trouvé dans la base</li>
            )}
          </ul>
        )}
      </div>

      {/* Reste du code (Validation Quantité + Liste Items) identique à avant... */}
      {selectedProduitToAdd && (
        <div className="flex items-end gap-3 rounded-lg border border-brand-500/30 bg-brand-500/5 p-4 animate-in fade-in slide-in-from-top-2">
            {/* ... Code existant pour l'input quantité ... */}
             <div className="flex-1">
                <label className="mb-1.5 block text-xs font-semibold text-brand-200 uppercase tracking-wide">
                    Quantité ({selectedProduitToAdd.unite})
                </label>
                <input
                type="number"
                min="0.1"
                step="0.1"
                value={currentQuantite}
                onChange={(e) => setCurrentQuantite(parseFloat(e.target.value))}
                className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
            </div>
            <button
                onClick={handleAdd}
                className="flex items-center gap-2 rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-900/20 transition-all hover:bg-brand-500 hover:scale-[1.02] active:scale-95"
            >
                <span>Ajouter</span>
            </button>
        </div>
      )}
      
      {/* ... Affichage liste items sélectionnés (inchangé) ... */}
      {selectedItems.length > 0 && (
         <div className="space-y-3">
             {/* ... Code existant pour la liste ... */}
             <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Votre sélection ({selectedItems.length})
                </label>
           </div>
           <div className="grid gap-2 sm:grid-cols-1">
            {selectedItems.map((item, index) => (
                <div key={`${item.produitId}-${index}`} className="group relative flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/40 p-3 transition-all hover:border-slate-600 hover:bg-slate-800">
                     <div className="flex flex-col">
                        <span className="font-medium text-slate-200">{item.nom}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="bg-slate-700/50 px-1.5 py-0.5 rounded text-slate-300">
                                {item.quantite} {item.unite}
                            </span>
                            <span>× {item.emission_unitaire} kgCO₂</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-mono text-sm font-bold text-brand-200">
                            {(item.quantite * item.emission_unitaire).toFixed(2)}
                        </span>
                        <button
                            onClick={() => handleRemove(index)}
                            className="rounded-full p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        >✕</button>
                    </div>
                </div>
            ))}
           </div>
         </div>
      )}
    </div>
  );
};