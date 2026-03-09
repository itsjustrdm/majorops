---
draft: true
---

# Run Card System

**Status:** Living Document — Tier 1 and Tier 2 templates in progress. Tier 3 portal is a Phase 5+ product feature.

---

## The Dispatch Analogy

In public safety, a 911 center does not serve one agency. It dispatches for many — multiple fire departments, EMS providers, law enforcement agencies, and specialty units. Each agency maintains its own run cards. The 911 center holds the dispatch protocol. The agency holds the response plan. The pre-plan for a specific building or hazard is owned by the company that responds to it.

> **TODO — CITE:** NFPA 1620 *Recommended Practice for Pre-Incident Planning*. The gold standard for building-level pre-incident plans in the fire service. Direct analog to Tier 3 specific app runcards. Find the latest edition and pull the scope language.

> **TODO — CITE:** APCO/NENA standards for Computer-Aided Dispatch (CAD) call processing. CAD systems hold agency profiles and dispatch determinants — the functional equivalent of Tier 1 agency runcards. Look at APCO ANS 1.101 or NENA i3 architecture docs for dispatch logic language.

> **TODO — CITE:** Medical Priority Dispatch System (MPDS) / ProQA protocols. EMD dispatchers follow pre-determined chief complaint protocols with tiered determinant codes. ~33 protocols, each with severity-gated response levels. This is the cleanest parallel to the three-tier model — chief complaint = agency, determinant = alarm level, pre-arrival instructions = the runcard itself.

This same architecture — 911 center → agency → occupancy — maps cleanly to IT incident response.

---

## Three Tiers

### Tier 1 — Agency Run Card

**Owner:** MIM
**Scope:** Engineering division or business unit
**Stability:** High — rarely changes
**Purpose:** Answer the question: *"Something is wrong in [Division]. What do I know before I know anything else?"*

An Agency Run Card is the IT equivalent of a fire department's agency profile in the 911 CAD system. It does not describe a specific application or failure mode. It describes the *organization that owns* the systems — who they are, what they protect, how to reach them, and what their default alarm posture is.

**Minimum contents:**
- Division name and short description
- Primary contact chain (Manager on duty, Director, escalation path)
- Systems and application categories owned (not individual apps — categories)
- Default alarm level triggers for this division
- Mutual aid dependencies (other divisions this one relies on or that rely on it)
- Known scheduled maintenance windows or fragile periods

**Example:** An "Accounting Division" agency card tells MIM that Accounting owns payroll, billing, HR systems, and benefits platforms. It lists the Finance Technology Manager as primary contact. It notes that payroll processing runs Thursdays 8–11 PM and is a hard freeze window. That is enough to start a Box 1 response before anyone knows which specific system is down.

> **TODO — CITE:** FEMA NIMS Resource Typing Library Tool (RTLT). NIMS standardizes "resource types" across agencies so that any requesting agency knows what they're getting when they ask for a Type 1 Engine or a Type 3 Incident Management Team. The Agency Run Card performs an analogous function — standardizing what "Accounting" means as a response entity so MIM doesn't have to ask from scratch every time.

---

### Tier 2 — Generic Application Run Card

**Owner:** MIM (at launch), transitions to division over time
**Scope:** Application category or system class
**Stability:** Medium — updated after majors, reviewed quarterly
**Purpose:** Answer the question: *"[Category] is down. What's the play before we know the specific product?"*

A Generic Application Run Card is written for a *class* of system, not a named product. "HR Systems down" is a valid trigger. "Payment Processing degraded" is a valid trigger. You do not need to know whether it is Workday or Kronos or a homegrown system to run this card — the response play for a down HR system has common elements regardless of vendor.

This tier is where the response framework lives. Phases, CAN structure, escalation path, release criteria — these are all stable enough to define at the category level. Specific diagnostic steps may vary by product, but the command and communication skeleton does not.

**Minimum contents:**
- System category and typical business impact
- Alarm level default for full outage vs. degraded vs. data integrity concern
- Generic CAN template (pre-filled Conditions and Actions that apply to any system in this class)
- Escalation path within the owning division
- Dependencies and blast radius (what else typically breaks when this category fails)
- Known vendor SLA and escalation contact structure (generic — specific contacts live in Tier 3)

> **TODO — CITE:** Emergency Medical Dispatch determinant coding. In EMD, a "chief complaint" (chest pain, unconscious person, difficulty breathing) maps to a protocol number. Within each protocol, caller information determines a response determinant (Alpha through Echo), each with a pre-defined response level. The Generic App Run Card functions like an EMD protocol — chief complaint-level abstraction with tiered severity mapping baked in.

---

### Tier 3 — Specific Application Run Card

**Owner:** Technical team — fully self-service
**Scope:** Named application or service
**Stability:** Variable — expected to update after every major
**Purpose:** Answer the question: *"Workday is down. What do we actually do?"*

