-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 17, 2026 at 07:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `geoslide`
--

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

--
-- Dumping data for table `disaster_reports`
--

INSERT INTO `disaster_reports` (`id`, `disaster_event_id`, `reviewed_by`, `tracking_code`, `reporter_name`, `reporter_contact`, `event_date`, `province`, `regency`, `district`, `village`, `latitude`, `longitude`, `description`, `status`, `rejection_reason`, `reviewed_at`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, 'GSL-2026-0001', 'Andi Pratama', 'TEST-081000000001', '2026-11-10', 'DI Yogyakarta', 'Sleman', 'Cangkringan', 'Kepuharjo', -7.5960000, 110.4480000, 'Terjadi tanah longsor di sekitar permukiman setelah hujan deras. Material tanah menutup sebagian akses jalan.', 'pending', NULL, NULL, '2026-11-17 05:37:17', '2026-11-17 05:37:17'),
(2, NULL, NULL, 'GSL-2026-0002', 'Siti Rahma', 'TEST-081000000002', '2026-11-11', 'Jawa Tengah', 'Magelang', 'Borobudur', 'Wanurejo', -7.6080000, 110.2150000, 'Terjadi banjir akibat peningkatan debit air sungai setelah hujan dengan intensitas tinggi.', 'pending', NULL, NULL, '2026-11-17 05:37:17', '2026-11-17 05:37:17'),
(3, NULL, NULL, 'GSL-2026-0003', 'Budi Santoso', 'TEST-081000000003', '2026-11-12', 'Jawa Barat', 'Bandung', 'Lembang', 'Cikole', -6.7860000, 107.6380000, 'Dilaporkan adanya tanah longsor di area perbukitan yang menyebabkan akses jalan terganggu.', 'pending', NULL, NULL, '2026-11-17 05:37:17', '2026-11-17 05:37:17'),
(4, NULL, NULL, 'GSL-2026-0004', 'Dewi Anggraini', 'TEST-081000000004', '2026-11-13', 'Jawa Timur', 'Malang', 'Pujon', 'Ngroto', -7.8410000, 112.4770000, 'Terjadi angin kencang yang menyebabkan beberapa pohon tumbang di sekitar jalan desa.', 'pending', NULL, NULL, '2026-11-17 05:37:17', '2026-11-17 05:37:17'),
(5, NULL, NULL, 'GSL-2026-0005', 'Rizky Maulana', 'TEST-081000000005', '2026-11-14', 'DI Yogyakarta', 'Bantul', 'Imogiri', 'Sriharjo', -7.9540000, 110.3910000, 'Dilaporkan adanya genangan air di beberapa titik permukiman setelah hujan deras.', 'pending', NULL, NULL, '2026-11-17 05:37:17', '2026-11-17 05:37:17'),
(6, NULL, NULL, 'GSL-TEST-001', 'Andi Pratama', 'TEST-081000000001', '2026-11-10', 'DI Yogyakarta', 'Sleman', NULL, NULL, NULL, NULL, 'Laporan pengujian tanah longsor setelah hujan deras.', 'pending', NULL, NULL, '2026-11-17 05:41:37', '2026-11-17 05:41:37');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `disaster_reports`
--
ALTER TABLE `disaster_reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `disaster_reports`
--
ALTER TABLE `disaster_reports`
  ADD CONSTRAINT `fk_reports_event` FOREIGN KEY (`disaster_event_id`) REFERENCES `disaster_events` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_reports_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
