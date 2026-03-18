---
draft: true
---

# MajorOps Changelog

> *Release notes for people who know what a Gamewell box is, or are about to find out.*

---

## [0.9.0] — 2026-03-17 — "The CAD Presence Model"

> *"Every engine on scene must be tracked. Every unit working a thread must be visible."*
> — ICS Field Operations Guide

### What shipped

**Recovery Paths** — Parallel recovery tracks, each with independent phase state. You can run three investigation threads simultaneously, advance or regress each independently, and when the wrong team was chasing the wrong thread, you don't lose the record — you log the regression. That data goes into the Learning Review. It's worth keeping.

**Hypothesis Tracking** — First-class entities, not Slack messages. Every hypothesis gets a lifecycle: `active → validated / eliminated / discarded`. Eliminated ≠ deleted. Three months from now, when the same failure mode surfaces in a different form, you want to know that someone tried this exact DB connection hypothesis in February and what they found. Now you can know that.

**MicroUpdate Feed** — The MIM's working memory, made structural. There are three update types in a major incident: the raw note you type during active investigation (`bridge`), the tool output a responder pastes in (`tool`), and the automated heartbeat from your monitoring stack (`system`). All three are different. We model them differently. CAD systems do not throw dispatch notes, unit status updates, and zone alerts into the same bucket. Neither should you.

**CAD Presence Roster** — Who is on scene, what role they hold, whether they're active or silent. Inspired directly by the Computer-Aided Dispatch model. When a leader joins and has `rapidEscalationFlag` set, the roster surfaces that — the MIM sees it, knows what's available, and makes the call. No information is withheld. Every lens gets the right view.

**Team Dispatch + Response Credit Scores** — Structured paging with structured accountability. Team name is selected from a validated list — no free-text drift that makes `team-page-to-bridge` unqueryable three incidents later. Contact name is free text because account verification is not the MVP constraint. Bridge arrival is logged manually for now; Phase 2 is an "I'm here" button that writes the timestamp precisely. Rolling per-team scores inspired by the ISO Public Protection Classification: a 1–10 readiness rating that accumulates across incidents. When a team is consistently slow, that surfaces in the KPIs — not at 2am via social pressure.

**Stats for Nerds dashboard** — `/analytics`. All the data we can collect, rendered in a way that would make a CAD system operator feel at home. MTTx trends, MTTA velocity, phase duration analysis (where does time actually go?), hypothesis effectiveness by category, team dispatch credit leaderboard, ops readiness radar. This is not a vanity dashboard. This is the data that justifies the on-call contract.

**New Incident flow** — `/new`. Three steps, under 10 seconds. Severity → Details → Review → Open. The MIM declares the incident before the engineers finish context-switching. That's the point.

**Fireground tabs** — The MIM view now has Fireground / Dispatch / Milestones / Timeline. The right information at the right time for the right role. An amber pulse on the Dispatch tab when there are pending pages. Because pending pages are the thing that should feel urgent.

---

### Design decisions worth documenting

**On guardian doctrine**: We removed the "sleep schedule" framing. We page on-call rotations — managed by the rota manager for each team, committed to by each team's staffing structure. Named escalation (out-of-rotation contact) requires explicit MIM or leader authorization, goes in the incident record, and is documented as a deliberate decision. When a VP on scene requests their architecture lead be pulled in outside rotation, that request goes through the MIM, gets logged, and is visible. The accountability mechanism is the KPIs, not the 2am phone call. The rota manager drives reform. The platform surfaces the data.

**On hypothesis lifecycle**: We considered soft-delete. We didn't ship it. Hypotheses are never truly gone — their elimination is the finding. A discarded hypothesis without a reason is just a missing note. We track both.

**On recovery path phase regression**: Intentional. If a path was at Isolation and turns out the wrong team was engaged, regress to Gather. The regression itself is informative. Learning Reviews get better data when the system models reality instead of hiding it.

**On free text**: MIMs are already running Excel sheets and Slack DMs and personal Notes docs during major incidents. MajorOps doesn't ask them to change how they work. It gives structure to what they're already doing. The free-text MicroUpdate field exists because capturing the information is the first priority. The recovery path association is the second. The query is what happens six months later, when someone asks "how long did we spend in isolation on this class of failure?"

---

### Metrics targets (as of this release)

| KPI | Target | Status |
|---|---|---|
| MTTA | P1 ≤10m | ✅ Tracking at 7.2m avg |
| MTTR | P1 ≤120m, P2 ≤240m | ✅ 58m / 131m (6-month trend) |
| Cadence Adherence | ≥90% | ✅ 94% |
| Team Bridge Arrival | Box3 ≤5m | 🟡 6/8 teams in target |
| Team Ack Time | Box3 ≤2m | 🟡 5/8 teams in target |

---

### Coming in 0.10.0

- Cloudflare Worker + D1 backend — real persistence, real API, OpenAPI spec
- Cloudflare Access JWT guard on MIM routes (replacing `?admin=true` stub)
- "I'm here" button — Phase 2 arrival confirmation with `arrived_at` precision
- Learning Review screen — structured post-incident, feeds hypothesis archive
- Stakeholder brief auto-generation (AI-assisted, MIM-approved, one click)
- Status page embeds — customer-facing incident widget for status.yourdomain.com
- Webhook triggers — Slack/Teams notification on phase advance, team page, milestone post

---

## [0.8.0] — 2026-02-28 — "The Foundation Build"

> *"The tools exist — Slack, Jira, PagerDuty, ServiceNow. And yet, the pattern repeats."*

### What shipped

Complete UI foundation: Signal Black design system, Orbitron/Saira Condensed/IBM Plex type stack, zero border-radius geometry, Fire Red primary, amber urgency, wartime/peacetime logo states.

Public views: Status Page (`/`), Incident Detail (`/incidents/:id`), Stakeholder view, Executive view.

Phase bar: 8 chevron steps, color-coded by completion state and severity, pulse animation on active phase for Critical/High.

Admin MIM view: Inline editing throughout, PhaseCommandPanel with phase advancement, postUpdate, AI-draft placeholder, CommandTeam, AlertInfoPanel, BridgeBanner, MetricsSidebar.

Mock data: Three realistic incidents — Payment Processing (P1, Active), Storage Regional Failure (P2, Monitoring), Auth Latency Spike (P2, Active).

FixedFooterBar: Duration, impact user count, phase, update count — always visible, always current.

---

### On the name

**mim.run** — the MIM's command URL. Fast to type. Works from any browser. No VPN.
**majorops.io** — the product domain. Deployable to Cloudflare Workers. Edge-native.
**new.mim.run** — the modern Gamewell box. Pull it to open an incident.

The analogy holds. The box number told the central station operator everything they needed to dispatch. The severity selection tells MajorOps everything it needs to activate command. The MIM runs the response. The structure was designed before the incident started.

---

*Wartime performance is determined by peacetime preparation.*

*— MajorOps v0.9.0*
