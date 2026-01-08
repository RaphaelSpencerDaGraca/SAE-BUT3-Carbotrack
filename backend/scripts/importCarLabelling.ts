import path from "path";

import xlsx from "xlsx";

import pool from "../src/config/db";



type Row = {

    body_type: string | null;

    model_label: string | null;

    energy: string | null;

    gearbox: string | null;

    conso_min: number | null;

    conso_max: number | null;

    conso_unit: string | null;

};



function toNumber(v: any): number | null {

    if (v === null || v === undefined || v === "") return null;

    const n = Number(String(v).replace(",", "."));

    return Number.isFinite(n) ? n : null;

}



async function main() {

    // ⚠️ adapte le chemin si tu ranges le fichier ailleurs

    const filePath = path.resolve(__dirname, "../sql/insertions/car_labelling.xlsx");



    const wb = xlsx.readFile(filePath);

    const sheetName = wb.SheetNames[0];

    const ws = wb.Sheets[sheetName];



    // lecture brute en tableau (rows/cols)

    const rows: any[][] = xlsx.utils.sheet_to_json(ws, { header: 1 });



    // Dans ton fichier, les données commencent après la ligne d’en-tête “Min/Max/Unité”.

    // On va détecter la ligne où on voit "Min." et "Max." pour la conso.

    let startIndex = -1;

    for (let i = 0; i < rows.length; i++) {

        const r = rows[i] || [];

        const joined = r.map((x) => String(x ?? "")).join(" | ");

        if (joined.includes("Min.") && joined.includes("Max.") && joined.includes("Unité")) {

            startIndex = i + 1; // data juste après

            break;

        }

    }

    if (startIndex === -1) {

        throw new Error("Impossible de trouver la ligne d’en-tête (Min/Max/Unité) dans le XLSX.");

    }



    // D’après la structure observée :

    // col0: Carrosserie

    // col1: Modèle (souvent marque+modèle)

    // col2: Energie

    // col3: BV

    // col4: Conso Min

    // col5: Conso Max

    // col6: Unité conso

    const parsed: Row[] = [];

    for (let i = startIndex; i < rows.length; i++) {

        const r = rows[i];

        if (!r) continue;



        const body = r[0] ?? null;

        const model = r[1] ?? null;



        // stop si ligne vide

        if (!body && !model) continue;



        parsed.push({

            body_type: body ? String(body) : null,

            model_label: model ? String(model) : null,

            energy: r[2] ? String(r[2]) : null,

            gearbox: r[3] !== undefined && r[3] !== null ? String(r[3]) : null,

            conso_min: toNumber(r[4]),

            conso_max: toNumber(r[5]),

            conso_unit: r[6] ? String(r[6]) : null,

        });

    }



    console.log(`Lignes parsées: ${parsed.length}`);



    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // option: vider avant import si tu veux une base propre

        await client.query("TRUNCATE TABLE car_labelling RESTART IDENTITY");



        const q = `

      INSERT INTO car_labelling (body_type, model_label, energy, gearbox, conso_min, conso_max, conso_unit)

      VALUES ($1,$2,$3,$4,$5,$6,$7)

    `;



        for (const row of parsed) {

            await client.query(q, [

                row.body_type,

                row.model_label,

                row.energy,

                row.gearbox,

                row.conso_min,

                row.conso_max,

                row.conso_unit,

            ]);

        }



        await client.query("COMMIT");

        console.log("Import terminé ✅");

    } catch (e) {

        await client.query("ROLLBACK");

        throw e;

    } finally {

        client.release();

    }

}



main().catch((e) => {

    console.error("Import failed:", e);

    process.exit(1);

});