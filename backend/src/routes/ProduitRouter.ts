//backend\src\routes\ProduitRouter.ts
import { Router } from 'express';
import { getProduits, getProduit, createNewProduit, updateExistingProduit, deleteExistingProduit } from '../controller/ProduitController';
import { authenticate } from '../middlewares/auth'; 

const router = Router();

// Routes publiques
router.get('/', getProduits);
router.get('/:id', getProduit);

// Routes protégées
router.post('/', authenticate, createNewProduit);
router.put('/:id', authenticate, updateExistingProduit);
router.delete('/:id', authenticate, deleteExistingProduit);

export default router;