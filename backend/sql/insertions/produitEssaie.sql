-- Insertion des données Base Carbone (Agribalyse) dans la table produit
-- Utilisation de 'WHERE NOT EXISTS' pour éviter les doublons basés sur le nom

INSERT INTO produit (nom, categorie, sous_categorie, emission_co2_par_unite, unite, source, identifiant_source, description)
SELECT * FROM (VALUES
    -- VIANDES ET POISSONS
    ('Bœuf (viande moyenne)', 'Viandes et Poissons', 'Viande rouge', 28.6, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-001', 'Moyenne steak/rôti cru'),
    ('Agneau (viande)', 'Viandes et Poissons', 'Viande rouge', 25.8, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-002', 'Viande d''agneau crue'),
    ('Porc (viande moyenne)', 'Viandes et Poissons', 'Viande blanche', 5.9, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-003', 'Côte ou rôti de porc cru'),
    ('Poulet (entier)', 'Viandes et Poissons', 'Volaille', 4.8, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-004', 'Poulet standard cru'),
    ('Dinde (escalope)', 'Viandes et Poissons', 'Volaille', 5.2, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-005', 'Escalope de dinde crue'),
    ('Jambon blanc (cuit)', 'Viandes et Poissons', 'Charcuterie', 4.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-006', 'Jambon cuit standard'),
    ('Saucisson sec', 'Viandes et Poissons', 'Charcuterie', 10.2, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-007', 'Saucisson sec porc'),
    ('Saumon (élevage)', 'Viandes et Poissons', 'Poisson', 5.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-008', 'Saumon atlantique élevage cru'),
    ('Cabillaud', 'Viandes et Poissons', 'Poisson', 4.2, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-009', 'Poisson blanc sauvage'),
    ('Thon (en boîte)', 'Viandes et Poissons', 'Conserve', 3.8, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-010', 'Thon au naturel égoutté'),
    ('Œuf (moyen)', 'Viandes et Poissons', 'Œufs', 2.3, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-011', 'Œuf de poule code 1/2/3'),

    -- PRODUITS LAITIERS
    ('Lait (demi-écrémé)', 'Produits Laitiers', 'Lait', 1.2, 'litre', 'Base Carbone'::produit_source_enum, 'AGRI-020', 'Lait vache UHT'),
    ('Beurre (doux)', 'Produits Laitiers', 'Matière grasse', 9.0, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-021', 'Beurre pasteurisé'),
    ('Fromage (pâte dure)', 'Produits Laitiers', 'Fromage', 6.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-022', 'Type Emmental ou Comté'),
    ('Fromage (pâte molle)', 'Produits Laitiers', 'Fromage', 4.8, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-023', 'Type Camembert ou Brie'),
    ('Yaourt (nature)', 'Produits Laitiers', 'Yaourt', 1.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-024', 'Yaourt lait de vache nature'),
    ('Crème fraîche', 'Produits Laitiers', 'Crème', 4.2, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-025', 'Crème épaisse 30% MG'),

    -- FRUITS ET LÉGUMES
    ('Pomme (fruit)', 'Fruits et Légumes', 'Fruits', 0.35, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-040', 'Pomme locale saison'),
    ('Banane', 'Fruits et Légumes', 'Fruits', 0.85, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-041', 'Banane import'),
    ('Orange', 'Fruits et Légumes', 'Fruits', 0.65, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-042', 'Agrume import'),
    ('Fraise (saison)', 'Fruits et Légumes', 'Fruits', 0.70, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-043', 'Fraise production locale'),
    ('Fraise (hors saison/serre)', 'Fruits et Légumes', 'Fruits', 2.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-044', 'Fraise serre chauffée'),
    ('Tomate (saison)', 'Fruits et Légumes', 'Légumes', 0.40, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-045', 'Tomate pleine terre'),
    ('Tomate (hors saison)', 'Fruits et Légumes', 'Légumes', 2.2, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-046', 'Tomate serre chauffée'),
    ('Carotte', 'Fruits et Légumes', 'Légumes', 0.30, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-047', 'Carotte crue'),
    ('Pomme de terre', 'Fruits et Légumes', 'Féculents', 0.50, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-048', 'Pomme de terre conservation'),
    ('Salade (laitue)', 'Fruits et Légumes', 'Légumes', 0.90, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-049', 'Salade verte'),
    ('Avocat', 'Fruits et Légumes', 'Fruits', 1.3, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-050', 'Avocat import'),

    -- CÉRÉALES ET FÉCULENTS
    ('Pain (baguette)', 'Céréales', 'Pain', 1.1, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-060', 'Baguette farine blé T65'),
    ('Pâtes (sèches)', 'Céréales', 'Pâtes', 1.3, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-061', 'Pâtes blé dur'),
    ('Riz (blanc)', 'Céréales', 'Riz', 2.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-062', 'Riz blanc standard'),
    ('Lentilles (sèches)', 'Céréales', 'Légumineuses', 0.9, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-063', 'Lentilles vertes'),
    ('Farine de blé', 'Céréales', 'Farine', 0.8, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-064', 'Farine T55'),

    -- BOISSONS
    ('Eau du robinet', 'Boissons', 'Eau', 0.0002, 'litre', 'Base Carbone'::produit_source_enum, 'AGRI-080', 'Eau réseau distribution'),
    ('Eau en bouteille', 'Boissons', 'Eau', 0.45, 'litre', 'Base Carbone'::produit_source_enum, 'AGRI-081', 'Eau minérale bouteille plastique'),
    ('Café (poudre)', 'Boissons', 'Chaud', 10.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-082', 'Café moulu ou grain'),
    ('Thé', 'Boissons', 'Chaud', 1.2, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-083', 'Thé feuilles séchées'),
    ('Vin rouge', 'Boissons', 'Alcool', 1.4, 'litre', 'Base Carbone'::produit_source_enum, 'AGRI-084', 'Vin bouteille verre'),
    ('Bière', 'Boissons', 'Alcool', 0.7, 'litre', 'Base Carbone'::produit_source_enum, 'AGRI-085', 'Bière bouteille'),
    ('Jus d''orange', 'Boissons', 'Jus', 1.1, 'litre', 'Base Carbone'::produit_source_enum, 'AGRI-086', 'Jus base concentré'),
    ('Soda', 'Boissons', 'Soda', 0.5, 'litre', 'Base Carbone'::produit_source_enum, 'AGRI-087', 'Boisson gazeuse sucrée'),

    -- DIVERS
    ('Chocolat (noir)', 'Épicerie sucrée', 'Chocolat', 5.8, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-090', 'Chocolat noir tablette'),
    ('Chocolat (lait)', 'Épicerie sucrée', 'Chocolat', 4.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-091', 'Chocolat lait tablette'),
    ('Sucre (blanc)', 'Épicerie sucrée', 'Sucre', 0.6, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-092', 'Sucre betterave'),
    ('Huile d''olive', 'Épicerie salée', 'Huiles', 3.2, 'litre', 'Base Carbone'::produit_source_enum, 'AGRI-093', 'Huile olive vierge'),
    ('Huile de tournesol', 'Épicerie salée', 'Huiles', 2.6, 'litre', 'Base Carbone'::produit_source_enum, 'AGRI-094', 'Huile tournesol raffinée'),
    ('Amandes', 'Épicerie salée', 'Fruits secs', 2.3, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-095', 'Amandes décortiquées')

) AS v(nom, categorie, sous_categorie, emission_co2_par_unite, unite, source, identifiant_source, description)
WHERE NOT EXISTS (
    SELECT 1 FROM produit p WHERE p.nom = v.nom
);