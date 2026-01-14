// backend/src/models/trips.model.ts
import pool from '../config/db';

export async function listTripsByUser(userId: string) {
    const result = await pool.query(
        `
    SELECT
      t.id,
      v.user_id AS "userId",
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
    JOIN vehicles v ON v.id = t.vehicle_id
    WHERE v.user_id = $1
    ORDER BY t.date DESC, t.id DESC
    `,
        [userId]
    );

    return result.rows;
}

export async function insertTrip(args: {
    userId: string;
    vehicleId: number;
    date: string;
    fromCity: string;
    toCity: string;
    distanceKm: number;
    co2Kg: number;
    tag?: string | null;
}) {
    const result = await pool.query(
        `
    INSERT INTO trips (user_id, vehicle_id, date, from_city, to_city, distance_km, co2_kg, tag)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING
      id,
      vehicle_id AS "vehicleId",
      to_char(date, 'YYYY-MM-DD') AS "date",
      from_city AS "fromCity",
      to_city AS "toCity",
      distance_km::float AS "distanceKm",
      co2_kg::float AS "co2Kg",
      tag,
      created_at AS "createdAt"
    `,
        [
            args.userId,
            args.vehicleId,
            args.date,
            args.fromCity,
            args.toCity,
            args.distanceKm,
            args.co2Kg,
            args.tag ?? null,
        ]
    );

    return result.rows[0];
}

// CORRECTION ICI : userId est un string (UUID), pas un number
export async function deleteTripByUser(userId: string, tripId: number) {
    const result = await pool.query(
        `DELETE FROM trips
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
        [tripId, userId]
    );
    return result.rows[0] ?? null;
}

type UpdateTripInput = {
    date?: string;
    fromCity?: string;
    toCity?: string;
    distanceKm?: number;
    vehicleId?: number;
    tag?: string | null;
    co2Kg?: number;
};

// CORRECTION ICI : userId est un string (UUID)
export async function updateTripByUser(userId: string, tripId: number, input: UpdateTripInput) {
    const sets: string[] = [];
    const values: any[] = [];
    let idx = 1;

    function add(col: string, val: any) {
        if (val === undefined) return;
        sets.push(`${col} = $${idx++}`);
        values.push(val);
    }

    add("date", input.date);
    add("from_city", input.fromCity);
    add("to_city", input.toCity);
    add("distance_km", input.distanceKm);
    add("vehicle_id", input.vehicleId);
    add("tag", input.tag);
    add("co2_kg", input.co2Kg);

    if (sets.length === 0) return null;

    values.push(tripId, userId);

    const res = await pool.query(
        `UPDATE trips
         SET ${sets.join(", ")}
         WHERE id = $${idx++} AND user_id = $${idx}
             RETURNING *`,
        values
    );

    return res.rows[0] ?? null;
}