import { Pool } from 'pg';


export interface UserProfile {
  user_id: string;
  pseudo: string;
  genre: 'homme' | 'femme' | 'autre' | 'non_binaire' | 'non_renseigne';
  emission_co2_lifestyle: number;
  emission_co2_transport: number;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class UserProfileModel {
  static async updateEmissions(userId: string, emissionValue: number, emissionType: 'lifestyle' | 'transport'): Promise<UserProfile> {
    const column = emissionType === 'lifestyle' ? 'emission_co2_lifestyle' : 'emission_co2_transport';
    const query = `
      INSERT INTO user_profiles (user_id, ${column})
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET ${column} = $2
      RETURNING *;
    `;
    const values = [userId, emissionValue];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}

export default UserProfileModel;
