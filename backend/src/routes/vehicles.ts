// backend/src/routes/vehicles.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { insertVehicle, listVehiclesByUser } from '../models/vehicles';

const router = Router();

router.get('/', authenticate, async (req: any, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Utilisateur non authentifié.' });

        const vehicles = await listVehiclesByUser(userId);
        return res.json(vehicles);
    } catch (error) {
        console.error('Erreur SQL (GET /vehicles):', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/', authenticate, async (req: any, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Utilisateur non authentifié.' });

        const { name, plate, type, fuelType, consumptionLPer100 } = req.body;

        if (!name || !fuelType) {
            return res.status(400).json({ error: 'Le nom et le type de carburant sont obligatoires.' });
        }

        const created = await insertVehicle({
            userId,
            name,
            plate: plate || null,
            type: type || null,
            fuelType,
            consumptionLPer100:
                consumptionLPer100 !== undefined && consumptionLPer100 !== ''
                    ? Number(consumptionLPer100)
                    : null,
        });

        return res.status(201).json(created);
    } catch (error) {
        console.error('Erreur SQL (POST /vehicles):', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;