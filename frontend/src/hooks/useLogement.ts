import { useState } from 'react';
import { LogementInput } from '../components/calcLifestyle/types';

const API_URL = 'http://localhost:3001/api';

export const useLogement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveLogement = async (logement: LogementInput, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/logements/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ...logement, user_id: userId }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde du logement');
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      setLoading(false);
      throw err;
    }
  };

  const getLogement = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/logements/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du logement');
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      setLoading(false);
      return null;
    }
  };

  return { saveLogement, getLogement, loading, error };
};