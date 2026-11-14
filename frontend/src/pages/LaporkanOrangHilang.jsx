import { useState, useRef, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
/* Gunakan ulang semua utility class lb-* dari LaporkanBencana */
import './LaporkanBencana.css';
import './LaporkanOrangHilang.css';

const MAX_PHOTOS = 3;
const MAX_MB     = 5;
const ALLOWED    = ['image/jpeg','image/png','image/webp'];

/* ---- Steps ---- */
const STEPS = [
  { id: 1, icon: 'bi-person-badge',      label: 'Data Orang Hilang' },
  { id: 2, icon: 'bi-geo-alt',           label: 'Lokasi & Waktu' },
  { id: 3, icon: 'bi-camera',            label: 'Foto' },
  { id: 4, icon: 'bi-person-lines-fill', label: 'Identitas Pelapor' },
];

/* ---- Stepper (identical logic, different steps) ---- */
function Stepper({ current }) {
  return (
    <div className="lb-stepper">
      {STEPS.map((s, i) => {
        const done   = s.id < current;
        const active = s.id === current;
        return (
          <div
            key={s.id}
            className={`lb-stepper__item${active ? ' lb-stepper__item--active' : ''}${done ? ' lb-stepper__item--done' : ''}`}
          >
            <div className="lb-stepper__circle">
              {done ? <i className="bi bi-check-lg"></i> : <i className={`bi ${s.icon}`}></i>}
            </div>
            <span className="lb-stepper__label">{s.label}</span>
            {i < STEPS.length - 1 && <div className="lb-stepper__line"></div>}
          </div>
        );
      })}
    </div>
  );
}

/* ---- Field wrapper ---- */
function Field({ label, required, hint, error, children }) {
  return (
    <div className={`lb-field${error ? ' lb-field--error' : ''}`}>
      <label className="lb-field__label">
        {label}{required && <span className="lb-field__req" aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint  && !error && <p className="lb-field__hint">{hint}</p>}
      {error && <p className="lb-field__error"><i className="bi bi-exclamation-circle me-1"></i>{error}</p>}
    </div>
  );
}

/* ============================================================
   Main Component
   ============================================================ */
export default function LaporkanOrangHilang() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    /* step 1 — orang hilang */
    name: '', age: '', gender: 'unknown', physical_description: '',
    /* step 2 — lokasi & waktu */
    last_seen_location: '', last_seen_at: '',
    /* step 4 — pelapor */
    reporter_name: '', reporter_contact: '',
    public_contact_note: '', public_consent: false,
  });

  const [photos,  setPhotos]  = useState([]);
  const [errors,  setErrors]  = useState({});

  const [submitting,   setSubmitting]   = useState(false);
  const [trackingCode, setTrackingCode] = useState(null);
  const [submitError,  setSubmitError]  = useState('');

  const fileInputRef = useRef(null);
  const topRef       = useRef(null);

  /* ---- helpers ---- */
  const set = useCallback((k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setErrors(prev => ({ ...prev, [k]: '' }));
  }, []);

  function scrollTop() { topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  /* ---- validation ---- */
  function validateStep(s) {
    const e = {};
    if (s === 1) {
      if (!form.name.trim())        e.name = 'Nama orang hilang wajib diisi.';
      if (form.age && (isNaN(Number(form.age)) || Number(form.age) < 1 || Number(form.age) > 120))
        e.age = 'Usia harus antara 1–120 tahun.';
    }
    if (s === 2) {
      if (!form.last_seen_location.trim()) e.last_seen_location = 'Lokasi terakhir terlihat wajib diisi.';
    }
    if (s === 4) {
      if (!form.reporter_name.trim())    e.reporter_name    = 'Nama pelapor wajib diisi.';
      if (!form.reporter_contact.trim()) e.reporter_contact = 'Kontak pelapor wajib diisi.';
    }
    return e;
  }

  function nextStep() {
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length) { scrollTop(); return; }
    setStep(s => s + 1);
    scrollTop();
  }
  function prevStep() { setStep(s => s - 1); scrollTop(); }

  /* ---- photo handling ---- */
  function handleFileSelect(files) {
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = Array.from(files).slice(0, remaining).map(file => {
      if (!ALLOWED.includes(file.type))
        return { file, preview: null, error: 'Format tidak didukung (JPG/PNG/WEBP).' };
      if (file.size > MAX_MB * 1024 * 1024)
        return { file, preview: null, error: `Ukuran melebihi ${MAX_MB} MB.` };
      return { file, preview: URL.createObjectURL(file), error: null };
    });
    setPhotos(prev => [...prev, ...toAdd]);
  }

  function removePhoto(idx) {
    setPhotos(prev => {
      if (prev[idx]?.preview) URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  }

  /* ---- submit ---- */
  async function handleSubmit() {
    const e = validateStep(4);
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'public_consent') fd.append(k, v ? '1' : '0');
        else if (v !== '') fd.append(k, String(v));
      });
      photos.filter(p => !p.error).forEach(p => fd.append('photos', p.file));
      const res  = await fetch('/api/orang-hilang', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengirim laporan.');
      setTrackingCode(data.tracking_code);
      scrollTop();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  /* ============================================================
     SUCCESS SCREEN
     ============================================================ */
  if (trackingCode) {
    return (
      <>
        <PageHeader
          badge="Laporan Terkirim"
          title="Laporan Berhasil Dikirim"
          subtitle="Tim GeoSlide akan memverifikasi laporan Anda secepatnya."
          icon="bi-check-circle"
          center
        />
        <Section bg="subtle" py="lg">
          <div className="lb-success-wrap">
            <div className="lb-success-card">
              <div className="lb-success-card__icon">
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <h2 className="lb-success-card__title">Laporan diterima!</h2>
              <p className="lb-success-card__sub">
                Gunakan kode berikut untuk memantau perkembangan laporan Anda.
              </p>

              <div className="lb-tracking-box">
                <span className="lb-tracking-box__label">Kode Pelacakan</span>
                <span className="lb-tracking-box__code">{trackingCode}</span>
                <button
                  className="lb-tracking-box__copy"
                  onClick={() => navigator.clipboard.writeText(trackingCode)}
                  title="Salin kode"
                >
                  <i className="bi bi-clipboard"></i> Salin
                </button>
              </div>

              <div className="lb-success-info">
                {[
                  ['bi-shield-check',  'Laporan akan diverifikasi oleh admin GeoSlide'],
                  ['bi-eye-slash',     'Data tidak dipublikasikan sebelum diverifikasi'],
                  ['bi-search',        'Gunakan kode di atas untuk cek status laporan'],
                ].map(([icon, text]) => (
                  <div key={icon} className="lb-success-info__item">
                    <i className={`bi ${icon}`}></i><span>{text}</span>
                  </div>
                ))}
              </div>

              <div className="lb-success-actions">
                <a href="/pelaporan/cek-status" className="btn-pill-action">
                  <span>Cek Status Laporan</span>
                  <span className="btn-pill-action__icon"><i className="bi bi-arrow-right"></i></span>
                </a>
                <button
                  className="btn-pill btn-pill-secondary"
                  onClick={() => {
                    setTrackingCode(null); setStep(1); setPhotos([]); setErrors({});
                    setForm({ name:'',age:'',gender:'unknown',physical_description:'',
                              last_seen_location:'',last_seen_at:'',
                              reporter_name:'',reporter_contact:'',
                              public_contact_note:'',public_consent:false });
                  }}
                >
                  Kirim Laporan Lain
                </button>
              </div>
            </div>
          </div>
        </Section>
      </>
    );
  }

  /* ============================================================
     FORM
     ============================================================ */
  return (
    <>
      <PageHeader
        badge="Pelaporan Masyarakat"
        title="Laporkan Orang Hilang"
        highlight="Orang Hilang"
        subtitle="Laporkan orang yang hilang akibat bencana tanah longsor. Laporan Anda akan diverifikasi dan dipublikasikan jika disetujui."
        icon="bi-person-exclamation"
      />

      <Section bg="subtle" py="lg">
        <div className="lb-layout" ref={topRef}>

          {/* ── Kolom kiri: form ── */}
          <div className="lb-form-col">
            <Stepper current={step} />

            {submitError && (
              <div className="lb-alert lb-alert--error">
                <i className="bi bi-exclamation-circle-fill"></i>
                <div>{submitError}</div>
              </div>
            )}

            {/* ======== STEP 1 — DATA ORANG HILANG ======== */}
            {step === 1 && (
              <div className="lb-card">
                <div className="lb-card__heading">
                  <i className="bi bi-person-badge lb-card__heading-icon"></i>
                  <div>
                    <div className="lb-card__title">Data Orang yang Hilang</div>
                    <div className="lb-card__sub">Isi informasi orang yang hilang sedetail mungkin.</div>
                  </div>
                </div>

                <Field label="Nama Lengkap" required error={errors.name}>
                  <input
                    className="lb-input"
                    type="text"
                    placeholder="Nama lengkap orang yang hilang"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                  />
                </Field>

                <div className="lb-grid-2">
                  <Field label="Usia" error={errors.age} hint="Opsional, perkiraan usia.">
                    <input
                      className="lb-input"
                      type="number"
                      min="1" max="120"
                      placeholder="cth. 35"
                      value={form.age}
                      onChange={e => set('age', e.target.value)}
                    />
                  </Field>

                  <Field label="Jenis Kelamin">
                    <select
                      className="lb-input"
                      value={form.gender}
                      onChange={e => set('gender', e.target.value)}
                    >
                      <option value="unknown">Tidak Diketahui</option>
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                  </Field>
                </div>

                <Field
                  label="Deskripsi Fisik"
                  hint="Pakaian terakhir, ciri-ciri tubuh, bekas luka, dsb."
                >
                  <textarea
                    className="lb-input lb-textarea"
                    rows={4}
                    placeholder="Contoh: Tinggi ±165 cm, kulit sawo matang, rambut pendek hitam. Saat hilang mengenakan kaos merah dan celana jeans biru."
                    value={form.physical_description}
                    onChange={e => set('physical_description', e.target.value)}
                  />
                </Field>

                <div className="lb-nav">
                  <div />
                  <button className="btn-pill-action" onClick={nextStep}>
                    <span>Lanjut</span>
                    <span className="btn-pill-action__icon"><i className="bi bi-arrow-right"></i></span>
                  </button>
                </div>
              </div>
            )}

            {/* ======== STEP 2 — LOKASI & WAKTU ======== */}
            {step === 2 && (
              <div className="lb-card">
                <div className="lb-card__heading">
                  <i className="bi bi-geo-alt lb-card__heading-icon"></i>
                  <div>
                    <div className="lb-card__title">Lokasi & Waktu Terakhir Terlihat</div>
                    <div className="lb-card__sub">Di mana dan kapan terakhir kali ditemukan?</div>
                  </div>
                </div>

                <Field
                  label="Lokasi Terakhir Terlihat"
                  required
                  error={errors.last_seen_location}
                  hint="Semakin detail semakin membantu pencarian."
                >
                  <textarea
                    className="lb-input lb-textarea"
                    rows={3}
                    placeholder="Contoh: Jalan Raya Puncak KM 90, Desa Tugu Utara, Cisarua, Kabupaten Bogor — dekat jembatan merah"
                    value={form.last_seen_location}
                    onChange={e => set('last_seen_location', e.target.value)}
                  />
                </Field>

                <Field
                  label="Tanggal & Waktu Terakhir Terlihat"
                  hint="Opsional — isi jika diketahui."
                >
                  <input
                    className="lb-input"
                    type="datetime-local"
                    max={new Date().toISOString().slice(0, 16)}
                    value={form.last_seen_at}
                    onChange={e => set('last_seen_at', e.target.value)}
                  />
                </Field>

                {/* Info box */}
                <div className="loh-info-box">
                  <i className="bi bi-lightbulb loh-info-box__icon"></i>
                  <p className="loh-info-box__text">
                    Lokasi yang detail sangat membantu tim SAR dan relawan menemukan orang hilang lebih cepat.
                    Sertakan nama jalan, nama desa, kecamatan, dan patokan terdekat.
                  </p>
                </div>

                <div className="lb-nav">
                  <button className="btn-pill btn-pill-secondary" onClick={prevStep}>
                    <i className="bi bi-arrow-left me-1"></i> Kembali
                  </button>
                  <button className="btn-pill-action" onClick={nextStep}>
                    <span>Lanjut</span>
                    <span className="btn-pill-action__icon"><i className="bi bi-arrow-right"></i></span>
                  </button>
                </div>
              </div>
            )}

            {/* ======== STEP 3 — FOTO ======== */}
            {step === 3 && (
              <div className="lb-card">
                <div className="lb-card__heading">
                  <i className="bi bi-camera lb-card__heading-icon"></i>
                  <div>
                    <div className="lb-card__title">Foto Orang yang Hilang</div>
                    <div className="lb-card__sub">
                      Opsional — maks. {MAX_PHOTOS} foto, {MAX_MB} MB per file (JPG/PNG/WEBP).
                      Foto hanya akan ditampilkan jika ada persetujuan publik.
                    </div>
                  </div>
                </div>

                {photos.length < MAX_PHOTOS && (
                  <div
                    className="lb-dropzone"
                    onDrop={e => { e.preventDefault(); handleFileSelect(e.dataTransfer.files); }}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
                  >
                    <i className="bi bi-cloud-upload lb-dropzone__icon"></i>
                    <p className="lb-dropzone__text">Klik atau seret foto ke sini</p>
                    <p className="lb-dropzone__hint">
                      {MAX_PHOTOS - photos.length} slot tersisa · JPG, PNG, WEBP · maks. {MAX_MB} MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      style={{ display: 'none' }}
                      onChange={e => { handleFileSelect(e.target.files); e.target.value = ''; }}
                    />
                  </div>
                )}

                {photos.length > 0 && (
                  <div className="lb-photo-grid">
                    {photos.map((p, i) => (
                      <div key={i} className={`lb-photo-item${p.error ? ' lb-photo-item--error' : ''}`}>
                        {p.preview
                          ? <img src={p.preview} alt={`Foto ${i + 1}`} className="lb-photo-item__img" />
                          : <div className="lb-photo-item__placeholder"><i className="bi bi-image"></i></div>
                        }
                        {p.error && <div className="lb-photo-item__errmsg">{p.error}</div>}
                        <button className="lb-photo-item__remove" onClick={() => removePhoto(i)} title="Hapus">
                          <i className="bi bi-x-lg"></i>
                        </button>
                        {!p.error && (
                          <div className="lb-photo-item__badge"><i className="bi bi-check-circle-fill"></i></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="lb-nav">
                  <button className="btn-pill btn-pill-secondary" onClick={prevStep}>
                    <i className="bi bi-arrow-left me-1"></i> Kembali
                  </button>
                  <button className="btn-pill-action" onClick={nextStep}>
                    <span>Lanjut</span>
                    <span className="btn-pill-action__icon"><i className="bi bi-arrow-right"></i></span>
                  </button>
                </div>
              </div>
            )}

            {/* ======== STEP 4 — IDENTITAS PELAPOR ======== */}
            {step === 4 && (
              <div className="lb-card">
                <div className="lb-card__heading">
                  <i className="bi bi-person-lines-fill lb-card__heading-icon"></i>
                  <div>
                    <div className="lb-card__title">Identitas Pelapor</div>
                    <div className="lb-card__sub">Data Anda bersifat rahasia dan hanya untuk verifikasi.</div>
                  </div>
                </div>

                <Field label="Nama Pelapor" required error={errors.reporter_name}>
                  <input
                    className="lb-input"
                    type="text"
                    placeholder="Nama Anda (pelapor)"
                    value={form.reporter_name}
                    onChange={e => set('reporter_name', e.target.value)}
                  />
                </Field>

                <Field
                  label="Nomor WhatsApp / Email"
                  required
                  error={errors.reporter_contact}
                  hint="Untuk konfirmasi laporan. Tidak dipublikasikan."
                >
                  <input
                    className="lb-input"
                    type="text"
                    placeholder="cth. 0812-3456-7890 atau nama@email.com"
                    value={form.reporter_contact}
                    onChange={e => set('reporter_contact', e.target.value)}
                  />
                </Field>

                <Field
                  label="Kontak yang Boleh Ditampilkan Publik"
                  hint="Opsional — nomor/email yang bisa dihubungi oleh masyarakat umum."
                >
                  <input
                    className="lb-input"
                    type="text"
                    placeholder="Kontak publik (opsional)"
                    value={form.public_contact_note}
                    onChange={e => set('public_contact_note', e.target.value)}
                  />
                </Field>

                {/* Persetujuan publik */}
                <div className="loh-consent-box">
                  <label className="loh-consent-box__label">
                    <input
                      type="checkbox"
                      className="loh-consent-box__check"
                      checked={form.public_consent}
                      onChange={e => set('public_consent', e.target.checked)}
                    />
                    <span className="loh-consent-box__text">
                      Saya menyetujui informasi dan foto orang hilang ini ditampilkan kepada publik
                      setelah diverifikasi oleh admin GeoSlide.
                    </span>
                  </label>
                </div>

                {/* Ringkasan */}
                <div className="lb-summary">
                  <div className="lb-summary__title"><i className="bi bi-list-check me-1"></i>Ringkasan Laporan</div>
                  <div className="lb-summary__grid">
                    {[
                      ['Nama', form.name || '—'],
                      ['Usia / Jenis Kelamin', `${form.age || '?'} tahun / ${form.gender === 'male' ? 'Laki-laki' : form.gender === 'female' ? 'Perempuan' : 'Tidak Diketahui'}`],
                      ['Lokasi Terakhir', form.last_seen_location.slice(0, 60) + (form.last_seen_location.length > 60 ? '…' : '') || '—'],
                      ['Waktu Terakhir', form.last_seen_at ? new Date(form.last_seen_at).toLocaleString('id-ID') : 'Tidak diisi'],
                      ['Foto', `${photos.filter(p => !p.error).length} foto diunggah`],
                      ['Izin Publik', form.public_consent ? 'Ya — info ditampilkan publik' : 'Tidak'],
                    ].map(([k, v]) => (
                      <div key={k} className="lb-summary__row">
                        <span className="lb-summary__key">{k}</span>
                        <span className="lb-summary__val">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy notice */}
                <div className="lb-privacy-notice">
                  <i className="bi bi-shield-lock-fill lb-privacy-notice__icon"></i>
                  <p className="lb-privacy-notice__text">
                    Laporan akan ditinjau oleh admin GeoSlide sebelum dipublikasikan.
                    Foto hanya ditampilkan jika Anda memberikan izin publikasi.
                    Data pelapor tidak pernah ditampilkan kepada publik.
                  </p>
                </div>

                <div className="lb-nav">
                  <button className="btn-pill btn-pill-secondary" onClick={prevStep}>
                    <i className="bi bi-arrow-left me-1"></i> Kembali
                  </button>
                  <button
                    className="btn-pill-action"
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{ minWidth: 160 }}
                  >
                    {submitting
                      ? <><span className="lb-spinner-sm" style={{ marginRight: 8 }}></span>Mengirim…</>
                      : <><span>Kirim Laporan</span><span className="btn-pill-action__icon"><i className="bi bi-send"></i></span></>
                    }
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Kolom kanan: aside ── */}
          <aside className="lb-aside">
            <div className="lb-aside__card">
              <div className="lb-aside__title"><i className="bi bi-info-circle me-2"></i>Panduan Pelaporan</div>
              <ul className="lb-aside__list">
                <li><i className="bi bi-check-circle-fill lb-aside__check"></i>Isi nama dan ciri fisik selengkap mungkin</li>
                <li><i className="bi bi-check-circle-fill lb-aside__check"></i>Lokasi terakhir yang detail mempercepat pencarian</li>
                <li><i className="bi bi-check-circle-fill lb-aside__check"></i>Foto terbaru sangat membantu identifikasi</li>
                <li><i className="bi bi-check-circle-fill lb-aside__check"></i>Berikan kontak aktif untuk koordinasi SAR</li>
                <li><i className="bi bi-check-circle-fill lb-aside__check"></i>Simpan kode pelacakan untuk memantau status</li>
              </ul>
            </div>

            <div className="lb-aside__card loh-status-card">
              <div className="lb-aside__title loh-status-card__title">
                <i className="bi bi-search me-2"></i>Status Pencarian
              </div>
              <div className="loh-status-flow">
                {[
                  { icon: 'bi-hourglass-split', color: '#854D0E', bg: '#FEF9C3', label: 'Dicari', desc: 'Aktif dalam pencarian' },
                  { icon: 'bi-check-circle',    color: '#166534', bg: '#DCFCE7', label: 'Ditemukan', desc: 'Telah ditemukan' },
                  { icon: 'bi-archive',         color: '#374151', bg: '#F3F4F6', label: 'Ditutup', desc: 'Kasus ditutup' },
                ].map((s, i) => (
                  <div key={s.label} className="loh-status-flow__item">
                    <div className="loh-status-flow__icon" style={{ background: s.bg, color: s.color }}>
                      <i className={`bi ${s.icon}`}></i>
                    </div>
                    <div>
                      <div className="loh-status-flow__label">{s.label}</div>
                      <div className="loh-status-flow__desc">{s.desc}</div>
                    </div>
                    {i < 2 && <div className="loh-status-flow__arrow"><i className="bi bi-chevron-right"></i></div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="lb-aside__card lb-aside__card--dark">
              <div className="lb-aside__title" style={{ color: '#fff' }}>
                <i className="bi bi-telephone me-2"></i>Darurat?
              </div>
              <p className="lb-aside__p" style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '0.75rem' }}>
                Hubungi layanan pencarian dan penyelamatan langsung.
              </p>
              {[['SAR','115'],['BNPB','117'],['Polisi','110'],['Ambulans','118']].map(([lbl, num]) => (
                <div key={num} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom: 4 }}>
                  <span style={{ color: 'rgba(255,255,255,0.65)' }}>{lbl}</span>
                  <a href={`tel:${num}`} style={{ color: '#86efac', fontWeight: 700 }}>{num}</a>
                </div>
              ))}
            </div>
          </aside>

        </div>
      </Section>
    </>
  );
}
