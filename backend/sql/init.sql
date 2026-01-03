-- /backend/sql/init.sql

-- 1. Table des utilisateurs
create table if not exists users (
    id UUID primary key default gen_random_uuid(),
    email varchar(255) unique not null,
    password_hash VARCHAR(255) not null,
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

-- 2. Table des profils utilisateurs
create table if not exists user_profiles(
    user_id UUID primary key references users(id) on delete cascade,
    pseudo varchar(100),
    genre genre_enum,
    emission_co2_lifestyle FLOAT,
    emission_co2_transport FLOAT
);

-- 3. Table des véhicules
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

-- 4. Table des trajets
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

-- 5. Table des produits
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
-- 6. Table Type Chauffage (Mise à jour avec vos données)
-- =================================================================
CREATE TABLE IF NOT EXISTS type_chauffage (
    id SERIAL PRIMARY KEY,
    type_chauffage VARCHAR(100) NOT NULL UNIQUE, -- Ajout de UNIQUE pour supporter ON CONFLICT
    consommation_moyenne_kwh_m2 FLOAT DEFAULT 0,
    facteur_emission_co2 FLOAT DEFAULT 0
);

-- Insertion de vos données spécifiques
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

-- 8. Création du type pour électroménager
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'type_electromenager_enum') THEN
        CREATE TYPE type_electromenager_enum AS ENUM (
            'Refrigerateur', 'Congelateur', 'Lave-linge', 'Seche-linge', 
            'Lave-vaisselle', 'Four', 'Micro-ondes', 'Televiseur', 'Ordinateur', 'Autre'
        );
    END IF;
END$$;

-- 9. Table electromenager
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

-- 10. Fonctions et Triggers
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

-- 11. Migrations structure
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'password_hash' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'google_id'
    ) THEN
        ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE;
    END IF;
END $$;