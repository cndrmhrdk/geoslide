import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavbarVariant } from '../layouts/PublicLayout';
import useCountUp from '../hooks/useCountUp';
import { getStatistik } from '../services/dataBencana';
import './Beranda.css';

/* ------------------------------------------------------------------
   Rute tujuan. Sesuaikan jika path di App.jsx berbeda.
------------------------------------------------------------------ */
const ROUTES = {
  peta: '/data-bencana/peta',
  statistik: '/data-bencana/statistik',
  orangHilang: '/orang-hilang',
  lapor: '/pelaporan/laporkan-bencana',
  edukasi: '/edukasi',
};

const formatNumber = (value) => (Number(value) || 0).toLocaleString('id-ID');

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------
   Data statis konten edukasi
------------------------------------------------------------------ */
const QUICK_LINKS = [
  {
    to: ROUTES.peta,
    icon: 'bi-geo-alt',
    title: 'Peta Bencana',
    text: 'Jelajahi titik kejadian longsor di seluruh Indonesia.',
  },
  {
    to: ROUTES.statistik,
    icon: 'bi-bar-chart-line',
    title: 'Statistik',
    text: 'Tren kejadian, korban, dan wilayah paling terdampak.',
  },
  {
    to: ROUTES.orangHilang,
    icon: 'bi-people',
    title: 'Orang Hilang',
    text: 'Cari dan pantau informasi orang yang dilaporkan hilang.',
  },
  {
    to: ROUTES.lapor,
    icon: 'bi-megaphone',
    title: 'Lapor Kejadian',
    text: 'Laporkan longsor di sekitarmu agar cepat ditangani.',
  },
];

const TRIGGERS = ['Hujan deras', 'Gempa bumi', 'Lereng gundul', 'Lereng dipotong'];

const SLIDE_TYPES = [
  {
    name: 'Rotational Slide',
    id: 'Longsor Rotasi',
    text: 'Gerakan massa tanah pada bidang gelincir melengkung berbentuk sendok.',
    img: 'https://www.researchgate.net/publication/361356382/figure/fig1/AS:1167783526178819@1655432697530/Schematic-of-a-rotational-slide-showing-the-main-features-of-a-landslide-Source.png',
  },
  {
    name: 'Translational Slide',
    id: 'Translasi',
    text: 'Massa bergerak pada bidang gelincir lurus atau planar mengikuti kemiringan lereng.',
    img: 'https://cdn-syd.brandkit.com/accounts/23/files/01HQXQ0HTYCJAAM32N1EC6C454/449541-preview.webp?v=63876836009',
  },
  {
    name: 'Block Slide',
    id: 'Longsor Blok',
    text: 'Blok-blok batuan independen meluncur menuruni lereng sebagai kesatuan.',
    img: 'https://cdn-syd.brandkit.com/accounts/23/files/01HQXQ0HPKVN23TAZ2JWDGXZ2B/449528-preview.webp?v=63876836001',
  },
  {
    name: 'Rockfall',
    id: 'Runtuhan Batuan',
    text: 'Jatuhnya batuan secara bebas dari tebing terjal akibat pelapukan dan gaya gravitasi.',
    img: 'https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/media/images/05.%20Rockfall.gif',
  },
  {
    name: 'Topple',
    id: 'Gulingan',
    text: 'Rotasi massa batuan ke depan keluar dari lereng di sekitar titik pivot bawah.',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbemZGWCVuCZnt9nZNGoeGjzBYukRDwD78-zhtl4n8_g&s=10',
  },
  {
    name: 'Earthflow',
    id: 'Aliran Tanah',
    text: 'Material berbutir halus jenuh air mengalir menyerupai cairan kental.',
    img: 'https://www.researchgate.net/profile/J-Wasowski/publication/237757999/figure/fig1/AS:298766256099335@1448242834415/Sketch-showing-earth-flow-morphology-After-Varnes-1978.png',
  },
  {
    name: 'Lateral Spread',
    id: 'Penyebaran Lateral',
    text: 'Peregangan horizontal massa tanah akibat likuifaksi atau getaran gempa.',
    img: 'https://cdn-syd.brandkit.com/accounts/23/files/01HQXQ0H9FHXB2CXM2YXFR2AGR/449500-preview.webp?v=63876836007',
  },
  {
    name: 'Debris Flow',
    id: 'Aliran Rombakan',
    text: 'Aliran cepat campuran lumpur, air, dan bebatuan di alur sungai pegunungan.',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv6uE4JpyED-XTCpFgn0TKFckdYXyfF7EyLfzHXqiBWg&s=10',
  },
  {
    name: 'Debris Avalanche',
    id: 'Runtuhan Rombakan',
    text: 'Longsoran sangat cepat dan masif dari material debris jenuh air di lereng terjal.',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTreFKr-54IMRF2gjoW5LWO9PHlOI8_OvnKz4FJsnUISg&s=10',
  },
  {
    name: 'Creep',
    id: 'Rayapan Tanah',
    text: 'Gerakan lambat tanah menuruni lereng yang hampir tak kasat mata dalam jangka panjang.',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlReWW4eN3VQqozvdGqX8Fo0x4KszpRnANMbEg7hodUg&s=10',
  },
];

