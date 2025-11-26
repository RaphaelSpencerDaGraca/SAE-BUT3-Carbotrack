import { Request, Response } from 'express';
import { getTypeChauffageById,getAllTypesChauffage } from '../models/typeChauffage';

export const getTypeChauffage = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'ID manquant' });
    }
    const typeChauffage = await getTypeChauffageById(parseInt(id, 10));
    if (!typeChauffage) {
      return res.status(404).json({ error: 'Type_Chauffage non trouvé' });
    }
    res.json(typeChauffage);
  } catch (error) {
    console.error('Erreur lors de la récupération du type_chauffage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getAllTypesChauffageController = async (_req: Request, res: Response) => {
  try {
    const typesChauffage = await getAllTypesChauffage();
    res.json(typesChauffage);
  } catch (error) {
    console.error('Erreur lors de la récupération des types_chauffage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};