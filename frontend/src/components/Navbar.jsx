import { NavLink, Link, useLocation } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar GeoSlide
 * - Sticky & Floating: berbentuk kapsul ringan dengan backdrop blur
 * - Logo di kiri, menu di tengah dengan teks tipis & garis bawah halus pada menu aktif
 * - Tombol pill gelap di kanan dengan ikon panah bulat untuk "Login Admin"
 * - Responsif: dropdown desktop dengan sudut membulat, collapse rapi di mobile
 */
export default function Navbar() {
  const location = useLocation();

  // Deteksi status aktif untuk menu dropdown induk
  const isDataBencanaActive = location.pathname.startsWith('/data-bencana');
  const isPelaporanActive = location.pathname.startsWith('/pelaporan');

  return (
    <header className="gs-navbar-wrapper sticky-top">
      <nav
        className="navbar navbar-expand-lg gs-navbar"
        aria-label="Navigasi utama GeoSlide"
      >
        <div className="container-fluid px-2 px-lg-3">
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
            aria-label="Buka navigasi"
          >
            <span className="gs-navbar__toggler-icon">
              <i className="bi bi-list"></i>
            </span>
          </button>

          {/* Menu Navigasi Tengah & Kanan */}
          <div className="collapse navbar-collapse" id="gsNavbarCollapse">
            {/* Menu Tengah */}
            <ul className="navbar-nav mx-auto align-items-lg-center gap-lg-1 my-2 my-lg-0">
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

            {/* Tombol Login Admin di Kanan: Pill Gelap + Bulat Ikon Panah */}
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
