//backend\src\models\userProfile.ts
import pool from '../config/db';

export interface UserProfile {
  user_id: string;
  emission_co2_transport: number | null;
  emission_co2_lifestyle: number | null;
}

export const createUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  const sql = `
    INSERT INTO user_profiles (user_id, emission_co2_transport, emission_co2_lifestyle)
    VALUES ($1, $2, $3)
    RETURNING user_id, emission_co2_transport, emission_co2_lifestyle
  `;
  const values = [profile.user_id, profile.emission_co2_transport, profile.emission_co2_lifestyle];
  const res = await pool.query(sql, values);
  return res.rows[0];
};

export const getUserProfileByUserId = async (userId: string): Promise<UserProfile | null> => {
  const res = await pool.query(
    'SELECT user_id, emission_co2_transport, emission_co2_lifestyle FROM user_profiles WHERE user_id = $1',
    [userId]
  );
  return res.rows[0] || null;
};

export const updateUserProfile = async (userId: string, payload: Partial<UserProfile>): Promise<UserProfile | null> => {
  const res = await pool.query(
    `UPDATE user_profiles
     SET emission_co2_transport = COALESCE($2, emission_co2_transport),
         emission_co2_lifestyle = COALESCE($3, emission_co2_lifestyle)
     WHERE user_id = $1
     RETURNING user_id, emission_co2_transport, emission_co2_lifestyle`,
    [userId, payload.emission_co2_transport ?? null, payload.emission_co2_lifestyle ?? null]
  );
  return res.rows[0] || null;
};

export const deleteUserProfile = async (userId: string): Promise<boolean> => {
  const res = await pool.query('DELETE FROM user_profiles WHERE user_id = $1', [userId]);
  return (res.rowCount ?? 0) > 0;
};