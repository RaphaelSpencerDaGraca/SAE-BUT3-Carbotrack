//backend\src\config\db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || process.env.POSTGRES_USER || 'user',
    password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || '1234',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || process.env.POSTGRES_DB || 'carbotrack_db',
});

export const testConnection = async (): Promise<void> => {
    try {
        const res = await pool.query<{ now: string }>('SELECT NOW() as now');
        console.log('Connecté à PostgreSQL :', res.rows[0]?.now);
    } catch (err) {
        console.error('Erreur de connexion à PostgreSQL:', err);
        throw err;
    }
};

testConnection();  // Appelle la fonction de test

export default pool;
