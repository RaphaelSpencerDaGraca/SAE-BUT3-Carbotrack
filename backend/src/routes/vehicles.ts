import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    const vehicles = [
        {
            id: '1',
            name: 'Clio IV',
            plate: 'AB-123-CD',
            type: 'Citadine',
            fuelType: 'essence',
            consumptionLPer100: 6.2,
        },
        {
            id: '2',
            name: 'Tesla Model 3',
            plate: 'EV-456-ZE',
            type: 'Berline',
            fuelType: 'electrique',
        },
    ];

    res.json(vehicles);
});

export default router;
