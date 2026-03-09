---
draft: true
---

# MajorOps Glossary

A shared vocabulary for consistent understanding across the incident lifecycle.

All terms used in MajorOps documentation, the fireground view, and stakeholder communications should conform to this glossary. Consistency in terminology is not pedantic — it is a safety feature. When everyone uses the same words for the same things, coordination is faster and misunderstandings are rarer.

---

## Incident Terminology

**Major Incident**
Any technology failure that meets the threshold for MajorOps activation: typically P1 or P2 severity, with measurable business or customer impact, requiring coordinated multi-team response.

**MIM (Major Incident Manager)**
The certified responder accountable for live coordination and escalation of a major incident. The MIM is the Incident Commander in the IT-ICS model. They coordinate — they do not fix. See `docs/philosophy/ICS-IT-STRUCTURE.md`.

**IC (Incident Commander)**
Synonymous with MIM in MajorOps. Used in formal ICS documentation and this glossary when discussing the role in structural terms.

**Bridge**
The communication channel — typically a phone/video call — where the incident response team coordinates in real time. "On the bridge" means actively participating in the live incident call. The MIM runs the bridge.

**Fireground**
The MIM's working environment during an active incident. The operator dashboard in MajorOps. Borrowed from fire service: the fireground is where firefighters work. In IT, the fireground is where the MIM works — not the server room.

**Phase**
One of the 8 stages in the MajorOps incident lifecycle: Alert, Gather, Assess, Initial, Isolation, Mitigation, Validation, Resolution. Phases are sequential but not rigid — some may be re-entered (notably Gather). See README for the full phase table.

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

## Communication Model

**CAN (Conditions / Actions / Needs)**
The structured communication format used by all teams on the bridge and in all status updates:
- **Conditions** — What is known, observed, and factual. No speculation without labeling.
- **Actions** — What is currently being done. Who owns it. What the timebox is.
- **Needs** — Blockers, escalations, or stakeholder dependencies.

Every team update follows CAN. The MIM synthesizes CAN inputs into milestones.

**Exposure Notation**
A METAR-style single-line status code summarizing operational truth for leaders. Format: `E{n}T{n}V{n}C({level})R({state})`. Published every 15 minutes or on significant change. See `docs/philosophy/EXPOSURE_NOTATION.md`.

**SitRep (Situation Report)**
A structured written summary of incident status at a point in time. In MajorOps, milestones serve as the SitRep mechanism. Executive-level SitReps may be longer-form and formatted differently.

---

## Severity and Escalation

**P1**
Critical severity. Broad business impact, customer-facing, full command structure activated. Box 3 alarm level response.

**P2**
High severity. Significant impact to key functions or performance. Multi-team response. Box 2 alarm level.

**P3**
Medium severity. Limited impact to subset of functionality. Single certified responder, SME optional. Box 1 alarm level.

**Alarm Level (Box 0–3)**
The fire service–inspired escalation scale that determines what resources respond:
- Box 0: Watch / Info — triage only
- Box 1: P3 — one certified responder
- Box 2: P2 — certified MIM + 2 responders
- Box 3: P1 — full command structure

See `docs/ALARM-LEVELS.md` for the full table.

**Escalation Path**
A predefined, version-controlled chain of command for requesting additional help or authority. Analogous to fire service mutual aid — defined before the incident, activated when needed.

---

## Governance and Quality

**After Action (AA)**
The structured process conducted after every major incident closes. Scheduled within 24 hours of incident close, held within 5 business days (Critical) or 10 business days (High). The question at the top is not "what went wrong" — it is "what did we learn, and what do we change?" See `docs/governance/after-action.md`.

**Learning Review**
The written document produced by the MIM as part of the After Action process. Drafted before the meeting using the MajorOps incident record — timeline, milestones, phase logs. Reviewed by attendees before the meeting. Published within 48 hours after. The Learning Review is the After Action's paper trail. Named deliberately: a lesson is only learned when behavior changes.

**RCA (Root Cause Analysis)**
The technical investigation into the underlying cause of an incident. Produced as part of the Learning Review. Feeds back into runbooks, training, and service improvements. No names in root cause — systems and processes only.

**CSI (Continual Service Improvement)**
The structured process for analyzing and improving incident response practices over time. Incident data informs CSI; CSI informs training and tooling.

**Binary Scorecard**
An auditable record of yes/no criteria based on incident behavior, escalation accuracy, and policy compliance. Used to assess incident quality and team performance.

**Accredited Responder**
An engineer or support leader who has completed a defined training path and is current on policy and technical response practice. Accredited responders are eligible for P1 command roles.

**Response Reputation Score**
A gamified metric tracking individual and team incident response quality over time. Inputs include response speed, resolution quality, knowledge sharing, and peer feedback. See `docs/governance/RESPONSE-REPUTATION.md`.

---

## Command Structure

**Run Card**
Predefined response instructions and expectations based on severity and known business impact. Equivalent to fire service run cards — what to do when a specific alarm level is declared.

**Release**
The explicit act of the MIM releasing a responder or team from an incident. Borrowed from ICS: you are on this incident until you are released by command. Release is logged with a timestamp.

**Mutual Aid**
A documented agreement between teams or vendors to respond to each other's major incidents with predefined roles, resources, and service levels.

**Strike Team**
A pre-configured, cross-functional response unit assembled for high-severity incidents. Each member knows their role before the incident starts.

---

## Product and Platform

**MajorOps**
The platform. Not a generic ITSM tool. Not a help desk. The operational layer between chaos and resolution.

**Fireground View**
The operator dashboard. What the MIM uses during an active incident. Phase tracking, command assignments, milestone composer, recovery path management. Auth required.

**Stakeholder View (10,000 ft)**
The milestone feed visible to internal staff. What changed, what's next, when to expect the next update. No auth required.

**Executive View (30,000 ft)**
Clean, current incident status at a glance. Impact, phase, severity, last update. No auth required.

**Tiered Awareness**
The design principle that different roles receive the same incident data at different altitudes of fidelity. One source of truth, multiple views.

---

> Want to add a term? Update this file in the main MajorOps repository.
