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

## Bridge Control

**Information Authority**
The right to speak on the bridge, and the responsibility to be the source of truth for a domain, at a given moment. Information Authority is not a fixed role — it transfers. The MIM holds it by default. When a SME goes hands-on-keyboard on a recovery track, authority transfers to them. When they report back, it returns to the MIM. See `docs/philosophy/bridge-control.md`.

**Information Authority Transfer**
The explicit act of assigning or reclaiming the bridge floor. The MIM activates a SME: *"[Name] — you have the floor."* The SME reports back. The MIM acknowledges and reissues direction. Both transfers are verbal and deliberate — never implied.

**Air Time Discipline**
The practice of treating bridge communication as a shared, finite resource. Every word spoken draws from the bridge's attention. The MIM ensures air time is spent on Conditions, Actions, and Needs — not speculation, social conversation, or repetition of information already in the timeline.

**Open Air Rule**
If a question is asked on the bridge, it demands an answer. If an answer is not immediately available, the MIM parks it explicitly with a named person and a timeframe: *"[Name], get us the uptime figure. We'll come back in 10 minutes."* Open questions are never abandoned — they are resolved or explicitly deferred with accountability.

**Guardian of Service**
The MIM's operating frame during a major incident. The customers are already affected. The MIM's job is to protect them from prolonged impact — not to protect engineers from inconvenience. When escalation hesitation occurs, the Guardian doctrine applies: page now, de-escalate later if needed. See `docs/philosophy/escalation-doctrine.md`.

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

**Fireground View (Classic)**
The default MIM operator dashboard. Full situational overview — command team, phase panel, timeline, milestones, dispatch, recovery paths. Auth required. URL: `/admin/incidents/:id`.

**Terminal View**
The CAD command line fireground. 3-column fixed viewport, unified micro-update feed, command input at the bottom. The recommended view for active P1/P2 incidents. Accepts bridge notes and slash commands without leaving the keyboard. URL: `/admin/incidents/:id/terminal`.

**Focus View**
A stripped-down single-surface fireground for high-noise incidents. No sidebars. Just phase, current bet, guidance, and the essentials. URL: `/admin/incidents/:id/focus`.

**CAD Bar (Global CAD Bar)**
A persistent 32px command bar fixed to the bottom of every page in MajorOps. Context-aware: green `majorops ▸` at root, red/amber `INC-1234 ▸` in an active incident. Press `` ` `` from anywhere to focus it. Accepts all navigation and operational commands — `join`, `what`, `ls`, `new`, `view`, `pop`, `mom`, `leave`, and more.

**MOM (Menu of Menus)**
A quick-key reference panel that opens above the CAD bar. Two columns: navigation commands on the left, incident ops on the right. Activated with `mom` in the CAD bar or by typing `mom`. The IT equivalent of a CAD system's quick-key card.

**Hypothesis**
A first-class entity within a recovery path. Each hypothesis has a lifecycle: `active → validated / eliminated / discarded`. Hypotheses are never deleted — their elimination is the finding. An eliminated hypothesis from a previous incident is the first thing to check the next time the same failure mode appears.

**Recovery Path**
A named stream of investigation and remediation work within an incident. Each path has an owner, a phase, a current bet (working theory), and a set of hypotheses. Multiple paths can run simultaneously. Paths can regress — if a path was at Isolation and the wrong team was engaged, regressing to Gather is the correct action. Also referred to as a **Recovery Track** in some contexts.

**Stakeholder View (10,000 ft)**
The milestone feed visible to internal staff. What changed, what's next, when to expect the next update. No auth required.

**Executive View (30,000 ft)**
Clean, current incident status at a glance. Impact, phase, severity, last update. No auth required.

**`what.mim.run`**
The natural language incident search surface. `what.mim.run/payment processing` performs a fuzzy search across all active and recently resolved incidents. A single clear match redirects automatically. Multiple matches show a picker. Identical to `mim.run/search?q=payment+processing`. Exists because humans describe incidents by what broke, not by ticket number.

**Tiered Awareness**
The design principle that different roles receive the same incident data at different altitudes of fidelity. One source of truth, multiple views.

**Team Page / Dispatch**
The structured act of paging an on-call team to a major incident. Team name is selected from a validated list (no free-text drift). Arrival is tracked with a timestamp. Response times feed the Team Dispatch Credit score on the analytics dashboard.

**Team Dispatch Credit Score**
A per-team KPI tracking response speed and reliability across all incidents. Modeled on the ISO Public Protection Classification (1–10 scale). Accumulated over rolling incidents. Surfaces in the analytics dashboard and is the data behind post-incident accountability conversations.

**CAD (Computer-Aided Dispatch)**
The technology class MajorOps draws from most directly. In public safety, a CAD system is what the dispatcher uses to receive calls, assign units, and track the status of every active incident in real time. MajorOps applies the same model — persistent command interface, structured dispatch, real-time status — to IT incident response.

---

> Want to add a term? Update this file in the main MajorOps repository.
