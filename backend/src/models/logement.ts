import pool from '../config/db';
import { logement as LogementType } from '../../../shared/logement'; // Adaptez le chemin si nécessaire

// Récupérer la LISTE des logements (Array)
export const getLogementsByUserId = async (userId: string) => {
  const query = `
    SELECT * FROM logement 
    WHERE user_id = $1 
    ORDER BY date_maj DESC
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows; // Retourne un tableau []
};

// Récupérer un logement unique par son ID
export const getLogementById = async (id: number) => {
  const query = `SELECT * FROM logement WHERE id = $1`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

// Créer un logement (INSERT)
export const createLogement = async (logement: LogementType) => {
  const query = `
    INSERT INTO logement (
      user_id, superficie, nombre_pieces, type_chauffage_id, classe_isolation, zone_climatique
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  
  // Note: On s'assure que user_id est traité comme string (UUID) pour Postgres
  const values = [
    String(logement.user_id), 
    logement.superficie,
    logement.nombre_pieces,
    logement.type_chauffage_id,
    // @ts-ignore : si classe_isolation manque dans le type partagé mais existe en base
    logement.classe_isolation || 'D', 
    // @ts-ignore
    logement.zone_climatique || 'H1'
  ];
  
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Mettre à jour (Optionnel, garde la logique d'update par User ID ou Logement ID selon besoin)
export const updateLogement = async (userId: string, logement: Partial<LogementType>) => {
  // Simplification : ici on update souvent par ID de logement, mais gardons la structure demandée
  // Attention : Update par userID risque de modifier TOUS les logements du user.
  // Pour l'instant on laisse tel quel pour éviter de casser l'existant, mais idéalement on update par ID logement.
  return null; 
};

export const deleteLogement = async (userId: string) => {
  const query = `DELETE FROM logement WHERE user_id = $1 RETURNING *`;
  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};

// --- NOUVELLE FONCTION ---
export const deleteLogementById = async (id: number) => {
  const query = `DELETE FROM logement WHERE id = $1 RETURNING *`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const getAllLogements = async () => {
  const query = `SELECT * FROM logement`;
  const { rows } = await pool.query(query);
  return rows;
};