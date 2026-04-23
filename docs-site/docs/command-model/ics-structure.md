---
title: IT Incident Command System (IT-ICS)
description: How MajorOps adapts the fire service Incident Command System for IT operations — roles, structure, and scalability by alarm level.
---

> Adapting the fire service Incident Command System for technology incident response.

The Incident Command System (ICS) is a standardized, all-hazards incident management approach used by fire departments, EMS, and emergency services worldwide. This document translates ICS principles into an **IT Incident Command System (IT-ICS)** — the command model MajorOps is built on.

---

## Core ICS Principles Applied to IT

| ICS Principle | IT-ICS Application |
|---|---|
| **Common Terminology** | MajorOps defines roles, phases, and update formats that all teams use. No "ticket," no "case" — these are "incidents," "phases," and "milestones." |
| **Modular Organization** | The command structure expands with incident severity. A P3 may have 2 people. A P1 may have 10. Same structure, different scale. |
| **Manageable Span of Control** | No one in command manages more than 7 direct reports. MIMs who span-break are a failure mode. |
| **Incident Action Plans** | The 8-phase model and recovery paths serve as the IAP. Everyone knows the plan. |
| **Chain of Command** | The MIM is IC. Teams report up. Leadership observes. No bypassing the structure. |
| **Unified Command** | Multi-team incidents coordinate through a single MIM. No competing incident commands. |

---

## IT-ICS Command Structure

### Full Structure (P1 — Major Incident)

```
Incident Commander (IC)
= Major Incident Manager (MIM)
│
├── Public Information Officer (PIO)
│   = Customer Communications Lead
│
├── Safety Officer (SO)
│   = Data Protection / Security Lead
│
├── Liaison Officer (LO)
│   = Vendor / Partner Coordinator
│
├── Operations Section Chief
│   = Technical Recovery Lead
│   ├── Infrastructure Branch (Network, Servers, Load Balancers)
│   ├── Application Branch (Code, Databases, APIs)
│   └── Cloud Branch (AWS, Azure, GCP, Cloudflare)
│
├── Planning Section Chief
│   = Documentation / Strategy Lead
│   ├── Resources Unit (Personnel Tracking)
│   ├── Situation Unit (Status Monitoring)
│   └── Documentation Unit (Timeline, RCA)
│
├── Logistics Section Chief
│   = Resource Coordinator
│   ├── Communications Unit (Bridge, Chat Coordination)
│   └── Supply Unit (Tools, Access Provisioning)
│
└── Finance Section Chief (optional, large-scale only)
    = Cost Tracking / Procurement
    ├── Time Unit (Responder Hours)
    └── Procurement Unit (Vendor Costs, Emergency Purchases)
```

---

## Scalability by Alarm Level

### Box 1 / P3 — Single Team Response

```
MIM (IC)
└── Operations (Tech Lead handles recovery + comms)
```

Team size: 2–4 people. MIM may also handle documentation. No section chiefs needed.

---

### Box 2 / P2 — Multi-Team Response

```
MIM (IC)
├── PIO (Comms Lead)
├── Operations Chief (Tech Recovery)
└── Planning Chief (Documentation)
```

Team size: 5–10 people. Operations and Planning chiefs are distinct. PIO handles stakeholder comms independently.

---

### Box 3 / P1 — Full Command Structure

All positions above activated. MIM manages Command Staff and delegates Section Chiefs who manage their branches. Span of control enforced at each level.

Team size: 10–25+ people across multiple teams.

---

## Position Descriptions

### Incident Commander — Major Incident Manager (MIM)

**Fire service equivalent:** Incident Commander

The MIM has overall authority. They do not fix the problem — they coordinate the people who do. Their tools in MajorOps are the fireground view: phase advancement, milestone posting, command assignments, and exposure notation.

**Responsibilities:**
- Establish incident objectives (what does "resolved" look like?)
- Maintain communication cadence (milestones at agreed intervals, exposure notation every 15 minutes)
- Manage Command Staff and Section Chiefs
- Interface with executive leadership through structured milestones — not ad-hoc calls
- Declare phases and phase transitions
- Explicitly release teams when their work is complete

**Critical rule:** The MIM does not participate in technical recovery. The moment they do, coordination breaks down.

