---
draft: false
tier:
  - docs     # Full Peer Review framework on about.majorops.io
             # Not a runcard — the review surface is built directly into the app at /review
             # Not a tooltip — too process-heavy for a hover definition
---

# Peer Review

> The best way to get better at running incidents is to have someone who has run incidents tell you what they saw.

---

## What It Is

A **Peer Review** is a structured quality assessment of a MIM's incident response, completed by a second certified MIM after the incident closes.

It is not a disciplinary process. It is not an audit. It is the operational equivalent of a colleague watching you work and giving you an honest read — structured, documented, and repeatable.

The peer reviewer is not a supervisor. They are a peer. The framing matters: this is someone who has run the same calls you have, who knows what the job looks like from the inside, and who can tell the difference between a hard incident run well and a well-resourced incident run poorly.

---

## Why a Peer Review, Separately from the After Action

The **After Action** examines what happened to the system. The **Peer Review** examines how the MIM ran the response.

These are different questions. The After Action reconstructs a timeline and identifies technical and process improvements. The Peer Review evaluates the human performance of incident command — bridge control, phase discipline, escalation judgment, communication quality.

A clean After Action does not mean the MIM ran a clean incident. A difficult incident with a messy outcome can still reflect excellent command discipline. The Peer Review captures that distinction.

---

## When a Peer Review Is Conducted

| Condition | Required |
|---|---|
| Critical (P1) incident | Yes — mandatory |
| High (P2) incident > 2 hours | Yes — mandatory |
| High (P2) incident < 2 hours with customer impact | Recommended |
| Any incident where MIM is in first year of certification | Recommended |
| By request of the MIM being reviewed | Always — no minimum threshold |

Peer Reviews are completed **after** incident close, before the After Action is held. The reviewer should read the MajorOps incident record before scoring — not rely on memory or the bridge call alone.

---

## Who Conducts the Review

The reviewer must be a **certified MIM** who was not the active IC on the incident being reviewed. They must have been on scene (bridge participant or observer role) or have access to the full incident record.

If no peer MIM was on the bridge, the review is conducted from the incident record. Record-based reviews are valid — if the record is incomplete, that gap is itself a finding in the review.

The reviewer is named and their signature is locked into the review record at submission. Reviews are not anonymous.

---

## The 8 Competency Domains

The Peer Review scorecard covers eight domains, each corresponding to a core dimension of incident command.

Each domain contains:

- **Binary criteria** — Yes or No judgment against a specific observable behavior
- **Signal rating** — A 1–5 assessment of the domain overall
- **Notes** — Free-form observations, specific examples, or context

The eight domains are:

### C1 — Command Presence

Did the MIM establish and hold bridge authority? The fundamental question of incident command: was there a clear owner? The MIM coordinates — they do not fix.

### C2 — Phase Discipline

Were phase transitions deliberate and reasoned? Phase progression is not automatic. Each transition should be stated, justified, and logged. Regressions are allowed — and should be named when they occur.

### C3 — Air Time Discipline

Was bridge communication CAN-structured and lean? Conditions, Actions, Needs. No speculation without labeling. The Open Air Rule enforced — unanswered questions parked with a name and a time.

### C4 — Escalation Judgment

Right team, right time. Guardian of Service: page now, de-escalate later if needed. The reviewer assesses whether the MIM was appropriately decisive — neither hesitant nor trigger-happy.

### C5 — Stakeholder Communication

Were milestones timely, accurate, and CAN-formatted? The first update should be posted at or before Phase 4. No speculation in public comms. Clear next ETA every time.

### C6 — Recovery Track Management

Were tracks opened fast, assigned to an owner, timeboxed, and closed with a stated outcome? Tracks that drift without an owner or a current bet are a command failure.

### C7 — Incident Record Quality

Was the fireground log maintained during the incident? The record should be complete enough to drive the After Action without calling anyone. If data was not logged, it does not exist.

### C8 — Close-Out Readiness

Did the MIM close the incident cleanly? Resolution milestone posted. After Action scheduled. All recovery tracks closed with outcomes. The incident is not over when the outage is over.

---

## Scoring

The composite score is calculated from two inputs: **criteria pass rate** (60% weight) and **signal ratings** (40% weight).

| Score Range | Assessment Level |
|---|---|
| 88–100 | Exceptional |
| 72–87  | Proficient |
| 55–71  | Developing |
| 0–54   | Needs Improvement |

The composite score is a guide, not a verdict. The reviewer selects a final **Performance Level** from the same four options. The narrative is where the review becomes useful.

---

## The Narrative

The narrative is the most important part of the review. A score without a narrative is data without meaning.

The reviewer should answer, in plain language:

- What stood out, positively or negatively?
- What would you do differently in this situation?
- What is one thing the MIM should keep doing?
- What is one specific thing to work on?

The narrative should be written to the MIM, not about them. Write it as if they will read it — because they will.

---

## Review Record and Locking

When submitted, the review is assigned a **PR-{number}** identifier and locked. The reviewer's name and timestamp are recorded. No changes can be made after submission.

The review record is attached to the incident in MajorOps and is visible to:

- The MIM being reviewed
- The MIM's team lead or program coordinator
- The reviewer

Reviews are not visible to the public stakeholder or executive views.

---

## Using the Peer Review Surface

The Peer Review is accessible from any MIM operator view via the view switcher in the header:

```
Classic · Terminal · Focus · Review
```

The URL is `/admin/incidents/:id/review`.

The scorecard walks through all eight domains sequentially. At the bottom, the reviewer:

1. Selects a Performance Level
2. Writes a narrative
3. Enters their name as signature
4. Submits — locking the record

At least 80% of criteria must be answered before the review can be submitted. This ensures the reviewer engaged with the content rather than jumping to the narrative.

---

## Connection to the After Action

The Peer Review and the After Action are separate documents, but they inform each other.

The After Action asks: *What did we learn about the incident?*
The Peer Review asks: *What did we learn about the command?*

Both questions matter. Both documents belong in the incident record.

If the Peer Review identifies a pattern — escalation hesitation across multiple reviews, for example — that pattern becomes input for the **Continual Service Improvement** process. Individual reviews feed team-level learning. Team-level learning feeds training and accreditation standards.

---

## Anti-Patterns

**The Performance Review Trap** — Using the Peer Review to settle personnel issues. This is not HR. The MIM's manager has their own tools. The Peer Review is about incident command quality.

**The Rubber Stamp** — Submitting a review where every criterion is Y and the narrative is two sentences. If it was a truly clean incident, say why. Specificity makes the review useful.

**The Post-Hoc Criticism** — Criticizing decisions that looked wrong in hindsight but were reasonable under conditions at the time. The reviewer must assess decisions in context — what did the MIM know, and when?

**The Record Bypass** — Completing a review from memory rather than from the incident record. Read the timeline. Read the milestones. Read the micro-update feed. Memory is not the incident record.

---

*Peer Review framework adapted from aviation Crew Resource Management (CRM) review practice, military After Action review methodology, and structured competency assessment models used in emergency services accreditation.*
