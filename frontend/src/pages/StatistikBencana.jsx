import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import useCountUp from '../hooks/useCountUp';
import shape from '../data/indonesiaShape.json';
import { getKejadian, getStatistik } from '../services/dataBencana';
import './StatistikBencana.css';

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const MONTH_LONG = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const currentYear = String(new Date().getFullYear());

const CELL_SIZE = 0.6; // derajat (~65 km): titik berdekatan digabung jadi satu "bercak"

const mercator = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
/** lat/lng -> koordinat SVG pada siluet Indonesia */
function project(lat, lng) {
  return {
    x: ((lng - shape.lngMin) / (shape.lngMax - shape.lngMin)) * shape.width,
    y: ((shape.yMax - mercator(lat)) / (shape.yMax - shape.yMin)) * shape.height,
  };
}

const numberFormat = new Intl.NumberFormat('id-ID');

function readToken(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function hexToRgb(hex) {
  const match = /^#?([a-f\d]{3}|[a-f\d]{6})$/i.exec(String(hex).trim());
  if (!match) return null;
  let digits = match[1];
  if (digits.length === 3) digits = digits.split('').map((c) => c + c).join('');
  const n = parseInt(digits, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixColor(from, to, t) {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  if (!a || !b) return t < 0.5 ? from : to;
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;
}

/** Hijau (sedikit) -> kuning -> merah (banyak). t = 0..1 */
function heatColor(palette, t) {
  const ratio = Math.min(1, Math.max(0, t));
  return ratio < 0.5
    ? mixColor(palette.low, palette.mid, ratio * 2)
    : mixColor(palette.mid, palette.high, (ratio - 0.5) * 2);
}

/** Peta: hijau -> kuning -> oranye -> merah (4 tahap agar tidak keruh saat bercampur). t = 0..1 */
const MAP_HEAT_STOPS = ['#4FAE3A', '#EFC83A', '#F28C28', '#D7351F'];
function mapHeat(t) {
  const scaled = Math.min(1, Math.max(0, t)) * (MAP_HEAT_STOPS.length - 1);
  const index = Math.min(MAP_HEAT_STOPS.length - 2, Math.floor(scaled));
  return mixColor(MAP_HEAT_STOPS[index], MAP_HEAT_STOPS[index + 1], scaled - index);
}

/** Angka besar di pojok kanan atas papan, dengan pill pendamping. */
function Kpi({ label, value, pill }) {
  const shown = useCountUp(value);
  return (
    <div className="st-kpi">
      <p className="st-kpi__label">{label}</p>
      <p className="st-kpi__value">
        {numberFormat.format(shown)}
        <span className="st-pill">{pill}</span>
      </p>
    </div>
  );
}

/** Bar horizontal: perbandingan meninggal / hilang / luka-luka. */
function CasualtyBars({ deaths, missing, injured }) {
  const total = deaths + missing + injured;
  const shown = useCountUp(total);
  const items = [
    { key: 'high', label: 'Meninggal dunia', value: deaths },
    { key: 'low', label: 'Luka-luka', value: injured },
    { key: 'medium', label: 'Hilang', value: missing },
  ];
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <div className="st-cas">
      <div className="st-cas__total">
        <span className="st-cas__num">{numberFormat.format(shown)}</span>
        <span className="st-cas__cap">Total korban</span>
      </div>
      <ul className="st-cas__list">
        {items.map((item, index) => (
          <li key={item.key} style={{ '--k': index }}>
            <div className="st-cas__row">
              <span className={`st-dot st-dot--${item.key}`} />
              <span className="st-cas__name">{item.label}</span>
              <span className="st-cas__value">{numberFormat.format(item.value)}</span>
              <span className="st-cas__pct">
                {total > 0 ? `${Math.round((item.value / total) * 100)}%` : '0%'}
              </span>
            </div>
            <div className="st-cas__track" aria-hidden="true">
              <span
                className={`st-cas__bar st-cas__bar--${item.key}`}
                style={{ width: `${item.value > 0 ? Math.max(4, (item.value / max) * 100) : 0}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { month, total } = payload[0].payload;
  return (
    <div className="st-tooltip">
      <strong>{MONTH_LONG[month - 1]}</strong>
      <span>{numberFormat.format(total)} kejadian</span>
    </div>
  );
}

/** Kelompokkan kejadian ke sel grid supaya kepadatan per area bisa dihitung. */
function buildCells(events) {
  const cells = new Map();
  events.forEach((event) => {
    const lat = Number(event.latitude);
    const lng = Number(event.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const key = `${Math.floor(lat / CELL_SIZE)}:${Math.floor(lng / CELL_SIZE)}`;
    const cell = cells.get(key) || { count: 0, lat: 0, lng: 0, names: {} };
    cell.count += 1;
    cell.lat += lat;
    cell.lng += lng;
    const name = event.regency || event.province || 'Wilayah';
    cell.names[name] = (cell.names[name] || 0) + 1;
    cells.set(key, cell);
  });

  return [...cells.values()]
    .map((cell) => ({
      count: cell.count,
      lat: cell.lat / cell.count,
      lng: cell.lng / cell.count,
      name: Object.entries(cell.names).sort((a, b) => b[1] - a[1])[0][0],
    }))
    .sort((a, b) => a.count - b.count); // yang paling padat digambar paling atas
}

/** Siluet pulau Indonesia dengan heat hijau -> merah di dalamnya. */
function IndonesiaHeatMap({ events }) {
  const cells = useMemo(() => buildCells(events), [events]);
  const [hover, setHover] = useState(null);
  const max = Math.max(1, ...cells.map((cell) => cell.count));

  const blobs = cells.map((cell) => {
    const t = Math.pow(cell.count / max, 0.8);
    return { ...cell, ...project(cell.lat, cell.lng), t, color: mapHeat(t) };
  });

  return (
    <div className="st-ina" onMouseLeave={() => setHover(null)}>
      <svg
        viewBox={`0 0 ${shape.width} ${shape.height}`}
        role="img"
        aria-label="Peta sebaran kejadian longsor di Indonesia"
      >
        <defs>
          <clipPath id="stLand"><path d={shape.d} /></clipPath>
          <filter id="stBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        <path className="st-ina__land" d={shape.d} />

        <g clipPath="url(#stLand)">
          <g filter="url(#stBlur)">
            {blobs.map((blob) => (
              <circle
                key={`${blob.lat}-${blob.lng}`}
                className="st-ina__blob"
                cx={blob.x}
                cy={blob.y}
                r={26 + blob.t * 30}
                fill={blob.color}
                fillOpacity={0.85}
              />
            ))}
          </g>
        </g>

        {blobs.map((blob) => (
          <g key={`dot-${blob.lat}-${blob.lng}`}>
            <circle className="st-ina__dot" cx={blob.x} cy={blob.y} r={3.2} />
            <circle
              className="st-ina__hit"
              cx={blob.x}
              cy={blob.y}
              r={14}
              tabIndex={0}
              onMouseEnter={() => setHover(blob)}
              onFocus={() => setHover(blob)}
              onClick={() => setHover(blob)}
              onBlur={() => setHover(null)}
            />
          </g>
        ))}
      </svg>

      {hover && (
        <div
          className="st-tooltip st-ina__tip"
          style={{
            left: `${(hover.x / shape.width) * 100}%`,
            top: `${(hover.y / shape.height) * 100}%`,
          }}
        >
          <strong>{hover.name}</strong>
          <span>{numberFormat.format(hover.count)} kejadian di sekitar area ini</span>
        </div>
      )}
    </div>
  );
}

/** Kartu peringkat 1-3: angka besar, porsi terhadap total, warna sesuai skala peta. */
function RegionPodium({ region, rank, max, total }) {
  const shown = useCountUp(region.total);
  const t = Math.pow(region.total / max, 0.8);
  const share = total ? Math.round((region.total / total) * 100) : 0;
  return (
    <article className={`st-podium st-podium--${rank}`} style={{ '--tone': mapHeat(t), '--i': rank }}>
      <span className="st-podium__rank" aria-hidden="true">{String(rank).padStart(2, '0')}</span>
      <p className="st-podium__badge">Peringkat {rank}</p>
      <h4 className="st-podium__name">{region.regency}</h4>
      <p className="st-podium__prov">{region.province}</p>
      <p className="st-podium__count">
        <span>{numberFormat.format(shown)}</span> kejadian
      </p>
      <div className="st-podium__track" aria-hidden="true">
        <span style={{ width: `${Math.max(6, (region.total / max) * 100)}%` }} />
      </div>
      <p className="st-podium__share">{share}% dari seluruh kejadian</p>
    </article>
  );
}

function StatsSkeleton() {
  return (
    <div className="st-skeleton" aria-hidden="true">
      <div className="row g-3 g-xl-4 mb-3 mb-xl-4">
        <div className="col-12 col-xl-5"><div className="st-card st-skel st-skel--tall" /></div>
        <div className="col-12 col-xl-7"><div className="st-card st-skel st-skel--tall" /></div>
      </div>
      <div className="st-card st-skel st-skel--wide" />
    </div>
  );
}

export default function StatistikBencana() {
  const [year, setYear] = useState(currentYear);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [events, setEvents] = useState([]);
  const [eventsMore, setEventsMore] = useState(false);
  const [eventsFailed, setEventsFailed] = useState(false);

  const colors = useMemo(
    () => ({
      primary: readToken('--primary', '#3F7A1A'),
      muted: readToken('--muted', '#6B6B66'),
      border: readToken('--border', '#E2E0DA'),
      low: readToken('--impact-low', '#3F7A1A'),
      mid: readToken('--impact-medium', '#C98A1B'),
      high: readToken('--impact-high', '#C2410C'),
    }),
    [],
  );
  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    getStatistik(year, controller.signal)
      .then((data) => {
        setStatistics(data);
        setError('');
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Statistik gagal dimuat.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [year, reloadKey]);

  useEffect(() => {
    const controller = new AbortController();
    setEventsFailed(false);

    getKejadian({ year, search: '' }, controller.signal)
      .then((result) => {
        setEvents(result.data || []);
        setEventsMore(Boolean(result.hasMore));
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setEventsFailed(true);
      });

    return () => controller.abort();
  }, [year, reloadKey]);

  const availableYears = [
    ...new Set([currentYear, ...(statistics?.availableYears || []).map(String)]),
  ].sort((a, b) => Number(b) - Number(a));

  const monthlyEvents = statistics?.monthlyEvents || [];
  const chartData = useMemo(
    () =>
      MONTH_SHORT.map((label, index) => {
        const found = monthlyEvents.find((item) => Number(item.month) === index + 1);
        return { month: index + 1, label, total: found ? Number(found.total) : 0 };
      }),
    [monthlyEvents],
  );
  const peak = chartData.reduce((best, item) => (item.total > best.total ? item : best), {
    total: 0,
    month: 0,
    label: '',
  });

  const topRegions = statistics?.topRegions || [];
  const topMax = Math.max(1, ...topRegions.map((region) => region.total));
  const eventsTotal = statistics?.events?.total || 0;
  const topSum = topRegions.reduce((sum, region) => sum + region.total, 0);
  const topShare = eventsTotal ? Math.round((topSum / eventsTotal) * 100) : 0;
  const leaderShare = eventsTotal && topRegions[0] ? Math.round((topRegions[0].total / eventsTotal) * 100) : 0;

  const periodLabel = year === 'all' ? 'Seluruh periode kejadian' : `Periode kejadian ${year}`;
  const showSkeleton = loading && !statistics;

  const handleYearChange = (event) => {
    setLoading(true);
    setError('');
    setYear(event.target.value);
  };

  return (
    <>
      <PageHeader
        badge="Ringkasan dari data terverifikasi"
        title="Statistik Kejadian Tanah Longsor"
        subtitle="Jumlah kejadian dan dampak dihitung dari data GeoSlide yang telah diverifikasi."
        icon="bi-bar-chart-line"
      />

      <Section bg="subtle" py="md">
        <div className="st-board">
          <header className="st-board__head">
            <div className="st-board__intro">
              <h2 className="st-board__title">Ringkasan data</h2>
              <p className="gs-text-muted mb-3" aria-live="polite">{periodLabel}</p>
              <div className="st-year">
                <label className="visually-hidden" htmlFor="statistics-year">Periode kejadian</label>
                <select
                  id="statistics-year"
                  className="form-select"
                  value={year}
                  onChange={handleYearChange}
                >
                  <option value="all">Semua tahun</option>
                  {availableYears.map((availableYear) => (
                    <option key={availableYear} value={availableYear}>{availableYear}</option>
                  ))}
                </select>
              </div>
            </div>

            {statistics && (
              <div className={`st-kpis${loading ? ' is-loading' : ''}`}>
                <Kpi
                  label="Kejadian terverifikasi"
                  value={statistics.events.total}
                  pill={`${numberFormat.format(statistics.events.affectedRegions)} kab/kota`}
                />
                <Kpi
                  label="Mengungsi"
                  value={statistics.events.displaced}
                  pill={`${numberFormat.format(statistics.events.housesDamaged)} rumah rusak`}
                />
                <Kpi
                  label="Laporan orang hilang"
                  value={statistics.missingPersons.approvedReports}
                  pill={`${numberFormat.format(statistics.missingPersons.searching)} dicari`}
                />
              </div>
            )}
          </header>

          {error && (
            <div className="st-error" role="alert">
              <span>{error}</span>
              <button
                type="button"
                className="btn-pill btn-pill-surface"
                onClick={() => {
                  setLoading(true);
                  setError('');
                  setReloadKey((key) => key + 1);
                }}
              >
                Coba lagi
              </button>
            </div>
          )}

          {showSkeleton && <StatsSkeleton />}

          {statistics && (
            <div className={`st-body${loading ? ' is-loading' : ''}`} aria-busy={loading}>
              <div className="row g-3 g-xl-4 mb-3 mb-xl-4">
                <div className="col-12 col-xl-5">
                  <section className="st-card" style={{ '--i': 0 }} aria-labelledby="casualty-title">
                    <h3 id="casualty-title" className="st-card__title">Korban jiwa &amp; terdampak</h3>
                    <p className="st-card__sub">Proporsi korban dari kejadian terverifikasi.</p>
                    <CasualtyBars
                      deaths={statistics.events.deaths}
                      missing={statistics.events.missing}
                      injured={statistics.events.injured}
                    />
                  </section>
                </div>

                <div className="col-12 col-xl-7">
                  <section className="st-card" style={{ '--i': 1 }} aria-labelledby="monthly-title">
                    <div className="st-card__bar">
                      <div>
                        <h3 id="monthly-title" className="st-card__title">Tren kejadian per bulan</h3>
                        <p className="st-card__sub">
                          {year === 'all'
                            ? 'Jumlah gabungan setiap bulan di seluruh periode.'
                            : `Jumlah kejadian selama ${year}.`}
                        </p>
                      </div>
                      {peak.total > 0 && (
                        <span className="st-chip">
                          Puncak: {MONTH_LONG[peak.month - 1]} · {numberFormat.format(peak.total)}
                        </span>
                      )}
                    </div>

                    <div
                      className="st-chart"
                      role="img"
                      aria-label={`Grafik tren bulanan, total ${numberFormat.format(statistics.events.total)} kejadian`}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 12, right: 8, left: -14, bottom: 0 }}>
                          <defs>
                            <linearGradient id="stLine" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={colors.high} />
                              <stop offset="50%" stopColor={colors.mid} />
                              <stop offset="100%" stopColor={colors.low} />
                            </linearGradient>
                            <linearGradient id="stFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={colors.high} stopOpacity={0.34} />
                              <stop offset="50%" stopColor={colors.mid} stopOpacity={0.2} />
                              <stop offset="100%" stopColor={colors.low} stopOpacity={0.04} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid vertical={false} stroke={colors.border} strokeDasharray="3 5" />
                          <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: colors.muted, fontSize: 12 }}
                            interval={0}
                          />
                          <YAxis
                            allowDecimals={false}
                            tickLine={false}
                            axisLine={false}
                            width={40}
                            tick={{ fill: colors.muted, fontSize: 12 }}
                          />
                          <Tooltip
                            cursor={{ stroke: colors.muted, strokeDasharray: '4 4' }}
                            content={<ChartTooltip />}
                          />
                          <Area
                            type="monotone"
                            dataKey="total"
                            stroke="url(#stLine)"
                            strokeWidth={3}
                            fill="url(#stFill)"
                            activeDot={(dot) => (
                              <circle
                                key={dot.index}
                                cx={dot.cx}
                                cy={dot.cy}
                                r={6}
                                fill="#fff"
                                stroke={heatColor(colors, peak.total ? dot.payload.total / peak.total : 0)}
                                strokeWidth={3}
                              />
                            )}
                            isAnimationActive={!reduceMotion}
                            animationDuration={1100}
                            animationEasing="ease-out"
                          />
                          {peak.total > 0 && (
                            <ReferenceDot
                              x={peak.label}
                              y={peak.total}
                              r={6}
                              fill="#fff"
                              stroke={colors.high}
                              strokeWidth={3}
                              ifOverflow="extendDomain"
                            />
                          )}
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="st-scale" aria-hidden="true">
                      <span>Sedikit</span>
                      <span className="st-scale__bar" />
                      <span>Banyak</span>
                    </div>
                  </section>
                </div>
              </div>

              <section className="st-card st-card--map mb-3 mb-xl-4" style={{ '--i': 2 }} aria-labelledby="map-title">
                    <h3 id="map-title" className="st-card__title">Peta sebaran kejadian</h3>
                    <p className="st-card__sub">
                      Warna menunjukkan jumlah kejadian tercatat di sekitar area: hijau sedikit, merah banyak.
                    </p>
                    {eventsFailed ? (
                      <p className="gs-text-muted mb-0">Peta sebaran gagal dimuat.</p>
                    ) : (
                      <div className="st-map-wrap">
                        <IndonesiaHeatMap events={events} />
                      </div>
                    )}
                    <div className="st-scale" aria-hidden="true">
                      <span>Sedikit</span>
                      <span className="st-scale__bar st-scale__bar--map" />
                      <span>Banyak</span>
                    </div>
                    <p className="st-map-note">
                      Berdasarkan kejadian yang tercatat, bukan prakiraan kerentanan. Hijau muda di dalam pulau berarti belum ada atau sedikit kejadian tercatat, bukan berarti aman.
                      {eventsMore && ' Peta menampilkan sebagian data kejadian.'}
                    </p>
                  </section>

              <section className="st-card" style={{ '--i': 3 }} aria-labelledby="regions-title">
                <h3 id="regions-title" className="st-card__title">Wilayah dengan kejadian terbanyak</h3>
                <p className="st-card__sub">Sepuluh kabupaten/kota teratas dalam periode terpilih.</p>

                {topRegions.length ? (
                  <>
                    <p className="st-insight">
                      <strong>{topRegions[0].regency}</strong> mencatat <strong>{leaderShare}%</strong> dari seluruh
                      kejadian. {numberFormat.format(topRegions.length)} dari{' '}
                      {numberFormat.format(statistics.events.affectedRegions)} kabupaten/kota terdampak menyumbang{' '}
                      <strong>{topShare}%</strong> dari {numberFormat.format(eventsTotal)} kejadian.
                    </p>

                    <div className="st-top3">
                      {topRegions.slice(0, 3).map((region, index) => (
                        <RegionPodium
                          key={`${region.province}-${region.regency}`}
                          region={region}
                          rank={index + 1}
                          max={topMax}
                          total={eventsTotal}
                        />
                      ))}
                    </div>

                    {topRegions.length > 3 && (
                      <ol className="st-tail" start={4} style={{ '--rows': Math.ceil((topRegions.length - 3) / 2) }}>
                        {topRegions.slice(3).map((region, index) => {
                          const t = Math.pow(region.total / topMax, 0.8);
                          const share = eventsTotal ? Math.round((region.total / eventsTotal) * 100) : 0;
                          return (
                            <li
                              className="st-tail__item"
                              key={`${region.province}-${region.regency}`}
                              style={{ '--i': index, '--tone': mapHeat(t) }}
                            >
                              <span className="st-tail__no">{index + 4}</span>
                              <div className="st-tail__main">
                                <div className="st-tail__top">
                                  <span className="st-tail__name">{region.regency}</span>
                                  <span className="st-tail__total">
                                    {numberFormat.format(region.total)}
                                    <small>{share}%</small>
                                  </span>
                                </div>
                                <span className="st-tail__prov">{region.province}</span>
                                <div className="st-tail__track" aria-hidden="true">
                                  <span style={{ width: `${Math.max(5, (region.total / topMax) * 100)}%` }} />
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    )}
                  </>
                ) : (
                  <p className="gs-text-muted mb-0">Belum ada data kejadian terverifikasi pada periode ini.</p>
                )}
              </section>

              <p className="small gs-text-muted mt-3 mb-0">
                Statistik laporan orang hilang menghitung laporan yang disetujui dan mencakup seluruh periode, tidak mengikuti filter tahun kejadian. Data dampak kejadian mengikuti periode yang dipilih.
              </p>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}