# UI Guide — GeoSlide Frontend

> Panduan ini wajib dibaca sebelum mengembangkan halaman baru.
> Pastikan semua anggota tim mengikuti konvensi di bawah agar tampilan konsisten.

---

## Daftar Isi
1. [Struktur Folder](#1-struktur-folder)
2. [Cara Membuat Halaman Baru](#2-cara-membuat-halaman-baru)
3. [Routing](#3-routing)
4. [Layout & Komponen](#4-layout--komponen)
5. [Variabel Warna CSS](#5-variabel-warna-css)
6. [Tipografi & Spacing](#6-tipografi--spacing)
7. [Kelas Utility](#7-kelas-utility)
8. [Komponen Reusable](#8-komponen-reusable)
9. [Konvensi Penamaan](#9-konvensi-penamaan)
10. [Bootstrap yang Dipakai](#10-bootstrap-yang-dipakai)
11. [FAQ](#11-faq)

---

## 1. Struktur Folder

```
frontend/
└── src/
    ├── assets/           ← Gambar, logo, aset statis
    ├── components/       ← Komponen UI yang dapat dipakai ulang
    │   ├── Navbar.jsx / Navbar.css
    │   ├── Footer.jsx / Footer.css
    │   ├── PageHeader.jsx / PageHeader.css
    │   └── Section.jsx / Section.css
    ├── layouts/
    │   └── PublicLayout.jsx  ← Navbar + konten + Footer
    ├── pages/            ← Satu file per halaman (1 anggota = 1 file)
    │   ├── Beranda.jsx
    │   ├── PetaBencana.jsx
    │   ├── StatistikBencana.jsx
    │   ├── InformasiOrangHilang.jsx
    │   ├── LaporkanBencana.jsx
    │   ├── LaporkanOrangHilang.jsx
    │   ├── CekStatusLaporan.jsx
    │   ├── Edukasi.jsx
    │   ├── LoginAdmin.jsx
    │   └── NotFound.jsx
    ├── App.jsx           ← Router root (jangan diubah tanpa koordinasi)
    ├── App.css           ← Kosong (jangan isi)
    ├── index.css         ← CSS global & variabel (jangan diubah tanpa koordinasi)
    └── main.jsx          ← Entry point (jangan diubah)
docs/
└── UI-GUIDE.md           ← File ini
```

> **Aturan penting:** Setiap anggota hanya mengedit file halaman miliknya di `pages/`.
> Jangan mengubah `App.jsx`, `index.css`, komponen di `components/`, atau `layouts/`
> tanpa koordinasi dengan seluruh tim.

---

## 2. Cara Membuat Halaman Baru

Jika kamu perlu membuat halaman tambahan yang belum ada:

### Langkah 1 — Buat file halaman
```jsx
// src/pages/NamaHalaman.jsx
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

export default function NamaHalaman() {
  return (
    <>
      <PageHeader
        title="Judul Halaman"
        subtitle="Deskripsi singkat halaman ini"
        icon="bi-nama-ikon"   // nama ikon dari Bootstrap Icons
      />
      <Section bg="white" py="lg">
        {/* Konten halaman kamu di sini */}
      </Section>
    </>
  );
}
```

### Langkah 2 — Daftarkan di App.jsx
```jsx
// src/App.jsx — tambahkan import dan <Route> baru
import NamaHalaman from './pages/NamaHalaman';

// Di dalam <Route element={<PublicLayout />}>:
<Route path="/rute-baru" element={<NamaHalaman />} />
```

### Langkah 3 — Tambah link di Navbar (opsional)
Edit `src/components/Navbar.jsx` jika menu baru perlu ditampilkan.

---

## 3. Routing

| Menu | Rute |
|---|---|
| Beranda | `/` |
| Peta Bencana | `/data-bencana/peta` |
| Statistik Bencana | `/data-bencana/statistik` |
| Informasi Orang Hilang | `/informasi-orang-hilang` |
| Laporkan Bencana | `/pelaporan/laporkan-bencana` |
| Laporkan Orang Hilang | `/pelaporan/laporkan-orang-hilang` |
| Cek Status Laporan | `/pelaporan/cek-status` |
| Edukasi | `/edukasi` |
| Login Admin | `/login-admin` |

Gunakan komponen `<Link to="/rute">` atau `<NavLink to="/rute">` dari `react-router-dom` (bukan `<a href>`).

---

## 4. Layout & Komponen

### PublicLayout
Semua halaman publik sudah otomatis dibungkus `PublicLayout` (Navbar + Footer).
**Kamu tidak perlu menambahkan Navbar/Footer secara manual** di file halamanmu.

```
PublicLayout
├── <Navbar />
├── <main>
│    └── <Outlet />  ← konten halamanmu render di sini
└── <Footer />
```

---

## 5. Variabel Warna CSS

Gunakan variabel CSS berikut (jangan hardcode nilai hex):

| Variabel | Nilai | Penggunaan |
|---|---|---|
| `--gs-green-dark` | `#1a4731` | Warna dominan, navbar, footer |
| `--gs-green` | `#2d6a4f` | Warna primer medium |
| `--gs-green-light` | `#52b788` | Aksen, hover, highlight |
| `--gs-green-muted` | `#d8f3dc` | Background tipis hijau |
| `--gs-white` | `#ffffff` | Putih murni |
| `--gs-gray-50` | `#f8f9fa` | Background paling terang |
| `--gs-gray-100` | `#f1f3f5` | Background terang |
| `--gs-gray-200` | `#e9ecef` | Border tipis |
| `--gs-gray-300` | `#dee2e6` | Border normal |
| `--gs-gray-500` | `#adb5bd` | Teks muted/placeholder |
| `--gs-gray-700` | `#495057` | Teks body |
| `--gs-gray-900` | `#212529` | Teks heading |
| `--gs-primary` | alias `--gs-green-dark` | Warna brand utama |
| `--gs-secondary` | alias `--gs-green` | Warna brand sekunder |
| `--gs-accent` | alias `--gs-green-light` | Aksen/highlight |
| `--gs-bg` | `#ffffff` | Background halaman |
| `--gs-bg-subtle` | `--gs-gray-50` | Background section abu-abu |
| `--gs-bg-muted` | `--gs-green-muted` | Background section hijau muda |
| `--gs-text` | `--gs-gray-700` | Teks body |
| `--gs-text-heading` | `--gs-gray-900` | Teks heading |
| `--gs-text-muted` | `--gs-gray-500` | Teks sekunder/placeholder |
| `--gs-border` | `--gs-gray-200` | Warna border |

**Contoh penggunaan:**
```css
.elemen-saya {
  color: var(--gs-green-dark);
  background-color: var(--gs-bg-subtle);
  border: 1px solid var(--gs-border);
}
```

---

## 6. Tipografi & Spacing

### Tipografi
| Variabel | Nilai |
|---|---|
| `--gs-font-sans` | `'Segoe UI', system-ui, Roboto, ...` |
| `--gs-font-mono` | `ui-monospace, Consolas, ...` |
| `--gs-font-size-base` | `1rem` (16px) |
| `--gs-line-height` | `1.6` |

### Spacing (8px grid)
| Variabel | Nilai |
|---|---|
| `--gs-space-1` | `0.25rem` (4px) |
| `--gs-space-2` | `0.5rem` (8px) |
| `--gs-space-3` | `0.75rem` (12px) |
| `--gs-space-4` | `1rem` (16px) |
| `--gs-space-5` | `1.5rem` (24px) |
| `--gs-space-6` | `2rem` (32px) |
| `--gs-space-7` | `3rem` (48px) |
| `--gs-space-8` | `4rem` (64px) |

### Border Radius & Shadow
| Variabel | Nilai |
|---|---|
| `--gs-radius-sm` | `4px` |
| `--gs-radius` | `8px` |
| `--gs-radius-lg` | `12px` |
| `--gs-shadow-sm` | Shadow tipis |
| `--gs-shadow` | Shadow normal |
| `--gs-shadow-lg` | Shadow tebal |

---

## 7. Kelas Utility

Kelas CSS khusus GeoSlide (didefinisikan di `index.css`):

| Kelas | Fungsi |
|---|---|
| `.gs-text-primary` | Warna teks hijau tua |
| `.gs-text-secondary` | Warna teks hijau medium |
| `.gs-text-muted` | Warna teks abu-abu muted |
| `.gs-bg-primary` | Background hijau tua |
| `.gs-bg-subtle` | Background abu-abu terang |
| `.gs-bg-muted` | Background hijau muda |
| `.gs-card` | Card dengan border, shadow, hover effect |
| `.gs-card-header` | Header dalam gs-card |
| `.gs-badge` | Badge/tag dasar |
| `.gs-badge-green` | Badge warna hijau |
| `.gs-badge-danger` | Badge warna merah |
| `.gs-divider` | Garis pemisah horizontal |
| `.btn-gs-primary` | Tombol hijau tua (utama) |
| `.btn-gs-secondary` | Tombol outline hijau |
| `.btn-gs-accent` | Tombol hijau terang |

**Contoh penggunaan:**
```jsx
<div className="gs-card">
  <div className="gs-card-header">Judul Kartu</div>
  <p className="gs-text-muted">Deskripsi konten</p>
  <button className="btn btn-gs-primary">Simpan</button>
</div>
```

---

## 8. Komponen Reusable

### `<PageHeader />`

Header standar di bagian atas halaman (gradient hijau tua).

```jsx
import PageHeader from '../components/PageHeader';

<PageHeader
  title="Judul Halaman"       // wajib
  subtitle="Deskripsi..."     // opsional
  icon="bi-map"               // opsional — nama kelas Bootstrap Icons
  center={false}              // opsional — rata tengah (default: false)
/>
```

---

### `<Section />`

Container pembungkus konten section halaman.

```jsx
import Section from '../components/Section';

<Section
  bg="white"    // 'white' | 'subtle' | 'muted' | 'dark'   (default: 'white')
  py="lg"       // 'sm' | 'md' | 'lg' | 'xl'               (default: 'lg')
  fluid={false} // true = container-fluid                    (default: false)
  id="anchor"   // ID untuk anchor link                      (opsional)
>
  {/* Konten section */}
</Section>
```

**Contoh pattern tipikal:**
```jsx
export default function HalamanSaya() {
  return (
    <>
      <PageHeader title="Judul" subtitle="Deskripsi" icon="bi-star" />

      <Section bg="white" py="lg">
        <h2>Konten Utama</h2>
        {/* ... */}
      </Section>

      <Section bg="subtle" py="md">
        <h2>Konten Sekunder</h2>
        {/* ... */}
      </Section>
    </>
  );
}
```

---

## 9. Konvensi Penamaan

| Item | Konvensi | Contoh |
|---|---|---|
| File komponen | PascalCase | `PageHeader.jsx` |
| File CSS komponen | Sama dengan komponen | `PageHeader.css` |
| File halaman | PascalCase | `PetaBencana.jsx` |
| Kelas CSS custom | `gs-` prefix, kebab-case | `.gs-card`, `.gs-btn-primary` |
| Props komponen | camelCase | `icon`, `subtitle`, `center` |

---

## 10. Bootstrap yang Dipakai

Bootstrap 5.3 dimuat via CDN di `index.html`. Semua kelas Bootstrap (`container`, `row`, `col-*`, `d-flex`, `mb-*`, dll.) tersedia.

**Bootstrap Icons** juga tersedia. Referensi ikon: [https://icons.getbootstrap.com](https://icons.getbootstrap.com)

```jsx
// Contoh penggunaan Bootstrap Icons
<i className="bi bi-map"></i>
<i className="bi bi-exclamation-triangle text-warning"></i>
```

> **Jangan** install framework CSS atau library animasi tambahan (Tailwind, Ant Design, Framer Motion, dsb.) tanpa koordinasi tim.

---

## 11. FAQ

**Q: Di mana saya meletakkan style khusus untuk halaman saya?**
A: Buat file CSS dengan nama yang sama: `NamaHalaman.css`, lalu import di `NamaHalaman.jsx`. Gunakan prefix kelas agar tidak bentrok, contoh: `.peta-bencana__map { ... }`.

**Q: Bagaimana cara navigasi antar halaman?**
A: Gunakan `<Link to="/rute">` atau `<NavLink to="/rute">` dari `react-router-dom`. Jangan gunakan `<a href>` untuk navigasi internal.

**Q: Bagaimana mengambil data dari backend?**
A: Gunakan `fetch` atau install `axios`. Panggil API di dalam `useEffect`. Backend berjalan di `http://localhost:5000` (sesuaikan dengan konfigurasi backend).

**Q: Saya perlu install library baru (Leaflet, Recharts, dsb.). Caranya?**
A: Jalankan `npm install nama-library` di dalam folder `frontend/`. Konfirmasi ke anggota lain sebelum install agar tidak ada konflik.

**Q: Bagaimana cara menjalankan frontend?**
A:
```bash
cd frontend
npm install   # pertama kali saja
npm run dev   # server berjalan di http://localhost:5173
```
