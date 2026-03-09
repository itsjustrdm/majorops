# MajorOps

### *A Practitioner's Guide to Major Incident Command in Modern IT Operations*

---

> "Every minute counts. Every responder certified. Every plan versioned. Every outcome measured."

---

## What This Is

This is a practitioner's guide to managing major technology incidents — written by someone who has sat in the chair.

It is not a vendor product. It is not an ITIL module. It is not a PowerPoint framework that looks good in a QBR.

It is a set of principles and structures borrowed from the disciplines that have mastered high-stakes coordination under pressure — **emergency dispatch, fire service ICS, aviation, and medicine** — and adapted for the reality of modern IT incident response.

The goal is simple: the people managing major incidents deserve purpose-built thinking, not repurposed help desk culture.

---

## The Problem

When a critical system fails, most IT organizations do the following:

1. Someone pages the on-call engineer, who pages someone else.
2. A bridge call opens. People trickle in without context.
3. The first 20 minutes are spent establishing what is already known.
4. Updates get posted to Slack. No one is sure which are current.
5. Executives get silence, then a flood, then silence again.
6. The incident closes. A post-mortem is scheduled. It gets rescheduled.
7. The same incident happens again.

This is not a failure of intelligence. It is a failure of structure.

The domains that have solved this problem — 911 dispatch, fire service, commercial aviation — did not solve it by finding smarter people. They solved it by building better structures, then training people to operate within them.

**MajorOps is the application of those structures to IT incidents.**

---

## Standing on the Shoulders

This work builds directly on:

- **Rob Schnepp, Ron Vidal, et al.** — *Incident Management for Operations* (O'Reilly, 2017). The first serious attempt to apply ICS thinking to technology incidents. Required reading.
- **FEMA NIMS ICS** — The U.S. National Incident Management System's Incident Command System. The gold standard for multi-agency emergency coordination, developed after a series of catastrophic coordination failures.
- **Emergency Medical Dispatch (EMD) protocols** — Standardized question sets that ensure every caller gets the same baseline triage, every time.
- **NTSB accident investigation methodology** — Treating failures as systemic data problems, not individual blame events.
- **METAR / aviation weather standards** — Compressing complex environmental state into a format any trained pilot can read in seconds.

MajorOps takes these foundations and extends them for a specific context: the **Major Incident Manager (MIM)** — the role that sits at the center of IT incident command and has, historically, had the least purpose-built support.

---

## The MIM Is the Switchboard Operator (No Capes)

The MIM does not fix the database or write the rollback script. They route signals, set cadence, and clear noise so the people who do fix the problem can move fast with clarity and the right resources. That is the entire job.

A fire IC does not carry a hose. A 911 dispatcher does not ride in the ambulance. The structure that enables the responder is as important as the responder. MajorOps is that structure.

---

## Contents

| Section | What it covers |
|---|---|
| [Philosophy](philosophy/PHILOSOPHY.md) | The principles behind the approach |
| [Glossary](GLOSSARY.md) | Shared vocabulary across all documents |
| [IT-ICS Roles](philosophy/ICS-IT-STRUCTURE.md) | The command structure, scaled by alarm level |
| [Stakeholder View](user-guide/stakeholder.md) | How to read the 10,000 ft incident view |
| [Executive View](user-guide/executive.md) | How to read the 30,000 ft exec brief |
| [Alarm Levels](ALARM-LEVELS.md) | Box 0–3 and when to escalate |
| [Exposure Notation](philosophy/EXPOSURE_NOTATION.md) | METAR-style single-line incident status |
| [Run Card System](RUNCARD-SYSTEM.md) | The three-tier dispatch architecture |
| [After Action](governance/after-action.md) | Learning Review process — what did we learn, what do we change |
| [Response Reputation](governance/RESPONSE-REPUTATION.md) | Future: gamified readiness scoring |
| [Data Dictionary](data-dictionary.md) | Field-level reference for the platform API and UI |

---

## Core Principles

1. **Structure enables speed.** Improvisation at scale produces chaos. Defined roles, defined communication, defined escalation — these are what let skilled people work fast.
2. **The MIM is the signal router.** Like a retro switchboard op: orchestrates people, cadence, and context so technical leads can fix without noise.
3. **Borrow from the best.** Fire service, aviation, emergency medicine, and 911 dispatch have solved these problems under higher stakes. Use what they built.
4. **Transparency is default.** Stakeholders should never have to ask for status. The structure makes status visible.
5. **Every incident improves the next.** Post-incident review is not a blame exercise. It is the mechanism through which the organization gets better.

---

## Who This Is For

- **Major Incident Managers** building or improving their practice
- **Engineering leaders** who need a command structure that scales
- **Operations and SRE teams** who want to move from reactive to structured
- **Anyone** who has watched a P1 incident dissolve into noise and wants to know why — and what to do instead

---

## What This Is Not

This is not a comprehensive ITSM implementation guide. It is not tied to any specific tooling platform. It is not an academic paper. It will not tell you which monitoring tool to buy.

It is a practitioner's framework. Take what is useful. Adapt it to your context. Improve it through use.

---

## Companion Platform

This guide is the philosophical foundation for the **MajorOps platform** — a real-time IT incident command tool built on Cloudflare Workers, D1, and Pages. The platform implements these principles in a purpose-built operator UI: a public status page, a stakeholder view, an exec brief, and the MIM fireground.

The frontend is a Vite + React + TypeScript application. The data model is defined in `DATA_MODEL.md` at the project root. The platform is under active development.

---

*Written by Ronnie Montgomery. Built on the foundations laid by Schnepp, Vidal, FEMA NIMS, and the emergency services community.*

*Licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Use it, adapt it, credit it.*
