//backend\src\routes\ProduitRouter.ts
import { Router } from 'express';
import { getProduits, getProduit, createNewProduit, updateExistingProduit, deleteExistingProduit } from '../controller/ProduitController';
import { authenticate } from '../middlewares/auth'; 

const routerProduits = Router();

// Routes publiques
routerProduits.get('/', getProduits);
routerProduits.get('/:id', getProduit);

// Routes protégées
routerProduits.post('/', authenticate, createNewProduit);
routerProduits.put('/:id', authenticate, updateExistingProduit);
routerProduits.delete('/:id', authenticate, deleteExistingProduit);

export default routerProduits;