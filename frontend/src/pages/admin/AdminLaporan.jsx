/**
 * AdminLaporan — Kelola Laporan Masyarakat (verifikasi, terima/tolak)
 */
import { useEffect, useState, useCallback } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';

function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="adm-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal">
        <div className="adm-modal__header">
          <h2 className="adm-modal__title">{title}</h2>
          <button className="adm-modal__close" onClick={onClose}><i className="bi bi-x-lg"></i></button>
        </div>
        <div className="adm-modal__body">{children}</div>
        {footer && <div className="adm-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending:  { cls: 'adm-badge--pending',  icon: 'bi-hourglass-split',  label: 'Pending' },
    approved: { cls: 'adm-badge--approved', icon: 'bi-check-circle',     label: 'Disetujui' },
    rejected: { cls: 'adm-badge--rejected', icon: 'bi-x-circle',         label: 'Ditolak' },
  };
  const s = map[status] || map.pending;
  return <span className={`adm-badge ${s.cls}`}><i className={`bi ${s.icon} me-1`}></i>{s.label}</span>;
}

export default function AdminLaporan() {
  const { authFetch } = useAdminAuth();
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const PER_PAGE = 10;

  const [modal,         setModal]         = useState(null);
  const [selected,      setSelected]      = useState(null);
  const [rejReason,     setRejReason]     = useState('');
  const [saving,        setSaving]        = useState(false);
  const [alert,         setAlert]         = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: PER_PAGE });
      if (search)         params.set('search', search);
      if (filter !== 'all') params.set('status', filter);
      const res = await authFetch(`/api/admin/laporan?${params}`);
      if (res.ok) { const d = await res.json(); setRows(d.data || []); setTotal(d.total || 0); }
    } finally { setLoading(false); }
  }, [authFetch, page, search, filter]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id, status, reason) {
    setSaving(true);
    try {
      const body = { status };
      if (reason) body.rejection_reason = reason;
      const res = await authFetch(`/api/admin/laporan/${id}/status`, {
        method: 'PATCH', body: JSON.stringify(body),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal.'); }
      setAlert({ type: 'success', text: `Laporan berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}.` });
      setModal(null);
      load();
    } catch (err) {
      setAlert({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-header__title">Kelola Laporan</h1>
        <p className="adm-page-header__subtitle">Tinjau laporan bencana dari masyarakat, terima atau tolak.</p>
      </div>

      {alert && (
        <div className={`adm-alert adm-alert--${alert.type}`} onClick={() => setAlert(null)} style={{ cursor: 'pointer' }}>
          <i className={`bi bi-${alert.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {alert.text}
        </div>
      )}

      <div className="adm-table-card">
        <div className="adm-table-card__header">
          <h2 className="adm-table-card__title">Daftar Laporan</h2>
          <div className="adm-filter-bar">
            <input
              type="text" placeholder="Cari nama / lokasi…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ width: 200 }}
            />
            <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </div>

        <div className="adm-table-wrap">
          {loading ? (
            <div className="adm-spinner"><div className="adm-spinner__ring"></div></div>
          ) : rows.length === 0 ? (
            <div className="adm-empty">
              <div className="adm-empty__icon"><i className="bi bi-inbox"></i></div>
              <p className="adm-empty__text">Tidak ada laporan ditemukan.</p>
            </div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Pelapor</th>
                  <th>Lokasi</th>
                  <th>Tanggal</th>
                  <th>Masuk</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id}>
                    <td style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>{row.tracking_code}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{row.reporter_name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{row.reporter_contact}</div>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{row.regency}, {row.province}</td>
                    <td style={{ fontSize: '0.8rem' }}>{row.event_date}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{new Date(row.created_at).toLocaleDateString('id-ID')}</td>
                    <td><StatusBadge status={row.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="adm-btn adm-btn--outline adm-btn--sm" onClick={() => { setSelected(row); setModal('detail'); }}>
                          <i className="bi bi-eye"></i>
                        </button>
                        {row.status === 'pending' && (
                          <>
                            <button className="adm-btn adm-btn--primary adm-btn--sm" title="Setujui" onClick={() => updateStatus(row.id, 'approved')}>
                              <i className="bi bi-check-lg"></i>
                            </button>
                            <button className="adm-btn adm-btn--danger adm-btn--sm" title="Tolak" onClick={() => { setSelected(row); setRejReason(''); setModal('reject'); }}>
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="adm-pagination">
            <span>Menampilkan {rows.length} dari {total}</span>
            <div className="adm-pagination__btns">
              <button className="adm-pagination__btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><i className="bi bi-chevron-left"></i></button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <button key={p} className={`adm-pagination__btn${page === p ? ' adm-pagination__btn--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="adm-pagination__btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><i className="bi bi-chevron-right"></i></button>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Modal open={modal === 'detail'} title="Detail Laporan" onClose={() => setModal(null)}>
        {selected && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1.25rem', marginBottom: '1rem' }}>
              {[
                ['Kode Laporan', selected.tracking_code],
                ['Pelapor', selected.reporter_name],
                ['Kontak', selected.reporter_contact],
                ['Tanggal Kejadian', selected.event_date],
                ['Provinsi', selected.province],
                ['Kabupaten', selected.regency],
                ['Kecamatan', selected.district || '—'],
                ['Desa', selected.village || '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="adm-form-group">
              <label>Deskripsi</label>
              <div style={{ background: '#F8F9FB', borderRadius: 8, padding: '0.75rem', fontSize: '0.875rem', lineHeight: 1.6 }}>{selected.description}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Status:</span>
              <StatusBadge status={selected.status} />
            </div>
            {selected.rejection_reason && (
              <div className="adm-alert adm-alert--error" style={{ marginTop: '1rem' }}>
                <i className="bi bi-exclamation-circle"></i>
                <div><strong>Alasan Penolakan:</strong> {selected.rejection_reason}</div>
              </div>
            )}
            {selected.status === 'pending' && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button className="adm-btn adm-btn--primary" onClick={() => updateStatus(selected.id, 'approved')} disabled={saving}>
                  <i className="bi bi-check-lg"></i> Setujui
                </button>
                <button className="adm-btn adm-btn--danger" onClick={() => { setModal('reject'); setRejReason(''); }} disabled={saving}>
                  <i className="bi bi-x-lg"></i> Tolak
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject modal */}
      <Modal
        open={modal === 'reject'}
        title="Tolak Laporan"
        onClose={() => setModal(null)}
        footer={<>
          <button className="adm-btn adm-btn--outline" onClick={() => setModal(null)}>Batal</button>
          <button className="adm-btn adm-btn--danger" onClick={() => updateStatus(selected.id, 'rejected', rejReason)} disabled={saving || !rejReason.trim()}>
            {saving ? 'Mengirim…' : 'Tolak Laporan'}
          </button>
        </>}
      >
        <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Berikan alasan penolakan untuk laporan dari <strong>{selected?.reporter_name}</strong>:</p>
        <div className="adm-form-group">
          <label>Alasan Penolakan</label>
          <textarea value={rejReason} onChange={e => setRejReason(e.target.value)} rows={4} placeholder="Tulis alasan penolakan di sini…" />
        </div>
      </Modal>
    </div>
  );
}
