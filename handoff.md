# Handoff Document: Health Monitoring System for Tangerine

**Document type:** Phased implementation spec with resumable checkpoints
**Target agent:** Autonomous AI coding agent
**Repository:** Tangerine monorepo (modular monolith)
**Base branch:** The current working branch (NOT `main` or `master` — see Branch Isolation below)
**Testing paradigm:** Real-user behavioral simulation via Herdr terminal multiplexer
**Autonomy level:** High — the agent decides code structure, naming, file organization, and implementation details. The constraints below are architectural, correctness-related, and procedural.

---

## How to Use This Document

This document is **phase-gated**. Each phase has a **Status** marker at the top. The agent must:

1. Read the entire document before starting.
2. Begin at the first phase whose status is `NOT STARTED` or `IN PROGRESS`.
3. Within a phase, complete all deliverables, run all verification steps, and update the status marker to `DONE` with a timestamp and commit SHA.
4. Only then proceed to the next phase.
5. If the session is interrupted, a fresh agent reads the status markers and resumes from the correct phase.

**Do not skip phases.** Each phase depends on the correctness of the previous one.

**Do not modify the status markers of completed phases.** Only append completion notes.

---

## Global Constraints (Apply to Every Phase)

### G1. Branch Isolation — New Branch From the Current Branch

**This is not a branch from `main` or `master`.** The repository already has an active working branch that contains the existing Tangerine system (feed, chat, scheduling, ledger, marketplace, saga). The health monitoring system must be built on a **new branch created from that current working branch**, so that none of the existing code on the current branch is disturbed.

Before any code is written:

1. Identify the currently checked-out branch. That is the base.
2. Create a new branch from it with a descriptive name that reflects the health monitoring feature.
3. Check out the new branch.
4. Confirm with the version control tool that you are on the new branch and that the base branch is unchanged.

**Do not create a worktree.** Work in the existing checkout. The new branch already provides isolation from the base branch — a separate working directory is not required and adds unnecessary complexity to the environment.

Every commit — code, migrations, docs, test scripts, research memos — goes to the new branch. The base branch must remain untouched for the entire duration of this work.

At the end of the project, the new branch is ready for review and merge into the base branch.

### G2. Mandatory Web Research — Use It When You Need It

**Do not rely solely on training data.** Training data is stale. External contracts, library APIs, database semantics, and tooling behavior change.

Research is not a phase you complete once — it is a tool you reach for **whenever you are uncertain or stuck**. Before implementing any non-trivial component, if you are unsure about:

- The current behavior of a library or framework API
- Database semantics (constraint triggers, window functions, partitioning, indexing strategies)
- A clinical data standard (FHIR resource shapes, LOINC codes, UCUM units, reference range conventions)
- A synthetic data generator's output format
- A testing or benchmarking tool's current syntax

— **stop and search**. Use official documentation first, then engineering blogs from companies that have solved the problem, then GitHub for reference implementations. Cite sources in a research memo or in code comments where the reference directly informs a design decision.

**Do not guess.** If you are unsure about an API contract, search for the answer. If you are unsure about a data shape, find the specification. If you are unsure about a performance characteristic, benchmark it.

When you get stuck — a test fails unexpectedly, a query returns wrong results, a library behaves differently than you expect — the first move is research, not guess-and-check. Read the current documentation. Search for the error. Find a reference implementation that solved the same problem. Then proceed.

### G3. Herdr Terminal Orchestration — Tabs, Not Panes

All testing, monitoring, and parallel workload execution uses **Herdr tabs**, not panes within a single tab. The reasoning: panes within one tab compress into a single view and are hard to monitor. Tabs are separate views within a workspace, and the agent can create as many as needed.

**The agent has full autonomy over tab topology.** It decides how many tabs, what each tab contains, and how to organize them. A typical layout might include:

- A tab running the API server
- A tab running a database session for invariant assertions
- A tab tailing API and database logs
- A tab running a data simulator (device stream, lab feed, etc.)
- A tab running a load generator
- A tab watching Prometheus scrape output

**Create tabs, not panes.** When you need a new terminal location for a workload, create a new tab. Do not split panes within an existing tab unless you have a specific reason to keep two processes visually adjacent (e.g., a producer and its consumer in the same view). The default is one tab per independent workload.

**Use Herdr's notification system instead of timeouts.** Herdr's notification system delivers native system notifications with configurable sound and position. Use it to signal phase completion, blocked states, and test failures. The human operator is monitoring via Herdr; this is the communication channel. Do not write `sleep` or `timeout` patterns. Use `herdr agent wait` to block on state changes rather than polling.

