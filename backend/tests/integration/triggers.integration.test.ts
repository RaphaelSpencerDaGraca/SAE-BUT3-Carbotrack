import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from 'vitest';
import { testPool, initTestDb, clearTestDb, closeTestDb } from '../setup/test_db';

vi.mock('../../src/config/db', () => ({ default: testPool }));
import { createLogement } from '../../src/models/logement';

describe('Integration - Triggers SQL (Calcul Automatique CO2)', () => {
    
    beforeAll(async () => { await initTestDb(); });
    beforeEach(async () => { await clearTestDb(); });
    afterAll(async () => { await closeTestDb(); });

    it('devrait mettre à jour user_profiles quand on ajoute un logement', async () => {
        // A. Créer ou Récupérer un Type de Chauffage (Gestion du doublon)
        const chauffageInsert = await testPool.query(
            `INSERT INTO type_chauffage (type_chauffage, consommation_moyenne_kwh_m2, facteur_emission_co2) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (type_chauffage) DO UPDATE 
             SET consommation_moyenne_kwh_m2 = EXCLUDED.consommation_moyenne_kwh_m2
             RETURNING id`,
            ['Chauffage Test', 100, 0.5]
        );
        const chauffageId = chauffageInsert.rows[0].id;

        // B. Créer un Utilisateur
        const userInsert = await testPool.query(
            `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id`,
            ['trigger@test.com', 'hash_bidon']
        );
        const userId = userInsert.rows[0].id;

        // C. Créer son Profil Initial (0 CO2)
        await testPool.query(
            `INSERT INTO user_profiles (user_id, emission_co2_lifestyle) VALUES ($1, 0)`,
            [userId]
        );

        // D. Ajouter le logement via le modèle
        const nouveauLogement = {
            user_id: userId,
            superficie: 50,
            nombre_pieces: 2,
            type_chauffage_id: chauffageId,
            classe_isolation: 'D',
            zone_climatique: 'H1'
        };

        await createLogement(nouveauLogement as any);

        // E. Vérification
        const profilResult = await testPool.query(
            `SELECT emission_co2_lifestyle FROM user_profiles WHERE user_id = $1`,
            [userId]
        );

        const co2Total = parseFloat(profilResult.rows[0].emission_co2_lifestyle);
        console.log(`CO2 calculé automatiquement : ${co2Total} kg/an`);
        expect(co2Total).toBeGreaterThan(0);
    });
});