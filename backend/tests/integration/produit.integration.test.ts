import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from 'vitest';
import { testPool, initTestDb, clearTestDb, closeTestDb } from '../setup/test_db';

vi.mock('../../src/config/db', () => ({
    default: testPool
}));

import { createProduit, getProduitById, searchProduits } from '../../src/models/produit';

describe('Integration - Modèle Produit', () => {
    
    beforeAll(async () => {
        await initTestDb();
    }); 

    beforeEach(async () => {
        await clearTestDb();
    });

    afterAll(async () => {
        await closeTestDb();
    });

    it('devrait créer un produit en base et le récupérer', async () => {
        // ACT : Création
        const nouveauProduit = {
            nom: 'Tomate Bio',
            categorie: 'Alimentation',
            sous_categorie: 'Légumes',
            emission_co2_par_unite: 0.5,
            unite: 'kg',
            source: 'Base Carbone',
            identifiant_source: '12345',
            description: 'Une bonne tomate'
        };
        
        const created = await createProduit(nouveauProduit as any);

        // ASSERT
        expect(created.id).toBeDefined();
        expect(created.nom).toBe('Tomate Bio');

        // ACT : Récupération
        const fetched = await getProduitById(created.id);
        
        // ASSERT
        expect(fetched).not.toBeNull();
        expect(fetched?.nom).toBe('Tomate Bio');
    });

    it('devrait faire fonctionner la recherche SQL (ILIKE)', async () => {
        // ARRANGE
        await createProduit({
            nom: 'Pomme', 
            categorie: 'Alimentation', 
            sous_categorie: 'Fruits',
            emission_co2_par_unite: 0.3, 
            unite: 'kg', 
            source: 'Manuel', 
            identifiant_source: '1', 
            description: 'Verte'
        } as any);
        
        await createProduit({
            nom: 'Steak', 
            categorie: 'Alimentation', 
            sous_categorie: 'Viande',
            emission_co2_par_unite: 15, 
            unite: 'kg', 
            source: 'Manuel', 
            identifiant_source: '2', 
            description: 'Boeuf'
        } as any);

        // ACT
        const results = await searchProduits('pomme');

        // ASSERT
        expect(results).toHaveLength(1);
        expect(results[0].nom).toBe('Pomme');
    });
});