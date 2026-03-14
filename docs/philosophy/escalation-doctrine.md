# Escalation Doctrine

**Page Early. Escalate Fast. Recover Faster.**

---

## The Core Asymmetry

There is a cost to paging someone unnecessarily.

It is measured in minutes of interrupted sleep, a disrupted dinner, an annoyed engineer.

There is also a cost to a delayed escalation.

It is measured in hours of customer impact, degraded revenue, eroded trust, and an organization left wondering why nobody called sooner.

These two costs are not equal. They have never been equal. And yet most incident response cultures treat them as if they are — hedging, waiting, hoping the issue resolves before anyone else has to know.

MajorOps does not hedge.

---

## The Guardian Doctrine

When a major incident is declared, the customers are already affected. They are already bothered. The service is already broken.

The MIM is not protecting engineers from inconvenience. The MIM is protecting customers from prolonged impact.

That is the only frame that matters.

> **We are the guardian of service. Not the guardian of anyone's sleep schedule.**

The moment a team hesitates to page the next group because they don't want to "bother" anyone, they have made a choice: their comfort over the customer's. MajorOps makes that choice explicit — and wrong.

---

## It Is Okay to Page People

This is a named cultural principle, not a suggestion.

Escalation hesitation is a learned behavior. Engineers learn it because:

- Previous escalations were received poorly
- They were criticized for "crying wolf"
- The culture rewards quiet heroism over structured coordination
- Nobody explicitly told them it was okay to ask for help

MajorOps explicitly tells them: **it is okay to ask for help.**

More than okay. It is expected. It is the right call. It is what professionals do.

Emergency services figured this out a long time ago:

- Fire departments send full first alarms immediately — they scale down if unnecessary
- EMS dispatches before perfect information exists — they adapt on scene
- 911 dispatchers do not wait for confirmation before sending units — they move on best available information

The cost of over-resourcing an incident that self-resolves is a few people's time. The cost of under-resourcing an incident that doesn't is your customer relationship.

**De-escalate later if you must. Escalate now.**

---

## Phase-Driven Escalation

Most incident calls drift because nobody knows what phase the incident is in — and without a defined phase, there is no trigger for action.

MajorOps tracks phase explicitly. Every incident is always in exactly one command phase. That phase is visible to everyone with access to the incident.

This matters for escalation because phase is the objective measure of progress. Not "how long it's been going." Not gut feel. Phase.

If an incident has been in Isolating for 45 minutes with no movement toward a recovery plan — that is a measurable, documented state. The platform can act on it.

---

## Automated Escalation Guardrails

Because MajorOps tracks phase in real time, the platform can enforce escalation discipline automatically.

This removes the social friction entirely. Nobody has to decide whether to page. The platform decides, based on incident behavior.

### The Gather Guardrail

```
IF phase = Gathering
AND no recovery path has been opened
AND time_in_phase > [configured threshold]
THEN
  → Send informational page to escalation tier
  → Log automated escalation event to incident timeline
```

This is not a panic page. It is a situational awareness page:

*"Major Incident in progress. No active recovery paths. MIM: [name]. Incident: [ID]."*

The receiving engineer now knows something is stalled. They can join, assist, or simply be aware. The MIM is not bypassed — the page is informational, not a command transfer.

### The Isolating Guardrail

```
IF phase = Isolating
AND no recovery path has advanced beyond Isolating
AND time_in_phase > [configured threshold]
THEN
  → Send informational page to next escalation tier
  → Suggest MIM review recovery path status
```

### Thresholds

Guardrail thresholds are configured per organization and per alarm level. A Box-3 incident has tighter thresholds than a Box-1. A 3am incident may have different thresholds than a 10am incident.

These are not hardcoded. They are policy — set by the MIM Lead or Operations Chief and stored as platform configuration.

---

## Escalation as a Platform Feature

Escalation is not a social expectation in MajorOps. It is a product capability.

The platform provides:

| Capability | What it does |
|---|---|
| Phase tracking | Incident is always in a defined, visible state |
| Recovery path tracking | Each parallel thread of work has its own phase |
| Escalation timers | Guardrails fire when incidents stagnate |
| Automated paging | Escalation happens on incident behavior, not human judgment |
| Audit trail | Every escalation — manual or automated — is logged with timestamp and trigger |

The result: **no hesitation, no awkward social friction, no waiting for permission.**

---

## The Cultural Shift in One Line

| Old model | MajorOps model |
|---|---|
| "Let's try a few more things before we wake anyone." | "Page now. De-escalate later if we don't need them." |

The old model protects engineers. The new model protects customers.

Only one of those is the job.

---

## Operationalizing It

For organizations adopting MajorOps, the escalation doctrine requires three things to take hold:

**1. Say it out loud.** The MIM should open every Box-2 or Box-3 bridge by stating: "We will escalate early and de-escalate if we don't need the resource. If you think we need another team, say so." That sentence alone changes the call.

**2. Never criticize an unnecessary escalation.** If someone paged a team that turned out not to be needed, the correct response is: "Good call. Better to have them and not need them." If that page is ever met with frustration, the doctrine dies.

**3. Let the platform reinforce it.** The guardrail pages remove the decision from the human. When the platform pages automatically, it signals that escalation is structural, not personal. Nobody is bothering anyone. The system is doing its job.

---

*See also: [Alarm Levels](../ALARM-LEVELS.md) for escalation thresholds · [ICS-IT Structure](ICS-IT-STRUCTURE.md) for command roles · [Bridge Control](bridge-control.md) for call management*
