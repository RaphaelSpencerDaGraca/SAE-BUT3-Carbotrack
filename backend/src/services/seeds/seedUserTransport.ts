import type { PoolClient } from "pg";
import { calculateTripEmissionsKgCO2 } from "../co2Calculator";

import type { Vehicle } from "../../../../shared/vehicle.type";
import type { Trip } from "../../../../shared/trip.type";

// types existants
type SeedVehicle = Pick<Vehicle, "name" | "plate" | "type" | "fuelType" | "consumptionLPer100">;

type SeedTrip = Pick<Trip, "date" | "fromCity" | "toCity" | "distanceKm" | "tag"> & {
    vehicleIndex: number;
};

export async function seedUserTransportData(client: PoolClient, userId: string) {
    const vehicles: SeedVehicle[] = [
        {
            name: "Citadine (test)",
            plate: "AA-123-AA",
            type: "Voiture",
            fuelType: "essence",
            consumptionLPer100: 6.2,
        },
        {
            name: "Diesel (test)",
            plate: "BB-456-BB",
            type: "Voiture",
            fuelType: "diesel",
            consumptionLPer100: 5.4,
        },
        {
            name: "Électrique (test)",
            plate: "CC-789-CC",
            type: "Voiture",
            fuelType: "electrique",
            consumptionLPer100: 0,
        },
    ];

    const insertedVehicleIds: number[] = [];

    for (const v of vehicles) {
        const r = await client.query(
            `
                INSERT INTO vehicles (user_id, name, plate, type, fuel_type, consumption_l_per_100)
                VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING id
            `,
            [
                userId,
                v.name,
                v.plate ?? null,
                v.type ?? null,
                v.fuelType,
                v.consumptionLPer100 ?? null,
            ]
        );
        insertedVehicleIds.push(r.rows[0].id);
    }

    const today = new Date();
    const toYMD = (d: Date) => d.toISOString().slice(0, 10);
    const minusDays = (n: number) => {
        const d = new Date(today);
        d.setDate(d.getDate() - n);
        return toYMD(d);
    };

    const trips: SeedTrip[] = [
        {
            vehicleIndex: 0,
            date: minusDays(2),
            fromCity: "Paris",
            toCity: "Versailles",
            distanceKm: 22.5,
            tag: "Test",
        },
        {
            vehicleIndex: 1,
            date: minusDays(6),
            fromCity: "Lyon",
            toCity: "Villeurbanne",
            distanceKm: 7.8,
            tag: "Domicile-Travail",
        },
        {
            vehicleIndex: 0,
            date: minusDays(12),
            fromCity: "Marseille",
            toCity: "Aix-en-Provence",
            distanceKm: 31.2,
            tag: "Week-end",
        },
    ];

    for (const t of trips) {
        const vehicleId = insertedVehicleIds[t.vehicleIndex];
        const v = vehicles[t.vehicleIndex];

        const co2 =
            calculateTripEmissionsKgCO2(
                {
                    // @ts-ignore
                    fuelType: v.fuelType,
                    // @ts-ignore
                    consumptionLPer100: v.consumptionLPer100 || null,
                },
                t.distanceKm
            ) ?? 0;

        await client.query(
            `
                INSERT INTO trips (user_id, vehicle_id, date, from_city, to_city, distance_km, co2_kg, tag)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `,
            [
                userId,
                vehicleId,
                t.date,
                t.fromCity,
                t.toCity,
                t.distanceKm,
                co2,
                t.tag ?? null,
            ]
        );
    }
}
