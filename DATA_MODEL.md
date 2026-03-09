# MajorOps Data Model

> Authoritative reference for the D1 schema, API contracts, and frontend state shape. The TypeScript types in `apps/web/src/types/index.ts` are the source of truth for the UI layer. The D1 schema section below reflects the intended database structure.

---

## Entities Overview

| Entity | Layer | Description |
|---|---|---|
| `Incident` | D1 + UI | The top-level record. Opened when a major incident begins, closed when it resolves. |
| `TimelineEvent` | UI | A timestamped operational log entry. The fireground record. Posted by MIM or any participant. |
| `StatusUpdate` | D1 + UI | A published status note with audience scope (`public` or `internal`). |
| `Milestone` | D1 + UI | A structured summary cut from the fireground log. The unit of stakeholder and exec communication. |
| `CommandTeam` | D1 + UI | The five assigned roles for an active incident. |
| `AlertInfo` | D1 + UI | Intake metadata: source alert ID, customer count, external impact flag. |
| `User` | D1 | A person with access to MajorOps. Role determines view routing and permissions. |
| `KpiDefinition` | D1 + UI | Authoritative KPI metadata (slug, formula, targets, visibility). Feeds all scorecards. |
| `KpiObservation` | D1 + UI | Time-stamped KPI values per incident. Written by Worker jobs or UI; consumed by scorecards. |

---

<!-- DATA_DICTIONARY_START -->
## Frontend Types (TypeScript)

Canonical types for UI state and API payloads. Source: `apps/web/src/types/index.ts`.

### Core Enums

| Type | Values |
|---|---|
| `Severity` | `Critical` · `High` · `Medium` · `Low` |
| `IncidentStatus` | `Active` · `Monitoring` · `Resolved` |
| `PhaseNumber` | `1` through `8` |
| `ExternalImpact` | `Yes` · `No` · `Unknown` · `Likely` |
| `TimelineEventType` | `phase` · `update` · `command` · `alert` · `action` |
| `UpdateVisibility` | `public` · `internal` |
| `RiskLevel` | `Low` · `Medium` · `High` |

---

### Incident 8-Phase Lifecycle

| # | Phase | Description |
|---|---|---|
| 1 | **Alert** | Incident detected. Initial triage underway. |
| 2 | **Gather** | Assembling team. Collecting diagnostic data. |
| 3 | **Assess** | Scope and impact being determined. |
| 4 | **Initial** | Initial communication and stakeholder updates sent. |
| 5 | **Isolation** | Root cause identified. Isolating the fault domain. |
| 6 | **Mitigation** | Active remediation underway. |
| 7 | **Validation** | Recovery validated across affected systems. |
| 8 | **Resolution** | Incident closed. After Action (Learning Review) within 72 hours. |

Phases are sequential but not strictly linear — **Gather** (2) and **Assess** (3) may be re-entered as new information surfaces.

---

### Incident

The central UI entity. All subordinate objects are nested within it.

| Field | Type | Notes |
|---|---|---|
| `id` | `number` | Incident identifier. ULID in production (sortable), numeric in mock. |
| `title` | `string` | Short human-readable label. Editable in admin view. |
| `description` | `string` | Current problem description. Editable in admin view. |
| `severity` | `Severity` | `Critical · High · Medium · Low` |
| `status` | `IncidentStatus` | `Active · Monitoring · Resolved` |
| `phase` | `PhaseNumber` | Current phase (1–8). Advances forward only. |
| `phaseEnteredAt` | `string` (ISO) | When the incident entered the current phase. |
| `detectedAt` | `string` (ISO) | Detection / open timestamp. |
| `resolvedAt` | `string \| null` (ISO) | Set on close. Null while active. |
| `affectedSystems` | `string[]` | Systems or services impacted. |
| `bridgeUrl` | `string \| null` | Conferencing link. Shown in public and MIM views. |
| `command` | `CommandTeam` | Assigned roles. Editable by MIM. |
| `alert` | `AlertInfo` | Intake alert metadata. |
| `timeline` | `TimelineEvent[]` | Chronological event log. The fireground record. |
| `updates` | `StatusUpdate[]` | Published status updates (public and/or internal). |
| `updatesPosted` | `number` | Denormalized count of updates. Used in FixedFooterBar. |
| `milestones` | `Milestone[]` | Stakeholder/exec comms cuts. |
| `nextUpdateEta` | `string \| null` (ISO) | Next committed update ETA. Drives cadence badges. |
| `lastCommunicatedAt` | `string \| null` (ISO) | Timestamp of last outbound comms. |
| `businessImpact` | `string` | Brief statement of business risk. Surfaces in exec view. |
| `customerImpactSummary` | `string` | Customer-facing impact summary. |
| `riskLevel` | `RiskLevel` | Exec-facing risk flag: `Low · Medium · High`. |
| `execSummary` | `string` | One-paragraph exec brief. AI-assisted, MIM-editable. |
| `audienceNotes` | `string?` | Optional per-incident guidance for stakeholders/execs. |

