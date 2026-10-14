#!/usr/bin/env node
/**
 * Renders SVG charts from k6 summary JSON artifacts.
 *
 *   node apps/api/performance/report.mjs apps/api/performance/results/baseline
 *
 * Charts are dependency-free SVG, written to docs/performance/assets/ so they
 * render on GitHub without any binary assets in the repo.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const runDir = process.argv[2];
if (!runDir || !existsSync(runDir)) {
  console.error('usage: node report.mjs <results-dir>');
  process.exit(1);
}
const outDir = 'docs/performance/assets';
mkdirSync(outDir, { recursive: true });

const files = readdirSync(runDir).filter((f) => f.endsWith('.json'));
const load = (prefix) =>
  files
    .filter((f) => f.startsWith(prefix))
    .map((f) => JSON.parse(readFileSync(join(runDir, f), 'utf8')));

const val = (data, metric, key) =>
  data?.metrics?.[metric]?.values?.[key] ?? null;
const round = (n, d = 2) => (n == null ? null : Number(n).toFixed(d));

const COLORS = ['#e8590c', '#1c7ed6', '#2f9e44', '#ae3ec9', '#f08c00', '#0c8599'];

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

/** Vertical grouped bar chart. series: [{name, values:[{label,value,color}]}] */
function barChart({ title, subtitle, groups, unit, width = 720, height = 360 }) {
  const pad = { t: 56, r: 24, b: 64, l: 72 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const max = Math.max(1e-9, ...groups.flatMap((g) => g.values.map((v) => v.value)));
  const gw = w / groups.length;
  const bw = Math.min(46, (gw * 0.7) / groups[0].values.length);
  let bars = '';
  groups.forEach((g, gi) => {
    const gx = pad.l + gi * gw + gw / 2;
    const start = gx - (g.values.length * bw) / 2;
    g.values.forEach((v, vi) => {
      const bh = (v.value / max) * h;
      const x = start + vi * bw;
      const y = pad.t + h - bh;
      bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(bw - 4).toFixed(1)}" height="${Math.max(0, bh).toFixed(1)}" rx="2" fill="${v.color || COLORS[vi % COLORS.length]}"/>`;
      bars += `<text x="${(x + (bw - 4) / 2).toFixed(1)}" y="${(y - 4).toFixed(1)}" text-anchor="middle" font-size="10" fill="#333">${esc(v.display ?? round(v.value))}</text>`;
    });
    bars += `<text x="${gx.toFixed(1)}" y="${(pad.t + h + 18).toFixed(1)}" text-anchor="middle" font-size="11" fill="#333">${esc(g.label)}</text>`;
  });
  // y gridlines
  let grid = '';
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (h * i) / 4;
    const v = max * (1 - i / 4);
    grid += `<line x1="${pad.l}" y1="${y.toFixed(1)}" x2="${pad.l + w}" y2="${y.toFixed(1)}" stroke="#e9ecef"/>`;
    grid += `<text x="${pad.l - 8}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="10" fill="#666">${round(v)}</text>`;
  }
  const legend = groups[0].values
    .map(
      (v, i) =>
        `<rect x="${pad.l + i * 130}" y="30" width="10" height="10" fill="${v.color || COLORS[i % COLORS.length]}"/><text x="${pad.l + i * 130 + 15}" y="39" font-size="11" fill="#333">${esc(v.name)}</text>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="ui-sans-serif, system-ui, sans-serif">
<rect width="${width}" height="${height}" fill="#fff"/>
<text x="${pad.l}" y="24" font-size="15" font-weight="600" fill="#111">${esc(title)}</text>
${subtitle ? `<text x="${pad.l}" y="42" font-size="11" fill="#666">${esc(subtitle)}</text>` : ''}
${legend}${grid}${bars}
<text x="${width - pad.r}" y="${height - 10}" text-anchor="end" font-size="10" fill="#666">${esc(unit)}</text>
</svg>`;
}

