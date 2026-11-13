/**
 * AdminDashboard — Ringkasan statistik GeoSlide
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const STAT_CARDS = [
  { key: 'total_events',          label: 'Kejadian Bencana',       icon: 'bi-geo-alt-fill',         color: '#3F7A1A', bg: '#E5EFDF' },
  { key: 'total_reports',         label: 'Laporan Masuk',          icon: 'bi-clipboard2-data-fill',  color: '#1D4ED8', bg: '#DBEAFE' },
  { key: 'pending_reports',       label: 'Menunggu Verifikasi',    icon: 'bi-hourglass-split',       color: '#854D0E', bg: '#FEF9C3' },
  { key: 'total_missing',         label: 'Orang Hilang',           icon: 'bi-person-exclamation',    color: '#991B1B', bg: '#FEE2E2' },
];

const PIE_COLORS = ['#FEF9C3', '#DCFCE7', '#FEE2E2'];

function StatCard({ value, label, icon, color, bg, loading }) {
  return (
    <div className="adm-stat-card">
      <div className="adm-stat-card__icon" style={{ backgroundColor: bg, color }}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div className="adm-stat-card__value" style={{ color }}>
        {loading ? '—' : (value ?? 0).toLocaleString('id-ID')}
      </div>
      <div className="adm-stat-card__label">{label}</div>
    </div>
  );
}

function RecentRow({ report, index }) {
  const statusMap = {
    pending:  { cls: 'adm-badge--pending',  label: 'Pending' },
    approved: { cls: 'adm-badge--approved', label: 'Disetujui' },
    rejected: { cls: 'adm-badge--rejected', label: 'Ditolak' },
  };
  const s = statusMap[report.status] || statusMap.pending;
  return (
    <tr>
      <td style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>#{index + 1}</td>
      <td>
        <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{report.reporter_name}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{report.province}, {report.regency}</div>
      </td>
      <td style={{ fontSize: '0.8rem' }}>{report.event_date || '—'}</td>
      <td><span className={`adm-badge ${s.cls}`}>{s.label}</span></td>
    </tr>
  );
}

export default function AdminDashboard() {
  const { authFetch } = useAdminAuth();
  const [stats,   setStats]   = useState({});
  const [monthly, setMonthly] = useState([]);
  const [reports, setReports] = useState([]);
  const [piData,  setPiData]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [sRes, rRes, mRes] = await Promise.all([
          authFetch('/api/admin/dashboard/stats'),
          authFetch('/api/admin/laporan?limit=5&sort=created_at&dir=desc'),
          authFetch('/api/admin/dashboard/monthly'),
        ]);
        if (sRes.ok) { const d = await sRes.json(); setStats(d); }
        if (rRes.ok) { const d = await rRes.json(); setReports(d.data || []); }
        if (mRes.ok) { const d = await mRes.json(); setMonthly(d || []); }
      } catch {
        // graceful — show zeros
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [authFetch]);

  // Derive pie data from stats
  useEffect(() => {
    if (!loading) {
      setPiData([
        { name: 'Pending',   value: stats.pending_reports  ?? 0 },
        { name: 'Disetujui', value: stats.approved_reports ?? 0 },
        { name: 'Ditolak',   value: stats.rejected_reports ?? 0 },
      ]);
    }
  }, [stats, loading]);

  return (
    <div>
      {/* Page header */}
      <div className="adm-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 className="adm-page-header__title">Dashboard</h1>
          <p className="adm-page-header__subtitle">Ringkasan aktivitas dan data bencana GeoSlide</p>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', background: '#fff', padding: '0.4rem 1rem', borderRadius: '8px', border: '1px solid rgba(15,15,15,0.07)' }}>
          <i className="bi bi-clock me-1"></i>
          {new Date().toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="adm-stat-grid">
        {STAT_CARDS.map(c => (
          <StatCard key={c.key} loading={loading} value={stats[c.key]} {...c} />
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: '1.25rem', marginBottom: '1.5rem', alignItems: 'start' }}>
        {/* Bar chart: kejadian per bulan */}
        <div className="adm-table-card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div className="adm-table-card__title">Kejadian Bencana per Bulan</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Tahun berjalan</div>
          </div>
          {loading ? (
            <div className="adm-spinner"><div className="adm-spinner__ring"></div></div>
          ) : monthly.length === 0 ? (
            <div className="adm-empty"><div className="adm-empty__icon"><i className="bi bi-bar-chart"></i></div><p className="adm-empty__text">Data belum tersedia</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthly} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,15,15,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6E6E69' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6E6E69' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid rgba(15,15,15,0.08)', fontSize: '0.8rem' }}
                  formatter={(v) => [v, 'Kejadian']}
                />
                <Bar dataKey="count" fill="#3F7A1A" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart: status laporan */}
        <div className="adm-table-card" style={{ padding: '1.25rem 1.5rem' }}>
          <div className="adm-table-card__title" style={{ marginBottom: '1rem' }}>Status Laporan</div>
          {loading ? (
            <div className="adm-spinner"><div className="adm-spinner__ring"></div></div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={piData} cx="50%" cy="45%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: '0.7rem' }}>
                  {piData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: '10px', fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent reports table */}
      <div className="adm-table-card">
        <div className="adm-table-card__header">
          <h2 className="adm-table-card__title">Laporan Terbaru</h2>
          <Link to="/admin/laporan" className="adm-btn adm-btn--outline adm-btn--sm">
            Lihat Semua <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
        <div className="adm-table-wrap">
          {loading ? (
            <div className="adm-spinner"><div className="adm-spinner__ring"></div></div>
          ) : reports.length === 0 ? (
            <div className="adm-empty">
              <div className="adm-empty__icon"><i className="bi bi-inbox"></i></div>
              <p className="adm-empty__text">Belum ada laporan masuk.</p>
            </div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pelapor</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => <RecentRow key={r.id} report={r} index={i} />)}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.85rem', marginTop: '0.5rem' }}>
        {[
          { to: '/admin/data-bencana', icon: 'bi-plus-circle', label: 'Tambah Kejadian', color: '#3F7A1A', bg: '#E5EFDF' },
          { to: '/admin/laporan',      icon: 'bi-check2-circle', label: 'Verifikasi Laporan', color: '#1D4ED8', bg: '#DBEAFE' },
          { to: '/admin/orang-hilang', icon: 'bi-person-check', label: 'Verifikasi Orang Hilang', color: '#854D0E', bg: '#FEF9C3' },
          { to: '/admin/sumber-data',  icon: 'bi-cloud-upload', label: 'Impor Data', color: '#6B21A8', bg: '#F3E8FF' },
        ].map(q => (
          <Link key={q.to} to={q.to} style={{ background: '#fff', border: '1px solid rgba(15,15,15,0.07)', borderRadius: '12px', padding: '1rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', boxShadow: '0 2px 6px rgba(15,15,15,0.03)', transition: 'transform 0.18s, box-shadow 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 18px rgba(15,15,15,0.07)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 2px 6px rgba(15,15,15,0.03)'; }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: q.bg, color: q.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
              <i className={`bi ${q.icon}`}></i>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>{q.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
