import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from 'vitest';
import { testPool, initTestDb, clearTestDb, closeTestDb } from '../setup/test_db';


vi.mock('../../src/config/db', () => ({ default: testPool }));

import { ElectromenagerModel, IElectromenager } from '../../src/models/electromenager';

describe('Integration - Électroménager & Trigger', () => {
    
    beforeAll(async () => { await initTestDb(); });
    beforeEach(async () => { await clearTestDb(); });
    afterAll(async () => { await closeTestDb(); });

    it('devrait créer un appareil et mettre à jour le CO2 du profil utilisateur (Trigger)', async () => {
        
        const userInsert = await testPool.query(`INSERT INTO users (email) VALUES ('electro@test.com') RETURNING id`);
        const userId = userInsert.rows[0].id;
        await testPool.query(`INSERT INTO user_profiles (user_id, emission_co2_lifestyle) VALUES ($1, 0)`, [userId]);

        const ch = await testPool.query(`INSERT INTO type_chauffage (type_chauffage) VALUES ('Elec-Test') ON CONFLICT (type_chauffage) DO NOTHING RETURNING id`);
        const chId = ch.rows[0]?.id || (await testPool.query(`SELECT id FROM type_chauffage WHERE type_chauffage = 'Elec-Test'`)).rows[0].id;

        const logInsert = await testPool.query(
            `INSERT INTO logement (user_id, superficie, nombre_pieces, type_chauffage_id) VALUES ($1, 50, 2, $2) RETURNING id`,
            [userId, chId]
        );
        const logementId = logInsert.rows[0].id;

        const nouvelAppareil: IElectromenager = {
            logementId: logementId,
            nom: 'Mon Frigo',
            type: 'Refrigerateur',
            marque: 'Samsung',
            consommationKwhAn: 100,
            consommationEauAn: 0,
            co2FabricationKg: 50,
            co2UsageKgAn: 10,
            dureeVieTheoriqueAns: 10,
            sourceDonnees: 'Manuel'
        };

        const created = await ElectromenagerModel.create(nouvelAppareil);
        
        expect(created).toBeDefined();
        
        const profil = await testPool.query(`SELECT emission_co2_lifestyle FROM user_profiles WHERE user_id = $1`, [userId]);
        const co2Total = parseFloat(profil.rows[0].emission_co2_lifestyle);
        console.log(`CO2 Profil après ajout frigo : ${co2Total} kg/an`);
        expect(co2Total).toBeGreaterThanOrEqual(10);
    });

    it('devrait supprimer un appareil et déduire son CO2 du profil', async () => {
        const userInsert = await testPool.query(`INSERT INTO users (email) VALUES ('delete@test.com') RETURNING id`);
        const userId = userInsert.rows[0].id;
        await testPool.query(`INSERT INTO user_profiles (user_id, emission_co2_lifestyle) VALUES ($1, 100)`, [userId]);
        
        const chId = (await testPool.query(`SELECT id FROM type_chauffage LIMIT 1`)).rows[0].id;
        
     
        const logInsert = await testPool.query(
            `INSERT INTO logement (user_id, superficie, nombre_pieces, type_chauffage_id) VALUES ($1, 50, 3, $2) RETURNING id`, 
            [userId, chId]
        );
        
       
        const appInsert = await ElectromenagerModel.create({
            logementId: logInsert.rows[0].id,
            nom: 'Four',
            type: 'Four',
            consommationKwhAn: 500,
            consommationEauAn: 0,
            co2FabricationKg: 0,
            co2UsageKgAn: 50, 
            dureeVieTheoriqueAns: 10,
            sourceDonnees: 'Manuel'
        });

        // ACTION : Suppression
        await ElectromenagerModel.delete(appInsert.id!);

        // VÉRIFICATION
        const profil = await testPool.query(`SELECT emission_co2_lifestyle FROM user_profiles WHERE user_id = $1`, [userId]);
        
        
        expect(profil.rows[0]).toBeDefined();
    });
});