/** Line chart. points: [{x,y}], xLabel, yLabel */
function lineChart({ title, subtitle, points, xLabel, yLabel, width = 720, height = 360 }) {
  const pad = { t: 56, r: 32, b: 60, l: 72 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = Math.min(...xs, 0);
  const xMax = Math.max(...xs, 1);
  const yMax = Math.max(...ys, 1e-9) * 1.15;
  const sx = (x) => pad.l + ((x - xMin) / (xMax - xMin || 1)) * w;
  const sy = (y) => pad.t + h - (y / yMax) * h;
  let grid = '';
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (h * i) / 4;
    grid += `<line x1="${pad.l}" y1="${y.toFixed(1)}" x2="${pad.l + w}" y2="${y.toFixed(1)}" stroke="#e9ecef"/>`;
    grid += `<text x="${pad.l - 8}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="10" fill="#666">${round(yMax * (1 - i / 4))}</text>`;
  }
  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`)
    .join(' ');
  const dots = points
    .map(
      (p) =>
        `<circle cx="${sx(p.x).toFixed(1)}" cy="${sy(p.y).toFixed(1)}" r="3.5" fill="#e8590c"/>` +
        `<text x="${sx(p.x).toFixed(1)}" y="${(sy(p.y) - 8).toFixed(1)}" text-anchor="middle" font-size="10" fill="#333">${round(p.y)}</text>` +
        `<text x="${sx(p.x).toFixed(1)}" y="${(pad.t + h + 18).toFixed(1)}" text-anchor="middle" font-size="10" fill="#333">${p.x}</text>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="ui-sans-serif, system-ui, sans-serif">
<rect width="${width}" height="${height}" fill="#fff"/>
<text x="${pad.l}" y="24" font-size="15" font-weight="600" fill="#111">${esc(title)}</text>
${subtitle ? `<text x="${pad.l}" y="42" font-size="11" fill="#666">${esc(subtitle)}</text>` : ''}
${grid}
<path d="${path}" fill="none" stroke="#e8590c" stroke-width="2"/>
${dots}
<text x="${width - pad.r}" y="${height - 8}" text-anchor="end" font-size="10" fill="#666">${esc(xLabel)}</text>
<text x="14" y="${pad.t + 10}" font-size="10" fill="#666">${esc(yLabel)}</text>
</svg>`;
}

// ── booking contention ────────────────────────────────────────────────
const contention = load('booking-contention')[0];
if (contention) {
  const pct = (k) => val(contention, 'http_req_duration', k) ?? 0;
  writeFileSync(
    join(outDir, 'booking-contention-latency.svg'),
    barChart({
      title: 'Booking contention — write latency under a 10-way slot race',
      subtitle: `http_req_duration percentiles (ms), ${val(contention, 'booking_success', 'count')} winners + ${val(contention, 'booking_conflict', 'count')} conflicts`,
      unit: 'milliseconds',
      groups: [
        {
          label: 'POST /bookings under race',
          values: [
            { name: 'p50', value: pct('med') * 1000 },
            { name: 'p90', value: pct('p(90)') * 1000 },
            { name: 'p95', value: pct('p(95)') * 1000 },
            { name: 'p99', value: pct('p(99)') * 1000 },
          ],
        },
      ],
    }),
  );
}

// ── hold expiry ───────────────────────────────────────────────────────
const hold = load('hold-expiry')[0];
if (hold) {
  const ttl = Number(process.env.HOLD_TTL ?? 5) * 1000;
  const l = (k) => val(hold, 'hold_release_latency', k) ?? 0;
  writeFileSync(
    join(outDir, 'hold-expiry-latency.svg'),
    barChart({
      title: 'Hold expiry — slot release latency from hold creation',
      subtitle: `TTL = ${ttl} ms; measured across ${val(hold, 'hold_claimed', 'count')} holds (polls every 200 ms + 1 s sweeper)`,
      unit: 'milliseconds',
      groups: [
        {
          label: 'release latency',
          values: [
            { name: 'p50', value: l('med') },
            { name: 'p90', value: l('p(90)') },
            { name: 'p95', value: l('p(95)') },
            { name: 'max', value: l('max') },
          ],
        },
      ],
    }),
  );
}

// ── feed read ─────────────────────────────────────────────────────────
const feed = load('feed-read')[0];
if (feed) {
  const pct = (k) => val(feed, 'http_req_duration', k) ?? 0;
  writeFileSync(
    join(outDir, 'feed-read-latency.svg'),
    barChart({
      title: 'Feed read — warm timeline GET /feed',
      subtitle: `${round(val(feed, 'http_reqs', 'rate'), 1)} req/s at ${val(feed, 'http_reqs', 'count')} requests`,
      unit: 'milliseconds',
      groups: [
        {
          label: 'GET /feed',
          values: [
            { name: 'p50', value: pct('med') * 1000 },
            { name: 'p90', value: pct('p(90)') * 1000 },
            { name: 'p95', value: pct('p(95)') * 1000 },
            { name: 'p99', value: pct('p(99)') * 1000 },
          ],
        },
      ],
    }),
  );
}

// ── slot lookup scaling ───────────────────────────────────────────────
function slotPointsFrom(dir) {
  return readdirSync(dir)
    .filter((f) => f.startsWith('slot-lookup') && f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
    .map((d) => ({
      x: Math.round(val(d, 'slots_conflicts_considered', 'avg') ?? 0),
      y: (val(d, 'http_req_duration', 'p(95)') ?? 0) * 1000,
    }))
    .sort((a, b) => a.x - b.x);
}

const slotRuns = load('slot-lookup');
const slotBeforeDir = process.env.SLOT_BEFORE_DIR;
if (slotRuns.length || (slotBeforeDir && existsSync(slotBeforeDir))) {
  const beforeDir = slotBeforeDir && existsSync(slotBeforeDir) ? slotBeforeDir : runDir;
  writeFileSync(
    join(outDir, 'slot-lookup-scaling.svg'),
    lineChart({
      title: 'Slot lookup — p95 before the timezone-offset cache',
      subtitle: 'GET /practitioners/:id/slots, fixed 14-day window, 100-slot response cap',
      points: slotPointsFrom(beforeDir),
      xLabel: 'live reservations (conflictsConsidered)',
      yLabel: 'p95 ms',
    }),
  );
}

const slotAfterDir = process.env.SLOT_AFTER_DIR || process.argv[3];
if (slotAfterDir && existsSync(slotAfterDir)) {
  const after = slotPointsFrom(slotAfterDir);
  writeFileSync(
    join(outDir, 'slot-lookup-scaling-after.svg'),
    lineChart({
      title: 'Slot lookup — p95 after caching the per-day timezone offset',
      subtitle: 'same load and window; the per-candidate Intl parse was the bottleneck',
      points: after,
      xLabel: 'live reservations (conflictsConsidered)',
      yLabel: 'p95 ms',
    }),
  );
}

console.log('wrote charts to', outDir);
