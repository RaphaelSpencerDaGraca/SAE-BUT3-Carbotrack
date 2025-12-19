// backend/src/models/vehicles.model.ts
import pool from '../config/db';
import type { FuelType } from "../../../shared/vehicle.type";

export type OwnedVehicleForTrip = {
    id: number;
    name: string;
    fuelType: FuelType;
    consumptionLPer100: number | null;
};

export async function getOwnedVehicleForTrip(userId: string, vehicleId: number): Promise<OwnedVehicleForTrip | null> {
    const result = await pool.query(
        `
            SELECT
                id,
                name,
                fuel_type AS "fuelType",
                consumption_l_per_100 AS "consumptionLPer100"
            FROM vehicles
            WHERE id = $1 AND user_id = $2
        `,
        [vehicleId, userId]
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
        ...row,
        fuelType: row.fuelType as FuelType,
    };
}
export async function listVehiclesByUser(userId: string) {
    const result = await pool.query(
        `
    SELECT
      id,
      user_id      AS "userId",
      name,
      plate,
      type,
      fuel_type    AS "fuelType",
      consumption_l_per_100 AS "consumptionLPer100",
      created_at   AS "createdAt"
    FROM vehicles
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
        [userId]
    );

    return result.rows;
}

export async function insertVehicle(args: {
    userId: string;
    name: string;
    plate?: string | null;
    type?: string | null;
    fuelType: string;
    consumptionLPer100?: number | null;
}) {
    const result = await pool.query(
        `
    INSERT INTO vehicles (
      user_id,
      name,
      plate,
      type,
      fuel_type,
      consumption_l_per_100
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      user_id      AS "userId",
      name,
      plate,
      type,
      fuel_type    AS "fuelType",
      consumption_l_per_100 AS "consumptionLPer100",
      created_at   AS "createdAt"
    `,
        [
            args.userId,
            args.name,
            args.plate ?? null,
            args.type ?? null,
            args.fuelType,
            args.consumptionLPer100 ?? null,
        ]
    );

    return result.rows[0];
}
