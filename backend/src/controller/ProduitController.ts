// backend/src/controller/ProduitController.ts
import { Request, Response } from 'express';
import { getProduitById, createProduit, updateProduit, deleteProduit, getAllProduits, searchProduits} from '../models/produit';


export const searchProduitsController = async (req: Request, res: Response) => {
    try {
        const { q, categorie } = req.query;
        if (!q || typeof q !== 'string') {
            return res.json([]);
        }
        let categoryFilter: string | undefined = undefined;

        if (typeof categorie === 'string') {
            const catLower = categorie.toLowerCase();
            if (catLower !== 'alimentation') {
                categoryFilter = categorie;
            }
        }
        const produits = await searchProduits(q, categoryFilter);
        res.json(produits);
    } catch (error) {
        console.error('Erreur lors de la recherche de produits:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la recherche' });
    }
};


export const getProduits = async (req: Request, res: Response) => {
    try {
        const produits = await getAllProduits();
        res.json(produits);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const getProduit = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'ID manquant' });
        }
        const produit = await getProduitById(parseInt(id, 10));
        if (!produit) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json(produit);
    } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export const createNewProduit = async (req: Request, res: Response) => {
    try {
        const produit = await createProduit(req.body);
        res.status(201).json(produit);
    } catch (error) {
        console.error('Erreur lors de la création du produit:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const updateExistingProduit = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'ID manquant' });
        }
        const produit = await updateProduit(parseInt(id, 10), req.body);
        if (!produit) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json(produit);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export const deleteExistingProduit = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'ID manquant' });
        }
        const success = await deleteProduit(parseInt(id, 10));
        if (!success) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};