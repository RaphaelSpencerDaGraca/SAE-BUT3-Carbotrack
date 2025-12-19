// frontend/src/services/tripService.ts
import type { Trip } from "../../../shared/trip.type.ts";

export type CreateTripInput = {
    date: string;
    fromCity: string;
    toCity: string;
    distanceKm: number;
    vehicleId: string;
    tag?: string;
};

// @ts-ignore
const API_BASE = (import.meta as any).env?.VITE_API_URL ?? "/api";

function authHeaders(): Record<string, string> {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function readError(res: Response): Promise<string> {
    try {
        const txt = await res.text();
        return txt || `HTTP ${res.status}`;
    } catch {
        return `HTTP ${res.status}`;
    }
}

export async function getTrips(): Promise<Trip[]> {
    const res = await fetch(`${API_BASE}/trips`, {
        method: "GET",
        headers: {
            ...authHeaders(),
        },
    });

    if (res.status === 401) throw new Error("Non authentifié : reconnecte-toi.");
    if (!res.ok) throw new Error(await readError(res));

    return (await res.json()) as Trip[];
}

export async function createTrip(input: CreateTripInput): Promise<Trip> {
    const res = await fetch(`${API_BASE}/trips`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
        },
        body: JSON.stringify(input),
    });

    if (res.status === 401) throw new Error("Non authentifié : reconnecte-toi.");
    if (!res.ok) throw new Error(await readError(res));

    return (await res.json()) as Trip;
}
