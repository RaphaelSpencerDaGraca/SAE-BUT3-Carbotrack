import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProduits, getProduit, createNewProduit, updateExistingProduit, deleteExistingProduit,searchProduitsController } from '../../src/controller/ProduitController'; // Adapte le chemin selon ta structure
import * as produitModel from '../../src/models/produit';

vi.mock('../../src/models/produit');

describe('ProduitController', () => {
    let req: any;
    let res: any;

 
    beforeEach(() => {
        vi.clearAllMocks();
        req = { params: {}, body: {}, query: {} };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            send: vi.fn(),
        };
    });


    describe('searchProduitsController', () => {
        it('devrait retourner un tableau vide si "q" est manquant', async () => {
            req.query = {}; 
            await searchProduitsController(req, res);
            expect(res.json).toHaveBeenCalledWith([]);
            expect(produitModel.searchProduits).not.toHaveBeenCalled();
        });

        it('devrait rechercher avec le terme donné', async () => {
            req.query = { q: 'pomme' };
            vi.mocked(produitModel.searchProduits).mockResolvedValue([]);
            
            await searchProduitsController(req, res);

            expect(produitModel.searchProduits).toHaveBeenCalledWith('pomme', undefined);
        });

        it('devrait filtrer par catégorie si elle n\'est pas "alimentation"', async () => {
            req.query = { q: 'iphone', categorie: 'High-Tech' };
            vi.mocked(produitModel.searchProduits).mockResolvedValue([]);

            await searchProduitsController(req, res);

            expect(produitModel.searchProduits).toHaveBeenCalledWith('iphone', 'High-Tech');
        });

        it('ne devrait PAS filtrer si la catégorie est "alimentation"', async () => {
            req.query = { q: 'pain', categorie: 'Alimentation' }; 
            vi.mocked(produitModel.searchProduits).mockResolvedValue([]);

            await searchProduitsController(req, res);

            expect(produitModel.searchProduits).toHaveBeenCalledWith('pain', undefined);
        });

        it('devrait gérer les erreurs serveur', async () => {
            req.query = { q: 'test' };
            vi.mocked(produitModel.searchProduits).mockRejectedValue(new Error('Boom'));
            await searchProduitsController(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getProduits', () => {
        it('devrait retourner la liste des produits', async () => {
            const mockList = [{ id: 1, nom: 'Produit A' }];
            vi.mocked(produitModel.getAllProduits).mockResolvedValue(mockList as any);

            await getProduits(req, res);

            expect(res.json).toHaveBeenCalledWith(mockList);
        });

        it('devrait gérer les erreurs 500', async () => {
            vi.mocked(produitModel.getAllProduits).mockRejectedValue(new Error('Erreur DB'));
            await getProduits(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getProduit', () => {
        it('devrait retourner un produit existant', async () => {
            req.params.id = '1';
            const mockProduit = { id: 1, nom: 'Produit 1' };
            vi.mocked(produitModel.getProduitById).mockResolvedValue(mockProduit as any);

            await getProduit(req, res);

            expect(produitModel.getProduitById).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(mockProduit);
        });

        it('devrait retourner 404 si non trouvé', async () => {
            req.params.id = '999';
            vi.mocked(produitModel.getProduitById).mockResolvedValue(null);

            await getProduit(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('devrait retourner 400 si l\'ID est absent', async () => {
            req.params.id = undefined;
            await getProduit(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });


    describe('createNewProduit', () => {
        it('devrait créer un produit et retourner 201', async () => {
            req.body = { nom: 'Nouveau Produit' };
            const created = { id: 1, nom: 'Nouveau Produit' };
            vi.mocked(produitModel.createProduit).mockResolvedValue(created as any);

            await createNewProduit(req, res);

            expect(produitModel.createProduit).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(created);
        });
    });


    describe('updateExistingProduit', () => {
        it('devrait mettre à jour et retourner le produit', async () => {
            req.params.id = '1';
            req.body = { nom: 'Produit Modifié' };
            const updated = { id: 1, nom: 'Produit Modifié' };
            
            vi.mocked(produitModel.updateProduit).mockResolvedValue(updated as any);

            await updateExistingProduit(req, res);

            expect(produitModel.updateProduit).toHaveBeenCalledWith(1, req.body);
            expect(res.json).toHaveBeenCalledWith(updated);
        });

        it('devrait retourner 404 si le produit à mettre à jour n\'existe pas', async () => {
            req.params.id = '999';
            vi.mocked(produitModel.updateProduit).mockResolvedValue(null);

            await updateExistingProduit(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });


    describe('deleteExistingProduit', () => {
        it('devrait supprimer et retourner 204', async () => {
            req.params.id = '1';
            vi.mocked(produitModel.deleteProduit).mockResolvedValue(true);

            await deleteExistingProduit(req, res);

            expect(produitModel.deleteProduit).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('devrait retourner 404 si suppression échouée (id introuvable)', async () => {
            req.params.id = '999';
            vi.mocked(produitModel.deleteProduit).mockResolvedValue(false);

            await deleteExistingProduit(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});