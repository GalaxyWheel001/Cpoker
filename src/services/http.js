const base = (import.meta.env.VITE_WORKER_HTTP_BASE || '').replace(/\/$/, '');

export async function post(path, body) {
  const url = `${base}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function get(path, params = {}) {
  const qs = new URLSearchParams(params);
  const url = `${base}${path}${qs.toString() ? `?${qs}` : ''}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
