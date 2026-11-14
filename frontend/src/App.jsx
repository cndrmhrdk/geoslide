import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context
import { AdminAuthProvider, useAdminAuth } from './hooks/useAdminAuth';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout  from './layouts/AdminLayout';

// Public pages
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

// Admin pages
import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminDataBencana from './pages/admin/AdminDataBencana';
import AdminLaporan    from './pages/admin/AdminLaporan';
import AdminOrangHilang from './pages/admin/AdminOrangHilang';
import AdminSumberData from './pages/admin/AdminSumberData';
import AdminAkun       from './pages/admin/AdminAkun';

/**
 * ProtectedRoute — redirect ke /login-admin jika belum login
 */
function ProtectedRoute({ children }) {
  const { token } = useAdminAuth();
  if (!token) return <Navigate to="/login-admin" replace />;
  return children;
}

/**
 * App.jsx — Root Routing GeoSlide
 */
function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Halaman publik ── */}
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
            <Route path="/edukasi/model-3d"                element={<Edukasi />} />
            <Route path="/login-admin"                     element={<LoginAdmin />} />
            <Route path="*"                                element={<NotFound />} />
          </Route>

          {/* ── Halaman admin (dilindungi auth) ── */}
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin"              element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard"    element={<AdminDashboard />} />
            <Route path="/admin/data-bencana" element={<AdminDataBencana />} />
            <Route path="/admin/laporan"      element={<AdminLaporan />} />
            <Route path="/admin/orang-hilang" element={<AdminOrangHilang />} />
            <Route path="/admin/sumber-data"  element={<AdminSumberData />} />
            <Route path="/admin/akun"         element={<AdminAkun />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}

export default App;
