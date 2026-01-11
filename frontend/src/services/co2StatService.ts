// frontend/src/services/co2StatService.ts

export type Co2BenchmarkResult = {
    helperText: string;
    helperClassName: string;
    /**
     * Estimation interne (0-100) de "mieux que X%".
     * TODO: brancher un vrai calcul basé sur des données réelles (percentiles).
     */
    betterThanPercent?: number;
};

// Valeur temporaire (hard codée) utilisée pour estimer un percentile.
// TODO: remplacer par une vraie référence (percentiles réels, moyenne FR, par période, etc.).
export const POPULATION_REFERENCE_KG = 2000;

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

/**
 * Estime un percentile "mieux que X%" à partir du CO2 et d'une référence.
 * Heuristique simple : à referenceKg => ~50%, plus bas => monte, plus haut => descend.
 * TODO: remplacer par une vraie distribution (données FR + période).
 */
function estimateBetterThanPercent(totalCo2Kg: number, referenceKg: number): number {
    const safeRef = referenceKg > 0 ? referenceKg : POPULATION_REFERENCE_KG;
    const raw = 100 - (totalCo2Kg / safeRef) * 50;
    // On évite 0/100 exact pour ne pas afficher des extrêmes “absolus”
    return clamp(raw, 0.1, 99.9);
}

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

    const betterThanPercent = estimateBetterThanPercent(totalCo2Kg, referenceKg);

    // Catégories : 0–25 / 26–50 / 50–75 / 75–90 / 90–99 / 99–100
    // Note: les textes ci-dessous sont volontairement “fixes” par palier.
    // TODO: optionnellement injecter le % réel (betterThanPercent) dans le texte.
    if (betterThanPercent <= 25) {
        return {
            betterThanPercent,
            // TODO: déplacer ce texte dans translations.ts
            helperText: "Aïe… c'est plus élevé que 90% des Français.",
            helperClassName: "text-red-300",
        };
    }

    if (betterThanPercent <= 50) {
        return {
            betterThanPercent,
            // TODO: déplacer ce texte dans translations.ts
            helperText: "Proche de la moyenne… mais ça reste au dessus avec 70%.",
            helperClassName: "text-orange-300",
        };
    }

    if (betterThanPercent <= 75) {
        return {
            betterThanPercent,
            // TODO: déplacer ce texte dans translations.ts
            helperText: "C'est bien : mieux que 60% des Français",
            helperClassName: "text-yellow-300",
        };
    }

    if (betterThanPercent <= 90) {
        return {
            betterThanPercent,
            // TODO: déplacer ce texte dans translations.ts
            helperText: "Bravo ! 82% ! vous faites mieux que 3/4 des Français.",
            helperClassName: "text-emerald-300",
        };
    }

    if (betterThanPercent <= 99) {
        return {
            betterThanPercent,
            // TODO: déplacer ce texte dans translations.ts
            helperText: "Wow ! avec 95% vous êtes dans le top 10%",
            helperClassName: "text-emerald-300",
        };
    }

    return {
        betterThanPercent,
        // TODO: déplacer ce texte dans translations.ts
        helperText: "Exceptionnel : mieux que 99,6% de la population",
        helperClassName: "text-emerald-300",
    };
}
