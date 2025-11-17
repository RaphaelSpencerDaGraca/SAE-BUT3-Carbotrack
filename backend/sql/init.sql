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
                                     date date not null,
                                     from_city varchar(255) not null,
                                     to_city varchar(255) not null,
                                     distance_km numeric(10,1) not null,
                                     vehicle_name varchar(255) not null,
                                     co2_kg numeric(10,2) not null,
                                     tag varchar(255),
                                     created_at timestamp default now()
);


create type genre_enum as enum ('Homme','Femme','Autre');
--Table des profils utilisateurs
create table if not exists user_profiles(
                              user_id UUID primary key references users(id),
                              pseudo varchar(100),
                              genre genre_enum
);

