// backend/src/routes/debug.ts

import { Router, Request, Response } from 'express';
import {
    calculateEmissionsPerKm,
    calculateTripEmissionsKgCO2
} from '../services/co2Calculator';
import type { FuelType } from "../../../shared/vehicle.type";

import { recalculateAllTripsCo2 } from '../services/tripsUpdater';

const router = Router();

/**
 * GET /api/debug/carbon
 * Test "unitaire" du co2Calculator
 */
router.get('/carbon', (req: Request, res: Response) => {
    const fuelType = (req.query.fuelType as FuelType) || 'essence';
    const consumptionLPer100 = req.query.consumption
        ? Number(req.query.consumption)
        : undefined;

    const distanceKm = req.query.distance
        ? Number(req.query.distance)
        : undefined;

    if (!consumptionLPer100 || Number.isNaN(consumptionLPer100)) {
        return res.status(400).json({
            error: "Paramètre 'consumption' (L/100km) obligatoire et numérique"
        });
    }

    if (distanceKm !== undefined && Number.isNaN(distanceKm)) {
        return res.status(400).json({
            error: "Paramètre 'distance' doit être numérique s'il est fourni"
        });
    }

    const perKm = calculateEmissionsPerKm({
        fuelType,
        consumptionLPer100
    });

    const tripKg =
        distanceKm !== undefined
            ? calculateTripEmissionsKgCO2(
                { fuelType, consumptionLPer100 },
                distanceKm
            )
            : null;

    return res.json({
        fuelType,
        consumptionLPer100,
        distanceKm: distanceKm ?? null,
        gCO2ePerKm: perKm,
        tripKgCO2e: tripKg
    });
});


 // Déclenche l'update de co2_kg pour tous les trips existants.
 // Logique métier externalisée dans services/tripCo2Updater.ts

router.post('/recalculate-trips-co2', async (req: Request, res: Response) => {
    try {
        const stats = await recalculateAllTripsCo2();
        return res.json(stats);
    } catch (error) {
        console.error('Erreur recalcul CO2 trips :', error);
        return res
            .status(500)
            .json({ error: 'Erreur lors du recalcul des émissions des trajets' });
    }
});

export default router;
