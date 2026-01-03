import pool from '../config/db';

// 1. Définition des types (doit matcher l'ENUM SQL)
export type TypeElectromenagerEnum = 
    'Refrigerateur' | 'Congelateur' | 'Lave-linge' | 'Seche-linge' | 
    'Lave-vaisselle' | 'Four' | 'Micro-ondes' | 'Televiseur' | 'Ordinateur' | 'Autre';

// 2. Interface TypeScript (Ce que l'on manipule dans le code)
export interface IElectromenager {
    id?: number;
    logementId: number; // Mappé vers logement_id
    nom: string;
    type: TypeElectromenagerEnum;
    marque?: string;
    modele?: string;
    
    // Conso Usage
    consommationKwhAn: number;
    consommationEauAn: number;
    classeEnergetique?: string;
    
    // Impact Carbone
    co2FabricationKg: number;
    co2UsageKgAn: number;
    
    // Méta-données
    sourceDonnees: 'Manuel' | 'EPREL' | 'ADEME';
    dateAchat?: Date;
    dureeVieTheoriqueAns: number;
    createdAt?: Date;
}

export class ElectromenagerModel {

    static async create(appareil: IElectromenager): Promise<IElectromenager> {
        const query = `
            INSERT INTO electromenager (
                logement_id, nom, type, marque, modele,
                consommation_kwh_an, consommation_eau_an, classe_energetique,
                co2_fabrication_kg, co2_usage_kg_an, source_donnees,
                date_achat, duree_vie_theorique_ans
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *;
        `;

        const values = [
            appareil.logementId,
            appareil.nom,
            appareil.type,
            appareil.marque || null,
            appareil.modele || null,
            appareil.consommationKwhAn || 0,
            appareil.consommationEauAn || 0,
            appareil.classeEnergetique || null,
            appareil.co2FabricationKg || 0,
            appareil.co2UsageKgAn || 0,
            appareil.sourceDonnees || 'Manuel',
            appareil.dateAchat || null,
            appareil.dureeVieTheoriqueAns || 10
        ];

        const { rows } = await pool.query(query, values);
        return this.mapToModel(rows[0]);
    }

    static async findAllByLogementId(logementId: number): Promise<IElectromenager[]> {
        const query = `
            SELECT * FROM electromenager 
            WHERE logement_id = $1 
            ORDER BY created_at DESC;
        `;
        const { rows } = await pool.query(query, [logementId]);
        return rows.map(this.mapToModel);
    }

    static async findById(id: number): Promise<IElectromenager | null> {
        const query = `SELECT * FROM electromenager WHERE id = $1`;
        const { rows } = await pool.query(query, [id]);
        if (rows.length === 0) return null;
        return this.mapToModel(rows[0]);
    }

  
    static async delete(id: number): Promise<void> {
        const query = `DELETE FROM electromenager WHERE id = $1`;
        await pool.query(query, [id]);
    }

  
    static async update(id: number, data: Partial<IElectromenager>): Promise<IElectromenager | null> {
        // Construction dynamique de la requête UPDATE pour ne modifier que les champs envoyés
        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        // Mapping inverse (CamelCase -> snake_case) pour la DB
        const dbMapping: Record<string, string> = {
            nom: 'nom',
            type: 'type',
            marque: 'marque',
            modele: 'modele',
            consommationKwhAn: 'consommation_kwh_an',
            consommationEauAn: 'consommation_eau_an',
            classeEnergetique: 'classe_energetique',
            co2FabricationKg: 'co2_fabrication_kg',
            co2UsageKgAn: 'co2_usage_kg_an',
            dateAchat: 'date_achat'
        };

        for (const [key, value] of Object.entries(data)) {
            if (dbMapping[key] && value !== undefined) {
                fields.push(`${dbMapping[key]} = $${index}`);
                values.push(value);
                index++;
            }
        }

        if (fields.length === 0) return null;

        values.push(id);
        const query = `
            UPDATE electromenager 
            SET ${fields.join(', ')} 
            WHERE id = $${index} 
            RETURNING *;
        `;

        const { rows } = await pool.query(query, values);
        return rows[0] ? this.mapToModel(rows[0]) : null;
    }

    // Helper pour convertir le format DB (snake_case) vers TS (camelCase)
    private static mapToModel(row: any): IElectromenager {
        return {
            id: row.id,
            logementId: row.logement_id,
            nom: row.nom,
            type: row.type,
            marque: row.marque,
            modele: row.modele,
            consommationKwhAn: parseFloat(row.consommation_kwh_an),
            consommationEauAn: parseFloat(row.consommation_eau_an),
            classeEnergetique: row.classe_energetique,
            co2FabricationKg: parseFloat(row.co2_fabrication_kg),
            co2UsageKgAn: parseFloat(row.co2_usage_kg_an),
            sourceDonnees: row.source_donnees,
            dateAchat: row.date_achat,
            dureeVieTheoriqueAns: row.duree_vie_theorique_ans,
            createdAt: row.created_at
        };
    }
}