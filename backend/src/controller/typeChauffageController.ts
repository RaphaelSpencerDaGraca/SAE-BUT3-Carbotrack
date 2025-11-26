import { Request, Response } from 'express';
import { getTypeChauffageById } from '../models/typeChauffage';

export const getTypeChauffage = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'ID manquant' });
    }
    const produit = await getTypeChauffageById(parseInt(id, 10));
    if (!produit) {
      return res.status(404).json({ error: 'Type_Chauffage non trouvé' });
    }
    res.json(produit);
  } catch (error) {
    console.error('Erreur lors de la récupération du type_chauffage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
