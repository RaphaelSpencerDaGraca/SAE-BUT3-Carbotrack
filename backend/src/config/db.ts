import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || '1234',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'carbotrack_db',
});


export const testConnection = async (): Promise<void> => {
    try {
        const res = await pool.query<{ now: string }>('SELECT NOW()');
        if (res.rows.length > 0) {
            // @ts-ignore
            console.log('Connecté à PostgreSQL à:', res.rows[0].now);
        } else {
            console.error('Aucune ligne retournée par SELECT NOW()');
        }
    } catch (err) {
        console.error('Erreur de connexion à PostgreSQL:', err);
    }
};

testConnection();  // Appelle la fonction de test

export default pool;
