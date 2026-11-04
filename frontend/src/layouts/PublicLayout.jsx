import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PublicLayout.css';

/**
 * PublicLayout — Layout utama untuk semua halaman publik GeoSlide.
 *
 * Struktur:
 *   <Navbar />
 *   <main>  ← <Outlet /> (konten halaman yang di-render router)  </main>
 *   <Footer />
 *
 * Cara pakai di router (App.jsx):
 *   <Route element={<PublicLayout />}>
 *     <Route path="/" element={<Beranda />} />
 *     <Route path="/edukasi" element={<Edukasi />} />
 *     ...
 *   </Route>
 *
 * Di halaman (misal Edukasi.jsx), cukup return konten halaman biasa —
 * Navbar dan Footer sudah otomatis disertakan oleh PublicLayout.
 */
export default function PublicLayout() {
  return (
    <div className="gs-layout">
      <Navbar />
      <main className="gs-layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
