---
draft: true
---

# Incident Exposure Notation
*A Clinical, Real-Time Signal for Leaders*

> **Status: Work in Progress — Philosophy / Product Direction**
> This document is a living spec. Most field values will be auto-populated from tool usage.
> Delivery mechanisms (SMS, push feed) are documented as design intent, not yet built.

---

## What This Is

**Incident Exposure Notation** is a single-line, METAR-style status code used by Major Incident Management (MIM) to communicate **operational truth** at regular intervals.

It compresses complexity into a format leaders can **read, speak, and act on instantly** — without narrative, interpretation, or interruption.

---

## Why We're Doing This

Narrative updates scale poorly under pressure. They create interruption loops and force leaders to ask clarifying questions before they can act.

Exposure notation reduces cognitive load, standardizes truth, and empowers leaders to act without waiting.

> If we can name the exposure, we can manage it.

---

## The Notation (Clinical, Not Branded)

```
E2T5V2C(L)R(P)
```

This is **not an acronym**.
It is **operational notation**, similar to medical or aviation briefs.

Fields are positional and concatenated. Omit fields at their nil/normal value per the nil-state conventions below.

---

## Field Definitions

### E — Escalation / Leadership Posture
*Who is involved at the leadership level.*

| Code | Meaning |
|------|---------|
| `E0` | BAU — omit from notation (nil state) |
| `E1` | Leadership aware |
| `E2` | Leadership required |
| `E3` | Executive posture |

### T — Teams Involved
*How complex the technical response is. Numeric — T3 means three active teams.*

| Code | Meaning |
|------|---------|
| `T1` | Single team |
| `T2` — `Tn` | Multi-team; number reflects team count |

### V — Vendors *(included only if a vendor is engaged)*
*External dependency surface. Omit entirely when no vendors are involved.*

| Code | Meaning |
|------|---------|
| `V1` — `Vn` | Number of external vendors engaged |

### C — Recovery Confidence
*How confident the responding teams are right now.*

| Code | Meaning |
|------|---------|
| `C(H)` | High |
| `C(M)` | Medium |
| `C(L)` | Low |

### R — Recovery Path
*Whether the path forward is understood.*

| Code | Meaning |
|------|---------|
| `R(N)` | Known |
| `R(P)` | Partial |
| `R(U)` | Unknown |
| `R(B)` | Blocked |

---

## Nil State Convention

Not all fields will be known immediately. Silence must not be mistaken for confidence.

| Symbol | Meaning |
|--------|---------|
| `~` | Field not yet assessed (e.g., `C(~)`) |
| *(omit)* | Field is at nil/normal state (e.g., E0 = omit E entirely) |

**Example — first 15 minutes:**
```
T3C(~)R(~)
```
Three teams engaged. Confidence and path not yet assessed.

---

## Auto-Population from the Tool

> **Design intent:** The majority of this notation should be auto-populated from how MajorOps is used — not manually entered.

| Field | Auto-populated from |
|-------|---------------------|
| `T`   | Count of active teams assigned in the incident |
| `V`   | Count of vendors tagged / bridge participants marked as vendor |
| `E`   | Leadership contacts added to the incident |
| `C`   | MIM-entered field (radio button / dropdown in Fireground view) |
| `R`   | MIM-entered field (radio button / dropdown in Fireground view) |

MIM reviews the auto-generated line, adjusts if needed, and publishes.
The goal is: **MIM confirms, doesn't construct.**

---

## Decision Rule (Simple, Enforced)

- MIM proposes the exposure line
- **2 minutes** to object on the call
- If unresolved — **the harsher exposure stands**

No hedging. No silence. No excuses.

This rule removes the political incentive to under-report. Severity defaults up, not down.

---

## How This Is Used

### Every 15 Minutes (or on significant change)

- MIM publishes the exposure line in incident chat
- Announced verbally on the bridge if a bridge is active
- Logged as the official posture for that interval in MajorOps

### Example chat post
```
[EXPOSURE] E2T5V2C(L)R(P) — MS continues recovery. Next: ~30m
```

---

## Delivery Mechanisms

