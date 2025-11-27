-- /backend/sql/init.sql
-- Table des utilisateurs
create table if not exists users (
                       id UUID primary key default gen_random_uuid(),
                       email varchar(255) unique not null,
                       password_hash VARCHAR(255) not null,
                       created_at timestamp default now(),
                       is_active boolean default true,
                       consent_rgpd boolean default false
);
create type genre_enum as enum ('Homme','Femme','Autre');
--Table des profils utilisateurs
create table if not exists user_profiles(
                              user_id UUID primary key references users(id) on delete cascade,
                              pseudo varchar(100),
                              genre genre_enum,
                              emission_co2_lifestyle FLOAT,
                              emission_co2_transport FLOAT
);
-- Table des véhicules
create table if not exists vehicles (
                                        id serial primary key,
                                        user_id uuid not null references users(id) on delete cascade,
                                        name varchar(255) not null,
                                        plate varchar(20),
                                        type varchar(50),
                                        fuel_type varchar(50) not null,
                                        consumption_l_per_100 numeric(10,2),
                                        created_at timestamp default now()
);

-- Table des trajets
create table if not exists trips (
                                 id serial primary key,
                                 user_id uuid references users(id) on delete cascade,
                                 vehicle_id serial not null references vehicles,
                                 date date not null,
                                 from_city varchar(255) not null,
                                 to_city varchar(255) not null,
                                 distance_km numeric(10,1) not null,
                                 co2_kg numeric(10,2) not null,
                                 tag varchar(255),
                                 created_at timestamp default now()
);




create type produit_source_enum as enum ('Base Carbone','Open Food Facts','Manuel');
--Table des produits
create table if not exists produit (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    categorie VARCHAR(100),
    sous_categorie VARCHAR(100),
    emission_co2_par_unite FLOAT NOT NULL, 
    unite VARCHAR(50) NOT NULL, 
    source produit_source_enum,
    identifiant_source VARCHAR(100), 
    description TEXT,
    date_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Table des logements
-- Table des types de chauffage
CREATE TABLE IF NOT EXISTS type_chauffage(
    id SERIAL PRIMARY KEY,
    type_chauffage VARCHAR(100) NOT NULL UNIQUE,
    consommation_moyenne_kwh_m2 FLOAT NOT NULL,
    facteur_emission_co2 FLOAT NOT NULL
);

-- Table des logements
CREATE TABLE IF NOT EXISTS logement(
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    superficie FLOAT NOT NULL CHECK (superficie > 0),
    nombre_pieces INT NOT NULL CHECK (nombre_pieces > 0),
    type_chauffage_id INT REFERENCES type_chauffage(id),
    classe_isolation CHAR(1) CHECK (classe_isolation IN ('A', 'B', 'C', 'D', 'E', 'F', 'G')),
    emission_co2_annuelle FLOAT,
    date_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    zone_climatique VARCHAR(50)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_logement_user_id ON logement(user_id);
CREATE INDEX IF NOT EXISTS idx_logement_type_chauffage_id ON logement(type_chauffage_id);

-- Fonction pour calculer les émissions de CO2
CREATE OR REPLACE FUNCTION calculer_emission_co2()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type_chauffage_id IS NOT NULL THEN
        NEW.emission_co2_annuelle :=
            NEW.superficie *
            (SELECT consommation_moyenne_kwh_m2 FROM type_chauffage WHERE id = NEW.type_chauffage_id) *
            (SELECT facteur_emission_co2 FROM type_chauffage WHERE id = NEW.type_chauffage_id) *
            (1 - CASE NEW.classe_isolation
                WHEN 'A' THEN 0.80
                WHEN 'B' THEN 0.60
                WHEN 'C' THEN 0.40
                WHEN 'D' THEN 0.20
                WHEN 'E' THEN 0.10
                WHEN 'F' THEN 0.05
                WHEN 'G' THEN 0.00
                ELSE 0.00
            END);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour les émissions de CO2
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_calcul_emission_co2'
    ) THEN
        CREATE TRIGGER trigger_calcul_emission_co2
        BEFORE INSERT OR UPDATE ON logement
        FOR EACH ROW
        EXECUTE FUNCTION calculer_emission_co2();
    END IF;
END $$;