-- ============================================================================
-- V1__initialisation_schema_fr.sql : Schéma ERP Interne NexoManager.app (FR)
-- ============================================================================

CREATE TABLE utilisateurs_staff (
                                    id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                    nom_complet VARCHAR(120) NOT NULL,
                                    email VARCHAR(150) NOT NULL UNIQUE,
                                    mot_de_passe_hash VARCHAR(255) NOT NULL,
                                    telephone VARCHAR(30),
                                    url_avatar VARCHAR(500),
                                    role VARCHAR(30) NOT NULL COMMENT 'ROLE_PROPRIETAIRE, ROLE_EMPLOYE',
                                    actif BOOLEAN NOT NULL DEFAULT TRUE,
                                    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE vehicules (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           code_vehicule VARCHAR(30) NOT NULL UNIQUE,
                           matricule VARCHAR(30) NOT NULL UNIQUE,
                           marque VARCHAR(80) NOT NULL,
                           modele VARCHAR(80) NOT NULL,
                           categorie VARCHAR(40) NOT NULL COMMENT 'BERLINE, SUV, CITADINE, CABRIOLET, UTILITAIRE, MONOSPACE',
                           statut VARCHAR(30) NOT NULL DEFAULT 'DISPONIBLE' COMMENT 'DISPONIBLE, MAINTENANCE, INDISPONIBLE, EN_TRAJET',
                           transmission VARCHAR(20) NOT NULL COMMENT 'AUTOMATIQUE, MANUELLE',
                           type_carburant VARCHAR(20) NOT NULL COMMENT 'ESSENCE, DIESEL, HYBRIDE, ELECTRIQUE',
                           nombre_places INT NOT NULL DEFAULT 5,
                           tarif_journalier DECIMAL(10,2) NOT NULL,
                           quantite_stock INT NOT NULL DEFAULT 1,
                           autonomie_description VARCHAR(80),
                           vitesse_maximale VARCHAR(50),
                           acceleration VARCHAR(60),
                           kilometrage_annuel INT NOT NULL DEFAULT 0,
                           description_apropos TEXT,
                           equipements_json TEXT,
                           url_image VARCHAR(500),
                           derniere_latitude DECIMAL(10,7) DEFAULT 33.5731104,
                           derniere_longitude DECIMAL(10,7) DEFAULT -7.5898434,
                           date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           INDEX idx_vehicules_filtre (categorie, statut)
);

CREATE TABLE clients (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         nom_complet VARCHAR(120) NOT NULL,
                         email VARCHAR(150) NOT NULL UNIQUE,
                         telephone VARCHAR(30) NOT NULL,
                         adresse VARCHAR(255) NOT NULL,
                         url_avatar VARCHAR(500),
                         url_carte_identite VARCHAR(500),
                         url_permis_conduire VARCHAR(500),
                         points_fidelite INT NOT NULL DEFAULT 0,
                         date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE chauffeurs (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            nom_complet VARCHAR(120) NOT NULL,
                            email VARCHAR(150) NOT NULL UNIQUE,
                            telephone VARCHAR(30) NOT NULL,
                            adresse VARCHAR(255),
                            url_avatar VARCHAR(500),
                            statut VARCHAR(30) NOT NULL DEFAULT 'EN_SERVICE' COMMENT 'EN_SERVICE, CONGE_MALADIE, DEMI_JOURNEE',
                            heures_travaillees INT NOT NULL DEFAULT 0,
                            note_performance DECIMAL(3,2) NOT NULL DEFAULT 4.50,
                            date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE reservations (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              code_reservation VARCHAR(30) NOT NULL UNIQUE COMMENT 'Ex: RES-NX1001',
                              date_reservation DATE NOT NULL,
                              client_id BIGINT NOT NULL,
                              vehicule_id BIGINT NOT NULL,
                              chauffeur_id BIGINT NULL,
                              duree_jours INT NOT NULL,
                              date_heure_debut TIMESTAMP NOT NULL,
                              date_heure_fin TIMESTAMP NOT NULL,
                              montant_total DECIMAL(10,2) NOT NULL,
                              statut_paiement VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE' COMMENT 'PAYE, EN_ATTENTE',
                              statut VARCHAR(20) NOT NULL DEFAULT 'EN_COURS' COMMENT 'EN_COURS, RETOURNEE, ANNULEE',
                              notes VARCHAR(500),
                              distance_trajet_km DECIMAL(8,2) DEFAULT 0.00,
                              date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                              CONSTRAINT fk_res_client FOREIGN KEY (client_id) REFERENCES clients(id),
                              CONSTRAINT fk_res_vehicule FOREIGN KEY (vehicule_id) REFERENCES vehicules(id),
                              CONSTRAINT fk_res_chauffeur FOREIGN KEY (chauffeur_id) REFERENCES chauffeurs(id),
                              INDEX idx_res_dates (date_heure_debut, date_heure_fin),
                              INDEX idx_res_statut (statut, statut_paiement)
);

CREATE TABLE factures (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          code_facture VARCHAR(30) NOT NULL UNIQUE COMMENT 'Ex: FAC-NX1001',
                          reservation_id BIGINT NOT NULL,
                          client_id BIGINT NOT NULL,
                          vehicule_id BIGINT NOT NULL,
                          tarif_journalier DECIMAL(10,2) NOT NULL,
                          duree_jours INT NOT NULL,
                          montant DECIMAL(10,2) NOT NULL,
                          date_echeance DATE NOT NULL,
                          statut VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE' COMMENT 'COMPLETEE, EN_ATTENTE, EN_RETARD',
                          date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          CONSTRAINT fk_fac_reservation FOREIGN KEY (reservation_id) REFERENCES reservations(id),
                          CONSTRAINT fk_fac_client FOREIGN KEY (client_id) REFERENCES clients(id),
                          CONSTRAINT fk_fac_vehicule FOREIGN KEY (vehicule_id) REFERENCES vehicules(id)
);

CREATE TABLE depenses (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          intitule VARCHAR(150) NOT NULL,
                          categorie VARCHAR(40) NOT NULL COMMENT 'MAINTENANCE_VEHICULE, SALAIRES_STAFF, CARBURANT, ASSURANCE, FOURNITURES_BUREAU, MARKETING',
                          quantite INT NOT NULL DEFAULT 1,
                          montant DECIMAL(10,2) NOT NULL,
                          date_depense DATE NOT NULL,
                          statut VARCHAR(20) NOT NULL DEFAULT 'COMPLETEE' COMMENT 'COMPLETEE, EN_ATTENTE',
                          vehicule_id BIGINT NULL,
                          date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          CONSTRAINT fk_dep_vehicule FOREIGN KEY (vehicule_id) REFERENCES vehicules(id)
);

CREATE TABLE rappels (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         titre VARCHAR(200) NOT NULL,
                         date_rappel DATE NOT NULL,
                         heure_rappel VARCHAR(20) DEFAULT '09:00',
                         vehicule_id BIGINT NULL,
                         termine BOOLEAN NOT NULL DEFAULT FALSE,
                         date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         CONSTRAINT fk_rappel_vehicule FOREIGN KEY (vehicule_id) REFERENCES vehicules(id)
);

CREATE TABLE messages_chat (
                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               client_id BIGINT NOT NULL,
                               type_expediteur VARCHAR(20) NOT NULL COMMENT 'STAFF, CLIENT',
                               nom_expediteur VARCHAR(120) NOT NULL,
                               contenu TEXT NOT NULL,
                               url_piece_jointe VARCHAR(500) NULL,
                               lu BOOLEAN NOT NULL DEFAULT FALSE,
                               date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               CONSTRAINT fk_msg_client FOREIGN KEY (client_id) REFERENCES clients(id)
);