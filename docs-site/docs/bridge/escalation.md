---
title: Escalation Doctrine
description: The principles and rules that govern escalation decisions in MajorOps — when to page, when to declare, and why hesitation is the enemy.
---

Escalation hesitation is the most common failure mode in major incident management. A technically excellent team wastes 30 minutes "trying one more thing" before paging the next team — and the outage extends by exactly those 30 minutes.

MajorOps makes escalation objective. Phase state, alarm level thresholds, and on-call commitments replace gut feel and social pressure.

---

## The Guardian Doctrine

The Major Incident Manager is the **Guardian of Service**.

When a major incident is declared, the customers are already affected. Every minute of escalation hesitation is a minute of extended outage. The MIM is not protecting the on-call calendar. The MIM is protecting customers from a longer impact window.

**Page the on-call. De-escalate later if you must.**

The cost of paging unnecessarily: an engineer gets woken up and is released 10 minutes later. The cost of not paging when you should have: the outage runs 30 additional minutes, an executive gets involved, and the After Action has a finding about delayed escalation.

These are not equivalent costs.

---

## On-Call Paging Protocol

MajorOps pages on-call rotations — structured, managed, and committed to by each team's rota manager.

When the MIM activates a team:
- The on-call rotation is paged, not a named individual
- Arrival is tracked with a timestamp
- If the on-call does not respond within the SLA window, the next tier escalation is automatic

**Named escalations** — contacting a specific individual outside the rotation — require explicit authorization from the MIM or a command-tier leader on scene. Named escalations are logged in the incident record as documented decisions. They are rare and accountable, not a default.

If teams are consistently slow to respond to on-call pages, that shows up in the KPIs — and the rota manager has the staffing conversation. The platform surfaces the data. The manager drives the reform.

---

## Escalation by Alarm Level

| Alarm Level | Notification Required |
|---|---|
| Box 0 | None — MIM triage only |
| Box 1 | On-call responder for the affected service |
| Box 2 | Engineering leadership notified. Stakeholder milestone published. |
| Box 3 | Executive leadership notified. Full command structure activated. Run Card engaged. |

Alarm levels escalate up when conditions worsen; they do not automatically de-escalate. De-escalation is a deliberate MIM decision, logged in the timeline, with explicit notification to all parties who were activated.

---

## The Escalation Decision Framework

When the MIM is deciding whether to escalate to the next alarm level or page an additional team, the decision framework is:

1. **Has the current recovery track had enough time to work?** Set a timebox. If the timebox expires without resolution, escalate.
2. **Is the scope expanding?** Expanding scope almost always warrants escalation.
3. **Has the blast radius grown beyond initial assessment?** Escalate.
4. **Is the customer impact trajectory worsening?** Escalate.
5. **Is there a vendor dependency that hasn't been engaged?** Page the Service Manager to engage now.

If the answer to any of these is yes and you are not escalating, you are hesitating. Name the hesitation and make the call.

---

## Vendor Escalation

When a vendor is involved:
- The Service Manager is accountable for the vendor escalation
- Know your vendor's escalation path *before* the incident — it should be in the Agency Run Card
- Track the vendor's stated RCA timeline. When it passes, escalate to the next vendor tier

"We're waiting on them" is not an acceptable status. "We opened a P1 ticket at 14:32, their stated SLA is 2 hours, we'll escalate to their TAM at 16:32 if no update" is acceptable.

---

## Release Protocol

Escalation has an inverse: **release**.

Just as responders are activated when they are needed, they are released when their work is complete. Release is not implied — it is explicit and logged.

The MIM releases each team when:
- Their recovery track is complete or explicitly abandoned
- Validation for their system domain is confirmed
- They have no outstanding action items or open questions

A responder who has not been released is still accountable to the incident. They do not assume they are free because things seem resolved.

**The bridge ends when the MIM says it ends.** Not when the incident feels over.

---

## Escalation Anti-Patterns

**The "one more thing" trap** — The MIM or SRE tries one more recovery action before paging the next team. Each action fails. Each failure adds time. The on-call who should have been paged 45 minutes ago finally gets called, now with less context and more pressure.

**Social hesitation** — The MIM knows they should page the overnight on-call but delays because it's 2am and they feel bad. The Guardian doctrine applies: the on-call made a commitment. Honor it by activating them when they're needed.

**Soft declarations** — Treating an incident as "escalating toward P1" without declaring P1. The full command structure is not activated. Executive notification doesn't happen. And then the incident gets worse and everyone wishes they had declared 45 minutes earlier.

**Scope creep without level adjustment** — The blast radius expands from one service to three, but the MIM doesn't revise the alarm level because "we're already working it." The alarm level determines the response. If the scope warrants Box 3, the response should be Box 3.

---

*See also: [Alarm Levels](/command-model/alarm-levels/) · [Bridge Control](/bridge/bridge-control/) · [Command Roles](/command-model/command-roles/)*
