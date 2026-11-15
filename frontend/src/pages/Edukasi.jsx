import { lazy, Suspense, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

const LandslideModel3D = lazy(() => import('../components/LandSlideModel3d'));

const YOUTUBE_ID = 'YT7I1-33dGQ';

const tandaPeringatan = [
  { i: 'bi-cloud-rain-heavy', t: 'Hujan lebat atau berlangsung lama' },
  { i: 'bi-lightning', t: 'Retakan baru di tanah lereng, jalan, atau dinding rumah' },
  { i: 'bi-droplet-half', t: 'Rembesan atau mata air baru di lereng, atau air sungai mendadak keruh' },
  { i: 'bi-tree', t: 'Pohon, tiang, atau pagar di lereng tiba-tiba miring' },
  { i: 'bi-volume-up', t: 'Tanah amblas atau terdengar suara gemuruh dari arah lereng' },
];

const tahapan = {
  sebelum: {
    label: 'Sebelum',
    icon: 'bi-eye',
    judul: 'Sebelum Longsor: Kenali dan Kurangi Risiko',
    ringkas: 'Waktu terbaik untuk mengurangi bahaya adalah sebelum hujan lebat datang.',
    poin: [
      { i: 'bi-geo-alt', t: 'Cek apakah tempat tinggalmu rawan', d: 'Lihat peta zona kerentanan gerakan tanah dari Badan Geologi dan tanyakan ke BPBD atau kantor desa setempat.' },
      { i: 'bi-eye', t: 'Hafalkan tanda-tanda awal', d: 'Retakan, rembesan air, pohon miring, dan suara gemuruh (lihat daftar tanda di atas).' },
      { i: 'bi-slash-circle', t: 'Jangan mengganggu lereng', d: 'Hindari menggali atau memotong lereng tanpa penahan dan drainase yang benar.' },
      { i: 'bi-droplet', t: 'Pastikan saluran air lancar', d: 'Di luar waktu hujan, periksa saluran di dalam dan sekitar lereng agar air tidak menggenang dan meresap.' },
      { i: 'bi-people', t: 'Beri tahu lingkungan sekitar', d: 'Sampaikan ke tetangga, RT/RW, atau petugas bila melihat tanda longsor. Warga bisa ronda bersama, termasuk memeriksa aliran sungai di bagian atas lereng.' },
      { i: 'bi-signpost-split', t: 'Siapkan rencana evakuasi', d: 'Tentukan jalur dan titik kumpul yang aman, siapkan tas siaga, dan simpan nomor darurat.' },
      { i: 'bi-arrow-up-right-circle', t: 'Bila tanda sudah terlihat, mengungsilah dulu', d: 'Jangan menunggu longsor terjadi. Pindah ke tempat yang aman lebih baik daripada menunggu kepastian.' },
    ],
  },
  saat: {
    label: 'Saat',
    icon: 'bi-exclamation-triangle',
    judul: 'Saat Longsor: Selamatkan Diri',
    ringkas: 'Fokusnya satu: menjauh dari lereng dan area longsor dengan cepat.',
    poin: [
      { i: 'bi-pause-circle', t: 'Tetap tenang', d: 'Panik membuat kita sulit mengambil keputusan yang tepat.' },
      { i: 'bi-door-open', t: 'Segera tinggalkan rumah', d: 'Jika longsor terjadi di sekitar rumah, keluar dan berlindung di tempat yang aman.' },
      { i: 'bi-exclamation-octagon', t: 'Jangan mendekati area longsor', d: 'Longsor susulan masih mungkin terjadi. Jauhi juga alur sungai dan lembah di bawah lereng.' },
      { i: 'bi-heart', t: 'Bantu orang lain bila memungkinkan', d: 'Utamakan keselamatan diri. Bantuan terbaik adalah memanggil petugas.' },
      { i: 'bi-telephone', t: 'Hubungi petugas', d: 'Kabari petugas lingkungan atau nomor darurat (112, Basarnas 115, BNPB 117).' },
      { i: 'bi-megaphone', t: 'Pantau informasi resmi', d: 'Jangan kembali ke rumah sebelum ada informasi bahwa kondisi sudah aman.' },
    ],
  },
  setelah: {
    label: 'Setelah',
    icon: 'bi-check2-circle',
    judul: 'Setelah Longsor: Tetap Waspada',
    ringkas: 'Bahaya belum selesai. Lereng yang baru longsor masih bisa bergerak lagi.',
    poin: [
      { i: 'bi-cone-striped', t: 'Tetap jauhi kawasan longsor', d: 'Tunggu di tempat yang aman karena longsor susulan masih mungkin terjadi.' },
      { i: 'bi-newspaper', t: 'Ikuti informasi resmi', d: 'Dengarkan arahan BPBD, aparat desa, atau petugas untuk memastikan kamu berada di tempat yang tepat.' },
      { i: 'bi-bandaid', t: 'Bantu korban tanpa membahayakan diri', d: 'Berikan pertolongan pertama bila bisa, dan jangan masuk area yang masih tidak stabil.' },
      { i: 'bi-clipboard-check', t: 'Laporkan kejadian', d: 'Sampaikan singkat dan jelas: lokasi, waktu, perkiraan korban, dan kerusakan. Laporan juga bisa dibuat lewat GeoSlide.' },
      { i: 'bi-house-door', t: 'Pulang hanya setelah dinyatakan aman', d: 'Jangan memutuskan sendiri bahwa rumah sudah aman.' },
      { i: 'bi-signpost', t: 'Ikuti keputusan relokasi', d: 'Jika pihak berwenang memutuskan relokasi, patuhi demi keselamatan keluarga.' },
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {tandaPeringatan.map((t) => (
          <div key={t.t} className="d-flex gap-3 align-items-start">
            <i className={`bi ${t.i}`} style={{ fontSize: '1.4rem', color: 'var(--forest)' }}></i>
            <span className="text-muted-custom small">{t.t}</span>
          </div>
        ))}
</div>
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
            <span><i className={`bi ${t.icon} me-2`}></i>{t.label}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${aktif}`} aria-labelledby={`tab-${aktif}`} className="mb-4">
  <div className="text-center mb-4">
    <h3 className="h4 mb-1">{data.judul}</h3>
    <p className="text-muted-custom mb-0">{data.ringkas}</p>
  </div>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
    {data.poin.map((p) => (
      <div key={p.t} className="card-solid">
        <div
          style={{
            width: 44, height: 44, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem', color: 'var(--forest)',
            background: 'color-mix(in srgb, var(--forest) 12%, white)',
            marginBottom: '0.75rem',
          }}
        >
          <i className={`bi ${p.i}`}></i>
        </div>
        <h4 className="h6 mb-1">{p.t}</h4>
        <p className="text-muted-custom small mb-0">{p.d}</p>
      </div>
    ))}
  </div>
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
        title="Edukasi Mitigasi Tanah Longsor"
        subtitle="Pahami cara mengurangi risiko dan apa yang harus dilakukan sebelum, saat, dan setelah longsor."
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