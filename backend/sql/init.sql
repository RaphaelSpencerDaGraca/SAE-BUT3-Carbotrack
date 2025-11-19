
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
                              user_id UUID primary key references users(id),
                              pseudo varchar(100),
                              genre genre_enum
);

create type produit_source_enum as enum ('Base Carbone','Open Food Facts','Manuel')
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
