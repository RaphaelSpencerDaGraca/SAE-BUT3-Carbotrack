import express from 'express';
import { ElectromenagerController } from '../controller/ElectromenagerController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.use(authenticate); 

router.post('/', ElectromenagerController.ajouterAppareil);
router.get('/logement/:logementId', ElectromenagerController.getAppareilsByLogement);
router.put('/:id', ElectromenagerController.updateAppareil);
router.delete('/:id', ElectromenagerController.supprimerAppareil);

export default router;