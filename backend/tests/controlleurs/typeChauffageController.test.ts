import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTypeChauffage, getAllTypesChauffageController } from '../../src/controller/typeChauffageController.ts';
import * as typeChauffageModel from '../../src/models/typeChauffage'; // On importe le modèle pour le mocker


vi.mock('../../src/models/typeChauffage');

describe('TypeChauffageController', () => {
    let req: any;
    let res: any;


    beforeEach(() => {
        vi.clearAllMocks();
        req = { params: {}, body: {} };
        res = {
            status: vi.fn().mockReturnThis(), 
            json: vi.fn(),
        };
    });

    describe('getTypeChauffage (Get By ID)', () => {
        it('devrait retourner 200 et l\'objet si l\'ID existe', async () => {
            // ARRANGE
            req.params.id = '1';
            const mockData = { id: 1, type_chauffage: 'Gaz', consommation_moyenne_kwh_m2: 100 };
            
           
            vi.mocked(typeChauffageModel.getTypeChauffageById).mockResolvedValue(mockData as any);

            // ACT
            await getTypeChauffage(req, res);

            // ASSERT
            expect(typeChauffageModel.getTypeChauffageById).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        it('devrait retourner 400 si l\'ID est manquant', async () => {
            // ARRANGE
            req.params.id = undefined;

            // ACT
            await getTypeChauffage(req, res);

            // ASSERT
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'ID manquant' });
            expect(typeChauffageModel.getTypeChauffageById).not.toHaveBeenCalled();
        });

        it('devrait retourner 404 si le type de chauffage n\'est pas trouvé', async () => {
            // ARRANGE
            req.params.id = '999';
            vi.mocked(typeChauffageModel.getTypeChauffageById).mockResolvedValue(null);

            // ACT
            await getTypeChauffage(req, res);

            // ASSERT
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Type_Chauffage non trouvé' });
        });

        it('devrait retourner 500 en cas d\'erreur du modèle (base de données)', async () => {
            // ARRANGE
            req.params.id = '1';
            vi.mocked(typeChauffageModel.getTypeChauffageById).mockRejectedValue(new Error('DB Error'));

            // ACT
            await getTypeChauffage(req, res);

            // ASSERT
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Erreur serveur' });
        });
    });

    describe('getAllTypesChauffageController (Get All)', () => {
        it('devrait retourner la liste des types de chauffage', async () => {
            // ARRANGE
            const mockList = [
                { id: 1, type_chauffage: 'Électrique' },
                { id: 2, type_chauffage: 'Gaz' }
            ];
            vi.mocked(typeChauffageModel.getAllTypesChauffage).mockResolvedValue(mockList as any);

            // ACT
            await getAllTypesChauffageController(req, res);

            // ASSERT
            expect(typeChauffageModel.getAllTypesChauffage).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockList);
        });

        it('devrait retourner 500 en cas d\'erreur serveur', async () => {
            // ARRANGE
            vi.mocked(typeChauffageModel.getAllTypesChauffage).mockRejectedValue(new Error('DB Crash'));

            // ACT
            await getAllTypesChauffageController(req, res);

            // ASSERT
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Erreur serveur' });
        });
    });
});