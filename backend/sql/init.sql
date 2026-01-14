-- /backend/sql/init.sql

-- =================================================================
-- 1. Table des utilisateurs
-- =================================================================
create table if not exists users (
    id UUID primary key default gen_random_uuid(),
    email varchar(255) unique not null,
    password_hash VARCHAR(255), -- Peut être null si Google Auth
    google_id VARCHAR(255) UNIQUE,
    created_at timestamp default now(),
    is_active boolean default true,
    consent_rgpd boolean default false
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'genre_enum') THEN
        CREATE TYPE genre_enum AS ENUM ('Homme','Femme','Autre');
    END IF;
END$$;

-- =================================================================
-- 2. Table des profils utilisateurs
-- =================================================================
create table if not exists user_profiles(
    user_id UUID primary key references users(id) on delete cascade,
    pseudo varchar(100),
    genre genre_enum,
    emission_co2_lifestyle FLOAT DEFAULT 0,
    emission_co2_transport FLOAT DEFAULT 0
);

-- =================================================================
-- 3. Table des véhicules
-- =================================================================
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

CREATE TABLE IF NOT EXISTS car_labelling (
     id SERIAL PRIMARY KEY,
     body_type TEXT,
     model_label TEXT,
     energy TEXT,
     gearbox TEXT,
     conso_min NUMERIC(10,2),
     conso_max NUMERIC(10,2),
     conso_unit TEXT,
     created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_car_labelling_model_label ON car_labelling (model_label);
CREATE INDEX IF NOT EXISTS idx_car_labelling_energy ON car_labelling (energy);

-- =================================================================
-- 4. Table des trajets
-- =================================================================
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

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'produit_source_enum') THEN
        CREATE TYPE produit_source_enum AS ENUM ('Base Carbone','Open Food Facts','Manuel');
    END IF;
END$$;

-- =================================================================
-- 5. Table des produits
-- =================================================================
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

-- =================================================================
-- 6. Table Type Chauffage
-- =================================================================
CREATE TABLE IF NOT EXISTS type_chauffage (
    id SERIAL PRIMARY KEY,
    type_chauffage VARCHAR(100) NOT NULL UNIQUE,
    consommation_moyenne_kwh_m2 FLOAT DEFAULT 0,
    facteur_emission_co2 FLOAT DEFAULT 0
);

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

-- =================================================================
-- 7. Table des logements
-- =================================================================
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

CREATE INDEX IF NOT EXISTS idx_logement_user_id ON logement(user_id);
CREATE INDEX IF NOT EXISTS idx_logement_type_chauffage_id ON logement(type_chauffage_id);

-- =================================================================
-- 8. Table Electroménager
-- =================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'type_electromenager_enum') THEN
        CREATE TYPE type_electromenager_enum AS ENUM (
            'Refrigerateur', 'Congelateur', 'Lave-linge', 'Seche-linge', 
            'Lave-vaisselle', 'Four', 'Micro-ondes', 'Televiseur', 'Ordinateur', 'Autre'
        );
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS electromenager (
    id SERIAL PRIMARY KEY,
    logement_id INT NOT NULL REFERENCES logement(id) ON DELETE CASCADE,
    nom VARCHAR(255) NOT NULL,
    type type_electromenager_enum NOT NULL,
    marque VARCHAR(100),
    modele VARCHAR(100), 
    
    consommation_kwh_an FLOAT DEFAULT 0, 
    consommation_eau_an FLOAT DEFAULT 0, 
    classe_energetique VARCHAR(5),

    co2_fabrication_kg FLOAT DEFAULT 0, 
    co2_usage_kg_an FLOAT DEFAULT 0,
    
    source_donnees VARCHAR(50) DEFAULT 'Manuel',
    date_achat DATE, 
    duree_vie_theorique_ans INT DEFAULT 10, 
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_electromenager_logement_id ON electromenager(logement_id);

-- =================================================================
-- 10. Fonctions et Triggers (LOGIQUE MÉTIER)
-- =================================================================

-- A. Fonction pour calculer l'émission d'UN logement (déclenchée avant insertion/update)
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

-- Trigger A : Calcul local (sur la table logement)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_calcul_emission_co2') THEN
        CREATE TRIGGER trigger_calcul_emission_co2
        BEFORE INSERT OR UPDATE ON logement
        FOR EACH ROW
        EXECUTE FUNCTION calculer_emission_co2();
    END IF;
END $$;


-- B. Fonction pour mettre à jour le TOTAL LIFESTYLE de l'utilisateur
-- Cette fonction additionne (Tous les logements) + (Tous les appareils électroménagers)
CREATE OR REPLACE FUNCTION update_user_lifestyle_co2()
RETURNS TRIGGER AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Déterminer l'ID utilisateur concerné (OLD pour une suppression, NEW pour le reste)
    IF (TG_OP = 'DELETE') THEN
        target_user_id := OLD.user_id;
    ELSE
        target_user_id := NEW.user_id;
    END IF;

    -- Mettre à jour la table user_profiles
    UPDATE user_profiles
    SET emission_co2_lifestyle = (
        -- 1. Somme des émissions des logements (Chauffage/Isolation)
        COALESCE((SELECT SUM(emission_co2_annuelle) FROM logement WHERE user_id = target_user_id), 0)
        +
        -- 2. Somme des émissions des appareils (liés via les logements de l'utilisateur)
        COALESCE((
            SELECT SUM(e.co2_usage_kg_an) 
            FROM electromenager e 
            JOIN logement l ON e.logement_id = l.id 
            WHERE l.user_id = target_user_id
        ), 0)
    )
    WHERE user_id = target_user_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger B : Mise à jour globale (se déclenche APRÈS modif sur logement)
DROP TRIGGER IF EXISTS trigger_update_user_lifestyle ON logement;

CREATE TRIGGER trigger_update_user_lifestyle
AFTER INSERT OR UPDATE OR DELETE ON logement
FOR EACH ROW
EXECUTE FUNCTION update_user_lifestyle_co2();

-- Note : Idéalement, on ajouterait aussi ce trigger sur la table 'electromenager'
-- pour que l'ajout d'un frigo mette aussi à jour le profil global.
DROP TRIGGER IF EXISTS trigger_update_user_lifestyle_from_electro ON electromenager;

CREATE OR REPLACE FUNCTION update_user_lifestyle_from_electro()
RETURNS TRIGGER AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Récupérer l'user_id via la table logement
    IF (TG_OP = 'DELETE') THEN
        SELECT user_id INTO target_user_id FROM logement WHERE id = OLD.logement_id;
    ELSE
        SELECT user_id INTO target_user_id FROM logement WHERE id = NEW.logement_id;
    END IF;

    -- On appelle la même logique de mise à jour (copiée pour simplifier ou appel de procédure)
    UPDATE user_profiles
    SET emission_co2_lifestyle = (
        COALESCE((SELECT SUM(emission_co2_annuelle) FROM logement WHERE user_id = target_user_id), 0)
        +
        COALESCE((
            SELECT SUM(e.co2_usage_kg_an) 
            FROM electromenager e 
            JOIN logement l ON e.logement_id = l.id 
            WHERE l.user_id = target_user_id
        ), 0)
    )
    WHERE user_id = target_user_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_lifestyle_from_electro
AFTER INSERT OR UPDATE OR DELETE ON electromenager
FOR EACH ROW
EXECUTE FUNCTION update_user_lifestyle_from_electro();