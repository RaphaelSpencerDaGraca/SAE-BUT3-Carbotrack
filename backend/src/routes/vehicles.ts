// src/routes/vehicles.ts

import { Router } from 'express';
import { pool } from '../db';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM vehicles');
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur SQL :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;
