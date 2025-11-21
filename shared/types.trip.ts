export interface Trip {
    id: number;
    userId?: string;
    vehicleId?: number;
    date: string;
    fromCity: string;
    toCity: string;
    distanceKm: number;
    vehicleName?: string;
    co2Kg: number;
    tag?: string;
    createdAt?: string;
}