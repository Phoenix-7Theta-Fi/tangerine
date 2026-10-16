# Health Monitoring — Research Memo

Scope: the clinical health-monitoring capability added on
`feature/health-monitoring`. This memo records the external contracts and
version-specific behaviours the implementation depends on, with sources. Every
claim below was checked against current documentation during this work; where a
decision rests on one of these sources it is cited inline.

The feature tracks, per patient: time-series **observations** (vitals, labs,
activity, sleep, nutrition), discrete **clinical events** (conditions,
encounters, procedures, medication orders), a **reference-range catalog**,
**adherence events**, and **protocol** schedules. Derived views (trends,
adherence rates, protocol progress) are computed on read; nothing derived is
stored (G6).

---

## 1. FHIR R4 resource shapes

The system ingests FHIR R4 transaction/batch bundles. The resources it
understands and the fields it maps are:

| FHIR R4 resource | Fields used | Maps to |
| --- | --- | --- |
| `Patient` | `id`, `identifier`, `gender`, `birthDate`, `name` | `PatientProfile` (demographics for range resolution) |
| `Observation` | `id`, `status`, `category`, `code`, `subject`, `effective[x]`, `issued`, `value[x]`, `valueQuantity.{value,unit,system,code}`, `referenceRange` | `Observation` |
| `Condition` | `id`, `clinicalStatus`, `verificationStatus`, `code`, `subject`, `onset[x]`, `recordedDate` | `ClinicalEvent(type=CONDITION)` |
| `Encounter` | `id`, `status`, `class`, `type`, `subject`, `period` | `ClinicalEvent(type=ENCOUNTER)` |
| `Procedure` | `id`, `status`, `code`, `subject`, `performed[x]` | `ClinicalEvent(type=PROCEDURE)` |
| `MedicationRequest` | `id`, `status`, `intent`, `medication[x]`, `subject`, `authoredOn`, `reasonReference` | `ClinicalEvent(type=MEDICATION_ORDER)` |

Verified structure notes:

