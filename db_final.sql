-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 17, 2026 at 04:56 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.36

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
  `id` bigint UNSIGNED NOT NULL,
  `author_id` bigint UNSIGNED DEFAULT NULL,
  `title` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `slug` varchar(220) COLLATE utf8mb4_general_ci NOT NULL,
  `summary` text COLLATE utf8mb4_general_ci,
  `content` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `source_reference` text COLLATE utf8mb4_general_ci,
  `is_published` tinyint(1) NOT NULL DEFAULT '0',
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `data_sources`
--

CREATE TABLE `data_sources` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `url` text COLLATE utf8mb4_general_ci,
  `data_period` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `retrieved_at` date DEFAULT NULL,
  `format` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `limitations` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_sources`
--

INSERT INTO `data_sources` (`id`, `name`, `url`, `data_period`, `retrieved_at`, `format`, `limitations`, `created_at`, `updated_at`) VALUES
(1, 'Data kejadian tanah longsor (impor awal)', NULL, '2026-01-01 s/d 2026-11-03', '2026-11-05', 'XLSX', NULL, '2026-11-13 22:35:17', '2026-11-13 22:35:17');

-- --------------------------------------------------------

--
-- Table structure for table `disaster_events`
--

CREATE TABLE `disaster_events` (
  `id` bigint UNSIGNED NOT NULL,
  `data_source_id` bigint UNSIGNED DEFAULT NULL,
  `external_id` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `title` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `event_date` date NOT NULL,
  `province` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `regency` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `district` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `village` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `deaths` int UNSIGNED NOT NULL DEFAULT '0',
  `missing` int UNSIGNED NOT NULL DEFAULT '0',
  `injured` int UNSIGNED NOT NULL DEFAULT '0',
  `displaced` int UNSIGNED NOT NULL DEFAULT '0',
  `houses_damaged` int UNSIGNED NOT NULL DEFAULT '0',
  `source_note` text COLLATE utf8mb4_general_ci,
  `verification_status` enum('unverified','verified') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'unverified',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `disaster_events`
--

INSERT INTO `disaster_events` (`id`, `data_source_id`, `external_id`, `created_by`, `title`, `event_date`, `province`, `regency`, `district`, `village`, `latitude`, `longitude`, `description`, `deaths`, `missing`, `injured`, `displaced`, `houses_damaged`, `source_note`, `verification_status`, `created_at`, `updated_at`) VALUES
(1, 1, 'd048f683-a26c-4b67-9a71-fb120395b7ae', NULL, 'Tanah Longsor', '2026-11-03', 'Aceh', 'Kabupaten Gayo Lues', NULL, NULL, 3.9551650, 97.3516558, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(2, 1, 'a68fa70e-6358-4e5b-8979-22fe3303ad9e', NULL, 'Tanah Longsor', '2026-11-02', 'Jawa Timur', 'Kabupaten Pacitan', NULL, NULL, -8.2046140, 111.0876900, NULL, 0, 0, 0, 25, 5, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(3, 1, 'a4d85c6f-534d-4eff-a497-826b5deba1b0', NULL, 'Tanah Longsor', '2026-10-31', 'Jawa Timur', 'Kabupaten Malang', NULL, NULL, -8.0495643, 112.6884549, NULL, 0, 0, 0, 120, 24, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(4, 1, '0708b10b-797c-4f34-8630-0311a97159e3', NULL, 'Tanah Longsor', '2026-10-30', 'Jawa Tengah', 'Kabupaten Banjarnegara', NULL, NULL, -7.4027060, 109.6813960, NULL, 0, 0, 0, 35, 8, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(5, 1, '787b61f5-bc26-4c03-a5d2-c724096d4e02', NULL, 'Tanah Longsor', '2026-10-28', 'Sumatera Utara', 'Kabupaten Simalungun', NULL, NULL, 2.9781612, 99.2785583, NULL, 0, 0, 0, 450, 88, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(6, 1, 'b6a30d49-6484-4202-96ab-d3bb47666f83', NULL, 'Tanah Longsor', '2026-10-27', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8937121, 107.4321959, NULL, 0, 0, 0, 44, 10, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(7, 1, '130204f5-435b-432d-8d9e-98e634a0d7eb', NULL, 'Gerakan Tanah', '2026-10-12', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 2, 1, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(8, 1, '2528732d-abe3-4dc3-9241-e8a797c123c6', NULL, 'Tanah Longsor', '2026-10-06', 'Jawa Tengah', 'Kabupaten Pemalang', NULL, NULL, -6.8842340, 109.3779980, NULL, 2, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(9, 1, 'a32f256f-8321-4146-9720-072dc5d54172', NULL, 'Tanah Longsor', '2026-09-14', 'Aceh', 'Kabupaten Aceh Tengah', NULL, NULL, 4.4482641, 96.8350999, NULL, 1, 0, 13, 15, 4, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(10, 1, '034be947-3fa4-4e75-8865-5e1f832f5c03', NULL, 'Tanah Longsor', '2026-09-05', 'Nusa Tenggara Barat', 'Kabupaten Sumbawa', NULL, NULL, -8.6529334, 117.3616476, NULL, 3, 0, 6, 0, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(11, 1, 'f8a613ec-82d3-4e19-b76b-5dd9d89fa547', NULL, 'Tanah Longsor', '2026-08-13', 'Gorontalo', 'Kabupaten Pohuwato', NULL, NULL, 0.7055278, 121.7195459, NULL, 6, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(12, 1, 'd8e1f01a-67d9-4f78-9783-753452fa88aa', NULL, 'Tanah Longsor', '2026-07-25', 'Jawa Tengah', 'Kabupaten Banyumas', NULL, NULL, -7.4832133, 109.1404380, NULL, 0, 0, 0, 5000, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(13, 1, 'c4572b3b-eeeb-4f75-aa12-83360560cddd', NULL, 'Tanah Longsor', '2026-07-24', 'Sulawesi Selatan', 'Kabupaten Bone', NULL, NULL, -2.0833330, 120.2166670, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(14, 1, 'c1cd3b9a-e8a8-44d5-98f6-61d831f04e78', NULL, 'Tanah Longsor', '2026-07-22', 'Sulawesi Selatan', 'Kabupaten Toraja Utara', NULL, NULL, -2.8621942, 119.8352303, NULL, 0, 0, 0, 65, 11, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(15, 1, '9b38055b-a64b-4883-9545-102119e87d90', NULL, 'Tanah Longsor', '2026-07-19', 'Sumatera Selatan', 'Kabupaten Musi Banyuasin', NULL, NULL, -2.5442029, 103.7289167, NULL, 0, 0, 0, 12, 10, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(16, 1, '1a1adf9e-3eea-486f-99a4-6cc23ceb18a6', NULL, 'Tanah Longsor', '2026-07-07', 'Kalimantan Utara', 'Kabupaten Nunukan', NULL, NULL, 4.0609227, 117.6669520, NULL, 0, 0, 0, 1507, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(17, 1, '027251dd-71c3-4f1a-899a-77c76f2da820', NULL, 'Tanah Longsor', '2026-06-22', 'Nusa Tenggara Timur', 'Kabupaten Timor Tengah Selatan', NULL, NULL, -9.7762816, 124.4198243, NULL, 0, 0, 0, 39, 10, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(18, 1, 'ec642c7c-ddcb-4423-8820-9a3ba0da2938', NULL, 'Tanah Longsor', '2026-06-16', 'Riau', 'Kabupaten Indragiri Hilir', NULL, NULL, -0.1456733, 102.9896150, NULL, 0, 0, 0, 85, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(19, 1, '479ca5c4-7360-4e51-94fd-6c31fb8f4eca', NULL, 'Tanah Longsor', '2026-06-16', 'Aceh', 'Kabupaten Aceh Jaya', NULL, NULL, 4.7873684, 95.6457951, NULL, 3, 0, 4, 0, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(20, 1, '8cfac6f5-fcb6-41a5-8fca-782c6afb97d2', NULL, 'Tanah Longsor', '2026-06-03', 'Sulawesi Selatan', 'Kabupaten Sinjai', NULL, NULL, -5.2171961, 120.1127350, NULL, 0, 0, 0, 35, 1, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(21, 1, '87ab49c5-91af-4bbe-944b-f798b6513e6e', NULL, 'Tanah Longsor', '2026-05-30', 'Sulawesi Selatan', 'Kabupaten Sidenreng Rappang', NULL, NULL, -3.7738981, 120.0202964, NULL, 0, 0, 0, 614, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(22, 1, '0611183c-d3ff-453c-a2ce-1abfc6f64d91', NULL, 'Tanah Longsor', '2026-05-18', 'Sumatera Utara', 'Kabupaten Tapanuli Selatan', NULL, NULL, 1.5774933, 99.2785583, NULL, 2, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(23, 1, '13e29778-a524-4399-b000-3bee48fc8207', NULL, 'Tanah Longsor', '2026-05-16', 'Jawa Tengah', 'Kabupaten Temanggung', NULL, NULL, -7.3166690, 110.1747970, NULL, 0, 0, 0, 400, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(24, 1, 'eb5e2a27-b145-408c-a51d-61921693fd43', NULL, 'Tanah Longsor', '2026-05-15', 'Sulawesi Barat', 'Kabupaten Polewali Mandar', NULL, NULL, -3.3419323, 119.1390642, NULL, 0, 0, 2, 495, 4, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(25, 1, '21b00195-961e-47eb-b842-af3f551e0a02', NULL, 'Tanah Longsor', '2026-05-15', 'Jawa Barat', 'Kabupaten Subang', NULL, NULL, -6.5693610, 107.7524030, NULL, 2, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(26, 1, '89f11aae-d21e-4a63-9ce1-5b625b08a8e4', NULL, 'Tanah Longsor', '2026-05-15', 'Sulawesi Selatan', 'Kabupaten Sinjai', NULL, NULL, -5.2171961, 120.1127350, NULL, 0, 0, 0, 32, 2, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(27, 1, 'ae240592-44dd-4bf7-8214-2ddc749c3df8', NULL, 'Gerakan Tanah', '2026-05-12', 'Jawa Tengah', 'Kabupaten Cilacap', NULL, NULL, -7.7333330, 109.0000000, NULL, 0, 0, 0, 75, 11, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(28, 1, 'e84cf918-7c36-4d00-9ca9-87b6ccdeacd7', NULL, 'Tanah Longsor', '2026-05-11', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.3333333, 108.3500000, NULL, 0, 0, 0, 58, 10, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(29, 1, 'cbcf9a2e-612d-49bf-b46d-ea165e3bab21', NULL, 'Tanah Longsor', '2026-05-08', 'Maluku', 'Kota Ambon', NULL, NULL, -3.6560700, 128.1664190, NULL, 0, 0, 0, 49, 8, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(30, 1, 'f961da99-7b83-4ebe-bfba-b081df1e5e25', NULL, 'Tanah Longsor', '2026-05-05', 'Sumatera Barat', 'Kabupaten Agam', NULL, NULL, -0.2209392, 100.1703257, NULL, 1, 0, 6, 29, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(31, 1, '870d3442-995c-4531-bd7e-3c28c468b1a5', NULL, 'Tanah Longsor', '2026-05-05', 'Sumatera Utara', 'Kabupaten Tapanuli Utara', NULL, NULL, 2.0405246, 99.1013498, NULL, 3, 0, 1, 0, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(32, 1, '69a87e35-eec1-4b53-886b-5e522f783325', NULL, 'Tanah Longsor', '2026-05-05', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(33, 1, 'e05da799-991e-4bd6-af1f-b4b68525b726', NULL, 'Tanah Longsor', '2026-05-04', 'Jawa Tengah', 'Kota Semarang', NULL, NULL, -6.9666667, 110.4166667, NULL, 0, 0, 0, 22, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(34, 1, 'c74e8642-4ef6-4e18-a90a-f2b57a1fc69b', NULL, 'Tanah Longsor', '2026-05-04', 'Jawa Barat', 'Kabupaten Cianjur', NULL, NULL, -6.8172531, 107.1307289, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(35, 1, '6d52ee1f-77a9-472e-986c-67094074e95b', NULL, 'Tanah Longsor', '2026-05-04', 'Jawa Barat', 'Kota Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 54, 9, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(36, 1, '6c2b3dfd-7fcb-479e-9ad1-5e746dd34d80', NULL, 'Tanah Longsor', '2026-05-04', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 100, 13, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(37, 1, 'aabba1f1-f410-42e9-a9b0-4daaf19b79e3', NULL, 'Tanah Longsor', '2026-05-03', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 1, 0, 0, 8, 2, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(38, 1, 'ebda7b3e-c90c-4ebc-9980-fe888cb5570c', NULL, 'Tanah Longsor', '2026-05-01', 'Nusa Tenggara Timur', 'Kabupaten Timor Tengah Selatan', NULL, NULL, -9.7762816, 124.4198243, NULL, 0, 0, 0, 26, 6, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(39, 1, '335fd114-56b9-491d-b752-d8b19622aca5', NULL, 'Tanah Longsor', '2026-04-20', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 137, 33, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(40, 1, '4804c87b-08e8-45da-bed0-f15e0e801d4c', NULL, 'Tanah Longsor', '2026-04-19', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 80, 19, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(41, 1, 'bdf23382-aa84-4aae-8176-846746d3f016', NULL, 'Tanah Longsor', '2026-04-18', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 68, 8, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(42, 1, 'c08a09d1-34bb-4155-80c8-50db0b9e1819', NULL, 'Tanah Longsor', '2026-04-17', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 55, 5, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(43, 1, 'b506db98-c76f-4012-9673-9cc3a7bd9f4c', NULL, 'Tanah Longsor', '2026-04-16', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 22, 5, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(44, 1, '22ea9988-3c82-44d8-b8de-198f906a03a4', NULL, 'Tanah Longsor', '2026-04-15', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 19, 5, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(45, 1, '5d384611-d431-43b3-b223-0e2870131a58', NULL, 'Tanah Longsor', '2026-04-15', 'Jawa Timur', 'Kabupaten Pacitan', NULL, NULL, -8.2046140, 111.0876900, NULL, 0, 0, 0, 185, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(46, 1, '2271a4d9-3136-4816-904d-c887eecadfcf', NULL, 'Tanah Longsor', '2026-04-12', 'Jawa Tengah', 'Kabupaten Purbalingga', NULL, NULL, -7.3907470, 109.3638000, NULL, 1, 0, 1, 11, 3, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(47, 1, '46b02ef5-88da-4683-a912-bace4b8a0069', NULL, 'Tanah Longsor', '2026-04-09', 'Sumatera Utara', 'Kabupaten Nias Selatan', NULL, NULL, 0.7086091, 97.8286368, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(48, 1, '838d268c-963d-4fdf-ac23-b59a59f04889', NULL, 'Tanah Longsor', '2026-04-07', 'Sumatera Utara', 'Kabupaten Deli Serdang', NULL, NULL, 3.4201802, 98.7040750, NULL, 5, 0, 1, 0, 7, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(49, 1, 'a187b53c-1dc0-4545-90cd-0f5236274e33', NULL, 'Tanah Longsor', '2026-04-04', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 74, 12, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(50, 1, 'ceb4d710-f769-4937-bbb6-0a0d27d9ead4', NULL, 'Tanah Longsor', '2026-03-16', 'Kalimantan Utara', 'Kabupaten Malinau', NULL, NULL, 3.5842210, 116.6477970, NULL, 0, 0, 0, 30, 5, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(51, 1, 'ea5d5919-b8b0-4b7d-a03f-62520b9b6eb3', NULL, 'Tanah Longsor', '2026-03-16', 'Nusa Tenggara Timur', 'Kabupaten Sumba Barat Daya', NULL, NULL, -9.5391390, 119.1390642, NULL, 2, 0, 1, 0, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(52, 1, '678293b3-d76b-4aaf-ab11-cd1a7fbe6195', NULL, 'Tanah Longsor', '2026-03-15', 'Jawa Tengah', 'Kota Semarang', NULL, NULL, -6.9666667, 110.4166667, NULL, 0, 0, 0, 0, 5, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(53, 1, '097db4b5-92d8-4ede-9fe0-f907bf548b75', NULL, 'Tanah Longsor', '2026-03-15', 'Jawa Timur', 'Kabupaten Blitar', NULL, NULL, -8.1014419, 112.1627620, NULL, 1, 0, 0, 5, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(54, 1, '2d8aaa60-1e86-498f-8b4e-9bc8269bd428', NULL, 'Tanah Longsor', '2026-03-13', 'Nusa Tenggara Timur', 'Kabupaten Timor Tengah Selatan', NULL, NULL, -9.7762816, 124.4198243, NULL, 0, 0, 0, 31, 7, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(55, 1, 'e8e4f192-48e7-46d1-993e-63fbe20d2bc7', NULL, 'Tanah Longsor', '2026-03-12', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.3333333, 108.3500000, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(56, 1, '33bcd962-7fde-4dc4-85d4-e6fb193409d9', NULL, 'Tanah Longsor', '2026-03-08', 'Jawa Barat', 'Kota Bekasi', NULL, NULL, -6.2333333, 107.0000000, NULL, 7, 0, 0, 6, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(57, 1, '5be0c588-5792-4453-93db-e397c3017104', NULL, 'Tanah Longsor', '2026-03-06', 'Nusa Tenggara Timur', 'Kabupaten Sikka', NULL, NULL, -8.6766175, 122.1291843, NULL, 0, 0, 0, 55, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(58, 1, 'bcf066a9-57e5-428c-b9ad-7d27a2b104a4', NULL, 'Tanah Longsor', '2026-03-03', 'Nusa Tenggara Timur', 'Kabupaten Timor Tengah Selatan', NULL, NULL, -9.7762816, 124.4198243, NULL, 0, 0, 0, 34, 5, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(59, 1, '178d8b13-9133-4bf6-b947-9fa5088f3e19', NULL, 'Gerakan Tanah', '2026-02-27', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9240500, 106.9222030, NULL, 0, 0, 0, 104, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(60, 1, '12212eb8-57cd-4193-adc6-c90f78ab5527', NULL, 'Gerakan Tanah', '2026-02-27', 'Daerah Istimewa Yogyakarta', 'Kabupaten Bantul', NULL, NULL, -7.8846111, 110.3341111, NULL, 0, 0, 0, 10, 6, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(61, 1, '38589b9e-0258-49e8-9fc9-0e68a65bf5f9', NULL, 'Tanah Longsor', '2026-02-24', 'Nusa Tenggara Timur', 'Kabupaten Kupang', NULL, NULL, -10.1833333, 123.5833333, NULL, 0, 0, 0, 235, 47, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(62, 1, '2c156d5b-1aab-46aa-a701-4ff302cbc723', NULL, 'Tanah Longsor', '2026-02-23', 'Jawa Timur', 'Kabupaten Bondowoso', NULL, NULL, -7.9177040, 113.8134830, NULL, 0, 0, 0, 30, 6, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(63, 1, '76a83541-8e58-4306-b20c-fe4d06690b73', NULL, 'Gerakan Tanah', '2026-02-22', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9240500, 106.9222030, NULL, 0, 0, 0, 886, 144, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(64, 1, '4a3dfe35-662a-4bff-9903-f8322bdef525', NULL, 'Tanah Longsor', '2026-02-22', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9240500, 106.9222030, NULL, 0, 0, 0, 259, 10, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(65, 1, '05e5c8a2-7503-414a-8a03-5953b6d007da', NULL, 'Tanah Longsor', '2026-02-18', 'Papua Pegunungan', 'Kabupaten Yahukimo', NULL, NULL, -4.4939717, 139.5279996, NULL, 0, 2, 2, 1020, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(66, 1, '23c3c528-0cfd-4c35-9cb1-6047eb3effa3', NULL, 'Tanah Longsor', '2026-02-18', 'Jawa Timur', 'Kabupaten Pacitan', NULL, NULL, -8.2046140, 111.0876900, NULL, 0, 0, 0, 75, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(67, 1, 'd045d620-880c-4367-8afe-0dec29c47d19', NULL, 'Tanah Longsor', '2026-02-18', 'Sulawesi Tengah', 'Kabupaten Morowali', NULL, NULL, -2.3003072, 121.5370003, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(68, 1, '130bb973-95db-42f7-8957-02f5aa31b5e0', NULL, 'Tanah Longsor', '2026-02-17', 'Daerah Istimewa Yogyakarta', 'Kabupaten Gunung Kidul', NULL, NULL, -8.0305091, 110.6168921, NULL, 0, 0, 0, 278, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(69, 1, 'd207cfb2-2e50-462b-b7a1-93242f91c230', NULL, 'Gerakan Tanah', '2026-02-16', 'Nusa Tenggara Timur', 'Kabupaten Belu', NULL, NULL, -9.4125796, 124.9506625, NULL, 0, 0, 0, 35, 7, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(70, 1, '5c59177f-6f93-4ead-bcf2-c1729a868ca1', NULL, 'Gerakan Tanah', '2026-02-16', 'Jawa Barat', 'Kabupaten Tasikmalaya', NULL, NULL, -7.3279540, 108.2141040, NULL, 0, 0, 0, 25, 5, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(71, 1, '83dc4041-c064-41e6-b76b-92b07cf68d65', NULL, 'Tanah Longsor', '2026-02-14', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 76, 3, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(72, 1, 'c59ffb06-24e5-4257-b069-42ab9ebd00fd', NULL, 'Tanah Longsor', '2026-02-14', 'Jawa Tengah', 'Kabupaten Cilacap', NULL, NULL, -7.7333330, 109.0000000, NULL, 0, 0, 0, 64, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(73, 1, '147c6df2-02ca-4eb9-b2f0-f4d8c3678891', NULL, 'Gerakan Tanah', '2026-02-14', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 20, 5, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(74, 1, '1f9ca418-e64d-4083-bbf2-cd6c9e2f1d09', NULL, 'Tanah Longsor', '2026-02-13', 'Jawa Barat', 'Kabupaten Majalengka', NULL, NULL, -6.8531026, 108.2258897, NULL, 0, 0, 0, 50, 2, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(75, 1, 'a932676d-9fdd-4412-a71a-bcda23a83748', NULL, 'Tanah Longsor', '2026-02-11', 'Jawa Tengah', 'Kabupaten Cilacap', NULL, NULL, -7.7333330, 109.0000000, NULL, 0, 0, 0, 199, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(76, 1, '6510ad8e-8202-47c7-b530-caef72608f09', NULL, 'Tanah Longsor', '2026-02-11', 'Jawa Tengah', 'Kabupaten Banyumas', NULL, NULL, -7.4832133, 109.1404380, NULL, 0, 0, 0, 50, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(77, 1, '5f281e4f-4493-46d6-aaaa-eea34b0d74e9', NULL, 'Tanah Longsor', '2026-02-11', 'Sumatera Utara', 'Kabupaten Nias Selatan', NULL, NULL, 0.7086091, 97.8286368, NULL, 0, 0, 0, 45, 9, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(78, 1, 'c6eb66f9-380e-49af-b3a4-61b372d5e3ef', NULL, 'Tanah Longsor', '2026-02-08', 'Jawa Tengah', 'Kabupaten Banjarnegara', NULL, NULL, -7.4027060, 109.6813960, NULL, 0, 0, 0, 87, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(79, 1, '701b1af5-5069-4a82-91b9-4c15ab6e4efb', NULL, 'Tanah Longsor', '2026-02-07', 'Jawa Tengah', 'Kabupaten Wonosobo', NULL, NULL, -7.3621090, 109.8993990, NULL, 1, 0, 1, 5, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(80, 1, '2dc42f67-d678-4157-a6cc-9e671e0b9d69', NULL, 'Tanah Longsor', '2026-02-06', 'Jawa Tengah', 'Kabupaten Pemalang', NULL, NULL, -6.8842340, 109.3779980, NULL, 1, 0, 0, 3, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(81, 1, '0d151116-1def-4c07-aff1-24d01c743447', NULL, 'Gerakan Tanah', '2026-02-03', 'Jawa Barat', 'Kabupaten Garut', NULL, NULL, -7.2279060, 107.9086990, NULL, 0, 0, 0, 148, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(82, 1, '5b6506e0-9a99-46eb-b955-fb725d1b5910', NULL, 'Gerakan Tanah', '2026-02-02', 'Jawa Tengah', 'Kabupaten Tegal', NULL, NULL, -6.8666667, 109.1333333, NULL, 0, 0, 0, 3596, 691, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(83, 1, '34dcc487-2333-4d93-becb-cc92a6e9981a', NULL, 'Tanah Longsor', '2026-02-02', 'Kepulauan Bangka Belitung', 'Kabupaten Bangka', NULL, NULL, -2.2884782, 106.0640179, NULL, 7, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(84, 1, 'a21bdc48-c21d-45d2-9bde-413510e7ad5c', NULL, 'Tanah Longsor', '2026-02-02', 'Jawa Barat', 'Kabupaten Bandung', NULL, NULL, -6.9147444, 107.6098111, NULL, 1, 0, 0, 53, 1, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(85, 1, 'aa5e62a2-3b79-4321-b410-e29f1565bb4d', NULL, 'Tanah Longsor', '2026-02-01', 'Jawa Barat', 'Kabupaten Bandung', NULL, NULL, -6.9147444, 107.6098111, NULL, 2, 0, 0, 0, 1, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(86, 1, '1c5ad8de-71eb-4c10-87b4-049251f21147', NULL, 'Tanah Longsor', '2026-01-30', 'Jawa Tengah', 'Kabupaten Brebes', NULL, NULL, -6.8833333, 109.0500000, NULL, 0, 0, 0, 688, 143, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(87, 1, '03fbb81f-baa9-4ff3-9f98-54ed5b7e0c26', NULL, 'Gerakan Tanah', '2026-01-30', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 57, 11, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(88, 1, '013323a2-6a22-4968-b8ac-bf0f016997d8', NULL, 'Tanah Longsor', '2026-01-29', 'Jawa Barat', 'Kota Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 1, 0, 0, 90, 6, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(89, 1, 'dcc270fb-238f-4b73-84e8-6a2f5d99c4a1', NULL, 'Gerakan Tanah', '2026-01-29', 'Sulawesi Tengah', 'Kabupaten Morowali', NULL, NULL, -2.3003072, 121.5370003, NULL, 0, 0, 0, 288, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(90, 1, '061ddf20-6a72-4354-89bd-cd6ab45fe5f8', NULL, 'Tanah Longsor', '2026-01-29', 'Nusa Tenggara Timur', 'Kabupaten Kupang', NULL, NULL, -10.1833333, 123.5833333, NULL, 0, 0, 0, 80, 20, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(91, 1, '97794dfc-4ab6-45bb-896f-8a2b077b9e2b', NULL, 'Gerakan Tanah', '2026-01-29', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 157, 25, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(92, 1, 'c7afe657-1f96-43cc-bedf-ec673de3398a', NULL, 'Tanah Longsor', '2026-01-24', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 18, 5, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(93, 1, 'e82d6d5a-e2a2-4d4c-9992-b513ecfa373c', NULL, 'Gerakan Tanah', '2026-01-24', 'Jawa Tengah', 'Kota Semarang', NULL, NULL, -6.9666667, 110.4166667, NULL, 0, 0, 0, 69, 16, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(94, 1, '26f37b78-ba52-453e-947c-fbc0e2355a23', NULL, 'Tanah Longsor', '2026-01-24', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8937121, 107.4321959, NULL, 94, 0, 0, 233, 48, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(95, 1, 'b9f277d2-1caa-4af0-a914-c1d7f0446ad8', NULL, 'Gerakan Tanah', '2026-01-23', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 42, 9, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(96, 1, '297864bb-5c5d-4b46-9ea2-7e6b1007b241', NULL, 'Tanah Longsor', '2026-01-23', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 148, 42, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(97, 1, '4d3ba95e-b849-41d8-bb97-9ff9f0e2d658', NULL, 'Tanah Longsor', '2026-01-22', 'Nusa Tenggara Timur', 'Kabupaten Manggarai Timur', NULL, NULL, -8.6206712, 120.6199895, NULL, 2, 1, 0, 227, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(98, 1, '47f8fafc-55e5-4340-bc42-65730fa97a2c', NULL, 'Tanah Longsor', '2026-01-17', 'Jawa Timur', 'Kabupaten Ponorogo', NULL, NULL, -7.8678270, 111.4660030, NULL, 0, 0, 0, 500, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(99, 1, '1230f97f-7e74-414d-8f76-861b919dbe7b', NULL, 'Gerakan Tanah', '2026-01-17', 'Jawa Timur', 'Kabupaten Pamekasan', NULL, NULL, -7.1666667, 113.4666667, NULL, 0, 0, 0, 124, 16, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(100, 1, 'c34f385c-52b4-4f8f-bf00-13449f0d5dcf', NULL, 'Tanah Longsor', '2026-01-16', 'Jawa Tengah', 'Kabupaten Batang', NULL, NULL, -6.8941111, 109.7234519, NULL, 0, 0, 0, 35, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(101, 1, 'bdc87e9f-229d-4209-95fb-f334617f5e62', NULL, 'Tanah Longsor', '2026-01-15', 'Jawa Tengah', 'Kota Semarang', NULL, NULL, -6.9666667, 110.4166667, NULL, 0, 0, 0, 36, 7, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(102, 1, 'd88a064a-02bc-47ca-9bf9-dace556f7929', NULL, 'Tanah Longsor', '2026-01-12', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 30, 5, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(103, 1, '86f65707-8069-46de-863a-ec89c3f75aac', NULL, 'Tanah Longsor', '2026-01-09', 'Jawa Tengah', 'Kabupaten Jepara', NULL, NULL, -6.5596059, 110.6717000, NULL, 0, 0, 0, 3647, 29, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(104, 1, 'cca7630c-bc36-4c1e-b36f-6928bec2850b', NULL, 'Tanah Longsor', '2026-01-09', 'Jawa Tengah', 'Kabupaten Kudus', NULL, NULL, -6.8040870, 110.8382030, NULL, 1, 0, 0, 119, 35, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(105, 1, '8352954a-81e6-4af4-b2d5-e1d64195ff86', NULL, 'Gerakan Tanah', '2026-01-08', 'Jawa Tengah', 'Kabupaten Banjarnegara', NULL, NULL, -7.4027060, 109.6813960, NULL, 0, 0, 0, 66, 0, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(106, 1, '587b2a0f-a0bd-4316-a9d9-8d858f18f43b', NULL, 'Tanah Longsor', '2026-01-06', 'Banten', 'Kabupaten Serang', NULL, NULL, -6.1200900, 106.1502990, NULL, 0, 0, 0, 536, 54, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(107, 1, 'fb6b5433-cad1-4a5e-a348-3a6f23edd015', NULL, 'Tanah Longsor', '2026-01-05', 'Jawa Tengah', 'Kabupaten Blora', NULL, NULL, -6.9500000, 111.4166667, NULL, 0, 0, 0, 30, 6, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(108, 1, 'd12ad1eb-2425-4d02-a3b9-d817af15796a', NULL, 'Tanah Longsor', '2026-01-04', 'Jawa Barat', 'Kabupaten Karawang', NULL, NULL, -6.3227303, 107.3375791, NULL, 0, 0, 0, 20, 6, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(109, 1, 'e923c4c7-24b3-4625-84d9-78c72b35305f', NULL, 'Tanah Longsor', '2026-01-01', 'Jawa Tengah', 'Kabupaten Banjarnegara', NULL, NULL, -7.4027060, 109.6813960, NULL, 0, 0, 1, 221, 11, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(110, 1, '07662d5a-d2d6-483a-ae7c-ae8756a9fa3a', NULL, 'Gerakan Tanah', '2026-01-01', 'Jawa Tengah', 'Kabupaten Banjarnegara', NULL, NULL, -7.4027060, 109.6813960, NULL, 0, 0, 0, 206, 11, NULL, 'verified', '2026-11-16 02:31:25', '2026-11-16 02:31:59'),
(111, 1, 'b3ee942e-3440-4978-80f5-2ba022823c9c', NULL, 'Tanah Longsor', '2025-12-27', 'Daerah Istimewa Yogyakarta', 'Kabupaten Kulon Progo', NULL, NULL, -7.8293525, 110.0796027, NULL, 0, 0, 0, 34, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(112, 1, 'c54c295e-7e3f-491c-9750-5acf66f1f3f0', NULL, 'Tanah Longsor', '2025-12-23', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9118639, 106.9658374, NULL, 0, 0, 0, 40, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(113, 1, 'ac16a9ed-1000-4afe-a6c4-f63c3bfe96f0', NULL, 'Tanah Longsor', '2025-12-23', 'Jawa Tengah', 'Kabupaten Kendal', NULL, NULL, -6.9769894, 110.1415095, NULL, 0, 0, 0, 25, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(114, 1, 'e3a25efb-f24d-417f-9d99-dbed413720d9', NULL, 'Tanah Longsor', '2025-12-21', 'Jawa Tengah', 'Kabupaten Pemalang', NULL, NULL, -6.9233828, 109.3190456, NULL, 0, 0, 0, 125, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(115, 1, '04bad9aa-2358-4400-99a7-4a13e694a296', NULL, 'Tanah Longsor', '2025-12-21', 'Sumatera Barat', 'Kabupaten Pasaman', NULL, NULL, 0.1288752, 99.7901781, NULL, 0, 0, 0, 200, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(116, 1, '268ed82a-bcd7-4763-a9bf-b05e7ad5e794', NULL, 'Tanah Longsor', '2025-12-21', 'Banten', 'Kabupaten Lebak', NULL, NULL, -6.6192936, 106.2122927, NULL, 0, 0, 0, 140, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(117, 1, '6d028d6a-7e54-409d-9e5c-18a84c468f1b', NULL, 'Tanah Longsor', '2025-12-20', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9017993, 106.8571896, NULL, 0, 0, 0, 13, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(118, 1, 'f632480a-bdcd-4ea0-89c3-9367bbe272a7', NULL, 'Tanah Longsor', '2025-12-20', 'Banten', 'Kabupaten Lebak', NULL, NULL, -6.5905726, 106.2939831, NULL, 0, 0, 0, 55, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(119, 1, 'd0f2180a-8b08-4b56-8ef3-6151b401b2da', NULL, 'Tanah Longsor', '2025-12-19', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.8707565, 106.8630622, NULL, 0, 0, 0, 41, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(120, 1, '9ad3f16c-32dd-4d1b-bfbe-e34d2e0082bd', NULL, 'Tanah Longsor', '2025-12-18', 'Sulawesi Selatan', 'Kabupaten Sidenreng Rappang', NULL, NULL, -3.8447976, 119.9769774, NULL, 0, 0, 0, 1414, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(121, 1, '6fbdd8fb-0853-4ff5-b8e5-a1af26065b0a', NULL, 'Tanah Longsor', '2025-12-18', 'Jawa Barat', 'Kabupaten Bandung', NULL, NULL, -6.8722496, 107.6848118, NULL, 0, 0, 0, 358, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(122, 1, '84c2d635-0751-42de-b38a-cbfb2bc38289', NULL, 'Tanah Longsor', '2025-12-18', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.8593968, 106.9433943, NULL, 0, 0, 0, 300, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(123, 1, '746b1f51-3cc4-4eba-93d0-6e1a719a2ace', NULL, 'Tanah Longsor', '2025-12-18', 'Banten', 'Kabupaten Lebak', NULL, NULL, -6.5752419, 106.2961237, NULL, 0, 0, 0, 60, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(124, 1, '427df8ae-dac6-411a-9bb8-fa3827e4a5e9', NULL, 'Tanah Longsor', '2025-12-17', 'Banten', 'Kabupaten Lebak', NULL, NULL, -6.6251783, 106.2411100, NULL, 0, 0, 0, 50, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(125, 1, 'ee713a56-3ff7-405f-afd0-c92961b7586e', NULL, 'Tanah Longsor', '2025-12-14', 'Sumatera Utara', 'Kabupaten Mandailing Natal', NULL, NULL, 0.7432372, 99.3673084, NULL, 0, 0, 0, 1435, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(126, 1, '757c1992-d68c-42e3-877c-c08785dca75a', NULL, 'Tanah Longsor', '2025-12-13', 'Jawa Barat', 'Kabupaten Bandung', NULL, NULL, -6.9548076, 107.5808501, NULL, 0, 0, 0, 154, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(127, 1, '32d200cc-84af-4fab-af91-1a483cd57ed3', NULL, 'Tanah Longsor', '2025-12-10', 'Jawa Barat', 'Kabupaten Bandung', NULL, NULL, -6.8833011, 107.6871616, NULL, 0, 0, 0, 0, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(128, 1, '6eec885f-400c-43d7-83dc-b418c6f4ad3c', NULL, 'Tanah Longsor', '2025-12-09', 'Sulawesi Tengah', 'Kabupaten Donggala', NULL, NULL, -0.4233155, 119.8352303, NULL, 0, 0, 0, 0, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(129, 1, 'ff89d3d9-e95a-4543-8187-4eb56218579c', NULL, 'Tanah Longsor', '2025-12-06', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5275764, 106.8291316, NULL, 0, 0, 0, 45, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(130, 1, '5ae68f4f-9582-4a17-8aa5-f8d32132053c', NULL, 'Tanah Longsor', '2025-12-06', 'Sulawesi Tenggara', 'Kota Kendari', NULL, NULL, -3.9717996, 122.5285274, NULL, 0, 0, 0, 40, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(131, 1, 'cc41fdbe-6b44-48bf-9623-e7e59e6f5769', NULL, 'Tanah Longsor', '2025-12-05', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8362324, 107.4220243, NULL, 0, 0, 0, 69, 47, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(132, 1, '9aa5e574-6088-41cc-91b0-ef7102ba3beb', NULL, 'Tanah Longsor', '2025-12-04', 'Jawa Barat', 'Kabupaten Bandung', NULL, NULL, -6.9108893, 107.6730235, NULL, 0, 3, 1, 356, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(133, 1, '543623f1-2171-424a-b0c0-21ec15415d85', NULL, 'Tanah Longsor', '2025-12-04', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8552332, 107.3644153, NULL, 0, 0, 0, 512, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(134, 1, '6749c6de-3289-4179-880a-436578456850', NULL, 'Tanah Longsor', '2025-12-04', 'Jawa Tengah', 'Kabupaten Karanganyar', NULL, NULL, -7.5169217, 110.9532333, NULL, 0, 0, 0, 35, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(135, 1, '382024f5-2263-4194-a599-f83ef11bebca', NULL, 'Tanah Longsor', '2025-12-03', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.9372317, 107.4151307, NULL, 0, 0, 0, 208, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(136, 1, '124289b8-93c3-4c09-9d2c-f874c7d4113e', NULL, 'Tanah Longsor', '2025-11-27', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.3817895, 108.3060596, NULL, 0, 0, 0, 27, 9, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(137, 1, '5fdc8320-ad0f-4854-b393-357315902f54', NULL, 'Tanah Longsor', '2025-11-27', 'Jambi', 'Kota Sungai Penuh', NULL, NULL, -2.0465101, 101.3879146, NULL, 0, 0, 0, 0, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(138, 1, '13755fde-85d8-41b4-9d71-b1805e2b73d3', NULL, 'Tanah Longsor', '2025-11-25', 'Jawa Barat', 'Kabupaten Garut', NULL, NULL, -7.2195544, 107.8352793, NULL, 0, 0, 0, 0, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(139, 1, '1092d566-7414-436a-89e5-53d2c2d78b01', NULL, 'Tanah Longsor', '2025-11-25', 'Aceh', 'Kabupaten Aceh Barat', NULL, NULL, 4.4542745, 96.1526985, NULL, 0, 0, 0, 1705, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(140, 1, '69c97029-b036-4420-8127-1aeae4c6f691', NULL, 'Tanah Longsor', '2025-11-24', 'Sumatera Utara', 'Kota Gunungsitoli', NULL, NULL, 1.2819640, 97.6159400, NULL, 0, 0, 0, 16, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(141, 1, 'fae29aa2-dbb2-4426-b248-de15cf7db7fa', NULL, 'Tanah Longsor', '2025-11-24', 'Sumatera Barat', 'Kota Bukittinggi', NULL, NULL, -0.3221885, 100.3792466, NULL, 0, 0, 0, 68, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(142, 1, 'a50f4201-1958-4965-84c9-c0bb26ec37b1', NULL, 'Tanah Longsor', '2025-11-23', 'Jawa Tengah', 'Kabupaten Banyumas', NULL, NULL, -7.5464867, 109.1781961, NULL, 0, 0, 0, 40, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(143, 1, 'deca35f6-e73f-4b03-9209-67d400fddf40', NULL, 'Tanah Longsor', '2025-11-23', 'Jawa Timur', 'Kota Malang', NULL, NULL, -7.9818940, 112.6265030, NULL, 0, 0, 0, 75, 15, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(144, 1, '33ab9609-9a2a-4386-8ac9-4c2d477ee685', NULL, 'Tanah Longsor', '2025-11-20', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9237879, 106.8503903, NULL, 0, 0, 0, 32, 9, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(145, 1, 'fccb477b-5103-4614-aea0-db07817e2405', NULL, 'Tanah Longsor', '2025-11-19', 'Jawa Timur', 'Kabupaten Ponorogo', NULL, NULL, -7.9518240, 111.4708446, NULL, 0, 0, 0, 50, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(146, 1, '65de8cfd-e21b-4f3b-9a2c-e89dcbc4d467', NULL, 'Tanah Longsor', '2025-11-16', 'Jawa Tengah', 'Kota Semarang', NULL, NULL, -6.9481796, 110.4214301, NULL, 0, 0, 0, 35, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(147, 1, 'cebe122e-3771-456d-a9d5-4f41fb2f1679', NULL, 'Tanah Longsor', '2025-11-16', 'Jawa Tengah', 'Kabupaten Banjarnegara', NULL, NULL, -7.4889285, 109.6904030, NULL, 17, 11, 7, 2038, 198, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(148, 1, '5fa08f72-84e1-4af3-9c8b-0cd99196e66c', NULL, 'Tanah Longsor', '2025-11-15', 'Jawa Tengah', 'Kabupaten Purbalingga', NULL, NULL, -7.4172412, 109.4344418, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(149, 1, '1c330a58-8934-4b58-b6b9-ba1356d8f45e', NULL, 'Tanah Longsor', '2025-11-14', 'Jawa Tengah', 'Kabupaten Blora', NULL, NULL, -6.9068784, 111.4133781, NULL, 0, 0, 0, 60, 15, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(150, 1, '26af4bd7-df25-422b-981c-aa58cb8e63aa', NULL, 'Tanah Longsor', '2025-11-14', 'Jawa Tengah', 'Kabupaten Purbalingga', NULL, NULL, -7.4006706, 109.4177831, NULL, 0, 0, 0, 170, 19, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(151, 1, '96a33d14-8070-4b5e-94e3-6cfc63d7d651', NULL, 'Tanah Longsor', '2025-11-14', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.3882407, 108.3908584, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(152, 1, '19dd03a8-452c-4dac-91f0-33088acd77f0', NULL, 'Tanah Longsor', '2025-11-13', 'Jawa Tengah', 'Kabupaten Cilacap', NULL, NULL, -7.7403503, 109.0234544, NULL, 21, 3, 11, 1298, 15, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(153, 1, '1ba881eb-bf22-4c5c-8098-4b1a19e68068', NULL, 'Tanah Longsor', '2025-11-11', 'Jawa Barat', 'Kabupaten Garut', NULL, NULL, -7.2993191, 107.9518198, NULL, 0, 0, 0, 0, 36, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(154, 1, '37711b3f-d2bd-4cfe-9b21-d4065841afe5', NULL, 'Tanah Longsor', '2025-11-11', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.2693890, 108.3340983, NULL, 0, 0, 0, 183, 49, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(155, 1, 'e7326ae1-8eac-42d3-9e4c-1be695d6eaf9', NULL, 'Tanah Longsor', '2025-11-10', 'Jawa Timur', 'Kabupaten Magetan', NULL, NULL, -7.5926741, 111.3037367, NULL, 1, 0, 1, 5, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(156, 1, '22dff23a-36fe-4c02-b22a-56f519bbcd56', NULL, 'Tanah Longsor', '2025-11-10', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.3599976, 108.3814255, NULL, 0, 0, 0, 462, 45, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(157, 1, '63cd404f-ad99-4e8f-8394-c3475c8620fd', NULL, 'Tanah Longsor', '2025-11-09', 'Jawa Tengah', 'Kabupaten Banyumas', NULL, NULL, -7.5041247, 109.1914308, NULL, 0, 0, 0, 360, 90, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(158, 1, '768b53c3-ecd6-4296-bd6c-bdfa9a13243c', NULL, 'Tanah Longsor', '2025-11-08', 'Jawa Tengah', 'Kabupaten Banyumas', NULL, NULL, -7.5022891, 109.1150600, NULL, 0, 0, 0, 307, 66, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(159, 1, '979201c2-e74a-491c-a128-546710f1de7a', NULL, 'Tanah Longsor', '2025-11-08', 'Jawa Tengah', 'Kabupaten Cilacap', NULL, NULL, -7.7737271, 109.0573284, NULL, 0, 0, 0, 44, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(160, 1, 'c4c1cb37-9825-47e6-ba93-5e7ceedd930f', NULL, 'Tanah Longsor', '2025-11-07', 'Jawa Timur', 'Kabupaten Pacitan', NULL, NULL, -8.1489379, 111.0312546, NULL, 0, 0, 0, 35, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(161, 1, '025b94c9-20b8-440e-b8a9-f62168dc0d73', NULL, 'Tanah Longsor', '2025-11-06', 'Jawa Timur', 'Kabupaten Blitar', NULL, NULL, -8.1682907, 112.1487394, NULL, 0, 0, 0, 1500, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(162, 1, '42b88cba-5cd1-4e37-80cf-ad2c2eaf189a', NULL, 'Tanah Longsor', '2025-11-04', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5117524, 106.7913296, NULL, 0, 0, 0, 19, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(163, 1, '6735e485-df49-4336-a3ab-5037d9570538', NULL, 'Tanah Longsor', '2025-11-02', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.9213179, 107.4482108, NULL, 0, 0, 0, 12, 25, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(164, 1, '7ff82cd4-29a3-47ec-8dba-795bb52a4beb', NULL, 'Tanah Longsor', '2025-11-01', 'Jawa Timur', 'Kabupaten Trenggalek', NULL, NULL, -8.0337240, 111.6910392, NULL, 4, 0, 1, 0, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(165, 1, '1ea0bf78-18fc-495d-a44c-8d467dc4c9c0', NULL, 'Tanah Longsor', '2025-11-01', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8480784, 107.3979488, NULL, 0, 0, 0, 108, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(166, 1, 'ac249077-15af-4029-b4ba-30e4b7b3217f', NULL, 'Tanah Longsor', '2025-10-31', 'Jawa Barat', 'Kabupaten Bandung', NULL, NULL, -6.9835682, 107.6158924, NULL, 0, 0, 0, 13, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(167, 1, 'a1862268-5a11-4550-89de-9fcc2b533dc3', NULL, 'Tanah Longsor', '2025-10-30', 'Jawa Timur', 'Kabupaten Madiun', NULL, NULL, -7.5864775, 111.5090929, NULL, 0, 0, 0, 40, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(168, 1, '0485b5ac-ac54-4785-9873-4712a815ff5a', NULL, 'Tanah Longsor', '2025-10-29', 'Jawa Barat', 'Kabupaten Cianjur', NULL, NULL, -6.8488033, 107.1186841, NULL, 0, 0, 0, 369, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(169, 1, '9ee8fb01-3125-4a82-bacd-bd05e23ef19e', NULL, 'Tanah Longsor', '2025-10-29', 'Daerah Istimewa Yogyakarta', 'Kabupaten Kulon Progo', NULL, NULL, -7.8098745, 110.2302252, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(170, 1, 'd59a0a45-a767-4453-b95a-7bdf4982d519', NULL, 'Tanah Longsor', '2025-10-27', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5954264, 106.8609909, NULL, 0, 0, 0, 71, 12, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(171, 1, '26c86655-467c-4740-9678-557a66dacafc', NULL, 'Tanah Longsor', '2025-10-27', 'Jawa Barat', 'Kota Bogor', NULL, NULL, -6.5980354, 106.8188689, NULL, 0, 0, 0, 65, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(172, 1, '3af2a426-68c1-495f-88f5-d849c54fb78d', NULL, 'Tanah Longsor', '2025-10-27', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9753024, 106.8495164, NULL, 0, 0, 0, 38, 17, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(173, 1, '6461a66f-ea4d-43df-aa55-5874312e0c1e', NULL, 'Tanah Longsor', '2025-10-26', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.9773556, 107.4209219, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(174, 1, '8d65fca2-3b01-4789-afab-d3ca50847173', NULL, 'Tanah Longsor', '2025-10-24', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8748678, 107.4537951, NULL, 0, 0, 0, 150, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(175, 1, '94e07ff0-2479-478b-baab-c88631ef47f0', NULL, 'Tanah Longsor', '2025-10-24', 'Jawa Tengah', 'Kabupaten Banjarnegara', NULL, NULL, -7.4299462, 109.7284251, NULL, 0, 0, 0, 20, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(176, 1, 'f93a63cd-956b-4aa3-8899-c8f09d38cb4a', NULL, 'Tanah Longsor', '2025-10-24', 'Kalimantan Timur', 'Kabupaten Penajam Paser Utara', NULL, NULL, -1.2917094, 116.5137964, NULL, 0, 0, 0, 68, 17, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(177, 1, '46baef4c-7db4-4e85-91d8-0a7f4644c5cf', NULL, 'Tanah Longsor', '2025-10-23', 'Daerah Istimewa Yogyakarta', 'Kota Yogyakarta', NULL, NULL, -7.7937941, 110.3732729, NULL, 0, 0, 0, 11, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(178, 1, 'eeaf4304-dd19-4270-a34e-2264c4c07b4c', NULL, 'Tanah Longsor', '2025-10-22', 'Jawa Tengah', 'Kabupaten Purbalingga', NULL, NULL, -7.4334692, 109.3484621, NULL, 0, 0, 0, 20, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(179, 1, '5eb22ad5-22d7-4cf5-89f1-966012d0d3cd', NULL, 'Tanah Longsor', '2025-10-22', 'Jawa Tengah', 'Kabupaten Kebumen', NULL, NULL, -7.7313648, 109.6250080, NULL, 0, 0, 0, 20, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(180, 1, '2d37a429-91ed-4153-9b11-20839cf1f01c', NULL, 'Tanah Longsor', '2025-10-22', 'Kalimantan Timur', 'Kota Samarinda', NULL, NULL, -0.4825707, 117.1570173, NULL, 0, 0, 1, 25, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(181, 1, '97b23ce4-06ac-488d-9a85-779255e4e982', NULL, 'Tanah Longsor', '2025-10-21', 'Jawa Tengah', 'Kabupaten Wonosobo', NULL, NULL, -7.3036090, 109.9251429, NULL, 0, 0, 0, 112, 23, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(182, 1, '5b7b66e7-c812-4bba-b80c-5af9f22c6f75', NULL, 'Tanah Longsor', '2025-10-21', 'Jawa Tengah', 'Kabupaten Banjarnegara', NULL, NULL, -7.3472961, 109.6447853, NULL, 0, 0, 0, 24, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(183, 1, '2e8c3017-d493-4732-93a4-35c44e0ff200', NULL, 'Tanah Longsor', '2025-10-19', 'Jawa Tengah', 'Kabupaten Pemalang', NULL, NULL, -6.8670003, 109.3144383, NULL, 0, 0, 0, 44, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(184, 1, '02c4d5fe-8e27-4fbf-a0c3-7d0fcb877c40', NULL, 'Tanah Longsor', '2025-10-19', 'Kalimantan Timur', 'Kota Balikpapan', NULL, NULL, -1.2689840, 116.8458277, NULL, 2, 0, 2, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(185, 1, 'fecfb1df-4e1b-439e-ab90-6a99cd9183c3', NULL, 'Tanah Longsor', '2025-10-18', 'Bengkulu', 'Kabupaten Seluma', NULL, NULL, -4.1143690, 102.5958842, NULL, 0, 0, 0, 3745, 3, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(186, 1, 'd93de9fd-d958-4cd1-8cb9-2b723ed469d4', NULL, 'Tanah Longsor', '2025-10-16', 'Jawa Tengah', 'Kabupaten Brebes', NULL, NULL, -6.9308561, 109.1176840, NULL, 0, 0, 0, 72, 18, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(187, 1, 'c2f14ceb-0018-4926-be51-60ffa4a878c3', NULL, 'Tanah Longsor', '2025-10-11', 'Maluku', 'Kabupaten Maluku Tengah', NULL, NULL, -3.0166501, 129.4864411, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(188, 1, '431c5355-4930-4d57-a38e-e42a2e05daf1', NULL, 'Tanah Longsor', '2025-09-29', 'Jawa Barat', 'Kabupaten Bandung', NULL, NULL, -7.0023461, 107.5896805, NULL, 0, 0, 0, 61, 16, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(189, 1, 'ec7cbb79-b551-4981-b8ca-aa4518aab2e2', NULL, 'Tanah Longsor', '2025-09-27', 'Jawa Barat', 'Kabupaten Bandung', NULL, NULL, -6.9444827, 107.6848457, NULL, 0, 0, 0, 44, 20, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(190, 1, '81e6088d-304f-422c-a7f3-4c08ea0f4fbd', NULL, 'Tanah Longsor', '2025-09-27', 'Jawa Timur', 'Kabupaten Magetan', NULL, NULL, -7.6195107, 111.3493519, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(191, 1, 'b97e5a31-715c-4102-8dc5-a4fa707c51dd', NULL, 'Tanah Longsor', '2025-09-22', 'Sumatera Utara', 'Kabupaten Toba Samosir', NULL, NULL, 2.3502398, 99.2785583, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(192, 1, '92d0a2d0-90e0-495b-ba0d-1146ae751103', NULL, 'Tanah Longsor', '2025-09-22', 'Sumatera Barat', 'Kota Bukittinggi', NULL, NULL, -0.3010507, 100.3861685, NULL, 0, 0, 0, 0, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(193, 1, 'fd40c1e9-ec06-492a-84b6-8446f42df973', NULL, 'Tanah Longsor', '2025-09-14', 'Sulawesi Tengah', 'Kabupaten Banggai', NULL, NULL, -1.6408137, 123.5504076, NULL, 0, 0, 0, 108, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(194, 1, '79b1e406-a155-4f1c-83dd-4857505d050c', NULL, 'Tanah Longsor', '2025-09-13', 'Maluku', 'Kota Ambon', NULL, NULL, -3.6597086, 128.1774189, NULL, 0, 0, 0, 23, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(195, 1, '7b8192dc-674c-40b6-8b66-485eb97ff2cc', NULL, 'Tanah Longsor', '2025-09-12', 'Jawa Tengah', 'Kabupaten Sragen', NULL, NULL, -7.4781484, 111.0550793, NULL, 0, 0, 0, 25, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(196, 1, 'cf3b9547-ef18-4892-b2b2-f4c5d471cd6a', NULL, 'Tanah Longsor', '2025-09-11', 'Jawa Tengah', 'Kabupaten Purbalingga', NULL, NULL, -7.4387458, 109.3779820, NULL, 0, 0, 0, 20, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(197, 1, 'a560d224-57c5-4e91-a0ea-6c445f7a0eae', NULL, 'Tanah Longsor', '2025-09-09', 'Nusa Tenggara Timur', 'Kabupaten Ende', NULL, NULL, -8.8340360, 121.7185546, NULL, 0, 0, 0, 20, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(198, 1, 'f7034dd5-3087-408f-a012-6f0601c408c6', NULL, 'Tanah Longsor', '2025-09-08', 'Jawa Barat', 'Kabupaten Majalengka', NULL, NULL, -6.8276442, 108.1620605, NULL, 0, 0, 0, 11, 43, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(199, 1, '98a8a02e-6677-44ff-8f4d-9864030e163d', NULL, 'Tanah Longsor', '2025-09-07', 'Papua', 'Kabupaten Keerom', NULL, NULL, -3.2810666, 140.7962320, NULL, 0, 0, 0, 105, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(200, 1, '9f29aa0e-d4a1-44fd-8d57-e75475a6c10f', NULL, 'Tanah Longsor', '2025-09-07', 'Papua', 'Kabupaten Keerom', NULL, NULL, -3.2763582, 140.7341746, NULL, 0, 0, 0, 105, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(201, 1, '015e2d08-6c4b-4b32-88d9-2398a1f25ab8', NULL, 'Tanah Longsor', '2025-09-05', 'Sumatera Utara', 'Kabupaten Asahan', NULL, NULL, 2.7589825, 99.6780632, NULL, 3, 0, 1, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(202, 1, '5baa9b26-efb3-4fef-b3ed-090a36623c81', NULL, 'Tanah Longsor', '2025-09-05', 'Sumatera Utara', 'Kabupaten Asahan', NULL, NULL, 2.7497196, 99.5829976, NULL, 3, 0, 1, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11');
INSERT INTO `disaster_events` (`id`, `data_source_id`, `external_id`, `created_by`, `title`, `event_date`, `province`, `regency`, `district`, `village`, `latitude`, `longitude`, `description`, `deaths`, `missing`, `injured`, `displaced`, `houses_damaged`, `source_note`, `verification_status`, `created_at`, `updated_at`) VALUES
(203, 1, 'c47d4ad2-1ebe-4430-92ab-bf6905a33462', NULL, 'Tanah Longsor', '2025-09-04', 'Jawa Tengah', 'Kabupaten Banyumas', NULL, NULL, -7.4738895, 109.1992361, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(204, 1, '46165b6a-ec30-4215-91b8-ad4bd938f827', NULL, 'Tanah Longsor', '2025-08-31', 'Jawa Barat', 'Kabupaten Tasikmalaya', NULL, NULL, -7.3208784, 108.2707108, NULL, 0, 0, 0, 0, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(205, 1, '0da9e4ea-ffa1-4338-a9ff-ee39b054394b', NULL, 'Tanah Longsor', '2025-08-31', 'Kalimantan Timur', 'Kota Samarinda', NULL, NULL, -0.5067910, 117.1417650, NULL, 0, 0, 0, 25, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(206, 1, '4da21486-67f3-4c81-9735-ccdb023f5556', NULL, 'Tanah Longsor', '2025-08-30', 'Jawa Timur', 'Kabupaten Trenggalek', NULL, NULL, -8.0596877, 111.6666517, NULL, 0, 0, 0, 55, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(207, 1, '7eb4c428-ff78-4739-8ed1-ad681f592ab5', NULL, 'Tanah Longsor', '2025-08-29', 'Jawa Tengah', 'Kabupaten Kebumen', NULL, NULL, -7.6974057, 109.6201218, NULL, 0, 0, 0, 3, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(208, 1, '9c4f1265-e2f1-4099-a3b7-2cd50d2ad622', NULL, 'Tanah Longsor', '2025-08-19', 'Daerah Istimewa Yogyakarta', 'Kota Yogyakarta', NULL, NULL, -7.7913512, 110.3794048, NULL, 0, 0, 0, 40, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(209, 1, '63704e65-4801-43fe-aae2-080e9e44e6da', NULL, 'Tanah Longsor', '2025-08-17', 'Maluku', 'Kota Ambon', NULL, NULL, -3.6609147, 128.1685368, NULL, 0, 0, 0, 55, 13, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(210, 1, '8da2393b-d350-4d65-96b8-5a996c6f9985', NULL, 'Tanah Longsor', '2025-08-16', 'Maluku', 'Kota Ambon', NULL, NULL, -3.6598780, 128.1589981, NULL, 0, 0, 0, 190, 12, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(211, 1, 'b87616d7-d981-4b40-8f61-b90706632eb7', NULL, 'Tanah Longsor', '2025-08-13', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6844997, 106.8134158, NULL, 0, 0, 0, 52, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(212, 1, '25cdf56f-ce41-423c-8cbf-f1bde62e1259', NULL, 'Tanah Longsor', '2025-08-02', 'Kalimantan Timur', 'Kabupaten Kutai Barat', NULL, NULL, 0.1353881, 115.0940450, NULL, 0, 0, 0, 45, 3, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(213, 1, '958ab936-3c85-4e25-92cf-ddf38312f0c1', NULL, 'Tanah Longsor', '2025-08-01', 'Bengkulu', 'Kabupaten Seluma', NULL, NULL, -4.0821334, 102.5604717, NULL, 0, 0, 0, 1500, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(214, 1, '8575c99f-5302-42cd-a03a-ce74212bce6b', NULL, 'Tanah Longsor', '2025-08-01', 'Bengkulu', 'Kabupaten Seluma', NULL, NULL, -4.0445381, 102.6195518, NULL, 0, 0, 0, 1500, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(215, 1, '84645868-9a5c-416a-87ea-d08288f94b8d', NULL, 'Tanah Longsor', '2025-07-14', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5626187, 106.8508949, NULL, 0, 0, 0, 26, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(216, 1, '2f290b78-f24b-47bb-8874-ea1bec657df6', NULL, 'Tanah Longsor', '2025-07-13', 'Kepulauan Bangka Belitung', 'Kabupaten Bangka Tengah', NULL, NULL, -2.3478510, 106.0771662, NULL, 3, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(217, 1, '8d5dfc4a-cdbc-4e26-8075-737cdf86d5b4', NULL, 'Tanah Longsor', '2025-07-09', 'Banten', 'Kabupaten Lebak', NULL, NULL, -6.4883299, 106.2298138, NULL, 0, 0, 0, 0, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(218, 1, '7dbbb494-05ac-4445-96ef-7c79d33071b6', NULL, 'Tanah Longsor', '2025-07-08', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6055690, 106.7644499, NULL, 0, 0, 0, 22, 16, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(219, 1, '77aa8145-3ad0-44ec-a613-24a9acb45a96', NULL, 'Tanah Longsor', '2025-07-08', 'Maluku', 'Kota Ambon', NULL, NULL, -3.6619884, 128.1738807, NULL, 0, 0, 0, 46, 9, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(220, 1, '4be7864d-18d8-4583-96f6-fee598b9f8d5', NULL, 'Tanah Longsor', '2025-07-05', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5691824, 106.7842090, NULL, 4, 0, 5, 361, 41, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(221, 1, 'd746dbb6-bb37-4105-902a-0a3181d42750', NULL, 'Tanah Longsor', '2025-07-05', 'Jawa Tengah', 'Kabupaten Brebes', NULL, NULL, -6.9301699, 109.0188046, NULL, 0, 0, 0, 536, 78, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(222, 1, 'aa8f5597-8991-4797-b039-a6e8b9a8447e', NULL, 'Tanah Longsor', '2025-07-05', 'Sulawesi Selatan', 'Kabupaten Sinjai', NULL, NULL, -5.1893420, 120.1778164, NULL, 0, 0, 0, 143, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(223, 1, '1c1e8865-2dbb-4a3c-977c-cf9221f04936', NULL, 'Tanah Longsor', '2025-07-03', 'Maluku', 'Kota Ambon', NULL, NULL, -3.6434387, 128.1554133, NULL, 0, 0, 0, 26, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(224, 1, '8116f4b8-b7b3-4b9a-a40d-8c7e7b5d1c16', NULL, 'Tanah Longsor', '2025-07-02', 'Papua', 'Kabupaten Keerom', NULL, NULL, -3.4119036, 140.7227344, NULL, 3, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(225, 1, 'ce6e21c6-ad7d-4ab7-98ac-c46be8aba7c0', NULL, 'Tanah Longsor', '2025-07-01', 'Sulawesi Barat', 'Kabupaten Polewali Mandar', NULL, NULL, -3.2911696, 119.1443158, NULL, 0, 0, 0, 300, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(226, 1, 'b799fbdd-4139-4270-8485-bfab10c564d5', NULL, 'Tanah Longsor', '2025-06-30', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5248719, 106.7547043, NULL, 0, 0, 0, 29, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(227, 1, '3c8ba19c-77c5-4881-9af0-2565d9d1f7b5', NULL, 'Tanah Longsor', '2025-06-29', 'Jawa Barat', 'Kabupaten Tasikmalaya', NULL, NULL, -7.3361775, 108.2842481, NULL, 2, 2, 4, 2, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(228, 1, 'fedcaf91-d7fe-472e-9606-bbf889d398be', NULL, 'Tanah Longsor', '2025-06-28', 'Sulawesi Tenggara', 'Kota Kendari', NULL, NULL, -3.9796424, 122.5003539, NULL, 0, 0, 0, 75, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(229, 1, 'eccfb18e-942e-4c8c-9421-05348e7cc05b', NULL, 'Tanah Longsor', '2025-06-28', 'Jawa Barat', 'Kabupaten Tasikmalaya', NULL, NULL, -7.2980338, 108.2405194, NULL, 1, 0, 0, 10, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(230, 1, '0e23291e-6931-4bfe-8b14-2498d5fc7da2', NULL, 'Tanah Longsor', '2025-06-26', 'Kalimantan Utara', 'Kabupaten Malinau', NULL, NULL, 3.6034855, 116.7320239, NULL, 0, 0, 0, 3445, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(231, 1, 'b043dd0f-0f9a-41ce-8b89-fd65750d3033', NULL, 'Tanah Longsor', '2025-06-25', 'Jawa Barat', 'Kabupaten Garut', NULL, NULL, -7.2173494, 107.8487622, NULL, 4, 0, 0, 8, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(232, 1, 'd7e7634d-40f9-4d86-8db6-b5092f915ddb', NULL, 'Tanah Longsor', '2025-06-21', 'Sulawesi Tengah', 'Kabupaten Parigi Moutong', NULL, NULL, 0.5398003, 120.7671834, NULL, 7, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(233, 1, '2afc50c5-f0e9-4593-a853-23320f4defdb', NULL, 'Tanah Longsor', '2025-06-21', 'Maluku Utara', 'Kota Ternate', NULL, NULL, 0.7947641, 127.3533728, NULL, 0, 0, 0, 60, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(234, 1, 'e30f1192-5458-4568-98e2-00886034a244', NULL, 'Tanah Longsor', '2025-06-21', 'Maluku Utara', 'Kota Ternate', NULL, NULL, 0.7922949, 127.3580616, NULL, 0, 0, 0, 60, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(235, 1, '2d96249f-6434-4f51-b0aa-be04a7a833cf', NULL, 'Tanah Longsor', '2025-06-21', 'Maluku', 'Kota Ambon', NULL, NULL, -3.6600322, 128.1578869, NULL, 1, 0, 1, 3067, 602, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(236, 1, '27793ba3-1285-41ba-8102-489b9616e4ef', NULL, 'Tanah Longsor', '2025-06-19', 'Maluku Utara', 'Kota Tidore Kepulauan', NULL, NULL, 0.6678108, 127.4121478, NULL, 0, 0, 0, 15, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(237, 1, 'ffd375a1-1d58-442c-bf49-3cb3f09f4575', NULL, 'Tanah Longsor', '2025-06-18', 'Jawa Barat', 'Kota Cirebon', NULL, NULL, -6.7233053, 108.5594218, NULL, 2, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(238, 1, 'eb683912-9441-43a4-89c9-02887a6bfd25', NULL, 'Tanah Longsor', '2025-06-16', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6619613, 106.8424015, NULL, 0, 0, 0, 17, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(239, 1, 'caecbb3b-e725-4816-b0f8-e7c141cf336d', NULL, 'Tanah Longsor', '2025-06-12', 'Sulawesi Barat', 'Kabupaten Mamasa', NULL, NULL, -2.9920374, 119.2883457, NULL, 0, 0, 0, 4, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(240, 1, '170b005d-7d5a-4fef-9af7-c2c52c5db87f', NULL, 'Tanah Longsor', '2025-06-09', 'Sulawesi Barat', 'Kabupaten Mamasa', NULL, NULL, -2.9294178, 119.2992466, NULL, 0, 0, 0, 22, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(241, 1, '81cbdab6-f3bd-4a00-b5ea-c8c30cc6a598', NULL, 'Tanah Longsor', '2025-06-08', 'Maluku', 'Kota Ambon', NULL, NULL, -3.6668281, 128.1670579, NULL, 0, 0, 0, 31, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(242, 1, '6f6dbf88-d430-4958-b31d-d030b26d4b7d', NULL, 'Tanah Longsor', '2025-06-08', 'Maluku', 'Kabupaten Seram Bagian Timur', NULL, NULL, -3.4150761, 130.3904880, NULL, 0, 0, 0, 20, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(243, 1, '689b82cd-63d3-4073-8201-841eb65828ff', NULL, 'Tanah Longsor', '2025-06-04', 'Maluku Utara', 'Kabupaten Halmahera Selatan', NULL, NULL, 1.2571150, 128.5067916, NULL, 0, 0, 0, 27, 9, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(244, 1, '0753140a-9977-4264-8f6b-487e4a993508', NULL, 'Tanah Longsor', '2025-06-03', 'Maluku Utara', 'Kabupaten Halmahera Selatan', NULL, NULL, 1.3375856, 128.4012953, NULL, 0, 0, 0, 1317, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(245, 1, '403ceb53-2fa3-4f50-9ac8-21fd5719251b', NULL, 'Tanah Longsor', '2025-06-03', 'Maluku Utara', 'Kabupaten Halmahera Selatan', NULL, NULL, 1.2883757, 128.4195079, NULL, 0, 0, 0, 1331, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(246, 1, '217d126f-d81f-445b-8ea2-501dddb5fd54', NULL, 'Tanah Longsor', '2025-06-02', 'Papua Barat Daya', 'Kabupaten Raja Ampat', NULL, NULL, -1.0915151, 130.8778586, NULL, 0, 0, 0, 75, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(247, 1, '4cd88aca-fd24-470b-8d05-3324c00b7899', NULL, 'Tanah Longsor', '2025-06-02', 'Maluku', 'Kabupaten Maluku Tenggara', NULL, NULL, -5.7512455, 132.7271587, NULL, 0, 0, 0, 138, 37, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(248, 1, '8b9fe535-5b3a-4574-82c1-c8c190ed4a03', NULL, 'Tanah Longsor', '2025-05-30', 'Jawa Barat', 'Kabupaten Cirebon', NULL, NULL, -6.7345993, 108.6069187, NULL, 21, 4, 9, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(249, 1, '0c44439a-9040-4fbf-9ca3-a263a3896a67', NULL, 'Tanah Longsor', '2025-05-30', 'Kalimantan Timur', 'Kota Samarinda', NULL, NULL, -0.5131186, 117.1583701, NULL, 0, 0, 0, 15, 4, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(250, 1, 'cb6c0610-8010-4e1b-8c3b-1ba66185f36c', NULL, 'Tanah Longsor', '2025-05-27', 'Kalimantan Timur', 'Kota Samarinda', NULL, NULL, -0.5018074, 117.1615673, NULL, 1, 0, 5, 15, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(251, 1, '5dac2228-772c-4839-95df-3fbc4df6bdf7', NULL, 'Tanah Longsor', '2025-05-27', 'Kalimantan Timur', 'Kota Samarinda', NULL, NULL, -0.4872090, 117.1416648, NULL, 1, 0, 5, 73, 13, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(252, 1, '02380921-48a4-44fd-8c3b-08be49b45150', NULL, 'Tanah Longsor', '2025-05-26', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.3760826, 108.3341515, NULL, 0, 0, 0, 70, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(253, 1, '2ad34c51-71e2-44fb-a6e5-c9796d763530', NULL, 'Tanah Longsor', '2025-05-25', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.3129540, 108.3712046, NULL, 0, 0, 0, 133, 43, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(254, 1, '309f3ece-d09a-4a37-ae20-7d54a1008bbf', NULL, 'Tanah Longsor', '2025-05-23', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8540375, 107.4623467, NULL, 0, 0, 0, 120, 3, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(255, 1, '546fd8a1-0ce2-4f84-a387-4b8af8d94678', NULL, 'Tanah Longsor', '2025-05-23', 'Jawa Barat', 'Kabupaten Tasikmalaya', NULL, NULL, -7.3649406, 108.1871060, NULL, 0, 0, 0, 95, 19, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(256, 1, 'd86e3710-fc4d-4b72-bb5f-e75bee65b633', NULL, 'Tanah Longsor', '2025-05-22', 'Jawa Timur', 'Kabupaten Malang', NULL, NULL, -7.9867901, 112.6688929, NULL, 0, 0, 0, 40, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(257, 1, '4b56db7b-3813-4d7f-9624-1071756de496', NULL, 'Tanah Longsor', '2025-05-21', 'Jawa Barat', 'Kabupaten Bekasi', NULL, NULL, -6.2354158, 107.0437061, NULL, 0, 0, 0, 31, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(258, 1, 'baf600fa-ccb1-4f0f-b5a9-cdbdb3ac1f6d', NULL, 'Tanah Longsor', '2025-05-21', 'Jawa Barat', 'Kabupaten Tasikmalaya', NULL, NULL, -7.3626100, 108.2193312, NULL, 0, 0, 0, 47, 9, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(259, 1, '1f48da5e-0919-4589-8e4e-7b8ec4e296b5', NULL, 'Tanah Longsor', '2025-05-19', 'Jawa Timur', 'Kabupaten Trenggalek', NULL, NULL, -7.9890817, 111.6693242, NULL, 6, 0, 0, 88, 28, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(260, 1, '3f7904a7-cce0-452d-9925-9d81e68a87ac', NULL, 'Tanah Longsor', '2025-05-19', 'Jawa Timur', 'Kabupaten Tulungagung', NULL, NULL, -8.0242208, 111.8556660, NULL, 0, 0, 0, 0, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(261, 1, '1f25e3ad-3a3c-45e2-9461-593204079c03', NULL, 'Tanah Longsor', '2025-05-18', 'Jawa Barat', 'Kabupaten Bandung', NULL, NULL, -6.9588597, 107.6086552, NULL, 0, 0, 3, 372, 4, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(262, 1, '070bc67d-3c58-4640-8e1b-e5c2a5db4436', NULL, 'Tanah Longsor', '2025-05-18', 'Jawa Tengah', 'Kabupaten Sukoharjo', NULL, NULL, -7.6808818, 110.8195292, NULL, 0, 0, 0, 7, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(263, 1, '2ec3251f-8fd0-4898-933e-58ed191f6b9e', NULL, 'Tanah Longsor', '2025-05-17', 'Sulawesi Selatan', 'Kabupaten Pinrang', NULL, NULL, -3.8273504, 119.6557032, NULL, 0, 0, 0, 110, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(264, 1, '35d88870-b754-4ceb-9328-feb85ec042bf', NULL, 'Tanah Longsor', '2025-05-17', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5470168, 106.8601832, NULL, 0, 0, 0, 3, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(265, 1, 'dc691fd6-9236-4abe-a0f8-7c99cbe61606', NULL, 'Tanah Longsor', '2025-05-17', 'Sulawesi Selatan', 'Kabupaten Luwu Utara', NULL, NULL, -2.3379808, 120.0141358, NULL, 0, 0, 0, 55, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(266, 1, 'f3665d18-4bfb-4e2b-8df2-2cc67cabbcc4', NULL, 'Tanah Longsor', '2025-05-17', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5125491, 106.8087652, NULL, 0, 0, 0, 4, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(267, 1, '97575931-922f-4b48-9226-9d3b3a2796f6', NULL, 'Tanah Longsor', '2025-05-17', 'Jawa Tengah', 'Kabupaten Purbalingga', NULL, NULL, -7.3937836, 109.3429677, NULL, 0, 0, 0, 14, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(268, 1, 'ba805b63-8b53-4a4f-baec-886ba387ce3d', NULL, 'Tanah Longsor', '2025-05-17', 'Jawa Timur', 'Kabupaten Tulungagung', NULL, NULL, -8.0329010, 111.8816648, NULL, 0, 0, 0, 25, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(269, 1, '42c41144-933f-4286-b7f3-69c8d9c51178', NULL, 'Tanah Longsor', '2025-05-16', 'Jawa Timur', 'Kabupaten Kediri', NULL, NULL, -7.8093560, 112.0323560, NULL, 0, 0, 0, 105, 21, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(270, 1, 'dc3d7cf7-1752-4398-8cab-8d2de83dcb30', NULL, 'Tanah Longsor', '2025-05-16', 'Kalimantan Timur', 'Kabupaten Kutai Kartanegara', NULL, NULL, -0.1000028, 116.6262934, NULL, 0, 0, 0, 60, 20, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(271, 1, '4aa98e31-7954-4aa9-a6eb-694b113c8e7b', NULL, 'Tanah Longsor', '2025-05-15', 'Jawa Timur', 'Kabupaten Ponorogo', NULL, NULL, -7.8573768, 111.5469823, NULL, 0, 0, 0, 38, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(272, 1, '3ff0ccb8-0610-4166-8bbb-b51508ec238f', NULL, 'Tanah Longsor', '2025-05-15', 'Kalimantan Timur', 'Kabupaten Kutai Kartanegara', NULL, NULL, -0.0604272, 116.6257700, NULL, 0, 0, 0, 238, 15, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(273, 1, 'fdc008d0-ce85-4747-ae1b-457f63ed4d2e', NULL, 'Tanah Longsor', '2025-05-14', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8770200, 107.3475192, NULL, 0, 0, 11, 233, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(274, 1, 'f0840e5b-166c-4903-a29c-234fa2a2fbe2', NULL, 'Tanah Longsor', '2025-05-13', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5848956, 106.8449795, NULL, 0, 0, 0, 18, 4, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(275, 1, '4b92916b-3600-4d19-85fc-1bc7e6201240', NULL, 'Tanah Longsor', '2025-05-12', 'Sulawesi Barat', 'Kabupaten Mamasa', NULL, NULL, -2.9876894, 119.4068589, NULL, 0, 0, 0, 135, 13, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(276, 1, '60d319a3-0afe-4dac-94d6-ed6cff0ac1e8', NULL, 'Tanah Longsor', '2025-05-12', 'Jawa Tengah', 'Kabupaten Wonogiri', NULL, NULL, -7.8177820, 110.9206010, NULL, 0, 0, 2, 0, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(277, 1, '47930b4f-8133-4b35-b555-3fbeec870d1b', NULL, 'Tanah Longsor', '2025-05-12', 'Kalimantan Timur', 'Kota Samarinda', NULL, NULL, -0.4952945, 117.1620355, NULL, 4, 0, 0, 100, 21, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(278, 1, '19b0d829-ab63-47ce-a9f2-75be5b5de20b', NULL, 'Tanah Longsor', '2025-05-12', 'Kalimantan Timur', 'Kota Samarinda', NULL, NULL, -0.5037764, 117.1672701, NULL, 4, 0, 0, 100, 21, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(279, 1, '4c764387-1e9b-44a7-94f7-3774218eee35', NULL, 'Tanah Longsor', '2025-05-10', 'Jawa Barat', 'Kabupaten Kuningan', NULL, NULL, -6.9477680, 108.5235247, NULL, 0, 0, 1, 23, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(280, 1, '83558ca2-01d2-4dd5-9c88-303e2da5c463', NULL, 'Tanah Longsor', '2025-05-10', 'Nusa Tenggara Timur', 'Kabupaten Timor Tengah Utara', NULL, NULL, -9.4522647, 124.5971320, NULL, 0, 0, 0, 51, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(281, 1, 'deaf180e-f8e7-4dff-81b1-e98932baa718', NULL, 'Tanah Longsor', '2025-05-09', 'Nusa Tenggara Timur', 'Kabupaten Timor Tengah Selatan', NULL, NULL, -9.7902829, 124.4838691, NULL, 0, 0, 0, 124, 23, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(282, 1, '6245c9dc-b4ec-4c50-9a1a-c9c777e28e56', NULL, 'Tanah Longsor', '2025-05-08', 'Nusa Tenggara Timur', 'Kabupaten Timor Tengah Selatan', NULL, NULL, -9.7825663, 124.3472644, NULL, 0, 0, 0, 107, 18, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(283, 1, '83dac356-43e1-44d8-9ee5-3045136ef349', NULL, 'Tanah Longsor', '2025-05-07', 'Nusa Tenggara Timur', 'Kabupaten Timor Tengah Selatan', NULL, NULL, -9.7504904, 124.3926446, NULL, 0, 0, 0, 1986, 305, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(284, 1, '875edac0-4581-46ee-a6dd-15152d770ca7', NULL, 'Tanah Longsor', '2025-05-06', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6211067, 106.7936650, NULL, 0, 0, 0, 28, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(285, 1, '58d2c69a-c2ff-4a50-85dc-cdafa0dd87bf', NULL, 'Tanah Longsor', '2025-05-06', 'Jawa Barat', 'Kabupaten Garut', NULL, NULL, -7.2392112, 107.8889254, NULL, 0, 0, 0, 110, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(286, 1, '64088c9d-efc8-4900-a240-c1f37f2437a6', NULL, 'Tanah Longsor', '2025-05-03', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6282881, 106.7752254, NULL, 0, 0, 0, 25, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(287, 1, 'aa73e067-7de0-42ae-a9b3-abd8ca864000', NULL, 'Tanah Longsor', '2025-05-01', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8600303, 107.3905628, NULL, 0, 0, 1, 225, 9, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(288, 1, '2550830f-9b42-40d0-97dc-52b09c580076', NULL, 'Tanah Longsor', '2025-05-01', 'Jawa Tengah', 'Kabupaten Magelang', NULL, NULL, -7.4012351, 110.2021533, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(289, 1, 'b81da0a4-de10-4752-986d-2b71db640418', NULL, 'Tanah Longsor', '2025-04-28', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6235784, 106.8867062, NULL, 0, 0, 0, 36, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(290, 1, '78203866-aca7-4bbb-b92f-11420f84fc5a', NULL, 'Tanah Longsor', '2025-04-28', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6038450, 106.8882333, NULL, 0, 0, 0, 7, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(291, 1, '6d4422fd-25bf-4529-a70b-bccbc73838fa', NULL, 'Tanah Longsor', '2025-04-27', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6475860, 106.7755170, NULL, 0, 0, 0, 36, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(292, 1, '4cde2053-6906-4916-ad02-45a23f2dc004', NULL, 'Tanah Longsor', '2025-04-26', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5511541, 106.7599599, NULL, 0, 0, 0, 48, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(293, 1, '85e7ad3a-2e87-4a79-b8f8-f25e4e97eb5b', NULL, 'Tanah Longsor', '2025-04-25', 'Papua Pegunungan', 'Kabupaten Jayawijaya', NULL, NULL, -4.0004481, 138.7995122, NULL, 0, 0, 0, 1355, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(294, 1, '52be5592-7fd0-41d0-a753-588a95f1b301', NULL, 'Tanah Longsor', '2025-04-25', 'Kalimantan Timur', 'Kabupaten Kutai Kartanegara', NULL, NULL, -0.1559767, 116.6306609, NULL, 0, 0, 0, 61, 15, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(295, 1, '0811e220-a8f2-45ac-b8d7-2eb1d6d67f32', NULL, 'Gerakan Tanah', '2025-04-25', 'Kalimantan Timur', 'Kabupaten Kutai Kartanegara', NULL, NULL, -0.1394458, 116.5247699, NULL, 0, 0, 0, 61, 15, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(296, 1, '9e5f9ea9-0e1b-4e5f-b99d-2c1c7db08ea0', NULL, 'Tanah Longsor', '2025-04-24', 'Papua Pegunungan', 'Kabupaten Tolikara', NULL, NULL, -3.4811320, 138.4787258, NULL, 2, 0, 152, 7588, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(297, 1, '4cbbb939-c804-4621-a38a-ccb16c02fb7f', NULL, 'Tanah Longsor', '2025-04-24', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6406154, 106.7277159, NULL, 0, 0, 0, 27, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(298, 1, 'dbd3871c-62b0-4aa9-bfd7-301f93e7d34d', NULL, 'Tanah Longsor', '2025-04-21', 'Papua Pegunungan', 'Kabupaten Nduga', NULL, NULL, -4.4069496, 138.2393528, NULL, 0, 0, 0, 5457, 2100, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(299, 1, 'f225aac3-749d-4a13-8145-06ba49478215', NULL, 'Tanah Longsor', '2025-04-20', 'Jawa Barat', 'Kabupaten Purwakarta', NULL, NULL, -6.6070625, 107.5056091, NULL, 0, 0, 0, 508, 70, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(300, 1, 'ad195c2f-8d50-41a7-be9c-aa4850cf1de0', NULL, 'Tanah Longsor', '2025-04-18', 'Sulawesi Selatan', 'Kabupaten Tana Toraja', NULL, NULL, -3.0243091, 119.7646989, NULL, 0, 0, 0, 50, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(301, 1, 'fa06d324-bad6-406c-aefe-d73122d52226', NULL, 'Tanah Longsor', '2025-04-18', 'Kalimantan Timur', 'Kota Balikpapan', NULL, NULL, -1.2525634, 116.8291607, NULL, 0, 0, 0, 25, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(302, 1, 'c99ec908-0bf2-47c9-b71a-4b10f9376d64', NULL, 'Tanah Longsor', '2025-04-18', 'Sulawesi Tenggara', 'Kabupaten Kolaka Utara', NULL, NULL, -3.1964645, 121.1248829, NULL, 0, 0, 0, 655, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(303, 1, '37433375-3420-4205-bc14-56f813abaaf7', NULL, 'Tanah Longsor', '2025-04-17', 'Jawa Barat', 'Kota Bogor', NULL, NULL, -6.6002603, 106.7944352, NULL, 0, 0, 2, 11, 4, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(304, 1, '21fa805d-b506-492d-8308-de682e8f0965', NULL, 'Tanah Longsor', '2025-04-17', 'Jawa Tengah', 'Kabupaten Brebes', NULL, NULL, -6.8399433, 109.0691777, NULL, 0, 0, 0, 1071, 135, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(305, 1, '2f537b91-7084-4f2f-b978-008da5dbe6ac', NULL, 'Tanah Longsor', '2025-04-15', 'Jawa Timur', 'Kabupaten Pamekasan', NULL, NULL, -7.1144614, 113.4196726, NULL, 0, 0, 0, 2000, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(306, 1, '4ade8a3f-e382-4300-b873-dd25a462c89c', NULL, 'Tanah Longsor', '2025-04-14', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.9257755, 107.4353995, NULL, 0, 0, 0, 31, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(307, 1, 'c01f724d-4af8-42e2-b282-a6d4da687959', NULL, 'Tanah Longsor', '2025-04-14', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.9461070, 107.4511614, NULL, 0, 0, 0, 27, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(308, 1, '6d2b767e-bf5a-4a2b-9c26-ff146ccd216a', NULL, 'Tanah Longsor', '2025-04-13', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9571176, 106.9462275, NULL, 0, 0, 0, 36, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(309, 1, 'ae5b1234-de67-4eb3-a93b-bceccbff2899', NULL, 'Tanah Longsor', '2025-04-13', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.3483273, 108.3659333, NULL, 0, 0, 0, 43, 9, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(310, 1, 'cf8d551a-1fb8-4f2e-adf9-17de146e5a87', NULL, 'Tanah Longsor', '2025-04-11', 'Jawa Barat', 'Kabupaten Subang', NULL, NULL, -6.5071062, 107.7538209, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(311, 1, '55f89072-5256-4f2f-82da-7a91c09b9548', NULL, 'Tanah Longsor', '2025-04-09', 'Jawa Tengah', 'Kabupaten Cilacap', NULL, NULL, -7.6639494, 109.0421979, NULL, 0, 0, 0, 0, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(312, 1, 'b296c47b-07f5-41e7-8077-93527c1bf477', NULL, 'Tanah Longsor', '2025-04-08', 'Jawa Barat', 'Kabupaten Karawang', NULL, NULL, -6.3872731, 107.3867024, NULL, 0, 0, 0, 21, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(313, 1, '0b804cc3-b08d-459e-9f26-190e6c7ce60d', NULL, 'Tanah Longsor', '2025-04-07', 'Jawa Barat', 'Kota Cimahi', NULL, NULL, -6.8802390, 107.5355000, NULL, 0, 0, 0, 92, 4, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(314, 1, 'e98d5f99-4cb6-46a3-bda4-28d6053a5876', NULL, 'Tanah Longsor', '2025-04-06', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.2839546, 108.2758438, NULL, 0, 0, 0, 183, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(315, 1, 'acbcfdd2-02b9-4c8b-b415-b061f1ee9178', NULL, 'Tanah Longsor', '2025-04-06', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8912727, 107.3758854, NULL, 0, 0, 0, 5, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(316, 1, '018aac06-2d0b-4d52-8244-26778d50dc46', NULL, 'Tanah Longsor', '2025-04-04', 'Gorontalo', 'Kabupaten Gorontalo Utara', NULL, NULL, 0.9252647, 122.4920088, NULL, 0, 0, 0, 127, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(317, 1, 'a7d036bf-b72d-4834-b2d7-4591ba2e9c4c', NULL, 'Tanah Longsor', '2025-04-03', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.2506686, 108.3329860, NULL, 0, 0, 0, 29, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(318, 1, '4f9545f0-a99b-426f-aa1a-d5987737bd95', NULL, 'Tanah Longsor', '2025-04-03', 'Jawa Barat', 'Kabupaten Garut', NULL, NULL, -7.2079202, 107.8234177, NULL, 0, 0, 0, 76, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(319, 1, '35a864ae-e124-4b8d-a7e6-52f90f51e2bb', NULL, 'Tanah Longsor', '2025-04-03', 'Jawa Timur', 'Kabupaten Mojokerto', NULL, NULL, -7.4122204, 112.4096432, NULL, 10, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(320, 1, 'feb294c8-b63d-4d16-aa18-3a8c4610b790', NULL, 'Tanah Longsor', '2025-04-02', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.3831296, 108.3213686, NULL, 0, 0, 0, 140, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(321, 1, '07af242f-9e64-4e6f-a79f-251509986173', NULL, 'Tanah Longsor', '2025-03-28', 'Jawa Tengah', 'Kabupaten Karanganyar', NULL, NULL, -7.6751449, 110.9539751, NULL, 0, 0, 0, 0, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(322, 1, 'ff9ce7af-c00a-4b8d-9895-06018f054e08', NULL, 'Tanah Longsor', '2025-03-28', 'Daerah Istimewa Yogyakarta', 'Kabupaten Kulon Progo', NULL, NULL, -7.8738240, 110.1943051, NULL, 0, 0, 0, 39, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(323, 1, '5f41c74f-fcc8-4192-95f5-707de00951df', NULL, 'Tanah Longsor', '2025-03-28', 'Daerah Istimewa Yogyakarta', 'Kabupaten Kulon Progo', NULL, NULL, -7.7792792, 110.1655555, NULL, 0, 0, 0, 39, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(324, 1, 'e131b9a9-3528-4dd1-a1ed-43f9f42eb509', NULL, 'Gerakan Tanah', '2025-03-28', 'Daerah Istimewa Yogyakarta', 'Kabupaten Bantul', NULL, NULL, -7.8577796, 110.2712049, NULL, 0, 0, 0, 104, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(325, 1, '9604e90b-f65e-410c-8170-815e40db2cf4', NULL, 'Tanah Longsor', '2025-03-28', 'Daerah Istimewa Yogyakarta', 'Kabupaten Bantul', NULL, NULL, -7.8504357, 110.2620036, NULL, 0, 0, 0, 104, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(326, 1, '906055be-f282-4265-b097-b5dd61e0952e', NULL, 'Tanah Longsor', '2025-03-22', 'Jawa Tengah', 'Kabupaten Jepara', NULL, NULL, -6.4909862, 110.6681378, NULL, 0, 0, 0, 0, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(327, 1, '506e34df-a5e7-42a8-be1e-ba5a7cee27a7', NULL, 'Tanah Longsor', '2025-03-22', 'Nusa Tenggara Timur', 'Kabupaten Timor Tengah Selatan', NULL, NULL, -9.7417349, 124.3728427, NULL, 0, 0, 0, 708, 160, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(328, 1, 'a9fa18eb-78c6-43ed-bffe-f2015e9df90d', NULL, 'Tanah Longsor', '2025-03-21', 'Sulawesi Utara', 'Kota Manado', NULL, NULL, 1.5061072, 124.8417392, NULL, 2, 0, 0, 1326, 36, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(329, 1, '6070ad76-bac1-48ea-81fe-43ef64270917', NULL, 'Tanah Longsor', '2025-03-21', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6235195, 106.7160739, NULL, 0, 0, 0, 385, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(330, 1, '7f28fbbe-9588-41a3-9cf9-5f90cacb5071', NULL, 'Tanah Longsor', '2025-03-21', 'Sulawesi Utara', 'Kabupaten Minahasa Selatan', NULL, NULL, 1.1417937, 124.4515293, NULL, 0, 0, 0, 305, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(331, 1, 'c31aee46-49d1-48d0-95f5-e1c0c2fb1650', NULL, 'Tanah Longsor', '2025-03-18', 'Jawa Tengah', 'Kabupaten Tegal', NULL, NULL, -6.8741492, 109.2164105, NULL, 0, 0, 0, 0, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(332, 1, 'e7804c62-5801-4e99-8d1f-681fccf12b30', NULL, 'Tanah Longsor', '2025-03-15', 'Jawa Timur', 'Kabupaten Madiun', NULL, NULL, -7.6689377, 111.5749752, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(333, 1, 'db5c3c49-0eec-4b2a-bbb7-400b70e74e8a', NULL, 'Tanah Longsor', '2025-03-15', 'Jawa Barat', 'Kabupaten Bandung', NULL, NULL, -6.8362382, 107.5941064, NULL, 0, 0, 0, 208, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(334, 1, 'ec99012f-11f6-4611-a722-4e513d00c6a8', NULL, 'Tanah Longsor', '2025-03-15', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.9230858, 107.4209816, NULL, 0, 0, 0, 26, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(335, 1, '0621fa26-6903-48e4-b139-7428bc304eb5', NULL, 'Tanah Longsor', '2025-03-15', 'Nusa Tenggara Timur', 'Kabupaten Ngada', NULL, NULL, -8.7430424, 120.9876321, NULL, 0, 0, 0, 87, 16, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(336, 1, '04d2e0f3-e57e-45d1-8826-b29d813b40c8', NULL, 'Tanah Longsor', '2025-03-14', 'Jawa Barat', 'Kabupaten Subang', NULL, NULL, -6.6379396, 107.8011018, NULL, 0, 0, 0, 0, 17, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(337, 1, 'bd2d7931-377a-416d-b840-ea0f0afafd54', NULL, 'Tanah Longsor', '2025-03-12', 'Nusa Tenggara Timur', 'Kabupaten Timor Tengah Selatan', NULL, NULL, -9.8628038, 124.4366949, NULL, 0, 0, 0, 47, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(338, 1, '8aaba6f6-991c-455d-9987-b2b1ec0895eb', NULL, 'Tanah Longsor', '2025-03-12', 'Nusa Tenggara Timur', 'Kabupaten Lembata', NULL, NULL, -8.4719075, 123.4831906, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(339, 1, 'f3707b04-56c8-4dc6-b0ed-8c9e3dda0ede', NULL, 'Tanah Longsor', '2025-03-11', 'Jawa Tengah', 'Kabupaten Brebes', NULL, NULL, -6.9658969, 109.0607622, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(340, 1, '5a9e290c-fb59-4bd6-80d6-99783d326fb9', NULL, 'Tanah Longsor', '2025-03-09', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8708245, 107.3485504, NULL, 0, 0, 0, 84, 30, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(341, 1, 'ed32b011-dacd-4af4-ba9f-6c1b08e96d69', NULL, 'Tanah Longsor', '2025-03-08', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5252323, 106.7982817, NULL, 0, 0, 0, 114, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(342, 1, '60cd662c-a11e-4833-adb3-8178b5696233', NULL, 'Tanah Longsor', '2025-03-08', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5201297, 106.7878429, NULL, 0, 0, 0, 8, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(343, 1, 'b1d81a67-c919-4137-87d4-ab7fddf99fe0', NULL, 'Tanah Longsor', '2025-03-08', 'Maluku', 'Kabupaten Buru', NULL, NULL, -3.3927754, 126.7819505, NULL, 7, 0, 6, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(344, 1, '9e369c46-a723-4af0-82e9-4fbf92c87195', NULL, 'Tanah Longsor', '2025-03-07', 'Sulawesi Selatan', 'Kabupaten Luwu Utara', NULL, NULL, -2.2771775, 119.8902789, NULL, 0, 0, 0, 620, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(345, 1, '86d4e9f9-ca25-4e6f-8a52-5b8344201490', NULL, 'Tanah Longsor', '2025-03-06', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9733020, 106.9131442, NULL, 4, 3, 6, 5640, 1976, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(346, 1, '8448bbd3-4ff3-48ac-972e-246f4e516943', NULL, 'Tanah Longsor', '2025-03-04', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6215218, 106.8079501, NULL, 0, 0, 0, 226, 55, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(347, 1, 'cf97ad11-6a1c-45eb-92c6-2f40ad54e63b', NULL, 'Tanah Longsor', '2025-03-04', 'Jawa Barat', 'Kabupaten Purwakarta', NULL, NULL, -6.4727011, 107.4226427, NULL, 0, 0, 0, 41, 9, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(348, 1, '58d2f21c-b376-4cf4-a8e5-6cfa1cb1a38a', NULL, 'Tanah Longsor', '2025-03-03', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5398958, 106.7625971, NULL, 0, 0, 1, 8, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(349, 1, '0a4b358d-13a2-4efa-9853-604b0cc3f5e8', NULL, 'Tanah Longsor', '2025-03-03', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5665439, 106.7887071, NULL, 0, 0, 0, 510, 106, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(350, 1, '57e47f05-9dc8-447a-9bbe-be8947465a9f', NULL, 'Tanah Longsor', '2025-03-03', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6521927, 106.7304459, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(351, 1, '69dc183a-7d14-49d2-b89a-00dce6fba4a9', NULL, 'Tanah Longsor', '2025-03-03', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6752472, 106.7817802, NULL, 0, 0, 1, 30, 3, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(352, 1, 'b033e2e2-0cd8-44c9-8c10-6c9fbfbc2440', NULL, 'Tanah Longsor', '2025-03-03', 'Jawa Barat', 'Kabupaten Purwakarta', NULL, NULL, -6.6107288, 107.4831008, NULL, 0, 0, 0, 14, 34, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(353, 1, '8107a7d1-3192-493f-97b7-76d751def4ba', NULL, 'Tanah Longsor', '2025-03-02', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5839130, 106.7169298, NULL, 0, 0, 0, 43, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(354, 1, '6797b9ae-ac08-41d7-9292-9d4eac57047e', NULL, 'Tanah Longsor', '2025-03-02', 'Banten', 'Kota Tangerang Selatan', NULL, NULL, -6.2733477, 106.7304673, NULL, 0, 0, 0, 40, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(355, 1, '6b13bf8d-c8ac-413d-8721-4ccab6d8418f', NULL, 'Tanah Longsor', '2025-03-02', 'Nusa Tenggara Timur', 'Kabupaten Kupang', NULL, NULL, -10.2006325, 123.5259698, NULL, 0, 0, 0, 151, 36, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(356, 1, 'af866478-5ba9-494a-9f41-bfea27a5495d', NULL, 'Tanah Longsor', '2025-03-02', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5880722, 106.7109971, NULL, 0, 0, 0, 26, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(357, 1, 'e3ce74c2-441a-4e12-a568-3ae7082ed87a', NULL, 'Tanah Longsor', '2025-03-02', 'Jawa Barat', 'Kota Bogor', NULL, NULL, -6.5939701, 106.8079548, NULL, 0, 0, 0, 24, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(358, 1, 'b55d7295-04d2-4806-b700-fe80647b9daf', NULL, 'Tanah Longsor', '2025-03-02', 'Jawa Barat', 'Kota Bogor', NULL, NULL, -6.5957362, 106.8032077, NULL, 1, 0, 0, 152, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(359, 1, '103ac1df-3769-4c86-858c-f6a204b6faf3', NULL, 'Tanah Longsor', '2025-02-24', 'Jawa Barat', 'Kabupaten Garut', NULL, NULL, -7.1561807, 107.8777392, NULL, 1, 0, 1, 7, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(360, 1, '186cf0dc-4de0-40bb-94ef-8346e8faed3c', NULL, 'Tanah Longsor', '2025-02-24', 'Jawa Timur', 'Kabupaten Pacitan', NULL, NULL, -8.1998818, 111.0322695, NULL, 0, 0, 0, 25, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(361, 1, '4a4ca164-eea7-4910-a70c-30083456af5a', NULL, 'Tanah Longsor', '2025-02-24', 'Lampung', 'Kota Bandar Lampung', NULL, NULL, -5.4577192, 105.2707800, NULL, 0, 0, 0, 0, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(362, 1, '4e617237-fd83-470b-8e54-49eef991b934', NULL, 'Tanah Longsor', '2025-02-23', 'Jawa Tengah', 'Kabupaten Boyolali', NULL, NULL, -7.5238190, 110.5959010, NULL, 0, 0, 1, 1, 12, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(363, 1, 'cb9b91cd-16d0-47e2-a7ed-17e35c476d8a', NULL, 'Tanah Longsor', '2025-02-23', 'Kalimantan Timur', 'Kabupaten Kutai Kartanegara', NULL, NULL, -0.0738550, 116.6585406, NULL, 1, 1, 0, 5, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(364, 1, 'a7d0643d-2b7d-497e-915a-cb8e48593437', NULL, 'Tanah Longsor', '2025-02-23', 'Kalimantan Timur', 'Kabupaten Kutai Kartanegara', NULL, NULL, -0.0876193, 116.6810361, NULL, 1, 1, 0, 5, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(365, 1, 'c81ebc2a-ecc6-4163-a2c4-e39025c4f46a', NULL, 'Tanah Longsor', '2025-02-22', 'Sumatera Utara', 'Kabupaten Tapanuli Selatan', NULL, NULL, 1.5872552, 99.3336712, NULL, 2, 0, 0, 6, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(366, 1, '08672562-5d78-4346-af49-c77c7ec643b6', NULL, 'Tanah Longsor', '2025-02-22', 'Sumatera Utara', 'Kabupaten Tapanuli Selatan', NULL, NULL, 1.5151608, 99.2395725, NULL, 2, 0, 0, 6, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(367, 1, '114c6ad0-ec95-48c9-9620-eca1d4e3e6f7', NULL, 'Tanah Longsor', '2025-02-22', 'Nusa Tenggara Barat', 'Kabupaten Dompu', NULL, NULL, -8.4285605, 118.4194188, NULL, 0, 0, 0, 24, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(368, 1, '3ba0c850-18e0-4397-85b9-25b39ee4b76a', NULL, 'Tanah Longsor', '2025-02-22', 'Nusa Tenggara Barat', 'Kabupaten Dompu', NULL, NULL, -8.5756407, 118.5056349, NULL, 0, 0, 0, 24, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(369, 1, '66e75a43-0df3-4ef6-a230-6328527938a9', NULL, 'Tanah Longsor', '2025-02-21', 'Lampung', 'Kota Bandar Lampung', NULL, NULL, -5.4671735, 105.2588108, NULL, 2, 0, 0, 4, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(370, 1, 'b2988b77-edf9-4bf2-beba-4d95c7de9817', NULL, 'Tanah Longsor', '2025-02-19', 'Sumatera Utara', 'Kabupaten Humbang Hasundutan', NULL, NULL, 2.2131344, 98.6544042, NULL, 0, 0, 0, 120, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(371, 1, 'c8866346-efa6-40b4-bc20-9f3d883008f4', NULL, 'Tanah Longsor', '2025-02-19', 'Sumatera Utara', 'Kabupaten Humbang Hasundutan', NULL, NULL, 2.2292697, 98.5796807, NULL, 0, 0, 0, 120, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(372, 1, '705ae89d-d01a-405a-af5f-f69409cc3740', NULL, 'Tanah Longsor', '2025-02-19', 'Jawa Tengah', 'Kabupaten Cilacap', NULL, NULL, -7.7484327, 109.0284848, NULL, 0, 0, 0, 0, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(373, 1, 'fce19784-f3fd-4620-b8c2-6e1be607d749', NULL, 'Tanah Longsor', '2025-02-18', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.9258731, 107.4036400, NULL, 0, 0, 0, 33, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(374, 1, 'cdc63369-b3e4-4e22-8cec-5c431641d542', NULL, 'Tanah Longsor', '2025-02-16', 'Jawa Timur', 'Kabupaten Pacitan', NULL, NULL, -8.1954789, 111.0162813, NULL, 1, 0, 1, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(375, 1, '79dbc7b1-5850-4c9d-bbc9-d568b5679e25', NULL, 'Tanah Longsor', '2025-02-16', 'Jawa Timur', 'Kabupaten Blitar', NULL, NULL, -8.0934274, 112.0933071, NULL, 2, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(376, 1, '9124b944-c113-4391-a43d-067ebde0088e', NULL, 'Tanah Longsor', '2025-02-15', 'Banten', 'Kabupaten Pandeglang', NULL, NULL, -6.3749580, 106.1686103, NULL, 1, 0, 1, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(377, 1, '65d4fa58-31b0-481f-b3c2-673f14b4734b', NULL, 'Gerakan Tanah', '2025-02-11', 'Nusa Tenggara Barat', 'Kabupaten Sumbawa', NULL, NULL, -8.6146345, 117.3211132, NULL, 0, 0, 0, 99, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(378, 1, '063ba650-b7e1-4c60-b0b9-d0b1f7f0df83', NULL, 'Tanah Longsor', '2025-02-11', 'Nusa Tenggara Barat', 'Kabupaten Sumbawa', NULL, NULL, -8.6964788, 117.3587789, NULL, 0, 0, 0, 99, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(379, 1, 'b7b03a26-c19d-41fd-8d11-08c2edda34a3', NULL, 'Tanah Longsor', '2025-02-10', 'Sulawesi Selatan', 'Kabupaten Soppeng', NULL, NULL, -4.3518541, 119.9277947, NULL, 0, 0, 0, 40, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(380, 1, 'f8e82caa-2e0a-4be8-b881-96494c4dec80', NULL, 'Tanah Longsor', '2025-02-10', 'Nusa Tenggara Timur', 'Kabupaten Kupang', NULL, NULL, -10.1720606, 123.6658272, NULL, 0, 0, 0, 212, 53, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(381, 1, '71102ca6-10bd-4fe2-9028-e1ebdb0f51b5', NULL, 'Tanah Longsor', '2025-02-09', 'Aceh', 'Kabupaten Aceh Selatan', NULL, NULL, 3.3115056, 97.3516558, NULL, 0, 0, 0, 19, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(382, 1, '3be366ed-62d1-46c3-a30b-19cef84de00d', NULL, 'Tanah Longsor', '2025-02-08', 'Nusa Tenggara Timur', 'Kabupaten Kupang', NULL, NULL, -10.2572966, 123.5596515, NULL, 0, 0, 0, 257, 34, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(383, 1, '38d92989-32af-400a-b349-9369226ba0d5', NULL, 'Tanah Longsor', '2025-02-06', 'Sulawesi Tenggara', 'Kabupaten Kolaka', NULL, NULL, -4.0496650, 121.5938030, NULL, 0, 0, 0, 22, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(384, 1, '7befd7ec-c8fc-4fba-b023-5bbfe6110019', NULL, 'Tanah Longsor', '2025-02-03', 'Jawa Barat', 'Kabupaten Subang', NULL, NULL, -6.5345252, 107.6778046, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(385, 1, 'ba36e1fb-f6d4-47b7-b579-d80940bb52f0', NULL, 'Tanah Longsor', '2025-02-01', 'Jawa Barat', 'Kabupaten Tasikmalaya', NULL, NULL, -7.3062609, 108.2955685, NULL, 0, 0, 0, 165, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(386, 1, '7b01b636-f1cc-4506-bb96-0fb26dac4070', NULL, 'Tanah Longsor', '2025-02-01', 'Sulawesi Tengah', 'Kabupaten Buol', NULL, NULL, 1.0133680, 121.3671707, NULL, 0, 0, 0, 18, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(387, 1, '33307fd8-0452-41bb-9609-fdedc6139daa', NULL, 'Tanah Longsor', '2025-02-01', 'Sulawesi Tengah', 'Kabupaten Buol', NULL, NULL, 0.9895045, 121.3326331, NULL, 0, 0, 0, 210, 32, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(388, 1, '58f4b5b1-d517-485e-9b84-d7e3cbe49e77', NULL, 'Tanah Longsor', '2025-02-01', 'Kalimantan Timur', 'Kabupaten Kutai Kartanegara', NULL, NULL, -0.1257082, 116.5258513, NULL, 0, 0, 0, 28, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(389, 1, '07331240-65bd-4929-8811-50a910cb6192', NULL, 'Tanah Longsor', '2025-02-01', 'Kalimantan Timur', 'Kabupaten Kutai Kartanegara', NULL, NULL, -0.2042863, 116.5552804, NULL, 0, 0, 0, 28, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(390, 1, 'aa572be2-f66b-4864-bcc4-a763bf968df9', NULL, 'Tanah Longsor', '2025-01-31', 'Jawa Barat', 'Kabupaten Purwakarta', NULL, NULL, -6.4859601, 107.4744842, NULL, 1, 0, 2, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(391, 1, '8eedba17-d643-46b3-960a-1bc7ba2cf9d1', NULL, 'Tanah Longsor', '2025-01-31', 'Jawa Barat', 'Kabupaten Tasikmalaya', NULL, NULL, -7.3391855, 108.2771996, NULL, 0, 0, 0, 510, 90, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(392, 1, 'e4b85325-e217-421f-bc5e-7870458056f2', NULL, 'Tanah Longsor', '2025-01-30', 'Kalimantan Timur', 'Kota Samarinda', NULL, NULL, -0.5122264, 117.1521884, NULL, 0, 0, 0, 20, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(393, 1, '273f2b3b-e53e-4df5-b6ce-a932dda9ee53', NULL, 'Tanah Longsor', '2025-01-30', 'Kalimantan Timur', 'Kota Samarinda', NULL, NULL, -0.5206943, 117.1495645, NULL, 0, 0, 0, 20, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(394, 1, 'c092a75b-aed9-4a85-a719-5cd13420179e', NULL, 'Tanah Longsor', '2025-01-29', 'Kalimantan Timur', 'Kota Samarinda', NULL, NULL, -0.4945290, 117.1437436, NULL, 0, 0, 0, 11217, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(395, 1, 'db4fb09f-06d2-4975-935a-ed952bc1114d', NULL, 'Tanah Longsor', '2025-01-29', 'Kalimantan Timur', 'Kota Samarinda', NULL, NULL, -0.4976223, 117.1692067, NULL, 0, 0, 0, 11217, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(396, 1, '8a40f37f-898a-4ab7-a773-31f2ee7e5f14', NULL, 'Tanah Longsor', '2025-01-29', 'Sulawesi Utara', 'Kabupaten Minahasa Selatan', NULL, NULL, 1.1167759, 124.4915149, NULL, 2, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(397, 1, '7200edfa-50a7-499a-82d5-1d3957910fa7', NULL, 'Tanah Longsor', '2025-01-29', 'Jawa Tengah', 'Kabupaten Jepara', NULL, NULL, -6.5534530, 110.6410335, NULL, 1, 0, 2, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(398, 1, '74642fca-1914-4fc6-b71b-ce6ce2cbd81f', NULL, 'Tanah Longsor', '2025-01-29', 'Kalimantan Utara', 'Kota Tarakan', NULL, NULL, 3.3092267, 117.6506401, NULL, 1, 0, 0, 159, 31, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(399, 1, 'c6391312-e88c-4994-8f86-15fcd5a198bc', NULL, 'Tanah Longsor', '2025-01-27', 'Bali', 'Kabupaten Buleleng', NULL, NULL, -8.1814815, 115.1509374, NULL, 0, 0, 0, 0, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(400, 1, '2d13f313-83f5-45c7-8078-a87b968cee53', NULL, 'Tanah Longsor', '2025-01-27', 'Bali', 'Kabupaten Buleleng', NULL, NULL, -8.0608383, 115.0601580, NULL, 0, 0, 0, 0, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(401, 1, 'd1c2f638-96a0-45e8-b82b-795631638b6d', NULL, 'Tanah Longsor', '2025-01-26', 'Jawa Barat', 'Kabupaten Tasikmalaya', NULL, NULL, -7.3636989, 108.2462289, NULL, 1, 0, 0, 5, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(402, 1, 'b76bddc8-3eae-47f4-aaa5-6d40cc0c85bc', NULL, 'Tanah Longsor', '2025-01-26', 'Sulawesi Barat', 'Kabupaten Mamuju', NULL, NULL, -2.7293364, 118.9295737, NULL, 4, 2, 9, 75, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(403, 1, '8debb9ab-77c0-4cc5-a14f-28efa905622b', NULL, 'Tanah Longsor', '2025-01-26', 'Kalimantan Timur', 'Kota Samarinda', NULL, NULL, -0.5011932, 117.1597920, NULL, 0, 0, 0, 20, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11');
INSERT INTO `disaster_events` (`id`, `data_source_id`, `external_id`, `created_by`, `title`, `event_date`, `province`, `regency`, `district`, `village`, `latitude`, `longitude`, `description`, `deaths`, `missing`, `injured`, `displaced`, `houses_damaged`, `source_note`, `verification_status`, `created_at`, `updated_at`) VALUES
(404, 1, '07f3de09-e5de-4998-8ebf-342ad0cde65c', NULL, 'Tanah Longsor', '2025-01-26', 'Kalimantan Timur', 'Kota Samarinda', NULL, NULL, -0.5172620, 117.1496433, NULL, 0, 0, 0, 20, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(405, 1, '21cd90c4-2a27-4e2b-bade-1ae1a3181222', NULL, 'Tanah Longsor', '2025-01-25', 'Sulawesi Selatan', 'Kabupaten Luwu', NULL, NULL, -3.3234548, 120.1815735, NULL, 2, 0, 4, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(406, 1, '6e3c7271-2eb7-45c7-9e00-57a6b412a492', NULL, 'Tanah Longsor', '2025-01-25', 'Sumatera Selatan', 'Kota Prabumulih', NULL, NULL, -3.4352259, 104.2421591, NULL, 0, 0, 0, 0, 14, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(407, 1, '0d40796a-81b7-464b-8bc3-9d5891890b5c', NULL, 'Tanah Longsor', '2025-01-24', 'Sumatera Selatan', 'Kota Prabumulih', NULL, NULL, -3.4270049, 104.2406508, NULL, 0, 0, 0, 70, 12, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(408, 1, 'b0599688-9d75-47aa-9a55-85f884e5f0f3', NULL, 'Tanah Longsor', '2025-01-23', 'Sulawesi Tengah', 'Kabupaten Poso', NULL, NULL, -1.4375004, 120.7525259, NULL, 0, 0, 0, 54, 3, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(409, 1, 'ffd61c3d-00af-4a69-95d6-eee606494092', NULL, 'Tanah Longsor', '2025-01-23', 'Sulawesi Tengah', 'Kabupaten Poso', NULL, NULL, -1.4702976, 120.7232692, NULL, 0, 0, 0, 54, 13, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(410, 1, '89b04306-705e-4781-9678-534a4d6e9073', NULL, 'Tanah Longsor', '2025-01-23', 'Jawa Timur', 'Kabupaten Jombang', NULL, NULL, -7.4800399, 112.2656947, NULL, 2, 0, 2, 30, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(411, 1, '75920015-869b-4d15-871e-114c562f7d56', NULL, 'Tanah Longsor', '2025-01-23', 'Sulawesi Selatan', 'Kabupaten Toraja Utara', NULL, NULL, -2.8297977, 119.8570863, NULL, 2, 0, 2, 25, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(412, 1, '8d5be926-fd8b-4e7e-84a2-dd9c1b0e3734', NULL, 'Tanah Longsor', '2025-01-22', 'Sumatera Selatan', 'Kabupaten Ogan Komering Ulu Timur', NULL, NULL, -3.8567934, 104.7520939, NULL, 2, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(413, 1, '7ccc75d7-4aa0-407f-b570-46b097031c73', NULL, 'Tanah Longsor', '2025-01-21', 'Jawa Tengah', 'Kabupaten Purbalingga', NULL, NULL, -7.4171726, 109.4386807, NULL, 0, 0, 0, 0, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(414, 1, '92ccc5a3-49b1-4190-87ab-18dff33b9dbc', NULL, 'Tanah Longsor', '2025-01-20', 'Jawa Tengah', 'Kabupaten Kendal', NULL, NULL, -6.9404457, 110.2088686, NULL, 1, 0, 4, 25, 16, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(415, 1, '099d8fa8-1851-44be-89ef-1326ab824671', NULL, 'Tanah Longsor', '2025-01-20', 'Jawa Tengah', 'Kabupaten Pekalongan', NULL, NULL, -6.8828870, 109.6699980, NULL, 25, 1, 14, 48, 78, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(416, 1, '8abca465-a577-4bfb-af04-4641abf1671c', NULL, 'Tanah Longsor', '2025-01-20', 'Jawa Tengah', 'Kabupaten Batang', NULL, NULL, -6.8694854, 109.7293578, NULL, 0, 0, 0, 120, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(417, 1, '6889a1d9-5f3d-41f0-9d3a-415c6f1d3719', NULL, 'Tanah Longsor', '2025-01-20', 'Jawa Tengah', 'Kabupaten Banjarnegara', NULL, NULL, -7.3438586, 109.6828341, NULL, 0, 0, 0, 138, 25, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(418, 1, 'd69cde11-46b0-4e88-b50c-d192be0b31e7', NULL, 'Tanah Longsor', '2025-01-20', 'Bali', 'Kota Denpasar', NULL, NULL, -8.6718341, 115.2233142, NULL, 5, 0, 3, 0, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(419, 1, 'a509d26f-96a1-4d3c-90f7-02eb30a20e45', NULL, 'Tanah Longsor', '2025-01-20', 'Bali', 'Kota Denpasar', NULL, NULL, -8.6606087, 115.2342628, NULL, 5, 0, 3, 0, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(420, 1, '8a93ca19-f2b0-471f-aabd-f356405310fa', NULL, 'Tanah Longsor', '2025-01-20', 'Sulawesi Tenggara', 'Kabupaten Kolaka Utara', NULL, NULL, -3.1969187, 121.1770394, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(421, 1, '28cce9d7-4933-4f74-ac3b-18bb6f61348b', NULL, 'Tanah Longsor', '2025-01-19', 'Bali', 'Kabupaten Klungkung', NULL, NULL, -8.5013655, 115.3695367, NULL, 4, 0, 4, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(422, 1, '6d7c4438-8004-4cc7-86b7-4c8f4df7738c', NULL, 'Tanah Longsor', '2025-01-19', 'Bali', 'Kabupaten Klungkung', NULL, NULL, -8.5977498, 115.3750102, NULL, 4, 0, 4, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(423, 1, '587d222b-c15a-42eb-85fd-bb682d9492d7', NULL, 'Tanah Longsor', '2025-01-19', 'Nusa Tenggara Timur', 'Kota Kupang', NULL, NULL, -10.1936192, 123.5824319, NULL, 1, 0, 0, 4, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(424, 1, '0df506c9-b156-4970-a167-efc49a6c7c63', NULL, 'Tanah Longsor', '2025-01-18', 'Jawa Barat', 'Kabupaten Kuningan', NULL, NULL, -6.9386615, 108.5554769, NULL, 0, 0, 0, 157, 3, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(425, 1, '72ad6e50-cef6-432d-853e-718939048734', NULL, 'Tanah Longsor', '2025-01-15', 'Bali', 'Kabupaten Bangli', NULL, NULL, -8.4621353, 115.4225707, NULL, 0, 0, 0, 0, 9, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(426, 1, 'faa99dab-3b10-4269-980b-cf0fb4d87795', NULL, 'Tanah Longsor', '2025-01-15', 'Bali', 'Kabupaten Bangli', NULL, NULL, -8.5268643, 115.3804964, NULL, 0, 0, 0, 0, 9, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(427, 1, 'ec59365c-72d7-4add-8d02-eaeecd3003ae', NULL, 'Tanah Longsor', '2025-01-15', 'Kepulauan Riau', 'Kota Batam', NULL, NULL, 1.0290891, 104.0223335, NULL, 0, 0, 0, 105, 21, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(428, 1, 'e062f804-60bd-4df2-84e5-bbf18f77a215', NULL, 'Tanah Longsor', '2025-01-14', 'Kepulauan Riau', 'Kota Batam', NULL, NULL, 1.0608947, 104.0340445, NULL, 0, 0, 0, 70, 14, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(429, 1, '10e8bfde-6a89-4103-8ca7-339989ff4595', NULL, 'Tanah Longsor', '2025-01-13', 'Kepulauan Riau', 'Kota Batam', NULL, NULL, 1.0419438, 104.0219057, NULL, 4, 0, 5, 303, 59, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(430, 1, 'fa661f55-36d2-4928-bd2b-51b01b1c4b95', NULL, 'Tanah Longsor', '2025-01-11', 'Lampung', 'Kabupaten Lampung Barat', NULL, NULL, -5.1490396, 104.1930918, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(431, 1, '76e7df52-f734-4fe3-aa9e-02f99332e154', NULL, 'Tanah Longsor', '2025-01-09', 'Aceh', 'Kabupaten Bener Meriah', NULL, NULL, 4.7748348, 97.0068393, NULL, 2, 0, 5, 0, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(432, 1, '635ed733-1498-4ace-aa2e-84c4bfa2e1a4', NULL, 'Tanah Longsor', '2025-01-08', 'Daerah Istimewa Yogyakarta', 'Kabupaten Kulon Progo', NULL, NULL, -7.7632782, 110.1116210, NULL, 0, 0, 0, 76, 17, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(433, 1, '1844e09c-6c5e-4d56-a00a-4036caf76409', NULL, 'Tanah Longsor', '2025-01-08', 'Daerah Istimewa Yogyakarta', 'Kabupaten Kulon Progo', NULL, NULL, -7.7731805, 110.1550669, NULL, 0, 0, 0, 76, 17, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(434, 1, 'c612dff0-a87b-4e6c-a128-261915502cfe', NULL, 'Tanah Longsor', '2025-01-07', 'Daerah Istimewa Yogyakarta', 'Kabupaten Kulon Progo', NULL, NULL, -7.7904243, 110.0833008, NULL, 0, 0, 0, 40, 17, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(435, 1, 'ec7847bf-9731-4a96-a2ca-6c351ac9e3af', NULL, 'Tanah Longsor', '2025-01-07', 'Daerah Istimewa Yogyakarta', 'Kabupaten Kulon Progo', NULL, NULL, -7.7732213, 110.2080111, NULL, 0, 0, 0, 40, 17, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(436, 1, 'ccce26d4-d6fd-4156-88cb-3f9ae091511d', NULL, 'Tanah Longsor', '2025-01-07', 'Sulawesi Tenggara', 'Kota Kendari', NULL, NULL, -3.9664344, 122.5263448, NULL, 0, 0, 0, 25, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(437, 1, 'a51949ea-ba35-4d76-a938-06d851ddb675', NULL, 'Tanah Longsor', '2025-01-04', 'Nusa Tenggara Timur', 'Kabupaten Ende', NULL, NULL, -8.8835616, 121.6873186, NULL, 0, 0, 0, 37, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(438, 1, 'd0e60b3b-7ea4-45dc-b8ba-504582227c57', NULL, 'Tanah Longsor', '2025-01-02', 'Sulawesi Selatan', 'Kabupaten Pinrang', NULL, NULL, -3.7337130, 119.6759736, NULL, 0, 0, 0, 158, 4, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(439, 1, '3d91bc3e-4f11-4fd1-9dab-5150980747d8', NULL, 'Tanah Longsor', '2025-01-02', 'Jawa Timur', 'Kabupaten Trenggalek', NULL, NULL, -8.0735416, 111.7706333, NULL, 0, 0, 0, 25, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(440, 1, '02dedacd-5b8b-4c9b-9c05-4e8cd9f21f39', NULL, 'Tanah Longsor', '2025-01-01', 'Jawa Tengah', 'Kabupaten Purworejo', NULL, NULL, -7.7568862, 110.0779253, NULL, 2, 0, 0, 4, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(441, 1, 'd5d5db3f-9487-45af-b5d1-e79d047ef863', NULL, 'Tanah Longsor', '2025-01-01', 'Daerah Istimewa Yogyakarta', 'Kabupaten Kulon Progo', NULL, NULL, -7.9108375, 110.1478444, NULL, 0, 0, 0, 49, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(442, 1, '6ea492f1-ba57-4f6a-b3e5-d702d52fc1f4', NULL, 'Tanah Longsor', '2025-01-01', 'Daerah Istimewa Yogyakarta', 'Kabupaten Kulon Progo', NULL, NULL, -7.7847023, 110.2173489, NULL, 0, 0, 0, 49, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(443, 1, '32197285-c8e0-48c5-a8d0-e65976b9b80a', NULL, 'Tanah Longsor', '2025-01-01', 'Jawa Tengah', 'Kabupaten Purworejo', NULL, NULL, -7.6794586, 110.0153909, NULL, 0, 0, 0, 4, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(444, 1, '5d1fe576-1454-4a94-a0f3-b73bee2d3a71', NULL, 'Tanah Longsor', '2024-12-29', 'Sumatera Utara', 'Kota Padangsidimpuan', NULL, NULL, 1.3792917, 99.2556337, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(445, 1, '3e3bac4b-4e63-4dd8-b44f-1e6f2ca88e11', NULL, 'Tanah Longsor', '2024-12-25', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.2928037, 108.3995865, NULL, 0, 0, 0, 52, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(446, 1, '7d0276b6-cf40-4aeb-8715-77aa38ce1a81', NULL, 'Tanah Longsor', '2024-12-25', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9721464, 106.9036840, NULL, 1, 0, 1, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(447, 1, '9c46cbab-aa7c-48df-8b49-4fb6db228750', NULL, 'Tanah Longsor', '2024-12-25', 'Kalimantan Utara', 'Kota Tarakan', NULL, NULL, 3.2860607, 117.6396513, NULL, 3, 0, 0, 50, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(448, 1, 'd2e5ac65-65a5-4c80-a37b-ef9a3be401dd', NULL, 'Tanah Longsor', '2024-12-24', 'Jawa Timur', 'Kabupaten Malang', NULL, NULL, -8.0211670, 112.7072629, NULL, 0, 0, 0, 0, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(449, 1, '834edbc3-a510-4b64-b27c-5f5429aea0e7', NULL, 'Tanah Longsor', '2024-12-24', 'Jawa Timur', 'Kabupaten Malang', NULL, NULL, -8.1285414, 112.7131753, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(450, 1, '08e291c0-12c6-4259-8f1b-8f8701f1ab2a', NULL, 'Tanah Longsor', '2024-12-24', 'Aceh', 'Kabupaten Aceh Barat Daya', NULL, NULL, 3.0512643, 97.3368031, NULL, 0, 0, 1, 29, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(451, 1, 'bebb8af4-7e61-4ef7-b128-243a1d550be6', NULL, 'Tanah Longsor', '2024-12-22', 'Jawa Timur', 'Kabupaten Nganjuk', NULL, NULL, -7.6029320, 111.9018080, NULL, 0, 0, 0, 750, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(452, 1, '7d03b1f8-1ac5-45d6-aa0e-2a811c41351f', NULL, 'Tanah Longsor', '2024-12-21', 'Sulawesi Selatan', 'Kabupaten Pinrang', NULL, NULL, -3.8337259, 119.6275015, NULL, 0, 0, 0, 218, 13, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(453, 1, '4ea96622-c551-409e-8de1-31dd9c59eb15', NULL, 'Tanah Longsor', '2024-12-21', 'Sulawesi Selatan', 'Kabupaten Gowa', NULL, NULL, -5.3102888, 119.7426040, NULL, 0, 0, 0, 115, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(454, 1, '1c841287-aa65-4a0c-af35-02be241c78e5', NULL, 'Tanah Longsor', '2024-12-21', 'Sulawesi Selatan', 'Kabupaten Barru', NULL, NULL, -4.4172651, 119.6730939, NULL, 0, 0, 0, 1279, 17, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(455, 1, 'c6febd3d-ec36-4bb7-b315-07414354e6f4', NULL, 'Tanah Longsor', '2024-12-21', 'Sulawesi Barat', 'Kabupaten Mamasa', NULL, NULL, -2.9419248, 119.4225040, NULL, 0, 0, 0, 250, 30, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(456, 1, '48af33ff-c85c-4301-8ef7-cc5888f452eb', NULL, 'Tanah Longsor', '2024-12-19', 'Sumatera Utara', 'Kota Padangsidimpuan', NULL, NULL, 1.3746742, 99.2930345, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(457, 1, '92b04b38-4237-4109-a6d4-a7de81fbc6e9', NULL, 'Tanah Longsor', '2024-12-17', 'Jawa Tengah', 'Kabupaten Temanggung', NULL, NULL, -7.3886857, 110.1764727, NULL, 1, 0, 1, 16, 3, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(458, 1, '47c3dde3-925d-4053-b216-9091f92f572f', NULL, 'Tanah Longsor', '2024-12-17', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6399679, 106.8615069, NULL, 0, 0, 0, 67, 29, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(459, 1, '55621330-07ed-4c90-ae3c-6244d54da746', NULL, 'Tanah Longsor', '2024-12-15', 'Maluku Utara', 'Kota Tidore Kepulauan', NULL, NULL, 0.6781157, 127.3925558, NULL, 0, 0, 0, 190, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(460, 1, 'a9d6bb7e-1163-4622-9593-cdfff2351b99', NULL, 'Tanah Longsor', '2024-12-15', 'Maluku Utara', 'Kota Ternate', NULL, NULL, 0.7911667, 127.3631024, NULL, 0, 0, 0, 0, 24, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(461, 1, '40dca81b-5d4e-4028-8768-eb7871fc4b15', NULL, 'Tanah Longsor', '2024-12-14', 'Sulawesi Utara', 'Kota Manado', NULL, NULL, 1.4990223, 124.8601427, NULL, 0, 0, 0, 40, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(462, 1, 'b7fb7bcc-4f1d-4280-955d-e14ee99fa18c', NULL, 'Tanah Longsor', '2024-12-13', 'Jawa Tengah', 'Kabupaten Brebes', NULL, NULL, -6.9439503, 109.0451589, NULL, 0, 0, 0, 435, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(463, 1, 'e5ca8759-f27d-422f-934e-21fa1842d94c', NULL, 'Tanah Longsor', '2024-12-12', 'Jawa Timur', 'Kabupaten Trenggalek', NULL, NULL, -8.0123662, 111.7822068, NULL, 0, 0, 0, 55, 9, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(464, 1, 'b9cd0e4f-de96-4fe3-8a61-7351fab0783e', NULL, 'Tanah Longsor', '2024-12-09', 'Bali', 'Kabupaten Gianyar', NULL, NULL, -8.5441850, 115.3255000, NULL, 2, 0, 0, 0, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(465, 1, '1b2d63d3-cdb0-4e08-896a-9e5407652333', NULL, 'Tanah Longsor', '2024-12-09', 'Banten', 'Kabupaten Pandeglang', NULL, NULL, -6.2590532, 106.0902149, NULL, 0, 0, 0, 40, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(466, 1, 'e35829cb-3e8c-4900-bf57-51d624992530', NULL, 'Tanah Longsor', '2024-12-07', 'Jawa Timur', 'Kabupaten Pacitan', NULL, NULL, -8.1373114, 111.0517322, NULL, 1, 0, 0, 0, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(467, 1, '3c82734f-82ad-4755-a6d3-33eba31b4249', NULL, 'Tanah Longsor', '2024-12-07', 'Daerah Istimewa Yogyakarta', 'Kabupaten Gunung Kidul', NULL, NULL, -8.0616977, 110.6858361, NULL, 0, 0, 0, 0, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(468, 1, '9be9ccbe-0ac6-48f8-b502-5a8d3fc63924', NULL, 'Tanah Longsor', '2024-12-05', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8886677, 107.4838479, NULL, 0, 0, 0, 68, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(469, 1, 'ba23704c-8d9b-4d56-9b63-f50e0f7426e0', NULL, 'Tanah Longsor', '2024-12-04', 'Riau', 'Kabupaten Indragiri Hilir', NULL, NULL, -0.1598481, 103.0340937, NULL, 0, 0, 0, 41, 13, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(470, 1, 'c2078fa9-4ef6-44d2-8b44-b5dbac427ad4', NULL, 'Tanah Longsor', '2024-12-04', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9246751, 106.9656128, NULL, 1, 0, 0, 12, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(471, 1, 'df26c125-9814-4162-9c49-cb9a2edb54d2', NULL, 'Tanah Longsor', '2024-12-04', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9851577, 106.8668189, NULL, 9, 2, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(472, 1, '68dbc376-ad87-4dd1-a1ff-7f9c59189aac', NULL, 'Tanah Longsor', '2024-12-04', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.9143772, 107.4982913, NULL, 0, 0, 0, 18, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(473, 1, '0cff759d-4df1-4d49-8606-a097c9254d88', NULL, 'Tanah Longsor', '2024-12-04', 'Maluku Utara', 'Kabupaten Halmahera Selatan', NULL, NULL, 1.2800913, 128.4331017, NULL, 0, 0, 0, 0, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(474, 1, '8a14cce6-1f01-45b3-8951-cd49c57b52f4', NULL, 'Tanah Longsor', '2024-12-03', 'Jawa Barat', 'Kabupaten Cianjur', NULL, NULL, -6.8373593, 107.0469957, NULL, 2, 0, 5, 18688, 3624, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(475, 1, '52cf6c25-ac49-473b-b3b8-2de38096d64b', NULL, 'Tanah Longsor', '2024-12-02', 'Banten', 'Kabupaten Lebak', NULL, NULL, -6.5562210, 106.2751176, NULL, 2, 0, 1, 1556, 206, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(476, 1, '8ba69c78-d46b-4aec-b1ae-60356c8bda1a', NULL, 'Tanah Longsor', '2024-12-02', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6810937, 106.7790561, NULL, 0, 0, 0, 53, 18, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(477, 1, '5bc370c5-b9e4-4b70-8630-a05c3de90dba', NULL, 'Tanah Longsor', '2024-11-28', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6356004, 106.8453294, NULL, 0, 0, 0, 737, 30, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(478, 1, '93657c56-8c3d-4891-a894-26249c40b036', NULL, 'Tanah Longsor', '2024-11-28', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.8472336, 106.9223039, NULL, 0, 0, 0, 43, 18, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(479, 1, '7aa1ebda-c5c9-4881-89e1-2edfa0363bbf', NULL, 'Tanah Longsor', '2024-11-27', 'Sumatera Utara', 'Kabupaten Karo', NULL, NULL, 3.0663656, 98.2018034, NULL, 0, 0, 0, 44, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(480, 1, '823f569f-337d-4110-9410-eb2f42ffb4ac', NULL, 'Tanah Longsor', '2024-11-27', 'Jawa Barat', 'Kabupaten Purwakarta', NULL, NULL, -6.4881256, 107.5032755, NULL, 0, 0, 0, 252, 50, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(481, 1, '19a9c0da-1d58-41a2-8a31-f2bd28c7e6f7', NULL, 'Tanah Longsor', '2024-11-26', 'Jawa Timur', 'Kabupaten Tulungagung', NULL, NULL, -8.0032960, 111.8533372, NULL, 0, 0, 0, 0, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(482, 1, '4cc3b623-da62-407f-b42e-3aedea3107ee', NULL, 'Tanah Longsor', '2024-11-26', 'Sumatera Utara', 'Kabupaten Deli Serdang', NULL, NULL, 3.3524550, 98.6591363, NULL, 0, 0, 0, 30, 4, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(483, 1, 'e4138d57-3592-4f27-aa35-8f11d62bf1c4', NULL, 'Tanah Longsor', '2024-11-26', 'Sumatera Utara', 'Kabupaten Deli Serdang', NULL, NULL, 3.5009576, 98.6753217, NULL, 10, 0, 24, 7, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(484, 1, 'eae7a79c-2a42-406e-a638-d9824a09abd6', NULL, 'Tanah Longsor', '2024-11-23', 'Sumatera Utara', 'Kabupaten Karo', NULL, NULL, 3.0425164, 98.2851765, NULL, 10, 0, 0, 18, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(485, 1, 'a969e1a0-487f-4ab1-b872-e3b523e785f4', NULL, 'Tanah Longsor', '2024-11-23', 'Sumatera Utara', 'Kabupaten Padang Lawas', NULL, NULL, 1.1186977, 99.8124935, NULL, 4, 0, 1, 23, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(486, 1, 'e1876f2e-02eb-4286-b38f-e29a406debe1', NULL, 'Tanah Longsor', '2024-11-23', 'Jawa Barat', 'Kota Bogor', NULL, NULL, -6.5903055, 106.7879445, NULL, 0, 0, 0, 19, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(487, 1, '1770d60c-f761-4802-8eba-e4da813d45c2', NULL, 'Tanah Longsor', '2024-11-22', 'Jawa Barat', 'Kabupaten Cianjur', NULL, NULL, -6.7912101, 107.0598957, NULL, 0, 0, 0, 60, 18, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(488, 1, '9e554155-04de-449b-bd91-fe88b04bf94c', NULL, 'Tanah Longsor', '2024-11-22', 'Bengkulu', 'Kabupaten Bengkulu Utara', NULL, NULL, -3.4219555, 102.1632718, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(489, 1, '78ed033f-7532-4b3c-a7ff-38e504ea6527', NULL, 'Tanah Longsor', '2024-11-22', 'Jawa Timur', 'Kabupaten Situbondo', NULL, NULL, -7.7025340, 113.9556050, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(490, 1, 'e2ee188c-6a98-4b21-b1fe-becf024473df', NULL, 'Tanah Longsor', '2024-11-21', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8325191, 107.4347009, NULL, 0, 0, 0, 24, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(491, 1, '52922125-3808-4d2a-8735-11da9ab0d582', NULL, 'Tanah Longsor', '2024-11-20', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.9006633, 107.3780507, NULL, 0, 0, 0, 56, 14, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(492, 1, '4c35c19f-1891-404d-9004-cf149b591794', NULL, 'Tanah Longsor', '2024-11-19', 'Jawa Tengah', 'Kabupaten Purworejo', NULL, NULL, -7.7273138, 110.0368372, NULL, 4, 0, 0, 5, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(493, 1, '9b30b24b-8bfd-46ab-b96c-493353f1143c', NULL, 'Tanah Longsor', '2024-11-19', 'Jawa Barat', 'Kabupaten Cianjur', NULL, NULL, -6.8862298, 107.1275849, NULL, 0, 0, 0, 78, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(494, 1, '297858db-fff9-4d13-912c-b26c3ed3a896', NULL, 'Tanah Longsor', '2024-11-19', 'Jawa Barat', 'Kabupaten Cianjur', NULL, NULL, -6.8416866, 107.1058606, NULL, 0, 0, 0, 219, 15, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(495, 1, 'c41f055d-5921-49f5-8d1d-a426f26304a5', NULL, 'Tanah Longsor', '2024-11-17', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6288474, 106.8649203, NULL, 0, 0, 0, 72, 18, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(496, 1, '4f298bb2-f9f7-43fb-8813-c32ddfd1080c', NULL, 'Tanah Longsor', '2024-11-17', 'Jawa Barat', 'Kota Bandung', NULL, NULL, -6.9067771, 107.5980136, NULL, 0, 0, 0, 64, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(497, 1, '2285d4aa-89d6-4f3b-a718-eb97562edf3a', NULL, 'Tanah Longsor', '2024-11-17', 'Jawa Barat', 'Kabupaten Cianjur', NULL, NULL, -6.8411033, 107.1731817, NULL, 0, 0, 0, 578, 103, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(498, 1, '8bd2dca0-61e8-4752-99cd-81b320f7c165', NULL, 'Tanah Longsor', '2024-11-17', 'Daerah Istimewa Yogyakarta', 'Kabupaten Kulon Progo', NULL, NULL, -7.7488974, 110.1685586, NULL, 0, 0, 0, 0, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(499, 1, '3d430854-65a2-422f-aa20-e46e0b8c3aa9', NULL, 'Tanah Longsor', '2024-11-14', 'Daerah Istimewa Yogyakarta', 'Kabupaten Kulon Progo', NULL, NULL, -7.7879537, 110.1976587, NULL, 0, 0, 0, 0, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(500, 1, 'c205925b-5280-49c8-9151-b3a611c20503', NULL, 'Tanah Longsor', '2024-11-11', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6499166, 106.8198052, NULL, 0, 0, 0, 73, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(501, 1, '8d5bf561-04b7-4064-b2ce-de531e2b6ec3', NULL, 'Tanah Longsor', '2024-11-09', 'Jawa Tengah', 'Kabupaten Kebumen', NULL, NULL, -7.7363961, 109.5877540, NULL, 2, 0, 5, 81, 20, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(502, 1, '01dce713-6829-4dc4-9468-52f39423a6f7', NULL, 'Tanah Longsor', '2024-11-09', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6697823, 106.8258229, NULL, 0, 0, 0, 64, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(503, 1, '29b9ccdf-b95f-471c-b2c4-b883b447520b', NULL, 'Tanah Longsor', '2024-11-05', 'Jawa Barat', 'Kota Sukabumi', NULL, NULL, -6.9325912, 106.9270033, NULL, 0, 0, 0, 205, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(504, 1, 'af389e18-7e34-4015-bcf6-59a461fe40dd', NULL, 'Tanah Longsor', '2024-11-03', 'Daerah Istimewa Yogyakarta', 'Kabupaten Kulon Progo', NULL, NULL, -7.8053202, 110.2314773, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(505, 1, '5f29d792-c41f-46c7-b711-728581486a6e', NULL, 'Tanah Longsor', '2024-11-01', 'Jawa Tengah', 'Kabupaten Kebumen', NULL, NULL, -7.7253893, 109.6801940, NULL, 0, 0, 0, 9, 3, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(506, 1, '087eef91-72ba-4ecc-92a3-a63da1328143', NULL, 'Tanah Longsor', '2024-10-18', 'Sumatera Utara', 'Kabupaten Dairi', NULL, NULL, 2.9162760, 98.2040317, NULL, 0, 0, 0, 0, 14, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(507, 1, '9c18b9d8-971d-4412-9be1-04fb1aa20ffd', NULL, 'Tanah Longsor', '2024-10-14', 'Sumatera Barat', 'Kabupaten Agam', NULL, NULL, -0.2558161, 100.2266851, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(508, 1, '72b94541-ce6a-4adc-9bdd-74ebfb34abe1', NULL, 'Tanah Longsor', '2024-10-10', 'Sumatera Utara', 'Kabupaten Karo', NULL, NULL, 3.1895848, 98.2471453, NULL, 1, 0, 0, 453, 3, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(509, 1, '388a39cd-bb44-418c-97ee-0f79cd67a461', NULL, 'Tanah Longsor', '2024-10-09', 'Sumatera Utara', 'Kabupaten Karo', NULL, NULL, 3.0296395, 98.2582866, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(510, 1, '4d971ba6-1db0-456d-8b88-88fe55d1dfbd', NULL, 'Tanah Longsor', '2024-10-08', 'Aceh', 'Kabupaten Aceh Tengah', NULL, NULL, 4.4800446, 96.7972307, NULL, 4, 0, 0, 66, 19, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(511, 1, '4fa32386-cba3-45a9-a533-1e002dbc1572', NULL, 'Tanah Longsor', '2024-10-04', 'Sumatera Barat', 'Kabupaten Solok', NULL, NULL, -0.7490637, 100.6207868, NULL, 0, 0, 0, 52, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(512, 1, 'f36812fc-34da-46c4-acc2-77eda56f087a', NULL, 'Tanah Longsor', '2024-09-26', 'Sumatera Barat', 'Kabupaten Solok', NULL, NULL, -0.8744503, 100.6631971, NULL, 13, 0, 12, 25, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(513, 1, '511225e9-1b23-47c0-a3cd-ba6fc143be14', NULL, 'Tanah Longsor', '2024-09-24', 'Kalimantan Selatan', 'Kabupaten Balangan', NULL, NULL, -2.3260425, 115.6154732, NULL, 0, 0, 0, 35, 12, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(514, 1, '64852bb9-4a9f-45e7-bbba-3ab46c434168', NULL, 'Tanah Longsor', '2024-09-10', 'Bengkulu', 'Kabupaten Mukomuko', NULL, NULL, -2.5760003, 101.1169805, NULL, 0, 0, 0, 80, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(515, 1, '72a4ee08-8d4d-46ea-90d1-d1ca99b8390b', NULL, 'Tanah Longsor', '2024-09-07', 'Bali', 'Kabupaten Bangli', NULL, NULL, -8.5064420, 115.3908332, NULL, 1, 0, 3, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(516, 1, 'e2f25576-bf2e-4eba-bd23-6f174b2f4f6f', NULL, 'Tanah Longsor', '2024-08-31', 'Kalimantan Timur', 'Kota Balikpapan', NULL, NULL, -1.2607628, 116.8182672, NULL, 0, 0, 0, 20, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(517, 1, 'b54f576c-5013-433e-aa79-976e610c98eb', NULL, 'Tanah Longsor', '2024-08-16', 'Sumatera Barat', 'Kabupaten Padang Pariaman', NULL, NULL, -0.5833478, 100.1967825, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(518, 1, '5892e563-7d95-45b6-a074-0e1d71984334', NULL, 'Tanah Longsor', '2024-08-01', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5810543, 106.8626352, NULL, 0, 0, 0, 22, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(519, 1, 'e1b9f528-840a-4129-9947-e17a49b8c6c9', NULL, 'Tanah Longsor', '2024-07-28', 'Sumatera Barat', 'Kabupaten Padang Pariaman', NULL, NULL, -0.5850841, 100.2091114, NULL, 2, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(520, 1, '2d76cfa0-217e-463d-b6d8-8d5c5bff6ad1', NULL, 'Tanah Longsor', '2024-07-13', 'Kalimantan Utara', 'Kabupaten Nunukan', NULL, NULL, 4.1059633, 117.7092100, NULL, 0, 0, 0, 1166, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(521, 1, '05fa8237-341a-46b2-9f90-cc9e3c1ea695', NULL, 'Tanah Longsor', '2024-07-12', 'Sumatera Barat', 'Kabupaten Padang Pariaman', NULL, NULL, -0.6237157, 100.1836133, NULL, 2, 0, 1, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(522, 1, 'd7116863-f16f-4618-967e-95d9a965dc0d', NULL, 'Tanah Longsor', '2024-07-12', 'Kalimantan Timur', 'Kota Samarinda', NULL, NULL, -0.5129740, 117.1404594, NULL, 0, 0, 0, 20, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(523, 1, '1a83e019-dbd8-45cb-a4f2-35384da67ce4', NULL, 'Tanah Longsor', '2024-07-10', 'Kalimantan Timur', 'Kabupaten Kutai Kartanegara', NULL, NULL, -0.0994725, 116.6321345, NULL, 0, 0, 0, 86, 16, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(524, 1, 'cead8107-dc57-49aa-9b0b-a13620a3de45', NULL, 'Tanah Longsor', '2024-07-07', 'Gorontalo', 'Kabupaten Bone Bolango', NULL, NULL, 0.5657885, 123.3486147, NULL, 27, 15, 8, 325, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(525, 1, '511dd231-efba-4d22-81e5-d2c132851bc3', NULL, 'Tanah Longsor', '2024-07-05', 'Maluku', 'Kota Ambon', NULL, NULL, -3.6522622, 128.1804113, NULL, 0, 0, 0, 143, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(526, 1, '2e432561-b9d6-494c-848a-b4d9e40ca1fc', NULL, 'Tanah Longsor', '2024-07-04', 'Jawa Tengah', 'Kota Surakarta', NULL, NULL, -7.5666667, 110.8166667, NULL, 2, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(527, 1, 'a2d1c2db-bc86-48e7-bd15-2fa71572ea79', NULL, 'Tanah Longsor', '2024-07-02', 'Sulawesi Selatan', 'Kabupaten Bulukumba', NULL, NULL, -5.4329368, 120.2051096, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(528, 1, 'a03387b4-d052-4f00-a167-26ae30b858bf', NULL, 'Tanah Longsor', '2024-06-30', 'Jawa Timur', 'Kabupaten Blitar', NULL, NULL, -8.0646631, 112.2242512, NULL, 3, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(529, 1, 'e0583ea7-3d7c-4b06-99da-5e63c57933ec', NULL, 'Tanah Longsor', '2024-06-30', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9393363, 106.8497217, NULL, 0, 0, 0, 26, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(530, 1, '33f32a3d-0365-4d2e-9565-451c92e88538', NULL, 'Tanah Longsor', '2024-06-30', 'Jawa Barat', 'Kabupaten Tasikmalaya', NULL, NULL, -7.2661221, 108.2605995, NULL, 0, 0, 0, 290, 36, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(531, 1, 'a1bd1ce3-3c61-4441-873d-294d26a20902', NULL, 'Tanah Longsor', '2024-06-29', 'Jawa Barat', 'Kabupaten Tasikmalaya', NULL, NULL, -7.2542128, 108.2249720, NULL, 0, 0, 0, 152, 26, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(532, 1, '402ec5ce-56dd-4031-8e3f-f6e007da6f08', NULL, 'Tanah Longsor', '2024-06-29', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9763745, 106.9571554, NULL, 0, 0, 0, 50, 16, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(533, 1, '02f5ba5c-b3f9-4d0b-8121-6acf5a7144c4', NULL, 'Tanah Longsor', '2024-06-29', 'Gorontalo', 'Kabupaten Gorontalo', NULL, NULL, 0.5333333, 123.0666667, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(534, 1, '5f974f9f-31f1-49df-b31a-2aff3948ebf9', NULL, 'Tanah Longsor', '2024-06-29', 'Jawa Barat', 'Kabupaten Garut', NULL, NULL, -7.2488862, 107.8564428, NULL, 0, 0, 0, 8, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(535, 1, '5c6eebae-5f8b-4347-aff5-10f6346fd807', NULL, 'Tanah Longsor', '2024-06-26', 'Sumatera Utara', 'Kabupaten Deli Serdang', NULL, NULL, 3.3983488, 98.7208905, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(536, 1, 'dfa75e3a-0eee-4bfe-abd5-284afe3c5036', NULL, 'Tanah Longsor', '2024-06-15', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5989851, 106.8205441, NULL, 0, 0, 0, 12, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(537, 1, '98f81b3b-b237-4c79-a18b-fe1b9fc2067f', NULL, 'Tanah Longsor', '2024-06-12', 'Sulawesi Barat', 'Kabupaten Polewali Mandar', NULL, NULL, -3.4056471, 119.0960765, NULL, 0, 0, 0, 4850, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(538, 1, 'eea854ea-73c0-4714-b069-e98b38414b1b', NULL, 'Tanah Longsor', '2024-06-10', 'Jambi', 'Kota Sungai Penuh', NULL, NULL, -2.0664820, 101.3934522, NULL, 0, 0, 0, 13, 13, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(539, 1, 'f5844d5c-a434-4a3a-abe3-3ab2da55ba37', NULL, 'Tanah Longsor', '2024-06-07', 'Nusa Tenggara Timur', 'Kabupaten Ende', NULL, NULL, -8.7856422, 121.6364082, NULL, 4, 0, 0, 4, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(540, 1, '7d786c30-2a1e-45f6-9bac-69a3d45b9fcc', NULL, 'Tanah Longsor', '2024-06-04', 'Jawa Timur', 'Kabupaten Lumajang', NULL, NULL, -8.1680222, 113.1628244, NULL, 4, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(541, 1, '6b7abdc8-c38c-4fdb-a9d8-77c4beaa8d10', NULL, 'Tanah Longsor', '2024-06-03', 'Maluku', 'Kota Ambon', NULL, NULL, -3.6414668, 128.1547987, NULL, 0, 0, 0, 109, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(542, 1, 'fef336be-2bd3-41c2-8b84-83c2c24bfd56', NULL, 'Tanah Longsor', '2024-05-25', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5711501, 106.8030387, NULL, 0, 0, 0, 43, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(543, 1, '992b67b4-aa6c-4ef1-b27c-c3a6dd0af957', NULL, 'Tanah Longsor', '2024-05-24', 'Jawa Barat', 'Kabupaten Tasikmalaya', NULL, NULL, -7.2946778, 108.1489309, NULL, 0, 0, 0, 50, 4, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(544, 1, '2c0af6a3-9e25-4d63-9293-5396a963e017', NULL, 'Tanah Longsor', '2024-05-24', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.9046764, 107.5114690, NULL, 0, 0, 0, 78, 12, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(545, 1, '21bfee79-f73a-408c-9f92-f2c81812fff6', NULL, 'Tanah Longsor', '2024-05-24', 'Maluku Utara', 'Kabupaten Halmahera Utara', NULL, NULL, 1.3478787, 128.4152217, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(546, 1, 'c62d2a2f-2faa-484b-935d-be45689d50d3', NULL, 'Tanah Longsor', '2024-05-22', 'Nusa Tenggara Timur', 'Kabupaten Ende', NULL, NULL, -8.8109239, 121.6654188, NULL, 2, 0, 0, 3, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(547, 1, 'aa7de658-1c5b-4fe7-8822-8ed9b56ec65c', NULL, 'Tanah Longsor', '2024-05-21', 'Sulawesi Barat', 'Kabupaten Mamasa', NULL, NULL, -3.0092645, 119.3317218, NULL, 0, 0, 1, 1829, 243, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(548, 1, '834d42e3-dd5d-4c7f-81eb-0e9661910f8f', NULL, 'Tanah Longsor', '2024-05-19', 'Sulawesi Tengah', 'Kabupaten Parigi Moutong', NULL, NULL, 0.5274306, 120.8685853, NULL, 0, 0, 0, 174, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(549, 1, 'e7358028-e910-497e-8bc5-ba7c5aedcfcc', NULL, 'Tanah Longsor', '2024-05-18', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9090353, 106.8394929, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(550, 1, '25924515-2a8d-42fa-90e3-c6edbee7e2a2', NULL, 'Tanah Longsor', '2024-05-17', 'Banten', 'Kota Tangerang Selatan', NULL, NULL, -6.2941951, 106.7351196, NULL, 0, 0, 0, 50, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(551, 1, 'f8a2dc83-9acc-438c-bb2b-82ece3990256', NULL, 'Tanah Longsor', '2024-05-14', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.9388465, 107.4915920, NULL, 0, 0, 0, 0, 18, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(552, 1, '58c7ffcf-f5c8-47c4-9158-95b738d4dd33', NULL, 'Tanah Longsor', '2024-05-13', 'Papua Pegunungan', 'Kabupaten Pegunungan Bintang', NULL, NULL, -4.5303283, 140.4677037, NULL, 0, 0, 0, 1659, 57, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(553, 1, '77d25fee-f68e-49fb-b1fd-ae62bdb3ee2a', NULL, 'Tanah Longsor', '2024-05-13', 'Sumatera Barat', 'Kabupaten Agam', NULL, NULL, -0.2461762, 100.2109022, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(554, 1, 'f7753382-3940-410c-9ecb-a940334f1230', NULL, 'Tanah Longsor', '2024-05-12', 'Maluku', 'Kota Ambon', NULL, NULL, -3.6618457, 128.1627961, NULL, 0, 0, 0, 116, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(555, 1, '53c44ad3-81ee-4faf-80a1-901e72c53e40', NULL, 'Tanah Longsor', '2024-05-11', 'Sumatera Barat', 'Kota Padang', NULL, NULL, -0.9500000, 100.3530556, NULL, 2, 0, 6, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(556, 1, '2d69909d-cbe9-41b3-97fe-82750227a5c9', NULL, 'Tanah Longsor', '2024-05-11', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9119255, 106.8453974, NULL, 0, 0, 0, 20, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(557, 1, '9fd2df1b-c5e8-474e-b0c6-64bfe7cb04fa', NULL, 'Tanah Longsor', '2024-05-09', 'Sulawesi Selatan', 'Kabupaten Toraja Utara', NULL, NULL, -2.8243204, 119.8642749, NULL, 0, 0, 0, 150, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(558, 1, '9347e3e6-1611-4993-ab1e-db4aef8286a1', NULL, 'Tanah Longsor', '2024-05-09', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5903748, 106.7464930, NULL, 0, 0, 0, 169, 24, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(559, 1, '2d57312d-6673-4510-849d-937c3e941685', NULL, 'Tanah Longsor', '2024-05-09', 'Sumatera Utara', 'Kabupaten Samosir', NULL, NULL, 2.5833333, 98.8166667, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(560, 1, 'f0983e1c-5012-4c41-88dc-73140c5df536', NULL, 'Tanah Longsor', '2024-05-09', 'Sumatera Utara', 'Kabupaten Tapanuli Utara', NULL, NULL, 2.0520016, 99.1300216, NULL, 1, 0, 0, 4, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(561, 1, '7a29f5d8-679b-460c-887f-ad60b68f58c4', NULL, 'Tanah Longsor', '2024-05-04', 'Nusa Tenggara Timur', 'Kabupaten Ende', NULL, NULL, -8.8440790, 121.7055584, NULL, 3, 0, 0, 3, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(562, 1, '727d3cca-67d4-4893-abef-5527b2a58068', NULL, 'Tanah Longsor', '2024-05-04', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6767097, 106.7681097, NULL, 0, 0, 0, 36, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(563, 1, '714b498b-aaa5-40e3-8cbb-1e1ec2f0f273', NULL, 'Tanah Longsor', '2024-05-03', 'Sulawesi Selatan', 'Kabupaten Luwu', NULL, NULL, -3.3256394, 120.2644809, NULL, 9, 0, 0, 0, 43, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(564, 1, 'b8ebe966-4300-4f5f-8dad-2d0d8ce5c593', NULL, 'Tanah Longsor', '2024-04-26', 'Sulawesi Selatan', 'Kabupaten Toraja Utara', NULL, NULL, -2.8714094, 119.8949949, NULL, 3, 0, 6, 30, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(565, 1, 'cb81af2e-0e7b-4c01-a7a0-06d85ec3570c', NULL, 'Tanah Longsor', '2024-04-26', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.8811772, 106.8918351, NULL, 0, 0, 0, 34, 9, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(566, 1, 'adb11585-c23d-4f7e-a8bf-f038a2f5987e', NULL, 'Tanah Longsor', '2024-04-26', 'Jawa Barat', 'Kabupaten Cianjur', NULL, NULL, -6.7679112, 107.1982281, NULL, 0, 0, 0, 385, 34, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(567, 1, '476a3254-5f0a-42ab-8706-86c14007fe0f', NULL, 'Tanah Longsor', '2024-04-26', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.9566337, 107.4747613, NULL, 1, 0, 1, 48, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(568, 1, 'd9086c06-35ec-429d-b890-c906cb556d99', NULL, 'Tanah Longsor', '2024-04-25', 'Jawa Barat', 'Kabupaten Garut', NULL, NULL, -7.2205003, 107.9356366, NULL, 3, 0, 0, 27, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(569, 1, 'c4d37f98-faa3-4cdd-8a1c-48347bcdf581', NULL, 'Tanah Longsor', '2024-04-25', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5739221, 106.8514038, NULL, 0, 0, 0, 103, 35, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(570, 1, 'b0ea65f6-b8eb-47b0-8cc9-609b061a0ec5', NULL, 'Tanah Longsor', '2024-04-25', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.3132916, 108.2627819, NULL, 0, 0, 0, 396, 75, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(571, 1, '6f4a0dd1-8be2-42ac-8725-28757d0a2495', NULL, 'Tanah Longsor', '2024-04-24', 'Papua Pegunungan', 'Kabupaten Yahukimo', NULL, NULL, -4.4388612, 139.4920988, NULL, 0, 0, 0, 2956, 1133, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(572, 1, '773aff9c-4d8f-464e-8268-148f5c42cc2a', NULL, 'Tanah Longsor', '2024-04-24', 'Jawa Barat', 'Kabupaten Purwakarta', NULL, NULL, -6.5050685, 107.4122863, NULL, 0, 0, 0, 6, 9, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(573, 1, '3407dcbf-a0f1-48a0-8d85-b62b1c8ba215', NULL, 'Tanah Longsor', '2024-04-23', 'Sulawesi Selatan', 'Kabupaten Luwu', NULL, NULL, -3.3154866, 120.2756645, NULL, 0, 0, 0, 155, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(574, 1, '3d5b3d22-6c5a-49bd-82b6-3dfc2f7da98c', NULL, 'Tanah Longsor', '2024-04-23', 'Jawa Timur', 'Kabupaten Mojokerto', NULL, NULL, -7.5099092, 112.3533090, NULL, 0, 0, 0, 35, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(575, 1, 'c6c2109c-622d-45ce-aaf4-6975ab294da2', NULL, 'Tanah Longsor', '2024-04-21', 'Sulawesi Selatan', 'Kabupaten Luwu', NULL, NULL, -3.2385658, 120.2331402, NULL, 0, 0, 0, 565, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(576, 1, 'a498b0d5-6269-4196-b398-7641b2c0c673', NULL, 'Tanah Longsor', '2024-04-19', 'Jawa Barat', 'Kabupaten Purwakarta', NULL, NULL, -6.5850562, 107.4437376, NULL, 0, 0, 0, 137, 20, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(577, 1, '75396e86-1a71-4a86-ac3e-2cb294dbcf97', NULL, 'Tanah Longsor', '2024-04-18', 'Jawa Timur', 'Kabupaten Lumajang', NULL, NULL, -8.1630731, 113.1802347, NULL, 1, 0, 0, 0, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(578, 1, '1512c1ba-6b6f-4dc0-ab07-11766eee7d23', NULL, 'Tanah Longsor', '2024-04-18', 'Jawa Barat', 'Kota Depok', NULL, NULL, -6.3900000, 106.8300000, NULL, 0, 0, 0, 487, 24, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(579, 1, 'ef56fd9e-5a27-4e11-81ec-239a2d803199', NULL, 'Tanah Longsor', '2024-04-16', 'Sulawesi Selatan', 'Kabupaten Sinjai', NULL, NULL, -5.2195440, 120.0906853, NULL, 0, 0, 0, 116, 32, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(580, 1, '23eca63d-935e-45b7-97a5-c8551a0f1b19', NULL, 'Tanah Longsor', '2024-04-16', 'Sumatera Utara', 'Kabupaten Dairi', NULL, NULL, 2.9548899, 98.2603064, NULL, 0, 0, 0, 1600, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(581, 1, '95f09b3f-3662-4764-bf77-ae8d57b1c403', NULL, 'Tanah Longsor', '2024-04-13', 'Sulawesi Selatan', 'Kabupaten Tana Toraja', NULL, NULL, -3.0945463, 119.6924265, NULL, 20, 0, 2, 74, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(582, 1, '6e7b0a1c-5f72-4aad-9012-d7751aa7f81f', NULL, 'Tanah Longsor', '2024-04-04', 'Jawa Tengah', 'Kabupaten Wonosobo', NULL, NULL, -7.3000168, 109.9079589, NULL, 2, 0, 0, 14, 4, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(583, 1, 'e1c2c767-c128-46d0-a8ac-383bfeff28df', NULL, 'Tanah Longsor', '2024-04-01', 'Jawa Barat', 'Kabupaten Cianjur', NULL, NULL, -6.8388511, 107.0805508, NULL, 0, 0, 0, 66, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(584, 1, 'f8c1573c-f517-4ae2-a544-2b350343879e', NULL, 'Tanah Longsor', '2024-04-01', 'Nusa Tenggara Timur', 'Kabupaten Manggarai Barat', NULL, NULL, -8.6688149, 120.0665236, NULL, 0, 0, 0, 878, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(585, 1, 'c71a5cc7-61b5-478e-b511-96fd18065f73', NULL, 'Tanah Longsor', '2024-03-29', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.8942059, 106.9608317, NULL, 0, 0, 0, 47, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(586, 1, 'be04e3f8-131b-4aca-82aa-5384d335254d', NULL, 'Tanah Longsor', '2024-03-29', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9920671, 106.8984618, NULL, 0, 0, 0, 16, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(587, 1, 'd563f8da-149a-44e8-93ec-c593fa1ea833', NULL, 'Tanah Longsor', '2024-03-28', 'Daerah Istimewa Yogyakarta', 'Kabupaten Gunung Kidul', NULL, NULL, -8.0595030, 110.6692956, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(588, 1, '4e1ae0c0-8533-4723-997e-cb9ef654288b', NULL, 'Tanah Longsor', '2024-03-27', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8708264, 107.5025962, NULL, 0, 0, 0, 44, 19, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(589, 1, '0cfc1ffd-65e3-4c27-9e0b-e1a3887c16d9', NULL, 'Tanah Longsor', '2024-03-24', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8607587, 107.4928564, NULL, 8, 3, 0, 1960, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(590, 1, '940787b2-093f-4edc-9ba4-5fecc92d1a5c', NULL, 'Tanah Longsor', '2024-03-17', 'Jawa Timur', 'Kabupaten Pamekasan', NULL, NULL, -7.1796945, 113.5521743, NULL, 0, 0, 0, 0, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(591, 1, 'a6270e6c-04ad-4c50-aecd-ce91e35d8838', NULL, 'Tanah Longsor', '2024-03-17', 'Nusa Tenggara Timur', 'Kota Kupang', NULL, NULL, -10.1797295, 123.5734837, NULL, 0, 0, 0, 75, 21, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(592, 1, 'f1eb71e5-06ff-4e5c-9d86-4db16bf7dd44', NULL, 'Tanah Longsor', '2024-03-16', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6634210, 106.8018644, NULL, 0, 0, 0, 26, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(593, 1, '79f2b7dd-8b6f-4d18-91f3-dfd47e452bfd', NULL, 'Tanah Longsor', '2024-03-15', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6681637, 106.8170488, NULL, 0, 0, 0, 43, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(594, 1, 'a23fa06a-0e8e-48de-b864-40b6b03074aa', NULL, 'Tanah Longsor', '2024-03-14', 'Jawa Timur', 'Kota Batu', NULL, NULL, -7.8671000, 112.5239000, NULL, 0, 0, 0, 50, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(595, 1, 'cc07ff51-c802-4ed9-bfc4-5ed6fb743ef9', NULL, 'Tanah Longsor', '2024-03-14', 'Bali', 'Kabupaten Tabanan', NULL, NULL, -8.5445160, 115.1197970, NULL, 2, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(596, 1, '66fac063-746e-4bc7-8541-ebc0b1fb51f4', NULL, 'Tanah Longsor', '2024-03-10', 'Banten', 'Kabupaten Lebak', NULL, NULL, -6.4790573, 106.2313998, NULL, 0, 0, 0, 25, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(597, 1, '39b5ad1e-c2cf-498e-aa73-2f4ecf435d23', NULL, 'Tanah Longsor', '2024-03-06', 'Papua Pegunungan', 'Kabupaten Pegunungan Bintang', NULL, NULL, -4.4801476, 140.5433965, NULL, 0, 0, 0, 65, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(598, 1, '0df08e7c-1f4d-469d-92ec-759500527494', NULL, 'Tanah Longsor', '2024-03-06', 'Jawa Timur', 'Kabupaten Jombang', NULL, NULL, -7.5810576, 112.2395515, NULL, 0, 0, 0, 34, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(599, 1, 'e484d9c0-055c-4928-9046-2dc2fb2b00a7', NULL, 'Tanah Longsor', '2024-03-05', 'Jawa Barat', 'Kabupaten Majalengka', NULL, NULL, -6.8547742, 108.1489102, NULL, 1, 0, 0, 10, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(600, 1, '574fcaa1-518b-4897-94d1-15c0c18b0d24', NULL, 'Tanah Longsor', '2024-03-04', 'Jawa Tengah', 'Kabupaten Pemalang', NULL, NULL, -6.9619015, 109.3329033, NULL, 0, 0, 0, 248, 13, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(601, 1, '5c29a3ce-e34b-4836-97a5-a8f09dd3e5ec', NULL, 'Tanah Longsor', '2024-03-04', 'Banten', 'Kabupaten Lebak', NULL, NULL, -6.5779798, 106.3252780, NULL, 0, 0, 0, 44, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(602, 1, '4a9055b6-272b-46f9-bf69-5a84c556cbaa', NULL, 'Tanah Longsor', '2024-03-03', 'Jawa Tengah', 'Kabupaten Karanganyar', NULL, NULL, -7.5908665, 110.9307028, NULL, 0, 0, 0, 281, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(603, 1, '205f1ab7-1ae5-4ff7-a596-642de6cb4351', NULL, 'Tanah Longsor', '2024-03-03', 'Sumatera Utara', 'Kabupaten Pakpak Bharat', NULL, NULL, 2.5457860, 98.2998380, NULL, 0, 0, 0, 1095, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(604, 1, '814c7477-d1f3-40ce-baa1-955c52ee062e', NULL, 'Tanah Longsor', '2024-03-03', 'Nusa Tenggara Barat', 'Kabupaten Lombok Utara', NULL, NULL, -8.3739076, 116.2777073, NULL, 0, 0, 0, 52, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11');
INSERT INTO `disaster_events` (`id`, `data_source_id`, `external_id`, `created_by`, `title`, `event_date`, `province`, `regency`, `district`, `village`, `latitude`, `longitude`, `description`, `deaths`, `missing`, `injured`, `displaced`, `houses_damaged`, `source_note`, `verification_status`, `created_at`, `updated_at`) VALUES
(605, 1, '38bb39c2-80d3-4657-b23a-2e6ab57ff0b5', NULL, 'Tanah Longsor', '2024-03-03', 'Jawa Tengah', 'Kabupaten Sragen', NULL, NULL, -7.4249655, 111.1069484, NULL, 3, 2, 0, 65, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(606, 1, 'eeaaa8f2-d778-4566-a5b8-992b7c7b5d23', NULL, 'Tanah Longsor', '2024-03-03', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5595425, 106.8405741, NULL, 0, 0, 0, 10, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(607, 1, '8c9d99d8-aea5-442c-959f-6b3c089dd5c7', NULL, 'Tanah Longsor', '2024-03-01', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.2633280, 108.3321912, NULL, 0, 0, 0, 20, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(608, 1, 'de29b299-1f9a-4190-b541-c5b26d16a2eb', NULL, 'Tanah Longsor', '2024-03-01', 'Jawa Barat', 'Kabupaten Kuningan', NULL, NULL, -6.9324768, 108.4291074, NULL, 0, 0, 0, 15, 8, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(609, 1, '45bcc26a-8384-4ecc-9667-0735f8767b36', NULL, 'Tanah Longsor', '2024-02-26', 'Sulawesi Selatan', 'Kabupaten Luwu', NULL, NULL, -3.2882402, 120.3266878, NULL, 5, 0, 8, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(610, 1, 'd0af5c10-9bf7-47f9-9ac3-fe5063c6e89e', NULL, 'Tanah Longsor', '2024-02-25', 'Jawa Barat', 'Kabupaten Bekasi', NULL, NULL, -6.2154275, 107.0560281, NULL, 0, 0, 0, 80, 14, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(611, 1, '51f78bb1-9b82-4713-ae04-013ac5d27dbb', NULL, 'Tanah Longsor', '2024-02-25', 'Jawa Tengah', 'Kabupaten Magelang', NULL, NULL, -7.5140429, 110.2233324, NULL, 0, 0, 4, 85, 7, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(612, 1, '8ee9be8d-16fe-48cd-9375-d5a1c7ff9489', NULL, 'Tanah Longsor', '2024-02-24', 'Bengkulu', 'Kabupaten Kaur', NULL, NULL, -4.6792278, 103.4511768, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(613, 1, 'd34eb659-e038-46f1-bb87-e96d6f07f799', NULL, 'Tanah Longsor', '2024-02-22', 'Jawa Tengah', 'Kabupaten Brebes', NULL, NULL, -6.8335006, 109.1063812, NULL, 0, 0, 0, 1542, 70, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(614, 1, '7a77e8ac-07f6-41cd-a0d9-24de64c649a7', NULL, 'Tanah Longsor', '2024-02-22', 'Jawa Barat', 'Kabupaten Purwakarta', NULL, NULL, -6.5896954, 107.4340462, NULL, 0, 0, 0, 82, 10, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(615, 1, '2fdc1830-732c-4978-aeaf-25de2002af48', NULL, 'Tanah Longsor', '2024-02-20', 'Jawa Tengah', 'Kabupaten Brebes', NULL, NULL, -6.8363361, 109.0669627, NULL, 0, 0, 0, 1542, 94, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(616, 1, '3632513e-8c9f-4e00-b71d-f1967b746c31', NULL, 'Tanah Longsor', '2024-02-20', 'Jambi', 'Kabupaten Merangin', NULL, NULL, -2.1752789, 101.9804613, NULL, 0, 0, 0, 0, 13, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(617, 1, '1569fbac-a40b-458f-81b3-2c7605d18958', NULL, 'Tanah Longsor', '2024-02-19', 'Jawa Barat', 'Kabupaten Purwakarta', NULL, NULL, -6.6145653, 107.4090097, NULL, 0, 0, 0, 0, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(618, 1, '8155ec45-71ba-47d4-a0c6-be991dc9e583', NULL, 'Tanah Longsor', '2024-02-19', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8531164, 107.4291838, NULL, 0, 0, 0, 21, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(619, 1, 'c50d8334-763a-4b7b-a08b-f585d8eb8fb3', NULL, 'Tanah Longsor', '2024-02-18', 'Jawa Barat', 'Kota Bogor', NULL, NULL, -6.6089072, 106.7953473, NULL, 2, 0, 1, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(620, 1, '257c334d-87ac-43d3-94a0-5c3be6c12167', NULL, 'Tanah Longsor', '2024-02-18', 'Sumatera Selatan', 'Kabupaten Ogan Komering Ulu Selatan', NULL, NULL, -4.6681951, 104.0072348, NULL, 0, 0, 0, 67, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(621, 1, '0128ebf0-20f4-4787-8e7e-e3eac9552a9b', NULL, 'Tanah Longsor', '2024-02-18', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.9610523, 107.4163576, NULL, 0, 0, 0, 355, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(622, 1, '87caf5c1-5059-4706-b78e-e0dbf4d82670', NULL, 'Tanah Longsor', '2024-02-16', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6597176, 106.8668638, NULL, 0, 0, 0, 29, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(623, 1, '4a14b96d-30c0-470c-a5fb-9312b9b2f1bc', NULL, 'Tanah Longsor', '2024-02-16', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8593404, 107.3602981, NULL, 1, 0, 0, 62, 13, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(624, 1, '05e3718f-4453-40de-86c5-2d57d2df5e80', NULL, 'Tanah Longsor', '2024-02-10', 'Jawa Barat', 'Kabupaten Bandung', NULL, NULL, -6.9580083, 107.6616919, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(625, 1, '6193481a-c525-4696-8c9e-a2268098a469', NULL, 'Tanah Longsor', '2024-02-08', 'Jawa Tengah', 'Kabupaten Cilacap', NULL, NULL, -7.7959648, 108.9788125, NULL, 0, 0, 0, 19, 9, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(626, 1, '29cdeb70-7a7d-457f-941c-4b7c829c67f5', NULL, 'Tanah Longsor', '2024-02-06', 'Jawa Tengah', 'Kabupaten Banjarnegara', NULL, NULL, -7.4607863, 109.6998824, NULL, 0, 0, 1, 171, 13, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(627, 1, '81551ea8-cf6d-43b0-94a1-9acd68a11534', NULL, 'Tanah Longsor', '2024-02-05', 'Jawa Tengah', 'Kabupaten Kendal', NULL, NULL, -6.9773786, 110.2374534, NULL, 1, 0, 0, 5, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(628, 1, 'b4fd390b-7727-4e6c-9975-7ca7fe900bcb', NULL, 'Tanah Longsor', '2024-02-03', 'Sumatera Utara', 'Kabupaten Tapanuli Utara', NULL, NULL, 1.9692680, 99.1501089, NULL, 3, 0, 14, 4, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(629, 1, '4c209a21-7831-4548-acab-30e0a9e41d3e', NULL, 'Tanah Longsor', '2024-01-31', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6594877, 106.8637302, NULL, 0, 0, 0, 23, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(630, 1, '07935758-af63-4c51-a758-3620059e9b35', NULL, 'Tanah Longsor', '2024-01-28', 'Jawa Timur', 'Kabupaten Malang', NULL, NULL, -8.0237485, 112.7107166, NULL, 1, 0, 0, 0, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(631, 1, '51963c35-1e1a-4c16-8a6e-fd611bf8744e', NULL, 'Tanah Longsor', '2024-01-27', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.4129307, 108.3394310, NULL, 0, 0, 0, 1, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(632, 1, 'b2800622-ff7c-40e2-a458-dea5389aa1e5', NULL, 'Tanah Longsor', '2024-01-26', 'Jawa Tengah', 'Kabupaten Temanggung', NULL, NULL, -7.3717726, 110.1190836, NULL, 1, 0, 0, 4, 1, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(633, 1, 'd8b4a903-be90-4524-8a63-ff881d20e54a', NULL, 'Tanah Longsor', '2024-01-24', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9154538, 107.0113390, NULL, 0, 0, 0, 133, 13, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(634, 1, '206870a8-9381-4ac3-a7fe-04f32a55fe34', NULL, 'Tanah Longsor', '2024-01-20', 'Sulawesi Selatan', 'Kabupaten Enrekang', NULL, NULL, -3.5631280, 119.7612000, NULL, 0, 0, 0, 101, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(635, 1, '10167cc2-a504-4a81-a5d8-cec42c5807b5', NULL, 'Tanah Longsor', '2024-01-19', 'Banten', 'Kabupaten Pandeglang', NULL, NULL, -6.3770303, 106.1515849, NULL, 0, 0, 0, 4, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(636, 1, '6df67f67-a561-4c45-a6ea-ed1a5d498e31', NULL, 'Tanah Longsor', '2024-01-13', 'Jawa Barat', 'Kabupaten Purwakarta', NULL, NULL, -6.5604464, 107.4421755, NULL, 0, 0, 0, 32, 6, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(637, 1, 'a0c82b39-0a37-4d39-af2c-3cc49579dbad', NULL, 'Tanah Longsor', '2024-01-12', 'Kepulauan Riau', 'Kabupaten Natuna', NULL, NULL, 3.9329945, 108.1812242, NULL, 0, 0, 0, 170, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(638, 1, '130e96a6-e684-4197-b231-221b67d8bfab', NULL, 'Tanah Longsor', '2024-01-10', 'Jawa Barat', 'Kabupaten Cianjur', NULL, NULL, -6.8705646, 107.1216457, NULL, 0, 0, 0, 0, 13, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(639, 1, '305cacba-380d-453f-be74-24e4360c28d1', NULL, 'Tanah Longsor', '2024-01-09', 'Jawa Barat', 'Kabupaten Bandung', NULL, NULL, -6.8414558, 107.6480514, NULL, 0, 0, 0, 46, 13, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(640, 1, '0a30de46-24ed-444a-ad35-be6b696effe1', NULL, 'Tanah Longsor', '2024-01-09', 'Sulawesi Selatan', 'Kabupaten Tana Toraja', NULL, NULL, -2.9892336, 119.7489939, NULL, 0, 0, 0, 25, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(641, 1, '6e4c892e-dd07-4193-802f-0e4c98c66d81', NULL, 'Tanah Longsor', '2024-01-08', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.5970549, 106.7553430, NULL, 0, 0, 0, 25, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(642, 1, '97b6613c-59f9-4e48-b6d7-5eaa7ceacce6', NULL, 'Tanah Longsor', '2024-01-08', 'Jawa Tengah', 'Kabupaten Banjarnegara', NULL, NULL, -7.4344157, 109.7476379, NULL, 0, 0, 0, 145, 33, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(643, 1, '6a06ac7d-b7d4-45be-85bd-ac054dbd528e', NULL, 'Tanah Longsor', '2024-01-08', 'Jawa Barat', 'Kabupaten Purwakarta', NULL, NULL, -6.5007925, 107.4884309, NULL, 0, 0, 0, 104, 12, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(644, 1, '6a3d6653-b079-4780-9e87-408d467fd89c', NULL, 'Tanah Longsor', '2024-01-08', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.9229524, 107.4488265, NULL, 0, 0, 0, 0, 40, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(645, 1, '27f4550d-a13e-42fc-807d-3b3568b5fdd0', NULL, 'Tanah Longsor', '2024-01-07', 'Jawa Barat', 'Kabupaten Subang', NULL, NULL, -6.6409810, 107.7923799, NULL, 2, 0, 11, 262, 0, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(646, 1, '66e8c2bb-2a9f-4ab4-b1c2-79953636f1ab', NULL, 'Tanah Longsor', '2024-01-05', 'Banten', 'Kota Tangerang Selatan', NULL, NULL, -6.3035933, 106.7258877, NULL, 0, 0, 0, 25, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(647, 1, '35cfd1e1-fb5a-40d2-80e6-03e49badfc0e', NULL, 'Tanah Longsor', '2024-01-04', 'Jawa Barat', 'Kabupaten Purwakarta', NULL, NULL, -6.5506197, 107.3883303, NULL, 0, 0, 1, 1545, 9, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(648, 1, '8c2dd871-62b6-4a0f-a1b5-c125cb9194f4', NULL, 'Tanah Longsor', '2024-01-04', 'Jawa Tengah', 'Kabupaten Banyumas', NULL, NULL, -7.5480573, 109.0866053, NULL, 0, 0, 0, 75, 2, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(649, 1, '512cbcb8-49c7-4eba-ba7c-78ff0028ec1f', NULL, 'Tanah Longsor', '2024-01-04', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6771012, 106.7934813, NULL, 0, 0, 0, 52, 11, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11'),
(650, 1, 'f98d9ef2-636e-4620-b18a-4dabe5207270', NULL, 'Tanah Longsor', '2024-01-03', 'Bengkulu', 'Kota Bengkulu', NULL, NULL, -3.7955556, 102.2591667, NULL, 0, 0, 0, 0, 5, NULL, 'verified', '2026-11-16 02:26:39', '2026-11-16 02:27:11');

-- --------------------------------------------------------

--
-- Table structure for table `disaster_reports`
--

CREATE TABLE `disaster_reports` (
  `id` bigint UNSIGNED NOT NULL,
  `disaster_event_id` bigint UNSIGNED DEFAULT NULL,
  `reviewed_by` bigint UNSIGNED DEFAULT NULL,
  `tracking_code` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `reporter_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `reporter_contact` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `event_date` date NOT NULL,
  `province` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `regency` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `district` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `village` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `rejection_reason` text COLLATE utf8mb4_general_ci,
  `reviewed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `disaster_reports`
--

INSERT INTO `disaster_reports` (`id`, `disaster_event_id`, `reviewed_by`, `tracking_code`, `reporter_name`, `reporter_contact`, `event_date`, `province`, `regency`, `district`, `village`, `latitude`, `longitude`, `description`, `status`, `rejection_reason`, `reviewed_at`, `created_at`, `updated_at`) VALUES
(1, NULL, 1, 'GS-20261114-868118', 'Dian', '000000000000000000', '2026-11-12', 'Aceh', 'jjj', 'bb', 'jjj', NULL, NULL, 'dfasdfasdafdadsfsjkdfasjdfsjdsfashdfjashjfdah', 'approved', NULL, '2026-11-14 07:55:25', '2026-11-14 00:54:24', '2026-11-14 00:55:25'),
(2, NULL, 2, 'GS-20261117-549BEB', 'agustinus', '088890922423', '2026-11-17', 'Yogyakarta', 'Gunungkidul', 'wonosari', 'gari', 0.0000019, NULL, 'tanah longsor terjadi di kalurahan gari akibat hujan deras selama 12 jam', 'approved', NULL, '2026-11-17 11:38:47', '2026-11-17 04:37:58', '2026-11-17 04:38:47');

-- --------------------------------------------------------

--
-- Table structure for table `event_documents`
--

CREATE TABLE `event_documents` (
  `id` bigint UNSIGNED NOT NULL,
  `disaster_event_id` bigint UNSIGNED DEFAULT NULL,
  `disaster_report_id` bigint UNSIGNED DEFAULT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `file_type` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `caption` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `import_logs`
--

CREATE TABLE `import_logs` (
  `id` bigint UNSIGNED NOT NULL,
  `data_source_id` bigint UNSIGNED DEFAULT NULL,
  `status` enum('success','partial','failed') COLLATE utf8mb4_general_ci NOT NULL,
  `total_rows` int UNSIGNED NOT NULL DEFAULT '0',
  `inserted_rows` int UNSIGNED NOT NULL DEFAULT '0',
  `failed_rows` int UNSIGNED NOT NULL DEFAULT '0',
  `error_message` text COLLATE utf8mb4_general_ci,
  `started_at` datetime DEFAULT NULL,
  `finished_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `missing_persons`
