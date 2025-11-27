import { Router } from 'express';
import { getTypeChauffage,getAllTypesChauffageController } from '../controller/typeChauffageController';

const router = Router();

/**
 * Routes:
 * GET /api/types-chauffage       -> list all types de chauffage
 * GET /api/types-chauffage/:id   -> get type de chauffage by id
 */

router.get('/', getAllTypesChauffageController);
router.get('/:id', getTypeChauffage);

export default router;