Tier 3 cards are owned entirely by the technical teams. MIM does not write them. MIM does not maintain them. The platform provides a self-service portal where teams define their own response play at the product level. This is the pre-plan — the occupancy-specific document written by the people who know the building.

Teams that do not create Tier 3 cards are not penalized. Tier 2 covers them. But teams that do create them get faster, more accurate response. The incentive is self-evident once the system is running.

**Minimum contents:**
- Application name, owner, and on-call rotation
- Health check endpoints and monitoring dashboard links
- Specific diagnostic runbook (not CAN — this is their territory)
- Vendor escalation contacts and case priority mappings
- Known failure modes and their fingerprints (exposure notation patterns, if adopted)
- Recovery time objectives (RTO) and recovery point objectives (RPO)
- Application-specific release criteria

> **TODO — CITE:** NFPA 1620 occupancy pre-plan content requirements. The standard specifies what a building pre-plan must contain — construction type, hazard contents, utility shutoffs, water supply, access points. This is the structural parallel to the Tier 3 content requirements above.

> **TODO — RESEARCH:** Find a publicly available CAD or dispatch agency that publishes their pre-plan or run card SOPs. LA County Fire, Chicago Fire, NYC Fire all maintain pre-incident planning programs. Some agencies publish program structure if not the plans themselves. FDNY has published aspects of their high-rise pre-fire plan program. Goal: cite a named real-world program, not just an NFPA standard.

---

## Ownership Model

The three tiers have different ownership because they have different change cadences and different knowledge requirements.

| Tier | Owner | Change Trigger | MIM Role |
|------|-------|---------------|----------|
| 1 — Agency | MIM | Org restructure, contact change | Author, maintain |
| 2 — Generic App | MIM → Division | Post-major CSI, quarterly review | Author at launch, hand off over time |
| 3 — Specific App | Technical team | Post-major CSI, self-initiated | Never |

The transition of Tier 2 ownership is not a formal handoff event. It happens through the CSI loop. After enough major incidents cycle through a division, the technical teams have opinions about the generic card. That opinion is the on-ramp. "That generic card doesn't reflect how we actually respond" is the sentence that turns a technical team into a contributor.

---

## The CSI Loop

Every major incident is a data point. The run card system captures that data systematically.

**After every Major (P1/Box 3):**
- MIM reviews the applicable Tier 1 and Tier 2 cards against what actually happened
- Any card that diverged from reality is flagged for update
- Technical teams review their Tier 3 card (if one exists) and submit updates
- Maximum update cadence: **one update per card per week**, even if multiple majors occur in that period

This is Continuous Service Improvement applied at the dispatch layer, not the infrastructure layer. The cards get sharper through use, not through planning exercises.

> **TODO — CITE:** NTSB accident investigation process — specifically how NTSB findings feed back into FAA regulations, operator SOPs, and training programs. The CSI loop described above mirrors the NTSB → FAA → airline SOP update cycle. Each incident improves the response protocol for the next one.

> **TODO — CITE:** IAFC (International Association of Fire Chiefs) on post-incident analysis feeding pre-fire plan updates. Some fire departments have formal programs that require pre-fire plans to be reviewed after a significant incident at a known occupancy. Looking for a named program or IAFC publication.

---

## Dispatch Logic

The three tiers are not just a filing system. They define how MIM dispatches during a live incident when information is incomplete.

```
INCOMING REPORT: "Something is wrong with payroll"

  → No specific system identified
  → Look up Tier 1: Accounting Division Agency Card
  → Confirm payroll is in scope, get primary contact, set default alarm level
  → Tier 1 active — open incident, begin CAN loop

  → Contact reached: "It's the HR system — Workday"
  → Look up Tier 2: HR Systems Generic App Card
  → Run generic CAN, escalate to division Ops Chief
  → Tier 2 active — apply generic response play

  → SME on bridge: "I know this one, let me pull the runcard"
  → Look up Tier 3: Workday Specific App Card (if exists)
  → SME drives from here
  → Tier 3 active — MIM maintains command, technical team runs the play
```

At each tier transition, the incident *gains specificity* without losing structure. MIM maintains command and communication. The technical team gains more ownership of the diagnostic work as information improves.

---

## Self-Service Portal (Phase 5+)

The Tier 3 self-service experience is a future product feature. When it ships:

- Teams access a structured form to create or update their app's run card
- Updates are versioned and timestamped
- A diff is shown to MIM after any update to a card they've used in a live incident
- Teams receive a prompt to review their Tier 3 card after any major incident touches their application
- Cards with no updates in 90 days are flagged as "stale" — not removed, flagged

The portal is not mandatory. Tier 2 always exists as a fallback. The portal is the on-ramp, not the requirement.

