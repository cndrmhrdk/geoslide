/**
 * AdminSumberData — Kelola Sumber Data & Riwayat Impor
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

const EMPTY_SOURCE = { name: '', url: '', data_period: '', retrieved_at: '', format: '', limitations: '' };

export default function AdminSumberData() {
  const { authFetch } = useAdminAuth();
  const [sources, setSources] = useState([]);
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('sources');

  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);
  const [form,     setForm]     = useState(EMPTY_SOURCE);
  const [saving,   setSaving]   = useState(false);
  const [alert,    setAlert]    = useState(null);

  const loadSources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/admin/sumber-data');
      if (res.ok) { const d = await res.json(); setSources(d.data || d || []); }
    } finally { setLoading(false); }
  }, [authFetch]);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/admin/sumber-data/logs');
      if (res.ok) { const d = await res.json(); setLogs(d.data || d || []); }
    } finally { setLoading(false); }
  }, [authFetch]);

  useEffect(() => {
    if (tab === 'sources') loadSources();
    else loadLogs();
  }, [tab, loadSources, loadLogs]);

  async function save() {
    setSaving(true);
    try {
      const isEdit = modal === 'edit';
      const url    = isEdit ? `/api/admin/sumber-data/${selected.id}` : '/api/admin/sumber-data';
      const res = await authFetch(url, { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify(form) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal.'); }
      setAlert({ type: 'success', text: isEdit ? 'Sumber data diperbarui.' : 'Sumber data ditambahkan.' });
      setModal(null);
      loadSources();
    } catch (err) {
      setAlert({ type: 'error', text: err.message });
    } finally { setSaving(false); }
  }

  async function doDelete() {
    setSaving(true);
    try {
      const res = await authFetch(`/api/admin/sumber-data/${selected.id}`, { method: 'DELETE' });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal.'); }
      setAlert({ type: 'success', text: 'Sumber data dihapus.' });
      setModal(null);
      loadSources();
    } catch (err) {
      setAlert({ type: 'error', text: err.message });
    } finally { setSaving(false); }
  }

  const f = (k) => (e) => setForm(v => ({ ...v, [k]: e.target.value }));

  return (
    <div>
      <div className="adm-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 className="adm-page-header__title">Kelola Sumber Data</h1>
          <p className="adm-page-header__subtitle">Kelola sumber data eksternal dan riwayat impor data.</p>
        </div>
      </div>

      {alert && (
        <div className={`adm-alert adm-alert--${alert.type}`} onClick={() => setAlert(null)} style={{ cursor: 'pointer' }}>
          <i className={`bi bi-${alert.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {alert.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '1.25rem', background: '#fff', padding: '4px', borderRadius: '10px', border: '1px solid rgba(15,15,15,0.07)', width: 'fit-content', boxShadow: '0 2px 6px rgba(15,15,15,0.03)' }}>
        {[['sources','Sumber Data','bi-database'],['logs','Riwayat Impor','bi-clock-history']].map(([t, l, ic]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: tab === t ? 'var(--primary, #3F7A1A)' : 'transparent',
              color: tab === t ? '#fff' : 'var(--muted)',
              border: 'none',
              borderRadius: '7px',
              padding: '0.45rem 1rem',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.18s',
            }}
          >
            <i className={`bi ${ic}`}></i> {l}
          </button>
        ))}
      </div>

      {/* Sources tab */}
      {tab === 'sources' && (
        <div className="adm-table-card">
          <div className="adm-table-card__header">
            <h2 className="adm-table-card__title">Daftar Sumber Data</h2>
            <button className="adm-btn adm-btn--primary" onClick={() => { setForm(EMPTY_SOURCE); setModal('create'); }}>
              <i className="bi bi-plus-lg"></i> Tambah Sumber
            </button>
          </div>
          <div className="adm-table-wrap">
            {loading ? (
              <div className="adm-spinner"><div className="adm-spinner__ring"></div></div>
            ) : sources.length === 0 ? (
              <div className="adm-empty"><div className="adm-empty__icon"><i className="bi bi-database"></i></div><p className="adm-empty__text">Belum ada sumber data.</p></div>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Format</th>
                    <th>Periode Data</th>
                    <th>Diambil</th>
                    <th>URL</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {sources.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600, fontSize: '0.84rem' }}>{s.name}</td>
                      <td><span className="adm-badge adm-badge--verified">{s.format || '—'}</span></td>
                      <td style={{ fontSize: '0.8rem' }}>{s.data_period || '—'}</td>
                      <td style={{ fontSize: '0.8rem' }}>{s.retrieved_at || '—'}</td>
                      <td style={{ fontSize: '0.8rem' }}>
                        {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>{s.url.length > 30 ? s.url.slice(0,30)+'…' : s.url}</a> : '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button className="adm-btn adm-btn--outline adm-btn--sm" onClick={() => { setSelected(s); setForm({ ...EMPTY_SOURCE, ...s }); setModal('edit'); }}><i className="bi bi-pencil"></i></button>
                          <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => { setSelected(s); setModal('delete'); }}><i className="bi bi-trash3"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Logs tab */}
      {tab === 'logs' && (
        <div className="adm-table-card">
          <div className="adm-table-card__header">
            <h2 className="adm-table-card__title">Riwayat Impor Data</h2>
          </div>
          <div className="adm-table-wrap">
            {loading ? (
              <div className="adm-spinner"><div className="adm-spinner__ring"></div></div>
            ) : logs.length === 0 ? (
              <div className="adm-empty"><div className="adm-empty__icon"><i className="bi bi-clock-history"></i></div><p className="adm-empty__text">Belum ada riwayat impor.</p></div>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Sumber</th>
                    <th>Status</th>
                    <th>Total Baris</th>
                    <th>Berhasil</th>
                    <th>Gagal</th>
                    <th>Mulai</th>
                    <th>Selesai</th>
                    <th>Pesan Error</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(lg => (
                    <tr key={lg.id}>
                      <td style={{ fontSize: '0.8rem' }}>{lg.source_name || `Sumber #${lg.data_source_id}`}</td>
                      <td>
                        <span className={`adm-badge adm-badge--${lg.status}`}>
                          {lg.status === 'success' ? 'Berhasil' : lg.status === 'failed' ? 'Gagal' : 'Parsial'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>{lg.total_rows}</td>
                      <td style={{ textAlign: 'center', color: '#166534' }}>{lg.inserted_rows}</td>
                      <td style={{ textAlign: 'center', color: '#991B1B' }}>{lg.failed_rows}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{lg.started_at ? new Date(lg.started_at).toLocaleString('id-ID') : '—'}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{lg.finished_at ? new Date(lg.finished_at).toLocaleString('id-ID') : '—'}</td>
                      <td style={{ fontSize: '0.78rem', color: '#991B1B', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lg.error_message || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal
        open={modal === 'create' || modal === 'edit'}
        title={modal === 'edit' ? 'Edit Sumber Data' : 'Tambah Sumber Data'}
        onClose={() => setModal(null)}
        footer={<>
          <button className="adm-btn adm-btn--outline" onClick={() => setModal(null)}>Batal</button>
          <button className="adm-btn adm-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
        </>}
      >
        <div className="adm-form-group">
          <label>Nama Sumber</label>
          <input value={form.name} onChange={f('name')} placeholder="Nama sumber data…" />
        </div>
        <div className="adm-form-group">
          <label>URL (opsional)</label>
          <input value={form.url} onChange={f('url')} placeholder="https://…" />
        </div>
        <div className="adm-form-grid-2">
          <div className="adm-form-group">
            <label>Format</label>
            <select value={form.format} onChange={f('format')}>
              <option value="">— Pilih —</option>
              {['CSV','XLSX','JSON','XML','API','Lainnya'].map(x => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
          <div className="adm-form-group">
            <label>Tanggal Diambil</label>
            <input type="date" value={form.retrieved_at} onChange={f('retrieved_at')} />
          </div>
        </div>
        <div className="adm-form-group">
          <label>Periode Data</label>
          <input value={form.data_period} onChange={f('data_period')} placeholder="cth: 2024-01-01 s/d 2024-12-31" />
        </div>
        <div className="adm-form-group">
          <label>Keterbatasan / Catatan</label>
          <textarea value={form.limitations} onChange={f('limitations')} rows={3} placeholder="Keterbatasan data…" />
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal
        open={modal === 'delete'}
        title="Hapus Sumber Data"
        onClose={() => setModal(null)}
        footer={<>
          <button className="adm-btn adm-btn--outline" onClick={() => setModal(null)}>Batal</button>
          <button className="adm-btn adm-btn--danger" onClick={doDelete} disabled={saving}>
            {saving ? 'Menghapus…' : 'Ya, Hapus'}
          </button>
        </>}
      >
        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
          <div style={{ fontSize: '2.5rem', color: '#ef4444', marginBottom: '0.75rem' }}><i className="bi bi-exclamation-triangle-fill"></i></div>
          <p style={{ fontSize: '0.9rem' }}>Hapus sumber data <strong>{selected?.name}</strong>?</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Data kejadian yang terhubung tidak akan ikut terhapus.</p>
        </div>
      </Modal>
    </div>
  );
}
