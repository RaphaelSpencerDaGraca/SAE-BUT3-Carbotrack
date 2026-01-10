//backend\src\models\produit.ts
import { Pool } from 'pg';
import pool from "../config/db";

export type ProduitSource = 'Base Carbone' | 'Open Food Facts' | 'Manuel';

export interface IProduit {
  id: number;
  nom: string;
  categorie: string;
  sous_categorie: string;
  emission_co2_par_unite: number;
  unite: string;
  source: string;
  identifiant_source: string;
  description: string;
  date_maj: string;
}

// Méthodes pour interagir avec la base de données
export const getProduitById = async (id: number): Promise<IProduit | null> => {
    const res = await pool.query('SELECT * FROM produit WHERE id = $1', [id]);
    return res.rows[0] || null;
};

export const createProduit = async (produit: Omit<IProduit, 'id' | 'dateMaj'>): Promise<IProduit> => {
    const res = await pool.query(
        `INSERT INTO produit(nom, categorie, sous_categorie, emission_co2_par_unite, unite, source, identifiant_source, description)
         VALUES($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [produit.nom, produit.categorie, produit.sous_categorie, produit.emission_co2_par_unite, produit.unite, produit.source, produit.identifiant_source, produit.description]
    );
    return res.rows[0];
};

export const updateProduit = async (id: number, produit: Partial<IProduit>): Promise<IProduit | null> => {
    const fields = Object.keys(produit).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(produit);
    const res = await pool.query(
        `UPDATE produit SET ${fields} WHERE id = $${values.length + 1} RETURNING *`,
        [...values, id]
    );
    return res.rows[0] || null;
};

export const deleteProduit = async (id: number): Promise<boolean> => {
    const res = await pool.query('DELETE FROM produit WHERE id = $1', [id]);
    return res.rowCount === 1;
};

export const getAllProduits = async (): Promise<IProduit[]> => {
    const res = await pool.query('SELECT * FROM produit');
    return res.rows;
};

export const searchProduits = async (term: string, categorie?: string): Promise<IProduit[]> => {
    let query = `
        SELECT * FROM produit 
        WHERE (nom ILIKE $1 OR description ILIKE $1)
    `;
    const values: any[] = [`%${term}%`];

    if (categorie) {
        query += ` AND categorie = $2`;
        values.push(categorie);
    }

    query += ` LIMIT 20`;

    const res = await pool.query(query, values);
    return res.rows;
};