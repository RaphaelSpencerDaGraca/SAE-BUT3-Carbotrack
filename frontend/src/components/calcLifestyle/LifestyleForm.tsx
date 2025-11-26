// frontend/src/components/calcLifestyle/LifestyleForm.tsx
import React, { useState } from 'react';
import { SectionCard } from './SectionCard';
import { ResultDisplay } from './ResultDisplay';
import { IProduit } from '../../types/produit';
import { FormData } from './types';

interface LifestyleFormProps {
  produits: IProduit[];
}

export const LifestyleForm: React.FC<LifestyleFormProps> = ({ produits }) => {
  const [formData, setFormData] = useState<FormData>({
    logement: { logementid: 0, superficie: 1, isolation: 1 },
    alimentation: { produitId: 0, quantite: 1 },
    loisirs: { produitId: 0, quantite: 1 },
  });
  const [result, setResult] = useState<{ total: number; breakdown: Record<string, number> } | null>(null);

  const handleChange = (section: keyof FormData, field: 'produitId' | 'quantite', value: number) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const calculateEmissions = () => {
    const calculateForSection = (section: keyof FormData) => {
      const sectionData = formData[section];
      
      // Handle logement section differently
      if (section === 'logement') {
        const logement = sectionData as any; // Type assertion needed due to structural mismatch
        const produit = produits.find(p => p.id === logement.logementid);
        return produit ? produit.emission_co2_par_unite * 1 : 0;
      }
      
      // Handle alimentation and loisirs
      const { produitId, quantite } = sectionData as any;
      const produit = produits.find(p => p.id === produitId);
      return produit ? produit.emission_co2_par_unite * quantite : 0;
    };

    const breakdown = {
      logement: calculateForSection('logement'),
      alimentation: calculateForSection('alimentation'),
      loisirs: calculateForSection('loisirs'),
    };
    const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    setResult({ total, breakdown });
  };

  const addEmissions = () => {
    // Fonctionnalité à implémenter pour ajouter les émissions à la BDD
  }

  return (
    <div className="space-y-6">
      {/* Sections du formulaire */}
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard
          title="Logement"
          categorie="logement"
          produits={produits}
          selectedId={formData.logement.produitId}
          quantite={formData.logement.quantite}
          onProduitChange={(id) => handleChange('logement', 'produitId', id)}
          onQuantiteChange={(q) => handleChange('logement', 'quantite', q)}
        />
        <SectionCard
          title="Alimentation"
          categorie="alimentation"
          produits={produits}
          selectedId={formData.alimentation.produitId}
          quantite={formData.alimentation.quantite}
          onProduitChange={(id) => handleChange('alimentation', 'produitId', id)}
          onQuantiteChange={(q) => handleChange('alimentation', 'quantite', q)}
        />
        <SectionCard
          title="Loisirs"
          categorie="loisirs"
          produits={produits}
          selectedId={formData.loisirs.produitId}
          quantite={formData.loisirs.quantite}
          onProduitChange={(id) => handleChange('loisirs', 'produitId', id)}
          onQuantiteChange={(q) => handleChange('loisirs', 'quantite', q)}
        />
      </div>

      {/* Bouton de calcul */}
      <button
        onClick={calculateEmissions}
        className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        Calculer mon empreinte
      </button>

      {/* Ajout de l'empreinte à la BDD */}
      <button
        onClick={calculateEmissions}
        className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        Ajouter à mon empreinte totale
      </button>

      {/* Résultats */}
      {result && <ResultDisplay total={result.total} breakdown={result.breakdown} />}
    </div>
  );
};
