

INSERT INTO produit (nom, categorie, sous_categorie, emission_co2_par_unite, unite, source, identifiant_source, description)
SELECT * FROM (VALUES
   
    ('Pamplemousse', 'Fruits et Légumes', 'Fruits', 0.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FR-016', 'Pomelo ou pamplemousse import'),
    ('Nectarine', 'Fruits et Légumes', 'Fruits', 0.9, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FR-017', 'Nectarine ou brugnon'),
    ('Prune', 'Fruits et Légumes', 'Fruits', 0.7, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FR-018', 'Prune de table (reine-claude, mirabelle)'),
    ('Figue', 'Fruits et Légumes', 'Fruits', 0.6, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FR-019', 'Figue fraîche'),
    ('Grenade', 'Fruits et Légumes', 'Fruits', 1.0, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FR-020', 'Grenade fruit frais'),
    ('Papaye', 'Fruits et Légumes', 'Fruits', 2.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FR-021', 'Papaye importée (transport mixte)'),
    ('Litchi', 'Fruits et Légumes', 'Fruits', 1.2, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FR-022', 'Litchi frais import'),
    ('Datte', 'Fruits et Légumes', 'Fruits', 0.6, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FR-023', 'Datte séchée ou fraîche import'),
    ('Groseille', 'Fruits et Légumes', 'Fruits', 0.8, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FR-024', 'Groseille rouge grappe'),
    ('Mûre', 'Fruits et Légumes', 'Fruits', 1.1, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FR-025', 'Mûre cultivée ou sauvage'),
    ('Cassis', 'Fruits et Légumes', 'Fruits', 0.9, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FR-026', 'Baie de cassis'),
    ('Kaki', 'Fruits et Légumes', 'Fruits', 0.6, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FR-027', 'Plaquemine / Kaki'),
    ('Coing', 'Fruits et Légumes', 'Fruits', 0.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FR-028', 'Coing fruit frais'),
    ('Rhubarbe', 'Fruits et Légumes', 'Fruits', 0.4, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FR-029', 'Tige de rhubarbe'),
    ('Fruit de la passion', 'Fruits et Légumes', 'Fruits', 3.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FR-030', 'Fruit de la passion (transport avion fréquent)'),


    ('Carotte', 'Fruits et Légumes', 'Légumes', 0.3, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-LEG-016', 'Carotte lavée'),
    ('Tomate', 'Fruits et Légumes', 'Légumes', 0.8, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-LEG-017', 'Tomate saison/hors saison mix'),
    ('Pomme de terre', 'Fruits et Légumes', 'Légumes', 0.4, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-LEG-018', 'Pomme de terre conservation'),
    ('Endive', 'Fruits et Légumes', 'Légumes', 0.6, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-LEG-019', 'Endive / Chicon'),
    ('Betterave', 'Fruits et Légumes', 'Légumes', 0.4, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-LEG-020', 'Betterave rouge cuite ou crue'),
    ('Céleri-rave', 'Fruits et Légumes', 'Légumes', 0.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-LEG-021', 'Céleri rave boule'),
    ('Céleri-branche', 'Fruits et Légumes', 'Légumes', 0.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-LEG-022', 'Céleri branche vert'),
    ('Fenouil', 'Fruits et Légumes', 'Légumes', 0.6, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-LEG-023', 'Bulbe de fenouil'),
    ('Petit pois', 'Fruits et Légumes', 'Légumes', 0.8, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-LEG-024', 'Petit pois frais écossé'),
    ('Artichaut', 'Fruits et Légumes', 'Légumes', 1.1, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-LEG-025', 'Artichaut globe'),
    ('Blette', 'Fruits et Légumes', 'Légumes', 0.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-LEG-026', 'Blette carde et feuille'),
    ('Navet', 'Fruits et Légumes', 'Légumes', 0.4, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-LEG-027', 'Navet violet ou blanc'),
    ('Citrouille', 'Fruits et Légumes', 'Légumes', 0.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-LEG-028', 'Citrouille pour soupe'),
    ('Butternut', 'Fruits et Légumes', 'Légumes', 0.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-LEG-029', 'Courge Butternut'),
    ('Salsifis', 'Fruits et Légumes', 'Légumes', 0.7, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-LEG-030', 'Salsifis frais'),

   
    ('Riz blanc', 'Épicerie salée', 'Féculents', 2.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FEC-011', 'Riz blanc standard'),
    ('Riz complet', 'Épicerie salée', 'Féculents', 2.2, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FEC-012', 'Riz complet brun'),
    ('Pâtes sèches', 'Épicerie salée', 'Féculents', 1.4, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FEC-013', 'Pâtes alimentaires blé dur'),
    ('Lentilles vertes', 'Épicerie salée', 'Féculents', 0.9, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FEC-014', 'Lentilles vertes sèches'),
    ('Lentilles corail', 'Épicerie salée', 'Féculents', 1.2, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FEC-015', 'Lentilles corail sèches'),
    ('Pois cassés', 'Épicerie salée', 'Féculents', 0.8, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FEC-016', 'Pois cassés secs'),
    ('Millet', 'Épicerie salée', 'Féculents', 1.0, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FEC-017', 'Graines de millet décortiqué'),
    ('Orge perlé', 'Épicerie salée', 'Féculents', 1.1, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FEC-018', 'Orge perlé sec'),
    ('Manioc', 'Fruits et Légumes', 'Féculents', 0.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FEC-019', 'Racine de manioc'),
    ('Igname', 'Fruits et Légumes', 'Féculents', 0.5, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FEC-020', 'Igname racine'),
    ('Farine de blé', 'Épicerie salée', 'Céréales', 1.1, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FEC-021', 'Farine T55'),
    ('Polenta', 'Épicerie salée', 'Féculents', 1.0, 'kg', 'Base Carbone'::produit_source_enum, 'AGRI-FEC-022', 'Semoule de maïs'),

    
    ('Crème hydratante', 'Hygiène', 'Soins', 0.5, 'unité', 'Base Carbone'::produit_source_enum, 'HYG-015', 'Tube crème visage/corps (100ml)'),
    ('Baume à lèvres', 'Hygiène', 'Soins', 0.1, 'unité', 'Base Carbone'::produit_source_enum, 'HYG-016', 'Stick lèvres standard'),
    ('Mascara', 'Hygiène', 'Maquillage', 0.1, 'unité', 'Base Carbone'::produit_source_enum, 'HYG-017', 'Tube mascara'),
    ('Fond de teint', 'Hygiène', 'Maquillage', 0.3, 'unité', 'Base Carbone'::produit_source_enum, 'HYG-018', 'Flacon fond de teint'),
    ('Démaquillant', 'Hygiène', 'Soins', 1.5, 'litre', 'Base Carbone'::produit_source_enum, 'HYG-019', 'Eau micellaire ou lait'),
    ('Bain de bouche', 'Hygiène', 'Bucco-dentaire', 1.5, 'litre', 'Base Carbone'::produit_source_enum, 'HYG-020', 'Solution bain de bouche'),
    ('Fil dentaire', 'Hygiène', 'Bucco-dentaire', 0.05, 'unité', 'Base Carbone'::produit_source_enum, 'HYG-021', 'Boîte fil dentaire'),
    ('Coton-tige', 'Hygiène', 'Soins', 0.2, 'unité', 'Base Carbone'::produit_source_enum, 'HYG-022', 'Boîte de cotons-tiges (papier)'),
    ('Crème solaire', 'Hygiène', 'Soins', 0.8, 'unité', 'Base Carbone'::produit_source_enum, 'HYG-023', 'Tube crème solaire 200ml'),
    ('Mousse à raser', 'Hygiène', 'Rasage', 0.5, 'unité', 'Base Carbone'::produit_source_enum, 'HYG-024', 'Bombe mousse à raser'),
    ('Lotion tonique', 'Hygiène', 'Soins', 1.5, 'litre', 'Base Carbone'::produit_source_enum, 'HYG-025', 'Lotion visage'),
    ('Gommage corps', 'Hygiène', 'Soins', 0.6, 'unité', 'Base Carbone'::produit_source_enum, 'HYG-026', 'Pot gommage exfoliant'),

    -- SUITE MÉNAGE (MEN-013+)
    ('Vinaigre blanc', 'Ménage', 'Désinfectant', 0.4, 'litre', 'Base Carbone'::produit_source_enum, 'MEN-013', 'Vinaigre ménager 14°'),
    ('Bicarbonate de soude', 'Ménage', 'Surface', 0.8, 'kg', 'Base Carbone'::produit_source_enum, 'MEN-014', 'Poudre bicarbonate'),
    ('Savon noir', 'Ménage', 'Surface', 1.0, 'litre', 'Base Carbone'::produit_source_enum, 'MEN-015', 'Savon noir liquide'),
    ('Désodorisant', 'Ménage', 'Air', 3.0, 'unité', 'Base Carbone'::produit_source_enum, 'MEN-016', 'Spray aérosol'),
    ('Insecticide', 'Ménage', 'Nuisibles', 4.0, 'unité', 'Base Carbone'::produit_source_enum, 'MEN-017', 'Spray insecticide'),
    ('Bloc WC', 'Ménage', 'Sanitaires', 0.5, 'unité', 'Base Carbone'::produit_source_enum, 'MEN-018', 'Bloc cuvette WC'),
    ('Lingettes nettoyantes', 'Ménage', 'Surface', 1.5, 'unité', 'Base Carbone'::produit_source_enum, 'MEN-019', 'Paquet lingettes jetables'),
    ('Déboucheur', 'Ménage', 'Sanitaires', 3.5, 'litre', 'Base Carbone'::produit_source_enum, 'MEN-020', 'Gel déboucheur canalisations'),
    ('Cire pour meubles', 'Ménage', 'Surface', 2.0, 'litre', 'Base Carbone'::produit_source_enum, 'MEN-021', 'Cire liquide bois'),
    ('Sel lave-vaisselle', 'Ménage', 'Vaisselle', 0.5, 'kg', 'Base Carbone'::produit_source_enum, 'MEN-022', 'Sel régénérant')

) AS v(nom, categorie, sous_categorie, emission_co2_par_unite, unite, source, identifiant_source, description)
WHERE NOT EXISTS (
    SELECT 1 FROM produit p WHERE p.nom = v.nom
);