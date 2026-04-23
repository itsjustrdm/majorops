---
title: Glossary
description: Shared vocabulary for MajorOps — incident terminology, bridge control, communication model, severity, governance, and command structure.
---

A shared vocabulary for consistent understanding across the incident lifecycle.

All terms used in MajorOps documentation should conform to this glossary. Consistency in terminology is not pedantic — it is a safety feature. When everyone uses the same words for the same things, coordination is faster and misunderstandings are rarer.

---

## Incident Terminology

**Major Incident**
Any technology failure that meets the threshold for MajorOps activation: typically P1 or P2 severity, with measurable business or customer impact, requiring coordinated multi-team response.

**MIM (Major Incident Manager)**
The certified responder accountable for live coordination and escalation of a major incident. The MIM is the Incident Commander in the IT-ICS model. They coordinate — they do not fix. See [Command Roles](/command-model/command-roles/).

**IC (Incident Commander)**
Synonymous with MIM in MajorOps. Used in formal ICS documentation when discussing the role in structural terms.

**Bridge**
The communication channel — typically a phone/video call — where the incident response team coordinates in real time. "On the bridge" means actively participating in the live incident call. The MIM runs the bridge.

**Fireground**
The MIM's working environment during an active incident. The operator dashboard in MajorOps. Borrowed from fire service: the fireground is where firefighters work. In IT, the fireground is where the MIM works — not the server room.

**Phase**
One of the 8 stages in the MajorOps incident lifecycle: Alert, Gather, Assess, Initial, Isolation, Mitigation, Validation, Resolution. Phases are sequential but not rigid — some may be re-entered (notably Gather). See [Incident Lifecycle](/command-model/incident-lifecycle/).

**Milestone**
A structured, timestamped summary cut from micro-updates. The unit of stakeholder communication. The MIM reviews and publishes milestones — auto-populated from the fireground log, edited before publishing. Milestones are what stakeholders and executives see.

**Micro-Update**
A raw, fast, low-friction operational note logged by the MIM or team during an incident. No schema enforcement. The fireground log. Micro-updates are the source material for milestones.

**Recovery Track**
A team- or technology-specific stream of work aimed at restoring service or mitigating risk. A P1 incident may have three simultaneous recovery tracks (Infrastructure, Application, Database). Each track has an assignee, a timebox, and an outcome.

**Timebox**
A fixed-duration segment opened for a specific recovery goal. "Get conditions from App and DB teams in 5 minutes." If the timebox expires without a result, the MIM escalates or changes approach.

**Call for Service**
The action of opening a MajorOps incident. Borrowed from public safety dispatch — any team or system can call for service with a minimum viable set of fields (type, severity, summary, impact). The MIM responds.

---

## Bridge Control

**Information Authority**
The right to speak on the bridge, and the responsibility to be the source of truth for a domain, at a given moment. Information Authority is not a fixed role — it transfers. The MIM holds it by default. When a SME goes hands-on-keyboard on a recovery track, authority transfers to them. When they report back, it returns to the MIM. See [Bridge Control](/bridge/bridge-control/).

**Information Authority Transfer**
The explicit act of assigning or reclaiming the bridge floor. The MIM activates a SME: *"[Name] — you have the floor."* The SME reports back. The MIM acknowledges and reissues direction. Both transfers are verbal and deliberate — never implied.

**Air Time Discipline**
The practice of treating bridge communication as a shared, finite resource. Every word spoken draws from the bridge's attention. The MIM ensures air time is spent on Conditions, Actions, and Needs — not speculation, social conversation, or repetition of information already in the timeline.

**Open Air Rule**
If a question is asked on the bridge, it demands an answer. If an answer is not immediately available, the MIM parks it explicitly with a named person and a timeframe. Open questions are never abandoned — they are resolved or explicitly deferred with accountability.

**Guardian of Service**
The MIM's operating frame during a major incident. The customers are already affected. The MIM's job is to protect them from prolonged impact — not to protect engineers from inconvenience. When escalation hesitation occurs, the Guardian doctrine applies: page now, de-escalate later if needed. See [Escalation Doctrine](/bridge/escalation/).

---

## Communication Model

**CAN (Conditions / Actions / Needs)**
The structured communication format used by all teams on the bridge and in all status updates:
- **Conditions** — What is known, observed, and factual. No speculation without labeling.
- **Actions** — What is currently being done. Who owns it. What the timebox is.
- **Needs** — Blockers, escalations, or stakeholder dependencies.

Every team update follows CAN. The MIM synthesizes CAN inputs into milestones.

**Exposure Notation**
A METAR-style single-line status code summarizing operational truth for leaders. Published every 15 minutes or on significant change. See [Exposure Notation](/reference/exposure-notation/).

**SitRep (Situation Report)**
A structured written summary of incident status at a point in time. In MajorOps, milestones serve as the SitRep mechanism.

---

## Severity and Escalation

**P1**
Critical severity. Broad business impact, customer-facing, full command structure activated. Box 3 alarm level response.

**P2**
High severity. Significant impact to key functions or performance. Multi-team response. Box 2 alarm level.

**P3**
Medium severity. Limited impact to subset of functionality. Single certified responder, SME optional. Box 1 alarm level.

**Alarm Level (Box 0–3)**
The fire service–inspired escalation scale that determines what resources respond. See [Alarm Levels](/command-model/alarm-levels/).

**Escalation Path**
A predefined, version-controlled chain of command for requesting additional help or authority. Analogous to fire service mutual aid — defined before the incident, activated when needed.

---

## Governance and Quality

**After Action (AA)**
The structured process conducted after every major incident closes. The question at the top is not "what went wrong" — it is "what did we learn, and what do we change?" See [After Action](/governance/after-action/).

**Learning Review**
The written document produced by the MIM as part of the After Action process. Drafted before the meeting using the incident record. Published within 48 hours after the meeting. Named deliberately: a lesson is only learned when behavior changes.

**RCA (Root Cause Analysis)**
The technical investigation into the underlying cause of an incident. Produced as part of the Learning Review. No names in root cause — systems and processes only.

**CSI (Continual Service Improvement)**
The structured process for analyzing and improving incident response practices over time. Incident data informs CSI; CSI informs training and tooling.

**Peer Review**
A structured quality assessment of a MIM's incident command, completed by a second certified MIM after incident close. Covers eight competency domains. Produces a locked record attached to the incident. Separate from the After Action. See [Peer Review](/governance/peer-review/).

---

## Command Structure

**Run Card**
Predefined response instructions and expectations based on severity and known business impact. Three tiers: Agency (Tier 1), Generic Application (Tier 2), Specific Application (Tier 3). See [Three-Tier Run Card System](/runcards/runcard-system/).

**Release**
The explicit act of the MIM releasing a responder or team from an incident. Borrowed from ICS: you are on this incident until you are released by command. Release is logged with a timestamp.

**Mutual Aid**
A documented agreement between teams or vendors to respond to each other's major incidents with predefined roles, resources, and service levels.

**Tiered Awareness**
The design principle that different roles receive the same incident data at different altitudes of fidelity. One source of truth, multiple views: MIM fireground (operator level), stakeholder view (10,000 ft), executive view (30,000 ft).
