import { Link } from 'react-router-dom';
import './Footer.css';

/**
 * Footer GeoSlide
 * Berisi logo, deskripsi singkat, link navigasi, dan copyright.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="gs-footer mt-auto">
      <div className="container">
        <div className="row g-4 gs-footer__main py-5">

          {/* Kolom Brand */}
          <div className="col-12 col-md-4">
            <Link className="gs-footer__brand d-flex align-items-center gap-2 mb-3" to="/">
              <span className="gs-footer__logo-icon" aria-hidden="true">
                <i className="bi bi-geo-alt-fill"></i>
              </span>
              <span className="gs-footer__logo-text">
                Geo<span className="gs-footer__logo-accent">Slide</span>
              </span>
            </Link>
            <p className="gs-footer__desc">
              Platform informasi dan manajemen bencana tanah longsor di Indonesia.
              Membantu masyarakat mendapatkan data, melaporkan kejadian, dan
              meningkatkan kesiapsiagaan bencana.
            </p>
          </div>

          {/* Kolom Data Bencana */}
          <div className="col-6 col-md-2">
            <h3 className="gs-footer__heading">Data Bencana</h3>
            <ul className="gs-footer__links">
              <li><Link to="/data-bencana/peta">Peta Bencana</Link></li>
              <li><Link to="/data-bencana/statistik">Statistik Bencana</Link></li>
              <li><Link to="/informasi-orang-hilang">Informasi Orang Hilang</Link></li>
            </ul>
          </div>

          {/* Kolom Pelaporan */}
          <div className="col-6 col-md-2">
            <h3 className="gs-footer__heading">Pelaporan</h3>
            <ul className="gs-footer__links">
              <li><Link to="/pelaporan/laporkan-bencana">Laporkan Bencana</Link></li>
              <li><Link to="/pelaporan/laporkan-orang-hilang">Laporkan Orang Hilang</Link></li>
              <li><Link to="/pelaporan/cek-status">Cek Status Laporan</Link></li>
            </ul>
          </div>

          {/* Kolom Lainnya */}
          <div className="col-6 col-md-2">
            <h3 className="gs-footer__heading">Lainnya</h3>
            <ul className="gs-footer__links">
              <li><Link to="/edukasi">Edukasi</Link></li>
              <li><Link to="/login-admin">Login Admin</Link></li>
            </ul>
          </div>

          {/* Kolom Kontak */}
          <div className="col-6 col-md-2">
            <h3 className="gs-footer__heading">Darurat</h3>
            <ul className="gs-footer__links">
              <li>
                <a href="tel:117" className="d-flex align-items-center gap-1">
                  <i className="bi bi-telephone-fill"></i>
                  BNPB: 117
                </a>
              </li>
              <li>
                <a href="tel:112" className="d-flex align-items-center gap-1">
                  <i className="bi bi-telephone-fill"></i>
                  Darurat: 112
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="gs-footer__bottom d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 py-3">
          <p className="mb-0 gs-footer__copyright">
            &copy; {currentYear} GeoSlide — Sistem Informasi Bencana Tanah Longsor Indonesia
          </p>
          <p className="mb-0 gs-footer__credit">
            Dikembangkan oleh Tim GeoSlide &mdash; Universitas
          </p>
        </div>
      </div>
    </footer>
  );
}
