import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Section from '../components/Section';
import StatusBadge from '../components/StatusBadge';
import {
  JENIS_KELAMIN,
  formatTanggal,
  formatUsia,
  formatWilayah,
} from '../utils/orangHilang';
import { getOrangHilangById } from '../services/orangHilangService';
import './InformasiOrangHilang.css';

/**
 * Halaman: Detail Informasi Orang Hilang
 * File ini milik: Nanda
 *
 * Hanya laporan yang sudah diverifikasi admin yang bisa dibuka;
 * selain itu API mengembalikan 404 dan halaman menampilkan "tidak ditemukan".
 */
export default function InformasiOrangHilangDetail() {
  const { id } = useParams();
  // key={id} mereset state otomatis bila id berubah
  return <DetailContent key={id} id={id} />;
}

function inisial(nama = '') {
  return nama.trim().split(/\s+/).slice(0, 2).map((kata) => kata[0]?.toUpperCase() || '').join('') || '?';
}

function DetailContent({ id }) {
  const [orang, setOrang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    getOrangHilangById(id, controller.signal)
      .then(setOrang)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  return (
    <>
      <header className="oh-hero oh-hero--detail">
        <svg className="oh-hero__ridge" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 150 C 160 90 280 170 440 120 C 600 70 700 160 880 110 C 1060 60 1200 150 1440 90 L1440 220 L0 220Z" />
        </svg>
        <div className="oh-hero__inner">
          <Link to="/informasi-orang-hilang" className="oh-back">
            <i className="bi bi-arrow-left" aria-hidden="true"></i> Kembali ke daftar
          </Link>
          {orang ? (
            <>
              <div className="oh-detail__status"><StatusBadge status={orang.status} /></div>
              <h1 className="oh-hero__title oh-hero__title--detail">{orang.nama}</h1>
              <p className="oh-hero__sub">
                {formatUsia(orang.usia)}, {JENIS_KELAMIN[orang.jenisKelamin]}
              </p>
            </>
          ) : (
            <h1 className="oh-hero__title oh-hero__title--detail">
              {loading ? 'Memuat data…' : 'Detail Orang Hilang'}
            </h1>
          )}
        </div>
      </header>

      <Section bg="subtle" py="lg">
        {error && (
          <div className="oh-state" role="alert">
            <h4>Data belum bisa dimuat</h4>
            <p className="gs-text-muted">{error}</p>
          </div>
        )}

        {!loading && !error && !orang && (
          <div className="oh-state">
            <h4>Laporan tidak ditemukan</h4>
            <p className="gs-text-muted">Laporan ini belum diverifikasi, sudah dihapus, atau tautannya salah.</p>
            <Link to="/informasi-orang-hilang" className="btn-pill btn-pill-primary">
              Lihat semua laporan
            </Link>
          </div>
        )}

        {orang && (
          <div className="oh-detail">
            <aside className="oh-detail__photo">
              {orang.foto ? (
                <img src={orang.foto} alt={`Foto ${orang.nama}`} />
              ) : (
                <div className={`oh-card__placeholder oh-card__placeholder--lg oh-tone-${orang.id % 4}`}>
                  <span className="oh-card__initials" aria-hidden="true">{inisial(orang.nama)}</span>
                  <small>Foto tidak dipublikasikan</small>
                </div>
              )}
            </aside>

            <div className="oh-detail__main">
              <section className="oh-detail__card">
                <h2 className="oh-detail__heading">Ringkasan laporan</h2>
                <dl className="oh-detail__list">
                  <div className="oh-detail__row">
                    <i className="bi bi-person-vcard" aria-hidden="true"></i>
                    <div>
                      <dt>Ciri-ciri fisik</dt>
                      <dd>{orang.ciriFisik || 'Belum ada keterangan ciri fisik.'}</dd>
                    </div>
                  </div>
                  <div className="oh-detail__row">
                    <i className="bi bi-geo-alt" aria-hidden="true"></i>
                    <div>
                      <dt>Lokasi terakhir terlihat</dt>
                      <dd>{orang.lokasiTerakhir}</dd>
                    </div>
                  </div>
                  <div className="oh-detail__row">
                    <i className="bi bi-clock-history" aria-hidden="true"></i>
                    <div>
                      <dt>Waktu terakhir terlihat</dt>
                      <dd>{formatTanggal(orang.waktuTerakhirTerlihat)}</dd>
                    </div>
                  </div>
                  {orang.kejadian && (
                    <div className="oh-detail__row">
                      <i className="bi bi-triangle" aria-hidden="true"></i>
                      <div>
                        <dt>Kejadian tanah longsor</dt>
                        <dd>{orang.kejadian.judul}</dd>
                        <dd className="gs-text-muted">
                          {formatTanggal(orang.kejadian.tanggal, false)}
                          {formatWilayah(orang.kejadian) && `, ${formatWilayah(orang.kejadian)}`}
                        </dd>
                      </div>
                    </div>
                  )}
                </dl>
              </section>

              <section className="oh-detail__card oh-detail__card--status">
                <h2 className="oh-detail__heading">Status pencarian</h2>
                <p>{orang.catatanKontak || 'Belum ada catatan tambahan. Status diperbarui oleh admin.'}</p>
                <p className="gs-text-muted mb-0">
                  <i className="bi bi-arrow-repeat" aria-hidden="true"></i> Diperbarui {formatTanggal(orang.diperbaruiPada)}
                </p>
              </section>

              <div className="oh-notice oh-notice--compact">
                <span className="oh-notice__icon"><i className="bi bi-telephone" aria-hidden="true"></i></span>
                <p className="mb-0">
                  Punya informasi tentang keberadaan {orang.nama}? Hubungi BNPB di <strong>117</strong> atau
                  layanan darurat di <strong>112</strong>.
                </p>
              </div>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}