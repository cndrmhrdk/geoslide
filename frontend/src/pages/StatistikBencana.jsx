import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

/**
 * Halaman: Statistik Bencana
 * Halaman data statistik: kartu-kartu metrik bersih, kontras tinggi,
 * sangat mudah dibaca, dengan animasi hover minimal.
 */
export default function StatistikBencana() {
  return (
    <>
      <PageHeader
        badge="Analisis Data & Tren"
        title="Statistik Kejadian Tanah Longsor"
        subtitle="Analisis agregasi data bencana tanah longsor di Indonesia berdasarkan periode, wilayah, dan dampak kerugian."
        icon="bi-bar-chart-line"
      />

      <Section bg="white" py="md">
        {/* Ringkasan Indikator Kunci (KPI Cards) */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card-solid p-3 h-100">
              <span className="gs-text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>
                Total Kejadian (2026)
              </span>
              <div className="d-flex align-items-baseline gap-2">
                <span className="fs-3 fw-bold" style={{ color: 'var(--ink)' }}>284</span>
                <span className="badge-pill badge-danger" style={{ fontSize: '0.7rem' }}>+12% tren</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card-solid p-3 h-100">
              <span className="gs-text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>
                Wilayah Terdampak
              </span>
              <div className="d-flex align-items-baseline gap-2">
                <span className="fs-3 fw-bold" style={{ color: 'var(--ink)' }}>62</span>
                <span className="gs-text-muted" style={{ fontSize: '0.8rem' }}>Kab/Kota</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card-solid p-3 h-100">
              <span className="gs-text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>
                Warga Mengungsi
              </span>
              <div className="d-flex align-items-baseline gap-2">
                <span className="fs-3 fw-bold" style={{ color: 'var(--earth)' }}>1.420</span>
                <span className="gs-text-muted" style={{ fontSize: '0.8rem' }}>Jiwa</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card-solid p-3 h-100">
              <span className="gs-text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>
                Laporan Ditangani
              </span>
              <div className="d-flex align-items-baseline gap-2">
                <span className="fs-3 fw-bold" style={{ color: 'var(--primary)' }}>94%</span>
                <span className="badge-pill badge-primary-soft" style={{ fontSize: '0.7rem' }}>Optimal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Area Grafik & Analisis Tren (Clean Card) */}
        <div className="card-solid mb-4">
          <div className="card-header-clean">
            <span>Grafik Tren Kejadian Bulanan</span>
            <span className="badge-pill badge-outline">Tahun Berjalan</span>
          </div>

          <div
            className="d-flex flex-column align-items-center justify-content-center text-center p-5"
            style={{
              minHeight: '320px',
              backgroundColor: '#FAF8F5',
              borderRadius: '14px',
            }}
          >
            <div
              className="d-inline-flex p-3 rounded-circle mb-3"
              style={{ backgroundColor: 'rgba(138, 110, 85, 0.12)', color: 'var(--earth)' }}
            >
              <i className="bi bi-graph-up-arrow fs-3"></i>
            </div>
            <h4 className="mb-2" style={{ fontSize: '1.15rem' }}>
              Area Visualisasi Grafik Statistik
            </h4>
            <p className="gs-text-muted mb-3 mx-auto" style={{ maxWidth: '420px', fontSize: '0.885rem' }}>
              Modul grafik Recharts (Bar/Line Chart) akan diintegrasikan di sini oleh pengembang.
              Latar belakang bersih memastikan data mudah dianalisis.
            </p>
            <span className="badge-pill badge-outline">
              Recharts Module Ready
            </span>
          </div>
        </div>
      </Section>
    </>
  );
}
