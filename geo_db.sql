-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 03, 2026 at 12:00 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `geo_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `author_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `source_reference` text DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `data_sources`
--

CREATE TABLE `data_sources` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `url` text DEFAULT NULL,
  `data_period` varchar(100) DEFAULT NULL,
  `retrieved_at` date DEFAULT NULL,
  `format` varchar(50) DEFAULT NULL,
  `limitations` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `disaster_events`
--

CREATE TABLE `disaster_events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `data_source_id` bigint(20) UNSIGNED DEFAULT NULL,
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
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `disaster_reports`
--

CREATE TABLE `disaster_reports` (
  `id` bigint(20) UNSIGNED NOT NULL,
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
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_documents`
--

CREATE TABLE `event_documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `disaster_event_id` bigint(20) UNSIGNED DEFAULT NULL,
  `disaster_report_id` bigint(20) UNSIGNED DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `caption` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `missing_persons`
--

CREATE TABLE `missing_persons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `disaster_event_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reviewed_by` bigint(20) UNSIGNED DEFAULT NULL,
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
  `reviewed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `missing_person_documents`
--

CREATE TABLE `missing_person_documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `missing_person_id` bigint(20) UNSIGNED NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `caption` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shelters`
--

CREATE TABLE `shelters` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `disaster_event_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `address` text NOT NULL,
  `province` varchar(100) NOT NULL,
  `regency` varchar(100) NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `capacity` int(10) UNSIGNED DEFAULT NULL,
  `official_contact` varchar(100) DEFAULT NULL,
  `status` enum('active','full','closed') NOT NULL DEFAULT 'active',
  `verification_status` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
  `source_note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin') NOT NULL DEFAULT 'admin',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_articles_author` (`author_id`),
  ADD KEY `idx_article_published` (`is_published`);

--
-- Indexes for table `data_sources`
--
ALTER TABLE `data_sources`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `disaster_events`
--
ALTER TABLE `disaster_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_events_source` (`data_source_id`),
  ADD KEY `fk_events_creator` (`created_by`),
  ADD KEY `idx_event_date` (`event_date`),
  ADD KEY `idx_event_region` (`province`,`regency`),
  ADD KEY `idx_event_coordinates` (`latitude`,`longitude`),
  ADD KEY `idx_event_verification` (`verification_status`);

--
-- Indexes for table `disaster_reports`
--
ALTER TABLE `disaster_reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tracking_code` (`tracking_code`),
  ADD KEY `fk_reports_event` (`disaster_event_id`),
  ADD KEY `fk_reports_reviewer` (`reviewed_by`),
  ADD KEY `idx_report_status` (`status`),
  ADD KEY `idx_report_date` (`event_date`);

--
-- Indexes for table `event_documents`
--
ALTER TABLE `event_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_documents_event` (`disaster_event_id`),
  ADD KEY `fk_documents_report` (`disaster_report_id`);

--
-- Indexes for table `missing_persons`
--
ALTER TABLE `missing_persons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_missing_event` (`disaster_event_id`),
  ADD KEY `fk_missing_reviewer` (`reviewed_by`),
  ADD KEY `idx_missing_search` (`search_status`),
  ADD KEY `idx_missing_verification` (`verification_status`);

--
-- Indexes for table `missing_person_documents`
--
ALTER TABLE `missing_person_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_missing_documents_person` (`missing_person_id`);

--
-- Indexes for table `shelters`
--
ALTER TABLE `shelters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_shelters_event` (`disaster_event_id`),
  ADD KEY `idx_shelter_status` (`status`),
  ADD KEY `idx_shelter_verification` (`verification_status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `data_sources`
--
ALTER TABLE `data_sources`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `disaster_events`
--
ALTER TABLE `disaster_events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `disaster_reports`
--
ALTER TABLE `disaster_reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_documents`
--
ALTER TABLE `event_documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `missing_persons`
--
ALTER TABLE `missing_persons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `missing_person_documents`
--
ALTER TABLE `missing_person_documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shelters`
--
ALTER TABLE `shelters`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `fk_articles_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `disaster_events`
--
ALTER TABLE `disaster_events`
  ADD CONSTRAINT `fk_events_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_events_source` FOREIGN KEY (`data_source_id`) REFERENCES `data_sources` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `disaster_reports`
--
ALTER TABLE `disaster_reports`
  ADD CONSTRAINT `fk_reports_event` FOREIGN KEY (`disaster_event_id`) REFERENCES `disaster_events` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_reports_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `event_documents`
--
ALTER TABLE `event_documents`
  ADD CONSTRAINT `fk_documents_event` FOREIGN KEY (`disaster_event_id`) REFERENCES `disaster_events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_documents_report` FOREIGN KEY (`disaster_report_id`) REFERENCES `disaster_reports` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `missing_persons`
--
ALTER TABLE `missing_persons`
  ADD CONSTRAINT `fk_missing_event` FOREIGN KEY (`disaster_event_id`) REFERENCES `disaster_events` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_missing_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `missing_person_documents`
--
ALTER TABLE `missing_person_documents`
  ADD CONSTRAINT `fk_missing_documents_person` FOREIGN KEY (`missing_person_id`) REFERENCES `missing_persons` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `shelters`
--
ALTER TABLE `shelters`
  ADD CONSTRAINT `fk_shelters_event` FOREIGN KEY (`disaster_event_id`) REFERENCES `disaster_events` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
