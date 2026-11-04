import './Section.css';

/**
 * Section — Container section halaman standar
 *
 * Props:
 *   children    {ReactNode} — Konten section
 *   className   {string}    — Class tambahan (opsional)
 *   bg          {string}    — Varian background: 'white' | 'subtle' | 'muted' | 'dark'
 *                             default: 'white'
 *   py          {string}    — Padding vertical: 'sm' | 'md' | 'lg' | 'xl'
 *                             default: 'lg'
 *   fluid       {boolean}   — Gunakan container-fluid (default: false)
 *   id          {string}    — ID HTML untuk anchor link (opsional)
 *
 * Contoh penggunaan:
 *   <Section bg="subtle" py="lg" id="daftar-kejadian">
 *     <h2>Daftar Kejadian</h2>
 *     ...
 *   </Section>
 */
export default function Section({
  children,
  className = '',
  bg = 'white',
  py = 'lg',
  fluid = false,
  id,
}) {
  const bgClass = {
    white:  '',
    subtle: 'gs-section--bg-subtle',
    muted:  'gs-section--bg-muted',
    dark:   'gs-section--bg-dark',
  }[bg] ?? '';

  const pyClass = {
    sm: 'gs-section--py-sm',
    md: 'gs-section--py-md',
    lg: 'gs-section--py-lg',
    xl: 'gs-section--py-xl',
  }[py] ?? 'gs-section--py-lg';

  const containerClass = fluid ? 'container-fluid' : 'container';

  return (
    <section
      id={id}
      className={`gs-section ${bgClass} ${pyClass} ${className}`.trim()}
    >
      <div className={containerClass}>
        {children}
      </div>
    </section>
  );
}
