// frontend/src/services/tripService.ts
import api from "./api";
import type { Trip } from "../../../shared/trip.type";

export type CreateTripInput = {
    date: string;
    fromCity: string;
    toCity: string;
    distanceKm: number;
    vehicleId: string;
    tag?: string;
};

export async function getTrips(): Promise<Trip[]> {
    const res = await api.get<Trip[]>("/trips");
    return res.data;
}

export async function createTrip(input: CreateTripInput): Promise<Trip> {
    const res = await api.post<Trip>("/trips", input);
    return res.data;
}
