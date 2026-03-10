# MajorOps

> *Because major incidents deserve more than a ticket.*

MajorOps is a real-time incident command platform built for Major Incident Managers and the teams they coordinate. It replaces the chaos of bridge calls, Slack threads, and clunky ticket systems with a structured, live operational environment — purpose-built for the speed and clarity that major incidents demand.

---

## The Problem

Modern IT operations borrows almost nothing from the disciplines that have mastered high-stakes coordination under pressure — emergency services, aviation, and medicine. Major Incident Managers work like 911 dispatchers but with the tools of a help desk. Teams join calls without context. Updates get lost in Slack. Executives get silence or noise — rarely signal.

MajorOps changes that.

---

## What It Does

**For the Major Incident Manager (the Fireground)**
A live command interface. Phase progression tracked in real time. Status updates posted instantly. Command assignments, recovery paths, and validation tracking — all in one view. No forms. No friction. The clock starts the moment the incident opens.

**For Internal Stakeholders (10,000 ft)**
A public status page with complete transparency. Active incidents, phase history, status updates, and structured data — visible to all internal staff without authentication.

**For Executive Leadership (30,000 ft)**
Clean, current incident status at a glance. Impact, phase, severity, and last update — without needing to ask anyone.

One data source. Multiple lenses. Zero duplication of effort.

---

## Core Concepts

- **Tiered Awareness** — Not everyone needs the same information. MajorOps delivers the right fidelity to the right audience automatically.
- **8-Phase Incident Model** — Alert → Gather → Assess → Initial → Isolation → Mitigation → Validation → Resolution. Every incident moves through a structured lifecycle.
- **The MIM is the 911 Dispatcher, Not the Paramedic** — Routes signals, sets cadence, keeps span-of-control. MajorOps is built around that role.
- **Call for Service** — Any team, any system can open a MajorOps incident with a minimum viable set of fields.
- **Full Transparency** — All viewers are internal. No data is hidden. Everyone sees what they need to coordinate effectively.

---

## Architecture

Built entirely on Cloudflare's edge platform:

| Component | Technology | Purpose |
|---|---|---|
| API & Backend | Cloudflare Workers + Hono | REST API, business logic, auth middleware |
| Database | Cloudflare D1 (SQLite) | Incidents, phase logs, status updates, command data |
| Frontend | React + TypeScript + Vite | Operator dashboard, public status page, admin portal |
| Styling | Tailwind CSS | Fire department red dark-mode design system |
| Auth | Google OAuth (via Mocha Users Service) | Operator authentication — viewers are unauthenticated |
| Hosting | Cloudflare Pages | Static frontend deployment |

No servers. No DevOps. Globally distributed on day one.

> **Planned:** Migrate auth to Cloudflare Access for zero-trust SSO. Replace Mocha Users Service dependency.

---

## Project Structure

```
majorops/
├── apps/
│   ├── web/                 # React + TypeScript + Vite — operator dashboard, status page, admin portal
│   ├── worker/              # Cloudflare Worker + Hono — REST API, business logic, auth middleware
│   └── cli/                 # CLI (planned) — mim new / mim update
├── migrations/              # D1 schema, versioned
├── schema/                  # Shared type definitions
├── docs/                    # MkDocs Material documentation site (deploys to majorops.io)
│   ├── philosophy/
│   │   ├── PHILOSOPHY.md          # Core principles — why MajorOps exists and how it thinks
│   │   ├── ICS-IT-STRUCTURE.md    # IT Incident Command System — role definitions and command structure
│   │   └── EXPOSURE_NOTATION.md  # METAR-style single-line incident status format
│   ├── governance/
│   │   ├── PIR.md                 # Post-Incident Review process
│   │   └── RESPONSE-REPUTATION.md # Future: gamified responder readiness scoring
│   ├── runcards/
│   │   ├── index.md               # Run card browser and overview
│   │   ├── runcard-browser.html   # Interactive three-tier dispatch browser
│   │   └── *.html                 # Tier 1/2/3 runcard examples
│   ├── api-reference/             # API docs (stub — auto-gen from OpenAPI planned)
│   ├── user-guide/                # MIM user guide (in progress)
│   ├── stylesheets/
│   │   └── extra.css              # Brand CSS overrides for MkDocs Material
│   ├── GLOSSARY.md                # Shared vocabulary
│   ├── ALARM-LEVELS.md            # Box 0–3 escalation system
│   ├── RUNCARD-SYSTEM.md          # Three-tier dispatch architecture
│   ├── CONTRIBUTING.md            # Contribution guidelines
│   └── index.md                   # Site home
├── overrides/
│   └── main.html                  # MkDocs template override — draft banner
├── mkdocs.yml                     # MkDocs Material config
├── requirements.txt               # mkdocs-material
├── ROADMAP.md
├── DATA_MODEL.md
├── BRAND.md
├── REVIEWED.md                    # Vault consolidation audit trail
└── wrangler.json
```