---

### CommandTeam

| Field | Type | Role |
|---|---|---|
| `sre` | `string` | SRE lead — owns technical recovery track. |
| `mim` | `string` | Major Incident Manager — owns command and comms. |
| `leader` | `string` | Incident leader / IC — escalation authority. |
| `serviceManager` | `string` | Service owner liaison. |
| `customerOps` | `string` | Customer communications lead. |

All fields are editable by the MIM during an active incident. Reassignment mid-incident is supported and logged to the timeline.

---

### AlertInfo

| Field | Type | Notes |
|---|---|---|
| `alertId` | `string` | Source alert identifier (PagerDuty, OpsGenie, etc.). |
| `customerCount` | `number` | Confirmed impacted customers at detection. |
| `issueTime` | `string` (ISO) | When the alert fired. Start of elapsed-time calculations. |
| `resolveTime` | `string \| null` (ISO) | When the alert cleared. |
| `externalImpact` | `ExternalImpact` | `Yes · No · Unknown · Likely` |

---

### TimelineEvent

The raw fireground log. Any participant can post. Not edited after the fact.

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Event identifier. |
| `type` | `TimelineEventType` | `phase · update · command · alert · action` |
| `title` | `string` | Event headline. |
| `description` | `string` | Detail shown in the timeline feed. |
| `actor` | `string` | Display name of who performed the action. |
| `timestamp` | `string` (ISO) | When it happened. |
| `visibility` | `UpdateVisibility?` | Optional audience gate: `public · internal`. |
| `phaseNumber` | `PhaseNumber?` | Set for `phase` events to reference phase transition. |

---

### StatusUpdate

Published communications. Visibility-gated.

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Update identifier. |
| `content` | `string` | Update body text. |
| `visibility` | `UpdateVisibility` | `public · internal` |
| `author` | `string` | Display name of author. |
| `timestamp` | `string` (ISO) | When posted. |

---

### Milestone

A structured summary cut from timeline events. The unit stakeholders and executives see.

| Field | Type | Notes |
|---|---|---|
| `id` | `string` (ULID) | Milestone identifier. |
| `title` | `string` | Short milestone headline. |
| `body` | `string` | Published stakeholder/exec summary. MIM-edited before publishing. |
| `statusAtCut` | `IncidentStatus` | Status snapshot when the milestone was cut. |
| `nextUpdateEta` | `string \| null` (ISO) | Promise for the next milestone. Drives overdue badges. |
| `cutBy` | `string` | Display name of who published the milestone. |
| `cutAt` | `string` (ISO) | When the milestone was published. Immutable. |
| `isResolution` | `boolean?` | Marks the final resolution milestone. |

---

### IncidentMetrics (Derived)

Computed on the fly for the FixedFooterBar and MetricsSidebar. Never persisted.

| Field | Type | Notes |
|---|---|---|
| `totalDurationMs` | `number` | Elapsed ms since `detectedAt`. |
| `impactDurationMs` | `number` | Elapsed ms since `alert.issueTime`. |
| `affectedUsers` | `number` | Customer count from `alert.customerCount`. |
| `currentPhaseLabel` | `string` | Human-readable phase name. |
| `updatesPosted` | `number` | Total published updates. |

<!-- DATA_DICTIONARY_END -->

---

## D1 Database Schema

Backend tables. Field names follow SQL snake_case convention. TypeScript types above are the camelCase UI representation of these rows.

### incidents

