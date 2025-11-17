// backend/src/db.ts
import { Pool } from 'pg';

export const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'user',
    password: '1234',
    database: 'carbotrack_db'
});
