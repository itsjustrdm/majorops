---
draft: true
---

# KPI Source of Truth

This page is the human-readable source for every KPI we track. The database tables and API mirror this page; nothing ships without an entry here.

## What “authoritative” means
- **One definition:** Each KPI has a unique `slug` and single definition that feeds all scorecards (exec, stakeholder, responder readiness).
- **One formula:** The calculation is written once, stored in the Worker/D1 layer, and reused by every consumer.
- **One ownership path:** Every KPI has an owner and review cadence.

## Fields to capture (per KPI)
| Field | Description |
|---|---|
| `slug` | Lowercase identifier used in API and DB (`mttr`, `cadence-adherence`). |
| `name` | Friendly display name. |
| `description` | What the KPI measures and why it matters. |
| `formula` | Human-readable formula; implementation lives in Worker. |
| `units` | e.g., minutes, percentage, count. |
| `targets` | Optional thresholds by severity or persona (e.g., P1 target 60m). |
| `data_sources` | Which events/fields power it (timeline events, milestones, alerts). |
| `visibility` | `internal` or `exec`; controls where it renders. |
| `owner` | Role or person accountable for accuracy. |
| `review_cadence` | How often the definition is re-validated. |

## Current KPIs
| slug | name | description | units | formula (conceptual) | targets | visibility | owner |
|---|---|---|---|---|---|---|---|
| `mttr` | Mean Time to Resolve | Average time from `incident.detected_at` to `resolved_at`. | minutes | `avg(resolved_at - detected_at)` | P1: 120m, P2: 240m | exec | Ops Leader |
| `mtta` | Mean Time to Acknowledge | Average time from alert issue to first MIM action (`phase 1 → 2`). | minutes | `avg(phase_entered_at(gather) - alert.issueTime)` | P1: 10m, P2: 20m | internal | MIM Lead |
| `cadence-adherence` | Update Cadence Adherence | Percent of milestones delivered on/before committed ETA. | % | `on_time_milestones / total_milestones` | ≥90% | exec | Comms Lead |
| `stakeholder-satisfaction` | Stakeholder Signal Score | Rolling survey score post-incident (1–5). | score | `avg(survey_score)` | ≥4.5 | exec | Customer Ops |
| `team-page-to-bridge` | Team Bridge Arrival Time | Time from page sent (`team_pages.paged_at`) to team on bridge (`team_pages.arrived_at`). Measured per team dispatch, per incident. | minutes | `avg(arrived_at - paged_at)` per team | Box3: ≤5m, Box2: ≤10m, Box1: ≤20m | internal | MIM Lead |
| `team-page-to-ack` | Team Acknowledgment Time | Time from page sent to acknowledgment. Only computed where `acknowledged_at` is present. | minutes | `avg(acknowledged_at - paged_at)` per team | Box3: ≤2m, Box2: ≤5m | internal | MIM Lead |

> Add new KPIs by appending to this table **and** adding a `KpiDefinition` row via migration or admin tool. The API rejects observations for unknown slugs.

---

## Team Dispatch Credit (Response Readiness Score)

The long-term goal of `team-page-to-bridge` and `team-page-to-ack` is not just to track a single incident — it is to build a **per-team response record** that accumulates across incidents into something meaningful.

The reference model is the fire service's **ISO Public Protection Classification (PPC)** — a 1–10 score that evaluates a fire department's infrastructure, staffing, training, and water supply. That score determines homeowner insurance rates in the department's coverage area. A department with a class 1 rating (best) can demonstrably justify its budget. A class 8 rating tells the insurer something different.

MajorOps's equivalent is not a single incident's page-to-bridge time. It is the rolling trend: **how consistently does a team respond to dispatch at the alarm level they're rated for?**

A team that consistently arrives in under 5 minutes on Box 3 incidents has a strong dispatch credit. A team that averages 18 minutes has a story to tell — and that story belongs in training planning, on-call rotation decisions, and staffing conversations.

### MVP (Phase 1)

What gets captured:
- **Team name:** structured, from the pre-configured `teams` list — no free text drift
- **Contact name:** free text, e.g. `Alex Kim (on-call)` — no account verification required
- **Page time:** when the MIM sent the page (`paged_at`)
- **Bridge arrival time:** when the MIM observes the team on the call (`arrived_at`) — manually recorded

What gets computed (per team, per alarm level):
- `team-page-to-bridge` — arrival latency, queryable across incidents
- Trend over time: rolling average for the last 30/60/90 days

### Phase 2 (Engineer-Level Tracking)

When an engineer has a MajorOps account and clicks "I'm here" during an incident:
- `team_pages.arrived_at` is set precisely (not manually)
- `team_pages.contact_name` becomes a link to a `User` record
- `incident_participants.joined_at` is the individual-level timestamp

This unlocks individual-level scoring: not just "the team arrived in 8 minutes" but "Alex arrives in 4 minutes on average; the secondary on-call averages 14 minutes." That data should inform rotation assignments — not as punishment, but as a structurally honest input to staffing.

**Phase 2 KPI to add (not yet in schema):**

| slug | name | description | units | formula |
|---|---|---|---|---|
| `engineer-response-time` | Engineer Response Time | Time from page to "I'm here" confirmation, per individual. Requires Phase 2 account linkage. | minutes | `avg(arrived_at - paged_at)` per user |

> *Note: Individual scoring requires careful UX treatment. This is operational data, not performance review data. The goal is readiness awareness and rotation optimization — not ranking or blame.*

## How it flows
1) **Define** here → `KpiDefinition` row in D1 (slug, formula, targets, visibility, owner).  
2) **Compute/ingest** → Worker writes `KpiObservation` rows (per incident, timestamp, value, source, confidence).  
3) **Consume** → Scorecards call `GET /kpis` (definitions) and `GET /incidents/:id/kpis` (observations).  
4) **Render** → Exec/Stakeholder/Responder views pick the subset they are allowed to see based on `visibility`.

## Backfill & QA
- Run `mim kpi backfill --kpi <slug>` to recompute observations from timeline/milestones.
- Observations are append-only; re-running backfill overwrites by `(kpi_slug, incident_id, timestamp)` primary key for determinism.

## Change control
- Update definitions here first; then update Worker formulas and run a migration if fields change.
- Tag each update with the date and owner in git history; this page is the audit trail.
