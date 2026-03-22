---
title: DB Connection Pool Exhaustion
tier:
  - docs       # Full article on about.majorops.io
  - tooltip    # ## Summary → hover definition in-app on "connection pool" / "pool exhaustion"
  - runcard    # ## Response → run card drawer in incident view when DB systems affected

tooltip:
  section: Summary
  trigger:
    - connection pool
    - pool exhaustion
    - pool saturation
    - pool metrics
    - pool utilization

runcard:
  section: Response
  affects:
    - Database SRE
    - postgresql
    - mysql
    - payments
    - db
    - database
  phase_trigger: [2, 3, 5]
  severity: [Critical, High]

tags: [database, infrastructure, connection-pool, postgresql]
draft: false
---

# DB Connection Pool Exhaustion

> When the pool is full, every new request is either queued or dropped. The application looks broken. The database is fine. That distinction matters from the first minute.

---

## Summary

A **connection pool** is a cache of pre-opened database connections shared by the application layer. When pool utilization hits 100%, new requests queue or fail immediately — causing application-layer errors that look like a database outage but are actually a resource exhaustion problem. Check pool metrics before assuming the database itself has failed.

---

## Response

> **This section surfaces in-app during active incidents where Database SRE or payment systems are affected.**

### Immediate — Phase 2 (Gather)

- [ ] Confirm pool utilization metric — is it at or near 100%?
- [ ] Identify which application tier is consuming connections (app servers, batch jobs, reporting)
- [ ] Check for long-running queries holding connections open (`pg_stat_activity` / equivalent)
- [ ] Confirm the database server itself is healthy — CPU, memory, disk I/O normal
- [ ] Open a recovery track: **DB Connection Pool** — assign to Database SRE lead

### Stabilize — Phase 3 (Assess) / Phase 5 (Isolation)

- [ ] Kill stale or long-running connections if confirmed safe to do so
- [ ] Identify if a batch job, deployment, or config change preceded the exhaustion
- [ ] Check pool size config — has it changed recently? Is it lower than expected?
- [ ] Determine if this is a leak (connections opened but not closed) or a spike (legitimate traffic surge)
- [ ] If a batch job is the culprit: pause or throttle it; do not kill it blindly

### Escalation Triggers

- [ ] Page **Payments Engineering** if payment transactions are failing — they own the consumer-side impact
- [ ] Page **Platform Engineering** if pool config requires an infrastructure change
- [ ] Do **not** page Database SRE for application-tier pool management — that's App team territory

### Mitigation Options (Phase 6)

| Action | Owner | Risk |
|---|---|---|
| Increase pool size limit (config change) | Database SRE | Low — immediate relief, may mask underlying issue |
| Kill long-running connections from batch job | Database SRE | Medium — confirm batch job is safe to interrupt |
| Throttle or pause batch job | Batch job owner | Low — reduces demand without touching DB |
| Rolling restart of app tier to flush leaked connections | Platform / App Eng | Medium — brief connection interruption |
| Deploy connection timeout reduction | Platform Eng | Low — prevents future leaks accumulating |

### Validation — Phase 7

- [ ] Pool utilization trending down and stable below 80%
- [ ] Application error rate returning to baseline
- [ ] Confirm no secondary queue backlog (fraud detection, payment queues) built up during impact

---

## Reference

### What Is a Connection Pool

Every database has a limit on how many simultaneous connections it can hold. Opening and closing a database connection is expensive — it involves authentication, session initialization, and memory allocation on the database server. Connection pooling solves this by maintaining a set of pre-opened, reusable connections that the application borrows and returns.

When an application requests a connection:
1. If a connection is available in the pool → it is leased immediately.
2. If the pool is full → the request waits in queue (up to a timeout) or fails immediately.

Pool exhaustion means every connection in the pool is currently leased and none are available. The pool itself is not broken. The database is not down. The resource is simply fully consumed.

### Why It Happens

**Spike-driven exhaustion** — legitimate traffic surge that exceeds the pool's configured maximum. The fix is capacity: increase the pool size or reduce connection hold time.

**Leak-driven exhaustion** — connections are being opened and not returned to the pool. Common causes:
- Application code that opens a connection, hits an exception, and skips the `close()` / `finally` block
- Batch jobs that open connections per-row rather than reusing a single connection
- Long-running queries that hold a connection open for minutes or hours instead of milliseconds

**Batch job interference** — scheduled jobs (reporting, data exports, maintenance tasks) that run during business hours and consume a disproportionate share of pool connections. Overnight maintenance windows exist for a reason.

**Config regression** — a deployment that reduces the pool size limit, either intentionally (as a cost-control measure) or accidentally (environment variable not set correctly).

### Signals That Suggest This Pattern

- Application error rate spikes but database CPU, memory, and disk are all normal
- Error messages reference "connection timeout", "pool exhausted", "too many clients"
- Issue onset correlates with a batch job start, a deployment, or a traffic event
- Monitoring shows pool utilization at or near 100% before the error spike

### How to Distinguish from a True Database Outage

| Signal | Pool exhaustion | Database outage |
|---|---|---|
| Database server metrics (CPU, disk) | Normal | Abnormal |
| Database replication status | Normal | May show lag or failure |
| Direct database connection from CLI | Succeeds | Fails or hangs |
| Application error message | "Too many connections" / timeout | Connection refused / host unreachable |
| Pattern of failure | All requests fail uniformly | May fail intermittently or on specific queries |

---

## Prevention

### Configuration

- Set pool size to match your application's expected concurrency, not the database's maximum connection limit. The database limit is a ceiling, not a target.
- Configure connection timeouts — both acquisition timeout (how long to wait for a pool slot) and idle timeout (how long an unused connection stays open).
- Set `statement_timeout` or equivalent on the database to kill runaway queries automatically. A query that runs for 10 minutes should not.

### Batch Job Hygiene

- Schedule batch jobs outside business hours unless they are explicitly designed for concurrent production load.
- Batch jobs should use a separate connection pool or a dedicated database user with its own connection quota — isolated from the application pool.
- Batch jobs should open one connection and reuse it across rows, not open a connection per operation.

### Observability

- Alert on pool utilization at 70% and 90% — not just at 100%. By the time it hits 100%, requests are already failing.
- Track the p95 and p99 of connection acquisition time. Rising acquisition latency is an early signal.
- Log connection lifecycle events in staging to detect leaks before they reach production.

---

## Anti-Patterns

**Restarting the database server** — the database is not the problem. Restarting it forces all connections to drop, which temporarily relieves the pool, but the underlying cause (leak, batch job, config) will exhaust the new pool immediately. This is a reset, not a fix.

**Increasing the pool to the database's maximum connection limit** — this trades pool exhaustion for database-level connection exhaustion, which is harder to recover from. The pool limit and the database limit serve different purposes.

**Killing connections without identifying the source** — if the source is a batch job or a leak, the connections will accumulate again as fast as you kill them. Identify the source first.

**Treating it as a network issue** — application-layer errors from pool exhaustion sometimes look like network timeouts to the monitoring layer. Confirm that the database is reachable directly before escalating to network operations.

---

*This document serves all three content tiers: the full article is published to about.majorops.io, the Summary section appears as an in-app tooltip when "connection pool" related terms are highlighted, and the Response section surfaces as a run card in the incident view when Database SRE or payment systems are affected.*
