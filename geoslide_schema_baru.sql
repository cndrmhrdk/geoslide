-- Skema database GeoSlide (versi baru, sudah termasuk perubahan hasil analisis)
-- Cara pakai: buat database kosong di phpMyAdmin (utf8mb4_general_ci),
-- pilih database itu, tab Import (atau tab SQL), lalu jalankan file ini.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- Akun admin
CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin') NOT NULL DEFAULT 'admin',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Sumber data eksternal
CREATE TABLE `data_sources` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `url` text DEFAULT NULL,
  `data_period` varchar(100) DEFAULT NULL,
  `retrieved_at` date DEFAULT NULL,
  `format` varchar(50) DEFAULT NULL,
  `limitations` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Riwayat impor data (menu admin "Kelola Sumber Data")
CREATE TABLE `import_logs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `data_source_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('success','partial','failed') NOT NULL,
  `total_rows` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `inserted_rows` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `failed_rows` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `error_message` text DEFAULT NULL,
  `started_at` datetime DEFAULT NULL,
  `finished_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_import_source` (`data_source_id`),
  CONSTRAINT `fk_import_source` FOREIGN KEY (`data_source_id`) REFERENCES `data_sources` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Kejadian tanah longsor
CREATE TABLE `disaster_events` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `data_source_id` bigint(20) UNSIGNED DEFAULT NULL,
  `external_id` varchar(100) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `event_date` date NOT NULL,
  `province` varchar(100) NOT NULL,
  `regency` varchar(100) NOT NULL,
  `district` varchar(100) DEFAULT NULL,
  `village` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `deaths` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `missing` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `injured` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `displaced` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `houses_damaged` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `source_note` text DEFAULT NULL,
  `verification_status` enum('unverified','verified') NOT NULL DEFAULT 'unverified',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_events_source_external` (`data_source_id`,`external_id`),
  KEY `fk_events_creator` (`created_by`),
  KEY `idx_event_date` (`event_date`),
  KEY `idx_event_region` (`province`,`regency`),
  KEY `idx_event_coordinates` (`latitude`,`longitude`),
  KEY `idx_event_verification` (`verification_status`),
  CONSTRAINT `fk_events_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_events_source` FOREIGN KEY (`data_source_id`) REFERENCES `data_sources` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Laporan bencana dari masyarakat
CREATE TABLE `disaster_reports` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `disaster_event_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reviewed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `tracking_code` varchar(30) NOT NULL,
  `reporter_name` varchar(100) NOT NULL,
  `reporter_contact` varchar(100) NOT NULL,
  `event_date` date NOT NULL,
  `province` varchar(100) NOT NULL,
  `regency` varchar(100) NOT NULL,
  `district` varchar(100) DEFAULT NULL,
  `village` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `description` text NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `rejection_reason` text DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `tracking_code` (`tracking_code`),
  KEY `fk_reports_event` (`disaster_event_id`),
  KEY `fk_reports_reviewer` (`reviewed_by`),
  KEY `idx_report_status` (`status`),
  KEY `idx_report_date` (`event_date`),
  CONSTRAINT `fk_reports_event` FOREIGN KEY (`disaster_event_id`) REFERENCES `disaster_events` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_reports_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Foto/dokumentasi kejadian dan laporan
CREATE TABLE `event_documents` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `disaster_event_id` bigint(20) UNSIGNED DEFAULT NULL,
  `disaster_report_id` bigint(20) UNSIGNED DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `caption` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_documents_event` (`disaster_event_id`),
  KEY `fk_documents_report` (`disaster_report_id`),
  CONSTRAINT `fk_documents_event` FOREIGN KEY (`disaster_event_id`) REFERENCES `disaster_events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_documents_report` FOREIGN KEY (`disaster_report_id`) REFERENCES `disaster_reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Orang hilang (laporan + informasi publik setelah diverifikasi)
CREATE TABLE `missing_persons` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `disaster_event_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reviewed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `tracking_code` varchar(30) NOT NULL,
  `name` varchar(150) NOT NULL,
  `age` int(10) UNSIGNED DEFAULT NULL,
  `gender` enum('male','female','unknown') NOT NULL DEFAULT 'unknown',
  `physical_description` text DEFAULT NULL,
  `last_seen_location` text NOT NULL,
  `last_seen_at` datetime DEFAULT NULL,
  `search_status` enum('searching','found','closed') NOT NULL DEFAULT 'searching',
  `verification_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `reporter_name` varchar(100) NOT NULL,
  `reporter_contact` varchar(100) NOT NULL,
  `public_contact_note` text DEFAULT NULL,
  `public_consent` tinyint(1) NOT NULL DEFAULT 0,
  `admin_note` text DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `tracking_code` (`tracking_code`),
  KEY `fk_missing_event` (`disaster_event_id`),
  KEY `fk_missing_reviewer` (`reviewed_by`),
  KEY `idx_missing_search` (`search_status`),
  KEY `idx_missing_verification` (`verification_status`),
  CONSTRAINT `fk_missing_event` FOREIGN KEY (`disaster_event_id`) REFERENCES `disaster_events` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_missing_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Foto orang hilang
CREATE TABLE `missing_person_documents` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `missing_person_id` bigint(20) UNSIGNED NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `caption` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_missing_documents_person` (`missing_person_id`),
  CONSTRAINT `fk_missing_documents_person` FOREIGN KEY (`missing_person_id`) REFERENCES `missing_persons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Artikel (BELUM DIKONFIRMASI: hapus tabel ini jika menu Artikel = Edukasi statis)
CREATE TABLE `articles` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `author_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `source_reference` text DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `fk_articles_author` (`author_id`),
  KEY `idx_article_published` (`is_published`),
  CONSTRAINT `fk_articles_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Sumber data id = 1 (dibutuhkan untuk import disaster_events). Sesuaikan nama/url.
INSERT INTO `data_sources` (`id`, `name`, `url`, `data_period`, `retrieved_at`, `format`)
VALUES (1, 'Data kejadian tanah longsor (impor awal)', NULL, '2026-01-01 s/d 2026-11-03', '2026-11-05', 'XLSX');
