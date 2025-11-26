import pool from "../config/db";
import {logement} from "../../../shared/logement";

export const createLogement = async (logementData: logement): Promise<logement> => {
    const {user_id, superficie, nombre_pieces, type_chauffage_id, emission_co2_annuelle} = logementData;
    const result = await pool.query(
        `INSERT INTO logement (user_id, superficie, nombre_pieces, type_chauffage_id, emission_co2_annuelle)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [user_id, superficie, nombre_pieces, type_chauffage_id, emission_co2_annuelle]
    );
    return result.rows[0];
}

export const getLogementById = async (id: number): Promise<logement | null> => {
    const result = await pool.query(
        `SELECT * FROM logement WHERE id = $1`,
        [id]
    );
    return result.rows[0] || null;
}

export const getLogementByUserId = async (userId: string): Promise<logement | null> => {
    const result = await pool.query(
        `SELECT * FROM logement WHERE user_id = $1`,
        [userId]
    );
    return result.rows[0] || null;
}

export const updateLogement = async (userId: string, logementData: Partial<logement>): Promise<logement | null> => {
    const fields = [];
    const values = [];
    let index = 1;              
    for (const key in logementData) {
        fields.push(`${key} = $${index}`);
        values.push((logementData as any)[key]);
        index++;
    }   
    values.push(userId);
    const result = await pool.query(
        `UPDATE logement SET ${fields.join(', ')} WHERE user_id = $${index} RETURNING *`,
        values
    );
    return result.rows[0] || null;
}

export const deleteLogement = async (userId: string): Promise<boolean> => {
    const result = await pool.query(
        `DELETE FROM logement WHERE user_id = $1`,
        [userId]
    );
    return (result.rowCount ?? 0) > 0;
}
export const getAllLogements = async (): Promise<logement[]> => {
    const result = await pool.query(
        `SELECT * FROM logement`
    );
    return result.rows;
}

