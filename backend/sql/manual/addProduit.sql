-- Produit 1 : Légume (Base Carbone)
INSERT INTO produit (nom, categorie, sous_categorie, emission_co2_par_unite, unite, source, identifiant_source, description)
VALUES ('Tomate', 'Alimentation', 'Légumes', 0.2, 'kg', 'Base Carbone', 'AGRIBALYSE3.1.1_140046', 'Tomate de saison, cultivée en plein champ');

-- Produit 2 : Viande (Base Carbone)
INSERT INTO produit (nom, categorie, sous_categorie, emission_co2_par_unite, unite, source, identifiant_source, description)
VALUES ('Poulet entier', 'Alimentation', 'Viandes', 4.4, 'kg', 'Base Carbone', 'AGRIBALYSE3.1.1_110001', 'Poulet standard, élevé en France');

-- Produit 3 : Boisson (Open Food Facts)
INSERT INTO produit (nom, categorie, sous_categorie, emission_co2_par_unite, unite, source, identifiant_source, description)
VALUES ('Eau minérale en bouteille', 'Boissons', 'Eaux', 0.3, 'litre', 'Open Food Facts', '3256220005003', 'Bouteille en plastique recyclable, source française');

-- Produit 4 : Appareil électroménager (Manuel)
INSERT INTO produit (nom, categorie, sous_categorie, emission_co2_par_unite, unite, source, identifiant_source, description)
VALUES ('Réfrigérateur', 'Électroménager', 'Froid', 1200, 'unité', 'Manuel', 'REFRIG_2023_001', 'Classe énergétique A+++');

-- Produit 5 : Vêtement (Manuel)
INSERT INTO produit (nom, categorie, sous_categorie, emission_co2_par_unite, unite, source, identifiant_source, description)
VALUES ('T-shirt en coton', 'Textile', 'Hauts', 7, 'unité', 'Manuel', 'T_SHIRT_COTON_001', 'Fabriqué au Bangladesh, transport maritime');
