import { Link } from 'react-router-dom';
import './Footer.css';

/**
 * Footer GeoSlide
 * Ringkas, ringan, sudut atas membulat (32-40px), latar bersih/hangat.
 * Kontak darurat tampil jelas tetapi proporsional dan tidak mendominasi.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="gs-footer mt-auto" aria-label="Footer GeoSlide">
      <div className="container">
        <div className="row g-4 g-lg-5 gs-footer__main py-5">

          {/* Kolom 1: Brand & Misi Singkat */}
          <div className="col-12 col-md-4">
            <Link className="gs-footer__brand d-inline-flex align-items-center gap-2 mb-3" to="/">
              <span className="gs-footer__logo-badge" aria-hidden="true">
                <i className="bi bi-geo-alt-fill"></i>
              </span>
              <span className="gs-footer__logo-text">
                Geo<span className="gs-footer__logo-accent">Slide</span>
              </span>
            </Link>
            <p className="gs-footer__desc">
              Platform informasi dan manajemen mitigasi kesiapsiagaan bencana tanah longsor
              di Indonesia. Membantu masyarakat memperoleh data spasial terpadu,
              pelaporan cepat, dan edukasi tanggap bencana.
            </p>
          </div>

          {/* Kolom 2: Data Bencana */}
          <div className="col-6 col-md-2">
            <h4 className="gs-footer__heading">Data Bencana</h4>
            <ul className="gs-footer__links">
              <li><Link to="/data-bencana/peta">Peta Bencana</Link></li>
              <li><Link to="/data-bencana/statistik">Statistik Bencana</Link></li>
              <li><Link to="/informasi-orang-hilang">Orang Hilang</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Pelaporan & Edukasi */}
          <div className="col-6 col-md-3">
            <h4 className="gs-footer__heading">Pelaporan & Edukasi</h4>
            <ul className="gs-footer__links">
              <li><Link to="/pelaporan/laporkan-bencana">Laporkan Bencana</Link></li>
              <li><Link to="/pelaporan/laporkan-orang-hilang">Laporkan Orang Hilang</Link></li>
              <li><Link to="/pelaporan/cek-status">Cek Status Laporan</Link></li>
              <li><Link to="/edukasi">Edukasi & Mitigasi</Link></li>
            </ul>
          </div>

          {/* Kolom 4: Kontak Darurat */}
          <div className="col-12 col-md-3">
            <h4 className="gs-footer__heading">Layanan Darurat</h4>
            <div className="gs-footer__emergency-chips d-flex flex-column gap-2">
              <a href="tel:117" className="gs-footer__emergency-pill">
                <span className="gs-footer__emergency-icon" aria-hidden="true">
                  <i className="bi bi-telephone-outbound-fill"></i>
                </span>
                <div className="gs-footer__emergency-info">
                  <span className="gs-footer__emergency-label">Pusdalops BNPB</span>
                  <span className="gs-footer__emergency-number">117</span>
                </div>
              </a>

              <a href="tel:112" className="gs-footer__emergency-pill">
                <span className="gs-footer__emergency-icon" aria-hidden="true">
                  <i className="bi bi-shield-fill-exclamation"></i>
                </span>
                <div className="gs-footer__emergency-info">
                  <span className="gs-footer__emergency-label">Darurat Nasional</span>
                  <span className="gs-footer__emergency-number">112</span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar Ringan */}
        <div className="gs-footer__bottom d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 py-4">
          <p className="mb-0 gs-footer__copyright">
            &copy; {currentYear} GeoSlide &mdash; Sistem Informasi Bencana Tanah Longsor Indonesia
          </p>
          <div className="d-flex align-items-center gap-3">
            <Link to="/login-admin" className="gs-footer__admin-link">
              <i className="bi bi-shield-lock me-1"></i>Portal Admin
            </Link>
            <span className="gs-footer__dot" aria-hidden="true">&bull;</span>
            <span className="gs-footer__credit">
              Mitigasi Tanggap &amp; Berkelanjutan
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
