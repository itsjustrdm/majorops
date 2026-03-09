---
draft: true
---

# After Action

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
3. Improvement tasks with owners and due dates, tracked in MajorOps
4. A signal to the team that every incident makes the organization better — not just closes a ticket

---

## The Problem with How Most Organizations Do This

This is preserved from original operational analysis. It describes what happens without structure — and what we are designed to prevent:

1. Hour-long calls where multiple people re-explain the same timeline.
2. Long-running meetings with no agenda and no decisions.
3. Follow-up meetings scheduled because the first one produced nothing.
4. Rescheduling cycles because no one protected the calendar.
5. Key people not invited because the invitation process is manual.
6. No defined expectations beyond "show up and talk."
7. Action items tracked in a spreadsheet no one maintains.
8. Teams arrive without evidence, delaying everything while people locate data.
9. Vendor status unknown — no one tracked the vendor's RCA commitment.
10. The actual theme of the meeting becomes: explaining the technology and avoiding accountability.

MajorOps After Actions are different because the data exists before the meeting starts. Milestones, phase logs, timeline events, recovery track outcomes — all of it was captured during the incident. The After Action is analysis, not reconstruction.

If the data does not exist because it was not logged during the incident, that gap is itself the first finding.

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
| Action items tracked | In MajorOps, assigned owners and due dates |
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

This distinction matters. If attendees are reading for the first time in the meeting, you are in a retell. That is an anti-pattern.

### Structure

**1. Incident Summary**

- Incident ID, title, severity, duration
- Business and customer impact (affected users, revenue exposure, SLA status)
- MIM and key responders

**2. Timeline**

Reconstructed from MajorOps phase logs and milestones. Timestamps only — not narrative.

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

Questions that surface this:
- What decision made a difference in this incident?
- What worked faster or better than expected?
- What process held up under pressure?

**5. What We Are Changing**

Not "what could be improved" — that framing is passive. This section names specific changes, each with an owner and a date.

Questions that surface this:
- What slowed us down that a process change would fix?
- What information did we not have that we should have had?
- What would have changed the outcome if we had caught it earlier?

**6. Learning Statements**

Specific, named, actionable. Not "communicate better." Examples:

> "Runbook step 4 does not account for the case where the primary DB is unreachable. SRE lead updating by [date]."

> "Vendor escalation contact was missing from the run card. Service Manager adding before next quarter."

> "Recovery track for Application team took 40 minutes to start — no pre-assigned track lead. Run card updated with named standby."

**7. Action Items**

| Item | Owner | Due Date | Status |
|---|---|---|---|
| Update runbook step 4 | [Name] | [Date] | Open |

Action items from After Actions are not optional. They are tracked in MajorOps. Unresolved items at the 30-day review are escalated.

---

## The Major Technical Meeting (MTM)

For Critical incidents with extended duration (> 2 hours), the MIM may call a **Major Technical Meeting** during the active incident — a structured touchpoint separate from the bridge, focused on executive alignment and action item coordination.

The MTM is not the After Action. It happens during the incident. The After Action happens after.

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

## Vendor After Actions

When a vendor is involved, the MajorOps After Action is not dependent on the vendor's RCA arriving on time.

The Learning Review documents:
1. When the vendor was engaged and response time against their stated SLA
2. Impact of the vendor system's failure on the incident timeline
3. Open items pending from the vendor — with a committed date, not "waiting on them"

The vendor RCA is attached to the Learning Review as an appendix when received. **"We're waiting on them" is not a closed item.** Set a follow-up date. Escalate when it passes.

Know your vendor RCA SLA before the incident, not during it. It is in the contract.

---

## Anti-Patterns

These failure modes make After Actions ineffective. Name them when they occur.

**The Blame Session** — Time spent identifying who made a mistake. Names belong in action item owners. They do not belong in root cause. A blame session is a sign the culture has not internalized the NTSB model. The MIM chairs the After Action and is responsible for redirecting it.

**The Retell** — Teams re-narrate the incident from scratch because no Learning Review draft was prepared. This is a process failure, not a meeting failure. The MIM owns the draft. If the draft is not ready, the After Action should be rescheduled until it is — not converted into an improv session.

**The Vanishing Tasks** — Action items produced in the meeting that no one checks on at 30 days. Every item needs an owner, a date, and visibility in a tracked system. Vanishing tasks mean the learning loop is broken.

**The Missing Vendor** — Closing without a plan to get the vendor RCA. Set a date. Assign it to the Service Manager. If it passes without delivery, escalate. The vendor's RCA is your evidence. You need it.

**The Pre-Scheduled Cancel** — The After Action is on the calendar, then rescheduled, then rescheduled again, and eventually never held because "things settled down." Every Critical incident gets an After Action. There is no "resolved cleanly enough to skip it" threshold.

---

## Data Available in MajorOps Before the After Action

The Learning Review draft should be built from the incident record, not from memory. What MajorOps provides:

- Full milestone log — stakeholder communications, timestamped
- Phase transition log — when each phase was entered and by whom
- Timeline events — all logged actions during the incident
- Command assignment history — who held each role, when they were assigned
- Alert info — detection time, customer count, external impact
- Status updates — full comms record, public and internal

If any of this data is absent, the gap is the first finding. Every empty field in the After Action record means something was not captured during the incident. Fix the capture, not the record.

---

*After Action process adapted from U.S. military After Action Review methodology, NTSB investigation standards, and Google SRE Learning Review practices. The distinction between "what went wrong" and "what did we learn" is borrowed directly from the Google SRE team's public writing on blameless post-mortems.*