---

## The 8-Phase Incident Model

| Phase | Name | Purpose |
|---|---|---|
| 1 | Alert | Incident detected and opened |
| 2 | Gather | Information collection — can be re-entered |
| 3 | Assess | Scope and impact assessment |
| 4 | Initial | Initial response actions |
| 5 | Isolation | Fault isolation |
| 6 | Mitigation | Active mitigation underway |
| 7 | Validation | Recovery validation across affected systems |
| 8 | Resolution | Incident closed |

---

## Data Model

Key entities: `Incident`, `PhaseLog`, `StatusUpdate`, `PhaseData`, `IncidentCommand`, `CommandChangeLog`, `RecoveryPath`, `ValidationTracking`, `SeverityDefinition`, `PhaseDefinition`.

See [`DATA_MODEL.md`](./DATA_MODEL.md) for the full model design. See [`migrations/`](./migrations/) for the live D1 schema.

---

## Running Locally

```bash
# Platform app
npm install
npm run dev
```

Requires a `.dev.vars` file with Cloudflare and Mocha credentials. See `wrangler.json` for binding names.

```bash
# Documentation site
pip install mkdocs-material
mkdocs serve
```

---

## Roadmap

See [`ROADMAP.md`](./ROADMAP.md) for phased delivery plan.

---

## Documentation

The `docs/` folder is a full MkDocs Material site covering the framework behind MajorOps — the principles, command structure, run card system, alarm levels, glossary, and governance processes. It deploys to `majorops.io` via Cloudflare Pages.

To run the docs locally:

```bash
pip install mkdocs-material
mkdocs serve
```

**Latest additions:** Stakeholder and Executive user guides plus a reusable Data Dictionary page (sourced from `DATA_MODEL.md`).

Pages marked `draft: true` in frontmatter display a DRAFT banner and are pending review before publication.

- **Personas & User Stories:** `docs/user-guide/personas.md` — consolidated stories for MIM, Ops, Comms, Service Manager, Exec, Stakeholder, and Responder.
- **KPI Source of Truth:** `docs/governance/kpis.md` — single, authoritative KPI definitions. Backed by D1 tables `kpi_definitions` and `kpi_observations` (see `schema/migrations/0001_kpis.sql`) and UI types in `apps/web/src/types/index.ts`.

---

## Status

> ✅ v0.1 complete — core incident management, 8-phase tracking, public status page, operator dashboard, admin portal, command assignments, recovery path tracking, validation tracking, configurable severities.
>
> ✅ Documentation site (MkDocs Material) — philosophy, command structure, run card system, alarm levels, glossary, governance — deployed to Cloudflare Pages.
>
> 🚧 Active development — tiered views, Cloudflare Access migration, CLI, comms engine, and `majorops.io` launch next.

---

## Design System

**Fire Department Red — Signal Black**

- Primary Red: `#CC0000` — main action color, all accents
- Background: `#0A0A0A` — Signal Black
- Surface: `#111111` / `#1A1A1A` / `#2A2A2A` — layered depth
- Text: `rgba(242, 242, 242, 0.87)` — primary
- Muted: `rgba(136, 136, 136, 0.54)` — secondary
- Fonts: Orbitron (display) · Saira Condensed (headings) · IBM Plex Sans (body) · IBM Plex Mono (code)
- Geometry: zero border-radius throughout

Visual language drawn from emergency services and command centers. High contrast. High density. Built for high-stress situations. See [`BRAND.md`](./BRAND.md) for full design system documentation.

---

## Philosophy

MajorOps is opinionated. It is not a generic incident tool. It is built around a specific belief: that the people managing major incidents deserve purpose-built tooling that respects the cognitive load of the role — and that the organizations they serve deserve the transparency and structured communication that currently only exists in the best-run emergency operations centers.

The goal is not to replace ServiceNow. It is to make the time between "incident opened" and "incident closed" dramatically more effective — and to make that work visible, learnable, and improvable over time.

---

*MajorOps is developed and maintained independently. Built on Cloudflare.*
