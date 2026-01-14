export const PUBLIC_TRANSPORTS = [
    { 
        key: 'TRAIN_TGV', 
        label: 'Train (TGV)', 
        co2PerKm: 2.3, // g/km (source ADEME base)
        emoji: '' 
    },
    { 
        key: 'TRAIN_TER', 
        label: 'Train (TER/Intercités)', 
        co2PerKm: 24.8, 
        emoji: '' 
    },
    { 
        key: 'AVION', 
        label: 'Avion (Moyen)', 
        co2PerKm: 230, 
        emoji: ' ' 
    },
    { 
        key: 'METRO', 
        label: 'Métro / RER', 
        co2PerKm: 4, 
        emoji: ' ' 
    },
    { 
        key: 'BUS', 
        label: 'Bus', 
        co2PerKm: 104, 
        emoji: ' ' 
    },
    { 
        key: 'TRAM', 
        label: 'Tramway', 
        co2PerKm: 3, 
        emoji: ' ' 
    }
];