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
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { emission_co2_transport, emission_co2_lifestyle, pseudo, genre } = req.body;

        // CORRECTION : On ajoute 'as string' pour rassurer TypeScript
        if (!userId) {
            return res.status(400).json({ error: "ID utilisateur manquant" });
        }

        const updatedProfile = await updateUserProfile(userId as string, {
            emission_co2_transport,
            emission_co2_lifestyle,
            pseudo,
            genre
        });

        if (!updatedProfile) {
            return res.status(404).json({ error: 'Impossible de mettre à jour le profil' });
        }

        res.json(updatedProfile);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        res.status(500).json({ error: 'Erreur serveur' });
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