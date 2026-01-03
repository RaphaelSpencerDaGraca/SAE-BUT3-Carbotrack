// backend/src/controller/ElectromenagerController.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { ElectromenagerModel, IElectromenager } from '../models/electromenager';
import pool from '../config/db';

const FACTEUR_EMISSION_ELEC = 0.10; 

export class ElectromenagerController {

    static async ajouterAppareil(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            
            // 1. Vérification
            if (!userId) {
                return res.status(401).json({ message: "Utilisateur non identifié." });
            }
            // 2. Sécurisation explicite (Correction TypeScript)
            const safeUserId = String(userId);

            const { 
                logementId, nom, type, marque, modele, 
                consommationKwhAn, consommationEauAn, classeEnergetique, 
                co2FabricationKg, dureeVieTheoriqueAns 
            } = req.body;

            if (!logementId || !nom || !type) {
                return res.status(400).json({ message: "Champs obligatoires manquants." });
            }
            
            // Sécurisation ID Logement
            const safeLogementId = String(logementId);

            const verifLogement = await pool.query(
                'SELECT id FROM logement WHERE id = $1 AND user_id = $2',
                [safeLogementId, safeUserId] 
            );

            if (verifLogement.rows.length === 0) {
                return res.status(403).json({ message: "Ce logement ne vous appartient pas." });
            }

            let co2UsageCalcule = 0;
            if (consommationKwhAn) {
                co2UsageCalcule = parseFloat(consommationKwhAn) * FACTEUR_EMISSION_ELEC;
            }

            const nouvelAppareil: IElectromenager = {
                logementId: parseInt(safeLogementId), // Assure que c'est un number
                nom,
                type,
                marque,
                modele,
                consommationKwhAn: consommationKwhAn || 0,
                consommationEauAn: consommationEauAn || 0,
                classeEnergetique,
                co2FabricationKg: co2FabricationKg || 0,
                co2UsageKgAn: co2UsageCalcule,
                sourceDonnees: 'Manuel',
                dureeVieTheoriqueAns: dureeVieTheoriqueAns || 10
            };

            const appareilCree = await ElectromenagerModel.create(nouvelAppareil);
            res.status(201).json({ message: "Appareil ajouté", data: appareilCree });

        } catch (error) {
            next(error);
        }
    }

    static async getAppareilsByLogement(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            const { logementId } = req.params;

            if (!userId) return res.status(401).json({ message: "Non authentifié" });
            if (!logementId) return res.status(400).json({ message: "ID logement manquant" });

            // Corrections TypeScript
            const safeUserId = String(userId);
            const safeLogementId = String(logementId);

            const verifLogement = await pool.query(
                'SELECT id FROM logement WHERE id = $1 AND user_id = $2',
                [safeLogementId, safeUserId]
            );

            if (verifLogement.rows.length === 0) {
                return res.status(403).json({ message: "Logement introuvable ou accès refusé." });
            }

            const appareils = await ElectromenagerModel.findAllByLogementId(parseInt(safeLogementId));
            res.status(200).json(appareils);

        } catch (error) {
            next(error);
        }
    }

    static async updateAppareil(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            const { id } = req.params;
            const updates = req.body;

            if (!userId) return res.status(401).json({ message: "Non authentifié" });
            if (!id) return res.status(400).json({ message: "ID manquant" });

            // Corrections TypeScript
            const safeUserId = String(userId);
            const safeAppareilId = String(id);

            const verification = await pool.query(`
                SELECT e.id FROM electromenager e
                JOIN logement l ON e.logement_id = l.id
                WHERE e.id = $1 AND l.user_id = $2
            `, [safeAppareilId, safeUserId]);

            if (verification.rows.length === 0) return res.status(403).json({ message: "Impossible de modifier." });

            if (updates.consommationKwhAn) {
                updates.co2UsageKgAn = updates.consommationKwhAn * FACTEUR_EMISSION_ELEC;
            }

            const updatedAppareil = await ElectromenagerModel.update(parseInt(safeAppareilId), updates);
            res.status(200).json(updatedAppareil);

        } catch (error) {
            next(error);
        }
    }

    static async supprimerAppareil(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            const { id } = req.params;

            if (!userId) return res.status(401).json({ message: "Non authentifié" });
            if (!id) return res.status(400).json({ message: "ID manquant" });

            // Corrections TypeScript
            const safeUserId = String(userId);
            const safeAppareilId = String(id);

            const verification = await pool.query(`
                SELECT e.id FROM electromenager e
                JOIN logement l ON e.logement_id = l.id
                WHERE e.id = $1 AND l.user_id = $2
            `, [safeAppareilId, safeUserId]);

            if (verification.rows.length === 0) return res.status(403).json({ message: "Impossible de supprimer." });

            // Correction ici : parseInt sur une string validée
            await ElectromenagerModel.delete(parseInt(safeAppareilId));
            res.status(200).json({ message: "Appareil supprimé." });

        } catch (error) {
            next(error);
        }
    }
}