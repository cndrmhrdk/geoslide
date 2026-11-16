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
      <div className="card-solid mb-4" style={{ padding: '2rem' }}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="badge-pill badge-primary-soft">
            <i className="bi bi-shield-exclamation me-1"></i>Deteksi Dini
          </span>
        </div>
        <h2 className="h4 mb-2">Tanda-tanda Lereng Akan Longsor</h2>
        <p className="text-muted-custom small mb-4">
          Jika kamu melihat salah satu tanda ini, jauhi lereng dan segera laporkan ke petugas setempat.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {tandaPeringatan.map((t) => (
            <div
              key={t.t}
              className="d-flex gap-3 align-items-start p-3 rounded-3"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', transition: 'transform 0.2s ease, background 0.2s ease' }}
            >
              <span
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-soft)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0,
                }}
              >
                <i className={`bi ${t.i}`}></i>
              </span>
              <span className="text-ink small fw-medium" style={{ lineHeight: 1.5 }}>{t.t}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-3">
        <span className="badge-pill badge-primary-soft mb-2">
          <i className="bi bi-compass me-1"></i>Langkah Penyelamatan
        </span>
        <h2 className="mb-1">Panduan Mitigasi Terpadu</h2>
        <p className="text-muted-custom">Pilih tahapan untuk melihat protokol keselamatan yang tepat.</p>
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
            style={{ padding: '0.55rem 1.4rem' }}
          >
            <span><i className={`bi ${t.icon} me-2`}></i>{t.label} Longsor</span>
            {aktif === key && (
              <span className="btn-pill-action__icon" aria-hidden="true">
                <i className="bi bi-check2"></i>
              </span>
            )}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${aktif}`} aria-labelledby={`tab-${aktif}`} className="mb-4">
        <div className="text-center mb-4">
          <h3 className="h4 mb-1">{data.judul}</h3>
          <p className="text-muted-custom mb-0">{data.ringkas}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {data.poin.map((p) => (
            <div key={p.t} className="card-solid" style={{ padding: '1.5rem', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}>
              <div
                style={{
                  width: 44, height: 44, borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', color: 'var(--primary)',
                  background: 'var(--primary-soft)',
                  marginBottom: '1rem',
                  boxShadow: '0 2px 6px rgba(63, 122, 26, 0.1)',
                }}
              >
                <i className={`bi ${p.i}`}></i>
              </div>
              <h4 className="h6 mb-2" style={{ fontWeight: 600 }}>{p.t}</h4>
              <p className="text-muted-custom small mb-0" style={{ lineHeight: 1.6 }}>{p.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card-solid mb-4" style={{ padding: '1.75rem 2rem' }}>
        <h3 className="h5 mb-3 d-flex align-items-center gap-2">
          <i className="bi bi-telephone-outbound text-accent"></i> Kontak Darurat &amp; Siaga
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {kontakDarurat.map((k) => (
            <a
              key={k.nomor}
              href={`tel:${k.nomor}`}
              className="d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'var(--primary-soft)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0,
                }}
              >
                <i className="bi bi-telephone-fill"></i>
              </div>
              <div>
                <div className="h4 mb-0 text-ink" style={{ fontWeight: 700 }}>{k.nomor}</div>
                <div className="text-muted-custom small">{k.nama}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="card-solid" style={{ padding: '1.5rem 2rem' }}>
        <h3 className="h6 mb-2 d-flex align-items-center gap-2">
          <i className="bi bi-journal-bookmark text-accent"></i> Referensi &amp; Sumber Resmi
        </h3>
        <ul className="text-muted-custom small ps-3 mb-0" style={{ lineHeight: 1.8 }}>
          {sumber.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="d-inline-flex align-items-center gap-1">
                <span>{s.nama}</span>
                <i className="bi bi-box-arrow-up-right" style={{ fontSize: '0.75rem' }}></i>
              </a>
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
        badge="Panduan & Edukasi"
        title="Edukasi Mitigasi Tanah Longsor"
        highlight="Tanah Longsor"
        subtitle="Pahami cara mengurangi risiko dan apa yang harus dilakukan sebelum, saat, dan setelah longsor."
        icon="bi-mortarboard"
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