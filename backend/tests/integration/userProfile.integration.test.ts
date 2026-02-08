import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from 'vitest';
import { testPool, initTestDb, clearTestDb, closeTestDb } from '../setup/test_db';

vi.mock('../../src/config/db', () => ({ default: testPool }));

import { createUserProfile, getUserProfileByUserId, updateUserProfile } from '../../src/models/userProfile';

describe('Integration - User Profile', () => {
    
    beforeAll(async () => { await initTestDb(); });
    beforeEach(async () => { await clearTestDb(); });
    afterAll(async () => { await closeTestDb(); });

    it('devrait créer et récupérer un profil utilisateur', async () => {
        // 1. Créer un User (Foreign Key)
        const userInsert = await testPool.query(`INSERT INTO users (email) VALUES ('profile@test.com') RETURNING id`);
        const userId = userInsert.rows[0].id;

        // 2. Créer le Profil
        const created = await createUserProfile({
            user_id: userId,
            emission_co2_transport: 100,
            emission_co2_lifestyle: 50,
            pseudo: 'EcoloTest', 
            genre: 'Homme'
        });

        expect(created.user_id).toBe(userId);
        expect(Number(created.emission_co2_transport)).toBe(100);

        // 3. Récupérer
        const fetched = await getUserProfileByUserId(userId);
        expect(fetched).toBeDefined();
        
      
        expect(fetched?.pseudo).toBeNull(); 

    });

    it('devrait mettre à jour le profil (ADDITION des valeurs)', async () => {
      
        const userInsert = await testPool.query(`INSERT INTO users (email) VALUES ('update@test.com') RETURNING id`);
        const userId = userInsert.rows[0].id;
        
        await createUserProfile({
            user_id: userId,
            emission_co2_transport: 100,
            emission_co2_lifestyle: 0
        });

       
        await updateUserProfile(userId, {
            emission_co2_transport: 50, 
            pseudo: 'NouveauPseudo'     
        });

        // VÉRIFICATION
        const updated = await getUserProfileByUserId(userId);
        
        expect(Number(updated?.emission_co2_transport)).toBe(150); 
        expect(updated?.pseudo).toBe('NouveauPseudo'); 
    });

    it('devrait supprimer le profil en cascade quand l\'utilisateur est supprimé', async () => {
        const userInsert = await testPool.query(`INSERT INTO users (email) VALUES ('cascade@test.com') RETURNING id`);
        const userId = userInsert.rows[0].id;
        await createUserProfile({ user_id: userId, emission_co2_transport: 0, emission_co2_lifestyle: 0 });

       
        await testPool.query('DELETE FROM users WHERE id = $1', [userId]);

        const profile = await getUserProfileByUserId(userId);
        expect(profile).toBeNull();
    });
});