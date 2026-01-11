// frontend/src/services/co2BenchmarkService.ts

export type Co2BenchmarkResult = {
    helperText: string;
    helperClassName: string;
};

// Valeur temporaire (hard codée) pour comparer l’empreinte de l’utilisateur à une “référence population”.
// TODO: remplacer par une vraie référence (percentiles réels, moyenne FR, par période, etc.).
export const POPULATION_REFERENCE_KG = 2000;

export function getCo2Benchmark(params: {
    totalCo2Kg: number;
    isLoading: boolean;
    referenceKg?: number;
}): Co2BenchmarkResult {
    const { totalCo2Kg, isLoading, referenceKg = POPULATION_REFERENCE_KG } = params;

    if (isLoading) {
        return {
            // TODO: déplacer ce texte dans translations.ts + utiliser t("...") au lieu d’un texte en dur
            helperText: "Calcul en cours…",
            helperClassName: "text-slate-400",
        };
    }

    if (totalCo2Kg <= referenceKg) {
        return {
            // TODO: déplacer ce texte dans translations.ts + utiliser t("...") au lieu d’un texte en dur
            helperText: "Bravo ! vous faites partie des 1% les moins pollueurs",
            helperClassName: "text-emerald-300",
        };
    }

    return {
        // TODO: déplacer ce texte dans translations.ts + utiliser t("...") au lieu d’un texte en dur
        helperText: "Attention ! vous polluez plus que 90% de la population",
        helperClassName: "text-red-300",
    };
}
