import http from 'k6/http';

export const BASE = __ENV.BASE_URL || 'http://localhost:3001';
export const API = `${BASE}/api`;

export function authHeaders(userId, extra = {}) {
  return {
    headers: {
      'x-user-id': userId,
      'content-type': 'application/json',
      ...extra,
    },
  };
}

export function identities() {
  return http.get(`${API}/session/identities`).json();
}

export function byHandle(ids, handle) {
  const user = ids.find((u) => u.handle === handle);
  if (!user) throw new Error(`no identity with handle @${handle}`);
  return user;
}

export function members(ids, take = 50) {
  return ids
    .filter((u) => u.role === 'MEMBER')
    .slice(0, take)
    .map((u) => u.id);
}

export function isoFromDays(days) {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

export function slotQuery(practitionerId, sessionTypeId, fromDays, toDays) {
  return (
    `${API}/practitioners/${practitionerId}/slots` +
    `?from=${isoFromDays(fromDays)}&to=${isoFromDays(toDays)}` +
    `&sessionTypeId=${sessionTypeId}`
  );
}

export function openSlots(userId, practitionerId, sessionTypeId, fromDays, toDays) {
  const res = http.get(
    slotQuery(practitionerId, sessionTypeId, fromDays, toDays),
    authHeaders(userId),
  );
  return res.json('slots') || [];
}

export function sessionTypeFor(userId, practitionerId, name) {
  const res = http.get(
    `${API}/session-types?practitionerId=${practitionerId}`,
    authHeaders(userId),
  );
  const types = res.json() || [];
  const type = name ? types.find((t) => t.name === name) : types[0];
  if (!type) throw new Error(`no session type for practitioner ${practitionerId}`);
  return type;
}

/**
 * Compact, dependency-free summary formatter. k6's default table is suppressed
 * when handleSummary is defined; this prints the metrics each scenario cares
 * about and lets us write the full JSON artifact at the same time.
 */
export function summarize(data, keys) {
  const lines = [];
  for (const key of keys) {
    const metric = data.metrics[key];
    if (!metric) continue;
    const values = metric.values || {};
    const wanted = [
      'count',
      'rate',
      'avg',
      'min',
      'med',
      'p(90)',
      'p(95)',
      'p(99)',
      'max',
    ];
    const parts = Object.entries(values)
      .filter(([k]) => wanted.includes(k))
      .map(([k, v]) => `${k}=${typeof v === 'number' ? v.toFixed(4) : v}`);
    lines.push(`${key}: ${parts.join(' ')}`);
  }
  const thresholds = Object.entries(data.metrics || {})
    .flatMap(([, m]) => Object.entries(m.thresholds || {}))
    .map(([name, t]) => `  ${name}: ${t.ok ? 'PASS' : 'FAIL'}`);
  if (thresholds.length) lines.push('thresholds:', ...thresholds);
  return lines.join('\n') + '\n';
}

/**
 * Summary path/stdout bootstrap shared by every scenario so the JSON artifacts
 * written to docs/performance are uniformly named.
 */
export function artifactPath(name) {
  return `${resultsDir()}/${name}.json`;
}

export function resultsDir() {
  const dir = __ENV.ARTIFACT_DIR || 'results';
  return dir;
}

export function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

