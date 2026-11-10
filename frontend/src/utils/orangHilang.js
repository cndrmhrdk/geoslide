export const STATUS_PENCARIAN = {
  searching: 'Sedang dicari',
  found: 'Ditemukan',
  closed: 'Ditutup',
};

export const JENIS_KELAMIN = {
  male: 'Laki-laki',
  female: 'Perempuan',
  unknown: 'Tidak diketahui',
};

// Menerima teks 'YYYY-MM-DD' atau 'YYYY-MM-DD HH:mm:ss' (waktu lokal, tanpa konversi zona).
export function formatTanggal(nilai, denganJam = true) {
  if (!nilai) return '-';
  const teks = String(nilai).replace(' ', 'T');
  const date = new Date(teks.length === 10 ? `${teks}T00:00:00` : teks);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(denganJam && teks.length > 10 && { hour: '2-digit', minute: '2-digit' }),
  }).format(date);
}

export function formatUsia(usia) {
  return usia == null ? 'Usia belum diketahui' : `${usia} tahun`;
}

export function formatWilayah(kejadian) {
  if (!kejadian) return '';
  return [kejadian.desa, kejadian.kecamatan, kejadian.kabupaten, kejadian.provinsi].filter(Boolean).join(', ');
}
