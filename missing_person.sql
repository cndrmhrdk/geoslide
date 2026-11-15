INSERT INTO missing_persons
  (disaster_event_id, reviewed_by, tracking_code, name, age, gender, physical_description,
   last_seen_location, last_seen_at, search_status, verification_status,
   reporter_name, reporter_contact, public_contact_note, public_consent,
   admin_note, rejection_reason, reviewed_at)
SELECT e.id, NULL, 'GSX-0001', 'Yohanes Kogoya', 34, 'male',
       'Tinggi sekitar 165 cm, badan kurus, rambut keriting pendek. Memakai kaos hijau dan celana pendek hitam.',
       CONCAT('Kebun warga dekat lokasi longsor, ', e.regency, ', ', e.province),
       TIMESTAMP(e.event_date, '07:30:00'), 'searching', 'approved',
       'Maria Kogoya', '081200000001',
       'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1,
       'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, NOW()
FROM disaster_events e WHERE e.id = 65;

INSERT INTO missing_persons
  (disaster_event_id, reviewed_by, tracking_code, name, age, gender, physical_description,
   last_seen_location, last_seen_at, search_status, verification_status,
   reporter_name, reporter_contact, public_contact_note, public_consent,
   admin_note, rejection_reason, reviewed_at)
SELECT e.id, NULL, 'GSX-0002', 'Nelius Heluka', 12, 'male',
       'Tinggi sekitar 140 cm, rambut keriting, ada bekas luka kecil di dagu kiri. Terakhir memakai seragam sekolah.',
       CONCAT('Jalan setapak menuju sekolah, ', e.regency, ', ', e.province),
       TIMESTAMP(e.event_date, '06:45:00'), 'searching', 'approved',
       'Petrus Heluka', '081200000002',
       'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1,
       'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, NOW()
FROM disaster_events e WHERE e.id = 65;

INSERT INTO missing_persons
  (disaster_event_id, reviewed_by, tracking_code, name, age, gender, physical_description,
   last_seen_location, last_seen_at, search_status, verification_status,
   reporter_name, reporter_contact, public_contact_note, public_consent,
   admin_note, rejection_reason, reviewed_at)
SELECT e.id, NULL, 'GSX-0003', 'Yustina Jehadut', 58, 'female',
       'Tinggi sekitar 150 cm, rambut beruban diikat, memakai kain sarung dan kebaya cokelat.',
       CONCAT('Pondok ladang di lereng bukit, ', e.regency, ', ', e.province),
       TIMESTAMP(e.event_date, '16:20:00'), 'searching', 'approved',
       'Fransiskus Jehadut', '081200000003',
       'Hubungi posko pencarian setempat atau BPBD kabupaten.', 1,
       'DATA CONTOH untuk demo - bukan orang sungguhan.', NULL, NOW()
FROM disaster_events e WHERE e.id = 97;

-- 2) Laporan tambahan (data contoh) yang disebar ke kejadian lain,
--    supaya filter, pencarian, dan halaman berikutnya bisa didemokan.
--    Kejadian dipilih otomatis dari data yang ada (kecuali ID 65 dan 97).
DROP TEMPORARY TABLE IF EXISTS tmp_ev;
CREATE TEMPORARY TABLE tmp_ev (
  n INT AUTO_INCREMENT PRIMARY KEY,
  id BIGINT UNSIGNED,
  regency VARCHAR(150),
  province VARCHAR(150),
  event_date DATE
);
INSERT INTO tmp_ev (id, regency, province, event_date)
SELECT id, regency, province, event_date
FROM disaster_events
WHERE id NOT IN (65, 97)
ORDER BY id;

SET @n = (SELECT COUNT(*) FROM tmp_ev);

INSERT INTO missing_persons
  (disaster_event_id, reviewed_by, tracking_code, name, age, gender, physical_description,
   last_seen_location, last_seen_at, search_status, verification_status,
   reporter_name, reporter_contact, public_contact_note, public_consent,
   admin_note, rejection_reason, reviewed_at)
SELECT e.id, NULL,
       CONCAT('GSX-', LPAD(p.p, 4, '0')),
       p.name, p.age, p.gender, p.descr,
       CONCAT(p.place, ', ', e.regency, ', ', e.province),
       TIMESTAMP(e.event_date, SEC_TO_TIME((5 + MOD(p.p, 14)) * 3600)),
       p.status, p.verif,
       p.reporter, CONCAT('0812000001', LPAD(p.p, 2, '0')),
       IF(p.verif = 'approved', 'Hubungi posko pencarian setempat atau BPBD kabupaten.', NULL),
       IF(p.verif = 'approved', 1, 0),
       'DATA CONTOH untuk demo - bukan orang sungguhan.',
       IF(p.verif = 'rejected', 'Data laporan tidak lengkap dan tidak dapat diverifikasi (data contoh).', NULL),
       IF(p.verif = 'pending', NULL, NOW())