| Column | Type | Notes |
|---|---|---|
| `id` | `TEXT` | Primary key. ULID preferred (sortable by creation time). |
| `title` | `TEXT` | Short human-readable label. |
| `description` | `TEXT` | Current problem description. |
| `severity` | `TEXT` | `critical · high · medium · low` — maps to `Severity` enum. |
| `status` | `TEXT` | `active · monitoring · resolved` — maps to `IncidentStatus`. |
| `phase` | `INTEGER` | 1–8. |
| `phase_entered_at` | `INTEGER` | Unix timestamp (ms). |
| `detected_at` | `INTEGER` | Unix timestamp (ms). Set at creation. |
| `resolved_at` | `INTEGER \| NULL` | Unix timestamp (ms). Null until closed. |
| `affected_systems` | `TEXT` | JSON array of system names. |
| `bridge_url` | `TEXT \| NULL` | Conferencing link. |
| `alert_id` | `TEXT \| NULL` | Source alert identifier. |
| `customer_count` | `INTEGER` | Impacted customers at detection. |
| `issue_time` | `INTEGER` | Unix timestamp (ms). When the alert fired. |
| `resolve_time` | `INTEGER \| NULL` | Unix timestamp (ms). When the alert cleared. |
| `external_impact` | `TEXT` | `yes · no · unknown · likely` |
| `sre` | `TEXT` | SRE lead. |
| `mim` | `TEXT \| NULL` | Assigned MIM user ID. |
| `leader` | `TEXT \| NULL` | Incident leader user ID. |
| `service_manager` | `TEXT \| NULL` | Service manager user ID. |
| `customer_ops` | `TEXT \| NULL` | Customer ops lead user ID. |
| `business_impact` | `TEXT` | Business risk statement. |
| `customer_impact_summary` | `TEXT` | Customer-facing impact summary. |
| `risk_level` | `TEXT` | `low · medium · high` |
| `exec_summary` | `TEXT` | Exec brief. |
| `next_update_eta` | `INTEGER \| NULL` | Unix timestamp (ms). |
| `last_communicated_at` | `INTEGER \| NULL` | Unix timestamp (ms). |
| `opened_by` | `TEXT` | User ID of opener. |
| `metadata` | `TEXT \| NULL` | JSON blob for intake source, external IDs. |

**Primary key:** `id`
**Indexes:** `status`, `severity`, `detected_at`

---

### status_updates

| Column | Type | Notes |
|---|---|---|
| `id` | `TEXT` | Primary key (ULID). |
| `incident_id` | `TEXT` | Foreign key → `incidents.id`. |
| `content` | `TEXT` | Update body text. |
| `visibility` | `TEXT` | `public · internal` |
| `author_id` | `TEXT` | User ID of author. |
| `created_at` | `INTEGER` | Unix timestamp (ms). Immutable. |
| `source` | `TEXT` | `web · api · cli`. |

**Primary key:** `id`
**Indexes:** `incident_id`, `created_at`

---

### timeline_events

| Column | Type | Notes |
|---|---|---|
| `id` | `TEXT` | Primary key (ULID). |
| `incident_id` | `TEXT` | Foreign key → `incidents.id`. |
| `type` | `TEXT` | `phase · update · command · alert · action` |
| `title` | `TEXT` | Event headline. |
| `description` | `TEXT` | Event detail. |
| `actor` | `TEXT` | Display name of who performed the action. |
| `created_at` | `INTEGER` | Unix timestamp (ms). |
| `visibility` | `TEXT \| NULL` | `public · internal`. Null = both. |
| `phase_number` | `INTEGER \| NULL` | Set for `phase` type events. |

**Primary key:** `id`
**Indexes:** `incident_id`, `created_at`

---

### milestones

| Column | Type | Notes |
|---|---|---|
| `id` | `TEXT` | Primary key (ULID). |
| `incident_id` | `TEXT` | Foreign key → `incidents.id`. |
| `sequence` | `INTEGER` | Auto-incrementing milestone number within the incident. |
| `title` | `TEXT` | Short headline. |
| `body` | `TEXT` | Full stakeholder/exec summary. |
| `status_at_cut` | `TEXT` | Status snapshot at publish time. |
| `next_update_eta` | `INTEGER \| NULL` | Unix timestamp (ms). |
| `cut_by` | `TEXT` | User ID of publisher. |
| `created_at` | `INTEGER` | Unix timestamp (ms). Immutable. |
| `is_resolution` | `INTEGER` | Boolean (0/1). Marks final milestone. |

**Primary key:** `id`
**Indexes:** `incident_id`, `sequence`, `created_at`

---

### users

| Column | Type | Notes |
|---|---|---|
| `id` | `TEXT` | Primary key. Matches email claim from Cloudflare Access JWT. |
| `email` | `TEXT` | From Cloudflare Access identity. Unique. |
| `display_name` | `TEXT \| NULL` | Human-readable name. |
| `role` | `TEXT` | `mim · stakeholder · executive · admin` |
| `created_at` | `INTEGER` | Unix timestamp (ms). |
| `last_seen_at` | `INTEGER \| NULL` | Unix timestamp (ms). Updated on login. |

