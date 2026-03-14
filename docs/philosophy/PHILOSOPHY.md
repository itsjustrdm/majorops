---
draft: true
---

# MajorOps Philosophy

> *A practitioner's guide to major incident command — built on what works, borrowed from the people who figured it out under pressure.*

---

## The Problem We're Actually Solving

Modern IT incident management is not primarily a tooling problem. It is a discipline problem.

The tools exist — Slack, Jira, PagerDuty, ServiceNow. They are used in every major incident. And yet, the pattern repeats:

- Teams join a bridge call with no context.
- The first 20 minutes are spent establishing what is already known.
- Updates get lost in Slack threads no one can reconstruct later.
- Executives get silence — then a flood — then a gap.
- The same incident happens again because the lessons were never captured in a form anyone could act on.

The problem is not that engineers aren't smart. They are. The problem is that **the structure they're operating in doesn't support the conditions they're working under.**

Major incidents are not unusual work. They are the most extreme version of normal work, compressed, unpredictable, and happening at exactly the moment when structure matters most. The domains that have solved this — emergency services, aviation, medicine — did so not by making their people smarter, but by giving them better structures.

MajorOps is the application of those structures to IT incidents.

---

## The Core Belief

World-class incident response is not powered by heroics. It is powered by **structure**, **clarity**, and **repeatability**.

The goal is not to find the one brilliant engineer who can save everything. The goal is to build an environment where any certified responder, in any incident, knows exactly:

1. What role they occupy
2. What information they are expected to provide
3. Who they report to
4. When they are released

That environment does not happen by accident. It is designed.

---

## What We Borrow (and Why)

### From Alarm Central Offices — The Original Signal Standard

Before 911, every major city had a central alarm office.

When someone pulled a Gamewell fire alarm box on the street, it sent a coded telegraph signal to the central station. The operator received it, identified the box number — which mapped to an exact location and a predefined alarm tier — and dispatched the appropriate companies. Automatically. Without asking a single question, without waiting for a verbal description, without judgment calls about who to send.

That was not a technological feat. It was a **design feat**.

The signal was standardized. The box number meant something specific. The response was predetermined. Every operator at every shift followed the same protocol. The central alarm office didn't need to know *why* the box was pulled — the structure of the signal told them everything they needed to dispatch.

That model — standardized signal in, structured command out — is the conceptual foundation of MajorOps (served on the `mim.run` / `majorops.io` domains).

When a MIM opens an incident, they are doing exactly what the central station operator did: receiving a structured signal (the alert), identifying the alarm tier (severity / alarm level), and activating the predetermined response (run card + command structure). The signal tells you the protocol. The protocol tells you the response. The MIM runs the response.

The evolution of that model over 150 years looks like this:

| Era | System | Mechanism |
|---|---|---|
| 1850s–1900s | Gamewell box alarm | Coded telegraph signal → central office → manual dispatch |
| 1900s–1960s | Central station monitoring | Alarm panel → telephone → trained operator → protocol dispatch |
| 1970s–present | CAD (Computer-Aided Dispatch) | Structured call intake → computer-aided unit assignment → real-time tracking |
| 2026 | MajorOps (mim.run) | Alert signal → browser-native command interface → AI-assisted coordination |

The problem CAD systems developed over time is the same one ITSM tooling developed: they became purpose-built for the agencies that bought them, complex to operate, expensive to maintain, and inaccessible outside of a fixed workstation. The central alarm office operator had to be in the central alarm office.

MajorOps applies the same core design — standardized signal, structured command, predetermined protocols — without requiring anyone to be anywhere in particular. Any browser is a command station. `new.mim.run` is the modern Gamewell box. The run card is the dispatch protocol. The MIM is the operator.

The signal is the same. The structure is the same. The software is finally built for the era it operates in.

### From Emergency Dispatch (911)

911 dispatchers handle high-stakes, incomplete-information decisions at high volume, with zero tolerance for ambiguity about who is doing what. They use **standardized question sets**, **structured escalation protocols**, and **explicit resource assignment**. Every caller gets the same baseline questions. Every response has a defined tier.

We take from dispatch: the idea that every incident starts with a minimum viable set of structured inputs. The MIM is the dispatcher. Teams are the responding units.

### From Aviation (METAR / NTSB / Crew Resource Management)

Aviation has solved the problem of communicating complex status in seconds. A METAR is a weather report that any trained pilot can read instantly — structured, positional, no narrative required. Post-accident investigations (NTSB) treat safety reconstruction as a data problem, not a blame problem.

We take from aviation: the concept of **exposure notation** (the METAR equivalent for incidents) and the principle that the After Action should be rigorous, structured, and focused on the system — not the individual. The question is never "who made a mistake." It is always "what did we learn, and what do we change."

### From Fire Service (ICS)

The Incident Command System was developed after a series of disasters where multiple agencies responded to the same incident and couldn't coordinate. Different terminology, different command structures, different radio protocols — chaos. ICS solved this by establishing a single standard that scales from a single-unit response to a multi-agency catastrophe without changing structure.

We take from fire: **the command structure** (IC, Operations, Planning, Logistics), **span of control** (no one manages more than 7 people), **explicit release** (you are on this incident until you are released by command), and **tiered response** (the alarm level determines who responds, not the first engineer to notice the problem).

### From Medicine (Clinical Protocols / APGAR / GCS)

Clinical medicine compresses patient state into scores anyone trained can read instantly (APGAR, GCS). It also uses **standardized handover formats** so that a patient transferred between teams arrives with complete, structured context.

