import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

/**
 * Halaman: Beranda
 * File ini milik: [nama anggota]
 *
 * Isi konten halaman beranda di sini.
 * Komponen yang tersedia: PageHeader, Section, dan lainnya (lihat docs/UI-GUIDE.md)
 */
export default function Beranda() {
  return (
    <>
      <PageHeader
        title="GeoSlide"
        subtitle="Sistem Informasi dan Manajemen Bencana Tanah Longsor Indonesia"
        icon="bi-geo-alt-fill"
        center
      />
      <Section bg="white" py="lg">
       {/* 1. HERO SECTION & PENGENALAN SINGKAT */}
  <div className="text-center mb-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
    <p className="text-muted-custom fs-5 mb-4">
      Selamat datang di pusat informasi terpadu mitigasi dan pemetaan ancaman bencana tanah longsor.
    </p>
    <div className="d-flex justify-content-center gap-3 flex-wrap">
      <Link to="/data-bencana/peta" className="btn-pill-action">
        <span>Akses Peta Bencana</span>
        <span className="btn-pill-action__icon">
          <i className="bi bi-arrow-right"></i>
        </span>
      </Link>
      <Link to="/pelaporan/laporkan-bencana" className="btn-pill-surface">
        <span>Buat Laporan Darurat</span>
        <span className="btn-pill-surface__icon">
          <i className="bi bi-exclamation-triangle"></i>
        </span>
      </Link>
    </div>
  </div>

        {/* 2. PENGERTIAN TANAH LONGSOR */}
        <div className="mb-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container-tight text-center">
            <span className="badge-pill badge-forest mb-2">Definisi Komprehensif</span>
            <h2 className="mb-3">Apa Itu Bencana Tanah Longsor?</h2>
            <p className="text-muted-custom" style={{ textAlign: 'justify', lineHeight: '1.8' }}>
              Tanah longsor adalah perpindahan massa tanah atau batuan menuruni lereng akibat terganggunya kestabilan lereng tersebut. Fenomena ini umumnya dipicu oleh curah hujan tinggi, erosi, gempa bumi, serta alih fungsi lahan atau aktivitas manusia yang memotong kontur lereng secara tidak aman.
            </p>
          </div>
        </div>

        {/* 3. JENIS-JENIS TANAH LONGSOR BESERTA ILUSTRASI */}
        <div className="mb-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="text-center mb-4">
            <span className="badge-pill badge-primary-soft mb-2">Klasifikasi Ilmiah</span>
            <h2>Jenis-Jenis Tanah Longsor</h2>
            <p className="text-muted-custom">Mengenal 10 tipe utama pergerakan massa tanah dan batuan.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="card-solid">
              <div style={{ height: '160px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1rem', background: '#f4f3ef' }}>
                <img src="https://www.researchgate.net/publication/361356382/figure/fig1/AS:1167783526178819@1655432697530/Schematic-of-a-rotational-slide-showing-the-main-features-of-a-landslide-Source.png" alt="Rotational Slide" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="h5 mb-2">1. Rotational Slide (Longsor Rotasi)</h3>
              <p className="text-muted-custom small mb-0">Gerakan massa tanah pada bidang gelincir melengkung berbentuk sendok.</p>
            </div>

            <div className="card-solid">
              <div style={{ height: '160px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1rem', background: '#f4f3ef' }}>
                <img src="https://cdn-syd.brandkit.com/accounts/23/files/01HQXQ0HTYCJAAM32N1EC6C454/449541-preview.webp?v=63876836009" alt="Translational Slide" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="h5 mb-2">2. Translational Slide (Translasi)</h3>
              <p className="text-muted-custom small mb-0">Massa bergerak pada bidang gelincir lurus atau planar mengikuti kemiringan lereng.</p>
            </div>

            <div className="card-solid">
              <div style={{ height: '160px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1rem', background: '#f4f3ef' }}>
                <img src="https://cdn-syd.brandkit.com/accounts/23/files/01HQXQ0HPKVN23TAZ2JWDGXZ2B/449528-preview.webp?v=63876836001" alt="Block Slide" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="h5 mb-2">3. Block Slide (Longsor Blok)</h3>
              <p className="text-muted-custom small mb-0">Blok-blok batuan independen meluncur menuruni lereng sebagai kesatuan.</p>
            </div>

            <div className="card-solid">
              <div style={{ height: '160px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1rem', background: '#f4f3ef' }}>
                <img src="https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/media/images/05.%20Rockfall.gif" alt="Rockfall" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="h5 mb-2">4. Rockfall (Runtuhan Batuan)</h3>
              <p className="text-muted-custom small mb-0">Jatuhnya batuan secara bebas dari tebing terjal akibat pelapukan gravitasi.</p>
            </div>

            <div className="card-solid">
              <div style={{ height: '160px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1rem', background: '#f4f3ef' }}>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbemZGWCVuCZnt9nZNGoeGjzBYukRDwD78-zhtl4n8_g&s=10" alt="Topple" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="h5 mb-2">5. Topple (Gulingan)</h3>
              <p className="text-muted-custom small mb-0">Rotasi massa batuan ke depan keluar dari lereng di sekitar titik pivot bawah.</p>
            </div>

            <div className="card-solid">
              <div style={{ height: '160px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1rem', background: '#f4f3ef' }}>
                <img src="https://www.researchgate.net/profile/J-Wasowski/publication/237757999/figure/fig1/AS:298766256099335@1448242834415/Sketch-showing-earth-flow-morphology-After-Varnes-1978.png" alt="Earthflow" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="h5 mb-2">6. Earthflow (Aliran Tanah)</h3>
              <p className="text-muted-custom small mb-0">Material berbutir halus jenuh air mengalir menyerupai cairan kental.</p>
            </div>

            <div className="card-solid">
              <div style={{ height: '160px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1rem', background: '#f4f3ef' }}>
                <img src="https://cdn-syd.brandkit.com/accounts/23/files/01HQXQ0H9FHXB2CXM2YXFR2AGR/449500-preview.webp?v=63876836007" alt="Lateral Spread" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="h5 mb-2">7. Lateral Spread (Penyebaran Lateral)</h3>
              <p className="text-muted-custom small mb-0">Peregangan horizontal massa tanah akibat likuifaksi atau patahan lempengan.</p>
            </div>

            <div className="card-solid">
              <div style={{ height: '160px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1rem', background: '#f4f3ef' }}>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv6uE4JpyED-XTCpFgn0TKFckdYXyfF7EyLfzHXqiBWg&s=10" alt="Debris Flow" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="h5 mb-2">8. Debris Flow (Aliran Rombakan)</h3>
              <p className="text-muted-custom small mb-0">Aliran cepat campuran lumpur, air, dan bebatuan di alur sungai pegunungan.</p>
            </div>

            <div className="card-solid">
              <div style={{ height: '160px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1rem', background: '#f4f3ef' }}>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTreFKr-54IMRF2gjoW5LWO9PHlOI8_OvnKz4FJsnUISg&s=10" alt="Debris Avalanche" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="h5 mb-2">9. Debris Avalanche (Runtuhan Rombakan)</h3>
              <p className="text-muted-custom small mb-0">Longsoran sangat cepat dan masif dari material debris jenuh air di lereng terjal.</p>
            </div>

            <div className="card-solid">
              <div style={{ height: '160px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1rem', background: '#f4f3ef' }}>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlReWW4eN3VQqozvdGqX8Fo0x4KszpRnANMbEg7hodUg&s=10" alt="Creep" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="h5 mb-2">10. Creep (Rayapan Tanah)</h3>
              <p className="text-muted-custom small mb-0">Gerakan lambat tanah menuruni lereng yang hampir tak kasat mata dalam jangka panjang.</p>
            </div>
          </div>
        </div>

        {/* 4. PENYEBAB TANAH LONGSOR */}
        <div className="mb-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="text-center mb-4">
            <span className="badge-pill badge-danger mb-2">Faktor Pemicu</span>
            <h2>Penyebab Tanah Longsor</h2>
            <p className="text-muted-custom">Kombinasi faktor alam dan aktivitas manusia.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div className="card-solid">
              <h3 className="h5">Curah Hujan Tinggi</h3>
              <p className="text-muted-custom small mb-0">Menambah beban massa lereng dan tekanan pori air.</p>
            </div>
            <div className="card-solid">
              <h3 className="h5">Getaran Gempa Bumi</h3>
              <p className="text-muted-custom small mb-0">Guncangan tektonik yang merusak struktur kestabilan batuan.</p>
            </div>
            <div className="card-solid">
              <h3 className="h5">Deforestasi (Penebangan)</h3>
              <p className="text-muted-custom small mb-0">Hilangnya akar pohon pencengkram struktur tanah.</p>
            </div>
            <div className="card-solid">
              <h3 className="h5">Potongan Lereng</h3>
              <p className="text-muted-custom small mb-0">Aktivitas konstruksi tanpa sistem terasering atau drainase.</p>
            </div>
          </div>
        </div>

        {/* 5. DAMPAK TANAH LONGSOR */}
        <div className="mb-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="text-center mb-4">
            <span className="badge-pill badge-danger mb-2">Risiko & Kerusakan</span>
            <h2>Dampak Tanah Longsor</h2>
            <p className="text-muted-custom">Akibat langsung terhadap berbagai sektor.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div className="card-solid">
              <h3 className="h5 text-danger">Manusia & Jiwa</h3>
              <p className="text-muted-custom small mb-0">Ancaman keselamatan warga, korban luka, hingga pengungsian.</p>
            </div>
            <div className="card-solid">
              <h3 className="h5 text-primary">Lingkungan</h3>
              <p className="text-muted-custom small mb-0">Kerusakan habitat, sedimentasi sungai, dan erosi lahan.</p>
            </div>
            <div className="card-solid">
              <h3 className="h5 text-gold">Infrastruktur</h3>
              <p className="text-muted-custom small mb-0">Terputusnya jalan, jaringan listrik, dan fasilitas umum.</p>
            </div>
            <div className="card-solid">
              <h3 className="h5 text-forest">Sosial Ekonomi</h3>
              <p className="text-muted-custom small mb-0">Kelumpuhan ekonomi lokal dan tingginya biaya pemulihan.</p>
            </div>
          </div>
        </div>

        {/* 6. MITIGASI TANAH LONGSOR */}
        <div className="mb-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="text-center mb-4">
            <span className="badge-pill badge-primary-soft mb-2">Langkah Siaga</span>
            <h2>Mitigasi Tanah Longsor</h2>
            <p className="text-muted-custom">Panduan tindakan pra, saat, dan pasca bencana.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="card-solid">
              <h3 className="h5 text-forest mb-3">1. Sebelum Bencana</h3>
              <ul className="text-muted-custom small ps-3 mb-0" style={{ lineHeight: '1.7' }}>
                <li>Menanam pohon berakar kuat di lereng.</li>
                <li>Membuat sistem drainase air yang baik.</li>
                <li>Menghindari pembangunan di bawah tebing rawan.</li>
              </ul>
            </div>
            <div className="card-solid">
              <h3 className="h5 text-gold mb-3">2. Saat Bencana</h3>
              <ul className="text-muted-custom small ps-3 mb-0" style={{ lineHeight: '1.7' }}>
                <li>Segera evakuasi diri ke tempat lebih tinggi.</li>
                <li>Waspadai suara gemuruh dan retakan tanah.</li>
                <li>Jauhi jalur aliran air atau lembah curam.</li>
              </ul>
            </div>
            <div className="card-solid">
              <h3 className="h5 text-primary mb-3">3. Setelah Bencana</h3>
              <ul className="text-muted-custom small ps-3 mb-0" style={{ lineHeight: '1.7' }}>
                <li>Jangan langsung kembali sebelum dinyatakan aman.</li>
                <li>Periksa instalasi listrik dan air.</li>
                <li>Laporkan kerusakan dan korban melalui GeoSlide.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 7. CALL TO ACTION (CTA) */}
        <div className="text-center">
          <div className="card-solid p-4 p-md-5" style={{ background: 'var(--forest)', color: '#FFFFFF', borderRadius: 'var(--radius-xl)' }}>
            <h2 className="text-white mb-3">Mari Kenali Risiko & Laporkan Kejadian</h2>
            <p className="text-white-50 mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Partisipasi aktif warga sangat penting untuk keselamatan bersama di Indonesia.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/data-bencana/peta" className="btn-pill-action bg-white text-dark" style={{ borderColor: '#ffffff', color: 'var(--ink)' }}>
                <span className="text-dark">Lihat Persebaran</span>
              </Link>
              <Link to="/pelaporan/laporkan-bencana" className="btn-pill-glass">
                <span>Buat Laporan</span>
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
