import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

/**
 * Halaman: Peta Bencana
 * File ini milik: [nama anggota]
 *
 * Halaman ini akan memuat peta Leaflet persebaran kejadian tanah longsor.
 * Install Leaflet: npm install leaflet react-leaflet
 */
export default function PetaBencana() {
  return (
    <>
      <PageHeader
        title="Peta Bencana"
        subtitle="Visualisasi persebaran kejadian tanah longsor di seluruh Indonesia"
        icon="bi-map"
      />
      <Section bg="white" py="lg">
        {/* TODO: Implementasi peta Leaflet di sini */}
        <p className="gs-text-muted text-center">
          Halaman Peta Bencana — konten akan dikembangkan oleh anggota tim.
        </p>
      </Section>
    </>
  );
}
