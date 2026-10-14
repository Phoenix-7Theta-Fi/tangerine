import http from 'k6/http';
import { Counter, Trend } from 'k6/metrics';
import {
  API,
  artifactPath,
  authHeaders,
  byHandle,
  identities,
  stamp,
  summarize,
} from './lib/common.js';

/**
 * Feed read throughput (baseline for the existing system).
 *
 * GET /feed hydrates a bounded slice of the viewer's materialized Redis
 * timeline, merges any celebrity pull, and returns keyset-paginated posts. The
 * runner warms the timeline first (a few posts from followed authors) so this
 * measures the warm read path; `FEED_COLD=1` measures the Postgres backfill.
 */

const VUS = Number(__ENV.VUS || 20);
const DURATION = __ENV.DURATION || '30s';
const LIMIT = Number(__ENV.LIMIT || 20);

export const options = {
  scenarios: {
    feed: { executor: 'constant-vus', vus: VUS, duration: DURATION },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    feed_items: ['avg>0'],
  },
};

const items = new Trend('feed_items', true);
const emptyFeeds = new Counter('feed_empty');
const pages = new Counter('feed_pages');

export function setup() {
  const ids = identities();
  const viewer = byHandle(ids, __ENV.VIEWER_HANDLE || 'maya');
  return { viewerId: viewer.id };
}

export default function (data) {
  const res = http.get(
    `${API}/feed?limit=${LIMIT}`,
    authHeaders(data.viewerId),
  );
  if (res.status === 200) {
    pages.add(1);
    const list = res.json('items') || [];
    items.add(list.length);
    if (list.length === 0) emptyFeeds.add(1);
  }
}

export function handleSummary(data) {
  return {
    [artifactPath(`feed-read-${stamp()}`)]: JSON.stringify(data, null, 2),
    stdout: summarize(data, [
      'http_reqs',
      'http_req_duration',
      'http_req_failed',
      'feed_items',
      'feed_empty',
      'feed_pages',
    ]),
  };
}
