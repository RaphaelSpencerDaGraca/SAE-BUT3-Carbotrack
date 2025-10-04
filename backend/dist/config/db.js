"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || '1234',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'carbon_db',
});
// Test de connexion
const testConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        if (res.rows.length > 0) {
            // @ts-ignore
            console.log('Connecté à PostgreSQL à:', res.rows[0].now);
        }
        else {
            console.error('Aucune ligne retournée par SELECT NOW()');
        }
    }
    catch (err) {
        console.error('Erreur de connexion à PostgreSQL:', err);
    }
};
testConnection(); // Appelle la fonction de test
exports.default = pool;
//# sourceMappingURL=db.js.map