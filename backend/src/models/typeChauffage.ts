//backend\src\models\typeChauffage.ts
import pool from "../config/db";
import {type_chauffage} from "../../../shared/typeChauffage";

export const getTypeChauffageById = async(id:Number):Promise<type_chauffage|null>=> {
    const res = await pool.query('SELECT * FROM type_chauffage WHERE id = $1',[id]);
    return res.rows[0] || null
};