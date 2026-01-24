import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLogementByIdController, createLogementController, deleteLogementByIdController } from "../../src/controller/logementController.ts"; // Ajuste le chemin
import * as logementModel from '../../src/models/logement';
import { validationResult } from 'express-validator';

vi.mock('express-validator', () => ({
  validationResult: vi.fn(),
}));

vi.mock('../../src/models/logement');

describe('LogementController - getLogementById', () => {
  
  let req: any;
  let res: any;

  beforeEach(() => {
    vi.clearAllMocks();
    

    req = { params: {} };
    res = {
      status: vi.fn().mockReturnThis(), 
      json: vi.fn(),
    };
  });

  it('devrait retourner 200 et le logement si tout va bien', async () => {
    // ARRANGE (Préparation)
    req.params.id = '42';
    const mockLogement = { id: 42, ville: 'Paris' }; 
    
    
    vi.mocked(logementModel.getLogementById).mockResolvedValue(mockLogement as any);

    // ACT (Action)
    await getLogementByIdController(req, res);

    // ASSERT (Vérification)
    expect(logementModel.getLogementById).toHaveBeenCalledWith(42);
    expect(res.json).toHaveBeenCalledWith(mockLogement);
  });

  it('devrait retourner 404 si le logement n\'existe pas', async () => {
    // ARRANGE
    req.params.id = '999';
    vi.mocked(logementModel.getLogementById).mockResolvedValue(undefined);

    // ACT
    await getLogementByIdController(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Logement not found' });
  });

  it('devrait retourner 400 si l\'ID n\'est pas un nombre', async () => {
    // ARRANGE
    req.params.id = 'abc'; // Pas un nombre

    // ACT
    await getLogementByIdController(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid id' });
    expect(logementModel.getLogementById).not.toHaveBeenCalled();
  });
});


describe('LogementController - creatLogement',() =>{

    let req: any;
    let res: any;

    beforeEach(()=>{
        vi.clearAllMocks();

        req = { params: {} };
        res = {
            status: vi.fn().mockReturnThis(), 
            json: vi.fn(),
        };

    });

    it('devrait retourner 400 si la validation échoue', async () => {
        // ARRANGE
        const errorsMock = {
            isEmpty: vi.fn().mockReturnValue(false), // N'est pas vide = il y a des erreurs
            array: vi.fn().mockReturnValue(['Erreur champ invalide'])
        };
        vi.mocked(validationResult).mockReturnValue(errorsMock as any);

        // ACT
        await createLogementController(req, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ errors: ['Erreur champ invalide'] });
        
        expect(logementModel.createLogement).not.toHaveBeenCalled();
    });

    it('devrait créer le logement (201) si la validation passe', async () => {
        // ARRANGE
        // 1. Validation OK
        const noErrorsMock = { isEmpty: vi.fn().mockReturnValue(true) };
        vi.mocked(validationResult).mockReturnValue(noErrorsMock as any);

        // 2. Données du body
        req.body = { superficie: 50, ville: 'Lyon' }; 
        const createdLogement = { id: 1, ...req.body };
        
        // 3. Mock du modèle
        vi.mocked(logementModel.createLogement).mockResolvedValue(createdLogement);

        // ACT
        await createLogementController(req, res);

        // ASSERT
        expect(logementModel.createLogement).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(createdLogement);
    });


});

describe('LogementController - deleteLogementByIdController',() =>{

    let req: any;
    let res: any;

    beforeEach(()=>{
        vi.clearAllMocks();
        req = { params: {}, body: {} };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            send: vi.fn(), };

    });

    it('devrait supprimer le logement et retourner 204', async () => {
        // ARRANGE
        req.params.id = '10';
        vi.mocked(logementModel.deleteLogementById).mockResolvedValue({} as any);

        // ACT
        await deleteLogementByIdController(req, res); 

        // ASSERT
        expect(logementModel.deleteLogementById).toHaveBeenCalledWith(10);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled(); 
    });
 

});
