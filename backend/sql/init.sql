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

create type genre_enum as enum ('Homme','Femme','Autre');
--Table des profils utilisateurs
create table if not exists user_profiles(
                              user_id UUID primary key references users(id) on delete cascade,
                              pseudo varchar(100),
                              genre genre_enum,
                              emission_co2_lifestyle FLOAT,
                              emission_co2_transport FLOAT
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
