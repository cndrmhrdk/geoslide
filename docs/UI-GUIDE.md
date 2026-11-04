# UI Guide — GeoSlide Frontend (Desain Modern & Organik)

> Panduan standar desain visual GeoSlide.  
> Karakter desain: **Tenang, Organik, Bersih, dan Premium**.  
> Wajib dibaca oleh seluruh anggota tim sebelum mengembangkan komponen atau halaman baru.

---

## Daftar Isi
1. [Prinsip & Karakter Visual](#1-prinsip--karakter-visual)
2. [Variabel Warna (Design Tokens)](#2-variabel-warna-design-tokens)
3. [Tipografi & Spacing](#3-tipografi--spacing)
4. [Komponen Navbar & Footer](#4-komponen-navbar--footer)
5. [Komponen Inti (PageHeader & Section)](#5-komponen-inti-pageheader--section)
6. [Kelas Komponen UI Siap Pakai](#6-kelas-komponen-ui-siap-pakai)
   - [Tombol Pill](#tombol-pill)
   - [Kartu Solid & Glass](#kartu-solid--glass)
   - [Badge & Tag](#badge--tag)
   - [Container & Spacing](#container--spacing)
7. [Panduan Khusus Halaman Data (Peta & Statistik)](#7-panduan-khusus-halaman-data-peta--statistik)
8. [Struktur Folder & Alur Kerja](#8-struktur-folder--alur-kerja)
9. [FAQ](#9-faq)

---

## 1. Prinsip & Karakter Visual

- **Suasana Tenang & Organik:** Menggunakan latar belakang netral hangat (`--bg: #EFEBE4`) dan kartu putih bersih (`--surface: #FFFFFF`).
- **Aksen Hijau Terukur:** Hijau tua (`--primary: #1F4D3A`) hanya digunakan sebagai **aksen** (menu aktif, ikon, link, badge). **Hindari blok hijau tua besar dari tepi ke tepi.**
- **Bentuk Membulat Halus:** Seluruh tombol berbentuk pill penuh (`border-radius: 9999px`) dan kartu bersudut sangat membulat (16–24px).
- **Elemen Glassmorphism:** Elemen mengambang menggunakan kartu glass semi-transparan (`--glass`) dengan efek `backdrop-filter: blur()`.
- **Komposisi Bernapas:** Ruang kosong (whitespace) lega, bayangan halus (`box-shadow` bertingkat lembut), tanpa border tebal kaku.

---

## 2. Variabel Warna (Design Tokens)

Didefinisikan di `frontend/src/index.css`. **Gunakan variabel CSS berikut, jangan hardcode kode hex:**

| Variabel CSS | Nilai Hex / RGBA | Peruntukan & Penggunaan |
|---|---|---|
| `--bg` | `#EFEBE4` | Latar belakang utama aplikasi (netral hangat) |
| `--surface` | `#FFFFFF` | Latar kartu solid, dropdown, dan footer |
| `--glass` | `rgba(255, 255, 255, 0.65)` | Kartu semi-transparan dengan backdrop blur |
| `--ink` | `#141414` | Teks utama, judul, dan tombol pill gelap |
| `--muted` | `#6B655D` | Teks sekunder, deskripsi, caption (abu hangat) |
| `--primary` | `#1F4D3A` | Hijau tua (aksen utama: menu aktif, ikon, link) |
| `--primary-soft` | `#DDE8E0` | Hijau sangat muda (latar badge, efek hover) |
| `--earth` | `#8A6E55` | Cokelat tanah (aksen pendukung mitigasi/geologi) |
| `--border` | `rgba(20, 20, 20, 0.08)` | Border halus transparan antar elemen |

*Catatan Kompatibilitas:* Variabel lama seperti `--gs-green-dark`, `--gs-green-muted`, `--gs-bg`, dll. telah dipetakan secara otomatis ke palet baru di atas sehingga kode lama tetap berjalan selaras.

---

## 3. Tipografi & Spacing

### Tipografi (Plus Jakarta Sans)
- Dimuat langsung via Google Fonts di `index.html`.
- **Judul (Headings):** Berbobot `regular-medium` (`font-weight: 550`), letter-spacing halus `-0.02em`, warna `--ink`.
- **Deskripsi / Subtitle:** Warna abu hangat `--muted` (`#6B655D`), line-height `1.65`.

### Skala Spacing & Radius
- **Radius Pill:** `border-radius: 9999px;` (untuk tombol dan badge)
- **Radius Kartu:** `border-radius: 20px;` (standar 16–24px)
- **Radius Dropdown:** `border-radius: 18px;`

---

## 4. Komponen Navbar & Footer

### Navbar (`src/components/Navbar.jsx`)
- **Sticky & Floating Capsule:** Melayang di atas halaman dengan `backdrop-filter: blur(16px)`, latar semi-transparan, dan bayangan tipis.
- **Logo di Kiri:** Simbol `bi-geo-alt-fill` dalam badge lembut hijau muda + tipografi `GeoSlide`.
- **Menu di Tengah:** Teks tipis/medium. Menu aktif ditandai secara elegan dengan **garis bawah halus berwarna aksen** (`--primary`).
- **Tombol Kanan ("Login Admin"):** Tombol pill gelap (`--ink`) dengan lingkaran kecil berisi ikon panah (`bi-arrow-up-right`).
- **Dropdown:** Sudut membulat `18px`, bayangan lembut, hover berlatar `--primary-soft`.
- **Responsif Mobile:** Pada layar `< 992px`, otomatis bertransformasi menjadi rounded collapse menu yang rapi.

### Footer (`src/components/Footer.jsx`)
- **Ringan & Bersih:** Menggunakan latar putih `--surface` dengan sudut atas membulat (`border-radius: 36px 36px 0 0`) di atas latar `--bg`.
- **4 Kolom Proporsional:** Brand & Misi, Data Bencana, Pelaporan & Edukasi, Layanan Darurat.
- **Info Kontak Darurat (BNPB 117 & Darurat 112):** Tampil jelas dalam format chips/mini-pill elegan tanpa warna peringatan yang mengganggu keindahan desain.

---

## 5. Komponen Inti (PageHeader & Section)

### `<PageHeader />`
Menggantikan hero hijau tebal dengan header yang ringan, bersih, dan lapang:
- Latar netral hangat `--bg`.
- Bentuk organik halus transparan berwarna `--primary-soft` di latar belakang (`filter: blur`).
- Judul besar berbobot `regular-medium`.

```jsx
import PageHeader from '../components/PageHeader';

<PageHeader
  badge="Sistem Informasi Spasial"   // opsional — badge kecil di atas judul
  title="Peta Sebaran Bencana"       // wajib
  subtitle="Deskripsi ringkas..."    // opsional
  icon="bi-map"                      // opsional — ikon dari Bootstrap Icons
  center={false}                     // opsional — rata tengah (default: false)
/>
```

### `<Section />`
Container pembungkus konten halaman dengan rhythm vertikal lega:

```jsx
import Section from '../components/Section';

<Section
  bg="white"     // 'white' (surface putih) | 'subtle' (latar --bg) | 'muted' (soft green)
  py="lg"        // 'sm' (1.75rem) | 'md' (3rem) | 'lg' (4.5rem) | 'xl' (6.5rem)
  fluid={false}  // true = container-fluid (default: false)
  id="target-id" // ID HTML untuk anchor link (opsional)
>
  {/* Konten section */}
</Section>
```

---

## 6. Kelas Komponen UI Siap Pakai

Semua kelas di bawah tersedia secara global di `index.css` dan dapat langsung digunakan:

### Tombol Pill

```jsx
{/* 1. Tombol Pill Gelap (Primary / Utama) */}
<button className="btn-pill btn-pill-primary">
  Simpan Data
</button>

{/* 2. Tombol Pill Action (Dengan Bulat Ikon Panah) */}
<Link to="/rute" className="btn-pill-action">
  <span>Jelajahi Data</span>
  <span className="btn-pill-action__icon">
    <i className="bi bi-arrow-up-right"></i>
  </span>
</Link>

{/* 3. Tombol Pill Aksen Hijau */}
<button className="btn-pill btn-pill-accent">
  <i className="bi bi-check2 me-1"></i> Konfirmasi Laporan
</button>

{/* 4. Tombol Pill Outline (Secondary) */}
<button className="btn-pill btn-pill-secondary">
  Kembali
</button>

{/* 5. Tombol Pill Surface Putih */}
<button className="btn-pill btn-pill-surface">
  <i className="bi bi-funnel me-1"></i> Filter
</button>
```

### Kartu Solid & Glass

```jsx
{/* Kartu Solid Putih (Standar Konten & Data) */}
<div className="card-solid">
  <div className="card-header-clean">
    <span>Judul Kartu</span>
    <span className="badge-pill badge-primary-soft">Aktif</span>
  </div>
  <p className="gs-text-muted">Isi konten kartu dengan sudut membulat 20px.</p>
</div>

{/* Kartu Glass (Semi-transparan untuk elemen mengambang / highlight) */}
<div className="card-glass">
  <h4 className="mb-2">Sorotan Khusus</h4>
  <p className="gs-text-muted">Kartu dengan efek blur modern.</p>
</div>
```

### Badge & Tag

```jsx
{/* Badge Hijau Lembut */}
<span className="badge-pill badge-primary-soft">
  <i className="bi bi-check-circle me-1"></i> Terverifikasi
</span>

{/* Badge Cokelat Tanah */}
<span className="badge-pill badge-earth">
  Zona Geologi
</span>

{/* Badge Outline */}
<span className="badge-pill badge-outline">
  Filter: 2026
</span>

{/* Badge Peringatan / Bahaya */}
<span className="badge-pill badge-danger">
  Risiko Tinggi
</span>
```

### Container & Spacing

- `.container-tight`: Lebar maksimal 920px (cocok untuk halaman form, login, atau artikel).
- `.container-wide`: Lebar maksimal 1280px.
- `.gs-divider`: Garis pemisah horizontal tipis netral.

---

## 7. Panduan Khusus Halaman Data (Peta & Statistik)

Untuk halaman **Peta Bencana** (`/data-bencana/peta`) dan **Statistik Bencana** (`/data-bencana/statistik`):

1. **Prioritaskan Keterbacaan (High Legibility):**
   - Gunakan selalu `.card-solid` (latar putih bersih) untuk kanvas peta, grafik, tabel, dan kartu KPI.
   - Jangan gunakan kartu glass untuk area pembacaan data intensif agar teks dan grafik tidak kehilangan kontras.
2. **Animasi Minimal:**
   - Gunakan hanya transisi halus pada hover tombol dan kartu (`transform: translateY(-2px)`).
   - Hindari animasi berulang yang mengganggu fokus pengguna saat menganalisis data spasial.
3. **Filter & Toolbar:**
   - Kemas filter, dropdown pencarian, dan tombol aksi dalam satu baris `.card-solid` yang teratur.

---

## 8. Struktur Folder & Alur Kerja

```
frontend/src/
├── components/
│   ├── Navbar.jsx & Navbar.css     ← Floating capsule navbar
│   ├── Footer.jsx & Footer.css     ← Footer sudut membulat
│   ├── PageHeader.jsx & PageHeader.css ← Header ringan & dekorasi halus
│   └── Section.jsx & Section.css   ← Pembungkus section
├── layouts/
│   └── PublicLayout.jsx            ← Template utama (Navbar + Page + Footer)
├── pages/                          ← Tempat kerja masing-masing anggota tim
└── index.css                       ← Design tokens, kelas tombol pill, kartu, & badge
```

---

## 9. FAQ

**Q: Apakah saya boleh menambahkan library CSS lain seperti Tailwind?**  
A: Tidak. Proyek menggunakan Bootstrap 5 + CSS sendiri dengan sistem variabel di atas agar seragam, ringan, dan tidak menimbulkan konflik.

**Q: Bagaimana cara membuat tombol pill di form saya?**  
A: Cukup beri kelas `btn-pill btn-pill-primary` (untuk tombol utama) atau `btn-pill btn-pill-secondary` (untuk tombol batal/kembali).

**Q: Di mana saya meletakkan styling spesifik untuk halaman saya?**  
A: Buat file CSS tersendiri (misal: `PetaBencana.css`) di folder `src/pages/`, import di `PetaBencana.jsx`, dan gunakan token CSS yang tersedia (`var(--surface)`, `var(--primary)`, dll.).
