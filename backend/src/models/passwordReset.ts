// backend/src/models/passwordReset.ts
import { randomBytes } from 'crypto';
import pool from '../config/db';

export interface PasswordResetToken {
    id: number;
    user_id: string;
    token: string;
    expires_at: Date;
    created_at: Date;
}
export const createPasswordResetToken = async (userId: string): Promise<PasswordResetToken> => {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Valide pour 1 heure

    const { rows } = await pool.query(
        'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *',
        [userId, token, expiresAt]
    );

    return rows[0];
};

export const getPasswordResetToken = async (token: string): Promise<PasswordResetToken | null> => {
    const { rows } = await pool.query(
        'SELECT * FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW()',
        [token]
    );

    return rows[0] || null;
};

export const deletePasswordResetToken = async (token: string): Promise<void> => {
    await pool.query(
        'DELETE FROM password_reset_tokens WHERE token = $1',
        [token]
    );
};
