-- Ajout d'un utilisateur de test

-- (optionnel) Au cas où tu utilises gen_random_uuid() ailleurs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO users (email, password_hash, is_active, consent_rgpd)
VALUES (
           'test@test.com',
           'mot_de_passe_from:sql/manual/addTestUser.sql',
           true,
           true
       )
ON CONFLICT (email) DO NOTHING;

-- Véhicule de test

INSERT INTO vehicles (
    user_id,
    name,
    plate,
    type,
    fuel_type,
    consumption_l_per_100
)
SELECT
    u.id,
    'Clio Diesel',
    'AB-123-CD',
    'Citadine',
    'essence',
    6.20
FROM users u
WHERE u.email = 'test@test.com';

-- Trajets de test
WITH test_user AS (
    SELECT id
    FROM users
    WHERE email = 'test@test.com'
)

INSERT INTO trips (
    user_id,
    vehicle_id,
    date,
    from_city,
    to_city,
    distance_km,
    co2_kg,
    tag
)
SELECT
    tu.id,
    v.id AS vehicle_id,
    t.date,
    t.from_city,
    t.to_city,
    t.distance_km,
    t.co2_kg,
    t.tag
FROM test_user AS tu
         JOIN vehicles v
              ON v.user_id = tu.id
                  AND v.plate = 'AB-123-CD'  -- on récupère la Clio de test
         CROSS JOIN (
    VALUES
        ('2025-01-10'::date, 'PAPAPAPA', 'Orléans', 132.0, 'Clio Diesel', 24.5, 'Domicile → Mission'),
        ('2025-01-12'::date, 'Orléans',  'Paris',   135.0, 'Clio Diesel', 25.1, 'Retour'),
        ('2025-01-15'::date, 'Paris',    'IUT Paris', 8.0, 'Tram / Métro', 1.2, 'Trajet quotidien')
) AS t (date, from_city, to_city, distance_km, vehicle_name, co2_kg, tag);