FROM (
  SELECT 4 AS p, 'Slamet Riyadi' AS name, 46 AS age, 'male' AS gender,
         'Tinggi sekitar 168 cm, badan sedang, kumis tipis. Memakai jaket loreng dan sepatu bot karet.' AS descr,
         'Kebun salak di lereng desa' AS place, 'searching' AS status, 'approved' AS verif, 'Sri Wahyuni' AS reporter
  UNION ALL SELECT 5, 'Siti Aminah', 39, 'female',
         'Tinggi sekitar 155 cm, berkerudung krem, memakai daster biru. Membawa tas anyaman.',
         'Jalan desa dekat sungai', 'searching', 'approved', 'Ahmad Fauzi'
  UNION ALL SELECT 6, 'Bagas Pratama', 9, 'male',
         'Tinggi sekitar 125 cm, rambut cepak, memakai kaos oranye bergambar kartun.',
         'Halaman rumah di pinggir tebing', 'searching', 'approved', 'Dewi Lestari'
  UNION ALL SELECT 7, 'Ni Wayan Sari', 27, 'female',
         'Tinggi sekitar 160 cm, rambut panjang diikat, ada tahi lalat di pipi kanan.',
         'Warung di tepi jalan raya', 'found', 'approved', 'I Made Surya'
  UNION ALL SELECT 8, 'Hasan Basri', 63, 'male',
         'Tinggi sekitar 160 cm, rambut putih, memakai peci hitam dan sarung kotak-kotak.',
         'Surau di kaki bukit', 'searching', 'approved', 'Nurhayati'
  UNION ALL SELECT 9, 'Rina Marlina', 31, 'female',
         'Tinggi sekitar 158 cm, rambut sebahu, memakai kemeja putih dan rok panjang hitam.',
         'Jalan menuju ladang', 'found', 'approved', 'Dedi Kurniawan'
  UNION ALL SELECT 10, 'Anton Sihombing', 52, 'male',
         'Tinggi sekitar 172 cm, badan tegap, memakai jaket hitam dan topi rimba.',
         'Pos ronda di tikungan jalan', 'searching', 'approved', 'Lastri Sihombing'
  UNION ALL SELECT 11, 'Putri Anggraini', 16, 'female',
         'Tinggi sekitar 155 cm, rambut panjang, memakai hoodie abu-abu dan celana training.',
         'Rumah kos dekat lereng', 'searching', 'approved', 'Bambang Susilo'
  UNION ALL SELECT 12, 'Darmin', 71, 'male',
         'Tinggi sekitar 158 cm, badan kurus, berjalan agak membungkuk, memakai kemeja batik lusuh.',
         'Gubuk di tengah sawah terasering', 'closed', 'approved', 'Suparti'
  UNION ALL SELECT 13, 'Kadek Ari Wibawa', 24, 'male',
         'Tinggi sekitar 170 cm, rambut ikal, memakai kaos hitam dan celana jeans.',
         'Motor ditemukan di tepi jalan', 'searching', 'approved', 'Ni Luh Ayu'
  UNION ALL SELECT 14, 'Fatimah Zahra', 4, 'female',
         'Tinggi sekitar 100 cm, rambut keriting, memakai gelang perak kecil dan baju merah muda.',
         'Rumah panggung di pinggir kebun', 'searching', 'approved', 'Rahmat Hidayat'
  UNION ALL SELECT 15, 'Marthen Tabuni', 41, 'male',
         'Tinggi sekitar 170 cm, badan kekar, memakai kaos biru dan celana kain cokelat.',
         'Jalur distribusi hasil kebun', 'searching', 'approved', 'Esther Tabuni'
  UNION ALL SELECT 16, 'Endang Sulastri', 55, 'female',
         'Tinggi sekitar 150 cm, rambut pendek beruban, memakai daster bunga-bunga.',
         'Dapur rumah di sisi bukit', 'found', 'approved', 'Joko Santoso'
  UNION ALL SELECT 17, 'Rizky Maulana', 19, 'male',
         'Tinggi sekitar 175 cm, rambut cepak, memakai jaket ojek daring hijau.',
         'Jalan alternatif perbukitan', 'searching', 'approved', 'Sulaiman'
  UNION ALL SELECT 18, 'Lusiana Boru Nainggolan', 36, 'female',
         'Tinggi sekitar 157 cm, rambut sebahu, memakai ulos kecil di bahu.',
         'Pasar desa di kaki bukit', 'searching', 'approved', 'Hotman Nainggolan'
  UNION ALL SELECT 19, 'Arif Setiawan', 28, 'male',
         'Tinggi sekitar 168 cm, memakai rompi relawan oranye. Diduga membantu evakuasi warga.',
         'Titik evakuasi sementara', 'closed', 'approved', 'Wulan Setiawan'
  UNION ALL SELECT 20, 'Yulita Kaize', 22, 'female',
         'Tinggi sekitar 160 cm, rambut panjang, memakai kaos putih dan celana panjang hitam.',
         'Kebun keladi di pinggir hutan', 'searching', 'pending', 'Anike Kaize'
  UNION ALL SELECT 21, 'Wahyudi', 49, 'male',
         'Tinggi sekitar 165 cm, kulit sawo matang, memakai kemeja kotak-kotak merah.',
         'Sawah di bawah tebing', 'searching', 'pending', 'Sumiyati'
  UNION ALL SELECT 22, 'Tidak diketahui', NULL, 'unknown',
         'Laporan tanpa identitas lengkap.',
         'Lokasi tidak jelas', 'searching', 'rejected', 'Anonim'
  UNION ALL SELECT 23, 'Dewi Kartika', 33, 'female',
         'Tinggi sekitar 162 cm, rambut panjang dikuncir, memakai blus biru muda.',
         'Rumah makan di tepi jalan nasional', 'searching', 'approved', 'Yoga Pratama'
  UNION ALL SELECT 24, 'Gregorius Nong', 67, 'male',
         'Tinggi sekitar 163 cm, rambut putih tipis, memakai kemeja putih dan sarung tenun.',
         'Kebun kopi di lereng', 'searching', 'approved', 'Katarina Nong'
  UNION ALL SELECT 25, 'Aisyah Rahmawati', 7, 'female',
         'Tinggi sekitar 115 cm, rambut kepang dua, memakai seragam SD merah putih.',
         'Jalan pulang dari sekolah', 'found', 'approved', 'Imam Rahmawan'
) p
JOIN tmp_ev e ON e.n = 1 + MOD(p.p * 5 + 3, @n);