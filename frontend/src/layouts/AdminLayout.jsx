/**
 * AdminLayout — Sidebar + Topbar layout untuk semua halaman admin GeoSlide
 */
import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import './AdminLayout.css';

const NAV_ITEMS = [
  { path: '/admin/dashboard',       icon: 'bi-speedometer2',     label: 'Dashboard' },
  { path: '/admin/data-bencana',    icon: 'bi-geo-alt',          label: 'Data Bencana' },
  { path: '/admin/laporan',         icon: 'bi-clipboard2-data',  label: 'Kelola Laporan' },
  { path: '/admin/orang-hilang',    icon: 'bi-person-exclamation',label: 'Orang Hilang' },
  { path: '/admin/sumber-data',     icon: 'bi-database',         label: 'Sumber Data' },
  { path: '/admin/akun',            icon: 'bi-people',           label: 'Kelola Akun' },
];

export default function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const navigate          = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login-admin');
  }

  return (
    <div className="adm-shell">
      {/* ── Overlay mobile ── */}
      {sidebarOpen && (
        <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`adm-sidebar${sidebarOpen ? ' adm-sidebar--open' : ''}`}>
        {/* Logo */}
        <div className="adm-brand">
          <span className="adm-brand__icon"><i className="bi bi-shield-shaded"></i></span>
          <span className="adm-brand__name">GeoSlide <span className="adm-brand__sub">Admin</span></span>
        </div>

        {/* Nav */}
        <nav className="adm-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `adm-nav__item${isActive ? ' adm-nav__item--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`bi ${item.icon} adm-nav__icon`}></i>
              <span className="adm-nav__label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User card di bawah */}
        <div className="adm-user-card">
          <div className="adm-user-card__avatar">
            <i className="bi bi-person-circle"></i>
          </div>
          <div className="adm-user-card__info">
            <div className="adm-user-card__name">{user?.name || 'Admin'}</div>
            <div className="adm-user-card__email">{user?.email || ''}</div>
          </div>
          <button
            className="adm-user-card__logout"
            onClick={handleLogout}
            title="Keluar"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="adm-main">
        {/* Topbar */}
        <header className="adm-topbar">
          <button
            className="adm-topbar__menu-btn"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Buka menu"
          >
            <i className="bi bi-list"></i>
          </button>
          <div className="adm-topbar__title">Portal Admin GeoSlide</div>
          <div className="adm-topbar__right">
            <span className="adm-topbar__badge">
              <i className="bi bi-shield-check me-1"></i>Admin
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="adm-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
