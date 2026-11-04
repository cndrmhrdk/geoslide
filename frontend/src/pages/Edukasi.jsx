import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

/**
 * Halaman: Edukasi
 * File ini milik: [nama anggota]
 *
 * Konten edukasi dan informasi tentang tanah longsor, mitigasi, dan kesiapsiagaan.
 */
export default function Edukasi() {
  return (
    <>
      <PageHeader
        title="Edukasi"
        subtitle="Informasi, panduan mitigasi, dan tips kesiapsiagaan menghadapi bencana tanah longsor"
        icon="bi-book"
      />
      <Section bg="white" py="lg">
        {/* TODO: Isi konten edukasi (artikel, infografis, dsb.) di sini */}
        <p className="gs-text-muted text-center">
          Halaman Edukasi — konten akan dikembangkan oleh anggota tim.
        </p>
      </Section>
    </>
  );
}
