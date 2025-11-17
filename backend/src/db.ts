import { Pool } from 'pg';

export const pool = new Pool({
    host: 'localhost',        // ou le nom du service docker si tu fais backend → docker DB
    port: 5432,
    user: 'user',
    password: '1234',
    database: 'carbotrack_db'
});
