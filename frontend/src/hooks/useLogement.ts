import { useState } from 'react';
import { LogementInput } from '../components/calcLifestyle/types';
import api from '../services/api';

export const useLogement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveLogement = async (logement: LogementInput, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/logements/user/${userId}`, {
        ...logement,
        user_id: userId,
      });
      setLoading(false);
      return response.data;
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
      const response = await api.get(`/logements/user/${userId}`);
      setLoading(false);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      setLoading(false);
      return null;
    }
  };

  return { saveLogement, getLogement, loading, error };
};
