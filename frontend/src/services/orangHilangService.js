// Foto dilayani backend lewat /uploads; di dev diteruskan oleh proxy Vite.

async function getJson(url, signal, { nullOn404 = false } = {}) {
  const response = await fetch(url, { signal });
  if (nullOn404 && response.status === 404) return null;

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || `Permintaan gagal (${response.status}).`);
  }
  return payload;
}

// Buang parameter kosong agar URL bersih
function toParams(filter) {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== '' && value != null) params.set(key, value);
  });
  return params;
}

export function getOrangHilang(filter = {}, signal) {
  return getJson(`/api/orang-hilang?${toParams(filter)}`, signal);
}

export function getOpsiFilterOrangHilang(signal) {
  return getJson('/api/orang-hilang/filters', signal);
}

// Mengembalikan null bila laporan tidak ada / belum diverifikasi
export async function getOrangHilangById(id, signal) {
  const payload = await getJson(`/api/orang-hilang/${encodeURIComponent(id)}`, signal, { nullOn404: true });
  return payload ? payload.data : null;
}
