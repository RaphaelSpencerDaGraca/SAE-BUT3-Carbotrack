// backend/src/services/tripCo2Updater.ts

import pool from "../config/db";
import { calculateTripEmissionsKgCO2 } from './co2Calculator';
import { FuelType } from '../../../shared/vehicle.type';

export interface TripCo2UpdateStats {
    totalTrips: number;
    updated: number;
    skipped: number;
}

/**
 * Recalcule co2_kg pour tous les trips existants en BDD
 * à partir de:
 *  - distance_km du trip
 *  - fuel_type + consumption_l_per_100 du véhicule
 */
export async function recalculateAllTripsCo2(): Promise<TripCo2UpdateStats> {
    // 1️⃣ Récupérer tous les trips + véhicule associé
    const result = await pool.query(`
        SELECT
            t.id AS trip_id,
            t.distance_km,
            v.fuel_type,
            v.consumption_l_per_100
        FROM trips t
                 JOIN vehicles v ON t.vehicle_id = v.id
    `);

    const totalTrips = result.rowCount ?? 0;

    let updated = 0;
    let skipped = 0;

    // 2️⃣ Boucler sur chaque trip et recalculer
    for (const row of result.rows) {
        const distanceKm = Number(row.distance_km);
        const consumption =
            row.consumption_l_per_100 !== null
                ? Number(row.consumption_l_per_100)
                : null;

        const fuelType = row.fuel_type as FuelType;

        const co2Kg = calculateTripEmissionsKgCO2(
            {
                fuelType,
                consumptionLPer100: consumption,
            },
            distanceKm
        );

        if (co2Kg === null) {
            skipped++;
            continue;
        }

        // 3️⃣ Mise à jour de la BDD
        await pool.query(
            `UPDATE trips SET co2_kg = $1 WHERE id = $2`,
            [co2Kg, row.trip_id]
        );

        updated++;
    }

    return {
        totalTrips,
        updated,
        skipped
    };
}
