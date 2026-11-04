import { Link } from 'react-router-dom';
import Section from '../components/Section';

/**
 * Halaman: 404 Not Found
 * Ditampilkan otomatis jika rute tidak ditemukan.
 */
export default function NotFound() {
  return (
    <Section bg="subtle" py="xl">
      <div className="text-center py-5">
        <div
          style={{
            fontSize: '5rem',
            color: 'var(--gs-green-light)',
            lineHeight: 1,
            marginBottom: '1.5rem',
          }}
          aria-hidden="true"
        >
          <i className="bi bi-exclamation-circle"></i>
        </div>
        <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--gs-green-dark)' }}>
          404
        </h1>
        <h2 className="mb-3" style={{ color: 'var(--gs-gray-700)' }}>
          Halaman Tidak Ditemukan
        </h2>
        <p className="gs-text-muted mb-4">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link to="/" className="btn btn-gs-primary">
          <i className="bi bi-house me-2"></i>
          Kembali ke Beranda
        </Link>
      </div>
    </Section>
  );
}
