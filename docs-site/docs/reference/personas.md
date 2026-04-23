---
title: Personas
description: Who uses MajorOps and what they need — the MIM, SRE, Leader, Service Manager, Customer Ops, Stakeholder, and Executive perspectives.
---

MajorOps is designed for multiple audiences, each at a different altitude and with different information needs. The same incident data powers every view — one record, multiple lenses.

---

## Major Incident Manager (MIM / IC)

**Altitude:** Fireground (operator level)  
**Access:** Full read/write on the incident record

The MIM is the primary user of MajorOps. Everything in the platform is designed around their workflow.

**What they need:**
- Open an incident in under 10 seconds with only severity, summary, affected systems, and bridge link
- Assign command roles with join/leave history so span-of-control is explicit during handoffs
- Manage recovery tracks with named owners, timeboxes, and outcome tracking
- Post milestones with a "next update at" commitment and receive cadence nudges when the commitment approaches
- Page on-call teams from a validated list (no free-text drift)
- Advance phases with one action, logged with a timestamp

**What they don't need:** To rebuild context every time they open the incident. The record should tell them exactly where things stand.

---

## SRE — Technical Recovery Lead

**Altitude:** Fireground (technical operator)  
**Access:** Read/write on recovery tracks and timeline events

**What they need:**
- Active recovery tracks with owner, timer, and outcome (pass/fail/abandon) so parallel tracks stay visible and timeboxed
- Branch task queues (Infra / App / Cloud) so they can direct work without stepping on other teams
- A "current bet" field — the active working theory — surfaced to the MIM and stakeholders so leadership knows what we're trying right now
- Hypothesis tracking: each hypothesis has a lifecycle (active → validated / eliminated / discarded). Hypotheses are never deleted — their elimination is the finding.

---

## Leader — Recovery Director

**Altitude:** 30,000 ft (executive command)  
**Access:** Read on the incident record; write on named authorizations

**What they need:**
- A single-page brief showing phase, severity, impact, ETA to next update, and confidence so they can decide whether to intervene
- Risk-level and business-impact fields translated to business language so they can update other leaders without technical mediation
- Notification when a decision requires their authority (emergency change approval, vendor escalation, resource unlock)

**What they don't need:** Updates on demand. They get the same milestones everyone else does.

---

## Service Manager / System Owner

**Altitude:** Fireground (business liaison)  
**Access:** Read on incident; write on vendor and business impact fields

**What they need:**
- Ability to confirm or override customer-impact numbers so that public statements stay accurate
- Vendor escalation tracking: SLA countdown, case number, escalation tier, and RCA commitment date
- Notification when the vendor RCA due date passes

---

## Stakeholder (Internal / 10,000 ft)

**Altitude:** 10,000 ft (milestone feed)  
**Access:** Read-only on milestone feed and public incident record

**What they need:**
- A milestone feed with "last update" and "next update ETA" badges so they don't have to join the bridge
- Per-incident subscribe/unsubscribe so they only receive notifications for services they own
- Enough context to answer "what's happening and when will it be fixed" without needing to interpret technical data

---

## Executive (30,000 ft)

**Altitude:** 30,000 ft (summary view)  
**Access:** Read-only on executive summary view

**What they need:**
- Phase, severity, customer impact, confidence, and ETA to next update — in that order, in plain language
- Business impact translated out of technical language
- No noise: they should not need to filter information to find what matters

---

## On-Call Responder

**Altitude:** Fireground (technical operator, scoped)  
**Access:** Read on incident; write on assigned recovery track

**What they need:**
- A minimal "what's needed now" panel: who is leading, what the current bet is, what is blocked
- Ability to log timeline events with one keyboard shortcut so the timeline stays accurate without slowing their work
- A clear sense of when they are released — they are on this incident until the MIM releases them

---

## Customer Operations

**Altitude:** Fireground — tool panel only  
**Access:** Read on active milestones; write on impact panel (no bridge air time)

Customer Operations is a **tool-panel-only role**. They do not speak on the bridge. Their contribution flows through the tool panel.

**What they need:**
- A structured impact panel: confirmed-affected client count, unverified-affected count, and severity categorization
- A Q&A panel where the MIM can post direct questions ("Has Acme confirmed errors?") and Customer Ops can post structured answers — so client-specific data flows into the incident record without verbal interruption
- Ability to post plain-text client impact statements with attribution
- Read-only access to active milestones so they can verify customer-facing language before it publishes

**What they don't need:** Bridge air time, direct vendor contact, or resolution authority.

---

## Personas and the Tiered Awareness Model

| Persona | View | Fidelity | Auth Required |
|---|---|---|---|
| MIM | Fireground | Full operational | Yes |
| SRE / Responder | Fireground | Track-scoped | Yes |
| Leader | Executive view | High-altitude | Yes |
| Service Manager | Fireground | Business/vendor | Yes |
| Customer Ops | Tool panel | Impact only | Yes |
| Internal Stakeholder | Milestone feed | 10,000 ft | No (internal network) |
| Executive | Executive view | 30,000 ft | No (internal network) |

One data source. Multiple lenses. Zero duplication of effort.
