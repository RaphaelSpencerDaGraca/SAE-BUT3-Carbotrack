"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refister = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
const refister = async (req, res) => {
    try {
        const { email, password } = req.body;
        //Vérification de doublon dans la table user
        const userRes = await db_1.default.query('SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)', [email]);
        if (userRes.rows[0].exists) {
            return res.status(400).json({ error: 'Email déjà utilisé' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await db_1.default.query('INSERT INTO users (email, password_hash) VALUES ($1,$2)', [email, hashedPassword]);
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.refister = refister;
//# sourceMappingURL=auth.js.map