import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db'

interface User{
    id:string;
    email:string;
    password_hash:string;
}


export const refister = async (req: Request, res: Response) =>{
    try{
        const{email,password} = req.body

        //Vérification de doublon dans la table user
        const userRes = await pool.query('SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)',[email]);
        if(userRes.rows[0].exists){
            return res.status(400).json({ error: 'Email déjà utilisé'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1,$2)', [email, hashedPassword]
        );

        res.status(201).json({message: 'Utilisateur créé avec succès'})
    } catch (error){
        console.error('Erreur:', error);
        res.status(500).json({error: 'Erreur serveur'});
    }
}