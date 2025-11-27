//backend\src\controller\userProfileController.ts
import { Request, Response } from 'express';
import {
  createUserProfile,
  getUserProfileByUserId,
  updateUserProfile,
  deleteUserProfile,
} from '../models/userProfile';

export const createUserProfileController = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (!payload || !payload.user_id) {
      return res.status(400).json({ error: 'user_id manquant' });
    }
    const created = await createUserProfile({
      user_id: String(payload.user_id),
      emission_co2_transport: payload.emission_co2_transport ?? null,
      emission_co2_lifestyle: payload.emission_co2_lifestyle ?? null,
    });
    return res.status(201).json(created);
  } catch (err) {
    console.error('createUserProfile error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserProfileController = async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const profile = await getUserProfileByUserId(userId);
    if (!profile) return res.status(404).json({ error: 'Profil non trouvé' });
    return res.json(profile);
  } catch (err) {
    console.error('getUserProfile error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const updateUserProfileController = async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const payload: Partial<{ emission_co2_transport: number; emission_co2_lifestyle: number }> = req.body;
    const updated = await updateUserProfile(userId, {
      emission_co2_transport: payload.emission_co2_transport ?? null,
      emission_co2_lifestyle: payload.emission_co2_lifestyle ?? null,
    });
    if (!updated) return res.status(404).json({ error: 'Profil non trouvé' });
    return res.json(updated);
  } catch (err) {
    console.error('updateUserProfile error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const deleteUserProfileController = async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const ok = await deleteUserProfile(userId);
    if (!ok) return res.status(404).json({ error: 'Profil non trouvé' });
    return res.status(204).send();
  } catch (err) {
    console.error('deleteUserProfile error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};