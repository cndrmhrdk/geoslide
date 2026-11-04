import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

/**
 * Halaman: Login Admin
 * Halaman otentikasi administrator GeoSlide dengan kartu bersih dan tombol pill.
 */
export default function LoginAdmin() {
  return (
    <>
      <PageHeader
        badge="Portal Administrator"
        title="Login Admin GeoSlide"
        subtitle="Masuk ke dasbor manajemen laporan kejadian, verifikasi data, dan konfigurasi sistem."
        icon="bi-shield-lock"
        center
      />

      <Section bg="subtle" py="lg">
        <div className="container-tight" style={{ maxWidth: '440px' }}>
          <div className="card-solid p-4 p-md-5">
            <div className="text-center mb-4">
              <span
                className="d-inline-flex p-3 rounded-circle mb-3"
                style={{ backgroundColor: 'var(--primary-soft)', color: 'var(--primary)' }}
              >
                <i className="bi bi-shield-lock fs-4"></i>
              </span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 600 }}>Akses Masuk</h2>
              <p className="gs-text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                Gunakan kredensial resmi administrator
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <label className="form-label fw-medium" style={{ fontSize: '0.875rem' }}>
                  Email / Username
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill px-3 py-2"
                  placeholder="admin@geoslide.id"
                  autoComplete="username"
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium" style={{ fontSize: '0.875rem' }}>
                  Kata Sandi
                </label>
                <input
                  type="password"
                  className="form-control rounded-pill px-3 py-2"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn-pill-action w-100 justify-content-between py-2 px-3"
              >
                <span>Masuk ke Dasbor</span>
                <span className="btn-pill-action__icon" aria-hidden="true">
                  <i className="bi bi-arrow-right"></i>
                </span>
              </button>
            </form>
          </div>
        </div>
      </Section>
    </>
  );
}
