import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from 'vitest';
import { testPool, initTestDb, clearTestDb, closeTestDb } from '../setup/test_db';


vi.mock('../../src/config/db', () => ({ default: testPool }));

import { createLogement, getLogementsByUserId, deleteLogementById, getLogementById } from '../../src/models/logement';

describe('Integration - Logement CRUD', () => {
    
    beforeAll(async () => { await initTestDb(); });
    beforeEach(async () => { await clearTestDb(); });
    afterAll(async () => { await closeTestDb(); });

    it('devrait gérer le cycle de vie complet d\'un logement', async () => {
        // --- 1. SETUP (Dépendances) ---
        
        // A. On crée un utilisateur
        const userInsert = await testPool.query(
            `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id`,
            ['crud@logement.com', 'hash']
        );
        const userId = userInsert.rows[0].id;

        // B. CORRECTION : On crée OBLIGATOIREMENT le profil associé
        // Car la table logement pointe vers user_profiles, pas users !
        await testPool.query(
            `INSERT INTO user_profiles (user_id, emission_co2_lifestyle) VALUES ($1, 0)`,
            [userId]
        );

        // C. On crée/récupère un type de chauffage
        const chauffageInsert = await testPool.query(
            `INSERT INTO type_chauffage (type_chauffage, consommation_moyenne_kwh_m2, facteur_emission_co2) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (type_chauffage) DO UPDATE SET consommation_moyenne_kwh_m2 = EXCLUDED.consommation_moyenne_kwh_m2
             RETURNING id`,
            ['Gaz', 200, 0.2]
        );
        const chauffageId = chauffageInsert.rows[0].id;

        // --- 2. CREATE (Création) ---
        const newLogement = {
            user_id: userId,
            superficie: 75,
            nombre_pieces: 3,
            type_chauffage_id: chauffageId,
            classe_isolation: 'C',
            zone_climatique: 'H1'
        };

        const created = await createLogement(newLogement as any);
        expect(created.id).toBeDefined();
        expect(created.superficie).toBe(75);

        // --- 3. READ (Lecture par User ID) ---
        const userLogements = await getLogementsByUserId(userId);
        expect(userLogements).toHaveLength(1);
        expect(userLogements[0].id).toBe(created.id);

        // --- 4. READ (Lecture par ID Logement) ---
        const fetchedLogement = await getLogementById(created.id);
        expect(fetchedLogement).toBeDefined();
        expect(fetchedLogement.classe_isolation).toBe('C');

        // --- 5. DELETE (Suppression) ---
        await deleteLogementById(created.id);

        // Vérification que c'est bien supprimé
        const afterDelete = await getLogementById(created.id);
        expect(afterDelete).toBeUndefined(); 
    });
});