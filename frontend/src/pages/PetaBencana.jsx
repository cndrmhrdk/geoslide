import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

/**
 * Halaman: Peta Bencana
 * Halaman data geospasial: latar bersih, kartu solid kontras tinggi,
 * sangat mudah dibaca, dengan animasi minimal (hover & transisi halus).
 */
export default function PetaBencana() {
  return (
    <>
      <PageHeader
        badge="Sistem Informasi Spasial"
        title="Peta Sebaran Bencana Tanah Longsor"
        subtitle="Visualisasi persebaran kejadian dan zona kerentanan tanah longsor di seluruh wilayah Indonesia."
        icon="bi-map"
      />

      <Section bg="white" py="md">
        {/* Bilah Filter & Pencarian Bersih */}
        <div className="card-solid p-3 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Cari provinsi, kota, atau kecamatan..."
                  aria-label="Cari wilayah"
                />
              </div>
            </div>
            <div className="col-6 col-md-3">
              <select className="form-select" aria-label="Tahun kejadian">
                <option value="2026">Tahun 2026 (Semua)</option>
                <option value="2025">Tahun 2025</option>
                <option value="2024">Tahun 2024</option>
              </select>
            </div>
            <div className="col-6 col-md-4 d-flex justify-content-md-end gap-2">
              <button className="btn-pill btn-pill-surface btn-pill-sm" type="button">
                <i className="bi bi-funnel me-1"></i> Filter Zona
              </button>
              <button className="btn-pill btn-pill-primary btn-pill-sm" type="button">
                <i className="bi bi-arrow-clockwise me-1"></i> Perbarui
              </button>
            </div>
          </div>
        </div>

        {/* Kontainer Area Peta (Bersih & Mudah Dibaca) */}
        <div className="card-solid p-0 overflow-hidden mb-4">
          {/* Header Info Peta */}
          <div className="p-3 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-2 bg-warm">
            <div className="d-flex align-items-center gap-2">
              <span className="badge-pill badge-primary-soft">
                <i className="bi bi-geo-alt me-1"></i> Peta Interaktif
              </span>
              <span className="gs-text-muted" style={{ fontSize: '0.85rem' }}>
                Koordinat EPSG:4326 &bull; WGS 84
              </span>
            </div>
            {/* Legenda Tingkat Kerentanan */}
            <div className="d-flex align-items-center gap-3" style={{ fontSize: '0.8rem' }}>
              <span className="d-flex align-items-center gap-1">
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#c0392b' }}></span>
                Tinggi
              </span>
              <span className="d-flex align-items-center gap-1">
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#d97706' }}></span>
                Sedang
              </span>
              <span className="d-flex align-items-center gap-1">
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#1F4D3A' }}></span>
                Rendah
              </span>
            </div>
          </div>

          {/* Area Kanvas Peta / Placeholder Bersih */}
          <div
            className="d-flex flex-column align-items-center justify-content-center text-center p-5"
            style={{
              minHeight: '440px',
              backgroundColor: '#FAF8F5',
            }}
          >
            <div
              className="d-inline-flex p-3 rounded-circle mb-3"
              style={{ backgroundColor: 'var(--primary-soft)', color: 'var(--primary)' }}
            >
              <i className="bi bi-map fs-2"></i>
            </div>
            <h3 className="mb-2" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              Area Kanvas Peta Interaktif
            </h3>
            <p className="gs-text-muted mb-3 mx-auto" style={{ maxWidth: '460px', fontSize: '0.9rem' }}>
              Modul Leaflet akan diintegrasikan di area ini oleh tim pengembang data spasial.
              Kontainer sudah siap dengan rasio bersih dan kontras tinggi.
            </p>
            <span className="badge-pill badge-outline">
              Leaflet / OpenStreetMap Ready
            </span>
          </div>
        </div>
      </Section>
    </>
  );
}
