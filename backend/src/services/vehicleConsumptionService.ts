import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

type EstimateArgs = {
    query: string;
    fuelType: string; // essence/diesel/electrique/hybride/gpl
};

type EstimateResult = {
    consumptionLPer100Max: number;     // pour électrique => kWh/100km (Wh/km ÷ 10)
    matchedLabel: string;
    source: "car_labelling.xlsx";
    unit: "L/100km" | "kWh/100km";
    type?: string;
};

type RowNormalized = {
    bodyType: string;
    label: string;          // colonne B normalisée
    labelOriginal: string;
    energy: string;         // colonne C
    maxValue: number;       // colonne F
    unitRaw: string;        // colonne G
};

let cache: { loaded: boolean; rows: RowNormalized[] } = { loaded: false, rows: [] };

function normalizeText(input: string): string {
    return String(input ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .replace(/[^A-Z0-9 ]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function toNumber(val: any): number | undefined {
    if (val === null || val === undefined) return undefined;
    if (typeof val === "number") return isFinite(val) ? val : undefined;
    const n = Number(String(val).replace(",", ".").trim());
    return isFinite(n) ? n : undefined;
}

function resolveXlsxPath(): string {
    // On tente plusieurs chemins pour être robuste (monorepo, docker, etc.)
    const candidates = [
        path.resolve(process.cwd(), "assets", "car_labelling.xlsx"),            // backend/
        path.resolve(process.cwd(), "backend", "assets", "car_labelling.xlsx"), // repo root
    ];

    for (const p of candidates) {
        if (fs.existsSync(p)) return p;
    }

    const fallback = candidates[0];
    if (!fallback) {
        throw new Error("Chemins candidats vides (impossible).");
    }
    return fallback;
}

function energyCodesForFuelType(fuelType: string): string[] {
    const f = normalizeText(fuelType);

    // Codes vus dans ton fichier (ligne 7-13 de l’en-tête)
    if (f === "ESSENCE") return ["ES", "FE"];                 // ES, Superéthanol-E85 FE
    if (f === "DIESEL") return ["GO"];                       // GO
    if (f === "ELECTRIQUE" || f === "ELECTRIQUE") return ["EL"]; // EL
    if (f === "GPL") return ["GPL"];                         // GPL
    if (f === "HYBRIDE") return ["EH", "GH", "EE", "GL"];     // hybrides (selon en-tête)

    // si inconnu, on ne filtre pas
    return [];
}

function loadOnce(): void {
    if (cache.loaded) return;

    const xlsxPath = resolveXlsxPath();
    if (!fs.existsSync(xlsxPath)) {
        throw new Error(`car_labelling.xlsx introuvable. Chemin tenté: ${xlsxPath}`);
    }

    const wb = XLSX.readFile(xlsxPath);

    const sheetName = wb.SheetNames[0];
    if (!sheetName) {
        throw new Error("Aucune feuille trouvée dans car_labelling.xlsx");
    }

    const sheet = wb.Sheets[sheetName];
    if (!sheet) {
        throw new Error(`Feuille introuvable dans le classeur: ${sheetName}`);
    }

    const rows = XLSX.utils.sheet_to_json<any[]>(sheet, {
        header: 1,
        defval: "",
        raw: true,
    });


    // Les données commencent à la ligne 22 => index 21 (0-based)
    const dataRows = rows.slice(21);

    const parsed: RowNormalized[] = [];

    for (const r of dataRows) {
        // Colonnes:
        // A: carrosserie (r[0]) - inutile
        // B: label (r[1])
        // C: énergie (r[2])
        // F: conso max (r[5])
        // G: unité (r[6])

        const line = Array.isArray(r) ? r : [];
        const bodyType = String(line[0] ?? "").trim();
        const labelRaw = r?.[1];
        const energyRaw = r?.[2];
        const maxRaw = r?.[5];
        const unitRaw = r?.[6];

        const labelOriginal = String(line[1] ?? "").trim();
        const label = normalizeText(labelOriginal);

        const energy = normalizeText(energyRaw);
        const maxValue = toNumber(maxRaw);
        const unit = normalizeText(unitRaw);

        if (!label || !energy || maxValue === undefined) continue;
        if (unit !== "L 100 KM" && unit !== "WH KM") continue;

        parsed.push({
            bodyType,
            label,
            labelOriginal,
            energy,
            maxValue,
            unitRaw: unit as "L 100 KM" | "WH KM",
        });
    }

    cache = { loaded: true, rows: parsed };
}

export function estimateConsumptionMax(args: EstimateArgs): EstimateResult | null {
    loadOnce();

    const q = normalizeText(args.query);
    if (!q) return null;


    const allowedEnergy = energyCodesForFuelType(args.fuelType);
    const filterEnergy = allowedEnergy.length > 0;

    const candidates = cache.rows.filter((r) => {
        const matchText = r.label.includes(q) || q.includes(r.label);
        if (!matchText) return false;
        if (!filterEnergy) return true;
        return allowedEnergy.includes(r.energy);
    });

    if (candidates.length === 0) return null;

    // On choisit la plus grande conso max parmi les matches
    let best: RowNormalized | null = null;

    for (const c of candidates) {
        if (!best || c.maxValue > best.maxValue) {
            best = c;
        }
    }

    if (!best) return null;


    // Conversion si électrique : Wh/km -> kWh/100km (Wh/km * 0.1) == Wh/km / 10
    if (best.unitRaw === "WH KM") {
        const kWhPer100 = Number((best.maxValue / 10).toFixed(2));
        return {
            consumptionLPer100Max: kWhPer100,
            matchedLabel: best.labelOriginal,
            source: "car_labelling.xlsx",
            unit: "kWh/100km",
            ...(best.bodyType ? { type: best.bodyType } : {})
        };
    }

    return {
        consumptionLPer100Max: Number(best.maxValue.toFixed(2)),
        matchedLabel: best.label,
        source: "car_labelling.xlsx",
        unit: "L/100km",
        ...(best.bodyType ? { type: best.bodyType } : {})
    };

}
