import './PageHeader.css';

/**
 * PageHeader — Header standar halaman publik
 *
 * Props:
 *   title    {string}  — Judul halaman (wajib)
 *   subtitle {string}  — Deskripsi/subtitle (opsional)
 *   icon     {string}  — Nama kelas Bootstrap Icon, misal: "bi-map" (opsional)
 *   center   {boolean} — Rata tengah (default: false)
 *
 * Contoh penggunaan:
 *   <PageHeader
 *     title="Peta Bencana"
 *     subtitle="Visualisasi persebaran kejadian tanah longsor di seluruh Indonesia"
 *     icon="bi-map"
 *   />
 */
export default function PageHeader({ title, subtitle, icon, center = false }) {
  return (
    <div className={`gs-page-header ${center ? 'gs-page-header--center' : ''}`}>
      <div className="container">
        <div className="gs-page-header__inner">
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
