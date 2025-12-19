// frontend/src/services/vehicleService.ts
import api from "./api";
import type { Vehicle } from "../../../shared/vehicle.type";

export type CreateVehiclePayload = {
    name: string;
    plate?: string;
    type?: string;
    fuelType: Vehicle["fuelType"];
    consumptionLPer100?: number | "";
};

// GET /api/vehicles
export async function getVehicles(): Promise<Vehicle[]> {
    const res = await api.get<Vehicle[]>("/vehicles");
    return res.data;
}

// POST /api/vehicles
export async function createVehicle(payload: CreateVehiclePayload): Promise<Vehicle> {
    const res = await api.post<Vehicle>("/vehicles", payload);
    return res.data;
}