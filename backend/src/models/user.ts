import pool from "../config/db";

interface DBUser {
    id: string;
    email: string;
    password_hash: string;
    pseudo: string;
    created_at: Date;
}

export const creatUser = async(email: string, password_hash: string, pseudo: string): Promise<DBUser> => {
    const query = 'INSERT INTO users (email,password_hash,pseudo) VALUES ($1,$1,$3) RETURNING id,email,created_at';
    const values = [email, password_hash, pseudo];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

export const findUserByEmail = async(email: string): Promise<DBUser> => {
    const query = 'SELECT * FROM users where email=$1';
    const values = [email];
    const {rows} = await pool.query(query,values);
    return rows[0];
}

