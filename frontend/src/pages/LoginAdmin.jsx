import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

/**
 * Halaman: Login Admin
 * File ini milik: [nama anggota]
 *
 * Halaman login khusus administrator sistem GeoSlide.
 */
export default function LoginAdmin() {
  return (
    <>
      <PageHeader
        title="Login Admin"
        subtitle="Masuk ke panel administrasi GeoSlide"
        icon="bi-shield-lock"
        center
      />
      <Section bg="subtle" py="lg">
        {/* TODO: Implementasi form login admin di sini */}
        <p className="gs-text-muted text-center">
          Halaman Login Admin — konten akan dikembangkan oleh anggota tim.
        </p>
      </Section>
    </>
  );
}
