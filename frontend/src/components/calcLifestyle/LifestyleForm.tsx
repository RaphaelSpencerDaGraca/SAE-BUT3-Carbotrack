// frontend/src/components/calcLifestyle/LifestyleForm.tsx
import React, { useState, useEffect } from 'react';
import { SectionCard } from './SectionCard';
import { ResultDisplay } from './ResultDisplay';
import { IProduit } from '../../types/produit';
import { FormData, LogementInput } from './types';
import { useLogement } from '../../hooks/useLogement';
import { useTypesChauffage } from '../../hooks/useTypeChauffage';

interface LifestyleFormProps {
  produits: IProduit[];
}

export const LifestyleForm: React.FC<LifestyleFormProps> = ({ produits }) => {
  const { saveLogement, loading: logementLoading, error: logementError } = useLogement();
  const { typesChauffage, loading: chauffageLoading, error: chauffageError } = useTypesChauffage();
  const [formData, setFormData] = useState<FormData>({
    logement: { logementid: 0, superficie: 1, isolation: 1 },
    alimentation: { produitId: 0, quantite: 1 },
    loisirs: { produitId: 0, quantite: 1 },
  });
  const [result, setResult] = useState<{ total: number; breakdown: Record<string, number> } | null>(null);
  const [saveMessage, setSaveMessage] = useState('');

  const calculateEmissions = () => {
    const selectedChauffage = typesChauffage.find(t => t.id === formData.logement.logementid);
    if (!selectedChauffage) {
      alert('Veuillez sélectionner un type de chauffage');
      return;
    }

    const calculateForSection = (section: keyof FormData) => {
      if (section === 'logement') {
        const emissionBase = selectedChauffage.facteur_emission_co2;
        const facteurIsolation = 1 + (formData.logement.isolation - 1) * 0.1;
        return (emissionBase * formData.logement.superficie) / facteurIsolation;
      }
      
      const { produitId, quantite } = formData[section] as any;
      const prod = produits.find(p => p.id === produitId);
      return prod ? prod.emission_co2_par_unite * quantite : 0;
    };

    const breakdown = {
      logement: calculateForSection('logement'),
      alimentation: calculateForSection('alimentation'),
      loisirs: calculateForSection('loisirs'),
    };
    const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    setResult({ total, breakdown });
  };

  const addEmissions = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setSaveMessage('Erreur: utilisateur non connecté');
        return;
      }

      const logementData: LogementInput = {
        user_id: userId,
        superficie: formData.logement.superficie,
        nombre_pieces: Math.round(formData.logement.superficie / 15),
        type_chauffage_id: formData.logement.logementid,
      };

      await saveLogement(logementData, userId);
      setSaveMessage('✓ Logement sauvegardé avec succès!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage('✗ Erreur: ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Sections du formulaire */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Section Logement */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
          <h3 className="font-medium text-slate-100 mb-3">Logement</h3>
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
              <label className="block text-xs text-slate-400 mb-1">Niveau d'isolation (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.logement.isolation}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  logement: { ...prev.logement, isolation: Number(e.target.value) }
                }))}
                className="w-full"
              />
              <span className="text-xs text-slate-300">Isolation: {formData.logement.isolation}/5</span>
            </div>
          </div>
        </div>

        {/* Section Alimentation */}
        <SectionCard
          title="Alimentation"
          categorie="alimentation"
          produits={produits}
          selectedId={formData.alimentation.produitId}
          quantite={formData.alimentation.quantite}
          onProduitChange={(id) => setFormData(prev => ({
            ...prev,
            alimentation: { ...prev.alimentation, produitId: id }
          }))}
          onQuantiteChange={(q) => setFormData(prev => ({
            ...prev,
            alimentation: { ...prev.alimentation, quantite: q }
          }))}
        />

        {/* Section Loisirs */}
        <SectionCard
          title="Loisirs"
          categorie="loisirs"
          produits={produits}
          selectedId={formData.loisirs.produitId}
          quantite={formData.loisirs.quantite}
          onProduitChange={(id) => setFormData(prev => ({
            ...prev,
            loisirs: { ...prev.loisirs, produitId: id }
          }))}
          onQuantiteChange={(q) => setFormData(prev => ({
            ...prev,
            loisirs: { ...prev.loisirs, quantite: q }
          }))}
        />
      </div>

      {/* Bouton de calcul */}
      <button
        onClick={calculateEmissions}
        className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        Calculer mon empreinte
      </button>

      {/* Messages */}
      {logementError && (
        <div className="rounded-lg bg-red-900/30 border border-red-700 p-3 text-sm text-red-300">
          {logementError}
        </div>
      )}

      {saveMessage && (
        <div className={`rounded-lg p-3 text-sm ${
          saveMessage.startsWith('✓') 
            ? 'bg-green-900/30 border border-green-700 text-green-300'
            : 'bg-red-900/30 border border-red-700 text-red-300'
        }`}>
          {saveMessage}
        </div>
      )}

      {/* Ajout du logement à la BDD */}
      {result && (
        <button
          onClick={addEmissions}
          disabled={logementLoading}
          className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          {logementLoading ? 'Sauvegarde en cours...' : 'Ajouter à mon empreinte totale'}
        </button>
      )}

      {/* Résultats */}
      {result && <ResultDisplay total={result.total} breakdown={result.breakdown} />}
    </div>
  );
};