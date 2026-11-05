async function getJson(url, signal) {
  const response = await fetch(url, { signal });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || `Permintaan gagal (${response.status}).`);
  }

  return payload;
}

export function getKejadian({ year = 'all', search = '' } = {}, signal) {
  const params = new URLSearchParams({ year });
  if (search) params.set('search', search);
  return getJson(`/api/data-bencana/kejadian?${params}`, signal);
}

export function getStatistik(year = 'all', signal) {
  const params = new URLSearchParams({ year });
  return getJson(`/api/data-bencana/statistik?${params}`, signal);
}
