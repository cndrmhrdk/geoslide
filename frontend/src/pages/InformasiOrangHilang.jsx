import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
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
      <PageHeader
        badge="Informasi Publik"
        title="Informasi Orang Hilang Akibat Tanah Longsor"
        highlight="Orang Hilang"
        subtitle="Daftar orang yang dilaporkan hilang pada kejadian tanah longsor dan sudah diverifikasi admin. Status pencarian diperbarui oleh admin."
        icon="bi-people"
      />

      <Section bg="subtle" py="md">
        <form className="oh-filter card-solid" role="search" onSubmit={handleSubmit}>
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

        <div className="oh-grid">
          {data.map((orang) => (
            <Link key={orang.id} to={`/informasi-orang-hilang/${orang.id}`} className="oh-card card-solid">
              <div className="oh-card__photo">
                {orang.foto ? (
                  <img src={orang.foto} alt={`Foto ${orang.nama}`} loading="lazy" />
                ) : (
                  <div className="oh-card__placeholder" role="img" aria-label="Foto tidak dipublikasikan">
                    <i className="bi bi-person" aria-hidden="true"></i>
                  </div>
                )}
              </div>

              <div className="oh-card__body">
                <StatusBadge status={orang.status} />
                <h3 className="oh-card__name">{orang.nama}</h3>
                <p className="oh-card__sub">
                  {formatUsia(orang.usia)}, {JENIS_KELAMIN[orang.jenisKelamin]}
                </p>

                <dl className="oh-card__facts">
                  <div>
                    <dt>Terakhir terlihat</dt>
                    <dd>{orang.lokasiTerakhir}</dd>
                    <dd className="gs-text-muted">{formatTanggal(orang.waktuTerakhirTerlihat)}</dd>
                  </div>
                  {orang.kejadian && (
                    <div>
                      <dt>Kejadian</dt>
                      <dd>{orang.kejadian.judul}</dd>
                    </div>
                  )}
                </dl>

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
          <i className="bi bi-shield-check" aria-hidden="true"></i>
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
