---
title: Alarm Levels
description: The Box 0–3 alarm level system — adapted from fire service box alarms — that removes subjectivity from escalation decisions.
---

> Adapted from the fire service Box Alarm system. Defines what resources respond at each severity level of a major incident.

---

## What Are Alarm Levels?

Alarm levels remove subjectivity from escalation. Without them, the decision to "bring in more people" or "call leadership" depends on individual judgment under stress — exactly when judgment is most impaired.

By mapping severity to a predefined alarm level, MajorOps ensures that the response is determined before the incident, not during it.

> "You wouldn't send a bicycle cop to a high-rise fire. Why send a junior engineer to a declared P1?"

---

## Defined Levels

| Alarm Level | Severity | Characteristics | Response |
|---|---|---|---|
| **Box 0** | Watch / Info | Early detection. Rumor of slowness. Monitoring alert with no confirmed impact. | MIM triage only. No bridge, no callout. |
| **Box 1** | P3 | Limited impact to a subset of functionality. Single service or small user group affected. | 1× Certified Responder. SME optional. MIM on standby. |
| **Box 2** | P2 | High impact to key business functions or performance. Broad user impact or critical service degraded. | 1× Certified MIM (active), 2× Responders. Stakeholder notification. |
| **Box 3** | P1 / Major | Critical outage. Broad business impact. Customer-facing failure. Revenue or SLA risk. | Full command structure. Run Card activated. Cross-functional team. Executive notification. |

---

## Why Box Alarms, Not Just Severity Labels?

Severity labels (P1, P2, P3) describe the impact. Alarm levels describe the **response**.

The distinction is intentional. A P2 incident with vendor escalation might activate additional resources that a standard P2 wouldn't. A confirmed P1 at 2am might be escalated differently than a P1 at 10am. The alarm level is the operational signal; severity is the business signal.

Alarm levels also map to:
- **Certified responder tier required** — not all engineers can run a Box 3
- **Mutual aid triggers** — Box 3 activates cross-team mutual aid agreements
- **Leadership notification** — Box 2 → Engineering leadership. Box 3 → Executive leadership.
- **Exposure notation** — the E-field in the exposure line directly reflects the alarm level

---

## Alarm Level Triggers

### Box 0 → Box 1

An alert has been confirmed as impacting real users or functionality, even if limited. The MIM acknowledges and assigns an initial responder.

Trigger conditions:
- Monitoring alert confirmed by at least one human
- First user report corroborated by system data
- Service team reports degraded behavior affecting their workflow

### Box 1 → Box 2

Impact is broadening or the initial recovery attempt has not resolved the issue.

Trigger conditions:
- Impact scope expanded beyond initial assessment
- Initial recovery track has failed
- Vendor involvement required
- Time elapsed without resolution exceeds P3 SLA

### Box 2 → Box 3 (Major Incident Declaration)

Business impact is confirmed at a level that requires full command structure. This is the **Major Incident Declaration** — the moment MajorOps goes to wartime mode.

Trigger conditions:
- Customer-facing service is down or severely degraded
- Revenue impact confirmed or highly probable
- Multiple teams required simultaneously
- Regulatory or compliance exposure
- Executive awareness required

---

## The Decision Rule

When there is ambiguity about the alarm level, default to the higher level.

This is borrowed directly from emergency services: **severity defaults up, not down.** The cost of over-responding is effort. The cost of under-responding is catastrophe.

---

## Mapping to P-Severity

| MajorOps Severity | Alarm Level | Notes |
|---|---|---|
| P1 / Critical | Box 3 | Full command structure activated |
| P2 / High | Box 2 | MIM active, stakeholder notification |
| P3 / Medium | Box 1 | Initial responder, MIM on standby |
| Pre-incident monitoring | Box 0 | Triage only, not yet a declared incident |

---

## Mutual Aid

Box 3 incidents activate mutual aid agreements. These are predefined arrangements between teams or with vendors that specify:

- Response time commitments
- Resource types available
- Escalation contacts
- Communication protocol

Mutual aid agreements are documented separately per team and per vendor. They are reviewed annually and updated after any incident where mutual aid was needed.

---

*Based on the fire service Box Alarm system.*
