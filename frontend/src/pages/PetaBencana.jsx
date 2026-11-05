import { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import { getKejadian } from '../services/dataBencana';
import 'leaflet/dist/leaflet.css';
import './PetaBencana.css';

const initialFilters = { year: 'all', search: '' };

function formatDate(value) {
  const date = String(value).slice(0, 10);
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

export default function PetaBencana() {
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [result, setResult] = useState({ data: [], count: 0, hasMore: false, availableYears: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getKejadian(appliedFilters, controller.signal)
      .then(setResult)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [appliedFilters, reloadKey]);

  const availableYears = [...new Set(result.availableYears)].sort((a, b) => b - a);

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setAppliedFilters({ ...filters, search: filters.search.trim() });
  }

  return (
    <>
      <PageHeader
        badge="Data kejadian terverifikasi"
        title="Peta Kejadian Tanah Longsor"
        subtitle="Jelajahi titik kejadian yang tercatat. Lokasi pada peta mewakili kabupaten/kota, bukan koordinat longsor yang presisi."
        icon="bi-map"
      />

      <Section bg="white" py="md">
        <form className="card-solid p-3 mb-4" onSubmit={handleSubmit}>
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="event-search">Cari kejadian atau wilayah</label>
              <input
                id="event-search"
                className="form-control"
                type="search"
                value={filters.search}
                onChange={(event) => setFilters({ ...filters, search: event.target.value })}
                placeholder="Nama kejadian, provinsi, kabupaten..."
              />
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label" htmlFor="event-year">Tahun kejadian</label>
              <select
                id="event-year"
                className="form-select"
                value={filters.year}
                onChange={(event) => setFilters({ ...filters, year: event.target.value })}
              >
                <option value="all">Semua tahun</option>
                {availableYears.map((year) => <option key={year} value={year}>{year}</option>)}
                {!availableYears.includes(filters.year) && filters.year !== 'all' && (
                  <option value={filters.year}>{filters.year}</option>
                )}
              </select>
            </div>
            <div className="col-12 col-sm-6 col-md-3 d-flex gap-2">
              <button className="btn-pill btn-pill-primary btn-pill-sm" type="submit">
                Terapkan
              </button>
              <button
                className="btn-pill btn-pill-surface btn-pill-sm"
                type="button"
                onClick={() => {
                  setLoading(true);
                  setError('');
                  setReloadKey((key) => key + 1);
                }}
                disabled={loading}
              >
                Perbarui
              </button>
            </div>
          </div>
        </form>

        <div className="card-solid p-0 overflow-hidden mb-4">
          <div className="p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h2 className="h5 mb-0">Sebaran titik kejadian</h2>
            <p className="mb-0 gs-text-muted" aria-live="polite">
              {loading ? 'Memuat data...' : `${result.count} titik${result.hasMore ? ' (dibatasi)' : ''}`}
            </p>
          </div>

          {error ? (
            <div className="alert alert-danger m-3" role="alert">
              {error} Pastikan backend dan koneksi database aktif, lalu coba perbarui.
            </div>
          ) : (
            <MapContainer
              className="disaster-map"
              center={[-2.5, 118]}
              zoom={5}
              scrollWheelZoom
              aria-label="Peta kejadian tanah longsor Indonesia"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {result.data.map((event) => (
                <CircleMarker
                  key={event.id}
                  center={[event.latitude, event.longitude]}
                  radius={8}
                  pathOptions={{ color: '#ffffff', weight: 2, fillColor: '#b33b32', fillOpacity: 0.9 }}
                >
                  <Popup>
                    <div className="disaster-map__popup">
                      <strong>{event.title}</strong>
                      <span>{formatDate(event.event_date)}</span>
                      <span>{[event.regency, event.province].filter(Boolean).join(', ')}</span>
                      <span>Lokasi perkiraan tingkat kabupaten/kota</span>
                      <span>Korban meninggal: {Number(event.deaths).toLocaleString('id-ID')}</span>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          )}

          {!loading && !error && result.count === 0 && (
            <p className="p-3 mb-0 gs-text-muted">
              Tidak ada kejadian terverifikasi dengan koordinat valid untuk filter ini.
            </p>
          )}
        </div>

        <p className="small gs-text-muted mb-0">
          Peta ini menampilkan kejadian terverifikasi yang memiliki koordinat. Data zona rawan berupa area/poligon belum terhubung; titik kejadian tidak menunjukkan batas zona risiko.
        </p>
      </Section>
    </>
  );
}
