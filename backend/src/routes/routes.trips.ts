// src/routes/trips.ts

import { Router } from 'express';
import pool from '../config/db'; // même import que dans vehicles.ts

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                to_char(date, 'YYYY-MM-DD') AS "date",
                from_city AS "from",
                to_city AS "to",
                distance_km::float AS "distanceKm",
                vehicle_name AS "vehicleName",
                co2_kg::float AS "co2Kg",
                tag
            FROM trips
            ORDER BY date DESC, id DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Erreur SQL /api/trips :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;
