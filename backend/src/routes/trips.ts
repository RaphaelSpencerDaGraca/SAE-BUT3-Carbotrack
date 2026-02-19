// backend/src/routes/trips.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { calculateTripEmissionsKgCO2 } from '../services/co2Calculator';
import { getOwnedVehicleForTrip } from '../models/vehicles';
import { insertTrip, listTripsByUser, deleteTripByUser } from '../models/trips';
import { updateTripByUser } from "../models/trips";

const PUBLIC_TRANSPORTS = [
    { label: "Train (TGV)", co2PerKm: 2.3 }, // g/km
    { label: "Train (TER/Intercités)", co2PerKm: 24.8 },
    { label: "Avion (Moyen)", co2PerKm: 230 },
    { label: "Métro / RER", co2PerKm: 4 },
    { label: "Bus", co2PerKm: 104 },
    { label: "Tramway", co2PerKm: 3 },
];

function computeCo2Kg(vehicle: any, distanceKm: number) {
    if (vehicle?.type?.toLowerCase() === "transport") {
        const mode = PUBLIC_TRANSPORTS.find(
            (m) => m.label.toLowerCase().trim() === String(vehicle.name).toLowerCase().trim()
        );
        if (mode) return (distanceKm * mode.co2PerKm) / 1000;
    }

    return (
        calculateTripEmissionsKgCO2(

            {
                fuelType: vehicle.fuelType,
                consumptionLPer100: vehicle.consumptionLPer100 ?? null,
            },
            distanceKm
        ) ?? 0
    );
}

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

        console.log("🚗 Vehicle reçu:", vehicle);
        console.log("📏 Distance:", dist);
        console.log("🧮 CO2 calculé:", computeCo2Kg(vehicle, dist));

        const co2Kg = computeCo2Kg(vehicle, dist);



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

router.delete("/:id", authenticate, async (req: any, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: "Utilisateur non authentifié." });

        const tripId = Number(req.params.id);
        if (Number.isNaN(tripId)) {
            return res.status(400).json({ error: "id invalide" });
        }

        const deleted = await deleteTripByUser(userId, tripId);
        if (!deleted) return res.status(404).json({ error: "Trajet introuvable." });

        return res.status(204).send();
    } catch (e) {
        console.error("Erreur DELETE /api/trips/:id:", e);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});

router.patch("/:id", authenticate, async (req: any, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: "Utilisateur non authentifié." });

        const tripId = Number(req.params.id);
        if (Number.isNaN(tripId)) return res.status(400).json({ error: "id invalide" });

        const { date, fromCity, toCity, distanceKm, vehicleId, tag } = req.body ?? {};

        // on récupère la trip existante pour recalculer le CO2 correctement
        const trips = await listTripsByUser(userId);
        const current = (trips as any[]).find((t) => Number(t.id) === tripId);
        if (!current) return res.status(404).json({ error: "Trajet introuvable." });

        const patch: any = {};

        if (date !== undefined) patch.date = date;
        if (fromCity !== undefined) patch.fromCity = String(fromCity);
        if (toCity !== undefined) patch.toCity = String(toCity);

        if (distanceKm !== undefined) {
            const dist = Number(distanceKm);
            if (Number.isNaN(dist) || dist <= 0) return res.status(400).json({ error: "distanceKm invalide" });
            patch.distanceKm = dist;
        }

        if (vehicleId !== undefined) {
            const vehicleIdNum = Number(vehicleId);
            if (Number.isNaN(vehicleIdNum)) return res.status(400).json({ error: "vehicleId invalide" });
            patch.vehicleId = vehicleIdNum;
        }

        if (tag !== undefined) patch.tag = tag ? String(tag) : null;

        // recalcul CO2 avec (vehicleId + distanceKm) finaux
        const finalVehicleId = patch.vehicleId ?? current.vehicleId;
        const finalDistanceKm = patch.distanceKm ?? current.distanceKm;

        const vehicle = await getOwnedVehicleForTrip(userId, Number(finalVehicleId));
        if (!vehicle) return res.status(403).json({ error: "Ce véhicule ne t'appartient pas (ou n'existe pas)." });

        patch.co2Kg = computeCo2Kg(vehicle, Number(finalDistanceKm));

        const updated = await updateTripByUser(userId, tripId, patch);
        if (!updated) return res.status(404).json({ error: "Trajet introuvable." });

        // Optionnel mais utile pour l'UI: renvoyer vehicleName
        return res.json({
            ...updated,
            vehicleName: vehicle.name,
        });
    } catch (e) {
        console.error("Erreur PATCH /api/trips/:id:", e);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});


export default router;
