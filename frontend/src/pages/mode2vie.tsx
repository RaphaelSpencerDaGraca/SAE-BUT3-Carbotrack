// frontend/src/pages/mode2vie.tsx
import React from 'react';
import { LifestyleForm } from '../components/calcLifestyle/LifestyleForm';
import { useProduits } from '../hooks/useProduits';

const LifestylePage = () => {
  const { produits, loading, error } = useProduits();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Calculateur d'empreinte carbone</h1>
      <LifestyleForm produits={produits} />
    </div>
  );
};

export default LifestylePage;
