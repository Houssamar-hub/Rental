-- ============================================================================
-- V2__insert_admin_proprietaire.sql : Création du compte administrateur
-- ============================================================================
-- Credentials :
--   Email    : admin@nexomanager.app
--   Password : Admin@2026
--   Role     : ROLE_PROPRIETAIRE (full access)
-- ============================================================================

INSERT INTO utilisateurs_staff (nom_complet, email, mot_de_passe_hash, telephone, role, actif, date_creation, date_modification)
VALUES (
    'Administrateur NexoManager',
    'admin@nexomanager.app',
    '$2a$10$bHrnGAQy20BwYbwYsJ3KKuUtwkyBV/13nKtIAVgKTknfGxriuNViK',
    NULL,
    'ROLE_PROPRIETAIRE',
    TRUE,
    NOW(),
    NOW()
);
