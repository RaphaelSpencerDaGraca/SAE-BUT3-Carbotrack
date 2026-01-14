import { Router } from 'express';
import {
  createLogementController,
  getLogementByIdController,
  getLogementByUserIdController, // Ceci renvoie maintenant une liste
  updateLogementController,
  deleteLogementController,
  getAllLogementsController,
  deleteLogementByIdController, // Ajout import
} from '../controller/logementController';

const logementRoutes = Router();

// Créer un logement
logementRoutes.post('/', createLogementController);

// Lister tous les logements (admin ou debug)
logementRoutes.get('/', getAllLogementsController);

// Supprimer un logement spécifique par son ID
// (Placé ici pour être accessible via /logements/:id)
logementRoutes.delete('/:id', deleteLogementByIdController);

// Obtenir un logement précis par son ID
logementRoutes.get('/:id', getLogementByIdController);

// Obtenir la LISTE des logements d'un user
logementRoutes.get('/user/:userId', getLogementByUserIdController);

// Mettre à jour / Supprimer (Attention, ces routes agissent par UserID actuellement)
logementRoutes.put('/user/:userId', updateLogementController);
logementRoutes.delete('/user/:userId', deleteLogementController);

export default logementRoutes;