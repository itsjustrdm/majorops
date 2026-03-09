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

> Add new KPIs by appending to this table **and** adding a `KpiDefinition` row via migration or admin tool. The API rejects observations for unknown slugs.

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