--

CREATE TABLE `missing_persons` (
  `id` bigint UNSIGNED NOT NULL,
  `disaster_event_id` bigint UNSIGNED DEFAULT NULL,
  `reviewed_by` bigint UNSIGNED DEFAULT NULL,
  `tracking_code` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `age` int UNSIGNED DEFAULT NULL,
  `gender` enum('male','female','unknown') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'unknown',
  `physical_description` text COLLATE utf8mb4_general_ci,
  `last_seen_location` text COLLATE utf8mb4_general_ci NOT NULL,
  `last_seen_at` datetime DEFAULT NULL,
  `search_status` enum('searching','found','closed') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'searching',
  `verification_status` enum('pending','approved','rejected') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `reporter_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `reporter_contact` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `public_contact_note` text COLLATE utf8mb4_general_ci,
  `public_consent` tinyint(1) NOT NULL DEFAULT '0',
  `admin_note` text COLLATE utf8mb4_general_ci,
  `rejection_reason` text COLLATE utf8mb4_general_ci,
  `reviewed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `missing_persons`
--

INSERT INTO `missing_persons` (`id`, `disaster_event_id`, `reviewed_by`, `tracking_code`, `name`, `age`, `gender`, `physical_description`, `last_seen_location`, `last_seen_at`, `search_status`, `verification_status`, `reporter_name`, `reporter_contact`, `public_contact_note`, `public_consent`, `admin_note`, `rejection_reason`, `reviewed_at`, `created_at`, `updated_at`) VALUES
(2, 65, NULL, 'GSX-0001', 'Yohanes Kogoya', 34, 'male', 'Tinggi sekitar 165 cm, badan kurus, rambut keriting pendek. Memakai kaos hijau dan celana pendek hitam.', 'Kebun warga dekat lokasi longsor, Kabupaten Yahukimo, Papua Pegunungan', '2026-02-18 07:30:00', 'searching', 'approved', 'Maria Kogoya', '081200000001', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(3, 65, NULL, 'GSX-0002', 'Nelius Heluka', 12, 'male', 'Tinggi sekitar 140 cm, rambut keriting, ada bekas luka kecil di dagu kiri. Terakhir memakai seragam sekolah.', 'Jalan setapak menuju sekolah, Kabupaten Yahukimo, Papua Pegunungan', '2026-02-18 06:45:00', 'searching', 'approved', 'Petrus Heluka', '081200000002', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(4, 97, NULL, 'GSX-0003', 'Yustina Jehadut', 58, 'female', 'Tinggi sekitar 150 cm, rambut beruban diikat, memakai kain sarung dan kebaya cokelat.', 'Pondok ladang di lereng bukit, Kabupaten Manggarai Timur, Nusa Tenggara Timur', '2026-01-22 16:20:00', 'searching', 'approved', 'Fransiskus Jehadut', '081200000003', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(5, 24, NULL, 'GSX-0004', 'Slamet Riyadi', 46, 'male', 'Tinggi sekitar 168 cm, badan sedang, kumis tipis. Memakai jaket loreng dan sepatu bot karet.', 'Kebun salak di lereng desa, Kabupaten Polewali Mandar, Sulawesi Barat', '2026-05-15 09:00:00', 'searching', 'approved', 'Sri Wahyuni', '081200000104', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(6, 29, NULL, 'GSX-0005', 'Siti Aminah', 39, 'female', 'Tinggi sekitar 155 cm, berkerudung krem, memakai daster biru. Membawa tas anyaman.', 'Jalan desa dekat sungai, Kota Ambon, Maluku', '2026-05-08 10:00:00', 'searching', 'approved', 'Ahmad Fauzi', '081200000105', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(7, 34, NULL, 'GSX-0006', 'Bagas Pratama', 9, 'male', 'Tinggi sekitar 125 cm, rambut cepak, memakai kaos oranye bergambar kartun.', 'Halaman rumah di pinggir tebing, Kabupaten Cianjur, Jawa Barat', '2026-05-04 11:00:00', 'searching', 'approved', 'Dewi Lestari', '081200000106', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(8, 39, NULL, 'GSX-0007', 'Ni Wayan Sari', 27, 'female', 'Tinggi sekitar 160 cm, rambut panjang diikat, ada tahi lalat di pipi kanan.', 'Warung di tepi jalan raya, Kabupaten Bogor, Jawa Barat', '2026-04-20 12:00:00', 'found', 'approved', 'I Made Surya', '081200000107', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(9, 44, NULL, 'GSX-0008', 'Hasan Basri', 63, 'male', 'Tinggi sekitar 160 cm, rambut putih, memakai peci hitam dan sarung kotak-kotak.', 'Surau di kaki bukit, Kabupaten Bogor, Jawa Barat', '2026-04-15 13:00:00', 'searching', 'approved', 'Nurhayati', '081200000108', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(10, 49, NULL, 'GSX-0009', 'Rina Marlina', 31, 'female', 'Tinggi sekitar 158 cm, rambut sebahu, memakai kemeja putih dan rok panjang hitam.', 'Jalan menuju ladang, Kabupaten Bogor, Jawa Barat', '2026-04-04 14:00:00', 'found', 'approved', 'Dedi Kurniawan', '081200000109', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(11, 54, NULL, 'GSX-0010', 'Anton Sihombing', 52, 'male', 'Tinggi sekitar 172 cm, badan tegap, memakai jaket hitam dan topi rimba.', 'Pos ronda di tikungan jalan, Kabupaten Timor Tengah Selatan, Nusa Tenggara Timur', '2026-03-13 15:00:00', 'searching', 'approved', 'Lastri Sihombing', '081200000110', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(12, 59, NULL, 'GSX-0011', 'Putri Anggraini', 16, 'female', 'Tinggi sekitar 155 cm, rambut panjang, memakai hoodie abu-abu dan celana training.', 'Rumah kos dekat lereng, Kabupaten Sukabumi, Jawa Barat', '2026-02-27 16:00:00', 'searching', 'approved', 'Bambang Susilo', '081200000111', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(13, 64, NULL, 'GSX-0012', 'Darmin', 71, 'male', 'Tinggi sekitar 158 cm, badan kurus, berjalan agak membungkuk, memakai kemeja batik lusuh.', 'Gubuk di tengah sawah terasering, Kabupaten Sukabumi, Jawa Barat', '2026-02-22 17:00:00', 'closed', 'approved', 'Suparti', '081200000112', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(14, 70, NULL, 'GSX-0013', 'Kadek Ari Wibawa', 24, 'male', 'Tinggi sekitar 170 cm, rambut ikal, memakai kaos hitam dan celana jeans.', 'Motor ditemukan di tepi jalan, Kabupaten Tasikmalaya, Jawa Barat', '2026-02-16 18:00:00', 'searching', 'approved', 'Ni Luh Ayu', '081200000113', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(15, 75, NULL, 'GSX-0014', 'Fatimah Zahra', 4, 'female', 'Tinggi sekitar 100 cm, rambut keriting, memakai gelang perak kecil dan baju merah muda.', 'Rumah panggung di pinggir kebun, Kabupaten Cilacap, Jawa Tengah', '2026-02-11 05:00:00', 'searching', 'approved', 'Rahmat Hidayat', '081200000114', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(16, 80, NULL, 'GSX-0015', 'Marthen Tabuni', 41, 'male', 'Tinggi sekitar 170 cm, badan kekar, memakai kaos biru dan celana kain cokelat.', 'Jalur distribusi hasil kebun, Kabupaten Pemalang, Jawa Tengah', '2026-02-06 06:00:00', 'searching', 'approved', 'Esther Tabuni', '081200000115', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(17, 85, NULL, 'GSX-0016', 'Endang Sulastri', 55, 'female', 'Tinggi sekitar 150 cm, rambut pendek beruban, memakai daster bunga-bunga.', 'Dapur rumah di sisi bukit, Kabupaten Bandung, Jawa Barat', '2026-02-01 07:00:00', 'found', 'approved', 'Joko Santoso', '081200000116', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(18, 90, NULL, 'GSX-0017', 'Rizky Maulana', 19, 'male', 'Tinggi sekitar 175 cm, rambut cepak, memakai jaket ojek daring hijau.', 'Jalan alternatif perbukitan, Kabupaten Kupang, Nusa Tenggara Timur', '2026-01-29 08:00:00', 'searching', 'approved', 'Sulaiman', '081200000117', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(19, 95, NULL, 'GSX-0018', 'Lusiana Boru Nainggolan', 36, 'female', 'Tinggi sekitar 157 cm, rambut sebahu, memakai ulos kecil di bahu.', 'Pasar desa di kaki bukit, Kabupaten Bogor, Jawa Barat', '2026-01-23 09:00:00', 'searching', 'approved', 'Hotman Nainggolan', '081200000118', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(20, 101, NULL, 'GSX-0019', 'Arif Setiawan', 28, 'male', 'Tinggi sekitar 168 cm, memakai rompi relawan oranye. Diduga membantu evakuasi warga.', 'Titik evakuasi sementara, Kota Semarang, Jawa Tengah', '2026-01-15 10:00:00', 'closed', 'approved', 'Wulan Setiawan', '081200000119', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(21, 106, NULL, 'GSX-0020', 'Yulita Kaize', 22, 'female', 'Tinggi sekitar 160 cm, rambut panjang, memakai kaos putih dan celana panjang hitam.', 'Kebun keladi di pinggir hutan, Kabupaten Serang, Banten', '2026-01-06 11:00:00', 'searching', 'pending', 'Anike Kaize', '081200000120', NULL, 0, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, NULL, '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(22, 111, NULL, 'GSX-0021', 'Wahyudi', 49, 'male', 'Tinggi sekitar 165 cm, kulit sawo matang, memakai kemeja kotak-kotak merah.', 'Sawah di bawah tebing, Kabupaten Kulon Progo, Daerah Istimewa Yogyakarta', '2025-12-27 12:00:00', 'searching', 'pending', 'Sumiyati', '081200000121', NULL, 0, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, NULL, '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(23, 116, NULL, 'GSX-0022', 'Tidak diketahui', NULL, 'unknown', 'Laporan tanpa identitas lengkap.', 'Lokasi tidak jelas, Kabupaten Lebak, Banten', '2025-12-21 13:00:00', 'searching', 'rejected', 'Anonim', '081200000122', NULL, 0, 'DATA CONTOH untuk demo - bukan orang sungguhan.', 'Data laporan tidak lengkap dan tidak dapat diverifikasi (data contoh).', '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(24, 121, NULL, 'GSX-0023', 'Dewi Kartika', 33, 'female', 'Tinggi sekitar 162 cm, rambut panjang dikuncir, memakai blus biru muda.', 'Rumah makan di tepi jalan nasional, Kabupaten Bandung, Jawa Barat', '2025-12-18 14:00:00', 'searching', 'approved', 'Yoga Pratama', '081200000123', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(25, 126, NULL, 'GSX-0024', 'Gregorius Nong', 67, 'male', 'Tinggi sekitar 163 cm, rambut putih tipis, memakai kemeja putih dan sarung tenun.', 'Kebun kopi di lereng, Kabupaten Bandung, Jawa Barat', '2025-12-13 15:00:00', 'searching', 'approved', 'Katarina Nong', '081200000124', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03'),
(26, 131, NULL, 'GSX-0025', 'Aisyah Rahmawati', 7, 'female', 'Tinggi sekitar 115 cm, rambut kepang dua, memakai seragam SD merah putih.', 'Jalan pulang dari sekolah, Kabupaten Bandung Barat, Jawa Barat', '2025-12-05 16:00:00', 'found', 'approved', 'Imam Rahmawan', '081200000125', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1, 'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, '2026-11-16 16:34:03', '2026-11-16 09:34:03', '2026-11-16 09:34:03');

-- --------------------------------------------------------

--
-- Table structure for table `missing_person_documents`
--

CREATE TABLE `missing_person_documents` (
  `id` bigint UNSIGNED NOT NULL,
  `missing_person_id` bigint UNSIGNED NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `file_type` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `caption` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'admin',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'dian', 'email@gmal.com', '$2a$10$y5nRL7ENhR7zyq9R14zUVui/DenmViohK86BAm4L3kGaIJ74exeye', 'admin', 1, '2026-11-13 22:48:31', '2026-11-13 22:48:31'),
(2, 'anonim', 'aku@gmail.com', '$2a$10$NFbC.aj5Q59OkQsoD8TvBeMFys4ziS2hb9pdPBqSY/sA.mrRggFhq', 'admin', 1, '2026-11-16 00:27:59', '2026-11-16 00:31:56');

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
  ADD UNIQUE KEY `uq_events_source_external` (`data_source_id`,`external_id`),
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
-- Indexes for table `import_logs`
--
ALTER TABLE `import_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_import_source` (`data_source_id`);

--
-- Indexes for table `missing_persons`
--
ALTER TABLE `missing_persons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tracking_code` (`tracking_code`),
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
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `data_sources`
--
ALTER TABLE `data_sources`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `disaster_events`
--
ALTER TABLE `disaster_events`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=651;

--
-- AUTO_INCREMENT for table `disaster_reports`
--
ALTER TABLE `disaster_reports`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `event_documents`
--
ALTER TABLE `event_documents`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `import_logs`
--
ALTER TABLE `import_logs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `missing_persons`
--
ALTER TABLE `missing_persons`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `missing_person_documents`
--
ALTER TABLE `missing_person_documents`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
-- Constraints for table `import_logs`
--
ALTER TABLE `import_logs`
  ADD CONSTRAINT `fk_import_source` FOREIGN KEY (`data_source_id`) REFERENCES `data_sources` (`id`) ON DELETE SET NULL;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