const CAUSES = [
  { icon: 'bi-cloud-rain-heavy', title: 'Curah hujan tinggi', text: 'Menambah beban massa lereng dan tekanan pori air.' },
  { icon: 'bi-activity', title: 'Getaran gempa bumi', text: 'Guncangan tektonik yang merusak struktur kestabilan batuan.' },
  { icon: 'bi-tree', title: 'Deforestasi', text: 'Hilangnya akar pohon yang mencengkeram struktur tanah.' },
  { icon: 'bi-bricks', title: 'Potongan lereng', text: 'Konstruksi tanpa sistem terasering atau drainase.' },
];

const IMPACTS = [
  { icon: 'bi-heart-pulse', tone: 'coral', title: 'Manusia & jiwa', text: 'Ancaman keselamatan warga, korban luka, hingga pengungsian.' },
  { icon: 'bi-tree-fill', tone: 'moss', title: 'Lingkungan', text: 'Kerusakan habitat, sedimentasi sungai, dan erosi lahan.' },
  { icon: 'bi-signpost-split', tone: 'gold', title: 'Infrastruktur', text: 'Terputusnya jalan, jaringan listrik, dan fasilitas umum.' },
  { icon: 'bi-graph-down-arrow', tone: 'sand', title: 'Sosial ekonomi', text: 'Kelumpuhan ekonomi lokal dan tingginya biaya pemulihan.' },
];

const STEPS = [
  {
    phase: 'Sebelum',
    icon: 'bi-shield-check',
    title: 'Sebelum bencana',
    items: [
      'Menanam pohon berakar kuat di lereng.',
      'Membuat sistem drainase air yang baik.',
      'Menghindari pembangunan di bawah tebing rawan.',
    ],
  },
  {
    phase: 'Saat',
    icon: 'bi-exclamation-octagon',
    title: 'Saat bencana',
    items: [
      'Segera evakuasi diri ke tempat lebih tinggi.',
      'Waspadai suara gemuruh dan retakan tanah.',
      'Jauhi jalur aliran air atau lembah curam.',
    ],
  },
  {
    phase: 'Setelah',
    icon: 'bi-clipboard-check',
    title: 'Setelah bencana',
    items: [
      'Jangan langsung kembali sebelum dinyatakan aman.',
      'Periksa instalasi listrik dan air.',
      'Laporkan kerusakan dan korban melalui GeoSlide.',
    ],
  },
];

