import { useState, useRef, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import './LaporkanBencana.css';

/* ---- Daftar provinsi ---- */
const PROVINCES = [
  'Aceh','Sumatera Utara','Sumatera Barat','Riau','Kepulauan Riau','Jambi',
  'Bengkulu','Sumatera Selatan','Kepulauan Bangka Belitung','Lampung',
  'Banten','DKI Jakarta','Jawa Barat','Jawa Tengah','Yogyakarta','Jawa Timur',
  'Bali','Nusa Tenggara Barat','Nusa Tenggara Timur','Kalimantan Barat',
  'Kalimantan Tengah','Kalimantan Selatan','Kalimantan Timur','Kalimantan Utara',
  'Sulawesi Utara','Gorontalo','Sulawesi Tengah','Sulawesi Barat',
  'Sulawesi Selatan','Sulawesi Tenggara','Maluku','Maluku Utara',
  'Papua Barat','Papua',
];

const MAX_FILES  = 5;
const MAX_MB     = 5;
const ALLOWED    = ['image/jpeg','image/png','image/webp','image/gif'];

/* ---- Stepper ---- */
const STEPS = [
  { id: 1, icon: 'bi-geo-alt',       label: 'Lokasi & Waktu' },
  { id: 2, icon: 'bi-card-text',     label: 'Deskripsi' },
  { id: 3, icon: 'bi-camera',        label: 'Foto' },
  { id: 4, icon: 'bi-person-lines-fill', label: 'Identitas' },
];

function Stepper({ current }) {
  return (
    <div className="lb-stepper">
      {STEPS.map((s, i) => {
        const done   = s.id < current;
        const active = s.id === current;
        return (
          <div key={s.id} className={`lb-stepper__item${active ? ' lb-stepper__item--active' : ''}${done ? ' lb-stepper__item--done' : ''}`}>
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
        {label}
        {required && <span className="lb-field__req" aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint  && !error && <p className="lb-field__hint">{hint}</p>}
      {error && <p className="lb-field__error"><i className="bi bi-exclamation-circle me-1"></i>{error}</p>}
    </div>
  );
}

/* ---- Main Component ---- */
export default function LaporkanBencana() {
  const [step, setStep] = useState(1);

  /* Form state */
  const [form, setForm] = useState({
    province: '', regency: '', district: '', village: '',
    event_date: '', latitude: '', longitude: '',
    description: '',
    reporter_name: '', reporter_contact: '',
  });
  const [photos,  setPhotos]  = useState([]);    // {file, preview, error?}
  const [errors,  setErrors]  = useState({});

  /* Submission state */
  const [submitting,     setSubmitting]     = useState(false);
  const [trackingCode,   setTrackingCode]   = useState(null);
  const [submitError,    setSubmitError]    = useState('');

  /* Geolocation */
  const [geoLoading,  setGeoLoading]  = useState(false);
  const [geoError,    setGeoError]    = useState('');

  const fileInputRef = useRef(null);
  const topRef       = useRef(null);

  /* ---- Helpers ---- */
  const set = useCallback((k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setErrors(prev => ({ ...prev, [k]: '' }));
  }, []);

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---- Validation per step ---- */
  function validateStep(s) {
    const e = {};
    if (s === 1) {
      if (!form.province)   e.province   = 'Provinsi wajib dipilih.';
      if (!form.regency.trim()) e.regency = 'Kabupaten/Kota wajib diisi.';
      if (!form.event_date) e.event_date = 'Tanggal kejadian wajib diisi.';
      if (form.event_date && form.event_date > new Date().toISOString().slice(0,10)) {
        e.event_date = 'Tanggal tidak boleh di masa depan.';
      }
      if (form.latitude && (isNaN(Number(form.latitude)) || Number(form.latitude) < -90 || Number(form.latitude) > 90)) {
        e.latitude = 'Latitude harus antara -90 dan 90.';
      }
      if (form.longitude && (isNaN(Number(form.longitude)) || Number(form.longitude) < -180 || Number(form.longitude) > 180)) {
        e.longitude = 'Longitude harus antara -180 dan 180.';
      }
    }
    if (s === 2) {
      if (!form.description.trim()) e.description = 'Deskripsi kejadian wajib diisi.';
      if (form.description.trim().length < 20) e.description = 'Deskripsi minimal 20 karakter.';
    }
    if (s === 4) {
      if (!form.reporter_name.trim())    e.reporter_name    = 'Nama wajib diisi.';
      if (!form.reporter_contact.trim()) e.reporter_contact = 'Kontak wajib diisi.';
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

  /* ---- Geolocation ---- */
  function getLocation() {
    if (!navigator.geolocation) { setGeoError('Browser tidak mendukung geolokasi.'); return; }
    setGeoLoading(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      pos => {
        set('latitude',  pos.coords.latitude.toFixed(7));
        set('longitude', pos.coords.longitude.toFixed(7));
        setGeoLoading(false);
      },
      err => {
        setGeoError('Gagal mendapatkan lokasi: ' + err.message);
        setGeoLoading(false);
      },
      { timeout: 10000 }
    );
  }

  /* ---- Photo handling ---- */
  function handleFileSelect(files) {
    const incoming = Array.from(files);
    const remaining = MAX_FILES - photos.length;
    const toAdd = incoming.slice(0, remaining).map(file => {
      if (!ALLOWED.includes(file.type)) {
        return { file, preview: null, error: 'Format tidak didukung (JPG/PNG/WEBP/GIF).' };
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        return { file, preview: null, error: `Ukuran melebihi ${MAX_MB} MB.` };
      }
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

  function handleDrop(e) {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }

  /* ---- Submit ---- */
  async function handleSubmit() {
    const e = validateStep(4);
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
      photos.filter(p => !p.error).forEach(p => fd.append('photos', p.file));

      const res = await fetch('/api/laporan-bencana', { method: 'POST', body: fd });
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

  /* ---- Success screen ---- */
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
                  onClick={() => { navigator.clipboard.writeText(trackingCode); }}
                  title="Salin kode"
                >
                  <i className="bi bi-clipboard"></i> Salin
                </button>
              </div>

              <div className="lb-success-info">
                <div className="lb-success-info__item">
                  <i className="bi bi-shield-check"></i>
                  <span>Laporan akan diverifikasi oleh admin GeoSlide</span>
                </div>
                <div className="lb-success-info__item">
                  <i className="bi bi-eye-slash"></i>
                  <span>Data tidak dipublikasikan sebelum diverifikasi</span>
                </div>
                <div className="lb-success-info__item">
                  <i className="bi bi-search"></i>
                  <span>Gunakan kode di atas untuk cek status laporan</span>
                </div>
              </div>

              <div className="lb-success-actions">
                <a href="/pelaporan/cek-status" className="btn-pill-action">
                  <span>Cek Status Laporan</span>
                  <span className="btn-pill-action__icon"><i className="bi bi-arrow-right"></i></span>
                </a>
                <button
                  className="btn-pill btn-pill-secondary"
                  onClick={() => {
                    setTrackingCode(null);
                    setStep(1);
                    setForm({ province:'',regency:'',district:'',village:'',event_date:'',latitude:'',longitude:'',description:'',reporter_name:'',reporter_contact:'' });
                    setPhotos([]);
                    setErrors({});
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

  /* ---- Form ---- */
  return (
    <>
      <PageHeader
        badge="Pelaporan Masyarakat"
        title="Laporkan Bencana"
        highlight="Bencana"
        subtitle="Laporkan kejadian tanah longsor yang belum tercatat di GeoSlide. Laporan Anda membantu respons yang lebih cepat."
        icon="bi-exclamation-triangle"
      />

      <Section bg="subtle" py="lg">
        <div className="lb-layout" ref={topRef}>

          {/* ── Kolom kiri: form ── */}
          <div className="lb-form-col">

            {/* Stepper */}
            <Stepper current={step} />

            {/* Error banner */}
            {submitError && (
              <div className="lb-alert lb-alert--error">
                <i className="bi bi-exclamation-circle-fill"></i>
                <div>{submitError}</div>
              </div>
            )}

            {/* ======== STEP 1 — LOKASI & WAKTU ======== */}
            {step === 1 && (
              <div className="lb-card">
                <div className="lb-card__heading">
                  <i className="bi bi-geo-alt lb-card__heading-icon"></i>
                  <div>
                    <div className="lb-card__title">Lokasi & Waktu Kejadian</div>
                    <div className="lb-card__sub">Di mana dan kapan kejadian ini terjadi?</div>
                  </div>
                </div>

                <div className="lb-grid-2">
                  <Field label="Provinsi" required error={errors.province}>
                    <select
                      className="lb-input"
                      value={form.province}
                      onChange={e => set('province', e.target.value)}
                    >
                      <option value="">— Pilih Provinsi —</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </Field>

                  <Field label="Kabupaten / Kota" required error={errors.regency}>
                    <input
                      className="lb-input"
                      type="text"
                      placeholder="cth. Kabupaten Cianjur"
                      value={form.regency}
                      onChange={e => set('regency', e.target.value)}
                    />
                  </Field>

                  <Field label="Kecamatan" error={errors.district}>
                    <input
                      className="lb-input"
                      type="text"
                      placeholder="Kecamatan (opsional)"
                      value={form.district}
                      onChange={e => set('district', e.target.value)}
                    />
                  </Field>

                  <Field label="Desa / Kelurahan" error={errors.village}>
                    <input
                      className="lb-input"
                      type="text"
                      placeholder="Desa/Kelurahan (opsional)"
                      value={form.village}
                      onChange={e => set('village', e.target.value)}
                    />
                  </Field>
                </div>

                <Field
                  label="Tanggal Kejadian"
                  required
                  error={errors.event_date}
                  hint="Pilih tanggal saat kejadian berlangsung."
                >
                  <input
                    className="lb-input"
                    type="date"
                    value={form.event_date}
                    max={new Date().toISOString().slice(0,10)}
                    onChange={e => set('event_date', e.target.value)}
                  />
                </Field>

                {/* Koordinat */}
                <div className="lb-coord-section">
                  <div className="lb-coord-section__header">
                    <div>
                      <div className="lb-coord-section__title">Koordinat Lokasi</div>
                      <div className="lb-coord-section__sub">Opsional — membantu penentuan titik di peta</div>
                    </div>
                    <button
                      type="button"
                      className="lb-btn-geo"
                      onClick={getLocation}
                      disabled={geoLoading}
                    >
                      {geoLoading
                        ? <><span className="lb-spinner-sm"></span> Mendeteksi…</>
                        : <><i className="bi bi-crosshair2"></i> Gunakan Lokasi Saya</>
                      }
                    </button>
                  </div>
                  {geoError && (
                    <div className="lb-geo-error"><i className="bi bi-exclamation-circle me-1"></i>{geoError}</div>
                  )}
                  <div className="lb-grid-2">
                    <Field label="Latitude" error={errors.latitude} hint="cth. -6.9175">
                      <input
                        className="lb-input"
                        type="number"
                        step="0.0000001"
                        placeholder="-6.9175000"
                        value={form.latitude}
                        onChange={e => set('latitude', e.target.value)}
                      />
                    </Field>
                    <Field label="Longitude" error={errors.longitude} hint="cth. 107.6191">
                      <input
                        className="lb-input"
                        type="number"
                        step="0.0000001"
                        placeholder="107.6191000"
                        value={form.longitude}
                        onChange={e => set('longitude', e.target.value)}
                      />
                    </Field>
                  </div>
                </div>

                <div className="lb-nav">
                  <div></div>
                  <button className="btn-pill-action" onClick={nextStep}>
                    <span>Lanjut</span>
                    <span className="btn-pill-action__icon"><i className="bi bi-arrow-right"></i></span>
                  </button>
                </div>
              </div>
            )}

            {/* ======== STEP 2 — DESKRIPSI ======== */}
            {step === 2 && (
              <div className="lb-card">
                <div className="lb-card__heading">
                  <i className="bi bi-card-text lb-card__heading-icon"></i>
                  <div>
                    <div className="lb-card__title">Deskripsi Kejadian</div>
                    <div className="lb-card__sub">Ceritakan apa yang terjadi secara ringkas dan jelas.</div>
                  </div>
                </div>

                <Field
                  label="Deskripsi Kejadian"
                  required
                  error={errors.description}
                  hint="Minimal 20 karakter. Sertakan perkiraan dampak bila diketahui."
                >
                  <textarea
                    className="lb-input lb-textarea"
                    rows={7}
                    placeholder="Contoh: Tanah longsor terjadi di Desa X akibat hujan deras. Material longsor menutup jalan dan merusak 3 rumah warga. Tidak ada korban jiwa yang dilaporkan saat ini."
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                  />
                  <div className={`lb-char-count${form.description.trim().length < 20 && form.description.length > 0 ? ' lb-char-count--warn' : ''}`}>
                    {form.description.trim().length} karakter
                    {form.description.trim().length < 20 && form.description.length > 0 && ' (minimal 20)'}
                  </div>
                </Field>

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
                    <div className="lb-card__title">Foto Dokumentasi</div>
                    <div className="lb-card__sub">Opsional — maks. {MAX_FILES} foto, {MAX_MB} MB per file (JPG/PNG/WEBP).</div>
                  </div>
                </div>

                {/* Drop zone */}
                {photos.length < MAX_FILES && (
                  <div
                    className="lb-dropzone"
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
                  >
                    <i className="bi bi-cloud-upload lb-dropzone__icon"></i>
                    <p className="lb-dropzone__text">
                      Klik atau seret foto ke sini
                    </p>
                    <p className="lb-dropzone__hint">
                      {MAX_FILES - photos.length} slot tersisa · JPG, PNG, WEBP, GIF · maks. {MAX_MB} MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={e => { handleFileSelect(e.target.files); e.target.value = ''; }}
                    />
                  </div>
                )}

                {/* Previews */}
                {photos.length > 0 && (
                  <div className="lb-photo-grid">
                    {photos.map((p, i) => (
                      <div key={i} className={`lb-photo-item${p.error ? ' lb-photo-item--error' : ''}`}>
                        {p.preview
                          ? <img src={p.preview} alt={`Foto ${i + 1}`} className="lb-photo-item__img" />
                          : <div className="lb-photo-item__placeholder"><i className="bi bi-image"></i></div>
                        }
                        {p.error && (
                          <div className="lb-photo-item__errmsg">{p.error}</div>
                        )}
                        <button
                          className="lb-photo-item__remove"
                          onClick={() => removePhoto(i)}
                          title="Hapus foto"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                        {!p.error && (
                          <div className="lb-photo-item__badge">
                            <i className="bi bi-check-circle-fill"></i>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {photos.some(p => p.error) && (
                  <div className="lb-alert lb-alert--warn" style={{ marginTop: '0.75rem' }}>
                    <i className="bi bi-exclamation-triangle"></i>
                    <span>Foto yang bermasalah akan diabaikan. Hapus dan ganti jika perlu.</span>
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

            {/* ======== STEP 4 — IDENTITAS ======== */}
            {step === 4 && (
              <div className="lb-card">
                <div className="lb-card__heading">
                  <i className="bi bi-person-lines-fill lb-card__heading-icon"></i>
                  <div>
                    <div className="lb-card__title">Identitas Pelapor</div>
                    <div className="lb-card__sub">Data Anda bersifat rahasia dan hanya untuk keperluan verifikasi.</div>
                  </div>
                </div>

                <Field
                  label="Nama Lengkap"
                  required
                  error={errors.reporter_name}
                >
                  <input
                    className="lb-input"
                    type="text"
                    placeholder="Nama Anda"
                    value={form.reporter_name}
                    onChange={e => set('reporter_name', e.target.value)}
                  />
                </Field>

                <Field
                  label="Nomor WhatsApp / Email"
                  required
                  error={errors.reporter_contact}
                  hint="Digunakan untuk konfirmasi laporan. Tidak dipublikasikan."
                >
                  <input
                    className="lb-input"
                    type="text"
                    placeholder="cth. 0812-3456-7890 atau nama@email.com"
                    value={form.reporter_contact}
                    onChange={e => set('reporter_contact', e.target.value)}
                  />
                </Field>

                {/* Ringkasan laporan */}
                <div className="lb-summary">
                  <div className="lb-summary__title"><i className="bi bi-list-check me-1"></i>Ringkasan Laporan</div>
                  <div className="lb-summary__grid">
                    <div className="lb-summary__row">
                      <span className="lb-summary__key">Lokasi</span>
                      <span className="lb-summary__val">
                        {[form.village, form.district, form.regency, form.province].filter(Boolean).join(', ')}
                      </span>
                    </div>
                    <div className="lb-summary__row">
                      <span className="lb-summary__key">Tanggal</span>
                      <span className="lb-summary__val">
                        {form.event_date ? new Date(form.event_date).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) : '—'}
                      </span>
                    </div>
                    <div className="lb-summary__row">
                      <span className="lb-summary__key">Koordinat</span>
                      <span className="lb-summary__val">
                        {form.latitude && form.longitude ? `${form.latitude}, ${form.longitude}` : 'Tidak diisi'}
                      </span>
                    </div>
                    <div className="lb-summary__row">
                      <span className="lb-summary__key">Foto</span>
                      <span className="lb-summary__val">
                        {photos.filter(p => !p.error).length} foto diunggah
                      </span>
                    </div>
                    <div className="lb-summary__row lb-summary__row--desc">
                      <span className="lb-summary__key">Deskripsi</span>
                      <span className="lb-summary__val">{form.description.slice(0, 100)}{form.description.length > 100 ? '…' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Privacy notice */}
                <div className="lb-privacy-notice">
                  <i className="bi bi-shield-lock-fill lb-privacy-notice__icon"></i>
                  <p className="lb-privacy-notice__text">
                    Laporan Anda akan ditinjau terlebih dahulu oleh tim GeoSlide sebelum dipublikasikan.
                    Data pribadi pelapor tidak akan ditampilkan kepada publik.
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

          {/* ── Kolom kanan: info panel ── */}
          <aside className="lb-aside">
            <div className="lb-aside__card">
              <div className="lb-aside__title"><i className="bi bi-info-circle me-2"></i>Panduan Pelaporan</div>
              <ul className="lb-aside__list">
                <li><i className="bi bi-check-circle-fill lb-aside__check"></i>Pastikan lokasi dan tanggal kejadian benar</li>
                <li><i className="bi bi-check-circle-fill lb-aside__check"></i>Deskripsi yang jelas membantu verifikasi lebih cepat</li>
                <li><i className="bi bi-check-circle-fill lb-aside__check"></i>Foto dokumentasi memperkuat laporan Anda</li>
                <li><i className="bi bi-check-circle-fill lb-aside__check"></i>Gunakan koordinat GPS untuk akurasi lokasi</li>
                <li><i className="bi bi-check-circle-fill lb-aside__check"></i>Simpan kode pelacakan untuk memantau status</li>
              </ul>
            </div>

            <div className="lb-aside__card lb-aside__card--warn">
              <div className="lb-aside__title"><i className="bi bi-exclamation-triangle me-2"></i>Penting</div>
              <p className="lb-aside__p">
                Laporan palsu atau tidak akurat dapat menghambat respons darurat. Laporkan hanya kejadian yang benar-benar terjadi.
              </p>
            </div>

            <div className="lb-aside__card lb-aside__card--dark">
              <div className="lb-aside__title" style={{ color: '#fff' }}>
                <i className="bi bi-telephone me-2"></i>Darurat?
              </div>
              <p className="lb-aside__p" style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '0.75rem' }}>
                Hubungi layanan darurat jika ada korban jiwa atau ancaman langsung.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[['BNPB','117'],['SAR','115'],['Polisi','110'],['Ambulans','118']].map(([lbl, num]) => (
                  <div key={num} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.65)' }}>{lbl}</span>
                    <a href={`tel:${num}`} style={{ color: '#86efac', fontWeight: 700 }}>{num}</a>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </Section>
    </>
  );
}
