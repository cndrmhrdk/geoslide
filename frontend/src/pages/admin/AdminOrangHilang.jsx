/**
 * AdminOrangHilang — Kelola Informasi Orang Hilang
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

function VerBadge({ status }) {
  const map = {
    pending:  { cls: 'adm-badge--pending',  label: 'Pending' },
    approved: { cls: 'adm-badge--approved', label: 'Disetujui' },
    rejected: { cls: 'adm-badge--rejected', label: 'Ditolak' },
  };
  const s = map[status] || map.pending;
  return <span className={`adm-badge ${s.cls}`}>{s.label}</span>;
}

function SearchBadge({ status }) {
  const map = {
    searching: { cls: 'adm-badge--searching', icon: 'bi-search',    label: 'Dicari' },
    found:     { cls: 'adm-badge--found',     icon: 'bi-check-circle', label: 'Ditemukan' },
    closed:    { cls: 'adm-badge--closed',    icon: 'bi-archive',   label: 'Ditutup' },
  };
  const s = map[status] || map.searching;
  return <span className={`adm-badge ${s.cls}`}><i className={`bi ${s.icon} me-1`}></i>{s.label}</span>;
}

export default function AdminOrangHilang() {
  const { authFetch } = useAdminAuth();
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [verFilter, setVerFilter] = useState('all');
  const [srFilter,  setSrFilter]  = useState('all');
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const PER_PAGE = 10;

  const [modal,     setModal]     = useState(null);
  const [selected,  setSelected]  = useState(null);
  const [rejReason, setRejReason] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [saving,    setSaving]    = useState(false);
  const [alert,     setAlert]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: PER_PAGE });
      if (search)              params.set('search', search);
      if (verFilter !== 'all') params.set('verification_status', verFilter);
      if (srFilter  !== 'all') params.set('search_status', srFilter);
      const res = await authFetch(`/api/orang-hilang/admin?${params}`);
      if (res.ok) { const d = await res.json(); setRows(d.data || d || []); setTotal(d.total || d.length || 0); }
    } finally { setLoading(false); }
  }, [authFetch, page, search, verFilter, srFilter]);

  useEffect(() => { load(); }, [load]);

  async function verify(row, status) {
    setSaving(true);
    try {
      const body = { status };
      if (status === 'rejected' && rejReason) body.rejection_reason = rejReason;
      if (adminNote) body.admin_note = adminNote;
      const res = await authFetch(`/api/orang-hilang/admin/${row.id}/verification`, {
        method: 'PATCH', body: JSON.stringify(body),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal.'); }
      setAlert({ type: 'success', text: `Status verifikasi diperbarui.` });
      setModal(null);
      load();
    } catch (err) {
      setAlert({ type: 'error', text: err.message });
    } finally { setSaving(false); }
  }

  async function updateSearch(row, status) {
    setSaving(true);
    try {
      const res = await authFetch(`/api/orang-hilang/admin/${row.id}/search-status`, {
        method: 'PATCH', body: JSON.stringify({ search_status: status }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal.'); }
      setAlert({ type: 'success', text: 'Status pencarian diperbarui.' });
      load();
    } catch (err) {
      setAlert({ type: 'error', text: err.message });
    } finally { setSaving(false); }
  }

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-header__title">Kelola Orang Hilang</h1>
        <p className="adm-page-header__subtitle">Verifikasi laporan orang hilang, perbarui status pencarian, atur visibilitas publik.</p>
      </div>

      {alert && (
        <div className={`adm-alert adm-alert--${alert.type}`} onClick={() => setAlert(null)} style={{ cursor: 'pointer' }}>
          <i className={`bi bi-${alert.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {alert.text}
        </div>
      )}

      <div className="adm-table-card">
        <div className="adm-table-card__header">
          <h2 className="adm-table-card__title">Daftar Orang Hilang</h2>
          <div className="adm-filter-bar">
            <input
              type="text" placeholder="Cari nama…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ width: 180 }}
            />
            <select value={verFilter} onChange={e => { setVerFilter(e.target.value); setPage(1); }}>
              <option value="all">Semua Verifikasi</option>
              <option value="pending">Pending</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
            <select value={srFilter} onChange={e => { setSrFilter(e.target.value); setPage(1); }}>
              <option value="all">Semua Pencarian</option>
              <option value="searching">Dicari</option>
              <option value="found">Ditemukan</option>
              <option value="closed">Ditutup</option>
            </select>
          </div>
        </div>

        <div className="adm-table-wrap">
          {loading ? (
            <div className="adm-spinner"><div className="adm-spinner__ring"></div></div>
          ) : rows.length === 0 ? (
            <div className="adm-empty">
              <div className="adm-empty__icon"><i className="bi bi-person-exclamation"></i></div>
              <p className="adm-empty__text">Tidak ada data orang hilang.</p>
            </div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Usia / Jenis Kelamin</th>
                  <th>Lokasi Terakhir</th>
                  <th>Pelapor</th>
                  <th>Verifikasi</th>
                  <th>Pencarian</th>
                  <th>Publik</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{row.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{row.tracking_code}</div>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{row.age || '—'} / {row.gender === 'male' ? 'L' : row.gender === 'female' ? 'P' : '?'}</td>
                    <td style={{ fontSize: '0.8rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.last_seen_location}</td>
                    <td style={{ fontSize: '0.8rem' }}>{row.reporter_name}</td>
                    <td><VerBadge status={row.verification_status} /></td>
                    <td><SearchBadge status={row.search_status} /></td>
                    <td>
                      {row.public_consent
                        ? <span className="adm-badge adm-badge--approved"><i className="bi bi-eye me-1"></i>Ya</span>
                        : <span className="adm-badge adm-badge--unverified"><i className="bi bi-eye-slash me-1"></i>Tidak</span>
                      }
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        <button className="adm-btn adm-btn--outline adm-btn--sm" onClick={() => { setSelected(row); setModal('detail'); }}>
                          <i className="bi bi-eye"></i>
                        </button>
                        {row.verification_status === 'pending' && (
                          <>
                            <button className="adm-btn adm-btn--primary adm-btn--sm" title="Setujui" onClick={() => { setSelected(row); setAdminNote(''); verify(row, 'approved'); }}>
                              <i className="bi bi-check-lg"></i>
                            </button>
                            <button className="adm-btn adm-btn--danger adm-btn--sm" title="Tolak" onClick={() => { setSelected(row); setRejReason(''); setAdminNote(''); setModal('reject'); }}>
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </>
                        )}
                        {row.verification_status === 'approved' && row.search_status === 'searching' && (
                          <button className="adm-btn adm-btn--outline adm-btn--sm" title="Tandai Ditemukan" onClick={() => updateSearch(row, 'found')}>
                            <i className="bi bi-check-circle"></i>
                          </button>
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
            <span>{total} data</span>
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
      <Modal open={modal === 'detail'} title="Detail Orang Hilang" onClose={() => setModal(null)}>
        {selected && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1.25rem', marginBottom: '1rem' }}>
              {[
                ['Nama', selected.name],
                ['Usia', selected.age || '—'],
                ['Jenis Kelamin', selected.gender === 'male' ? 'Laki-laki' : selected.gender === 'female' ? 'Perempuan' : 'Tidak Diketahui'],
                ['Lokasi Terakhir', selected.last_seen_location],
                ['Terakhir Dilihat', selected.last_seen_at || '—'],
                ['Pelapor', selected.reporter_name],
                ['Kontak Pelapor', selected.reporter_contact],
                ['Izin Publik', selected.public_consent ? 'Ya' : 'Tidak'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
            {selected.physical_description && (
              <div className="adm-form-group">
                <label>Deskripsi Fisik</label>
                <div style={{ background: '#F8F9FB', borderRadius: 8, padding: '0.75rem', fontSize: '0.875rem', lineHeight: 1.6 }}>{selected.physical_description}</div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <VerBadge status={selected.verification_status} />
              <SearchBadge status={selected.search_status} />
            </div>
            {selected.rejection_reason && (
              <div className="adm-alert adm-alert--error" style={{ marginTop: '1rem' }}>
                <i className="bi bi-exclamation-circle"></i>
                <div><strong>Alasan Penolakan:</strong> {selected.rejection_reason}</div>
              </div>
            )}

            {/* Status pencarian control */}
            {selected.verification_status === 'approved' && (
              <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(15,15,15,0.07)', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>Perbarui Status Pencarian</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['searching','found','closed'].map(s => (
                    <button
                      key={s}
                      className={`adm-btn adm-btn--sm ${selected.search_status === s ? 'adm-btn--primary' : 'adm-btn--outline'}`}
                      disabled={saving || selected.search_status === s}
                      onClick={() => updateSearch(selected, s)}
                    >
                      {s === 'searching' ? 'Dicari' : s === 'found' ? 'Ditemukan' : 'Tutup Kasus'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject modal */}
      <Modal
        open={modal === 'reject'}
        title="Tolak Laporan Orang Hilang"
        onClose={() => setModal(null)}
        footer={<>
          <button className="adm-btn adm-btn--outline" onClick={() => setModal(null)}>Batal</button>
          <button className="adm-btn adm-btn--danger" onClick={() => verify(selected, 'rejected')} disabled={saving || !rejReason.trim()}>
            {saving ? 'Mengirim…' : 'Tolak'}
          </button>
        </>}
      >
        <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Tolak laporan untuk <strong>{selected?.name}</strong>:</p>
        <div className="adm-form-group">
          <label>Alasan Penolakan</label>
          <textarea value={rejReason} onChange={e => setRejReason(e.target.value)} rows={3} placeholder="Tulis alasan penolakan…" />
        </div>
        <div className="adm-form-group">
          <label>Catatan Admin (opsional)</label>
          <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} rows={2} placeholder="Catatan internal…" />
        </div>
      </Modal>
    </div>
  );
}