We take from medicine: **structured handover**, **standardized severity assessment**, and the principle that clinical saves (successful early interventions) should be recognized and learned from.

---

## The MIM Is the 911 Dispatcher, Not the Paramedic

The Major Incident Manager is the 911 dispatcher: routes signals, sets tempo, and keeps span-of-control so specialists can work without noise. Their job is tempo, clarity, and command — not hands-on technical recovery.

This distinction matters because the failure mode in most incidents is a technically excellent engineer trying to do two things at once: own the call *and* fix the issue. They usually fail at both.

The MIM holds the bridge. They log milestones. They advance phases. They assign command roles. They post updates. They manage the exposure to leadership. They release teams when their work is done.

The tech leads fix the system.

---

## The Guardian of Service

When a major incident is declared, the customers are already affected. The service is already broken.

The MIM is not protecting engineers from an inconvenient page. The MIM is protecting customers from a longer outage.

This is the Guardian doctrine: **we are the guardian of service, not the guardian of anyone's schedule.**

Escalation hesitation — waiting, hoping the issue resolves, trying one more thing before calling the next team — is a choice. It is a choice to prioritize internal comfort over customer impact. MajorOps makes that choice explicit and names it as the wrong one.

The cost of an unnecessary page is minutes of someone's time. The cost of a delayed escalation is hours of customer impact. These costs are not equal. **Page early. De-escalate later if you must.**

See [Escalation Doctrine](escalation-doctrine.md) for the full framework, including automated guardrails and the organizational culture shift required.

---

## Bridge Control and Information Authority

The bridge is a mission, not a meeting. Customer impact is accumulating in real time. Every word on the bridge has a cost — measured in the time it takes everyone to process it.

At any moment on the bridge, exactly one person holds **Information Authority** — the right to speak and the responsibility to be the source of truth for their domain. The MIM holds it by default. When a SME goes hands-on-keyboard on a recovery track, authority transfers to them. When they report back, it returns to the MIM.

A SME who goes silent during active recovery work is the equivalent of an officer in a vehicle pursuit who stops transmitting. The MIM cannot coordinate. Backup is blind. The outage extends — not because the fix was hard, but because the information did not flow.

See [Bridge Control](bridge-control.md) for the full protocol, including the Open Air Rule and call discipline standards.

---

## The CAN Methodology

All bridge communication in MajorOps follows CAN:

- **Conditions** — What is known, observed, and factual. No speculation. Speculation is labeled as such.
- **Actions** — What is currently being done. Who owns it. What the timebox is.
- **Needs** — What is blocking progress. What escalation is required. What the next expected update is.

Every status update from every team follows this format. The MIM compresses CAN inputs from all teams into a milestone. The milestone is what stakeholders see.

This eliminates the telephone game. There is one source of truth. It is structured. It is timestamped. It does not degrade as it moves up the chain.

---

## Peacetime and Wartime

MajorOps has two operating states, borrowed directly from military and emergency services practice:

**Peacetime** — No active major incidents. The system is operational, the team is trained, procedures are in place and versioned. The green terminal prompt blinks slowly in the logo. This is when training happens, runbooks get updated, certifications are maintained, and the alarm level system is reviewed.

**Wartime** — A major incident is active. The logo switches. The terminal prompt blinks red. Command is engaged. Every responder knows their role. The structure is activated, not improvised.

The critical insight is that **wartime performance is determined by peacetime preparation**. You cannot improvise structure under pressure. You build it first.

---

## Free Text Is Already Happening

MIMs are not working in a vacuum before MajorOps. They are already doing all of this — in a Slack DM, a personal Notes document, a shared Google Doc that only five people know about, or an Excel sheet they keep on their desktop.

During a major incident, a skilled MIM is already tracking:
- Who is working which thread
- What each team tried and what the result was
- When the last stakeholder update went out
- What the current hypothesis is
- Who is blocking on what

The problem is not that this data does not exist. The problem is that it exists in **unstructured, unqueryable, unauditable form** that evaporates the moment the incident closes.

A month later, nobody can answer: How long did we spend in isolation before finding the root cause? What hypothesis did we try first and why did we abandon it? Which recovery path succeeded? When did the Customer Ops team confirm client-side impact?

That data was all there. It just was not captured in a way that survives the incident.

**MajorOps does not ask the MIM to change how they work. It gives structure to what they are already doing.**

The free-text entry field exists because the first priority is capturing the information at all. The structure that surrounds it — recovery paths, hypothesis tracking, the CAD presence model, phase state — gives that information somewhere to live, a way to be queried, and a reason to trust it during the next incident or after action.

The value is not the software. The value is that the Excel sheet on someone's desktop becomes a database row, and next quarter's team can learn from it.

---

## Transparency as a Default

In MajorOps, all incident data is visible to all internal staff. There is no information hierarchy during a major incident — there is only a role hierarchy.

An executive does not get a special restricted view. They get the same data as everyone else, presented at the appropriate altitude (the 30,000 ft view). A junior engineer on-call gets the same data, presented at the appropriate depth (the fireground view).

This design principle exists because **withheld information degrades coordination**. Teams that don't know what other teams know cannot self-organize effectively. Executives who get filtered summaries lose confidence in the response.

One data source. Multiple lenses. No duplication of effort.

---

## Structure Is Humane

The final point: imposing structure on incident responders is not bureaucratic. It is protective.

The engineer on bridge call #7 of their week, at 2am, dealing with a cascading failure across three services, does not need to figure out what to do. They need a structure that tells them what role they have, what is expected of them, and when they can go home.

That is what MajorOps is for.

---

*"Accountability built into the fabric of response."*
