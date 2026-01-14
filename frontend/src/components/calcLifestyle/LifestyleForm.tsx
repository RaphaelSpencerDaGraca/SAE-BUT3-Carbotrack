import React, { useState } from 'react';
import { useTranslation } from '@/language/useTranslation';
import { SectionCard } from './SectionCard';
import { ResultDisplay } from './ResultDisplay';
import { IProduit } from '../../types/produit';
import { FormData, SelectedItem } from './types';
import { updateUserProfileEmission } from '../../services/userProfileService';

interface LifestyleFormProps {
  produits: IProduit[];
}

export const LifestyleForm: React.FC<LifestyleFormProps> = ({ produits }) => {
  const { t } = useTranslation();
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
            setSaveMessage(t('lifestyle.form.error.notConnected'));
            return;
        }

        if (!result) return;
        await updateUserProfileEmission(userId, result.total);
        setSaveMessage(t('lifestyle.form.success.saved'));
        setTimeout(() => setSaveMessage(''), 3000);
     } catch (err: any) {
        const errorMsg = err?.message || t('lifestyle.form.error.generic');
        setSaveMessage(`${t('common.error')} : ${errorMsg}`);
     }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard 
            title={t('lifestyle.form.food')} 
            categorie="alimentation" 
            produits={produits} 
            selectedItems={formData.alimentation} 
            onItemsChange={(items) => setFormData(prev => ({ ...prev, alimentation: items }))} 
        />
      </div>
        <button
            type="button"
            onClick={calculateEmissions}
            className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.55)] transition hover:brightness-110"
        >
            {t('lifestyle.form.calculate')}
        </button>

      {saveMessage && (
         <div className={`rounded-lg p-3 text-sm ${saveMessage.includes('✓') ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
            {saveMessage}
         </div>
      )}

      {result && (
        <>
            <button
                type="button"
                onClick={addEmissions}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
                {t('lifestyle.form.updateProfile')}
            </button>
            <ResultDisplay total={result.total} breakdown={result.breakdown} />
        </>
      )}
    </div>
  );
};