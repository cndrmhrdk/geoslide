import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

/**
 * Halaman: Laporkan Orang Hilang
 * File ini milik: [nama anggota]
 *
 * Form untuk melaporkan orang yang hilang akibat bencana tanah longsor.
 */
export default function LaporkanOrangHilang() {
  return (
    <>
      <PageHeader
        title="Laporkan Orang Hilang"
        subtitle="Laporkan orang yang hilang akibat kejadian tanah longsor"
        icon="bi-person-x"
      />
      <Section bg="white" py="lg">
        {/* TODO: Implementasi form pelaporan orang hilang di sini */}
        <p className="gs-text-muted text-center">
          Halaman Laporkan Orang Hilang — konten akan dikembangkan oleh anggota tim.
        </p>
      </Section>
    </>
  );
}
