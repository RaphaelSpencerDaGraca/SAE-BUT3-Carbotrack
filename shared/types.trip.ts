// shared/types.trip.ts
export interface Trip{
    id: number;
    date: string;
    from: string;
    to: string;
    distanceKm: number;
    vehicleName: string;
    co2Kg: number;
    tag?: string;
}