- `Observation.code` and `Observation.value[x]` are the two elements the whole
  resource pivots on; `category` classifies the observation (`vital-signs`,
  `laboratory`, `activity`, `social-history`, …). `referenceRange` is 0..* and
  multiple ranges are interpreted as OR (distinct target populations).
  [HL7 FHIR R4 Observation](http://hl7.org/fhir/R4/observation.html)
- `Observation.effective[x]` is the clinically relevant time; `issued` is when
  the result was made available — they differ for out-of-order lab results and
  are the reason the store keeps both. (Same source.)
- `Observation.valueQuantity` carries a UCUM `system`
  (`http://unitsofmeasure.org`), a human-readable `unit`, and a machine `code`.
  The vital-signs profile fixes the system and expects a UCUM code.
  [FHIR Vital Signs profile](https://build.fhir.org/branches/master/vitalsigns.html)
- `MedicationRequest.status` and `.intent` are 1..1 required coded elements;
  `subject` is mandatory. The medication is `medicationCodeableConcept` or
  `medicationReference`.
  [HL7 FHIR R4 MedicationRequest](http://hl7.org/fhir/R4/medicationrequest.html)
- Blood pressure is a panel (LOINC `85354-9`): `8480-6` systolic and `8462-4`
  diastolic as components of one observation, each a `valueQuantity` in
  `mm[Hg]`.
  [FHIR vitals value set](https://www.hl7.org/fhir/valueset-observation-vitalsignresult.html)

The generator emits **transaction Bundles** (`type: "transaction"` with
`request` entries) because that is the shape a hospital interface produces, and
it makes the ingestion endpoint's "verify bundle, extract resources, write to
append-only stores" contract realistic. Synthea's default FHIR record is a
per-patient bundle containing exactly these resources.
[Synthea records wiki](https://github.com/synthetichealth/synthea/wiki/Records)

---

## 2. LOINC and UCUM conventions

LOINC codes identify *what* was measured; UCUM codes identify *in what unit*.
Both are versioned external code systems, so the app stores the code, its
system URL (`http://loinc.org`, `http://unitsofmeasure.org`), and the display,
never a translated enum. The tracked biomarkers:

| LOINC | Display | UCUM unit | Category |
| --- | --- | --- | --- |
| `29463-7` | Body weight | `kg` | vital-signs |
| `8302-2` | Body height | `cm` | vital-signs |
| `39156-5` | Body mass index | `kg/m2` | vital-signs |
| `8867-4` | Heart rate | `/min` | vital-signs |
| `9279-1` | Respiratory rate | `/min` | vital-signs |
| `8310-5` | Body temperature | `Cel` | vital-signs |
| `8480-6` | Systolic blood pressure | `mm[Hg]` | vital-signs |
| `8462-4` | Diastolic blood pressure | `mm[Hg]` | vital-signs |
| `2708-6` | Oxygen saturation (arterial) | `%` | vital-signs |
| `4548-4` | Hemoglobin A1c | `%` | laboratory |
| `2339-0` | Glucose [Mass/volume] in Blood | `mg/dL` | laboratory |
| `2093-3` | Cholesterol [Mass/volume] | `mg/dL` | laboratory |
| `2085-9` | HDL cholesterol | `mg/dL` | laboratory |
| `13457-7` | LDL cholesterol | `mg/dL` | laboratory |
| `2571-8` | Triglycerides | `mg/dL` | laboratory |
| `2160-0` | Creatinine [Mass/volume] | `mg/dL` | laboratory |
| `33914-3` | eGFR (CKD-EPI) | `mL/min/{1.73_m2}` | laboratory |
| `718-7` | Hemoglobin [Mass/volume] | `g/dL` | laboratory |
| `6690-2` | Leukocytes [#/volume] | `10*3/uL` | laboratory |
| `777-3` | Platelets [#/volume] | `10*3/uL` | laboratory |
| `3016-3` | Thyrotropin (TSH) | `mIU/L` | laboratory |
| `2951-2` | Sodium | `mmol/L` | laboratory |
| `2823-3` | Potassium | `mmol/L` | laboratory |
| `1742-6` | Alanine aminotransferase (ALT) | `U/L` | laboratory |
| `1920-8` | Aspartate aminotransferase (AST) | `U/L` | laboratory |
| `55423-8` | Number of steps (pedometer) | `{steps}` | activity |
| `93832-4` | Sleep duration | `h` | activity |

Code/display verification: the vital-signs LOINC block and HbA1c.
[FHIR vitals value set](https://www.hl7.org/fhir/valueset-observation-vitalsignresult.html),
[LOINC 4548-4](https://loinc.org/4548-4) (HbA1c — the US/NGSP code),
[LOINC 8867-4](https://loinc.org/8867-4),
[LOINC 8480-6](https://loinc.org/8480-6).
UCUM is the value set `http://hl7.org/fhir/ValueSet/ucum-units`.
[UCUM value set](https://build.fhir.org/valueset-ucum-units.ttl.html).

**Decision:** codes are stored as `(code, codeSystem, display)` triples. The app
never assumes a code is valid without a catalog entry; a lab observation with no
resolvable reference range is a validation error at ingest (§7).

---

## 3. Reference-range resolution

A reference range is a function of `(code, unit, sex-at-birth, age-at-
observation, effective period)`, not of the code alone. Paediatric ranges differ
from adult ranges for the same analyte, and many analytes are sex-specific
(e.g. haemoglobin, creatinine). FHIR expresses this as
`Observation.referenceRange[].{low,high,age,text}` with the interpretation
carried separately by `Observation.interpretation` (e.g. `N`, `L`, `H`, `LL`,
`HH` from the *ObservationInterpretation* code system).
[HL7 FHIR R4 Observation](http://hl7.org/fhir/R4/observation.html),
[ObservationInterpretation](https://terminology.hl7.org/ValueSet-v3-ObservationInterpretation.html)

**Decision:** the catalog is a table keyed by
`(code, codeSystem, sex, ageMinDays, ageMaxDays, effectiveFrom)` with nullable
sex and age bounds meaning "any", plus `lowValue`, `highValue`, and optional
critical bounds. Resolution picks the *most specific* matching row: a row with a
matching sex and a narrower age band beats a wildcard row. The resolved range is
derived at read time and never written onto the observation (G6). This is why
"the same value reads normal for an adult and low for a neonate" is a property
of the query, not of stored data.

---

## 4. Synthetic data generation

**Chosen generator: a deterministic, offline generator that emits Synthea-shaped
FHIR R4 transaction Bundles** (`apps/api/prisma/synthetic/generate-health-seed.mjs`
→ committed `apps/api/prisma/synthetic/health-population.json.gz`, read via
`apps/api/prisma/synthetic/load-health-seed.ts`).

Rationale: the handoff requires an *offline, deterministic seed bundle committed
to the repo*, with no runtime dependency on the generator. Synthea itself
requires a JDK 17/25 LTS (the local JDK is 26) and a Gradle build; its output is
per-patient bundles whose contents are randomised per run. A seeded generator
gives byte-identical output, runs in Node with the repo's existing toolchain,
and is patched to emit the exact resource subset the ingestion pipeline must
handle. The generator intentionally mirrors Synthea's resource set so the same
bundles could be produced by Synthea unchanged.
[Synthea](https://github.com/synthetichealth/synthea),
[Synthea records](https://github.com/synthetichealth/synthea/wiki/Records),
[Synthea CSV data dictionary](https://github.com/synthetichealth/synthea/wiki/CSV-File-Data-Dictionary).

Mapping generator output → internal tables is 1:1 by resource type (§1 table).
The generator is seeded (`SEED`, default `20261016`; `PATIENTS`, default `100`),
produces 100 living patients with conditions, medication orders, encounters,
procedures and a longitudinal observation history (6,346 observations across
vitals, labs and device activity), and writes a single gzipped JSON file plus a
`meta` block with per-resource counts so the seed script can assert coverage.
Regenerating with the same `SEED`/`PATIENTS` yields byte-identical output; the
committed artifact is 336 KiB gzipped. The generator validates its own
referential invariants (every lab observation resolves a reference range; every
medication order references a condition) before writing, and exits non-zero on
violation.

---

## 5. Time-series modelling in PostgreSQL 18

The trend query is "latest value per code, plus the value at a lookback
instant". This is a classic window-function problem: `row_number()`/
`distinct on` for the latest, `lag()` for the previous value, both partitioned
by `(patientId, code, unit)` and ordered by `effectiveAt`.
[PostgreSQL 18 — Window Functions](https://www.postgresql.org/docs/current/functions-window.html).

Indexing strategy for the append-only observation table:

- a btree on `(patientId, code, effectiveAt DESC)` serves the hot
  "trend for one patient+code" path;
- a **BRIN** index on `effectiveAt` serves wide time-range scans cheaply
  because rows are appended in time order, giving high physical/logical
  correlation. BRIN summaries are per block range and are tiny next to a btree.
  [PostgreSQL 18 — BRIN Indexes](https://www.postgresql.org/docs/current/brin.html).
- Range partitioning by `effectiveAt` is the documented scaling path once the
  table is large, but is deliberately **not** applied at current scale: for the
  dataset the benchmarks exercise, a BRIN plus btree is faster to query and far
  simpler to operate, and partitioning can be added later without a schema
  change to the model. Declarative range partitioning is the documented
  primitive for time-series tables.
  [PostgreSQL 18 — Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html).

**Out-of-order arrivals are normal** (a lab posts a result whose `effectiveAt`
precedes a reading already stored). Because `effectiveAt` is a value column and
not the physical order, "latest" must be defined by `effectiveAt` with a
deterministic tie-break (`issuedAt`, then `id`) — never by insertion order. This
is asserted in Phase 3/5.

---

## 6. Append-only enforcement

Health data is append-only (G5). Two layers, both from current PostgreSQL
documentation:

1. **A `BEFORE UPDATE OR DELETE` trigger that `RAISE`s** on every row of the
   observation and clinical-event tables. This is the *authoritative* guard: it
   fires for the table owner and superusers too, which grants do not.
   [PostgreSQL 18 — CREATE TRIGGER](https://www.postgresql.org/docs/current/sql-createtrigger.html).
2. **`REVOKE UPDATE, DELETE ... FROM PUBLIC`** as defence in depth. Grants stop
   ordinary roles; the trigger stops everyone.

The same pattern already protects the ledger
(`apps/api/prisma/migrations/20261015172954_double_entry_ledger/migration.sql`),
which is the in-repo precedent.

**Constraint triggers** (the deferred kind) are used where an invariant spans
several rows and must be checked at COMMIT. `CREATE CONSTRAINT TRIGGER ... AFTER
INSERT ... DEFERRABLE INITIALLY DEFERRED` fires at transaction end, after every
row has been inserted; `SET CONSTRAINTS` can force an early check. Constraint
triggers must be `AFTER ROW` on plain tables.
[PostgreSQL 18 — CREATE CONSTRAINT TRIGGER](https://www.postgresql.org/docs/current/sql-createtrigger.html),
[PostgreSQL 18 — SET CONSTRAINTS](https://www.postgresql.org/docs/current/sql-set-constraints.html).

**Decision:** the append-only rule is enforced with plain `BEFORE` triggers
(§6.1). One *deferred* constraint trigger additionally guarantees that every
laboratory observation inserted by a transaction resolves to a reference range
for its patient's demographics — the invariant the handoff calls out as
"database as arbiter" (G7). It is deferred so a transaction may insert the
observation and any catalog row it needs in either order.

---

## 7. Derivation and caching

Nothing derived is stored (G6): adherence rates, trends, and range flags are
computed from the append-only events on read. Where a derived value is expensive
and read-often, it is cached in Redis with a **short TTL** using the
cache-aside pattern — read-through on miss, write-through TTL, explicit
invalidation on new events. Cache-aside bounds staleness by the TTL and never
becomes a second source of truth; a miss always re-derives from Postgres.
[Redis — cache-aside](https://redis.io/docs/latest/develop/use-cases/cache-aside/).

The existing `RedisService` and the ledger's "no balance column" decision are the
in-repo precedents (`apps/api/src/redis/redis.service.ts`; schema comment at
`LedgerTransaction`).

**Adherence semantics** (the "not logged" vs "missed" distinction): a *missed*
occurrence is one the patient explicitly logged as skipped; a *not-logged*
occurrence is one with no event at all. Adherence rate = taken / (taken +
missed) over logged occurrences; logging rate = (taken + missed) / expected over
all expected occurrences. Conflating them would either punish a patient for a
gap in their app or hide a real gap; keeping them separate is the requirement in
Phase 2/5.

---

## 8. Idempotency and the outbox (reuse)

Ingestion reuses the repo's existing primitives rather than inventing new ones:

- `IdempotencyService` (Stripe-style claim + lease + fencing token + recovery
  points) for the single-observation and adherence-event endpoints, keyed on a
  client-supplied key. `docs/research/marketplace-payments-research.md` §idempotency
  documents the design; the service is `apps/api/src/idempotency/idempotency.service.ts`.
- The **transactional outbox** for "observation written ⇒ derive/notify" work,
  in the same transaction as the observation insert, exactly as post fan-out
  works today (`apps/api/src/outbox/outbox.service.ts`).
- `INSERT ... ON CONFLICT DO NOTHING` plus a unique key for bundle-level
  deduplication (each resource keeps its source id).

A duplicate ingestion returns the original result and creates no second row;
this is asserted concurrently in Phase 3/5.

---

## 9. Herdr CLI reference (installed binary is the authority)

`herdr 0.9.1`. Commands used by the environment script and the suite, verified
by running each command group:

- `herdr pane current --current` → JSON with `result.pane.workspace_id` /
  `pane_id`; used to resolve the workspace without predicting ids.
- `herdr tab create [--workspace ID] [--cwd PATH] [--label TEXT] [--no-focus]`
  → `result.tab` and `result.root_pane`; ids are read from the response.
- `herdr pane run <pane_id> <command>`; `herdr pane read <pane_id> --source
  recent-unwrapped --lines N`; `herdr pane wait-output <pane_id> --match TEXT
  --timeout MS`.
- `herdr agent list` / `herdr agent wait <target> --until <state> --timeout MS`;
  lifecycle states are `idle`, `working`, `blocked`, `done`, `unknown`.
- `herdr notification show <title> --body TEXT --sound done|request|none`.
- Tabs, not panes, are the unit of layout (G3); one tab per independent
  workload.

The authoritative reference is the binary itself (`herdr --help`,
`herdr <group>`); the syntax above is transcribed from `herdr 0.9.1`, and the
scripts re-derive ids from JSON responses rather than hardcoding them.

---

## 10. Dependency decision

**Decision: no new runtime dependencies.** Phase 0 required identifying any FHIR
parsing / validation libraries or extra application modules; on inspection none
are needed.

- **FHIR ingestion** consumes a narrow, self-selected resource subset (§1). The
  ingestion pipeline (Phase 3) reads typed fields with plain TypeScript over the
  JSON body already parsed by Fastify; a general-purpose FHIR SDK (e.g.
  `@smile-cdr/fhirts`, `fhir-kit-client`) would add a large dependency surface,
  validation semantics we do not control, and schema-version coupling for no
  benefit. Containment (validating the subset we accept) is preferable to
  full-spec validation we would ignore.
- **Persistence, cache, queue, metrics** reuse what the repo already ships:
  Prisma + PostgreSQL 18, ioredis, BullMQ (via `@nestjs/bullmq`, already used by
  the fan-out/outbox path), and `prom-client` (already used by `MetricsService`).
- **Synthetic generation** is a build-time-only Node script (§4) using only
  `node:fs` / `node:zlib`; it is never imported by the application.
- **Input validation** reuses `class-validator` / `class-transformer`, already
  dependencies of `apps/api`.

Consequently `apps/api/package.json` gains no new entries except the
`synthetic:health` script that drives the offline generator.

## 11. References

1. HL7 FHIR R4 — Observation. http://hl7.org/fhir/R4/observation.html
2. HL7 FHIR R4 — MedicationRequest. http://hl7.org/fhir/R4/medicationrequest.html
3. HL7 FHIR — Encounter, Condition, Patient, Procedure (R4). https://hl7.org/fhir/R4/
4. FHIR Vital Signs profile (LOINC + UCUM bindings). https://build.fhir.org/branches/master/vitalsigns.html
5. FHIR Observation vitals result value set. https://www.hl7.org/fhir/valueset-observation-vitalsignresult.html
6. FHIR UCUM units value set. https://build.fhir.org/valueset-ucum-units.ttl.html
7. LOINC 4548-4 (HbA1c). https://loinc.org/4548-4
8. LOINC 8867-4 (Heart rate). https://loinc.org/8867-4
9. LOINC 8480-6 (Systolic BP). https://loinc.org/8480-6
10. UCUM specification. https://ucum.org/ucum
11. Synthea. https://github.com/synthetichealth/synthea
12. Synthea FHIR records. https://github.com/synthetichealth/synthea/wiki/Records
13. Synthea CSV data dictionary. https://github.com/synthetichealth/synthea/wiki/CSV-File-Data-Dictionary
14. PostgreSQL 18 — CREATE TRIGGER. https://www.postgresql.org/docs/current/sql-createtrigger.html
15. PostgreSQL 18 — SET CONSTRAINTS. https://www.postgresql.org/docs/current/sql-set-constraints.html
16. PostgreSQL 18 — Window Functions. https://www.postgresql.org/docs/current/functions-window.html
17. PostgreSQL 18 — BRIN Indexes. https://www.postgresql.org/docs/current/brin.html
18. PostgreSQL 18 — Table Partitioning. https://www.postgresql.org/docs/current/ddl-partitioning.html
19. Redis — cache-aside. https://redis.io/docs/latest/develop/use-cases/cache-aside/
20. Brandur Leach (Stripe) — "Implementing Stripe-like Idempotency Keys in Postgres". https://brandur.org/idempotency-keys
21. Shopify Engineering — "Deconstructing the Monolith". https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity
