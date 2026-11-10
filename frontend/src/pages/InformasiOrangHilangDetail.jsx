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
    <Section bg="subtle" py="lg">
      <Link to="/informasi-orang-hilang" className="oh-back">
        <i className="bi bi-arrow-left" aria-hidden="true"></i> Kembali ke daftar
      </Link>

      {loading && <p className="gs-text-muted">Memuat data…</p>}

      {error && (
        <div className="card-solid oh-state" role="alert">
          <h4>Data belum bisa dimuat</h4>
          <p className="gs-text-muted">{error}</p>
        </div>
      )}

      {!loading && !error && !orang && (
        <div className="card-solid oh-state">
          <h4>Laporan tidak ditemukan</h4>
          <p className="gs-text-muted">Laporan ini belum diverifikasi, sudah dihapus, atau tautannya salah.</p>
          <Link to="/informasi-orang-hilang" className="btn-pill btn-pill-primary">
            Lihat semua laporan
          </Link>
        </div>
      )}

      {orang && (
        <div className="oh-detail">
          <aside className="oh-detail__photo card-solid">
            {orang.foto ? (
              <img src={orang.foto} alt={`Foto ${orang.nama}`} />
            ) : (
              <div className="oh-card__placeholder oh-card__placeholder--lg">
                <i className="bi bi-person" aria-hidden="true"></i>
                <span>Foto tidak dipublikasikan</span>
              </div>
            )}
          </aside>

          <div className="oh-detail__main">
            <StatusBadge status={orang.status} />
            <h1 className="oh-detail__title">{orang.nama}</h1>
            <p className="oh-card__sub">
              {formatUsia(orang.usia)}, {JENIS_KELAMIN[orang.jenisKelamin]}
            </p>

            <div className="card-solid oh-detail__card">
              <dl className="oh-detail__list">
                <div>
                  <dt>Ciri-ciri fisik</dt>
                  <dd>{orang.ciriFisik || 'Belum ada keterangan ciri fisik.'}</dd>
                </div>
                <div>
                  <dt>Lokasi terakhir terlihat</dt>
                  <dd>{orang.lokasiTerakhir}</dd>
                </div>
                <div>
                  <dt>Waktu terakhir terlihat</dt>
                  <dd>{formatTanggal(orang.waktuTerakhirTerlihat)}</dd>
                </div>
                {orang.kejadian && (
                  <div>
                    <dt>Kejadian tanah longsor</dt>
                    <dd>{orang.kejadian.judul}</dd>
                    <dd className="gs-text-muted">
                      {formatTanggal(orang.kejadian.tanggal, false)}
                      {formatWilayah(orang.kejadian) && `, ${formatWilayah(orang.kejadian)}`}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="card-solid oh-detail__card">
              <div className="card-header-clean">
                <span>Status pencarian</span>
              </div>
              <p>{orang.catatanKontak || 'Belum ada catatan tambahan. Status diperbarui oleh admin.'}</p>
              <p className="gs-text-muted mb-0">Diperbarui {formatTanggal(orang.diperbaruiPada)}</p>
            </div>

            <div className="oh-notice oh-notice--compact">
              <i className="bi bi-telephone" aria-hidden="true"></i>
              <p className="mb-0">
                Punya informasi tentang keberadaan {orang.nama}? Hubungi BNPB di <strong>117</strong> atau
                layanan darurat di <strong>112</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
