import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, ZoomControl, useMap } from 'react-leaflet';
import PageHeader from '../components/PageHeader';
import YearSelect from '../components/YearSelect';
import Section from '../components/Section';
import useCountUp from '../hooks/useCountUp';
import { getKejadian } from '../services/dataBencana';
import 'leaflet/dist/leaflet.css';
import './PetaBencana.css';

const INITIAL_FILTERS = { year: 'all', search: '' };

// Zoom otomatis: saat titik diklik atau hasil pencarian hanya satu (FOCUS_ZOOM),
// dan batas zoom maksimum saat beberapa hasil dipas ke layar (FIT_MAX_ZOOM).
const FOCUS_ZOOM = 10;
const FIT_MAX_ZOOM = 10;

// Batas geser peta: [selatan-barat, utara-timur] — mencakup Sabang sampai Merauke
const INDONESIA_BOUNDS = [
  [-13, 93],
  [8, 143],
];
const TILE_URL ='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const LEVELS = {
  low: { label: 'Rendah' },
  mid: { label: 'Sedang' },
  high: { label: 'Tinggi' },
};

// Tanggal dari API berupa ISO UTC (mis. 2026-11-02T17:00:00.000Z = 3 November WIB),
// jadi diformat dengan zona waktu Asia/Jakarta agar tidak mundur satu hari.
const longDate = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' });
const shortDate = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
});

function formatDate(value, formatter = longDate) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : formatter.format(date);
}

