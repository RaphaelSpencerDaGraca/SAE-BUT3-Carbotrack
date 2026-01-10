import React, { useState } from 'react';
import { SectionCard } from './SectionCard';
import { ResultDisplay } from './ResultDisplay';
import { IProduit } from '../../types/produit';
import { FormData, SelectedItem } from './types';
import { updateUserProfileEmission } from '../../services/userProfileService';

interface LifestyleFormProps {
  produits: IProduit[];
}

export const LifestyleForm: React.FC<LifestyleFormProps> = ({ produits }) => {
  const [formData, setFormData] = useState<FormData>({
    alimentation: [], 
  });
  
  const [result, setResult] = useState<{ total: number; breakdown: Record<string, number> } | null>(null);
  const [saveMessage, setSaveMessage] = useState('');

  const calculateEmissions = () => {

    const calculateProductList = (items: SelectedItem[]) => {
      return items.reduce((total, item) => {
        return total + (item.emission_unitaire * item.quantite);
      }, 0);
    };
    const breakdown = {
      alimentation: calculateProductList(formData.alimentation),
    };

    const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    setResult({ total, breakdown });
  };

  const addEmissions = async () => {
     try {
        const userIdStored = localStorage.getItem('userId');
        const userStoredJson = localStorage.getItem('user');
        const userId = userIdStored || (userStoredJson ? (JSON.parse(userStoredJson).id ?? JSON.parse(userStoredJson).user_id) : null);
        
        if (!userId) {
            setSaveMessage('Erreur: utilisateur non connecté');
            return;
        }

        if (!result) return;
        await updateUserProfileEmission(userId, result.total);
        setSaveMessage('✓ Emission totale sauvegardée dans votre profil');
        setTimeout(() => setSaveMessage(''), 3000);
     } catch (err: any) {
        setSaveMessage('✗ Erreur: ' + (err?.message || 'Erreur inconnue'));
     }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Alimentation" categorie="alimentation" produits={produits} selectedItems={formData.alimentation} onItemsChange={(items) => setFormData(prev => ({ ...prev, alimentation: items }))} />
      </div>
      <button onClick={calculateEmissions} className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600">
        Calculer mon empreinte simulée
      </button>

      {saveMessage && (
         <div className={`rounded-lg p-3 text-sm ${saveMessage.startsWith('✓') ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
            {saveMessage}
         </div>
      )}

      {result && (
        <>
            <button onClick={addEmissions} className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700">
                Mettre à jour mon profil avec cette estimation
            </button>
            <ResultDisplay total={result.total} breakdown={result.breakdown} />
        </>
      )}
    </div>
  );
};