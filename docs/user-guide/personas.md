# Personas & User Stories

> Multi-view by design: MIM fireground (doers), Stakeholder 10k-ft (watchers), Executive 30k-ft (deciders).

---

## Major Incident Manager (MIM / IC)
- As a MIM, I need to open an incident in <10s with only severity, summary, affected systems, and bridge link so that command starts before engineers context-switch.
- As a MIM, I need to assign roles (MIM, Ops, Comms, Service Manager, Customer Ops) with join/leave history so that span-of-control is explicit during handoffs.
- As a MIM, I need milestone drafts auto-cut from the timeline every N minutes so that I only edit for tone before publishing.
- As a MIM, I need cadence nudges when last update > commitment so that execs never ping for status first.

## Operations / Technical Recovery Lead
- As an Ops Lead, I need active recovery paths with owner, timer, and outcome (pass/fail/abandon) so that parallel tracks stay visible and timeboxed.
- As an Ops Lead, I need branch task queues (Infra / App / Cloud) so that I can direct work without stepping on other teams.
- As an Ops Lead, I need a “current bet” field surfaced to stakeholders so that leadership knows what we’re trying right now.

## Comms / Public Information Officer
- As a Comms Lead, I need templates per severity and channel (email, Slack/Teams, status page) so that I can publish in <2 minutes without rewriting.
- As a Comms Lead, I need distribution lists scoped by persona (stakeholder vs exec) so that the right people get the right fidelity automatically.
- As a Comms Lead, I need an immutable comms log with timestamps so that post-incident reviews have a complete send history.

## Service Manager / System Owner
- As a Service Manager, I need to confirm or override customer-impact numbers so that public statements stay accurate.
- As a Service Manager, I need to attach validation checklists per app/service so that resolution gating is explicit.

## Executive Leader (30k ft)
- As an Executive, I need a single-page brief showing phase, severity, impact, ETA to next update, and confidence so that I can decide whether to intervene.
- As an Executive, I need risk-level and business-impact fields translated to business language so that I can update other leaders without technical mediation.

## Internal Stakeholder (10k ft) / Support Manager
- As a Stakeholder, I need a milestone feed with “last update” and “next update ETA” badges so that I don’t have to join the bridge.
- As a Stakeholder, I need a way to subscribe/unsubscribe per incident so that I only get noise for things I own.

## On-call Engineer / Responder
- As a Responder, I need a minimal “what’s needed now” panel (lead, cadence, current bet, blockers) so that I can act without backscrolling chat.
- As a Responder, I need to log timeline events with one keyboard shortcut so that the timeline stays accurate without slowing work.

## Customer Operations
Customer Operations is a **tool-panel-only role**. They do not speak on the bridge and do not receive bridge air time. Their contribution flows through the tool panel, where they post impact statements, answer MIM questions, and validate client-side status. The output appears as MicroUpdates (`source = tool`) and surfaces in the MIM’s impact panel.

- As a Customer Ops participant, I need a structured impact panel showing confirmed-affected client count, unverified-affected client count, and a severity categorization so that I can give the MIM accurate numbers without interrupting the bridge.
- As a Customer Ops participant, I need a Q&A panel where the MIM can post direct questions (“Has Acme confirmed they’re seeing errors?”) and I can post structured answers so that client-specific data flows into the incident record without verbal interruption.
- As a Customer Ops participant, I need to post client impact statements in plain text (“Acme reported errors starting at 14:32, confirmed on Payment API”) so that the MIM has attribution-ready language for stakeholder updates.
- As a Customer Ops participant, I need a validation checklist I can work through after the MIM declares Mitigation (“Has Acme confirmed resolution?”, “Has CSAT outreach been initiated?”) so that client-facing recovery is explicit and tracked.
- As a Customer Ops participant, I need read-only access to the active Milestones so that I can verify the customer-facing language before it publishes, without drafting or editing permissions.

**Bridge discipline note:** Customer Ops is never called on for a verbal update. The MIM queries the panel tool, reads the response, and incorporates it into the next SitRep or Milestone. If a Customer Ops participant needs to raise an urgent issue (a client has escalated to an executive), they flag it in the tool panel with a `!HIGH` tag — the MIM decides when and how to incorporate it.

---

## KPI Source of Truth (cross-persona)

KPIs should live once and feed all views and scorecards.

- **Authoritative store:** Add a `KpiDefinition` table in D1 with fields `slug`, `name`, `description`, `owner`, `formula`, `units`, `targets` (per severity/role), `data_sources`, and `visibility` flags. Keep the schema in `migrations/` and mirror TypeScript types in `apps/web/src/types/`.
- **Recorded values:** Add a `KpiObservation` table keyed by `kpi_slug`, `incident_id`, `timestamp`, `value`, `source` (manual, worker), `confidence`. Workers or the UI write to this; scorecards read from it.
- **Single publication point:** Expose `GET /kpis` (definitions) and `GET /incidents/:id/kpis` (values) from the Worker API. All downstream scorecards (exec, stakeholder, responder readiness) consume these endpoints instead of recomputing locally.
- **Docs:** Keep human-readable definitions and acceptance criteria in `governance/kpis.md` as the narrative source; keep the D1 schema + types as the technical source of truth. Link KPIs into personas here only for context.
- **Backfill & QA:** Provide a CLI task `mim kpi backfill --kpi mttr` to recompute historical values from timeline events, with idempotent writes to `KpiObservation` for auditability.
