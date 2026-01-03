import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { ElectromenagerModel, IElectromenager } from '../models/electromenager';
import pool from '../config/db';

const FACTEUR_EMISSION_ELEC = 0.10; 

export class ElectromenagerController {

    static async ajouterAppareil(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId; 
            if (!userId) {
                return res.status(401).json({ message: "Utilisateur non identifié." });
            }

            const { 
                logementId, nom, type, marque, modele, 
                consommationKwhAn, consommationEauAn, classeEnergetique, 
                co2FabricationKg, dureeVieTheoriqueAns 
            } = req.body;

            if (!logementId || !nom || !type) {
                return res.status(400).json({ message: "Champs obligatoires manquants (logementId, nom, type)" });
            }
            const verifLogement = await pool.query(
                'SELECT id FROM logement WHERE id = $1 AND user_id = $2',
                [logementId, userId as string]
            );

            if (verifLogement.rows.length === 0) {
                return res.status(403).json({ message: "Accès refusé : Ce logement ne vous appartient pas." });
            }

            let co2UsageCalcule = 0;
            if (consommationKwhAn) {
                co2UsageCalcule = parseFloat(consommationKwhAn) * FACTEUR_EMISSION_ELEC;
            }

            const nouvelAppareil: IElectromenager = {
                logementId,
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

            res.status(201).json({
                message: "Appareil ajouté avec succès",
                data: appareilCree
            });

        } catch (error) {
            console.error("Erreur lors de l'ajout de l'appareil:", error);
            next(error);
        }
    }

    static async getAppareilsByLogement(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            const logementId = req.params.logementId;

            if (!userId) return res.status(401).json({ message: "Non authentifié" });
            if (!logementId) return res.status(400).json({ message: "ID logement manquant" });

            const safeUserId = userId as string;
            const safeLogementId = logementId as string;

            const verifLogement = await pool.query(
                'SELECT id FROM logement WHERE id = $1 AND user_id = $2',
                [safeLogementId, safeUserId]
            );

            if (verifLogement.rows.length === 0) {
                return res.status(403).json({ message: "Non autorisé ou logement introuvable." });
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
            const id = req.params.id; 
            const updates = req.body;

            if (!userId) return res.status(401).json({ message: "Non authentifié" });
            if (!id) return res.status(400).json({ message: "ID appareil manquant" });

            const safeUserId = userId as string;
            const safeAppareilId = id as string;

            const verification = await pool.query(`
                SELECT e.id 
                FROM electromenager e
                JOIN logement l ON e.logement_id = l.id
                WHERE e.id = $1 AND l.user_id = $2
            `, [safeAppareilId, safeUserId]);

            if (verification.rows.length === 0) {
                return res.status(403).json({ message: "Impossible de modifier cet appareil." });
            }

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
            const id = req.params.id;

            if (!userId) return res.status(401).json({ message: "Non authentifié" });
            if (!id) return res.status(400).json({ message: "ID appareil manquant" });

            const safeUserId = userId as string;
            const safeAppareilId = id as string;

            const verification = await pool.query(`
                SELECT e.id 
                FROM electromenager e
                JOIN logement l ON e.logement_id = l.id
                WHERE e.id = $1 AND l.user_id = $2
            `, [safeAppareilId, safeUserId]);

            if (verification.rows.length === 0) {
                return res.status(403).json({ message: "Impossible de supprimer cet appareil." });
            }

            await ElectromenagerModel.delete(parseInt(safeAppareilId));
            res.status(200).json({ message: "Appareil supprimé." });

        } catch (error) {
            next(error);
        }
    }
}