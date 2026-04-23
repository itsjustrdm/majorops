---
title: After Action
description: The MajorOps After Action process — why we renamed it, how it runs, what the Learning Review produces, and the anti-patterns that make them useless.
---

> The question is never "who made a mistake." The question is always "what did we learn, and what do we change?"

---

## Why We Changed the Name

"Post-Incident Review" sounds like a compliance requirement. A box you check so a ticket can close. In most organizations, that is exactly how it is treated — scheduled, rescheduled, attended without preparation, documented by no one, forgotten by the next incident.

We call it an **After Action** because that is what fire service and the military call it. You have just been through something. You come off the fireground, you debrief while it is fresh, and you come out with specific things to do differently next time. It is not a review. It is a continuation of the response.

The written output is the **Learning Review**. Not "lessons learned" — because lessons are not learned until behavior changes. The Learning Review documents what we captured. Whether it becomes a lesson depends on what happens to the action items.

This framing is borrowed directly from how Google SRE approaches post-mortems. Their shift was deliberate: rename the artifact, change the question at the top. The old question: *"What went wrong?"* The new question: *"What did we learn, and what do we change?"* The first question finds fault. The second question finds improvements. Only one of them makes the next incident better.

---

## What an After Action Produces

1. A documented timeline of the incident (reconstructed from the MajorOps record — not re-narrated from memory)
2. The Learning Review document: root cause, contributing factors, what went well, what we change
3. Improvement tasks with owners and due dates
4. A signal to the team that every incident makes the organization better — not just closes a ticket

---

## When an After Action Is Required

| Condition | Required |
|---|---|
| Critical (P1), any duration | Yes — mandatory |
| High (P2) > 2 hours | Yes — mandatory |
| High (P2) < 2 hours with customer impact | Recommended |
| High (P2) < 2 hours, internal only | Optional |
| Medium (P3) with unusual contributing factors | Optional |
| Repeat incident (same root cause as a prior incident) | Yes — regardless of severity |

Repeat incidents trigger a mandatory After Action regardless of severity because repetition means a prior learning was not implemented. That is a process failure.

---

## Timeline

| Step | When |
|---|---|
| MIM completes resolution milestone | At incident close |
| After Action scheduled | Within 24 hours of incident close |
| Learning Review draft distributed | 48 hours before the meeting |
| After Action held | Within 5 business days (Critical), 10 business days (High) |
| Learning Review published | Within 48 hours of the meeting |
| Action items tracked | Assigned owners and due dates |
| Action item completion reviewed | 30 days after publication |

---

## Who Attends

**Required:**
- MIM — chairs the After Action
- Technical Recovery Lead — owns the technical findings
- SMEs from all active recovery tracks
- Vendor representative — if vendor was involved and root cause is vendor-related

**Optional / Situational:**
- Customer Communications Lead — if customer comms are a finding
- Security or Compliance — if regulatory exposure was involved
- Engineering Manager or Director — if findings require organizational change

**Not Required:**
- Executive leadership — unless a finding requires executive action
- Everyone who was on the bridge — the After Action is not a group debrief, it is a structured review

The MIM decides the attendee list based on the incident record. Attendance is not based on seniority or org chart proximity.

---

## The Learning Review Document

The Learning Review is drafted by the MIM before the meeting. Attendees read it before arriving. The meeting is for discussion, challenge, and decisions — not for writing.

**If attendees are reading for the first time in the meeting, you are in a retell. That is an anti-pattern.**

### Structure

**1. Incident Summary**
- Incident ID, title, severity, duration
- Business and customer impact (affected users, revenue exposure, SLA status)
- MIM and key responders

**2. Timeline**

Reconstructed from phase logs and milestones. Timestamps only — not narrative.

Key metrics derived from the timeline:

| Metric | Definition |
|---|---|
| Time to Detect (TTD) | Alert fired → incident confirmed |
| Time to Declare | Detection → Major Incident opened |
| Time to Mitigate (MTTM) | Incident opened → mitigation applied |
| Time to Resolve (MTTR) | Incident opened → validated recovery |

**3. Root Cause**

The technical finding. One or more contributing factors.

Format: *"The incident was caused by [specific failure]. Contributing factors include [list]."*

No names in root cause. Systems and processes only. If a person made an error, the question is: what system allowed that error to occur?

**4. What Went Well**

Actions, tools, and communications that worked. These are as important as the failures. They should be reinforced, documented, and replicated.

**5. What We Are Changing**

Not "what could be improved" — that framing is passive. This section names specific changes, each with an owner and a date.

**6. Learning Statements**

Specific, named, actionable. Not "communicate better." Examples:

> "Runbook step 4 does not account for the case where the primary DB is unreachable. SRE lead updating by [date]."

> "Vendor escalation contact was missing from the run card. Service Manager adding before next quarter."

> "Recovery track for Application team took 40 minutes to start — no pre-assigned track lead. Run card updated with named standby."

**7. Action Items**

| Item | Owner | Due Date | Status |
|---|---|---|---|
| Update runbook step 4 | [Name] | [Date] | Open |

Action items from After Actions are tracked. Unresolved items at the 30-day review are escalated.

---

## The Major Technical Meeting (MTM)

For Critical incidents with extended duration (> 2 hours), the MIM may call a **Major Technical Meeting** during the active incident — a structured touchpoint focused on executive alignment and action item coordination.

The MTM is not the After Action. It happens during the incident.

**MTM Agenda:**

1. Attendance and intro — MIM
2. Establish core roles (first MTM only) — MIM
3. Recovery status — Technical Recovery Lead
4. Impact statement — Customer Success / Service Delivery
5. Business and client impact — MIM + Recovery Director
6. Regulatory exposure (if applicable)
7. Review open actions from prior MTM — MIM
8. Confirm severity posture is correct — MIM + Recovery Lead
9. Set next MTM time and update cadence — MIM

The MTM produces structured action items. The MIM publishes a post-MTM summary immediately after. MTM notes feed the Learning Review.

---

## Anti-Patterns

**The Blame Session** — Time spent identifying who made a mistake. Names belong in action item owners. They do not belong in root cause. The MIM chairs the After Action and is responsible for redirecting it.

**The Retell** — Teams re-narrate the incident from scratch because no Learning Review draft was prepared. This is a process failure. The MIM owns the draft. If the draft is not ready, the After Action should be rescheduled — not converted into an improv session.

**The Vanishing Tasks** — Action items produced in the meeting that no one checks on at 30 days. Every item needs an owner, a date, and visibility in a tracked system.

**The Missing Vendor** — Closing without a plan to get the vendor RCA. Set a date. Assign it to the Service Manager. The vendor's RCA is your evidence. You need it.

**The Pre-Scheduled Cancel** — The After Action is rescheduled repeatedly and eventually never held. Every Critical incident gets an After Action. There is no "resolved cleanly enough to skip it" threshold.

---

## Connection to Peer Review

The After Action examines what happened to the incident — the timeline, the technical root cause, the improvement actions.

The [Peer Review](/governance/peer-review/) is a separate, complementary process that examines how the MIM ran the response — bridge discipline, phase cadence, escalation judgment, communication quality. Both documents belong in the incident record.

---

*After Action process adapted from U.S. military After Action Review methodology, NTSB investigation standards, and Google SRE Learning Review practices.*