**Primary key:** `id`
**Indexes:** `email`, `role`

---

### kpi_definitions

| Column | Type | Notes |
|---|---|---|
| `slug` | `TEXT` | Primary key. Lowercase identifier (`mttr`). |
| `name` | `TEXT` | Display name. |
| `description` | `TEXT` | Human-readable definition. |
| `formula` | `TEXT` | Calculation description or SQL fragment. |
| `units` | `TEXT` | e.g., `minutes`, `percent`, `count`. |
| `targets` | `TEXT \| NULL` | JSON object of thresholds (by severity/persona). |
| `data_sources` | `TEXT \| NULL` | JSON array of required fields/tables. |
| `visibility` | `TEXT` | `internal · exec`. Controls where scorecards show it. |
| `owner` | `TEXT` | Role or user accountable. |
| `review_cadence` | `TEXT \| NULL` | e.g., `quarterly`. |
| `created_at` | `INTEGER` | Unix timestamp (ms). |
| `updated_at` | `INTEGER` | Unix timestamp (ms). |

**Primary key:** `slug`

---

### kpi_observations

| Column | Type | Notes |
|---|---|---|
| `id` | `TEXT` | Primary key (ULID). |
| `kpi_slug` | `TEXT` | Foreign key → `kpi_definitions.slug`. |
| `incident_id` | `TEXT` | Foreign key → `incidents.id`. |
| `timestamp` | `INTEGER` | Unix timestamp (ms) observation time. |
| `value` | `REAL` | Numeric value. |
| `units` | `TEXT` | Copied from definition for audit. |
| `source` | `TEXT` | `worker · ui · import · cli`. |
| `confidence` | `REAL \| NULL` | 0–1 confidence. |
| `metadata` | `TEXT \| NULL` | JSON for calc context. |
| `created_at` | `INTEGER` | Unix timestamp (ms). |

**Primary key:** `id`
**Unique index:** `(kpi_slug, incident_id, timestamp)` for idempotent backfills
**Indexes:** `incident_id`, `kpi_slug`

---

## Relationships

```
User (1) ──── (many) incidents          [opened_by, mim]
Incident (1) ──── (many) timeline_events
Incident (1) ──── (many) status_updates
Incident (1) ──── (many) milestones
KpiDefinition (1) ──── (many) KpiObservation
Incident (1) ──── (many) KpiObservation
```

---

## Real-time State (KV / Durable Objects)

Live incident state is held in Durable Objects and KV for the real-time push path — not D1. D1 is canonical; KV/DO is the fast-path snapshot pushed to connected clients via WebSocket.

**KV key:** `incident:{id}:state`

```json
{
  "id": "01HXZ...",
  "status": "active",
  "severity": "critical",
  "title": "prod-west-db-01 unreachable",
  "mim": "ronnie@example.com",
  "phase": 4,
  "last_update_at": 1709000000000,
  "last_milestone_at": 1709000000000,
  "next_update_eta": null,
  "timeline_event_count": 12,
  "milestone_count": 2
}
```

> This is a denormalized snapshot — not the source of truth. D1 is canonical.

---

## Design Decisions (Resolved)

Previously tracked as open questions. Resolved through implementation.

| Question | Decision |
|---|---|
| **Severity labels** | `Critical / High / Medium / Low` in the UI. Maps to `P1/P2/P3` conceptually for alarm level docs, but the app uses plain-English labels. |
| **Does P3 qualify?** | Yes — `Medium` severity is supported. Box 1 alarm level. Single responder, lighter footprint. |
| **Is `Monitoring` a distinct status?** | Yes. `Active → Monitoring → Resolved` is the full lifecycle. `Monitoring` represents confirmed mitigation but unverified recovery — distinct from resolved. |
| **MIM reassignment mid-incident** | Supported. `updateCommand()` in the MIM view edits any role. All changes are logged to the timeline. |
| **Who can post to the timeline?** | Any participant. `actor` field captures display name. The MIM is not the only voice. |
| **ULID vs UUID** | ULID for all production IDs. Sortable by creation time, which is essential for incident timelines. Mock data uses numeric IDs for simplicity. |
| **Cloudflare Access identity claim** | `email` is the `User.id`. Human-readable, stable, and what Access reliably provides via the JWT identity endpoint. |

---

*Last updated: 2026-03-07 — Reflects `apps/web/src/types/index.ts` v1 (mock data build). D1 schema is design intent, not yet migrated.*
