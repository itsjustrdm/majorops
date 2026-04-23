---
title: Incident Lifecycle
description: The 8-phase MajorOps incident model — from Alert through Resolution — with phase objectives, transitions, and the peacetime/wartime operating model.
---

MajorOps structures every incident through an 8-phase lifecycle. The phases are sequential but not rigid — some may be re-entered (notably Gather). The structure exists to ensure that no part of the incident goes unmanaged and that the path from alert to close is explicit and auditable.

---

## The 8 Phases

| Phase | Name | Purpose |
|---|---|---|
| 1 | **Alert** | Incident detected and opened. The MIM acknowledges the signal. |
| 2 | **Gather** | Information collection. Can be re-entered if scope changes. |
| 3 | **Assess** | Scope and impact assessment. Alarm level confirmed or revised. |
| 4 | **Initial** | Initial response actions. Recovery tracks opened. Command team assembled. |
| 5 | **Isolation** | Fault isolation. Active hypothesis testing. Recovery tracks driving toward the root cause. |
| 6 | **Mitigation** | Active mitigation underway. Fix applied or workaround in place. Monitoring for stabilization. |
| 7 | **Validation** | Recovery validation across all affected systems. No phase advances without validation across the blast radius. |
| 8 | **Resolution** | Incident closed. After Action scheduled. Command team released. |

---

## Phase Objectives

### Phase 1 — Alert

The incident is opened. A minimum viable set of fields is captured: severity, affected system, summary, impact statement. The MIM acknowledges and begins triage.

**Exit criteria:** Incident exists in the record with initial severity set.

---

### Phase 2 — Gather

Information is collected from monitoring, on-call, and initial responders. This phase answers: *what is actually happening, and how bad is it?*

Gather is re-enterable. If new information during Isolation changes the scope assessment, the incident can return to Gather without resetting the clock.

**Exit criteria:** Enough information exists to make an alarm level determination.

---

### Phase 3 — Assess

The MIM confirms or revises the alarm level based on gathered evidence. The command team is determined. The first milestone is drafted.

**Exit criteria:** Alarm level confirmed. Command team assigned. Stakeholder notification sent if Box 2 or Box 3.

---

### Phase 4 — Initial

The first response actions begin. Recovery tracks are opened with named owners and timeboxes. For Box 3 incidents, the full command structure is activated here.

**Exit criteria:** At least one recovery track is open with an owner.

---

### Phase 5 — Isolation

The response is in active fault isolation. Recovery tracks are testing hypotheses. The SRE is the primary information authority. The MIM maintains cadence and milestone output while the technical team drives.

This is typically the longest phase in a complex incident.

**Exit criteria:** Root cause isolated — not necessarily fixed, but understood.

---

### Phase 6 — Mitigation

A recovery path has been selected. The fix or workaround is being applied. Monitoring is active.

**Exit criteria:** Mitigation applied and monitoring shows stabilization.

---

### Phase 7 — Validation

Every affected system is validated as recovered. This phase is not optional. Declaring resolution before validation is complete is a command error.

**Exit criteria:** All recovery track owners have confirmed recovery. All validation checks are complete.

---

### Phase 8 — Resolution

The incident closes. The MIM posts the final milestone. The After Action is scheduled. All command roles are released formally. The incident record is sealed.

**Exit criteria:** Final milestone posted. After Action on calendar. Command team released.

---

## Phase Transition Discipline

The MIM declares every phase transition. Phases do not advance automatically.

A common failure mode: a technically resolved incident that stays in Mitigation because the MIM forgot to advance or wasn't sure when to. The phase tracker is not a passive display — it is a decision log. Each advance is a deliberate judgment call.

**Regression is allowed and sometimes required.** If a mitigation fails and the fault must be re-isolated, the MIM regresses from Mitigation back to Isolation. This is not a failure — it is honest accounting. The timeline shows it happened, and the After Action can examine why.

---

## Milestones and the Timeline

The incident timeline is the continuous record of everything that happened. Milestones are structured, timestamped summaries cut from the timeline at regular intervals — what stakeholders and executives see.

The MIM does not write everything in milestone format in real time. They log micro-updates to the timeline as events happen, and synthesize those into milestones at the committed cadence.

**Milestone discipline:**
- Every milestone has a "next update at" commitment
- If the commitment passes without a milestone, that is a gap — and the After Action will find it
- Milestones never speculate. "Root cause unknown — investigating DB and CDN paths" is correct. "Looks like a database issue" is not.

---

## Peacetime and Wartime

MajorOps operates in two modes, borrowed from military and emergency services practice.

**Peacetime** is when no active major incidents are open. This is when runbooks are updated, certifications are maintained, After Actions are processed, and readiness is built. The alarm level system is reviewed. Mutual aid agreements are refreshed. Training scenarios are run.

**Wartime** is a declared major incident. Command is engaged. Every responder knows their role. Structure is activated, not improvised.

The critical insight is that **wartime performance is determined by peacetime preparation.** You cannot improvise the ICS structure under pressure. You build it in peacetime and activate it in wartime.

A MIM who has never practiced the handover protocol will fumble it at 2am. A team that has never seen their agency run card will not recognize it when it's activated. Peacetime is when these things are practiced, verified, and corrected.

---

## The Major Incident Declaration

The declaration of a Major Incident (Box 3 / P1) is an explicit act, not a natural consequence of things getting worse.

The MIM makes the call. The declaration activates:
- Full command structure
- Run Card for the alarm type
- Executive notification
- Mutual aid agreements (if applicable)
- The formal incident record (if not already open)

There is no correct moment to declare too early. Declaring early and de-escalating later costs effort. Failing to declare and escalating too late costs service.

**When in doubt, declare. De-escalate later if you must.**

---

*The 8-phase model is the operational backbone of MajorOps. See also: [Alarm Levels](/command-model/alarm-levels/), [Command Roles](/command-model/command-roles/), [Bridge Control](/bridge/bridge-control/), [After Action](/governance/after-action/).*
