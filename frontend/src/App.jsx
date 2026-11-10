import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout
import PublicLayout from './layouts/PublicLayout';

// Pages
import Beranda              from './pages/Beranda';
import PetaBencana          from './pages/PetaBencana';
import StatistikBencana     from './pages/StatistikBencana';
import InformasiOrangHilang from './pages/InformasiOrangHilang';
import InformasiOrangHilangDetail from './pages/InformasiOrangHilangDetail';
import LaporkanBencana      from './pages/LaporkanBencana';
import LaporkanOrangHilang  from './pages/LaporkanOrangHilang';
import CekStatusLaporan     from './pages/CekStatusLaporan';
import Edukasi              from './pages/Edukasi';
import LoginAdmin           from './pages/LoginAdmin';
import NotFound             from './pages/NotFound';

/**
 * App.jsx — Root Routing GeoSlide
 *
 * Semua halaman publik dibungkus oleh PublicLayout (Navbar + Footer).
 * Untuk menambah halaman baru:
 *   1. Buat file di src/pages/NamaHalaman.jsx
 *   2. Import di sini
 *   3. Tambahkan <Route path="/rute-baru" element={<NamaHalaman />} />
 *      di dalam <Route element={<PublicLayout />}>
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Semua halaman publik menggunakan PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/"                                element={<Beranda />} />
          <Route path="/data-bencana/peta"               element={<PetaBencana />} />
          <Route path="/data-bencana/statistik"          element={<StatistikBencana />} />
          <Route path="/informasi-orang-hilang"          element={<InformasiOrangHilang />} />
          <Route path="/informasi-orang-hilang/:id"      element={<InformasiOrangHilangDetail />} />
          <Route path="/pelaporan/laporkan-bencana"      element={<LaporkanBencana />} />
          <Route path="/pelaporan/laporkan-orang-hilang" element={<LaporkanOrangHilang />} />
          <Route path="/pelaporan/cek-status"            element={<CekStatusLaporan />} />
          <Route path="/edukasi"                         element={<Edukasi />} />
          <Route path="/login-admin"                     element={<LoginAdmin />} />

          {/* 404 — harus selalu di paling bawah */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
