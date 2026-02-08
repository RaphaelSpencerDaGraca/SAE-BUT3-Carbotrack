import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from 'vitest';
import { testPool, initTestDb, clearTestDb, closeTestDb } from '../setup/test_db';

vi.mock('../../src/config/db', () => ({ default: testPool }));

import { getAllTypesChauffage, getTypeChauffageById } from '../../src/models/typeChauffage';

describe('Integration - Type Chauffage', () => {
    
    beforeAll(async () => { await initTestDb(); });
    beforeEach(async () => { 
        await clearTestDb(); 

        await testPool.query(`
            INSERT INTO type_chauffage (type_chauffage, consommation_moyenne_kwh_m2, facteur_emission_co2)
            VALUES 
            ('Solaire', 0, 0),
            ('Fioul', 300, 0.8)
            ON CONFLICT DO NOTHING
        `);
    });
    afterAll(async () => { await closeTestDb(); });

    it('devrait récupérer la liste complète des types de chauffage', async () => {
        const types = await getAllTypesChauffage();

        expect(types.length).toBeGreaterThanOrEqual(2);
        

        const solaire = types.find(t => t.type_chauffage === 'Solaire');
        expect(solaire).toBeDefined();
    });

    it('devrait récupérer un type spécifique par ID', async () => {
        const res = await testPool.query("SELECT id FROM type_chauffage WHERE type_chauffage = 'Fioul'");
        const fioulId = res.rows[0].id;

        const type = await getTypeChauffageById(fioulId);
        
        expect(type).toBeDefined();
        expect(type?.type_chauffage).toBe('Fioul');
        expect(Number(type?.consommation_moyenne_kwh_m2)).toBe(300);
    });
});