/* ------------------------------------------------------------------
   Ilustrasi hero (SVG buatan sendiri, tanpa foto): punggung bukit
   berlapis, hutan, kabut, dan satu bekas longsor.
------------------------------------------------------------------ */
function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function ridgeY(x, base, amp, seed) {
  return (
    base +
    amp *
      (Math.sin(x * 0.0042 + seed) * 0.5 +
        Math.sin(x * 0.0097 + seed * 2.1) * 0.3 +
        Math.sin(x * 0.021 + seed * 0.7) * 0.2)
  );
}

function ridgePath(base, amp, seed) {
  const points = [];
  for (let x = 0; x <= 1600; x += 20) points.push(`${x},${ridgeY(x, base, amp, seed).toFixed(1)}`);
  return `M0,900 L${points.join(' L')} L1600,900 Z`;
}

function treesPath(base, amp, seed, count, size) {
  const rand = seeded(Math.round(seed * 1000) + 7);
  let d = '';
  for (let i = 0; i < count; i += 1) {
    const x = rand() * 1600;
    const y = ridgeY(x, base, amp, seed) + 6;
    const h = size * (0.7 + rand() * 0.8);
    const w = h * 0.28;
    d += `M${x.toFixed(1)},${(y - h).toFixed(1)} l${w.toFixed(1)},${(h * 0.55).toFixed(1)} h${(-w * 0.45).toFixed(1)} l${(w * 0.8).toFixed(1)},${(h * 0.5).toFixed(1)} h${(-w * 2.7).toFixed(1)} l${(w * 0.8).toFixed(1)},${(-h * 0.5).toFixed(1)} h${(-w * 0.45).toFixed(1)} z `;
  }
  return d;
}

function HeroScene() {
  const scene = useMemo(
    () => ({
      far: ridgePath(560, 70, 1.3),
      mid: ridgePath(640, 90, 3.1),
      near: ridgePath(730, 80, 5.2),
      front: ridgePath(820, 50, 8.4),
      midTrees: treesPath(640, 90, 3.1, 150, 34),
      nearTrees: treesPath(730, 80, 5.2, 120, 52),
      frontTrees: treesPath(820, 50, 8.4, 60, 78),
    }),
    [],
  );

  return (
    <svg
      className="bh-scene"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="bhSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0c1f15" />
          <stop offset="0.45" stopColor="#1d4630" />
          <stop offset="1" stopColor="#4d8a55" />
        </linearGradient>
        <radialGradient id="bhGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f6d98a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f6d98a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bhScar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9b7a52" />
          <stop offset="1" stopColor="#5c4630" />
        </linearGradient>
        <filter id="bhBlur" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="34" />
        </filter>
      </defs>

      <rect width="1600" height="900" fill="url(#bhSky)" />
      <circle cx="1330" cy="190" r="330" fill="url(#bhGlow)" />
      <circle cx="1330" cy="190" r="40" fill="#f8e3a4" opacity="0.92" />

      <g className="bh-layer bh-layer--far">
        <path d={scene.far} fill="#3a7253" opacity="0.8" />
      </g>

      <g className="bh-layer bh-layer--mid">
        <path d={scene.mid} fill="#2a5a41" />
        <path d={scene.midTrees} fill="#1f4833" />
        {/* bekas longsor di punggung tengah */}
        <path
          d="M930,668 C972,704 1010,690 1046,740 C1082,790 1150,796 1204,880 L1010,900 L880,900 C912,826 884,744 930,668 Z"
          fill="url(#bhScar)"
          opacity="0.55"
        />
        <g fill="#6c5238" opacity="0.9">
          <circle cx="1060" cy="812" r="7" />
          <circle cx="1096" cy="838" r="9" />
          <circle cx="1030" cy="846" r="6" />
          <circle cx="1128" cy="858" r="5" />
        </g>
      </g>

      <g className="bh-mist bh-mist--a">
        <ellipse cx="520" cy="700" rx="520" ry="46" fill="#dff0e3" opacity="0.16" filter="url(#bhBlur)" />
      </g>

      <g className="bh-layer bh-layer--near">
        <path d={scene.near} fill="#1c4230" />
        <path d={scene.nearTrees} fill="#14301f" />
      </g>

      <g className="bh-mist bh-mist--b">
        <ellipse cx="1180" cy="780" rx="560" ry="40" fill="#e9f5ec" opacity="0.14" filter="url(#bhBlur)" />
      </g>

      <g className="bh-layer bh-layer--front">
        <path d={scene.front} fill="#0f2819" />
        <path d={scene.frontTrees} fill="#0a1d12" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------
   Kartu angka asli di hero
------------------------------------------------------------------ */
function HeroStat({ label, value }) {
  const shown = useCountUp(value);
  return (
    <div className="bh-hstat">
      <strong>{formatNumber(shown)}</strong>
      <span>{label}</span>
    </div>
  );
}

function HeroStats() {
  const [state, setState] = useState({ loading: true, data: null });

  useEffect(() => {
    const controller = new AbortController();
    getStatistik('all', controller.signal)
      .then((data) => setState({ loading: false, data }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ loading: false, data: null });
      });
    return () => controller.abort();
  }, []);

  const events = state.data?.events;
  const total = useCountUp(events?.total);

  return (
    <aside className="bh-hero__card" aria-label="Ringkasan data kejadian">
      <div className="bh-hero__card-top">
        <span className="bh-live">
          <i aria-hidden="true" /> Data terverifikasi
        </span>
        <span className="bh-hero__card-year">Semua tahun</span>
      </div>

      {state.loading && <div className="bh-skeleton" aria-hidden="true" />}

      {!state.loading && !events && (
        <p className="bh-hero__card-empty">
          Ringkasan belum dapat dimuat. Buka peta untuk melihat kejadian terbaru.
        </p>
      )}

      {events && (
        <>
          <div className="bh-hero__big">
            <strong>{formatNumber(total)}</strong>
            <span>kejadian tanah longsor tercatat</span>
          </div>
          <div className="bh-hero__grid">
            <HeroStat label="Meninggal" value={events.deaths} />
            <HeroStat label="Hilang" value={events.missing} />
            <HeroStat label="Mengungsi" value={events.displaced} />
          </div>
        </>
      )}

      <Link to={ROUTES.statistik} className="bh-hero__card-link">
        Lihat statistik lengkap <i className="bi bi-arrow-right" aria-hidden="true" />
      </Link>
    </aside>
  );
}

