import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar GeoSlide
 * - Responsif: collapse di mobile, dropdown di desktop
 * - Aktif secara otomatis via NavLink
 */
export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg gs-navbar sticky-top" aria-label="Navigasi utama">
      <div className="container">
        {/* Brand / Logo */}
        <Link className="navbar-brand gs-navbar__brand d-flex align-items-center gap-2" to="/">
          <span className="gs-navbar__logo-icon" aria-hidden="true">
            <i className="bi bi-geo-alt-fill"></i>
          </span>
          <span className="gs-navbar__logo-text">
            Geo<span className="gs-navbar__logo-accent">Slide</span>
          </span>
        </Link>

        {/* Tombol hamburger mobile */}
        <button
          className="navbar-toggler gs-navbar__toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#gsNavbarCollapse"
          aria-controls="gsNavbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigasi"
        >
          <i className="bi bi-list"></i>
        </button>

        {/* Menu items */}
        <div className="collapse navbar-collapse" id="gsNavbarCollapse">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">

            {/* Beranda */}
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  'nav-link gs-navbar__link' + (isActive ? ' active' : '')
                }
                to="/"
                end
              >
                Beranda
              </NavLink>
            </li>

            {/* Data Bencana (dropdown) */}
            <li className="nav-item dropdown">
              <button
                className="nav-link gs-navbar__link dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Data Bencana
              </button>
              <ul className="dropdown-menu gs-dropdown">
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      'dropdown-item gs-dropdown__item' + (isActive ? ' active' : '')
                    }
                    to="/data-bencana/peta"
                  >
                    <i className="bi bi-map me-2"></i>
                    Peta Bencana
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      'dropdown-item gs-dropdown__item' + (isActive ? ' active' : '')
                    }
                    to="/data-bencana/statistik"
                  >
                    <i className="bi bi-bar-chart-line me-2"></i>
                    Statistik Bencana
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Informasi Orang Hilang */}
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  'nav-link gs-navbar__link' + (isActive ? ' active' : '')
                }
                to="/informasi-orang-hilang"
              >
                Informasi Orang Hilang
              </NavLink>
            </li>

            {/* Pelaporan (dropdown) */}
            <li className="nav-item dropdown">
              <button
                className="nav-link gs-navbar__link dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Pelaporan
              </button>
              <ul className="dropdown-menu gs-dropdown">
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      'dropdown-item gs-dropdown__item' + (isActive ? ' active' : '')
                    }
                    to="/pelaporan/laporkan-bencana"
                  >
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Laporkan Bencana
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      'dropdown-item gs-dropdown__item' + (isActive ? ' active' : '')
                    }
                    to="/pelaporan/laporkan-orang-hilang"
                  >
                    <i className="bi bi-person-x me-2"></i>
                    Laporkan Orang Hilang
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      'dropdown-item gs-dropdown__item' + (isActive ? ' active' : '')
                    }
                    to="/pelaporan/cek-status"
                  >
                    <i className="bi bi-search me-2"></i>
                    Cek Status Laporan
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Edukasi */}
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  'nav-link gs-navbar__link' + (isActive ? ' active' : '')
                }
                to="/edukasi"
              >
                Edukasi
              </NavLink>
            </li>

            {/* Login Admin */}
            <li className="nav-item ms-lg-2">
              <NavLink
                className="btn btn-gs-primary gs-navbar__btn-login"
                to="/login-admin"
              >
                <i className="bi bi-shield-lock me-1"></i>
                Login Admin
              </NavLink>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}