> **Design intent — not yet built.**

### SMS — Push to Subscribers

Engineering leaders and executives can subscribe to receive the exposure line via SMS at each publish interval.

The message body is exactly the notation plus one line of context:

```
INC-4421 E2T5V2C(L)R(P)
Storage outage. Teams engaged, path partial.
majorops.io/i/4421
```

No preamble. No pleasantries. Link to the incident if they need more.

Trigger rules:
- E ≥ 1 → Engineering leadership SMS
- E ≥ 2 → Executive SMS
- C(L) → Always notify regardless of E level

Leaders opt in to a role-based subscription. They get notified when exposure enters their threshold. They stop getting notified when it drops below.

---

### Push Feed — Real-Time Sitrep Stream

A machine-readable, real-time feed of all active incident postures — structured like a signal stream, not a dashboard.

This is the view of MajorOps through the eyes of the MIM: every active major, current posture, last update timestamp.

**Concept — what a subscriber sees (live, updating):**

```
14:32  INC-4421  E2T5V2C(L)R(P)   Storage outage — Azul+NetApp engaged
14:17  INC-4419  E1T2C(H)R(N)     Auth degraded — fix deploying
13:45  INC-4416  RESOLVED          DNS flap — 47m TTR
```

This is **not** a summary. It is a **live operational signal**. Leadership, NOC teams, and on-call engineers can subscribe and know the state of the world at a glance without asking anyone.

**Integration targets (design intent):**
- **SMS** — via Twilio or similar, per subscriber rules above
- **Gotify** — self-hosted push notification server; each exposure update fires a push notification with the notation string as the title and one-line context as the body
- **Slack / Teams** — post to a dedicated `#major-ops-posture` channel on each publish
- **Webhook** — generic outbound hook for any consumer (SIEM, NOC tooling, custom dashboards)
- **REST endpoint** — `GET /api/v1/posture` returns current exposure for all active incidents as JSON; read-only, auth-gated

**Gotify fit:** Gotify's design matches this concept closely — it's a lightweight, self-hosted push server with a clean REST API and app clients. Each MajorOps incident would map to a Gotify application. Each exposure publish fires a message. Subscribers watch the stream. No polling required.

---

## Channel Escalation (Policy-Driven)

| Channel | Trigger |
|---------|---------|
| Email | Any declared incident |
| Chat | Every exposure publish |
| SMS | E ≥ 1 **or** C = L |
| Exec SMS | E ≥ 2 |
| Status Page | Customer impact confirmed |
| Push feed | All active incidents, all publishes |

---

## What This Does Not Change

- Email updates continue as-is
- Distribution lists remain unchanged
- Detailed milestones still exist when required

This **adds signal** — it does not remove context.

---

## Professional Precedents

The format is not new. The application is.

- **Aviation** — METAR (weather at a glance for pilots who can't stop to read)
- **Medicine** — Clinical notation (GCS, APGAR — compress patient state into a score anyone trained can read)
- **Finance** — Ticker symbols with real-time price data (state + movement at a glance)
- **Military** — SALUTE reports, SITREP formats (standardized brevity under pressure)

Same principle. Different domain.

---

## What Leaders Get

- Operational truth at every publish interval
- No need to ask for updates
- Clear signal to lean in, stay out, or inject help
- A live feed that reflects real posture, not managed narrative

> We publish exposure, not commentary.

---

## Open Questions / Next Steps

- [ ] Finalize nil-state conventions and document in API spec
- [ ] Decide: is `E` always explicit, or omitted at E0?
- [ ] Define whether `E` is MIM-entered or derived from leadership participants
- [ ] Design the Fireground view publish flow (confirm vs. construct)
- [ ] Gotify integration spike — evaluate as first push delivery target
- [ ] Write the spoken briefing script for verbal bridge announcements
- [ ] Define opt-in subscription model for SMS (role-based vs. manual)
- [ ] Create public-safe variant (strips internal team/vendor counts, keeps posture only)
- [ ] Map exposure fields to DATA_MODEL.md — add `current_posture` to Incident entity

---

*Standardized. Calm. Reassuring.*
