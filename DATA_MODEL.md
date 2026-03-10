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
| `Agency` | D1 + `.md` | Tier 1 run card entity. D1 holds structured metadata; card content lives in a versioned `.md` file in the repo. |
| `RunCard` | D1 | Tier 2 (generic app) and Tier 3 (specific app) run card records. Self-service for Tier 3; MIM-authored for Tier 2. |
| `RunCardVersion` | D1 | Immutable snapshot of a run card at each save. Feeds the CSI loop and IRS score. |
| `IncidentRunCard` | D1 | Junction — which run cards were opened during a specific incident. |
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

---

### Run Cards

The run card system uses a split storage model. See [Design Decisions](#design-decisions-resolved) for the rationale.

**New enums:**

| Type | Values |
|---|---|
| `RunCardTier` | `2 \| 3` — Tier 1 is a `.md` file; only Tiers 2 and 3 have D1 records |
| `RunCardStatus` | `active` · `stale` · `draft` |
| `AlarmLevel` | `Box0` · `Box1` · `Box2` · `Box3` |

---

#### Agency

The Tier 1 entity. D1 holds structured metadata; the actual card content is a versioned `.md` file in the repository at `docs/runcards/agencies/{slug}.md`, controlled by the MIM team.

| Field | Type | Notes |
|---|---|---|
| `id` | `string` (ULID) | Agency identifier. |
| `slug` | `string` | URL-safe short name. e.g. `accounting`, `platform-eng`. |
| `name` | `string` | Display name. e.g. `Accounting & Finance`. |
| `shortDescription` | `string` | One-line description of what this agency owns. |
| `division` | `string` | Parent org division or business unit. |
| `tier1CardPath` | `string \| null` | Repo-relative path to the `.md` file. e.g. `docs/runcards/agencies/accounting.md`. |
| `defaultAlarmLevel` | `AlarmLevel` | Default dispatch tier for this agency. Overridden per-incident if needed. |
| `mutualAidAgencies` | `string[]` | Agency IDs this agency depends on or that depend on it. |
| `irsScore` | `number \| null` | Incident Readiness Score (0–100). Computed. Phase 5+. |
| `createdAt` | `string` (ISO) | |
| `updatedAt` | `string` (ISO) | |

---

#### RunCard

Tier 2 (generic app class) or Tier 3 (specific named application). The `tier` field distinguishes them. Content shape varies by tier — stored as a typed JSON blob in `content`.

| Field | Type | Notes |
|---|---|---|
| `id` | `string` (ULID) | Run card identifier. |
| `tier` | `RunCardTier` | `2` or `3`. |
| `agencyId` | `string` | Parent agency (FK → `Agency.id`). |
| `title` | `string` | Tier 2: system category name. Tier 3: application name. |
| `status` | `RunCardStatus` | `active · stale · draft`. Stale = no update in 90 days. |
| `ownerTeam` | `string \| null` | Team name. Null for Tier 2 until ownership transitions from MIM. |
| `ownerEmail` | `string \| null` | Contact for Tier 3 cards. |
| `content` | `RunCardContent` | Tier-specific content blob (see below). |
| `version` | `number` | Monotonically incrementing. Starts at 1. |
| `createdBy` | `string` | User ID of creator. |
| `createdAt` | `string` (ISO) | |
| `updatedAt` | `string` (ISO) | |
| `lastUsedAt` | `string \| null` (ISO) | Last time this card was opened in a live incident. |
| `incidentCount` | `number` | How many incidents have referenced this card. |

---

#### RunCardTier2Content

The structured content blob for Tier 2 (generic app class) run cards.

| Field | Type | Notes |
|---|---|---|
| `systemCategory` | `string` | Human label for the system class. e.g. `HR Systems`, `Payment Processing`. |
| `typicalBusinessImpact` | `string` | What this class of outage typically affects. |
| `alarmLevelDefaults` | `object` | Default alarm level by failure type: `{ fullOutage, degraded, dataIntegrity }` |
| `canTemplate` | `object` | Pre-filled CAN structure: `{ conditions, actions, needs }` — starting text for MIM. |
| `escalationPath` | `string[]` | Ordered contact chain within the owning division. |
| `dependencies` | `string[]` | System categories or agency IDs that typically co-fail. |
| `vendorSlaNote` | `string \| null` | Generic note on vendor RCA SLA expectations for this class. |
| `notes` | `string \| null` | Freeform MIM notes. |

---

#### RunCardTier3Content

The structured content blob for Tier 3 (specific application) run cards. Written and maintained by the technical team.

| Field | Type | Notes |
|---|---|---|
| `applicationName` | `string` | Canonical application name. |
| `onCallRotation` | `string` | Rotation name or link. |
| `healthCheckUrls` | `string[]` | Direct health check endpoint URLs. |
| `dashboardUrls` | `string[]` | Monitoring dashboard links. |
| `runbookUrl` | `string \| null` | Link to the technical runbook. The run card references it — does not replace it. |
| `vendorEscalationContacts` | `VendorContact[]` | Named contacts with priority-level mappings. |
| `knownFailureModes` | `FailureMode[]` | Documented failure patterns with fingerprints and first-response actions. |
| `rto` | `string \| null` | Recovery Time Objective. e.g. `4 hours`. |
| `rpo` | `string \| null` | Recovery Point Objective. |
| `releaseCriteria` | `string[]` | Application-specific conditions that must be true before MIM marks this system recovered. |
| `notes` | `string \| null` | Team notes. Freeform. |

---

#### RunCardVersion

Immutable snapshot saved on every run card update. Powers the CSI loop and the Incident Readiness Score.

| Field | Type | Notes |
|---|---|---|
| `id` | `string` (ULID) | Version record identifier. |
| `runCardId` | `string` | FK → `RunCard.id`. |
| `version` | `number` | Version number at time of snapshot. |
| `content` | `RunCardContent` | Full content snapshot. |
| `changedBy` | `string` | User ID. |
| `changedAt` | `string` (ISO) | |
| `changeReason` | `string \| null` | Optional note on what changed and why. e.g. `Post-major CSI update — INC-247`. |

---

#### IncidentRunCard

Junction table. Records which run cards were opened during a specific incident and at which tier. Feeds the CSI loop — after the incident closes, every linked card gets a review prompt.

| Field | Type | Notes |
|---|---|---|
| `incidentId` | `string` | FK → `Incident.id`. |
| `agencyId` | `string \| null` | Set if a Tier 1 card was referenced (even if content is `.md`). |
| `runCardId` | `string \| null` | Set for Tier 2 or Tier 3 cards. |
| `tier` | `RunCardTier \| 1` | Which tier was active. `1` = agency card only. |
| `linkedAt` | `string` (ISO) | When the MIM opened this card during the incident. |
| `notes` | `string \| null` | MIM note on card relevance or gaps noticed during the incident. |

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

### agencies

Tier 1 run card metadata. The actual card content is a `.md` file in the repository. D1 holds the structured record for relationships, search, and IRS scoring.

| Column | Type | Notes |
|---|---|---|
| `id` | `TEXT` | Primary key (ULID). |
| `slug` | `TEXT` | URL-safe short name. Unique. e.g. `accounting`. |
| `name` | `TEXT` | Display name. e.g. `Accounting & Finance`. |
| `short_description` | `TEXT` | One-line description of systems owned. |
| `division` | `TEXT` | Parent org division. |
| `tier1_card_path` | `TEXT \| NULL` | Repo-relative path to the `.md` file. Null = no card authored yet. |
| `default_alarm_level` | `TEXT` | `box0 · box1 · box2 · box3` |
| `mutual_aid_agencies` | `TEXT` | JSON array of agency slugs. |
| `irs_score` | `INTEGER \| NULL` | Incident Readiness Score (0–100). Computed by Worker. Phase 5+. |
| `created_at` | `INTEGER` | Unix timestamp (ms). |
| `updated_at` | `INTEGER` | Unix timestamp (ms). |

**Primary key:** `id`
**Unique index:** `slug`
**Indexes:** `division`

---

### runcards

Tier 2 (generic app class) and Tier 3 (specific app) run cards. Tier 1 content lives in `.md` files; only the agency metadata row in `agencies` represents Tier 1 in D1.

| Column | Type | Notes |
|---|---|---|
| `id` | `TEXT` | Primary key (ULID). |
| `tier` | `INTEGER` | `2` or `3`. |
| `agency_id` | `TEXT` | Foreign key → `agencies.id`. |
| `title` | `TEXT` | Tier 2: system category name. Tier 3: application name. |
| `status` | `TEXT` | `active · stale · draft`. Worker sets `stale` when `updated_at` > 90 days. |
| `owner_team` | `TEXT \| NULL` | Owning team name. Null for Tier 2 until ownership transitions from MIM. |
| `owner_email` | `TEXT \| NULL` | Owning team contact. Primarily for Tier 3. |
| `content` | `TEXT` | JSON blob. Shape differs by tier — see `RunCardTier2Content` / `RunCardTier3Content`. |
| `version` | `INTEGER` | Monotonically incrementing. Starts at 1. |
| `created_by` | `TEXT` | User ID of creator. |
| `created_at` | `INTEGER` | Unix timestamp (ms). |
| `updated_at` | `INTEGER` | Unix timestamp (ms). |
| `last_used_at` | `INTEGER \| NULL` | Unix timestamp (ms). Set when this card is linked to an incident. |
| `incident_count` | `INTEGER` | Denormalized count of incident references. Updated on `incident_runcards` insert. |

**Primary key:** `id`
**Indexes:** `tier`, `agency_id`, `status`, `updated_at`

---

### runcard_versions

Immutable snapshot written on every save. Never updated after insert.

| Column | Type | Notes |
|---|---|---|
| `id` | `TEXT` | Primary key (ULID). |
| `runcard_id` | `TEXT` | Foreign key → `runcards.id`. |
| `version` | `INTEGER` | Version number matching `runcards.version` at time of snapshot. |
| `content` | `TEXT` | Full JSON content snapshot. |
| `changed_by` | `TEXT` | User ID. |
| `changed_at` | `INTEGER` | Unix timestamp (ms). |
| `change_reason` | `TEXT \| NULL` | e.g. `Post-major CSI — INC-247`. Links changes back to incidents. |

**Primary key:** `id`
**Indexes:** `runcard_id`, `changed_at`
**Unique index:** `(runcard_id, version)` — no two versions share the same number for a given card.

---

### incident_runcards

Junction table. Tracks which run cards were opened during each incident and at which tier. Every row is a CSI trigger — after the incident resolves, each linked card receives a review prompt.

| Column | Type | Notes |
|---|---|---|
| `incident_id` | `TEXT` | Foreign key → `incidents.id`. |
| `agency_id` | `TEXT \| NULL` | Set when a Tier 1 agency was referenced (even if card content is a `.md` file). |
| `runcard_id` | `TEXT \| NULL` | Set for Tier 2 or Tier 3 card references. Null if only Tier 1 was consulted. |
| `tier` | `INTEGER` | `1 · 2 · 3` — which tier was active for this reference. |
| `linked_at` | `INTEGER` | Unix timestamp (ms). When the MIM opened the card during the incident. |
| `notes` | `TEXT \| NULL` | MIM observation on gaps or issues. Feeds the CSI loop and card update prompts. |

**Primary key:** `(incident_id, agency_id, runcard_id)` — composite prevents duplicate links.
**Indexes:** `incident_id`, `runcard_id`, `agency_id`

---

## Relationships

```
User (1) ──── (many) incidents               [opened_by, mim]
Incident (1) ──── (many) timeline_events
Incident (1) ──── (many) status_updates
Incident (1) ──── (many) milestones
KpiDefinition (1) ──── (many) KpiObservation
Incident (1) ──── (many) KpiObservation

Agency (1) ──── (many) runcards              [agency_id]
RunCard (1) ──── (many) runcard_versions     [runcard_id]
Incident (many) ── (many) Agency             [via incident_runcards]
Incident (many) ── (many) RunCard            [via incident_runcards]
```

**Run card storage:**
```
Tier 1 (Agency)
  ├── D1: agencies table          ← metadata, contacts, IRS score, slug
  └── Git: docs/runcards/agencies/{slug}.md  ← card content, MIM-controlled

Tier 2 (Generic App)
  └── D1: runcards (tier=2)       ← full structured content + version history

Tier 3 (Specific App)
  └── D1: runcards (tier=3)       ← self-service by technical teams
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
| **Run card Tier 1 storage** | Tier 1 (Agency) card *content* lives as `.md` files in the repo, MIM-controlled and git-versioned. D1 holds the agency *metadata* record (slug, contacts, default alarm level, IRS score) so the app can query, link, and score agencies without parsing markdown. Tier 2 and Tier 3 live entirely in D1. |
| **Run card versioning** | Every save to a Tier 2 or Tier 3 card writes an immutable row to `runcard_versions`. Tier 1 versioning is handled by git. The `change_reason` field links card updates back to specific incidents, enabling the CSI loop. |
| **IRS score computation** | Computed by a scheduled Worker — not written by the UI. Stored in `agencies.irs_score`. Phase 5+ feature; schema supports it now so the column exists when the Worker ships. |

---

*Last updated: 2026-03-09 — Reflects `apps/web/src/types/index.ts` v1 (mock data build). D1 schema is design intent, not yet migrated.*
