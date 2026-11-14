-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 13 Nov 2026 pada 18.18
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

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
-- Struktur dari tabel `articles`
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
-- Struktur dari tabel `data_sources`
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

--
-- Dumping data untuk tabel `data_sources`
--

INSERT INTO `data_sources` (`id`, `name`, `url`, `data_period`, `retrieved_at`, `format`, `limitations`, `created_at`, `updated_at`) VALUES
(1, 'Data kejadian tanah longsor (impor awal)', NULL, '2026-01-01 s/d 2026-11-03', '2026-11-05', 'XLSX', NULL, '2026-11-06 22:15:59', '2026-11-06 22:15:59');

-- --------------------------------------------------------

--
-- Struktur dari tabel `disaster_events`
--

CREATE TABLE `disaster_events` (
  `id` bigint(20) UNSIGNED NOT NULL,
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
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `disaster_events`
--

INSERT INTO `disaster_events` (`id`, `data_source_id`, `external_id`, `created_by`, `title`, `event_date`, `province`, `regency`, `district`, `village`, `latitude`, `longitude`, `description`, `deaths`, `missing`, `injured`, `displaced`, `houses_damaged`, `source_note`, `verification_status`, `created_at`, `updated_at`) VALUES
(1, 1, 'd048f683-a26c-4b67-9a71-fb120395b7ae', NULL, 'Tanah Longsor', '2026-11-03', 'Aceh', 'Kabupaten Gayo Lues', NULL, NULL, 3.9551650, 97.3516558, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(2, 1, 'a68fa70e-6358-4e5b-8979-22fe3303ad9e', NULL, 'Tanah Longsor', '2026-11-02', 'Jawa Timur', 'Kabupaten Pacitan', NULL, NULL, -8.2046140, 111.0876900, NULL, 0, 0, 0, 25, 5, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(3, 1, 'a4d85c6f-534d-4eff-a497-826b5deba1b0', NULL, 'Tanah Longsor', '2026-10-31', 'Jawa Timur', 'Kabupaten Malang', NULL, NULL, -8.0495643, 112.6884549, NULL, 0, 0, 0, 120, 24, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(4, 1, '0708b10b-797c-4f34-8630-0311a97159e3', NULL, 'Tanah Longsor', '2026-10-30', 'Jawa Tengah', 'Kabupaten Banjarnegara', NULL, NULL, -7.4027060, 109.6813960, NULL, 0, 0, 0, 35, 8, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(5, 1, '787b61f5-bc26-4c03-a5d2-c724096d4e02', NULL, 'Tanah Longsor', '2026-10-28', 'Sumatera Utara', 'Kabupaten Simalungun', NULL, NULL, 2.9781612, 99.2785583, NULL, 0, 0, 0, 450, 88, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(6, 1, 'b6a30d49-6484-4202-96ab-d3bb47666f83', NULL, 'Tanah Longsor', '2026-10-27', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8937121, 107.4321959, NULL, 0, 0, 0, 44, 10, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(7, 1, '130204f5-435b-432d-8d9e-98e634a0d7eb', NULL, 'Gerakan Tanah', '2026-10-12', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 2, 1, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(8, 1, '2528732d-abe3-4dc3-9241-e8a797c123c6', NULL, 'Tanah Longsor', '2026-10-06', 'Jawa Tengah', 'Kabupaten Pemalang', NULL, NULL, -6.8842340, 109.3779980, NULL, 2, 0, 0, 0, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(9, 1, 'a32f256f-8321-4146-9720-072dc5d54172', NULL, 'Tanah Longsor', '2026-09-14', 'Aceh', 'Kabupaten Aceh Tengah', NULL, NULL, 4.4482641, 96.8350999, NULL, 1, 0, 13, 15, 4, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(10, 1, '034be947-3fa4-4e75-8865-5e1f832f5c03', NULL, 'Tanah Longsor', '2026-09-05', 'Nusa Tenggara Barat', 'Kabupaten Sumbawa', NULL, NULL, -8.6529334, 117.3616476, NULL, 3, 0, 6, 0, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(11, 1, 'f8a613ec-82d3-4e19-b76b-5dd9d89fa547', NULL, 'Tanah Longsor', '2026-08-13', 'Gorontalo', 'Kabupaten Pohuwato', NULL, NULL, 0.7055278, 121.7195459, NULL, 6, 0, 0, 0, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(12, 1, 'd8e1f01a-67d9-4f78-9783-753452fa88aa', NULL, 'Tanah Longsor', '2026-07-25', 'Jawa Tengah', 'Kabupaten Banyumas', NULL, NULL, -7.4832133, 109.1404380, NULL, 0, 0, 0, 5000, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(13, 1, 'c4572b3b-eeeb-4f75-aa12-83360560cddd', NULL, 'Tanah Longsor', '2026-07-24', 'Sulawesi Selatan', 'Kabupaten Bone', NULL, NULL, -2.0833330, 120.2166670, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(14, 1, 'c1cd3b9a-e8a8-44d5-98f6-61d831f04e78', NULL, 'Tanah Longsor', '2026-07-22', 'Sulawesi Selatan', 'Kabupaten Toraja Utara', NULL, NULL, -2.8621942, 119.8352303, NULL, 0, 0, 0, 65, 11, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(15, 1, '9b38055b-a64b-4883-9545-102119e87d90', NULL, 'Tanah Longsor', '2026-07-19', 'Sumatera Selatan', 'Kabupaten Musi Banyuasin', NULL, NULL, -2.5442029, 103.7289167, NULL, 0, 0, 0, 12, 10, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(16, 1, '1a1adf9e-3eea-486f-99a4-6cc23ceb18a6', NULL, 'Tanah Longsor', '2026-07-07', 'Kalimantan Utara', 'Kabupaten Nunukan', NULL, NULL, 4.0609227, 117.6669520, NULL, 0, 0, 0, 1507, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(17, 1, '027251dd-71c3-4f1a-899a-77c76f2da820', NULL, 'Tanah Longsor', '2026-06-22', 'Nusa Tenggara Timur', 'Kabupaten Timor Tengah Selatan', NULL, NULL, -9.7762816, 124.4198243, NULL, 0, 0, 0, 39, 10, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(18, 1, 'ec642c7c-ddcb-4423-8820-9a3ba0da2938', NULL, 'Tanah Longsor', '2026-06-16', 'Riau', 'Kabupaten Indragiri Hilir', NULL, NULL, -0.1456733, 102.9896150, NULL, 0, 0, 0, 85, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(19, 1, '479ca5c4-7360-4e51-94fd-6c31fb8f4eca', NULL, 'Tanah Longsor', '2026-06-16', 'Aceh', 'Kabupaten Aceh Jaya', NULL, NULL, 4.7873684, 95.6457951, NULL, 3, 0, 4, 0, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(20, 1, '8cfac6f5-fcb6-41a5-8fca-782c6afb97d2', NULL, 'Tanah Longsor', '2026-06-03', 'Sulawesi Selatan', 'Kabupaten Sinjai', NULL, NULL, -5.2171961, 120.1127350, NULL, 0, 0, 0, 35, 1, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(21, 1, '87ab49c5-91af-4bbe-944b-f798b6513e6e', NULL, 'Tanah Longsor', '2026-05-30', 'Sulawesi Selatan', 'Kabupaten Sidenreng Rappang', NULL, NULL, -3.7738981, 120.0202964, NULL, 0, 0, 0, 614, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(22, 1, '0611183c-d3ff-453c-a2ce-1abfc6f64d91', NULL, 'Tanah Longsor', '2026-05-18', 'Sumatera Utara', 'Kabupaten Tapanuli Selatan', NULL, NULL, 1.5774933, 99.2785583, NULL, 2, 0, 0, 0, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(23, 1, '13e29778-a524-4399-b000-3bee48fc8207', NULL, 'Tanah Longsor', '2026-05-16', 'Jawa Tengah', 'Kabupaten Temanggung', NULL, NULL, -7.3166690, 110.1747970, NULL, 0, 0, 0, 400, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(24, 1, 'eb5e2a27-b145-408c-a51d-61921693fd43', NULL, 'Tanah Longsor', '2026-05-15', 'Sulawesi Barat', 'Kabupaten Polewali Mandar', NULL, NULL, -3.3419323, 119.1390642, NULL, 0, 0, 2, 495, 4, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(25, 1, '21b00195-961e-47eb-b842-af3f551e0a02', NULL, 'Tanah Longsor', '2026-05-15', 'Jawa Barat', 'Kabupaten Subang', NULL, NULL, -6.5693610, 107.7524030, NULL, 2, 0, 0, 0, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(26, 1, '89f11aae-d21e-4a63-9ce1-5b625b08a8e4', NULL, 'Tanah Longsor', '2026-05-15', 'Sulawesi Selatan', 'Kabupaten Sinjai', NULL, NULL, -5.2171961, 120.1127350, NULL, 0, 0, 0, 32, 2, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(27, 1, 'ae240592-44dd-4bf7-8214-2ddc749c3df8', NULL, 'Gerakan Tanah', '2026-05-12', 'Jawa Tengah', 'Kabupaten Cilacap', NULL, NULL, -7.7333330, 109.0000000, NULL, 0, 0, 0, 75, 11, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(28, 1, 'e84cf918-7c36-4d00-9ca9-87b6ccdeacd7', NULL, 'Tanah Longsor', '2026-05-11', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.3333333, 108.3500000, NULL, 0, 0, 0, 58, 10, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(29, 1, 'cbcf9a2e-612d-49bf-b46d-ea165e3bab21', NULL, 'Tanah Longsor', '2026-05-08', 'Maluku', 'Kota Ambon', NULL, NULL, -3.6560700, 128.1664190, NULL, 0, 0, 0, 49, 8, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(30, 1, 'f961da99-7b83-4ebe-bfba-b081df1e5e25', NULL, 'Tanah Longsor', '2026-05-05', 'Sumatera Barat', 'Kabupaten Agam', NULL, NULL, -0.2209392, 100.1703257, NULL, 1, 0, 6, 29, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(31, 1, '870d3442-995c-4531-bd7e-3c28c468b1a5', NULL, 'Tanah Longsor', '2026-05-05', 'Sumatera Utara', 'Kabupaten Tapanuli Utara', NULL, NULL, 2.0405246, 99.1013498, NULL, 3, 0, 1, 0, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(32, 1, '69a87e35-eec1-4b53-886b-5e522f783325', NULL, 'Tanah Longsor', '2026-05-05', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(33, 1, 'e05da799-991e-4bd6-af1f-b4b68525b726', NULL, 'Tanah Longsor', '2026-05-04', 'Jawa Tengah', 'Kota Semarang', NULL, NULL, -6.9666667, 110.4166667, NULL, 0, 0, 0, 22, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(34, 1, 'c74e8642-4ef6-4e18-a90a-f2b57a1fc69b', NULL, 'Tanah Longsor', '2026-05-04', 'Jawa Barat', 'Kabupaten Cianjur', NULL, NULL, -6.8172531, 107.1307289, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(35, 1, '6d52ee1f-77a9-472e-986c-67094074e95b', NULL, 'Tanah Longsor', '2026-05-04', 'Jawa Barat', 'Kota Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 54, 9, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(36, 1, '6c2b3dfd-7fcb-479e-9ad1-5e746dd34d80', NULL, 'Tanah Longsor', '2026-05-04', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 100, 13, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(37, 1, 'aabba1f1-f410-42e9-a9b0-4daaf19b79e3', NULL, 'Tanah Longsor', '2026-05-03', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 1, 0, 0, 8, 2, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(38, 1, 'ebda7b3e-c90c-4ebc-9980-fe888cb5570c', NULL, 'Tanah Longsor', '2026-05-01', 'Nusa Tenggara Timur', 'Kabupaten Timor Tengah Selatan', NULL, NULL, -9.7762816, 124.4198243, NULL, 0, 0, 0, 26, 6, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(39, 1, '335fd114-56b9-491d-b752-d8b19622aca5', NULL, 'Tanah Longsor', '2026-04-20', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 137, 33, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(40, 1, '4804c87b-08e8-45da-bed0-f15e0e801d4c', NULL, 'Tanah Longsor', '2026-04-19', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 80, 19, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(41, 1, 'bdf23382-aa84-4aae-8176-846746d3f016', NULL, 'Tanah Longsor', '2026-04-18', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 68, 8, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(42, 1, 'c08a09d1-34bb-4155-80c8-50db0b9e1819', NULL, 'Tanah Longsor', '2026-04-17', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 55, 5, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(43, 1, 'b506db98-c76f-4012-9673-9cc3a7bd9f4c', NULL, 'Tanah Longsor', '2026-04-16', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 22, 5, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(44, 1, '22ea9988-3c82-44d8-b8de-198f906a03a4', NULL, 'Tanah Longsor', '2026-04-15', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 19, 5, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(45, 1, '5d384611-d431-43b3-b223-0e2870131a58', NULL, 'Tanah Longsor', '2026-04-15', 'Jawa Timur', 'Kabupaten Pacitan', NULL, NULL, -8.2046140, 111.0876900, NULL, 0, 0, 0, 185, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(46, 1, '2271a4d9-3136-4816-904d-c887eecadfcf', NULL, 'Tanah Longsor', '2026-04-12', 'Jawa Tengah', 'Kabupaten Purbalingga', NULL, NULL, -7.3907470, 109.3638000, NULL, 1, 0, 1, 11, 3, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(47, 1, '46b02ef5-88da-4683-a912-bace4b8a0069', NULL, 'Tanah Longsor', '2026-04-09', 'Sumatera Utara', 'Kabupaten Nias Selatan', NULL, NULL, 0.7086091, 97.8286368, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(48, 1, '838d268c-963d-4fdf-ac23-b59a59f04889', NULL, 'Tanah Longsor', '2026-04-07', 'Sumatera Utara', 'Kabupaten Deli Serdang', NULL, NULL, 3.4201802, 98.7040750, NULL, 5, 0, 1, 0, 7, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(49, 1, 'a187b53c-1dc0-4545-90cd-0f5236274e33', NULL, 'Tanah Longsor', '2026-04-04', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 74, 12, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(50, 1, 'ceb4d710-f769-4937-bbb6-0a0d27d9ead4', NULL, 'Tanah Longsor', '2026-03-16', 'Kalimantan Utara', 'Kabupaten Malinau', NULL, NULL, 3.5842210, 116.6477970, NULL, 0, 0, 0, 30, 5, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(51, 1, 'ea5d5919-b8b0-4b7d-a03f-62520b9b6eb3', NULL, 'Tanah Longsor', '2026-03-16', 'Nusa Tenggara Timur', 'Kabupaten Sumba Barat Daya', NULL, NULL, -9.5391390, 119.1390642, NULL, 2, 0, 1, 0, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(52, 1, '678293b3-d76b-4aaf-ab11-cd1a7fbe6195', NULL, 'Tanah Longsor', '2026-03-15', 'Jawa Tengah', 'Kota Semarang', NULL, NULL, -6.9666667, 110.4166667, NULL, 0, 0, 0, 0, 5, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(53, 1, '097db4b5-92d8-4ede-9fe0-f907bf548b75', NULL, 'Tanah Longsor', '2026-03-15', 'Jawa Timur', 'Kabupaten Blitar', NULL, NULL, -8.1014419, 112.1627620, NULL, 1, 0, 0, 5, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(54, 1, '2d8aaa60-1e86-498f-8b4e-9bc8269bd428', NULL, 'Tanah Longsor', '2026-03-13', 'Nusa Tenggara Timur', 'Kabupaten Timor Tengah Selatan', NULL, NULL, -9.7762816, 124.4198243, NULL, 0, 0, 0, 31, 7, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(55, 1, 'e8e4f192-48e7-46d1-993e-63fbe20d2bc7', NULL, 'Tanah Longsor', '2026-03-12', 'Jawa Barat', 'Kabupaten Ciamis', NULL, NULL, -7.3333333, 108.3500000, NULL, 0, 0, 0, 0, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(56, 1, '33bcd962-7fde-4dc4-85d4-e6fb193409d9', NULL, 'Tanah Longsor', '2026-03-08', 'Jawa Barat', 'Kota Bekasi', NULL, NULL, -6.2333333, 107.0000000, NULL, 7, 0, 0, 6, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(57, 1, '5be0c588-5792-4453-93db-e397c3017104', NULL, 'Tanah Longsor', '2026-03-06', 'Nusa Tenggara Timur', 'Kabupaten Sikka', NULL, NULL, -8.6766175, 122.1291843, NULL, 0, 0, 0, 55, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(58, 1, 'bcf066a9-57e5-428c-b9ad-7d27a2b104a4', NULL, 'Tanah Longsor', '2026-03-03', 'Nusa Tenggara Timur', 'Kabupaten Timor Tengah Selatan', NULL, NULL, -9.7762816, 124.4198243, NULL, 0, 0, 0, 34, 5, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(59, 1, '178d8b13-9133-4bf6-b947-9fa5088f3e19', NULL, 'Gerakan Tanah', '2026-02-27', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9240500, 106.9222030, NULL, 0, 0, 0, 104, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(60, 1, '12212eb8-57cd-4193-adc6-c90f78ab5527', NULL, 'Gerakan Tanah', '2026-02-27', 'Daerah Istimewa Yogyakarta', 'Kabupaten Bantul', NULL, NULL, -7.8846111, 110.3341111, NULL, 0, 0, 0, 10, 6, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(61, 1, '38589b9e-0258-49e8-9fc9-0e68a65bf5f9', NULL, 'Tanah Longsor', '2026-02-24', 'Nusa Tenggara Timur', 'Kabupaten Kupang', NULL, NULL, -10.1833333, 123.5833333, NULL, 0, 0, 0, 235, 47, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(62, 1, '2c156d5b-1aab-46aa-a701-4ff302cbc723', NULL, 'Tanah Longsor', '2026-02-23', 'Jawa Timur', 'Kabupaten Bondowoso', NULL, NULL, -7.9177040, 113.8134830, NULL, 0, 0, 0, 30, 6, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(63, 1, '76a83541-8e58-4306-b20c-fe4d06690b73', NULL, 'Gerakan Tanah', '2026-02-22', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9240500, 106.9222030, NULL, 0, 0, 0, 886, 144, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(64, 1, '4a3dfe35-662a-4bff-9903-f8322bdef525', NULL, 'Tanah Longsor', '2026-02-22', 'Jawa Barat', 'Kabupaten Sukabumi', NULL, NULL, -6.9240500, 106.9222030, NULL, 0, 0, 0, 259, 10, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(65, 1, '05e5c8a2-7503-414a-8a03-5953b6d007da', NULL, 'Tanah Longsor', '2026-02-18', 'Papua Pegunungan', 'Kabupaten Yahukimo', NULL, NULL, -4.4939717, 139.5279996, NULL, 0, 2, 2, 1020, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(66, 1, '23c3c528-0cfd-4c35-9cb1-6047eb3effa3', NULL, 'Tanah Longsor', '2026-02-18', 'Jawa Timur', 'Kabupaten Pacitan', NULL, NULL, -8.2046140, 111.0876900, NULL, 0, 0, 0, 75, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(67, 1, 'd045d620-880c-4367-8afe-0dec29c47d19', NULL, 'Tanah Longsor', '2026-02-18', 'Sulawesi Tengah', 'Kabupaten Morowali', NULL, NULL, -2.3003072, 121.5370003, NULL, 1, 0, 0, 0, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(68, 1, '130bb973-95db-42f7-8957-02f5aa31b5e0', NULL, 'Tanah Longsor', '2026-02-17', 'Daerah Istimewa Yogyakarta', 'Kabupaten Gunung Kidul', NULL, NULL, -8.0305091, 110.6168921, NULL, 0, 0, 0, 278, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(69, 1, 'd207cfb2-2e50-462b-b7a1-93242f91c230', NULL, 'Gerakan Tanah', '2026-02-16', 'Nusa Tenggara Timur', 'Kabupaten Belu', NULL, NULL, -9.4125796, 124.9506625, NULL, 0, 0, 0, 35, 7, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(70, 1, '5c59177f-6f93-4ead-bcf2-c1729a868ca1', NULL, 'Gerakan Tanah', '2026-02-16', 'Jawa Barat', 'Kabupaten Tasikmalaya', NULL, NULL, -7.3279540, 108.2141040, NULL, 0, 0, 0, 25, 5, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(71, 1, '83dc4041-c064-41e6-b76b-92b07cf68d65', NULL, 'Tanah Longsor', '2026-02-14', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 76, 3, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(72, 1, 'c59ffb06-24e5-4257-b069-42ab9ebd00fd', NULL, 'Tanah Longsor', '2026-02-14', 'Jawa Tengah', 'Kabupaten Cilacap', NULL, NULL, -7.7333330, 109.0000000, NULL, 0, 0, 0, 64, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(73, 1, '147c6df2-02ca-4eb9-b2f0-f4d8c3678891', NULL, 'Gerakan Tanah', '2026-02-14', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 20, 5, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(74, 1, '1f9ca418-e64d-4083-bbf2-cd6c9e2f1d09', NULL, 'Tanah Longsor', '2026-02-13', 'Jawa Barat', 'Kabupaten Majalengka', NULL, NULL, -6.8531026, 108.2258897, NULL, 0, 0, 0, 50, 2, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(75, 1, 'a932676d-9fdd-4412-a71a-bcda23a83748', NULL, 'Tanah Longsor', '2026-02-11', 'Jawa Tengah', 'Kabupaten Cilacap', NULL, NULL, -7.7333330, 109.0000000, NULL, 0, 0, 0, 199, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(76, 1, '6510ad8e-8202-47c7-b530-caef72608f09', NULL, 'Tanah Longsor', '2026-02-11', 'Jawa Tengah', 'Kabupaten Banyumas', NULL, NULL, -7.4832133, 109.1404380, NULL, 0, 0, 0, 50, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(77, 1, '5f281e4f-4493-46d6-aaaa-eea34b0d74e9', NULL, 'Tanah Longsor', '2026-02-11', 'Sumatera Utara', 'Kabupaten Nias Selatan', NULL, NULL, 0.7086091, 97.8286368, NULL, 0, 0, 0, 45, 9, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(78, 1, 'c6eb66f9-380e-49af-b3a4-61b372d5e3ef', NULL, 'Tanah Longsor', '2026-02-08', 'Jawa Tengah', 'Kabupaten Banjarnegara', NULL, NULL, -7.4027060, 109.6813960, NULL, 0, 0, 0, 87, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(79, 1, '701b1af5-5069-4a82-91b9-4c15ab6e4efb', NULL, 'Tanah Longsor', '2026-02-07', 'Jawa Tengah', 'Kabupaten Wonosobo', NULL, NULL, -7.3621090, 109.8993990, NULL, 1, 0, 1, 5, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(80, 1, '2dc42f67-d678-4157-a6cc-9e671e0b9d69', NULL, 'Tanah Longsor', '2026-02-06', 'Jawa Tengah', 'Kabupaten Pemalang', NULL, NULL, -6.8842340, 109.3779980, NULL, 1, 0, 0, 3, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(81, 1, '0d151116-1def-4c07-aff1-24d01c743447', NULL, 'Gerakan Tanah', '2026-02-03', 'Jawa Barat', 'Kabupaten Garut', NULL, NULL, -7.2279060, 107.9086990, NULL, 0, 0, 0, 148, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(82, 1, '5b6506e0-9a99-46eb-b955-fb725d1b5910', NULL, 'Gerakan Tanah', '2026-02-02', 'Jawa Tengah', 'Kabupaten Tegal', NULL, NULL, -6.8666667, 109.1333333, NULL, 0, 0, 0, 3596, 691, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(83, 1, '34dcc487-2333-4d93-becb-cc92a6e9981a', NULL, 'Tanah Longsor', '2026-02-02', 'Kepulauan Bangka Belitung', 'Kabupaten Bangka', NULL, NULL, -2.2884782, 106.0640179, NULL, 7, 0, 0, 0, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(84, 1, 'a21bdc48-c21d-45d2-9bde-413510e7ad5c', NULL, 'Tanah Longsor', '2026-02-02', 'Jawa Barat', 'Kabupaten Bandung', NULL, NULL, -6.9147444, 107.6098111, NULL, 1, 0, 0, 53, 1, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(85, 1, 'aa5e62a2-3b79-4321-b410-e29f1565bb4d', NULL, 'Tanah Longsor', '2026-02-01', 'Jawa Barat', 'Kabupaten Bandung', NULL, NULL, -6.9147444, 107.6098111, NULL, 2, 0, 0, 0, 1, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(86, 1, '1c5ad8de-71eb-4c10-87b4-049251f21147', NULL, 'Tanah Longsor', '2026-01-30', 'Jawa Tengah', 'Kabupaten Brebes', NULL, NULL, -6.8833333, 109.0500000, NULL, 0, 0, 0, 688, 143, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(87, 1, '03fbb81f-baa9-4ff3-9f98-54ed5b7e0c26', NULL, 'Gerakan Tanah', '2026-01-30', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 57, 11, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(88, 1, '013323a2-6a22-4968-b8ac-bf0f016997d8', NULL, 'Tanah Longsor', '2026-01-29', 'Jawa Barat', 'Kota Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 1, 0, 0, 90, 6, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(89, 1, 'dcc270fb-238f-4b73-84e8-6a2f5d99c4a1', NULL, 'Gerakan Tanah', '2026-01-29', 'Sulawesi Tengah', 'Kabupaten Morowali', NULL, NULL, -2.3003072, 121.5370003, NULL, 0, 0, 0, 288, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(90, 1, '061ddf20-6a72-4354-89bd-cd6ab45fe5f8', NULL, 'Tanah Longsor', '2026-01-29', 'Nusa Tenggara Timur', 'Kabupaten Kupang', NULL, NULL, -10.1833333, 123.5833333, NULL, 0, 0, 0, 80, 20, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(91, 1, '97794dfc-4ab6-45bb-896f-8a2b077b9e2b', NULL, 'Gerakan Tanah', '2026-01-29', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 157, 25, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(92, 1, 'c7afe657-1f96-43cc-bedf-ec673de3398a', NULL, 'Tanah Longsor', '2026-01-24', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 18, 5, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(93, 1, 'e82d6d5a-e2a2-4d4c-9992-b513ecfa373c', NULL, 'Gerakan Tanah', '2026-01-24', 'Jawa Tengah', 'Kota Semarang', NULL, NULL, -6.9666667, 110.4166667, NULL, 0, 0, 0, 69, 16, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(94, 1, '26f37b78-ba52-453e-947c-fbc0e2355a23', NULL, 'Tanah Longsor', '2026-01-24', 'Jawa Barat', 'Kabupaten Bandung Barat', NULL, NULL, -6.8937121, 107.4321959, NULL, 94, 0, 0, 233, 48, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(95, 1, 'b9f277d2-1caa-4af0-a914-c1d7f0446ad8', NULL, 'Gerakan Tanah', '2026-01-23', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 42, 9, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(96, 1, '297864bb-5c5d-4b46-9ea2-7e6b1007b241', NULL, 'Tanah Longsor', '2026-01-23', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 148, 42, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(97, 1, '4d3ba95e-b849-41d8-bb97-9ff9f0e2d658', NULL, 'Tanah Longsor', '2026-01-22', 'Nusa Tenggara Timur', 'Kabupaten Manggarai Timur', NULL, NULL, -8.6206712, 120.6199895, NULL, 2, 1, 0, 227, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(98, 1, '47f8fafc-55e5-4340-bc42-65730fa97a2c', NULL, 'Tanah Longsor', '2026-01-17', 'Jawa Timur', 'Kabupaten Ponorogo', NULL, NULL, -7.8678270, 111.4660030, NULL, 0, 0, 0, 500, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(99, 1, '1230f97f-7e74-414d-8f76-861b919dbe7b', NULL, 'Gerakan Tanah', '2026-01-17', 'Jawa Timur', 'Kabupaten Pamekasan', NULL, NULL, -7.1666667, 113.4666667, NULL, 0, 0, 0, 124, 16, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(100, 1, 'c34f385c-52b4-4f8f-bf00-13449f0d5dcf', NULL, 'Tanah Longsor', '2026-01-16', 'Jawa Tengah', 'Kabupaten Batang', NULL, NULL, -6.8941111, 109.7234519, NULL, 0, 0, 0, 35, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(101, 1, 'bdc87e9f-229d-4209-95fb-f334617f5e62', NULL, 'Tanah Longsor', '2026-01-15', 'Jawa Tengah', 'Kota Semarang', NULL, NULL, -6.9666667, 110.4166667, NULL, 0, 0, 0, 36, 7, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(102, 1, 'd88a064a-02bc-47ca-9bf9-dace556f7929', NULL, 'Tanah Longsor', '2026-01-12', 'Jawa Barat', 'Kabupaten Bogor', NULL, NULL, -6.6000000, 106.8000000, NULL, 0, 0, 0, 30, 5, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(103, 1, '86f65707-8069-46de-863a-ec89c3f75aac', NULL, 'Tanah Longsor', '2026-01-09', 'Jawa Tengah', 'Kabupaten Jepara', NULL, NULL, -6.5596059, 110.6717000, NULL, 0, 0, 0, 3647, 29, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(104, 1, 'cca7630c-bc36-4c1e-b36f-6928bec2850b', NULL, 'Tanah Longsor', '2026-01-09', 'Jawa Tengah', 'Kabupaten Kudus', NULL, NULL, -6.8040870, 110.8382030, NULL, 1, 0, 0, 119, 35, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(105, 1, '8352954a-81e6-4af4-b2d5-e1d64195ff86', NULL, 'Gerakan Tanah', '2026-01-08', 'Jawa Tengah', 'Kabupaten Banjarnegara', NULL, NULL, -7.4027060, 109.6813960, NULL, 0, 0, 0, 66, 0, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(106, 1, '587b2a0f-a0bd-4316-a9d9-8d858f18f43b', NULL, 'Tanah Longsor', '2026-01-06', 'Banten', 'Kabupaten Serang', NULL, NULL, -6.1200900, 106.1502990, NULL, 0, 0, 0, 536, 54, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(107, 1, 'fb6b5433-cad1-4a5e-a348-3a6f23edd015', NULL, 'Tanah Longsor', '2026-01-05', 'Jawa Tengah', 'Kabupaten Blora', NULL, NULL, -6.9500000, 111.4166667, NULL, 0, 0, 0, 30, 6, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(108, 1, 'd12ad1eb-2425-4d02-a3b9-d817af15796a', NULL, 'Tanah Longsor', '2026-01-04', 'Jawa Barat', 'Kabupaten Karawang', NULL, NULL, -6.3227303, 107.3375791, NULL, 0, 0, 0, 20, 6, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(109, 1, 'e923c4c7-24b3-4625-84d9-78c72b35305f', NULL, 'Tanah Longsor', '2026-01-01', 'Jawa Tengah', 'Kabupaten Banjarnegara', NULL, NULL, -7.4027060, 109.6813960, NULL, 0, 0, 1, 221, 11, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(110, 1, '07662d5a-d2d6-483a-ae7c-ae8756a9fa3a', NULL, 'Gerakan Tanah', '2026-01-01', 'Jawa Tengah', 'Kabupaten Banjarnegara', NULL, NULL, -7.4027060, 109.6813960, NULL, 0, 0, 0, 206, 11, NULL, 'verified', '2026-11-10 09:03:41', '2026-11-10 09:10:20'),
(111, 1, 'd72cb2d0-deaa-11f1-a865-72fa90e1b7f2', NULL, 'Tanah Longsor', '2026-01-24', 'Jawa Barat', 'Kabupaten Bandung Barat', 'Cisarua', 'Pasirlangu', -6.7958290, 107.5366700, 'Longsor dari lereng Gunung Burangrang menimpa Kampung Pasir Kuning dan Pasir Kuda. Operasi SAR 22 hari ditutup 15 Feb 2026: 101 kantong jenazah, 83 teridentifikasi, 20 hilang.', 83, 20, 0, 0, 48, 'Media Indonesia 15 Feb 2026: https://www.metrotvnews.com/read/b2lC6O8D-operasi-sar-ditutup-20-korban-longsor-cisarua-masih-hilang | Koordinat: RSOE EDIS https://rsoe-edis.org/eventList/details/1025896/5', 'verified', '2026-11-12 15:07:56', '2026-11-12 15:07:56'),
(112, 1, 'd72e726e-deaa-11f1-a865-72fa90e1b7f2', NULL, 'Tanah Longsor', '2025-11-15', 'Jawa Tengah', 'Kabupaten Banjarnegara', 'Pandanarum', 'Pandanarum', -7.3518819, 109.6574190, 'Longsor di Dusun Situkung, Desa Pandanarum, dipicu hujan lebat. Operasi SAR ditutup 25 Nov 2025 (hari ke-10): 17 korban ditemukan (termasuk 2 potongan tubuh), 11 hilang.', 17, 11, 0, 1019, 206, 'BNPB via Media Indonesia 25 Nov 2025: https://www.metrotvnews.com/read/k8oCQRwL-bnpb-operasi-sar-longsor-banjarnegara-ditutup-11-orang-masih-hilang | Koordinat: AHA Centre https://adinet.ahacentre.org/report/indonesia-landslides-in-banjarnegara-central-java-20251115', 'verified', '2026-11-12 15:07:56', '2026-11-12 15:07:56');

-- --------------------------------------------------------

--
-- Struktur dari tabel `disaster_reports`
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
-- Struktur dari tabel `event_documents`
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
-- Struktur dari tabel `import_logs`
--

CREATE TABLE `import_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `data_source_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('success','partial','failed') NOT NULL,
  `total_rows` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `inserted_rows` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `failed_rows` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `error_message` text DEFAULT NULL,
  `started_at` datetime DEFAULT NULL,
  `finished_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `missing_persons`
--

CREATE TABLE `missing_persons` (
  `id` bigint(20) UNSIGNED NOT NULL,
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
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `missing_person_documents`
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
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin') NOT NULL DEFAULT 'admin',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_articles_author` (`author_id`),
  ADD KEY `idx_article_published` (`is_published`);

--
-- Indeks untuk tabel `data_sources`
--
ALTER TABLE `data_sources`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `disaster_events`
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
-- Indeks untuk tabel `disaster_reports`
--
ALTER TABLE `disaster_reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tracking_code` (`tracking_code`),
  ADD KEY `fk_reports_event` (`disaster_event_id`),
  ADD KEY `fk_reports_reviewer` (`reviewed_by`),
  ADD KEY `idx_report_status` (`status`),
  ADD KEY `idx_report_date` (`event_date`);

--
-- Indeks untuk tabel `event_documents`
--
ALTER TABLE `event_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_documents_event` (`disaster_event_id`),
  ADD KEY `fk_documents_report` (`disaster_report_id`);

--
-- Indeks untuk tabel `import_logs`
--
ALTER TABLE `import_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_import_source` (`data_source_id`);

--
-- Indeks untuk tabel `missing_persons`
--
ALTER TABLE `missing_persons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tracking_code` (`tracking_code`),
  ADD KEY `fk_missing_event` (`disaster_event_id`),
  ADD KEY `fk_missing_reviewer` (`reviewed_by`),
  ADD KEY `idx_missing_search` (`search_status`),
  ADD KEY `idx_missing_verification` (`verification_status`);

--
-- Indeks untuk tabel `missing_person_documents`
--
ALTER TABLE `missing_person_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_missing_documents_person` (`missing_person_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `articles`
--
ALTER TABLE `articles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `data_sources`
--
ALTER TABLE `data_sources`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `disaster_events`
--
ALTER TABLE `disaster_events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT untuk tabel `disaster_reports`
--
ALTER TABLE `disaster_reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `event_documents`
--
ALTER TABLE `event_documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `import_logs`
--
ALTER TABLE `import_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `missing_persons`
--
ALTER TABLE `missing_persons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `missing_person_documents`
--
ALTER TABLE `missing_person_documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `fk_articles_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `disaster_events`
--
ALTER TABLE `disaster_events`
  ADD CONSTRAINT `fk_events_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_events_source` FOREIGN KEY (`data_source_id`) REFERENCES `data_sources` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `disaster_reports`
--
ALTER TABLE `disaster_reports`
  ADD CONSTRAINT `fk_reports_event` FOREIGN KEY (`disaster_event_id`) REFERENCES `disaster_events` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_reports_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `event_documents`
--
ALTER TABLE `event_documents`
  ADD CONSTRAINT `fk_documents_event` FOREIGN KEY (`disaster_event_id`) REFERENCES `disaster_events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_documents_report` FOREIGN KEY (`disaster_report_id`) REFERENCES `disaster_reports` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `import_logs`
--
ALTER TABLE `import_logs`
  ADD CONSTRAINT `fk_import_source` FOREIGN KEY (`data_source_id`) REFERENCES `data_sources` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `missing_persons`
--
ALTER TABLE `missing_persons`
  ADD CONSTRAINT `fk_missing_event` FOREIGN KEY (`disaster_event_id`) REFERENCES `disaster_events` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_missing_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `missing_person_documents`
--
ALTER TABLE `missing_person_documents`
  ADD CONSTRAINT `fk_missing_documents_person` FOREIGN KEY (`missing_person_id`) REFERENCES `missing_persons` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
