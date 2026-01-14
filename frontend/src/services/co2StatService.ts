// frontend/src/services/co2StatService.ts

export type Co2StatResult = {
    helperKey: string;
    helperClassName: string;
    /**
     * Valeurs à injecter dans la traduction (ex: {better}, {worse}, {top}).
     * Remarque: formatage laissé au caller (UI) pour respecter la locale.
     */
    helperValues?: Record<string, number>;
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
}): Co2StatResult {
    const { totalCo2Kg, isLoading, referenceKg = POPULATION_REFERENCE_KG } = params;

    if (isLoading) {
        return {
            helperKey: "dashboard.stats.co2.helper.loading",
            helperClassName: "text-slate-400",
        };
    }

    const betterThanPercent = estimateBetterThanPercent(totalCo2Kg, referenceKg);
    const worseThanPercent = clamp(100 - betterThanPercent, 0.1, 99.9);

    const values = {
        better: betterThanPercent,
        worse: worseThanPercent,
        top: worseThanPercent, // top X% = 100 - betterThanPercent
    };

    // Catégories : 0–25 / 26–50 / 50–75 / 75–90 / 90–99 / 99–100
    if (betterThanPercent <= 25) {
        return {
            betterThanPercent,
            helperValues: values,
            helperKey: "dashboard.stats.co2.helper.p0_25",
            helperClassName: "text-red-300",
        };
    }

    if (betterThanPercent <= 50) {
        return {
            betterThanPercent,
            helperValues: values,
            helperKey: "dashboard.stats.co2.helper.p26_50",
            helperClassName: "text-orange-300",
        };
    }

    if (betterThanPercent <= 75) {
        return {
            betterThanPercent,
            helperValues: values,
            helperKey: "dashboard.stats.co2.helper.p51_75",
            helperClassName: "text-yellow-300",
        };
    }

    if (betterThanPercent <= 90) {
        return {
            betterThanPercent,
            helperValues: values,
            helperKey: "dashboard.stats.co2.helper.p76_90",
            helperClassName: "text-emerald-300",
        };
    }

    if (betterThanPercent <= 99) {
        return {
            betterThanPercent,
            helperValues: values,
            helperKey: "dashboard.stats.co2.helper.p91_99",
            helperClassName: "text-emerald-300",
        };
    }

    return {
        betterThanPercent,
        helperValues: values,
        helperKey: "dashboard.stats.co2.helper.p99_100",
        helperClassName: "text-emerald-300",
    };
}