---

## What This Is Not

A run card is not a runbook. A runbook is a diagnostic procedure document, typically owned by engineering, typically long, typically version-controlled in a code repository. Run cards and runbooks serve different audiences at different moments in an incident.

| | Run Card | Runbook |
|---|---|---|
| **Audience** | MIM + command structure | Technical SME |
| **Moment** | First 30 minutes | After isolation |
| **Format** | Structured, fast, checklist-driven | Detailed, procedural, diagnostic |
| **Owner** | MIM (Tier 1/2), Team (Tier 3) | Engineering team |
| **Update cadence** | Post-major, max 1/week | As-needed by team |

A run card references a runbook. It does not replace it. *"See runbook: [link]"* is a valid and complete CAN entry.

> **TODO — CITE:** FEMA ICS-208 Safety Message / Incident Action Plan forms. ICS formalizes the distinction between the IAP (command-level, structured, covers the operational period) and technical annexes (specialist-level, detailed, owned by the relevant unit). Same relationship.

---

---

## Incident Readiness Score (Future Feature)

**Status:** Concept only. Not yet specced. Add to DATA_MODEL.md and ROADMAP.md when ready to build.

> **TODO — Spec this properly as a product feature in DATA_MODEL.md and ROADMAP.md once the concept is firm.**

The Incident Readiness Score (IRS) is a per-agency metric visible at the moment of dispatch. When MIM opens the Accounting & Finance agency card during a live incident, they should immediately see a readiness indicator — not just contacts and systems, but a signal for *how prepared this agency is to be managed through a major*.

The fire service parallel: when a first-alarm company is dispatched to a warehouse, modern CAD systems can surface that building's pre-plan compliance status — the last inspection date, whether the pre-plan is current, whether there are known hazards. A warehouse with 10 consecutive failed fire readiness inspections and a warehouse with 10 consecutive passes are two different dispatch profiles, even before the first unit arrives on scene.

> **TODO — RESEARCH:** Find a specific FD or municipal fire inspection program that publicly documents how compliance scores or inspection history are made available to responding units via CAD or mobile dispatch terminals. FDNY, LAFD, and Chicago Fire all have formal pre-fire plan programs. Some publish program structure. Looking for evidence that readiness data is surfaced *at dispatch time*, not just stored in a file.

> **TODO — RESEARCH:** NFIRS (National Fire Incident Reporting System) — the federal database of fire incident data. Does NFIRS data feed back into pre-plan readiness scores? This would be the CSI analog: each incident improves the occupancy profile.

### What the IRS Measures

The IRS is not a performance review. It is a readiness signal — a quick indicator of how much scaffolding MIM may need to provide during the incident.

| Input Signal | Weight | Rationale |
|---|---|---|
| Tier 2 card coverage (% of systems with a card) | High | Missing cards = blind spots |
| Tier 3 card coverage (% of generic apps with ≥1 specific card) | Medium | Team engagement proxy |
| Days since last card update | High | Stale cards mislead more than no card |
| After Action completion rate (last 12 months) | High | Measures learning loop closure |
| Open After Action tasks past due | High | Unresolved issues = known gaps |
| Post-major CSI update compliance | Medium | Did the team update after the last major? |
| Contact chain reachability (% pages answered in last 90 days) | Medium | The card is only as good as the contacts |

### Score Bands (Illustrative)

| Score | Band | What MIM Should Expect |
|---|---|---|
| 85–100 | Green | Battle-tested. Cards current. Team engaged. Run the play. |
| 65–84 | Amber | Moderate gaps. Some cards stale or missing. More hand-holding likely. |
| 40–64 | Red | Significant gaps. Cards may be wrong. Treat as first contact. |
| <40 | Critical | Agency has not engaged with the system. MIM is starting from scratch. |
| — | Pending | No data yet. New agency or no incidents recorded. |

### Score Visibility

The IRS should appear:
- On the agency card in the Run Card Browser (always visible, not just during incidents)
- In the incident view when MIM opens a card during a live incident
- In the Learning Review, as context for why the incident unfolded the way it did

The score is read-only for technical teams. It is informational, not punitive. Teams do not lose anything when their score is low — they gain visibility into what they need to build.

### Implementation Prerequisites

The IRS requires data that does not yet exist in the platform:
- Card version history and update timestamps
- After Action completion tracking linked to specific incidents and agencies
- Contact reachability logging (page response rates)
- Post-major CSI flag per card

This is a Phase 5+ feature. Do not build the score until the underlying data model supports it.

---

*Part of the MajorOps living framework. See also: [ALARM-LEVELS.md](ALARM-LEVELS.md), [ICS-IT-STRUCTURE.md](philosophy/ICS-IT-STRUCTURE.md), [GLOSSARY.md](GLOSSARY.md)*
