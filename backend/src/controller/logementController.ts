//backend\src\controller\logementController.ts
import { Request, Response } from 'express';
import { getLogementById,getLogementByUserId, createLogement, updateLogement, deleteLogement, getAllLogements} from '../models/logement';
import { logement as LogementType } from '../../../shared/logement';

export const createLogementController = async (req: Request, res: Response) => {
  try {
    const logementData: LogementType = req.body;
    const created = await createLogement(logementData);
    return res.status(201).json(created);
  } catch (err) {
    console.error('createLogement error', err);
    return res.status(500).json({ error: 'Internal server error' });
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

export const getLogementByUserIdController = async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const logement = await getLogementByUserId(userId);
    if (!logement) return res.status(404).json({ error: 'Logement not found for user' });
    return res.json(logement);
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
    if (!updated) return res.status(404).json({ error: 'Logement not found for user' });
    return res.json(updated);
  } catch (err) {
    console.error('updateLogement error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteLogementController = async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const deleted = await deleteLogement(userId);
    if (!deleted) return res.status(404).json({ error: 'Logement not found for user' });
    return res.status(204).send();
  } catch (err) {
    console.error('deleteLogement error', err);
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