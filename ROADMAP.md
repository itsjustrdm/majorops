# MajorOps Roadmap

This roadmap is organized by phase, not timeline. Each phase is independently useful — meaning the tool works and delivers value at the end of every phase, not just at the end.

---

## Phase 1 — Foundation
*"The fireground is live."*

The core loop works. An incident can be opened, updated, and viewed in real time.

- [x] Repo structure and tooling setup (Cloudflare Workers, D1, Pages, Vite, React, Tailwind)
- [x] Data model — Incident, PhaseLog, StatusUpdate, PhaseData, IncidentCommand, RecoveryPath, ValidationTracking defined
- [x] REST API — create incident, post status update, advance phase, assign command roles
- [ ] OpenAPI / Hono spec — self-documenting from day one *(Hono is in place; formal spec not yet generated)*
- [x] Fireground view — operator dashboard with phase tracking, inline editing, status update composer, keyboard shortcuts
- [ ] Chrome push notifications — MIM notified on new incident
- [x] Basic auth — Google OAuth via Mocha Users Service *(Cloudflare Access migration planned)*
- [ ] CLI v0.1 — `mim new [type]` opens an incident, `mim update [id] "message"` logs a status update

**Definition of done:** A MIM can open an incident from the UI, log updates, and advance through phases. ✅ *Achieved.*

---

## Phase 2 — The Three Views
*"Everyone sees what they need."*

- [x] Public status page — all incident data visible to internal staff without authentication *(currently combines stakeholder + exec views)*
- [ ] True stakeholder view (10,000 ft) — milestone feed, current status, next expected update *(distinct from current public page)*
- [ ] Executive view (30,000 ft) — polished brief, impact, ETA, last updated *(distinct tier, not yet built)*
- [x] Role-based access — MIM/operator vs. viewer separation *(admin/root role exists; full 3-tier routing not yet built)*
- [ ] Cadence engine — soft prompts to MIM when update is overdue
- [ ] Milestone auto-population — pre-fills from status updates since last milestone

**Definition of done:** An exec can open a link and see a clean, current brief without asking anyone for a status.

---

## Phase 3 — API-First Intake
*"Any team can call for service."*

- [ ] API key management — teams get keys, usage is logged
- [ ] Intake endpoint — `POST /incidents` with minimum viable fields *(authenticated endpoint exists; unauthenticated/keyed intake not yet built)*
- [ ] Webhook intake — accept structured payloads from external tooling
- [ ] CLI v0.2 — installable via npm, `mim` available globally
- [ ] CLI supports team-level API keys — engineers can push updates from runbooks
- [ ] Runbook documentation and templates published

**Definition of done:** An engineer can type `mim new unix-server-down --severity critical --summary "prod-west-db-01 unreachable"` and a MajorOps incident opens and the MIM is notified.

---

## Phase 4 — Comms Engine
*"The right message to the right person, automatically."*

- [ ] Comms templates — editable per incident type
- [ ] Stakeholder distribution lists — per incident, per severity
- [ ] Email send (via Cloudflare Email Workers or SendGrid)
- [ ] Slack/Teams webhook — status update posts to channel automatically
- [ ] Exec brief formatting — print/PDF-ready single-page output
- [ ] Comms history — every send is logged, timestamped, immutable

---

## Phase 5 — Documentation & Public Site
*"MajorOps as a discipline, not just a tool."*

- [ ] Full API reference (auto-generated from OpenAPI spec)
- [ ] MIM user guide *(stub exists — needs expansion)*
- [ ] Stakeholder and Exec user guides
- [x] Philosophy / principles documentation *(PHILOSOPHY.md, ICS-IT-STRUCTURE.md, EXPOSURE_NOTATION.md)*
- [x] Glossary, Alarm Levels, Run Card System, PIR, Response Reputation docs
- [x] MkDocs Material site — branded, Cloudflare Pages deploy-ready, draft review workflow
- [ ] `majorops.io` live
- [ ] Incident Readiness Score (IRS) — per-agency readiness surfaced at dispatch time *(research + design, Phase 5/6)*
- [x] Publish Persona/User Story set — single page covering MIM, Ops, Comms, Service Manager, Exec, Stakeholder, Responder

---

## Phase 6 — Observability & KPIs
*"If you can't measure it, you can't improve it."*

- [ ] Time-to-join tracking — from page to bridge, logged automatically
- [ ] SLA tracking — per-severity response and resolution benchmarks
- [ ] Incident timeline export — full structured record per incident
- [ ] Dashboard — MIM team performance metrics, incident trends
- [ ] KPI reports — per team, per severity, per incident type
- [ ] KPI source of truth — D1 tables (`kpi_definitions`, `kpi_observations`) + Worker endpoints `GET /kpis`, `GET /incidents/:id/kpis`
- [ ] KPI backfill + write path — `mim kpi backfill` CLI task and Worker cron to emit observations
- [ ] Scorecards — exec/stakeholder/responder views consume centralized KPI API, not local calcs

**Note:** This phase is where MajorOps becomes a service improvement tool. If a team should join in 10 minutes and joins in 14, that data exists, it is structured, and it is exportable.

---

## Phase 7 — ServiceNow Integration
*"MajorOps runs the incident. ServiceNow holds the record."*

- [ ] Pull ticket data from ServiceNow on incident open (optional)
- [ ] Push final incident data to ServiceNow on close
- [ ] RCA / writeup generated from incident timeline, pushed as ticket work notes
- [ ] ServiceNow remains single source of truth — MajorOps is the operational layer

---

## Phase 8 — Training & Certification
*"Raise the floor for everyone."*

- [ ] Training module — the MajorOps method
- [ ] Scenario-based exercises using real incident structure
- [ ] Certification framework — define what "good" looks like
- [ ] Data-backed coaching — use real incident data (anonymized) in training

---

## Also Built (Outside Original Roadmap)

These features were built during the GetMocha prototype and are part of the live codebase:

- [x] **Run Card System** — three-tier dispatch architecture (Agency / Generic App / Specific App) with interactive browser, example runcards, and CSI update loop; documented in `docs/RUNCARD-SYSTEM.md`
- [x] **Command assignments** — SRE, MIM, Leader, Service Manager, Customer Ops tracked per incident with join/leave changelog
- [x] **Recovery path tracking** — named paths with assignee, time-box, and outcome (successful / failed / abandoned)
- [x] **Validation tracking** — per-app validation checklist with contact, status, and priority
- [x] **Configurable severities** — admin-managed severity definitions with display order and color coding
- [x] **Configurable phase definitions** — admin-editable phase names, descriptions, and targets
- [x] **Recovery confidence** — MIM-reported confidence signal (Low / Medium / High)
- [x] **Admin portal** — root user can manage severity and phase configuration
- [x] **Customer impact tracking** — external customer impact flag, alert ID, customer count per incident

---

## Guiding Principles for Prioritization

1. **Does it help the MIM do their job right now?** — Always first.
2. **Does it give the right information to the right person?** — Always second.
3. **Does it reduce work without reducing quality?** — Always a filter.
4. **Does it generate data that can improve the practice?** — Long game.

---

*This roadmap is a living document. Phases may run in parallel. Nothing here is a promise — it is a direction.*
