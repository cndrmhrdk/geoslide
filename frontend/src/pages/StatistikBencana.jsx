import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

/**
 * Halaman: Statistik Bencana
 * File ini milik: [nama anggota]
 *
 * Halaman ini akan memuat grafik dan statistik menggunakan Recharts.
 * Install Recharts: npm install recharts
 */
export default function StatistikBencana() {
  return (
    <>
      <PageHeader
        title="Statistik Bencana"
        subtitle="Data dan analisis statistik kejadian tanah longsor di Indonesia"
        icon="bi-bar-chart-line"
      />
      <Section bg="white" py="lg">
        {/* TODO: Implementasi grafik Recharts di sini */}
        <p className="gs-text-muted text-center">
          Halaman Statistik Bencana — konten akan dikembangkan oleh anggota tim.
        </p>
      </Section>
    </>
  );
}
