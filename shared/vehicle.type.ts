// shared/vehicle.type.ts

export type FuelType = 'essence' | 'diesel' | 'electrique' | 'hybride' | 'gpl' | 'autre';

export interface Vehicle {
    id: string;
    name: string;           // ex: "Clio IV"
    plate?: string;         // ex: "AB-123-CD"
    type?: string;          // ex: "Citadine", "SUV"
    fuelType: FuelType;
    consumptionLPer100?: number; // conso moyenne
    createdAt?: string;     // ISO date string
}