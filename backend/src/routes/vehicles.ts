// backend/src/routes/vehicles.ts
import { Router } from "express";
import pool from "../config/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Récupérer les véhicules de l'utilisateur connecté
router.get("/", authenticate, async (req: any, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "Utilisateur non authentifié." });
        }

        const userId = req.user.userId;

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

        res.json(result.rows);
    } catch (error) {
        console.error("Erreur SQL (GET /vehicles):", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// 🔹 Créer un véhicule
router.post("/", authenticate, async (req: any, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "Utilisateur non authentifié." });
        }

        const userId = req.user.userId;

        const {
            name,
            plate,
            type,
            fuelType,
            consumptionLPer100,
        } = req.body;

        if (!name || !fuelType) {
            return res
                .status(400)
                .json({ error: "Le nom et le type de carburant sont obligatoires." });
        }

        const query = `
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
        `;

        const values = [
            userId,
            name,
            plate || null,
            type || null,
            fuelType,
            consumptionLPer100 !== undefined && consumptionLPer100 !== ""
                ? Number(consumptionLPer100)
                : null,
        ];

        const result = await pool.query(query, values);
        const createdVehicle = result.rows[0];

        res.status(201).json(createdVehicle);
    } catch (error) {
        console.error("Erreur SQL (POST /vehicles):", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;