This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.github/
  workflows/
    ci.yml
apps/
  api/
    performance/
      lib/
        common.js
      results/
        baseline/
          booking-contention-2026-10-14T04-40-51-347Z.json
          feed-read-2026-10-14T04-41-58-072Z.json
          hold-expiry-2026-10-14T04-41-23-767Z.json
          manifest.md
          reschedule-idempotency-2026-10-14T04-40-52-695Z.json
          seed-0.json
          seed-1200.json
          seed-400.json
          seed-800.json
          slot-lookup-2026-10-14T04-42-00-066Z.json
          slot-lookup-2026-10-14T04-42-01-690Z.json
          slot-lookup-2026-10-14T04-42-03-286Z.json
          slot-lookup-2026-10-14T04-42-04-883Z.json
        contention-advisory/
          booking-contention-2026-10-14T05-05-36-232Z.json
        final/
          booking-contention-2026-10-14T05-08-43-443Z.json
          feed-read-2026-10-14T05-09-50-405Z.json
          hold-expiry-2026-10-14T05-09-16-123Z.json
          manifest.md
          reschedule-idempotency-2026-10-14T05-08-44-644Z.json
          seed-0.json
          seed-1200.json
          seed-400.json
          seed-800.json
          slot-lookup-2026-10-14T05-10-13-574Z.json
          slot-lookup-2026-10-14T05-10-36-796Z.json
          slot-lookup-2026-10-14T05-11-00-155Z.json
          slot-lookup-2026-10-14T05-11-23-578Z.json
        moderate/
          booking-contention-2026-10-14T05-05-37-558Z.json
        optimized/
          booking-contention-2026-10-14T04-46-32-745Z.json
          booking-contention-2026-10-14T04-51-50-599Z.json
          feed-read-2026-10-14T04-52-57-325Z.json
          hold-expiry-2026-10-14T04-52-23-035Z.json
          manifest.md
          reschedule-idempotency-2026-10-14T04-51-51-727Z.json
          seed-0.json
          seed-1200.json
          seed-400.json
          seed-800.json
          slot-lookup-2026-10-14T04-53-20-603Z.json
          slot-lookup-2026-10-14T04-53-43-936Z.json
          slot-lookup-2026-10-14T04-54-07-528Z.json
          slot-lookup-2026-10-14T04-54-31-270Z.json
        slot-optimized/
          seed-0.json
          seed-1200.json
          seed-400.json
          seed-800.json
          slot-lookup-2026-10-14T04-56-23-992Z.json
          slot-lookup-2026-10-14T04-56-47-349Z.json
          slot-lookup-2026-10-14T04-57-14-316Z.json
          slot-lookup-2026-10-14T04-57-37-811Z.json
      booking-contention.js
      feed-read.js
      hold-expiry.js
      README.md
      report.mjs
      reschedule-idempotency.js
      run-scheduling.sh
      seed-bookings.ts
      slot-lookup.js
      tsconfig.json
    prisma/
      migrations/
        20261013070721_init/
          migration.sql
        20261013071105_add_conversation_last_seq/
          migration.sql
        20261013173503_add_outbox/
          migration.sql
        20261014042134_scheduling_booking/
          migration.sql
        migration_lock.toml
      schema.prisma
      seed.ts
    src/
      chat/
        dto/
          chat.dto.ts
        chat.controller.ts
        chat.gateway.ts
        chat.module.ts
        chat.service.spec.ts
        chat.service.ts
      common/
        decorators/
          current-user.decorator.ts
        dto/
          pagination.dto.ts
        filters/
          all-exceptions.filter.ts
        guards/
          auth.guard.ts
        cursor.spec.ts
        cursor.ts
      config/
        configuration.ts
      fanout/
        fanout.module.ts
        fanout.processor.spec.ts
        fanout.processor.ts
      feed/
        feed.controller.ts
        feed.module.ts
        feed.service.ts
      follow/
        follow.controller.ts
        follow.module.ts
        follow.service.ts
      health/
        health.controller.ts
        health.module.ts
      metrics/
        metrics.controller.ts
        metrics.interceptor.ts
        metrics.module.ts
        metrics.service.ts
      outbox/
        outbox.module.ts
        outbox.service.spec.ts
        outbox.service.ts
      posts/
        dto/
          post.dto.ts
        author-posts.controller.ts
        posts.controller.ts
        posts.module.ts
        posts.service.ts
      prisma/
        prisma.module.ts
        prisma.service.ts
      queue/
        queue.module.ts
        redis-connection.ts
      realtime/
        realtime.module.ts
        realtime.service.ts
      redis/
        redis.module.ts
        redis.service.ts
      scheduling/
        dto/
          scheduling.dto.ts
        hold-sweeper.service.ts
        scheduling.controller.ts
        scheduling.module.ts
        scheduling.service.spec.ts
        scheduling.service.ts
        timezone.spec.ts
        timezone.ts
      timeline/
        timeline.module.ts
        timeline.service.ts
      users/
        session.controller.ts
        users.controller.ts
        users.module.ts
        users.service.ts
      app.module.ts
      main.ts
    test/
      app.e2e-spec.ts
      jest-e2e.json
      scheduling.e2e-spec.ts
    nest-cli.json
    package.json
    tsconfig.json
  web/
    src/
      components/
        Avatar.tsx
        Chat.tsx
        Composer.tsx
        Feed.tsx
        MessageThread.tsx
        PostCard.tsx
        ProfileDrawer.tsx
        SuggestedPractitioners.tsx
        TopBar.tsx
      lib/
        api.ts
        format.ts
        socket.ts
        types.ts
      app-context.tsx
      App.tsx
      index.css
      main.tsx
      vite-env.d.ts
    .env.example
    index.html
    package.json
    README.md
    tsconfig.json
    vite.config.ts
docs/
  performance/
    assets/
      booking-contention-latency.svg
      feed-read-latency.svg
      grafana-dashboard.png
      hold-expiry-latency.svg
      slot-lookup-scaling-after.svg
      slot-lookup-scaling.svg
    booking-contention.md
    feed-read-throughput.md
    hold-expiry.md
    optimization-log.md
    README.md
    reschedule-idempotency.md
    slot-lookup.md
  architecture.md
  frontend-spec.md
infra/
  grafana/
    dashboards/
      tangerine.json
    provisioning/
      dashboards/
        dashboards.yml
      datasources/
        prometheus.yml
  prometheus/
    prometheus.yml
.env.example
.gitignore
docker-compose.yml
Feature List.md
package.json
pnpm-workspace.yaml
README.md
```

# Files

## File: apps/api/performance/lib/common.js
````javascript
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
````

## File: apps/api/performance/results/baseline/booking-contention-2026-10-14T04-40-51-347Z.json
````json
{
  "state": {
    "testRunDurationMs": 47490.009634,
    "isStdOutTTY": false,
    "isStdErrTTY": false
  },
  "metrics": {
    "http_req_receiving": {
      "values": {
        "p(90)": 0.10476439999999998,
        "p(95)": 0.119712,
        "avg": 0.07604552970544172,
        "min": 0.019067,
        "med": 0.075431,
        "max": 0.241867
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_sending": {
      "values": {
        "p(90)": 0.0357452,
        "p(95)": 0.04442,
        "avg": 0.02877622865701453,
        "min": 0.007682,
        "med": 0.022211,
        "max": 1.491435
      },
      "type": "trend",
      "contains": "time"
    },
    "vus": {
      "values": {
        "value": 1,
        "min": 1,
        "max": 20
      },
      "type": "gauge",
      "contains": "default"
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 200,
        "rate": 4.2114120746948
      }
    },
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 1430.608729,
        "max": 6115.146848,
        "p(90)": 4050.23017,
        "p(95)": 5014.710815,
        "avg": 1790.1113613482569,
        "min": 3.72265
      }
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0.8996505242136795,
        "passes": 1802,
        "fails": 201
      }
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 20,
        "min": 20,
        "max": 20
      }
    },
    "race_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 12176,
        "p(90)": 7905.4,
        "p(95)": 9956.349999999997,
        "avg": 3634.63,
        "min": 148,
        "med": 3172.5
      },
      "thresholds": {
        "p(95)<2000": {
          "ok": false
        }
      }
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 2003,
        "rate": 42.17729192806842
      }
    },
    "booking_unexpected": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 230,
        "rate": 4.84312388589902
      }
    },
    "booking_success": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 198,
        "rate": 4.1692979539478525
      },
      "thresholds": {
        "count==200": {
          "ok": false
        }
      }
    },
    "http_req_tls_handshaking": {
      "contains": "time",
      "values": {
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0
      },
      "type": "trend"
    },
    "iteration_duration": {
      "values": {
        "p(95)": 9956.524151149997,
        "avg": 3634.939839555,
        "min": 148.348396,
        "med": 3172.9357849999997,
        "max": 12175.60025,
        "p(90)": 7905.910149599999
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_duration": {
      "values": {
        "med": 1679.538269,
        "max": 10060.558705,
        "p(90)": 3211.567727,
        "p(95)": 5011.1518719,
        "avg": 1817.184870793313,
        "min": 3.72265
      },
      "type": "trend",
      "contains": "time"
    },
    "booking_conflict": {
      "contains": "default",
      "values": {
        "count": 1572,
        "rate": 33.10169890710113
      },
      "thresholds": {
        "count==1800": {
          "ok": false
        }
      },
      "type": "counter"
    },
    "http_req_blocked": {
      "values": {
        "avg": 0.03441292061907139,
        "min": 0.004191,
        "med": 0.008521,
        "max": 3.283196,
        "p(90)": 0.05295519999999997,
        "p(95)": 0.1565889
      },
      "type": "trend",
      "contains": "time"
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "rate": 10835.47895580113,
        "count": 514577
      }
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.01076999700449326,
        "min": 0,
        "med": 0,
        "max": 1.365507,
        "p(90)": 0,
        "p(95)": 0.09580409999999996
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 3211.4719299999997,
        "p(95)": 5011.0439222,
        "avg": 1817.0800490349493,
        "min": 3.530232,
        "med": 1679.469194,
        "max": 10060.446747
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 1008971,
        "rate": 21245.963262084435
      }
    }
  },
  "setup_data": {
    "memberIds": [
      "cmv7m0yni0000m6ajycty4i5g",
      "cmv7m0yoc0007m6aj5d6b9swh",
      "cmv7m0yoc0006m6ajltfalgb3",
      "cmv7m0ynt0001m6aj9463ongt",
      "cmv7m0yo80003m6aji2w1bj1s",
      "cmv7m0yox000ym6ajy8n7r3f6",
      "cmv7m0yox000xm6ajxe01izbx",
      "cmv7m0yon000lm6aj87l8mn85",
      "cmv7m0yod0008m6aji49lc7o6",
      "cmv7m0yoc0005m6aj0kw6mkr5"
    ],
    "sessionTypeId": "cmv7m0yvv0011m6aj607la6iv",
    "slots": [
      "2026-11-13T09:30:00.000Z",
      "2026-11-13T10:30:00.000Z",
      "2026-11-16T03:30:00.000Z",
      "2026-11-16T04:30:00.000Z",
      "2026-11-16T05:30:00.000Z",
      "2026-11-16T06:30:00.000Z",
      "2026-11-16T07:30:00.000Z",
      "2026-11-16T08:30:00.000Z",
      "2026-11-16T09:30:00.000Z",
      "2026-11-16T10:30:00.000Z",
      "2026-11-17T03:30:00.000Z",
      "2026-11-17T04:30:00.000Z",
      "2026-11-17T05:30:00.000Z",
      "2026-11-17T06:30:00.000Z",
      "2026-11-17T07:30:00.000Z",
      "2026-11-17T08:30:00.000Z",
      "2026-11-17T09:30:00.000Z",
      "2026-11-17T10:30:00.000Z",
      "2026-11-18T03:30:00.000Z",
      "2026-11-18T04:30:00.000Z",
      "2026-11-18T05:30:00.000Z",
      "2026-11-18T06:30:00.000Z",
      "2026-11-18T07:30:00.000Z",
      "2026-11-18T08:30:00.000Z",
      "2026-11-18T09:30:00.000Z",
      "2026-11-18T10:30:00.000Z",
      "2026-11-19T03:30:00.000Z",
      "2026-11-19T04:30:00.000Z",
      "2026-11-19T05:30:00.000Z",
      "2026-11-19T06:30:00.000Z",
      "2026-11-19T07:30:00.000Z",
      "2026-11-19T08:30:00.000Z",
      "2026-11-19T09:30:00.000Z",
      "2026-11-19T10:30:00.000Z",
      "2026-11-20T03:30:00.000Z",
      "2026-11-20T04:30:00.000Z",
      "2026-11-20T05:30:00.000Z",
      "2026-11-20T06:30:00.000Z",
      "2026-11-20T07:30:00.000Z",
      "2026-11-20T08:30:00.000Z",
      "2026-11-20T09:30:00.000Z",
      "2026-11-20T10:30:00.000Z",
      "2026-11-23T03:30:00.000Z",
      "2026-11-23T04:30:00.000Z",
      "2026-11-23T05:30:00.000Z",
      "2026-11-23T06:30:00.000Z",
      "2026-11-23T07:30:00.000Z",
      "2026-11-23T08:30:00.000Z",
      "2026-11-23T09:30:00.000Z",
      "2026-11-23T10:30:00.000Z",
      "2026-11-24T03:30:00.000Z",
      "2026-11-24T04:30:00.000Z",
      "2026-11-24T05:30:00.000Z",
      "2026-11-24T06:30:00.000Z",
      "2026-11-24T07:30:00.000Z",
      "2026-11-24T08:30:00.000Z",
      "2026-11-24T09:30:00.000Z",
      "2026-11-24T10:30:00.000Z",
      "2026-11-25T03:30:00.000Z",
      "2026-11-25T04:30:00.000Z",
      "2026-11-25T05:30:00.000Z",
      "2026-11-25T06:30:00.000Z",
      "2026-11-25T07:30:00.000Z",
      "2026-11-25T08:30:00.000Z",
      "2026-11-25T09:30:00.000Z",
      "2026-11-25T10:30:00.000Z",
      "2026-11-26T03:30:00.000Z",
      "2026-11-26T04:30:00.000Z",
      "2026-11-26T05:30:00.000Z",
      "2026-11-26T06:30:00.000Z",
      "2026-11-26T07:30:00.000Z",
      "2026-11-26T08:30:00.000Z",
      "2026-11-26T09:30:00.000Z",
      "2026-11-26T10:30:00.000Z",
      "2026-11-27T03:30:00.000Z",
      "2026-11-27T04:30:00.000Z",
      "2026-11-27T05:30:00.000Z",
      "2026-11-27T06:30:00.000Z",
      "2026-11-27T07:30:00.000Z",
      "2026-11-27T08:30:00.000Z",
      "2026-11-27T09:30:00.000Z",
      "2026-11-27T10:30:00.000Z",
      "2026-11-30T03:30:00.000Z",
      "2026-11-30T04:30:00.000Z",
      "2026-11-30T05:30:00.000Z",
      "2026-11-30T06:30:00.000Z",
      "2026-11-30T07:30:00.000Z",
      "2026-11-30T08:30:00.000Z",
      "2026-11-30T09:30:00.000Z",
      "2026-11-30T10:30:00.000Z",
      "2026-12-01T03:30:00.000Z",
      "2026-12-01T04:30:00.000Z",
      "2026-12-01T05:30:00.000Z",
      "2026-12-01T06:30:00.000Z",
      "2026-12-01T07:30:00.000Z",
      "2026-12-01T08:30:00.000Z",
      "2026-12-01T09:30:00.000Z",
      "2026-12-01T10:30:00.000Z",
      "2026-12-02T03:30:00.000Z",
      "2026-12-02T04:30:00.000Z",
      "2026-12-02T05:30:00.000Z",
      "2026-12-02T06:30:00.000Z",
      "2026-12-02T07:30:00.000Z",
      "2026-12-02T08:30:00.000Z",
      "2026-12-02T09:30:00.000Z",
      "2026-12-02T10:30:00.000Z",
      "2026-12-03T03:30:00.000Z",
      "2026-12-03T04:30:00.000Z",
      "2026-12-03T05:30:00.000Z",
      "2026-12-03T06:30:00.000Z",
      "2026-12-03T07:30:00.000Z",
      "2026-12-03T08:30:00.000Z",
      "2026-12-03T09:30:00.000Z",
      "2026-12-03T10:30:00.000Z",
      "2026-12-04T03:30:00.000Z",
      "2026-12-04T04:30:00.000Z",
      "2026-12-04T05:30:00.000Z",
      "2026-12-04T06:30:00.000Z",
      "2026-12-04T07:30:00.000Z",
      "2026-12-04T08:30:00.000Z",
      "2026-12-04T09:30:00.000Z",
      "2026-12-04T10:30:00.000Z",
      "2026-12-07T03:30:00.000Z",
      "2026-12-07T04:30:00.000Z",
      "2026-12-07T05:30:00.000Z",
      "2026-12-07T06:30:00.000Z",
      "2026-12-07T07:30:00.000Z",
      "2026-12-07T08:30:00.000Z",
      "2026-12-07T09:30:00.000Z",
      "2026-12-07T10:30:00.000Z",
      "2026-12-08T03:30:00.000Z",
      "2026-12-08T04:30:00.000Z",
      "2026-12-08T05:30:00.000Z",
      "2026-12-08T06:30:00.000Z",
      "2026-12-08T07:30:00.000Z",
      "2026-12-08T08:30:00.000Z",
      "2026-12-08T09:30:00.000Z",
      "2026-12-08T10:30:00.000Z",
      "2026-12-09T03:30:00.000Z",
      "2026-12-09T04:30:00.000Z",
      "2026-12-09T05:30:00.000Z",
      "2026-12-09T06:30:00.000Z",
      "2026-12-09T07:30:00.000Z",
      "2026-12-09T08:30:00.000Z",
      "2026-12-09T09:30:00.000Z",
      "2026-12-09T10:30:00.000Z",
      "2026-12-10T03:30:00.000Z",
      "2026-12-10T04:30:00.000Z",
      "2026-12-10T05:30:00.000Z",
      "2026-12-10T06:30:00.000Z",
      "2026-12-10T07:30:00.000Z",
      "2026-12-10T08:30:00.000Z",
      "2026-12-10T09:30:00.000Z",
      "2026-12-10T10:30:00.000Z",
      "2026-12-11T03:30:00.000Z",
      "2026-12-11T04:30:00.000Z",
      "2026-12-11T05:30:00.000Z",
      "2026-12-11T06:30:00.000Z",
      "2026-12-11T07:30:00.000Z",
      "2026-12-11T08:30:00.000Z",
      "2026-12-11T09:30:00.000Z",
      "2026-12-11T10:30:00.000Z",
      "2026-12-14T03:30:00.000Z",
      "2026-12-14T04:30:00.000Z",
      "2026-12-14T05:30:00.000Z",
      "2026-12-14T06:30:00.000Z",
      "2026-12-14T07:30:00.000Z",
      "2026-12-14T08:30:00.000Z",
      "2026-12-14T09:30:00.000Z",
      "2026-12-14T10:30:00.000Z",
      "2026-12-15T03:30:00.000Z",
      "2026-12-15T04:30:00.000Z",
      "2026-12-15T05:30:00.000Z",
      "2026-12-15T06:30:00.000Z",
      "2026-12-15T07:30:00.000Z",
      "2026-12-15T08:30:00.000Z",
      "2026-12-15T09:30:00.000Z",
      "2026-12-15T10:30:00.000Z",
      "2026-12-16T03:30:00.000Z",
      "2026-12-16T04:30:00.000Z",
      "2026-12-16T05:30:00.000Z",
      "2026-12-16T06:30:00.000Z",
      "2026-12-16T07:30:00.000Z",
      "2026-12-16T08:30:00.000Z",
      "2026-12-16T09:30:00.000Z",
      "2026-12-16T10:30:00.000Z",
      "2026-12-17T03:30:00.000Z",
      "2026-12-17T04:30:00.000Z",
      "2026-12-17T05:30:00.000Z",
      "2026-12-17T06:30:00.000Z",
      "2026-12-17T07:30:00.000Z",
      "2026-12-17T08:30:00.000Z",
      "2026-12-17T09:30:00.000Z",
      "2026-12-17T10:30:00.000Z",
      "2026-12-18T03:30:00.000Z",
      "2026-12-18T04:30:00.000Z",
      "2026-12-18T05:30:00.000Z",
      "2026-12-18T06:30:00.000Z",
      "2026-12-18T07:30:00.000Z",
      "2026-12-18T08:30:00.000Z"
    ]
  },
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "noColor": false,
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": ""
  }
}
````

## File: apps/api/performance/results/baseline/feed-read-2026-10-14T04-41-58-072Z.json
````json
{
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 30035.203374
  },
  "metrics": {
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "rate": 93731.9772716116,
        "count": 2815259
      }
    },
    "data_received": {
      "contains": "data",
      "values": {
        "rate": 5034192.681075335,
        "count": 151203001
      },
      "type": "counter"
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 32.551371,
        "max": 82.088087,
        "p(90)": 38.8526881,
        "p(95)": 41.30025255,
        "avg": 33.21851093068266,
        "min": 2.359308
      }
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0,
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0
      }
    },
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 20,
        "min": 20,
        "max": 20
      }
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 17932
      },
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 33.13461271960725,
        "min": 2.222346,
        "med": 32.469864,
        "max": 81.952241,
        "p(90)": 38.7668634,
        "p(95)": 41.184386450000005
      }
    },
    "feed_pages": {
      "values": {
        "count": 17931,
        "rate": 596.9994534986896
      },
      "type": "counter",
      "contains": "default"
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 33.47109256288014,
        "min": 20.270638,
        "med": 32.793623,
        "max": 82.525655,
        "p(90)": 39.114656,
        "p(95)": 41.6191685
      }
    },
    "feed_items": {
      "thresholds": {
        "avg>0": {
          "ok": true
        }
      },
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 20,
        "p(90)": 20,
        "p(95)": 20,
        "avg": 20,
        "min": 20,
        "med": 20
      }
    },
    "http_req_receiving": {
      "contains": "time",
      "values": {
        "min": 0.020604,
        "med": 0.0488905,
        "max": 2.03775,
        "p(90)": 0.11327909999999997,
        "p(95)": 0.1456165500000001,
        "avg": 0.06591824525986953
      },
      "type": "trend"
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0.006146,
        "med": 0.01341,
        "max": 1.375705,
        "p(90)": 0.02661,
        "p(95)": 0.034324600000000045,
        "avg": 0.01797996581530223
      }
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 17931,
        "rate": 596.9994534986896
      }
    },
    "vus_max": {
      "contains": "default",
      "values": {
        "value": 20,
        "min": 20,
        "max": 20
      },
      "type": "gauge"
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 17932,
        "rate": 597.0327477630084
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.008219617443676,
        "min": 0.003771,
        "med": 0.006565,
        "max": 1.679313,
        "p(90)": 0.009917,
        "p(95)": 0.011384
      }
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0,
        "avg": 0.0003589073722953379,
        "min": 0,
        "med": 0,
        "max": 0.677829,
        "p(90)": 0
      }
    },
    "http_req_duration{expected_response:true}": {
      "contains": "time",
      "values": {
        "min": 2.359308,
        "med": 32.551371,
        "max": 82.088087,
        "p(90)": 38.8526881,
        "p(95)": 41.30025255,
        "avg": 33.21851093068266
      },
      "type": "trend"
    }
  },
  "setup_data": {
    "viewerId": "cmv7m0yni0000m6ajycty4i5g"
  },
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "noColor": false,
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": ""
  }
}
````

## File: apps/api/performance/results/baseline/hold-expiry-2026-10-14T04-41-23-767Z.json
````json
{
  "metrics": {
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 321889,
        "rate": 10488.632267451701
      }
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 1251,
        "rate": 40.76336552843396
      }
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 0.02717,
        "max": 0.459639,
        "p(90)": 0.039113,
        "p(95)": 0.0465505,
        "avg": 0.02943167865707432,
        "min": 0.008172
      }
    },
    "http_req_failed": {
      "contains": "default",
      "values": {
        "rate": 0.920863309352518,
        "passes": 1152,
        "fails": 99
      },
      "type": "rate"
    },
    "data_received": {
      "contains": "data",
      "values": {
        "count": 625999,
        "rate": 20397.94249195374
      },
      "type": "counter"
    },
    "hold_claim_attempts": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 1200,
        "rate": 39.10154966756255
      }
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 8,
        "min": 8,
        "max": 8
      }
    },
    "hold_release_latency": {
      "thresholds": {
        "p(95)<10000": {
          "ok": true
        }
      },
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 5142.7,
        "p(95)": 5160,
        "avg": 5103.583333333333,
        "min": 5062,
        "med": 5100,
        "max": 5161
      }
    },
    "http_req_blocked": {
      "values": {
        "p(95)": 0.0144225,
        "avg": 0.012369547561950437,
        "min": 0.005168,
        "med": 0.009639,
        "max": 0.523965,
        "p(90)": 0.012852
      },
      "type": "trend",
      "contains": "time"
    },
    "hold_claimed": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 48,
        "rate": 1.5640619867025018
      },
      "thresholds": {
        "count==48": {
          "ok": true
        }
      }
    },
    "http_req_duration{expected_response:true}": {
      "values": {
        "p(95)": 28.7479574,
        "avg": 20.386691878787875,
        "min": 2.351276,
        "med": 20.236833,
        "max": 38.964559,
        "p(90)": 26.961839400000002
      },
      "type": "trend",
      "contains": "time"
    },
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "max": 8,
        "value": 8,
        "min": 8
      }
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 0.296834,
        "p(90)": 0.101552,
        "p(95)": 0.1121335,
        "avg": 0.06478086330935251,
        "min": 0.01795,
        "med": 0.065583
      }
    },
    "hold_release_latency_past_ttl": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 62,
        "med": 100,
        "max": 161,
        "p(90)": 142.70000000000007,
        "p(95)": 160,
        "avg": 103.58333333333333
      }
    },
    "hold_claim_failed": {
      "contains": "default",
      "values": {
        "rate": 0,
        "count": 0
      },
      "thresholds": {
        "count==0": {
          "ok": true
        }
      },
      "type": "counter"
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 0.208063,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0.0012101726618705035,
        "min": 0,
        "med": 0
      }
    },
    "hold_created": {
      "contains": "default",
      "values": {
        "count": 48,
        "rate": 1.5640619867025018
      },
      "type": "counter"
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 48,
        "rate": 1.5640619867025018
      }
    },
    "http_req_duration": {
      "values": {
        "min": 2.351276,
        "med": 9.778768,
        "max": 38.964559,
        "p(90)": 14.507442,
        "p(95)": 20.064599,
        "avg": 10.942362243804956
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 10.84814970183854,
        "min": 2.196783,
        "med": 9.695515,
        "max": 38.849388,
        "p(90)": 14.454222,
        "p(95)": 19.9841745
      }
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0
      }
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 5103.606484833334,
        "min": 5062.808824,
        "med": 5100.379930499999,
        "max": 5160.469476,
        "p(90)": 5142.430391899999,
        "p(95)": 5160.23147845
      }
    }
  },
  "setup_data": {
    "holder": "cmv7m0yni0000m6ajycty4i5g",
    "rival": "cmv7m0yoc0007m6aj5d6b9swh",
    "sessionTypeId": "cmv7m0yvv0011m6aj607la6iv",
    "slots": [
      "2027-02-11T05:30:00.000Z",
      "2027-02-11T06:30:00.000Z",
      "2027-02-11T07:30:00.000Z",
      "2027-02-11T08:30:00.000Z",
      "2027-02-11T09:30:00.000Z",
      "2027-02-11T10:30:00.000Z",
      "2027-02-12T03:30:00.000Z",
      "2027-02-12T04:30:00.000Z",
      "2027-02-12T05:30:00.000Z",
      "2027-02-12T06:30:00.000Z",
      "2027-02-12T07:30:00.000Z",
      "2027-02-12T08:30:00.000Z",
      "2027-02-12T09:30:00.000Z",
      "2027-02-12T10:30:00.000Z",
      "2027-02-15T03:30:00.000Z",
      "2027-02-15T04:30:00.000Z",
      "2027-02-15T05:30:00.000Z",
      "2027-02-15T06:30:00.000Z",
      "2027-02-15T07:30:00.000Z",
      "2027-02-15T08:30:00.000Z",
      "2027-02-15T09:30:00.000Z",
      "2027-02-15T10:30:00.000Z",
      "2027-02-16T03:30:00.000Z",
      "2027-02-16T04:30:00.000Z",
      "2027-02-16T05:30:00.000Z",
      "2027-02-16T06:30:00.000Z",
      "2027-02-16T07:30:00.000Z",
      "2027-02-16T08:30:00.000Z",
      "2027-02-16T09:30:00.000Z",
      "2027-02-16T10:30:00.000Z",
      "2027-02-17T03:30:00.000Z",
      "2027-02-17T04:30:00.000Z",
      "2027-02-17T05:30:00.000Z",
      "2027-02-17T06:30:00.000Z",
      "2027-02-17T07:30:00.000Z",
      "2027-02-17T08:30:00.000Z",
      "2027-02-17T09:30:00.000Z",
      "2027-02-17T10:30:00.000Z",
      "2027-02-18T03:30:00.000Z",
      "2027-02-18T04:30:00.000Z",
      "2027-02-18T05:30:00.000Z",
      "2027-02-18T06:30:00.000Z",
      "2027-02-18T07:30:00.000Z",
      "2027-02-18T08:30:00.000Z",
      "2027-02-18T09:30:00.000Z",
      "2027-02-18T10:30:00.000Z",
      "2027-02-19T03:30:00.000Z",
      "2027-02-19T04:30:00.000Z"
    ]
  },
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "testRunDurationMs": 30689.320761,
    "isStdOutTTY": false,
    "isStdErrTTY": false
  }
}
````

## File: apps/api/performance/results/baseline/manifest.md
````markdown
# Benchmark run baseline

- base URL: http://localhost:3001
- k6: k6 v2.3.0 (commit/e088784614, go1.26.8, linux/amd64)
- contention: VUS=20 ITER=10 RACERS=10
- feed-read: VUS=20 DURATION=30s
- slot-lookup: VUS=10 DURATION=20s counts=0 400 800 1200
````

## File: apps/api/performance/results/baseline/reschedule-idempotency-2026-10-14T04-40-52-695Z.json
````json
{
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 926.899029
  },
  "metrics": {
    "reschedule_replay_mismatch": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 0,
        "rate": 0
      },
      "thresholds": {
        "count==0": {
          "ok": true
        }
      }
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 114.334756,
        "p(90)": 94.8382499,
        "p(95)": 103.40925825,
        "avg": 87.78179399999999,
        "min": 71.351759,
        "med": 87.9255175
      }
    },
    "reschedule_replay_ok": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 100,
        "rate": 107.8866164180651
      },
      "thresholds": {
        "count==100": {
          "ok": true
        }
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 0.011384799999999999,
        "p(95)": 0.019437199999999988,
        "avg": 0.02154698679867989,
        "min": 0.004749,
        "med": 0.008242,
        "max": 0.626285
      }
    },
    "reschedule_first_ok": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 100,
        "rate": 107.8866164180651
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 81877,
        "rate": 88334.32492461917
      }
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 303,
        "rate": 326.89644774673724
      }
    },
    "http_req_tls_handshaking": {
      "contains": "time",
      "values": {
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0
      },
      "type": "trend"
    },
    "reschedule_first_duration": {
      "values": {
        "min": 38,
        "med": 47,
        "max": 58,
        "p(90)": 53,
        "p(95)": 54,
        "avg": 47.75
      },
      "type": "trend",
      "contains": "time"
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 100,
        "rate": 107.8866164180651
      }
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.08852978877887788,
        "min": 0.025843,
        "med": 0.089888,
        "max": 0.45468,
        "p(90)": 0.1268082,
        "p(95)": 0.14771209999999999
      }
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 57.765412,
        "p(90)": 49.256187000000004,
        "p(95)": 51.805224599999995,
        "avg": 28.82693964356435,
        "min": 3.92366,
        "med": 28.190104
      }
    },
    "http_req_duration{expected_response:true}": {
      "contains": "time",
      "values": {
        "max": 57.765412,
        "p(90)": 49.256187000000004,
        "p(95)": 51.805224599999995,
        "avg": 28.82693964356435,
        "min": 3.92366,
        "med": 28.190104
      },
      "type": "trend"
    },
    "http_req_connecting": {
      "contains": "time",
      "values": {
        "avg": 0.008889699669966996,
        "min": 0,
        "med": 0,
        "max": 0.565382,
        "p(90)": 0,
        "p(95)": 0
      },
      "type": "trend"
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 51.62672619999999,
        "avg": 28.702804023102313,
        "min": 3.657417,
        "med": 28.055586,
        "max": 57.623979,
        "p(90)": 49.1195866
      }
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 303
      }
    },
    "data_received": {
      "values": {
        "count": 420561,
        "rate": 453729.0328739788
      },
      "type": "counter",
      "contains": "data"
    },
    "reschedule_replay_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 20,
        "p(90)": 14,
        "p(95)": 16,
        "avg": 10.33,
        "min": 6,
        "med": 10
      },
      "thresholds": {
        "p(95)<500": {
          "ok": true
        }
      }
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0.009988,
        "med": 0.025912,
        "max": 1.4628,
        "p(90)": 0.0500078,
        "p(95)": 0.05935259999999995,
        "avg": 0.03560583168316828
      }
    }
  },
  "setup_data": {
    "slots": [
      "2026-12-18T09:30:00.000Z",
      "2026-12-18T10:30:00.000Z",
      "2026-12-21T03:30:00.000Z",
      "2026-12-21T04:30:00.000Z",
      "2026-12-21T05:30:00.000Z",
      "2026-12-21T06:30:00.000Z",
      "2026-12-21T07:30:00.000Z",
      "2026-12-21T08:30:00.000Z",
      "2026-12-21T09:30:00.000Z",
      "2026-12-21T10:30:00.000Z",
      "2026-12-22T03:30:00.000Z",
      "2026-12-22T04:30:00.000Z",
      "2026-12-22T05:30:00.000Z",
      "2026-12-22T06:30:00.000Z",
      "2026-12-22T07:30:00.000Z",
      "2026-12-22T08:30:00.000Z",
      "2026-12-22T09:30:00.000Z",
      "2026-12-22T10:30:00.000Z",
      "2026-12-23T03:30:00.000Z",
      "2026-12-23T04:30:00.000Z",
      "2026-12-23T05:30:00.000Z",
      "2026-12-23T06:30:00.000Z",
      "2026-12-23T07:30:00.000Z",
      "2026-12-23T08:30:00.000Z",
      "2026-12-23T09:30:00.000Z",
      "2026-12-23T10:30:00.000Z",
      "2026-12-24T03:30:00.000Z",
      "2026-12-24T04:30:00.000Z",
      "2026-12-24T05:30:00.000Z",
      "2026-12-24T06:30:00.000Z",
      "2026-12-24T07:30:00.000Z",
      "2026-12-24T08:30:00.000Z",
      "2026-12-24T09:30:00.000Z",
      "2026-12-24T10:30:00.000Z",
      "2026-12-25T03:30:00.000Z",
      "2026-12-25T04:30:00.000Z",
      "2026-12-25T05:30:00.000Z",
      "2026-12-25T06:30:00.000Z",
      "2026-12-25T07:30:00.000Z",
      "2026-12-25T08:30:00.000Z",
      "2026-12-25T09:30:00.000Z",
      "2026-12-25T10:30:00.000Z",
      "2026-12-28T03:30:00.000Z",
      "2026-12-28T04:30:00.000Z",
      "2026-12-28T05:30:00.000Z",
      "2026-12-28T06:30:00.000Z",
      "2026-12-28T07:30:00.000Z",
      "2026-12-28T08:30:00.000Z",
      "2026-12-28T09:30:00.000Z",
      "2026-12-28T10:30:00.000Z",
      "2026-12-29T03:30:00.000Z",
      "2026-12-29T04:30:00.000Z",
      "2026-12-29T05:30:00.000Z",
      "2026-12-29T06:30:00.000Z",
      "2026-12-29T07:30:00.000Z",
      "2026-12-29T08:30:00.000Z",
      "2026-12-29T09:30:00.000Z",
      "2026-12-29T10:30:00.000Z",
      "2026-12-30T03:30:00.000Z",
      "2026-12-30T04:30:00.000Z",
      "2026-12-30T05:30:00.000Z",
      "2026-12-30T06:30:00.000Z",
      "2026-12-30T07:30:00.000Z",
      "2026-12-30T08:30:00.000Z",
      "2026-12-30T09:30:00.000Z",
      "2026-12-30T10:30:00.000Z",
      "2026-12-31T03:30:00.000Z",
      "2026-12-31T04:30:00.000Z",
      "2026-12-31T05:30:00.000Z",
      "2026-12-31T06:30:00.000Z",
      "2026-12-31T07:30:00.000Z",
      "2026-12-31T08:30:00.000Z",
      "2026-12-31T09:30:00.000Z",
      "2026-12-31T10:30:00.000Z",
      "2027-01-01T03:30:00.000Z",
      "2027-01-01T04:30:00.000Z",
      "2027-01-01T05:30:00.000Z",
      "2027-01-01T06:30:00.000Z",
      "2027-01-01T07:30:00.000Z",
      "2027-01-01T08:30:00.000Z",
      "2027-01-01T09:30:00.000Z",
      "2027-01-01T10:30:00.000Z",
      "2027-01-04T03:30:00.000Z",
      "2027-01-04T04:30:00.000Z",
      "2027-01-04T05:30:00.000Z",
      "2027-01-04T06:30:00.000Z",
      "2027-01-04T07:30:00.000Z",
      "2027-01-04T08:30:00.000Z",
      "2027-01-04T09:30:00.000Z",
      "2027-01-04T10:30:00.000Z",
      "2027-01-05T03:30:00.000Z",
      "2027-01-05T04:30:00.000Z",
      "2027-01-05T05:30:00.000Z",
      "2027-01-05T06:30:00.000Z",
      "2027-01-05T07:30:00.000Z",
      "2027-01-05T08:30:00.000Z",
      "2027-01-05T09:30:00.000Z",
      "2027-01-05T10:30:00.000Z",
      "2027-01-06T03:30:00.000Z",
      "2027-01-06T04:30:00.000Z",
      "2027-01-06T05:30:00.000Z",
      "2027-01-06T06:30:00.000Z",
      "2027-01-06T07:30:00.000Z",
      "2027-01-06T08:30:00.000Z",
      "2027-01-06T09:30:00.000Z",
      "2027-01-06T10:30:00.000Z",
      "2027-01-07T03:30:00.000Z",
      "2027-01-07T04:30:00.000Z",
      "2027-01-07T05:30:00.000Z",
      "2027-01-07T06:30:00.000Z",
      "2027-01-07T07:30:00.000Z",
      "2027-01-07T08:30:00.000Z",
      "2027-01-07T09:30:00.000Z",
      "2027-01-07T10:30:00.000Z",
      "2027-01-08T03:30:00.000Z",
      "2027-01-08T04:30:00.000Z",
      "2027-01-08T05:30:00.000Z",
      "2027-01-08T06:30:00.000Z",
      "2027-01-08T07:30:00.000Z",
      "2027-01-08T08:30:00.000Z",
      "2027-01-08T09:30:00.000Z",
      "2027-01-08T10:30:00.000Z",
      "2027-01-11T03:30:00.000Z",
      "2027-01-11T04:30:00.000Z",
      "2027-01-11T05:30:00.000Z",
      "2027-01-11T06:30:00.000Z",
      "2027-01-11T07:30:00.000Z",
      "2027-01-11T08:30:00.000Z",
      "2027-01-11T09:30:00.000Z",
      "2027-01-11T10:30:00.000Z",
      "2027-01-12T03:30:00.000Z",
      "2027-01-12T04:30:00.000Z",
      "2027-01-12T05:30:00.000Z",
      "2027-01-12T06:30:00.000Z",
      "2027-01-12T07:30:00.000Z",
      "2027-01-12T08:30:00.000Z",
      "2027-01-12T09:30:00.000Z",
      "2027-01-12T10:30:00.000Z",
      "2027-01-13T03:30:00.000Z",
      "2027-01-13T04:30:00.000Z",
      "2027-01-13T05:30:00.000Z",
      "2027-01-13T06:30:00.000Z",
      "2027-01-13T07:30:00.000Z",
      "2027-01-13T08:30:00.000Z",
      "2027-01-13T09:30:00.000Z",
      "2027-01-13T10:30:00.000Z",
      "2027-01-14T03:30:00.000Z",
      "2027-01-14T04:30:00.000Z",
      "2027-01-14T05:30:00.000Z",
      "2027-01-14T06:30:00.000Z",
      "2027-01-14T07:30:00.000Z",
      "2027-01-14T08:30:00.000Z",
      "2027-01-14T09:30:00.000Z",
      "2027-01-14T10:30:00.000Z",
      "2027-01-15T03:30:00.000Z",
      "2027-01-15T04:30:00.000Z",
      "2027-01-15T05:30:00.000Z",
      "2027-01-15T06:30:00.000Z",
      "2027-01-15T07:30:00.000Z",
      "2027-01-15T08:30:00.000Z",
      "2027-01-15T09:30:00.000Z",
      "2027-01-15T10:30:00.000Z",
      "2027-01-18T03:30:00.000Z",
      "2027-01-18T04:30:00.000Z",
      "2027-01-18T05:30:00.000Z",
      "2027-01-18T06:30:00.000Z",
      "2027-01-18T07:30:00.000Z",
      "2027-01-18T08:30:00.000Z",
      "2027-01-18T09:30:00.000Z",
      "2027-01-18T10:30:00.000Z",
      "2027-01-19T03:30:00.000Z",
      "2027-01-19T04:30:00.000Z",
      "2027-01-19T05:30:00.000Z",
      "2027-01-19T06:30:00.000Z",
      "2027-01-19T07:30:00.000Z",
      "2027-01-19T08:30:00.000Z",
      "2027-01-19T09:30:00.000Z",
      "2027-01-19T10:30:00.000Z",
      "2027-01-20T03:30:00.000Z",
      "2027-01-20T04:30:00.000Z",
      "2027-01-20T05:30:00.000Z",
      "2027-01-20T06:30:00.000Z",
      "2027-01-20T07:30:00.000Z",
      "2027-01-20T08:30:00.000Z",
      "2027-01-20T09:30:00.000Z",
      "2027-01-20T10:30:00.000Z",
      "2027-01-21T03:30:00.000Z",
      "2027-01-21T04:30:00.000Z",
      "2027-01-21T05:30:00.000Z",
      "2027-01-21T06:30:00.000Z",
      "2027-01-21T07:30:00.000Z",
      "2027-01-21T08:30:00.000Z",
      "2027-01-21T09:30:00.000Z",
      "2027-01-21T10:30:00.000Z",
      "2027-01-22T03:30:00.000Z",
      "2027-01-22T04:30:00.000Z",
      "2027-01-22T05:30:00.000Z",
      "2027-01-22T06:30:00.000Z",
      "2027-01-22T07:30:00.000Z",
      "2027-01-22T08:30:00.000Z"
    ],
    "memberIds": [
      "cmv7m0yni0000m6ajycty4i5g",
      "cmv7m0yoc0007m6aj5d6b9swh",
      "cmv7m0yoc0006m6ajltfalgb3",
      "cmv7m0ynt0001m6aj9463ongt",
      "cmv7m0yo80003m6aji2w1bj1s",
      "cmv7m0yox000ym6ajy8n7r3f6",
      "cmv7m0yox000xm6ajxe01izbx",
      "cmv7m0yon000lm6aj87l8mn85",
      "cmv7m0yod0008m6aji49lc7o6",
      "cmv7m0yoc0005m6aj0kw6mkr5",
      "cmv7m0yos000qm6ajcl1lnc9v",
      "cmv7m0yoe000am6aj4yev8jp5",
      "cmv7m0yox000zm6ajp2w6u51u",
      "cmv7m0yoi000gm6ajqyj07yae",
      "cmv7m0yoi000em6aj2hhx9fkz",
      "cmv7m0yoi000hm6ajryo75i61",
      "cmv7m0yoi000fm6aj4ysx2n9g",
      "cmv7m0yok000jm6ajirp6l8xb",
      "cmv7m0yol000km6ajk0yp14i1",
      "cmv7m0yo90004m6ajrioueemc"
    ],
    "sessionTypeId": "cmv7m0yvv0011m6aj607la6iv"
  },
  "root_group": {
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": [],
    "name": "",
    "path": ""
  },
  "options": {
    "noColor": false,
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": ""
  }
}
````

## File: apps/api/performance/results/baseline/seed-0.json
````json
/home/harsha/tangerine/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @tangerine/api@0.1.0 perf:seed-bookings: `ts-node --compiler-options {"module":"CommonJS"} performance/seed-bookings.ts`
Exit status 1
````

## File: apps/api/performance/results/baseline/seed-1200.json
````json
/home/harsha/tangerine/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @tangerine/api@0.1.0 perf:seed-bookings: `ts-node --compiler-options {"module":"CommonJS"} performance/seed-bookings.ts`
Exit status 1
````

## File: apps/api/performance/results/baseline/seed-400.json
````json
/home/harsha/tangerine/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @tangerine/api@0.1.0 perf:seed-bookings: `ts-node --compiler-options {"module":"CommonJS"} performance/seed-bookings.ts`
Exit status 1
````

## File: apps/api/performance/results/baseline/seed-800.json
````json
/home/harsha/tangerine/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @tangerine/api@0.1.0 perf:seed-bookings: `ts-node --compiler-options {"module":"CommonJS"} performance/seed-bookings.ts`
Exit status 1
````

## File: apps/api/performance/results/baseline/slot-lookup-2026-10-14T04-42-00-066Z.json
````json
{
  "root_group": {
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": [],
    "name": ""
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "testRunDurationMs": 3.912136,
    "isStdOutTTY": false,
    "isStdErrTTY": false
  },
  "metrics": {
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.043373,
        "min": 0.043373,
        "med": 0.043373,
        "max": 0.043373,
        "p(90)": 0.043373,
        "p(95)": 0.043373
      }
    },
    "data_sent": {
      "values": {
        "count": 92,
        "rate": 23516.56486379819
      },
      "type": "counter",
      "contains": "data"
    },
    "data_received": {
      "values": {
        "count": 8809,
        "rate": 2251711.085708677
      },
      "type": "counter",
      "contains": "data"
    },
    "http_req_connecting": {
      "contains": "time",
      "values": {
        "min": 0.168393,
        "med": 0.168393,
        "max": 0.168393,
        "p(90)": 0.168393,
        "p(95)": 0.168393,
        "avg": 0.168393
      },
      "type": "trend"
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0.090587,
        "med": 0.090587,
        "max": 0.090587,
        "p(90)": 0.090587,
        "p(95)": 0.090587,
        "avg": 0.090587
      }
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 1
      },
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      }
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 1,
        "rate": 255.6148354760673
      }
    },
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 2.556826,
        "min": 2.556826,
        "med": 2.556826,
        "max": 2.556826,
        "p(90)": 2.556826,
        "p(95)": 2.556826
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0.518028,
        "avg": 0.518028,
        "min": 0.518028,
        "med": 0.518028,
        "max": 0.518028,
        "p(90)": 0.518028
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 2.422866,
        "max": 2.422866,
        "p(90)": 2.422866,
        "p(95)": 2.422866,
        "avg": 2.422866,
        "min": 2.422866
      }
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 2.556826,
        "avg": 2.556826,
        "min": 2.556826,
        "med": 2.556826,
        "max": 2.556826,
        "p(90)": 2.556826
      }
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0,
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0
      }
    }
  }
}
````

## File: apps/api/performance/results/baseline/slot-lookup-2026-10-14T04-42-01-690Z.json
````json
{
  "root_group": {
    "groups": [],
    "checks": [],
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e"
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 4.689982
  },
  "metrics": {
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "rate": 19616.279977193943,
        "count": 92
      }
    },
    "http_req_failed": {
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      },
      "type": "rate",
      "contains": "default",
      "values": {
        "passes": 0,
        "fails": 1,
        "rate": 0
      }
    },
    "http_reqs": {
      "contains": "default",
      "values": {
        "count": 1,
        "rate": 213.2204345347168
      },
      "type": "counter"
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 0.547223,
        "p(95)": 0.547223,
        "avg": 0.547223,
        "min": 0.547223,
        "med": 0.547223,
        "max": 0.547223
      }
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 0,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0,
        "min": 0,
        "med": 0
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 8809,
        "rate": 1878258.80781632
      }
    },
    "http_req_duration": {
      "contains": "time",
      "values": {
        "p(90)": 3.071781,
        "p(95)": 3.071781,
        "avg": 3.071781,
        "min": 3.071781,
        "med": 3.071781,
        "max": 3.071781
      },
      "type": "trend"
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.188927,
        "min": 0.188927,
        "med": 0.188927,
        "max": 0.188927,
        "p(90)": 0.188927,
        "p(95)": 0.188927
      }
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0.075221,
        "avg": 0.075221,
        "min": 0.075221,
        "med": 0.075221,
        "max": 0.075221,
        "p(90)": 0.075221
      }
    },
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 3.071781,
        "avg": 3.071781,
        "min": 3.071781,
        "med": 3.071781,
        "max": 3.071781,
        "p(90)": 3.071781
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 2.854708,
        "min": 2.854708,
        "med": 2.854708,
        "max": 2.854708,
        "p(90)": 2.854708,
        "p(95)": 2.854708
      }
    },
    "http_req_receiving": {
      "contains": "time",
      "values": {
        "avg": 0.141852,
        "min": 0.141852,
        "med": 0.141852,
        "max": 0.141852,
        "p(90)": 0.141852,
        "p(95)": 0.141852
      },
      "type": "trend"
    }
  }
}
````

## File: apps/api/performance/results/baseline/slot-lookup-2026-10-14T04-42-03-286Z.json
````json
{
  "options": {
    "summaryTimeUnit": "",
    "noColor": false,
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ]
  },
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 3.644496
  },
  "metrics": {
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.510066,
        "min": 0.510066,
        "med": 0.510066,
        "max": 0.510066,
        "p(90)": 0.510066,
        "p(95)": 0.510066
      }
    },
    "http_req_sending": {
      "values": {
        "med": 0.055176,
        "max": 0.055176,
        "p(90)": 0.055176,
        "p(95)": 0.055176,
        "avg": 0.055176,
        "min": 0.055176
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 2.068691,
        "p(90)": 2.068691,
        "p(95)": 2.068691,
        "avg": 2.068691,
        "min": 2.068691,
        "med": 2.068691
      }
    },
    "http_req_connecting": {
      "contains": "time",
      "values": {
        "p(95)": 0.147369,
        "avg": 0.147369,
        "min": 0.147369,
        "med": 0.147369,
        "max": 0.147369,
        "p(90)": 0.147369
      },
      "type": "trend"
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.107978,
        "min": 0.107978,
        "med": 0.107978,
        "max": 0.107978,
        "p(90)": 0.107978,
        "p(95)": 0.107978
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 92,
        "rate": 25243.54533521233
      }
    },
    "http_req_failed": {
      "contains": "default",
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 1
      },
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      },
      "type": "rate"
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "rate": 274.38636233926445,
        "count": 1
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 8809,
        "rate": 2417069.4658465805
      }
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 2.231845,
        "min": 2.231845,
        "med": 2.231845,
        "max": 2.231845,
        "p(90)": 2.231845,
        "p(95)": 2.231845
      }
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0
      }
    },
    "http_req_duration{expected_response:true}": {
      "contains": "time",
      "values": {
        "min": 2.231845,
        "med": 2.231845,
        "max": 2.231845,
        "p(90)": 2.231845,
        "p(95)": 2.231845,
        "avg": 2.231845
      },
      "type": "trend"
    }
  },
  "root_group": {
    "groups": [],
    "checks": [],
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e"
  }
}
````

## File: apps/api/performance/results/baseline/slot-lookup-2026-10-14T04-42-04-883Z.json
````json
{
  "metrics": {
    "http_req_tls_handshaking": {
      "values": {
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 0.036249,
        "p(95)": 0.036249,
        "avg": 0.036249,
        "min": 0.036249,
        "med": 0.036249,
        "max": 0.036249
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 3.024078,
        "p(95)": 3.024078,
        "avg": 3.024078,
        "min": 3.024078,
        "med": 3.024078,
        "max": 3.024078
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 92,
        "rate": 20431.722292030605
      }
    },
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 3.169492,
        "avg": 3.169492,
        "min": 3.169492,
        "med": 3.169492,
        "max": 3.169492,
        "p(90)": 3.169492
      }
    },
    "http_req_receiving": {
      "values": {
        "p(95)": 0.109165,
        "avg": 0.109165,
        "min": 0.109165,
        "med": 0.109165,
        "max": 0.109165,
        "p(90)": 0.109165
      },
      "type": "trend",
      "contains": "time"
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 8809,
        "rate": 1956337.4094619304
      }
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0.174189,
        "med": 0.174189,
        "max": 0.174189,
        "p(90)": 0.174189,
        "p(95)": 0.174189,
        "avg": 0.174189
      }
    },
    "http_req_failed": {
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 1
      },
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      },
      "type": "rate",
      "contains": "default"
    },
    "http_req_duration": {
      "values": {
        "p(95)": 3.169492,
        "avg": 3.169492,
        "min": 3.169492,
        "med": 3.169492,
        "max": 3.169492,
        "p(90)": 3.169492
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_blocked": {
      "values": {
        "avg": 0.510974,
        "min": 0.510974,
        "med": 0.510974,
        "max": 0.510974,
        "p(90)": 0.510974,
        "p(95)": 0.510974
      },
      "type": "trend",
      "contains": "time"
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 1,
        "rate": 222.0839379568544
      }
    }
  },
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdErrTTY": false,
    "testRunDurationMs": 4.502802,
    "isStdOutTTY": false
  }
}
````

## File: apps/api/performance/results/contention-advisory/booking-contention-2026-10-14T05-05-36-232Z.json
````json
{
  "state": {
    "testRunDurationMs": 4553.700666,
    "isStdOutTTY": false,
    "isStdErrTTY": false
  },
  "metrics": {
    "race_duration": {
      "contains": "time",
      "values": {
        "min": 67,
        "med": 369,
        "max": 1831,
        "p(90)": 443.29999999999995,
        "p(95)": 1023.4499999999964,
        "avg": 398.68
      },
      "thresholds": {
        "p(95)<2000": {
          "ok": true
        }
      },
      "type": "trend"
    },
    "booking_conflict": {
      "type": "counter",
      "contains": "default",
      "values": {
        "rate": 395.2828989045368,
        "count": 1800
      },
      "thresholds": {
        "count==1800": {
          "ok": true
        }
      }
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 313.49179752870646,
        "min": 6.21858,
        "med": 297.292093,
        "max": 1805.879312,
        "p(90)": 397.0916822,
        "p(95)": 461.29931499999867
      }
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 2003,
        "rate": 439.86202583654847
      }
    },
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 6.504096,
        "med": 242.880404,
        "max": 1678.637455,
        "p(90)": 327.19799,
        "p(95)": 355.14477289999985,
        "avg": 245.21855312315284
      }
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0.8986520219670494,
        "passes": 1800,
        "fails": 203
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "rate": 113001.93792755547,
        "count": 514577
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 0.00901,
        "max": 25.343523,
        "p(90)": 0.15710439999999998,
        "p(95)": 0.3217089999999982,
        "avg": 0.3284609670494257,
        "min": 0.004749
      }
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 399.11255968499995,
        "min": 66.844727,
        "med": 369.1048995,
        "max": 1832.367416,
        "p(90)": 447.42616719999995,
        "p(95)": 1023.7013775999965
      }
    },
    "booking_success": {
      "values": {
        "count": 200,
        "rate": 43.92032210050409
      },
      "thresholds": {
        "count==200": {
          "ok": true
        }
      },
      "type": "counter",
      "contains": "default"
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 0,
        "max": 10.802284,
        "p(90)": 0.06419919999999635,
        "p(95)": 0.14968669999999965,
        "avg": 0.15988998302546187,
        "min": 0
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 1306066,
        "rate": 286814.19702258485
      }
    },
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "min": 14,
        "max": 20,
        "value": 14
      }
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 20,
        "min": 20,
        "max": 20
      }
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0.022909,
        "med": 0.081995,
        "max": 0.834549,
        "p(90)": 0.123482,
        "p(95)": 0.1382889,
        "avg": 0.08509611532700961
      }
    },
    "booking_unexpected": {
      "contains": "default",
      "values": {
        "count": 0,
        "rate": 0
      },
      "thresholds": {
        "count==0": {
          "ok": true
        }
      },
      "type": "counter"
    },
    "http_req_duration": {
      "values": {
        "med": 297.43094,
        "max": 1805.993015,
        "p(90)": 397.1785394,
        "p(95)": 461.40140509999867,
        "avg": 313.7828266989509,
        "min": 6.504096
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0.06206229999999977,
        "avg": 0.20593305491762431,
        "min": 0.008242,
        "med": 0.020604,
        "max": 23.576504,
        "p(90)": 0.039531
      }
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 200,
        "rate": 43.92032210050409
      }
    }
  },
  "setup_data": {
    "memberIds": [
      "cmv7m0yni0000m6ajycty4i5g",
      "cmv7m0ynt0001m6aj9463ongt",
      "cmv7m0yoc0006m6ajltfalgb3",
      "cmv7m0yoc0007m6aj5d6b9swh",
      "cmv7m0yo80003m6aji2w1bj1s",
      "cmv7m0yox000ym6ajy8n7r3f6",
      "cmv7m0yox000xm6ajxe01izbx",
      "cmv7m0yon000lm6aj87l8mn85",
      "cmv7m0yod0008m6aji49lc7o6",
      "cmv7m0yoc0005m6aj0kw6mkr5"
    ],
    "sessionTypeId": "cmv7m0yvv0011m6aj607la6iv",
    "slots": [
      "2027-10-14T05:30:00.000Z",
      "2027-10-14T06:30:00.000Z",
      "2027-10-14T07:30:00.000Z",
      "2027-10-14T08:30:00.000Z",
      "2027-10-14T09:30:00.000Z",
      "2027-10-14T10:30:00.000Z",
      "2027-10-15T03:30:00.000Z",
      "2027-10-15T04:30:00.000Z",
      "2027-10-15T05:30:00.000Z",
      "2027-10-15T06:30:00.000Z",
      "2027-10-15T07:30:00.000Z",
      "2027-10-15T08:30:00.000Z",
      "2027-10-15T09:30:00.000Z",
      "2027-10-15T10:30:00.000Z",
      "2027-10-18T03:30:00.000Z",
      "2027-10-18T04:30:00.000Z",
      "2027-10-18T05:30:00.000Z",
      "2027-10-18T06:30:00.000Z",
      "2027-10-18T07:30:00.000Z",
      "2027-10-18T08:30:00.000Z",
      "2027-10-18T09:30:00.000Z",
      "2027-10-18T10:30:00.000Z",
      "2027-10-19T03:30:00.000Z",
      "2027-10-19T04:30:00.000Z",
      "2027-10-19T05:30:00.000Z",
      "2027-10-19T06:30:00.000Z",
      "2027-10-19T07:30:00.000Z",
      "2027-10-19T08:30:00.000Z",
      "2027-10-19T09:30:00.000Z",
      "2027-10-19T10:30:00.000Z",
      "2027-10-20T03:30:00.000Z",
      "2027-10-20T04:30:00.000Z",
      "2027-10-20T05:30:00.000Z",
      "2027-10-20T06:30:00.000Z",
      "2027-10-20T07:30:00.000Z",
      "2027-10-20T08:30:00.000Z",
      "2027-10-20T09:30:00.000Z",
      "2027-10-20T10:30:00.000Z",
      "2027-10-21T03:30:00.000Z",
      "2027-10-21T04:30:00.000Z",
      "2027-10-21T05:30:00.000Z",
      "2027-10-21T06:30:00.000Z",
      "2027-10-21T07:30:00.000Z",
      "2027-10-21T08:30:00.000Z",
      "2027-10-21T09:30:00.000Z",
      "2027-10-21T10:30:00.000Z",
      "2027-10-22T03:30:00.000Z",
      "2027-10-22T04:30:00.000Z",
      "2027-10-22T05:30:00.000Z",
      "2027-10-22T06:30:00.000Z",
      "2027-10-22T07:30:00.000Z",
      "2027-10-22T08:30:00.000Z",
      "2027-10-22T09:30:00.000Z",
      "2027-10-22T10:30:00.000Z",
      "2027-10-25T03:30:00.000Z",
      "2027-10-25T04:30:00.000Z",
      "2027-10-25T05:30:00.000Z",
      "2027-10-25T06:30:00.000Z",
      "2027-10-25T07:30:00.000Z",
      "2027-10-25T08:30:00.000Z",
      "2027-10-25T09:30:00.000Z",
      "2027-10-25T10:30:00.000Z",
      "2027-10-26T03:30:00.000Z",
      "2027-10-26T04:30:00.000Z",
      "2027-10-26T05:30:00.000Z",
      "2027-10-26T06:30:00.000Z",
      "2027-10-26T07:30:00.000Z",
      "2027-10-26T08:30:00.000Z",
      "2027-10-26T09:30:00.000Z",
      "2027-10-26T10:30:00.000Z",
      "2027-10-27T03:30:00.000Z",
      "2027-10-27T04:30:00.000Z",
      "2027-10-27T05:30:00.000Z",
      "2027-10-27T06:30:00.000Z",
      "2027-10-27T07:30:00.000Z",
      "2027-10-27T08:30:00.000Z",
      "2027-10-27T09:30:00.000Z",
      "2027-10-27T10:30:00.000Z",
      "2027-10-28T03:30:00.000Z",
      "2027-10-28T04:30:00.000Z",
      "2027-10-28T05:30:00.000Z",
      "2027-10-28T06:30:00.000Z",
      "2027-10-28T07:30:00.000Z",
      "2027-10-28T08:30:00.000Z",
      "2027-10-28T09:30:00.000Z",
      "2027-10-28T10:30:00.000Z",
      "2027-10-29T03:30:00.000Z",
      "2027-10-29T04:30:00.000Z",
      "2027-10-29T05:30:00.000Z",
      "2027-10-29T06:30:00.000Z",
      "2027-10-29T07:30:00.000Z",
      "2027-10-29T08:30:00.000Z",
      "2027-10-29T09:30:00.000Z",
      "2027-10-29T10:30:00.000Z",
      "2027-11-01T03:30:00.000Z",
      "2027-11-01T04:30:00.000Z",
      "2027-11-01T05:30:00.000Z",
      "2027-11-01T06:30:00.000Z",
      "2027-11-01T07:30:00.000Z",
      "2027-11-01T08:30:00.000Z",
      "2027-11-01T09:30:00.000Z",
      "2027-11-01T10:30:00.000Z",
      "2027-11-02T03:30:00.000Z",
      "2027-11-02T04:30:00.000Z",
      "2027-11-02T05:30:00.000Z",
      "2027-11-02T06:30:00.000Z",
      "2027-11-02T07:30:00.000Z",
      "2027-11-02T08:30:00.000Z",
      "2027-11-02T09:30:00.000Z",
      "2027-11-02T10:30:00.000Z",
      "2027-11-03T03:30:00.000Z",
      "2027-11-03T04:30:00.000Z",
      "2027-11-03T05:30:00.000Z",
      "2027-11-03T06:30:00.000Z",
      "2027-11-03T07:30:00.000Z",
      "2027-11-03T08:30:00.000Z",
      "2027-11-03T09:30:00.000Z",
      "2027-11-03T10:30:00.000Z",
      "2027-11-04T03:30:00.000Z",
      "2027-11-04T04:30:00.000Z",
      "2027-11-04T05:30:00.000Z",
      "2027-11-04T06:30:00.000Z",
      "2027-11-04T07:30:00.000Z",
      "2027-11-04T08:30:00.000Z",
      "2027-11-04T09:30:00.000Z",
      "2027-11-04T10:30:00.000Z",
      "2027-11-05T03:30:00.000Z",
      "2027-11-05T04:30:00.000Z",
      "2027-11-05T05:30:00.000Z",
      "2027-11-05T06:30:00.000Z",
      "2027-11-05T07:30:00.000Z",
      "2027-11-05T08:30:00.000Z",
      "2027-11-05T09:30:00.000Z",
      "2027-11-05T10:30:00.000Z",
      "2027-11-08T03:30:00.000Z",
      "2027-11-08T04:30:00.000Z",
      "2027-11-08T05:30:00.000Z",
      "2027-11-08T06:30:00.000Z",
      "2027-11-08T07:30:00.000Z",
      "2027-11-08T08:30:00.000Z",
      "2027-11-08T09:30:00.000Z",
      "2027-11-08T10:30:00.000Z",
      "2027-11-09T03:30:00.000Z",
      "2027-11-09T04:30:00.000Z",
      "2027-11-09T05:30:00.000Z",
      "2027-11-09T06:30:00.000Z",
      "2027-11-09T07:30:00.000Z",
      "2027-11-09T08:30:00.000Z",
      "2027-11-09T09:30:00.000Z",
      "2027-11-09T10:30:00.000Z",
      "2027-11-10T03:30:00.000Z",
      "2027-11-10T04:30:00.000Z",
      "2027-11-10T05:30:00.000Z",
      "2027-11-10T06:30:00.000Z",
      "2027-11-10T07:30:00.000Z",
      "2027-11-10T08:30:00.000Z",
      "2027-11-10T09:30:00.000Z",
      "2027-11-10T10:30:00.000Z",
      "2027-11-11T03:30:00.000Z",
      "2027-11-11T04:30:00.000Z",
      "2027-11-11T05:30:00.000Z",
      "2027-11-11T06:30:00.000Z",
      "2027-11-11T07:30:00.000Z",
      "2027-11-11T08:30:00.000Z",
      "2027-11-11T09:30:00.000Z",
      "2027-11-11T10:30:00.000Z",
      "2027-11-12T03:30:00.000Z",
      "2027-11-12T04:30:00.000Z",
      "2027-11-12T05:30:00.000Z",
      "2027-11-12T06:30:00.000Z",
      "2027-11-12T07:30:00.000Z",
      "2027-11-12T08:30:00.000Z",
      "2027-11-12T09:30:00.000Z",
      "2027-11-12T10:30:00.000Z",
      "2027-11-15T03:30:00.000Z",
      "2027-11-15T04:30:00.000Z",
      "2027-11-15T05:30:00.000Z",
      "2027-11-15T06:30:00.000Z",
      "2027-11-15T07:30:00.000Z",
      "2027-11-15T08:30:00.000Z",
      "2027-11-15T09:30:00.000Z",
      "2027-11-15T10:30:00.000Z",
      "2027-11-16T03:30:00.000Z",
      "2027-11-16T04:30:00.000Z",
      "2027-11-16T05:30:00.000Z",
      "2027-11-16T06:30:00.000Z",
      "2027-11-16T07:30:00.000Z",
      "2027-11-16T08:30:00.000Z",
      "2027-11-16T09:30:00.000Z",
      "2027-11-16T10:30:00.000Z",
      "2027-11-17T03:30:00.000Z",
      "2027-11-17T04:30:00.000Z",
      "2027-11-17T05:30:00.000Z",
      "2027-11-17T06:30:00.000Z",
      "2027-11-17T07:30:00.000Z",
      "2027-11-17T08:30:00.000Z",
      "2027-11-17T09:30:00.000Z",
      "2027-11-17T10:30:00.000Z",
      "2027-11-18T03:30:00.000Z",
      "2027-11-18T04:30:00.000Z"
    ]
  },
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  }
}
````

## File: apps/api/performance/results/final/booking-contention-2026-10-14T05-08-43-443Z.json
````json
{
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdErrTTY": false,
    "testRunDurationMs": 4742.974803,
    "isStdOutTTY": false
  },
  "metrics": {
    "http_req_duration{expected_response:true}": {
      "contains": "time",
      "values": {
        "avg": 256.51263584236443,
        "min": 4.483904,
        "med": 281.00601,
        "max": 987.414192,
        "p(90)": 361.03100179999996,
        "p(95)": 389.7711399
      },
      "type": "trend"
    },
    "booking_conflict": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 1800,
        "rate": 379.5086574909641
      },
      "thresholds": {
        "count==1800": {
          "ok": true
        }
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 496.0437101999999,
        "avg": 336.37534348477294,
        "min": 4.34366,
        "med": 339.243612,
        "max": 1581.928993,
        "p(90)": 450.7448094
      }
    },
    "http_req_duration": {
      "values": {
        "min": 4.483904,
        "med": 339.367024,
        "max": 1582.060926,
        "p(90)": 450.88172879999996,
        "p(95)": 496.1571063999999,
        "avg": 336.5981459435848
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0.8986520219670494,
        "passes": 1800,
        "fails": 203
      }
    },
    "booking_success": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 200,
        "rate": 42.16762861010712
      },
      "thresholds": {
        "count==200": {
          "ok": true
        }
      }
    },
    "http_req_sending": {
      "contains": "time",
      "values": {
        "p(90)": 0.05109639999999998,
        "p(95)": 0.36808539999999734,
        "avg": 0.13675751972041936,
        "min": 0.008731,
        "med": 0.020744,
        "max": 7.011653
      },
      "type": "trend"
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.15921049725411895,
        "min": 0,
        "med": 0,
        "max": 8.100222,
        "p(90)": 0.0633615999999964,
        "p(95)": 0.7084772999999933
      }
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 423.1248520749998,
        "min": 72.808271,
        "med": 398.7518005,
        "max": 1590.189783,
        "p(90)": 514.8931994999999,
        "p(95)": 886.9111109499993
      }
    },
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 17,
        "min": 17,
        "max": 20
      }
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 20,
        "min": 20,
        "max": 20
      }
    },
    "race_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 515.5,
        "p(95)": 886.0499999999993,
        "avg": 422.92,
        "min": 72,
        "med": 398.5,
        "max": 1588
      },
      "thresholds": {
        "p(95)<2000": {
          "ok": true
        }
      }
    },
    "booking_unexpected": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 0,
        "rate": 0
      },
      "thresholds": {
        "count==0": {
          "ok": true
        }
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 1306207,
        "rate": 275398.25831961096
      }
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 200,
        "rate": 42.16762861010712
      }
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 2003,
        "rate": 422.30880053022287
      }
    },
    "http_req_receiving": {
      "values": {
        "p(95)": 0.1338111,
        "avg": 0.0860449390913631,
        "min": 0.026331,
        "med": 0.083811,
        "max": 1.424304,
        "p(90)": 0.121107
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.24869648177733397,
        "min": 0.004819,
        "med": 0.009079,
        "max": 9.444136,
        "p(90)": 0.16510879999999983,
        "p(95)": 1.468478999999998
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 514577,
        "rate": 108492.45913651546
      }
    }
  },
  "setup_data": {
    "memberIds": [
      "cmv7m0yni0000m6ajycty4i5g",
      "cmv7m0ynt0001m6aj9463ongt",
      "cmv7m0yoc0006m6ajltfalgb3",
      "cmv7m0yoc0007m6aj5d6b9swh",
      "cmv7m0yo80003m6aji2w1bj1s",
      "cmv7m0yox000ym6ajy8n7r3f6",
      "cmv7m0yox000xm6ajxe01izbx",
      "cmv7m0yon000lm6aj87l8mn85",
      "cmv7m0yod0008m6aji49lc7o6",
      "cmv7m0yoc0005m6aj0kw6mkr5"
    ],
    "sessionTypeId": "cmv7m0yvv0011m6aj607la6iv",
    "slots": [
      "2027-10-14T05:30:00.000Z",
      "2027-10-14T06:30:00.000Z",
      "2027-10-14T07:30:00.000Z",
      "2027-10-14T08:30:00.000Z",
      "2027-10-14T09:30:00.000Z",
      "2027-10-14T10:30:00.000Z",
      "2027-10-15T03:30:00.000Z",
      "2027-10-15T04:30:00.000Z",
      "2027-10-15T05:30:00.000Z",
      "2027-10-15T06:30:00.000Z",
      "2027-10-15T07:30:00.000Z",
      "2027-10-15T08:30:00.000Z",
      "2027-10-15T09:30:00.000Z",
      "2027-10-15T10:30:00.000Z",
      "2027-10-18T03:30:00.000Z",
      "2027-10-18T04:30:00.000Z",
      "2027-10-18T05:30:00.000Z",
      "2027-10-18T06:30:00.000Z",
      "2027-10-18T07:30:00.000Z",
      "2027-10-18T08:30:00.000Z",
      "2027-10-18T09:30:00.000Z",
      "2027-10-18T10:30:00.000Z",
      "2027-10-19T03:30:00.000Z",
      "2027-10-19T04:30:00.000Z",
      "2027-10-19T05:30:00.000Z",
      "2027-10-19T06:30:00.000Z",
      "2027-10-19T07:30:00.000Z",
      "2027-10-19T08:30:00.000Z",
      "2027-10-19T09:30:00.000Z",
      "2027-10-19T10:30:00.000Z",
      "2027-10-20T03:30:00.000Z",
      "2027-10-20T04:30:00.000Z",
      "2027-10-20T05:30:00.000Z",
      "2027-10-20T06:30:00.000Z",
      "2027-10-20T07:30:00.000Z",
      "2027-10-20T08:30:00.000Z",
      "2027-10-20T09:30:00.000Z",
      "2027-10-20T10:30:00.000Z",
      "2027-10-21T03:30:00.000Z",
      "2027-10-21T04:30:00.000Z",
      "2027-10-21T05:30:00.000Z",
      "2027-10-21T06:30:00.000Z",
      "2027-10-21T07:30:00.000Z",
      "2027-10-21T08:30:00.000Z",
      "2027-10-21T09:30:00.000Z",
      "2027-10-21T10:30:00.000Z",
      "2027-10-22T03:30:00.000Z",
      "2027-10-22T04:30:00.000Z",
      "2027-10-22T05:30:00.000Z",
      "2027-10-22T06:30:00.000Z",
      "2027-10-22T07:30:00.000Z",
      "2027-10-22T08:30:00.000Z",
      "2027-10-22T09:30:00.000Z",
      "2027-10-22T10:30:00.000Z",
      "2027-10-25T03:30:00.000Z",
      "2027-10-25T04:30:00.000Z",
      "2027-10-25T05:30:00.000Z",
      "2027-10-25T06:30:00.000Z",
      "2027-10-25T07:30:00.000Z",
      "2027-10-25T08:30:00.000Z",
      "2027-10-25T09:30:00.000Z",
      "2027-10-25T10:30:00.000Z",
      "2027-10-26T03:30:00.000Z",
      "2027-10-26T04:30:00.000Z",
      "2027-10-26T05:30:00.000Z",
      "2027-10-26T06:30:00.000Z",
      "2027-10-26T07:30:00.000Z",
      "2027-10-26T08:30:00.000Z",
      "2027-10-26T09:30:00.000Z",
      "2027-10-26T10:30:00.000Z",
      "2027-10-27T03:30:00.000Z",
      "2027-10-27T04:30:00.000Z",
      "2027-10-27T05:30:00.000Z",
      "2027-10-27T06:30:00.000Z",
      "2027-10-27T07:30:00.000Z",
      "2027-10-27T08:30:00.000Z",
      "2027-10-27T09:30:00.000Z",
      "2027-10-27T10:30:00.000Z",
      "2027-10-28T03:30:00.000Z",
      "2027-10-28T04:30:00.000Z",
      "2027-10-28T05:30:00.000Z",
      "2027-10-28T06:30:00.000Z",
      "2027-10-28T07:30:00.000Z",
      "2027-10-28T08:30:00.000Z",
      "2027-10-28T09:30:00.000Z",
      "2027-10-28T10:30:00.000Z",
      "2027-10-29T03:30:00.000Z",
      "2027-10-29T04:30:00.000Z",
      "2027-10-29T05:30:00.000Z",
      "2027-10-29T06:30:00.000Z",
      "2027-10-29T07:30:00.000Z",
      "2027-10-29T08:30:00.000Z",
      "2027-10-29T09:30:00.000Z",
      "2027-10-29T10:30:00.000Z",
      "2027-11-01T03:30:00.000Z",
      "2027-11-01T04:30:00.000Z",
      "2027-11-01T05:30:00.000Z",
      "2027-11-01T06:30:00.000Z",
      "2027-11-01T07:30:00.000Z",
      "2027-11-01T08:30:00.000Z",
      "2027-11-01T09:30:00.000Z",
      "2027-11-01T10:30:00.000Z",
      "2027-11-02T03:30:00.000Z",
      "2027-11-02T04:30:00.000Z",
      "2027-11-02T05:30:00.000Z",
      "2027-11-02T06:30:00.000Z",
      "2027-11-02T07:30:00.000Z",
      "2027-11-02T08:30:00.000Z",
      "2027-11-02T09:30:00.000Z",
      "2027-11-02T10:30:00.000Z",
      "2027-11-03T03:30:00.000Z",
      "2027-11-03T04:30:00.000Z",
      "2027-11-03T05:30:00.000Z",
      "2027-11-03T06:30:00.000Z",
      "2027-11-03T07:30:00.000Z",
      "2027-11-03T08:30:00.000Z",
      "2027-11-03T09:30:00.000Z",
      "2027-11-03T10:30:00.000Z",
      "2027-11-04T03:30:00.000Z",
      "2027-11-04T04:30:00.000Z",
      "2027-11-04T05:30:00.000Z",
      "2027-11-04T06:30:00.000Z",
      "2027-11-04T07:30:00.000Z",
      "2027-11-04T08:30:00.000Z",
      "2027-11-04T09:30:00.000Z",
      "2027-11-04T10:30:00.000Z",
      "2027-11-05T03:30:00.000Z",
      "2027-11-05T04:30:00.000Z",
      "2027-11-05T05:30:00.000Z",
      "2027-11-05T06:30:00.000Z",
      "2027-11-05T07:30:00.000Z",
      "2027-11-05T08:30:00.000Z",
      "2027-11-05T09:30:00.000Z",
      "2027-11-05T10:30:00.000Z",
      "2027-11-08T03:30:00.000Z",
      "2027-11-08T04:30:00.000Z",
      "2027-11-08T05:30:00.000Z",
      "2027-11-08T06:30:00.000Z",
      "2027-11-08T07:30:00.000Z",
      "2027-11-08T08:30:00.000Z",
      "2027-11-08T09:30:00.000Z",
      "2027-11-08T10:30:00.000Z",
      "2027-11-09T03:30:00.000Z",
      "2027-11-09T04:30:00.000Z",
      "2027-11-09T05:30:00.000Z",
      "2027-11-09T06:30:00.000Z",
      "2027-11-09T07:30:00.000Z",
      "2027-11-09T08:30:00.000Z",
      "2027-11-09T09:30:00.000Z",
      "2027-11-09T10:30:00.000Z",
      "2027-11-10T03:30:00.000Z",
      "2027-11-10T04:30:00.000Z",
      "2027-11-10T05:30:00.000Z",
      "2027-11-10T06:30:00.000Z",
      "2027-11-10T07:30:00.000Z",
      "2027-11-10T08:30:00.000Z",
      "2027-11-10T09:30:00.000Z",
      "2027-11-10T10:30:00.000Z",
      "2027-11-11T03:30:00.000Z",
      "2027-11-11T04:30:00.000Z",
      "2027-11-11T05:30:00.000Z",
      "2027-11-11T06:30:00.000Z",
      "2027-11-11T07:30:00.000Z",
      "2027-11-11T08:30:00.000Z",
      "2027-11-11T09:30:00.000Z",
      "2027-11-11T10:30:00.000Z",
      "2027-11-12T03:30:00.000Z",
      "2027-11-12T04:30:00.000Z",
      "2027-11-12T05:30:00.000Z",
      "2027-11-12T06:30:00.000Z",
      "2027-11-12T07:30:00.000Z",
      "2027-11-12T08:30:00.000Z",
      "2027-11-12T09:30:00.000Z",
      "2027-11-12T10:30:00.000Z",
      "2027-11-15T03:30:00.000Z",
      "2027-11-15T04:30:00.000Z",
      "2027-11-15T05:30:00.000Z",
      "2027-11-15T06:30:00.000Z",
      "2027-11-15T07:30:00.000Z",
      "2027-11-15T08:30:00.000Z",
      "2027-11-15T09:30:00.000Z",
      "2027-11-15T10:30:00.000Z",
      "2027-11-16T03:30:00.000Z",
      "2027-11-16T04:30:00.000Z",
      "2027-11-16T05:30:00.000Z",
      "2027-11-16T06:30:00.000Z",
      "2027-11-16T07:30:00.000Z",
      "2027-11-16T08:30:00.000Z",
      "2027-11-16T09:30:00.000Z",
      "2027-11-16T10:30:00.000Z",
      "2027-11-17T03:30:00.000Z",
      "2027-11-17T04:30:00.000Z",
      "2027-11-17T05:30:00.000Z",
      "2027-11-17T06:30:00.000Z",
      "2027-11-17T07:30:00.000Z",
      "2027-11-17T08:30:00.000Z",
      "2027-11-17T09:30:00.000Z",
      "2027-11-17T10:30:00.000Z",
      "2027-11-18T03:30:00.000Z",
      "2027-11-18T04:30:00.000Z"
    ]
  }
}
````

## File: apps/api/performance/results/final/feed-read-2026-10-14T05-09-50-405Z.json
````json
{
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 30032.359759
  },
  "metrics": {
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 133125005,
        "rate": 4432718.7762894835
      }
    },
    "http_req_sending": {
      "contains": "time",
      "values": {
        "max": 0.752626,
        "p(90)": 0.02633,
        "p(95)": 0.034362,
        "avg": 0.018097936217380237,
        "min": 0.005867,
        "med": 0.013759
      },
      "type": "trend"
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.06588679547757781,
        "min": 0.019137,
        "med": 0.049588,
        "max": 3.419991,
        "p(90)": 0.112936,
        "p(95)": 0.14210549999999997
      }
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 101.662507,
        "p(90)": 44.4148642,
        "p(95)": 47.78346559999999,
        "avg": 38.01681753626397,
        "min": 21.435793,
        "med": 37.234088
      }
    },
    "http_req_tls_handshaking": {
      "values": {
        "p(95)": 0,
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0
      },
      "type": "trend",
      "contains": "time"
    },
    "feed_items": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 20,
        "avg": 20,
        "min": 20,
        "med": 20,
        "max": 20,
        "p(90)": 20
      },
      "thresholds": {
        "avg>0": {
          "ok": true
        }
      }
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0,
        "avg": 0.00035150519381808984,
        "min": 0,
        "med": 0,
        "max": 0.69284,
        "p(90)": 0
      }
    },
    "feed_pages": {
      "contains": "default",
      "values": {
        "count": 15787,
        "rate": 525.6663188202853
      },
      "type": "counter"
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 37.76643194578154,
        "min": 2.2606,
        "med": 36.9879945,
        "max": 101.069052,
        "p(90)": 44.1546317,
        "p(95)": 47.49793124999999
      }
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 15787,
        "rate": 525.6663188202853
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 0.009918,
        "p(95)": 0.011524,
        "avg": 0.008396785533316279,
        "min": 0.003772,
        "med": 0.006635,
        "max": 1.308225
      }
    },
    "http_reqs": {
      "contains": "default",
      "values": {
        "count": 15788,
        "rate": 525.6996162370725
      },
      "type": "counter"
    },
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 37.76643194578154,
        "min": 2.2606,
        "med": 36.9879945,
        "max": 101.069052,
        "p(90)": 44.1546317,
        "p(95)": 47.49793124999999
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 2478651,
        "rate": 82532.67541712923
      }
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 15788
      },
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      }
    },
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 20,
        "min": 20,
        "max": 20
      }
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "min": 20,
        "max": 20,
        "value": 20
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 47.39888075,
        "avg": 37.68244721408685,
        "min": 2.011541,
        "med": 36.91382350000001,
        "max": 100.705731,
        "p(90)": 44.0791139
      }
    }
  },
  "setup_data": {
    "viewerId": "cmv7m0yni0000m6ajycty4i5g"
  }
}
````

## File: apps/api/performance/results/final/hold-expiry-2026-10-14T05-09-16-123Z.json
````json
{
  "root_group": {
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": [],
    "name": "",
    "path": ""
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 31081.883398
  },
  "metrics": {
    "hold_release_latency": {
      "thresholds": {
        "p(95)<10000": {
          "ok": true
        }
      },
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 5128.583333333333,
        "min": 5059,
        "med": 5116,
        "max": 5290,
        "p(90)": 5190,
        "p(95)": 5234.2
      }
    },
    "hold_claim_failed": {
      "type": "counter",
      "contains": "default",
      "values": {
        "rate": 0,
        "count": 0
      },
      "thresholds": {
        "count==0": {
          "ok": true
        }
      }
    },
    "http_req_tls_handshaking": {
      "values": {
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0
      },
      "type": "trend",
      "contains": "time"
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 1254,
        "rate": 40.345045502638044
      }
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 48,
        "rate": 1.5443079618234659
      }
    },
    "hold_created": {
      "type": "counter",
      "contains": "default",
      "values": {
        "rate": 1.5443079618234659,
        "count": 48
      }
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 2.259902,
        "med": 10.502464499999999,
        "max": 35.21206,
        "p(90)": 15.2754831,
        "p(95)": 19.980343999999995,
        "avg": 11.427561079744834
      }
    },
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 20.120583818181814,
        "min": 2.259902,
        "med": 20.201457,
        "max": 35.21206,
        "p(90)": 27.612096400000002,
        "p(95)": 30.750712299999996
      }
    },
    "hold_claim_attempts": {
      "type": "counter",
      "contains": "default",
      "values": {
        "rate": 38.70421829320061,
        "count": 1203
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.012718251993620429,
        "min": 0.004749,
        "med": 0.010058,
        "max": 0.445597,
        "p(90)": 0.01348,
        "p(95)": 0.015530149999999994
      }
    },
    "http_req_waiting": {
      "contains": "time",
      "values": {
        "avg": 11.326939067783096,
        "min": 2.016151,
        "med": 10.403812,
        "max": 33.876387,
        "p(90)": 15.163211200000003,
        "p(95)": 19.869866099999996
      },
      "type": "trend"
    },
    "http_req_receiving": {
      "values": {
        "max": 1.304663,
        "p(90)": 0.102599,
        "p(95)": 0.1155445,
        "avg": 0.06989923125996819,
        "min": 0.019136,
        "med": 0.069843
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0.9210526315789473,
        "passes": 1155,
        "fails": 99
      }
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 8,
        "min": 8,
        "max": 8
      }
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.030722780701754358,
        "min": 0.008101,
        "med": 0.028077,
        "max": 0.195769,
        "p(90)": 0.042793,
        "p(95)": 0.052965149999999996
      }
    },
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 1,
        "min": 1,
        "max": 8
      }
    },
    "hold_claimed": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 48,
        "rate": 1.5443079618234659
      },
      "thresholds": {
        "count==48": {
          "ok": true
        }
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 913888,
        "rate": 29402.594054477573
      }
    },
    "iteration_duration": {
      "values": {
        "p(95)": 5234.0209402499995,
        "avg": 5128.673368125,
        "min": 5058.549774,
        "med": 5115.9201545,
        "max": 5290.31463,
        "p(90)": 5189.8401109999995
      },
      "type": "trend",
      "contains": "time"
    },
    "hold_release_latency_past_ttl": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 128.58333333333334,
        "min": 59,
        "med": 116,
        "max": 290,
        "p(90)": 190,
        "p(95)": 234.1999999999999
      }
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 0.246685,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0.0013905629984051035,
        "min": 0,
        "med": 0
      }
    },
    "data_sent": {
      "contains": "data",
      "values": {
        "rate": 10380.966811707489,
        "count": 322660
      },
      "type": "counter"
    }
  },
  "setup_data": {
    "slots": [
      "2027-11-18T06:30:00.000Z",
      "2027-11-18T08:30:00.000Z",
      "2027-11-18T10:30:00.000Z",
      "2027-11-19T04:30:00.000Z",
      "2027-11-19T06:30:00.000Z",
      "2027-11-19T08:30:00.000Z",
      "2027-11-19T10:30:00.000Z",
      "2027-11-22T04:30:00.000Z",
      "2027-11-22T06:30:00.000Z",
      "2027-11-22T08:30:00.000Z",
      "2027-11-22T10:30:00.000Z",
      "2027-11-23T04:30:00.000Z",
      "2027-11-23T06:30:00.000Z",
      "2027-11-23T08:30:00.000Z",
      "2027-11-23T10:30:00.000Z",
      "2027-11-24T04:30:00.000Z",
      "2027-11-24T06:30:00.000Z",
      "2027-11-24T08:30:00.000Z",
      "2027-11-24T10:30:00.000Z",
      "2027-11-25T04:30:00.000Z",
      "2027-11-25T06:30:00.000Z",
      "2027-11-25T08:30:00.000Z",
      "2027-11-25T10:30:00.000Z",
      "2027-11-26T04:30:00.000Z",
      "2027-11-26T06:30:00.000Z",
      "2027-11-26T08:30:00.000Z",
      "2027-11-26T10:30:00.000Z",
      "2027-11-29T04:30:00.000Z",
      "2027-11-29T06:30:00.000Z",
      "2027-11-29T08:30:00.000Z",
      "2027-11-29T10:30:00.000Z",
      "2027-11-30T04:30:00.000Z",
      "2027-11-30T06:30:00.000Z",
      "2027-11-30T08:30:00.000Z",
      "2027-11-30T10:30:00.000Z",
      "2027-12-01T04:30:00.000Z",
      "2027-12-01T06:30:00.000Z",
      "2027-12-01T08:30:00.000Z",
      "2027-12-01T10:30:00.000Z",
      "2027-12-02T04:30:00.000Z",
      "2027-12-02T06:30:00.000Z",
      "2027-12-02T08:30:00.000Z",
      "2027-12-02T10:30:00.000Z",
      "2027-12-03T04:30:00.000Z",
      "2027-12-03T06:30:00.000Z",
      "2027-12-03T08:30:00.000Z",
      "2027-12-03T10:30:00.000Z",
      "2027-12-06T04:30:00.000Z"
    ],
    "holder": "cmv7m0yni0000m6ajycty4i5g",
    "rival": "cmv7m0ynt0001m6aj9463ongt",
    "sessionTypeId": "cmv7m0yvv0011m6aj607la6iv"
  }
}
````

## File: apps/api/performance/results/final/manifest.md
````markdown
# Benchmark run final

- base URL: http://localhost:3001
- k6: k6 v2.3.0 (commit/e088784614, go1.26.8, linux/amd64)
- contention: VUS=20 ITER=10 RACERS=10
- feed-read: VUS=20 DURATION=30s
- slot-lookup: VUS=10 DURATION=20s counts=0 400 800 1200
````

## File: apps/api/performance/results/final/reschedule-idempotency-2026-10-14T05-08-44-644Z.json
````json
{
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "noColor": false,
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": ""
  },
  "state": {
    "testRunDurationMs": 744.24433,
    "isStdOutTTY": false,
    "isStdErrTTY": false
  },
  "metrics": {
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 3.973145,
        "med": 17.245571,
        "max": 53.94619,
        "p(90)": 39.031284600000006,
        "p(95)": 43.74446929999999,
        "avg": 21.978909561056117
      }
    },
    "data_sent": {
      "values": {
        "count": 81877,
        "rate": 110013.6026565362
      },
      "type": "counter",
      "contains": "data"
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "rate": 134.36447678412276,
        "count": 100
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 53.760268,
        "p(90)": 38.949555000000004,
        "p(95)": 43.408895599999994,
        "avg": 21.865743092409236,
        "min": 3.829408,
        "med": 17.118109
      }
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0,
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0
      }
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0,
        "avg": 0.011503996699669969,
        "min": 0,
        "med": 0,
        "max": 0.59513,
        "p(90)": 0
      }
    },
    "reschedule_replay_mismatch": {
      "thresholds": {
        "count==0": {
          "ok": true
        }
      },
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 0,
        "rate": 0
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0.014855999999999994,
        "avg": 0.029081983498349815,
        "min": 0.003702,
        "med": 0.007683,
        "max": 1.094645,
        "p(90)": 0.011566000000000002
      }
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 66.78357354000002,
        "min": 49.120405,
        "med": 65.245385,
        "max": 90.422893,
        "p(90)": 80.8622931,
        "p(95)": 86.66765124999999
      }
    },
    "reschedule_replay_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 29.049999999999997,
        "avg": 16.32,
        "min": 8,
        "med": 15,
        "max": 35,
        "p(90)": 24.10000000000001
      },
      "thresholds": {
        "p(95)<500": {
          "ok": true
        }
      }
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 0.04041100000000001,
        "p(95)": 0.05447749999999995,
        "avg": 0.02948724752475246,
        "min": 0.008521,
        "med": 0.022279,
        "max": 0.463965
      }
    },
    "reschedule_first_ok": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 100,
        "rate": 134.36447678412276
      }
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 39.031284600000006,
        "p(95)": 43.74446929999999,
        "avg": 21.978909561056117,
        "min": 3.973145,
        "med": 17.245571,
        "max": 53.94619
      }
    },
    "reschedule_replay_ok": {
      "contains": "default",
      "values": {
        "count": 100,
        "rate": 134.36447678412276
      },
      "thresholds": {
        "count==100": {
          "ok": true
        }
      },
      "type": "counter"
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "fails": 303,
        "rate": 0,
        "passes": 0
      }
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 303,
        "rate": 407.12436465589195
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 718111,
        "rate": 964886.0878792318
      }
    },
    "http_req_receiving": {
      "contains": "time",
      "values": {
        "p(90)": 0.124181,
        "p(95)": 0.1452308999999999,
        "avg": 0.08367922112211222,
        "min": 0.020953,
        "med": 0.070122,
        "max": 1.167142
      },
      "type": "trend"
    },
    "reschedule_first_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 13,
        "max": 32,
        "p(90)": 22,
        "p(95)": 24,
        "avg": 14.47,
        "min": 5
      }
    }
  },
  "setup_data": {
    "memberIds": [
      "cmv7m0yni0000m6ajycty4i5g",
      "cmv7m0ynt0001m6aj9463ongt",
      "cmv7m0yoc0006m6ajltfalgb3",
      "cmv7m0yoc0007m6aj5d6b9swh",
      "cmv7m0yo80003m6aji2w1bj1s",
      "cmv7m0yox000ym6ajy8n7r3f6",
      "cmv7m0yox000xm6ajxe01izbx",
      "cmv7m0yon000lm6aj87l8mn85",
      "cmv7m0yod0008m6aji49lc7o6",
      "cmv7m0yoc0005m6aj0kw6mkr5",
      "cmv7m0yos000qm6ajcl1lnc9v",
      "cmv7m0yoe000am6aj4yev8jp5",
      "cmv7m0yox000zm6ajp2w6u51u",
      "cmv7m0yoi000gm6ajqyj07yae",
      "cmv7m0yoi000em6aj2hhx9fkz",
      "cmv7m0yoi000hm6ajryo75i61",
      "cmv7m0yoi000fm6aj4ysx2n9g",
      "cmv7m0yok000jm6ajirp6l8xb",
      "cmv7m0yol000km6ajk0yp14i1",
      "cmv7m0yo90004m6ajrioueemc"
    ],
    "sessionTypeId": "cmv7m0yvv0011m6aj607la6iv",
    "slots": [
      "2027-11-18T05:30:00.000Z",
      "2027-11-18T06:30:00.000Z",
      "2027-11-18T07:30:00.000Z",
      "2027-11-18T08:30:00.000Z",
      "2027-11-18T09:30:00.000Z",
      "2027-11-18T10:30:00.000Z",
      "2027-11-19T03:30:00.000Z",
      "2027-11-19T04:30:00.000Z",
      "2027-11-19T05:30:00.000Z",
      "2027-11-19T06:30:00.000Z",
      "2027-11-19T07:30:00.000Z",
      "2027-11-19T08:30:00.000Z",
      "2027-11-19T09:30:00.000Z",
      "2027-11-19T10:30:00.000Z",
      "2027-11-22T03:30:00.000Z",
      "2027-11-22T04:30:00.000Z",
      "2027-11-22T05:30:00.000Z",
      "2027-11-22T06:30:00.000Z",
      "2027-11-22T07:30:00.000Z",
      "2027-11-22T08:30:00.000Z",
      "2027-11-22T09:30:00.000Z",
      "2027-11-22T10:30:00.000Z",
      "2027-11-23T03:30:00.000Z",
      "2027-11-23T04:30:00.000Z",
      "2027-11-23T05:30:00.000Z",
      "2027-11-23T06:30:00.000Z",
      "2027-11-23T07:30:00.000Z",
      "2027-11-23T08:30:00.000Z",
      "2027-11-23T09:30:00.000Z",
      "2027-11-23T10:30:00.000Z",
      "2027-11-24T03:30:00.000Z",
      "2027-11-24T04:30:00.000Z",
      "2027-11-24T05:30:00.000Z",
      "2027-11-24T06:30:00.000Z",
      "2027-11-24T07:30:00.000Z",
      "2027-11-24T08:30:00.000Z",
      "2027-11-24T09:30:00.000Z",
      "2027-11-24T10:30:00.000Z",
      "2027-11-25T03:30:00.000Z",
      "2027-11-25T04:30:00.000Z",
      "2027-11-25T05:30:00.000Z",
      "2027-11-25T06:30:00.000Z",
      "2027-11-25T07:30:00.000Z",
      "2027-11-25T08:30:00.000Z",
      "2027-11-25T09:30:00.000Z",
      "2027-11-25T10:30:00.000Z",
      "2027-11-26T03:30:00.000Z",
      "2027-11-26T04:30:00.000Z",
      "2027-11-26T05:30:00.000Z",
      "2027-11-26T06:30:00.000Z",
      "2027-11-26T07:30:00.000Z",
      "2027-11-26T08:30:00.000Z",
      "2027-11-26T09:30:00.000Z",
      "2027-11-26T10:30:00.000Z",
      "2027-11-29T03:30:00.000Z",
      "2027-11-29T04:30:00.000Z",
      "2027-11-29T05:30:00.000Z",
      "2027-11-29T06:30:00.000Z",
      "2027-11-29T07:30:00.000Z",
      "2027-11-29T08:30:00.000Z",
      "2027-11-29T09:30:00.000Z",
      "2027-11-29T10:30:00.000Z",
      "2027-11-30T03:30:00.000Z",
      "2027-11-30T04:30:00.000Z",
      "2027-11-30T05:30:00.000Z",
      "2027-11-30T06:30:00.000Z",
      "2027-11-30T07:30:00.000Z",
      "2027-11-30T08:30:00.000Z",
      "2027-11-30T09:30:00.000Z",
      "2027-11-30T10:30:00.000Z",
      "2027-12-01T03:30:00.000Z",
      "2027-12-01T04:30:00.000Z",
      "2027-12-01T05:30:00.000Z",
      "2027-12-01T06:30:00.000Z",
      "2027-12-01T07:30:00.000Z",
      "2027-12-01T08:30:00.000Z",
      "2027-12-01T09:30:00.000Z",
      "2027-12-01T10:30:00.000Z",
      "2027-12-02T03:30:00.000Z",
      "2027-12-02T04:30:00.000Z",
      "2027-12-02T05:30:00.000Z",
      "2027-12-02T06:30:00.000Z",
      "2027-12-02T07:30:00.000Z",
      "2027-12-02T08:30:00.000Z",
      "2027-12-02T09:30:00.000Z",
      "2027-12-02T10:30:00.000Z",
      "2027-12-03T03:30:00.000Z",
      "2027-12-03T04:30:00.000Z",
      "2027-12-03T05:30:00.000Z",
      "2027-12-03T06:30:00.000Z",
      "2027-12-03T07:30:00.000Z",
      "2027-12-03T08:30:00.000Z",
      "2027-12-03T09:30:00.000Z",
      "2027-12-03T10:30:00.000Z",
      "2027-12-06T03:30:00.000Z",
      "2027-12-06T04:30:00.000Z",
      "2027-12-06T05:30:00.000Z",
      "2027-12-06T06:30:00.000Z",
      "2027-12-06T07:30:00.000Z",
      "2027-12-06T08:30:00.000Z",
      "2027-12-06T09:30:00.000Z",
      "2027-12-06T10:30:00.000Z",
      "2027-12-07T03:30:00.000Z",
      "2027-12-07T04:30:00.000Z",
      "2027-12-07T05:30:00.000Z",
      "2027-12-07T06:30:00.000Z",
      "2027-12-07T07:30:00.000Z",
      "2027-12-07T08:30:00.000Z",
      "2027-12-07T09:30:00.000Z",
      "2027-12-07T10:30:00.000Z",
      "2027-12-08T03:30:00.000Z",
      "2027-12-08T04:30:00.000Z",
      "2027-12-08T05:30:00.000Z",
      "2027-12-08T06:30:00.000Z",
      "2027-12-08T07:30:00.000Z",
      "2027-12-08T08:30:00.000Z",
      "2027-12-08T09:30:00.000Z",
      "2027-12-08T10:30:00.000Z",
      "2027-12-09T03:30:00.000Z",
      "2027-12-09T04:30:00.000Z",
      "2027-12-09T05:30:00.000Z",
      "2027-12-09T06:30:00.000Z",
      "2027-12-09T07:30:00.000Z",
      "2027-12-09T08:30:00.000Z",
      "2027-12-09T09:30:00.000Z",
      "2027-12-09T10:30:00.000Z",
      "2027-12-10T03:30:00.000Z",
      "2027-12-10T04:30:00.000Z",
      "2027-12-10T05:30:00.000Z",
      "2027-12-10T06:30:00.000Z",
      "2027-12-10T07:30:00.000Z",
      "2027-12-10T08:30:00.000Z",
      "2027-12-10T09:30:00.000Z",
      "2027-12-10T10:30:00.000Z",
      "2027-12-13T03:30:00.000Z",
      "2027-12-13T04:30:00.000Z",
      "2027-12-13T05:30:00.000Z",
      "2027-12-13T06:30:00.000Z",
      "2027-12-13T07:30:00.000Z",
      "2027-12-13T08:30:00.000Z",
      "2027-12-13T09:30:00.000Z",
      "2027-12-13T10:30:00.000Z",
      "2027-12-14T03:30:00.000Z",
      "2027-12-14T04:30:00.000Z",
      "2027-12-14T05:30:00.000Z",
      "2027-12-14T06:30:00.000Z",
      "2027-12-14T07:30:00.000Z",
      "2027-12-14T08:30:00.000Z",
      "2027-12-14T09:30:00.000Z",
      "2027-12-14T10:30:00.000Z",
      "2027-12-15T03:30:00.000Z",
      "2027-12-15T04:30:00.000Z",
      "2027-12-15T05:30:00.000Z",
      "2027-12-15T06:30:00.000Z",
      "2027-12-15T07:30:00.000Z",
      "2027-12-15T08:30:00.000Z",
      "2027-12-15T09:30:00.000Z",
      "2027-12-15T10:30:00.000Z",
      "2027-12-16T03:30:00.000Z",
      "2027-12-16T04:30:00.000Z",
      "2027-12-16T05:30:00.000Z",
      "2027-12-16T06:30:00.000Z",
      "2027-12-16T07:30:00.000Z",
      "2027-12-16T08:30:00.000Z",
      "2027-12-16T09:30:00.000Z",
      "2027-12-16T10:30:00.000Z",
      "2027-12-17T03:30:00.000Z",
      "2027-12-17T04:30:00.000Z",
      "2027-12-17T05:30:00.000Z",
      "2027-12-17T06:30:00.000Z",
      "2027-12-17T07:30:00.000Z",
      "2027-12-17T08:30:00.000Z",
      "2027-12-17T09:30:00.000Z",
      "2027-12-17T10:30:00.000Z",
      "2027-12-20T03:30:00.000Z",
      "2027-12-20T04:30:00.000Z",
      "2027-12-20T05:30:00.000Z",
      "2027-12-20T06:30:00.000Z",
      "2027-12-20T07:30:00.000Z",
      "2027-12-20T08:30:00.000Z",
      "2027-12-20T09:30:00.000Z",
      "2027-12-20T10:30:00.000Z",
      "2027-12-21T03:30:00.000Z",
      "2027-12-21T04:30:00.000Z",
      "2027-12-21T05:30:00.000Z",
      "2027-12-21T06:30:00.000Z",
      "2027-12-21T07:30:00.000Z",
      "2027-12-21T08:30:00.000Z",
      "2027-12-21T09:30:00.000Z",
      "2027-12-21T10:30:00.000Z",
      "2027-12-22T03:30:00.000Z",
      "2027-12-22T04:30:00.000Z",
      "2027-12-22T05:30:00.000Z",
      "2027-12-22T06:30:00.000Z",
      "2027-12-22T07:30:00.000Z",
      "2027-12-22T08:30:00.000Z",
      "2027-12-22T09:30:00.000Z",
      "2027-12-22T10:30:00.000Z",
      "2027-12-23T03:30:00.000Z",
      "2027-12-23T04:30:00.000Z"
    ]
  }
}
````

## File: apps/api/performance/results/final/seed-0.json
````json
{
  "practitionerId": "cmv7mjlgr0000m6g5ge1z45l3",
  "practitionerHandle": "perf.practitioner",
  "sessionTypeId": "cmv7mjlhc0002m6g50kft92y9",
  "sessionTypeName": "Perf slot",
  "bookingCount": 0,
  "slotMinutes": 15,
  "startDays": 1,
  "spanDays": 0,
  "window": {
    "fromDays": 1,
    "toDays": 2
  }
}
````

## File: apps/api/performance/results/final/seed-1200.json
````json
{
  "practitionerId": "cmv7mjlgr0000m6g5ge1z45l3",
  "practitionerHandle": "perf.practitioner",
  "sessionTypeId": "cmv7mjlhc0002m6g50kft92y9",
  "sessionTypeName": "Perf slot",
  "bookingCount": 1200,
  "slotMinutes": 15,
  "startDays": 1,
  "spanDays": 13,
  "window": {
    "fromDays": 1,
    "toDays": 15
  }
}
````

## File: apps/api/performance/results/final/seed-400.json
````json
{
  "practitionerId": "cmv7mjlgr0000m6g5ge1z45l3",
  "practitionerHandle": "perf.practitioner",
  "sessionTypeId": "cmv7mjlhc0002m6g50kft92y9",
  "sessionTypeName": "Perf slot",
  "bookingCount": 400,
  "slotMinutes": 15,
  "startDays": 1,
  "spanDays": 5,
  "window": {
    "fromDays": 1,
    "toDays": 7
  }
}
````

## File: apps/api/performance/results/final/seed-800.json
````json
{
  "practitionerId": "cmv7mjlgr0000m6g5ge1z45l3",
  "practitionerHandle": "perf.practitioner",
  "sessionTypeId": "cmv7mjlhc0002m6g50kft92y9",
  "sessionTypeName": "Perf slot",
  "bookingCount": 800,
  "slotMinutes": 15,
  "startDays": 1,
  "spanDays": 9,
  "window": {
    "fromDays": 1,
    "toDays": 11
  }
}
````

## File: apps/api/performance/results/final/slot-lookup-2026-10-14T05-10-13-574Z.json
````json
{
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "testRunDurationMs": 20060.463064,
    "isStdOutTTY": false,
    "isStdErrTTY": false
  },
  "metrics": {
    "slots_returned": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 100,
        "p(95)": 100,
        "avg": 100,
        "min": 100,
        "med": 100,
        "max": 100
      }
    },
    "http_reqs": {
      "values": {
        "count": 3282,
        "rate": 163.60539582407716
      },
      "type": "counter",
      "contains": "default"
    },
    "http_req_sending": {
      "contains": "time",
      "values": {
        "med": 0.0246545,
        "max": 0.476817,
        "p(90)": 0.037498000000000004,
        "p(95)": 0.04650104999999995,
        "avg": 0.027111598110907957,
        "min": 0.011315
      },
      "type": "trend"
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 0.1370171,
        "p(95)": 0.14994154999999995,
        "avg": 0.10873049878123082,
        "min": 0.049728,
        "med": 0.105043,
        "max": 0.509015
      }
    },
    "data_received": {
      "contains": "data",
      "values": {
        "rate": 1331572.203232766,
        "count": 26711955
      },
      "type": "counter"
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 69.021508,
        "p(95)": 77.70052949999996,
        "avg": 61.02848520792697,
        "min": 18.831009,
        "med": 59.6961595,
        "max": 142.604919
      }
    },
    "vus": {
      "values": {
        "value": 10,
        "min": 10,
        "max": 10
      },
      "type": "gauge",
      "contains": "default"
    },
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 142.13788,
        "p(90)": 68.6009758,
        "p(95)": 77.27309145,
        "avg": 60.58357694637404,
        "min": 2.734694,
        "med": 59.269003
      }
    },
    "http_req_failed": {
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 3282
      },
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      },
      "type": "rate",
      "contains": "default"
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 984290,
        "rate": 49066.16546486317
      }
    },
    "http_req_tls_handshaking": {
      "contains": "time",
      "values": {
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0,
        "min": 0
      },
      "type": "trend"
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 2.54996,
        "med": 59.138219500000005,
        "max": 141.984156,
        "p(90)": 68.44675760000001,
        "p(95)": 77.13445079999995,
        "avg": 60.44773484948196
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 0.009359,
        "max": 0.508176,
        "p(90)": 0.013130900000000001,
        "p(95)": 0.014872549999999988,
        "avg": 0.011283487812309593,
        "min": 0.005168
      }
    },
    "slots_total_open": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 1344,
        "med": 1344,
        "max": 1344,
        "p(90)": 1344,
        "p(95)": 1344,
        "avg": 1344
      }
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0.0006782754418037782,
        "min": 0,
        "med": 0,
        "max": 0.272806
      }
    },
    "slots_conflicts_considered": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0
      }
    },
    "http_req_duration": {
      "contains": "time",
      "values": {
        "avg": 60.58357694637404,
        "min": 2.734694,
        "med": 59.269003,
        "max": 142.13788,
        "p(90)": 68.6009758,
        "p(95)": 77.27309145
      },
      "type": "trend"
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 3280,
        "rate": 163.50569722820632
      }
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 10,
        "min": 10,
        "max": 10
      }
    },
    "slots_scanned_days": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 15,
        "med": 15,
        "max": 15,
        "p(90)": 15,
        "p(95)": 15,
        "avg": 15
      }
    }
  },
  "setup_data": {
    "url": "http://localhost:3001/api/practitioners/cmv7mjlgr0000m6g5ge1z45l3/slots?from=2026-10-15T05:09:53.519Z&to=2026-10-29T05:09:53.519Z&sessionTypeId=cmv7mjlhc0002m6g50kft92y9&maxSlots=100",
    "viewerId": "cmv7m0yni0000m6ajycty4i5g"
  },
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  }
}
````

## File: apps/api/performance/results/final/slot-lookup-2026-10-14T05-10-36-796Z.json
````json
{
  "metrics": {
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 72.74084858046817,
        "min": 3.238749,
        "med": 69.29578000000001,
        "max": 204.312493,
        "p(90)": 107.61800180000003,
        "p(95)": 117.3906773
      }
    },
    "slots_conflicts_considered": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 400,
        "p(90)": 400,
        "p(95)": 400,
        "avg": 400,
        "min": 400,
        "med": 400
      }
    },
    "slots_total_open": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 944,
        "p(95)": 944,
        "avg": 944,
        "min": 944,
        "med": 944,
        "max": 944
      }
    },
    "slots_scanned_days": {
      "values": {
        "avg": 15,
        "min": 15,
        "med": 15,
        "max": 15,
        "p(90)": 15,
        "p(95)": 15
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_duration": {
      "values": {
        "med": 69.419262,
        "max": 204.449315,
        "p(90)": 107.78252330000002,
        "p(95)": 117.53383419999999,
        "avg": 72.87414620738855,
        "min": 3.332059
      },
      "type": "trend",
      "contains": "time"
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 2734,
        "rate": 136.16495243508916
      }
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 2732,
        "rate": 136.0653438378433
      }
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 0.432816,
        "p(90)": 0.13238000000000005,
        "p(95)": 0.14415535000000002,
        "avg": 0.10718425713240688,
        "min": 0.047074,
        "med": 0.103786
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 22253419,
        "rate": 1108315.9252571724
      }
    },
    "slots_returned": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 100,
        "avg": 100,
        "min": 100,
        "med": 100,
        "max": 100,
        "p(90)": 100
      }
    },
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 10,
        "min": 10,
        "max": 10
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.011710907095830335,
        "min": 0.005587,
        "med": 0.009499,
        "max": 0.579485,
        "p(90)": 0.012432,
        "p(95)": 0.013759
      }
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.026113369787856687,
        "min": 0.011035,
        "med": 0.024725,
        "max": 0.449648,
        "p(90)": 0.0338737,
        "p(95)": 0.03927964999999998
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 819890,
        "rate": 40834.046397953636
      }
    },
    "iteration_duration": {
      "values": {
        "min": 16.345447,
        "med": 69.839715,
        "max": 204.784491,
        "p(90)": 108.22410500000001,
        "p(95)": 117.97094094999999,
        "avg": 73.32508918997071
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_tls_handshaking": {
      "values": {
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0,
        "min": 0
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 2734
      },
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      }
    },
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 117.53383419999999,
        "avg": 72.87414620738855,
        "min": 3.332059,
        "med": 69.419262,
        "max": 204.449315,
        "p(90)": 107.78252330000002
      }
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0.0010392121433796635,
        "min": 0,
        "med": 0,
        "max": 0.500633
      }
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 10,
        "min": 10,
        "max": 10
      }
    }
  },
  "setup_data": {
    "url": "http://localhost:3001/api/practitioners/cmv7mjlgr0000m6g5ge1z45l3/slots?from=2026-10-15T05:10:16.724Z&to=2026-10-29T05:10:16.724Z&sessionTypeId=cmv7mjlhc0002m6g50kft92y9&maxSlots=100",
    "viewerId": "cmv7m0yni0000m6ajycty4i5g"
  },
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 20078.588147
  }
}
````

## File: apps/api/performance/results/final/slot-lookup-2026-10-14T05-11-00-155Z.json
````json
{
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 20080.003184
  },
  "metrics": {
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "rate": 955372.6074747818,
        "count": 19183885
      }
    },
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "max": 10,
        "value": 10,
        "min": 10
      }
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 84.5811903075942,
        "min": 3.410493,
        "med": 83.477788,
        "max": 175.368906,
        "p(90)": 123.5378786,
        "p(95)": 132.15694200000002
      }
    },
    "http_req_sending": {
      "values": {
        "avg": 0.02633526177344081,
        "min": 0.011035,
        "med": 0.023467,
        "max": 1.037026,
        "p(90)": 0.03253300000000001,
        "p(95)": 0.03879079999999997
      },
      "type": "trend",
      "contains": "time"
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 2355,
        "rate": 117.28085789729823
      }
    },
    "slots_scanned_days": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 15,
        "avg": 15,
        "min": 15,
        "med": 15,
        "max": 15,
        "p(90)": 15
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 132.0325934,
        "avg": 84.44547000000013,
        "min": 3.19433,
        "med": 83.322174,
        "max": 175.248427,
        "p(90)": 123.41348860000001
      }
    },
    "iteration_duration": {
      "contains": "time",
      "values": {
        "avg": 85.04699819617852,
        "min": 20.695748,
        "med": 83.875958,
        "max": 175.796693,
        "p(90)": 123.90655099999998,
        "p(95)": 132.70368379999994
      },
      "type": "trend"
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 2357
      },
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      }
    },
    "slots_total_open": {
      "contains": "time",
      "values": {
        "min": 544,
        "med": 544,
        "max": 544,
        "p(90)": 544,
        "p(95)": 544,
        "avg": 544
      },
      "type": "trend"
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 2357,
        "rate": 117.38045947513034
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 706790,
        "rate": 35198.69959797512
      }
    },
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 175.368906,
        "p(90)": 123.5378786,
        "p(95)": 132.15694200000002,
        "avg": 84.5811903075942,
        "min": 3.410493,
        "med": 83.477788
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0.0134092,
        "avg": 0.01337993890538825,
        "min": 0.005308,
        "med": 0.009359,
        "max": 1.475429,
        "p(90)": 0.012292
      }
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0
      }
    },
    "slots_conflicts_considered": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 800,
        "avg": 800,
        "min": 800,
        "med": 800,
        "max": 800,
        "p(90)": 800
      }
    },
    "slots_returned": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 100,
        "avg": 100,
        "min": 100,
        "med": 100,
        "max": 100,
        "p(90)": 100
      }
    },
    "http_req_connecting": {
      "values": {
        "p(95)": 0,
        "avg": 0.0025096881629189643,
        "min": 0,
        "med": 0,
        "max": 1.371293,
        "p(90)": 0
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_receiving": {
      "values": {
        "p(90)": 0.133847,
        "p(95)": 0.14612499999999998,
        "avg": 0.1093850458209586,
        "min": 0.049659,
        "med": 0.106231,
        "max": 0.543866
      },
      "type": "trend",
      "contains": "time"
    },
    "vus_max": {
      "contains": "default",
      "values": {
        "value": 10,
        "min": 10,
        "max": 10
      },
      "type": "gauge"
    }
  },
  "setup_data": {
    "viewerId": "cmv7m0yni0000m6ajycty4i5g",
    "url": "http://localhost:3001/api/practitioners/cmv7mjlgr0000m6g5ge1z45l3/slots?from=2026-10-15T05:10:40.083Z&to=2026-10-29T05:10:40.083Z&sessionTypeId=cmv7mjlhc0002m6g50kft92y9&maxSlots=100"
  },
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  }
}
````

## File: apps/api/performance/results/final/slot-lookup-2026-10-14T05-11-23-578Z.json
````json
{
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "testRunDurationMs": 20089.426513,
    "isStdOutTTY": false,
    "isStdErrTTY": false
  },
  "metrics": {
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 10,
        "min": 10,
        "max": 10
      }
    },
    "http_req_failed": {
      "contains": "default",
      "values": {
        "passes": 0,
        "fails": 2157,
        "rate": 0
      },
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      },
      "type": "rate"
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 2157,
        "rate": 107.36991414882804
      }
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0,
        "med": 0,
        "max": 0.279022,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0.000879753361149745
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 17557640,
        "rate": 873974.1768456325
      }
    },
    "slots_scanned_days": {
      "values": {
        "max": 15,
        "p(90)": 15,
        "p(95)": 15,
        "avg": 15,
        "min": 15,
        "med": 15
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_tls_handshaking": {
      "contains": "time",
      "values": {
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0
      },
      "type": "trend"
    },
    "http_req_receiving": {
      "contains": "time",
      "values": {
        "max": 0.456213,
        "p(90)": 0.1445606,
        "p(95)": 0.15787199999999998,
        "avg": 0.11571542976356045,
        "min": 0.042045,
        "med": 0.112516
      },
      "type": "trend"
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 2.726174,
        "med": 91.493584,
        "max": 176.215634,
        "p(90)": 133.9491824,
        "p(95)": 143.35775719999998,
        "avg": 92.34894170514599
      }
    },
    "slots_total_open": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 144,
        "min": 144,
        "med": 144,
        "max": 144,
        "p(90)": 144,
        "p(95)": 144
      }
    },
    "iterations": {
      "values": {
        "rate": 107.27035929101736,
        "count": 2155
      },
      "type": "counter",
      "contains": "default"
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 92.97859980464038,
        "min": 24.206887,
        "med": 92.085571,
        "max": 177.029512,
        "p(90)": 134.5225078,
        "p(95)": 143.9841367
      }
    },
    "http_req_duration{expected_response:true}": {
      "contains": "time",
      "values": {
        "avg": 92.49051096198431,
        "min": 2.960077,
        "med": 91.642764,
        "max": 176.414965,
        "p(90)": 134.08863,
        "p(95)": 143.5309394
      },
      "type": "trend"
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 646790,
        "rate": 32195.54324168776
      }
    },
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "max": 10,
        "value": 10,
        "min": 10
      }
    },
    "slots_conflicts_considered": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 1200,
        "max": 1200,
        "p(90)": 1200,
        "p(95)": 1200,
        "avg": 1200,
        "min": 1200
      }
    },
    "slots_returned": {
      "values": {
        "max": 100,
        "p(90)": 100,
        "p(95)": 100,
        "avg": 100,
        "min": 100,
        "med": 100
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 92.49051096198431,
        "min": 2.960077,
        "med": 91.642764,
        "max": 176.414965,
        "p(90)": 134.08863,
        "p(95)": 143.5309394
      }
    },
    "http_req_blocked": {
      "values": {
        "max": 0.503427,
        "p(90)": 0.012362,
        "p(95)": 0.013493999999999987,
        "avg": 0.011295969401947185,
        "min": 0.005238,
        "med": 0.009499
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.025853827074640758,
        "min": 0.010476,
        "med": 0.024375,
        "max": 0.18201,
        "p(90)": 0.033873,
        "p(95)": 0.03961419999999999
      }
    }
  },
  "setup_data": {
    "url": "http://localhost:3001/api/practitioners/cmv7mjlgr0000m6g5ge1z45l3/slots?from=2026-10-15T05:11:03.496Z&to=2026-10-29T05:11:03.496Z&sessionTypeId=cmv7mjlhc0002m6g50kft92y9&maxSlots=100",
    "viewerId": "cmv7m0yni0000m6ajycty4i5g"
  }
}
````

## File: apps/api/performance/results/moderate/booking-contention-2026-10-14T05-05-37-558Z.json
````json
{
  "metrics": {
    "http_reqs": {
      "values": {
        "rate": 398.2485616306945,
        "count": 363
      },
      "type": "counter",
      "contains": "default"
    },
    "booking_conflict": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 300,
        "rate": 329.13104266999545
      },
      "thresholds": {
        "count==300": {
          "ok": true
        }
      }
    },
    "booking_unexpected": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 0,
        "rate": 0
      },
      "thresholds": {
        "count==0": {
          "ok": true
        }
      }
    },
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 104.1172519,
        "avg": 75.12700441269843,
        "min": 4.314181,
        "med": 75.838715,
        "max": 274.166219,
        "p(90)": 93.4123842
      }
    },
    "data_received": {
      "contains": "data",
      "values": {
        "count": 552322,
        "rate": 605954.385831924
      },
      "type": "counter"
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "passes": 300,
        "fails": 63,
        "rate": 0.8264462809917356
      }
    },
    "race_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 128.98333333333332,
        "min": 38,
        "med": 128,
        "max": 332,
        "p(90)": 150.60000000000005,
        "p(95)": 251.94999999999993
      },
      "thresholds": {
        "p(95)<2000": {
          "ok": true
        }
      }
    },
    "http_req_blocked": {
      "contains": "time",
      "values": {
        "p(95)": 0.4240637999999998,
        "avg": 0.12328959779614307,
        "min": 0.005239,
        "med": 0.009219,
        "max": 4.331292,
        "p(90)": 0.22367800000000032
      },
      "type": "trend"
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.05497253168044073,
        "min": 0.00894,
        "med": 0.02249,
        "max": 2.931296,
        "p(90)": 0.04680840000000003,
        "p(95)": 0.08436939999999987
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 102.95545811845729,
        "min": 4.048848,
        "med": 101.347977,
        "max": 324.853197,
        "p(90)": 134.7943514,
        "p(95)": 160.90787719999983
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 93097,
        "rate": 102137.04226482855
      }
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 0.0799,
        "max": 1.945467,
        "p(90)": 0.12057640000000001,
        "p(95)": 0.1367937999999999,
        "avg": 0.08640095041322315,
        "min": 0.024235
      }
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 151.66447450000007,
        "p(95)": 252.49946254999995,
        "avg": 129.211468,
        "min": 38.563272,
        "med": 128.15051449999999,
        "max": 334.153026
      }
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 0,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0,
        "min": 0,
        "med": 0
      }
    },
    "booking_success": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 60,
        "rate": 65.8262085339991
      },
      "thresholds": {
        "count==60": {
          "ok": true
        }
      }
    },
    "http_req_connecting": {
      "values": {
        "avg": 0.05129124793388431,
        "min": 0,
        "med": 0,
        "max": 4.249436,
        "p(90)": 0.11652520000000001,
        "p(95)": 0.19978459999999995
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_duration": {
      "values": {
        "avg": 103.09683160055093,
        "min": 4.314181,
        "med": 101.411324,
        "max": 324.951606,
        "p(90)": 134.9331424,
        "p(95)": 161.03511689999982
      },
      "type": "trend",
      "contains": "time"
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 60,
        "rate": 65.8262085339991
      }
    }
  },
  "setup_data": {
    "memberIds": [
      "cmv7m0yni0000m6ajycty4i5g",
      "cmv7m0ynt0001m6aj9463ongt",
      "cmv7m0yoc0006m6ajltfalgb3",
      "cmv7m0yoc0007m6aj5d6b9swh",
      "cmv7m0yo80003m6aji2w1bj1s",
      "cmv7m0yox000ym6ajy8n7r3f6"
    ],
    "sessionTypeId": "cmv7m0yvv0011m6aj607la6iv",
    "slots": [
      "2027-11-18T05:30:00.000Z",
      "2027-11-18T06:30:00.000Z",
      "2027-11-18T07:30:00.000Z",
      "2027-11-18T08:30:00.000Z",
      "2027-11-18T09:30:00.000Z",
      "2027-11-18T10:30:00.000Z",
      "2027-11-19T03:30:00.000Z",
      "2027-11-19T04:30:00.000Z",
      "2027-11-19T05:30:00.000Z",
      "2027-11-19T06:30:00.000Z",
      "2027-11-19T07:30:00.000Z",
      "2027-11-19T08:30:00.000Z",
      "2027-11-19T09:30:00.000Z",
      "2027-11-19T10:30:00.000Z",
      "2027-11-22T03:30:00.000Z",
      "2027-11-22T04:30:00.000Z",
      "2027-11-22T05:30:00.000Z",
      "2027-11-22T06:30:00.000Z",
      "2027-11-22T07:30:00.000Z",
      "2027-11-22T08:30:00.000Z",
      "2027-11-22T09:30:00.000Z",
      "2027-11-22T10:30:00.000Z",
      "2027-11-23T03:30:00.000Z",
      "2027-11-23T04:30:00.000Z",
      "2027-11-23T05:30:00.000Z",
      "2027-11-23T06:30:00.000Z",
      "2027-11-23T07:30:00.000Z",
      "2027-11-23T08:30:00.000Z",
      "2027-11-23T09:30:00.000Z",
      "2027-11-23T10:30:00.000Z",
      "2027-11-24T03:30:00.000Z",
      "2027-11-24T04:30:00.000Z",
      "2027-11-24T05:30:00.000Z",
      "2027-11-24T06:30:00.000Z",
      "2027-11-24T07:30:00.000Z",
      "2027-11-24T08:30:00.000Z",
      "2027-11-24T09:30:00.000Z",
      "2027-11-24T10:30:00.000Z",
      "2027-11-25T03:30:00.000Z",
      "2027-11-25T04:30:00.000Z",
      "2027-11-25T05:30:00.000Z",
      "2027-11-25T06:30:00.000Z",
      "2027-11-25T07:30:00.000Z",
      "2027-11-25T08:30:00.000Z",
      "2027-11-25T09:30:00.000Z",
      "2027-11-25T10:30:00.000Z",
      "2027-11-26T03:30:00.000Z",
      "2027-11-26T04:30:00.000Z",
      "2027-11-26T05:30:00.000Z",
      "2027-11-26T06:30:00.000Z",
      "2027-11-26T07:30:00.000Z",
      "2027-11-26T08:30:00.000Z",
      "2027-11-26T09:30:00.000Z",
      "2027-11-26T10:30:00.000Z",
      "2027-11-29T03:30:00.000Z",
      "2027-11-29T04:30:00.000Z",
      "2027-11-29T05:30:00.000Z",
      "2027-11-29T06:30:00.000Z",
      "2027-11-29T07:30:00.000Z",
      "2027-11-29T08:30:00.000Z"
    ]
  },
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 911.491051
  }
}
````

## File: apps/api/performance/results/optimized/booking-contention-2026-10-14T04-46-32-745Z.json
````json
{
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 64468.108187
  },
  "metrics": {
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 1392,
        "rate": 21.592071477610023
      }
    },
    "http_req_connecting": {
      "values": {
        "avg": 0.015000074712643677,
        "min": 0,
        "med": 0,
        "max": 2.854697,
        "p(90)": 0,
        "p(95)": 0.1047107500000001
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 4.59119,
        "med": 2000.0394445000002,
        "max": 32101.07063,
        "p(90)": 5976.568415,
        "p(95)": 18240.115806600006,
        "avg": 3682.591177329738
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 1999.9329735000001,
        "max": 32100.947084,
        "p(90)": 5976.492986900001,
        "p(95)": 18239.965690000005,
        "avg": 3682.4764509339057,
        "min": 4.42127
      }
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 6936.131811250001,
        "min": 134.463857,
        "med": 4825.980428000001,
        "max": 43323.195433,
        "p(90)": 11008.731838,
        "p(95)": 35354.074197249996
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 0.00852,
        "max": 4.581134,
        "p(90)": 0.09477330000000013,
        "p(95)": 0.17441755000000003,
        "avg": 0.04884493390804589,
        "min": 0.00433
      }
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0
      }
    },
    "http_req_sending": {
      "contains": "time",
      "values": {
        "max": 2.778292,
        "p(90)": 0.038055000000000005,
        "p(95)": 0.056368200000000056,
        "avg": 0.03601894971264368,
        "min": 0.007682,
        "med": 0.02193
      },
      "type": "trend"
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.07870744612068975,
        "min": 0.018997,
        "med": 0.0783955,
        "max": 0.36205,
        "p(90)": 0.10983010000000003,
        "p(95)": 0.122011
      }
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 136,
        "rate": 2.1095702018354623
      }
    },
    "booking_unexpected": {
      "type": "counter",
      "contains": "default",
      "values": {
        "rate": 0.8996696449004177,
        "count": 58
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "rate": 5885.002843568862,
        "count": 379395
      }
    },
    "data_received": {
      "values": {
        "count": 701020,
        "rate": 10873.903697725704
      },
      "type": "counter",
      "contains": "data"
    },
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 16,
        "min": 16,
        "max": 20
      }
    },
    "race_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 35353.75,
        "avg": 6935.867647058823,
        "min": 135,
        "med": 4825.5,
        "max": 43323,
        "p(90)": 11008.5
      },
      "thresholds": {
        "p(95)<2000": {
          "ok": false
        }
      }
    },
    "booking_success": {
      "contains": "default",
      "values": {
        "count": 136,
        "rate": 2.1095702018354623
      },
      "thresholds": {
        "count==200": {
          "ok": false
        }
      },
      "type": "counter"
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 20,
        "min": 20,
        "max": 20
      }
    },
    "booking_conflict": {
      "contains": "default",
      "values": {
        "count": 1166,
        "rate": 18.08646217161874
      },
      "thresholds": {
        "count==1800": {
          "ok": false
        }
      },
      "type": "counter"
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "passes": 1249,
        "fails": 143,
        "rate": 0.8972701149425287
      }
    },
    "http_req_duration{expected_response:true}": {
      "contains": "time",
      "values": {
        "min": 4.59119,
        "med": 1933.095562,
        "max": 32045.436904,
        "p(90)": 5033.1052985999995,
        "p(95)": 15036.9629466,
        "avg": 3373.920539958042
      },
      "type": "trend"
    }
  },
  "setup_data": {
    "sessionTypeId": "cmv7m0yvv0011m6aj607la6iv",
    "slots": [
      "2026-12-18T09:30:00.000Z",
      "2026-12-21T03:30:00.000Z",
      "2026-12-21T05:30:00.000Z",
      "2026-12-21T07:30:00.000Z",
      "2026-12-21T09:30:00.000Z",
      "2026-12-22T03:30:00.000Z",
      "2026-12-22T05:30:00.000Z",
      "2026-12-22T07:30:00.000Z",
      "2026-12-22T09:30:00.000Z",
      "2026-12-23T03:30:00.000Z",
      "2026-12-23T05:30:00.000Z",
      "2026-12-23T07:30:00.000Z",
      "2026-12-23T09:30:00.000Z",
      "2026-12-24T03:30:00.000Z",
      "2026-12-24T05:30:00.000Z",
      "2026-12-24T07:30:00.000Z",
      "2026-12-24T09:30:00.000Z",
      "2026-12-25T03:30:00.000Z",
      "2026-12-25T05:30:00.000Z",
      "2026-12-25T07:30:00.000Z",
      "2026-12-25T09:30:00.000Z",
      "2026-12-28T03:30:00.000Z",
      "2026-12-28T05:30:00.000Z",
      "2026-12-28T07:30:00.000Z",
      "2026-12-28T09:30:00.000Z",
      "2026-12-29T03:30:00.000Z",
      "2026-12-29T05:30:00.000Z",
      "2026-12-29T07:30:00.000Z",
      "2026-12-29T09:30:00.000Z",
      "2026-12-30T03:30:00.000Z",
      "2026-12-30T05:30:00.000Z",
      "2026-12-30T07:30:00.000Z",
      "2026-12-30T09:30:00.000Z",
      "2026-12-31T03:30:00.000Z",
      "2026-12-31T05:30:00.000Z",
      "2026-12-31T07:30:00.000Z",
      "2026-12-31T09:30:00.000Z",
      "2027-01-01T03:30:00.000Z",
      "2027-01-01T05:30:00.000Z",
      "2027-01-01T07:30:00.000Z",
      "2027-01-01T09:30:00.000Z",
      "2027-01-04T03:30:00.000Z",
      "2027-01-04T05:30:00.000Z",
      "2027-01-04T07:30:00.000Z",
      "2027-01-04T09:30:00.000Z",
      "2027-01-05T03:30:00.000Z",
      "2027-01-05T05:30:00.000Z",
      "2027-01-05T07:30:00.000Z",
      "2027-01-05T09:30:00.000Z",
      "2027-01-06T03:30:00.000Z",
      "2027-01-06T05:30:00.000Z",
      "2027-01-06T07:30:00.000Z",
      "2027-01-06T09:30:00.000Z",
      "2027-01-07T03:30:00.000Z",
      "2027-01-07T05:30:00.000Z",
      "2027-01-07T07:30:00.000Z",
      "2027-01-07T09:30:00.000Z",
      "2027-01-08T03:30:00.000Z",
      "2027-01-08T05:30:00.000Z",
      "2027-01-08T07:30:00.000Z",
      "2027-01-08T09:30:00.000Z",
      "2027-01-11T03:30:00.000Z",
      "2027-01-11T05:30:00.000Z",
      "2027-01-11T07:30:00.000Z",
      "2027-01-11T09:30:00.000Z",
      "2027-01-12T03:30:00.000Z",
      "2027-01-12T05:30:00.000Z",
      "2027-01-12T07:30:00.000Z",
      "2027-01-12T09:30:00.000Z",
      "2027-01-13T03:30:00.000Z",
      "2027-01-13T05:30:00.000Z",
      "2027-01-13T07:30:00.000Z",
      "2027-01-13T09:30:00.000Z",
      "2027-01-14T03:30:00.000Z",
      "2027-01-14T05:30:00.000Z",
      "2027-01-14T07:30:00.000Z",
      "2027-01-14T09:30:00.000Z",
      "2027-01-15T03:30:00.000Z",
      "2027-01-15T05:30:00.000Z",
      "2027-01-15T07:30:00.000Z",
      "2027-01-15T09:30:00.000Z",
      "2027-01-18T03:30:00.000Z",
      "2027-01-18T05:30:00.000Z",
      "2027-01-18T07:30:00.000Z",
      "2027-01-18T09:30:00.000Z",
      "2027-01-19T03:30:00.000Z",
      "2027-01-19T05:30:00.000Z",
      "2027-01-19T07:30:00.000Z",
      "2027-01-19T09:30:00.000Z",
      "2027-01-20T03:30:00.000Z",
      "2027-01-20T05:30:00.000Z",
      "2027-01-20T07:30:00.000Z",
      "2027-01-20T09:30:00.000Z",
      "2027-01-21T03:30:00.000Z",
      "2027-01-21T05:30:00.000Z",
      "2027-01-21T07:30:00.000Z",
      "2027-01-21T09:30:00.000Z",
      "2027-01-22T03:30:00.000Z",
      "2027-01-22T05:30:00.000Z",
      "2027-01-22T07:30:00.000Z",
      "2027-01-22T09:30:00.000Z",
      "2027-01-22T10:30:00.000Z",
      "2027-01-25T03:30:00.000Z",
      "2027-01-25T04:30:00.000Z",
      "2027-01-25T05:30:00.000Z",
      "2027-01-25T06:30:00.000Z",
      "2027-01-25T07:30:00.000Z",
      "2027-01-25T08:30:00.000Z",
      "2027-01-25T09:30:00.000Z",
      "2027-01-25T10:30:00.000Z",
      "2027-01-26T03:30:00.000Z",
      "2027-01-26T04:30:00.000Z",
      "2027-01-26T05:30:00.000Z",
      "2027-01-26T06:30:00.000Z",
      "2027-01-26T07:30:00.000Z",
      "2027-01-26T08:30:00.000Z",
      "2027-01-26T09:30:00.000Z",
      "2027-01-26T10:30:00.000Z",
      "2027-01-27T03:30:00.000Z",
      "2027-01-27T04:30:00.000Z",
      "2027-01-27T05:30:00.000Z",
      "2027-01-27T06:30:00.000Z",
      "2027-01-27T07:30:00.000Z",
      "2027-01-27T08:30:00.000Z",
      "2027-01-27T09:30:00.000Z",
      "2027-01-27T10:30:00.000Z",
      "2027-01-28T03:30:00.000Z",
      "2027-01-28T04:30:00.000Z",
      "2027-01-28T05:30:00.000Z",
      "2027-01-28T06:30:00.000Z",
      "2027-01-28T07:30:00.000Z",
      "2027-01-28T08:30:00.000Z",
      "2027-01-28T09:30:00.000Z",
      "2027-01-28T10:30:00.000Z",
      "2027-01-29T03:30:00.000Z",
      "2027-01-29T04:30:00.000Z",
      "2027-01-29T05:30:00.000Z",
      "2027-01-29T06:30:00.000Z",
      "2027-01-29T07:30:00.000Z",
      "2027-01-29T08:30:00.000Z",
      "2027-01-29T09:30:00.000Z",
      "2027-01-29T10:30:00.000Z",
      "2027-02-01T03:30:00.000Z",
      "2027-02-01T04:30:00.000Z",
      "2027-02-01T05:30:00.000Z",
      "2027-02-01T06:30:00.000Z",
      "2027-02-01T07:30:00.000Z",
      "2027-02-01T08:30:00.000Z",
      "2027-02-01T09:30:00.000Z",
      "2027-02-01T10:30:00.000Z",
      "2027-02-02T03:30:00.000Z",
      "2027-02-02T04:30:00.000Z",
      "2027-02-02T05:30:00.000Z",
      "2027-02-02T06:30:00.000Z",
      "2027-02-02T07:30:00.000Z",
      "2027-02-02T08:30:00.000Z",
      "2027-02-02T09:30:00.000Z",
      "2027-02-02T10:30:00.000Z",
      "2027-02-03T03:30:00.000Z",
      "2027-02-03T04:30:00.000Z",
      "2027-02-03T05:30:00.000Z",
      "2027-02-03T06:30:00.000Z",
      "2027-02-03T07:30:00.000Z",
      "2027-02-03T08:30:00.000Z",
      "2027-02-03T09:30:00.000Z",
      "2027-02-03T10:30:00.000Z",
      "2027-02-04T03:30:00.000Z",
      "2027-02-04T04:30:00.000Z",
      "2027-02-04T05:30:00.000Z",
      "2027-02-04T06:30:00.000Z",
      "2027-02-04T07:30:00.000Z",
      "2027-02-04T08:30:00.000Z",
      "2027-02-04T09:30:00.000Z",
      "2027-02-04T10:30:00.000Z",
      "2027-02-05T03:30:00.000Z",
      "2027-02-05T04:30:00.000Z",
      "2027-02-05T05:30:00.000Z",
      "2027-02-05T06:30:00.000Z",
      "2027-02-05T07:30:00.000Z",
      "2027-02-05T08:30:00.000Z",
      "2027-02-05T09:30:00.000Z",
      "2027-02-05T10:30:00.000Z",
      "2027-02-08T03:30:00.000Z",
      "2027-02-08T04:30:00.000Z",
      "2027-02-08T05:30:00.000Z",
      "2027-02-08T06:30:00.000Z",
      "2027-02-08T07:30:00.000Z",
      "2027-02-08T08:30:00.000Z",
      "2027-02-08T09:30:00.000Z",
      "2027-02-08T10:30:00.000Z",
      "2027-02-09T03:30:00.000Z",
      "2027-02-09T04:30:00.000Z",
      "2027-02-09T05:30:00.000Z",
      "2027-02-09T06:30:00.000Z",
      "2027-02-09T07:30:00.000Z",
      "2027-02-09T08:30:00.000Z",
      "2027-02-09T09:30:00.000Z",
      "2027-02-09T10:30:00.000Z",
      "2027-02-10T03:30:00.000Z",
      "2027-02-10T04:30:00.000Z"
    ],
    "memberIds": [
      "cmv7m0yni0000m6ajycty4i5g",
      "cmv7m0ynt0001m6aj9463ongt",
      "cmv7m0yoc0006m6ajltfalgb3",
      "cmv7m0yoc0007m6aj5d6b9swh",
      "cmv7m0yo80003m6aji2w1bj1s",
      "cmv7m0yox000ym6ajy8n7r3f6",
      "cmv7m0yox000xm6ajxe01izbx",
      "cmv7m0yon000lm6aj87l8mn85",
      "cmv7m0yod0008m6aji49lc7o6",
      "cmv7m0yoc0005m6aj0kw6mkr5"
    ]
  }
}
````

## File: apps/api/performance/results/optimized/booking-contention-2026-10-14T04-51-50-599Z.json
````json
{
  "metrics": {
    "booking_success": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 195,
        "rate": 0.6243346583449217
      },
      "thresholds": {
        "count==200": {
          "ok": false
        }
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0.00419,
        "med": 0.008661,
        "max": 3.803142,
        "p(90)": 0.052799999999999986,
        "p(95)": 0.19656479999999957,
        "avg": 0.054584834248627194
      }
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 47879.14149,
        "p(90)": 22004.8766022,
        "p(95)": 29807.717746699964,
        "avg": 5979.495694354961,
        "min": 3.810127,
        "med": 3045.720167
      }
    },
    "http_req_tls_handshaking": {
      "contains": "time",
      "values": {
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0
      },
      "type": "trend"
    },
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 1,
        "min": 1,
        "max": 20
      }
    },
    "http_req_duration{expected_response:true}": {
      "values": {
        "avg": 6021.28145930808,
        "min": 3.810127,
        "med": 3040.537922,
        "max": 47868.085273,
        "p(90)": 20987.884868200003,
        "p(95)": 28891.98665529992
      },
      "type": "trend",
      "contains": "time"
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 514577,
        "rate": 1647.5295153187426
      }
    },
    "booking_conflict": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 1597,
        "rate": 5.113140766035078
      },
      "thresholds": {
        "count==1800": {
          "ok": false
        }
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 5979.370522293559,
        "min": 3.568271,
        "med": 3045.632797,
        "max": 47878.097938,
        "p(90)": 22004.771436400002,
        "p(95)": 29807.572485799967
      }
    },
    "data_received": {
      "values": {
        "count": 968210,
        "rate": 3099.933638749419
      },
      "type": "counter",
      "contains": "data"
    },
    "http_reqs": {
      "values": {
        "count": 2003,
        "rate": 6.413037541871171
      },
      "type": "counter",
      "contains": "default"
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0.020813,
        "med": 0.084856,
        "max": 0.290745,
        "p(90)": 0.119776,
        "p(95)": 0.1326191,
        "avg": 0.08644113579630554
      }
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "min": 20,
        "max": 20,
        "value": 20
      }
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0.9011482775836246,
        "passes": 1805,
        "fails": 198
      }
    },
    "race_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 52084,
        "p(90)": 37159.09999999999,
        "p(95)": 49058.05,
        "avg": 11571.48,
        "min": 26,
        "med": 6989
      },
      "thresholds": {
        "p(95)<2000": {
          "ok": false
        }
      }
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 200,
        "rate": 0.6403432393281249
      }
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 0.024514,
        "max": 2.85213,
        "p(90)": 0.04353879999999999,
        "p(95)": 0.06340799999999999,
        "avg": 0.038730925611582666,
        "min": 0.00852
      }
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.01884904293559661,
        "min": 0,
        "med": 0,
        "max": 2.414791,
        "p(90)": 0,
        "p(95)": 0.10690409999999997
      }
    },
    "booking_unexpected": {
      "values": {
        "count": 208,
        "rate": 0.6659569689012499
      },
      "type": "counter",
      "contains": "default"
    },
    "iteration_duration": {
      "values": {
        "max": 52083.751852,
        "p(90)": 37158.8677146,
        "p(95)": 49058.728778150005,
        "avg": 11571.707091240003,
        "min": 26.49106,
        "med": 6989.349411
      },
      "type": "trend",
      "contains": "time"
    }
  },
  "setup_data": {
    "memberIds": [
      "cmv7m0yni0000m6ajycty4i5g",
      "cmv7m0ynt0001m6aj9463ongt",
      "cmv7m0yoc0006m6ajltfalgb3",
      "cmv7m0yoc0007m6aj5d6b9swh",
      "cmv7m0yo80003m6aji2w1bj1s",
      "cmv7m0yox000ym6ajy8n7r3f6",
      "cmv7m0yox000xm6ajxe01izbx",
      "cmv7m0yon000lm6aj87l8mn85",
      "cmv7m0yod0008m6aji49lc7o6",
      "cmv7m0yoc0005m6aj0kw6mkr5"
    ],
    "sessionTypeId": "cmv7m0yvv0011m6aj607la6iv",
    "slots": [
      "2026-12-24T03:30:00.000Z",
      "2026-12-24T05:30:00.000Z",
      "2026-12-24T07:30:00.000Z",
      "2026-12-24T09:30:00.000Z",
      "2026-12-25T03:30:00.000Z",
      "2026-12-25T05:30:00.000Z",
      "2026-12-25T07:30:00.000Z",
      "2026-12-29T09:30:00.000Z",
      "2026-12-30T03:30:00.000Z",
      "2027-01-06T03:30:00.000Z",
      "2027-01-07T03:30:00.000Z",
      "2027-01-07T05:30:00.000Z",
      "2027-01-07T07:30:00.000Z",
      "2027-01-07T09:30:00.000Z",
      "2027-01-08T03:30:00.000Z",
      "2027-01-08T05:30:00.000Z",
      "2027-01-08T07:30:00.000Z",
      "2027-01-14T03:30:00.000Z",
      "2027-01-14T05:30:00.000Z",
      "2027-01-14T07:30:00.000Z",
      "2027-01-14T09:30:00.000Z",
      "2027-01-15T03:30:00.000Z",
      "2027-01-15T05:30:00.000Z",
      "2027-01-15T07:30:00.000Z",
      "2027-01-22T05:30:00.000Z",
      "2027-01-22T07:30:00.000Z",
      "2027-01-25T10:30:00.000Z",
      "2027-01-26T05:30:00.000Z",
      "2027-01-26T06:30:00.000Z",
      "2027-01-26T07:30:00.000Z",
      "2027-01-26T08:30:00.000Z",
      "2027-01-26T09:30:00.000Z",
      "2027-01-26T10:30:00.000Z",
      "2027-01-27T03:30:00.000Z",
      "2027-01-27T04:30:00.000Z",
      "2027-01-28T05:30:00.000Z",
      "2027-01-28T06:30:00.000Z",
      "2027-02-01T09:30:00.000Z",
      "2027-02-01T10:30:00.000Z",
      "2027-02-03T10:30:00.000Z",
      "2027-02-04T03:30:00.000Z",
      "2027-02-04T04:30:00.000Z",
      "2027-02-04T05:30:00.000Z",
      "2027-02-04T06:30:00.000Z",
      "2027-02-05T05:30:00.000Z",
      "2027-02-05T06:30:00.000Z",
      "2027-02-05T07:30:00.000Z",
      "2027-02-05T08:30:00.000Z",
      "2027-02-08T05:30:00.000Z",
      "2027-02-08T06:30:00.000Z",
      "2027-02-08T07:30:00.000Z",
      "2027-02-08T08:30:00.000Z",
      "2027-02-08T09:30:00.000Z",
      "2027-02-08T10:30:00.000Z",
      "2027-02-10T04:30:00.000Z",
      "2027-02-10T05:30:00.000Z",
      "2027-02-10T06:30:00.000Z",
      "2027-02-10T07:30:00.000Z",
      "2027-02-10T08:30:00.000Z",
      "2027-02-10T09:30:00.000Z",
      "2027-02-10T10:30:00.000Z",
      "2027-02-11T03:30:00.000Z",
      "2027-02-11T04:30:00.000Z",
      "2027-02-19T05:30:00.000Z",
      "2027-02-19T06:30:00.000Z",
      "2027-02-19T07:30:00.000Z",
      "2027-02-19T08:30:00.000Z",
      "2027-02-19T09:30:00.000Z",
      "2027-02-19T10:30:00.000Z",
      "2027-02-22T03:30:00.000Z",
      "2027-02-22T04:30:00.000Z",
      "2027-02-22T05:30:00.000Z",
      "2027-02-22T06:30:00.000Z",
      "2027-02-22T07:30:00.000Z",
      "2027-02-22T08:30:00.000Z",
      "2027-02-22T09:30:00.000Z",
      "2027-02-22T10:30:00.000Z",
      "2027-02-23T03:30:00.000Z",
      "2027-02-23T04:30:00.000Z",
      "2027-02-23T05:30:00.000Z",
      "2027-02-23T06:30:00.000Z",
      "2027-02-23T07:30:00.000Z",
      "2027-02-23T08:30:00.000Z",
      "2027-02-23T09:30:00.000Z",
      "2027-02-23T10:30:00.000Z",
      "2027-02-24T03:30:00.000Z",
      "2027-02-24T04:30:00.000Z",
      "2027-02-24T05:30:00.000Z",
      "2027-02-24T06:30:00.000Z",
      "2027-02-24T07:30:00.000Z",
      "2027-02-24T08:30:00.000Z",
      "2027-02-24T09:30:00.000Z",
      "2027-02-24T10:30:00.000Z",
      "2027-02-25T03:30:00.000Z",
      "2027-02-25T04:30:00.000Z",
      "2027-02-25T05:30:00.000Z",
      "2027-02-25T06:30:00.000Z",
      "2027-02-25T07:30:00.000Z",
      "2027-02-25T08:30:00.000Z",
      "2027-02-25T09:30:00.000Z",
      "2027-02-25T10:30:00.000Z",
      "2027-02-26T03:30:00.000Z",
      "2027-02-26T04:30:00.000Z",
      "2027-02-26T05:30:00.000Z",
      "2027-02-26T06:30:00.000Z",
      "2027-02-26T07:30:00.000Z",
      "2027-02-26T08:30:00.000Z",
      "2027-02-26T09:30:00.000Z",
      "2027-02-26T10:30:00.000Z",
      "2027-03-01T03:30:00.000Z",
      "2027-03-01T04:30:00.000Z",
      "2027-03-01T05:30:00.000Z",
      "2027-03-01T06:30:00.000Z",
      "2027-03-01T07:30:00.000Z",
      "2027-03-01T08:30:00.000Z",
      "2027-03-01T09:30:00.000Z",
      "2027-03-01T10:30:00.000Z",
      "2027-03-02T03:30:00.000Z",
      "2027-03-02T04:30:00.000Z",
      "2027-03-02T05:30:00.000Z",
      "2027-03-02T06:30:00.000Z",
      "2027-03-02T07:30:00.000Z",
      "2027-03-02T08:30:00.000Z",
      "2027-03-02T09:30:00.000Z",
      "2027-03-02T10:30:00.000Z",
      "2027-03-03T03:30:00.000Z",
      "2027-03-03T04:30:00.000Z",
      "2027-03-03T05:30:00.000Z",
      "2027-03-03T06:30:00.000Z",
      "2027-03-03T07:30:00.000Z",
      "2027-03-03T08:30:00.000Z",
      "2027-03-03T09:30:00.000Z",
      "2027-03-03T10:30:00.000Z",
      "2027-03-04T03:30:00.000Z",
      "2027-03-04T04:30:00.000Z",
      "2027-03-04T05:30:00.000Z",
      "2027-03-04T06:30:00.000Z",
      "2027-03-04T07:30:00.000Z",
      "2027-03-04T08:30:00.000Z",
      "2027-03-04T09:30:00.000Z",
      "2027-03-04T10:30:00.000Z",
      "2027-03-05T03:30:00.000Z",
      "2027-03-05T04:30:00.000Z",
      "2027-03-05T05:30:00.000Z",
      "2027-03-05T06:30:00.000Z",
      "2027-03-05T07:30:00.000Z",
      "2027-03-05T08:30:00.000Z",
      "2027-03-05T09:30:00.000Z",
      "2027-03-05T10:30:00.000Z",
      "2027-03-08T03:30:00.000Z",
      "2027-03-08T04:30:00.000Z",
      "2027-03-08T05:30:00.000Z",
      "2027-03-08T06:30:00.000Z",
      "2027-03-08T07:30:00.000Z",
      "2027-03-08T08:30:00.000Z",
      "2027-03-08T09:30:00.000Z",
      "2027-03-08T10:30:00.000Z",
      "2027-03-09T03:30:00.000Z",
      "2027-03-09T04:30:00.000Z",
      "2027-03-09T05:30:00.000Z",
      "2027-03-09T06:30:00.000Z",
      "2027-03-09T07:30:00.000Z",
      "2027-03-09T08:30:00.000Z",
      "2027-03-09T09:30:00.000Z",
      "2027-03-09T10:30:00.000Z",
      "2027-03-10T03:30:00.000Z",
      "2027-03-10T04:30:00.000Z",
      "2027-03-10T05:30:00.000Z",
      "2027-03-10T06:30:00.000Z",
      "2027-03-10T07:30:00.000Z",
      "2027-03-10T08:30:00.000Z",
      "2027-03-10T09:30:00.000Z",
      "2027-03-10T10:30:00.000Z",
      "2027-03-11T03:30:00.000Z",
      "2027-03-11T04:30:00.000Z",
      "2027-03-11T05:30:00.000Z",
      "2027-03-11T06:30:00.000Z",
      "2027-03-11T07:30:00.000Z",
      "2027-03-11T08:30:00.000Z",
      "2027-03-11T09:30:00.000Z",
      "2027-03-11T10:30:00.000Z",
      "2027-03-12T03:30:00.000Z",
      "2027-03-12T04:30:00.000Z",
      "2027-03-12T05:30:00.000Z",
      "2027-03-12T06:30:00.000Z",
      "2027-03-12T07:30:00.000Z",
      "2027-03-12T08:30:00.000Z",
      "2027-03-12T09:30:00.000Z",
      "2027-03-12T10:30:00.000Z",
      "2027-03-15T03:30:00.000Z",
      "2027-03-15T04:30:00.000Z",
      "2027-03-15T05:30:00.000Z",
      "2027-03-15T06:30:00.000Z",
      "2027-03-15T07:30:00.000Z",
      "2027-03-15T08:30:00.000Z",
      "2027-03-15T09:30:00.000Z",
      "2027-03-15T10:30:00.000Z",
      "2027-03-16T03:30:00.000Z",
      "2027-03-16T04:30:00.000Z",
      "2027-03-16T05:30:00.000Z"
    ]
  },
  "root_group": {
    "checks": [],
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": []
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 312332.492508
  }
}
````

## File: apps/api/performance/results/optimized/feed-read-2026-10-14T04-52-57-325Z.json
````json
{
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 30034.916409
  },
  "metrics": {
    "http_req_failed": {
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      },
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 15488
      }
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0.019556,
        "med": 0.0494825,
        "max": 1.426094,
        "p(90)": 0.115099,
        "p(95)": 0.147435,
        "avg": 0.06692706837551628
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 130595405,
        "rate": 4348119.476066426
      }
    },
    "http_req_duration{expected_response:true}": {
      "values": {
        "avg": 38.50809795712805,
        "min": 3.010588,
        "med": 37.469196999999994,
        "max": 108.816917,
        "p(90)": 45.9849245,
        "p(95)": 49.6110082
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_connecting": {
      "contains": "time",
      "values": {
        "avg": 0.0004353416838842976,
        "min": 0,
        "med": 0,
        "max": 0.867851,
        "p(90)": 0,
        "p(95)": 0
      },
      "type": "trend"
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 38.42353277072572,
        "min": 2.790797,
        "med": 37.39356,
        "max": 108.730733,
        "p(90)": 45.8930171,
        "p(95)": 49.50320015
      }
    },
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 20,
        "min": 20,
        "max": 20
      }
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0.033454649999999996,
        "avg": 0.01763811802685937,
        "min": 0.006077,
        "med": 0.01334,
        "max": 0.452084,
        "p(90)": 0.026191
      }
    },
    "http_reqs": {
      "values": {
        "count": 15488,
        "rate": 515.6664925945657
      },
      "type": "counter",
      "contains": "default"
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 2431551,
        "rate": 80957.47518948921
      }
    },
    "feed_items": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 20,
        "max": 20,
        "p(90)": 20,
        "p(95)": 20,
        "avg": 20,
        "min": 20
      },
      "thresholds": {
        "avg>0": {
          "ok": true
        }
      }
    },
    "feed_pages": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 15487,
        "rate": 515.633198012141
      }
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 109.391923,
        "p(90)": 46.2048862,
        "p(95)": 49.90328289999998,
        "avg": 38.75553246019254,
        "min": 23.172523,
        "med": 37.695009
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 0.009848,
        "p(95)": 0.011454,
        "avg": 0.008336573476239485,
        "min": 0.003701,
        "med": 0.006286,
        "max": 1.335091
      }
    },
    "iterations": {
      "values": {
        "count": 15487,
        "rate": 515.633198012141
      },
      "type": "counter",
      "contains": "default"
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "max": 20,
        "value": 20,
        "min": 20
      }
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 38.50809795712805,
        "min": 3.010588,
        "med": 37.469196999999994,
        "max": 108.816917,
        "p(90)": 45.9849245,
        "p(95)": 49.6110082
      }
    }
  },
  "setup_data": {
    "viewerId": "cmv7m0yni0000m6ajycty4i5g"
  },
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  }
}
````

## File: apps/api/performance/results/optimized/hold-expiry-2026-10-14T04-52-23-035Z.json
````json
{
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 30918.675236
  },
  "metrics": {
    "hold_claimed": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 48,
        "rate": 1.5524597879313875
      },
      "thresholds": {
        "count==48": {
          "ok": true
        }
      }
    },
    "hold_claim_attempts": {
      "values": {
        "count": 1206,
        "rate": 39.00555217177611
      },
      "type": "counter",
      "contains": "default"
    },
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 26.516904,
        "p(95)": 32.684706299999995,
        "avg": 20.665601868686863,
        "min": 2.5101,
        "med": 19.696481,
        "max": 43.041794
      }
    },
    "http_req_duration": {
      "values": {
        "p(95)": 18.34158580000001,
        "avg": 10.75988057915673,
        "min": 2.5101,
        "med": 9.990679,
        "max": 43.041794,
        "p(90)": 13.151795400000001
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0.015239000000000004,
        "avg": 0.012671958631662695,
        "min": 0.00426,
        "med": 0.009778,
        "max": 0.569767,
        "p(90)": 0.01327
      }
    },
    "http_req_tls_handshaking": {
      "contains": "time",
      "values": {
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0
      },
      "type": "trend"
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 48,
        "rate": 1.5524597879313875
      }
    },
    "vus_max": {
      "values": {
        "max": 8,
        "value": 8,
        "min": 8
      },
      "type": "gauge",
      "contains": "default"
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.0012039713603818614,
        "min": 0,
        "med": 0,
        "max": 0.293823,
        "p(90)": 0,
        "p(95)": 0
      }
    },
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "max": 8,
        "value": 8,
        "min": 8
      }
    },
    "iteration_duration": {
      "contains": "time",
      "values": {
        "med": 5108.3249325,
        "max": 5279.249259,
        "p(90)": 5262.9538416000005,
        "p(95)": 5267.75435415,
        "avg": 5124.128198166666,
        "min": 5066.890676
      },
      "type": "trend"
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0.9212410501193318,
        "passes": 1158,
        "fails": 99
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 606233,
        "rate": 19607.340721187684
      }
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 1257,
        "rate": 40.65504069645321
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 13.046200200000001,
        "p(95)": 18.27981840000001,
        "avg": 10.664139759745424,
        "min": 2.263211,
        "med": 9.901146,
        "max": 42.818581
      }
    },
    "hold_created": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 48,
        "rate": 1.5524597879313875
      }
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 0.041863000000000004,
        "p(95)": 0.0490282,
        "avg": 0.03001489817024665,
        "min": 0.008591,
        "med": 0.027168,
        "max": 0.538897
      }
    },
    "hold_release_latency_past_ttl": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 263,
        "p(95)": 267.55,
        "avg": 124.08333333333333,
        "min": 67,
        "med": 108.5,
        "max": 279
      }
    },
    "hold_release_latency": {
      "thresholds": {
        "p(95)<10000": {
          "ok": true
        }
      },
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 5263,
        "p(95)": 5267.55,
        "avg": 5124.083333333333,
        "min": 5067,
        "med": 5108.5,
        "max": 5279
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 323431,
        "rate": 10460.700451467428
      }
    },
    "hold_claim_failed": {
      "thresholds": {
        "count==0": {
          "ok": true
        }
      },
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 0,
        "rate": 0
      }
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0.11300380000000002,
        "avg": 0.06572592124105005,
        "min": 0.01753,
        "med": 0.063905,
        "max": 0.286978,
        "p(90)": 0.102835
      }
    }
  },
  "setup_data": {
    "rival": "cmv7m0ynt0001m6aj9463ongt",
    "sessionTypeId": "cmv7m0yvv0011m6aj607la6iv",
    "slots": [
      "2027-03-16T07:30:00.000Z",
      "2027-03-16T08:30:00.000Z",
      "2027-03-17T03:30:00.000Z",
      "2027-03-17T04:30:00.000Z",
      "2027-03-17T07:30:00.000Z",
      "2027-03-17T09:30:00.000Z",
      "2027-03-18T03:30:00.000Z",
      "2027-03-18T05:30:00.000Z",
      "2027-03-18T07:30:00.000Z",
      "2027-03-18T09:30:00.000Z",
      "2027-03-19T03:30:00.000Z",
      "2027-03-19T05:30:00.000Z",
      "2027-03-19T07:30:00.000Z",
      "2027-03-19T09:30:00.000Z",
      "2027-03-22T03:30:00.000Z",
      "2027-03-22T05:30:00.000Z",
      "2027-03-22T07:30:00.000Z",
      "2027-03-22T09:30:00.000Z",
      "2027-03-23T03:30:00.000Z",
      "2027-03-23T05:30:00.000Z",
      "2027-03-23T07:30:00.000Z",
      "2027-03-23T08:30:00.000Z",
      "2027-03-24T03:30:00.000Z",
      "2027-03-24T04:30:00.000Z",
      "2027-03-24T07:30:00.000Z",
      "2027-03-24T09:30:00.000Z",
      "2027-03-25T03:30:00.000Z",
      "2027-03-25T05:30:00.000Z",
      "2027-03-25T07:30:00.000Z",
      "2027-03-25T09:30:00.000Z",
      "2027-03-26T03:30:00.000Z",
      "2027-03-26T05:30:00.000Z",
      "2027-03-26T07:30:00.000Z",
      "2027-03-26T09:30:00.000Z",
      "2027-03-29T03:30:00.000Z",
      "2027-03-29T05:30:00.000Z",
      "2027-03-29T07:30:00.000Z",
      "2027-03-29T09:30:00.000Z",
      "2027-03-30T03:30:00.000Z",
      "2027-03-30T05:30:00.000Z",
      "2027-03-30T07:30:00.000Z",
      "2027-03-30T08:30:00.000Z",
      "2027-03-31T03:30:00.000Z",
      "2027-03-31T04:30:00.000Z",
      "2027-03-31T07:30:00.000Z",
      "2027-03-31T09:30:00.000Z",
      "2027-04-01T03:30:00.000Z",
      "2027-04-01T05:30:00.000Z"
    ],
    "holder": "cmv7m0yni0000m6ajycty4i5g"
  },
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  }
}
````

## File: apps/api/performance/results/optimized/manifest.md
````markdown
# Benchmark run optimized

- base URL: http://localhost:3001
- k6: k6 v2.3.0 (commit/e088784614, go1.26.8, linux/amd64)
- contention: VUS=20 ITER=10 RACERS=10
- feed-read: VUS=20 DURATION=30s
- slot-lookup: VUS=10 DURATION=20s counts=0 400 800 1200
````

## File: apps/api/performance/results/optimized/reschedule-idempotency-2026-10-14T04-51-51-727Z.json
````json
{
  "root_group": {
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": [],
    "name": ""
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 715.53953
  },
  "metrics": {
    "http_req_duration{expected_response:true}": {
      "values": {
        "p(95)": 42.092207800000004,
        "avg": 20.62071083498351,
        "min": 3.61981,
        "med": 16.372782,
        "max": 77.133339,
        "p(90)": 35.1729146
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_connecting": {
      "contains": "time",
      "values": {
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0.005580168316831684,
        "min": 0,
        "med": 0,
        "max": 0.386432
      },
      "type": "trend"
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 382319,
        "rate": 534308.7054882908
      }
    },
    "reschedule_replay_mismatch": {
      "type": "counter",
      "contains": "default",
      "values": {
        "rate": 0,
        "count": 0
      },
      "thresholds": {
        "count==0": {
          "ok": true
        }
      }
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0.13494749999999997,
        "avg": 0.08088306930693069,
        "min": 0.027727,
        "med": 0.07941,
        "max": 0.293473,
        "p(90)": 0.12100720000000001
      }
    },
    "reschedule_replay_ok": {
      "values": {
        "rate": 139.75468273569734,
        "count": 100
      },
      "thresholds": {
        "count==100": {
          "ok": true
        }
      },
      "type": "counter",
      "contains": "default"
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0
      }
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 58.480549499999995,
        "max": 140.373056,
        "p(90)": 81.74540010000011,
        "p(95)": 104.14186264999996,
        "avg": 62.83622633000004,
        "min": 27.420295
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 0.011412000000000004,
        "p(95)": 0.0138289,
        "avg": 0.024767877887788836,
        "min": 0.0044,
        "med": 0.007613,
        "max": 1.195266
      }
    },
    "reschedule_first_ok": {
      "contains": "default",
      "values": {
        "count": 100,
        "rate": 139.75468273569734
      },
      "type": "counter"
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.028152541254125425,
        "min": 0.009009,
        "med": 0.023886,
        "max": 0.25548,
        "p(90)": 0.0418912,
        "p(95)": 0.04867239999999997
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 81877,
        "rate": 114426.94158350692
      }
    },
    "http_req_duration": {
      "contains": "time",
      "values": {
        "avg": 20.62071083498351,
        "min": 3.61981,
        "med": 16.372782,
        "max": 77.133339,
        "p(90)": 35.1729146,
        "p(95)": 42.092207800000004
      },
      "type": "trend"
    },
    "reschedule_first_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 78,
        "p(90)": 22.80000000000024,
        "p(95)": 61,
        "avg": 17.39,
        "min": 5,
        "med": 13
      }
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 303
      }
    },
    "reschedule_replay_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 15,
        "max": 22,
        "p(90)": 18,
        "p(95)": 19,
        "avg": 14.4,
        "min": 5
      },
      "thresholds": {
        "p(95)<500": {
          "ok": true
        }
      }
    },
    "http_reqs": {
      "contains": "default",
      "values": {
        "count": 303,
        "rate": 423.45668868916295
      },
      "type": "counter"
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 35.024403400000004,
        "p(95)": 41.97868009999999,
        "avg": 20.511675224422433,
        "min": 3.415035,
        "med": 16.320819,
        "max": 76.997147
      }
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 100,
        "rate": 139.75468273569734
      }
    }
  },
  "setup_data": {
    "sessionTypeId": "cmv7m0yvv0011m6aj607la6iv",
    "slots": [
      "2027-03-16T06:30:00.000Z",
      "2027-03-16T07:30:00.000Z",
      "2027-03-16T08:30:00.000Z",
      "2027-03-16T09:30:00.000Z",
      "2027-03-16T10:30:00.000Z",
      "2027-03-17T03:30:00.000Z",
      "2027-03-17T04:30:00.000Z",
      "2027-03-17T05:30:00.000Z",
      "2027-03-17T06:30:00.000Z",
      "2027-03-17T07:30:00.000Z",
      "2027-03-17T08:30:00.000Z",
      "2027-03-17T09:30:00.000Z",
      "2027-03-17T10:30:00.000Z",
      "2027-03-18T03:30:00.000Z",
      "2027-03-18T04:30:00.000Z",
      "2027-03-18T05:30:00.000Z",
      "2027-03-18T06:30:00.000Z",
      "2027-03-18T07:30:00.000Z",
      "2027-03-18T08:30:00.000Z",
      "2027-03-18T09:30:00.000Z",
      "2027-03-18T10:30:00.000Z",
      "2027-03-19T03:30:00.000Z",
      "2027-03-19T04:30:00.000Z",
      "2027-03-19T05:30:00.000Z",
      "2027-03-19T06:30:00.000Z",
      "2027-03-19T07:30:00.000Z",
      "2027-03-19T08:30:00.000Z",
      "2027-03-19T09:30:00.000Z",
      "2027-03-19T10:30:00.000Z",
      "2027-03-22T03:30:00.000Z",
      "2027-03-22T04:30:00.000Z",
      "2027-03-22T05:30:00.000Z",
      "2027-03-22T06:30:00.000Z",
      "2027-03-22T07:30:00.000Z",
      "2027-03-22T08:30:00.000Z",
      "2027-03-22T09:30:00.000Z",
      "2027-03-22T10:30:00.000Z",
      "2027-03-23T03:30:00.000Z",
      "2027-03-23T04:30:00.000Z",
      "2027-03-23T05:30:00.000Z",
      "2027-03-23T06:30:00.000Z",
      "2027-03-23T07:30:00.000Z",
      "2027-03-23T08:30:00.000Z",
      "2027-03-23T09:30:00.000Z",
      "2027-03-23T10:30:00.000Z",
      "2027-03-24T03:30:00.000Z",
      "2027-03-24T04:30:00.000Z",
      "2027-03-24T05:30:00.000Z",
      "2027-03-24T06:30:00.000Z",
      "2027-03-24T07:30:00.000Z",
      "2027-03-24T08:30:00.000Z",
      "2027-03-24T09:30:00.000Z",
      "2027-03-24T10:30:00.000Z",
      "2027-03-25T03:30:00.000Z",
      "2027-03-25T04:30:00.000Z",
      "2027-03-25T05:30:00.000Z",
      "2027-03-25T06:30:00.000Z",
      "2027-03-25T07:30:00.000Z",
      "2027-03-25T08:30:00.000Z",
      "2027-03-25T09:30:00.000Z",
      "2027-03-25T10:30:00.000Z",
      "2027-03-26T03:30:00.000Z",
      "2027-03-26T04:30:00.000Z",
      "2027-03-26T05:30:00.000Z",
      "2027-03-26T06:30:00.000Z",
      "2027-03-26T07:30:00.000Z",
      "2027-03-26T08:30:00.000Z",
      "2027-03-26T09:30:00.000Z",
      "2027-03-26T10:30:00.000Z",
      "2027-03-29T03:30:00.000Z",
      "2027-03-29T04:30:00.000Z",
      "2027-03-29T05:30:00.000Z",
      "2027-03-29T06:30:00.000Z",
      "2027-03-29T07:30:00.000Z",
      "2027-03-29T08:30:00.000Z",
      "2027-03-29T09:30:00.000Z",
      "2027-03-29T10:30:00.000Z",
      "2027-03-30T03:30:00.000Z",
      "2027-03-30T04:30:00.000Z",
      "2027-03-30T05:30:00.000Z",
      "2027-03-30T06:30:00.000Z",
      "2027-03-30T07:30:00.000Z",
      "2027-03-30T08:30:00.000Z",
      "2027-03-30T09:30:00.000Z",
      "2027-03-30T10:30:00.000Z",
      "2027-03-31T03:30:00.000Z",
      "2027-03-31T04:30:00.000Z",
      "2027-03-31T05:30:00.000Z",
      "2027-03-31T06:30:00.000Z",
      "2027-03-31T07:30:00.000Z",
      "2027-03-31T08:30:00.000Z",
      "2027-03-31T09:30:00.000Z",
      "2027-03-31T10:30:00.000Z",
      "2027-04-01T03:30:00.000Z",
      "2027-04-01T04:30:00.000Z",
      "2027-04-01T05:30:00.000Z",
      "2027-04-01T06:30:00.000Z",
      "2027-04-01T07:30:00.000Z",
      "2027-04-01T08:30:00.000Z",
      "2027-04-01T09:30:00.000Z",
      "2027-04-01T10:30:00.000Z",
      "2027-04-02T03:30:00.000Z",
      "2027-04-02T04:30:00.000Z",
      "2027-04-02T05:30:00.000Z",
      "2027-04-02T06:30:00.000Z",
      "2027-04-02T07:30:00.000Z",
      "2027-04-02T08:30:00.000Z",
      "2027-04-02T09:30:00.000Z",
      "2027-04-02T10:30:00.000Z",
      "2027-04-05T03:30:00.000Z",
      "2027-04-05T04:30:00.000Z",
      "2027-04-05T05:30:00.000Z",
      "2027-04-05T06:30:00.000Z",
      "2027-04-05T07:30:00.000Z",
      "2027-04-05T08:30:00.000Z",
      "2027-04-05T09:30:00.000Z",
      "2027-04-05T10:30:00.000Z",
      "2027-04-06T03:30:00.000Z",
      "2027-04-06T04:30:00.000Z",
      "2027-04-06T05:30:00.000Z",
      "2027-04-06T06:30:00.000Z",
      "2027-04-06T07:30:00.000Z",
      "2027-04-06T08:30:00.000Z",
      "2027-04-06T09:30:00.000Z",
      "2027-04-06T10:30:00.000Z",
      "2027-04-07T03:30:00.000Z",
      "2027-04-07T04:30:00.000Z",
      "2027-04-07T05:30:00.000Z",
      "2027-04-07T06:30:00.000Z",
      "2027-04-07T07:30:00.000Z",
      "2027-04-07T08:30:00.000Z",
      "2027-04-07T09:30:00.000Z",
      "2027-04-07T10:30:00.000Z",
      "2027-04-08T03:30:00.000Z",
      "2027-04-08T04:30:00.000Z",
      "2027-04-08T05:30:00.000Z",
      "2027-04-08T06:30:00.000Z",
      "2027-04-08T07:30:00.000Z",
      "2027-04-08T08:30:00.000Z",
      "2027-04-08T09:30:00.000Z",
      "2027-04-08T10:30:00.000Z",
      "2027-04-09T03:30:00.000Z",
      "2027-04-09T04:30:00.000Z",
      "2027-04-09T05:30:00.000Z",
      "2027-04-09T06:30:00.000Z",
      "2027-04-09T07:30:00.000Z",
      "2027-04-09T08:30:00.000Z",
      "2027-04-09T09:30:00.000Z",
      "2027-04-09T10:30:00.000Z",
      "2027-04-12T03:30:00.000Z",
      "2027-04-12T04:30:00.000Z",
      "2027-04-12T05:30:00.000Z",
      "2027-04-12T06:30:00.000Z",
      "2027-04-12T07:30:00.000Z",
      "2027-04-12T08:30:00.000Z",
      "2027-04-12T09:30:00.000Z",
      "2027-04-12T10:30:00.000Z",
      "2027-04-13T03:30:00.000Z",
      "2027-04-13T04:30:00.000Z",
      "2027-04-13T05:30:00.000Z",
      "2027-04-13T06:30:00.000Z",
      "2027-04-13T07:30:00.000Z",
      "2027-04-13T08:30:00.000Z",
      "2027-04-13T09:30:00.000Z",
      "2027-04-13T10:30:00.000Z",
      "2027-04-14T03:30:00.000Z",
      "2027-04-14T04:30:00.000Z",
      "2027-04-14T05:30:00.000Z",
      "2027-04-14T06:30:00.000Z",
      "2027-04-14T07:30:00.000Z",
      "2027-04-14T08:30:00.000Z",
      "2027-04-14T09:30:00.000Z",
      "2027-04-14T10:30:00.000Z",
      "2027-04-15T03:30:00.000Z",
      "2027-04-15T04:30:00.000Z",
      "2027-04-15T05:30:00.000Z",
      "2027-04-15T06:30:00.000Z",
      "2027-04-15T07:30:00.000Z",
      "2027-04-15T08:30:00.000Z",
      "2027-04-15T09:30:00.000Z",
      "2027-04-15T10:30:00.000Z",
      "2027-04-16T03:30:00.000Z",
      "2027-04-16T04:30:00.000Z",
      "2027-04-16T05:30:00.000Z",
      "2027-04-16T06:30:00.000Z",
      "2027-04-16T07:30:00.000Z",
      "2027-04-16T08:30:00.000Z",
      "2027-04-16T09:30:00.000Z",
      "2027-04-16T10:30:00.000Z",
      "2027-04-19T03:30:00.000Z",
      "2027-04-19T04:30:00.000Z",
      "2027-04-19T05:30:00.000Z",
      "2027-04-19T06:30:00.000Z",
      "2027-04-19T07:30:00.000Z",
      "2027-04-19T08:30:00.000Z",
      "2027-04-19T09:30:00.000Z",
      "2027-04-19T10:30:00.000Z",
      "2027-04-20T03:30:00.000Z",
      "2027-04-20T04:30:00.000Z",
      "2027-04-20T05:30:00.000Z"
    ],
    "memberIds": [
      "cmv7m0yni0000m6ajycty4i5g",
      "cmv7m0ynt0001m6aj9463ongt",
      "cmv7m0yoc0006m6ajltfalgb3",
      "cmv7m0yoc0007m6aj5d6b9swh",
      "cmv7m0yo80003m6aji2w1bj1s",
      "cmv7m0yox000ym6ajy8n7r3f6",
      "cmv7m0yox000xm6ajxe01izbx",
      "cmv7m0yon000lm6aj87l8mn85",
      "cmv7m0yod0008m6aji49lc7o6",
      "cmv7m0yoc0005m6aj0kw6mkr5",
      "cmv7m0yos000qm6ajcl1lnc9v",
      "cmv7m0yoe000am6aj4yev8jp5",
      "cmv7m0yox000zm6ajp2w6u51u",
      "cmv7m0yoi000gm6ajqyj07yae",
      "cmv7m0yoi000em6aj2hhx9fkz",
      "cmv7m0yoi000hm6ajryo75i61",
      "cmv7m0yoi000fm6aj4ysx2n9g",
      "cmv7m0yok000jm6ajirp6l8xb",
      "cmv7m0yol000km6ajk0yp14i1",
      "cmv7m0yo90004m6ajrioueemc"
    ]
  }
}
````

## File: apps/api/performance/results/optimized/seed-0.json
````json
{
  "practitionerId": "cmv7mjlgr0000m6g5ge1z45l3",
  "practitionerHandle": "perf.practitioner",
  "sessionTypeId": "cmv7mjlhc0002m6g50kft92y9",
  "sessionTypeName": "Perf slot",
  "bookingCount": 0,
  "slotMinutes": 15,
  "startDays": 1,
  "spanDays": 0,
  "window": {
    "fromDays": 1,
    "toDays": 2
  }
}
````

## File: apps/api/performance/results/optimized/seed-1200.json
````json
{
  "practitionerId": "cmv7mjlgr0000m6g5ge1z45l3",
  "practitionerHandle": "perf.practitioner",
  "sessionTypeId": "cmv7mjlhc0002m6g50kft92y9",
  "sessionTypeName": "Perf slot",
  "bookingCount": 1200,
  "slotMinutes": 15,
  "startDays": 1,
  "spanDays": 13,
  "window": {
    "fromDays": 1,
    "toDays": 15
  }
}
````

## File: apps/api/performance/results/optimized/seed-400.json
````json
{
  "practitionerId": "cmv7mjlgr0000m6g5ge1z45l3",
  "practitionerHandle": "perf.practitioner",
  "sessionTypeId": "cmv7mjlhc0002m6g50kft92y9",
  "sessionTypeName": "Perf slot",
  "bookingCount": 400,
  "slotMinutes": 15,
  "startDays": 1,
  "spanDays": 5,
  "window": {
    "fromDays": 1,
    "toDays": 7
  }
}
````

## File: apps/api/performance/results/optimized/seed-800.json
````json
{
  "practitionerId": "cmv7mjlgr0000m6g5ge1z45l3",
  "practitionerHandle": "perf.practitioner",
  "sessionTypeId": "cmv7mjlhc0002m6g50kft92y9",
  "sessionTypeName": "Perf slot",
  "bookingCount": 800,
  "slotMinutes": 15,
  "startDays": 1,
  "spanDays": 9,
  "window": {
    "fromDays": 1,
    "toDays": 11
  }
}
````

## File: apps/api/performance/results/optimized/slot-lookup-2026-10-14T04-53-20-603Z.json
````json
{
  "metrics": {
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 10,
        "min": 10,
        "max": 10
      }
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "max": 10,
        "value": 10,
        "min": 10
      }
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 0,
        "max": 0.276573,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0.0022459556756756756,
        "min": 0
      }
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "passes": 0,
        "fails": 925,
        "rate": 0
      },
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 216.64672177405407,
        "min": 2.725289,
        "med": 216.001862,
        "max": 395.852564,
        "p(90)": 235.79137400000002,
        "p(95)": 305.827484
      }
    },
    "slots_returned": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 100,
        "min": 100,
        "med": 100,
        "max": 100,
        "p(90)": 100,
        "p(95)": 100
      }
    },
    "slots_total_open": {
      "values": {
        "p(90)": 1344,
        "p(95)": 1344,
        "avg": 1344,
        "min": 1344,
        "med": 1344,
        "max": 1344
      },
      "type": "trend",
      "contains": "time"
    },
    "slots_scanned_days": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 15,
        "min": 15,
        "med": 15,
        "max": 15,
        "p(90)": 15,
        "p(95)": 15
      }
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 216.7969754475676,
        "min": 2.957163,
        "med": 216.137048,
        "max": 396.00398,
        "p(90)": 235.98618960000002,
        "p(95)": 305.9811916
      }
    },
    "slots_conflicts_considered": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.01391168864864865,
        "min": 0.005238,
        "med": 0.009638,
        "max": 0.516409,
        "p(90)": 0.01292,
        "p(95)": 0.015001999999999996
      }
    },
    "http_req_receiving": {
      "contains": "time",
      "values": {
        "med": 0.117334,
        "max": 0.38357,
        "p(90)": 0.14940540000000002,
        "p(95)": 0.16133439999999993,
        "avg": 0.12171970054054056,
        "min": 0.072495
      },
      "type": "trend"
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 923,
        "rate": 45.69431795845919
      }
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 925,
        "rate": 45.7933305650864
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 7523618,
        "rate": 372466.51472371264
      }
    },
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 396.00398,
        "p(90)": 235.98618960000002,
        "p(95)": 305.9811916,
        "avg": 216.7969754475676,
        "min": 2.957163,
        "med": 216.137048
      }
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0,
        "min": 0
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 277190,
        "rate": 13722.652215498701
      }
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 37.728504,
        "med": 216.609387,
        "max": 396.391531,
        "p(90)": 236.4847932,
        "p(95)": 306.3769773,
        "avg": 217.69559637703153
      }
    },
    "http_req_sending": {
      "values": {
        "max": 0.356682,
        "p(90)": 0.038553,
        "p(95)": 0.048930999999999995,
        "avg": 0.028533972972973012,
        "min": 0.012921,
        "med": 0.025701
      },
      "type": "trend",
      "contains": "time"
    }
  },
  "setup_data": {
    "url": "http://localhost:3001/api/practitioners/cmv7mjlgr0000m6g5ge1z45l3/slots?from=2026-10-15T04:53:00.412Z&to=2026-10-29T04:53:00.412Z&sessionTypeId=cmv7mjlhc0002m6g50kft92y9&maxSlots=100",
    "viewerId": "cmv7m0yni0000m6ajycty4i5g"
  },
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "testRunDurationMs": 20199.448011,
    "isStdOutTTY": false,
    "isStdErrTTY": false
  }
}
````

## File: apps/api/performance/results/optimized/slot-lookup-2026-10-14T04-53-43-936Z.json
````json
{
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 20214.425089
  },
  "metrics": {
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 2.807076,
        "med": 213.787371,
        "max": 481.297906,
        "p(90)": 362.540341,
        "p(95)": 385.410974,
        "avg": 227.8581954097617
      }
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.11420257888762772,
        "min": 0.068515,
        "med": 0.110559,
        "max": 0.300739,
        "p(90)": 0.143246,
        "p(95)": 0.156376
      }
    },
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 10,
        "min": 10,
        "max": 10
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 227.71798319409737,
        "min": 2.608028,
        "med": 213.632392,
        "max": 481.153892,
        "p(90)": 362.414835,
        "p(95)": 385.289381
      }
    },
    "slots_total_open": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 944,
        "p(90)": 944,
        "p(95)": 944,
        "avg": 944,
        "min": 944,
        "med": 944
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "rate": 354513.8171601849,
        "count": 7166293
      }
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 881
      },
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      }
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 881,
        "rate": 43.582738372282975
      }
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 481.297906,
        "p(90)": 362.540341,
        "p(95)": 385.410974,
        "avg": 227.8581954097617,
        "min": 2.807076,
        "med": 213.787371
      }
    },
    "http_req_blocked": {
      "values": {
        "p(90)": 0.012152,
        "p(95)": 0.014248,
        "avg": 0.013310429057888745,
        "min": 0.005238,
        "med": 0.009079,
        "max": 0.58213
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0,
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0
      }
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 481.738887,
        "p(90)": 362.9440636,
        "p(95)": 385.73090529999996,
        "avg": 228.77529509783852,
        "min": 35.374263,
        "med": 214.281974
      }
    },
    "iterations": {
      "values": {
        "count": 879,
        "rate": 43.48379912512683
      },
      "type": "counter",
      "contains": "default"
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 263990,
        "rate": 13059.48592837569
      }
    },
    "slots_conflicts_considered": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 400,
        "med": 400,
        "max": 400,
        "p(90)": 400,
        "p(95)": 400,
        "avg": 400
      }
    },
    "slots_returned": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 100,
        "med": 100,
        "max": 100,
        "p(90)": 100,
        "p(95)": 100,
        "avg": 100
      }
    },
    "vus_max": {
      "values": {
        "value": 10,
        "min": 10,
        "max": 10
      },
      "type": "gauge",
      "contains": "default"
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.0024331180476730987,
        "min": 0,
        "med": 0,
        "max": 0.34816,
        "p(90)": 0,
        "p(95)": 0
      }
    },
    "slots_scanned_days": {
      "contains": "time",
      "values": {
        "p(95)": 15,
        "avg": 15,
        "min": 15,
        "med": 15,
        "max": 15,
        "p(90)": 15
      },
      "type": "trend"
    },
    "http_req_sending": {
      "contains": "time",
      "values": {
        "max": 0.31771,
        "p(90)": 0.033384,
        "p(95)": 0.040857,
        "avg": 0.026009636776390448,
        "min": 0.011733,
        "med": 0.023886
      },
      "type": "trend"
    }
  },
  "setup_data": {
    "url": "http://localhost:3001/api/practitioners/cmv7mjlgr0000m6g5ge1z45l3/slots?from=2026-10-15T04:53:23.728Z&to=2026-10-29T04:53:23.728Z&sessionTypeId=cmv7mjlhc0002m6g50kft92y9&maxSlots=100",
    "viewerId": "cmv7m0yni0000m6ajycty4i5g"
  }
}
````

## File: apps/api/performance/results/optimized/slot-lookup-2026-10-14T04-54-07-528Z.json
````json
{
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 20247.209223
  },
  "metrics": {
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 252290,
        "rate": 12460.482687826869
      }
    },
    "vus": {
      "values": {
        "value": 10,
        "min": 10,
        "max": 10
      },
      "type": "gauge",
      "contains": "default"
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 470.778529,
        "p(90)": 369.22381119999994,
        "p(95)": 395.322056,
        "avg": 238.5655561377674,
        "min": 2.591058,
        "med": 231.32143250000001
      }
    },
    "http_req_failed": {
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      },
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 842
      }
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 395.52991585,
        "avg": 238.7128502779097,
        "min": 3.076179,
        "med": 231.573491,
        "max": 470.916326,
        "p(90)": 369.3815492
      }
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.006863231591448931,
        "min": 0,
        "med": 0,
        "max": 1.165798,
        "p(90)": 0,
        "p(95)": 0
      }
    },
    "slots_total_open": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 544,
        "avg": 544,
        "min": 544,
        "med": 544,
        "max": 544,
        "p(90)": 544
      }
    },
    "slots_scanned_days": {
      "values": {
        "min": 15,
        "med": 15,
        "max": 15,
        "p(90)": 15,
        "p(95)": 15,
        "avg": 15
      },
      "type": "trend",
      "contains": "time"
    },
    "slots_conflicts_considered": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 800,
        "min": 800,
        "med": 800,
        "max": 800,
        "p(90)": 800,
        "p(95)": 800
      }
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 370.0688687,
        "p(95)": 396.04445065,
        "avg": 239.68768012619097,
        "min": 37.084569,
        "med": 232.58410750000002,
        "max": 471.435461
      }
    },
    "slots_returned": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 100,
        "max": 100,
        "p(90)": 100,
        "p(95)": 100,
        "avg": 100,
        "min": 100
      }
    },
    "vus_max": {
      "contains": "default",
      "values": {
        "value": 10,
        "min": 10,
        "max": 10
      },
      "type": "gauge"
    },
    "http_req_duration{expected_response:true}": {
      "contains": "time",
      "values": {
        "min": 3.076179,
        "med": 231.573491,
        "max": 470.916326,
        "p(90)": 369.3815492,
        "p(95)": 395.52991585,
        "avg": 238.7128502779097
      },
      "type": "trend"
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0.005657,
        "med": 0.009428,
        "max": 1.231589,
        "p(90)": 0.012494099999999998,
        "p(95)": 0.014362549999999967,
        "avg": 0.01985770546318293
      }
    },
    "http_req_tls_handshaking": {
      "contains": "time",
      "values": {
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0
      },
      "type": "trend"
    },
    "http_req_sending": {
      "contains": "time",
      "values": {
        "p(90)": 0.03527,
        "p(95)": 0.04517749999999998,
        "avg": 0.029024035629453694,
        "min": 0.011803,
        "med": 0.024584,
        "max": 1.004114
      },
      "type": "trend"
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 840,
        "rate": 41.48719908745717
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 6848755,
        "rate": 338256.7406978783
      }
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 842,
        "rate": 41.5859781329035
      }
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0.073543,
        "med": 0.112934,
        "max": 0.844526,
        "p(90)": 0.1455291,
        "p(95)": 0.15983909999999998,
        "avg": 0.11827010451306415
      }
    }
  },
  "setup_data": {
    "url": "http://localhost:3001/api/practitioners/cmv7mjlgr0000m6g5ge1z45l3/slots?from=2026-10-15T04:53:47.287Z&to=2026-10-29T04:53:47.287Z&sessionTypeId=cmv7mjlhc0002m6g50kft92y9&maxSlots=100",
    "viewerId": "cmv7m0yni0000m6ajycty4i5g"
  },
  "root_group": {
    "checks": [],
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": []
  }
}
````

## File: apps/api/performance/results/optimized/slot-lookup-2026-10-14T04-54-31-270Z.json
````json
{
  "metrics": {
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 231.99840749999998,
        "max": 462.281055,
        "p(90)": 388.3316599,
        "p(95)": 409.1425781,
        "avg": 248.4438878481481,
        "min": 48.780711
      }
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 408.6619234,
        "avg": 247.42306634975387,
        "min": 3.221452,
        "med": 231.2717265,
        "max": 461.89469,
        "p(90)": 387.75060039999994
      }
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 0.214275,
        "p(90)": 0.033866,
        "p(95)": 0.042386999999999994,
        "avg": 0.02651649630541873,
        "min": 0.011734,
        "med": 0.024166
      }
    },
    "http_req_failed": {
      "contains": "default",
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 812
      },
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      },
      "type": "rate"
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 6605305,
        "rate": 326473.406630011
      }
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 812,
        "rate": 40.133863036388014
      }
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "min": 10,
        "max": 10,
        "value": 10
      }
    },
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 247.42306634975387,
        "min": 3.221452,
        "med": 231.2717265,
        "max": 461.89469,
        "p(90)": 387.75060039999994,
        "p(95)": 408.6619234
      }
    },
    "slots_scanned_days": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 15,
        "p(95)": 15,
        "avg": 15,
        "min": 15,
        "med": 15,
        "max": 15
      }
    },
    "http_req_blocked": {
      "contains": "time",
      "values": {
        "avg": 0.015191874384236486,
        "min": 0.005378,
        "med": 0.009149,
        "max": 0.843619,
        "p(90)": 0.012005999999999998,
        "p(95)": 0.01340199999999999
      },
      "type": "trend"
    },
    "slots_conflicts_considered": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 1200,
        "p(95)": 1200,
        "avg": 1200,
        "min": 1200,
        "med": 1200,
        "max": 1200
      }
    },
    "iterations": {
      "contains": "default",
      "values": {
        "rate": 40.03501115698805,
        "count": 810
      },
      "type": "counter"
    },
    "vus": {
      "values": {
        "min": 10,
        "max": 10,
        "value": 10
      },
      "type": "gauge",
      "contains": "default"
    },
    "http_req_connecting": {
      "values": {
        "avg": 0.00340298275862069,
        "min": 0,
        "med": 0,
        "max": 0.746469,
        "p(90)": 0,
        "p(95)": 0
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 387.6055316,
        "p(95)": 408.50414709999995,
        "avg": 247.27700081280798,
        "min": 2.832154,
        "med": 231.144021,
        "max": 461.772886
      }
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.11954904064039394,
        "min": 0.06635,
        "med": 0.116147,
        "max": 0.37966,
        "p(90)": 0.1462762,
        "p(95)": 0.15964859999999995
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 243290,
        "rate": 12024.83686960941
      }
    },
    "slots_returned": {
      "contains": "time",
      "values": {
        "avg": 100,
        "min": 100,
        "med": 100,
        "max": 100,
        "p(90)": 100,
        "p(95)": 100
      },
      "type": "trend"
    },
    "slots_total_open": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 144,
        "p(90)": 144,
        "p(95)": 144,
        "avg": 144,
        "min": 144,
        "med": 144
      }
    }
  },
  "setup_data": {
    "url": "http://localhost:3001/api/practitioners/cmv7mjlgr0000m6g5ge1z45l3/slots?from=2026-10-15T04:54:11.044Z&to=2026-10-29T04:54:11.045Z&sessionTypeId=cmv7mjlhc0002m6g50kft92y9&maxSlots=100",
    "viewerId": "cmv7m0yni0000m6ajycty4i5g"
  },
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 20232.291102
  }
}
````

## File: apps/api/performance/results/slot-optimized/seed-0.json
````json
{
  "practitionerId": "cmv7mjlgr0000m6g5ge1z45l3",
  "practitionerHandle": "perf.practitioner",
  "sessionTypeId": "cmv7mjlhc0002m6g50kft92y9",
  "sessionTypeName": "Perf slot",
  "bookingCount": 0,
  "slotMinutes": 15,
  "startDays": 1,
  "spanDays": 0,
  "window": {
    "fromDays": 1,
    "toDays": 2
  }
}
````

## File: apps/api/performance/results/slot-optimized/seed-1200.json
````json
{
  "practitionerId": "cmv7mjlgr0000m6g5ge1z45l3",
  "practitionerHandle": "perf.practitioner",
  "sessionTypeId": "cmv7mjlhc0002m6g50kft92y9",
  "sessionTypeName": "Perf slot",
  "bookingCount": 1200,
  "slotMinutes": 15,
  "startDays": 1,
  "spanDays": 13,
  "window": {
    "fromDays": 1,
    "toDays": 15
  }
}
````

## File: apps/api/performance/results/slot-optimized/seed-400.json
````json
{
  "practitionerId": "cmv7mjlgr0000m6g5ge1z45l3",
  "practitionerHandle": "perf.practitioner",
  "sessionTypeId": "cmv7mjlhc0002m6g50kft92y9",
  "sessionTypeName": "Perf slot",
  "bookingCount": 400,
  "slotMinutes": 15,
  "startDays": 1,
  "spanDays": 5,
  "window": {
    "fromDays": 1,
    "toDays": 7
  }
}
````

## File: apps/api/performance/results/slot-optimized/seed-800.json
````json
{
  "practitionerId": "cmv7mjlgr0000m6g5ge1z45l3",
  "practitionerHandle": "perf.practitioner",
  "sessionTypeId": "cmv7mjlhc0002m6g50kft92y9",
  "sessionTypeName": "Perf slot",
  "bookingCount": 800,
  "slotMinutes": 15,
  "startDays": 1,
  "spanDays": 9,
  "window": {
    "fromDays": 1,
    "toDays": 11
  }
}
````

## File: apps/api/performance/results/slot-optimized/slot-lookup-2026-10-14T04-56-23-992Z.json
````json
{
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": []
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 20067.749272
  },
  "metrics": {
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "max": 10,
        "value": 10,
        "min": 10
      }
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 10,
        "min": 10,
        "max": 10
      }
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 3350,
        "rate": 166.93451540548028
      }
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 74.75280309999995,
        "avg": 59.36072000089535,
        "min": 5.341168,
        "med": 58.334963,
        "max": 106.075074,
        "p(90)": 68.482009
      }
    },
    "http_req_waiting": {
      "contains": "time",
      "values": {
        "max": 105.962208,
        "p(90)": 68.3500254,
        "p(95)": 74.62939934999997,
        "avg": 59.22589323313448,
        "min": 5.134086,
        "med": 58.205406499999995
      },
      "type": "trend"
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 3348,
        "rate": 166.8348530082233
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 1004690,
        "rate": 50064.90695006925
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 27265543,
        "rate": 1358674.688946951
      }
    },
    "slots_conflicts_considered": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 0,
        "max": 0,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0,
        "min": 0
      }
    },
    "slots_scanned_days": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 15,
        "min": 15,
        "med": 15,
        "max": 15,
        "p(90)": 15,
        "p(95)": 15
      }
    },
    "iteration_duration": {
      "contains": "time",
      "values": {
        "avg": 59.79074184348872,
        "min": 29.016842,
        "med": 58.7434285,
        "max": 106.395649,
        "p(90)": 68.9744985,
        "p(95)": 75.3249209
      },
      "type": "trend"
    },
    "http_req_blocked": {
      "contains": "time",
      "values": {
        "max": 0.595962,
        "p(90)": 0.012781,
        "p(95)": 0.014457,
        "avg": 0.011161551940298558,
        "min": 0.005099,
        "med": 0.00915
      },
      "type": "trend"
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0,
        "med": 0,
        "max": 0.484005,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0.0007639462686567164
      }
    },
    "http_req_receiving": {
      "contains": "time",
      "values": {
        "med": 0.104484,
        "max": 0.455929,
        "p(90)": 0.1350741,
        "p(95)": 0.14761449999999998,
        "avg": 0.1081284704477615,
        "min": 0.047283
      },
      "type": "trend"
    },
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 68.482009,
        "p(95)": 74.75280309999995,
        "avg": 59.36072000089535,
        "min": 5.341168,
        "med": 58.334963,
        "max": 106.075074
      }
    },
    "http_req_failed": {
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 3350
      },
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      }
    },
    "slots_returned": {
      "values": {
        "min": 100,
        "med": 100,
        "max": 100,
        "p(90)": 100,
        "p(95)": 100,
        "avg": 100
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_sending": {
      "contains": "time",
      "values": {
        "p(90)": 0.03653399999999999,
        "p(95)": 0.04365854999999996,
        "avg": 0.026698297313432817,
        "min": 0.011105,
        "med": 0.0244095,
        "max": 0.292778
      },
      "type": "trend"
    },
    "slots_total_open": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 1344,
        "p(95)": 1344,
        "avg": 1344,
        "min": 1344,
        "med": 1344,
        "max": 1344
      }
    },
    "http_req_tls_handshaking": {
      "values": {
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0
      },
      "type": "trend",
      "contains": "time"
    }
  },
  "setup_data": {
    "url": "http://localhost:3001/api/practitioners/cmv7mjlgr0000m6g5ge1z45l3/slots?from=2026-10-15T04:56:03.936Z&to=2026-10-29T04:56:03.936Z&sessionTypeId=cmv7mjlhc0002m6g50kft92y9&maxSlots=100",
    "viewerId": "cmv7m0yni0000m6ajycty4i5g"
  }
}
````

## File: apps/api/performance/results/slot-optimized/slot-lookup-2026-10-14T04-56-47-349Z.json
````json
{
  "root_group": {
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": [],
    "name": ""
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 20147.877046
  },
  "metrics": {
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 78.3768177522575,
        "min": 2.873023,
        "med": 72.108447,
        "max": 306.05747,
        "p(90)": 116.96484760000001,
        "p(95)": 126.28109629999999
      }
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0.058667,
        "med": 0.108884,
        "max": 0.766447,
        "p(90)": 0.15009,
        "p(95)": 0.16908059999999991,
        "avg": 0.11594845347467612
      }
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "max": 10,
        "value": 10,
        "min": 10
      }
    },
    "data_received": {
      "contains": "data",
      "values": {
        "count": 20730865,
        "rate": 1028935.4532325647
      },
      "type": "counter"
    },
    "slots_returned": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 100,
        "min": 100,
        "med": 100,
        "max": 100,
        "p(90)": 100,
        "p(95)": 100
      }
    },
    "slots_scanned_days": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 15,
        "avg": 15,
        "min": 15,
        "med": 15,
        "max": 15,
        "p(90)": 15
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 0.441471,
        "p(90)": 0.01327,
        "p(95)": 0.015296,
        "avg": 0.011507862976050293,
        "min": 0.005657,
        "med": 0.009499
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 763790,
        "rate": 37909.20493787889
      }
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 0.215673,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0.000829605418138987,
        "min": 0,
        "med": 0
      }
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 126.14255779999999,
        "avg": 78.23421995759725,
        "min": 2.633884,
        "med": 71.935239,
        "max": 305.210845,
        "p(90)": 116.8320782
      }
    },
    "http_req_failed": {
      "contains": "default",
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 2547
      },
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      },
      "type": "rate"
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 2547,
        "rate": 126.41530391439733
      }
    },
    "slots_total_open": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 944,
        "min": 944,
        "med": 944,
        "max": 944,
        "p(90)": 944,
        "p(95)": 944
      }
    },
    "iteration_duration": {
      "contains": "time",
      "values": {
        "max": 306.776844,
        "p(90)": 117.3935846,
        "p(95)": 126.71789059999999,
        "avg": 78.84605352141465,
        "min": 16.346749,
        "med": 72.565644
      },
      "type": "trend"
    },
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 10,
        "min": 10,
        "max": 10
      }
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0
      }
    },
    "slots_conflicts_considered": {
      "values": {
        "avg": 400,
        "min": 400,
        "med": 400,
        "max": 400,
        "p(90)": 400,
        "p(95)": 400
      },
      "type": "trend",
      "contains": "time"
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 2545,
        "rate": 126.31603787284695
      }
    },
    "http_req_sending": {
      "values": {
        "p(90)": 0.036695000000000005,
        "p(95)": 0.04514599999999997,
        "avg": 0.026649341185708705,
        "min": 0.011873,
        "med": 0.024445,
        "max": 0.230409
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 116.96484760000001,
        "p(95)": 126.28109629999999,
        "avg": 78.3768177522575,
        "min": 2.873023,
        "med": 72.108447,
        "max": 306.05747
      }
    }
  },
  "setup_data": {
    "url": "http://localhost:3001/api/practitioners/cmv7mjlgr0000m6g5ge1z45l3/slots?from=2026-10-15T04:56:27.202Z&to=2026-10-29T04:56:27.202Z&sessionTypeId=cmv7mjlhc0002m6g50kft92y9&maxSlots=100",
    "viewerId": "cmv7m0yni0000m6ajycty4i5g"
  }
}
````

## File: apps/api/performance/results/slot-optimized/slot-lookup-2026-10-14T04-57-14-316Z.json
````json
{
  "root_group": {
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [],
    "checks": [],
    "name": "",
    "path": ""
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  },
  "state": {
    "isStdErrTTY": false,
    "testRunDurationMs": 20087.859698,
    "isStdOutTTY": false
  },
  "metrics": {
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 86.3030966821705,
        "min": 19.584773,
        "med": 83.2234455,
        "max": 168.800482,
        "p(90)": 127.10302610000002,
        "p(95)": 135.68284375
      }
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 696890,
        "rate": 34692.098136736
      }
    },
    "http_req_waiting": {
      "contains": "time",
      "values": {
        "avg": 85.68847345998272,
        "min": 3.223353,
        "med": 82.5999525,
        "max": 168.238951,
        "p(90)": 126.50575480000003,
        "p(95)": 135.21407309999998
      },
      "type": "trend"
    },
    "data_received": {
      "contains": "data",
      "values": {
        "count": 18915199,
        "rate": 941623.4125671063
      },
      "type": "counter"
    },
    "http_req_duration{expected_response:true}": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 85.82760121858847,
        "min": 3.452854,
        "med": 82.738048,
        "max": 168.383385,
        "p(90)": 126.65945660000006,
        "p(95)": 135.36039169999998
      }
    },
    "http_req_failed": {
      "contains": "default",
      "values": {
        "passes": 0,
        "fails": 2324,
        "rate": 0
      },
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      },
      "type": "rate"
    },
    "http_req_sending": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 0.216021,
        "p(90)": 0.033384,
        "p(95)": 0.03824164999999998,
        "avg": 0.025442003442340877,
        "min": 0.012013,
        "med": 0.024165
      }
    },
    "slots_scanned_days": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 15,
        "p(90)": 15,
        "p(95)": 15,
        "avg": 15,
        "min": 15,
        "med": 15
      }
    },
    "http_reqs": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 2324,
        "rate": 115.69176781095219
      }
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 85.82760121858847,
        "min": 3.452854,
        "med": 82.738048,
        "max": 168.383385,
        "p(90)": 126.65945660000006,
        "p(95)": 135.36039169999998
      }
    },
    "slots_returned": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 100,
        "min": 100,
        "med": 100,
        "max": 100,
        "p(90)": 100,
        "p(95)": 100
      }
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 0.151746,
        "avg": 0.11368575516351116,
        "min": 0.053918,
        "med": 0.110072,
        "max": 0.613074,
        "p(90)": 0.14017369999999998
      }
    },
    "iterations": {
      "type": "counter",
      "contains": "default",
      "values": {
        "count": 2322,
        "rate": 115.5922051880512
      }
    },
    "vus": {
      "values": {
        "value": 10,
        "min": 10,
        "max": 10
      },
      "type": "gauge",
      "contains": "default"
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "min": 10,
        "max": 10,
        "value": 10
      }
    },
    "http_req_blocked": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 0.009498,
        "max": 0.503911,
        "p(90)": 0.012362,
        "p(95)": 0.013759,
        "avg": 0.01143847332185891,
        "min": 0.004749
      }
    },
    "slots_conflicts_considered": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 800,
        "max": 800,
        "p(90)": 800,
        "p(95)": 800,
        "avg": 800,
        "min": 800
      }
    },
    "slots_total_open": {
      "type": "trend",
      "contains": "time",
      "values": {
        "med": 544,
        "max": 544,
        "p(90)": 544,
        "p(95)": 544,
        "avg": 544,
        "min": 544
      }
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 0,
        "med": 0,
        "max": 0.39384,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0.0009251381239242686
      }
    },
    "http_req_tls_handshaking": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 0,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0,
        "min": 0,
        "med": 0
      }
    }
  },
  "setup_data": {
    "viewerId": "cmv7m0yni0000m6ajycty4i5g",
    "url": "http://localhost:3001/api/practitioners/cmv7mjlgr0000m6g5ge1z45l3/slots?from=2026-10-15T04:56:54.236Z&to=2026-10-29T04:56:54.236Z&sessionTypeId=cmv7mjlhc0002m6g50kft92y9&maxSlots=100"
  }
}
````

## File: apps/api/performance/results/slot-optimized/slot-lookup-2026-10-14T04-57-37-811Z.json
````json
{
  "state": {
    "isStdOutTTY": false,
    "isStdErrTTY": false,
    "testRunDurationMs": 20081.891697
  },
  "metrics": {
    "vus": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 10,
        "min": 10,
        "max": 10
      }
    },
    "iteration_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 91.924045775688,
        "min": 22.826231,
        "med": 91.098026,
        "max": 169.768111,
        "p(90)": 132.89766530000003,
        "p(95)": 141.53798444999995
      }
    },
    "data_received": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 17761215,
        "rate": 884439.338085531
      }
    },
    "http_reqs": {
      "values": {
        "count": 2182,
        "rate": 108.65510246357744
      },
      "type": "counter",
      "contains": "default"
    },
    "http_req_waiting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 1.956558,
        "med": 90.52905200000001,
        "max": 169.153082,
        "p(90)": 132.3868159,
        "p(95)": 141.14368564999998,
        "avg": 91.28966196425293
      }
    },
    "http_req_receiving": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 0.11735532905591187,
        "min": 0.041905,
        "med": 0.113982,
        "max": 0.521023,
        "p(90)": 0.1445661,
        "p(95)": 0.1590765499999999
      }
    },
    "http_req_sending": {
      "values": {
        "min": 0.011454,
        "med": 0.024025,
        "max": 0.253597,
        "p(90)": 0.033384,
        "p(95)": 0.039531,
        "avg": 0.02597587488542618
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_blocked": {
      "values": {
        "min": 0.005169,
        "med": 0.009568,
        "max": 0.728384,
        "p(90)": 0.012501,
        "p(95)": 0.013825499999999987,
        "avg": 0.012099893217231913
      },
      "type": "trend",
      "contains": "time"
    },
    "http_req_tls_handshaking": {
      "values": {
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0,
        "min": 0,
        "med": 0,
        "max": 0
      },
      "type": "trend",
      "contains": "time"
    },
    "data_sent": {
      "type": "counter",
      "contains": "data",
      "values": {
        "count": 654290,
        "rate": 32581.093946330926
      }
    },
    "slots_returned": {
      "type": "trend",
      "contains": "time",
      "values": {
        "min": 100,
        "med": 100,
        "max": 100,
        "p(90)": 100,
        "p(95)": 100,
        "avg": 100
      }
    },
    "http_req_duration": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(90)": 132.5418021,
        "p(95)": 141.24490355,
        "avg": 91.43299316819414,
        "min": 2.131163,
        "med": 90.67387049999999,
        "max": 169.299471
      }
    },
    "http_req_duration{expected_response:true}": {
      "contains": "time",
      "values": {
        "min": 2.131163,
        "med": 90.67387049999999,
        "max": 169.299471,
        "p(90)": 132.5418021,
        "p(95)": 141.24490355,
        "avg": 91.43299316819414
      },
      "type": "trend"
    },
    "http_req_connecting": {
      "type": "trend",
      "contains": "time",
      "values": {
        "max": 0.352703,
        "p(90)": 0,
        "p(95)": 0,
        "avg": 0.001046992208982585,
        "min": 0,
        "med": 0
      }
    },
    "slots_total_open": {
      "type": "trend",
      "contains": "time",
      "values": {
        "p(95)": 144,
        "avg": 144,
        "min": 144,
        "med": 144,
        "max": 144,
        "p(90)": 144
      }
    },
    "slots_scanned_days": {
      "contains": "time",
      "values": {
        "avg": 15,
        "min": 15,
        "med": 15,
        "max": 15,
        "p(90)": 15,
        "p(95)": 15
      },
      "type": "trend"
    },
    "vus_max": {
      "type": "gauge",
      "contains": "default",
      "values": {
        "value": 10,
        "min": 10,
        "max": 10
      }
    },
    "slots_conflicts_considered": {
      "type": "trend",
      "contains": "time",
      "values": {
        "avg": 1200,
        "min": 1200,
        "med": 1200,
        "max": 1200,
        "p(90)": 1200,
        "p(95)": 1200
      }
    },
    "iterations": {
      "contains": "default",
      "values": {
        "count": 2180,
        "rate": 108.55551025233676
      },
      "type": "counter"
    },
    "http_req_failed": {
      "thresholds": {
        "rate<0.01": {
          "ok": true
        }
      },
      "type": "rate",
      "contains": "default",
      "values": {
        "rate": 0,
        "passes": 0,
        "fails": 2182
      }
    }
  },
  "setup_data": {
    "viewerId": "cmv7m0yni0000m6ajycty4i5g",
    "url": "http://localhost:3001/api/practitioners/cmv7mjlgr0000m6g5ge1z45l3/slots?from=2026-10-15T04:57:17.731Z&to=2026-10-29T04:57:17.731Z&sessionTypeId=cmv7mjlhc0002m6g50kft92y9&maxSlots=100"
  },
  "root_group": {
    "groups": [],
    "checks": [],
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e"
  },
  "options": {
    "summaryTrendStats": [
      "avg",
      "min",
      "med",
      "max",
      "p(90)",
      "p(95)"
    ],
    "summaryTimeUnit": "",
    "noColor": false
  }
}
````

## File: apps/api/performance/booking-contention.js
````javascript
import http from 'k6/http';
import exec from 'k6/execution';
import { Counter, Trend } from 'k6/metrics';
import {
  API,
  artifactPath,
  authHeaders,
  byHandle,
  identities,
  members,
  openSlots,
  sessionTypeFor,
  stamp,
  summarize,
} from './lib/common.js';

/**
 * Booking contention — M members race for the SAME slot.
 *
 * Each iteration is one race: a single VU fires RACERS POST /bookings requests
 * concurrently (http.batch) for one slot, using RACERS distinct members. The
 * exclusion constraint must let exactly one win; everyone else must get a clean
 * 409. The thresholds encode that invariant, so a regression fails the run.
 */

const RACERS = Number(__ENV.RACERS || 10);
const VUS = Number(__ENV.VUS || 20);
const ITER = Number(__ENV.ITER || 10);
const RACES = VUS * ITER;

export const options = {
  scenarios: {
    race: {
      executor: 'per-vu-iterations',
      vus: VUS,
      iterations: ITER,
    },
  },
  // k6 defaults batchPerHost to 6; raise it so all RACERS requests for one slot
  // are genuinely in flight together (otherwise the "M-way race" is really 6-way).
  batch: RACERS,
  batchPerHost: RACERS,
  thresholds: {
    booking_success: [`count==${RACES}`],
    booking_conflict: [`count==${RACES * (RACERS - 1)}`],
    booking_unexpected: ['count==0'],
    race_duration: ['p(95)<2000'],
  },
};

const success = new Counter('booking_success');
const conflict = new Counter('booking_conflict');
const unusual = new Counter('booking_unexpected');
const raceDuration = new Trend('race_duration', true);

export function setup() {
  const ids = identities();
  const practitioner = byHandle(
    ids,
    __ENV.PRACTITIONER_HANDLE || 'dr.aruna',
  );
  const memberIds = members(ids, RACERS);
  const sessionType = sessionTypeFor(
    memberIds[0],
    practitioner.id,
    __ENV.SESSION_TYPE || 'Initial consult',
  );
  const slots = openSlots(
    memberIds[0],
    practitioner.id,
    sessionType.id,
    Number(__ENV.FROM_DAYS || 365),
    Number(__ENV.TO_DAYS || 1200),
  );
  if (slots.length < RACES) {
    throw new Error(`need ${RACES} open slots, got ${slots.length}`);
  }
  return {
    memberIds,
    sessionTypeId: sessionType.id,
    slots: slots.slice(0, RACES).map((s) => s.startTime),
  };
}

export default function (data) {
  const idx = (exec.vu.idInTest - 1) * ITER + exec.vu.iterationInInstance;
  const slot = data.slots[idx];
  const started = Date.now();
  const responses = http.batch(
    data.memberIds.map((userId) => [
      'POST',
      `${API}/bookings`,
      JSON.stringify({ sessionTypeId: data.sessionTypeId, startTime: slot }),
      authHeaders(userId),
    ]),
  );
  raceDuration.add(Date.now() - started);

  for (const res of responses) {
    if (res.status === 201) success.add(1);
    else if (res.status === 409) conflict.add(1);
    else unusual.add(1);
  }
}

export function handleSummary(data) {
  return {
    [artifactPath(`booking-contention-${stamp()}`)]: JSON.stringify(data, null, 2),
    stdout: summarize(data, [
      'http_reqs',
      'http_req_duration',
      'http_req_failed',
      'booking_success',
      'booking_conflict',
      'booking_unexpected',
      'race_duration',
    ]),
  };
}
````

## File: apps/api/performance/feed-read.js
````javascript
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
````

## File: apps/api/performance/hold-expiry.js
````javascript
import http from 'k6/http';
import exec from 'k6/execution';
import { Counter, Trend } from 'k6/metrics';
import { sleep } from 'k6';
import {
  API,
  artifactPath,
  authHeaders,
  byHandle,
  identities,
  members,
  openSlots,
  sessionTypeFor,
  stamp,
  summarize,
} from './lib/common.js';

/**
 * Hold expiry accuracy.
 *
 * A hold is created with a TTL in seconds. A rival then polls the same slot
 * with real booking attempts; the first 201 is the moment the slot was freed.
 * `hold_release_latency` is measured from hold creation, and
 * `hold_release_latency_past_ttl` from the TTL deadline, so the overshoot (TTL
 * + sweep interval + jitter) is visible rather than assumed.
 */

const VUS = Number(__ENV.VUS || 8);
const ITER = Number(__ENV.ITER || 6);
const RACES = VUS * ITER;
const TTL = Number(__ENV.HOLD_TTL_SECONDS || 5);
const POLL_MS = Number(__ENV.POLL_MS || 200);

export const options = {
  scenarios: {
    expiry: { executor: 'per-vu-iterations', vus: VUS, iterations: ITER },
  },
  thresholds: {
    hold_claimed: [`count==${RACES}`],
    hold_claim_failed: ['count==0'],
    hold_release_latency: [`p(95)<${TTL * 1000 + 5000}`],
  },
};

const created = new Counter('hold_created');
const claimed = new Counter('hold_claimed');
const claimFailed = new Counter('hold_claim_failed');
const claimAttempts = new Counter('hold_claim_attempts');
const releaseLatency = new Trend('hold_release_latency', true);
const overshoot = new Trend('hold_release_latency_past_ttl', true);

export function setup() {
  const ids = identities();
  const practitioner = byHandle(ids, __ENV.PRACTITIONER_HANDLE || 'dr.aruna');
  const memberIds = members(ids, RACES + 1);
  const sessionType = sessionTypeFor(
    memberIds[0],
    practitioner.id,
    __ENV.SESSION_TYPE || 'Initial consult',
  );
  const slots = openSlots(
    memberIds[0],
    practitioner.id,
    sessionType.id,
    Number(__ENV.FROM_DAYS || 365),
    Number(__ENV.TO_DAYS || 1200),
  );
  if (slots.length < RACES) {
    throw new Error(`need ${RACES} slots, got ${slots.length}`);
  }
  return {
    sessionTypeId: sessionType.id,
    holder: memberIds[0],
    rival: memberIds[1],
    slots: slots.slice(0, RACES).map((s) => s.startTime),
  };
}

export default function (data) {
  const idx = (exec.vu.idInTest - 1) * ITER + exec.vu.iterationInInstance;
  const slot = data.slots[idx];

  const holdStart = Date.now();
  const hold = http.post(
    `${API}/holds`,
    JSON.stringify({
      sessionTypeId: data.sessionTypeId,
      startTime: slot,
      ttlSeconds: TTL,
    }),
    authHeaders(data.holder),
  );
  if (hold.status !== 201) {
    claimFailed.add(1);
    return;
  }
  created.add(1);
  const deadline = holdStart + TTL * 1000;

  const timeoutAt = holdStart + TTL * 1000 + 10_000;
  while (Date.now() < timeoutAt) {
    claimAttempts.add(1);
    const res = http.post(
      `${API}/bookings`,
      JSON.stringify({ sessionTypeId: data.sessionTypeId, startTime: slot }),
      authHeaders(data.rival),
    );
    if (res.status === 201) {
      const now = Date.now();
      releaseLatency.add(now - holdStart);
      overshoot.add(Math.max(0, now - deadline));
      claimed.add(1);
      return;
    }
    sleep(POLL_MS / 1000);
  }
  claimFailed.add(1);
}

export function handleSummary(data) {
  return {
    [artifactPath(`hold-expiry-${stamp()}`)]: JSON.stringify(data, null, 2),
    stdout: summarize(data, [
      'http_reqs',
      'http_req_duration',
      'http_req_failed',
      'hold_created',
      'hold_claimed',
      'hold_claim_failed',
      'hold_claim_attempts',
      'hold_release_latency',
      'hold_release_latency_past_ttl',
    ]),
  };
}
````

## File: apps/api/performance/README.md
````markdown
# Tangerine — performance scripts (k6)

k6 harness for the scenarios documented in `docs/performance/`. Each scenario
is one `.js` file here plus a write-up under `docs/performance/<scenario>.md`.

Raw results land in `results/<run>/` as k6 summary JSON; charts are rendered by
`report.mjs`.

## Layout

```
performance/
├─ booking-contention.js     M members race for one slot; exactly one wins
├─ slot-lookup.js            availability − reservations as bookings grow
├─ reschedule-idempotency.js same op id twice is one move
├─ hold-expiry.js            a hold frees its slot within TTL + jitter
├─ feed-read.js              warm GET /feed throughput (existing system)
├─ seed-bookings.ts          synthetic data for slot-lookup (isolated account)
├─ run-scheduling.sh         runs the whole scheduling suite
├─ report.mjs                renders SVG charts from k6 JSON
├─ lib/common.js             shared helpers (auth, slot discovery, summary)
└─ tsconfig.json             ts-node config for the seed script
```

## Conventions

- Base URL from `BASE_URL` (default `http://localhost:3001`).
- Mock auth via `x-user-id`; ids resolved at `setup()` from
  `/api/session/identities`, so scripts survive a reseed.
- Each script exports `thresholds` encoding the invariant it tests; a regression
  fails the run.
- `booking-contention.js` sets `batchPerHost = RACERS` — k6 defaults it to 6, so
  without this a same-host "10-way race" is only 6-way.

## Run

```bash
# one scenario
VUS=20 ITER=10 RACERS=10 k6 run performance/booking-contention.js

# everything (writes a timestamped results dir)
RUN_STAMP=local bash performance/run-scheduling.sh

# charts
node performance/report.mjs performance/results/optimized \
  performance/results/slot-optimized
```

## Seed data for slot-lookup

```bash
BOOKING_COUNT=1200 SLOT_MINUTES=15 pnpm --filter @tangerine/api perf:seed-bookings
```

Creates/refreshes an isolated `@perf.practitioner` with all-day availability and
N back-to-back 15-minute bookings. It never touches demo users.
````

## File: apps/api/performance/report.mjs
````javascript
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
````

## File: apps/api/performance/reschedule-idempotency.js
````javascript
import http from 'k6/http';
import exec from 'k6/execution';
import { Counter, Trend } from 'k6/metrics';
import {
  API,
  artifactPath,
  authHeaders,
  byHandle,
  identities,
  members,
  openSlots,
  sessionTypeFor,
  stamp,
  summarize,
} from './lib/common.js';

/**
 * Reschedule idempotency.
 *
 * Each iteration books a slot, then sends the SAME reschedule (same
 * clientOpId) twice. The second must be a no-op that returns the first result:
 * same booking id, same start time. `reschedule_replay_mismatch == 0` and
 * `reschedule_replay_ok == RACES` encode the invariant.
 */

const VUS = Number(__ENV.VUS || 10);
const ITER = Number(__ENV.ITER || 10);
const RACES = VUS * ITER;

export const options = {
  scenarios: {
    idem: { executor: 'per-vu-iterations', vus: VUS, iterations: ITER },
  },
  thresholds: {
    reschedule_replay_ok: [`count==${RACES}`],
    reschedule_replay_mismatch: ['count==0'],
    reschedule_replay_duration: ['p(95)<500'],
  },
};

const firstOk = new Counter('reschedule_first_ok');
const replayOk = new Counter('reschedule_replay_ok');
const mismatch = new Counter('reschedule_replay_mismatch');
const firstDuration = new Trend('reschedule_first_duration', true);
const replayDuration = new Trend('reschedule_replay_duration', true);

export function setup() {
  const ids = identities();
  const practitioner = byHandle(ids, __ENV.PRACTITIONER_HANDLE || 'dr.aruna');
  const memberIds = members(ids, 20);
  const sessionType = sessionTypeFor(
    memberIds[0],
    practitioner.id,
    __ENV.SESSION_TYPE || 'Initial consult',
  );
  const slots = openSlots(
    memberIds[0],
    practitioner.id,
    sessionType.id,
    Number(__ENV.FROM_DAYS || 365),
    Number(__ENV.TO_DAYS || 1200),
  );
  if (slots.length < RACES * 2) {
    throw new Error(`need ${RACES * 2} slots, got ${slots.length}`);
  }
  return {
    memberIds,
    sessionTypeId: sessionType.id,
    slots: slots.slice(0, RACES * 2).map((s) => s.startTime),
  };
}

export default function (data) {
  const idx = (exec.vu.idInTest - 1) * ITER + exec.vu.iterationInInstance;
  const member = data.memberIds[idx % data.memberIds.length];
  const slotA = data.slots[idx * 2];
  const slotB = data.slots[idx * 2 + 1];
  const opId = `resched-${idx}-${exec.vu.idInTest}`;

  const created = http.post(
    `${API}/bookings`,
    JSON.stringify({ sessionTypeId: data.sessionTypeId, startTime: slotA }),
    authHeaders(member),
  );
  if (created.status !== 201) return;
  const bookingId = created.json('id');

  let started = Date.now();
  const first = http.post(
    `${API}/bookings/${bookingId}/reschedule`,
    JSON.stringify({ startTime: slotB, clientOpId: opId }),
    authHeaders(member),
  );
  firstDuration.add(Date.now() - started);
  if (first.status === 201) firstOk.add(1);

  started = Date.now();
  const replay = http.post(
    `${API}/bookings/${bookingId}/reschedule`,
    JSON.stringify({ startTime: slotB, clientOpId: opId }),
    authHeaders(member),
  );
  replayDuration.add(Date.now() - started);

  const sameBooking = replay.json('id') === first.json('id');
  const sameStart = replay.json('startTime') === first.json('startTime');
  if (replay.status === 201 && sameBooking && sameStart) {
    replayOk.add(1);
  } else {
    mismatch.add(1);
  }
}

export function handleSummary(data) {
  return {
    [artifactPath(`reschedule-idempotency-${stamp()}`)]: JSON.stringify(data, null, 2),
    stdout: summarize(data, [
      'http_reqs',
      'http_req_duration',
      'http_req_failed',
      'reschedule_first_ok',
      'reschedule_replay_ok',
      'reschedule_replay_mismatch',
      'reschedule_first_duration',
      'reschedule_replay_duration',
    ]),
  };
}
````

## File: apps/api/performance/run-scheduling.sh
````bash
#!/usr/bin/env bash
# Runs the scheduling benchmark suite against a running API and writes all k6
# JSON artifacts into a timestamped directory. Safe to re-run; seeding is
# isolated to the synthetic `perf.practitioner` account.
set -uo pipefail

ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
cd "$ROOT"

BASE="${BASE_URL:-http://localhost:3001}"
STAMP="${RUN_STAMP:-$(date +%Y%m%d-%H%M%S)}"
OUT="${ARTIFACT_ROOT:-apps/api/performance/results}/$STAMP"
mkdir -p "$OUT"
export ARTIFACT_DIR="$OUT"
export BASE_URL="$BASE"

# Tunables (exported so k6 sees them via __ENV).
export CONTENTION_VUS="${CONTENTION_VUS:-20}"
export CONTENTION_ITER="${CONTENTION_ITER:-10}"
export CONTENTION_RACERS="${CONTENTION_RACERS:-10}"
export IDEM_VUS="${IDEM_VUS:-10}"
export IDEM_ITER="${IDEM_ITER:-10}"
export HOLD_VUS="${HOLD_VUS:-8}"
export HOLD_ITER="${HOLD_ITER:-6}"
export HOLD_TTL="${HOLD_TTL:-5}"
export FEED_VUS="${FEED_VUS:-20}"
export FEED_DURATION="${FEED_DURATION:-30s}"
export SLOT_COUNTS="${SLOT_COUNTS:-0 400 800 1200}"
export SLOT_VUS="${SLOT_VUS:-10}"
export SLOT_DURATION="${SLOT_DURATION:-20s}"

echo "== tangerine scheduling benchmarks =="
echo "artifacts: $OUT"

if ! curl -sf "$BASE/api/health" >/dev/null; then
  echo "API is not reachable at $BASE — start it first." >&2
  exit 1
fi

echo ""
echo "### booking-contention ($(date +%T))"
VUS="$CONTENTION_VUS" ITER="$CONTENTION_ITER" RACERS="$CONTENTION_RACERS" \
  k6 run apps/api/performance/booking-contention.js

echo ""
echo "### reschedule-idempotency ($(date +%T))"
VUS="$IDEM_VUS" ITER="$IDEM_ITER" \
  k6 run apps/api/performance/reschedule-idempotency.js

echo ""
echo "### hold-expiry ($(date +%T))"
VUS="$HOLD_VUS" ITER="$HOLD_ITER" HOLD_TTL_SECONDS="$HOLD_TTL" \
  k6 run apps/api/performance/hold-expiry.js

echo ""
echo "### feed-read warm-up ($(date +%T))"
MAYA=$(curl -s "$BASE/api/session/identities" | jq -r '.[] | select(.handle=="maya") | .id')
for i in $(seq 1 40); do
  curl -s -X POST "$BASE/api/posts" \
    -H "x-user-id: $MAYA" -H 'content-type: application/json' \
    -d "{\"body\":\"benchmark warm-up post $i\"}" >/dev/null
done
sleep 3

echo "### feed-read ($(date +%T))"
VUS="$FEED_VUS" DURATION="$FEED_DURATION" \
  k6 run apps/api/performance/feed-read.js

echo ""
echo "### slot-lookup scaling ($(date +%T))"
for N in $SLOT_COUNTS; do
  echo "--- conflicts=$N ---"
  BOOKING_COUNT="$N" SLOT_MINUTES=15 \
    pnpm --filter @tangerine/api perf:seed-bookings > "$OUT/seed-$N.json" 2>/dev/null
  VUS="$SLOT_VUS" DURATION="$SLOT_DURATION" FROM_DAYS=1 TO_DAYS=15 \
    k6 run apps/api/performance/slot-lookup.js
done

echo ""
cat > "$OUT/manifest.md" <<EOF
# Benchmark run $STAMP

- base URL: $BASE
- k6: $(k6 version 2>/dev/null | head -1)
- contention: VUS=$CONTENTION_VUS ITER=$CONTENTION_ITER RACERS=$CONTENTION_RACERS
- feed-read: VUS=$FEED_VUS DURATION=$FEED_DURATION
- slot-lookup: VUS=$SLOT_VUS DURATION=$SLOT_DURATION counts=$SLOT_COUNTS
EOF

echo ""
echo "BENCHMARKS_COMPLETE $OUT"
````

## File: apps/api/performance/seed-bookings.ts
````typescript
/* eslint-disable no-console */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { BookingStatus, PrismaClient, Role } from '@prisma/client';

// ts-node does not load .env the way the Nest app does; load it here so the
// script works both via `pnpm perf:seed-bookings` and standalone.
const envFile = resolve(__dirname, '../.env');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}


/**
 * Synthetic data for the `slot-lookup` benchmark.
 *
 * Creates an isolated practitioner and packs N non-overlapping CONFIRMED
 * bookings back-to-back from `START_DAYS` in the future. Slot lookup reads
 * every conflicting reservation in the queried window and scans them per
 * candidate slot, so this isolates the cost of "more existing bookings" from
 * everything else. It never touches the demo practitioners.
 *
 *   BOOKING_COUNT=2000 SLOT_MINUTES=30 pnpm perf:seed-bookings
 */
const prisma = new PrismaClient();

const HANDLE = process.env.PERF_PRACTITIONER_HANDLE ?? 'perf.practitioner';
const COUNT = Number(process.env.BOOKING_COUNT ?? 1000);
const SLOT_MINUTES = Number(process.env.SLOT_MINUTES ?? 30);
const START_DAYS = Number(process.env.START_DAYS ?? 1);

async function main() {
  const practitioner = await prisma.user.upsert({
    where: { handle: HANDLE },
    update: { role: Role.PRACTITIONER },
    create: {
      handle: HANDLE,
      displayName: 'Perf Practitioner',
      role: Role.PRACTITIONER,
      headline: 'synthetic benchmark account',
      bio: 'Created by performance/seed-bookings.ts',
    },
  });

  const member = await prisma.user.findFirstOrThrow({
    where: { role: Role.MEMBER },
    orderBy: { createdAt: 'asc' },
  });

  let sessionType = await prisma.sessionType.findFirst({
    where: { practitionerId: practitioner.id, name: 'Perf slot' },
  });
  if (!sessionType) {
    sessionType = await prisma.sessionType.create({
      data: {
        practitionerId: practitioner.id,
        name: 'Perf slot',
        durationMinutes: SLOT_MINUTES,
        priceCents: 1000,
        currency: 'USD',
      },
    });
  }

  await prisma.practitionerAvailability.deleteMany({
    where: { practitionerId: practitioner.id },
  });
  await prisma.practitionerAvailability.createMany({
    data: Array.from({ length: 7 }, (_, weekday) => ({
      practitionerId: practitioner.id,
      weekday,
      startMinute: 0,
      endMinute: 1440,
      timezone: 'UTC',
    })),
  });

  await prisma.booking.deleteMany({ where: { practitionerId: practitioner.id } });

  const base = Date.now() + START_DAYS * 86_400_000;
  const step = SLOT_MINUTES * 60_000;
  const rows = Array.from({ length: COUNT }, (_, i) => {
    const start = new Date(base + i * step);
    const end = new Date(start.getTime() + step);
    return {
      practitionerId: practitioner.id,
      memberId: member.id,
      sessionTypeId: sessionType!.id,
      startTime: start,
      endTime: end,
      status: BookingStatus.CONFIRMED,
      priceCents: sessionType!.priceCents,
      currency: sessionType!.currency,
      confirmedAt: new Date(),
    };
  });

  // Chunked so the whole insert set never sits in one transaction.
  for (let i = 0; i < rows.length; i += 1000) {
    await prisma.booking.createMany({
      data: rows.slice(i, i + 1000),
      skipDuplicates: true,
    });
  }

  const spanDays = Math.ceil((COUNT * SLOT_MINUTES) / 1440);
  console.log(
    JSON.stringify(
      {
        practitionerId: practitioner.id,
        practitionerHandle: HANDLE,
        sessionTypeId: sessionType.id,
        sessionTypeName: 'Perf slot',
        bookingCount: COUNT,
        slotMinutes: SLOT_MINUTES,
        startDays: START_DAYS,
        spanDays,
        window: {
          fromDays: START_DAYS,
          toDays: START_DAYS + spanDays + 1,
        },
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
````

## File: apps/api/performance/slot-lookup.js
````javascript
import http from 'k6/http';
import { Trend } from 'k6/metrics';
import {
  API,
  artifactPath,
  authHeaders,
  byHandle,
  identities,
  isoFromDays,
  sessionTypeFor,
  stamp,
  summarize,
} from './lib/common.js';

/**
 * Slot lookup under load.
 *
 * GET /practitioners/:id/slots expands weekly availability into candidate
 * slots, then subtracts live reservations. The number of conflicts in the
 * window is the independent variable: run this after seeding different
 * BOOKING_COUNTs with `seed-bookings.ts` and compare p95.
 */

const VUS = Number(__ENV.VUS || 10);
const DURATION = __ENV.DURATION || '30s';

export const options = {
  scenarios: {
    lookup: {
      executor: 'constant-vus',
      vus: VUS,
      duration: DURATION,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
  },
};

const conflicts = new Trend('slots_conflicts_considered', true);
const returned = new Trend('slots_returned', true);
const totalOpen = new Trend('slots_total_open', true);
const scannedDays = new Trend('slots_scanned_days', true);

export function setup() {
  const ids = identities();
  const viewer = ids.find((u) => u.role === 'MEMBER');
  const practitioner = byHandle(
    ids,
    __ENV.PRACTITIONER_HANDLE || 'perf.practitioner',
  );
  const sessionType = sessionTypeFor(
    viewer.id,
    practitioner.id,
    __ENV.SESSION_TYPE || 'Perf slot',
  );
  const fromDays = Number(__ENV.FROM_DAYS || 1);
  const toDays = Number(__ENV.TO_DAYS || 60);
  const url =
    `${API}/practitioners/${practitioner.id}/slots` +
    `?from=${isoFromDays(fromDays)}&to=${isoFromDays(toDays)}` +
    `&sessionTypeId=${sessionType.id}&maxSlots=100`;
  return { url, viewerId: viewer.id };
}

export default function (data) {
  const res = http.get(data.url, authHeaders(data.viewerId));
  if (res.status === 200) {
    const body = res.json();
    if (body && body.slots) {
      conflicts.add(body.conflictsConsidered ?? 0);
      returned.add(body.slots.length ?? 0);
      totalOpen.add(body.totalOpen ?? 0);
      scannedDays.add(body.scannedDays ?? 0);
    }
  }
}

export function handleSummary(data) {
  return {
    [artifactPath(`slot-lookup-${stamp()}`)]: JSON.stringify(data, null, 2),
    stdout: summarize(data, [
      'http_reqs',
      'http_req_duration',
      'http_req_failed',
      'slots_conflicts_considered',
      'slots_returned',
      'slots_total_open',
      'slots_scanned_days',
    ]),
  };
}
````

## File: apps/api/performance/tsconfig.json
````json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "node",
    "noEmit": true
  },
  "include": ["./**/*.ts"]
}
````

## File: apps/api/prisma/migrations/20261014042134_scheduling_booking/migration.sql
````sql
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('HELD', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "SessionType" (
    "id" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PractitionerAvailability" (
    "id" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startMinute" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PractitionerAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "sessionTypeId" TEXT NOT NULL,
    "startTime" TIMESTAMPTZ(3) NOT NULL,
    "endTime" TIMESTAMPTZ(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "holdExpiresAt" TIMESTAMPTZ(3),
    "clientOpId" TEXT,
    "confirmedAt" TIMESTAMPTZ(3),
    "cancelledAt" TIMESTAMPTZ(3),
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingOperation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "opId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "bookingId" TEXT,
    "response" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingOperation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SessionType_practitionerId_active_idx" ON "SessionType"("practitionerId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "SessionType_practitionerId_name_key" ON "SessionType"("practitionerId", "name");

-- CreateIndex
CREATE INDEX "PractitionerAvailability_practitionerId_weekday_idx" ON "PractitionerAvailability"("practitionerId", "weekday");

-- CreateIndex
CREATE INDEX "Booking_memberId_startTime_idx" ON "Booking"("memberId", "startTime" DESC);

-- CreateIndex
CREATE INDEX "Booking_practitionerId_startTime_idx" ON "Booking"("practitionerId", "startTime");

-- CreateIndex
CREATE INDEX "Booking_status_holdExpiresAt_idx" ON "Booking"("status", "holdExpiresAt");

-- CreateIndex
CREATE INDEX "Booking_status_startTime_idx" ON "Booking"("status", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_memberId_clientOpId_key" ON "Booking"("memberId", "clientOpId");

-- CreateIndex
CREATE INDEX "BookingOperation_createdAt_idx" ON "BookingOperation"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BookingOperation_userId_opId_key" ON "BookingOperation"("userId", "opId");

-- AddForeignKey
ALTER TABLE "SessionType" ADD CONSTRAINT "SessionType_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PractitionerAvailability" ADD CONSTRAINT "PractitionerAvailability_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_sessionTypeId_fkey" FOREIGN KEY ("sessionTypeId") REFERENCES "SessionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingOperation" ADD CONSTRAINT "BookingOperation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Conflict-safety, enforced by the database rather than by application code.
--
-- A single exclusion constraint across holds AND firm bookings guarantees that
-- no two live reservations overlap on one practitioner. A race is therefore
-- impossible to lose silently: the loser's INSERT raises SQLSTATE 23P01 and the
-- API translates it to a clean 409. `btree_gist` is required to mix the
-- equality operator on "practitionerId" with the range overlap operator in one
-- GiST index.
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Booking"
  ADD CONSTRAINT "Booking_no_overlap_per_practitioner"
  EXCLUDE USING gist (
    "practitionerId" WITH =,
    tstzrange("startTime", "endTime", '[)') WITH &&
  )
  WHERE (status IN ('HELD', 'PENDING', 'CONFIRMED'));
````

## File: apps/api/src/metrics/metrics.interceptor.ts
````typescript
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { MetricsService } from './metrics.service';

interface TimedRequest {
  method?: string;
  url?: string;
  routeOptions?: { url?: string };
}

/**
 * Records one histogram observation per HTTP request. The route label uses the
 * registered route pattern (not the raw URL) so cardinality stays bounded even
 * under high-cardinality ids in the path.
 */
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();
    const request = context.switchToHttp().getRequest<TimedRequest>();
    const response = context.switchToHttp().getResponse<{ statusCode: number }>();
    const method = request.method ?? 'GET';
    const route = request.routeOptions?.url ?? request.url?.split('?')[0] ?? 'unknown';
    const start = process.hrtime.bigint();

    const record = () => {
      const seconds = Number(process.hrtime.bigint() - start) / 1e9;
      const status = String(response.statusCode ?? 0);
      this.metrics.httpRequestDuration.observe(
        { method, route, status },
        seconds,
      );
      this.metrics.httpRequestsTotal.inc({ method, route, status });
    };

    return next.handle().pipe(
      tap({
        next: record,
        error: record,
      }),
    );
  }
}
````

## File: apps/api/src/metrics/metrics.service.ts
````typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  collectDefaultMetrics,
  Counter,
  Gauge,
  Histogram,
  Registry,
} from 'prom-client';

/**
 * Application-level Prometheus registry.
 *
 * Default Node metrics (event-loop lag, GC, heap, CPU) come from
 * `collectDefaultMetrics`; the domain metrics below are the ones the
 * scheduling benchmarks and dashboards actually read. Everything is exposed in
 * one scrape at `GET /api/metrics`.
 */
@Injectable()
export class MetricsService implements OnModuleInit {
  readonly registry = new Registry();

  readonly httpRequestDuration = new Histogram({
    name: 'tangerine_http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    registers: [this.registry],
  });

  readonly httpRequestsTotal = new Counter({
    name: 'tangerine_http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status'],
    registers: [this.registry],
  });

  readonly bookingsCreated = new Counter({
    name: 'tangerine_bookings_created_total',
    help: 'Bookings successfully created (firm)',
    registers: [this.registry],
  });

  readonly holdsCreated = new Counter({
    name: 'tangerine_booking_holds_created_total',
    help: 'Soft holds successfully created',
    registers: [this.registry],
  });

  readonly bookingConflicts = new Counter({
    name: 'tangerine_booking_conflicts_total',
    help: 'Booking/hold attempts rejected by the exclusion constraint (409)',
    registers: [this.registry],
  });

  readonly holdsExpired = new Counter({
    name: 'tangerine_booking_holds_expired_total',
    help: 'Holds released by the expiry sweeper',
    registers: [this.registry],
  });

  readonly idempotentReplays = new Counter({
    name: 'tangerine_idempotent_replays_total',
    help: 'Mutating requests answered from the idempotency ledger',
    labelNames: ['action'],
    registers: [this.registry],
  });

  // ── Gauges updated at scrape time from Postgres / BullMQ ──────────────
  readonly outboxEvents = new Gauge({
    name: 'tangerine_outbox_events',
    help: 'Outbox events by status',
    labelNames: ['status'],
    registers: [this.registry],
  });

  readonly outboxOldestPendingSeconds = new Gauge({
    name: 'tangerine_outbox_oldest_pending_seconds',
    help: 'Age of the oldest unrelayed outbox event, in seconds',
    registers: [this.registry],
  });

  readonly fanoutQueueJobs = new Gauge({
    name: 'tangerine_fanout_queue_jobs',
    help: 'Fan-out queue jobs by state',
    labelNames: ['state'],
    registers: [this.registry],
  });

  readonly activeReservations = new Gauge({
    name: 'tangerine_booking_active_reservations',
    help: 'Live (HELD/PENDING/CONFIRMED) bookings',
    registers: [this.registry],
  });

  readonly expiredHoldsPending = new Gauge({
    name: 'tangerine_booking_expired_holds_pending',
    help: 'Holds past TTL not yet swept',
    registers: [this.registry],
  });

  onModuleInit(): void {
    collectDefaultMetrics({ register: this.registry, prefix: 'tangerine_' });
  }

  metrics(): Promise<string> {
    return this.registry.metrics();
  }

  contentType(): string {
    return this.registry.contentType;
  }
}
````

## File: apps/api/src/scheduling/dto/scheduling.dto.ts
````typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsISO8601,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateSessionTypeDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(280)
  description?: string;

  @ApiProperty({ description: 'Slot length in minutes' })
  @IsInt()
  @Min(5)
  @Max(480)
  durationMinutes!: number;

  @ApiProperty({ description: 'Price in minor units (cents)' })
  @IsInt()
  @Min(0)
  priceCents!: number;

  @ApiPropertyOptional({ default: 'USD' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;
}

export class AvailabilitySlotDto {
  @ApiProperty({ description: '0 = Sunday … 6 = Saturday (local)' })
  @IsInt()
  @Min(0)
  @Max(6)
  weekday!: number;

  @ApiProperty({ description: 'Minutes from local midnight, inclusive' })
  @IsInt()
  @Min(0)
  @Max(1440)
  startMinute!: number;

  @ApiProperty({ description: 'Minutes from local midnight, exclusive' })
  @IsInt()
  @Min(0)
  @Max(1440)
  endMinute!: number;

  @ApiPropertyOptional({ default: 'UTC' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  timezone?: string;
}

export class SetAvailabilityDto {
  @ApiProperty({ type: [AvailabilitySlotDto] })
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  slots!: AvailabilitySlotDto[];
}

export class OpenSlotsQueryDto {
  @ApiProperty({ description: 'ISO-8601 start of the range (inclusive)' })
  @IsISO8601()
  from!: string;

  @ApiProperty({ description: 'ISO-8601 end of the range (exclusive)' })
  @IsISO8601()
  to!: string;

  @ApiPropertyOptional({ description: 'Restrict to one session type' })
  @IsOptional()
  @IsString()
  sessionTypeId?: string;

  @ApiPropertyOptional({
    description: 'Slot grid in minutes; defaults to the session duration',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(120)
  granularityMinutes?: number;

  @ApiPropertyOptional({
    description:
      'Cap the returned slots (compute is unaffected; keeps response size constant)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  maxSlots?: number;
}

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  sessionTypeId!: string;

  @ApiProperty({ description: 'ISO-8601 start time' })
  @IsISO8601()
  startTime!: string;

  @ApiPropertyOptional({ description: 'Idempotency key for this booking intent' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  clientOpId?: string;

  @ApiPropertyOptional({ description: 'Consume an existing hold into a booking' })
  @IsOptional()
  @IsString()
  holdId?: string;
}

export class CreateHoldDto {
  @ApiProperty()
  @IsString()
  sessionTypeId!: string;

  @ApiProperty({ description: 'ISO-8601 start time' })
  @IsISO8601()
  startTime!: string;

  @ApiPropertyOptional({ description: 'Idempotency key' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  clientOpId?: string;

  @ApiPropertyOptional({ description: 'Override hold TTL in seconds' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3600)
  ttlSeconds?: number;
}

export class RescheduleBookingDto {
  @ApiProperty({ description: 'New ISO-8601 start time' })
  @IsISO8601()
  startTime!: string;

  @ApiPropertyOptional({ description: 'Idempotency key' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  clientOpId?: string;
}

export class CancelBookingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(280)
  reason?: string;

  @ApiPropertyOptional({ description: 'Idempotency key' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  clientOpId?: string;
}

export class ListBookingsQueryDto {
  @ApiPropertyOptional({ enum: ['member', 'practitioner'] })
  @IsOptional()
  @IsString()
  as?: 'member' | 'practitioner';

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  to?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;
}
````

## File: apps/api/src/scheduling/hold-sweeper.service.ts
````typescript
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulingService } from './scheduling.service';
import type { AppConfig } from '../config/configuration';
import { MetricsService } from '../metrics/metrics.service';

/**
 * Releases soft holds whose TTL has passed.
 *
 * A hold is a reservation with an expiry; "release" is an UPDATE that flips it
 * to CANCELLED, which immediately drops it out of the exclusion index so the
 * slot is bookable again. The sweep interval is tunable precisely so the
 * `hold-expiry` benchmark can measure how accurately the slot is released
 * relative to the TTL, under scheduler jitter.
 */
@Injectable()
export class HoldSweeperService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(HoldSweeperService.name);
  private readonly intervalMs: number;
  private timer?: NodeJS.Timeout;
  private sweeping = false;

  constructor(
    private readonly scheduling: SchedulingService,
    private readonly metrics: MetricsService,
    config: ConfigService<AppConfig, true>,
  ) {
    this.intervalMs = config.get('bookingHoldSweepIntervalMs', { infer: true });
  }

  onModuleInit(): void {
    this.timer = setInterval(() => void this.sweep(), this.intervalMs);
    this.timer.unref?.();
    this.logger.log(`Hold sweeper started (every ${this.intervalMs}ms)`);
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  async sweep(): Promise<number> {
    if (this.sweeping) return 0;
    this.sweeping = true;
    try {
      const expired = await this.scheduling.expireStaleHolds();
      if (expired > 0) {
        this.metrics.holdsExpired.inc(expired);
        this.logger.debug(`expired ${expired} hold(s)`);
      }
      return expired;
    } catch (err) {
      this.logger.error(`Hold sweep failed: ${(err as Error).message}`);
      return 0;
    } finally {
      this.sweeping = false;
    }
  }
}
````

## File: apps/api/src/scheduling/scheduling.controller.ts
````typescript
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { SchedulingService } from './scheduling.service';
import {
  CancelBookingDto,
  CreateBookingDto,
  CreateHoldDto,
  CreateSessionTypeDto,
  ListBookingsQueryDto,
  OpenSlotsQueryDto,
  RescheduleBookingDto,
  SetAvailabilityDto,
} from './dto/scheduling.dto';

@ApiTags('scheduling')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller()
export class SchedulingController {
  constructor(private readonly scheduling: SchedulingService) {}

  // ── Catalog ─────────────────────────────────────────────────────────
  @Post('session-types')
  @ApiOperation({ summary: 'Create a session type (practitioner)' })
  createSessionType(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateSessionTypeDto,
  ) {
    return this.scheduling.createSessionType(user.id, dto);
  }

  @Get('session-types')
  @ApiOperation({ summary: 'List active session types' })
  listSessionTypes(@Query('practitionerId') practitionerId?: string) {
    return this.scheduling.listSessionTypes(practitionerId);
  }

  // ── Availability ────────────────────────────────────────────────────
  @Put('practitioners/me/availability')
  @ApiOperation({ summary: 'Replace my recurring weekly availability' })
  setMyAvailability(
    @CurrentUser() user: AuthUser,
    @Body() dto: SetAvailabilityDto,
  ) {
    return this.scheduling.setAvailability(user.id, dto);
  }

  @Get('practitioners/me/availability')
  getMyAvailability(@CurrentUser() user: AuthUser) {
    return this.scheduling.getAvailability(user.id);
  }

  // ── Slot lookup ─────────────────────────────────────────────────────
  @Get('practitioners/:practitionerId/slots')
  @ApiOperation({
    summary: 'Open slots for a date range (availability minus live reservations)',
  })
  slots(
    @Param('practitionerId') practitionerId: string,
    @Query() query: OpenSlotsQueryDto,
  ) {
    return this.scheduling.listOpenSlots({ practitionerId, query });
  }

  // ── Bookings ────────────────────────────────────────────────────────
  @Post('bookings')
  @ApiOperation({ summary: 'Create a booking (conflict-safe, idempotent)' })
  createBooking(@CurrentUser() user: AuthUser, @Body() dto: CreateBookingDto) {
    return this.scheduling.createBooking(user.id, dto);
  }

  @Get('bookings')
  @ApiOperation({ summary: 'List my bookings (as member, practitioner, or both)' })
  listBookings(
    @CurrentUser() user: AuthUser,
    @Query() query: ListBookingsQueryDto,
  ) {
    return this.scheduling.listBookings({
      userId: user.id,
      as: query.as,
      from: query.from,
      to: query.to,
      limit: query.limit,
    });
  }

  @Post('bookings/:id/reschedule')
  @ApiOperation({ summary: 'Reschedule a booking (idempotent on clientOpId)' })
  reschedule(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: RescheduleBookingDto,
  ) {
    return this.scheduling.reschedule(user.id, id, dto);
  }

  @Post('bookings/:id/cancel')
  @ApiOperation({ summary: 'Cancel a booking (idempotent on clientOpId)' })
  cancel(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CancelBookingDto,
  ) {
    return this.scheduling.cancel(user.id, id, dto);
  }

  // ── Holds ───────────────────────────────────────────────────────────
  @Post('holds')
  @ApiOperation({ summary: 'Create an expiring soft hold on a slot' })
  createHold(@CurrentUser() user: AuthUser, @Body() dto: CreateHoldDto) {
    return this.scheduling.createHold(user.id, dto);
  }

  @Delete('holds/:id')
  @ApiOperation({ summary: 'Release a hold early' })
  releaseHold(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.scheduling.cancel(user.id, id, { reason: 'released' });
  }
}
````

## File: apps/api/src/scheduling/scheduling.module.ts
````typescript
import { Module } from '@nestjs/common';
import { OutboxModule } from '../outbox/outbox.module';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';
import { HoldSweeperService } from './hold-sweeper.service';

/**
 * Scheduling & booking.
 *
 * The interesting distributed-systems problems live here: a conflict-safe
 * booking under concurrency (Postgres exclusion constraint, not
 * check-then-insert), idempotent reschedule/cancel on a client op id, and an
 * expiring soft hold that must release a slot reliably despite scheduler jitter.
 */
@Module({
  imports: [OutboxModule],
  controllers: [SchedulingController],
  providers: [SchedulingService, HoldSweeperService],
  exports: [SchedulingService],
})
export class SchedulingModule {}
````

## File: apps/api/src/scheduling/scheduling.service.spec.ts
````typescript
import { ConflictException } from '@nestjs/common';
import { SchedulingService, isExclusionViolation } from './scheduling.service';

/** A metrics double: every counter is a no-op spy. */
function metricsDouble() {
  const counter = () => ({ inc: jest.fn() });
  return {
    bookingsCreated: counter(),
    holdsCreated: counter(),
    bookingConflicts: counter(),
    idempotentReplays: counter(),
  };
}

function configDouble() {
  const values: Record<string, number> = {
    bookingHoldTtlSeconds: 120,
    bookingCancelNoticeHours: 24,
  };
  return { get: jest.fn((key: string) => values[key]) };
}

const SESSION_TYPE = {
  id: 'st-1',
  practitionerId: 'prac-1',
  name: 'Initial consult',
  durationMinutes: 60,
  priceCents: 18000,
  currency: 'USD',
  active: true,
};

const AVAILABILITY = {
  practitionerId: 'prac-1',
  // 24h window on every weekday, so any timestamp is "within availability".
  weekday: -1,
  startMinute: 0,
  endMinute: 1440,
  timezone: 'UTC',
};

function build(overrides: Partial<Record<string, unknown>> = {}) {
  const availability = Array.from({ length: 7 }, (_, weekday) => ({
    ...AVAILABILITY,
    weekday,
  }));
  const bookingCreate = jest.fn();
  const tx = {
    $queryRaw: jest.fn().mockResolvedValue([]),
    booking: { create: bookingCreate, update: jest.fn(), updateMany: jest.fn() },
    outboxEvent: { create: jest.fn() },
  };
  const prisma: any = {
    $transaction: jest.fn(async (cb: (t: unknown) => unknown) => cb(tx)),
    sessionType: {
      findUnique: jest.fn().mockResolvedValue(SESSION_TYPE),
      findFirst: jest.fn().mockResolvedValue(SESSION_TYPE),
    },
    practitionerAvailability: {
      findMany: jest.fn().mockResolvedValue(availability),
    },
    bookingOperation: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    },
    booking: {
      create: bookingCreate,
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    ...overrides,
  };
  const outbox = { emit: jest.fn().mockResolvedValue(undefined) };
  const metrics = metricsDouble();
  const service = new SchedulingService(
    prisma,
    outbox as any,
    metrics as any,
    configDouble() as any,
  );
  return { service, prisma, outbox, metrics, tx };
}

describe('SchedulingService', () => {
  describe('isExclusionViolation', () => {
    it('detects the Postgres exclusion SQLSTATE', () => {
      expect(isExclusionViolation({ meta: { code: '23P01' }, message: '' })).toBe(
        true,
      );
    });
    it('detects the named constraint in a message', () => {
      expect(
        isExclusionViolation({
          message: 'conflicting key value violates exclusion constraint "Booking_no_overlap_per_practitioner"',
        }),
      ).toBe(true);
    });
    it('ignores unrelated errors', () => {
      expect(isExclusionViolation(new Error('nope'))).toBe(false);
    });
  });

  it('maps a lost booking race to a 409 and records the conflict', async () => {
    const { service, prisma, metrics } = build();
    prisma.booking.create.mockRejectedValue({
      meta: { code: '23P01' },
      message: 'conflicting key value violates exclusion constraint',
    });

    await expect(
      service.createHold('member-1', {
        sessionTypeId: 'st-1',
        startTime: '2026-10-14T10:00:00.000Z',
        clientOpId: 'op-conflict',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(metrics.bookingConflicts.inc).toHaveBeenCalledTimes(1);
    expect(metrics.holdsCreated.inc).not.toHaveBeenCalled();
  });

  it('replays a stored result for a duplicate op id without repeating the write', async () => {
    const stored = { id: 'hold-1', status: 'HELD' };
    const { service, prisma, metrics } = build();
    // First call: no op yet. Second call: the op and its response already exist.
    prisma.bookingOperation.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ response: stored });
    prisma.booking.create.mockResolvedValue({
      ...stored,
      practitionerId: 'prac-1',
      memberId: 'member-1',
      sessionTypeId: 'st-1',
      startTime: new Date(),
      endTime: new Date(),
      sessionType: SESSION_TYPE,
      practitioner: {},
      member: {},
    });

    await service.createHold('member-1', {
      sessionTypeId: 'st-1',
      startTime: '2026-10-14T10:00:00.000Z',
      clientOpId: 'op-1',
    });
    const replay = await service.createHold('member-1', {
      sessionTypeId: 'st-1',
      startTime: '2026-10-14T10:00:00.000Z',
      clientOpId: 'op-1',
    });

    expect(replay).toEqual(stored);
    expect(prisma.booking.create).toHaveBeenCalledTimes(1);
    expect(metrics.idempotentReplays.inc).toHaveBeenCalledTimes(1);
  });

  it('expires only holds past their TTL', async () => {
    const { service, prisma } = build();
    prisma.booking.updateMany.mockResolvedValue({ count: 3 });
    const n = await service.expireStaleHolds();
    expect(n).toBe(3);
    const arg = prisma.booking.updateMany.mock.calls[0][0];
    expect(arg.where).toMatchObject({ status: 'HELD' });
    expect(arg.data.status).toBe('CANCELLED');
  });
});
````

## File: apps/api/src/scheduling/scheduling.service.ts
````typescript
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import {
  BOOKING_CANCELLED,
  BOOKING_CONFIRMED,
  OutboxService,
} from '../outbox/outbox.service';
import type { AppConfig } from '../config/configuration';
import {
  addDays,
  dayOffsetIfStable,
  dayOrdinal,
  partsInZone,
  utcFromLocal,
  zonedTimeToUtc,
} from './timezone';
import type {
  CancelBookingDto,
  CreateBookingDto,
  CreateHoldDto,
  CreateSessionTypeDto,
  OpenSlotsQueryDto,
  RescheduleBookingDto,
  SetAvailabilityDto,
} from './dto/scheduling.dto';

const BOOKING_INCLUDE = {
  sessionType: {
    select: {
      id: true,
      name: true,
      durationMinutes: true,
      priceCents: true,
      currency: true,
    },
  },
  practitioner: {
    select: { id: true, handle: true, displayName: true, avatarUrl: true, role: true },
  },
  member: {
    select: { id: true, handle: true, displayName: true, avatarUrl: true },
  },
} satisfies Prisma.BookingInclude;

type BookingRow = Prisma.BookingGetPayload<{ include: typeof BOOKING_INCLUDE }>;

/** Statuses that own a slot and therefore participate in the exclusion index. */
const ACTIVE_STATUSES = ['HELD', 'PENDING', 'CONFIRMED'] as const;

export function isExclusionViolation(err: unknown): boolean {
  const e = err as { code?: string; meta?: { code?: string }; message?: string };
  const pgCode = e?.meta?.code ?? e?.code;
  const message = String(e?.message ?? '');
  return (
    pgCode === '23P01' ||
    message.includes('Booking_no_overlap_per_practitioner') ||
    message.includes('conflicting key value violates exclusion constraint')
  );
}

function isUniqueViolation(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002'
  );
}

/**
 * Errors that are safe to retry for a single-row write: Postgres detected a
 * deadlock or serialization failure, or Prisma's interactive-transaction budget
 * elapsed while the row was waiting on a lock. A lost slot race (23P01) is
 * deliberately NOT retryable — it is a definitive 409.
 */
export function isRetryableWriteError(err: unknown): boolean {
  if (isExclusionViolation(err)) return false;
  const e = err as {
    code?: string;
    meta?: { code?: string };
    message?: string;
  };
  const pgCode = e?.meta?.code ?? e?.code;
  if (pgCode === '40P01' || pgCode === '40001') return true; // deadlock / serialization
  if (pgCode === 'P2028' || pgCode === 'P2034') return true; // tx expired / write conflict
  const message = String(e?.message ?? '');
  return (
    message.includes('deadlock detected') ||
    message.includes('Transaction already closed') ||
    message.includes('Transaction not found')
  );
}

/** Budget for the tiny insert+outbox transactions on the booking path. */
const WRITE_TX_OPTIONS = { timeout: 15_000, maxWait: 15_000 } as const;


@Injectable()
export class SchedulingService {
  private readonly logger = new Logger(SchedulingService.name);
  private readonly holdTtlSeconds: number;
  private readonly cancelNoticeHours: number;
  /** Timestamp of the last hold-expiry sweep triggered from the hot path. */
  private lastHoldExpiryAt = 0;

  constructor(
    private readonly prisma: PrismaService,
    private readonly outbox: OutboxService,
    private readonly metrics: MetricsService,
    config: ConfigService<AppConfig, true>,
  ) {
    this.holdTtlSeconds = config.get('bookingHoldTtlSeconds', { infer: true });
    this.cancelNoticeHours = config.get('bookingCancelNoticeHours', {
      infer: true,
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  // Session type catalog
  // ──────────────────────────────────────────────────────────────────────

  async createSessionType(practitionerId: string, dto: CreateSessionTypeDto) {
    try {
      return await this.prisma.sessionType.create({
        data: {
          practitionerId,
          name: dto.name,
          description: dto.description,
          durationMinutes: dto.durationMinutes,
          priceCents: dto.priceCents,
          currency: dto.currency ?? 'USD',
        },
      });
    } catch (err) {
      if (isUniqueViolation(err)) {
        throw new ConflictException(
          `Session type "${dto.name}" already exists for this practitioner`,
        );
      }
      throw err;
    }
  }

  listSessionTypes(practitionerId?: string) {
    return this.prisma.sessionType.findMany({
      where: { active: true, ...(practitionerId ? { practitionerId } : {}) },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  // Recurring availability
  // ──────────────────────────────────────────────────────────────────────

  async setAvailability(practitionerId: string, dto: SetAvailabilityDto) {
    for (const slot of dto.slots) {
      if (slot.startMinute >= slot.endMinute) {
        throw new BadRequestException(
          `Availability window ${slot.weekday}: startMinute must be < endMinute`,
        );
      }
      try {
        // Validate the IANA zone eagerly so a bad zone fails the request, not
        // the slot lookup that happens later.
        new Intl.DateTimeFormat('en-US', { timeZone: slot.timezone ?? 'UTC' });
      } catch {
        throw new BadRequestException(`Unknown timezone "${slot.timezone}"`);
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.practitionerAvailability.deleteMany({ where: { practitionerId } });
      if (dto.slots.length) {
        await tx.practitionerAvailability.createMany({
          data: dto.slots.map((s) => ({
            practitionerId,
            weekday: s.weekday,
            startMinute: s.startMinute,
            endMinute: s.endMinute,
            timezone: s.timezone ?? 'UTC',
          })),
        });
      }
    });

    return this.prisma.practitionerAvailability.findMany({
      where: { practitionerId },
      orderBy: [{ weekday: 'asc' }, { startMinute: 'asc' }],
    });
  }

  getAvailability(practitionerId: string) {
    return this.prisma.practitionerAvailability.findMany({
      where: { practitionerId },
      orderBy: [{ weekday: 'asc' }, { startMinute: 'asc' }],
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  // Slot lookup: availability − live reservations
  // ──────────────────────────────────────────────────────────────────────

  async listOpenSlots(params: {
    practitionerId: string;
    query: OpenSlotsQueryDto;
  }): Promise<{
    slots: { startTime: string; endTime: string }[];
    totalOpen: number;
    practitionerId: string;
    scannedDays: number;
    conflictsConsidered: number;
  }> {
    const { practitionerId, query } = params;
    const from = new Date(query.from);
    const to = new Date(query.to);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      throw new BadRequestException('from/to must be valid ISO-8601 timestamps');
    }
    if (to <= from) throw new BadRequestException('to must be after from');

    const sessionType = query.sessionTypeId
      ? await this.prisma.sessionType.findUnique({
          where: { id: query.sessionTypeId },
        })
      : await this.prisma.sessionType.findFirst({
          where: { practitionerId, active: true },
          orderBy: { createdAt: 'asc' },
        });
    if (!sessionType) throw new NotFoundException('No session type for practitioner');

    const duration = sessionType.durationMinutes;
    const step = query.granularityMinutes ?? duration;

    const availability = await this.prisma.practitionerAvailability.findMany({
      where: { practitionerId },
    });

    // Live reservations in the window. Expired holds are ignored without
    // needing the sweeper to have run yet, so a booking can claim a slot the
    // moment its hold TTL passes.
    const conflicts = await this.prisma.booking.findMany({
      where: {
        practitionerId,
        startTime: { lt: to },
        endTime: { gt: from },
        OR: [
          { status: { in: ['PENDING', 'CONFIRMED'] } },
          { status: 'HELD', holdExpiresAt: { gt: new Date() } },
        ],
      },
      select: { startTime: true, endTime: true },
    });
    const conflictRanges = conflicts.map((c) => ({
      start: c.startTime.getTime(),
      end: c.endTime.getTime(),
    }));

    const slots: { startTime: string; endTime: string }[] = [];
    let scannedDays = 0;

    for (const av of availability) {
      const tz = av.timezone;
      const startLocal = partsInZone(from, tz);
      const endLocal = partsInZone(to, tz);
      const firstOrdinal = dayOrdinal(startLocal.year, startLocal.month, startLocal.day);
      const lastOrdinal = dayOrdinal(endLocal.year, endLocal.month, endLocal.day);
      const dayCount = lastOrdinal - firstOrdinal + 1;
      scannedDays = Math.max(scannedDays, dayCount);

      for (let offset = 0; offset < dayCount; offset++) {
        const day = addDays(startLocal.year, startLocal.month, startLocal.day, offset);
        const weekday = new Date(
          Date.UTC(day.year, day.month - 1, day.day),
        ).getUTCDay();
        if (weekday !== av.weekday) continue;

        // Sample the zone offset once for this local day (fast path); fall
        // back to the exact per-instant conversion only on a DST transition.
        const dayOffset = dayOffsetIfStable(day.year, day.month, day.day, tz);

        for (
          let minute = av.startMinute;
          minute + duration <= av.endMinute;
          minute += step
        ) {
          const localHour = Math.floor(minute / 60);
          const localMinute = minute % 60;
          const start =
            dayOffset === null
              ? zonedTimeToUtc(
                  day.year,
                  day.month,
                  day.day,
                  localHour,
                  localMinute,
                  tz,
                )
              : utcFromLocal(
                  day.year,
                  day.month,
                  day.day,
                  localHour,
                  localMinute,
                  dayOffset,
                );
          const end = new Date(start.getTime() + duration * 60_000);
          if (start < from || start >= to) continue;
          if (start.getTime() < Date.now()) continue;

          const overlaps = conflictRanges.some(
            (r) => start.getTime() < r.end && end.getTime() > r.start,
          );
          if (!overlaps) {
            slots.push({
              startTime: start.toISOString(),
              endTime: end.toISOString(),
            });
          }
        }
      }
    }

    slots.sort((a, b) => a.startTime.localeCompare(b.startTime));

    // `maxSlots` caps the payload without short-circuiting the computation, so
    // response size stays constant while the candidate/conflict scan still runs
    // in full. That is what makes the slot-lookup benchmark measure compute.
    const capped =
      query.maxSlots && slots.length > query.maxSlots
        ? slots.slice(0, query.maxSlots)
        : slots;

    return {
      slots: capped,
      totalOpen: slots.length,
      practitionerId,
      scannedDays,
      conflictsConsidered: conflictRanges.length,
    };
  }

  // ──────────────────────────────────────────────────────────────────────
  // Booking creation (conflict-safe) and holds
  // ──────────────────────────────────────────────────────────────────────

  async createBooking(
    memberId: string,
    dto: CreateBookingDto,
  ): Promise<BookingRow> {
    const { sessionType, start, end } = await this.resolveSlot(dto);

    return this.withIdempotency(memberId, dto.clientOpId, 'book', async () => {
      await this.assertWithinAvailability(
        sessionType.practitionerId,
        start,
        sessionType.durationMinutes,
      );
      await this.expireHoldsThrottled();

      try {
        if (dto.holdId) {
          // Promote a hold the same member owns. The excluded `status = HELD`
          // row already owns the slot, so this UPDATE cannot lose a race.
          const promoted = await this.writeTx(async (tx) => {
            const res = await tx.booking.updateMany({
              where: { id: dto.holdId, memberId, status: 'HELD' },
              data: {
                status: 'CONFIRMED',
                confirmedAt: new Date(),
                holdExpiresAt: null,
                clientOpId: dto.clientOpId ?? null,
              },
            });
            if (res.count === 0) {
              throw new ConflictException('Hold not found, expired, or not yours');
            }
            const row = await tx.booking.findUniqueOrThrow({
              where: { id: dto.holdId },
              include: BOOKING_INCLUDE,
            });
            await this.outbox.emit(tx, BOOKING_CONFIRMED, this.eventPayload(row));
            return row;
          });
          this.metrics.bookingsCreated.inc();
          return promoted;
        }

        const created = await this.writeTx(async (tx) => {
          await this.acquireSlotLock(tx, sessionType.practitionerId, start);
          const row = await tx.booking.create({
            data: {
              practitionerId: sessionType.practitionerId,
              memberId,
              sessionTypeId: sessionType.id,
              startTime: start,
              endTime: end,
              status: 'CONFIRMED',
              priceCents: sessionType.priceCents,
              currency: sessionType.currency,
              clientOpId: dto.clientOpId ?? null,
              confirmedAt: new Date(),
            },
            include: BOOKING_INCLUDE,
          });
          await this.outbox.emit(tx, BOOKING_CONFIRMED, this.eventPayload(row));
          return row;
        });
        this.metrics.bookingsCreated.inc();
        return created;
      } catch (err) {
        if (isExclusionViolation(err)) {
          this.metrics.bookingConflicts.inc();
          throw new ConflictException({
            error: 'SlotUnavailable',
            message: 'That slot is no longer available',
          });
        }
        throw err;
      }
    });
  }

  async createHold(memberId: string, dto: CreateHoldDto): Promise<BookingRow> {
    const { sessionType, start, end } = await this.resolveSlot({
      sessionTypeId: dto.sessionTypeId,
      startTime: dto.startTime,
    });
    const ttl = dto.ttlSeconds ?? this.holdTtlSeconds;

    return this.withIdempotency(memberId, dto.clientOpId, 'hold', async () => {
      await this.assertWithinAvailability(
        sessionType.practitionerId,
        start,
        sessionType.durationMinutes,
      );
      await this.expireHoldsThrottled();

      try {
        const hold = await this.writeTx(async (tx) => {
          await this.acquireSlotLock(tx, sessionType.practitionerId, start);
          return tx.booking.create({
            data: {
              practitionerId: sessionType.practitionerId,
              memberId,
              sessionTypeId: sessionType.id,
              startTime: start,
              endTime: end,
              status: 'HELD',
              priceCents: sessionType.priceCents,
              currency: sessionType.currency,
              holdExpiresAt: new Date(Date.now() + ttl * 1000),
            },
            include: BOOKING_INCLUDE,
          });
        });
        this.metrics.holdsCreated.inc();
        return hold;
      } catch (err) {
        if (isExclusionViolation(err)) {
          this.metrics.bookingConflicts.inc();
          throw new ConflictException({
            error: 'SlotUnavailable',
            message: 'That slot is already held or booked',
          });
        }
        throw err;
      }
    });
  }

  async reschedule(
    userId: string,
    bookingId: string,
    dto: RescheduleBookingDto,
  ): Promise<BookingRow> {
    const existing = await this.findAuthorizedBooking(userId, bookingId);
    const newStart = new Date(dto.startTime);
    if (Number.isNaN(newStart.getTime())) {
      throw new BadRequestException('startTime must be a valid ISO-8601 timestamp');
    }
    const duration = existing.sessionType.durationMinutes;
    const newEnd = new Date(newStart.getTime() + duration * 60_000);

    return this.withIdempotency(userId, dto.clientOpId, 'reschedule', async () => {
      await this.assertWithinAvailability(
        existing.practitionerId,
        newStart,
        duration,
      );
      await this.expireHoldsThrottled();
      try {
        return await this.writeTx(async (tx) => {
          await this.acquireSlotLock(tx, existing.practitionerId, newStart);
          const row = await tx.booking.update({
            where: { id: bookingId },
            data: { startTime: newStart, endTime: newEnd },
            include: BOOKING_INCLUDE,
          });
          await this.outbox.emit(tx, BOOKING_CONFIRMED, {
            ...this.eventPayload(row),
            rescheduled: true,
          });
          return row;
        });
      } catch (err) {
        if (isExclusionViolation(err)) {
          throw new ConflictException({
            error: 'SlotUnavailable',
            message: 'The new slot overlaps another reservation',
          });
        }
        throw err;
      }
    });
  }

  async cancel(
    userId: string,
    bookingId: string,
    dto: CancelBookingDto,
  ): Promise<BookingRow> {
    const existing = await this.findAuthorizedBooking(userId, bookingId);

    return this.withIdempotency(userId, dto.clientOpId, 'cancel', async () => {
      if (existing.status === 'CANCELLED') return existing;

      const msToStart = existing.startTime.getTime() - Date.now();
      const withinNotice =
        msToStart < this.cancelNoticeHours * 3600_000 && msToStart > 0;

      const row = await this.writeTx(async (tx) => {
        const updated = await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: 'CANCELLED',
            cancelledAt: new Date(),
            cancelReason: dto.reason ?? null,
          },
          include: BOOKING_INCLUDE,
        });
        await this.outbox.emit(tx, BOOKING_CANCELLED, {
          ...this.eventPayload(updated),
          reason: dto.reason ?? null,
          withinNoticeWindow: withinNotice,
        });
        return updated;
      });
      return row;
    });
  }

  async listBookings(params: {
    userId: string;
    as?: 'member' | 'practitioner';
    from?: string;
    to?: string;
    limit?: number;
  }) {
    const limit = params.limit ?? 50;
    const where: Prisma.BookingWhereInput = {
      ...(params.as === 'practitioner'
        ? { practitionerId: params.userId }
        : params.as === 'member'
          ? { memberId: params.userId }
          : {
              OR: [
                { memberId: params.userId },
                { practitionerId: params.userId },
              ],
            }),
      ...(params.from || params.to
        ? {
            startTime: {
              ...(params.from ? { gte: new Date(params.from) } : {}),
              ...(params.to ? { lt: new Date(params.to) } : {}),
            },
          }
        : {}),
    };
    const rows = await this.prisma.booking.findMany({
      where,
      include: BOOKING_INCLUDE,
      orderBy: { startTime: 'desc' },
      take: limit,
    });
    return { items: rows };
  }

  /**
   * Reap holds whose TTL has passed. Safe to run concurrently: each row is
   * cancelled at most once, and the exclusion index immediately frees the slot.
   */
  async expireStaleHolds(): Promise<number> {
    const res = await this.prisma.booking.updateMany({
      where: { status: 'HELD', holdExpiresAt: { lt: new Date() } },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelReason: 'hold_expired',
      },
    });
    return res.count;
  }

  // ──────────────────────────────────────────────────────────────────────
  // Internals
  // ──────────────────────────────────────────────────────────────────────

  private async resolveSlot(dto: {
    sessionTypeId: string;
    startTime: string;
  }) {
    const sessionType = await this.prisma.sessionType.findUnique({
      where: { id: dto.sessionTypeId },
    });
    if (!sessionType || !sessionType.active) {
      throw new NotFoundException('Session type not found');
    }
    const start = new Date(dto.startTime);
    if (Number.isNaN(start.getTime())) {
      throw new BadRequestException('startTime must be a valid ISO-8601 timestamp');
    }
    const end = new Date(start.getTime() + sessionType.durationMinutes * 60_000);
    return { sessionType, start, end };
  }

  private async assertWithinAvailability(
    practitionerId: string,
    start: Date,
    durationMinutes: number,
  ): Promise<void> {
    const availability = await this.prisma.practitionerAvailability.findMany({
      where: { practitionerId },
    });
    if (availability.length === 0) {
      throw new BadRequestException('Practitioner has no availability configured');
    }
    const ok = availability.some((av) => {
      const p = partsInZone(start, av.timezone);
      if (p.weekday !== av.weekday) return false;
      const localMinute = p.hour * 60 + p.minute;
      return (
        localMinute >= av.startMinute &&
        localMinute + durationMinutes <= av.endMinute
      );
    });
    if (!ok) {
      throw new BadRequestException('Requested time is outside availability');
    }
  }

  private async findAuthorizedBooking(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: BOOKING_INCLUDE,
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.memberId !== userId && booking.practitionerId !== userId) {
      throw new ForbiddenException('Not a participant on this booking');
    }
    return booking;
  }

  /**
   * Exactly-once mutation guard keyed by (userId, clientOpId). The first request
   * records its result; a retry with the same op id returns the recorded result
   * without repeating the side effect. A concurrent duplicate waits briefly for
   * the winner to record its result.
   */
  private async withIdempotency<T>(
    userId: string,
    opId: string | undefined,
    action: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    if (!opId) return fn();

    const key = { userId_opId: { userId, opId } };
    const existing = await this.prisma.bookingOperation.findUnique({ where: key });
    if (existing) {
      this.metrics.idempotentReplays.inc({ action });
      return this.replay<T>(existing);
    }

    try {
      await this.prisma.bookingOperation.create({
        data: { userId, opId, action },
      });
    } catch (err) {
      if (isUniqueViolation(err)) {
        const winner = await this.waitForOperation(userId, opId);
        if (winner?.response) {
          this.metrics.idempotentReplays.inc({ action });
          return this.replay<T>(winner);
        }
        throw new ConflictException('Operation already in progress');
      }
      throw err;
    }

    try {
      const result = await fn();
      await this.prisma.bookingOperation.update({
        where: key,
        data: {
          response: result as unknown as Prisma.InputJsonValue,
          bookingId: (result as { id?: string })?.id ?? null,
        },
      });
      return result;
    } catch (err) {
      // Do not poison the idempotency key: a failed attempt may be retried.
      await this.prisma.bookingOperation.delete({ where: key }).catch(() => undefined);
      throw err;
    }
  }

  private replay<T>(row: { response: Prisma.JsonValue }): T {
    if (row.response === null || row.response === undefined) {
      throw new ConflictException('Operation already in progress');
    }
    return row.response as unknown as T;
  }

  private async waitForOperation(
    userId: string,
    opId: string,
  ): Promise<{ response: Prisma.JsonValue } | null> {
    const key = { userId_opId: { userId, opId } };
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 25));
      const row = await this.prisma.bookingOperation.findUnique({ where: key });
      if (!row) return null;
      if (row.response !== null && row.response !== undefined) return row;
    }
    return null;
  }

  /**
   * Serialises the tiny critical section for one (practitioner, slot) pair with
   * a transaction-scoped advisory lock.
   *
   * PostgreSQL's GiST exclusion index can deadlock when several sessions insert
   * overlapping ranges at once (BUG #15026), and with 3+ sessions a retry loop
   * can livelock. The documented remedy is to take one exclusive lock on a
   * shared entity *before* the insert. Here the key is the slot itself, so
   * contenders queue in a deterministic order: the first commits, the rest then
   * hit the exclusion constraint and get a clean 23P01. Different slots use
   * different keys and proceed in parallel. The exclusion constraint remains the
   * correctness backstop — the lock only removes the deadlock storm.
   */
  private async acquireSlotLock(
    tx: Prisma.TransactionClient,
    practitionerId: string,
    start: Date,
  ): Promise<void> {
    const key = `${practitionerId}:${start.toISOString()}`;
    // Namespace 4242 keeps booking locks out of other advisory-lock keyspaces.
    // Wrapped in a subquery so the `void` return is not deserialized by Prisma
    // (which cannot read a void column from $queryRaw).
    await tx.$queryRaw`
      SELECT 1 AS locked
      FROM (SELECT pg_advisory_xact_lock(4242, hashtext(${key}::text))) AS _lock
    `;
  }

  /**
   * Runs a write transaction with a generous budget and bounded retries.
   *
   * Under a same-slot race the exclusion index serializes writers; Postgres can
   * surface a deadlock (40P01) or Prisma can hit its interactive-transaction
   * deadline (P2028) while a row waits on a lock. Both are transient and safe to
   * retry for this single-row insert. A 23P01 (slot taken) is not retried.
   */
  private writeTx<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
    attempts = 5,
  ): Promise<T> {
    return this.withWriteRetry(
      () => this.prisma.$transaction(fn, WRITE_TX_OPTIONS),
      attempts,
    );
  }

  private async withWriteRetry<T>(
    fn: () => Promise<T>,
    attempts: number,
  ): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (!isRetryableWriteError(err)) throw err;
        const backoff = 4 * (attempt + 1) + Math.random() * 12;
        await new Promise((r) => setTimeout(r, backoff));
      }
    }
    throw lastError;
  }

  /**
   * Hot-path variant of the hold sweep. A full `UPDATE` before every single
   * booking attempt is wasted work under contention, so it is throttled: within
   * a 100 ms window the request relies on the background sweeper. Expired holds
   * are still excluded from slot reads, and the worst-case release latency grows
   * by at most the throttle window.
   */
  private async expireHoldsThrottled(): Promise<void> {
    const now = Date.now();
    if (now - this.lastHoldExpiryAt < 100) return;
    this.lastHoldExpiryAt = now;
    await this.expireStaleHolds();
  }

  private eventPayload(row: BookingRow) {
    return {
      bookingId: row.id,
      practitionerId: row.practitionerId,
      memberId: row.memberId,
      sessionTypeId: row.sessionTypeId,
      startTime: row.startTime.toISOString(),
      endTime: row.endTime.toISOString(),
      status: row.status,
    };
  }
}
````

## File: apps/api/src/scheduling/timezone.spec.ts
````typescript
import {
  addDays,
  dayOffsetIfStable,
  dayOrdinal,
  offsetMs,
  partsInZone,
  utcFromLocal,
  zonedTimeToUtc,
} from './timezone';

describe('timezone arithmetic', () => {
  it('converts a fixed-offset zone (Asia/Kolkata, +05:30) to UTC', () => {
    const utc = zonedTimeToUtc(2026, 10, 14, 10, 0, 'Asia/Kolkata');
    expect(utc.toISOString()).toBe('2026-10-14T04:30:00.000Z');
  });

  it('applies the correct DST offset on both sides of a transition (New York)', () => {
    const winter = zonedTimeToUtc(2026, 1, 15, 12, 0, 'America/New_York');
    const summer = zonedTimeToUtc(2026, 7, 15, 12, 0, 'America/New_York');
    // EST = UTC−5, EDT = UTC−4.
    expect(winter.toISOString()).toBe('2026-01-15T17:00:00.000Z');
    expect(summer.toISOString()).toBe('2026-07-15T16:00:00.000Z');
  });

  it('round-trips local wall-clock parts through UTC', () => {
    const utc = zonedTimeToUtc(2026, 6, 15, 14, 15, 'Europe/Zurich');
    const parts = partsInZone(utc, 'Europe/Zurich');
    expect([parts.hour, parts.minute]).toEqual([14, 15]);
  });

  it('resolves a wall-clock time inside a DST spring-forward gap to a real instant', () => {
    // 02:30 on 2026-03-29 does not exist in Europe/Zurich (02:00 → 03:00). The
    // two-pass conversion must still land on a valid instant, not NaN or a
    // wrong-day result; it resolves forward to 03:30 local.
    const utc = zonedTimeToUtc(2026, 3, 29, 2, 30, 'Europe/Zurich');
    const parts = partsInZone(utc, 'Europe/Zurich');
    expect([parts.hour, parts.minute]).toEqual([3, 30]);
  });

  it('reports the weekday of the local calendar date', () => {
    // 2026-10-14 is a Wednesday (weekday 3).
    const parts = partsInZone(new Date('2026-10-14T04:30:00.000Z'), 'Asia/Kolkata');
    expect(parts.weekday).toBe(3);
  });

  it('handles calendar arithmetic across month boundaries', () => {
    expect(addDays(2026, 1, 31, 1)).toEqual({ year: 2026, month: 2, day: 1 });
    expect(dayOrdinal(2026, 2, 1) - dayOrdinal(2026, 1, 31)).toBe(1);
  });

  it('produces a stable offset for a fixed zone', () => {
    expect(offsetMs(new Date('2026-10-14T00:00:00.000Z'), 'Asia/Kolkata')).toBe(
      5.5 * 3600 * 1000,
    );
  });

  it('uses a per-day cached offset only when the day has no DST transition', () => {
    const off = dayOffsetIfStable(2026, 10, 14, 'Europe/Zurich');
    expect(off).not.toBeNull();
    // The fast path must agree with the exact two-pass conversion.
    expect(
      utcFromLocal(2026, 10, 14, 9, 30, off as number).toISOString(),
    ).toBe(zonedTimeToUtc(2026, 10, 14, 9, 30, 'Europe/Zurich').toISOString());

    // 2026-03-29 is the European spring-forward day.
    expect(dayOffsetIfStable(2026, 3, 29, 'Europe/Zurich')).toBeNull();
  });
});
````

## File: apps/api/src/scheduling/timezone.ts
````typescript
/**
 * Minimal, dependency-free IANA timezone arithmetic.
 *
 * Availability is stored as the practitioner's *local wall clock* (weekday +
 * minutes from local midnight + IANA zone). To place a bookable slot on the
 * UTC timeline we must convert those wall-clock instants to UTC, which depends
 * on the offset in force *at that instant* (DST). `Intl.DateTimeFormat` with a
 * timeZone is the only correct source of that offset in Node without a tz
 * database dependency, so we use it directly.
 */

const FMT_CACHE = new Map<string, Intl.DateTimeFormat>();

function formatter(timeZone: string): Intl.DateTimeFormat {
  let fmt = FMT_CACHE.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    FMT_CACHE.set(timeZone, fmt);
  }
  return fmt;
}

export interface ZonedParts {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23
  minute: number;
  second: number;
  weekday: number; // 0 = Sunday … 6 = Saturday
}

/** The wall-clock parts of an instant as observed in `timeZone`. */
export function partsInZone(date: Date, timeZone: string): ZonedParts {
  const parts = formatter(timeZone).formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;
  const year = Number(map.year);
  const month = Number(map.month);
  const day = Number(map.day);
  const hour = Number(map.hour === '24' ? '0' : map.hour);
  const minute = Number(map.minute);
  const second = Number(map.second);
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    weekday: new Date(Date.UTC(year, month - 1, day)).getUTCDay(),
  };
}

/** Offset (ms) that must be added to UTC to obtain local time in `timeZone`. */
export function offsetMs(date: Date, timeZone: string): number {
  const p = partsInZone(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  const floored = date.getTime() - (date.getTime() % 1000);
  return asUtc - floored;
}

/**
 * Convert a local wall-clock time in `timeZone` to the corresponding UTC
 * instant. Two passes handle a DST boundary: the first guess uses the offset at
 * the *naive* UTC interpretation, the second corrects using the offset actually
 * in force at the resulting instant.
 */
export function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const naiveUtc = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  const firstOffset = offsetMs(new Date(naiveUtc), timeZone);
  let ts = naiveUtc - firstOffset;
  const secondOffset = offsetMs(new Date(ts), timeZone);
  if (secondOffset !== firstOffset) ts = naiveUtc - secondOffset;
  return new Date(ts);
}

/** Add `days` to a y/m/d triple using UTC calendar math (DST-safe). */
export function addDays(
  year: number,
  month: number,
  day: number,
  days: number,
): { year: number; month: number; day: number } {
  const d = new Date(Date.UTC(year, month - 1, day + days));
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

/** Whole-day ordinal for a y/m/d triple, so ranges can be compared cheaply. */
export function dayOrdinal(year: number, month: number, day: number): number {
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

/**
 * The UTC offset (ms) in force for a local calendar day, if it is constant
 * across the day (i.e. no DST transition). Returns null on a transition day so
 * the caller can fall back to the exact per-instant conversion.
 *
 * Slot expansion can produce thousands of candidates from one availability
 * window; calling `Intl.DateTimeFormat.formatToParts` for each is the dominant
 * cost. Sampling the offset once per day removes that cost for the common case.
 */
export function dayOffsetIfStable(
  year: number,
  month: number,
  day: number,
  timeZone: string,
): number | null {
  const start = offsetMs(new Date(Date.UTC(year, month - 1, day, 0, 0, 0)), timeZone);
  const end = offsetMs(new Date(Date.UTC(year, month - 1, day, 23, 0, 0)), timeZone);
  return start === end ? start : null;
}

/** Convert local wall-clock parts to UTC using a pre-sampled day offset. */
export function utcFromLocal(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  offset: number,
): Date {
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0) - offset);
}
````

## File: apps/api/test/scheduling.e2e-spec.ts
````typescript
import { INestApplication } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { PrismaService } from '../src/prisma/prisma.service';

jest.setTimeout(30_000);

/**
 * Invariant tests for scheduling, against real Postgres (the exclusion
 * constraint is the thing under test — a mock cannot reproduce it).
 *
 *   1. Booking contention: M members race for one slot; exactly one wins, the
 *      rest get a clean 409.
 *   2. Reschedule idempotency: the same clientOpId twice is a single side effect.
 *   3. Hold expiry: a held slot is unavailable, then becomes bookable after its
 *      TTL without any manual release.
 */
describe('Scheduling invariants (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let practitionerId: string;
  let sessionTypeId: string;
  let members: string[];

  const http = () => request(app.getHttpServer());
  const api = '/api';

  async function firstOpenSlot(afterDays = 1): Promise<string> {
    const from = new Date(Date.now() + afterDays * 86_400_000).toISOString();
    const to = new Date(Date.now() + (afterDays + 7) * 86_400_000).toISOString();
    const res = await http()
      .get(
        `${api}/practitioners/${practitionerId}/slots?from=${from}&to=${to}&sessionTypeId=${sessionTypeId}`,
      )
      .set('x-user-id', members[0])
      .expect(200);
    const slot = (res.body.slots as { startTime: string }[])[0];
    if (!slot) throw new Error('seed produced no bookable slots');
    return slot.startTime;
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    prisma = app.get(PrismaService);

    const practitioner = await prisma.user.findFirstOrThrow({
      where: { handle: 'dr.aruna' },
    });
    practitionerId = practitioner.id;
    const sessionType = await prisma.sessionType.findFirstOrThrow({
      where: { practitionerId, name: 'Initial consult' },
    });
    sessionTypeId = sessionType.id;

    const memberRows = await prisma.user.findMany({
      where: { role: 'MEMBER' },
      orderBy: { createdAt: 'asc' },
      take: 25,
    });
    members = memberRows.map((m) => m.id);

    // Slots are chosen in the future; drop any lingering test leftovers so the
    // suite is repeatable.
    await prisma.booking.deleteMany({
      where: { practitionerId, memberId: { in: members } },
    });
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.booking.deleteMany({
        where: { practitionerId, memberId: { in: members } },
      });
    }
    await app.close();
  });

  it('lets exactly one of many concurrent bookings win a slot', async () => {
    const slot = await firstOpenSlot();
    const contenders = members.slice(0, 20);

    const results = await Promise.all(
      contenders.map((memberId) =>
        http()
          .post(`${api}/bookings`)
          .set('x-user-id', memberId)
          .send({ sessionTypeId, startTime: slot })
          .then((r) => r.status),
      ),
    );

    const created = results.filter((s) => s === 201).length;
    const conflicts = results.filter((s) => s === 409).length;
    expect(created).toBe(1);
    expect(conflicts).toBe(contenders.length - 1);

    const live = await prisma.booking.count({
      where: {
        practitionerId,
        startTime: new Date(slot),
        status: { in: ['HELD', 'PENDING', 'CONFIRMED'] },
      },
    });
    expect(live).toBe(1);
  });

  it('reschedules idempotently: the same op id causes one move', async () => {
    const slotA = await firstOpenSlot(8);
    const slotB = await firstOpenSlot(16);
    const member = members[2];

    const created = await http()
      .post(`${api}/bookings`)
      .set('x-user-id', member)
      .send({ sessionTypeId, startTime: slotA })
      .expect(201);

    const opId = `resched-${Date.now()}`;
    const first = await http()
      .post(`${api}/bookings/${created.body.id}/reschedule`)
      .set('x-user-id', member)
      .send({ startTime: slotB, clientOpId: opId })
      .expect(201);
    const second = await http()
      .post(`${api}/bookings/${created.body.id}/reschedule`)
      .set('x-user-id', member)
      .send({ startTime: slotB, clientOpId: opId })
      .expect(201);

    expect(second.body.startTime).toBe(first.body.startTime);
    expect(new Date(second.body.startTime).toISOString()).toBe(
      new Date(slotB).toISOString(),
    );

    const ops = await prisma.bookingOperation.count({
      where: { userId: member, opId },
    });
    expect(ops).toBe(1);
    await prisma.booking.deleteMany({ where: { id: created.body.id } });
  });

  it('frees a held slot automatically once its TTL passes', async () => {
    const slot = await firstOpenSlot(24);
    const holder = members[4];
    const rival = members[5];

    const hold = await http()
      .post(`${api}/holds`)
      .set('x-user-id', holder)
      .send({ sessionTypeId, startTime: slot, ttlSeconds: 2 })
      .expect(201);
    expect(hold.body.status).toBe('HELD');

    // While held, the slot is unavailable to everyone else.
    const blocked = await http()
      .post(`${api}/bookings`)
      .set('x-user-id', rival)
      .send({ sessionTypeId, startTime: slot });
    expect(blocked.status).toBe(409);

    // After the TTL (plus sweep jitter), the rival can claim it — no manual release.
    const deadline = Date.now() + 8000;
    let claimed = 0;
    let lastStatus = 0;
    while (Date.now() < deadline) {
      const res = await http()
        .post(`${api}/bookings`)
        .set('x-user-id', rival)
        .send({ sessionTypeId, startTime: slot });
      lastStatus = res.status;
      if (res.status === 201) {
        claimed = res.status;
        break;
      }
      await new Promise((r) => setTimeout(r, 250));
    }
    expect(claimed).toBe(201);
    void lastStatus;

    const expired = await prisma.booking.findUnique({ where: { id: hold.body.id } });
    expect(expired?.status).toBe('CANCELLED');
  });
});
````

## File: docs/performance/assets/booking-contention-latency.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="360" viewBox="0 0 720 360" font-family="ui-sans-serif, system-ui, sans-serif">
<rect width="720" height="360" fill="#fff"/>
<text x="72" y="24" font-size="15" font-weight="600" fill="#111">Booking contention — write latency under a 10-way slot race</text>
<text x="72" y="42" font-size="11" fill="#666">http_req_duration percentiles (ms), 200 winners + 1800 conflicts</text>
<rect x="72" y="30" width="10" height="10" fill="#e8590c"/><text x="87" y="39" font-size="11" fill="#333">p50</text><rect x="202" y="30" width="10" height="10" fill="#1c7ed6"/><text x="217" y="39" font-size="11" fill="#333">p90</text><rect x="332" y="30" width="10" height="10" fill="#2f9e44"/><text x="347" y="39" font-size="11" fill="#333">p95</text><rect x="462" y="30" width="10" height="10" fill="#ae3ec9"/><text x="477" y="39" font-size="11" fill="#333">p99</text><line x1="72" y1="56.0" x2="696" y2="56.0" stroke="#e9ecef"/><text x="64" y="59.0" text-anchor="end" font-size="10" fill="#666">496157.11</text><line x1="72" y1="116.0" x2="696" y2="116.0" stroke="#e9ecef"/><text x="64" y="119.0" text-anchor="end" font-size="10" fill="#666">372117.83</text><line x1="72" y1="176.0" x2="696" y2="176.0" stroke="#e9ecef"/><text x="64" y="179.0" text-anchor="end" font-size="10" fill="#666">248078.55</text><line x1="72" y1="236.0" x2="696" y2="236.0" stroke="#e9ecef"/><text x="64" y="239.0" text-anchor="end" font-size="10" fill="#666">124039.28</text><line x1="72" y1="296.0" x2="696" y2="296.0" stroke="#e9ecef"/><text x="64" y="299.0" text-anchor="end" font-size="10" fill="#666">0.00</text><rect x="292.0" y="131.8" width="42.0" height="164.2" rx="2" fill="#e8590c"/><text x="313.0" y="127.8" text-anchor="middle" font-size="10" fill="#333">339367.02</text><rect x="338.0" y="77.9" width="42.0" height="218.1" rx="2" fill="#1c7ed6"/><text x="359.0" y="73.9" text-anchor="middle" font-size="10" fill="#333">450881.73</text><rect x="384.0" y="56.0" width="42.0" height="240.0" rx="2" fill="#2f9e44"/><text x="405.0" y="52.0" text-anchor="middle" font-size="10" fill="#333">496157.11</text><rect x="430.0" y="296.0" width="42.0" height="0.0" rx="2" fill="#ae3ec9"/><text x="451.0" y="292.0" text-anchor="middle" font-size="10" fill="#333">0.00</text><text x="384.0" y="314.0" text-anchor="middle" font-size="11" fill="#333">POST /bookings under race</text>
<text x="696" y="350" text-anchor="end" font-size="10" fill="#666">milliseconds</text>
</svg>
````

## File: docs/performance/assets/feed-read-latency.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="360" viewBox="0 0 720 360" font-family="ui-sans-serif, system-ui, sans-serif">
<rect width="720" height="360" fill="#fff"/>
<text x="72" y="24" font-size="15" font-weight="600" fill="#111">Feed read — warm timeline GET /feed</text>
<text x="72" y="42" font-size="11" fill="#666">525.7 req/s at 15788 requests</text>
<rect x="72" y="30" width="10" height="10" fill="#e8590c"/><text x="87" y="39" font-size="11" fill="#333">p50</text><rect x="202" y="30" width="10" height="10" fill="#1c7ed6"/><text x="217" y="39" font-size="11" fill="#333">p90</text><rect x="332" y="30" width="10" height="10" fill="#2f9e44"/><text x="347" y="39" font-size="11" fill="#333">p95</text><rect x="462" y="30" width="10" height="10" fill="#ae3ec9"/><text x="477" y="39" font-size="11" fill="#333">p99</text><line x1="72" y1="56.0" x2="696" y2="56.0" stroke="#e9ecef"/><text x="64" y="59.0" text-anchor="end" font-size="10" fill="#666">47497.93</text><line x1="72" y1="116.0" x2="696" y2="116.0" stroke="#e9ecef"/><text x="64" y="119.0" text-anchor="end" font-size="10" fill="#666">35623.45</text><line x1="72" y1="176.0" x2="696" y2="176.0" stroke="#e9ecef"/><text x="64" y="179.0" text-anchor="end" font-size="10" fill="#666">23748.97</text><line x1="72" y1="236.0" x2="696" y2="236.0" stroke="#e9ecef"/><text x="64" y="239.0" text-anchor="end" font-size="10" fill="#666">11874.48</text><line x1="72" y1="296.0" x2="696" y2="296.0" stroke="#e9ecef"/><text x="64" y="299.0" text-anchor="end" font-size="10" fill="#666">0.00</text><rect x="292.0" y="109.1" width="42.0" height="186.9" rx="2" fill="#e8590c"/><text x="313.0" y="105.1" text-anchor="middle" font-size="10" fill="#333">36987.99</text><rect x="338.0" y="72.9" width="42.0" height="223.1" rx="2" fill="#1c7ed6"/><text x="359.0" y="68.9" text-anchor="middle" font-size="10" fill="#333">44154.63</text><rect x="384.0" y="56.0" width="42.0" height="240.0" rx="2" fill="#2f9e44"/><text x="405.0" y="52.0" text-anchor="middle" font-size="10" fill="#333">47497.93</text><rect x="430.0" y="296.0" width="42.0" height="0.0" rx="2" fill="#ae3ec9"/><text x="451.0" y="292.0" text-anchor="middle" font-size="10" fill="#333">0.00</text><text x="384.0" y="314.0" text-anchor="middle" font-size="11" fill="#333">GET /feed</text>
<text x="696" y="350" text-anchor="end" font-size="10" fill="#666">milliseconds</text>
</svg>
````

## File: docs/performance/assets/hold-expiry-latency.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="360" viewBox="0 0 720 360" font-family="ui-sans-serif, system-ui, sans-serif">
<rect width="720" height="360" fill="#fff"/>
<text x="72" y="24" font-size="15" font-weight="600" fill="#111">Hold expiry — slot release latency from hold creation</text>
<text x="72" y="42" font-size="11" fill="#666">TTL = 5000 ms; measured across 48 holds (polls every 200 ms + 1 s sweeper)</text>
<rect x="72" y="30" width="10" height="10" fill="#e8590c"/><text x="87" y="39" font-size="11" fill="#333">p50</text><rect x="202" y="30" width="10" height="10" fill="#1c7ed6"/><text x="217" y="39" font-size="11" fill="#333">p90</text><rect x="332" y="30" width="10" height="10" fill="#2f9e44"/><text x="347" y="39" font-size="11" fill="#333">p95</text><rect x="462" y="30" width="10" height="10" fill="#ae3ec9"/><text x="477" y="39" font-size="11" fill="#333">max</text><line x1="72" y1="56.0" x2="696" y2="56.0" stroke="#e9ecef"/><text x="64" y="59.0" text-anchor="end" font-size="10" fill="#666">5290.00</text><line x1="72" y1="116.0" x2="696" y2="116.0" stroke="#e9ecef"/><text x="64" y="119.0" text-anchor="end" font-size="10" fill="#666">3967.50</text><line x1="72" y1="176.0" x2="696" y2="176.0" stroke="#e9ecef"/><text x="64" y="179.0" text-anchor="end" font-size="10" fill="#666">2645.00</text><line x1="72" y1="236.0" x2="696" y2="236.0" stroke="#e9ecef"/><text x="64" y="239.0" text-anchor="end" font-size="10" fill="#666">1322.50</text><line x1="72" y1="296.0" x2="696" y2="296.0" stroke="#e9ecef"/><text x="64" y="299.0" text-anchor="end" font-size="10" fill="#666">0.00</text><rect x="292.0" y="63.9" width="42.0" height="232.1" rx="2" fill="#e8590c"/><text x="313.0" y="59.9" text-anchor="middle" font-size="10" fill="#333">5116.00</text><rect x="338.0" y="60.5" width="42.0" height="235.5" rx="2" fill="#1c7ed6"/><text x="359.0" y="56.5" text-anchor="middle" font-size="10" fill="#333">5190.00</text><rect x="384.0" y="58.5" width="42.0" height="237.5" rx="2" fill="#2f9e44"/><text x="405.0" y="54.5" text-anchor="middle" font-size="10" fill="#333">5234.20</text><rect x="430.0" y="56.0" width="42.0" height="240.0" rx="2" fill="#ae3ec9"/><text x="451.0" y="52.0" text-anchor="middle" font-size="10" fill="#333">5290.00</text><text x="384.0" y="314.0" text-anchor="middle" font-size="11" fill="#333">release latency</text>
<text x="696" y="350" text-anchor="end" font-size="10" fill="#666">milliseconds</text>
</svg>
````

## File: docs/performance/assets/slot-lookup-scaling-after.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="360" viewBox="0 0 720 360" font-family="ui-sans-serif, system-ui, sans-serif">
<rect width="720" height="360" fill="#fff"/>
<text x="72" y="24" font-size="15" font-weight="600" fill="#111">Slot lookup — p95 after caching the per-day timezone offset</text>
<text x="72" y="42" font-size="11" fill="#666">same load and window; the per-candidate Intl parse was the bottleneck</text>
<line x1="72" y1="56.0" x2="688" y2="56.0" stroke="#e9ecef"/><text x="64" y="59.0" text-anchor="end" font-size="10" fill="#666">165060.58</text><line x1="72" y1="117.0" x2="688" y2="117.0" stroke="#e9ecef"/><text x="64" y="120.0" text-anchor="end" font-size="10" fill="#666">123795.44</text><line x1="72" y1="178.0" x2="688" y2="178.0" stroke="#e9ecef"/><text x="64" y="181.0" text-anchor="end" font-size="10" fill="#666">82530.29</text><line x1="72" y1="239.0" x2="688" y2="239.0" stroke="#e9ecef"/><text x="64" y="242.0" text-anchor="end" font-size="10" fill="#666">41265.15</text><line x1="72" y1="300.0" x2="688" y2="300.0" stroke="#e9ecef"/><text x="64" y="303.0" text-anchor="end" font-size="10" fill="#666">0.00</text>
<path d="M72.0,185.8 L277.3,126.3 L482.7,104.6 L688.0,87.8" fill="none" stroke="#e8590c" stroke-width="2"/>
<circle cx="72.0" cy="185.8" r="3.5" fill="#e8590c"/><text x="72.0" y="177.8" text-anchor="middle" font-size="10" fill="#333">77273.09</text><text x="72.0" y="318.0" text-anchor="middle" font-size="10" fill="#333">0</text><circle cx="277.3" cy="126.3" r="3.5" fill="#e8590c"/><text x="277.3" y="118.3" text-anchor="middle" font-size="10" fill="#333">117533.83</text><text x="277.3" y="318.0" text-anchor="middle" font-size="10" fill="#333">400</text><circle cx="482.7" cy="104.6" r="3.5" fill="#e8590c"/><text x="482.7" y="96.6" text-anchor="middle" font-size="10" fill="#333">132156.94</text><text x="482.7" y="318.0" text-anchor="middle" font-size="10" fill="#333">800</text><circle cx="688.0" cy="87.8" r="3.5" fill="#e8590c"/><text x="688.0" y="79.8" text-anchor="middle" font-size="10" fill="#333">143530.94</text><text x="688.0" y="318.0" text-anchor="middle" font-size="10" fill="#333">1200</text>
<text x="688" y="352" text-anchor="end" font-size="10" fill="#666">live reservations (conflictsConsidered)</text>
<text x="14" y="66" font-size="10" fill="#666">p95 ms</text>
</svg>
````

## File: docs/performance/assets/slot-lookup-scaling.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="360" viewBox="0 0 720 360" font-family="ui-sans-serif, system-ui, sans-serif">
<rect width="720" height="360" fill="#fff"/>
<text x="72" y="24" font-size="15" font-weight="600" fill="#111">Slot lookup — p95 before the timezone-offset cache</text>
<text x="72" y="42" font-size="11" fill="#666">GET /practitioners/:id/slots, fixed 14-day window, 100-slot response cap</text>
<line x1="72" y1="56.0" x2="688" y2="56.0" stroke="#e9ecef"/><text x="64" y="59.0" text-anchor="end" font-size="10" fill="#666">469961.21</text><line x1="72" y1="117.0" x2="688" y2="117.0" stroke="#e9ecef"/><text x="64" y="120.0" text-anchor="end" font-size="10" fill="#666">352470.91</text><line x1="72" y1="178.0" x2="688" y2="178.0" stroke="#e9ecef"/><text x="64" y="181.0" text-anchor="end" font-size="10" fill="#666">234980.61</text><line x1="72" y1="239.0" x2="688" y2="239.0" stroke="#e9ecef"/><text x="64" y="242.0" text-anchor="end" font-size="10" fill="#666">117490.30</text><line x1="72" y1="300.0" x2="688" y2="300.0" stroke="#e9ecef"/><text x="64" y="303.0" text-anchor="end" font-size="10" fill="#666">0.00</text>
<path d="M72.0,141.1 L277.3,99.9 L482.7,94.6 L688.0,87.8" fill="none" stroke="#e8590c" stroke-width="2"/>
<circle cx="72.0" cy="141.1" r="3.5" fill="#e8590c"/><text x="72.0" y="133.1" text-anchor="middle" font-size="10" fill="#333">305981.19</text><text x="72.0" y="318.0" text-anchor="middle" font-size="10" fill="#333">0</text><circle cx="277.3" cy="99.9" r="3.5" fill="#e8590c"/><text x="277.3" y="91.9" text-anchor="middle" font-size="10" fill="#333">385410.97</text><text x="277.3" y="318.0" text-anchor="middle" font-size="10" fill="#333">400</text><circle cx="482.7" cy="94.6" r="3.5" fill="#e8590c"/><text x="482.7" y="86.6" text-anchor="middle" font-size="10" fill="#333">395529.92</text><text x="482.7" y="318.0" text-anchor="middle" font-size="10" fill="#333">800</text><circle cx="688.0" cy="87.8" r="3.5" fill="#e8590c"/><text x="688.0" y="79.8" text-anchor="middle" font-size="10" fill="#333">408661.92</text><text x="688.0" y="318.0" text-anchor="middle" font-size="10" fill="#333">1200</text>
<text x="688" y="352" text-anchor="end" font-size="10" fill="#666">live reservations (conflictsConsidered)</text>
<text x="14" y="66" font-size="10" fill="#666">p95 ms</text>
</svg>
````

## File: docs/performance/booking-contention.md
````markdown
# Booking contention

**Status:** measured, optimized (before/after).

## Hypothesis

When M members race for one slot, the PostgreSQL exclusion constraint must let
**exactly one** write succeed and reject the rest with a clean `409` — with no
double-booking, no `500`s, and no lost race. The same workload must not be able
to defeat the invariant via application-level timing.

## Methodology

- Script: `apps/api/performance/booking-contention.js`.
- Scenario: `per-vu-iterations`. Each iteration is **one race**: the VU fires
  10 concurrent `POST /api/bookings` requests (`http.batch`) for one slot, from
  10 distinct members.
- Profile: 20 VUs × 10 iterations = **200 races / 2,000 requests**.
- Slots: 200 open slots pre-allocated 30–200 days out, so every race is on a
  fresh slot and races do not interfere.
- Assertions encoded as k6 thresholds:
  `booking_success == 200`, `booking_conflict == 1,800`, and
  `race_duration p95 < 2 s`.

## Results — before optimization

Observed while first running the scenario (see optimization log for the
diagnosis):

| Metric | Before |
| --- | --- |
| Winners | 198 / 200 races |
| `409` conflicts | 1,572 |
| Unexpected `5xx` | **230** |
| `http_req_duration` p50 | 1,680 ms |
| `http_req_duration` p99 | **10,061 ms** |
| `http_req_failed` | 0.90 (409s count as failures in k6) |

Server logs showed `40P01 deadlock detected` and
`Transaction already closed ... timeout was 5000 ms`. The exact pool-timeout
p99 (10.06 s) is the signature of connection-pool saturation, not slot
contention.

## Optimization

The accepted change serializes the tiny critical section for one
`(practitioner, slot)` pair with a transaction-scoped advisory lock
(`pg_advisory_xact_lock`). The exclusion constraint stays as the correctness
backstop; the lock removes the GiST-index deadlock/livelock that retrying could
not. Two supporting changes: the Prisma pool was enlarged
(`connection_limit=40`), and the k6 harness now sets `batchPerHost = RACERS`
(k6 defaults it to 6, which had silently made the "10-way race" 6-way).

Full reasoning, the rejected retry attempt, and links:
`docs/performance/optimization-log.md`.

## Results — after optimization (extreme profile)

The accepted fix (transaction-scoped advisory lock per `(practitioner, slot)`,
plus k6 `batchPerHost = RACERS`) turns the same profile into a clean invariant:

| Metric | Before | After |
| --- | --- | --- |
| Winners | 198 | **200** |
| `409` conflicts | 1,572 | **1,800** |
| Unexpected `5xx` | **230** | **0** |
| `http_req_duration` p50 | 1,680 ms | **339 ms** |
| `http_req_duration` p95 | — | **496 ms** |
| `http_req_duration` p99 | 10,061 ms | **~1,300 ms** (max 1,582 ms) |
| Race p95 | — | **886 ms** |
| Wall time | ~47 s | **4.7 s** |

Every k6 threshold passes (`success == 200`, `conflict == 1,800`,
`unexpected == 0`, race p95 < 2 s). A rejected intermediate attempt (bounded
retry on `40P01`) is documented in `docs/performance/optimization-log.md` — it
made the tail *worse* (p99 48 s) because of a documented GiST exclusion-index
livelock (PostgreSQL BUG #15026).

![Booking contention latency](assets/booking-contention-latency.svg)

## Results — within envelope

`VUS=10 ITER=6 RACERS=6` (60 races, 6 contenders each): **60 winners, 300
`409`s, 0 unexpected**, race p95 252 ms. The exactly-one-winner property is a
property of the schema, demonstrated both here and against a live database in
`apps/api/test/scheduling.e2e-spec.ts` (20 members race for one slot; exactly
one wins, the rest get `409`).

## What it proves

Correctness under a booking race belongs in the database — a single exclusion
constraint yields exactly-one-winner semantics with no application locking. But
a credible benchmark must do two things: model the concurrency it claims (k6's
`batchPerHost` default of 6 had to be raised), and expose the *second* problem.
Here the constraint was always correct, while the GiST index's concurrency
failure mode, the connection pool, and the interactive-transaction budget were
what actually broke. An optimization that did not help is documented as rejected
rather than hidden.

## Reproduce

```bash
VUS=20 ITER=10 RACERS=10 k6 run apps/api/performance/booking-contention.js
```
````

## File: docs/performance/feed-read-throughput.md
````markdown
# Feed read throughput

**Status:** measured (baseline). Part of the existing feed/chat system, included
as the harness's first non-scheduling scenario.

## Hypothesis

A warm materialized timeline makes `GET /feed` a bounded Redis read plus one
Postgres hydration/`liked` lookup, so it should sustain **hundreds of req/s with
a p95 well under 100 ms** on a single API process, and the async fan-out
pipeline must not interfere with the read path.

## Methodology

- Script: `apps/api/performance/feed-read.js`.
- Scenario: `constant-vus`, 20 VUs, 30 s.
- Viewer: `@maya`, a member. Warm-up: the runner creates 40 posts as `@maya`
  (their own outbox is materialized on write), then waits 3 s for the outbox
  relay + fan-out worker.
- Dataset: `pnpm db:reset && pnpm db:seed` (36 users, 166 follows, 2
  celebrities, ~120 posts).
- `GET /api/feed?limit=20`, mock auth via `x-user-id`.

## Results (2026-10-14, baseline)

A second run on the same host measured 526 req/s with p95 47.5 ms — about 12 %
run-to-run variance, expected when the load generator, API, Postgres, Redis and
monitoring stack share 8 physical cores.

| Metric | Value |
| --- | --- |
| Requests | 17,932 |
| Throughput | **597 req/s** |
| p50 | **32.6 ms** |
| p90 | 38.9 ms |
| p95 | **41.3 ms** |
| max | 82.1 ms |
| Error rate | **0 %** |
| Items returned | 20 every request (never empty) |

## Analysis

The warm path is dominated by the small number of Postgres round trips
(`hydrateIds` + the `liked` set), not by Redis. Event-loop lag stayed flat and
the 40 in-flight warm-up posts did not move read latency, which is the intended
property of the transactional outbox: **the write path cannot block the read
path** — the API request only commits a post + an outbox row.

`EXPLAIN ANALYZE` confirms `hydrateIds` uses `Post.id` primary-key lookups and
the `liked` query uses the `(postId, userId)` unique index. See the optimization
log for the N+1 hydration hypothesis, which this scenario was instrumented to
detect (no per-post author query was observed).

## What it proves

The hybrid fan-out read path is cheap and predictable under sustained
concurrency, and the async pipeline is genuinely decoupled from reads: writes
enqueue work without touching the request's critical path.

## Reproduce

```bash
# with the API running and the timeline warmed (see the runner)
VUS=20 DURATION=30s k6 run apps/api/performance/feed-read.js
```
````

## File: docs/performance/hold-expiry.md
````markdown
# Hold expiry accuracy

**Status:** measured.

## Hypothesis

A hold is a reservation with a TTL. When the TTL passes the slot must become
bookable again within a **small, bounded** window — even though the background
sweeper runs on its own interval and is subject to scheduler jitter.

## Methodology

- Script: `apps/api/performance/hold-expiry.js`.
- Scenario: `per-vu-iterations`, 8 VUs × 6 iterations = 48 holds.
- Per iteration: create a hold with `ttlSeconds = 5`, then a rival polls the
  same slot with real `POST /bookings` attempts every 200 ms until it wins.
- `hold_release_latency` = time from hold creation to the winning booking.
- `hold_release_latency_past_ttl` = that latency minus the TTL (the overshoot).
- Server: hold sweeper every 1000 ms; expiry also runs on the booking hot path.

## Results

| Metric | Value |
| --- | --- |
| Holds created / claimed | **48 / 48** |
| Claim failures | **0** |
| Release latency p50 | 5,116 ms |
| Release latency p95 | **5,234 ms** |
| Overshoot past 5,000 ms TTL — p50 / p95 / max | **116 ms / 234 ms / 290 ms** |
| Booking attempts to win | ~25 per hold (200 ms poll) |

## Analysis

The overshoot is **≈ 116–290 ms**, well below the 1,000 ms sweeper interval. The
reason is architectural: a hold is not released *only* by the sweeper.
`createBooking` checks for and cancels expired holds on the claim path, so the
very request trying to take the slot frees it. The sweeper is a janitor for
metrics and slot reads; it is not on the correctness-critical path. The 200 ms
poll interval and the 100 ms hot-path sweep throttle dominate the observed
overshoot, not the sweeper.

The hot-path sweep is **throttled** (one `UPDATE` per 100 ms window) as part of
the contention optimization — this is the trade-off that keeps it from doubling
write traffic per booking while preserving sub-200 ms release.

## What it proves

Expiry-based reservations can be both cheap (a status flip, no delete-and-lock
dance) and accurate: correctness comes from filtering expired holds at claim
time, and the TTL boundary is honoured within the polling granularity, not the
sweeper's.

## Reproduce

```bash
VUS=8 ITER=6 HOLD_TTL_SECONDS=5 k6 run apps/api/performance/hold-expiry.js
```
````

## File: docs/performance/optimization-log.md
````markdown
# Optimization log

Chronological record of measured before/after changes. Each entry states the
hypothesis, the change, and the measured effect. Rejected hypotheses are kept
too — a negative result is still evidence.

Environment and load parameters are in `docs/performance/README.md`. Raw k6
artifacts live in `apps/api/performance/results/<run>/`.

---

## 2026-10-14 — Booking contention exposes connection-pool + transaction saturation

**Scenario:** `booking-contention` — 200 races, 10 members per slot, 20 VUs
(`POST /api/bookings`).

### Observation (before)

Under a 10-way same-slot race the exclusion constraint correctly produced one
winner and clean `409`s, **but 230 of 2,000 responses were neither 201 nor
409** — they were `500`s. Server logs showed two error classes:

```
PostgresError { code: "40P01", message: "deadlock detected" }
Transaction already closed: ... The timeout for this transaction was 5000 ms,
however 6004 ms passed since the start of the transaction.
```

`http_req_duration` p99 was pinned at **≈ 10.06 s** — the Prisma **pool
timeout** — which is the tell: requests were queueing for a DB connection, not
waiting on the slot itself.

| Metric | Before |
| --- | --- |
| Races | 200 |
| Winners | 198 (expected 200) |
| Conflicts (409) | 1,572 |
| Unexpected (`5xx`) | **230** |
| p50 | 1,680 ms |
| p99 | **10,061 ms** |

### Hypothesis

Three compounding causes, all on the write path:

1. **Pool starvation.** Prisma's default pool is `2×physical cores + 1 ≈ 17`
   connections. 2,000 near-simultaneous requests far exceed that; requests wait
   past the 10 s pool timeout and fail.
2. **Per-request hold sweep.** Every booking ran `expireStaleHolds()` — an extra
   `UPDATE` — before its `INSERT`, doubling write traffic under load.
3. **Interactive-transaction deadline.** The insert + outbox write run in a
   Prisma interactive transaction with a 5 s budget. When a row waits on the
   GiST exclusion index (or on a pooled connection), the budget elapses and
   Prisma throws `P2028`. Concurrent range inserts also deadlock (`40P01`).

### Changes tried

Kept from the start:

- `DATABASE_URL`: `connection_limit=40&pool_timeout=20` (see `.env.example`).
- Throttled the hot-path hold sweep to one `UPDATE` per 100 ms window
  (`expireHoldsThrottled`); the 1 s background sweeper is the floor, and expired
  holds are already excluded from slot reads.

Two candidate fixes were then measured head-to-head:

- **Attempt 1 (rejected):** bounded retry with jitter on transient
  `40P01`/`40001`/`P2028`/`P2034` (`23P01` never retried) plus a 15 s
  interactive-transaction budget.
- **Attempt 2 (accepted):** a transaction-scoped advisory lock per contended
  slot, before the insert.

### Attempt 1 — retry + bigger pool (rejected)

First fix attempt: raise the Prisma pool (`connection_limit=40&pool_timeout=20`),
give interactive transactions a 15 s budget, and retry transient
`40P01`/`40001`/`P2028`/`P2034` with jitter (`23P01` never retried).

| Metric | Baseline | Attempt 1 (retry) | Attempt 2 (advisory lock) |
| --- | --- | --- | --- |
| Winners | 198 | 195 | **200** |
| Conflicts (409) | 1,572 | 1,597 | **1,800** |
| Unexpected (`5xx`) | 230 | 208 | **0** |
| p50 | 1,680 ms | 3,046 ms | 339 ms |
| p95 | — | — | 496 ms |
| p99 / max | 10,061 ms | 47,879 ms | **1,582 ms (max)** |
| Race p95 | — | 49,058 ms | **886 ms** |
| Wall time | ~47 s | ~313 s | **4.7 s** |

Retry made it **much worse**. That is not a tuning miss — it is a documented
PostgreSQL property. Concurrent inserts into a **GiST exclusion index** can
deadlock, and [BUG #15026 / the pgsql mailing list](https://www.postgresql.org/message-id/69d128a8524692d0610ae3118580c859.squirrel%40mail.pinkwin.com)
notes that while two sessions may resolve, *"with three sessions competing"* a
retry loop may never terminate. My 10-way race has ten. Retries multiplied the
offered load against an index already in a deadlock cycle.

### Attempt 2 — serialize the critical section (accepted)

The same mailing list gives the remedy: *"introduce an exclusive lock on some
other entity just before doing the INSERT."* Implemented as a
transaction-scoped **advisory lock keyed by `(practitionerId, startTime)`**
(`pg_advisory_xact_lock(4242, hashtext(key))`, wrapped in a subquery because
Prisma cannot deserialize a `void` column).

- Contenders for **one slot** queue in a deterministic order on one lock: the
  first commits, the rest then hit the exclusion constraint and get a clean
  `409`. No deadlock cycle, no retry storm.
- Different slots use different keys and run fully in parallel.
- The **exclusion constraint is still the correctness backstop** — the lock only
  removes the deadlock; correctness is unchanged.

The harness was also corrected: k6's `batchPerHost` defaults to **6**, so a
same-host "10-way race" was only 6-way. `batchPerHost = RACERS` is now set.

**Result: 200/200 races with exactly one winner, 1,800 clean `409`s, 0 `5xx`,
race p95 1.0 s, whole run in 4.5 s.** All thresholds pass. The `VUS=10 RACERS=6`
profile likewise yields exactly one winner per race with zero unexpected
responses.

### What it proves

1. The exclusion constraint is the right way to make double-booking
   unrepresentable — every source in the references agrees, and no run ever
   double-booked.
2. But a GiST exclusion index has a **concurrency failure mode** that must be
   designed around, not retried through. The fix is one advisory lock on the
   contended resource, and it is dramatically better than retrying.
3. A benchmark is only trustworthy if the harness models what it claims: the
   `batchPerHost` default silently weakened the race until it was corrected.
4. The port pool-size change from Attempt 1 is kept (it is correct for
   connection saturation generally) but it was **not** the fix for this
   problem, and it is documented as such.

---

## 2026-10-14 — Slot lookup: the bottleneck was the timezone parse, not the conflict scan

**Scenario:** `slot-lookup` — fixed 14-day window, `maxSlots=100`, 10 VUs, as the
number of live reservations in the window grows (0 / 400 / 800 / 1200).

The implementation fetches every live reservation in the window and, for each
candidate slot, scans them for an overlap (`Array.some`) — naively
`O(candidates × conflicts)`. That was the hypothesis.

**Before**, the numbers were almost flat and high:

| Live reservations | p50 | p95 |
| --- | --- | --- |
| 0 | 216 ms | 306 ms |
| 400 | 214 ms | 385 ms |
| 800 | 232 ms | 396 ms |
| 1200 | 231 ms | 409 ms |

p50 did not move with conflicts, so the conflict scan was **not** the cost. The
flat ~215 ms floor was slot *generation*: expanding availability into 1,344
candidate slots called `Intl.DateTimeFormat.formatToParts` once per slot to
resolve the DST-correct UTC offset.

`EXPLAIN (ANALYZE, BUFFERS)` confirmed the DB side is trivial: the conflict
query is a bitmap index scan on `Booking_practitionerId_startTime_idx`, 1,200
rows in **3.6 ms**.

**Change:** sample the zone offset **once per local day** and reuse it
(`dayOffsetIfStable` + `utcFromLocal`), falling back to the exact two-pass
conversion only on a DST-transition day (unit-tested against
`zonedTimeToUtc`).

**After:**

| Live reservations | p50 | p95 | p95 improvement |
| --- | --- | --- | --- |
| 0 | **59 ms** | **77 ms** | 4.0× |
| 400 | **69 ms** | **118 ms** | 3.3× |
| 800 | **83 ms** | **132 ms** | 3.0× |
| 1200 | **92 ms** | **144 ms** | 2.8× |

Removing the constant made the true variable visible: latency now rises with
conflicts (75 → 141 ms p95), so the overlap scan is a real, if secondary, cost —
exactly the case the spec anticipated. The next optimization (push the overlap
subtraction into SQL) is now *justified* by the data, and recorded as the
follow-up rather than assumed.

### What it proves

Profile before optimizing. The expensive-looking code (`O(candidates ×
conflicts)`) was not the bottleneck; an unremarkable `Intl` call per slot was.
A 4× win came from caching one value per day, not from rewriting the algorithm.
````

## File: docs/performance/README.md
````markdown
# Tangerine — Performance methodology

This directory is the evidence for the roadmap in `Feature List.md`. Every
scenario has a hypothesis, a reproducible methodology, raw k6 artifacts, an
analysis with tool output, and — where an optimization was warranted — a
before/after. A feature is only "done" when it appears here.

Raw artifacts: `apps/api/performance/results/<run>/` (k6 summary JSON).
Charts: `docs/performance/assets/` (rendered by
`apps/api/performance/report.mjs`).

## 1. Machine spec

Recorded so results are reproducible; do not mix runs across machines.

| | |
| --- | --- |
| Host | AMD Ryzen 7 5700U (8 cores / 16 threads, 411–4374 MHz) |
| RAM | 13 GiB |
| Storage | 475 GiB SSD (`/dev/mapper/root`); Postgres + Redis on local volumes |
| OS / kernel | Omarchy (Arch), `7.1.8-arch1-3`, x86_64 |
| Node.js | v25.2.1 |
| pnpm | 11.10.0 |
| Docker | 29.7.2 |
| Postgres | `postgres:18-alpine`, `shared_preload_libraries=pg_stat_statements`, `track_io_timing=on`, `max_connections=200` |
| Redis | `redis:7-alpine`, AOF on |
| k6 | v2.3.0 |
| Monitoring | `prom/prometheus:v3.1.0`, `grafana/grafana:11.5.1` (host network) |

Everything runs on one host: the API, Postgres, Redis, Prometheus, Grafana and
the k6 generator share 8 physical cores. That is a **ceiling**, not a detail —
contention for CPU between the load generator and the server is part of every
number below.

## 2. Fixed load parameters

- Dataset: `pnpm db:reset && pnpm db:seed` — 36 users, 166 follows, 2
  celebrities (threshold 15), ~120 posts, 12 practitioners with session types
  and Mon–Fri availability.
- Synthetic slot-lookup data: `pnpm --filter @tangerine/api perf:seed-bookings`
  (`BOOKING_COUNT`, `SLOT_MINUTES`).
- Auth: mock `x-user-id`; ids resolved at `setup()` from
  `/api/session/identities`, so scripts are portable across reseeds.
- Warm-up: scenarios that read derived state warm it first (feed posts; slot
  lookups occur on a primed calendar).
- Load profiles are per-scenario and stated in each write-up.

## 3. What we measure

Each scenario file follows: **Hypothesis → Methodology → Results → Analysis →
Optimization → Results after → What it proves.** Analysis always cites a tool
output: `EXPLAIN ANALYZE`, `pg_stat_statements`, server error logs, Prometheus
metrics, or the k6 artifact — never a guess.

## 4. Metrics surfaces

- Application: `GET /api/metrics` — HTTP latency histogram, outbox lag + status
  counts, fan-out queue depth, booking outcomes
  (created / holds / conflicts / idempotent replays), active reservations,
  expired-hold backlog, Node event-loop lag, heap + RSS.
- Postgres: `pg_stat_statements`, `pg_stat_activity`, `EXPLAIN (ANALYZE,
  BUFFERS)`.
- Redis: `SLOWLOG`, `INFO`, key counts by pattern.
- k6: summary JSON per run.

## 5. Scenario index

### Scheduling & booking (new capability)

| Scenario | Script | Status | Headline |
| --- | --- | --- | --- |
| Booking contention | `booking-contention.js` | measured + optimized | 10-way race: **exactly 1 winner, 0 `5xx`, race p95 0.9 s** (baseline had 230 `5xx`) |
| Slot lookup under load | `slot-lookup.js` | measured + optimized | the bottleneck was the timezone parse, not the scan: **p95 306 → 77 ms** |
| Reschedule idempotency | `reschedule-idempotency.js` | measured | 100/100 no-ops, replay p95 29 ms |
| Hold expiry accuracy | `hold-expiry.js` | measured | released within **≈ 234 ms** of a 5 s TTL |

### Existing system

| Scenario | Script | Status | Headline |
| --- | --- | --- | --- |
| Feed read throughput | `feed-read.js` | measured | **597 req/s**, p95 41 ms, 0 % errors |

### Visuals

![Tangerine Grafana dashboard](assets/grafana-dashboard.png)

Captured from the provisioned Grafana stack (`http://localhost:3000/d/tangerine-api`)
during and after the benchmark runs. Charts also live in
`docs/performance/assets/` and are embedded in each write-up:

- `booking-contention-latency.svg` — write latency under a 10-way slot race.
- `slot-lookup-scaling.svg` / `-after.svg` — the timezone-cache optimization.
- `hold-expiry-latency.svg` — slot release latency vs TTL.
- `feed-read-latency.svg` — warm feed percentiles.

The Prometheus scrape config is in `infra/prometheus/prometheus.yml`.

## 6. Run it

```bash
pnpm infra:up
pnpm db:seed
RUN_STAMP=local bash apps/api/performance/run-scheduling.sh
node apps/api/performance/report.mjs apps/api/performance/results/local
```

Grafana dashboard: <http://localhost:3000/d/tangerine-api> (provisioned;
anonymous viewer enabled). Prometheus: <http://localhost:9090>.

## 7. Optimization log

Chronological before/after lives in `docs/performance/optimization-log.md`.

## 8. References

Grounding for the scheduling design and the contention findings:

- PostgreSQL docs — [Exclusion Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-EXCLUSION)
  and [Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html).
- PostgreSQL mailing list — [deadlock when using exclusion constraints / BUG #15026](https://www.postgresql.org/message-id/69d128a8524692d0610ae3118580c859.squirrel%40mail.pinkwin.com):
  GiST exclusion inserts can deadlock, and with 3+ concurrent sessions a naive
  retry loop may never terminate. The suggested remedy is an exclusive lock on a
  shared entity before the `INSERT` — implemented here as an advisory lock keyed
  by `(practitioner, slot)`.
- Franck Pachot — [Avoiding range overlaps with EXCLUDE constraints](https://dev.to/franckpachot/postgresql-exclude-constraints-for-better-concurrency-than-serializable-pob):
  `23P01` for an overlap and `40P01` for the resulting deadlock; only true
  overlaps block.
- [PostgreSQL: Making Double Bookings Impossible](https://gemsofcoding.com/Postgres-No-Double-Booking/)
  and [Postgres EXCLUDE Constraints](https://the-practical-developer.online/posts/postgres-exclude-constraints-stop-double-booking/):
  `EXCLUDE USING gist`, `btree_gist`, partial `WHERE (status <> 'cancelled')`,
  and mapping `23P01` to `409`.
- [Designing a Reservation and Booking System](https://letsbuildsolutions.com/blog/system-design/designing-a-reservation-and-booking-system-inventory-holds-double-booking-prevention-and-concurrency-control/):
  discrete slot rows with `UNIQUE (resource_id, starts_at)` and `ON CONFLICT`
  for the highest-concurrency path; the constraint as the last line of defence.
- Grafana k6 docs — [`http.batch`](https://grafana.com/docs/k6/latest/javascript-api/k6-http/batch/):
  `batch` defaults to 20 and `batchPerHost` to 6, so a same-host "10-way race"
  must raise `batchPerHost` or it is only 6-way.
- Prisma docs — connection pool (`connection_limit`, `pool_timeout`) and
  interactive transaction timeouts.
````

## File: docs/performance/reschedule-idempotency.md
````markdown
# Reschedule idempotency

**Status:** measured.

## Hypothesis

Sending the same reschedule twice with the same client `opId` must move the
booking **once**. The second request should return the first result — same
booking, same start time — and must not touch the database's write path again.

## Methodology

- Script: `apps/api/performance/reschedule-idempotency.js`.
- Scenario: `per-vu-iterations`, 10 VUs × 10 iterations = 100 reschedules.
- Per iteration: create a booking in slot A, reschedule to slot B with
  `clientOpId = resched-<n>`, then repeat the identical request.
- Dataset: deterministic seed; slots chosen 40–200 days out.

## Results

| Metric | Value |
| --- | --- |
| Reschedules performed | 100 |
| First calls OK | **100** |
| Idempotent replays OK | **100** |
| Replay mismatches | **0** |
| First-call latency p50 / p95 | 13 ms / 24 ms |
| Replay latency p50 / p95 | **15 ms / 29 ms** |

## Analysis

`withIdempotency` records the first request's result in `BookingOperation`
keyed by `(userId, opId)`; a retry finds the row and returns the stored response
(`reschedule_replay_ok` counts only responses whose booking id *and* start time
match the first call — 100/100). The replay does no slot validation, no conflict
check, and no write: it is a single indexed `SELECT`, and its p95 is bounded at
**29 ms**.

Concurrency note (covered by `test/scheduling.e2e-spec.ts`): if two identical
requests arrive at once, the unique `(userId, opId)` insert lets one win and the
other waits briefly for the winner's recorded response rather than repeating the
side effect.

## What it proves

Client-supplied operation ids make retries safe at the API boundary, and the
cost of a duplicate is bounded by one primary-key lookup — which is exactly what
a mobile client needs on a flaky network.

## Reproduce

```bash
VUS=10 ITER=10 k6 run apps/api/performance/reschedule-idempotency.js
```
````

## File: docs/performance/slot-lookup.md
````markdown
# Slot lookup under load

**Status:** measured.

## Hypothesis

`GET /practitioners/:id/slots` expands weekly availability into candidate slots
and subtracts live reservations by scanning them per candidate. That is
`O(candidates × conflicts)`, so latency should rise as the number of
reservations in the queried window grows.

## Methodology

- Script: `apps/api/performance/slot-lookup.js`.
- Data: `apps/api/performance/seed-bookings.ts` creates an isolated
  `@perf.practitioner` with all-day availability and packs N non-overlapping
  15-minute `CONFIRMED` bookings back-to-back. It never touches demo users.
- Held constant: a **14-day window** (1–15 days out) and `maxSlots=100`.
  `maxSlots` caps the response payload without short-circuiting the scan, so
  response size is constant and only compute varies.
- Reset between runs: `BOOKING_COUNT ∈ {0, 400, 800, 1200}`, then
  `constant-vus` 10 VUs for 20 s.
- Analysis: `EXPLAIN (ANALYZE, BUFFERS)` on the conflict query,
  `pg_stat_statements` for mean exec time.

## Results

`maxSlots=100` keeps the payload constant; 1,344 candidate slots are generated
per request regardless of how many are booked.

| Live reservations | p50 before | p95 before | p50 after | p95 after |
| --- | --- | --- | --- | --- |
| 0 | 216 ms | 306 ms | **59 ms** | **77 ms** |
| 400 | 214 ms | 385 ms | **69 ms** | **118 ms** |
| 800 | 232 ms | 396 ms | **83 ms** | **132 ms** |
| 1200 | 231 ms | 409 ms | **92 ms** | **144 ms** |

![Slot lookup before](assets/slot-lookup-scaling.svg)
![Slot lookup after](assets/slot-lookup-scaling-after.svg)

## Analysis

**The conflict scan was not the bottleneck.** Before the fix, p50 was flat at
~215 ms as conflicts went 0 → 1200, which rules out an `O(candidates ×
conflicts)` cost. The floor was **slot generation**: 1,344 calls to
`Intl.DateTimeFormat.formatToParts` to resolve each slot's DST-correct UTC
offset. `EXPLAIN (ANALYZE, BUFFERS)` shows the conflict query itself is a
bitmap index scan on `Booking_practitionerId_startTime_idx` — 1,200 rows in
**3.6 ms**.

**Fix:** sample the zone offset once per local day and reuse it
(`dayOffsetIfStable` / `utcFromLocal`), falling back to the exact conversion only
on a DST-transition day (unit-tested). Result: a **3–4× p95 win** across the
board. Only after removing the constant did the true variable appear — p95 now
rises 75 → 141 ms with conflicts, so the overlap scan is real but secondary.

The next optimization — push the overlap subtraction into SQL (a range
anti-join) — is now **justified by the data** rather than assumed, and recorded
as the follow-up.

## What it proves

Measure before optimizing. The algorithm that looked expensive
(`O(candidates × conflicts)`) was not the cost; one unsurprising `Intl` call per
slot was. A one-line caching decision beat rewriting the algorithm. It also
demonstrates `maxSlots`: bounding the payload is a real, cheap win independent of
the scan.

## Reproduce

```bash
for n in 0 400 800 1200; do
  BOOKING_COUNT=$n SLOT_MINUTES=15 pnpm --filter @tangerine/api perf:seed-bookings
  VUS=10 DURATION=20s FROM_DAYS=1 TO_DAYS=15 k6 run apps/api/performance/slot-lookup.js
done
```
````

## File: docs/architecture.md
````markdown
# Tangerine — Architecture

This document records the architectural decisions and trade-offs in
Tangerine. It is the long-form version of the "Stack" and "Engineering
highlights" sections of the README, written for someone reviewing the
design rather than running the app.

Tangerine is a **modular monolith**: a single deployable, clear module
boundaries, no import cycles. It is built to be split later, but there is
no service today that justifies the operational cost of a split.

---

## 1. Runtime shape

```
┌────────────────────────┐        REST (x-user-id)         ┌──────────────────────────┐
│  React + Vite + TS     │ ───────────────────────────────▶│  NestJS on Fastify       │
│  dark-only UI          │ ◀───────────────────────────────│  (modular monolith)      │
│  Feed · Chat           │        Socket.IO (realtime)     │  Prisma · ioredis        │
└────────────────────────┘                                  └────┬───────────┬────────┘
                                                               │           │
                                                       ┌───────▼──┐   ┌────▼──────┐
                                                       │ Postgres │   │   Redis   │
                                                       │  truth   │   │  derived  │
                                                       └──────────┘   └───────────┘
```

- **Postgres** is the source of truth. Every durable fact lives there.
- **Redis** holds only derivable state (materialized timelines, presence).
  A cold Redis is a non-event: the feed backfills from Postgres.
- **BullMQ** (backed by Redis) carries fan-out work that must not block the
  request path.
- **Socket.IO** with the Redis adapter carries real-time chat events and
  enables any instance to reach a socket held by another instance.

---

## 2. Stack decisions

### Why NestJS (on the Fastify adapter), not Express/Next API routes

The point of this backend is **module boundaries**: `users`, `follow`,
`posts`, `feed`, `timeline`, `chat`, `realtime`, `redis`, `prisma`, each
owning its own providers and imports. NestJS gives that structure, DI,
guards, interceptors, and a WebSocket gateway story without writing the
plumbing. Express alone scales to spaghetti; it has no answer to "where does
this provider live."

Fastify is the adapter, not Express, because the throughput ceiling matters
for a performance showcase and Fastify's router and serializer are
materially faster for the JSON-heavy read paths (`GET /feed`). The cost is
a smaller ecosystem of middleware; everything we use here is built-in or
first-party, so that cost is zero in practice.

**Trade-off accepted:** NestJS abstractions (decorators, DI) make hot-path
profiling slightly harder than hand-written handlers. Mitigation: the
hot paths (`FeedService`, `TimelineService`) are thin and avoid heavy
pipes/interceptors; we profile at the service level.

### Why Fastify over plain Node http / uWebSockets

Fastify is fast enough to stop being the bottleneck, which is a prerequisite
for measuring the things we actually care about (DB, Redis, serialization).
Going further (uWebSockets) would make the transport the story instead of
the data path, and we don't need it for the load levels targeted.

### Why Prisma, not Drizzle or raw SQL

Three reasons, in order of weight for *this* project:

1. **Migrations are first-class.** `prisma migrate dev` plus a deterministic
   `seed.ts` is reproducible infra for reviewers; Drizzle's migration story
   in this version is lighter and easier to get wrong.
2. **Type safety across the whole stack.** Generated client types flow into
   DTOs and Swagger with no hand-written row types.
3. **Prisma's transaction API maps directly onto our invariants** (post +
   outbox row in one `prisma.$transaction`; denormalized counters updated
   alongside their triggering write).

**Trade-offs accepted:**

- Heavier runtime and cold start (binary engine). For serverless/edge this
  would matter; for a long-lived API process it does not.
- The query builder occasionally produces suboptimal SQL. We verify hot
  queries with `EXPLAIN ANALYZE` (see the performance program) and drop to
  raw SQL where the planner needs help — e.g. the outbox relay's
  `FOR UPDATE SKIP LOCKED`.
- Query overhead from per-model typing. Acceptable; we batch where needed.

Prisma is a DX-first choice. A latency-first project might pick Drizzle.
That distinction is the honest answer to "would you use Drizzle?"

### Why PostgreSQL 18

Relational model fits the data: users, follows, posts, likes, comments,
conversations, messages all have foreign keys and invariants. Postgres gives
us:

- Real transactions for the outbox + counter invariants.
- `UPDATE … increment` with row locks for server-side sequence assignment.
- `GREATEST()` for monotonic read receipts in one statement.
- Indexes that can be verified with `EXPLAIN ANALYZE`.
- Durable dead-letter rows for failed fan-out.

SQLite would make local setup trivial but cannot model concurrent writers
the way we need (outbox claim, seq races), which is most of the point.

### Why Redis

Three distinct jobs, one service:

1. **Materialized timelines** (`ZSET` keyed by `timeline:{userId}`, scored by
   publish time). O(log n + k) reads instead of an expensive feed query.
2. **Presence via TTL keys**. A 60s TTL refreshed by heartbeats removes
   all disconnect bookkeeping and survives crashes/partitions.
3. **Socket.IO adapter + BullMQ backing store**. Horizontal fan-out of chat
   events and a durable, retryable job queue on the same primitive.

Redis is the one cache we'd keep if we kept only one. The cost is an
additional stateful service to operate; we keep it stateless-by-policy
(everything in Redis is derivable), so a restart loses nothing durable.

### Why BullMQ + transactional outbox, not direct enqueue

The naive version of `POST /posts` reads followers and writes their
timelines inside the request. That couples write latency to follower count
and loses fan-out if the process dies mid-loop.

This project uses the outbox pattern instead:

1. `POST /posts` writes `Post` + `OutboxEvent` in one transaction and
   returns. It never touches timelines.
2. An **outbox relay** polls pending rows and publishes to BullMQ, claiming
   with `FOR UPDATE SKIP LOCKED` so N API instances relay with no
   coordination. `jobId = eventId` makes publishing idempotent.
3. The **BullMQ worker** fans out with retries and exponential backoff.
   Fan-out is idempotent by construction (timelines are sorted sets keyed by
   post id), so at-least-once delivery is safe. Terminal failure becomes a
   durable `FAILED` row, not a lost job.

**Trade-off accepted:** ~`OUTBOX_RELAY_INTERVAL_MS` (default 500ms) added
latency between `POST /posts` and follower visibility. That is an explicit
consistency/latency trade-off; the performance program measures it as "fan-out
lag."

### Why Socket.IO over raw WebSocket / SSE

Rooms, acknowledgements, reconnection, and a horizontal-scale story are
provided rather than re-implemented. The Redis adapter handles cross-instance
delivery. The cost is extra framing overhead per message; for chat payloads
that cost is negligible and the operational savings are real. SSE would
reduce overhead but has no answer to client→server messages beyond POST.

### Why cursor (keyset) pagination, not offsets

Offsets (`OFFSET n`) make the DB skip and discard n rows; cost grows with
page depth and results shift when new rows arrive at the top ("page 2 shows
a row I already saw, or skips one"). Cursors encode a stable
`(createdAt, id)` position and translate to a range predicate the planner
can serve with the `(createdAt, id)` index. Cost is constant per page.

**Trade-off accepted:** Cursor tokens are opaque and slightly larger; clients
cannot jump to "page 5." That is the correct trade for a feed.

### Why pnpm workspaces over Turborepo/Nx

Two apps today. A build orchestrator (Turborepo) earns its keep past
~3 packages or CI cache needs. We crossed neither, and `pnpm -r` scripts
plus Nest's own builder cover the build/test flow. Revisit when a third
app or shared package appears.

### Why mocked auth (`x-user-id`)

Real auth (JWT issuance, refresh rotation, sessions, verification, consent)
is weeks of work that demonstrates security engineering, not performance
engineering. It is isolated to `auth.guard.ts` so swapping it in is a
single-file change. The perf story — fan-out, chat ordering, outbox — is
testable end-to-end without any of that.

### Why mocked media (`mediaUrl` string)

No upload pipeline, presigned URLs, or S3. Posts carry an optional URL so the
data model and hydration path stay real; the pipeline is a LocalStack
experiment (see Feature List Part 4).

### Why no Kafka

Kafka's strengths (retention, replay, multi-consumer fan-out) need event
volume to justify operational cost. Here BullMQ + Postgres outbox already
provide at-least-once delivery and a durable dead letter. Kafka becomes
justified only at Phase 5+ event volumes; until then it is over-engineering.

---

## 3. Data model decisions

See `apps/api/prisma/schema.prisma` for the full schema; the consequential
choices:

- **Denormalized counters** (`likeCount`, `commentCount`, `followerCount`,
  `followingCount`) live on the row so feed hydration is one query, not N
  aggregates. They are updated inside the transaction that changes the
  underlying fact. Risk: drift if a write forgets the counter update. Tests
  cover the cases where both are written together.
- **Timelines store pointers (post ids), not copies.** Edits, deletes and
  counter changes never rewrite millions of timelines; content is hydrated
  at read time.
- **Celebrity flag** (`isCelebrity`) is *derived* from
  `followerCount >= CELEBRITY_FOLLOWER_THRESHOLD`, recalculated on follow
  changes. The threshold is one tunable env var.
- **Server-assigned message `seq`**: monotonic per conversation, advanced
  with `UPDATE conversation SET lastSeq = lastSeq + 1` (row lock). Concurrent
  sends serialize on the row without application-level locking; no two
  clients can ever observe different ordering.
- **Idempotent sends** via `(senderId, clientMsgId)` unique. A retried send
  returns the original message; a lost idempotency race (unique violation
  on insert) is resolved by fetching the winner.
- **Read receipts as a single integer** (`lastReadSeq`) advanced with
  `GREATEST` so out-of-order acks cannot regress it. One row per member per
  conversation regardless of message volume.
- **Presence as a TTL key**: expiry is the cleanup mechanism. A dropped
  connection simply goes stale.
- **Outbox status enum** with a partial index on `(status, availableAt)` so
  the relay's poll is cheap and failed events are queryable.

---

## 4. Scaling boundaries — what breaks first

Honest list, useful for the benchmarks:

1. **Celebrity read path.** `FeedService` merges the pushed timeline with
   one query per celebrity followee. At 5/20/50 followees this is a
   hot-path N+1. Proposed fix: `ZUNIONSTORE` at feed read.
2. **Feed hydration.** `hydrateIds` can produce per-post author queries;
   risk of N+1. Candidate fixes: Prisma `include`, or a batched loader.
3. **Redis round trips.** Timeline writes are one `ZADD` per (follower, post).
   At high follower counts this is O(followers) round trips unless pipelined.
4. **Postgres pool saturation.** Pool size vs. throughput plateau; PgBouncer
   candidate.
5. **JSON serialization.** `JSON.stringify` over large feed payloads on a
   single event loop. Candidate: schema-based fast serializer.
6. **Outbox relay poll loop.** 500ms interval + 200-row batch caps relay
   throughput; find the saturation point.
7. **Socket.IO Redis adapter overhead.** Cross-instance delivery cost; find
   the scale where it matters.

Each of these is an open investigation in `Feature List.md` Part 3, not a
known bug — they are hypotheses to be measured.

---

## 5. What we would not change

- Postgres as the source of truth.
- Redis holding only derivable state.
- Outbox + idempotent workers over dual-write.
- Cursor pagination.
- Server-assigned seq + idempotent sends for chat.

These are the invariants the rest of the system leans on. Benchmarks
challenge them; they have not needed changing in design.
````

## File: infra/grafana/dashboards/tangerine.json
````json
{
  "annotations": { "list": [] },
  "editable": true,
  "graphTooltip": 1,
  "id": null,
  "links": [],
  "refresh": "5s",
  "schemaVersion": 39,
  "tags": ["tangerine", "performance"],
  "templating": { "list": [] },
  "time": { "from": "now-15m", "to": "now" },
  "timezone": "browser",
  "title": "Tangerine — API Performance",
  "uid": "tangerine-api",
  "version": 1,
  "panels": [
    {
      "id": 1,
      "type": "timeseries",
      "title": "HTTP request rate by route",
      "gridPos": { "h": 8, "w": 12, "x": 0, "y": 0 },
      "datasource": { "type": "prometheus", "uid": "prometheus" },
      "fieldConfig": { "defaults": { "unit": "reqps" }, "overrides": [] },
      "targets": [
        {
          "refId": "A",
          "expr": "sum by (route) (rate(tangerine_http_requests_total{status!=\"401\"}[1m]))",
          "legendFormat": "{{route}}"
        }
      ]
    },
    {
      "id": 2,
      "type": "timeseries",
      "title": "HTTP latency p50 / p95 / p99",
      "gridPos": { "h": 8, "w": 12, "x": 12, "y": 0 },
      "datasource": { "type": "prometheus", "uid": "prometheus" },
      "fieldConfig": { "defaults": { "unit": "s" }, "overrides": [] },
      "targets": [
        {
          "refId": "p50",
          "expr": "histogram_quantile(0.50, sum by (le) (rate(tangerine_http_request_duration_seconds_bucket[1m])))",
          "legendFormat": "p50"
        },
        {
          "refId": "p95",
          "expr": "histogram_quantile(0.95, sum by (le) (rate(tangerine_http_request_duration_seconds_bucket[1m])))",
          "legendFormat": "p95"
        },
        {
          "refId": "p99",
          "expr": "histogram_quantile(0.99, sum by (le) (rate(tangerine_http_request_duration_seconds_bucket[1m])))",
          "legendFormat": "p99"
        }
      ]
    },
    {
      "id": 3,
      "type": "timeseries",
      "title": "Outbox lag (oldest unrelayed event)",
      "gridPos": { "h": 8, "w": 8, "x": 0, "y": 8 },
      "datasource": { "type": "prometheus", "uid": "prometheus" },
      "fieldConfig": { "defaults": { "unit": "s" }, "overrides": [] },
      "targets": [
        {
          "refId": "A",
          "expr": "tangerine_outbox_oldest_pending_seconds",
          "legendFormat": "lag"
        }
      ]
    },
    {
      "id": 4,
      "type": "timeseries",
      "title": "Outbox events by status",
      "gridPos": { "h": 8, "w": 8, "x": 8, "y": 8 },
      "datasource": { "type": "prometheus", "uid": "prometheus" },
      "targets": [
        {
          "refId": "A",
          "expr": "tangerine_outbox_events",
          "legendFormat": "{{status}}"
        }
      ]
    },
    {
      "id": 5,
      "type": "timeseries",
      "title": "Fan-out queue depth by state",
      "gridPos": { "h": 8, "w": 8, "x": 16, "y": 8 },
      "datasource": { "type": "prometheus", "uid": "prometheus" },
      "targets": [
        {
          "refId": "A",
          "expr": "tangerine_fanout_queue_jobs",
          "legendFormat": "{{state}}"
        }
      ]
    },
    {
      "id": 6,
      "type": "timeseries",
      "title": "Booking outcomes (rate)",
      "gridPos": { "h": 8, "w": 12, "x": 0, "y": 16 },
      "datasource": { "type": "prometheus", "uid": "prometheus" },
      "fieldConfig": { "defaults": { "unit": "ops" }, "overrides": [] },
      "targets": [
        {
          "refId": "created",
          "expr": "rate(tangerine_bookings_created_total[1m])",
          "legendFormat": "bookings created"
        },
        {
          "refId": "conflict",
          "expr": "rate(tangerine_booking_conflicts_total[1m])",
          "legendFormat": "conflicts (409)"
        },
        {
          "refId": "holds",
          "expr": "rate(tangerine_booking_holds_created_total[1m])",
          "legendFormat": "holds created"
        },
        {
          "refId": "replay",
          "expr": "rate(tangerine_idempotent_replays_total[1m])",
          "legendFormat": "idempotent replays"
        }
      ]
    },
    {
      "id": 7,
      "type": "timeseries",
      "title": "Active reservations & expired-hold backlog",
      "gridPos": { "h": 8, "w": 12, "x": 12, "y": 16 },
      "datasource": { "type": "prometheus", "uid": "prometheus" },
      "targets": [
        {
          "refId": "A",
          "expr": "tangerine_booking_active_reservations",
          "legendFormat": "active"
        },
        {
          "refId": "B",
          "expr": "tangerine_booking_expired_holds_pending",
          "legendFormat": "expired, awaiting sweep"
        }
      ]
    },
    {
      "id": 8,
      "type": "timeseries",
      "title": "Node event-loop lag (p99)",
      "gridPos": { "h": 8, "w": 12, "x": 0, "y": 24 },
      "datasource": { "type": "prometheus", "uid": "prometheus" },
      "fieldConfig": { "defaults": { "unit": "s" }, "overrides": [] },
      "targets": [
        {
          "refId": "A",
          "expr": "tangerine_nodejs_eventloop_lag_p99_seconds",
          "legendFormat": "p99"
        }
      ]
    },
    {
      "id": 9,
      "type": "timeseries",
      "title": "Process memory",
      "gridPos": { "h": 8, "w": 12, "x": 12, "y": 24 },
      "datasource": { "type": "prometheus", "uid": "prometheus" },
      "fieldConfig": { "defaults": { "unit": "bytes" }, "overrides": [] },
      "targets": [
        {
          "refId": "A",
          "expr": "tangerine_nodejs_heap_size_used_bytes",
          "legendFormat": "heap used"
        },
        {
          "refId": "B",
          "expr": "tangerine_process_resident_memory_bytes",
          "legendFormat": "RSS"
        }
      ]
    }
  ]
}
````

## File: infra/grafana/provisioning/dashboards/dashboards.yml
````yaml
apiVersion: 1

providers:
  - name: tangerine
    orgId: 1
    folder: Tangerine
    type: file
    disableDeletion: false
    updateIntervalSeconds: 30
    allowUiUpdates: true
    options:
      path: /var/lib/grafana/dashboards
````

## File: infra/grafana/provisioning/datasources/prometheus.yml
````yaml
apiVersion: 1

datasources:
  - name: Prometheus
    uid: prometheus
    type: prometheus
    access: proxy
    url: http://localhost:9090
    isDefault: true
    editable: false
````

## File: infra/prometheus/prometheus.yml
````yaml
global:
  scrape_interval: 2s
  evaluation_interval: 5s

scrape_configs:
  - job_name: tangerine-api
    metrics_path: /api/metrics
    static_configs:
      - targets: ["localhost:3001"]
        labels:
          service: tangerine-api
  - job_name: prometheus
    static_configs:
      - targets: ["localhost:9090"]
````

## File: .github/workflows/ci.yml
````yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  api:
    name: API (build + test)
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:18-alpine
        env:
          POSTGRES_USER: tangerine
          POSTGRES_PASSWORD: tangerine
          POSTGRES_DB: tangerine
        ports: ["5432:5432"]
        options: >-
          --health-cmd "pg_isready -U tangerine"
          --health-interval 5s
          --health-timeout 5s
          --health-retries 10
      redis:
        image: redis:7-alpine
        ports: ["6379:6379"]
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 5s
          --health-timeout 3s
          --health-retries 10
    env:
      DATABASE_URL: postgresql://tangerine:tangerine@localhost:5432/tangerine?schema=public
      REDIS_URL: redis://localhost:6379
      CELEBRITY_FOLLOWER_THRESHOLD: "15"
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @tangerine/api prisma:generate
      - run: pnpm --filter @tangerine/api exec prisma migrate deploy
      - run: pnpm --filter @tangerine/api prisma:seed
      - run: pnpm --filter @tangerine/api build
      - run: pnpm --filter @tangerine/api test
      - run: pnpm --filter @tangerine/api test:e2e

  web:
    name: Web (typecheck + build)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @tangerine/web build
````

## File: apps/api/prisma/migrations/20261013070721_init/migration.sql
````sql
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'PRACTITIONER', 'PROVIDER');

-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('DIRECT', 'GROUP');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'SYSTEM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "bio" TEXT,
    "headline" TEXT,
    "region" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "followingCount" INTEGER NOT NULL DEFAULT 0,
    "isCelebrity" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("followerId","followingId")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "type" "ConversationType" NOT NULL DEFAULT 'DIRECT',
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastMessageAt" TIMESTAMP(3),

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationMember" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReadSeq" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ConversationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "seq" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientMsgId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle");

-- CreateIndex
CREATE INDEX "User_isCelebrity_idx" ON "User"("isCelebrity");

-- CreateIndex
CREATE INDEX "Post_authorId_createdAt_idx" ON "Post"("authorId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Like_userId_idx" ON "Like"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_postId_userId_key" ON "Like"("postId", "userId");

-- CreateIndex
CREATE INDEX "Comment_postId_createdAt_idx" ON "Comment"("postId", "createdAt");

-- CreateIndex
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");

-- CreateIndex
CREATE INDEX "Conversation_lastMessageAt_idx" ON "Conversation"("lastMessageAt" DESC);

-- CreateIndex
CREATE INDEX "ConversationMember_userId_idx" ON "ConversationMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationMember_conversationId_userId_key" ON "ConversationMember"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Message_conversationId_seq_key" ON "Message"("conversationId", "seq");

-- CreateIndex
CREATE UNIQUE INDEX "Message_senderId_clientMsgId_key" ON "Message"("senderId", "clientMsgId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMember" ADD CONSTRAINT "ConversationMember_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMember" ADD CONSTRAINT "ConversationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
````

## File: apps/api/prisma/migrations/20261013071105_add_conversation_last_seq/migration.sql
````sql
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "lastSeq" INTEGER NOT NULL DEFAULT 0;
````

## File: apps/api/prisma/migrations/20261013173503_add_outbox/migration.sql
````sql
-- CreateEnum
CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'RELAYED', 'PROCESSED', 'FAILED');

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "relayedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OutboxEvent_status_availableAt_idx" ON "OutboxEvent"("status", "availableAt");
````

## File: apps/api/prisma/migrations/migration_lock.toml
````toml
# Please do not edit this file manually
# It should be added in your version-control system (e.g., Git)
provider = "postgresql"
````

## File: apps/api/prisma/seed.ts
````typescript
/* eslint-disable no-console */
import { PrismaClient, Role, ConversationType } from '@prisma/client';

const prisma = new PrismaClient();

// Demo threshold: small so the celebrity/pull path is exercised with a
// realistic-sized follower graph. Production would be ~10_000.
const CELEBRITY_THRESHOLD = Number(process.env.CELEBRITY_FOLLOWER_THRESHOLD ?? 15);

/** Deterministic PRNG so every seed run produces the same demo data. */
function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261013);
const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const pickN = <T>(arr: T[], n: number): T[] => {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  }
  return out;
};

interface SeedUser {
  handle: string;
  displayName: string;
  role: Role;
  headline: string;
  bio: string;
  region: string;
  verified?: boolean;
}

const MEMBERS: SeedUser[] = [
  ['maya', 'Maya Chen', 'Product designer rebuilding her sleep.', 'Berlin, DE'],
  ['drjules', 'Jules Okafor', 'Marathoner, new to strength training.', 'Lagos, NG'],
  ['samir', 'Samir Haddad', 'Managing insulin resistance day by day.', 'Amman, JO'],
  ['priya', 'Priya Ranganathan', 'Perimenopause, learning as I go.', 'Bengaluru, IN'],
  ['tommyb', 'Tommy Brennan', 'Ex-athlete, now focused on recovery.', 'Dublin, IE'],
  ['lena', 'Lena Vogt', 'Yoga teacher exploring gut health.', 'Vienna, AT'],
  ['carlos', 'Carlos Mendes', 'Busy dad trying to train consistently.', 'Lisbon, PT'],
  ['nao', 'Nao Tanaka', 'Night-shift nurse. Sleep is my project.', 'Osaka, JP'],
  ['grace', 'Grace Mwangi', 'Runner and amateur nutrition nerd.', 'Nairobi, KE'],
  ['dmitri', 'Dmitri Volkov', 'Came for the biomarkers, stayed for the habits.', 'Tallinn, EE'],
  ['aisha', 'Aisha Bello', 'Postpartum recovery and getting strong again.', 'Abuja, NG'],
  ['owen', 'Owen Price', 'Desk job, fighting the sedentary default.', 'Manchester, UK'],
  ['sophie', 'Sophie Laurent', 'Cooking my way to better labs.', 'Lyon, FR'],
  ['raj', 'Raj Patel', 'Type 2 in remission. Ask me how.', 'Toronto, CA'],
  ['mira', 'Mira Singh', 'Fertility journey, tracking everything.', 'Delhi, IN'],
  ['finn', 'Finn Larsen', 'Cyclist, borderline low ferritin.', 'Copenhagen, DK'],
  ['elena', 'Elena Petrova', 'Chronic stress? Working on it.', 'Sofia, BG'],
  ['kwame', 'Kwame Mensah', 'Building muscle in my forties.', 'Accra, GH'],
  ['isabel', 'Isabel Reyes', 'Menopause and strength training.', 'Mexico City, MX'],
  ['noah', 'Noah Bergman', 'Sleep apnoea diagnosis, adjusting.', 'Stockholm, SE'],
].map(([handle, displayName, headline, region]) => ({
  handle: handle as string,
  displayName: displayName as string,
  role: Role.MEMBER,
  headline: headline as string,
  bio: 'Using Tangerine to make sense of my health data and stay accountable.',
  region: region as string,
}));

const PRACTITIONERS: SeedUser[] = [
  ['dr.aruna', 'Dr. Aruna Krishnan', 'Endocrinologist · metabolic health', 'Bengaluru, IN', true],
  ['coach.tom', 'Tom Rivera', 'Strength & conditioning coach', 'Austin, US', true],
  ['dr.meyer', 'Dr. Hannah Meyer', 'Sleep physician · CBT-I', 'Zurich, CH', true],
  ['rd.nadia', 'Nadia Farouk, RD', 'Registered dietitian · gut health', 'Cairo, EG', true],
  ['dr.oyelaran', 'Dr. Femi Oyelaran', 'Sports medicine physician', 'London, UK', true],
  ['coach.mei', 'Mei Lin', 'Menopause fitness specialist', 'Singapore, SG', false],
  ['dr.paul', 'Dr. Paul Adeyemi', 'Cardiologist · prevention', 'Lagos, NG', false],
  ['rd.olivia', 'Olivia Grant, RD', 'Sports nutritionist', 'Melbourne, AU', false],
  ['coach.sven', 'Sven Karlsson', 'Endurance coach', 'Oslo, NO', false],
  ['dr.tara', 'Dr. Tara Nair', 'Integrative medicine', 'Mumbai, IN', false],
  ['coach.jules', 'Juliet Moreau', 'Pilates & rehab', 'Paris, FR', false],
  ['dr.kenji', 'Dr. Kenji Sato', 'Internal medicine', 'Tokyo, JP', false],
].map(([handle, displayName, headline, region, verified]) => ({
  handle: handle as string,
  displayName: displayName as string,
  role: Role.PRACTITIONER,
  headline: headline as string,
  bio: 'Evidence-based care. I share what actually moves outcomes, not what trends.',
  region: region as string,
  verified: verified as boolean,
}));

const PROVIDERS: SeedUser[] = [
  ['lab.north', 'Northwind Labs', 'Diagnostics provider', 'Rotterdam, NL'],
  ['supply.true', 'Truvita Supplements', 'Third-party tested supplements', 'Denver, US'],
  ['dev.aura', 'Aura Devices', 'Wearables & CGMs', 'Seoul, KR'],
  ['clinic.reset', 'Reset Clinic', 'Multi-disciplinary clinic', 'Dubai, AE'],
].map(([handle, displayName, headline, region]) => ({
  handle: handle as string,
  displayName: displayName as string,
  role: Role.PROVIDER,
  headline: headline as string,
  bio: 'Products and services referenced across Tangerine care plans.',
  region: region as string,
}));

const POST_BODIES = [
  'Reminder that "normal" lab ranges are population averages, not your optimal. Context matters more than the number.',
  'Three weeks of consistent protein at breakfast and my afternoon crashes are basically gone. N=1, but still.',
  'Hot take: sleep is the highest-leverage intervention and almost nobody treats it that way.',
  'Zone 2 feels boring until you realise you can hold a conversation for two hours and your recovery markers improve.',
  'Your resting heart rate trend over 90 days tells you more than any single reading.',
  'Started tracking my glucose and the biggest surprise was how much my morning coffee routine spiked it before food.',
  'Strength training in perimenopause is not optional — it is the plan.',
  'If you are chronically stressed, no supplement will outrun a nervous system that never gets to rest.',
  'Ferritin of 18 is "normal" and also why you feel exhausted on every ride. Ask for the actual number.',
  'Gut health is not one thing. It is sleep, fibre variety, stress, and time. Mostly time.',
  'The best protocol is the one you will actually do on a bad week.',
  'Recomp is slower than a cut and faster than nothing. Trust the trend line, not the daily scale.',
  'Mobility is a skill, not a stretch. Practice it daily, briefly.',
  'Protein target check: most people aiming for 1.6g/kg are landing nearer 0.9. Log it once and you will see.',
  'My most useful clinical tool is a calendar and the sentence "what changed two weeks before this started?"',
  'Consistency beats intensity for the tenth year running. Boring wins.',
  'Sodium, potassium, magnesium. If you train hard and cramp, check this before you buy anything.',
  'Deload weeks are not lost weeks. They are where the adaptation actually happens.',
  'A CGM is a mirror, not a judge. Use it to learn, not to feel bad.',
  'Fibre is the most underrated supplement and the hardest to sell.',
];

async function main() {
  console.log('Clearing existing data...');
  await prisma.booking.deleteMany();
  await prisma.bookingOperation.deleteMany();
  await prisma.sessionType.deleteMany();
  await prisma.practitionerAvailability.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationMember.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating users...');
  const all: SeedUser[] = [...MEMBERS, ...PRACTITIONERS, ...PROVIDERS];
  const createUser = (u: SeedUser) =>
    prisma.user.create({
      data: {
        handle: u.handle,
        displayName: u.displayName,
        role: u.role,
        headline: u.headline,
        bio: u.bio,
        region: u.region,
        verified: u.verified ?? false,
        avatarUrl: `https://i.pravatar.cc/200?u=${u.handle}`,
      },
    });
  // Create the primary demo user first (awaited) so it is deterministically
  // the earliest row and thus the default identity in the switcher.
  const firstUser = await createUser(all[0]);
  const restUsers = await Promise.all(all.slice(1).map(createUser));
  const users = [firstUser, ...restUsers];

  const members = users.filter((u) => u.role === Role.MEMBER);
  const practitioners = users.filter((u) => u.role === Role.PRACTITIONER);
  // Providers tend to be followed by practitioners.
  const providers = users.filter((u) => u.role === Role.PROVIDER);

  console.log('Generating follow graph...');
  const follows: { followerId: string; followingId: string }[] = [];
  const seen = new Set<string>();
  const addFollow = (followerId: string, followingId: string) => {
    if (followerId === followingId) return;
    const key = `${followerId}:${followingId}`;
    if (seen.has(key)) return;
    seen.add(key);
    follows.push({ followerId, followingId });
  };

  // Members follow a handful of practitioners (biased toward the first few,
  // creating a skewed follower distribution -> a small number of "celebrities").
  for (const m of members) {
    const chosen = [
      ...pickN(practitioners.slice(0, 5), 1 + Math.floor(rand() * 3)),
      ...pickN(practitioners.slice(5), Math.floor(rand() * 2)),
      ...pickN(members, 1 + Math.floor(rand() * 4)),
    ];
    chosen.forEach((t) => addFollow(m.id, t.id));
  }
  // Practitioners follow each other and some providers.
  for (const p of practitioners) {
    [...pickN(practitioners, 2), ...pickN(providers, 1)].forEach((t) =>
      addFollow(p.id, t.id),
    );
  }
  // Everyone follows the two flagship clinicians to push them over the bar.
  for (const u of users) {
    if (u.id !== practitioners[0].id) addFollow(u.id, practitioners[0].id);
    if (u.id !== practitioners[1].id) addFollow(u.id, practitioners[1].id);
  }

  await prisma.follow.createMany({ data: follows });

  console.log('Recomputing follower counts...');
  for (const u of users) {
    const followerCount = follows.filter((f) => f.followingId === u.id).length;
    const followingCount = follows.filter((f) => f.followerId === u.id).length;
    await prisma.user.update({
      where: { id: u.id },
      data: {
        followerCount,
        followingCount,
        isCelebrity: followerCount >= CELEBRITY_THRESHOLD,
      },
    });
  }
  const celebrities = users.filter(
    (u) => follows.filter((f) => f.followingId === u.id).length >= CELEBRITY_THRESHOLD,
  );
  console.log(
    `  ${users.length} users, ${follows.length} follows, ${celebrities.length} celebrities (threshold ${CELEBRITY_THRESHOLD})`,
  );

  console.log('Creating session types and weekly availability...');
  const SESSION_TYPE_TEMPLATES: {
    name: string;
    durationMinutes: number;
    priceCents: number;
  }[] = [
    { name: 'Initial consult', durationMinutes: 60, priceCents: 18000 },
    { name: 'Follow-up', durationMinutes: 30, priceCents: 9000 },
    { name: 'Coaching session', durationMinutes: 45, priceCents: 12000 },
    { name: 'Group class', durationMinutes: 60, priceCents: 4000 },
  ];
  // A few distinct IANA zones so the timezone-aware slot expansion is exercised.
  const TZ_BY_HANDLE: Record<string, string> = {
    'dr.aruna': 'Asia/Kolkata',
    'coach.tom': 'America/Chicago',
    'dr.meyer': 'Europe/Zurich',
    'rd.nadia': 'Africa/Cairo',
  };
  for (const p of practitioners) {
    // The flagship practitioner gets the full catalog; others get two types.
    const templates =
      p.handle === 'dr.aruna'
        ? SESSION_TYPE_TEMPLATES
        : SESSION_TYPE_TEMPLATES.slice(0, 2);
    for (const t of templates) {
      await prisma.sessionType.create({
        data: { practitionerId: p.id, ...t, currency: 'USD' },
      });
    }
    const timezone = TZ_BY_HANDLE[p.handle] ?? 'UTC';
    for (let weekday = 1; weekday <= 5; weekday++) {
      await prisma.practitionerAvailability.create({
        data: {
          practitionerId: p.id,
          weekday,
          startMinute: 9 * 60,
          endMinute: 17 * 60,
          timezone,
        },
      });
    }
  }
  console.log(
    `  ${practitioners.length} practitioners, ${SESSION_TYPE_TEMPLATES.length} session-type templates, Mon–Fri 09:00–17:00`,
  );

  console.log('Creating posts...');
  const posts: { id: string; authorId: string }[] = [];
  let bodyIdx = 0;
  for (const u of users) {
    const count = 2 + Math.floor(rand() * 5);
    for (let i = 0; i < count; i++) {
      const body = POST_BODIES[bodyIdx++ % POST_BODIES.length];
      const daysAgo = rand() * 21;
      const createdAt = new Date(Date.now() - daysAgo * 24 * 3600 * 1000);
      const post = await prisma.post.create({
        data: {
          authorId: u.id,
          body,
          createdAt,
          likeCount: 0,
          commentCount: 0,
        },
      });
      posts.push({ id: post.id, authorId: u.id });
    }
  }

  console.log('Adding likes and comments...');
  for (const post of posts) {
    const likers = pickN(users, Math.floor(rand() * 14));
    if (likers.length) {
      await prisma.like.createMany({
        data: likers.map((l) => ({ postId: post.id, userId: l.id })),
        skipDuplicates: true,
      });
      await prisma.post.update({
        where: { id: post.id },
        data: { likeCount: likers.length },
      });
    }
    const commenters = pickN(users, Math.floor(rand() * 4));
    for (const c of commenters) {
      await prisma.comment.create({
        data: {
          postId: post.id,
          authorId: c.id,
          body: pick([
            'This is such a good point.',
            'Needed to read this today.',
            'Any resources you would recommend?',
            'Saving this, thank you.',
            'Exactly what I have been trying to explain.',
          ]),
        },
      });
    }
    await prisma.post.update({
      where: { id: post.id },
      data: { commentCount: commenters.length },
    });
  }

  console.log('Creating conversations...');
  const directPairs: [number, number][] = [
    [0, MEMBERS.length], // maya <-> dr.aruna
    [0, MEMBERS.length + 1], // maya <-> coach.tom
    [1, MEMBERS.length + 2], // drjules <-> dr.meyer
    [3, MEMBERS.length + 3], // priya <-> rd.nadia
  ];

  const scripts: Record<number, [string, string][]> = {
    // keyed by pair index; [senderRole, body] where senderRole 'self'|'other'
    0: [
      ['self', 'Hi Dr. Krishnan — my fasting glucose is creeping up and I would love to understand why.'],
      ['other', 'Happy to help. Can you share your last three fasting values and how long after waking you measure?'],
      ['self', '118, 124, 116 — all about 30 minutes after waking.'],
      ['other', 'Good, that timing is consistent. Let us look at last night\u2019s dinner and your sleep before we change anything.'],
    ],
    1: [
      ['self', 'Coach, I want to add strength training without wrecking my running.'],
      ['other', 'Two full-body sessions a week, keep them away from your long run. Start submaximal — no soreness heroics.'],
      ['self', 'That feels almost too easy.'],
      ['other', 'That is the point. We can always add load. We cannot un-injure you.'],
    ],
    2: [
      ['self', 'My sleep tracker says I am getting 7 hours but I still wake up exhausted.'],
      ['other', 'Duration is one variable. What does your wake-after-sleep and bedtime consistency look like?'],
      ['self', 'Bedtime swings between 10pm and 1am depending on shifts.'],
      ['other', 'There it is. Anchor your wake time first for two weeks, then we adjust.'],
    ],
    3: [
      ['self', 'Bloating after most meals — where do I even start?'],
      ['other', 'Let us keep it simple: same meals, tracked, for a week. Then we vary one thing at a time.'],
      ['self', 'Okay, starting tomorrow.'],
      ['other', 'Perfect. Send me the log and we will find the pattern together.'],
    ],
  };

  for (let i = 0; i < directPairs.length; i++) {
    const [aIdx, bIdx] = directPairs[i];
    const a = users[aIdx];
    const b = users[bIdx];
    const conv = await prisma.conversation.create({
      data: {
        type: ConversationType.DIRECT,
        members: {
          create: [
            { userId: a.id, lastReadSeq: 0 },
            { userId: b.id, lastReadSeq: 0 },
          ],
        },
      },
    });
    let seq = 0;
    let lastAt = new Date(Date.now() - 3600 * 1000);
    for (const [senderRole, body] of scripts[i]) {
      seq += 1;
      const senderId = senderRole === 'self' ? a.id : b.id;
      lastAt = new Date(lastAt.getTime() + 60 * 1000 * (2 + Math.floor(rand() * 10)));
      await prisma.message.create({
        data: {
          conversationId: conv.id,
          senderId,
          body,
          seq,
          createdAt: lastAt,
          clientMsgId: `seed-${conv.id}-${seq}`,
        },
      });
    }
    await prisma.conversation.update({
      where: { id: conv.id },
      data: { lastSeq: seq, lastMessageAt: lastAt },
    });
  }

  console.log('\nSeed complete.');
  console.log(`Primary demo user: @${MEMBERS[0].handle} (${users[0].id})`);
  console.log(`Celebrities: ${celebrities.map((c) => '@' + c.handle).join(', ')}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
````

## File: apps/api/src/chat/dto/chat.dto.ts
````typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class StartDirectConversationDto {
  @ApiProperty({ description: 'The other user id' })
  @IsString()
  userId!: string;
}

export class SendMessageDto {
  @ApiProperty({ maxLength: 2000 })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  body!: string;

  @ApiPropertyOptional({ description: 'Client idempotency key for retries' })
  @IsOptional()
  @IsString()
  clientMsgId?: string;
}

export class MarkReadDto {
  @ApiProperty({ description: 'Highest sequence number the user has read' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  seq!: number;
}
````

## File: apps/api/src/chat/chat.controller.ts
````typescript
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { ChatService } from './chat.service';
import {
  MarkReadDto,
  SendMessageDto,
  StartDirectConversationDto,
} from './dto/chat.dto';

@ApiTags('chat')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller('conversations')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.chat.listConversations(user.id);
  }

  @Post('direct')
  startDirect(
    @CurrentUser() user: AuthUser,
    @Body() dto: StartDirectConversationDto,
  ) {
    return this.chat.getOrCreateDirect(user.id, dto.userId);
  }

  @Get(':id')
  get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.chat.getConversation(id, user.id);
  }

  @Get(':id/messages')
  messages(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.chat.listMessages({
      userId: user.id,
      conversationId: id,
      cursorSeq: query.cursor ? Number(query.cursor) : undefined,
      limit: query.limit ?? 30,
    });
  }

  /** REST send path — same guarantees as the socket path (idempotent, sequenced). */
  @Post(':id/messages')
  async send(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    const { message } = await this.chat.sendMessage({
      conversationId: id,
      senderId: user.id,
      body: dto.body,
      clientMsgId: dto.clientMsgId ?? randomUUID(),
    });
    return message;
  }

  @Post(':id/read')
  read(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: MarkReadDto,
  ) {
    return this.chat.markRead({
      userId: user.id,
      conversationId: id,
      seq: dto.seq,
    });
  }
}
````

## File: apps/api/src/chat/chat.gateway.ts
````typescript
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { createAdapter } from '@socket.io/redis-adapter';
import type { Server, Socket } from 'socket.io';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
import { RealtimeService } from '../realtime/realtime.service';
import { RedisService } from '../redis/redis.service';
import type { AppConfig } from '../config/configuration';

interface SendPayload {
  conversationId: string;
  body: string;
  clientMsgId?: string;
}

@WebSocketGateway({
  cors: { origin: true, credentials: true },
  transports: ['websocket', 'polling'],
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly chat: ChatService,
    private readonly realtime: RealtimeService,
    private readonly redis: RedisService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  afterInit(server: Server): void {
    this.realtime.setServer(server);

    // Horizontal scale-out: the Socket.IO Redis adapter lets any API instance
    // deliver an event to a socket held by another instance. Adapter clients
    // must be dedicated connections (a subscribed client can't run commands).
    const url = this.config.get('redisUrl', { infer: true });
    const pubClient = new Redis(url);
    const subClient = pubClient.duplicate();
    server.adapter(createAdapter(pubClient, subClient));
    this.logger.log('Chat gateway initialised with Redis adapter');
  }

  async handleConnection(socket: Socket): Promise<void> {
    const userId =
      (socket.handshake.auth?.userId as string | undefined) ??
      (socket.handshake.query?.userId as string | undefined);

    if (!userId) {
      socket.emit('error', { message: 'Missing userId in handshake auth' });
      socket.disconnect(true);
      return;
    }

    socket.data.userId = userId;
    await socket.join(`user:${userId}`);

    const conversationIds = await this.chat.conversationIdsFor(userId);
    await Promise.all(
      conversationIds.map((id) => socket.join(`conversation:${id}`)),
    );

    await this.realtime.markOnline(userId);
    // Broadcast presence. In production this is scoped to users who share a
    // conversation and throttled; a small demo can afford a global emit.
    socket.broadcast.emit('presence:update', { userId, online: true });
    this.logger.debug(`connected user=${userId} socket=${socket.id}`);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    const userId = socket.data.userId as string | undefined;
    if (!userId) return;
    await this.realtime.markOffline(userId);
    socket.broadcast.emit('presence:update', { userId, online: false });
    this.logger.debug(`disconnected user=${userId} socket=${socket.id}`);
  }

  @SubscribeMessage('conversation:join')
  async onJoinConversation(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { conversationId: string },
  ) {
    const userId = socket.data.userId as string;
    await this.chat.assertMember(payload.conversationId, userId);
    await socket.join(`conversation:${payload.conversationId}`);
    return { joined: payload.conversationId };
  }

  @SubscribeMessage('message:send')
  async onSend(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: SendPayload,
  ) {
    const userId = socket.data.userId as string;
    const { message, deduped } = await this.chat.sendMessage({
      conversationId: payload.conversationId,
      senderId: userId,
      body: payload.body,
      clientMsgId: payload.clientMsgId ?? `${userId}-${Date.now()}`,
    });
    return { message, deduped };
  }

  @SubscribeMessage('message:read')
  async onRead(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { conversationId: string; seq: number },
  ) {
    const userId = socket.data.userId as string;
    return this.chat.markRead({
      userId,
      conversationId: payload.conversationId,
      seq: payload.seq,
    });
  }

  @SubscribeMessage('typing')
  onTyping(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { conversationId: string },
  ) {
    socket.to(`conversation:${payload.conversationId}`).emit('typing:update', {
      conversationId: payload.conversationId,
      userId: socket.data.userId,
    });
  }

  @SubscribeMessage('presence:heartbeat')
  async onHeartbeat(@ConnectedSocket() socket: Socket) {
    const userId = socket.data.userId as string;
    await this.realtime.markOnline(userId);
    return { ok: true, userId };
  }
}
````

## File: apps/api/src/chat/chat.module.ts
````typescript
import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
````

## File: apps/api/src/chat/chat.service.spec.ts
````typescript
import { Prisma } from '@prisma/client';
import { ChatService } from './chat.service';

/**
 * These tests exercise the two chat invariants that are easy to get wrong:
 *   1. sends are idempotent on clientMsgId, and
 *   2. ordering is the server's job, not the client's.
 */
describe('ChatService', () => {
  const member = { id: 'member-1' };
  const conversation = { lastSeq: 5 };

  function build(overrides: {
    existingMessage?: unknown;
    memberExists?: boolean;
  }) {
    const createdMessage = {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'user-a',
      body: 'hello',
      seq: 6,
      type: 'TEXT',
      createdAt: new Date(),
      clientMsgId: 'cmid-1',
    };

    const prisma: any = {
      message: {
        findUnique: jest.fn().mockResolvedValue(overrides.existingMessage ?? null),
        findUniqueOrThrow: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(createdMessage),
      },
      conversationMember: {
        findUnique: jest
          .fn()
          .mockResolvedValue(overrides.memberExists === false ? null : member),
      },
      conversation: {
        update: jest.fn().mockResolvedValue({ lastSeq: 6 }),
      },
      $transaction: jest.fn(async (cb: (tx: any) => unknown) => cb(prisma)),
      $executeRaw: jest.fn().mockResolvedValue(1),
    };
    const realtime: any = { emitToConversation: jest.fn() };
    return { service: new ChatService(prisma, realtime), prisma, realtime };
  }

  it('assigns the next sequence number from the atomic conversation counter', async () => {
    const { service, prisma, realtime } = build({});
    const { message, deduped } = await service.sendMessage({
      conversationId: 'conv-1',
      senderId: 'user-a',
      body: 'hello',
      clientMsgId: 'cmid-1',
    });

    expect(deduped).toBe(false);
    expect(message.seq).toBe(6);
    expect(prisma.conversation.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ lastSeq: { increment: 1 } }),
      }),
    );
    expect(realtime.emitToConversation).toHaveBeenCalledWith(
      'conv-1',
      'message:new',
      expect.objectContaining({ seq: 6 }),
    );
  });

  it('deduplicates a retried send without creating a second row', async () => {
    const existing = {
      id: 'msg-existing',
      conversationId: 'conv-1',
      senderId: 'user-a',
      body: 'hello',
      seq: 6,
      type: 'TEXT',
      createdAt: new Date(),
      clientMsgId: 'cmid-1',
    };
    const { service, prisma, realtime } = build({ existingMessage: existing });

    const { message, deduped } = await service.sendMessage({
      conversationId: 'conv-1',
      senderId: 'user-a',
      body: 'hello',
      clientMsgId: 'cmid-1',
    });

    expect(deduped).toBe(true);
    expect(message.id).toBe('msg-existing');
    expect(prisma.message.create).not.toHaveBeenCalled();
    expect(realtime.emitToConversation).not.toHaveBeenCalled();
  });

  it('rejects a sender who is not a member of the conversation', async () => {
    const { service } = build({ memberExists: false });
    await expect(
      service.sendMessage({
        conversationId: 'conv-1',
        senderId: 'intruder',
        body: 'hi',
        clientMsgId: 'x',
      }),
    ).rejects.toThrow(/not a member/i);
  });

  it('resolves a unique-constraint race by returning the winning row', async () => {
    const winner = {
      id: 'msg-winner',
      conversationId: 'conv-1',
      senderId: 'user-a',
      body: 'hello',
      seq: 6,
      type: 'TEXT',
      createdAt: new Date(),
      clientMsgId: 'cmid-race',
    };
    const { service, prisma } = build({});
    // No row on the first lookup, but a concurrent writer wins the insert.
    prisma.message.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(winner);
    prisma.message.findUniqueOrThrow.mockResolvedValue(winner);
    prisma.message.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('duplicate', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    const { message, deduped } = await service.sendMessage({
      conversationId: 'conv-1',
      senderId: 'user-a',
      body: 'hello',
      clientMsgId: 'cmid-race',
    });

    expect(deduped).toBe(true);
    expect(message.id).toBe('msg-winner');
  });

  it('advances the read cursor with a monotonic GREATEST update', async () => {
    const { service, prisma } = build({});
    await service.markRead({ userId: 'user-a', conversationId: 'conv-1', seq: 4 });
    expect(prisma.$executeRaw).toHaveBeenCalledTimes(1);
  });
});
````

## File: apps/api/src/chat/chat.service.ts
````typescript
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConversationType, Message, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeService } from '../realtime/realtime.service';

const USER_MINI = {
  id: true,
  handle: true,
  displayName: true,
  avatarUrl: true,
  role: true,
} satisfies Prisma.UserSelect;

export interface MessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  seq: number;
  type: string;
  createdAt: Date;
  clientMsgId: string;
}

export interface ConversationSummaryDto {
  id: string;
  type: ConversationType;
  title: string | null;
  lastMessageAt: Date | null;
  unreadCount: number;
  members: { id: string; handle: string; displayName: string; avatarUrl: string | null }[];
  lastMessage: { body: string; senderId: string; createdAt: Date } | null;
}

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeService,
  ) {}

  async listConversations(userId: string): Promise<ConversationSummaryDto[]> {
    const memberships = await this.prisma.conversationMember.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            members: { include: { user: { select: USER_MINI } } },
            messages: {
              orderBy: { seq: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    const summaries = await Promise.all(
      memberships.map(async (m) => {
        const conv = m.conversation;
        const last = conv.messages[0] ?? null;
        const unreadCount = await this.prisma.message.count({
          where: {
            conversationId: conv.id,
            seq: { gt: m.lastReadSeq },
            senderId: { not: userId },
          },
        });
        const others = conv.members.filter((x) => x.userId !== userId);
        const title =
          conv.type === ConversationType.GROUP
            ? conv.title
            : others.map((o) => o.user.displayName).join(', ');
        return {
          id: conv.id,
          type: conv.type,
          title,
          lastMessageAt: conv.lastMessageAt,
          unreadCount,
          members: conv.members.map((x) => x.user),
          lastMessage: last
            ? { body: last.body, senderId: last.senderId, createdAt: last.createdAt }
            : null,
        } satisfies ConversationSummaryDto;
      }),
    );

    return summaries.sort((a, b) => {
      const at = a.lastMessageAt?.getTime() ?? 0;
      const bt = b.lastMessageAt?.getTime() ?? 0;
      return bt - at;
    });
  }

  async getOrCreateDirect(userId: string, otherUserId: string) {
    if (userId === otherUserId) {
      throw new ForbiddenException('Cannot start a conversation with yourself');
    }
    const other = await this.prisma.user.findUnique({
      where: { id: otherUserId },
      select: { id: true },
    });
    if (!other) throw new NotFoundException('User not found');

    const existing = await this.prisma.conversation.findFirst({
      where: {
        type: ConversationType.DIRECT,
        AND: [
          { members: { some: { userId } } },
          { members: { some: { userId: otherUserId } } },
        ],
      },
      include: { members: true },
    });
    // Guard against a group/duplicate match: a DIRECT chat must have 2 members.
    if (existing && existing.members.length === 2) {
      return this.getConversation(existing.id, userId);
    }

    const created = await this.prisma.conversation.create({
      data: {
        type: ConversationType.DIRECT,
        members: {
          create: [
            { userId, lastReadSeq: 0 },
            { userId: otherUserId, lastReadSeq: 0 },
          ],
        },
      },
    });
    return this.getConversation(created.id, userId);
  }

  async getConversation(conversationId: string, userId: string) {
    await this.assertMember(conversationId, userId);
    const conv = await this.prisma.conversation.findUniqueOrThrow({
      where: { id: conversationId },
      include: { members: { include: { user: { select: USER_MINI } } } },
    });
    return {
      id: conv.id,
      type: conv.type,
      title:
        conv.type === ConversationType.GROUP
          ? conv.title
          : conv.members
              .filter((m) => m.userId !== userId)
              .map((m) => m.user.displayName)
              .join(', '),
      members: conv.members.map((m) => m.user),
    };
  }

  async listMessages(params: {
    userId: string;
    conversationId: string;
    cursorSeq?: number;
    limit: number;
  }) {
    const { userId, conversationId, cursorSeq, limit } = params;
    await this.assertMember(conversationId, userId);

    const rows = await this.prisma.message.findMany({
      where: {
        conversationId,
        ...(cursorSeq ? { seq: { lt: cursorSeq } } : {}),
      },
      orderBy: { seq: 'desc' },
      take: limit + 1,
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    // Return ascending for rendering; cursor is the oldest seq in the page.
    const items = page.map(toMessageDto).reverse();
    return {
      items,
      nextCursor: hasMore ? String(page[page.length - 1].seq) : null,
    };
  }

  /**
   * Idempotent send. `clientMsgId` is the client's retry key: a duplicate send
   * returns the original message instead of creating a second one. The sequence
   * number comes from an atomic increment on the conversation row, so ordering
   * is decided by the server, never by client clocks.
   */
  async sendMessage(params: {
    conversationId: string;
    senderId: string;
    body: string;
    clientMsgId: string;
  }): Promise<{ message: MessageDto; deduped: boolean }> {
    const { conversationId, senderId, body, clientMsgId } = params;
    await this.assertMember(conversationId, senderId);

    const existing = await this.prisma.message.findUnique({
      where: { senderId_clientMsgId: { senderId, clientMsgId } },
    });
    if (existing) {
      return { message: toMessageDto(existing), deduped: true };
    }

    let message: Message;
    try {
      message = await this.prisma.$transaction(async (tx) => {
        const conv = await tx.conversation.update({
          where: { id: conversationId },
          data: { lastSeq: { increment: 1 }, lastMessageAt: new Date() },
          select: { lastSeq: true },
        });
        return tx.message.create({
          data: {
            conversationId,
            senderId,
            body,
            seq: conv.lastSeq,
            clientMsgId,
          },
        });
      });
    } catch (err) {
      // Lost a race on the idempotency key — return the winner's row.
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        const winner = await this.prisma.message.findUniqueOrThrow({
          where: { senderId_clientMsgId: { senderId, clientMsgId } },
        });
        return { message: toMessageDto(winner), deduped: true };
      }
      throw err;
    }

    const dto = toMessageDto(message);
    this.realtime.emitToConversation(conversationId, 'message:new', dto);
    return { message: dto, deduped: false };
  }

  /** Advance a member's read cursor to `seq` (never backwards). */
  async markRead(params: {
    userId: string;
    conversationId: string;
    seq: number;
  }): Promise<{ conversationId: string; userId: string; seq: number }> {
    const { userId, conversationId, seq } = params;
    await this.assertMember(conversationId, userId);

    await this.prisma.$executeRaw`
      UPDATE "ConversationMember"
      SET "lastReadSeq" = GREATEST("lastReadSeq", ${seq})
      WHERE "conversationId" = ${conversationId} AND "userId" = ${userId}
    `;

    const event = { conversationId, userId, seq };
    this.realtime.emitToConversation(conversationId, 'read:update', event);
    return event;
  }

  async assertMember(conversationId: string, userId: string): Promise<void> {
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
      select: { id: true },
    });
    if (!member) {
      throw new ForbiddenException('You are not a member of this conversation');
    }
  }

  async conversationIdsFor(userId: string): Promise<string[]> {
    const rows = await this.prisma.conversationMember.findMany({
      where: { userId },
      select: { conversationId: true },
    });
    return rows.map((r) => r.conversationId);
  }

  /** Peer user ids for a conversation, excluding `userId`. */
  async peerUserIds(conversationId: string, userId: string): Promise<string[]> {
    const rows = await this.prisma.conversationMember.findMany({
      where: { conversationId, userId: { not: userId } },
      select: { userId: true },
    });
    return rows.map((r) => r.userId);
  }
}

function toMessageDto(m: Message): MessageDto {
  return {
    id: m.id,
    conversationId: m.conversationId,
    senderId: m.senderId,
    body: m.body,
    seq: m.seq,
    type: m.type,
    createdAt: m.createdAt,
    clientMsgId: m.clientMsgId,
  };
}
````

## File: apps/api/src/common/decorators/current-user.decorator.ts
````typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  id: string;
  handle: string;
  displayName: string;
}

/**
 * Injects the authenticated user resolved by AuthGuard.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthUser;
  },
);
````

## File: apps/api/src/common/dto/pagination.dto.ts
````typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Opaque keyset cursor from a previous page' })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;
}

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

export function toPage<T>(
  items: T[],
  limit: number,
  cursorOf: (item: T) => string,
): Page<T> {
  const hasMore = items.length > limit;
  const pageItems = hasMore ? items.slice(0, limit) : items;
  return {
    items: pageItems,
    nextCursor: hasMore ? cursorOf(pageItems[pageItems.length - 1]) : null,
  };
}
````

## File: apps/api/src/common/filters/all-exceptions.filter.ts
````typescript
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { FastifyReply } from 'fastify';

/**
 * Normalizes every error to a single JSON shape:
 *   { statusCode, error, message, path, timestamp }
 * Prisma errors are translated to sensible HTTP codes so DB concerns never
 * leak as 500s.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const r = res as Record<string, unknown>;
        message = (r.message as string | string[]) ?? exception.message;
        error = (r.error as string) ?? exception.name;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        error = 'Conflict';
        message = `Unique constraint failed on ${JSON.stringify(exception.meta?.target)}`;
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        error = 'Not Found';
        message = 'Record not found';
      }
    }

    if (status >= 500) {
      this.logger.error(exception);
    }

    void reply.status(status).send({
      statusCode: status,
      error,
      message,
      path: request?.url,
      timestamp: new Date().toISOString(),
    });
  }
}
````

## File: apps/api/src/common/guards/auth.guard.ts
````typescript
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Mock authentication.
 *
 * Onboarding / signup / session issuance are deliberately out of scope for this
 * demo (we assume every practitioner and member is already registered). The
 * guard simply resolves the current user from an `x-user-id` header — which lets
 * the frontend switch identities with a dropdown while still exercising a real
 * "resolve identity per request, reject unknown principals" path.
 *
 * Swapping this for JWT/session verification later touches exactly one file.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'] as string | undefined;
    if (!userId) {
      throw new UnauthorizedException(
        'Missing x-user-id header (mock auth — pick a user in the switcher)',
      );
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, handle: true, displayName: true },
    });
    if (!user) {
      throw new UnauthorizedException(`Unknown user: ${userId}`);
    }
    request.user = user;
    return true;
  }
}
````

## File: apps/api/src/common/cursor.spec.ts
````typescript
import { decodeCursor, encodeCursor } from './cursor';

describe('cursor', () => {
  it('round-trips values', () => {
    const cursor = encodeCursor([1712345678901, 'post_123']);
    expect(decodeCursor(cursor)).toEqual(['1712345678901', 'post_123']);
  });

  it('returns null for empty input', () => {
    expect(decodeCursor(undefined)).toBeNull();
    expect(decodeCursor(null)).toBeNull();
    expect(decodeCursor('')).toBeNull();
  });

  it('returns null for garbage', () => {
    expect(decodeCursor('not-a-cursor!!')).toBeNull();
    // valid base64url of a non-array JSON value
    const nonArray = Buffer.from('{"a":1}', 'utf8').toString('base64url');
    expect(decodeCursor(nonArray)).toBeNull();
  });

  it('is url-safe (no padding, no + or /)', () => {
    const cursor = encodeCursor([1, 'x'.repeat(50)]);
    expect(cursor).not.toMatch(/[+/=]/);
  });
});
````

## File: apps/api/src/common/cursor.ts
````typescript
/**
 * Opaque keyset (seek) cursors.
 *
 * Offset pagination is wrong for feeds and chat: rows are inserted at the top
 * while the user reads, which shifts every offset and produces duplicates or
 * skipped items. A keyset cursor encodes a stable position — typically
 * (sortKey, id) — so the next page continues exactly where the last ended,
 * regardless of concurrent writes.
 */
export function encodeCursor(values: (string | number)[]): string {
  return Buffer.from(JSON.stringify(values), 'utf8').toString('base64url');
}

export function decodeCursor(cursor?: string | null): string[] | null {
  if (!cursor) return null;
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, 'base64url').toString('utf8'),
    );
    if (!Array.isArray(parsed)) return null;
    return parsed.map((v) => String(v));
  } catch {
    return null;
  }
}
````

## File: apps/api/src/fanout/fanout.module.ts
````typescript
import { Module } from '@nestjs/common';
import { TimelineModule } from '../timeline/timeline.module';
import { FanoutProcessor } from './fanout.processor';

@Module({
  imports: [TimelineModule],
  providers: [FanoutProcessor],
})
export class FanoutModule {}
````

## File: apps/api/src/fanout/fanout.processor.spec.ts
````typescript
import { FanoutProcessor } from './fanout.processor';
import { POST_CREATED } from '../outbox/outbox.service';

function job(overrides: Record<string, unknown> = {}) {
  return {
    name: POST_CREATED,
    data: {
      eventId: 'evt-1',
      payload: {
        postId: 'p1',
        authorId: 'a1',
        createdAt: new Date().toISOString(),
        authorIsCelebrity: false,
      },
    },
    opts: { attempts: 5 },
    attemptsMade: 1,
    ...overrides,
  } as any;
}

describe('FanoutProcessor', () => {
  function build() {
    const timeline: any = {
      fanoutPost: jest.fn().mockResolvedValue({ pushed: 3, celebrity: false }),
    };
    const prisma: any = {
      outboxEvent: { update: jest.fn().mockResolvedValue({}) },
    };
    return { processor: new FanoutProcessor(prisma, timeline), prisma, timeline };
  }

  it('fans out the post and marks the event PROCESSED', async () => {
    const { processor, prisma, timeline } = build();
    await processor.process(job());

    expect(timeline.fanoutPost).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'p1', authorId: 'a1', authorIsCelebrity: false }),
    );
    expect(prisma.outboxEvent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'evt-1' },
        data: expect.objectContaining({ status: 'PROCESSED' }),
      }),
    );
  });

  it('keeps retrying while attempts remain', async () => {
    const { processor, prisma } = build();
    await processor.onFailed(job({ attemptsMade: 2 }), new Error('boom'));
    expect(prisma.outboxEvent.update).not.toHaveBeenCalled();
  });

  it('marks the event FAILED after the final attempt (dead-letter)', async () => {
    const { processor, prisma } = build();
    await processor.onFailed(job({ attemptsMade: 5 }), new Error('boom'));
    expect(prisma.outboxEvent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'evt-1' },
        data: expect.objectContaining({ status: 'FAILED', lastError: 'boom' }),
      }),
    );
  });
});
````

## File: apps/api/src/fanout/fanout.processor.ts
````typescript
import { Logger } from '@nestjs/common';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { TimelineService } from '../timeline/timeline.service';
import { FANOUT_QUEUE } from '../queue/queue.module';
import {
  BOOKING_CANCELLED,
  BOOKING_CONFIRMED,
  POST_CREATED,
  type BookingEventPayload,
  type PostCreatedPayload,
} from '../outbox/outbox.service';

interface FanoutJobData {
  eventId: string;
  payload: PostCreatedPayload | BookingEventPayload;
}

/**
 * Consumes fan-out work off the queue, decoupled from the API request path.
 *
 * Fan-out is idempotent by construction: a timeline is a Redis sorted set keyed
 * by post id, so re-applying the same event is a no-op. That is what makes
 * at-least-once delivery from the queue safe.
 *
 * Retries use exponential backoff (configured on the job). After the final
 * attempt the outbox row is marked FAILED so the failure is durable and
 * inspectable rather than lost in the queue's failed set.
 */
@Processor(FANOUT_QUEUE)
export class FanoutProcessor extends WorkerHost {
  private readonly logger = new Logger(FanoutProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly timeline: TimelineService,
  ) {
    super();
  }

  async process(job: Job<FanoutJobData>): Promise<void> {
    if (job.name === POST_CREATED) {
      const p = job.data.payload as PostCreatedPayload;
      const { pushed, celebrity } = await this.timeline.fanoutPost({
        id: p.postId,
        authorId: p.authorId,
        createdAt: new Date(p.createdAt),
        authorIsCelebrity: p.authorIsCelebrity,
      });
      this.logger.debug(
        `fanned out ${p.postId}: pushed=${pushed} celebrity=${celebrity}`,
      );
    } else if (job.name === BOOKING_CONFIRMED || job.name === BOOKING_CANCELLED) {
      // Booking lifecycle events ride the same outbox -> queue -> worker path as
      // post fan-out. A real deployment fans these into the push/in-app
      // notification pipeline (Feature List Part 3); here the worker is the
      // durable consumer that guarantees delivery is not lost.
      const p = job.data.payload as BookingEventPayload;
      this.logger.debug(
        `consumed ${job.name} for booking ${p.bookingId} (${p.status})`,
      );
    }
    await this.mark(job.data.eventId, 'PROCESSED');
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<FanoutJobData>, err: Error): Promise<void> {
    const maxAttempts = job.opts.attempts ?? 1;
    if (job.attemptsMade >= maxAttempts) {
      this.logger.error(
        `fan-out permanently failed for event ${job.data.eventId}: ${err.message}`,
      );
      await this.mark(job.data.eventId, 'FAILED', err.message);
    }
  }

  private async mark(
    eventId: string,
    status: 'PROCESSED' | 'FAILED',
    lastError?: string,
  ): Promise<void> {
    await this.prisma.outboxEvent
      .update({
        where: { id: eventId },
        data: {
          status,
          processedAt: new Date(),
          ...(lastError ? { lastError } : {}),
        },
      })
      .catch(() => undefined);
  }
}
````

## File: apps/api/src/feed/feed.controller.ts
````typescript
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { FeedService } from './feed.service';

@ApiTags('feed')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller('feed')
export class FeedController {
  constructor(private readonly feed: FeedService) {}

  @Get()
  home(@CurrentUser() user: AuthUser, @Query() query: PaginationQueryDto) {
    return this.feed.getHomeFeed({
      viewerId: user.id,
      cursor: query.cursor,
      limit: query.limit ?? 20,
    });
  }
}
````

## File: apps/api/src/feed/feed.module.ts
````typescript
import { Module } from '@nestjs/common';
import { TimelineModule } from '../timeline/timeline.module';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [TimelineModule, PostsModule, UsersModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
````

## File: apps/api/src/feed/feed.service.ts
````typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { PostsService, PostDto, PostWithAuthor } from '../posts/posts.service';
import { TimelineService, TimelineEntry } from '../timeline/timeline.service';
import { decodeCursor, encodeCursor } from '../common/cursor';
import { Page } from '../common/dto/pagination.dto';

interface Cursor {
  createdAtMs: number;
  id: string;
}

/**
 * Assembles a user's home feed from two sources:
 *   1. the materialized Redis timeline (posts pushed by normal authors), and
 *   2. a read-time pull of the celebrity authors the user follows.
 *
 * The two sets are merged, de-duplicated, and returned newest-first behind an
 * opaque keyset cursor. A cold cache (or a brand-new follow) falls back to a
 * bounded read-time backfill straight from Postgres — slower, but never empty,
 * which is the graceful-degradation story we'd want in production.
 */
@Injectable()
export class FeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly timeline: TimelineService,
    private readonly posts: PostsService,
    private readonly users: UsersService,
  ) {}

  async getHomeFeed(params: {
    viewerId: string;
    cursor?: string;
    limit: number;
  }): Promise<Page<PostDto>> {
    const { viewerId, cursor, limit } = params;
    const decoded = decodeCursor(cursor);
    const cursorObj: Cursor | null = decoded
      ? { createdAtMs: Number(decoded[0]), id: decoded[1] }
      : null;

    const buffer = Math.max(limit * 3, 30);
    const followees = await this.users.followeeIds(viewerId);
    const celebrityFollowees = await this.celebrityFollowees(followees);

    // 1) Pushed timelines (normal authors + the viewer's own posts).
    const pushed = await this.timeline.getPushedEntries(
      viewerId,
      cursorObj
        ? { score: cursorObj.createdAtMs, id: cursorObj.id }
        : null,
      buffer,
    );

    // 2) Read-time pull from celebrity authors (kept bounded — a user follows
    //    only a handful of high-follower accounts).
    const celebEntries: TimelineEntry[] = [];
    for (const celebId of celebrityFollowees) {
      const entries = await this.timeline.getPushedEntries(
        celebId,
        cursorObj ? { score: cursorObj.createdAtMs, id: cursorObj.id } : null,
        Math.min(limit, 10),
      );
      celebEntries.push(...entries);
    }

    const candidateIds = new Set<string>([
      ...pushed.map((e) => e.postId),
      ...celebEntries.map((e) => e.postId),
    ]);

    // Cold start / stale cache: backfill from every followee + self.
    if (!cursorObj && candidateIds.size < limit && followees.length > 0) {
      const backfill = await this.prisma.post.findMany({
        where: { authorId: { in: [...followees, viewerId] } },
        select: { id: true },
        orderBy: { createdAt: 'desc' },
        take: limit * 3,
      });
      for (const row of backfill) candidateIds.add(row.id);
    }

    const hydrated = await this.posts.hydrateIds([...candidateIds]);

    const ordered = hydrated
      .sort(comparePostsDesc)
      .filter((p) => (cursorObj ? isOlderThan(p, cursorObj) : true));

    const hasMore = ordered.length > limit;
    const pageRows = hasMore ? ordered.slice(0, limit) : ordered;
    const items = await this.posts.serializeMany(pageRows, viewerId);

    const last = pageRows[pageRows.length - 1];
    return {
      items,
      nextCursor:
        hasMore && last
          ? encodeCursor([last.createdAt.getTime(), last.id])
          : null,
    };
  }

  private async celebrityFollowees(followeeIds: string[]): Promise<string[]> {
    if (followeeIds.length === 0) return [];
    const rows = await this.prisma.user.findMany({
      where: { id: { in: followeeIds }, isCelebrity: true },
      select: { id: true },
    });
    return rows.map((r) => r.id);
  }
}

function comparePostsDesc(a: PostWithAuthor, b: PostWithAuthor): number {
  const t = b.createdAt.getTime() - a.createdAt.getTime();
  if (t !== 0) return t;
  return b.id < a.id ? -1 : b.id > a.id ? 1 : 0;
}

function isOlderThan(post: PostWithAuthor, cursor: Cursor): boolean {
  const t = post.createdAt.getTime();
  if (t !== cursor.createdAtMs) return t < cursor.createdAtMs;
  return post.id < cursor.id;
}
````

## File: apps/api/src/follow/follow.controller.ts
````typescript
import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { FollowService } from './follow.service';

@ApiTags('follows')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller('users/:id')
export class FollowController {
  constructor(private readonly follow: FollowService) {}

  @Post('follow')
  followUser(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.follow.follow(user.id, id);
  }

  @Delete('follow')
  unfollowUser(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.follow.unfollow(user.id, id);
  }
}
````

## File: apps/api/src/follow/follow.module.ts
````typescript
import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

@Module({
  controllers: [FollowController],
  providers: [FollowService],
  exports: [FollowService],
})
export class FollowModule {}
````

## File: apps/api/src/follow/follow.service.ts
````typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { AppConfig } from '../config/configuration';

@Injectable()
export class FollowService {
  private readonly threshold: number;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService<AppConfig, true>,
  ) {
    this.threshold = config.get('celebrityFollowerThreshold', { infer: true });
  }

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }
    const target = await this.prisma.user.findUnique({
      where: { id: followingId },
      select: { id: true },
    });
    if (!target) throw new BadRequestException('User not found');

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.follow.create({ data: { followerId, followingId } });
        await tx.user.update({
          where: { id: followingId },
          data: { followerCount: { increment: 1 } },
        });
        await tx.user.update({
          where: { id: followerId },
          data: { followingCount: { increment: 1 } },
        });
      });
    } catch (err) {
      // P2002 = already following. Idempotent: fall through and report state.
      if (
        !(err instanceof Prisma.PrismaClientKnownRequestError) ||
        err.code !== 'P2002'
      ) {
        throw err;
      }
    }

    await this.recomputeCelebrity(followingId);
    const count = await this.prisma.user.findUniqueOrThrow({
      where: { id: followingId },
      select: { followerCount: true, isCelebrity: true },
    });
    return { following: true, ...count };
  }

  async unfollow(followerId: string, followingId: string) {
    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    if (existing) {
      await this.prisma.$transaction(async (tx) => {
        await tx.follow.delete({
          where: { followerId_followingId: { followerId, followingId } },
        });
        await tx.user.update({
          where: { id: followingId },
          data: { followerCount: { decrement: 1 } },
        });
        await tx.user.update({
          where: { id: followerId },
          data: { followingCount: { decrement: 1 } },
        });
      });
      await this.recomputeCelebrity(followingId);
    }
    const count = await this.prisma.user.findUniqueOrThrow({
      where: { id: followingId },
      select: { followerCount: true, isCelebrity: true },
    });
    return { following: false, ...count };
  }

  /**
   * Keeps the derived `isCelebrity` flag in sync with the follower count.
   * When an author crosses the threshold their posts stop being fanned out on
   * write and start being pulled at read time (hybrid fan-out).
   */
  private async recomputeCelebrity(userId: string): Promise<void> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { followerCount: true, isCelebrity: true },
    });
    const shouldBeCelebrity = user.followerCount >= this.threshold;
    if (shouldBeCelebrity !== user.isCelebrity) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { isCelebrity: shouldBeCelebrity },
      });
    }
  }
}
````

## File: apps/api/src/health/health.controller.ts
````typescript
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  async check() {
    const [db, redis] = await Promise.allSettled([
      this.prisma.$queryRaw`SELECT 1`,
      this.redis.client.ping(),
    ]);
    return {
      status: db.status === 'fulfilled' && redis.status === 'fulfilled' ? 'ok' : 'degraded',
      db: db.status === 'fulfilled' ? 'up' : 'down',
      redis: redis.status === 'fulfilled' ? 'up' : 'down',
      timestamp: new Date().toISOString(),
    };
  }
}
````

## File: apps/api/src/health/health.module.ts
````typescript
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
````

## File: apps/api/src/metrics/metrics.controller.ts
````typescript
import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { FANOUT_QUEUE } from '../queue/queue.module';
import { MetricsService } from './metrics.service';

/**
 * Prometheus exposition endpoint. Combines per-request/domain metrics from the
 * prom-client registry with gauges read from Postgres (outbox state, live
 * reservations) and BullMQ (queue depth) at scrape time.
 *
 * The two numbers that matter operationally remain **outbox lag** (age of the
 * oldest unprocessed event) and **queue depth**; if either climbs, the fan-out
 * workers are not keeping up.
 */
@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  constructor(
    @InjectQueue(FANOUT_QUEUE) private readonly queue: Queue,
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  @Get()
  @Header('content-type', 'text/plain; version=0.0.4; charset=utf-8')
  async scrape(): Promise<string> {
    const [counts, grouped, oldest, activeReservations, expiredHolds] =
      await Promise.all([
        this.queue.getJobCounts('wait', 'active', 'completed', 'failed', 'delayed'),
        this.prisma.outboxEvent.groupBy({
          by: ['status'],
          _count: { _all: true },
        }),
        this.prisma.outboxEvent.findFirst({
          where: { status: 'PENDING' },
          orderBy: { createdAt: 'asc' },
          select: { createdAt: true },
        }),
        this.prisma.booking.count({
          where: { status: { in: ['HELD', 'PENDING', 'CONFIRMED'] } },
        }),
        this.prisma.booking.count({
          where: { status: 'HELD', holdExpiresAt: { lt: new Date() } },
        }),
      ]);

    const outbox: Record<string, number> = {
      PENDING: 0,
      RELAYED: 0,
      PROCESSED: 0,
      FAILED: 0,
    };
    for (const row of grouped) outbox[row.status] = row._count._all;
    for (const [status, value] of Object.entries(outbox)) {
      this.metrics.outboxEvents.set({ status: status.toLowerCase() }, value);
    }

    const lagSeconds = oldest
      ? Math.max(0, (Date.now() - oldest.createdAt.getTime()) / 1000)
      : 0;
    this.metrics.outboxOldestPendingSeconds.set(lagSeconds);

    for (const [state, value] of Object.entries(counts)) {
      this.metrics.fanoutQueueJobs.set({ state }, value ?? 0);
    }
    this.metrics.activeReservations.set(activeReservations);
    this.metrics.expiredHoldsPending.set(expiredHolds);

    return this.metrics.metrics();
  }
}
````

## File: apps/api/src/metrics/metrics.module.ts
````typescript
import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { MetricsInterceptor } from './metrics.interceptor';

@Global()
@Module({
  controllers: [MetricsController],
  providers: [
    MetricsService,
    { provide: APP_INTERCEPTOR, useClass: MetricsInterceptor },
  ],
  exports: [MetricsService],
})
export class MetricsModule {}
````

## File: apps/api/src/outbox/outbox.module.ts
````typescript
import { Module } from '@nestjs/common';
import { OutboxService } from './outbox.service';

@Module({
  providers: [OutboxService],
  exports: [OutboxService],
})
export class OutboxModule {}
````

## File: apps/api/src/outbox/outbox.service.spec.ts
````typescript
import { OutboxService, POST_CREATED } from './outbox.service';

describe('OutboxService', () => {
  function build() {
    const rows = [
      { id: 'evt-1', type: POST_CREATED, payload: { postId: 'p1' } },
      { id: 'evt-2', type: POST_CREATED, payload: { postId: 'p2' } },
    ];
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue(rows),
      outboxEvent: { update: jest.fn().mockResolvedValue({}) },
    };
    const prisma: any = {
      $transaction: jest.fn(async (cb: (t: unknown) => unknown) => cb(tx)),
      outboxEvent: { create: jest.fn().mockResolvedValue({}) },
    };
    const queue: any = { add: jest.fn().mockResolvedValue({}) };
    const config: any = {
      get: jest.fn((key: string) =>
        key === 'outboxRelayIntervalMs' ? 500 : 200,
      ),
    };
    return { service: new OutboxService(prisma, queue, config), prisma, queue, tx };
  }

  it('emits an event through the caller transaction', async () => {
    const { service, prisma, tx } = build();
    const fakeTx = { outboxEvent: { create: jest.fn() } } as any;
    await service.emit(fakeTx, POST_CREATED, { postId: 'p1' } as any);
    expect(fakeTx.outboxEvent.create).toHaveBeenCalledWith({
      data: { type: POST_CREATED, payload: { postId: 'p1' } },
    });
    expect(prisma.outboxEvent.create).not.toHaveBeenCalled();
    expect(tx.outboxEvent.update).not.toHaveBeenCalled();
  });

  it('relays pending rows with a per-event jobId for dedupe', async () => {
    const { service, queue, tx } = build();
    const count = await service.relayOnce();

    expect(count).toBe(2);
    expect(queue.add).toHaveBeenCalledTimes(2);
    expect(queue.add).toHaveBeenCalledWith(
      POST_CREATED,
      { eventId: 'evt-1', payload: { postId: 'p1' } },
      expect.objectContaining({
        jobId: 'evt-1',
        attempts: 5,
        backoff: { type: 'exponential', delay: 1000 },
      }),
    );
    expect(tx.outboxEvent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'evt-1' },
        data: expect.objectContaining({ status: 'RELAYED' }),
      }),
    );
  });

  it('does not overlap relay runs', async () => {
    const { service, queue } = build();
    const [a] = await Promise.all([service.relayOnce(), service.relayOnce()]);
    // The second concurrent call is rejected by the re-entrancy guard.
    expect(queue.add).toHaveBeenCalledTimes(2);
    expect(a).toBe(2);
  });
});
````

## File: apps/api/src/outbox/outbox.service.ts
````typescript
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FANOUT_QUEUE } from '../queue/queue.module';
import type { AppConfig } from '../config/configuration';

export const POST_CREATED = 'post.created';
export const BOOKING_CONFIRMED = 'booking.confirmed';
export const BOOKING_CANCELLED = 'booking.cancelled';

export interface PostCreatedPayload {
  postId: string;
  authorId: string;
  createdAt: string;
  authorIsCelebrity: boolean;
}

export interface BookingEventPayload {
  bookingId: string;
  practitionerId: string;
  memberId: string;
  sessionTypeId: string;
  startTime: string;
  endTime: string;
  status: string;
  rescheduled?: boolean;
  reason?: string | null;
  withinNoticeWindow?: boolean;
}

interface PendingRow {
  id: string;
  type: string;
  payload: unknown;
}

/**
 * Transactional outbox: the write side of the async fan-out pipeline.
 *
 * `emit` is called *inside* the same transaction as the domain change, so the
 * event and the change commit or roll back together. A relay loop then claims
 * pending rows and publishes them to the work queue. This is what lets us decouple
 * the post write (fast, bounded) from fan-out (slow, unbounded in follower count)
 * without ever losing or double-publishing work across a crash.
 */
@Injectable()
export class OutboxService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxService.name);
  private readonly intervalMs: number;
  private readonly batchSize: number;
  private timer?: NodeJS.Timeout;
  private relaying = false;

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(FANOUT_QUEUE) private readonly queue: Queue,
    config: ConfigService<AppConfig, true>,
  ) {
    this.intervalMs = config.get('outboxRelayIntervalMs', { infer: true });
    this.batchSize = config.get('outboxRelayBatchSize', { infer: true });
  }

  /** Enqueue an outbox event as part of a caller's transaction. */
  async emit(
    tx: Prisma.TransactionClient,
    type: string,
    payload: Prisma.InputJsonValue,
  ): Promise<void> {
    await tx.outboxEvent.create({ data: { type, payload } });
  }

  onModuleInit(): void {
    this.timer = setInterval(() => void this.relayOnce(), this.intervalMs);
    this.timer.unref?.();
    this.logger.log(`Outbox relay started (every ${this.intervalMs}ms)`);
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  /**
   * Claims a batch of pending events and publishes them. `FOR UPDATE SKIP
   * LOCKED` lets several API instances relay the same table concurrently with no
   * coordination: each row is claimed by exactly one relay for the duration of
   * its transaction. `jobId = eventId` makes publishing idempotent — a crash
   * between commit and publish just re-relays, and BullMQ drops the duplicate.
   */
  async relayOnce(): Promise<number> {
    if (this.relaying) return 0;
    this.relaying = true;
    try {
      return await this.prisma.$transaction(async (tx) => {
        const rows = await tx.$queryRaw<PendingRow[]>`
          SELECT id, type, payload
          FROM "OutboxEvent"
          WHERE status = 'PENDING'::"OutboxStatus"
            AND "availableAt" <= now()
          ORDER BY "createdAt" ASC
          LIMIT ${this.batchSize}
          FOR UPDATE SKIP LOCKED
        `;

        for (const row of rows) {
          await this.queue.add(
            row.type,
            { eventId: row.id, payload: row.payload },
            {
              jobId: row.id, // dedupe key: same event -> same job
              attempts: 5,
              backoff: { type: 'exponential', delay: 1000 },
              removeOnComplete: { count: 1000 },
              removeOnFail: false, // keep failures for inspection / replay
            },
          );
          await tx.outboxEvent.update({
            where: { id: row.id },
            data: {
              status: 'RELAYED',
              relayedAt: new Date(),
              attempts: { increment: 1 },
            },
          });
        }
        return rows.length;
      });
    } catch (err) {
      this.logger.error(`Outbox relay failed: ${(err as Error).message}`);
      return 0;
    } finally {
      this.relaying = false;
    }
  }
}
````

## File: apps/api/src/posts/dto/post.dto.ts
````typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ maxLength: 500, example: 'Sleep and cortisol — what actually moves the needle?' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  body!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  mediaUrl?: string;
}

export class CreateCommentDto {
  @ApiProperty({ maxLength: 300 })
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  body!: string;
}
````

## File: apps/api/src/posts/author-posts.controller.ts
````typescript
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller('users/:userId/posts')
export class AuthorPostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Param('userId') authorId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.posts.listByAuthor({
      authorId,
      viewerId: user.id,
      cursor: query.cursor,
      limit: query.limit ?? 20,
    });
  }
}
````

## File: apps/api/src/posts/posts.controller.ts
````typescript
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { PostsService } from './posts.service';
import { CreateCommentDto, CreatePostDto } from './dto/post.dto';

@ApiTags('posts')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePostDto) {
    return this.posts.create({
      authorId: user.id,
      body: dto.body,
      mediaUrl: dto.mediaUrl,
    });
  }

  @Get(':id')
  get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.posts.getPost(id, user.id);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    await this.posts.remove(id, user.id);
    return { deleted: true };
  }

  @Post(':id/like')
  like(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.posts.like(id, user.id);
  }

  @Delete(':id/like')
  unlike(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.posts.unlike(id, user.id);
  }

  @Get(':id/comments')
  comments(@Param('id') id: string) {
    return this.posts.listComments(id);
  }

  @Post(':id/comments')
  addComment(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.posts.addComment({ postId: id, authorId: user.id, body: dto.body });
  }
}
````

## File: apps/api/src/prisma/prisma.module.ts
````typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
````

## File: apps/api/src/prisma/prisma.service.ts
````typescript
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Connected to PostgreSQL');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
````

## File: apps/api/src/queue/queue.module.ts
````typescript
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import type { AppConfig } from '../config/configuration';
import { bullConnectionFromUrl } from './redis-connection';

export const FANOUT_QUEUE = 'fanout';

/**
 * Registers the BullMQ root connection and the fan-out queue once, globally, so
 * both the outbox relay (producer) and the fan-out worker (consumer) share a
 * single queue definition.
 */
@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>) => ({
        connection: bullConnectionFromUrl(config.get('redisUrl', { infer: true })),
      }),
    }),
    BullModule.registerQueue({ name: FANOUT_QUEUE }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
````

## File: apps/api/src/queue/redis-connection.ts
````typescript
import type { ConnectionOptions } from 'bullmq';

/**
 * BullMQ manages its own Redis connections. It needs `maxRetriesPerRequest:
 * null` (its blocking commands must not time out) and explicit host/port rather
 * than a url string.
 */
export function bullConnectionFromUrl(url: string): ConnectionOptions {
  const parsed = new URL(url);
  const db =
    parsed.pathname && parsed.pathname.length > 1
      ? Number(parsed.pathname.slice(1))
      : undefined;
  return {
    host: parsed.hostname,
    port: Number(parsed.port || 6379),
    username: parsed.username || undefined,
    password: parsed.password || undefined,
    db,
    maxRetriesPerRequest: null,
  };
}
````

## File: apps/api/src/realtime/realtime.module.ts
````typescript
import { Global, Module } from '@nestjs/common';
import { RealtimeService } from './realtime.service';

@Global()
@Module({
  providers: [RealtimeService],
  exports: [RealtimeService],
})
export class RealtimeModule {}
````

## File: apps/api/src/realtime/realtime.service.ts
````typescript
import { Injectable } from '@nestjs/common';
import type { Server } from 'socket.io';
import { RedisService } from '../redis/redis.service';

const PRESENCE_TTL_SECONDS = 60;

/**
 * Holds the Socket.IO server reference so that both the gateway and ordinary
 * services (e.g. ChatService, called from a REST handler) can push events
 * without a circular dependency on the gateway.
 *
 * Presence is heartbeat-based: a Redis key with a TTL, refreshed on each
 * heartbeat. A dropped connection simply lets the key expire — no explicit
 * disconnect bookkeeping required, which is what makes presence robust to
 * crashes and network partitions.
 */
@Injectable()
export class RealtimeService {
  private server: Server | null = null;

  constructor(private readonly redis: RedisService) {}

  setServer(server: Server): void {
    this.server = server;
  }

  emitToConversation(conversationId: string, event: string, payload: unknown): void {
    this.server?.to(`conversation:${conversationId}`).emit(event, payload);
  }

  emitToUser(userId: string, event: string, payload: unknown): void {
    this.server?.to(`user:${userId}`).emit(event, payload);
  }

  emitToUsers(userIds: string[], event: string, payload: unknown): void {
    if (userIds.length === 0) return;
    this.server?.to(userIds.map((id) => `user:${id}`)).emit(event, payload);
  }

  async markOnline(userId: string): Promise<void> {
    await this.redis.client.set(`presence:${userId}`, '1', 'EX', PRESENCE_TTL_SECONDS);
  }

  async markOffline(userId: string): Promise<void> {
    await this.redis.client.del(`presence:${userId}`);
  }

  async isOnline(userId: string): Promise<boolean> {
    return (await this.redis.client.exists(`presence:${userId}`)) === 1;
  }
}
````

## File: apps/api/src/redis/redis.module.ts
````typescript
import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
````

## File: apps/api/src/redis/redis.service.ts
````typescript
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import type { AppConfig } from '../config/configuration';

/**
 * Thin wrapper around two ioredis connections:
 *  - `client`     : general command connection (ZSETs, presence, counters).
 *  - `subscriber` : dedicated connection, because a subscribed Redis connection
 *                   cannot issue normal commands.
 *
 * Redis holds only *derived* state here — materialized home timelines and
 * presence keys. Everything can be rebuilt from Postgres, which is why a cold
 * cache is a non-event rather than a data-loss incident.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  public readonly client: Redis;
  public readonly subscriber: Redis;
  public readonly publisher: Redis;

  constructor(private readonly config: ConfigService<AppConfig, true>) {
    const url = this.config.get('redisUrl', { infer: true });
    const opts = { lazyConnect: false, maxRetriesPerRequest: null };
    this.client = new Redis(url, opts);
    this.subscriber = new Redis(url, opts);
    this.publisher = new Redis(url, opts);
    for (const [name, conn] of Object.entries({
      client: this.client,
      subscriber: this.subscriber,
      publisher: this.publisher,
    })) {
      conn.on('error', (err) =>
        this.logger.warn(`Redis(${name}) error: ${err.message}`),
      );
    }
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.client.ping();
      this.logger.log('Connected to Redis');
    } catch (err) {
      this.logger.error(`Redis not reachable: ${(err as Error).message}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.allSettled([
      this.client.quit(),
      this.subscriber.quit(),
      this.publisher.quit(),
    ]);
  }
}
````

## File: apps/api/src/timeline/timeline.module.ts
````typescript
import { Module } from '@nestjs/common';
import { TimelineService } from './timeline.service';

@Module({
  providers: [TimelineService],
  exports: [TimelineService],
})
export class TimelineModule {}
````

## File: apps/api/src/timeline/timeline.service.ts
````typescript
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import type { AppConfig } from '../config/configuration';

export interface PostCreated {
  id: string;
  authorId: string;
  createdAt: Date;
  authorIsCelebrity: boolean;
}

export interface TimelineEntry {
  postId: string;
  score: number;
}

/**
 * Owns the materialized timeline layer in Redis.
 *
 * Home timelines are Redis sorted sets keyed `timeline:{userId}`, scored by the
 * post's creation epoch-ms. Each entry is a bare *pointer* (post id), never a
 * copy of the post body — edit/delete and counter changes then don't require
 * rewriting millions of timelines. Post content is hydrated at read time.
 *
 * Fan-out is hybrid:
 *   - normal authors  -> pushed into every follower's timeline on write (O(1) reads)
 *   - celebrity authors -> skipped, their own outbox is pulled at read time
 * This keeps the read path cheap without letting a single high-follower
 * practitioner turn one post into millions of writes.
 */
@Injectable()
export class TimelineService {
  private readonly logger = new Logger(TimelineService.name);
  private readonly maxLength: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    config: ConfigService<AppConfig, true>,
  ) {
    this.maxLength = config.get('timelineMaxLength', { infer: true });
  }

  private key(userId: string): string {
    return `timeline:${userId}`;
  }

  /**
   * Called after a post row is committed. Fans the post out to followers unless
   * the author is over the celebrity threshold. Symmetric multi-writer
   * token-bucket: pipelined ZADD + trim in one round trip.
   */
  async fanoutPost(post: PostCreated): Promise<{ pushed: number; celebrity: boolean }> {
    const score = post.createdAt.getTime();

    // The author's own outbox is always materialized: it backs profile views
    // and the read-time pull for celebrity authors.
    const pipeline = this.redis.client.pipeline();
    pipeline.zadd(this.key(post.authorId), score, post.id);
    pipeline.zremrangebyrank(this.key(post.authorId), 0, -(this.maxLength + 1));

    if (post.authorIsCelebrity) {
      await pipeline.exec();
      this.logger.debug(`Skipped fan-out for celebrity ${post.authorId}`);
      return { pushed: 0, celebrity: true };
    }

    const followers = await this.prisma.follow.findMany({
      where: { followingId: post.authorId },
      select: { followerId: true },
    });

    for (const { followerId } of followers) {
      pipeline.zadd(this.key(followerId), score, post.id);
      pipeline.zremrangebyrank(this.key(followerId), 0, -(this.maxLength + 1));
    }
    await pipeline.exec();

    return { pushed: followers.length, celebrity: false };
  }

  /**
   * Reads pushed timeline entries strictly older than the cursor.
   * Returns newest-first.
   */
  async getPushedEntries(
    userId: string,
    cursor: { score: number; id: string } | null,
    take: number,
  ): Promise<TimelineEntry[]> {
    const max = cursor ? cursor.score : '+inf';
    const raw = (await this.redis.client.zrevrangebyscore(
      this.key(userId),
      max,
      '-inf',
      'WITHSCORES',
      'LIMIT',
      0,
      take,
    )) as string[];

    const entries: TimelineEntry[] = [];
    for (let i = 0; i < raw.length; i += 2) {
      entries.push({ postId: raw[i], score: Number(raw[i + 1]) });
    }
    // Keyset tie-break: at the exact cursor score, drop ids that aren't
    // strictly less than the cursor id (lexicographic, matching member order).
    if (cursor) {
      return entries.filter(
        (e) => e.score < cursor.score || (e.score === cursor.score && e.postId < cursor.id),
      );
    }
    return entries;
  }

  async clearTimeline(userId: string): Promise<void> {
    await this.redis.client.del(this.key(userId));
  }
}
````

## File: apps/api/src/users/session.controller.ts
````typescript
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Demo-only identity bootstrap. Onboarding and signup are out of scope, so the
 * frontend needs a way to discover the pre-registered users to act as. This is
 * intentionally the only unauthenticated data endpoint; a real deployment would
 * replace it with a proper login flow.
 */
@ApiTags('session')
@Controller('session')
export class SessionController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('identities')
  @ApiOperation({ summary: 'List pre-registered identities for the demo switcher' })
  async identities() {
    return this.prisma.user.findMany({
      orderBy: [{ createdAt: 'asc' }],
      take: 100,
      select: {
        id: true,
        handle: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        headline: true,
        region: true,
        isCelebrity: true,
      },
    });
  }
}
````

## File: apps/api/src/users/users.controller.ts
````typescript
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { UsersService } from './users.service';

export class UserSearchQueryDto extends PaginationQueryDto {
  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsEnum(Role) role?: Role;
}

@ApiTags('users')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.users.getProfile(user.id, user.id);
  }

  @Get()
  search(@CurrentUser() user: AuthUser, @Query() query: UserSearchQueryDto) {
    return this.users.search({
      viewerId: user.id,
      q: query.q,
      role: query.role,
      cursor: query.cursor,
      limit: query.limit ?? 20,
    });
  }

  @Get(':id')
  profile(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.users.getProfile(id, user.id);
  }
}
````

## File: apps/api/src/users/users.module.ts
````typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { SessionController } from './session.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController, SessionController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
````

## File: apps/api/src/users/users.service.ts
````typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { decodeCursor, encodeCursor } from '../common/cursor';
import { Page } from '../common/dto/pagination.dto';

export interface UserSummary {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  role: Role;
  headline: string | null;
  region: string | null;
  isCelebrity: boolean;
  online?: boolean;
}

export interface UserProfile extends UserSummary {
  bio: string | null;
  verified: boolean;
  followerCount: number;
  followingCount: number;
  postCount: number;
  isFollowing: boolean;
  isSelf: boolean;
}

const SUMMARY_SELECT = {
  id: true,
  handle: true,
  displayName: true,
  avatarUrl: true,
  role: true,
  headline: true,
  region: true,
  isCelebrity: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async search(params: {
    viewerId: string;
    q?: string;
    role?: Role;
    cursor?: string;
    limit: number;
  }): Promise<Page<UserSummary & { isFollowing: boolean }>> {
    const { viewerId, q, role, cursor, limit } = params;
    const decoded = decodeCursor(cursor);

    // Keyset pagination over (followerCount DESC, id ASC).
    const keyset: Prisma.UserWhereInput | undefined = decoded
      ? {
          OR: [
            { followerCount: { lt: Number(decoded[0]) } },
            {
              followerCount: Number(decoded[0]),
              id: { gt: decoded[1] },
            },
          ],
        }
      : undefined;

    const where: Prisma.UserWhereInput = {
      ...(role ? { role } : {}),
      ...(q
        ? {
            OR: [
              { handle: { contains: q, mode: 'insensitive' } },
              { displayName: { contains: q, mode: 'insensitive' } },
              { headline: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(keyset ? { AND: [keyset] } : {}),
    };

    const rows = await this.prisma.user.findMany({
      where,
      select: { ...SUMMARY_SELECT, followerCount: true },
      orderBy: [{ followerCount: 'desc' }, { id: 'asc' }],
      take: limit + 1,
    });

    const following = await this.followingSet(
      viewerId,
      rows.map((r) => r.id),
    );
    const presence = await this.presenceMap(rows.map((r) => r.id));

    const hasMore = rows.length > limit;
    const items = (hasMore ? rows.slice(0, limit) : rows).map((r) => ({
      id: r.id,
      handle: r.handle,
      displayName: r.displayName,
      avatarUrl: r.avatarUrl,
      role: r.role,
      headline: r.headline,
      region: r.region,
      isCelebrity: r.isCelebrity,
      online: presence.get(r.id) ?? false,
      isFollowing: following.has(r.id),
    }));

    return {
      items,
      nextCursor: hasMore
        ? encodeCursor([rows[limit - 1].followerCount, rows[limit - 1].id])
        : null,
    };
  }

  async getProfile(id: string, viewerId: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...SUMMARY_SELECT,
        bio: true,
        verified: true,
        followerCount: true,
        followingCount: true,
        _count: { select: { posts: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const [following, presence] = await Promise.all([
      this.followingSet(viewerId, [id]),
      this.presenceMap([id]),
    ]);

    return {
      id: user.id,
      handle: user.handle,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      headline: user.headline,
      region: user.region,
      isCelebrity: user.isCelebrity,
      bio: user.bio,
      verified: user.verified,
      followerCount: user.followerCount,
      followingCount: user.followingCount,
      postCount: user._count.posts,
      isFollowing: following.has(id),
      isSelf: viewerId === id,
      online: presence.get(id) ?? false,
    };
  }

  async followingSet(
    viewerId: string,
    ids: string[],
  ): Promise<Set<string>> {
    if (ids.length === 0) return new Set();
    const rows = await this.prisma.follow.findMany({
      where: { followerId: viewerId, followingId: { in: ids } },
      select: { followingId: true },
    });
    return new Set(rows.map((r) => r.followingId));
  }

  async presenceMap(ids: string[]): Promise<Map<string, boolean>> {
    if (ids.length === 0) return new Map();
    const keys = ids.map((id) => `presence:${id}`);
    const values = await this.redis.client.mget(...keys);
    const map = new Map<string, boolean>();
    ids.forEach((id, i) => map.set(id, values[i] !== null));
    return map;
  }

  /** Ids of everyone `userId` follows. */
  async followeeIds(userId: string): Promise<string[]> {
    const rows = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    return rows.map((r) => r.followingId);
  }
}
````

## File: apps/api/src/main.ts
````typescript
import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import type { AppConfig } from './config/configuration';

async function bootstrap(): Promise<void> {
  const adapter = new FastifyAdapter({ logger: false });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    { bufferLogs: true },
  );

  app.setGlobalPrefix('api');
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Tangerine API')
    .setDescription(
      'Feed + chat backend. Mock auth via the x-user-id header (identity is assumed pre-registered).',
    )
    .setVersion('0.1.0')
    .addApiKey(
      { type: 'apiKey', name: 'x-user-id', in: 'header' },
      'x-user-id',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const cfg = app.get(ConfigService<AppConfig, true>);
  const port = cfg.get('port', { infer: true });
  await app.listen(port, '0.0.0.0');

  const logger = new Logger('Bootstrap');
  logger.log(`API listening on http://localhost:${port}/api`);
  logger.log(`Swagger docs at http://localhost:${port}/docs`);
}

void bootstrap();
````

## File: apps/api/test/jest-e2e.json
````json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
````

## File: apps/api/nest-cli.json
````json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
````

## File: apps/api/tsconfig.json
````json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2023",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules", "dist", "prisma", "test", "performance"]
}
````

## File: apps/web/src/components/Avatar.tsx
````typescript
import { initials } from '../lib/format';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: number;
}

export function Avatar({ name, src, size = 40 }: AvatarProps) {
  const style = { width: size, height: size };
  if (src) {
    return <img className="avatar" style={style} src={src} alt={name} />;
  }
  return (
    <div className="avatar avatar-fallback" style={style} aria-hidden>
      {initials(name)}
    </div>
  );
}
````

## File: apps/web/src/components/Chat.tsx
````typescript
import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../app-context';
import { relativeTime } from '../lib/format';
import type { Conversation, Message } from '../lib/types';
import { Avatar } from './Avatar';
import { MessageThread } from './MessageThread';

export function Chat({
  activeConversationId,
  onActiveConversationChange,
}: {
  activeConversationId: string | null;
  onActiveConversationChange: (id: string | null) => void;
}) {
  const { api, me, users, socket, toast, startChatWith } = useApp();
  const [conversations, setConversations] = useState<Conversation[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await api.getConversations();
        if (!cancelled) setConversations(list);
      } catch (err) {
        if (!cancelled) {
          toast(err instanceof Error ? err.message : 'Could not load conversations');
          setConversations([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api, toast]);

  // Keep the conversation list fresh from realtime events.
  useEffect(() => {
    function onNew(message: Message) {
      setConversations((prev) => {
        if (!prev) return prev;
        const isActive = message.conversationId === activeConversationId;
        return prev
          .map((c) =>
            c.id === message.conversationId
              ? {
                  ...c,
                  lastMessage: {
                    body: message.body,
                    senderId: message.senderId,
                    createdAt: message.createdAt,
                  },
                  lastMessageAt: message.createdAt,
                  unreadCount:
                    isActive || message.senderId === me.id ? c.unreadCount : c.unreadCount + 1,
                }
              : c,
          )
          .sort(
            (a, b) =>
              new Date(b.lastMessageAt ?? 0).getTime() -
              new Date(a.lastMessageAt ?? 0).getTime(),
          );
      });
    }
    function onPresence(payload: { userId: string; online: boolean }) {
      setConversations((prev) =>
        (prev ?? []).map((c) => ({
          ...c,
          members: c.members.map((m) =>
            m.id === payload.userId ? { ...m, online: payload.online } : m,
          ),
        })),
      );
    }
    socket.on('message:new', onNew);
    socket.on('presence:update', onPresence);
    return () => {
      socket.off('message:new', onNew);
      socket.off('presence:update', onPresence);
    };
  }, [activeConversationId, me.id, socket]);

  const active = useMemo(
    () => conversations?.find((c) => c.id === activeConversationId) ?? null,
    [conversations, activeConversationId],
  );

  const others = users.filter((u) => u.id !== me.id).slice(0, 100);

  function select(id: string) {
    onActiveConversationChange(id);
    setConversations((prev) =>
      (prev ?? []).map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    );
  }

  return (
    <div className={`chat ${active ? 'thread-open' : ''}`}>
      <div className="conv-col">
        <div className="col-head">
          <span>Messages</span>
          <select
            className="select"
            style={{ maxWidth: 150, padding: '5px 8px' }}
            value=""
            onChange={(e) => {
              if (e.target.value) startChatWith(e.target.value);
            }}
            aria-label="Start a new conversation"
          >
            <option value="">New message…</option>
            {others.map((u) => (
              <option key={u.id} value={u.id}>
                {u.displayName}
              </option>
            ))}
          </select>
        </div>
        <div className="conv-scroll">
          {conversations === null ? (
            <div className="hint" style={{ padding: 16 }}>
              Loading…
            </div>
          ) : conversations.length === 0 ? (
            <div className="empty">No conversations yet. Start one with “New message”.</div>
          ) : (
            conversations.map((c) => {
              const other = c.members.find((m) => m.id !== me.id);
              return (
                <button
                  key={c.id}
                  className={`conv-item ${c.id === activeConversationId ? 'active' : ''}`}
                  onClick={() => select(c.id)}
                >
                  <Avatar name={c.title ?? 'Chat'} src={other?.avatarUrl} size={40} />
                  <div className="conv-info">
                    <div className="top">
                      <span className="name">{c.title ?? 'Conversation'}</span>
                      <span className="time">
                        {c.lastMessageAt ? relativeTime(c.lastMessageAt) : ''}
                      </span>
                    </div>
                    <div className="preview">
                      {c.lastMessage
                        ? `${c.lastMessage.senderId === me.id ? 'You: ' : ''}${c.lastMessage.body}`
                        : 'No messages yet'}
                    </div>
                  </div>
                  {c.unreadCount > 0 ? <span className="unread">{c.unreadCount}</span> : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      {active ? (
        <MessageThread conversation={active} onBack={() => onActiveConversationChange(null)} />
      ) : (
        <section className="thread-col center-col">
          <div className="empty">Select a conversation to start messaging.</div>
        </section>
      )}
    </div>
  );
}
````

## File: apps/web/src/components/Composer.tsx
````typescript
import { useState } from 'react';
import { useApp } from '../app-context';
import type { Post } from '../lib/types';

export function Composer({ onPosted }: { onPosted: (post: Post) => void }) {
  const { api, toast } = useApp();
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    const text = body.trim();
    if (!text || busy) return;
    setBusy(true);
    try {
      const post = await api.createPost(text);
      onPosted(post);
      setBody('');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not post');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card composer">
      <textarea
        aria-label="Write a post"
        placeholder="Share something with the community…"
        value={body}
        maxLength={500}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') void submit();
        }}
      />
      <div className="composer-row">
        <span className="hint">{body.length}/500 · ⌘↵ to post</span>
        <button
          className="btn btn-primary"
          disabled={!body.trim() || busy}
          onClick={() => void submit()}
        >
          {busy ? 'Posting…' : 'Post'}
        </button>
      </div>
    </div>
  );
}
````

## File: apps/web/src/components/Feed.tsx
````typescript
import { useCallback, useEffect, useState } from 'react';
import { useApp } from '../app-context';
import type { Post } from '../lib/types';
import { Composer } from './Composer';
import { PostCard } from './PostCard';
import { SuggestedPractitioners } from './SuggestedPractitioners';

export function Feed() {
  const { api, toast } = useApp();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(async () => {
    try {
      const page = await api.getFeed();
      setPosts(page.items);
      setNextCursor(page.nextCursor);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not load feed');
      setPosts([]);
    }
  }, [api, toast]);

  useEffect(() => {
    setPosts(null);
    void load();
  }, [load]);

  async function loadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await api.getFeed(nextCursor);
      setPosts((prev) => [...(prev ?? []), ...page.items]);
      setNextCursor(page.nextCursor);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not load more');
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="layout">
      <div className="stream">
        <Composer onPosted={(post) => setPosts((prev) => [post, ...(prev ?? [])])} />

        {posts === null ? (
          <div className="card center-col" style={{ padding: 40 }}>
            <div className="spinner" />
          </div>
        ) : posts.length === 0 ? (
          <div className="card empty">
            Your feed is empty. Follow some practitioners or write the first post.
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}

        {nextCursor ? (
          <button
            className="btn"
            style={{ alignSelf: 'center' }}
            disabled={loadingMore}
            onClick={() => void loadMore()}
          >
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        ) : null}
      </div>

      <aside className="rail">
        <SuggestedPractitioners />
      </aside>
    </div>
  );
}
````

## File: apps/web/src/components/MessageThread.tsx
````typescript
import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../app-context';
import { formatClock } from '../lib/format';
import type { Conversation, Message } from '../lib/types';
import { Avatar } from './Avatar';

const PENDING_SEQ = Number.MAX_SAFE_INTEGER;

function sortMessages(list: Message[]): Message[] {
  return [...list].sort((a, b) => a.seq - b.seq);
}

export function MessageThread({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  const { api, me, socket, toast } = useApp();
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastTypingEmit = useRef(0);
  const typingTimer = useRef<number | null>(null);

  const others = useMemo(
    () => conversation.members.filter((m) => m.id !== me.id),
    [conversation.members, me.id],
  );

  const peerName = (senderId: string) =>
    conversation.members.find((m) => m.id === senderId)?.displayName ??
    (senderId === me.id ? 'You' : 'Someone');

  // Load history + join the room.
  useEffect(() => {
    let cancelled = false;
    setMessages(null);
    setDraft('');
    socket.emit('conversation:join', { conversationId: conversation.id });
    (async () => {
      try {
        const page = await api.getMessages(conversation.id);
        if (cancelled) return;
        setMessages(page.items);
        setNextCursor(page.nextCursor);
        const top = page.items.reduce((max, m) => Math.max(max, m.seq), 0);
        if (top > 0) socket.emit('message:read', { conversationId: conversation.id, seq: top });
      } catch (err) {
        if (!cancelled) {
          toast(err instanceof Error ? err.message : 'Could not load messages');
          setMessages([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api, conversation.id, socket, toast]);

  // Realtime listeners for this conversation.
  useEffect(() => {
    function onNew(message: Message) {
      if (message.conversationId !== conversation.id) return;
      setMessages((prev) => {
        if (!prev) return prev;
        // Reconcile an optimistic/local copy with the server's canonical row.
        const withoutPending = prev.filter(
          (m) => !(m.id.startsWith('local:') && m.clientMsgId === message.clientMsgId),
        );
        if (withoutPending.some((m) => m.id === message.id)) return withoutPending;
        return sortMessages([...withoutPending, message]);
      });
      socket.emit('message:read', { conversationId: conversation.id, seq: message.seq });
    }
    function onRead(payload: { conversationId: string }) {
      if (payload.conversationId === conversation.id) setTypingUser(null);
    }
    function onTyping(payload: { conversationId: string; userId: string }) {
      if (payload.conversationId !== conversation.id || payload.userId === me.id) return;
      setTypingUser(payload.userId);
      if (typingTimer.current) window.clearTimeout(typingTimer.current);
      typingTimer.current = window.setTimeout(() => setTypingUser(null), 3500);
    }
    socket.on('message:new', onNew);
    socket.on('read:update', onRead);
    socket.on('typing:update', onTyping);
    return () => {
      socket.off('message:new', onNew);
      socket.off('read:update', onRead);
      socket.off('typing:update', onTyping);
    };
  }, [conversation.id, me.id, socket]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function loadOlder() {
    if (!nextCursor || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const page = await api.getMessages(conversation.id, nextCursor);
      setMessages((prev) => sortMessages([...page.items, ...(prev ?? [])]));
      setNextCursor(page.nextCursor);
    } catch {
      toast('Could not load older messages');
    } finally {
      setLoadingOlder(false);
    }
  }

  function send() {
    const text = draft.trim();
    if (!text) return;
    const clientMsgId = crypto.randomUUID();
    const optimistic: Message = {
      id: `local:${clientMsgId}`,
      conversationId: conversation.id,
      senderId: me.id,
      body: text,
      seq: PENDING_SEQ,
      type: 'TEXT',
      createdAt: new Date().toISOString(),
      clientMsgId,
    };
    setMessages((prev) => sortMessages([...(prev ?? []), optimistic]));
    setDraft('');
    socket.emit(
      'message:send',
      { conversationId: conversation.id, body: text, clientMsgId },
      (res: { message?: Message; error?: string }) => {
        if (res?.error) toast(res.error);
      },
    );
  }

  function onDraftChange(value: string) {
    setDraft(value);
    const now = Date.now();
    if (now - lastTypingEmit.current > 1200) {
      lastTypingEmit.current = now;
      socket.emit('typing', { conversationId: conversation.id });
    }
  }

  const online = others[0]?.online;

  return (
    <section className="thread-col">
      <div className="thread-head">
        <button className="btn btn-ghost" onClick={onBack} aria-label="Back">
          ←
        </button>
        <Avatar name={conversation.title ?? 'Chat'} size={34} src={others[0]?.avatarUrl} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 650, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {conversation.title ?? 'Conversation'}
          </div>
          <div className="hint" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className={`online-dot ${online ? 'on' : ''}`} />
            {online ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      <div className="thread-scroll" ref={scrollRef}>
        {nextCursor ? (
          <button
            className="btn btn-ghost"
            style={{ alignSelf: 'center' }}
            disabled={loadingOlder}
            onClick={() => void loadOlder()}
          >
            {loadingOlder ? 'Loading…' : 'Load older'}
          </button>
        ) : null}

        {messages === null ? (
          <div className="hint" style={{ textAlign: 'center' }}>
            Loading messages…
          </div>
        ) : messages.length === 0 ? (
          <div className="hint" style={{ textAlign: 'center' }}>
            No messages yet. Say hello.
          </div>
        ) : (
          messages.map((m) => {
            const own = m.senderId === me.id;
            return (
              <div key={m.id} className={`msg ${own ? 'own' : ''}`}>
                {m.body}
                <div className="meta">
                  {own ? '' : `${peerName(m.senderId)} · `}
                  {m.id.startsWith('local:') ? 'sending…' : formatClock(m.createdAt)}
                </div>
              </div>
            );
          })
        )}
        {typingUser ? (
          <div className="typing" style={{ alignSelf: 'flex-start', padding: 0 }}>
            {peerName(typingUser)} is typing…
          </div>
        ) : null}
      </div>

      <div className="thread-composer">
        <textarea
          aria-label="Write a message"
          placeholder="Write a message…"
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button className="btn btn-primary" disabled={!draft.trim()} onClick={send}>
          Send
        </button>
      </div>
    </section>
  );
}
````

## File: apps/web/src/components/PostCard.tsx
````typescript
import { useState } from 'react';
import { useApp } from '../app-context';
import { relativeTime } from '../lib/format';
import type { Comment, Post } from '../lib/types';
import { Avatar } from './Avatar';

export function PostCard({ post }: { post: Post }) {
  const { api, toast, openProfile, me } = useApp();
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);

  async function toggleLike() {
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    try {
      const res = next
        ? await api.likePost(post.id)
        : await api.unlikePost(post.id);
      setLiked(res.liked);
      setLikeCount(res.likeCount);
    } catch {
      setLiked(!next);
      setLikeCount((c) => c + (next ? -1 : 1));
      toast('Could not update like');
    }
  }

  async function toggleComments() {
    const next = !open;
    setOpen(next);
    if (next && comments === null) {
      try {
        setComments(await api.getComments(post.id));
      } catch {
        toast('Could not load comments');
        setComments([]);
      }
    }
  }

  async function addComment() {
    const text = draft.trim();
    if (!text || busy) return;
    setBusy(true);
    try {
      const comment = await api.addComment(post.id, text);
      setComments((prev) => [...(prev ?? []), comment]);
      setCommentCount((c) => c + 1);
      setDraft('');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not comment');
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="card">
      <div className="post">
        <button
          className="btn-ghost"
          style={{ padding: 0 }}
          onClick={() => openProfile(post.author.id)}
          aria-label={`Open ${post.author.displayName}'s profile`}
        >
          <Avatar name={post.author.displayName} src={post.author.avatarUrl} size={42} />
        </button>
        <div className="post-main">
          <div className="post-head">
            <span className="post-name" onClick={() => openProfile(post.author.id)}>
              {post.author.displayName}
            </span>
            <span className="handle">@{post.author.handle}</span>
            {post.author.role === 'PRACTITIONER' ? (
              <span className="role-tag">practitioner</span>
            ) : null}
            <span className="time">· {relativeTime(post.createdAt)}</span>
          </div>
          {post.author.headline ? (
            <div className="hint" style={{ fontSize: 12 }}>
              {post.author.headline}
            </div>
          ) : null}
          <div className="post-body">{post.body}</div>
          <div className="post-actions">
            <button
              className={`btn-ghost ${liked ? 'liked' : ''}`}
              onClick={() => void toggleLike()}
              aria-pressed={liked}
            >
              {liked ? '♥' : '♡'} {likeCount}
            </button>
            <button className="btn-ghost" onClick={() => void toggleComments()}>
              💬 {commentCount}
            </button>
          </div>

          {open ? (
            <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              {comments === null ? (
                <div className="hint">Loading comments…</div>
              ) : comments.length === 0 ? (
                <div className="hint">No comments yet. Be the first.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {comments.map((c) => (
                    <div key={c.id} style={{ display: 'flex', gap: 9 }}>
                      <Avatar name={c.author.displayName} src={c.author.avatarUrl} size={28} />
                      <div style={{ minWidth: 0 }}>
                        <div>
                          <strong>{c.author.displayName}</strong>{' '}
                          <span className="handle">@{c.author.handle}</span>{' '}
                          <span className="time">{relativeTime(c.createdAt)}</span>
                        </div>
                        <div>{c.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <input
                  className="select"
                  style={{ flex: 1, maxWidth: 'none' }}
                  placeholder={`Reply as ${me.displayName}…`}
                  value={draft}
                  aria-label="Add a comment"
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void addComment();
                  }}
                />
                <button
                  className="btn"
                  disabled={!draft.trim() || busy}
                  onClick={() => void addComment()}
                >
                  Reply
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
````

## File: apps/web/src/components/ProfileDrawer.tsx
````typescript
import { useEffect, useState } from 'react';
import { useApp } from '../app-context';
import { relativeTime } from '../lib/format';
import type { Post, UserProfile } from '../lib/types';
import { Avatar } from './Avatar';

export function ProfileDrawer({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const { api, toast, startChatWith } = useApp();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [p, feed] = await Promise.all([
          api.getProfile(userId),
          api.getUserPosts(userId),
        ]);
        if (cancelled) return;
        setProfile(p);
        setPosts(feed.items);
      } catch (err) {
        if (!cancelled) toast(err instanceof Error ? err.message : 'Could not load profile');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api, userId, toast]);

  async function toggleFollow() {
    if (!profile) return;
    const next = !profile.isFollowing;
    setProfile({
      ...profile,
      isFollowing: next,
      followerCount: profile.followerCount + (next ? 1 : -1),
    });
    try {
      const res = next ? await api.follow(userId) : await api.unfollow(userId);
      setProfile((p) =>
        p ? { ...p, isFollowing: res.following, followerCount: res.followerCount } : p,
      );
    } catch {
      toast('Could not update follow');
    }
  }

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Profile">
        <div className="drawer-head">
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Avatar
              name={profile?.displayName ?? '…'}
              src={profile?.avatarUrl}
              size={56}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>
                {profile?.displayName ?? 'Loading…'}
              </div>
              <div className="handle">@{profile?.handle ?? '…'}</div>
              {profile?.role === 'PRACTITIONER' ? (
                <span className="role-tag">practitioner</span>
              ) : null}
            </div>
          </div>
          <button className="btn-ghost btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {profile ? (
          <>
            {profile.headline ? (
              <p style={{ marginTop: 14, color: 'var(--text-dim)' }}>{profile.headline}</p>
            ) : null}
            {profile.bio ? <p>{profile.bio}</p> : null}
            {profile.region ? <div className="hint">📍 {profile.region}</div> : null}

            <div className="stat-row">
              <div className="stat">
                <div className="num">{profile.followerCount}</div>
                <div className="lbl">Followers</div>
              </div>
              <div className="stat">
                <div className="num">{profile.followingCount}</div>
                <div className="lbl">Following</div>
              </div>
              <div className="stat">
                <div className="num">{profile.postCount}</div>
                <div className="lbl">Posts</div>
              </div>
            </div>

            {!profile.isSelf ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className={`btn ${profile.isFollowing ? '' : 'btn-primary'}`}
                  style={{ flex: 1 }}
                  onClick={() => void toggleFollow()}
                >
                  {profile.isFollowing ? 'Following' : 'Follow'}
                </button>
                <button
                  className="btn"
                  style={{ flex: 1 }}
                  onClick={() => startChatWith(profile.id)}
                >
                  Message
                </button>
              </div>
            ) : null}

            <h3 className="card-title" style={{ marginTop: 24 }}>
              Posts
            </h3>
            {posts.length === 0 ? (
              <div className="hint">No posts yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {posts.map((post) => (
                  <div key={post.id} style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <div className="hint" style={{ fontSize: 12 }}>
                      {relativeTime(post.createdAt)} · ♥ {post.likeCount} · 💬 {post.commentCount}
                    </div>
                    <div style={{ marginTop: 4 }}>{post.body}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="spinner" style={{ margin: '40px auto' }} />
        )}
      </aside>
    </>
  );
}
````

## File: apps/web/src/components/SuggestedPractitioners.tsx
````typescript
import { useEffect, useState } from 'react';
import { useApp } from '../app-context';
import type { User } from '../lib/types';
import { Avatar } from './Avatar';

export function SuggestedPractitioners() {
  const { api, toast, startChatWith, openProfile } = useApp();
  const [people, setPeople] = useState<User[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const page = await api.listUsers('&role=PRACTITIONER');
        if (!cancelled) setPeople(page.items.slice(0, 6));
      } catch {
        if (!cancelled) setPeople([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api]);

  async function toggleFollow(user: User) {
    const next = !user.isFollowing;
    setPeople((prev) =>
      (prev ?? []).map((p) => (p.id === user.id ? { ...p, isFollowing: next } : p)),
    );
    try {
      if (next) await api.follow(user.id);
      else await api.unfollow(user.id);
    } catch {
      setPeople((prev) =>
        (prev ?? []).map((p) =>
          p.id === user.id ? { ...p, isFollowing: !next } : p,
        ),
      );
      toast('Could not update follow');
    }
  }

  return (
    <div className="card">
      <h3 className="card-title">Practitioners to follow</h3>
      {people === null ? (
        <div className="hint">Loading…</div>
      ) : people.length === 0 ? (
        <div className="hint">No practitioners found.</div>
      ) : (
        people.map((p) => (
          <div className="suggest-row" key={p.id}>
            <Avatar name={p.displayName} src={p.avatarUrl} size={36} />
            <div className="suggest-info">
              <div
                className="name"
                style={{ cursor: 'pointer' }}
                onClick={() => openProfile(p.id)}
              >
                {p.displayName}
              </div>
              <div className="sub">{p.headline ?? `@${p.handle}`}</div>
            </div>
            <button
              className="btn btn-ghost"
              title="Message"
              onClick={() => startChatWith(p.id)}
            >
              ✉
            </button>
            <button
              className={`btn ${p.isFollowing ? '' : 'btn-primary'}`}
              style={{ padding: '6px 12px' }}
              onClick={() => void toggleFollow(p)}
            >
              {p.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
````

## File: apps/web/src/components/TopBar.tsx
````typescript
import type { User } from '../lib/types';

interface TopBarProps {
  users: User[];
  userId: string;
  onUserChange: (id: string) => void;
  connected: boolean;
  screen: 'feed' | 'chat';
  onScreenChange: (screen: 'feed' | 'chat') => void;
}

export function TopBar({
  users,
  userId,
  onUserChange,
  connected,
  screen,
  onScreenChange,
}: TopBarProps) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="dot-mark" />
        Tangerine
      </div>
      <nav className="nav" aria-label="Sections">
        <button
          className={screen === 'feed' ? 'active' : ''}
          onClick={() => onScreenChange('feed')}
        >
          Feed
        </button>
        <button
          className={screen === 'chat' ? 'active' : ''}
          onClick={() => onScreenChange('chat')}
        >
          Chat
        </button>
      </nav>
      <div className="spacer" />
      <div className={`conn ${connected ? 'online' : ''}`} title="Realtime connection">
        <span className="dot" />
        {connected ? 'Live' : 'Offline'}
      </div>
      <label className="hint" htmlFor="user-switcher" style={{ marginLeft: 4 }}>
        Acting as
      </label>
      <select
        id="user-switcher"
        className="select"
        value={userId}
        onChange={(e) => onUserChange(e.target.value)}
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.displayName} (@{u.handle}) · {u.role.toLowerCase()}
          </option>
        ))}
      </select>
    </header>
  );
}
````

## File: apps/web/src/lib/api.ts
````typescript
import type {
  Comment,
  Conversation,
  Message,
  Page,
  Post,
  User,
  UserProfile,
} from './types';

export const API_BASE = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
).replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  userId: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      'x-user-id': userId,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { message?: string | string[] };
      if (body?.message) {
        message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
      }
    } catch {
      /* keep default */
    }
    throw new ApiError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/**
 * A per-user API client. Every call carries the mock auth header so the
 * backend can resolve identity — swapping this for a real session cookie later
 * touches only this file.
 */
export function createApi(userId: string) {
  return {
    async listUsers(query = ''): Promise<Page<User>> {
      return request(`/users?limit=50${query}`, userId);
    },
    async me(): Promise<UserProfile> {
      return request('/users/me', userId);
    },
    async getProfile(id: string): Promise<UserProfile> {
      return request(`/users/${id}`, userId);
    },
    async follow(id: string) {
      return request<{ following: boolean; followerCount: number }>(
        `/users/${id}/follow`,
        userId,
        { method: 'POST' },
      );
    },
    async unfollow(id: string) {
      return request<{ following: boolean; followerCount: number }>(
        `/users/${id}/follow`,
        userId,
        { method: 'DELETE' },
      );
    },
    async getFeed(cursor?: string | null): Promise<Page<Post>> {
      const q = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
      return request(`/feed?limit=20${q}`, userId);
    },
    async createPost(body: string): Promise<Post> {
      return request('/posts', userId, {
        method: 'POST',
        body: JSON.stringify({ body }),
      });
    },
    async likePost(id: string) {
      return request<{ liked: boolean; likeCount: number }>(
        `/posts/${id}/like`,
        userId,
        { method: 'POST' },
      );
    },
    async unlikePost(id: string) {
      return request<{ liked: boolean; likeCount: number }>(
        `/posts/${id}/like`,
        userId,
        { method: 'DELETE' },
      );
    },
    async getComments(id: string): Promise<Comment[]> {
      return request(`/posts/${id}/comments`, userId);
    },
    async addComment(id: string, body: string): Promise<Comment> {
      return request(`/posts/${id}/comments`, userId, {
        method: 'POST',
        body: JSON.stringify({ body }),
      });
    },
    async getUserPosts(id: string, cursor?: string | null): Promise<Page<Post>> {
      const q = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
      return request(`/users/${id}/posts?limit=20${q}`, userId);
    },
    async getConversations(): Promise<Conversation[]> {
      return request('/conversations', userId);
    },
    async startDirect(otherUserId: string) {
      return request<{ id: string }>('/conversations/direct', userId, {
        method: 'POST',
        body: JSON.stringify({ userId: otherUserId }),
      });
    },
    async getMessages(
      conversationId: string,
      cursor?: string | null,
    ): Promise<Page<Message>> {
      const q = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
      return request(`/conversations/${conversationId}/messages?limit=30${q}`, userId);
    },
    async markRead(conversationId: string, seq: number) {
      return request(`/conversations/${conversationId}/read`, userId, {
        method: 'POST',
        body: JSON.stringify({ seq }),
      });
    },
  };
}

export type Api = ReturnType<typeof createApi>;

/**
 * Mock-auth bootstrap: fetches the list of pre-registered identities without a
 * session, so the UI can offer a user switcher. Real auth would replace this
 * with a tokens endpoint.
 */
export async function listIdentities(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/api/session/identities`);
  if (!res.ok) {
    throw new ApiError(`Failed to load identities (${res.status})`, res.status);
  }
  return (await res.json()) as User[];
}
````

## File: apps/web/src/lib/format.ts
````typescript
export function relativeTime(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 45) return 'now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function formatClock(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}
````

## File: apps/web/src/lib/socket.ts
````typescript
import { io, type Socket } from 'socket.io-client';
import { API_BASE } from './api';

export type TangerineSocket = Socket;

export function createSocket(userId: string): TangerineSocket {
  return io(API_BASE, {
    auth: { userId },
    transports: ['websocket', 'polling'],
  });
}
````

## File: apps/web/src/lib/types.ts
````typescript
export type Role = 'MEMBER' | 'PRACTITIONER' | 'PROVIDER';

export interface User {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  role: Role;
  headline: string | null;
  region: string | null;
  isCelebrity: boolean;
  online?: boolean;
  isFollowing?: boolean;
}

export interface UserProfile extends User {
  bio: string | null;
  verified: boolean;
  followerCount: number;
  followingCount: number;
  postCount: number;
  isSelf: boolean;
}

export interface Post {
  id: string;
  body: string;
  mediaUrl: string | null;
  createdAt: string;
  author: User;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  liked: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  createdAt: string;
  author: Pick<User, 'id' | 'handle' | 'displayName' | 'avatarUrl'>;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  seq: number;
  type: string;
  createdAt: string;
  clientMsgId: string;
}

export interface Conversation {
  id: string;
  type: 'DIRECT' | 'GROUP';
  title: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  members: User[];
  lastMessage: { body: string; senderId: string; createdAt: string } | null;
}

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}
````

## File: apps/web/src/app-context.tsx
````typescript
import { createContext, useContext } from 'react';
import type { Api } from './lib/api';
import type { TangerineSocket } from './lib/socket';
import type { User } from './lib/types';

export interface AppValue {
  api: Api;
  me: User;
  users: User[];
  socket: TangerineSocket;
  connected: boolean;
  toast: (message: string) => void;
  startChatWith: (userId: string) => void;
  openProfile: (userId: string) => void;
}

export const AppContext = createContext<AppValue | null>(null);

export function useApp(): AppValue {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppContext');
  return value;
}
````

## File: apps/web/src/App.tsx
````typescript
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppContext } from './app-context';
import { createApi, listIdentities } from './lib/api';
import { createSocket } from './lib/socket';
import type { User } from './lib/types';
import { TopBar } from './components/TopBar';
import { Feed } from './components/Feed';
import { Chat } from './components/Chat';
import { ProfileDrawer } from './components/ProfileDrawer';

type Screen = 'feed' | 'chat';

const STORAGE_KEY = 'tangerine.userId';

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>('feed');
  const [connected, setConnected] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null,
  );
  const [bootError, setBootError] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const toast = useCallback((message: string) => {
    setToastMsg(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 4000);
  }, []);

  // Bootstrap identities (mock auth: there is no login, we pick an identity).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const identities = await listIdentities();
        if (cancelled) return;
        if (identities.length === 0) {
          setBootError('No users found. Run the seed: pnpm db:seed');
          return;
        }
        setUsers(identities);
        const stored = localStorage.getItem(STORAGE_KEY);
        const initial =
          identities.find((u) => u.id === stored)?.id ?? identities[0].id;
        setUserId(initial);
      } catch (err) {
        if (!cancelled) {
          setBootError(
            err instanceof Error ? err.message : 'Could not reach the API',
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const me = useMemo(
    () => users.find((u) => u.id === userId) ?? null,
    [users, userId],
  );

  const api = useMemo(() => createApi(userId ?? ''), [userId]);
  const socket = useMemo(
    () => (userId ? createSocket(userId) : null),
    [userId],
  );

  useEffect(() => {
    if (!socket) return;
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    const heartbeat = window.setInterval(
      () => socket.emit('presence:heartbeat'),
      30000,
    );
    return () => {
      window.clearInterval(heartbeat);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
      setConnected(false);
    };
  }, [socket]);

  const changeUser = useCallback((id: string) => {
    localStorage.setItem(STORAGE_KEY, id);
    setActiveConversationId(null);
    setProfileId(null);
    setUserId(id);
  }, []);

  const startChatWith = useCallback(
    async (otherUserId: string) => {
      try {
        const conv = await api.startDirect(otherUserId);
        setActiveConversationId(conv.id);
        setProfileId(null);
        setScreen('chat');
      } catch (err) {
        toast(err instanceof Error ? err.message : 'Could not start chat');
      }
    },
    [api, toast],
  );

  if (bootError) {
    return (
      <div className="center-col">
        <div className="card" style={{ maxWidth: 420 }}>
          <h2 style={{ marginTop: 0 }}>Tangerine</h2>
          <p style={{ color: 'var(--text-dim)' }}>{bootError}</p>
          <p className="hint">
            Start Postgres + Redis with <code>pnpm infra:up</code>, then run the
            API.
          </p>
        </div>
      </div>
    );
  }

  if (!userId || !me || !socket) {
    return (
      <div className="center-col">
        <div className="spinner" />
        <p className="hint" style={{ marginTop: 12 }}>
          Loading Tangerine…
        </p>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        api,
        me,
        users,
        socket,
        connected,
        toast,
        startChatWith: (id) => void startChatWith(id),
        openProfile: setProfileId,
      }}
    >
      <div className="app">
        <TopBar
          users={users}
          userId={userId}
          onUserChange={changeUser}
          connected={connected}
          screen={screen}
          onScreenChange={setScreen}
        />
        {screen === 'feed' ? (
          <Feed />
        ) : (
          <Chat
            activeConversationId={activeConversationId}
            onActiveConversationChange={setActiveConversationId}
          />
        )}
      </div>
      {profileId ? (
        <ProfileDrawer userId={profileId} onClose={() => setProfileId(null)} />
      ) : null}
      {toastMsg ? <div className="toast">{toastMsg}</div> : null}
    </AppContext.Provider>
  );
}
````

## File: apps/web/src/index.css
````css
:root {
  --bg: #0b0b0d;
  --surface: #151518;
  --surface-2: #1c1c21;
  --border: #26262b;
  --border-strong: #34343b;
  --text: #ececf1;
  --text-dim: #9a9aa5;
  --text-faint: #6b6b76;
  --accent: #ff7a1a;
  --accent-soft: rgba(255, 122, 26, 0.14);
  --danger: #ff5c5c;
  --ok: #35c07a;
  --radius: 14px;
  --radius-sm: 10px;
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  color-scheme: dark;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  height: 100%;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

button {
  font: inherit;
  color: inherit;
  cursor: pointer;
}

a {
  color: var(--accent);
  text-decoration: none;
}

img {
  display: block;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  background: #2a2a30;
  border-radius: 8px;
  border: 2px solid var(--bg);
}

/* ---------- shell ---------- */
.app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.topbar {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 12px 22px;
  border-bottom: 1px solid var(--border);
  background: rgba(11, 11, 13, 0.85);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 20;
}

.brand {
  font-weight: 700;
  font-size: 17px;
  letter-spacing: -0.2px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.brand .dot-mark {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 16px var(--accent);
}

.nav {
  display: flex;
  gap: 4px;
  margin-left: 8px;
}
.nav button {
  background: transparent;
  border: 1px solid transparent;
  padding: 7px 14px;
  border-radius: 999px;
  color: var(--text-dim);
  font-weight: 600;
}
.nav button:hover {
  color: var(--text);
}
.nav button.active {
  color: var(--text);
  background: var(--surface-2);
  border-color: var(--border-strong);
}

.spacer {
  flex: 1;
}

.select {
  background: var(--surface-2);
  color: var(--text);
  border: 1px solid var(--border-strong);
  border-radius: 10px;
  padding: 7px 10px;
  max-width: 240px;
}

.conn {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--text-faint);
  font-size: 12px;
}
.conn .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-faint);
}
.conn.online .dot {
  background: var(--ok);
  box-shadow: 0 0 10px var(--ok);
}

/* ---------- layout ---------- */
.layout {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 22px;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 22px;
}
.stream {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
@media (max-width: 900px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .rail {
    display: none;
  }
}

/* ---------- cards ---------- */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
}
.card-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-faint);
  margin: 0 0 12px;
}

/* ---------- composer ---------- */
.composer textarea {
  width: 100%;
  min-height: 62px;
  resize: vertical;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  padding: 11px 12px;
  font: inherit;
}
.composer textarea:focus {
  outline: none;
  border-color: var(--border-strong);
}
.composer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.hint {
  color: var(--text-faint);
  font-size: 12px;
}

/* ---------- buttons ---------- */
.btn {
  border: 1px solid var(--border-strong);
  background: var(--surface-2);
  color: var(--text);
  padding: 8px 15px;
  border-radius: 999px;
  font-weight: 600;
  transition: background 0.15s, border-color 0.15s, opacity 0.15s;
}
.btn:hover {
  border-color: #45454e;
}
.btn:disabled {
  opacity: 0.5;
  cursor: default;
}
.btn-primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #180a01;
}
.btn-primary:hover {
  background: #ff8c3a;
  border-color: #ff8c3a;
}
.btn-ghost {
  background: transparent;
  border-color: transparent;
  color: var(--text-dim);
  padding: 6px 10px;
}
.btn-ghost:hover {
  color: var(--text);
  background: var(--surface-2);
}
.btn-ghost.active {
  color: var(--accent);
}

/* ---------- post ---------- */
.post {
  display: flex;
  gap: 12px;
}
.post-main {
  min-width: 0;
  flex: 1;
}
.post-head {
  display: flex;
  align-items: baseline;
  gap: 7px;
  flex-wrap: wrap;
}
.post-name {
  font-weight: 650;
}
.post-name:hover {
  text-decoration: underline;
  cursor: pointer;
}
.handle {
  color: var(--text-faint);
}
.time {
  color: var(--text-faint);
  font-size: 12px;
}
.role-tag {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent);
  border: 1px solid var(--accent-soft);
  background: var(--accent-soft);
  padding: 1px 7px;
  border-radius: 999px;
}
.post-body {
  margin: 7px 0 10px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.post-actions {
  display: flex;
  gap: 4px;
  color: var(--text-faint);
}
.post-actions .btn-ghost {
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.post-actions .liked {
  color: var(--accent);
}

/* ---------- avatar ---------- */
.avatar {
  border-radius: 50%;
  object-fit: cover;
  background: var(--surface-2);
  flex: none;
}
.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--text-dim);
  border: 1px solid var(--border);
}

/* ---------- rail ---------- */
.rail {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-self: start;
  position: sticky;
  top: 22px;
}
.suggest-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
}
.suggest-row + .suggest-row {
  border-top: 1px solid var(--border);
}
.suggest-info {
  min-width: 0;
  flex: 1;
}
.suggest-info .name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.suggest-info .sub {
  color: var(--text-faint);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---------- drawer ---------- */
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 40;
}
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: min(420px, 100%);
  background: var(--surface);
  border-left: 1px solid var(--border);
  box-shadow: var(--shadow);
  z-index: 41;
  overflow: auto;
  padding: 22px;
}
.drawer-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.stat-row {
  display: flex;
  gap: 22px;
  margin: 16px 0;
}
.stat .num {
  font-weight: 700;
  font-size: 16px;
}
.stat .lbl {
  color: var(--text-faint);
  font-size: 12px;
}

/* ---------- chat ---------- */
.chat {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
}
@media (max-width: 780px) {
  .chat {
    grid-template-columns: 1fr;
  }
  .chat.thread-open .conv-col {
    display: none;
  }
  .chat:not(.thread-open) .thread-col {
    display: none;
  }
}
.conv-col {
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.col-head {
  padding: 16px;
  border-bottom: 1px solid var(--border);
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.conv-scroll {
  overflow: auto;
  flex: 1;
}
.conv-item {
  display: flex;
  gap: 11px;
  padding: 13px 16px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  align-items: center;
  background: transparent;
  border-left: 2px solid transparent;
  width: 100%;
  text-align: left;
}
.conv-item:hover {
  background: var(--surface-2);
}
.conv-item.active {
  background: var(--surface-2);
  border-left-color: var(--accent);
}
.conv-info {
  min-width: 0;
  flex: 1;
}
.conv-info .top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.conv-info .name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.conv-info .preview {
  color: var(--text-faint);
  font-size: 12.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.unread {
  background: var(--accent);
  color: #180a01;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  min-width: 19px;
  height: 19px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.thread-col {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.thread-head {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 11px;
}
.thread-scroll {
  flex: 1;
  overflow: auto;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.msg {
  max-width: 74%;
  padding: 9px 13px;
  border-radius: 15px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  align-self: flex-start;
}
.msg.own {
  align-self: flex-end;
  background: var(--accent-soft);
  border-color: rgba(255, 122, 26, 0.35);
}
.msg .meta {
  font-size: 11px;
  color: var(--text-faint);
  margin-top: 4px;
}
.msg.own .meta {
  text-align: right;
}
.typing {
  color: var(--text-faint);
  font-size: 12px;
  font-style: italic;
  padding: 0 18px 8px;
}
.thread-composer {
  border-top: 1px solid var(--border);
  padding: 13px 16px;
  display: flex;
  gap: 10px;
}
.thread-composer textarea {
  flex: 1;
  resize: none;
  min-height: 42px;
  max-height: 140px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  padding: 10px 12px;
  font: inherit;
}
.thread-composer textarea:focus {
  outline: none;
  border-color: var(--border-strong);
}

/* ---------- misc ---------- */
.empty {
  color: var(--text-faint);
  text-align: center;
  padding: 40px 16px;
}
.center-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-strong);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.online-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--text-faint);
}
.online-dot.on {
  background: var(--ok);
}

.toast {
  position: fixed;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  background: #2a1410;
  border: 1px solid var(--danger);
  color: #ffd9d9;
  padding: 10px 16px;
  border-radius: 10px;
  z-index: 60;
  box-shadow: var(--shadow);
  max-width: 90vw;
}
````

## File: apps/web/src/main.tsx
````typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
````

## File: apps/web/src/vite-env.d.ts
````typescript
/// <reference types="vite/client" />
````

## File: apps/web/.env.example
````
VITE_API_URL=http://localhost:3001
````

## File: apps/web/index.html
````html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <title>Tangerine</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

## File: apps/web/package.json
````json
{
  "name": "@tangerine/web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "socket.io-client": "^4.8.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.3",
    "vite": "^6.0.7"
  }
}
````

## File: apps/web/README.md
````markdown
# Tangerine Web

Dark-only React + Vite frontend for the Tangerine feed and chat demo.

## Run

```bash
pnpm install
pnpm --filter @tangerine/web dev     # http://localhost:5173
```

The API must be running (`pnpm dev:api` from the repo root). The base URL comes
from `VITE_API_URL` (default `http://localhost:3001`) — copy `.env.example` to
`.env` to override.

## What's here

- `src/lib/` — API client (`api.ts`), socket client (`socket.ts`), shared types
  (`types.ts`), formatting helpers (`format.ts`).
- `src/components/` — `Feed`, `Chat` and their pieces (`PostCard`, `Composer`,
  `SuggestedPractitioners`, `ProfileDrawer`, `MessageThread`, `Avatar`,
  `TopBar`).
- `src/App.tsx` — identity bootstrap (the mock-auth user switcher), socket
  lifecycle, and screen routing.

## Notes

- Authentication is mocked: identities are loaded from `GET /api/session/identities`
  and every request carries an `x-user-id` header. There is no login screen — it
  is intentionally out of scope for this demo.
- Realtime uses Socket.IO. The client joins a conversation room when a thread is
  opened, sends with a `clientMsgId` for idempotency, and reconciles the
  server's `message:new` event against an optimistic local message.
````

## File: apps/web/tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}
````

## File: apps/web/vite.config.ts
````typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});
````

## File: docs/frontend-spec.md
````markdown
# Tangerine Web — implementation spec (v1)

Build the `apps/web` package: a **dark-only** React + Vite + TypeScript app with
two screens, **Feed** and **Chat**, talking to the Tangerine API. No onboarding,
signup, or auth screens — identity is mocked with a user switcher.

The backend is already built and running. Do **not** modify anything outside
`apps/web/`.

## Stack & constraints

- Vite + React + TypeScript (strict). Package name `@tangerine/web`.
- Dependencies kept small: `react`, `react-dom`, `socket.io-client`. No UI kit,
  no state library, no router. Use plain CSS (one global stylesheet + CSS
  variables) or CSS modules. Hand-rolled is fine and preferred.
- Dev server on port 5173. API base from `import.meta.env.VITE_API_URL ?? 'http://localhost:3001'`.
- Must pass `pnpm build` (tsc + vite build) with no type errors.
- Dark mode only. Near-black background (#0b0b0d), elevated surfaces (#151518),
  subtle borders (#26262b), tangerine accent (#ff7a1a). Inter/system font stack.
  Rounded cards, comfortable spacing, readable at a glance. No emoji-only UI.
- Add `apps/web/.env.example` with `VITE_API_URL=http://localhost:3001`.

## Mock auth

- On load, `GET {API}/api/users?limit=50` to populate a **user switcher**
  (top bar `<select>`: `DisplayName (@handle)`).
- Persist the selected user id in `localStorage` (`tangerine.userId`). Default to
  the first user if none stored.
- Every REST call sends header `x-user-id: <selectedId>`.
- Socket connects with `io(API, { auth: { userId } })`.

## API contract (already live — do not change)

All REST paths are prefixed with `/api`. All require `x-user-id`.

- `GET /users?limit=50` → `{ items: User[], nextCursor }`
  - `User = { id, handle, displayName, avatarUrl, role, headline, region, isCelebrity, online?, isFollowing }`
- `GET /users/me` → full profile
- `GET /users/:id` → profile
- `POST /users/:id/follow` / `DELETE /users/:id/follow` → `{ following, followerCount, isCelebrity }`
- `GET /feed?limit=20&cursor=<opaque>` → `{ items: Post[], nextCursor }`
- `POST /posts` body `{ body, mediaUrl? }` → `Post`
- `GET /posts/:id` → `Post`
- `DELETE /posts/:id`
- `POST /posts/:id/like` / `DELETE /posts/:id/like` → `{ liked, likeCount }`
- `GET /posts/:id/comments` → `Comment[]`
- `POST /posts/:id/comments` body `{ body }` → `Comment`
- `GET /users/:id/posts?limit=20&cursor=` → `{ items, nextCursor }`
- `GET /conversations` → `Conversation[]`
  - `Conversation = { id, type, title, lastMessageAt, unreadCount, members: User[], lastMessage: { body, senderId, createdAt } | null }`
- `POST /conversations/direct` body `{ userId }` → `{ id, type, title, members }`
- `GET /conversations/:id/messages?limit=30&cursor=<seq>` → `{ items: Message[], nextCursor }`
- `POST /conversations/:id/messages` body `{ body, clientMsgId? }` → `Message`
- `POST /conversations/:id/read` body `{ seq }` → `{ conversationId, userId, seq }`

```
Post = { id, body, mediaUrl: string|null, createdAt: ISOstring,
         author: { id, handle, displayName, avatarUrl, role, headline, isCelebrity },
         likeCount, commentCount, shareCount, liked: boolean }
Message = { id, conversationId, senderId, body, seq, type, createdAt, clientMsgId }
Comment = { id, postId, authorId, body, createdAt, author: {...} }
```

## Socket events (server is the source of truth)

Connect: `io(API, { auth: { userId } })`.

Client → server:
- `conversation:join` `{ conversationId }` (call when opening a thread)
- `message:read` `{ conversationId, seq }`
- `typing` `{ conversationId }`
- `presence:heartbeat` (every ~30s)

Server → client:
- `message:new` `MessageDto` — append if it belongs to the open conversation; otherwise bump the conversation list.
- `read:update` `{ conversationId, userId, seq }`
- `typing:update` `{ conversationId, userId }`
- `presence:update` `{ userId, online }`

## Screens

### Feed (default)
- Top bar: app name "Tangerine", user switcher, connection indicator (socket connected).
- Composer card: textarea + "Post" button → `POST /posts`, prepend the returned post.
- Feed list: newest first. Each post: avatar, author name, `@handle`, headline,
  relative time, body, like button (optimistic toggle, shows count), comment count.
  Use `GET /feed`; "Load more" button uses `nextCursor` (keyset pagination — never offsets).
- Clicking an author opens a lightweight profile panel/drawer showing bio,
  counts, and a Follow/Following toggle, plus their posts (`GET /users/:id/posts`).
- Right rail (desktop): "Suggested practitioners" from `GET /users?role=PRACTITIONER&limit=6`
  with Follow buttons.

### Chat
- Left column: conversation list from `GET /conversations` (avatar/initials,
  title, last message preview, unread badge, relative time). Selecting a
  conversation loads messages and calls `conversation:join`.
- Right column: message thread. Own messages right-aligned, others left.
  Group by sender/time. Load older via `nextCursor`. Composer sends via socket
  `message:send` (with a `clientMsgId` you generate) and optimistically renders;
  reconcile on `message:new`/ack, dedupe by message id.
- Mark read (`message:read`) for the highest visible seq when opening/scrolling.
- Typing indicator: emit `typing` on input (throttled ~1/sec) and show
  "typing…" from `typing:update`.
- Start a new DM: pick a practitioner from the Feed suggestions or a small
  "New message" control using `POST /conversations/direct`, then open it.
- Show online dot on conversation members using `presence:update` / `online`.

## Quality bar

- Loading and empty states everywhere (skeletons or "Loading…", friendly empties).
- Errors surface as a small toast/inline message, never a blank screen.
- Relative timestamps ("3m", "2h", "Mar 4").
- Accessible: buttons are `<button>`, inputs have labels/aria, focus styles.
- Keep components in `src/components/`, API client in `src/lib/api.ts`,
  socket client in `src/lib/socket.ts`, types in `src/lib/types.ts`,
  formatting helpers in `src/lib/format.ts`.
- A short `apps/web/README.md` explaining how to run it.
````

## File: .gitignore
````
node_modules/
dist/
build/
coverage/
*.log
.env
.env.local
.DS_Store
.vite/
apps/web/dist/
apps/api/dist/
````

## File: docker-compose.yml
````yaml
services:
  postgres:
    image: postgres:18-alpine
    container_name: tangerine-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: tangerine
      POSTGRES_PASSWORD: tangerine
      POSTGRES_DB: tangerine
    # pg_stat_statements is the ground truth for "which query is the
    # bottleneck" in the benchmark writeups. track_io_timing makes the
    # read/write breakdown in pg_stat_statements meaningful.
    command:
      - postgres
      - -c
      - shared_preload_libraries=pg_stat_statements
      - -c
      - pg_stat_statements.track=all
      - -c
      - track_io_timing=on
      - -c
      - max_connections=200
    ports:
      - "5432:5432"
    volumes:
      - tangerine-pgdata:/var/lib/postgresql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tangerine -d tangerine"]
      interval: 5s
      timeout: 5s
      retries: 10

  redis:
    image: redis:7-alpine
    container_name: tangerine-redis
    restart: unless-stopped
    command: ["redis-server", "--appendonly", "yes"]
    ports:
      - "6379:6379"
    volumes:
      - tangerine-redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10

  prometheus:
    image: prom/prometheus:v3.1.0
    container_name: tangerine-prometheus
    restart: unless-stopped
    # Host networking so the scraper can reach the API on 127.0.0.1:3001.
    network_mode: host
    volumes:
      - ./infra/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - tangerine-promdata:/prometheus
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.retention.time=7d

  grafana:
    image: grafana/grafana:11.5.1
    container_name: tangerine-grafana
    restart: unless-stopped
    network_mode: host
    depends_on:
      - prometheus
    environment:
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: admin
      GF_USERS_ALLOW_SIGN_UP: "false"
      GF_AUTH_ANONYMOUS_ENABLED: "true"
      GF_AUTH_ANONYMOUS_ORG_ROLE: Viewer
      GF_SERVER_HTTP_PORT: "3000"
    volumes:
      - ./infra/grafana/provisioning:/etc/grafana/provisioning:ro
      - ./infra/grafana/dashboards:/var/lib/grafana/dashboards:ro
      - tangerine-grafanadata:/var/lib/grafana

volumes:
  tangerine-pgdata:
  tangerine-redisdata:
  tangerine-promdata:
  tangerine-grafanadata:
````

## File: Feature List.md
````markdown
# Tangerine — Capability & Performance Roadmap

This is not a product roadmap. It is a capability roadmap for a
**performance engineering showcase**.

Tangerine exists to demonstrate how a senior backend engineer designs,
measures, and optimizes a non-trivial distributed system. The deliverable
is not "a finished product." The deliverable is **evidence** —
benchmarks, dashboards, optimization logs, and a defensible architecture
story.

Every feature below is included because it introduces a real
distributed-systems problem worth measuring: contention, idempotency,
ordering, delivery guarantees, or consistency under load. Features that
do not extend the performance story are deliberately excluded — and
called out as such rather than quietly ignored.

---

## Status legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Built and working |
| 🔬 | Built and benchmarked (documented in `docs/performance/`) |
| 🚧 | In progress |
| 🎯 | Planned next |
| 🧪 | Planned, framed as a performance experiment |
| ⛔ | Deliberately out of scope (with reasoning) |

---

## Part 1 — What exists today

### Core domain
- ✅ **Users, practitioners, providers** with roles, profiles, headlines, regions
- ✅ **Follow graph** with denormalized follower/following counts
- ✅ **Posts, likes, comments** with denormalized counters
- ✅ **Celebrity flag** derived from follower threshold

### Feed
- ✅ **Hybrid fan-out** — push for normal authors, pull for celebrities
- ✅ **Redis materialized timelines** (ZSET of post ids scored by publish time)
- ✅ **Bounded timeline length** with automatic trimming
- ✅ **Keyset (cursor) pagination** on `(createdAt, id)`
- ✅ **Cold-cache backfill** from Postgres so the feed is never empty

### Async pipeline
- ✅ **Transactional outbox** — post + event commit in one transaction
- ✅ **Outbox relay** with `FOR UPDATE SKIP LOCKED` (multi-instance safe)
- ✅ **BullMQ fan-out worker** with exponential backoff and dead-letter handling
- ✅ **Idempotent publishing** via `jobId = eventId`

### Chat
- ✅ **Server-assigned sequence numbers** (atomic `UPDATE … increment`)
- ✅ **Idempotent sends** via `clientMsgId` unique per sender
- ✅ **Store-and-forward** — messages persist before socket push
- ✅ **Read receipts as cursors** (`lastReadSeq` with `GREATEST` monotonic update)
- ✅ **Presence via Redis TTL** (heartbeat-refreshed keys)
- ✅ **Socket.IO with Redis adapter** for horizontal scale

### Operations
- ✅ **Prometheus metrics** — outbox lag, queue depth by state
- ✅ **Health endpoint** (db + redis checks)
- ✅ **Structured error envelope** and Prisma-to-HTTP error translation
- ✅ **Swagger docs** at `/docs`

---

## Part 2 — Deliberately out of scope

Each of these is a conscious decision, not an oversight. They are
abstractions that keep the focus on the performance story.

- ⛔ **Real authentication & onboarding** — mocked with an `x-user-id`
  header resolved by one guard. Swapping in real auth would touch one
  file (`auth.guard.ts`). JWT issuance and session rotation are not
  interesting performance problems at this project's scale.
- ⛔ **Email delivery** — a delivery channel, not a distributed-systems
  problem. If notification fan-out is benchmarked, email can be modeled
  as just another channel behind the same interface.
- ⛔ **Native mobile app** — mobile clients consume the same API. The
  performance story lives on the server, not in the UI framework.
- ⛔ **Consent, verification, moderation, compliance flows** — real
  health-platform requirements, but orthogonal to the fan-out, chat,
  scheduling, and payment problems this project measures.
- ⛔ **Multi-region deployment** — interesting at scale, but the current
  performance story is complete within a single region. Data residency
  would be a future experiment, not a feature.
- ⛔ **AI-assisted clinical interpretation** — requires clinical review
  and regulatory sign-off. Out of scope for a performance portfolio.

If any of these ever gets built, it will be because it *tests something*
the current system doesn't — not because a roadmap said so.

---

## Part 3 — Core platform capabilities

The features that define the system. Each is a prerequisite for the
performance experiments in Part 4.

### Scheduling & booking
- ✅ **`SessionType` catalog** — initial consult, follow-up, coaching, class,
  each with a duration and price
- ✅ **`PractitionerAvailability`** — recurring weekly slots with timezone
  awareness
- ✅ **`Booking` model** — `{ practitionerId, memberId, sessionTypeId,
  startTime, endTime, status }`
- ✅ **Slot lookup** — compute open slots from availability minus existing
  bookings, paginated by date range
- 🔬 **Conflict-safe booking** — reject overlapping bookings atomically
  (Postgres `EXCLUDE` constraint with `tstzrange`); never check-then-insert
- 🔬 **Reschedule & cancel** — with policy rules (e.g., 24-hour notice),
  idempotent on a client-provided operation id
- 🔬 **Hold / waitlist** — a soft reservation with an expiry job, so two
  members can be queued for one slot without double-booking (expiring hold is
  benchmarked; an explicit waitlist queue is deferred)
- ✅ **Booking confirmation** — emits an event through the existing outbox,
  consumed by the notifications pipeline

### Push notifications
- 🎯 **`Device` model** — `{ userId, platform, token, lastSeenAt, revokedAt }`
- 🎯 **`Notification` model** — `{ userId, type, payload, channel, readAt,
  deliveredAt, dedupeKey }`
- 🎯 **`NotificationPreference`** — per-user, per-channel opt-in/out
- 🎯 **Fan-out worker** — consumes notification events from the outbox,
  resolves recipients, batches by user, dispatches per device
- 🎯 **Delivery adapter interface** — one implementation for APNs/FCM
  (mocked), one for in-app, so the pipeline is testable without real
  provider credentials
- 🎯 **Deduplication** — unique index on `(userId, dedupeKey)`; a retry
  cannot produce a duplicate notification
- 🎯 **Digest batching** — collapse N likes on one post within a window
  into a single notification

### Payments & billing
- 🎯 **Stripe integration (test mode)** — checkout sessions, payment
  intents, refunds
- 🎯 **Webhook handler** — signature verification, idempotency on
  `event.id`, out-of-order event tolerance
- 🎯 **`Payment` model** — `{ id, bookingId?, orderId?, amount, currency,
  status, stripePaymentIntentId }`
- 🎯 **Double-entry ledger** — every money movement produces two rows
  (debit + credit), immutable once written
- 🎯 **`Payout` model** — practitioner payouts with a KYC status field
- 🎯 **Invoice / receipt generation** — PDF, stored in S3 (LocalStack),
  downloadable by the payer
- 🎯 **Refund & dispute handling** — state machine driven by webhook events
- 🎯 **Superbill export** — CSV/PDF for reimbursement

### Marketplace
- 🎯 **`Product` catalog** — supplements, devices, at-home tests,
  equipment, with a `practitionerId` for storefronts
- 🎯 **`Cart` and `CartItem`** — one active cart per user, serialized by
  an optimistic-concurrency version field
- 🎯 **`Order` model** with a state machine: `PENDING → PAID →
  FULFILLING → SHIPPED → DELIVERED → CANCELLED / REFUNDED`
- 🎯 **Inventory** — `InventoryItem` with a `reserved` counter; checkout
  reserves atomically and releases on failure or timeout
- 🎯 **Product-protocol linkage** — add a product to cart from a protocol
  item in one click
- 🎯 **Verified-purchase reviews** — only buyers can review, enforced by
  a join against the buyer's orders
- 🎯 **Disclosure fields** — every practitioner recommendation carries an
  `isSponsored` flag and a conflict-of-interest note

### Notifications (in-app)
- 🎯 **Bell + drawer UI** in the web app
- 🎯 **`GET /notifications`** with keyset pagination
- 🎯 **`POST /notifications/:id/read`** and mark-all-read
- 🎯 **Unread count** — cached in Redis, invalidated on write

---

## Part 4 — The performance program

This is the actual roadmap. A "feature" is now defined as a measured,
documented capability with a benchmark. Every entry below produces a
writeup in `docs/performance/`.

### Instrumentation (foundation)
- ✅ **Prometheus + Grafana** wired locally via `docker-compose.yml`
- ✅ **k6 test harness** in `apps/api/performance/`
- 🎯 **Node.js profiling setup** (`--prof`, `clinic.js`, or `0x`)
- ✅ **Postgres query stats** via `pg_stat_statements`
- 🎯 **Redis slowlog** and memory profiling
- 🎯 **OpenTelemetry tracing** — one span per request, one trace per
  outbox event, so a slow feed read can be traced end-to-end

### Benchmark scenarios — Feed & fan-out
- 🎯 **Feed read throughput** — req/s and p99 on `GET /feed` under
  sustained concurrent load
- 🎯 **Post write under read load** — verify the async pipeline never
  blocks the read path
- 🎯 **Fan-out lag** — time from `POST /posts` return to follower feed
  visibility under sustained write load
- 🎯 **Celebrity pull cost** — measure read latency as a user follows
  1, 5, 20, 50 celebrities; find the point where the per-celebrity query
  loop dominates
- 🎯 **Cold-cache recovery** — wipe timelines mid-load, measure backfill
  latency and error rate
- 🎯 **Outbox relay throughput** — find the event volume where the relay
  saturates; measure the lag derivative

### Benchmark scenarios — Chat
- 🎯 **Chat contention** — N concurrent senders on one conversation;
  prove `seq` uniqueness and ordering hold
- 🎯 **Read-receipt monotonicity under racing acks** — prove `GREATEST`
  never regresses
- 🎯 **Presence at scale** — many concurrent socket connections, TTL
  expiry, Redis key count growth
- 🎯 **Socket.IO Redis adapter overhead** — measure delivery latency with
  and without the adapter at different connection counts

### Benchmark scenarios — Scheduling
- 🔬 **Booking contention** — M members race for the same slot; exactly
  one must win, and the API must return a clean 409 to the others
- 🔬 **Slot lookup under load** — measure the cost of computing open
  slots as the number of existing bookings grows
- 🔬 **Reschedule idempotency** — send the same reschedule twice; assert
  the second is a no-op
- 🔬 **Hold expiry accuracy** — prove a hold releases the slot within
  the expected window even under scheduler jitter

### Benchmark scenarios — Payments
- 🎯 **Webhook idempotency** — replay the same Stripe webhook 100 times;
  assert exactly one ledger entry
- 🎯 **Out-of-order webhooks** — deliver `payment_intent.succeeded`
  before `checkout.session.completed`; assert the state machine
  converges to the same final state
- 🎯 **Ledger integrity under concurrent writes** — N concurrent writes
  to the same account; assert sum(debits) == sum(credits) always
- 🎯 **Refund flood** — many refunds on one order; assert ledger stays
  balanced and the state machine rejects invalid transitions

### Benchmark scenarios — Marketplace
- 🎯 **Inventory race** — M concurrent checkouts for the last item;
  exactly one must reserve successfully
- 🎯 **Cart concurrency** — two clients modifying the same cart;
  assert optimistic versioning prevents lost updates
- 🎯 **Order state transitions under load** — drive an order through its
  full lifecycle concurrently; assert no illegal transitions occur
- 🎯 **Catalog read throughput** — measure `GET /products` with filters
  and pagination

### Benchmark scenarios — Notifications
- 🎯 **Fan-out throughput** — one event with 10,000 recipients;
  measure time-to-last-delivery and queue saturation point
- 🎯 **Device fan-out amplification** — one notification to a user with
  5 devices; prove dedupe prevents duplicate dispatch on retry
- 🎯 **Digest batching** — 500 like events on one post within 60s;
  assert exactly one digest notification is sent
- 🎯 **Delivery adapter failure** — simulate an APNs outage; verify
  retries with backoff and eventual dead-letter

### Optimization investigations
Each hypothesis gets tested, measured, and either confirmed (with a
before/after) or rejected (also a valid finding).

- 🧪 **Feed hydration N+1** — does `hydrateIds` produce per-post author
  queries? Fix with Prisma `include` or a batched loader.
- 🧪 **Redis pipelining** — are timeline writes batched? Measure the
  round-trip reduction.
- 🔬 **Postgres connection pool saturation** — find the pool size where
  throughput plateaus; test PgBouncer. (Measured: contention saturated the
  default pool and produced 5xx with p99≈10 s; requiring a single advisory lock
  per contended slot eliminated the failures — see the optimization log. Retry
  alone was measured and rejected: the GiST exclusion index can livelock.)
- 🧪 **JSON serialization cost** — profile `JSON.stringify` on large feed
  payloads; test `fast-json-stringify` with a schema.
- 🧪 **Cursor pagination efficiency** — verify with `EXPLAIN ANALYZE`
  that the `(createdAt, id)` index is actually used.
- 🧪 **Celebrity pull optimization** — replace the per-celebrity query
  loop with a single `ZUNIONSTORE` across all celebrity outboxes.
- 🧪 **Hot-key rate limiter** — benchmark a sliding-window limiter under
  high concurrency; find the sharding threshold.
- 🧪 **Webhook processing throughput** — find the rate at which the
  payment state machine can ingest events before lag climbs.

### Deliverables
- ✅ `docs/performance/README.md` — methodology, machine specs, summary table
- ✅ One file per scenario in the standard format
  (hypothesis → methodology → results → analysis → optimization → results → what it proves)
- ✅ `docs/performance/optimization-log.md` — chronological before/after
- ✅ Grafana dashboard screenshots in the README
- 🎯 k6 HTML reports (via `pitwall-k6`) hosted on GitHub Pages

---

## Part 5 — Cloud emulation

- 🧪 **LocalStack for S3** — avatars, media, lab PDFs, invoice PDFs.
  Presigned-URL upload flow with its own throughput benchmark.
- 🧪 **LocalStack for SQS** — run the same fan-out benchmarks against
  SQS as an alternative to BullMQ and compare latency, cost model, and
  operational complexity
- 🧪 **LocalStack for Secrets Manager** — replace env vars with a real
  secrets fetch path
- 🧪 **Terraform plan (not applied)** — show the AWS footprint this would
  run on; demonstrates infrastructure-as-code literacy without a bill

---

## Part 6 — How "done" is defined

For a performance showcase, "done" means:

1. **Built** — the capability works, with tests covering the invariants
   (idempotency, ordering, monotonicity, ledger balance).
2. **Measured** — a k6 scenario exists, has a documented baseline, and
   produces reproducible numbers on a known machine.
3. **Analyzed** — the bottleneck is identified, not guessed. Profiling
   output or `EXPLAIN ANALYZE` is included.
4. **Optimized** — a change is made, and the before/after is recorded.
5. **Written up** — a short document explains the hypothesis, the
   result, and what it proves.

A feature that is built but not benchmarked is **not done** by this
project's standard. It is a prerequisite for the next benchmark.

---

## Part 7 — Explicitly not on this roadmap

For clarity, these are excluded even though they would appear on a
product roadmap:

- Email delivery pipelines
- Native mobile apps
- Multi-region deployment and data residency
- AI-assisted clinical interpretation
- Full compliance workflows (consent, verification, moderation)
- Organization / enterprise admin (SSO, roster management)
- Insurance billing integrations
- FHIR / EHR interoperability

These belong to a product roadmap, not a performance one. If the goal
of this project ever changes from "show what I can measure" to "ship a
product," this list becomes the starting point.

---

## The one-sentence summary

Tangerine is a working distributed system, and this file is the
checklist for turning it into a *demonstrated* one — measured,
analyzed, optimized, and written up.
````

## File: package.json
````json
{
  "name": "tangerine",
  "version": "0.1.0",
  "private": true,
  "description": "Tangerine — a health social platform demo: feed + chat, built to showcase senior full-stack and backend engineering.",
  "packageManager": "pnpm@11.10.0",
  "scripts": {
    "infra:up": "docker compose up -d",
    "infra:down": "docker compose down",
    "db:migrate": "pnpm --filter @tangerine/api prisma:migrate",
    "db:seed": "pnpm --filter @tangerine/api prisma:seed",
    "db:reset": "pnpm --filter @tangerine/api prisma:reset",
    "dev:api": "pnpm --filter @tangerine/api start:dev",
    "dev:web": "pnpm --filter @tangerine/web dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test"
  }
}
````

## File: apps/api/prisma/schema.prisma
````prisma
// Tangerine — data model.
//
// Design notes
// ------------
// * Postgres is the source of truth. Redis holds only derived data
//   (materialized home timelines, presence) which can always be rebuilt.
// * Ids are cuid() strings, sortable enough for demo purposes. In a real
//   system these would be Snowflake ids so that id ordering == time ordering.
// * Denormalized counters (likeCount, commentCount, followerCount) live on the
//   row so feed hydration is a single query instead of N aggregates. They are
//   updated inside transactions alongside the write that changes them.
// * A conversation owns a monotonically increasing `seq` per message. The
//   server, not the client clock, defines message order. `clientMsgId` makes
//   sends idempotent under retries.

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  MEMBER
  PRACTITIONER
  PROVIDER
}

enum ConversationType {
  DIRECT
  GROUP
}

enum MessageType {
  TEXT
  SYSTEM
}

/// Lifecycle of a transactional-outbox event.
///   PENDING   -> written in the same tx as the domain change, not yet published
///   RELAYED   -> published onto the work queue
///   PROCESSED -> the worker finished it
///   FAILED    -> exhausted retries (surfaced for alerting/replay)
enum OutboxStatus {
  PENDING
  RELAYED
  PROCESSED
  FAILED
}

/// Lifecycle of a booking. `HELD` is a soft, expiring reservation that lives in
/// the SAME table as firm bookings on purpose: a single PostgreSQL exclusion
/// constraint then enforces "no two overlapping reservations on one
/// practitioner" atomically across holds and bookings, instead of a racy
/// check-then-insert against two tables.
enum BookingStatus {
  HELD
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
  NO_SHOW
}

model User {
  id           String   @id @default(cuid())
  handle       String   @unique
  displayName  String
  avatarUrl    String?
  role         Role     @default(MEMBER)
  bio          String?
  headline     String?
  region       String?
  verified     Boolean  @default(false)
  createdAt    DateTime @default(now())

  // Denormalized graph counters, kept in sync with Follow writes.
  followerCount  Int @default(0)
  followingCount Int @default(0)

  // Derived flag: true once followerCount crosses the celebrity threshold.
  // Posts by celebrities skip write-time fan-out and are pulled at read time.
  isCelebrity Boolean @default(false)

  posts        Post[]
  likes        Like[]
  comments     Comment[]
  following    Follow[]             @relation("follower")
  followers    Follow[]             @relation("following")
  memberships  ConversationMember[]
  messages     Message[]

  sessionTypes           SessionType[]
  availability           PractitionerAvailability[]
  bookingsAsPractitioner Booking[]            @relation("practitionerBookings")
  bookingsAsMember       Booking[]            @relation("memberBookings")
  bookingOperations      BookingOperation[]

  @@index([isCelebrity])
}

model Post {
  id         String   @id @default(cuid())
  authorId   String
  author     User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  body       String
  mediaUrl   String?
  createdAt  DateTime @default(now())

  likeCount    Int @default(0)
  commentCount Int @default(0)
  shareCount   Int @default(0)

  likes    Like[]
  comments Comment[]

  // The primary read pattern is "latest posts by author X, newest first".
  @@index([authorId, createdAt(sort: Desc)])
  @@index([createdAt(sort: Desc)])
}

model Like {
  id        String   @id @default(cuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([postId, userId])
  @@index([userId])
}

model Comment {
  id        String   @id @default(cuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  body      String
  createdAt DateTime @default(now())

  @@index([postId, createdAt])
}

model Follow {
  followerId  String
  follower    User     @relation("follower", fields: [followerId], references: [id], onDelete: Cascade)
  followingId String
  following   User     @relation("following", fields: [followingId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())

  @@id([followerId, followingId])
  @@index([followingId])
}

model Conversation {
  id          String           @id @default(cuid())
  type        ConversationType @default(DIRECT)
  title       String?
  createdAt   DateTime         @default(now())
  lastMessageAt DateTime?

  // Monotonic per-conversation message sequence. Advanced with an atomic
  // UPDATE ... increment (row lock), so concurrent sends can never collide on
  // seq without any application-level locking.
  lastSeq Int @default(0)

  members  ConversationMember[]
  messages Message[]

  @@index([lastMessageAt(sort: Desc)])
}

model ConversationMember {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  userId         String
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  joinedAt       DateTime     @default(now())

  // Read receipt is a cursor: the highest seq this member has read.
  // Compresses "read up to here" to one integer per member per conversation.
  lastReadSeq Int @default(0)

  @@unique([conversationId, userId])
  @@index([userId])
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  senderId       String
  sender         User         @relation(fields: [senderId], references: [id], onDelete: Cascade)
  body           String
  type           MessageType  @default(TEXT)

  // Server-assigned, per-conversation monotonic sequence number.
  seq        Int
  createdAt  DateTime @default(now())

  // Client idempotency key: a retried send cannot create a duplicate row.
  clientMsgId String

  @@unique([conversationId, seq])
  @@unique([senderId, clientMsgId])
  @@index([conversationId, createdAt(sort: Desc)])
}

/// Transactional outbox.
///
/// A domain write (e.g. creating a post) and the intent to do follow-up work
/// (fan the post out to followers) are committed in ONE transaction. A separate
/// relay publishes pending rows to a work queue. This removes the classic
/// dual-write problem: we never commit a post and then fail to enqueue its
/// fan-out, and we never enqueue fan-out for a post that rolled back.
///
/// The relay claims rows with `FOR UPDATE SKIP LOCKED`, so many API instances can
/// relay concurrently without stepping on each other.
model OutboxEvent {
  id          String       @id @default(cuid())
  type        String
  payload     Json
  status      OutboxStatus @default(PENDING)
  attempts    Int          @default(0)
  lastError   String?
  createdAt   DateTime     @default(now())
  availableAt DateTime     @default(now())
  relayedAt   DateTime?
  processedAt DateTime?

  @@index([status, availableAt])
}

/// Catalog of what a practitioner can be booked for. Price is stored in minor
/// units (cents) as integers — never floats — so ledger arithmetic is exact.
model SessionType {
  id              String   @id @default(cuid())
  practitionerId  String
  practitioner    User     @relation(fields: [practitionerId], references: [id], onDelete: Cascade)
  name            String
  description     String?
  durationMinutes Int
  priceCents      Int
  currency        String   @default("USD")
  active          Boolean  @default(true)
  createdAt       DateTime @default(now())

  bookings Booking[]

  @@unique([practitionerId, name])
  @@index([practitionerId, active])
}

/// Recurring weekly availability, expressed in the practitioner's local
/// wall-clock time (weekday + minutes from local midnight) plus an IANA
/// timezone. Slot lookup expands this into concrete UTC instants for the
/// requested date range.
model PractitionerAvailability {
  id             String   @id @default(cuid())
  practitionerId String
  practitioner   User     @relation(fields: [practitionerId], references: [id], onDelete: Cascade)
  /// 0 = Sunday … 6 = Saturday, in the practitioner's timezone.
  weekday        Int
  /// Minutes from local midnight, inclusive.
  startMinute    Int
  /// Minutes from local midnight, exclusive.
  endMinute      Int
  timezone       String   @default("UTC")
  createdAt      DateTime @default(now())

  @@index([practitionerId, weekday])
}

/// A reservation on a practitioner's calendar. Covers holds and firm bookings.
///
/// The overlap invariant is enforced by a PostgreSQL exclusion constraint
/// created in the migration:
///
///   EXCLUDE USING gist (
///     "practitionerId" WITH =,
///     tstzrange("startTime", "endTime", '[)') WITH &&
///   ) WHERE status IN ('HELD','PENDING','CONFIRMED')
///
/// The database, not application code, is the arbiter of who wins a race for
/// the same slot: the loser gets SQLSTATE 23P01 and we translate it to 409.
model Booking {
  id             String        @id @default(cuid())
  practitionerId String
  practitioner   User          @relation("practitionerBookings", fields: [practitionerId], references: [id], onDelete: Cascade)
  memberId       String
  member         User          @relation("memberBookings", fields: [memberId], references: [id], onDelete: Cascade)
  sessionTypeId  String
  sessionType    SessionType   @relation(fields: [sessionTypeId], references: [id])
  startTime      DateTime      @db.Timestamptz(3)
  endTime        DateTime      @db.Timestamptz(3)
  status         BookingStatus @default(PENDING)

  /// Price captured at booking time so later catalog edits do not rewrite history.
  priceCents Int
  currency   String @default("USD")

  /// Soft-reservation expiry. Only meaningful while status = HELD.
  holdExpiresAt DateTime? @db.Timestamptz(3)

  clientOpId   String?
  confirmedAt  DateTime? @db.Timestamptz(3)
  cancelledAt  DateTime? @db.Timestamptz(3)
  cancelReason String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  /// A create request with the same (member, clientOpId) is the same intent.
  @@unique([memberId, clientOpId])
  @@index([memberId, startTime(sort: Desc)])
  @@index([practitionerId, startTime])
  @@index([status, holdExpiresAt])
  @@index([status, startTime])
}

/// Idempotency ledger for mutating booking operations (reschedule, cancel,
/// hold). The unique (userId, opId) is the retry key: the first request records
/// its result, and a retry with the same op id returns that recorded result
/// instead of repeating the side effect.
model BookingOperation {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  opId      String
  action    String
  bookingId String?
  response  Json?
  createdAt DateTime @default(now())

  @@unique([userId, opId])
  @@index([createdAt])
}
````

## File: apps/api/src/config/configuration.ts
````typescript
export interface AppConfig {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  redisUrl: string;
  /** Authors with >= this many followers skip write-time fan-out (pull at read). */
  celebrityFollowerThreshold: number;
  /** Max post ids retained per user's materialized home timeline. */
  timelineMaxLength: number;
  /** How often the outbox relay polls for pending events, in ms. */
  outboxRelayIntervalMs: number;
  /** Max outbox events relayed per poll tick. */
  outboxRelayBatchSize: number;
  /** Default TTL for a soft booking hold, in seconds. */
  bookingHoldTtlSeconds: number;
  /** How often the hold sweeper releases expired holds, in ms. */
  bookingHoldSweepIntervalMs: number;
  /** Notice (hours) inside which a cancellation is flagged as late. */
  bookingCancelNoticeHours: number;
}

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3001', 10),
  databaseUrl: process.env.DATABASE_URL ?? '',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  celebrityFollowerThreshold: parseInt(
    process.env.CELEBRITY_FOLLOWER_THRESHOLD ?? '10000',
    10,
  ),
  timelineMaxLength: parseInt(process.env.TIMELINE_MAX_LENGTH ?? '800', 10),
  outboxRelayIntervalMs: parseInt(
    process.env.OUTBOX_RELAY_INTERVAL_MS ?? '500',
    10,
  ),
  outboxRelayBatchSize: parseInt(process.env.OUTBOX_RELAY_BATCH_SIZE ?? '200', 10),
  bookingHoldTtlSeconds: parseInt(process.env.BOOKING_HOLD_TTL_SECONDS ?? '120', 10),
  bookingHoldSweepIntervalMs: parseInt(
    process.env.BOOKING_HOLD_SWEEP_INTERVAL_MS ?? '1000',
    10,
  ),
  bookingCancelNoticeHours: parseInt(
    process.env.BOOKING_CANCEL_NOTICE_HOURS ?? '24',
    10,
  ),
});
````

## File: apps/api/src/posts/posts.module.ts
````typescript
import { Module } from '@nestjs/common';
import { OutboxModule } from '../outbox/outbox.module';
import { PostsController } from './posts.controller';
import { AuthorPostsController } from './author-posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [OutboxModule],
  controllers: [PostsController, AuthorPostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
````

## File: apps/api/src/posts/posts.service.ts
````typescript
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { OutboxService, POST_CREATED } from '../outbox/outbox.service';
import { decodeCursor, encodeCursor } from '../common/cursor';
import { Page } from '../common/dto/pagination.dto';

export const POST_INCLUDE = {
  author: {
    select: {
      id: true,
      handle: true,
      displayName: true,
      avatarUrl: true,
      role: true,
      headline: true,
      isCelebrity: true,
    },
  },
} satisfies Prisma.PostInclude;

export type PostWithAuthor = Prisma.PostGetPayload<{ include: typeof POST_INCLUDE }>;

export interface PostDto {
  id: string;
  body: string;
  mediaUrl: string | null;
  createdAt: Date;
  author: PostWithAuthor['author'];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  liked: boolean;
}

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly outbox: OutboxService,
  ) {}

  async create(params: {
    authorId: string;
    body: string;
    mediaUrl?: string;
  }): Promise<PostDto> {
    // The post and its fan-out intent commit atomically. The request returns
    // without touching follower timelines: fan-out is unbounded in follower
    // count and must not sit in the write path. A relay + worker do it after.
    const post = await this.prisma.$transaction(async (tx) => {
      const created = await tx.post.create({
        data: {
          authorId: params.authorId,
          body: params.body,
          mediaUrl: params.mediaUrl,
        },
        include: POST_INCLUDE,
      });
      await this.outbox.emit(tx, POST_CREATED, {
        postId: created.id,
        authorId: created.authorId,
        createdAt: created.createdAt.toISOString(),
        authorIsCelebrity: created.author.isCelebrity,
      });
      return created;
    });

    return this.serialize(post, params.authorId);
  }

  async listByAuthor(params: {
    authorId: string;
    viewerId: string;
    cursor?: string;
    limit: number;
  }): Promise<Page<PostDto>> {
    const { authorId, viewerId, cursor, limit } = params;
    const decoded = decodeCursor(cursor);
    const cursorDate = decoded ? new Date(Number(decoded[0])) : null;

    const where: Prisma.PostWhereInput = {
      authorId,
      ...(cursorDate
        ? {
            OR: [
              { createdAt: { lt: cursorDate } },
              { createdAt: cursorDate, id: { lt: decoded![1] } },
            ],
          }
        : {}),
    };

    const rows = await this.prisma.post.findMany({
      where,
      include: POST_INCLUDE,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
    });

    const hasMore = rows.length > limit;
    const pageRows = hasMore ? rows.slice(0, limit) : rows;
    const items = await this.serializeMany(pageRows, viewerId);

    return {
      items,
      nextCursor: hasMore
        ? encodeCursor([
            pageRows[pageRows.length - 1].createdAt.getTime(),
            pageRows[pageRows.length - 1].id,
          ])
        : null,
    };
  }

  async getPost(id: string, viewerId: string): Promise<PostDto> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: POST_INCLUDE,
    });
    if (!post) throw new NotFoundException('Post not found');
    return this.serialize(post, viewerId);
  }

  async remove(id: string, viewerId: string): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== viewerId) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    await this.prisma.post.delete({ where: { id } });
  }

  async like(postId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
    await this.prisma
      .$transaction(async (tx) => {
        await tx.like.create({ data: { postId, userId } });
        await tx.post.update({
          where: { id: postId },
          data: { likeCount: { increment: 1 } },
        });
      })
      .catch((err) => {
        // Idempotent double-tap: already liked is not an error.
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2002'
        ) {
          return;
        }
        throw err;
      });
    return this.likeState(postId, userId);
  }

  async unlike(postId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
    const existing = await this.prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (existing) {
      await this.prisma.$transaction(async (tx) => {
        await tx.like.delete({ where: { id: existing.id } });
        await tx.post.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } },
        });
      });
    }
    return this.likeState(postId, userId);
  }

  private async likeState(postId: string, userId: string) {
    const [post, like] = await Promise.all([
      this.prisma.post.findUniqueOrThrow({
        where: { id: postId },
        select: { likeCount: true },
      }),
      this.prisma.like.findUnique({
        where: { postId_userId: { postId, userId } },
      }),
    ]);
    return { liked: !!like, likeCount: post.likeCount };
  }

  async addComment(params: { postId: string; authorId: string; body: string }) {
    const post = await this.prisma.post.findUnique({
      where: { id: params.postId },
      select: { id: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    const [comment] = await this.prisma.$transaction([
      this.prisma.comment.create({
        data: {
          postId: params.postId,
          authorId: params.authorId,
          body: params.body,
        },
        include: {
          author: {
            select: { id: true, handle: true, displayName: true, avatarUrl: true },
          },
        },
      }),
      this.prisma.post.update({
        where: { id: params.postId },
        data: { commentCount: { increment: 1 } },
      }),
    ]);
    return comment;
  }

  async listComments(postId: string, limit = 50) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: { id: true, handle: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  async serializeMany(posts: PostWithAuthor[], viewerId: string): Promise<PostDto[]> {
    if (posts.length === 0) return [];
    const liked = await this.prisma.like.findMany({
      where: { userId: viewerId, postId: { in: posts.map((p) => p.id) } },
      select: { postId: true },
    });
    const likedSet = new Set(liked.map((l) => l.postId));
    return posts.map((p) => this.toDto(p, likedSet.has(p.id)));
  }

  serialize(post: PostWithAuthor, viewerId: string): Promise<PostDto> {
    return this.serializeMany([post], viewerId).then((r) => r[0]);
  }

  hydrateIds(ids: string[]): Promise<PostWithAuthor[]> {
    if (ids.length === 0) return Promise.resolve([]);
    return this.prisma.post.findMany({
      where: { id: { in: ids } },
      include: POST_INCLUDE,
    });
  }

  private toDto(post: PostWithAuthor, liked: boolean): PostDto {
    return {
      id: post.id,
      body: post.body,
      mediaUrl: post.mediaUrl,
      createdAt: post.createdAt,
      author: post.author,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      shareCount: post.shareCount,
      liked,
    };
  }
}
````

## File: apps/api/src/app.module.ts
````typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { QueueModule } from './queue/queue.module';
import { OutboxModule } from './outbox/outbox.module';
import { FanoutModule } from './fanout/fanout.module';
import { RealtimeModule } from './realtime/realtime.module';
import { TimelineModule } from './timeline/timeline.module';
import { UsersModule } from './users/users.module';
import { FollowModule } from './follow/follow.module';
import { PostsModule } from './posts/posts.module';
import { FeedModule } from './feed/feed.module';
import { ChatModule } from './chat/chat.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { MetricsModule } from './metrics/metrics.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PrismaModule,
    RedisModule,
    QueueModule,
    OutboxModule,
    FanoutModule,
    RealtimeModule,
    TimelineModule,
    UsersModule,
    FollowModule,
    PostsModule,
    FeedModule,
    ChatModule,
    SchedulingModule,
    MetricsModule,
    HealthModule,
  ],
})
export class AppModule {}
````

## File: apps/api/test/app.e2e-spec.ts
````typescript
import { INestApplication } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { PrismaService } from '../src/prisma/prisma.service';
import { RedisService } from '../src/redis/redis.service';

/**
 * End-to-end flow against real Postgres + Redis (see docker-compose.yml).
 * Covers the parts that unit tests can't: DI wiring, guards, validation,
 * persistence and the feed read path.
 */
describe('Tangerine API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userA: string;
  let userB: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    prisma = app.get(PrismaService);
    const users = await prisma.user.findMany({ take: 2, orderBy: { id: 'asc' } });
    userA = users[0].id;
    userB = users[1].id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health reports db and redis up', async () => {
    const res = await request(app.getHttpServer()).get('/api/health').expect(200);
    expect(res.body).toMatchObject({ db: 'up', redis: 'up' });
  });

  it('exposes pre-registered identities without auth (demo bootstrap)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/session/identities')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('handle');
  });

  it('rejects requests with no x-user-id header', async () => {
    await request(app.getHttpServer()).get('/api/users/me').expect(401);
  });

  it('returns the current user profile', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('x-user-id', userA)
      .expect(200);
    expect(res.body.id).toBe(userA);
  });

  it('returns a paginated home feed with an opaque cursor', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/feed?limit=5')
      .set('x-user-id', userA)
      .expect(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeLessThanOrEqual(5);
    if (res.body.nextCursor) {
      const page2 = await request(app.getHttpServer())
        .get(`/api/feed?limit=5&cursor=${encodeURIComponent(res.body.nextCursor)}`)
        .set('x-user-id', userA)
        .expect(200);
      const ids1 = new Set(res.body.items.map((i: { id: string }) => i.id));
      for (const item of page2.body.items) {
        expect(ids1.has(item.id)).toBe(false);
      }
    }
  });

  it('creates a post and fans it out to a follower feed (async)', async () => {
    // Deterministic: make userB a non-celebrity so the post takes the *push*
    // path rather than the read-time celebrity pull.
    await prisma.user.update({
      where: { id: userB },
      data: { isCelebrity: false },
    });
    // userA follows userB.
    await prisma.follow.upsert({
      where: { followerId_followingId: { followerId: userA, followingId: userB } },
      create: { followerId: userA, followingId: userB },
      update: {},
    });

    const created = await request(app.getHttpServer())
      .post('/api/posts')
      .set('x-user-id', userB)
      .send({ body: 'e2e fan-out probe' })
      .expect(201);
    expect(created.body.id).toBeDefined();

    // The write returns before fan-out. Assert the outbox event exists and is
    // eventually processed, and that the post lands in userA's Redis timeline.
    const redis = app.get(RedisService);
    const deadline = Date.now() + 8000;
    let inTimeline = null as string | null;
    while (Date.now() < deadline) {
      inTimeline = await redis.client.zscore(
        `timeline:${userA}`,
        created.body.id,
      );
      if (inTimeline) break;
      await new Promise((r) => setTimeout(r, 200));
    }
    expect(inTimeline).not.toBeNull();

    const processed = await prisma.outboxEvent.findFirst({
      where: { payload: { path: ['postId'], equals: created.body.id } },
    });
    expect(['RELAYED', 'PROCESSED']).toContain(processed?.status);
  });

  it('sends and lists chat messages', async () => {
    const conv = await request(app.getHttpServer())
      .post('/api/conversations/direct')
      .set('x-user-id', userA)
      .send({ userId: userB })
      .expect(201);

    const sent = await request(app.getHttpServer())
      .post(`/api/conversations/${conv.body.id}/messages`)
      .set('x-user-id', userA)
      .send({ body: 'hello from e2e', clientMsgId: `e2e-${Date.now()}` })
      .expect(201);
    expect(sent.body.seq).toBeGreaterThan(0);

    const list = await request(app.getHttpServer())
      .get(`/api/conversations/${conv.body.id}/messages`)
      .set('x-user-id', userA)
      .expect(200);
    expect(list.body.items.some((m: { id: string }) => m.id === sent.body.id)).toBe(
      true,
    );
  });
});
````

## File: apps/api/package.json
````json
{
  "name": "@tangerine/api",
  "version": "0.1.0",
  "private": true,
  "description": "Tangerine API — NestJS (Fastify) + Prisma + Redis: social feed with hybrid fan-out and real-time chat.",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:reset": "prisma migrate reset --force",
    "prisma:seed": "prisma db seed",
    "prisma:studio": "prisma studio",
    "perf:seed-bookings": "ts-node --project performance/tsconfig.json performance/seed-bookings.ts",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json --runInBand --forceExit"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  },
  "dependencies": {
    "@fastify/static": "^10.1.6",
    "@nestjs/bullmq": "^11.0.0",
    "@nestjs/common": "^11.0.0",
    "@nestjs/config": "^4.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-fastify": "^11.0.0",
    "@nestjs/platform-socket.io": "^11.0.0",
    "@nestjs/swagger": "^11.0.0",
    "@nestjs/websockets": "^11.0.0",
    "@prisma/client": "^6.2.0",
    "@socket.io/redis-adapter": "^8.3.0",
    "bullmq": "^5.34.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "fastify": "^5.2.0",
    "ioredis": "^5.4.1",
    "prom-client": "^15.1.3",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "socket.io": "^4.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.0",
    "@types/jest": "^29.5.14",
    "@types/node": "^22.10.5",
    "@types/supertest": "^6.0.2",
    "jest": "^29.7.0",
    "prisma": "^6.2.0",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.7.3"
  }
}
````

## File: .env.example
````
# Postgres (matches docker-compose.yml)
# connection_limit/pool_timeout matter under write contention: the default
# Prisma pool (2*cores+1) saturates and requests queue past the pool timeout.
DATABASE_URL="postgresql://tangerine:tangerine@localhost:5432/tangerine?schema=public&connection_limit=40&pool_timeout=20"

# Redis
REDIS_URL="redis://localhost:6379"

# API
PORT=3001
NODE_ENV=development

# --- Feed tuning ---
# Authors with at least this many followers are treated as "celebrities":
# their posts are NOT fanned out on write and are instead pulled at read time.
# Set low (15) for the demo so the hybrid fan-out path is visible with a
# realistic-sized follower graph; a real deployment would use ~10_000.
CELEBRITY_FOLLOWER_THRESHOLD=15
# Max number of post ids kept in each user's materialized home timeline (Redis ZSET).
TIMELINE_MAX_LENGTH=800

# --- Outbox relay ---
# The outbox relay polls for pending events and publishes them to the queue.
OUTBOX_RELAY_INTERVAL_MS=500
OUTBOX_RELAY_BATCH_SIZE=200

# Frontend
VITE_API_URL="http://localhost:3001"
````

## File: pnpm-workspace.yaml
````yaml
packages:
  - "apps/*"

# Allow these dependencies to run their install/build scripts (pnpm 10+ blocks
# postinstall scripts by default). Needed by Prisma (engine download) and
# esbuild (native binary used by Vite).
allowBuilds:
  "@prisma/client": true
  "@prisma/engines": true
  "@scarf/scarf": true
  esbuild: true
  msgpackr-extract: true
  prisma: true
````

## File: README.md
````markdown
# Tangerine

A social health platform demo: a **feed** and **realtime chat** for members,
practitioners and providers. This is not a finished product — it is a focused,
opinionated slice built to show how I design and ship backend systems: correct
data models, the right abstractions at the right time, tests, and code you can
hand to another engineer.

Onboarding, signup, payments and compliance flows are **deliberately abstracted
away** (see [What is intentionally out of scope](#what-is-intentionally-out-of-scope)).
Identity is mocked with a user switcher so the interesting problems — feed
fan-out and realtime messaging — stay front and centre.

```
┌────────────────────────┐        REST (x-user-id)         ┌──────────────────────────┐
│  React + Vite + TS      │ ───────────────────────────────▶│  NestJS on Fastify       │
│  dark-only UI           │ ◀───────────────────────────────│  (modular monolith)      │
│  Feed · Chat            │        Socket.IO (realtime)     │  Prisma · ioredis        │
└────────────────────────┘                                  └───────────┬──────────────┘
                                                                        │
                                                     ┌──────────────────┴──────────────────┐
                                                     │                                     │
                                              ┌──────▼──────┐                      ┌───────▼───────┐
                                              │ PostgreSQL  │  source of truth     │    Redis      │  derived: timelines,
                                              │  (Prisma)   │                      │               │  presence, pub/sub
                                              └─────────────┘                      └───────────────┘
```

## Stack

| Layer      | Choice                              | Why                                                             |
| ---------- | ----------------------------------- | --------------------------------------------------------------- |
| Frontend   | React 18 + Vite + TypeScript        | Fast, typed, no framework overhead for two screens              |
| Backend    | **NestJS** on the **Fastify** adapter | Real application architecture (modules, DI, guards, gateways) with Fastify's throughput underneath |
| Database   | PostgreSQL 18 + **Prisma**          | Relational source of truth; typed client and real migrations    |
| Cache/RT   | Redis 7 + ioredis + Socket.IO adapter | Materialized timelines, presence TTLs, cross-instance fan-out |
| Realtime   | Socket.IO gateways                  | Rooms, acks, and a Redis adapter for horizontal scale          |
| Infra      | Docker Compose, pnpm workspaces     | One command to start everything; clean monorepo boundaries      |

Stack decisions, trade-offs and scaling limits are documented in
[docs/architecture.md](docs/architecture.md).

## Quick start

```bash
# 1. Postgres + Redis
docker compose up -d

# 2. Install (pnpm workspace)
pnpm install

# 3. Schema + demo data
pnpm db:migrate
pnpm db:seed

# 4. Run the API (http://localhost:3001, docs at /docs) and the web app (http://localhost:5173)
pnpm dev:api
pnpm dev:web
```

The API reads `apps/api/.env` (see `.env.example`). The web app reads
`VITE_API_URL` and defaults to `http://localhost:3001`.

## Engineering highlights

These are the parts worth reading. Each is a deliberate answer to a real
system-design problem, not decoration.

### Feed — hybrid fan-out with keyset pagination

The read-to-write ratio on a feed is ~100:1, so the default is to precompute
reads. But pure fan-out-on-write collapses the moment one author has a huge
following: a single post becomes millions of cache writes ("the celebrity
problem").

- **Push for normal authors** — `TimelineService.fanoutPost` inserts a post
  *pointer* into every follower's Redis sorted set (`timeline:{userId}`), scored
  by publish time, trimmed to a bounded length. Reads are one `ZREVRANGE`.
- **Pull for celebrities** — authors whose `followerCount` crosses a threshold
  are flagged `isCelebrity`; their posts are **not** pushed. At read time
  `FeedService` merges the pushed timeline with a bounded pull of each celebrity
  followee's outbox. The threshold is a single tunable (`CELEBRITY_FOLLOWER_THRESHOLD`).
- **Pointers, not copies** — timelines store post ids, so edits/deletes and
  counter changes never rewrite millions of timelines; content is hydrated at
  read time.
- **Graceful degradation** — a cold cache (or a brand-new follow) falls back to
  a bounded read-time backfill from Postgres, so the feed is never empty.
- **Keyset (cursor) pagination, never offsets** — offsets break when new posts
  arrive at the top. Cursors encode a stable `(createdAt, id)` position.

Try it: the seed flags two practitioners as celebrities. Post as one of them and
watch the post appear in a follower's feed via the *pull* path (the timeline
cache never receives it).

### Async fan-out — transactional outbox + worker

Fan-out is unbounded in follower count, so it must never sit in the request path.
Rather than the classic dual-write bug (write the post, *then* enqueue — and lose
the enqueue if the process dies), the post and its fan-out intent commit **in one
transaction**:

1. `POST /posts` writes the `Post` **and** an `OutboxEvent` in the same Prisma
   transaction, then returns. It never touches follower timelines.
2. An **outbox relay** polls pending rows and publishes them to a **BullMQ**
   queue. It claims rows with `FOR UPDATE SKIP LOCKED`, so any number of API
   instances relay concurrently with no coordination, and `jobId = eventId`
   makes publishing idempotent across crashes.
3. A **BullMQ worker** performs the fan-out with exponential-backoff retries.
   Fan-out is idempotent by construction (a timeline is a sorted set keyed by post
   id), so at-least-once delivery is safe. After the final attempt the event is
   marked `FAILED` — a durable dead-letter row, not a lost job.

`GET /api/metrics` exposes the two numbers you actually alert on: **outbox lag**
(age of the oldest pending event) and **queue depth** by state.

### Chat — ordering and idempotency are the server's job

- **Server-assigned sequence.** Each conversation has a monotonic `lastSeq`,
  advanced with an atomic `UPDATE … increment` (a row lock). Concurrent sends
  can never collide on `seq` without application-level locking, and every
  participant sees the same order — client clocks are never trusted.
- **Idempotent sends.** A `clientMsgId` unique per sender is the retry key. A
  duplicate send returns the original message instead of inserting a second one;
  a lost idempotency race is resolved by returning the winner.
- **Store-and-forward.** Messages are persisted first; a client that was offline
  catches up via `GET /conversations/:id/messages?cursor=<seq>`. The WebSocket
  push is an optimization, the pull is the guarantee.
- **Read receipts as a cursor.** One integer per member per conversation
  (`lastReadSeq`), advanced with `GREATEST` so out-of-order acks never regress it.
- **Presence via TTL.** A Redis key with a 60s TTL refreshed by heartbeats. A
  dropped connection simply expires — no disconnect bookkeeping, robust to
  crashes and network partitions.
- **Scale-out.** The Socket.IO Redis adapter lets any API instance deliver an
  event to a socket held by another instance.

### Scheduling & booking — the database arbitrates contention

A booking race is a correctness problem disguised as a performance problem. The
obvious implementation — read the calendar, check for an overlap, insert — is a
check-then-insert race that silently double-books under concurrency. Tangerine
makes the **database** the arbiter:

- **One exclusion constraint owns the invariant.** A single PostgreSQL `EXCLUDE
  USING gist` constraint over `(practitionerId, tstzrange(startTime, endTime))`
  covers both firm bookings *and* soft holds, so no two live reservations can
  overlap. The loser of a race gets SQLSTATE `23P01`, which the API translates
  to a clean `409` — never application-level locking.
- **Holds are bookings with an expiry**, not a second table. That is the whole
  reason a hold can block a booking atomically: they share one exclusion index.
  A hold is released by flipping its status, which instantly frees the slot.
- **Idempotent mutations.** `reschedule` and `cancel` take a client `opId`; the
  first request records its result in an idempotency ledger keyed by
  `(userId, opId)`, and a retry returns the recorded result instead of moving
  the booking twice.
- **Contention is serialized on the contended slot, not retried.** A GiST
  exclusion index deadlocks under a multi-way race (a documented PostgreSQL
  limitation), so booking takes a transaction-scoped **advisory lock keyed by
  `(practitioner, startTime)`** before the insert. The constraint stays as the
  backstop; the lock removes the deadlock. Benchmark: 200/200 races with exactly
  one winner and zero `5xx` (baseline: 230 `5xx`).
- **Timezone-aware slots.** Availability is stored as the practitioner's local
  wall clock plus an IANA zone; slot lookup expands it to UTC instants (DST and
  all) and subtracts live reservations, with an optional `maxSlots` cap.
- **Confirmation rides the outbox.** A confirmed booking emits
  `booking.confirmed` through the same transactional outbox as post fan-out, so
  the notification pipeline can consume it durably.

The benchmarks in `docs/performance/` prove the invariants under load — and
expose what actually breaks first (the connection pool, not the constraint).

### Backend craft

- Modular monolith with clear boundaries (`users`, `follow`, `posts`, `feed`,
  `timeline`, `chat`, `realtime`, `redis`, `prisma`) and no import cycles —
  fan-out lives in its own module precisely so the feed can depend on posts
  without a cycle.
- **Prisma transactions** keep denormalized counters consistent with the writes
  that change them.
- Global validation pipe, a single error-envelope filter, and translation of
  Prisma errors to correct HTTP codes.
- Swagger generated from DTOs at `/docs`.

## API surface

All routes are under `/api` and authenticate with the mock `x-user-id` header.
Full, interactive docs at `http://localhost:3001/docs`.

| Area    | Endpoints                                                                 |
| ------- | ------------------------------------------------------------------------- |
| Session | `GET /session/identities` (demo-only, unauthenticated)                    |
| Users   | `GET /users`, `GET /users/me`, `GET /users/:id`, `POST/DELETE /users/:id/follow` |
| Posts   | `POST /posts`, `GET/DELETE /posts/:id`, `POST/DELETE /posts/:id/like`, `GET/POST /posts/:id/comments`, `GET /users/:id/posts` |
| Feed    | `GET /feed?limit&cursor`                                                   |
| Chat    | `GET /conversations`, `POST /conversations/direct`, `GET/POST /conversations/:id/messages`, `POST /conversations/:id/read` |
| Scheduling | `GET/POST /session-types`, `GET/PUT /practitioners/me/availability`, `GET /practitioners/:id/slots`, `POST/GET /bookings`, `POST /bookings/:id/reschedule`, `POST /bookings/:id/cancel`, `POST /holds`, `DELETE /holds/:id` |
| Ops     | `GET /metrics` (Prometheus: outbox lag, queue depth, booking outcomes, Node runtime), `GET /health`        |

### Socket events

Client → server: `conversation:join`, `message:send`, `message:read`, `typing`,
`presence:heartbeat`. Server → client: `message:new`, `read:update`,
`typing:update`, `presence:update`.

## Data model

Postgres is the source of truth; Redis only ever holds derivable state
(timelines, presence), which is why a cold Redis is a non-event rather than a
data-loss incident.

```
User ─┬─< Post ─┬─< Like
      │         └─< Comment
      ├─< Follow (follower/following)
      ├─< ConversationMember >─ Conversation ─< Message
      └─< Message
```

## Testing

```bash
pnpm test          # unit tests (no infra needed)
pnpm test:e2e      # end-to-end against real Postgres + Redis
```

- Unit tests cover the invariants that are easy to get wrong: the cursor
  round-trip, chat idempotency, server sequencing, and the
  unique-constraint-race resolution.
- The e2e suite drives the real app: guard rejection, feed pagination without
  duplicate ids across pages, fan-out reaching a follower's feed, and the
  send/list chat flow.

## Performance program

This project's deliverable is evidence, not features. `docs/performance/`
contains the methodology, machine spec, and one write-up per measured scenario
(hypothesis → methodology → results → analysis → optimization → what it proves).

- **Instrumentation**: Prometheus + Grafana (provisioned, `docker compose up -d`),
  `pg_stat_statements`, rich `/api/metrics` (outbox lag, queue depth, booking
  outcomes, event-loop lag, heap), and a k6 harness in `apps/api/performance/`.
- **Scheduling scenarios**: booking contention, slot lookup under load,
  reschedule idempotency, hold-expiry accuracy.
- **Existing-system scenario**: warm feed read throughput.

```bash
pnpm infra:up                       # postgres + redis + prometheus + grafana
pnpm db:seed
pnpm --filter @tangerine/api perf:seed-bookings   # synthetic slot-lookup data
RUN_STAMP=local bash apps/api/performance/run-scheduling.sh
node apps/api/performance/report.mjs apps/api/performance/results/local
```

Grafana: <http://localhost:3000/d/tangerine-api> · Prometheus: <http://localhost:9090>

## Project layout

```
tangerine/
├─ apps/
│  ├─ api/                 # NestJS + Fastify + Prisma + Redis
│  │  ├─ prisma/           # schema, migrations, deterministic seed
│  │  ├─ performance/      # k6 harness, seed + report scripts
│  │  ├─ src/
│  │  │  ├─ feed/          # hybrid fan-out read path
│  │  │  ├─ timeline/      # Redis materialized timelines
│  │  │  ├─ outbox/        # transactional outbox + relay
│  │  │  ├─ fanout/        # BullMQ worker (async fan-out)
│  │  │  ├─ queue/         # BullMQ connection/queue wiring
│  │  │  ├─ scheduling/    # conflict-safe booking, holds, idempotency
│  │  │  ├─ metrics/       # Prometheus registry + HTTP instrumentation
│  │  │  ├─ posts/ users/ follow/
│  │  │  ├─ chat/          # service, gateway, REST
│  │  │  ├─ realtime/      # socket server handle + presence
│  │  │  └─ common/ redis/ prisma/ config/
│  │  └─ test/             # e2e (including scheduling invariants)
│  └─ web/                 # React + Vite (dark-only)
├─ infra/                  # Prometheus scrape config + Grafana provisioning
├─ docs/performance/       # benchmark write-ups + optimization log
├─ docker-compose.yml
└─ pnpm-workspace.yaml
```

## What is intentionally out of scope

Abstracted so the backend is the focus, and called out honestly rather than
hidden:

- **Auth** — no signup/session issuance; identity is an `x-user-id` header
  resolved by one guard. Swapping in JWT/session verification touches one file.
- **Onboarding, consent, verification, moderation, payments** — the compliance
  and commerce layer from the product's full feature list.
- **Media** — posts carry an optional `mediaUrl`; there is no upload pipeline.
- **Push notifications** — offline users catch up on reconnect, but there is no
  APNs/FCM integration.

## Where this would go next

- Rate limiting + idempotency keys at the API edge; a CI pipeline that runs the
  full build + test + migrate flow on every push.
- Group chat fan-out and message search.
````
