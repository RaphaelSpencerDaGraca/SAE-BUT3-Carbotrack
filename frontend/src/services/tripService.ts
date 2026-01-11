// frontend/src/services/tripService.ts
import api from "./api";
import type { Trip } from "../../../shared/trip.type";
import { getVehicles, createVehicle, deleteVehicle } from "@/services/vehicleService";

export type CreateTripInput = {
    date: string;
    fromCity: string;
    toCity: string;
    distanceKm: number;
    vehicleId: string;
    tag?: string;
};

export type UpdateTripPayload = Partial<{
    date: string;
    fromCity: string;
    toCity: string;
    distanceKm: number;
    vehicleId: string;
    tag?: string;
}>;

export async function getTrips(): Promise<Trip[]> {
    const res = await api.get<Trip[]>("/trips");
    return res.data;
}

export async function createTrip(input: CreateTripInput): Promise<Trip> {
    const res = await api.post<Trip>("/trips", input);
    return res.data;
}


export async function deleteTrip(id: number | string): Promise<void> {
    await api.delete(`/trips/${id}`);
}

export async function updateTrip(id: number | string, payload: UpdateTripPayload): Promise<Trip> {
    const res = await api.patch<Trip>(`/trips/${id}`, payload);
    return res.data;
}