**Herdr agent lifecycle states:** Herdr recognizes agents inside panes and reports `idle`, `working`, `blocked`, `done`, `unknown`. Use `herdr agent wait` to wait for an agent to reach a specific state. This is the Herdr-native replacement for `sleep` and `timeout` patterns.

**Tab creation:** `herdr tab create` returns the tab and root pane identifiers in its response. Read the identifiers from the response — do not predict them. Use the returned pane identifier for subsequent `pane run` and `pane read` commands.

### G4. Real-User Behavioral Testing — Terminal Simulation, Not Unit Tests

**No unit tests. No mocked tests. No end-to-end test suites.** All verification is behavioral and end-to-end against a live API, live database, and live cache.

The testing philosophy: simulate a real user's journey through the health monitoring system — a patient logging adherence, a practitioner reviewing trends, a device streaming observations, a lab result arriving — while **concurrently** running adversarial workloads (duplicate observations, out-of-order lab results, missing reference ranges, device data floods).

Monitor all concurrent processes in real-time via Herdr tabs. Use `pane read` to capture output from each tab, and `agent wait` to block on state changes rather than sleeping.

**Document the tests as real-world scenarios.** Write the test scripts as shell scripts that drive the API the way a user would — through HTTP calls, not through internal functions. Each script should tell a story: "A patient logs their morning medication," "A practitioner pulls a 90-day trend report," "A device streams 1,000 glucose readings." The output should be human-readable and assert the invariant that matters.

### G5. Append-Only Health Data

The health observation store is **append-only**. No `UPDATE`. No `DELETE`. This is non-negotiable and must be enforced at the database level via a trigger that raises an exception on mutation, plus revoked privileges as defense in depth.

The same principle applies to adherence events and clinical events. A corrected observation is a new row; a retracted condition is a new event. History is immutable.

### G6. Derivation Over Storage

Never store a derived value. A "current HbA1c" column is a cache that can drift. A trend query that computes the latest value from the append-only observation store cannot drift. The same reasoning that drove the existing ledger's "no balance column" decision applies here.

Adherence rates are derived. Protocol progress is derived. Reference-range flags are derived. Biomarker trends are derived. Nothing is stored that can be computed from the raw events.

### G7. Database as Arbiter

Every correctness invariant (observation append-only, reference range resolution, adherence event validity) must be enforced at the database level where technically feasible. Application-level checks are a convenience, not the guarantee.

### G8. No Code Snippets or Structural Code in This Document

This document deliberately contains no code snippets, no file paths, no directory structures, and no implementation-level naming. The agent has full autonomy over code structure, naming, file organization, and implementation details. The constraints here are about correctness, process, and architecture — not style.

---

## Phase 0: Research, Environment, and Branch Setup

**Status:** `DONE — 2026-10-16T04:56:37Z — c7fde3c`

### Dependencies

None. This is the first phase.

### Deliverables

1. **Research memo** — a document in the repository's research directory containing:
   - Current FHIR R4 resource shapes for the relevant resources — particularly the fields relevant to health monitoring (codes, values, units, effective times, reference ranges).
   - Current LOINC and UCUM conventions for the biomarkers and units the system will track.
   - Current behavior of the chosen synthetic data generator — output format, available modules, how to generate a population, how to map its output to internal tables.
   - Database window function and partitioning semantics for time-series trend queries.
   - Database constraint trigger syntax and deferred semantics for the append-only enforcement.
   - Herdr command reference — exact syntax for workspace creation, tab creation, pane execution, pane reading, agent waiting, and notification display. The installed binary is the authority.
   - Citations with URLs.

2. **Branch created** — a new branch from the **current working branch** (not `main` or `master`). No worktree. Work in the existing checkout.

3. **Herdr workspace and tabs created** — at minimum:
   - A tab running the API server.
   - A tab running a database session for invariant assertions.
   - A tab for the data simulator.
   - A tab for load generation.

4. **Synthetic data generated** — a versioned seed bundle of synthetic patient data. The data generator runs offline; the output is committed to the repository as a deterministic seed. Do not introduce a runtime dependency on the data generator in the application's critical path.

5. **Dependencies identified and added** — any FHIR parsing libraries, data validation libraries, or additional application modules needed.

### Verification Steps

1. The new branch exists and is checked out. The base branch is unchanged.
2. The Herdr workspace and tabs exist.
3. The API builds with zero errors on the new branch.
4. The research memo exists and contains at least five cited sources.
5. The synthetic data seed bundle exists and contains at least 50 patients with conditions, medications, and observations.

### Checkpoint

Send a Herdr notification signaling phase completion.

