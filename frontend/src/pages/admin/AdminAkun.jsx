/**
 * AdminAkun — Kelola Akun Admin
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

const EMPTY_FORM = { name: '', email: '', password: '', is_active: 1 };

export default function AdminAkun() {
  const { authFetch, user: me } = useAdminAuth();
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);
  const [selected, setSelected] = useState(null);
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [saving,  setSaving]  = useState(false);
  const [alert,   setAlert]   = useState(null);
  const [showPw,  setShowPw]  = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/admin/akun');
      if (res.ok) { const d = await res.json(); setRows(d.data || d || []); }
    } finally { setLoading(false); }
  }, [authFetch]);

  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true);
    try {
      const isEdit = modal === 'edit';
      const url    = isEdit ? `/api/admin/akun/${selected.id}` : '/api/admin/akun';
      const body   = { ...form };
      if (isEdit && !body.password) delete body.password; // don't send empty password on edit
      const res = await authFetch(url, { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal.'); }
      setAlert({ type: 'success', text: isEdit ? 'Akun diperbarui.' : 'Akun berhasil dibuat.' });
      setModal(null);
      load();
    } catch (err) {
      setAlert({ type: 'error', text: err.message });
    } finally { setSaving(false); }
  }

  async function toggleActive(row) {
    try {
      const res = await authFetch(`/api/admin/akun/${row.id}/status`, {
        method: 'PATCH', body: JSON.stringify({ is_active: row.is_active ? 0 : 1 }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      setAlert({ type: 'success', text: `Akun ${row.is_active ? 'dinonaktifkan' : 'diaktifkan'}.` });
      load();
    } catch (err) {
      setAlert({ type: 'error', text: err.message });
    }
  }

  async function doDelete() {
    setSaving(true);
    try {
      const res = await authFetch(`/api/admin/akun/${selected.id}`, { method: 'DELETE' });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal.'); }
      setAlert({ type: 'success', text: 'Akun dihapus.' });
      setModal(null);
      load();
    } catch (err) {
      setAlert({ type: 'error', text: err.message });
    } finally { setSaving(false); }
  }

  const f = (k) => (e) => setForm(v => ({ ...v, [k]: e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value }));

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-header__title">Kelola Akun Admin</h1>
        <p className="adm-page-header__subtitle">Kelola akun administrator yang memiliki akses ke sistem.</p>
      </div>

      {alert && (
        <div className={`adm-alert adm-alert--${alert.type}`} onClick={() => setAlert(null)} style={{ cursor: 'pointer' }}>
          <i className={`bi bi-${alert.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {alert.text}
        </div>
      )}

      {/* Info panel */}
      <div className="adm-alert adm-alert--info" style={{ marginBottom: '1.25rem' }}>
        <i className="bi bi-info-circle-fill"></i>
        <div>Hanya admin aktif yang dapat login ke sistem. Nonaktifkan akun untuk melarang akses tanpa menghapus data.</div>
      </div>

      <div className="adm-table-card">
        <div className="adm-table-card__header">
          <h2 className="adm-table-card__title">Daftar Admin</h2>
          <button className="adm-btn adm-btn--primary" onClick={() => { setForm(EMPTY_FORM); setShowPw(false); setModal('create'); }}>
            <i className="bi bi-person-plus"></i> Tambah Admin
          </button>
        </div>

        <div className="adm-table-wrap">
          {loading ? (
            <div className="adm-spinner"><div className="adm-spinner__ring"></div></div>
          ) : rows.length === 0 ? (
            <div className="adm-empty"><div className="adm-empty__icon"><i className="bi bi-people"></i></div><p className="adm-empty__text">Tidak ada akun admin.</p></div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Dibuat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id} style={{ opacity: row.is_active ? 1 : 0.6 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>
                          <i className="bi bi-person"></i>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{row.name}</div>
                          {me && me.id === row.id && <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>Anda</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.84rem' }}>{row.email}</td>
                    <td><span className="adm-badge adm-badge--verified">Admin</span></td>
                    <td>
                      {row.is_active
                        ? <span className="adm-badge adm-badge--approved"><i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>Aktif</span>
                        : <span className="adm-badge adm-badge--unverified"><i className="bi bi-circle me-1" style={{ fontSize: '0.5rem' }}></i>Nonaktif</span>
                      }
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{new Date(row.created_at).toLocaleDateString('id-ID')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        <button className="adm-btn adm-btn--outline adm-btn--sm" title="Edit" onClick={() => { setSelected(row); setForm({ name: row.name, email: row.email, password: '', is_active: row.is_active }); setShowPw(false); setModal('edit'); }}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className={`adm-btn adm-btn--sm ${row.is_active ? 'adm-btn--outline' : 'adm-btn--primary'}`}
                          title={row.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                          disabled={me && me.id === row.id}
                          onClick={() => toggleActive(row)}
                        >
                          <i className={`bi bi-toggle-${row.is_active ? 'on' : 'off'}`}></i>
                        </button>
                        <button
                          className="adm-btn adm-btn--danger adm-btn--sm"
                          title="Hapus"
                          disabled={me && me.id === row.id}
                          onClick={() => { setSelected(row); setModal('delete'); }}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={modal === 'create' || modal === 'edit'}
        title={modal === 'edit' ? 'Edit Akun Admin' : 'Tambah Akun Admin'}
        onClose={() => setModal(null)}
        footer={<>
          <button className="adm-btn adm-btn--outline" onClick={() => setModal(null)}>Batal</button>
          <button className="adm-btn adm-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
        </>}
      >
        <div className="adm-form-group">
          <label>Nama Lengkap</label>
          <input value={form.name} onChange={f('name')} placeholder="Nama admin…" />
        </div>
        <div className="adm-form-group">
          <label>Email</label>
          <input type="email" value={form.email} onChange={f('email')} placeholder="admin@geoslide.id" />
        </div>
        <div className="adm-form-group">
          <label>{modal === 'edit' ? 'Kata Sandi Baru (kosongkan jika tidak diubah)' : 'Kata Sandi'}</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={f('password')}
              placeholder={modal === 'edit' ? '(tidak diubah)' : 'Minimal 6 karakter'}
              style={{ paddingRight: '2.5rem' }}
            />
            <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.95rem' }}>
              <i className={`bi bi-eye${showPw ? '-slash' : ''}`}></i>
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" id="is_active" checked={!!form.is_active} onChange={f('is_active')} style={{ width: 16, height: 16, cursor: 'pointer' }} />
          <label htmlFor="is_active" style={{ fontSize: '0.875rem', cursor: 'pointer', margin: 0 }}>Akun aktif</label>
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal
        open={modal === 'delete'}
        title="Hapus Akun Admin"
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
          <p style={{ fontSize: '0.9rem' }}>Hapus akun <strong>{selected?.name}</strong>?</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Akun yang dihapus tidak dapat dipulihkan. Pertimbangkan untuk menonaktifkan saja.</p>
        </div>
      </Modal>
    </div>
  );
}