function formatNumber(value) {
  return (Number(value) || 0).toLocaleString('id-ID');
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Tingkat dampak dihitung dari korban meninggal + hilang.
function getImpact(event) {
  const victims = (Number(event.deaths) || 0) + (Number(event.missing) || 0);
  const level = victims >= 5 ? 'high' : victims >= 1 ? 'mid' : 'low';
  const size = Math.round(Math.min(14 + Math.sqrt(victims) * 4.5, 34));
  return { victims, level, size };
}

function buildIcon(level, size, delay) {
  return L.divIcon({
    className: 'gs-marker',
    html: `<span class="gs-dot gs-dot--${level}" style="--s:${size}px;--d:${delay}ms"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

// ---------- Panel melayang di atas peta ----------
// Panel filter, daftar, legenda, dan tombol zoom menutupi sebagian peta. Fungsi di bawah
// mengukur panel yang benar-benar menimpa peta (di mobile panel ada di luar peta, jadi diabaikan)
// supaya popup dan "pas ke semua titik" tidak berakhir di bawah panel.
const OVERLAY_SELECTOR = '.gs-map-filter, .gs-map-list, .gs-map-legend, .gs-map-toggle, .leaflet-control-zoom';
const EDGE_GAP = 12;
const ATTRIBUTION_SPACE = 36;

function getObstacles(map) {
  const stage = map.getContainer().getBoundingClientRect();
  const root = map.getContainer().closest('.gs-map-shell') || document;
  return Array.from(root.querySelectorAll(OVERLAY_SELECTOR))
    .map((node) => node.getBoundingClientRect())
    .filter(
      (rect) =>
        rect.width > 0 &&
        rect.height > 0 &&
        rect.right > stage.left &&
        rect.left < stage.right &&
        rect.bottom > stage.top &&
        rect.top < stage.bottom,
    );
}

function overlaps(a, b, gap) {
  return (
    a.left < b.right + gap && a.right > b.left - gap && a.top < b.bottom + gap && a.bottom > b.top - gap
  );
}

// Menghitung berapa piksel popup (beserta marker-nya) harus digeser agar utuh, di dalam peta,
// dan tidak tertimpa panel. Mengembalikan [dx, dy] dalam arah layar.
function computePopupShift(map, popup) {
  const element = popup.getElement();
  if (!element) return [0, 0];

  const stage = map.getContainer().getBoundingClientRect();
  const parts = [element.getBoundingClientRect()];
  const markerEl = popup._source?.getElement?.();
  if (markerEl) parts.push(markerEl.getBoundingClientRect());

  const box = {
    left: Math.min(...parts.map((p) => p.left)),
    top: Math.min(...parts.map((p) => p.top)),
    right: Math.max(...parts.map((p) => p.right)),
    bottom: Math.max(...parts.map((p) => p.bottom)),
  };
  const safe = {
    left: stage.left + EDGE_GAP,
    top: stage.top + EDGE_GAP,
    right: stage.right - EDGE_GAP,
    bottom: stage.bottom - ATTRIBUTION_SPACE,
  };
  const obstacles = getObstacles(map);
  const inside = (b) =>
    b.left >= safe.left && b.top >= safe.top && b.right <= safe.right && b.bottom <= safe.bottom;
  const moved = (b, dx, dy) => ({
    left: b.left + dx,
    top: b.top + dy,
    right: b.right + dx,
    bottom: b.bottom + dy,
  });

  let dx = 0;
  let dy = 0;
  for (let pass = 0; pass < 4; pass += 1) {
    const current = moved(box, dx, dy);
    const blocker = obstacles.find((rect) => overlaps(current, rect, EDGE_GAP));
    if (!blocker) break;

    const options = [
      [0, blocker.bottom + EDGE_GAP - current.top], // turun di bawah panel
      [0, blocker.top - EDGE_GAP - current.bottom], // naik di atas panel
      [blocker.right + EDGE_GAP - current.left, 0], // geser ke kanan panel
      [blocker.left - EDGE_GAP - current.right, 0], // geser ke kiri panel
    ]
      .filter(([ox, oy]) => inside(moved(current, ox, oy)))
      .sort((a, b) => Math.abs(a[0]) + Math.abs(a[1]) - (Math.abs(b[0]) + Math.abs(b[1])));

    if (options.length === 0) break;
    dx += options[0][0];
    dy += options[0][1];
  }

  // Terakhir, pastikan tetap di dalam tepi peta.
  const final = moved(box, dx, dy);
  if (final.left < safe.left) dx += safe.left - final.left;
  else if (final.right > safe.right) dx -= final.right - safe.right;
  if (final.top < safe.top) dy += safe.top - final.top;
  else if (final.bottom > safe.bottom) dy -= final.bottom - safe.bottom;

  return [Math.round(dx), Math.round(dy)];
}

// Padding untuk "pas ke semua titik" agar titik tidak berada di bawah panel daftar / filter.
function getFitPadding(map) {
  const stage = map.getContainer().getBoundingClientRect();
  let top = 70;
  let right = 70;
  let bottom = 70;
  let left = 70;
  getObstacles(map).forEach((rect) => {
    if (rect.width > stage.width * 0.7) return; // panel selebar peta diabaikan
    const centerX = (rect.left + rect.right) / 2 - stage.left;
    if (rect.height > stage.height * 0.5 && centerX > stage.width / 2) {
      right = Math.max(right, stage.right - rect.left + EDGE_GAP * 2); // daftar di kanan
    } else if (rect.top - stage.top < stage.height * 0.4 && centerX < stage.width / 2) {
      top = Math.max(top, rect.bottom - stage.top + EDGE_GAP * 2); // filter di kiri atas
    }
  });
  return { paddingTopLeft: [left, top], paddingBottomRight: [right, bottom] };
}

// Mengatur kamera peta: menyesuaikan batas saat filter berubah dan terbang ke kejadian terpilih.
function MapController({ focus, fitFor, points, markerRefs }) {
  const map = useMap();

  // Menjaga popup tetap utuh: batas geser peta dilonggarkan selama popup terbuka
  // (kalau tidak, peta dikembalikan ke batas Indonesia dan popup tetap terpotong),
  // lalu popup digeser ke area peta yang tidak tertutup panel.
  useEffect(() => {
    let restoreTimer;
    let pending = false;
    let moving = false; // peta sedang bergerak (terbang/geser): tunggu sampai berhenti

    const keepVisible = () => {
      const popup = map._popup;
      if (!pending || moving || !popup || !map.hasLayer(popup)) return;
      pending = false;
      const [dx, dy] = computePopupShift(map, popup);
      if (dx || dy) {
        map.panBy([-dx, -dy], { animate: !prefersReducedMotion(), duration: 0.35 });
      }
    };

    const handleOpen = () => {
      window.clearTimeout(restoreTimer);
      map.setMaxBounds(null);
      pending = true;
      requestAnimationFrame(() => requestAnimationFrame(keepVisible));
    };

    const handleClose = () => {
      pending = false;
      window.clearTimeout(restoreTimer);
      restoreTimer = window.setTimeout(() => map.setMaxBounds(INDONESIA_BOUNDS), 150);
    };

    const handleMoveStart = () => {
      moving = true;
    };

    const handleMoveEnd = () => {
      moving = false;
      keepVisible();
    };

    map.on('popupopen', handleOpen);
    map.on('popupclose', handleClose);
    map.on('movestart', handleMoveStart);
    map.on('moveend', handleMoveEnd);
    return () => {
      window.clearTimeout(restoreTimer);
      map.off('popupopen', handleOpen);
      map.off('popupclose', handleClose);
      map.off('movestart', handleMoveStart);
      map.off('moveend', handleMoveEnd);
    };
  }, [map]);

  useEffect(() => {
    if (!fitFor || points.length === 0) return undefined;
    const reduceMotion = prefersReducedMotion();

    // Satu hasil (mis. pencarian spesifik): zoom dekat ke titik itu lalu buka popup-nya.
    if (points.length === 1) {
      const only = points[0];
      const target = [only.latitude, only.longitude];
      const openPopup = () => {
        const marker = markerRefs.current.get(only.id);
        if (marker?.getElement()) marker.openPopup();
      };

      if (map.getCenter().distanceTo(target) < 50 && map.getZoom() >= FOCUS_ZOOM) {
        openPopup();
        return undefined;
      }

      map.once('moveend', openPopup);
      if (reduceMotion) {
        map.setView(target, FOCUS_ZOOM, { animate: false });
        setTimeout(openPopup, 0);
      } else {
        map.flyTo(target, FOCUS_ZOOM, { duration: 1.2 });
      }
      return () => map.off('moveend', openPopup);
    }

    // Beberapa hasil: pas ke semua titik.
    const bounds = L.latLngBounds(points.map((point) => [point.latitude, point.longitude]));
    const options = { ...getFitPadding(map), maxZoom: FIT_MAX_ZOOM };
    if (reduceMotion) {
      map.fitBounds(bounds, { ...options, animate: false });
    } else {
      map.flyToBounds(bounds, { ...options, duration: 1.1 });
    }
    return undefined;
    // Hanya dijalankan saat filter yang diterapkan berubah.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitFor, map]);

  useEffect(() => {
    if (!focus) return undefined;
    const { event } = focus;
    const target = [event.latitude, event.longitude];
    const zoom = Math.max(map.getZoom(), FOCUS_ZOOM);
    const openPopup = () => markerRefs.current.get(event.id)?.openPopup();

    const alreadyThere = map.getCenter().distanceTo(target) < 50 && map.getZoom() >= zoom;
    if (alreadyThere) {
      openPopup();
      return undefined;
    }

    map.once('moveend', openPopup);
    if (prefersReducedMotion()) {
      map.setView(target, zoom, { animate: false });
    } else {
      map.flyTo(target, zoom, { duration: 1.2 });
    }
    return () => map.off('moveend', openPopup);
  }, [focus, map, markerRefs]);

  return null;
}

function EventPopup({ event, impact }) {
  const location = [event.regency, event.province].filter(Boolean).join(', ');

  return (
    <div className="gs-popup">
      <div className="gs-popup__head">
        <span className={`gs-popup__badge gs-popup__badge--${impact.level}`}>
          Dampak {LEVELS[impact.level].label.toLowerCase()}
        </span>
        <span className="gs-popup__date">{formatDate(event.event_date)}</span>
      </div>
      <strong className="gs-popup__title">{event.title || 'Tanah longsor'}</strong>
      {location && <span className="gs-popup__loc">{location}</span>}

      <div className="gs-popup__stats">
        <div className="gs-popup__stat"><strong>{formatNumber(event.deaths)}</strong><span>Meninggal</span></div>
        <div className="gs-popup__stat"><strong>{formatNumber(event.missing)}</strong><span>Hilang</span></div>
        <div className="gs-popup__stat"><strong>{formatNumber(event.injured)}</strong><span>Luka</span></div>
        <div className="gs-popup__stat"><strong>{formatNumber(event.displaced)}</strong><span>Mengungsi</span></div>
      </div>

      {Number(event.houses_damaged) > 0 && (
        <div className="gs-popup__row">Rumah rusak: {formatNumber(event.houses_damaged)}</div>
      )}
      {event.description && <div className="gs-popup__desc">{event.description}</div>}
      {event.source_note && (
        <div className="gs-popup__note gs-popup__note--source" title={event.source_note}>
          Sumber: {event.source_note}
        </div>
      )}
      <div className="gs-popup__note">Lokasi perkiraan tingkat kabupaten/kota</div>
    </div>
  );
}

export default function PetaBencana() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);
  const [result, setResult] = useState({
    data: [],
    count: 0,
    hasMore: false,
    availableYears: [],
    fitFor: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [focus, setFocus] = useState(null);
  const [listOpen, setListOpen] = useState(true);

  const markerRefs = useRef(new Map());
  const itemRefs = useRef(new Map());
  const listRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    getKejadian(appliedFilters, controller.signal)
      .then((payload) => {
        setResult({
          data: [],
          count: 0,
          hasMore: false,
          availableYears: [],
          ...payload,
          fitFor: appliedFilters,
        });
        setError('');
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [appliedFilters, reloadKey]);

  const availableYears = useMemo(
    () =>
      [...new Set((result.availableYears || []).map(Number))]
        .filter(Number.isFinite)
        .sort((a, b) => b - a),
    [result.availableYears],
  );
  const yearIsMissing = filters.year !== 'all' && !availableYears.includes(Number(filters.year));

  const markers = useMemo(
    () =>
      (result.data || []).flatMap((raw, index) => {
        const latitude = Number(raw.latitude);
        const longitude = Number(raw.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return [];
        const event = { ...raw, latitude, longitude };
        const impact = getImpact(event);
        return [{ event, impact, icon: buildIcon(impact.level, impact.size, Math.min(index * 10, 700)) }];
      }),
    [result.data],
  );

  const points = useMemo(() => markers.map((marker) => marker.event), [markers]);

  const listItems = useMemo(
    () =>
      [...markers].sort((a, b) => {
        const byDate = new Date(b.event.event_date) - new Date(a.event.event_date);
        return byDate || b.impact.victims - a.impact.victims;
      }),
    [markers],
  );

  const totals = useMemo(
    () =>
      markers.reduce(
        (sum, { event }) => ({
          deaths: sum.deaths + (Number(event.deaths) || 0),
          missing: sum.missing + (Number(event.missing) || 0),
        }),
        { deaths: 0, missing: 0 },
      ),
    [markers],
  );

  const shownCount = useCountUp(markers.length);
  const shownDeaths = useCountUp(totals.deaths);
  const shownMissing = useCountUp(totals.missing);

  // Menandai marker terpilih tanpa membuat ulang ikon (agar animasi tidak terulang).
  useEffect(() => {
    markerRefs.current.forEach((marker, id) => {
      marker.getElement()?.classList.toggle('is-selected', id === selectedId);
    });
  }, [selectedId, markers]);

  // Hanya satu hasil: tandai di daftar (peta zoom otomatis lewat MapController).
  useEffect(() => {
    if (markers.length === 1) setSelectedId(markers[0].event.id);
  }, [markers]);

  // Menggulung daftar ke item terpilih.
  useEffect(() => {
    if (selectedId == null) return;
    const list = listRef.current;
    const item = itemRefs.current.get(selectedId);
    if (!list || !item) return;
    const top = item.offsetTop - list.clientHeight / 2 + item.clientHeight / 2;
    list.scrollTo({ top: Math.max(top, 0), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [selectedId]);

  function applyFilters(next) {
    setLoading(true);
    setError('');
    setSelectedId(null);
    setAppliedFilters({ ...next, search: next.search.trim() });
  }

  function handleSubmit(event) {
    event.preventDefault();
    applyFilters(filters);
  }

  function handleYearChange(event) {
    const next = { ...filters, year: event.target.value };
    setFilters(next);
    applyFilters(next);
  }

  function handleReload() {
    setLoading(true);
    setError('');
    setReloadKey((key) => key + 1);
  }

  function handleSelect(event, { scroll = true } = {}) {
    setSelectedId(event.id);
    setFocus({ event });
    if (scroll && window.matchMedia('(max-width: 991.98px)').matches) {
      stageRef.current?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'center',
      });
    }
  }

  const showEmpty = !loading && !error && markers.length === 0;

  return (
    <>
      <PageHeader
        badge="Data Kejadian Terverifikasi"
        title="Peta Kejadian Tanah Longsor"
        highlight="Tanah Longsor"
        subtitle="Jelajahi titik kejadian yang tercatat. Lokasi pada peta mewakili kabupaten/kota, bukan koordinat longsor yang presisi."
        icon="bi-map"
      />

      <Section bg="subtle" py="md">
        <div className="gs-map-shell">
          <div
            className="gs-map-stage"
            ref={stageRef}
            role="region"
            aria-label="Peta kejadian tanah longsor Indonesia"
          >
            <MapContainer
              className="gs-map"
              center={[-2.5, 118]}
              zoom={5}
              minZoom={5}
              maxBounds={INDONESIA_BOUNDS}
              maxBoundsViscosity={1}
              zoomControl={false}
              scrollWheelZoom
            >
              <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} maxZoom={19} className="gs-map-tiles" />
              <ZoomControl position="bottomleft" />
              <MapController
                focus={focus}
                fitFor={result.fitFor}
                points={points}
                markerRefs={markerRefs}
              />

              {markers.map(({ event, impact, icon }) => (
                <Marker
                  key={event.id}
                  position={[event.latitude, event.longitude]}
                  icon={icon}
                  ref={(marker) => {
                    if (marker) markerRefs.current.set(event.id, marker);
                    else markerRefs.current.delete(event.id);
                  }}
                  eventHandlers={{
                    click: () => handleSelect(event, { scroll: false }),
                    popupopen: (leafletEvent) => leafletEvent.target.closeTooltip(),
                    popupclose: () =>
                      setSelectedId((current) => (current === event.id ? null : current)),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -impact.size / 2]} className="gs-tooltip">
                    {event.regency || event.province || event.title}
                  </Tooltip>
                  <Popup minWidth={250} maxWidth={300} autoPan={false}>
                    <EventPopup event={event} impact={impact} />
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {loading && <div className="gs-map-loading" aria-hidden="true" />}

            {(error || showEmpty) && (
              <div className={`gs-map-message-wrap${error ? ' gs-map-message-wrap--center' : ''}`}>
                <div className="gs-glass gs-map-message" role={error ? 'alert' : 'status'}>
                  {error ? (
                    <>
                      <span>{error} Pastikan backend dan koneksi database aktif.</span>
                      <button
                        type="button"
                        className="btn-pill btn-pill-primary btn-pill-sm"
                        onClick={handleReload}
                      >
                        Coba lagi
                      </button>
                    </>
                  ) : (
                    <span>Tidak ada kejadian terverifikasi dengan koordinat valid untuk filter ini.</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <form
            className="gs-glass gs-map-filter gs-reveal"
            style={{ '--i': 0 }}
            onSubmit={handleSubmit}
            role="search"
          >
            <div className="gs-map-search">
              <i className="bi bi-search" aria-hidden="true" />
              <label className="visually-hidden" htmlFor="event-search">
                Cari kejadian atau wilayah
              </label>
              <input
                id="event-search"
                className="form-control"
                type="search"
                value={filters.search}
                onChange={(event) => setFilters({ ...filters, search: event.target.value })}
                placeholder="Cari kabupaten, provinsi, atau kejadian"
              />
            </div>
            <div className="gs-map-filter__row">
              <YearSelect
                id="event-year"
                label="Tahun kejadian"
                value={String(filters.year)}
                onChange={(value) => handleYearChange({ target: { value } })}
                options={[
                  { value: 'all', label: 'Semua tahun' },
                  ...availableYears.map((year) => ({ value: String(year), label: String(year) })),
                  ...(yearIsMissing ? [{ value: String(filters.year), label: String(filters.year) }] : []),
                ]}
              />
              <button className="btn-pill btn-pill-primary btn-pill-sm" type="submit">
                Terapkan
              </button>
              <button
                type="button"
                className={`gs-map-iconbtn${loading ? ' is-spinning' : ''}`}
                onClick={handleReload}
                disabled={loading}
                aria-label="Muat ulang data"
              >
                <i className="bi bi-arrow-clockwise" aria-hidden="true" />
              </button>
            </div>
          </form>

          <aside
            className={`gs-glass gs-map-list gs-reveal${listOpen ? '' : ' gs-map-list--closed'}`}
            style={{ '--i': 1 }}
            aria-label="Daftar kejadian"
          >
            <div className="gs-map-list__head">
              <div>
                <h2 className="gs-map-list__title">Daftar kejadian</h2>
                <p className="gs-map-list__count" aria-live="polite">
                  {loading
                    ? 'Memuat data...'
                    : `${formatNumber(result.count ?? markers.length)} titik${result.hasMore ? ' (dibatasi)' : ''}`}
                </p>
              </div>
              <button
                type="button"
                className="gs-map-iconbtn gs-map-list__hide"
                onClick={() => setListOpen(false)}
                aria-label="Sembunyikan daftar kejadian"
              >
                <i className="bi bi-chevron-right" aria-hidden="true" />
              </button>
            </div>

            <div className="gs-map-stats">
              <div className="gs-map-stat">
                <span className="gs-map-stat__value">{formatNumber(shownCount)}</span>
                <span className="gs-map-stat__label">Titik</span>
              </div>
              <div className="gs-map-stat">
                <span className="gs-map-stat__value">{formatNumber(shownDeaths)}</span>
                <span className="gs-map-stat__label">Meninggal</span>
              </div>
              <div className="gs-map-stat">
                <span className="gs-map-stat__value">{formatNumber(shownMissing)}</span>
                <span className="gs-map-stat__label">Hilang</span>
              </div>
            </div>

            <ul className="gs-map-list__scroll" ref={listRef}>
              {loading && listItems.length === 0
                ? Array.from({ length: 6 }, (_, index) => (
                    <li key={index} className="gs-skeleton-row" aria-hidden="true" />
                  ))
                : listItems.map(({ event, impact }, index) => (
                    <li key={event.id}>
                      <button
                        type="button"
                        ref={(node) => {
                          if (node) itemRefs.current.set(event.id, node);
                          else itemRefs.current.delete(event.id);
                        }}
                        className={`gs-map-item${selectedId === event.id ? ' is-active' : ''}`}
                        style={{ '--i': Math.min(index, 12) }}
                        onClick={() => handleSelect(event)}
                        aria-pressed={selectedId === event.id}
                      >
                        <span className={`gs-map-item__dot gs-map-item__dot--${impact.level}`} aria-hidden="true" />
                        <span className="gs-map-item__body">
                          <span className="gs-map-item__name">
                            {event.regency || event.province || event.title}
                          </span>
                          <span className="gs-map-item__meta">
                            {[formatDate(event.event_date, shortDate), event.province]
                              .filter(Boolean)
                              .join(' · ')}
                          </span>
                        </span>
                        {impact.victims > 0 && (
                          <span className={`gs-map-item__badge gs-map-item__badge--${impact.level}`}>
                            {formatNumber(impact.victims)} korban
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
            </ul>
          </aside>

          {!listOpen && (
            <button
              type="button"
              className="gs-glass gs-map-toggle"
              onClick={() => setListOpen(true)}
            >
              <i className="bi bi-list-ul" aria-hidden="true" />
              Daftar kejadian
            </button>
          )}

          <div className="gs-glass gs-map-legend gs-reveal" style={{ '--i': 2 }}>
            <span className="gs-map-legend__item">
              <span className="gs-map-legend__dot gs-map-legend__dot--low" />
              Rendah
            </span>
            <span className="gs-map-legend__item">
              <span className="gs-map-legend__dot gs-map-legend__dot--mid" />
              Sedang (1-4)
            </span>
            <span className="gs-map-legend__item">
              <span className="gs-map-legend__dot gs-map-legend__dot--high" />
              Tinggi (5+)
            </span>
            <span className="gs-map-legend__hint">Korban meninggal + hilang</span>
          </div>
        </div>

        <p className="small gs-text-muted mt-3 mb-0">
          Peta ini menampilkan kejadian terverifikasi yang memiliki koordinat. Warna dan ukuran titik
          menunjukkan jumlah korban meninggal dan hilang. Data zona rawan berupa area/poligon belum
          terhubung; titik kejadian tidak menunjukkan batas zona risiko.
        </p>
      </Section>
    </>
  );
}