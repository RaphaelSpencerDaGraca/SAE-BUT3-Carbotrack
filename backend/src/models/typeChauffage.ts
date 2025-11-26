//backend\src\models\typeChauffage.ts
import pool from "../config/db";
import {type_chauffage} from "../../../shared/typeChauffage";

export const getTypeChauffageById = async (id: number): Promise<type_chauffage | null> => {
    try {
        const res = await pool.query('SELECT * FROM type_chauffage WHERE id = $1', [id]);
        return res.rows[0] || null;
    } catch (err) {
        console.error('Error fetching type_chauffage by id:', err);
        throw err;
    }
};

export const getAllTypesChauffage = async (): Promise<type_chauffage[]> => {
    try {
        const res = await pool.query('SELECT id, type_chauffage, consommation_moyenne_kwh_m2, facteur_emission_co2 FROM type_chauffage ORDER BY id');
        return res.rows;
    } catch (err) {
        console.error('Error fetching all types_chauffage:', err);
        throw err;
    }
};