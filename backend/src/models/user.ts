//backend\src\models\user.ts
import type { PoolClient } from "pg";
import bcrypt from "bcryptjs";
import pool from "../config/db";

export interface DBUser {
    id: string;
    email: string;
    password_hash: string;
    pseudo?: string;
    created_at: Date;
}

export const createUser = async (email: string, password_hash: string, pseudo: string): Promise<DBUser> => {
    try {
        const userQuery = 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at';
        const userValues = [email, password_hash];
        const userResult = await pool.query(userQuery, userValues);
        const userId = userResult.rows[0].id;

        const profileQuery = 'INSERT INTO user_profiles (user_id, pseudo) VALUES ($1, $2) RETURNING pseudo';
        const profileValues = [userId, pseudo];
        await pool.query(profileQuery, profileValues);

        return { ...userResult.rows[0], pseudo };
    } catch (error) {
        throw new Error(`Erreur lors de la création de l'utilisateur: ${error}`);
    }
};

export const getUserByEmail = async (email: string): Promise<DBUser | null> => {
    try {
        const query = `
            SELECT users.id, users.email, users.password_hash, user_profiles.pseudo, users.created_at
            FROM users
            LEFT JOIN user_profiles ON users.id = user_profiles.user_id
            WHERE users.email = $1
        `;
        const { rows } = await pool.query(query, [email]);
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Erreur lors de la récupération de l'utilisateur: ${error}`);
    }
};


export const updateUserPassword = async (userId: string, newPassword: string): Promise<void> => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [hashedPassword, userId]
    );
};


export const createUserTx = async (
    client: PoolClient,
    email: string,
    password_hash: string,
    pseudo: string
) => {
    const userResult = await client.query(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
        [email, password_hash]
    );
    const userId = userResult.rows[0].id;

    const profileResult = await client.query(
        "INSERT INTO user_profiles (user_id, pseudo) VALUES ($1, $2) RETURNING pseudo",
        [userId, pseudo]
    );

    return { ...userResult.rows[0], pseudo: profileResult.rows[0].pseudo };
};


export const deleteUser = async (userId: string): Promise<boolean> => {
    const res = await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    return (res.rowCount ?? 0) > 0;
};

export const getUserById = async (userId: string): Promise<DBUser | null> => {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    return res.rows[0] || null;
};