import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

/**
 * Halaman: Login Admin
 * Halaman otentikasi administrator GeoSlide dengan kartu bersih dan tombol pill.
 */
export default function LoginAdmin() {
  const { login, loading, error } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate('/admin/dashboard');
  }

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

            {error && (
              <div
                className="mb-3 d-flex align-items-center gap-2 p-3 rounded-3"
                style={{ background: '#FFF1F2', color: '#9F1239', border: '1px solid #FECDD3', fontSize: '0.84rem' }}
              >
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium" style={{ fontSize: '0.875rem' }}>
                  Email
                </label>
                <input
                  type="email"
                  className="form-control rounded-pill px-3 py-2"
                  placeholder="admin@geoslide.id"
                  autoComplete="username"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium" style={{ fontSize: '0.875rem' }}>
                  Kata Sandi
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="form-control rounded-pill px-3 py-2"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    style={{
                      position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--muted)', fontSize: '0.95rem',
                    }}
                    tabIndex={-1}
                  >
                    <i className={`bi bi-eye${showPw ? '-slash' : ''}`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-pill-action w-100 justify-content-between py-2 px-3"
                disabled={loading}
              >
                <span>{loading ? 'Memverifikasi…' : 'Masuk ke Dasbor'}</span>
                <span className="btn-pill-action__icon" aria-hidden="true">
                  {loading
                    ? <span className="spinner-border spinner-border-sm" style={{ width: '14px', height: '14px' }}></span>
                    : <i className="bi bi-arrow-right"></i>
                  }
                </span>
              </button>
            </form>
          </div>
        </div>
      </Section>
    </>
  );
}
