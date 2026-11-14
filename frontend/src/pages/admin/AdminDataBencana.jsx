/**
 * AdminDataBencana — Kelola Data Bencana (CRUD + verifikasi)
 */
import { useEffect, useState, useCallback } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const PROVINCES = ['Jawa Barat','Jawa Tengah','Jawa Timur','Sumatera Utara','Sumatera Barat','Sulawesi Selatan','Kalimantan Timur','Bali','Nusa Tenggara Barat','Nusa Tenggara Timur','DKI Jakarta','Banten','Yogyakarta','Riau','Kepulauan Riau','Lampung','Bengkulu','Jambi','Sumatera Selatan','Aceh','Kalimantan Barat','Kalimantan Tengah','Kalimantan Selatan','Kalimantan Utara','Sulawesi Tengah','Sulawesi Tenggara','Sulawesi Utara','Gorontalo','Sulawesi Barat','Maluku','Maluku Utara','Papua','Papua Barat'];

const EMPTY_FORM = {
  title:'', event_date:'', province:'', regency:'', district:'', village:'',
  latitude:'', longitude:'', description:'', deaths:0, missing:0, injured:0,
  displaced:0, houses_damaged:0, source_note:'', verification_status:'unverified',
};

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
  return status === 'verified'
    ? <span className="adm-badge adm-badge--verified"><i className="bi bi-shield-check me-1"></i>Verified</span>
    : <span className="adm-badge adm-badge--unverified"><i className="bi bi-shield-exclamation me-1"></i>Belum Verifikasi</span>;
}

