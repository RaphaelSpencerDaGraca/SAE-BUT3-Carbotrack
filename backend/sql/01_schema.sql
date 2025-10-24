-- Table des utilisateurs
create table users (
                       id UUID primary key default gen_random_uuid(),
                       email varchar(255) unique not null,
                       password_hash VARCHAR(255) not null,
                       created_at timestamp default now(),
                       is_active boolean default true,
                       consent_rgpd boolean default false
);



create type genre_enum as enum ('Homme','Femme','Autre');
--Table des profils utilisateurs
create table user_profiles(
                              user_id UUID primary key references users(id),
                              pseudo varchar(100),
                              genre genre_enum
);

