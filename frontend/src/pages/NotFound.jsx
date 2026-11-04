import { Link } from 'react-router-dom';
import Section from '../components/Section';

/**
 * Halaman: 404 Not Found
 * Ditampilkan otomatis jika rute tidak ditemukan.
 */
export default function NotFound() {
  return (
    <Section bg="subtle" py="xl">
      <div className="container-tight py-4">
        <div className="card-solid text-center py-5 px-4">
          <div
            style={{
              fontSize: '4.5rem',
              color: 'var(--primary)',
              lineHeight: 1,
              marginBottom: '1.25rem',
            }}
            aria-hidden="true"
          >
            <i className="bi bi-compass"></i>
          </div>
          <span className="badge-pill badge-primary-soft mb-3">Kesalahan 404</span>
          <h1 className="mb-2" style={{ fontSize: '2.5rem', fontWeight: 600 }}>
            Halaman Tidak Ditemukan
          </h1>
          <p className="gs-text-muted mb-4 mx-auto" style={{ maxWidth: '440px' }}>
            Rute atau halaman yang Anda cari mungkin telah dipindahkan, diubah namanya, atau tidak tersedia.
          </p>
          <div>
            <Link to="/" className="btn-pill btn-pill-primary">
              <i className="bi bi-arrow-left me-1"></i>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
