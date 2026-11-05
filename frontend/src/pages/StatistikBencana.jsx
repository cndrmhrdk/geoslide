import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import { getStatistik } from '../services/dataBencana';
import './StatistikBencana.css';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const currentYear = String(new Date().getFullYear());
const numberFormat = new Intl.NumberFormat('id-ID');

function Metric({ label, value, note }) {
  return (
    <div className="col-6 col-lg-3">
      <div className="card-solid p-3 h-100">
        <p className="gs-text-muted mb-2">{label}</p>
        <p className="stats-metric mb-1">{numberFormat.format(value)}</p>
        {note && <p className="small gs-text-muted mb-0">{note}</p>}
      </div>
    </div>
  );
}

export default function StatistikBencana() {
  const [year, setYear] = useState(currentYear);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    getStatistik(year, controller.signal)
      .then(setStatistics)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setStatistics(null);
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [year]);

  const availableYears = [...new Set([currentYear, ...(statistics?.availableYears || [])])]
    .sort((a, b) => Number(b) - Number(a));
  const monthlyEvents = statistics?.monthlyEvents || [];
  const maximumMonthlyTotal = Math.max(0, ...monthlyEvents.map((item) => item.total));

  return (
    <>
      <PageHeader
        badge="Ringkasan dari data terverifikasi"
        title="Statistik Kejadian Tanah Longsor"
        subtitle="Jumlah kejadian dan dampak dihitung dari data GeoSlide yang telah diverifikasi."
        icon="bi-bar-chart-line"
      />

      <Section bg="white" py="md">
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <div>
            <h2 className="h4 mb-1">Ringkasan data</h2>
            <p className="gs-text-muted mb-0">
              {year === 'all' ? 'Seluruh periode kejadian' : `Periode kejadian ${year}`}
            </p>
          </div>
          <div>
            <label className="form-label" htmlFor="statistics-year">Periode kejadian</label>
            <select
              id="statistics-year"
              className="form-select"
              value={year}
              onChange={(event) => {
                setLoading(true);
                setError('');
                setYear(event.target.value);
              }}
            >
              <option value="all">Semua tahun</option>
              {availableYears.map((availableYear) => (
                <option key={availableYear} value={availableYear}>{availableYear}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {loading && <p className="gs-text-muted" aria-live="polite">Memuat statistik...</p>}

        {statistics && !error && !loading && (
          <>
            <div className="row g-3 mb-4" aria-live="polite">
              <Metric label="Kejadian terverifikasi" value={statistics.events.total} />
              <Metric label="Kabupaten/kota terdampak" value={statistics.events.affectedRegions} />
              <Metric label="Meninggal dunia" value={statistics.events.deaths} />
              <Metric
                label="Orang hilang terverifikasi"
                value={statistics.missingPersons.approvedReports}
                note="Laporan disetujui · seluruh periode"
              />
              <Metric label="Luka-luka" value={statistics.events.injured} />
              <Metric label="Mengungsi" value={statistics.events.displaced} />
              <Metric label="Rumah rusak" value={statistics.events.housesDamaged} />
              <Metric
                label="Masih dalam pencarian"
                value={statistics.missingPersons.searching}
                note="Laporan disetujui · seluruh periode"
              />
            </div>

            <div className="row g-4">
              <div className="col-12 col-xl-7">
                <section className="card-solid p-3 h-100" aria-labelledby="monthly-title">
                  <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                    <div>
                      <h2 id="monthly-title" className="h5 mb-1">Kejadian per bulan</h2>
                      <p className="small gs-text-muted mb-0">
                        {year === 'all' ? 'Jumlah gabungan untuk setiap bulan di seluruh periode' : `Jumlah kejadian selama ${year}`}
                      </p>
                    </div>
                  </div>
                  <div
                    className="stats-month-chart"
                    role="img"
                    aria-label={`Grafik bulanan, total ${numberFormat.format(statistics.events.total)} kejadian`}
                  >
                    {monthlyEvents.map((item) => {
                      const height = maximumMonthlyTotal
                        ? Math.max(4, (item.total / maximumMonthlyTotal) * 100)
                        : 0;
                      return (
                        <div className="stats-month-chart__item" key={item.month}>
                          <span className="stats-month-chart__value">{numberFormat.format(item.total)}</span>
                          <div className="stats-month-chart__track">
                            <span
                              className="stats-month-chart__bar"
                              style={{ height: `${height}%` }}
                              title={`${monthLabels[item.month - 1]}: ${numberFormat.format(item.total)} kejadian`}
                            />
                          </div>
                          <span className="stats-month-chart__label">{monthLabels[item.month - 1]}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              <div className="col-12 col-xl-5">
                <section className="card-solid p-3 h-100" aria-labelledby="regions-title">
                  <h2 id="regions-title" className="h5 mb-1">Wilayah dengan kejadian terbanyak</h2>
                  <p className="small gs-text-muted mb-3">Sepuluh kabupaten/kota teratas dalam periode terpilih.</p>
                  {statistics.topRegions.length ? (
                    <div className="table-responsive">
                      <table className="table table-sm align-middle mb-0">
                        <thead>
                          <tr>
                            <th scope="col">Wilayah</th>
                            <th scope="col" className="text-end">Kejadian</th>
                          </tr>
                        </thead>
                        <tbody>
                          {statistics.topRegions.map((region) => (
                            <tr key={`${region.province}-${region.regency}`}>
                              <td>
                                <span className="d-block fw-medium">{region.regency}</span>
                                <span className="small gs-text-muted">{region.province}</span>
                              </td>
                              <td className="text-end">{numberFormat.format(region.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="gs-text-muted mb-0">Belum ada data kejadian terverifikasi pada periode ini.</p>
                  )}
                </section>
              </div>
            </div>

            <p className="small gs-text-muted mt-3 mb-0">
              Statistik orang hilang menghitung laporan yang disetujui dan mencakup seluruh periode, tidak mengikuti filter tahun kejadian. Data dampak kejadian mengikuti periode yang dipilih.
            </p>
          </>
        )}
      </Section>
    </>
  );
}
