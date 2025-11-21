// backend/src/services/co2Calculator.ts

// On redéclare ici le type de carburant pour que le service soit autonome.
// Tu pourras le factoriser plus tard si tu as un type commun front/back.
export type FuelType =
    | 'essence'
    | 'diesel'
    | 'electrique'
    | 'hybride'
    | 'gpl'
    | 'autre';

// Interface minimale dont le calcul a besoin.
// Tu peux aussi directement passer fuelType + consumptionLPer100 en arguments
// si tu préfères.
export interface CarbonVehicleInput {
    fuelType: FuelType;
    consumptionLPer100?: number | null; // L/100 km
}

// Facteurs d'émission en kgCO2e / litre (ordre de grandeur)
// Tu pourras les affiner plus tard avec les valeurs ADEME/Base Carbone.
const FUEL_EMISSION_FACTORS_KG_PER_L: Record<FuelType, number> = {
    essence: 2.3,
    diesel: 2.6,
    gpl: 1.7,
    electrique: 0, // ici 0 direct échappement; ACV plus complète = autre sujet
    hybride: 2.0,  // valeur moyenne fictive, à affiner si besoin
    autre: 0       // par défaut, on met 0 en attendant mieux
};

/**
 * Renvoie le facteur d'émission (kgCO2e/L) pour un type de carburant.
 */
export function getFuelEmissionFactor(fuelType: FuelType): number {
    return FUEL_EMISSION_FACTORS_KG_PER_L[fuelType] ?? 0;
}

/**
 * Calcule les émissions en gCO2e/km à partir de la conso (L/100km) et du carburant.
 *
 * Formule : gCO2e/km = conso(L/100km) * facteur(kg/L) * 10
 * (car 1 kg = 1000 g et /100 km → * 10)
 *
 * Retourne `null` si la conso n'est pas renseignée ou <= 0.
 */
export function calculateEmissionsPerKm(
    vehicle: CarbonVehicleInput
): number | null {
    const { fuelType, consumptionLPer100 } = vehicle;

    if (!consumptionLPer100 || consumptionLPer100 <= 0) {
        return null;
    }

    const factorPerLitre = getFuelEmissionFactor(fuelType);

    // gCO2e/km
    const gPerKm = consumptionLPer100 * factorPerLitre * 10;
    return gPerKm;
}

/**
 * Calcule les émissions totales d'un trajet en kgCO2e.
 *
 * - `distanceKm` : distance du trajet en km
 * - utilise la même formule que calculateEmissionsPerKm, puis multiplie par la distance.
 *
 * Retourne `null` si la conso n'est pas assez renseignée.
 */
export function calculateTripEmissionsKgCO2(
    vehicle: CarbonVehicleInput,
    distanceKm: number
): number | null {
    if (distanceKm <= 0) {
        return 0;
    }

    const gPerKm = calculateEmissionsPerKm(vehicle);
    if (gPerKm === null) {
        return null;
    }

    // total gCO2e = gCO2e/km * distance(km)
    const total_g = gPerKm * distanceKm;

    // conversion en kg
    const total_kg = total_g / 1000;
    return total_kg;
}
