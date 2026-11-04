# UI Guide — GeoSlide Frontend (Desain Modern, Sinematik & Bertema Alam)

> Panduan standar desain visual GeoSlide.  
> Karakter desain: **Modern, Sinematik, Tenang, Bertema Alam**.  
> UI minimal dengan tipografi besar (clamp 40px - 88px), ruang kosong luas, dan warna terkendali.  
> Wajib dipedomani oleh seluruh anggota tim agar tampilan visual tetap harmonis dan konsisten.

---

## Daftar Isi
1. [Prinsip & Karakter Desain](#1-prinsip--karakter-desain)
2. [Variabel Warna (Design Tokens)](#2-variabel-warna-design-tokens)
3. [Tipografi & Spacing](#3-tipografi--spacing)
4. [Komponen Navbar (Dual-Mode: Solid & Overlay)](#4-komponen-navbar-dual-mode-solid--overlay)
5. [Komponen HeroSection (Baru)](#5-komponen-herosection-baru)
6. [Komponen PageHeader](#6-komponen-pageheader)
7. [Komponen Footer](#7-komponen-footer)
8. [Komponen Section & Kontainer](#8-komponen-section--kontainer)
9. [Gaya Tombol & Kartu](#9-gaya-tombol--kartu)
10. [Aturan Tampilan Data (Peta & Statistik) vs Tampilan Sinematik](#10-aturan-tampilan-data-peta--statistik-vs-tampilan-sinematik)
11. [FAQ](#11-faq)

---

## 1. Prinsip & Karakter Desain

- **Sinematik & Bertema Alam:** Mengusung visual lanskap alam yang tenang, terinspirasi dari keindahan geologi dan vegetasi hutan Indonesia.
- **Tipografi Besar & Rapat:** Judul menggunakan font **Manrope** atau **Poppins** dengan rentang responsif `clamp(40px, 5.2vw, 88px)`, berbobot `regular-medium` (500–550), serta `letter-spacing` rapat (`-0.03em`).
- **Warna Sangat Terkendali:**
  - Latar netral hangat (`--bg: #F2F1EE`).
  - Satu aksen warna utama hijau lumut (`--primary: #3F7A1A`) untuk menandai kata kunci pada judul (`.text-accent`), tombol primary, dan menu aktif.
  - Hijau hutan gelap (`--forest: #1F3D26`) untuk footer dan overlay sinematik.
  - Aksen emas hangat (`--gold: #D9A93A`) hanya digunakan secara selektif untuk detail kecil (misal lingkaran CTA atau badge khusus).

---

## 2. Variabel Warna (Design Tokens)

Tersedia secara global di `frontend/src/index.css`. **Gunakan variabel CSS ini, hindari hardcode nilai hex:**

| Variabel CSS | Nilai Hex / RGBA | Peruntukan & Panduan Pemakaian |
|---|---|---|
| `--bg` | `#F2F1EE` | Latar utama aplikasi (netral hangat) dan wadah navbar solid |
| `--surface` | `#FFFFFF` | Latar kartu solid, dropdown, dan kanvas konten data |
| `--ink` | `#0F0F0F` | Teks judul utama, teks body, dan tombol pill hitam |
| `--muted` | `#6E6E69` | Teks sekunder, deskripsi kecil, caption |
| `--primary` | `#3F7A1A` | Hijau lumut: aksen frasa judul (`.text-accent`), tombol primary, menu aktif |
| `--forest` | `#1F3D26` | Hijau hutan gelap: latar footer, gradien hero placeholder, overlay |
| `--gold` | `#D9A93A` | Aksen emas: detail kecil, lingkaran CTA, badge selektif |
| `--overlay` | `rgba(10, 14, 10, 0.45)` | Overlay gelap sinematik di atas foto hero agar teks putih terbaca jelas |
| `--border` | `rgba(15, 15, 15, 0.08)` | Garis pemisah halus antar elemen |

---

## 3. Tipografi & Spacing

### Font Family
- **Utama:** `'Manrope', 'Poppins', sans-serif` (dimuat otomatis via Google Fonts di `index.html`).
- **Monospace:** `ui-monospace, SFMono-Regular, Consolas, monospace`.

### Skala Judul
- **Hero Title (`.display-hero`):** `clamp(2.5rem, 5.2vw + 1rem, 5.5rem)` (40px - 88px).
- **Heading 1 (`h1`):** `clamp(2.25rem, 3.5vw + 1rem, 3.75rem)`.
- **Heading 2 (`h2`):** `clamp(1.75rem, 2.5vw + 0.5rem, 2.6rem)`.

### Kelas Aksen Kata Judul (`.text-accent`)
Untuk menandai satu frasa pada judul besar dengan warna hijau lumut (`--primary`):

```html
<h1 className="display-hero">
  Harmoni Alam &amp; <span className="text-accent">Mitigasi Tanggap</span>
</h1>
```

---

## 4. Komponen Navbar (Dual-Mode: Solid & Overlay)

Navbar (`src/components/Navbar.jsx`) mendukung dua mode melalui prop `variant`:

```jsx
import Navbar from '../components/Navbar';

// 1. Mode Solid (Default di PublicLayout)
<Navbar variant="solid" />

// 2. Mode Overlay (Untuk halaman dengan HeroSection / foto sinematik)
<Navbar variant="overlay" />
```

### Karakteristik Masing-Masing Mode:
1. **`variant="solid"` (Default):**
   - Berupa wadah mengambang abu terang (`--bg`) bersudut membulat besar **24px**.
   - Teks menu gelap (`--ink`), menu aktif ditandai tebal dengan garis bawah tipis aksen hijau lumut.
   - Sesuai untuk halaman dalam dan halaman data.
2. **`variant="overlay"`:**
   - Melayang transparan langsung di atas gambar hero tanpa batas tepi tebal.
   - Teks berwarna putih (`#FFFFFF`).
   - Wadah menu di tengah berbentuk **kapsul kaca** (`backdrop-filter: blur(16px)` + semi-transparan putih).
3. **Tombol "Login Admin" di Kanan:**
   - Berupa **pill hitam** dengan **lingkaran putih kecil** berisi ikon panah (`bi-arrow-up-right`).
4. **Responsif Mobile:**
   - Pada layar `< 992px`, otomatis beradaptasi menjadi rounded collapse menu yang rapi dan mudah disentuh.

---

## 5. Komponen HeroSection (Baru)

Komponen reusable untuk halaman dengan pembuka visual besar sinematik (`src/components/HeroSection.jsx`):

```jsx
import HeroSection from '../components/HeroSection';

<HeroSection
  backgroundImage="/assets/hero-nature.jpg" // Opsional: fallback ke gradien --forest jika kosong
  title="Menjaga Keseimbangan Ekosistem & Mitigasi Bencana"
  highlight="Mitigasi Bencana"               // Opsional: otomatis dibungkus dengan .text-accent
  subtitle="Platform pemantauan spasial dan kesiapsiagaan tanah longsor terpadu di seluruh Indonesia."
  actions={
    <>
      <button className="btn-pill-action">
        <span>Eksplorasi Data</span>
        <span className="btn-pill-action__icon">
          <i className="bi bi-arrow-up-right"></i>
        </span>
      </button>
      <button className="btn-pill-glass">
        Pelajari Mitigasi
      </button>
    </>
  }
>
  {/* Opsional: kartu kaca mengambang di sebelah kanan (children) */}
  <div className="card-glass p-4">
    <h4>Status Kesiapsiagaan</h4>
    <p>Data spasial terintegrasi real-time 38 provinsi.</p>
  </div>
</HeroSection>
```

> **Catatan:** `HeroSection` secara default akan otomatis menyesuaikan navbar menjadi mode `variant="overlay"` saat dipasang, dan kembali ke `variant="solid"` saat berpindah halaman.

---

## 6. Komponen PageHeader

Komponen header standar untuk halaman dalam (`src/components/PageHeader.jsx`).

### Mode 1: Ringan (Default Halaman Dalam)
Latar netral `--bg`, judul besar beraksen, deskripsi abu-abu `--muted`:

```jsx
import PageHeader from '../components/PageHeader';

<PageHeader
  title="Peta Sebaran Bencana Tanah Longsor"
  highlight="Bencana Tanah Longsor"
  subtitle="Visualisasi titik kejadian pergerakan tanah di seluruh wilayah Indonesia."
  icon="bi-map"
/>
```

### Mode 2: Gambar Sinematik
Menyediakan opsi gambar latar dengan overlay gelap tipis serupa `HeroSection` namun berdimensi lebih ringkas:

```jsx
<PageHeader
  backgroundImage="/assets/nature-hills.jpg"
  title="Edukasi Kesiapsiagaan Bencana"
  highlight="Kesiapsiagaan Bencana"
  subtitle="Panduan mitigasi struktural dan vegetatif untuk masyarakat di lereng perbukitan."
  badge="Mitigasi & Edukasi"
/>
```

---

## 7. Komponen Footer

Footer (`src/components/Footer.jsx`) bertema alam dengan:
- Latar hijau hutan gelap (`--forest: #1F3D26`).
- Tipografi teks terang yang bersih.
- Sudut atas membulat besar (`border-radius: 32px 32px 0 0`).
- 4 kolom ringkas: Brand, Data Bencana, Pelaporan & Edukasi, Layanan Darurat.
- Kontak darurat (BNPB 117 dan Darurat 112) tersaji dalam bentuk chip mini yang jelas dan proporsional.

---

## 8. Komponen Section & Kontainer

Komponen pembungkus konten standar (`src/components/Section.jsx`):

```jsx
import Section from '../components/Section';

<Section
  bg="white"     // 'white' (--surface) | 'subtle' (--bg) | 'muted' (--primary-soft) | 'dark' (--forest)
  py="lg"        // 'sm' (1.75rem) | 'md' (3rem) | 'lg' (4.5rem) | 'xl' (6.5rem)
  fluid={false}  // true = container-fluid
>
  {/* Konten */}
</Section>
```

---

## 9. Gaya Tombol & Kartu

### Tombol Pill

```jsx
{/* 1. Pill Hitam dengan Lingkaran Ikon Panah Putih (Utama/Hero) */}
<a href="#link" className="btn-pill-dark">
  <span>Mulai Sekarang</span>
  <span className="btn-pill-dark__icon">
    <i className="bi bi-arrow-up-right"></i>
  </span>
</a>

{/* 2. Pill Kaca (Semi-transparan + Blur di atas foto) */}
<button className="btn-pill-glass">
  Lihat Dokumentasi
</button>

{/* 3. Tombol Putih Polos dengan Panah */}
<button className="btn-pill-white">
  <span>Unduh Laporan</span>
  <span className="btn-pill-white__icon">
    <i className="bi bi-arrow-right"></i>
  </span>
</button>

{/* 4. Tombol Primary Hijau Lumut */}
<button className="btn-pill-primary">
  <i className="bi bi-check2 me-1"></i> Simpan Laporan
</button>

{/* 5. Lingkaran CTA Aksen Emas */}
<button className="cta-circle-gold" aria-label="Aksi Cepat">
  <i className="bi bi-arrow-right"></i>
</button>
```

### Kartu Solid & Glass

```jsx
{/* Kartu Solid Putih Bersudut 20px dengan Bayangan Halus */}
<div className="card-solid">
  <div className="card-header-clean">
    <span>Data Wilayah</span>
    <span className="badge-pill badge-primary-soft">Aktif</span>
  </div>
  <p className="gs-text-muted">Konten dengan kontras tinggi dan mudah dibaca.</p>
</div>

{/* Kartu Kaca untuk Elemen yang Melayang di Atas Foto */}
<div className="card-glass">
  <h4>Statistik Terkini</h4>
  <p>Efek kaca modern untuk visual sinematik.</p>
</div>
```

---

## 10. Aturan Tampilan Data (Peta & Statistik) vs Tampilan Sinematik

Untuk menjaga integritas fungsi dan estetika:

| Kebutuhan Halaman | Tampilan yang Wajib Digunakan | Alasan / Panduan |
|---|---|---|
| **Peta Bencana** (`/data-bencana/peta`) | **Latar `--bg` atau `--surface` (Putih Bersih)** tanpa foto latar belakang. | Memastikan peta spasial Leaflet memiliki kontras maksimal, legenda terbaca jelas, dan tidak terdistraksi foto di belakang kanvas. |
| **Statistik Bencana** (`/data-bencana/statistik`) | **Kartu Solid Putih (`.card-solid`)** dengan latar bersih. | Grafik Recharts dan kartu KPI angka membutuhkan kontras tinggi dan garis kisi yang tegas tanpa interferensi tekstur foto. |
| **Halaman Beranda / Edukasi / Landing** | **`HeroSection` Sinematik (Foto + Overlay)** diperbolehkan. | Membangun suasana alam, emosi tenang, dan visual modern saat pengunjung pertama kali membuka aplikasi. |

### Panduan Animasi
- Gunakan **animasi seminimal mungkin**: hanya transisi halus pada hover tombol/kartu (`transform: translateY(-2px); transition: 0.25s`) dan adaptasi navbar saat scroll.
- **Jangan** menambahkan animasi loop bergerak terus-menerus pada area analisis data.

---

## 11. FAQ

**Q: Bagaimana cara halaman saya menggunakan mode navbar overlay?**  
A: Gunakan komponen `HeroSection` di paling atas halaman Anda; mode overlay akan diaktifkan secara otomatis. Anda juga dapat memanggil `const { setVariant } = useOutletContext(); setVariant('overlay');`.

**Q: Apakah boleh menggunakan warna hijau lumut untuk seluruh section latar belakang?**  
A: Tidak. Hijau lumut (`--primary: #3F7A1A`) difungsikan strictly sebagai **aksen** kata kunci, tombol utama, dan menu aktif. Gunakan `--bg`, `--surface`, atau `--forest` untuk latar section.
