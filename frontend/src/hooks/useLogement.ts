// frontend/src/hooks/useLogement.ts
import { useState, useCallback } from 'react';
import { LogementInput } from '../components/calcLifestyle/types';
import api from '../services/api';

// Définition propre de l'interface
export interface LogementData extends LogementInput {
  id: number;
  emission_co2_annuelle?: number;
  user_id: string; // Assurez-vous que ça correspond à votre DB
}

export const useLogement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialisation correcte avec le type
  const [logements, setLogements] = useState<LogementData[]>([]);

  const saveLogement = async (logement: LogementInput, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<LogementData>('/logements', {
        ...logement,
        user_id: userId,
      });
      
      // Mettre à jour la liste locale immédiatement ou re-fetch
      await fetchLogements(userId);
      
      setLoading(false);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      setLoading(false);
      throw err;
    }
  };

  const fetchLogements = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Correction : On dit explicitement à axios que ça retourne un tableau de LogementData
      const response = await api.get<LogementData[]>(`/logements/user/${userId}`);
      
      if (Array.isArray(response.data)) {
        setLogements(response.data);
      } else {
        // Fallback si l'API renvoie un seul objet
        setLogements(response.data ? [response.data] : []);
      }
    } catch (err) {
      console.error("Erreur chargement logements", err);
      // On évite de bloquer l'UI avec une erreur fatale pour un fetch liste
    } finally {
      setLoading(false);
    }
  }, []);

  const getLogement = async (userId: string) => {
    // Ancienne méthode gardée pour compatibilité
    setLoading(true);
    try {
      const response = await api.get<LogementData>(`/logements/user/${userId}`);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      return null;
    }
  };

  return { 
    logements,        // C'est ça qui manquait !
    fetchLogements,   // C'est ça qui manquait !
    saveLogement, 
    getLogement, 
    loading, 
    error 
  };
};