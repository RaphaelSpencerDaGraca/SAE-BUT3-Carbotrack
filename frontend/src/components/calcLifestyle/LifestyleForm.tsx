// frontend/src/components/calcLifestyle/LifestyleForm.tsx
import React, { useState } from 'react';
import { SectionCard } from './SectionCard';
import { ResultDisplay } from './ResultDisplay';
import { IProduit } from '../../types/produit';
import { FormData, LogementInput, SelectedItem } from './types';
import { useLogement } from '../../hooks/useLogement';
import { useTypesChauffage } from '../../hooks/useTypeChauffage';
import { updateUserProfileEmission } from '../../services/userProfileService';

interface LifestyleFormProps {
  produits: IProduit[];
}

export const LifestyleForm: React.FC<LifestyleFormProps> = ({ produits }) => {
  const { saveLogement, loading: logementLoading, error: logementError } = useLogement();
  const { typesChauffage, loading: chauffageLoading, error: chauffageError } = useTypesChauffage();
  
  // MISE A JOUR : Initialisation avec des tableaux vides pour alimentation et loisirs
  const [formData, setFormData] = useState<FormData>({
    logement: { logementid: 0, superficie: 1, isolation: 3, nombre_pieces: 1 },
    alimentation: [], 
    loisirs: [],
  });
  
  const [result, setResult] = useState<{ total: number; breakdown: Record<string, number> } | null>(null);
  const [saveMessage, setSaveMessage] = useState('');

  const calculateEmissions = () => {
    const selectedChauffage = typesChauffage.find(t => t.id === formData.logement.logementid);
    if (!selectedChauffage) {
      alert('Veuillez sélectionner un type de chauffage');
      return;
    }

    // Calcul Logement (inchangé)
    const calculateLogement = () => {
        const consommation_moyenne_kwh_m2 = selectedChauffage.consommation_moyenne_kwh_m2;
        const facteur_emission_co2 = selectedChauffage.facteur_emission_co2;
        const facteurIsolation = 1 - (1 - (formData.logement.isolation - 1) * 0.2);
        const emissionBase = consommation_moyenne_kwh_m2 * facteur_emission_co2;
        return (emissionBase * formData.logement.superficie) * facteurIsolation;
    };

    // MISE A JOUR : Calcul pour les listes de produits (somme des items)
    const calculateProductList = (items: SelectedItem[]) => {
      return items.reduce((total, item) => {
        return total + (item.emission_unitaire * item.quantite);
      }, 0);
    };

    const breakdown = {
      logement: calculateLogement(),
      alimentation: calculateProductList(formData.alimentation),
      loisirs: calculateProductList(formData.loisirs),
    };

    const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    setResult({ total, breakdown });
  };

  const addEmissions = async () => {
     // ... (Le code d'authentification reste identique) ...
     try {
        const userIdStored = localStorage.getItem('userId');
        const userStoredJson = localStorage.getItem('user');
        const userId = userIdStored || (userStoredJson ? (JSON.parse(userStoredJson).id ?? JSON.parse(userStoredJson).user_id) : null);
        
        if (!userId) {
            setSaveMessage('Erreur: utilisateur non connecté');
            return;
        }

        const logementData: LogementInput = {
            user_id: userId,
            superficie: formData.logement.superficie,
            nombre_pieces: formData.logement.nombre_pieces,
            type_chauffage_id: formData.logement.logementid,
            classe_isolation: String.fromCharCode(64 + formData.logement.isolation),
        };

        if (saveLogement) {
            await saveLogement(logementData, userId);
        }

        if (!result) {
            setSaveMessage('Erreur: aucun résultat à sauvegarder.');
            return;
        }

        await updateUserProfileEmission(userId, result.total);
        setSaveMessage('✓ Emission lifestyle sauvegardée dans votre profil');
        setTimeout(() => setSaveMessage(''), 3000);
     } catch (err: any) {
        setSaveMessage('✗ Erreur: ' + (err?.message || 'Erreur inconnue'));
     }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Section Logement (Code inchangé, je le raccourcis ici pour la lisibilité) */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
          <h3 className="font-medium text-slate-100 mb-3">Logement</h3>
           {/* ... Inputs Logement inchangés ... */}
             <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Type de chauffage</label>
              {chauffageError && (
                <div className="text-xs text-red-400 mb-2">{chauffageError}</div>
              )}
              <select
                value={formData.logement.logementid}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  logement: { ...prev.logement, logementid: Number(e.target.value) }
                }))}
                disabled={chauffageLoading}
                className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 disabled:opacity-50"
              >
                <option value="0">
                  {chauffageLoading ? 'Chargement...' : 'Sélectionnez un type'}
                </option>
                {typesChauffage.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type_chauffage}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Superficie (m²)</label>
              <input
                type="number"
                value={formData.logement.superficie}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  logement: { ...prev.logement, superficie: Number(e.target.value) }
                }))}
                min="1"
                step="1"
                className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nombre de pièces</label>
              <input
                type="number"
                value={formData.logement.nombre_pieces}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  logement: { ...prev.logement, nombre_pieces: Number(e.target.value) }
                }))}
                min="1"
                step="1"
                className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Classe d'isolation (A-G)</label>
              <select
                value={formData.logement.isolation}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  logement: { ...prev.logement, isolation: Number(e.target.value) }
                }))}
                className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100"
              >
                <option value="1.5">A</option>
                <option value="2">B</option>
                <option value="3">C</option>
                <option value="4">D</option>
                <option value="5">E</option>
                <option value="6">F</option>
                <option value="7">G</option>
              </select>
            </div>
          </div>
        </div>

        {/* MISE A JOUR : Utilisation des nouvelles props pour SectionCard */}
        <SectionCard
          title="Alimentation"
          categorie="alimentation"
          produits={produits}
          selectedItems={formData.alimentation}
          onItemsChange={(items) => setFormData(prev => ({ ...prev, alimentation: items }))}
        />
        
        <SectionCard
          title="Loisirs"
          categorie="loisirs"
          produits={produits}
          selectedItems={formData.loisirs}
          onItemsChange={(items) => setFormData(prev => ({ ...prev, loisirs: items }))}
        />
      </div>

      <button
        onClick={calculateEmissions}
        className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600"
      >
        Calculer mon empreinte
      </button>

      {/* Messages d'erreur et succès (inchangés) */}
      {saveMessage && (
         <div className={`rounded-lg p-3 text-sm ${saveMessage.startsWith('✓') ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
            {saveMessage}
         </div>
      )}

      {result && (
        <>
            <button
            onClick={addEmissions}
            disabled={logementLoading}
            className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
            {logementLoading ? 'Sauvegarde...' : 'Ajouter à mon empreinte totale'}
            </button>
            <ResultDisplay total={result.total} breakdown={result.breakdown} />
        </>
      )}
    </div>
  );
};