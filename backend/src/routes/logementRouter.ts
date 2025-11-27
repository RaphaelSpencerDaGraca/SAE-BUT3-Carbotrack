//backend\src\routes\logementRouter.ts
import { Router } from 'express';
import {
  createLogementController,
  getLogementByIdController,
  getLogementByUserIdController,
  updateLogementController,
  deleteLogementController,
  getAllLogementsController,
} from '../controller/logementController';

const router = Router();

/**
 * Routes:
 * POST   /api/logements               -> create logement
 * GET    /api/logements               -> list all logements
 * GET    /api/logements/:id           -> get logement by DB id
 * GET    /api/logements/user/:userId  -> get logement by user id (UUID)
 * PUT    /api/logements/user/:userId  -> update logement by user id
 * DELETE /api/logements/user/:userId  -> delete logement by user id
 */

router.post('/', createLogementController);
router.get('/', getAllLogementsController);
router.get('/:id', getLogementByIdController);
router.get('/user/:userId', getLogementByUserIdController);
router.put('/user/:userId', updateLogementController);
router.delete('/user/:userId', deleteLogementController);

export default router;