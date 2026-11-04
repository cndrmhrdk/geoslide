# DESIGN.md — Fondasi Desain UI GeoSlide

Dokumen ini mendokumentasikan arah desain fondasi visual, prinsip estetika, tokens, dan arsitektur komponen UI GeoSlide.

---

## 1. Karakter & Filosofi Desain

- **Tema:** Modern, Sinematik, Tenang, Bertema Alam (*Nature-Cinematic*).
- **Pendekatan:** Minimalis fungsional dengan tipografi besar dan ruang kosong (*whitespace*) yang lapang.
- **Warna Sangat Terkendali:** Palet netral hangat sebagai panggung utama, dipadukan dengan satu aksen hijau lumut (*moss green*) untuk fokus perhatian, hijau hutan gelap (*forest green*) untuk kedalaman visual, serta aksen emas kecil untuk sentuhan premium.
- **Keterbacaan Data Spasial:** Area data (peta spasial dan statistik) tetap dipertahankan bersih tanpa foto agar memiliki keterbacaan tinggi (*high legibility*).

---

## 2. Design Tokens (Variabel CSS)

Didefinisikan secara terpusat di `frontend/src/index.css`:

```css
:root {
  --bg: #F2F1EE;                      /* Latar utama netral hangat */
  --surface: #FFFFFF;                 /* Latar kartu solid */
  --ink: #0F0F0F;                     /* Teks judul & tombol pill hitam */
  --muted: #6E6E69;                   /* Teks deskripsi abu-abu netral */
  --primary: #3F7A1A;                 /* Hijau lumut (aksen kata, tombol, menu aktif) */
  --forest: #1F3D26;                  /* Hijau hutan gelap (footer & overlay) */
  --gold: #D9A93A;                    /* Aksen emas hangat untuk detail kecil / CTA */
  --overlay: rgba(10, 14, 10, 0.45);  /* Overlay gelap sinematik di atas foto */
  --border: rgba(15, 15, 15, 0.08);   /* Border tipis transparan */

  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.14);
  --glass-border: rgba(255, 255, 255, 0.25);
  --glass-light-bg: rgba(255, 255, 255, 0.75);
  --glass-light-border: rgba(255, 255, 255, 0.85);

  /* Radius & Spacing */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;                  /* Standar kartu 20px */
  --radius-xl: 24px;                  /* Standar navbar solid */
  --radius-pill: 9999px;              /* Bentuk pill penuh */
}
```

---

## 3. Tipografi

- **Font Family:** `Manrope` / `Poppins` (dimuat melalui Google Fonts).
- **Skala Judul:**
  - Hero & Display: `clamp(40px, 5.2vw + 1rem, 88px)` (`.display-hero`).
  - Berat: `regular-medium` (500–550).
  - Jarak Huruf: Rapat (`letter-spacing: -0.03em` hingga `-0.035em`).
- **Aksen Judul:** Kelas `.text-accent` untuk mewarnai kata kunci pada judul dengan `--primary` (#3F7A1A).
- **Deskripsi:** Berwarna `--muted` (#6E6E69) dengan ukuran proporsional dan ruang bernapas lega.

---

## 4. Arsitektur Komponen Utama

### A. Navbar (`src/components/Navbar.jsx`)
Mendukung dua mode melalui prop `variant`:
1. **`variant="solid"` (Default):**
   - Berupa wadah abu terang (`--bg`) bersudut membulat 24px melayang dengan bayangan tipis.
   - Teks menu gelap, menu aktif diberi garis bawah aksen atau cetak tebal.
2. **`variant="overlay"`:**
   - Melayang transparan di atas area hero/foto sinematik.
   - Teks menu putih, wadah menu di tengah berbentuk kapsul kaca (`backdrop-filter: blur(16px)`).
3. **Tombol "Login Admin":**
   - Pill hitam (`--ink`) dengan lingkaran putih kecil di sebelah kanan berisi ikon panah (`bi-arrow-up-right`).
4. **Dropdown & Mobile:**
   - Dropdown bersudut membulat 18px dengan bayangan lembut.
   - Responsif collapse yang rapi pada layar mobile.

### B. HeroSection (`src/components/HeroSection.jsx` — Baru)
- Komponen reusable untuk pembuka halaman sinematik.
- Tinggi minimal `80vh` dengan overlay sinematik tipis (`--overlay`).
- Mendukung `backgroundImage` opsional; jika tidak disertakan, otomatis memakai fallback gradien hijau hutan (`--forest` ke warna lebih gelap).
- Judul besar rata kiri dengan prop `highlight` yang otomatis dibungkus `.text-accent`.
- Slot untuk tombol aksi (`actions`) dan elemen pendukung (`children`).
- Otomatis mengaktifkan mode navbar `variant="overlay"` saat dipasang pada halaman.

### C. PageHeader (`src/components/PageHeader.jsx`)
- Mode default ringan untuk halaman dalam (latar `--bg`, judul besar beraksen, deskripsi `--muted`).
- Menyediakan opsi `backgroundImage` dengan overlay gelap untuk halaman dalam bernuansa sinematik.

### D. Footer (`src/components/Footer.jsx`)
- Berlatar hijau hutan gelap (`--forest: #1F3D26`).
- Tipografi teks terang (`#FFFFFF` dan `rgba(255, 255, 255, 0.75)`).
- Sudut atas membulat besar (`border-radius: 32px 32px 0 0`).
- 4 kolom ringkas dengan informasi kontak darurat (BNPB 117 dan Darurat 112) dalam format chip yang proporsional.

### E. PublicLayout (`src/layouts/PublicLayout.jsx`)
- Menyediakan `NavbarContext` (`variant` dan `setVariant`) dan `useNavbarVariant()`.
- Default navbar `variant="solid"`, dan otomatis memfasilitasi halaman dengan hero untuk memilih `variant="overlay"`.

---

## 5. Sistem Tombol & Kartu

### Tombol
1. **Pill Hitam + Lingkaran Ikon Putih (`.btn-pill-dark`, `.btn-pill-action`):** Tombol aksi utama kontras tinggi.
2. **Pill Kaca (`.btn-pill-glass`):** Semi-transparan + blur untuk ditempatkan di atas foto hero.
3. **Tombol Putih Polos (`.btn-pill-white`, `.btn-pill-surface`):** Tombol bersih untuk aksi sekunder.
4. **Tombol Primary Hijau Lumut (`.btn-pill-primary`, `.btn-pill-accent`):** Tombol aksi tegas dengan warna brand utama.
5. **Lingkaran CTA Emas (`.cta-circle-gold`):** Sentuhan aksen emas untuk aksi interaktif khusus.

### Kartu
1. **Kartu Solid Putih (`.card-solid`, `.gs-card`):** Sudut membulat 20px, border tipis, bayangan sangat halus. Digunakan untuk seluruh konten data (peta, statistik, tabel, form).
2. **Kartu Kaca (`.card-glass`):** Efek blur `20px` di atas foto sinematik.
3. **Kartu Kaca Terang (`.card-glass-light`):** Efek blur di atas latar netral hangat.

---

## 6. Aturan Keterbacaan Halaman Data

Halaman data geospasial (**Peta Bencana**) dan analisis grafis (**Statistik Bencana**):
- **Wajib** memakai latar belakang netral (`--bg`) atau putih bersih (`--surface`) tanpa foto latar belakang.
- Kanvas peta dan grafik dibungkus `.card-solid` berkontras tinggi agar seluruh titik koordinat, batas wilayah, dan garis grafik terbaca dengan jelas.
- Animasi dibatasi hanya pada transisi halus hover (`0.25s`) dan adaptasi navbar saat scroll.