---

### Public Information Officer — Customer Communications Lead

**Fire service equivalent:** PIO (media and public relations)

**Responsibilities:**
- Status page updates (external and internal)
- Customer-facing communications
- Internal stakeholder notifications
- Manages communications history — every send is logged

**Reports to:** MIM

---

### Safety Officer — Data Protection / Security Lead

**Fire service equivalent:** Safety Officer (responder safety)

In IT incidents, "safety" means data exposure, security risk, and compliance. The SO monitors for data breaches introduced during recovery, flags proposed changes that violate security policy, and advises the IC on risk vs. speed tradeoffs.

**Responsibilities:**
- Monitor for data exposure risks during recovery actions
- Ensure recovery procedures don't violate security/compliance policy
- Flag impact to regulated systems (HIPAA, PCI, SOC2)
- Advise IC: "This recovery path resolves the incident but opens a different exposure"

**Reports to:** MIM

---

### Liaison Officer — Vendor / Partner Coordinator

**Fire service equivalent:** Liaison Officer (multi-agency coordination)

Most P1 incidents involve at least one external vendor. The LO keeps the bridge free of vendor management overhead.

**Responsibilities:**
- Coordinate with external vendors (AWS, Stripe, Cloudflare, ISP, etc.)
- Track vendor support ticket numbers and escalation levels
- Interface with partner engineering teams
- Report vendor status to Operations Chief
- Track vendor response against SLA

**Reports to:** MIM

---

### Operations Section Chief — Technical Recovery Lead

**Fire service equivalent:** Operations Chief (suppression and rescue)

This is the most technical role in the command structure. The Operations Chief directs all recovery work and manages the engineering responders.

**Responsibilities:**
- Direct all recovery tracks
- Manage branch directors (Infrastructure, Application, Cloud)
- Assign and timebox recovery tasks
- Report recovery progress to MIM at each milestone interval
- Own the "what are we trying right now" answer

**Reports to:** MIM

**Does not do:** Status updates, executive communication, documentation. That is Planning.

---

### Planning Section Chief — Documentation / Strategy Lead

**Fire service equivalent:** Planning Chief (strategic planning, demobilization)

While Operations fixes the immediate problem, Planning ensures the incident is documented, the timeline is maintained, and the After Action has the data it needs.

**Responsibilities:**
- Maintain the incident timeline in real time
- Track responder assignments and availability
- Prepare structured status summaries for MIM to review and publish
- Lead After Action setup
- Monitor phase progress and flag when objectives aren't being met

**Reports to:** MIM

---

### Logistics Section Chief — Resource Coordinator

**Fire service equivalent:** Logistics Chief (supplies, facilities, equipment)

In IT incidents, logistics ensures responders have the access, tools, and coordination infrastructure they need.

**Responsibilities:**
- Provision access and tools for responders who join mid-incident
- Coordinate bridge call setup and chat channel structure
- Manage responder shift rotations for multi-day incidents
- Escalate to IC when resource constraints are blocking recovery

**Reports to:** MIM

---

## The Release Protocol

A critical ICS principle with no equivalent in typical IT incident practice:

**Responders are not assumed off-duty until explicitly released by command.**

In fire service, a firefighter on scene does not leave until their IC releases them. This prevents:
- Responders disengaging prematurely (assuming someone else has it)
- Gaps in coverage during validation phase
- Teams leaving before the handover is complete

In MajorOps, this means:
- A team assigned to a recovery track is accountable until the MIM marks them released
- Release is logged with a timestamp
- The MIM cannot advance to the Validation phase until all active tracks are either complete or explicitly abandoned

---

## Why This Matters

IT organizations that lack command structure during major incidents waste enormous amounts of time and goodwill rediscovering structure under pressure. The same conversations happen at the start of every P1:

- "Who's running the call?"
- "Who's on the vendor line?"
- "Can someone take notes?"
- "Does anyone know what the other team is doing?"

IT-ICS answers these questions before the incident starts. The structure is pre-negotiated, pre-trained, and pre-assigned. When the alarm sounds, people know what they're doing.

---

*Adapted from fire service ICS standards. Original source: U.S. National Incident Management System (NIMS) ICS documentation.*
