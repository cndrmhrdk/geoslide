-- DATA CONTOH untuk mencoba halaman Informasi Orang Hilang.
-- OPSIONAL: jalankan SETELAH geoslide_schema_baru.sql. Semua nama dan kejadian adalah fiktif.
-- Catatan: laporan 'approved' di bawah ikut terhitung di statistik orang hilang milik modul Data Bencana.
-- Untuk menghapus data contoh, jalankan bagian "HAPUS DATA CONTOH" di paling bawah.

-- Kejadian contoh (status 'unverified' agar TIDAK muncul di Peta/Statistik Bencana)
INSERT INTO `disaster_events`
  (`data_source_id`, `external_id`, `title`, `event_date`, `province`, `regency`, `district`, `village`,
   `latitude`, `longitude`, `description`, `deaths`, `missing`, `injured`, `displaced`, `houses_damaged`,
   `source_note`, `verification_status`)
VALUES
  (1, 'CONTOH-OH-001', 'Longsor Desa Sumberejo (contoh)', '2026-10-28', 'Jawa Tengah', 'Banjarnegara', 'Pagentan', 'Sumberejo',
   -7.3450000, 109.7000000, 'Data contoh untuk pengembangan.', 2, 3, 5, 40, 12, 'Data contoh', 'unverified'),
  (1, 'CONTOH-OH-002', 'Longsor Cugenang (contoh)', '2026-11-02', 'Jawa Barat', 'Cianjur', 'Cugenang', 'Cibeureum',
   -6.8000000, 107.1000000, 'Data contoh untuk pengembangan.', 1, 1, 3, 25, 8, 'Data contoh', 'unverified');

INSERT INTO `missing_persons`
  (`disaster_event_id`, `tracking_code`, `name`, `age`, `gender`, `physical_description`,
   `last_seen_location`, `last_seen_at`, `search_status`, `verification_status`,
   `reporter_name`, `reporter_contact`, `public_contact_note`, `public_consent`, `reviewed_at`)
VALUES
  ((SELECT id FROM disaster_events WHERE data_source_id = 1 AND external_id = 'CONTOH-OH-001'),
   'CONTOH-OH-A001', 'Slamet Riyadi', 47, 'male',
   'Tinggi sekitar 165 cm, tubuh sedang, rambut pendek beruban. Terakhir memakai kaos hijau dan celana kain hitam.',
   'Dusun Karangsari, Desa Sumberejo', '2026-10-28 19:30:00', 'searching', 'approved',
   'Pelapor Contoh', '081200000001', 'Informasi dapat disampaikan ke posko tanggap darurat setempat.', 0, NOW()),

  ((SELECT id FROM disaster_events WHERE data_source_id = 1 AND external_id = 'CONTOH-OH-001'),
   'CONTOH-OH-A002', 'Siti Aminah', 8, 'female',
   'Tinggi sekitar 120 cm, rambut panjang dikuncir dua, ada tahi lalat kecil di pipi kiri.',
   'Rumah warga RT 03/RW 02, Desa Sumberejo', '2026-10-28 19:10:00', 'found', 'approved',
   'Pelapor Contoh', '081200000002', 'Ditemukan oleh tim SAR dan telah ditangani petugas kesehatan.', 0, NOW()),

  ((SELECT id FROM disaster_events WHERE data_source_id = 1 AND external_id = 'CONTOH-OH-001'),
   'CONTOH-OH-A003', 'Agus Prasetyo', 33, 'male',
   'Tinggi sekitar 172 cm, kulit sawo matang, berkumis tipis. Memakai jaket kerja oranye.',
   'Jalur Kecamatan Pagentan, dekat jembatan kecil', '2026-10-28 18:50:00', 'closed', 'approved',
   'Pelapor Contoh', '081200000003', 'Pencarian ditutup setelah masa operasi berakhir sesuai keputusan posko.', 0, NOW()),

  ((SELECT id FROM disaster_events WHERE data_source_id = 1 AND external_id = 'CONTOH-OH-002'),
   'CONTOH-OH-A004', 'Nurhayati', 61, 'female',
   'Tinggi sekitar 150 cm, tubuh kurus, rambut putih disanggul, memakai kebaya cokelat.',
   'Lereng Dukuh Tegalsari', '2026-11-02 04:20:00', 'searching', 'approved',
   'Pelapor Contoh', '081200000004', NULL, 0, NOW()),

  -- Belum diverifikasi: TIDAK boleh tampil di halaman publik
  ((SELECT id FROM disaster_events WHERE data_source_id = 1 AND external_id = 'CONTOH-OH-002'),
   'CONTOH-OH-A005', 'Contoh Belum Diverifikasi', 25, 'male', NULL,
   'Lokasi contoh', '2026-11-03 10:00:00', 'searching', 'pending',
   'Pelapor Contoh', '081200000005', NULL, 0, NULL);

-- ===== HAPUS DATA CONTOH (jalankan bila sudah tidak diperlukan) =====
-- DELETE FROM missing_persons WHERE tracking_code LIKE 'CONTOH-OH-%';
-- DELETE FROM disaster_events WHERE data_source_id = 1 AND external_id LIKE 'CONTOH-OH-%';