/* ------------------------------------------------------------------
   Ilustrasi penampang longsor (bagian "Apa itu")
------------------------------------------------------------------ */
function SlopeIllustration() {
  return (
    <svg
      className="bh-slope"
      viewBox="0 0 520 360"
      role="img"
      aria-label="Penampang lereng: massa tanah bergeser menuruni bidang gelincir"
    >
      <defs>
        <linearGradient id="bhRock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8b8578" />
          <stop offset="1" stopColor="#5f5a50" />
        </linearGradient>
        <linearGradient id="bhSoil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a7a55" />
          <stop offset="1" stopColor="#7a5c3d" />
        </linearGradient>
        <clipPath id="bhMassClip">
          <path d="M150,0 L388,0 L388,360 L150,360 Z" />
        </clipPath>
      </defs>

      {/* batuan dasar */}
      <path d="M0,150 C150,160 270,222 520,318 L520,360 L0,360 Z" fill="url(#bhRock)" />
      {/* tanah di atas bidang gelincir */}
      <path
        d="M0,104 C140,112 260,172 520,266 L520,318 C270,222 150,160 0,150 Z"
        fill="url(#bhSoil)"
      />
      {/* massa yang bergeser (jendela potong ikut bergerak bersama massa) */}
      <g className="bh-slope__mass">
        <g clipPath="url(#bhMassClip)">
          <path
            d="M0,104 C140,112 260,172 520,266 L520,318 C270,222 150,160 0,150 Z"
            fill="url(#bhSoil)"
          />
          <path d="M0,104 C140,112 260,172 520,266 L520,274 C260,180 140,120 0,112 Z" fill="#5d9a3a" />
          <g fill="#2f6a2a">
            <path d="M205,128 l9,-26 l9,26 z" />
            <path d="M246,146 l9,-28 l9,28 z" />
            <path d="M292,168 l8,-24 l8,24 z" />
            <path d="M336,190 l9,-27 l9,27 z" />
          </g>
        </g>
      </g>
      {/* permukaan hijau di luar massa */}
      <path d="M0,104 C140,112 150,114 150,116 L150,124 C140,120 140,120 0,112 Z" fill="#5d9a3a" />
      <path d="M388,214 C440,236 480,252 520,266 L520,274 C480,260 440,244 388,222 Z" fill="#5d9a3a" />
      {/* bidang gelincir */}
      <path
        d="M0,150 C150,160 270,222 520,318"
        fill="none"
        stroke="#ffd36b"
        strokeWidth="3"
        strokeDasharray="7 7"
        strokeLinecap="round"
      />
      {/* hujan */}
      <g className="bh-slope__rain" stroke="#9fd3ff" strokeWidth="2" strokeLinecap="round" opacity="0.8">
        <line x1="60" y1="20" x2="52" y2="42" />
        <line x1="130" y1="8" x2="122" y2="30" />
        <line x1="210" y1="26" x2="202" y2="48" />
        <line x1="300" y1="10" x2="292" y2="32" />
        <line x1="380" y1="28" x2="372" y2="50" />
        <line x1="450" y1="12" x2="442" y2="34" />
      </g>
      <text x="40" y="206" className="bh-slope__label">Batuan dasar</text>
      <text x="304" y="302" className="bh-slope__label bh-slope__label--gold">Bidang gelincir</text>
    </svg>
  );
}

