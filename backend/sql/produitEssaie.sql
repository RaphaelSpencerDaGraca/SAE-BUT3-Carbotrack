INSERT INTO produit (nom, categorie, sous_categorie, emission_co2_par_unite, unite, source, identifiant_source, description)
VALUES
  ('Chauffage électrique', 'logement', 'énergie', 1500, 'kg CO2/an', 'Base Carbone', 'ADEME_1', 'Émissions annuelles pour un logement moyen'),
  ('Viande bovine', 'alimentation', 'viande', 27, 'kg CO2/kg', 'Base Carbone', 'ADEME_2', 'Émissions par kg de viande bovine'),
  ('Viande de volaille', 'alimentation', 'viande', 18, 'kg CO2/kg', 'Base Carbone', 'ADEME_2', 'Émissions par kg de viande de volaille'),
  ('Voiture essence', 'transports', 'voiture', 2.3, 'kg CO2/km', 'Base Carbone', 'ADEME_3', 'Émissions par km'),
  ('Vol long-courrier', 'loisirs', 'avion', 2500, 'kg CO2/vol', 'Base Carbone', 'ADEME_4', 'Émissions par vol >6h');