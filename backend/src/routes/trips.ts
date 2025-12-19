// backend/src/routes/trips.ts
import { Router } from "express";
import pool from "../config/db";
import { authenticate } from "../middlewares/auth";
import { calculateTripEmissionsKgCO2 } from "../services/co2Calculator";

const router = Router();

/**
 * GET /api/trips
 * => ne renvoie que les trips des véhicules appartenant à l'utilisateur
 */
router.get("/", authenticate, async (req: any, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: "Utilisateur non authentifié." });

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

        res.json(result.rows);
    } catch (error) {
        console.error("Erreur SQL GET /api/trips :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/**
 * POST /api/trips
 * Body attendu:
 * { date, fromCity, toCity, distanceKm, vehicleId, tag? }
 *
 * => refuse si le vehicleId n'appartient pas au user connecté
 */
router.post("/", authenticate, async (req: any, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: "Utilisateur non authentifié." });

        const { date, fromCity, toCity, distanceKm, vehicleId, tag } = req.body ?? {};

        if (!date || !fromCity || !toCity || distanceKm === undefined || !vehicleId) {
            return res.status(400).json({ error: "Champs requis: date, fromCity, toCity, distanceKm, vehicleId" });
        }

        const dist = Number(distanceKm);
        if (Number.isNaN(dist) || dist <= 0) {
            return res.status(400).json({ error: "distanceKm doit être un nombre > 0" });
        }

        const vehicleIdNum = Number(vehicleId);
        if (Number.isNaN(vehicleIdNum)) {
            return res.status(400).json({ error: "vehicleId invalide" });
        }

        // 1) Vérifier que le véhicule appartient à l'utilisateur + récupérer données pour CO2
        const veh = await pool.query(
            `
      SELECT
        id,
        name,
        fuel_type AS "fuelType",
        consumption_l_per_100 AS "consumptionLPer100"
      FROM vehicles
      WHERE id = $1 AND user_id = $2
      `,
            [vehicleIdNum, userId]
        );

        if (veh.rowCount === 0) {
            return res.status(403).json({ error: "Ce véhicule ne t'appartient pas (ou n'existe pas)." });
        }

        const vehicle = veh.rows[0];

        // 2) Calcul CO2 côté serveur
        const co2Kg =
            calculateTripEmissionsKgCO2(
                {
                    fuelType: vehicle.fuelType,
                    consumptionLPer100: vehicle.consumptionLPer100 ?? undefined,
                },
                dist
            ) ?? 0;

        // 3) Insert trip
        const inserted = await pool.query(
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
            [userId, vehicleIdNum, date, fromCity, toCity, dist, co2Kg, tag ?? null]
        );

        // 4) Réponse au format attendu par le front (avec vehicleName)
        const row = inserted.rows[0];
        return res.status(201).json({
            ...row,
            userId,
            vehicleName: vehicle.name,
        });
    } catch (error) {
        console.error("Erreur SQL POST /api/trips :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;