/* ------------------------------------------------------------------
   Kartu jenis longsor (gambar dengan cadangan jika gagal dimuat)
------------------------------------------------------------------ */
function TypeCard({ item, index }) {
  const [failed, setFailed] = useState(false);

  return (
    <article className="bh-type" data-reveal style={{ '--i': index % 5 }}>
      <div className="bh-type__media">
        {!failed ? (
          <img src={item.img} alt={`Ilustrasi ${item.name}`} loading="lazy" onError={() => setFailed(true)} />
        ) : (
          <div className="bh-type__fallback" aria-hidden="true">
            <i className="bi bi-image" />
          </div>
        )}
        <span className="bh-type__no">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="bh-type__body">
        <h3>{item.name}</h3>
        <span className="bh-type__id">{item.id}</span>
        <p>{item.text}</p>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------
   Halaman Beranda
------------------------------------------------------------------ */
export default function Beranda() {
  const { setVariant } = useNavbarVariant();
  const rootRef = useRef(null);
  const heroRef = useRef(null);

  // Navbar melayang transparan di atas hero gelap, kembali solid saat pindah halaman.
  useEffect(() => {
    if (typeof setVariant !== 'function') return undefined;
    setVariant('overlay');
    return () => setVariant('solid');
  }, [setVariant]);

  // Munculkan elemen saat masuk layar.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const targets = Array.from(root.querySelectorAll('[data-reveal]'));

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      targets.forEach((node) => node.classList.add('is-in'));
      return undefined;
    }

    root.classList.add('bh-anim');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    targets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // Parallax ringan pada lapisan bukit.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || prefersReducedMotion()) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.min(window.scrollY, hero.offsetHeight);
      hero.style.setProperty('--sy', y.toFixed(0));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="bh" ref={rootRef}>
      {/* ============ HERO ============ */}
      <section className="bh-hero" ref={heroRef} aria-label="Pengantar GeoSlide">
        <HeroScene />
        <div className="bh-rain" aria-hidden="true" />
        <div className="bh-hero__shade" aria-hidden="true" />

        <div className="container bh-hero__inner">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-7">
              <span className="bh-chip">
                <i className="bi bi-geo-alt-fill" aria-hidden="true" /> Sistem Informasi Bencana Longsor
              </span>
              <h1 className="bh-hero__title">
                Kenali risiko, <span>pantau kejadian</span>, dan siaga di setiap lereng Indonesia.
              </h1>
              <p className="bh-hero__lead">
                Pusat informasi terpadu mitigasi dan pemetaan ancaman tanah longsor: data kejadian terverifikasi,
                statistik, pencarian orang hilang, dan pelaporan darurat dalam satu tempat.
              </p>
              <div className="bh-hero__actions">
                <Link to={ROUTES.peta} className="btn-pill-action">
                  <span>Akses Peta Bencana</span>
                  <span className="btn-pill-action__icon">
                    <i className="bi bi-arrow-right" />
                  </span>
                </Link>
                <Link to={ROUTES.lapor} className="btn-pill-glass">
                  <i className="bi bi-exclamation-triangle" aria-hidden="true" /> Buat Laporan Darurat
                </Link>
              </div>
            </div>

            <div className="col-12 col-lg-5 col-xl-4 offset-xl-1">
              <HeroStats />
            </div>
          </div>
        </div>
      </section>

      {/* ============ AKSES CEPAT ============ */}
      <section className="bh-quick" aria-label="Akses cepat">
        <div className="container">
          <div className="bh-quick__grid">
            {QUICK_LINKS.map((item, index) => (
              <Link key={item.to} to={item.to} className="bh-quick__card" data-reveal style={{ '--i': index }}>
                <span className="bh-quick__icon">
                  <i className={`bi ${item.icon}`} aria-hidden="true" />
                </span>
                <span className="bh-quick__text">
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </span>
                <i className="bi bi-arrow-up-right bh-quick__arrow" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ APA ITU ============ */}
      <section className="bh-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6" data-reveal>
              <span className="bh-eyebrow">Definisi</span>
              <h2 className="bh-title">
                Apa itu bencana <span className="text-accent">tanah longsor</span>?
              </h2>
              <p className="bh-text">
                Tanah longsor adalah perpindahan massa tanah atau batuan menuruni lereng akibat terganggunya
                kestabilan lereng tersebut. Fenomena ini umumnya dipicu oleh curah hujan tinggi, erosi, gempa
                bumi, serta alih fungsi lahan atau aktivitas manusia yang memotong kontur lereng secara tidak
                aman.
              </p>
              <ul className="bh-chips" aria-label="Pemicu utama">
                {TRIGGERS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link to={ROUTES.edukasi} className="bh-link">
                Pelajari lebih lanjut di Edukasi <i className="bi bi-arrow-right" aria-hidden="true" />
              </Link>
            </div>

            <div className="col-12 col-lg-6" data-reveal style={{ '--i': 1 }}>
              <figure className="bh-figure">
                <SlopeIllustration />
                <figcaption>
                  <i className="bi bi-info-circle" aria-hidden="true" /> Saat tanah jenuh air, lapisan di atas
                  bidang gelincir bergeser menuruni lereng.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ============ JENIS-JENIS ============ */}
      <section className="bh-section bh-section--white">
        <div className="container">
          <header className="bh-head" data-reveal>
            <span className="bh-eyebrow">Klasifikasi ilmiah</span>
            <h2 className="bh-title">
              10 jenis <span className="text-accent">pergerakan tanah</span>
            </h2>
            <p className="bh-text bh-text--center">
              Mengenal tipe utama pergerakan massa tanah dan batuan, dari yang cepat dan masif hingga yang nyaris
              tak terlihat.
            </p>
          </header>

          <div className="bh-types">
            {SLIDE_TYPES.map((item, index) => (
              <TypeCard key={item.name} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ PENYEBAB ============ */}
      <section className="bh-section">
        <div className="container">
          <header className="bh-head" data-reveal>
            <span className="bh-eyebrow">Faktor pemicu</span>
            <h2 className="bh-title">
              Apa yang <span className="text-accent">memicu</span> longsor?
            </h2>
            <p className="bh-text bh-text--center">Kombinasi faktor alam dan aktivitas manusia.</p>
          </header>

          <div className="bh-causes">
            {CAUSES.map((item, index) => (
              <article key={item.title} className="bh-cause" data-reveal style={{ '--i': index }}>
                <span className="bh-cause__no">{String(index + 1).padStart(2, '0')}</span>
                <span className="bh-cause__icon">
                  <i className={`bi ${item.icon}`} aria-hidden="true" />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DAMPAK ============ */}
      <section className="bh-impact">
        <div className="container">
          <header className="bh-head bh-head--light" data-reveal>
            <span className="bh-eyebrow bh-eyebrow--light">Risiko &amp; kerusakan</span>
            <h2 className="bh-title">
              Dampak yang <span>ditimbulkan</span>
            </h2>
            <p className="bh-text bh-text--center">Akibat langsung terhadap berbagai sektor kehidupan.</p>
          </header>

          <div className="bh-impact__grid">
            {IMPACTS.map((item, index) => (
              <article key={item.title} className={`bh-impact__card bh-tone--${item.tone}`} data-reveal style={{ '--i': index }}>
                <span className="bh-impact__icon">
                  <i className={`bi ${item.icon}`} aria-hidden="true" />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MITIGASI ============ */}
      <section className="bh-section">
        <div className="container">
          <header className="bh-head" data-reveal>
            <span className="bh-eyebrow">Langkah siaga</span>
            <h2 className="bh-title">
              Mitigasi: <span className="text-accent">sebelum, saat, dan setelah</span>
            </h2>
            <p className="bh-text bh-text--center">Panduan tindakan pra, saat, dan pasca bencana.</p>
          </header>

          <ol className="bh-steps">
            {STEPS.map((step, index) => (
              <li key={step.phase} className="bh-step" data-reveal style={{ '--i': index }}>
                <div className="bh-step__top">
                  <span className="bh-step__no">{index + 1}</span>
                  <span className="bh-step__icon">
                    <i className={`bi ${step.icon}`} aria-hidden="true" />
                  </span>
                </div>
                <h3>{step.title}</h3>
                <ul>
                  {step.items.map((item) => (
                    <li key={item}>
                      <i className="bi bi-check2-circle" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="bh-cta-wrap">
        <div className="container">
          <div className="bh-cta" data-reveal>
            <svg className="bh-cta__art" viewBox="0 0 1200 260" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0,260 L0,170 C150,120 260,200 420,150 C560,105 660,190 820,140 C960,96 1080,150 1200,110 L1200,260 Z" fill="rgba(255,255,255,0.05)" />
              <path d="M0,260 L0,210 C170,170 300,230 470,196 C640,160 740,236 920,190 C1040,160 1130,200 1200,180 L1200,260 Z" fill="rgba(255,255,255,0.07)" />
            </svg>
            <div className="bh-cta__body">
              <h2>Mari kenali risiko &amp; laporkan kejadian</h2>
              <p>Partisipasi aktif warga sangat penting untuk keselamatan bersama di Indonesia.</p>
              <div className="bh-cta__actions">
                <Link to={ROUTES.peta} className="bh-btn-light">
                  Lihat Persebaran <i className="bi bi-arrow-right" aria-hidden="true" />
                </Link>
                <Link to={ROUTES.lapor} className="btn-pill-glass">
                  Buat Laporan
                </Link>
              </div>
            </div>
            <div className="bh-cta__sos" aria-label="Kontak darurat">
              <span>Kontak darurat</span>
              <a href="tel:117">
                <i className="bi bi-telephone" aria-hidden="true" /> BNPB <b>117</b>
              </a>
              <a href="tel:112">
                <i className="bi bi-telephone" aria-hidden="true" /> Darurat <b>112</b>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}