import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import './CekStatusLaporan.css';

/* ---- Status config ---- */
const STATUS_CONFIG = {
  pending: {
    icon:    'bi-hourglass-split',
    label:   'Menunggu Verifikasi',
    color:   '#854D0E',
    bg:      '#FEF9C3',
    border:  '#FDE68A',
    desc:    'Laporan Anda telah diterima dan sedang dalam antrian peninjauan oleh tim GeoSlide.',
  },
  approved: {
    icon:    'bi-check-circle-fill',
    label:   'Disetujui',
    color:   '#166534',
    bg:      '#F0FDF4',
    border:  '#BBF7D0',
    desc:    'Laporan Anda telah diverifikasi dan telah dipublikasikan dalam sistem GeoSlide.',
  },
  rejected: {
    icon:    'bi-x-circle-fill',
    label:   'Ditolak',
    color:   '#991B1B',
    bg:      '#FFF1F2',
    border:  '#FECDD3',
    desc:    'Laporan Anda tidak dapat disetujui. Lihat alasan di bawah.',
  },
};

export default function CekStatusLaporan() {
  const [code,    setCode]    = useState('');
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);   // null | data object
  const [error,   setError]   = useState('');

  async function handleCheck(e) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) { setError('Masukkan kode pelacakan.'); return; }

    setLoading(true);
    setResult(null);
    setError('');

    try {
      // Pilih endpoint berdasarkan prefix kode: OH- = orang hilang, GS- = laporan bencana
      const url = trimmed.startsWith('OH-')
        ? `/api/orang-hilang/tracking/${encodeURIComponent(trimmed)}`
        : `/api/laporan-bencana/${encodeURIComponent(trimmed)}`;

      const res  = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Kode tidak ditemukan.');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setCode('');
    setError('');
  }

  const cfg = result ? (STATUS_CONFIG[result.status] || STATUS_CONFIG.pending) : null;

  return (
    <>
      <PageHeader
        badge="Pelaporan Masyarakat"
        title="Cek Status Laporan"
        highlight="Status"
        subtitle="Masukkan kode pelacakan yang Anda terima saat mengirim laporan untuk melihat perkembangannya."
        icon="bi-search"
      />

      <Section bg="subtle" py="lg">
        <div className="csl-wrap">

          {/* ---- Search card ---- */}
          <div className="csl-search-card">
            <div className="csl-search-card__icon-wrap">
              <i className="bi bi-ticket-detailed-fill"></i>
            </div>
            <h2 className="csl-search-card__title">Lacak Laporan Anda</h2>
            <p className="csl-search-card__sub">
              Kode pelacakan dikirimkan setelah laporan berhasil dikirim.{' '}
              Laporan bencana: <code className="csl-code-example">GS-YYYYMMDD-XXXXXX</code>{' '}
              · Orang hilang: <code className="csl-code-example">OH-YYYYMMDD-XXXXXX</code>
            </p>

            <form className="csl-form" onSubmit={handleCheck}>
              <div className="csl-input-row">
                <div className="csl-input-wrap">
                  <i className="bi bi-search csl-input-icon"></i>
                  <input
                    className={`csl-input${error ? ' csl-input--error' : ''}`}
                    type="text"
                    value={code}
                    onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); setResult(null); }}
                    placeholder="GS- atau OH-YYYYMMDD-XXXXXX"
                    maxLength={30}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-pill-action csl-submit-btn"
                  disabled={loading}
                >
                  {loading
                    ? <><span className="csl-spinner"></span><span>Memeriksa…</span></>
                    : <><span>Cek Status</span><span className="btn-pill-action__icon"><i className="bi bi-arrow-right"></i></span></>
                  }
                </button>
              </div>
              {error && (
                <p className="csl-error">
                  <i className="bi bi-exclamation-circle me-1"></i>{error}
                </p>
              )}
            </form>
          </div>

          {/* ---- Result card ---- */}
          {result && cfg && (
            <div className="csl-result-card" style={{ '--status-bg': cfg.bg, '--status-color': cfg.color, '--status-border': cfg.border }}>

              {/* Status header */}
              <div className="csl-result-status">
                <div className="csl-result-status__icon">
                  <i className={`bi ${cfg.icon}`}></i>
                </div>
                <div>
                  <div className="csl-result-status__label">{cfg.label}</div>
                  <div className="csl-result-status__desc">{cfg.desc}</div>
                </div>
              </div>

              {/* Detail grid */}
              <div className="csl-detail-grid">
                {/* Kode & Jenis */}
                <div className="csl-detail-item">
                  <span className="csl-detail-item__key"><i className="bi bi-ticket me-1"></i>Kode Laporan</span>
                  <span className="csl-detail-item__val csl-detail-item__val--mono">{result.tracking_code}</span>
                </div>
                <div className="csl-detail-item">
                  <span className="csl-detail-item__key"><i className="bi bi-tag me-1"></i>Jenis Laporan</span>
                  <span className="csl-detail-item__val">
                    {result.jenis === 'orang_hilang' ? 'Orang Hilang' : 'Kejadian Bencana'}
                  </span>
                </div>

                {/* Lokasi — label berbeda tergantung jenis */}
                <div className="csl-detail-item">
                  <span className="csl-detail-item__key">
                    <i className="bi bi-geo-alt me-1"></i>
                    {result.jenis === 'orang_hilang' ? 'Lokasi Terakhir Terlihat' : 'Lokasi'}
                  </span>
                  <span className="csl-detail-item__val">{result.location || '—'}</span>
                </div>

                {/* Tanggal kejadian (hanya untuk laporan bencana) */}
                {result.jenis !== 'orang_hilang' && (
                  <div className="csl-detail-item">
                    <span className="csl-detail-item__key"><i className="bi bi-calendar-event me-1"></i>Tanggal Kejadian</span>
                    <span className="csl-detail-item__val">
                      {result.event_date
                        ? new Date(result.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                        : '—'}
                    </span>
                  </div>
                )}

                {/* Status pencarian (hanya untuk orang hilang) */}
                {result.jenis === 'orang_hilang' && (
                  <div className="csl-detail-item">
                    <span className="csl-detail-item__key"><i className="bi bi-search me-1"></i>Status Pencarian</span>
                    <span className="csl-detail-item__val">
                      {result.search_status === 'searching' ? '🔍 Sedang Dicari'
                        : result.search_status === 'found' ? '✅ Ditemukan'
                        : '📁 Kasus Ditutup'}
                    </span>
                  </div>
                )}

                <div className="csl-detail-item">
                  <span className="csl-detail-item__key"><i className="bi bi-clock me-1"></i>Dikirim Pada</span>
                  <span className="csl-detail-item__val">{result.submitted_at || '—'}</span>
                </div>
                {result.reviewed_at && (
                  <div className="csl-detail-item">
                    <span className="csl-detail-item__key"><i className="bi bi-check2-all me-1"></i>Ditinjau Pada</span>
                    <span className="csl-detail-item__val">
                      {new Date(result.reviewed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>

              {/* Rejection reason */}
              {result.status === 'rejected' && result.rejection_reason && (
                <div className="csl-rejection">
                  <div className="csl-rejection__title">
                    <i className="bi bi-info-circle me-1"></i>Alasan Penolakan
                  </div>
                  <p className="csl-rejection__body">{result.rejection_reason}</p>
                </div>
              )}

              {/* Actions */}
              <div className="csl-result-actions">
                <button className="btn-pill btn-pill-secondary csl-reset-btn" onClick={handleReset}>
                  <i className="bi bi-arrow-left me-1"></i> Cek Kode Lain
                </button>
                {result.status === 'rejected' && (
                  <a href="/pelaporan/laporkan-bencana" className="btn-pill-action">
                    <span>Kirim Laporan Baru</span>
                    <span className="btn-pill-action__icon"><i className="bi bi-arrow-right"></i></span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* ---- Info section ---- */}
          <div className="csl-info-row">
            {[
              { icon: 'bi-hourglass-split', color: '#854D0E', bg: '#FEF9C3', title: 'Menunggu Verifikasi', desc: 'Laporan sedang ditinjau oleh tim GeoSlide.' },
              { icon: 'bi-check-circle-fill', color: '#166534', bg: '#F0FDF4', title: 'Disetujui', desc: 'Laporan valid dan telah dipublikasikan.' },
              { icon: 'bi-x-circle-fill', color: '#991B1B', bg: '#FFF1F2', title: 'Ditolak', desc: 'Laporan tidak memenuhi kriteria verifikasi.' },
            ].map(item => (
              <div key={item.title} className="csl-info-item">
                <div className="csl-info-item__icon" style={{ background: item.bg, color: item.color }}>
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <div>
                  <div className="csl-info-item__title" style={{ color: item.color }}>{item.title}</div>
                  <div className="csl-info-item__desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ---- Help section ---- */}
          <div className="csl-help">
            <i className="bi bi-question-circle csl-help__icon"></i>
            <div>
              <div className="csl-help__title">Tidak menemukan kode Anda?</div>
              <p className="csl-help__text">
                Pastikan kode diketik dengan benar. Kode pelacakan terdiri dari format{' '}
                <code>GS-YYYYMMDD-XXXXXX</code> dan diberikan saat laporan berhasil terkirim.
                Jika Anda tidak menyimpan kode, Anda perlu mengirim laporan baru.
              </p>
              <a href="/pelaporan/laporkan-bencana" className="csl-help__link">
                <i className="bi bi-plus-circle me-1"></i>Kirim laporan baru
              </a>
            </div>
          </div>

        </div>
      </Section>
    </>
  );
}
