---
title: Three-Tier Run Card System
description: The MajorOps dispatch architecture — agency cards, generic application cards, and specific application pre-plans — modeled on 911 CAD dispatch.
---

**Status:** Living Document — Tier 1 and Tier 2 templates in progress. Tier 3 self-service portal is a future platform feature.

---

## The Dispatch Analogy

In public safety, a 911 center does not serve one agency. It dispatches for many — multiple fire departments, EMS providers, law enforcement agencies, and specialty units. Each agency maintains its own run cards. The 911 center holds the dispatch protocol. The agency holds the response plan. The pre-plan for a specific building or hazard is owned by the company that responds to it.

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
- Known failure modes and their fingerprints
- Recovery time objectives (RTO) and recovery point objectives (RPO)
- Application-specific release criteria

---

## Ownership Model

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

This is Continual Service Improvement applied at the dispatch layer, not the infrastructure layer. The cards get sharper through use, not through planning exercises.

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

## Run Card vs. Runbook

A run card is not a runbook. A runbook is a diagnostic procedure document, typically owned by engineering, typically long, typically version-controlled in a code repository.

| | Run Card | Runbook |
|---|---|---|
| **Audience** | MIM + command structure | Technical SME |
| **Moment** | First 30 minutes | After isolation |
| **Format** | Structured, fast, checklist-driven | Detailed, procedural, diagnostic |
| **Owner** | MIM (Tier 1/2), Team (Tier 3) | Engineering team |
| **Update cadence** | Post-major, max 1/week | As-needed by team |

A run card references a runbook. It does not replace it. *"See runbook: [link]"* is a valid and complete CAN entry.
