import { Request, Response } from 'express';
import { 
  getLogementById, 
  getLogementsByUserId, 
  createLogement, 
  updateLogement, 
  deleteLogement, 
  getAllLogements,
  deleteLogementById // Ajout import
} from '../models/logement';
import { logement as LogementType } from '../../../shared/logement';
import { validationResult } from 'express-validator';

export const createLogementController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const logementData = req.body;
    const created = await createLogement(logementData);
    return res.status(201).json(created);
  } catch (err: any) {
    console.error('createLogement error', err);
    return res.status(500).json({ error: 'Failed to create logement', details: err.message });
  }
};

export const getLogementByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    const logement = await getLogementById(id);
    if (!logement) return res.status(404).json({ error: 'Logement not found' });
    return res.json(logement);
  } catch (err) {
    console.error('getLogementById error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// C'est ici que ça change : on renvoie une liste
export const getLogementByUserIdController = async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const logements = await getLogementsByUserId(userId);
    // On renvoie le tableau directement (même si vide)
    return res.json(logements);
  } catch (err) {
    console.error('getLogementByUserId error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateLogementController = async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const payload: Partial<LogementType> = req.body;
    const updated = await updateLogement(userId, payload);
    return res.json(updated);
  } catch (err) {
    console.error('updateLogement error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteLogementController = async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    await deleteLogement(userId);
    return res.status(204).send();
  } catch (err) {
    console.error('deleteLogement error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// --- NOUVEAU CONTROLEUR ---
export const deleteLogementByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    
    await deleteLogementById(id);
    return res.status(204).send();
  } catch (err) {
    console.error('deleteLogementById error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllLogementsController = async (_req: Request, res: Response) => {
  try {
    const logements = await getAllLogements();
    return res.json(logements);
  } catch (err) {
    console.error('getAllLogements error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};