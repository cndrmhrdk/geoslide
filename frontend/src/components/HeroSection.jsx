import { useEffect } from 'react';
import { useNavbarVariant } from '../layouts/PublicLayout';
import './HeroSection.css';

/**
 * HeroSection — Komponen Hero Sinematik Reusable
 *
 * Props:
 *   backgroundImage   {string}    — URL gambar latar (opsional, fallback ke gradien --forest)
 *   title             {string}    — Judul utama (clamp 40px - 88px)
 *   highlight         {string}    — Frasa di dalam judul yang diberi warna aksen --primary
 *   subtitle          {string}    — Deskripsi singkat di bawah judul
 *   actions           {ReactNode} — Slot untuk tombol aksi (pill action, glass, dll.)
 *   children          {ReactNode} — Konten tambahan opsional (kartu glass mengambang, dll.)
 *   className         {string}    — Kelas tambahan (opsional)
 *   autoOverlayNavbar {boolean}   — Otomatis mengubah navbar menjadi mode overlay (default: true)
 */
export default function HeroSection({
  backgroundImage,
  title,
  highlight,
  subtitle,
  actions,
  children,
  className = '',
  autoOverlayNavbar = true,
}) {
  const { setVariant } = useNavbarVariant();

  // Otomatis aktifkan mode navbar overlay saat HeroSection aktif
  useEffect(() => {
    if (autoOverlayNavbar && typeof setVariant === 'function') {
      setVariant('overlay');
      return () => setVariant('solid');
    }
  }, [autoOverlayNavbar, setVariant]);

  // Fungsi pembantu untuk membungkus frasa highlight dengan .text-accent
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
    <section
      className={`gs-hero ${backgroundImage ? 'gs-hero--with-image' : 'gs-hero--gradient'} ${className}`.trim()}
      style={style}
      aria-label="Hero Section"
    >
      {/* Overlay Gelap Sinematik Tipis */}
      <div className="gs-hero__overlay" aria-hidden="true" />

      <div className="container position-relative gs-hero__container">
        <div className="row align-items-center g-4 g-lg-5">
          <div className="col-12 col-lg-8 col-xl-7">
            <div className="gs-hero__content">
              {title && (
                <h1 className="gs-hero__title display-hero">
                  {renderTitle()}
                </h1>
              )}

              {subtitle && (
                <p className="gs-hero__subtitle">
                  {subtitle}
                </p>
              )}

              {actions && (
                <div className="gs-hero__actions d-flex flex-wrap align-items-center gap-3">
                  {actions}
                </div>
              )}
            </div>
          </div>

          {children && (
            <div className="col-12 col-lg-4 col-xl-5">
              <div className="gs-hero__slot">
                {children}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
