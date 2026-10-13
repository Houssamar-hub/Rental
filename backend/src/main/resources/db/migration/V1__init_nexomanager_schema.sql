-- ============================================================================
-- V1__init_nexomanager_schema.sql : Schéma ERP Interne NexoManager.app
-- ============================================================================

-- 1. Comptes Internes (Owner / Admin & Staff uniquement)
CREATE TABLE staff_users (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             full_name VARCHAR(120) NOT NULL,
                             email VARCHAR(150) NOT NULL UNIQUE,
                             password_hash VARCHAR(255) NOT NULL,
                             phone VARCHAR(30),
                             avatar_url VARCHAR(500),
                             role VARCHAR(30) NOT NULL COMMENT 'ROLE_OWNER, ROLE_STAFF',
                             active BOOLEAN NOT NULL DEFAULT TRUE,
                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Parc Automobile (Module "Units" & "Unit Details")
CREATE TABLE units (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       unit_code VARCHAR(30) NOT NULL UNIQUE COMMENT 'Ex: TX1234, HX5678, CX2345',
                       registration_plate VARCHAR(30) NOT NULL UNIQUE,
                       brand VARCHAR(80) NOT NULL COMMENT 'Ex: Audi, Aston Martin, Hyundai, Range Rover',
                       model VARCHAR(80) NOT NULL COMMENT 'Ex: A6, Q7, Sonata, Velar',
                       category VARCHAR(40) NOT NULL COMMENT 'SEDAN, SUV, HATCHBACK, CONVERTIBLE, TRUCK, MINIVAN',
                       status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE' COMMENT 'AVAILABLE, MAINTENANCE, UNAVAILABLE, ON_TRIP',
                       transmission VARCHAR(20) NOT NULL COMMENT 'AUTOMATIC, MANUAL',
                       fuel_type VARCHAR(20) NOT NULL COMMENT 'PETROL, DIESEL, GASOLINE, HYBRID, ELECTRIC',
                       seats INT NOT NULL DEFAULT 5,
                       daily_rate DECIMAL(10,2) NOT NULL,
                       stock_count INT NOT NULL DEFAULT 1,
                       range_description VARCHAR(80) COMMENT 'Ex: 400 miles on a full tank',
                       top_speed VARCHAR(50) COMMENT 'Ex: 130 mph',
                       acceleration VARCHAR(60) COMMENT 'Ex: 6.1 seconds (0-60 mph)',
                       total_km_year INT NOT NULL DEFAULT 0 COMMENT 'Ex: 489 Km sur Unit Details',
                       about_description TEXT,
                       features_json TEXT COMMENT 'Liste JSON: Air Conditioning, Bluetooth, Backup Camera, Cruise Control...',
                       image_url VARCHAR(500),
                       gallery_json TEXT,
                       last_latitude DECIMAL(10,7) DEFAULT 33.5731104,
                       last_longitude DECIMAL(10,7) DEFAULT -7.5898434,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       INDEX idx_units_filter (category, status)
);

-- 3. Clients CRM (Module "Clients")
CREATE TABLE clients (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         full_name VARCHAR(120) NOT NULL,
                         email VARCHAR(150) NOT NULL UNIQUE,
                         phone VARCHAR(30) NOT NULL,
                         address VARCHAR(255) NOT NULL,
                         avatar_url VARCHAR(500),
                         residence_card_doc_url VARCHAR(500) COMMENT 'Ex: Alice s Residence Card / CIN',
                         driver_license_doc_url VARCHAR(500) COMMENT 'Ex: Alice s License',
                         loyalty_points INT NOT NULL DEFAULT 0,
                         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Chauffeurs (Module "Drivers")
CREATE TABLE drivers (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         full_name VARCHAR(120) NOT NULL,
                         email VARCHAR(150) NOT NULL UNIQUE,
                         phone VARCHAR(30) NOT NULL,
                         address VARCHAR(255),
                         avatar_url VARCHAR(500),
                         status VARCHAR(30) NOT NULL DEFAULT 'ON_DUTY' COMMENT 'ON_DUTY, SICK_LEAVE, HALF_DAY_LEAVE',
                         work_hours INT NOT NULL DEFAULT 0 COMMENT 'Ex: 248 hours',
                         performance_rating DECIMAL(3,2) NOT NULL DEFAULT 4.50 COMMENT 'Ex: 4.5 Excellent',
                         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Réservations & Planning (Modules "Bookings", "Calendar" & "Tracking")
CREATE TABLE bookings (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          booking_code VARCHAR(30) NOT NULL UNIQUE COMMENT 'Ex: BK-NX1001',
                          booking_date DATE NOT NULL,
                          client_id BIGINT NOT NULL,
                          unit_id BIGINT NOT NULL,
                          driver_id BIGINT NULL COMMENT 'Optionnel : avec ou sans chauffeur',
                          plan_days INT NOT NULL,
                          start_datetime TIMESTAMP NOT NULL,
                          end_datetime TIMESTAMP NOT NULL,
                          total_amount DECIMAL(10,2) NOT NULL,
                          payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT 'PAID, PENDING',
                          status VARCHAR(20) NOT NULL DEFAULT 'ONGOING' COMMENT 'ONGOING, RETURNED, CANCELLED',
                          notes VARCHAR(500) COMMENT 'Ex: Client requested a child safety seat',
                          trip_distance_km DECIMAL(8,2) DEFAULT 0.00,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          CONSTRAINT fk_booking_client FOREIGN KEY (client_id) REFERENCES clients(id),
                          CONSTRAINT fk_booking_unit FOREIGN KEY (unit_id) REFERENCES units(id),
                          CONSTRAINT fk_booking_driver FOREIGN KEY (driver_id) REFERENCES drivers(id),
                          INDEX idx_bookings_dates (start_datetime, end_datetime),
                          INDEX idx_bookings_status (status, payment_status)
);

-- 6. Factures (Module "Financials -> Payments")
CREATE TABLE invoices (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          invoice_code VARCHAR(30) NOT NULL UNIQUE COMMENT 'Ex: INV-NX1001',
                          booking_id BIGINT NOT NULL,
                          client_id BIGINT NOT NULL,
                          unit_id BIGINT NOT NULL,
                          rate_per_day DECIMAL(10,2) NOT NULL,
                          rental_days INT NOT NULL,
                          amount DECIMAL(10,2) NOT NULL,
                          due_date DATE NOT NULL,
                          status VARCHAR(20) NOT NULL DEFAULT 'AWAITING' COMMENT 'COMPLETED, AWAITING, OVERDUE',
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          CONSTRAINT fk_inv_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
                          CONSTRAINT fk_inv_client FOREIGN KEY (client_id) REFERENCES clients(id),
                          CONSTRAINT fk_inv_unit FOREIGN KEY (unit_id) REFERENCES units(id)
);

-- 7. Dépenses (Module "Financials -> Expenses")
CREATE TABLE expenses (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          title VARCHAR(150) NOT NULL COMMENT 'Ex: Oil Change, Fuel Purchase, Insurance Payment',
                          category VARCHAR(40) NOT NULL COMMENT 'VEHICLE_MAINTENANCE, STAFF_SALARIES, FUEL, INSURANCE, OFFICE_SUPPLIES, MARKETING',
                          quantity INT NOT NULL DEFAULT 1,
                          amount DECIMAL(10,2) NOT NULL,
                          expense_date DATE NOT NULL,
                          status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED' COMMENT 'COMPLETED, PENDING',
                          unit_id BIGINT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          CONSTRAINT fk_expense_unit FOREIGN KEY (unit_id) REFERENCES units(id)
);

-- 8. Rappels Opérationnels (Bloc "Reminders" sur Dashboard & Unit Details)
CREATE TABLE reminders (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           title VARCHAR(200) NOT NULL,
                           reminder_date DATE NOT NULL,
                           reminder_time VARCHAR(20) DEFAULT '09:00 AM',
                           unit_id BIGINT NULL,
                           completed BOOLEAN NOT NULL DEFAULT FALSE,
                           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           CONSTRAINT fk_reminder_unit FOREIGN KEY (unit_id) REFERENCES units(id)
);

-- 9. Messagerie Temps Réel (Module "Messages")
CREATE TABLE chat_messages (
                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               client_id BIGINT NOT NULL,
                               sender_type VARCHAR(20) NOT NULL COMMENT 'STAFF, CLIENT',
                               sender_name VARCHAR(120) NOT NULL,
                               content TEXT NOT NULL,
                               attachment_url VARCHAR(500) NULL COMMENT 'Ex: Photo rayure véhicule',
                               is_read BOOLEAN NOT NULL DEFAULT FALSE,
                               created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               CONSTRAINT fk_chat_client FOREIGN KEY (client_id) REFERENCES clients(id)
);