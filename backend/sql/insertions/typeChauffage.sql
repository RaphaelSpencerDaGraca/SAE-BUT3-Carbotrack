INSERT INTO type_chauffage (type_chauffage, consommation_moyenne_kwh_m2, facteur_emission_co2)
VALUES
    ('Électricité', 125, 0.147),
    ('Chaudière à gaz', 150, 0.227),
    ('Chaudière à fioul', 250, 0.324),
    ('Pompe à chaleur air/eau', 50, 0.05), 
    ('Pompe à chaleur géothermique', 40, 0.04),  
    ('Chauffage électrique', 125, 0.147),  
    ('Poêle à bois', 100, 0.03),
    ('Chauffage au charbon', 300, 0.35), 
    ('Chauffage solaire thermique', 0, 0.0) 
ON CONFLICT (type_chauffage) DO NOTHING;