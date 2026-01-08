// backend/src/routes/vehicles.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { insertVehicle, listVehiclesByUser } from '../models/vehicles';
import { estimateConsumptionMax } from "../services/vehicleConsumptionService";

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

router.get("/estimate-consumption", authenticate, (req: any, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: "Utilisateur non authentifié." });

        const query = String(req.query.query ?? "");
        const fuelType = String(req.query.fuelType ?? "") as any;

        if (!query || !fuelType) {
            return res.status(400).json({ error: "query et fuelType sont requis." });
        }

        const result = estimateConsumptionMax({ query, fuelType });

        if (!result) {
            return res.status(404).json({ error: "Aucune estimation trouvée." });
        }

        return res.json(result);
    } catch (e) {
        console.error("Erreur estimate-consumption:", e);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;