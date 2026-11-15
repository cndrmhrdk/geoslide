import { lazy, Suspense, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

const LandslideModel3D = lazy(() => import('../components/LandSlideModel3d'));

const YOUTUBE_ID = 'YT7I1-33dGQ';

const tandaPeringatan = [
  'Hujan lebat atau berlangsung lama',
  'Retakan baru di tanah lereng, jalan, atau dinding rumah',
  'Rembesan atau mata air baru di lereng, atau air sungai mendadak keruh',
  'Pohon, tiang, atau pagar di lereng tiba-tiba miring',
  'Tanah amblas atau terdengar suara gemuruh dari arah lereng',
];

const tahapan = {
  sebelum: {
    label: 'Sebelum',
    judul: 'Sebelum Longsor: Kenali dan Kurangi Risiko',
    ringkas: 'Waktu terbaik untuk mengurangi bahaya adalah sebelum hujan lebat datang.',
    poin: [
      { t: 'Cek apakah tempat tinggalmu rawan', d: 'Lihat peta zona kerentanan gerakan tanah dari Badan Geologi dan tanyakan ke BPBD atau kantor desa setempat.' },
      { t: 'Hafalkan tanda-tanda awal', d: 'Retakan, rembesan air, pohon miring, dan suara gemuruh (lihat daftar tanda di atas).' },
      { t: 'Jangan mengganggu lereng', d: 'Hindari menggali atau memotong lereng tanpa penahan dan drainase yang benar.' },
      { t: 'Pastikan saluran air lancar', d: 'Di luar waktu hujan, periksa saluran di dalam dan sekitar lereng agar air tidak menggenang dan meresap.' },
      { t: 'Beri tahu lingkungan sekitar', d: 'Sampaikan ke tetangga, RT/RW, atau petugas bila melihat tanda longsor. Warga bisa ronda bersama, termasuk memeriksa aliran sungai di bagian atas lereng.' },
      { t: 'Siapkan rencana evakuasi', d: 'Tentukan jalur dan titik kumpul yang aman, siapkan tas siaga, dan simpan nomor darurat.' },
      { t: 'Bila tanda sudah terlihat, mengungsilah dulu', d: 'Jangan menunggu longsor terjadi. Pindah ke tempat yang aman lebih baik daripada menunggu kepastian.' },
    ],
  },
  saat: {
    label: 'Saat',
    judul: 'Saat Longsor: Selamatkan Diri',
    ringkas: 'Fokusnya satu: menjauh dari lereng dan area longsor dengan cepat.',
    poin: [
      { t: 'Tetap tenang', d: 'Panik membuat kita sulit mengambil keputusan yang tepat.' },
      { t: 'Segera tinggalkan rumah', d: 'Jika longsor terjadi di sekitar rumah, keluar dan berlindung di tempat yang aman.' },
      { t: 'Jangan mendekati area longsor', d: 'Longsor susulan masih mungkin terjadi. Jauhi juga alur sungai dan lembah di bawah lereng.' },
      { t: 'Bantu orang lain bila memungkinkan', d: 'Utamakan keselamatan diri. Bantuan terbaik adalah memanggil petugas.' },
      { t: 'Hubungi petugas', d: 'Kabari petugas lingkungan atau nomor darurat (112, Basarnas 115, BNPB 117).' },
      { t: 'Pantau informasi resmi', d: 'Jangan kembali ke rumah sebelum ada informasi bahwa kondisi sudah aman.' },
    ],
  },
  setelah: {
    label: 'Setelah',
    judul: 'Setelah Longsor: Tetap Waspada',
    ringkas: 'Bahaya belum selesai. Lereng yang baru longsor masih bisa bergerak lagi.',
    poin: [
      { t: 'Tetap jauhi kawasan longsor', d: 'Tunggu di tempat yang aman karena longsor susulan masih mungkin terjadi.' },
      { t: 'Ikuti informasi resmi', d: 'Dengarkan arahan BPBD, aparat desa, atau petugas untuk memastikan kamu berada di tempat yang tepat.' },
      { t: 'Bantu korban tanpa membahayakan diri', d: 'Berikan pertolongan pertama bila bisa, dan jangan masuk area yang masih tidak stabil.' },
      { t: 'Laporkan kejadian', d: 'Sampaikan singkat dan jelas: lokasi, waktu, perkiraan korban, dan kerusakan. Laporan juga bisa dibuat lewat GeoSlide.' },
      { t: 'Pulang hanya setelah dinyatakan aman', d: 'Jangan memutuskan sendiri bahwa rumah sudah aman.' },
      { t: 'Ikuti keputusan relokasi', d: 'Jika pihak berwenang memutuskan relokasi, patuhi demi keselamatan keluarga.' },
    ],
  },
};

const kontakDarurat = [
  { nomor: '112', nama: 'Panggilan darurat nasional' },
  { nomor: '115', nama: 'Basarnas (pencarian dan pertolongan)' },
  { nomor: '117', nama: 'BNPB (penanggulangan bencana)' },
];

const sumber = [
  { nama: 'Video edukasi mitigasi tanah longsor, BPBD Kabupaten Ciamis (YouTube)', url: 'https://www.youtube.com/watch?v=YT7I1-33dGQ' },
  { nama: 'BPBD Kota Balikpapan, langkah mitigasi sebelum, saat, sesudah (dimuat detikNews, 8 Maret 2023)', url: 'https://news.detik.com/berita/d-6606449/mitigasi-tanah-longsor-sebelum-saat-dan-sesudah-bencana-cek-di-sini' },
  { nama: 'BMKG, rekomendasi antisipasi longsor (dikutip Antara, BPBD Jember)', url: 'https://jatim.antaranews.com/berita/874930/bpbd-jember-imbau-warga-waspadai-longsor-di-ledokombo' },
  { nama: 'PVMBG, Badan Geologi, Kementerian ESDM: waspada gerakan tanah saat curah hujan tinggi', url: 'https://esdm.go.id/id/media-center/arsip-berita/curah-hujan-tinggi-masyarakat-diminta-waspadai-gerakan-tanah-longsor' },
  { nama: 'BNPB, mitigasi longsor sebelum, saat, dan sesudah bencana', url: 'https://bnpb.go.id/berita/ribuan-ews-longsor-perlu-digelontor' },
];

function PanduanMitigasi() {
  const [aktif, setAktif] = useState('sebelum');
  const data = tahapan[aktif];

  return (
    <div>
      <div className="card-solid mb-4">
        <h2 className="h4 mb-2">Tanda-tanda Lereng Akan Longsor</h2>
        <p className="text-muted-custom small mb-3">
          Jika kamu melihat salah satu tanda ini, jauhi lereng dan segera laporkan ke petugas setempat.
        </p>
        <ul className="text-muted-custom ps-3 mb-0" style={{ lineHeight: 1.8 }}>
          {tandaPeringatan.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      <div className="text-center mb-3">
        <h2 className="mb-1">Panduan Mitigasi</h2>
        <p className="text-muted-custom">Pilih tahapan untuk melihat apa yang perlu dilakukan.</p>
      </div>

      <div role="tablist" aria-label="Tahapan mitigasi" className="d-flex justify-content-center gap-2 flex-wrap mb-4">
        {Object.entries(tahapan).map(([key, t]) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`tab-${key}`}
            aria-selected={aktif === key}
            aria-controls={`panel-${key}`}
            className={aktif === key ? 'btn-pill-action' : 'btn-pill-surface'}
            onClick={() => setAktif(key)}
          >
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${aktif}`} aria-labelledby={`tab-${aktif}`} className="card-solid mb-4">
        <h3 className="h4 mb-1">{data.judul}</h3>
        <p className="text-muted-custom mb-4">{data.ringkas}</p>
        <ol className="ps-3 mb-0" style={{ lineHeight: 1.7 }}>
          {data.poin.map((p) => (
            <li key={p.t} className="mb-3">
              <strong>{p.t}.</strong> <span className="text-muted-custom">{p.d}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="card-solid mb-4">
        <h3 className="h5 mb-3">Nomor Darurat</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {kontakDarurat.map((k) => (
            <div key={k.nomor}>
              <div className="h3 mb-0">{k.nomor}</div>
              <div className="text-muted-custom small">{k.nama}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="h6 mb-2">Sumber</h3>
        <ul className="text-muted-custom small ps-3 mb-0" style={{ lineHeight: 1.7 }}>
          {sumber.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">{s.nama}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function EdukasiModel3D() {
  return (
    <>
      <PageHeader
        badge="Edukasi"
        title="Bagaimana Longsor Terjadi?"
        subtitle="Putar penampang lereng, naikkan hujan, lalu lihat apa yang terjadi."
        icon="bi-layers"
      />
      <Section bg="subtle" py="md">
        <Suspense fallback={<p>Memuat model 3D...</p>}>
          <LandslideModel3D />
        </Suspense>
      </Section>

    <Section bg="white" py="md">
        <PanduanMitigasi />
      </Section>

     <Section bg="subtle" py="md">
        <div className="text-center mb-4">
          <h2 className="mb-1">Video Edukasi</h2>
          <p className="text-muted-custom">Tonton panduan mitigasi dan keselamatan saat longsor.</p>
        </div>
        <div className="container-tight">
          {YOUTUBE_ID ? (
            <div style={{ aspectRatio: '16 / 9', width: '100%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_ID}`}
                title="Video edukasi mitigasi tanah longsor"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 0, borderRadius: 'var(--radius-md)' }}
              />
            </div>
          ) : (
            <div className="card-solid text-center text-muted-custom">
              Video edukasi akan segera tersedia.
            </div>
          )}
        </div>
      </Section>

    </>
  );
}