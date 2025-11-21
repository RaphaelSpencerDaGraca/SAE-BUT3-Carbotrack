// backend/src/routes/debug.ts

import { Router, Request, Response } from 'express';
import {
    calculateEmissionsPerKm,
    calculateTripEmissionsKgCO2,
    FuelType
} from '../services/co2Calculator';

const router = Router();

/**
 * GET /api/debug/carbon
 * Exemples :
 *   /api/debug/carbon?fuelType=essence&consumption=6.5&distance=10
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

export default router;