Update this document: change `**Status:** \`NOT STARTED\`` to `**Status:** \`DONE — [ISO timestamp] — [commit SHA]\``.

Commit the research memo, branch setup, and Herdr orchestration configuration.

---

## Phase 1: Data Foundation — Clinical Events, Observations, and Reference Ranges

**Status:** `DONE — 2026-10-16T05:03:41Z — a6d91e4`

### Dependencies

Phase 0 complete.

### Research Required Before Implementation

- The exact resource shapes for the chosen synthetic data generator's output.
- The clinical code systems and unit conventions for the biomarkers the system will track.
- Database partitioning strategies for time-series data at the scale the system targets.

### Deliverables

1. **Schema additions:**
   - A clinical event store for discrete clinical history (conditions, encounters, procedures, medication orders). Append-only.
   - An observation store for time-series measurements (vitals, labs, activity, sleep, nutrition). Append-only.
   - A reference range catalog, keyed by code and patient demographics.
   - Enums for observation categories, clinical event types, and data sources.

2. **Migration:**
   - Tables created with appropriate indexes for the expected query patterns.
   - **Append-only triggers** on the clinical event and observation stores that raise on `UPDATE` and `DELETE`.
   - **Revoke `UPDATE` and `DELETE`** privileges from the application role as defense in depth.

3. **Seed script:**
   - Load the synthetic patient data from the Phase 0 bundle into the clinical event and observation stores.
   - Map the source resources to the internal schema.
   - Validate that every laboratory observation has a matching reference range for the patient's demographics.
   - The seed must be idempotent — running it twice does not duplicate data.

4. **Behavioral test script:**
   - A shell script that seeds the data, asserts the expected counts, and attempts to `UPDATE` and `DELETE` an observation to prove the append-only trigger fires.

### Verification Steps

1. Run the seed script. Assert the observation count matches the source data.
2. Run the behavioral test script. Assert the append-only trigger fires.
3. Assert the reference range resolution works for a sample of observations.
4. Monitor the database session tab for the assertions.

### Checkpoint

Send a Herdr notification signaling phase completion.

Update the status marker. Commit the schema, migration, seed script, and behavioral test.

---

## Phase 2: Derivation Layer — Trends, Adherence Rates, and Protocol Progress

**Status:** `DONE — 2026-10-16T05:06:40Z — 646a6c2`

### Dependencies

Phase 1 complete.

### Research Required Before Implementation

- Database window function semantics for the trend queries.
- Caching strategies for derived values with short TTLs.
- The clinical semantics of adherence rate calculation — the distinction between "not taken" and "not logged."

### Deliverables

1. **Derivation services:**
   - A service that computes biomarker trends for a patient: the latest value for each tracked code, the value at a configurable lookback interval, the delta, the direction of change, and the reference-range status.
   - A service that computes adherence rates for a patient and protocol item: the percentage of expected events that occurred over a rolling window, the current streak, and the longest streak. This service must distinguish between "not logged" and "missed."
   - A service that computes protocol progress: completion percentage, current phase, and next milestone.

2. **Adherence event store:**
   - A store for adherence events (medication taken, exercise logged, meal logged, sleep logged). Append-only.
   - A store for the expected schedule (protocol items and their expected frequency).

3. **Reference range resolution:**
   - A service that resolves the correct reference range for an observation given the patient's demographics at the time of the observation.

4. **Behavioral test scripts:**
   - A shell script that seeds a patient with known observations, calls the trend endpoint, and asserts the returned trend matches the expected values.
   - A shell script that seeds adherence events with known gaps, calls the adherence endpoint, and asserts the rate calculation distinguishes "not logged" from "missed."

### Verification Steps

1. Run the behavioral test scripts.
2. Monitor the database session tab for the derivation query results.
3. Assert the trend query returns the correct latest value and the correct lookback value.
4. Assert the adherence rate calculation handles missing data correctly.

### Checkpoint

Send a Herdr notification signaling phase completion.

Update the status marker. Commit the derivation services, adherence event store, and behavioral tests.

---

## Phase 3: Ingestion Pipeline — FHIR, Device Data, and Manual Entry

**Status:** `DONE — 2026-10-16T05:21:40Z — ee30445`

### Dependencies

Phase 2 complete.

### Research Required Before Implementation

- The current resource structure for the chosen synthetic data generator.
- The idempotency patterns already used in the existing system.
- Device data formats for the chosen simulator.

### Deliverables

1. **Ingestion endpoints:**
   - An endpoint for ingesting a FHIR bundle. The endpoint verifies the bundle, extracts the relevant resources, and writes them to the append-only stores.
   - An endpoint for ingesting a single observation (manual entry or device data). The endpoint is idempotent on a client-supplied key.
   - An endpoint for ingesting an adherence event. Idempotent on a client-supplied key.

