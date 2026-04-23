---
title: Exposure Notation
description: A METAR-style single-line incident status format that lets a leader read operational truth in under five seconds.
---

Exposure Notation is a METAR-style single-line status format for major incidents. Like a weather METAR, it communicates a complex, multi-dimensional situation in a compact, structured form that any trained reader can parse instantly.

It is not a summary for customers. It is an operational signal for leaders and command — the exact conditions at a specific moment in time.

---

## Why a Structured Notation Exists

In aviation, a METAR tells a pilot everything about current conditions at an airport in one line: visibility, ceiling, wind, precipitation, altimeter setting. A trained pilot reads it in five seconds and knows whether to divert.

The alternative is a paragraph: "The weather at O'Hare is currently partly cloudy with winds from the northwest at 15 knots gusting to 25, visibility six miles with some haze, ceiling broken at 4,000 feet, and barometric pressure..."

The paragraph communicates the same information. The METAR communicates it without cognitive load.

Major incident status has the same problem. An executive asks: "What's happening?" And someone reads them a paragraph. The executive cannot make a decision from a paragraph under pressure. They can make a decision from a structured notation that answers the same questions in a predictable format.

---

## Format

```
E{n} T{n} V{n} C({level}) R({state})
```

| Field | Meaning | Values |
|---|---|---|
| `E{n}` | Exposure level — overall business risk | 0 (none) to 4 (critical) |
| `T{n}` | Teams engaged — number of active response teams | Integer |
| `V{n}` | Vendor dependency — active vendor engagements | 0 = none, 1+ = count |
| `C({level})` | Confidence — MIM's confidence in the current recovery path | LOW / MED / HIGH |
| `R({state})` | Recovery state — current phase in plain language | ASSESS / ISOLATE / MITIGATE / VALIDATE |

---

## Exposure Levels

| Level | Description |
|---|---|
| E0 | No measurable business impact. Monitoring only. |
| E1 | Limited impact. Subset of users or non-critical functionality affected. |
| E2 | Broad internal impact or degraded performance on a key service. |
| E3 | Customer-facing impact. Revenue risk or SLA exposure active. |
| E4 | Critical. Broad customer outage. Regulatory exposure. All-hands. |

---

## Example Notation

```
E3 T4 V1 C(MED) R(ISOLATE)
```

Reading this: *"Customer-facing impact (E3). Four teams engaged (T4). One active vendor engagement (V1). MIM has medium confidence in the current recovery path (C(MED)). We are in the Isolation phase (R(ISOLATE))."*

An executive on the bridge reads this and knows: customers are affected, we have the teams, we're looking for the root cause, and we're not sure yet. They know not to ask "do you have enough people?" (yes, four teams). They know to ask "what's the hypothesis?" instead.

---

## When to Publish

- Every 15 minutes during an active incident
- Immediately on any significant change in exposure level or confidence
- At every phase transition

The exposure notation is a supplementary signal alongside milestones — not a replacement for them. A milestone gives the narrative. The notation gives the operational dashboard.

---

## The Harshness Rule

When there is a dispute about the correct exposure level, **the harsher exposure stands until resolved.**

This mirrors the alarm level doctrine: default up, not down. An E3 that turns out to have been an E2 costs nothing. An E2 that should have been an E3 may have cost 20 minutes of executive awareness.

---

## Learning the Format

The notation is borrowed from the aviation community's approach to situation awareness. Pilots learn METAR in training and never have to re-learn it. The same principle applies here: the notation is learned once, in a non-incident context, and then readable instantly under pressure.

The MIM publishes the notation. Leaders read it. The format is stable — it does not change based on who is running the incident.

---

*See also: [Alarm Levels](/command-model/alarm-levels/) · [Bridge Control](/bridge/bridge-control/) · [Incident Lifecycle](/command-model/incident-lifecycle/)*
