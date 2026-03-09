---
draft: true
---

# Response Reputation Score

> A future feature concept. Not yet implemented. Documented here to capture the design intent.

---

## The Idea

Most IT organizations have no systematic way to measure and reward incident response quality at the individual level. Engineers who show up consistently, communicate clearly, escalate intelligently, and document thoroughly are often invisible — their performance is not differentiated from engineers who do the minimum.

The Response Reputation Score is a gamified metric that changes this. It works like a credit score meets NPS: structured data from real incidents feeds a living reputation profile for each responder, which in turn determines their authority level and role assignments.

The model is borrowed from two domains:

- **Medical licensing** — authority is earned through demonstrated competency, not tenure
- **Esports ranking** — performance history determines who gets matched to high-stakes assignments

> "What if assigning incident roles worked like leveling up? The best outcomes come from aligning the right person to the right role, in real time, based on real-world performance."

---

## How the Score Works

### Input Metrics

| Metric | Description | Weight |
|---|---|---|
| Response Speed | Time to triage, engage, and log first update | High |
| Resolution Quality | Stickiness of fix, regression rate, validation coverage | High |
| Communication Quality | CAN format compliance, clarity, cadence | Medium |
| Knowledge Contribution | Runbook updates, doc edits, After Action participation, mentoring | Medium |
| Peer Feedback | NPS-style rating from teammates after each major incident | High |
| Escalation Quality | Did they escalate at the right moment? Not too early, not too late. | Medium |

### Score Levels

| Level | Name | Description |
|---|---|---|
| Level 1 | Observer | Completed basic training. Read access to runbooks. |
| Level 2 | Responder | Cleared for P3 incidents. On-call eligible for low-severity. |
| Level 3 | Senior Responder | Cleared for P2. Can contribute to and update runbooks. |
| Level 4 | MIM Candidate | Cleared for P1 support role. Production change authority. |
| Level 5 | Certified MIM | Full incident command authority. P1 MIM eligible. |
| Suspended | — | Temporary revocation pending retraining review. |

Levels are earned through incident history. They are not granted by time-in-seat.

---

## The SRE Champion Badge

Above Level 5, a separate recognition system: the **SRE Champion Badge**.

An SRE Champion is someone who:
- Has participated in multiple P1/P2 events (minimum threshold to be defined)
- Maintains a consistent peer feedback score ≥ 8/10 over their last 10 incidents
- Has a positive track record across response tiers (engage time, bridge communication, handoff quality)
- Shares knowledge: runbook edits, After Action contributions, mentoring newer responders

The Champion badge is:
- Displayed on the responder's profile
- Used by the MIM assignment engine to suggest "Best Fit" for the next P1
- A signal to leadership: this person is ready for expanded responsibility

The badge is not permanent. It is maintained through continued participation. Inactivity or declining feedback scores can revoke it.

---

## The Feedback Loop

After every major incident (P1 and significant P2s), each responder receives a short post-incident survey. It is not a performance review. It is a calibration signal.

Sample questions:

> "Was [Name] clear and calm under pressure during this incident?"

> "Did [Name]'s contributions help move the incident toward resolution?"

> "Would you want [Name] as your primary contact on the next P1?"

Scores are aggregated (not shared individually) and feed the reputation score. The aggregate drives the trend line — one bad incident does not define a responder; a pattern of bad feedback does.

---

## Score Changes

### What Increases the Score

- High-severity incidents successfully resolved
- Consistent milestone logging (no gaps during wartime)
- Peer commendations
- Post-incident documentation: runbook updates, After Action task completion
- Mentoring a less experienced responder
- Escalating at the correct moment (not late, not reflexively)

### What Decreases the Score

- Missed timelines or skipped phases without documented reason
- Failure to log during active incidents (tracked by micro-update frequency)
- Consistently poor peer feedback
- Repeat offender of the same failure mode (documented in the Learning Review)
- Abandoning a recovery track without explicit release from MIM

---

## The Assignment Engine (Future)

Once a sufficient dataset exists, the Response Reputation Score powers an **assignment suggestion engine**:

When a new major incident opens, MajorOps suggests:
- Best available MIM (based on reputation score, current availability, and incident type fit)
- Recommended Operations Chief
- Flagged responders who have specific expertise relevant to the incident type

This is not a hard assignment — the MIM still makes the call. But instead of guessing, they have data.

The engine considers:
- Historical performance data (reputation score)
- Time-of-day availability patterns
- Incident type / tech stack match (does this responder have a track record with database incidents?)
- Peer preferences ("would you want this person?")

---

## Why This Matters

This is not vanity metrics. It solves three real problems:

**Problem 1: Invisible excellence.** The best incident responders are often also the most silent about their contributions. They just fix things. This system makes their contributions visible and rewards them structurally.

**Problem 2: Improvised assignments.** Without reputation data, MIM assignments are based on who's available and who the manager happens to know. This favors the visible over the competent.

**Problem 3: No incentive for peacetime work.** Runbook updates, documentation, After Action contributions — these have no reward in most organizations. The reputation score makes peacetime investment visible in wartime context.

---

## Implementation Prerequisites

This feature requires:

1. **Phase 6 (Observability & KPIs)** — time-to-join tracking, incident timeline exports, and responder data must exist first
2. **After Action process running reliably** — the feedback loop depends on After Action completion
3. **Training framework (Phase 8)** — levels require a defined training and certification path
4. **User profiles in the data model** — the current `User` entity needs reputation score fields added

This is a Phase 7–8 concept in the current roadmap. Documented here to ensure the design intent is not lost.

---

*Synthesized from: IncidentX/core-ops-docs/04-governance/response-reputation-score.md, gamified-sre-pathing.md, gamified-feedback-loop.md, gamified-recognition.md, and gamified-elite-oncall.md.*