2. **Idempotency integration:**
   - Every ingestion endpoint uses the existing idempotency mechanism. A duplicate ingestion returns the original result without creating a second row.

3. **Async pipeline integration:**
   - Every ingestion writes an outbox event in the same transaction as the observation. The outbox relay publishes the event to a worker queue.
   - The worker derives trends, checks reference ranges, and emits notification events if warranted.

4. **Validation layer:**
   - A validation layer that rejects malformed bundles with structured errors.
   - The validation layer asserts that every laboratory observation has a matching reference range for the patient's demographics.

5. **Behavioral test scripts:**
   - A shell script that ingests a FHIR bundle and asserts the observation count matches the bundle.
   - A shell script that fires the same observation 100 times concurrently and asserts exactly one row.
   - A shell script that delivers observations out of order and asserts the trend query returns the correct latest value.

### Verification Steps

1. Run the behavioral test scripts.
2. Monitor the ingestion tab for request/response.
3. Monitor the worker tab for derivation events.
4. Assert the outbox lag remains bounded.

### Checkpoint

Send a Herdr notification signaling phase completion.

Update the status marker. Commit the ingestion pipeline, idempotency integration, and behavioral tests.

---

## Phase 4: Benchmarking — Trend Query, Adherence Rate, and Ingestion Throughput

**Status:** `NOT STARTED`

### Dependencies

Phase 3 complete.

### Research Required Before Implementation

- The existing performance program's methodology and documentation format.
- Database query analysis tooling.
- A load generator for the throughput scenarios.

### Deliverables

1. **Benchmark scenarios:**
   - **Observation ingestion throughput** — how many observations per second can the API ingest? Where does the bottleneck move — the database write, the outbox relay, or the worker?
   - **Trend query latency as observation count grows** — seed a patient with increasing observation counts and measure the trend query latency.
   - **Adherence rate calculation under high event volume** — seed many patients with many protocol items and measure the time to compute adherence rates.
   - **FHIR bundle ingestion throughput** — how many bundles can be ingested per second?
   - **Concurrent ingestion from multiple sources** — a device stream, a batch import, and a manual entry happening simultaneously.

2. **Performance documentation:**
   - A write-up for each scenario following the existing format: hypothesis → methodology → results → analysis → optimization → what it proves.
   - Raw benchmark artifacts in the results directory.

3. **Optimization log entries:**
   - Before/after documentation for any optimization discovered during benchmarking.

### Verification Steps

1. Run all benchmark scenarios.
2. Assert the trend query latency is within the expected bounds.
3. Assert the ingestion throughput is within the expected bounds.
4. Document the results.

### Checkpoint

Send a Herdr notification signaling phase completion.

Update the status marker. Commit the benchmark scenarios and performance documentation.

---

## Phase 5: Adversarial Testing — Break the System

**Status:** `NOT STARTED`

### Dependencies

Phase 4 complete.

### Research Required Before Implementation

- The existing adversarial testing patterns in the repository's scripts directory.
- The Herdr orchestration patterns for running multiple workloads in parallel tabs.

### Deliverables

1. **Adversarial test scripts:**
   - A script that fires the same observation 100 times concurrently and asserts exactly one row.
   - A script that delivers observations out of order and asserts the trend query returns the correct latest value.
   - A script that seeds a patient with partial logging and full adherence and asserts the adherence rate is computed correctly (over logged days) while the logging rate reflects the gap.
   - A script that inserts an observation for a pediatric patient and asserts the pediatric range is used; then inserts the same value for an adult and asserts the adult range is used.
   - A script that attempts an `UPDATE` and a `DELETE` on the observation store and asserts both fail.
   - A script that seeds 100 patients and asserts every laboratory observation has a matching reference range, every medication order has a condition, and every encounter has a valid patient.

2. **Herdr orchestration script:**
   - A script that creates a tab for each adversarial workload, runs them, waits for completion via `agent wait`, collects results, and sends a notification on completion or failure.
   - Because the workloads share one database and each resets the tables it asserts on, the suite runs them **sequentially** by default. A parallel mode is available for disjoint-data setups.

### Verification Steps

1. Run the full adversarial suite via the Herdr orchestration script.
2. Monitor all tabs simultaneously.
3. Assert every invariant holds.
4. Assert the notification is sent on completion.

### Checkpoint

Send a Herdr notification signaling phase completion.

Update the status marker. Commit the adversarial test scripts and Herdr orchestration.

---

## Phase 6: Integration and Documentation

