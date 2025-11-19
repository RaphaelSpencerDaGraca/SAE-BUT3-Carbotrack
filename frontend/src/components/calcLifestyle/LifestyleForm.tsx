// frontend/src/components/calcLifestyle/LifestyleForm.tsx
import React, { useState } from 'react';
import { SectionCard } from './SectionCard';
import { ResultDisplay } from './ResultDisplay';
import { IProduit } from '../../types/produit';

interface FormData {
  logement: { produitId: number; quantite: number };
  alimentation: { produitId: number; quantite: number };
  transports: { produitId: number; quantite: number };
  loisirs: { produitId: number; quantite: number };
}

interface LifestyleFormProps {
  produits: IProduit[];
}

export const LifestyleForm: React.FC<LifestyleFormProps> = ({ produits }) => {
  const [formData, setFormData] = useState<FormData>({
    logement: { produitId: 0, quantite: 1 },
    alimentation: { produitId: 0, quantite: 1 },
    transports: { produitId: 0, quantite: 1 },
    loisirs: { produitId: 0, quantite: 1 },
  });
  const [result, setResult] = useState<{ total: number; breakdown: Record<string, number> } | null>(null);

  const handleChange = (section: keyof FormData, field: 'produitId' | 'quantite', value: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const calculateEmissions = () => {
    const calculateForSection = (section: keyof FormData) => {
      const { produitId, quantite } = formData[section];
      const produit = produits.find(p => p.id === produitId);
      return produit ? produit.emissionCO2ParUnite * quantite : 0;
    };

    const breakdown = {
      logement: calculateForSection('logement'),
      alimentation: calculateForSection('alimentation'),
      transports: calculateForSection('transports'),
      loisirs: calculateForSection('loisirs'),
    };

    const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    setResult({ total, breakdown });
  };

  return (
    <div className="space-y-4">
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
        title="Transports"
        categorie="transports"
        produits={produits}
        selectedId={formData.transports.produitId}
        quantite={formData.transports.quantite}
        onProduitChange={(id) => handleChange('transports', 'produitId', id)}
        onQuantiteChange={(q) => handleChange('transports', 'quantite', q)}
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
      <button
        onClick={calculateEmissions}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Calculer
      </button>
      {result && <ResultDisplay total={result.total} breakdown={result.breakdown} />}
    </div>
  );
};
