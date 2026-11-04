import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

/**
 * Halaman: Laporkan Bencana
 * File ini milik: [nama anggota]
 *
 * Form untuk melaporkan kejadian tanah longsor baru.
 */
export default function LaporkanBencana() {
  return (
    <>
      <PageHeader
        title="Laporkan Bencana"
        subtitle="Laporkan kejadian tanah longsor yang Anda ketahui"
        icon="bi-exclamation-triangle"
      />
      <Section bg="white" py="lg">
        {/* TODO: Implementasi form pelaporan bencana di sini */}
        <p className="gs-text-muted text-center">
          Halaman Laporkan Bencana — konten akan dikembangkan oleh anggota tim.
        </p>
      </Section>
    </>
  );
}