**Status:** `NOT STARTED`

### Dependencies

Phase 5 complete.

### Deliverables

1. **Integration with the existing system:**
   - The health module is registered in the existing application module.
   - The health metrics are added to the Prometheus scrape.
   - The Grafana dashboard is updated with health panels.

2. **Documentation:**
   - A health monitoring write-up in the performance documentation directory.
   - An update to the main README with the new API surface and testing instructions.
   - An update to the architecture documentation with the health monitoring data model.
   - A final research memo with all citations.

3. **Final verification:**
   - Run the full adversarial suite one final time.
   - Assert every invariant holds.
   - Capture a Grafana dashboard screenshot.

### Verification Steps

1. Run the full adversarial suite.
2. Assert every invariant holds.
3. Review all documentation for completeness.
4. Assert every claim has a measurement or citation.
5. Assert every invariant has a behavioral test.

### Checkpoint

Send a Herdr notification signaling phase completion.

Update the status marker. Commit the integration, documentation, and final verification.

---

## Phase Status Summary (for Resumability)

| Phase | Status | Commit SHA | Timestamp |
|---|---|---|---|
| 0 — Research & Setup | `DONE` | `c7fde3c` | `2026-10-16T04:56:37Z` |
| 1 — Data Foundation | `DONE` | `a6d91e4` | `2026-10-16T05:03:41Z` |
| 2 — Derivation Layer | `DONE` | `646a6c2` | `2026-10-16T05:06:40Z` |
| 3 — Ingestion Pipeline | `DONE` | `ee30445` | `2026-10-16T05:21:40Z` |
| 4 — Benchmarking | `NOT STARTED` | | |
| 5 — Adversarial Testing | `NOT STARTED` | | |
| 6 — Integration & Documentation | `NOT STARTED` | | |

---

## Reference Library

The agent should consult these during research, but must independently verify current behavior via web search before implementing.

### Clinical Data Standards

- HL7 FHIR R4 specification — the resource shapes for the relevant clinical resources.
- LOINC — the code system for laboratory and clinical observations.
- UCUM — the unit code system for quantitative measurements.

### Synthetic Data Generation

- Synthea — the open-source synthetic patient generator. Produces FHIR bundles, CSV, and comprehensive patient records.
- mock.health — a hosted FHIR sandbox that clones real hospital endpoints.
- Junction's Synthetic Data — demo users with real-world device data shapes.
- `biodata_simulator_api` — an open REST API server that generates emulated bio signals.

### Time-Series Data Modeling

- Database window function documentation — the trend query primitives.
- Database partitioning documentation — range partitioning by time.
- BRIN index documentation — for range scans on append-only tables.

### Derivation and Caching

- Redis caching strategies for derived values with short TTLs.
- The existing system's approach to derived values — the ledger's "no balance column" decision.

### Idempotency and Outbox

- The existing system's idempotency mechanism and transactional outbox — reuse these patterns.
- Brandur Leach (Stripe), "Implementing Stripe-like Idempotency Keys in Postgres."

### Herdr

- `herdr --help` and `herdr <command-group>` — the installed binary is the authority for command syntax.
- Herdr concepts: workspaces, tabs, panes, agents, sessions.
- Herdr agent automation: workspace creation, tab creation, pane execution, pane reading, agent waiting, notification display.

### Architectural Posture

- Shopify Engineering, "Deconstructing the Monolith" — modular monolith at scale.
- The existing system's architecture documentation — the modular monolith pattern, the derivation-over-storage principle, the database-as-arbiter principle.

---

## Final Notes for the Agent

**You have full autonomy over code structure, naming, file organization, and implementation details.** The constraints above are about correctness, process, and architecture — not style.

**When in doubt, prefer the design that makes the invariant structurally impossible to violate** over the design that relies on application-level discipline.

**Do not skip research.** When you are uncertain about an API contract, a data shape, a database semantic, or a tool's current behavior — search for the answer. Use official documentation first, then engineering blogs, then GitHub. Cite your sources. When you get stuck, the first move is research, not guess-and-check.

**Use Herdr notifications.** The human operator is monitoring via Herdr. When a phase completes, when a test fails, when you are blocked — send a notification. This is the communication channel. Do not use timeouts to wait for completion; use the agent lifecycle states.

**Test like a real user.** Write shell scripts that drive the API the way a patient or practitioner would. Each script should tell a story. The output should be human-readable and assert the invariant that matters.

**Leave the codebase better than you found it.** If you find a bug in existing code that affects your work, fix it and note it in the commit message.

**The branch is the deliverable.** At the end, the new branch should be ready for review and merge into the base branch.

---

**End of handoff document.**
