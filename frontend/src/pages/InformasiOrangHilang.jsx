import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

/**
 * Halaman: Informasi Orang Hilang
 * File ini milik: [nama anggota]
 *
 * Menampilkan daftar laporan orang hilang akibat bencana tanah longsor.
 */
export default function InformasiOrangHilang() {
  return (
    <>
      <PageHeader
        title="Informasi Orang Hilang"
        subtitle="Daftar laporan orang hilang akibat bencana tanah longsor"
        icon="bi-people"
      />
      <Section bg="white" py="lg">
        {/* TODO: Isi konten daftar orang hilang di sini */}
        <p className="gs-text-muted text-center">
          Halaman Informasi Orang Hilang — konten akan dikembangkan oleh anggota tim.
        </p>
      </Section>
    </>
  );
}
