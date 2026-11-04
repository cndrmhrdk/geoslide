import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

/**
 * Halaman: Cek Status Laporan
 * File ini milik: [nama anggota]
 *
 * Form/halaman untuk mengecek status laporan bencana atau orang hilang.
 */
export default function CekStatusLaporan() {
  return (
    <>
      <PageHeader
        title="Cek Status Laporan"
        subtitle="Periksa perkembangan laporan yang telah Anda kirimkan"
        icon="bi-search"
      />
      <Section bg="white" py="lg">
        {/* TODO: Implementasi pengecekan status laporan di sini */}
        <p className="gs-text-muted text-center">
          Halaman Cek Status Laporan — konten akan dikembangkan oleh anggota tim.
        </p>
      </Section>
    </>
  );
}
