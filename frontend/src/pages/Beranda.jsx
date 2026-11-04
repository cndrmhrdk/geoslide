import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

/**
 * Halaman: Beranda
 * File ini milik: [nama anggota]
 *
 * Isi konten halaman beranda di sini.
 * Komponen yang tersedia: PageHeader, Section, dan lainnya (lihat docs/UI-GUIDE.md)
 */
export default function Beranda() {
  return (
    <>
      <PageHeader
        title="GeoSlide"
        subtitle="Sistem Informasi dan Manajemen Bencana Tanah Longsor Indonesia"
        icon="bi-geo-alt-fill"
        center
      />
      <Section bg="white" py="lg">
        {/* TODO: Isi konten Beranda di sini */}
        <p className="gs-text-muted text-center">
          Halaman Beranda — konten akan dikembangkan oleh anggota tim.
        </p>
      </Section>
    </>
  );
}
