// backend/src/routes/ProduitRouter.ts
import { Router } from 'express';

import { getProduits, getProduit, createNewProduit, updateExistingProduit, deleteExistingProduit,searchProduitsController} from '../controller/ProduitController';

const router = Router();

router.get('/search', searchProduitsController); 

router.get('/', getProduits);

router.get('/:id', getProduit); 

router.post('/', createNewProduit);
router.put('/:id', updateExistingProduit);
router.delete('/:id', deleteExistingProduit);

export default router;