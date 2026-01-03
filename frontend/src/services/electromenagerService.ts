// frontend/src/services/electromenagerService.ts
import api from './api'; 
import { IElectromenager } from '../types/electromenager';

const API_URL = '/electromenager';

export const getAppareilsByLogement = async (logementId: number): Promise<IElectromenager[]> => {
    const response = await api.get<IElectromenager[]>(`${API_URL}/logement/${logementId}`);
    return response.data;
};

export const createAppareil = async (appareil: IElectromenager): Promise<IElectromenager> => {
    const response = await api.post<IElectromenager>(API_URL, appareil);
    return response.data;
};

export const deleteAppareil = async (id: number): Promise<void> => {
    await api.delete(`${API_URL}/${id}`);
};