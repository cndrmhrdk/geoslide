import { NavLink, Link, useLocation } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar GeoSlide
 *
 * Mendukung dua mode via prop `variant`:
 * - `variant="solid"` (default): wadah abu terang (--bg) bersudut membulat 24px, teks gelap.
 * - `variant="overlay"`: transparan di atas hero, teks putih, wadah menu berkapsul kaca.
 *
 * Elemen:
 * - Logo di kiri
 * - Menu di tengah (dengan deteksi rute aktif)
 * - Tombol "Login Admin" di kanan: pill hitam dengan lingkaran putih kecil berisi ikon panah
 * - Dropdown bersudut membulat dan mobile collapse yang rapi
 */
export default function Navbar({ variant = 'solid' }) {
  const location = useLocation();

  const isDataBencanaActive = location.pathname.startsWith('/data-bencana');
  const isPelaporanActive = location.pathname.startsWith('/pelaporan');

  return (
    <header className={`gs-navbar-wrapper gs-navbar-wrapper--${variant} sticky-top`}>
      <nav
        className={`navbar navbar-expand-lg gs-navbar gs-navbar--${variant}`}
        aria-label="Navigasi Utama GeoSlide"
      >
        <div className="container-fluid px-3 px-lg-4">
          {/* Logo Brand di Kiri */}
          <Link
            className="navbar-brand gs-navbar__brand d-inline-flex align-items-center gap-2"
            to="/"
          >
            <span className="gs-navbar__logo-badge" aria-hidden="true">
              <i className="bi bi-geo-alt-fill"></i>
            </span>
            <span className="gs-navbar__logo-text">
              Geo<span className="gs-navbar__logo-accent">Slide</span>
            </span>
          </Link>

          {/* Tombol Hamburger Mobile */}
          <button
            className="navbar-toggler gs-navbar__toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#gsNavbarCollapse"
            aria-controls="gsNavbarCollapse"
            aria-expanded="false"
            aria-label="Buka menu navigasi"
          >
            <span className="gs-navbar__toggler-icon">
              <i className="bi bi-list"></i>
            </span>
          </button>

          {/* Menu Navigasi Tengah & Kanan */}
          <div className="collapse navbar-collapse" id="gsNavbarCollapse">
            {/* Wadah Menu Tengah (Kapsul Kaca di mode overlay) */}
            <div className="gs-navbar__menu-container mx-auto">
              <ul className="navbar-nav align-items-lg-center gap-lg-1 my-2 my-lg-0">
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

                {/* Data Bencana (Dropdown) */}
                <li className="nav-item dropdown">
                  <button
                    className={`nav-link gs-navbar__link dropdown-toggle ${
                      isDataBencanaActive ? 'active' : ''
                    }`}
                    id="navbarDropdownData"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    type="button"
                  >
                    Data Bencana
                  </button>
                  <ul
                    className="dropdown-menu gs-dropdown"
                    aria-labelledby="navbarDropdownData"
                  >
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

                {/* Pelaporan (Dropdown) */}
                <li className="nav-item dropdown">
                  <button
                    className={`nav-link gs-navbar__link dropdown-toggle ${
                      isPelaporanActive ? 'active' : ''
                    }`}
                    id="navbarDropdownLapor"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    type="button"
                  >
                    Pelaporan
                  </button>
                  <ul
                    className="dropdown-menu gs-dropdown"
                    aria-labelledby="navbarDropdownLapor"
                  >
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
              </ul>
            </div>

            {/* Tombol Kanan: Pill Hitam dengan Lingkaran Putih Kecil Berisi Ikon Panah */}
            <div className="gs-navbar__action mt-3 mt-lg-0">
              <NavLink
                className={({ isActive }) =>
                  'gs-navbar__btn-admin' + (isActive ? ' active' : '')
                }
                to="/login-admin"
              >
                <span className="gs-navbar__btn-admin-text">Login Admin</span>
                <span className="gs-navbar__btn-admin-icon" aria-hidden="true">
                  <i className="bi bi-arrow-up-right"></i>
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
