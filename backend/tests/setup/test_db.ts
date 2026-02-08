// tests/setup/test_db.ts
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';


export const testPool = new Pool({
    user: 'test_user',
    password: 'test_password',
    host: 'localhost',
    port: 5433, 
    database: 'carbotrack_test',
});

export const initTestDb = async () => {
    const check = await testPool.query("SELECT to_regclass('public.users')");
    if (check.rows[0].to_regclass) {
        return; 
    }

    const sqlPath = path.join(__dirname, '../../sql/init.sql'); 
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    try {
        await testPool.query(sql);
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la DB de test :", error);
        throw error;
    }
};

export const clearTestDb = async () => {
    // On vide les tables de données mais PAS les tables de référence (comme type_chauffage)
    const tables = [
        'trips',
        'vehicles',
        'electromenager',
        'logement',
        'produit', 
        'user_profiles',
        'users'
    ];
    
    await testPool.query(`TRUNCATE TABLE ${tables.join(', ')} RESTART IDENTITY CASCADE`);
};

export const closeTestDb = async () => {
    await testPool.end();
};