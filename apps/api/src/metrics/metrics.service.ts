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

  readonly ledgerTransactions = new Counter({
    name: 'tangerine_ledger_transactions_total',
    help: 'Ledger transactions posted, by kind',
    labelNames: ['kind'],
    registers: [this.registry],
  });

  readonly webhookEvents = new Counter({
    name: 'tangerine_webhook_events_total',
    help: 'Inbound webhook events, by source, type, and outcome',
    labelNames: ['source', 'type', 'outcome'],
    registers: [this.registry],
  });

  readonly inventoryReservations = new Counter({
    name: 'tangerine_inventory_reservations_total',
    help: 'Inventory reservation attempts, by outcome',
    labelNames: ['outcome'],
    registers: [this.registry],
  });

  readonly cartConflicts = new Counter({
    name: 'tangerine_cart_conflicts_total',
    help: 'Cart edits rejected by optimistic-locking version mismatch',
    registers: [this.registry],
  });

  readonly orderTransitions = new Counter({
    name: 'tangerine_order_transitions_total',
    help: 'Order status transition attempts, by from/to and legality',
    labelNames: ['from', 'to', 'legal'],
    registers: [this.registry],
  });

  readonly sagaRuns = new Counter({
    name: 'tangerine_saga_runs_total',
    help: 'Saga executions that reached a terminal state, by type and status',
    labelNames: ['saga_type', 'status'],
    registers: [this.registry],
  });

  readonly sagaCompensations = new Counter({
    name: 'tangerine_saga_compensations_total',
    help: 'Compensating actions applied, by saga type and step',
    labelNames: ['saga_type', 'step'],
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

  readonly ledgerBalanceImbalanceCents = new Gauge({
    name: 'tangerine_ledger_balance_imbalance_cents',
    help: 'Global debit-minus-credit imbalance across all ledger postings (must always be 0)',
    registers: [this.registry],
  });

  readonly ordersStuckPending = new Gauge({
    name: 'tangerine_orders_stuck_pending',
    help: 'Orders left PENDING without reaching PAID (must always be 0)',
    registers: [this.registry],
  });

  // ── Health monitoring ─────────────────────────────────────────────────
  readonly healthObservationsIngested = new Counter({
    name: 'tangerine_health_observations_ingested_total',
    help: 'Health observations accepted for ingestion, by category and source',
    labelNames: ['category', 'source'],
    registers: [this.registry],
  });

  readonly healthAdherenceEvents = new Counter({
    name: 'tangerine_health_adherence_events_total',
    help: 'Adherence events ingested, by type',
    labelNames: ['type'],
    registers: [this.registry],
  });

  readonly healthRangeAlerts = new Counter({
    name: 'tangerine_health_range_alerts_total',
    help: 'Out-of-range alerts raised by the derivation worker, by code and status',
    labelNames: ['code', 'status'],
    registers: [this.registry],
  });

  readonly healthQueueJobs = new Gauge({
    name: 'tangerine_health_queue_jobs',
    help: 'Health queue jobs by state',
    labelNames: ['state'],
    registers: [this.registry],
  });

  readonly healthOutboxBacklog = new Gauge({
    name: 'tangerine_health_outbox_backlog',
    help: 'Health outbox events accepted but not yet processed (relay + worker backlog)',
    registers: [this.registry],
  });

  readonly healthObservations = new Gauge({
    name: 'tangerine_health_observations',
    help: 'Total stored observations',
    registers: [this.registry],
  });

  readonly healthPatients = new Gauge({
    name: 'tangerine_health_patients',
    help: 'Patients with a profile',
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
