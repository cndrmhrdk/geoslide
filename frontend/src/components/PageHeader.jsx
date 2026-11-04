import './PageHeader.css';

/**
 * PageHeader — Header standar halaman publik GeoSlide
 *
 * Mengusung karakter desain tenang, organik, dan premium:
 * - Latar netral hangat (--bg) tanpa blok hijau tua penuh
 * - Judul besar berbobot regular-medium (tidak terlalu tebal/kaku)
 * - Deskripsi singkat abu-abu hangat (--muted) dengan ruang kosong luas
 * - Dekorasi lingkaran/organik halus transparan berwarna --primary-soft
 *
 * Props:
 *   title    {string}  — Judul halaman (wajib)
 *   subtitle {string}  — Deskripsi/subtitle (opsional)
 *   icon     {string}  — Nama kelas Bootstrap Icon, misal: "bi-map" (opsional)
 *   center   {boolean} — Rata tengah (default: false)
 *   badge    {string}  — Label badge opsional di atas judul
 */
export default function PageHeader({
  title,
  subtitle,
  icon,
  center = false,
  badge,
}) {
  return (
    <div className={`gs-page-header ${center ? 'gs-page-header--center' : ''}`}>
      {/* Bentuk organik transparan halus di latar belakang */}
      <div className="gs-page-header__shape gs-page-header__shape--primary" aria-hidden="true" />
      <div className="gs-page-header__shape gs-page-header__shape--warm" aria-hidden="true" />

      <div className="container">
        <div className="gs-page-header__inner">
          {badge && (
            <div className="mb-2">
              <span className="badge-pill badge-primary-soft">{badge}</span>
            </div>
          )}

          {icon && (
            <span className="gs-page-header__icon" aria-hidden="true">
              <i className={`bi ${icon}`}></i>
            </span>
          )}

          <h1 className="gs-page-header__title">{title}</h1>

          {subtitle && (
            <p className="gs-page-header__subtitle">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
