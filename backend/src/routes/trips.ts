// backend/src/routes/trips.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { calculateTripEmissionsKgCO2 } from '../services/co2Calculator';
import { getOwnedVehicleForTrip } from '../models/vehicles';
import { insertTrip, listTripsByUser } from '../models/trips';

const router = Router();

router.get('/', authenticate, async (req: any, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Utilisateur non authentifié.' });

        const trips = await listTripsByUser(userId);
        return res.json(trips);
    } catch (error) {
        console.error('Erreur SQL GET /api/trips :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/', authenticate, async (req: any, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Utilisateur non authentifié.' });

        const { date, fromCity, toCity, distanceKm, vehicleId, tag } = req.body ?? {};

        if (!date || !fromCity || !toCity || distanceKm === undefined || !vehicleId) {
            return res.status(400).json({ error: 'Champs requis: date, fromCity, toCity, distanceKm, vehicleId' });
        }

        const dist = Number(distanceKm);
        if (Number.isNaN(dist) || dist <= 0) {
            return res.status(400).json({ error: 'distanceKm doit être un nombre > 0' });
        }

        const vehicleIdNum = Number(vehicleId);
        if (Number.isNaN(vehicleIdNum)) {
            return res.status(400).json({ error: 'vehicleId invalide' });
        }

        // Ownership via vehicle
        const vehicle = await getOwnedVehicleForTrip(userId, vehicleIdNum);
        if (!vehicle) {
            return res.status(403).json({ error: "Ce véhicule ne t'appartient pas (ou n'existe pas)." });
        }

        const co2Kg =
            calculateTripEmissionsKgCO2(
                {
                    fuelType: vehicle.fuelType,
                    consumptionLPer100: vehicle.consumptionLPer100 ?? null,
                },
                dist
            ) ?? 0;

        const createdRow = await insertTrip({
            userId,
            vehicleId: vehicleIdNum,
            date,
            fromCity,
            toCity,
            distanceKm: dist,
            co2Kg,
            tag: tag ?? null,
        });

        return res.status(201).json({
            ...createdRow,
            userId,
            vehicleName: vehicle.name,
        });
    } catch (error) {
        console.error('Erreur SQL POST /api/trips :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;
