// frontend/src/services/vehicleService.ts
import api from "./api";
import type { Vehicle } from "../../../shared/vehicle.type";

export type CreateVehiclePayload = {
    name: string;
    plate?: string;
    type?: string;
    fuelType: Vehicle["fuelType"];
    consumptionLPer100?: number | null;
};

// GET /api/vehicles
export async function getVehicles(): Promise<Vehicle[]> {
    const res = await api.get<Vehicle[]>("/vehicles");
    return res.data;
}

// POST /api/vehicles
export async function createVehicle(payload: CreateVehiclePayload): Promise<Vehicle> {
    const res = await api.post("/vehicles", payload);
    return res.data as Vehicle;
}

export async function estimateConsumption(query: string, fuelType: Vehicle["fuelType"]) {
    const res = await api.get("/vehicles/estimate-consumption", {
        params: { query, fuelType },
    });
    return res.data as {
        consumptionLPer100Max: number;
        matchedLabel: string;
        unit: "L/100km" | "kWh/100km";
        source: string;
        type?: string;
    };
}
