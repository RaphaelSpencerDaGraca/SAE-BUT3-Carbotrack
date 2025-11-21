// src/routes/trips.ts

import { Router } from 'express';
import pool from '../config/db'; // même import que dans vehicles.ts

const router = Router();

// GET /api/trips
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                t.id,
                t.user_id AS "userId",
                t.vehicle_id AS "vehicleId",
                to_char(t.date, 'YYYY-MM-DD') AS "date",
                t.from_city AS "fromCity",
                t.to_city AS "toCity",
                t.distance_km::float AS "distanceKm",
                    v.name AS "vehicleName",
                t.co2_kg::float AS "co2Kg",
                    t.tag,
                t.created_at AS "createdAt"
            FROM trips t
                     LEFT JOIN vehicles v ON v.id = t.vehicle_id
            ORDER BY t.date DESC, t.id DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Erreur SQL /api/trips :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;
