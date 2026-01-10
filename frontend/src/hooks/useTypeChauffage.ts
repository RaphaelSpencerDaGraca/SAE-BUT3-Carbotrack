//frontend\src\hooks\useTypeChauffage.ts
import { useState, useEffect } from 'react';
import { type_chauffage } from '../../../shared/typeChauffage';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export const useTypesChauffage = () => {
  const [typesChauffage, setTypesChauffage] = useState<type_chauffage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypesChauffage = async () => {
      try {
        const response = await fetch(`${API_BASE}/type_chauffage`);
        if (!response.ok) {
          const text = await response.text();
          console.error('fetch /type_chauffage failed', response.status, text);
          throw new Error(`Erreur API: ${response.status} ${text}`);
        }
        const data = await response.json();
        setTypesChauffage(data);
        setError(null);
      } catch (err) {
        console.error('useTypesChauffage error', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchTypesChauffage();
  }, []);

  return { typesChauffage, loading, error };
};
