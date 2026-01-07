//backend\src\config\db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../..", ".env") });

const pool = new Pool({
    user: process.env.DB_USER || process.env.POSTGRES_USER,
    password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME || process.env.POSTGRES_DB,
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

export default pool;