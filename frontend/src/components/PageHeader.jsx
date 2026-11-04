import './PageHeader.css';

/**
 * PageHeader — Header standar halaman dalam GeoSlide
 *
 * Mendukung dua mode:
 * 1. Default (Ringan): Latar --bg, judul besar dengan frasa beraksen (.text-accent),
 *    deskripsi kecil warna --muted, ruang kosong luas.
 * 2. Gambar Latar: Menggunakan opsi `backgroundImage` dengan overlay gelap tipis
 *    serupa HeroSection untuk halaman dalam bernuansa sinematik.
 *
 * Props:
 *   title           {string|ReactNode} — Judul halaman (wajib)
 *   highlight       {string}           — Frasa di dalam judul untuk diberi warna aksen --primary
 *   subtitle        {string}           — Deskripsi/subtitle (opsional)
 *   icon            {string}           — Nama kelas Bootstrap Icon, misal: "bi-map" (opsional)
 *   center          {boolean}          — Rata tengah (default: false)
 *   badge           {string}           — Tag/label kecil di atas judul (opsional)
 *   backgroundImage {string}           — URL gambar latar opsional dengan overlay
 */
export default function PageHeader({
  title,
  highlight,
  subtitle,
  icon,
  center = false,
  badge,
  backgroundImage,
}) {
  const renderTitle = () => {
    if (!title) return null;
    if (!highlight || typeof title !== 'string' || !title.includes(highlight)) {
      return title;
    }

    const parts = title.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="text-accent">{highlight}</span>
        {parts.slice(1).join(highlight)}
      </>
    );
  };

  const style = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : undefined;

  return (
    <div
      className={`gs-page-header ${center ? 'gs-page-header--center' : ''} ${
        backgroundImage ? 'gs-page-header--with-image' : 'gs-page-header--light'
      }`.trim()}
      style={style}
    >
      {/* Overlay jika menggunakan gambar latar */}
      {backgroundImage && (
        <div className="gs-page-header__overlay" aria-hidden="true" />
      )}

      {/* Dekorasi halus untuk mode ringan */}
      {!backgroundImage && (
        <>
          <div className="gs-page-header__shape gs-page-header__shape--primary" aria-hidden="true" />
          <div className="gs-page-header__shape gs-page-header__shape--warm" aria-hidden="true" />
        </>
      )}

      <div className="container position-relative gs-page-header__container">
        <div className="gs-page-header__inner">
          {badge && (
            <div className="mb-2">
              <span className={`badge-pill ${backgroundImage ? 'badge-glass' : 'badge-primary-soft'}`}>
                {badge}
              </span>
            </div>
          )}

          {icon && (
            <span
              className={`gs-page-header__icon ${
                backgroundImage ? 'gs-page-header__icon--glass' : ''
              }`}
              aria-hidden="true"
            >
              <i className={`bi ${icon}`}></i>
            </span>
          )}

          <h1 className="gs-page-header__title">
            {renderTitle()}
          </h1>

          {subtitle && (
            <p className="gs-page-header__subtitle">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
