import { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar GeoSlide
 *
 * Dropdown dikelola dengan React state (bukan Bootstrap JS data-bs-toggle)
 * agar kompatibel dengan React's virtual DOM lifecycle.
 *
 * Props:
 *   variant  "solid" (default) | "overlay"
 */

/* ---- Hook: tutup dropdown ketika klik di luar ---- */
function useClickOutside(refs, onClose) {
  useEffect(() => {
    function handle(e) {
      if (refs.every(r => r.current && !r.current.contains(e.target))) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [refs, onClose]);
}

/* ---- Dropdown item dengan NavLink ---- */
function DropdownItem({ to, icon, children, onClose }) {
  return (
    <li>
      <NavLink
        className={({ isActive }) =>
          'dropdown-item gs-dropdown__item' + (isActive ? ' active' : '')
        }
        to={to}
        onClick={onClose}
      >
        <i className={`bi ${icon} me-2`}></i>
        {children}
      </NavLink>
    </li>
  );
}

/* ---- Dropdown trigger + panel ---- */
function NavDropdown({ id, label, active, open, onToggle, onClose, children }) {
  const ref = useRef(null);
  return (
    <li className="nav-item dropdown" ref={ref}>
      <button
        id={id}
        className={`nav-link gs-navbar__link dropdown-toggle${active ? ' active' : ''}`}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={onToggle}
      >
        {label}
      </button>
      {open && (
        <ul
          className="dropdown-menu gs-dropdown show"
          aria-labelledby={id}
          style={{ display: 'block' }}
        >
          {children}
        </ul>
      )}
    </li>
  );
}

export default function Navbar({ variant = 'solid' }) {
  const location = useLocation();

  /* Track which dropdown is open: null | 'data' | 'pelaporan' */
  const [openMenu, setOpenMenu] = useState(null);
  /* Mobile collapse */
  const [mobileOpen, setMobileOpen] = useState(false);

  const dataRef      = useRef(null);
  const pelaporanRef = useRef(null);
  const navRef       = useRef(null);

  const closeAll = useCallback(() => setOpenMenu(null), []);

  /* Close all dropdowns on click-outside */
  useClickOutside([navRef], closeAll);

  /* Close everything on route change */
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [location.pathname]);

  function toggleData()      { setOpenMenu(v => v === 'data'      ? null : 'data'); }
  function togglePelaporan() { setOpenMenu(v => v === 'pelaporan' ? null : 'pelaporan'); }

  const isDataBencanaActive = location.pathname.startsWith('/data-bencana');
  const isPelaporanActive   = location.pathname.startsWith('/pelaporan');

  return (
    <header className={`gs-navbar-wrapper gs-navbar-wrapper--${variant} sticky-top`}>
      <nav
        ref={navRef}
        className={`navbar navbar-expand-lg gs-navbar gs-navbar--${variant}`}
        aria-label="Navigasi Utama GeoSlide"
      >
        <div className="container-fluid px-3 px-lg-4">

          {/* ── Logo ── */}
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

          {/* ── Hamburger mobile ── */}
          <button
            className="navbar-toggler gs-navbar__toggler border-0 shadow-none"
            type="button"
            aria-expanded={mobileOpen}
            aria-label="Buka menu navigasi"
            onClick={() => setMobileOpen(v => !v)}
          >
            <span className="gs-navbar__toggler-icon">
              <i className={`bi ${mobileOpen ? 'bi-x' : 'bi-list'}`}></i>
            </span>
          </button>

          {/* ── Menu (collapse on mobile) ── */}
          <div className={`navbar-collapse${mobileOpen ? ' show' : ' collapse'}`} id="gsNavbarCollapse">
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
                    onClick={closeAll}
                  >
                    Beranda
                  </NavLink>
                </li>

                {/* Data Bencana ▾ */}
                <NavDropdown
                  id="navbarDropdownData"
                  label="Data Bencana"
                  active={isDataBencanaActive}
                  open={openMenu === 'data'}
                  onToggle={toggleData}
                  onClose={closeAll}
                >
                  <DropdownItem to="/data-bencana/peta"      icon="bi-map"            onClose={closeAll}>Peta Bencana</DropdownItem>
                  <DropdownItem to="/data-bencana/statistik" icon="bi-bar-chart-line" onClose={closeAll}>Statistik Bencana</DropdownItem>
                </NavDropdown>

                {/* Informasi Orang Hilang */}
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      'nav-link gs-navbar__link' + (isActive ? ' active' : '')
                    }
                    to="/informasi-orang-hilang"
                    onClick={closeAll}
                  >
                    Informasi Orang Hilang
                  </NavLink>
                </li>

                {/* Pelaporan ▾ */}
                <NavDropdown
                  id="navbarDropdownLapor"
                  label="Pelaporan"
                  active={isPelaporanActive}
                  open={openMenu === 'pelaporan'}
                  onToggle={togglePelaporan}
                  onClose={closeAll}
                >
                  <DropdownItem to="/pelaporan/laporkan-bencana"      icon="bi-exclamation-triangle" onClose={closeAll}>Laporkan Bencana</DropdownItem>
                  <DropdownItem to="/pelaporan/laporkan-orang-hilang" icon="bi-person-x"             onClose={closeAll}>Laporkan Orang Hilang</DropdownItem>
                  <DropdownItem to="/pelaporan/cek-status"            icon="bi-search"               onClose={closeAll}>Cek Status Laporan</DropdownItem>
                </NavDropdown>

                {/* Edukasi */}
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      'nav-link gs-navbar__link' + (isActive ? ' active' : '')
                    }
                    to="/edukasi"
                    onClick={closeAll}
                  >
                    Edukasi
                  </NavLink>
                </li>

              </ul>
            </div>

            {/* ── Tombol Login Admin ── */}
            <div className="gs-navbar__action mt-3 mt-lg-0">
              <NavLink
                className={({ isActive }) =>
                  'gs-navbar__btn-admin' + (isActive ? ' active' : '')
                }
                to="/login-admin"
                onClick={closeAll}
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