export default function AdminDataBencana() {
  const { authFetch } = useAdminAuth();
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const PER_PAGE = 10;

  const [modal,    setModal]    = useState(null); // null | 'create' | 'edit' | 'delete' | 'detail'
  const [selected, setSelected] = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [saving,   setSaving]   = useState(false);
  const [alert,    setAlert]    = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: PER_PAGE });
      if (search)         params.set('search', search);
      if (filter !== 'all') params.set('verification_status', filter);
      const res = await authFetch(`/api/admin/data-bencana?${params}`);
      if (res.ok) {
        const d = await res.json();
        setRows(d.data || []);
        setTotal(d.total || 0);
      }
    } finally {
      setLoading(false);
    }
  }, [authFetch, page, search, filter]);

  useEffect(() => { load(); }, [load]);

  function openCreate() { setForm(EMPTY_FORM); setModal('create'); }
  function openEdit(row) { setSelected(row); setForm({ ...EMPTY_FORM, ...row }); setModal('edit'); }
  function openDelete(row) { setSelected(row); setModal('delete'); }
  function openDetail(row) { setSelected(row); setModal('detail'); }

  async function save() {
    setSaving(true);
    try {
      const isEdit = modal === 'edit';
      const url    = isEdit ? `/api/admin/data-bencana/${selected.id}` : '/api/admin/data-bencana';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await authFetch(url, { method, body: JSON.stringify(form) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal menyimpan.'); }
      setAlert({ type: 'success', text: isEdit ? 'Kejadian berhasil diperbarui.' : 'Kejadian berhasil ditambahkan.' });
      setModal(null);
      load();
    } catch (err) {
      setAlert({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    setSaving(true);
    try {
      const res = await authFetch(`/api/admin/data-bencana/${selected.id}`, { method: 'DELETE' });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal menghapus.'); }
      setAlert({ type: 'success', text: 'Kejadian berhasil dihapus.' });
      setModal(null);
      load();
    } catch (err) {
      setAlert({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function toggleVerify(row) {
    const next = row.verification_status === 'verified' ? 'unverified' : 'verified';
    try {
      const res = await authFetch(`/api/admin/data-bencana/${row.id}/verification`, {
        method: 'PATCH', body: JSON.stringify({ verification_status: next }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      setAlert({ type: 'success', text: `Status verifikasi diperbarui.` });
      load();
    } catch (err) {
      setAlert({ type: 'error', text: err.message });
    }
  }

  const totalPages = Math.ceil(total / PER_PAGE);
  const f = (k) => (e) => setForm(v => ({ ...v, [k]: e.target.value }));

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-header__title">Kelola Data Bencana</h1>
        <p className="adm-page-header__subtitle">Tambah, ubah, hapus, dan verifikasi kejadian tanah longsor.</p>
      </div>

      {alert && (
        <div className={`adm-alert adm-alert--${alert.type}`} onClick={() => setAlert(null)} style={{ cursor: 'pointer' }}>
          <i className={`bi bi-${alert.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {alert.text}
        </div>
      )}

      <div className="adm-table-card">
        <div className="adm-table-card__header">
          <h2 className="adm-table-card__title">Daftar Kejadian</h2>
          <div className="adm-filter-bar">
            <input
              type="text" placeholder="Cari judul / lokasi…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ width: 200 }}
            />
            <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
              <option value="all">Semua Status</option>
              <option value="unverified">Belum Verifikasi</option>
              <option value="verified">Verified</option>
            </select>
            <button className="adm-btn adm-btn--primary" onClick={openCreate}>
              <i className="bi bi-plus-lg"></i> Tambah Kejadian
            </button>
          </div>
        </div>

        <div className="adm-table-wrap">
          {loading ? (
            <div className="adm-spinner"><div className="adm-spinner__ring"></div></div>
          ) : rows.length === 0 ? (
            <div className="adm-empty">
              <div className="adm-empty__icon"><i className="bi bi-geo-alt"></i></div>
              <p className="adm-empty__text">Tidak ada data kejadian.</p>
            </div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Tanggal</th>
                  <th>Lokasi</th>
                  <th>Meninggal</th>
                  <th>Hilang</th>
                  <th>Verifikasi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id}>
                    <td>
                      <button onClick={() => openDetail(row)} style={{ background:'none', border:'none', padding:0, cursor:'pointer', color:'var(--primary)', fontWeight:600, fontSize:'0.84rem', textAlign:'left' }}>
                        {row.title}
                      </button>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{row.event_date}</td>
                    <td style={{ fontSize: '0.8rem' }}>{row.regency}, {row.province}</td>
                    <td style={{ textAlign: 'center' }}>{row.deaths ?? 0}</td>
                    <td style={{ textAlign: 'center' }}>{row.missing ?? 0}</td>
                    <td><VerBadge status={row.verification_status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        <button className="adm-btn adm-btn--outline adm-btn--sm" title="Edit" onClick={() => openEdit(row)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className={`adm-btn adm-btn--sm ${row.verification_status === 'verified' ? 'adm-btn--outline' : 'adm-btn--primary'}`}
                          title={row.verification_status === 'verified' ? 'Batalkan Verifikasi' : 'Verifikasi'}
                          onClick={() => toggleVerify(row)}
                        >
                          <i className={`bi bi-shield-${row.verification_status === 'verified' ? 'x' : 'check'}`}></i>
                        </button>
                        <button className="adm-btn adm-btn--danger adm-btn--sm" title="Hapus" onClick={() => openDelete(row)}>
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

        {totalPages > 1 && (
          <div className="adm-pagination">
            <span>Menampilkan {rows.length} dari {total} kejadian</span>
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

      {/* Create / Edit Modal */}
      <Modal
        open={modal === 'create' || modal === 'edit'}
        title={modal === 'edit' ? 'Edit Kejadian' : 'Tambah Kejadian'}
        onClose={() => setModal(null)}
        footer={<>
          <button className="adm-btn adm-btn--outline" onClick={() => setModal(null)}>Batal</button>
          <button className="adm-btn adm-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
        </>}
      >
        <div className="adm-form-group">
          <label>Judul Kejadian</label>
          <input value={form.title} onChange={f('title')} placeholder="Longsor di Desa …" />
        </div>
        <div className="adm-form-grid-2">
          <div className="adm-form-group">
            <label>Tanggal Kejadian</label>
            <input type="date" value={form.event_date} onChange={f('event_date')} />
          </div>
          <div className="adm-form-group">
            <label>Status Verifikasi</label>
            <select value={form.verification_status} onChange={f('verification_status')}>
              <option value="unverified">Belum Verifikasi</option>
              <option value="verified">Verified</option>
            </select>
          </div>
        </div>
        <div className="adm-form-grid-2">
          <div className="adm-form-group">
            <label>Provinsi</label>
            <select value={form.province} onChange={f('province')}>
              <option value="">— Pilih —</option>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="adm-form-group">
            <label>Kabupaten / Kota</label>
            <input value={form.regency} onChange={f('regency')} placeholder="Kabupaten/Kota" />
          </div>
          <div className="adm-form-group">
            <label>Kecamatan</label>
            <input value={form.district} onChange={f('district')} placeholder="Kecamatan (opsional)" />
          </div>
          <div className="adm-form-group">
            <label>Desa / Kelurahan</label>
            <input value={form.village} onChange={f('village')} placeholder="Desa (opsional)" />
          </div>
          <div className="adm-form-group">
            <label>Latitude</label>
            <input type="number" step="0.0000001" value={form.latitude} onChange={f('latitude')} placeholder="-7.5000000" />
          </div>
          <div className="adm-form-group">
            <label>Longitude</label>
            <input type="number" step="0.0000001" value={form.longitude} onChange={f('longitude')} placeholder="110.5000000" />
          </div>
        </div>
        <div className="adm-form-group">
          <label>Deskripsi</label>
          <textarea value={form.description} onChange={f('description')} rows={3} placeholder="Deskripsi singkat kejadian…" />
        </div>
        <div className="adm-form-grid-2">
          {[['deaths','Meninggal'],['missing','Hilang'],['injured','Luka-luka'],['displaced','Mengungsi'],['houses_damaged','Rumah Rusak']].map(([k,l]) => (
            <div key={k} className="adm-form-group">
              <label>{l}</label>
              <input type="number" min="0" value={form[k]} onChange={f(k)} />
            </div>
          ))}
        </div>
        <div className="adm-form-group">
          <label>Catatan Sumber</label>
          <textarea value={form.source_note} onChange={f('source_note')} rows={2} placeholder="Sumber referensi data…" />
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={modal === 'delete'}
        title="Hapus Kejadian"
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
          <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Apakah Anda yakin ingin menghapus kejadian ini?</p>
          <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selected?.title}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Tindakan ini tidak dapat dibatalkan.</p>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={modal === 'detail'}
        title="Detail Kejadian"
        onClose={() => setModal(null)}
      >
        {selected && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>{selected.title}</h3>
            <div className="adm-form-grid-2" style={{ gap: '0.5rem 1rem' }}>
              {[
                ['Tanggal', selected.event_date],
                ['Provinsi', selected.province],
                ['Kabupaten', selected.regency],
                ['Kecamatan', selected.district || '—'],
                ['Desa', selected.village || '—'],
                ['Koordinat', selected.latitude ? `${selected.latitude}, ${selected.longitude}` : '—'],
                ['Meninggal', selected.deaths],
                ['Hilang', selected.missing],
                ['Luka', selected.injured],
                ['Mengungsi', selected.displaced],
                ['Rumah Rusak', selected.houses_damaged],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{v ?? '—'}</div>
                </div>
              ))}
            </div>
            {selected.description && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>Deskripsi</div>
                <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{selected.description}</div>
              </div>
            )}
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status:</span>
              <VerBadge status={selected.verification_status} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
