import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import StatusBadge from '../components/StatusBadge';
import {
  JENIS_KELAMIN,
  STATUS_PENCARIAN,
  formatTanggal,
  formatUsia,
} from '../utils/orangHilang';
import { getOpsiFilterOrangHilang, getOrangHilang } from '../services/orangHilangService';
import './InformasiOrangHilang.css';

const LIMIT = 12;

// Inisial dua huruf untuk avatar bila foto tidak dipublikasikan
function inisial(nama = '') {
  return nama.trim().split(/\s+/).slice(0, 2).map((kata) => kata[0]?.toUpperCase() || '').join('') || '?';
}
const initialFilters = { q: '', province: '', eventId: '', status: '' };
const initialApplied = { ...initialFilters, page: 1 };

/**
 * Halaman: Informasi Orang Hilang
 * File ini milik: Nanda
 *
 * Menampilkan orang yang dilaporkan hilang akibat tanah longsor dan sudah
 * diverifikasi admin. Foto hanya tampil bila pelapor mengizinkan publikasi.
 */
export default function InformasiOrangHilang() {
  const [filters, setFilters] = useState(initialFilters); // isi kolom (belum diterapkan)
  const [applied, setApplied] = useState(initialApplied); // filter yang dipakai ke server
  const [opsi, setOpsi] = useState({ provinsi: [], kejadian: [] });
  const [result, setResult] = useState({ data: [], meta: { total: 0, totalPages: 1 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getOpsiFilterOrangHilang(controller.signal)
      .then(setOpsi)
      .catch(() => {}); // dropdown kosong saja bila gagal; daftar tetap bisa dipakai
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    getOrangHilang(
      {
        q: applied.q,
        province: applied.province,
        event_id: applied.eventId,
        status: applied.status,
        page: applied.page,
        limit: LIMIT,
      },
      controller.signal,
    )
      .then(setResult)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [applied, reloadKey]);

  function apply(next) {
    setLoading(true);
    setError('');
    setApplied(next);
  }

  function handleSubmit(event) {
    event.preventDefault();
    apply({ ...applied, q: filters.q.trim(), page: 1 });
  }

  function handleSelect(key, value) {
    setFilters({ ...filters, [key]: value });
    apply({ ...applied, [key]: value, page: 1 });
  }

  function handleReset() {
    setFilters(initialFilters);
    apply(initialApplied);
  }

  function handleRetry() {
    setLoading(true);
    setError('');
    setReloadKey((key) => key + 1);
  }

  const { data, meta } = result;
  const adaFilter = applied.q || applied.province || applied.eventId || applied.status;

  return (
    <>
      <header className="oh-hero">
        <svg className="oh-hero__ridge" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 150 C 160 90 280 170 440 120 C 600 70 700 160 880 110 C 1060 60 1200 150 1440 90 L1440 220 L0 220Z" />
        </svg>
        <div className="oh-hero__inner">
          <span className="oh-hero__badge"><i className="bi bi-people" aria-hidden="true"></i> Informasi Publik</span>
          <h1 className="oh-hero__title">
            Informasi <em>Orang Hilang</em> Akibat Tanah Longsor
          </h1>
          <p className="oh-hero__sub">
            Daftar orang yang dilaporkan hilang pada kejadian tanah longsor dan sudah diverifikasi admin.
            Status pencarian diperbarui oleh admin.
          </p>
          <div className="oh-hero__actions">
            <a href="tel:117" className="oh-hero__btn oh-hero__btn--solid">
              <i className="bi bi-telephone" aria-hidden="true"></i> BNPB 117
            </a>
            <a href="tel:112" className="oh-hero__btn">
              <i className="bi bi-telephone-outbound" aria-hidden="true"></i> Darurat 112
            </a>
          </div>
        </div>
      </header>

      <Section bg="subtle" py="md">
        <form className="oh-filter" role="search" onSubmit={handleSubmit}>
          <div className="oh-filter__field oh-filter__field--search">
            <label htmlFor="oh-cari">Cari nama</label>
            <div className="oh-search-row">
              <div className="oh-input-icon">
                <i className="bi bi-search" aria-hidden="true"></i>
                <input
                  id="oh-cari"
                  type="search"
                  placeholder="Ketik nama orang"
                  maxLength={100}
                  value={filters.q}
                  onChange={(event) => setFilters({ ...filters, q: event.target.value })}
                />
              </div>
              <button type="submit" className="btn-pill btn-pill-primary">Cari</button>
            </div>
          </div>

          <div className="oh-filter__field">
            <label htmlFor="oh-provinsi">Wilayah (provinsi)</label>
            <select
              id="oh-provinsi"
              value={filters.province}
              onChange={(event) => handleSelect('province', event.target.value)}
            >
              <option value="">Semua wilayah</option>
              {opsi.provinsi.map((provinsi) => (
                <option key={provinsi} value={provinsi}>{provinsi}</option>
              ))}
            </select>
          </div>

          <div className="oh-filter__field">
            <label htmlFor="oh-kejadian">Kejadian longsor</label>
            <select
              id="oh-kejadian"
              value={filters.eventId}
              onChange={(event) => handleSelect('eventId', event.target.value)}
            >
              <option value="">Semua kejadian</option>
              {opsi.kejadian.map((kejadian) => (
                <option key={kejadian.id} value={kejadian.id}>{kejadian.judul}</option>
              ))}
            </select>
          </div>

          <div className="oh-filter__field">
            <label htmlFor="oh-status">Status pencarian</label>
            <select
              id="oh-status"
              value={filters.status}
              onChange={(event) => handleSelect('status', event.target.value)}
            >
              <option value="">Semua status</option>
              {Object.entries(STATUS_PENCARIAN).map(([nilai, label]) => (
                <option key={nilai} value={nilai}>{label}</option>
              ))}
            </select>
          </div>
        </form>

        <div className="oh-meta">
          <p className="gs-text-muted mb-0" aria-live="polite">
            {loading ? 'Memuat data…' : `${meta.total} laporan ditemukan`}
          </p>
          {adaFilter && (
            <button type="button" className="oh-link-btn" onClick={handleReset}>
              Hapus semua filter
            </button>
          )}
        </div>

        {error && (
          <div className="card-solid oh-state" role="alert">
            <h4>Data belum bisa dimuat</h4>
            <p className="gs-text-muted">{error}</p>
            <button type="button" className="btn-pill btn-pill-primary" onClick={handleRetry}>
              Coba lagi
            </button>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="card-solid oh-state">
            <h4>Tidak ada laporan yang cocok</h4>
            <p className="gs-text-muted">
              Coba kata kunci lain atau longgarkan filter. Laporan baru tampil setelah diverifikasi admin.
            </p>
            {adaFilter && (
              <button type="button" className="btn-pill btn-pill-primary" onClick={handleReset}>
                Hapus semua filter
              </button>
            )}
          </div>
        )}

        {loading && !error && data.length === 0 && (
          <div className="oh-grid" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="oh-card oh-skeleton">
                <div className="oh-card__photo" />
                <div className="oh-card__body">
                  <span className="oh-skeleton__line" style={{ width: '40%' }} />
                  <span className="oh-skeleton__line oh-skeleton__line--lg" style={{ width: '75%' }} />
                  <span className="oh-skeleton__line" style={{ width: '55%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="oh-grid">
          {data.map((orang) => (
            <Link key={orang.id} to={`/informasi-orang-hilang/${orang.id}`} className="oh-card">
              <div className="oh-card__photo">
                {orang.foto ? (
                  <img src={orang.foto} alt={`Foto ${orang.nama}`} loading="lazy" />
                ) : (
                  <div
                    className={`oh-card__placeholder oh-tone-${orang.id % 4}`}
                    role="img"
                    aria-label="Foto tidak dipublikasikan"
                  >
                    <span className="oh-card__initials" aria-hidden="true">{inisial(orang.nama)}</span>
                    <small>Foto tidak dipublikasikan</small>
                  </div>
                )}
                <div className="oh-card__badge"><StatusBadge status={orang.status} /></div>
              </div>

              <div className="oh-card__body">
                <h3 className="oh-card__name">{orang.nama}</h3>
                <p className="oh-card__sub">
                  {formatUsia(orang.usia)}, {JENIS_KELAMIN[orang.jenisKelamin]}
                </p>

                <ul className="oh-card__facts">
                  <li>
                    <i className="bi bi-geo-alt" aria-hidden="true"></i>
                    <span>
                      <b>Terakhir terlihat</b>
                      {orang.lokasiTerakhir}
                    </span>
                  </li>
                  <li>
                    <i className="bi bi-clock-history" aria-hidden="true"></i>
                    <span>
                      <b>Waktu</b>
                      {formatTanggal(orang.waktuTerakhirTerlihat)}
                    </span>
                  </li>
                </ul>

                {orang.kejadian && (
                  <span className="oh-card__event" title={orang.kejadian.judul}>
                    <i className="bi bi-triangle-fill" aria-hidden="true"></i>
                    {orang.kejadian.judul}
                  </span>
                )}

                <span className="oh-card__more">
                  Lihat detail <i className="bi bi-arrow-right" aria-hidden="true"></i>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {meta.totalPages > 1 && (
          <nav className="oh-pagination" aria-label="Halaman daftar">
            <button
              type="button"
              className="btn-pill btn-pill-white"
              disabled={applied.page <= 1}
              onClick={() => apply({ ...applied, page: applied.page - 1 })}
            >
              Sebelumnya
            </button>
            <span className="gs-text-muted">Halaman {applied.page} dari {meta.totalPages}</span>
            <button
              type="button"
              className="btn-pill btn-pill-white"
              disabled={applied.page >= meta.totalPages}
              onClick={() => apply({ ...applied, page: applied.page + 1 })}
            >
              Berikutnya
            </button>
          </nav>
        )}
      </Section>

      <Section bg="white" py="md">
        <div className="oh-notice">
          <span className="oh-notice__icon"><i className="bi bi-shield-check" aria-hidden="true"></i></span>
          <div>
            <h4>Tentang informasi di halaman ini</h4>
            <p className="gs-text-muted mb-2">
              Setiap laporan diperiksa admin sebelum ditampilkan. Foto dan data pribadi hanya dipublikasikan
              bila ada izin dari pelapor. Mohon tidak menyebarkan ulang data ini di luar kebutuhan pencarian.
            </p>
            <p className="mb-0">
              Mengetahui keberadaan seseorang? Hubungi BNPB di <strong>117</strong> atau layanan darurat di{' '}
              <strong>112</strong>.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}