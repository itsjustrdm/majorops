# Escalation Framework

**Page Early. Escalate Fast. Recover Faster.**

---

## The Core Asymmetry

There is a real cost to an unnecessary page.

There is also a cost to a delayed escalation — measured in hours of customer impact, degraded revenue, and an organization left asking why nobody called sooner.

These costs are not equal. And yet most incident response cultures treat them as if they are — hedging, waiting, hoping the issue resolves before the next team has to be involved.

MajorOps does not hedge.

---

## On-Call Is the Contract

Before anything else: MajorOps pages on-call rotations. Not named individuals. Not whoever an engineer thinks might know the system.

Every team with a response obligation maintains an on-call rotation, managed by that team's rota manager. The rotation defines who is available, when, and at what alarm level. When MajorOps dispatches a team, it is activating that structure — not disrupting someone's evening at random.

The on-call engineer is, in the operational sense, at work. They are the team's designated first responder for that shift. Paging them is not an imposition. It is the system working exactly as designed.

**Named escalation — contacting a specific individual outside the on-call rotation — requires explicit authorization from the MIM or a leader on scene.** This is a rare, documented, conscious decision. It goes in the incident record. It is not the default. It is not what the automated guardrails do.

The VP example: if a leader joins the bridge and says "we need Rajesh on this specifically" — that is a leadership-authorized named escalation. The MIM logs it, contacts Rajesh, and notes the reason. That is the correct process for an out-of-rotation page, and it requires a name and a reason, not just urgency.

---

## The Guardian Doctrine

When a major incident is declared, the customers are already affected. The service is already broken.

The MIM is not protecting the on-call calendar. The MIM is protecting customers from a longer outage.

That is the only frame that matters — and it is what makes the on-call structure worth having. Teams that build and maintain good rotations are the teams that can respond fast when it counts. The on-call commitment is how they protect both their customers and their off-shift colleagues. It distributes the burden so no single person carries it alone.

> **We are the guardian of service. The on-call rotation is the team's commitment to that same mission.**

The moment a team hesitates to activate the next group because they're not sure it's "bad enough yet," they have introduced delay at exactly the wrong moment. MajorOps makes the decision objective: the phase state, the guardrail threshold, the alarm level — not gut feel, not social pressure.

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
| "Let's try a few more things before we call the next team." | "Activate the on-call. De-escalate later if we don't need them." |

The old model treats escalation as a social event — someone asking a favor, someone being bothered. The new model treats it as a structural act: activating a resource that was specifically prepared, staffed, and committed for exactly this situation.

No favor asked. No apology owed. The on-call team is on duty.

**What about persistent response time problems?** That is what the KPIs are for. If a team's `team-page-to-bridge` metric shows consistent delays, that surfaces in the data — and the conversation happens between the rota manager and the team lead, not in the middle of a major incident. Metrics drive structural reform. The MIM at 2am is not the accountability mechanism. The platform is.

---

## Operationalizing It

For organizations adopting MajorOps, the escalation doctrine requires three things to take hold:

**1. Say it out loud.** The MIM should open every Box-2 or Box-3 bridge by stating: "We will escalate early and de-escalate if we don't need the resource. If you think we need another team, say so." That sentence alone changes the call.

**2. Never criticize an unnecessary escalation.** If someone paged a team that turned out not to be needed, the correct response is: "Good call. Better to have them and not need them." If that page is ever met with frustration, the doctrine dies.

**3. Let the platform reinforce it.** The guardrail pages remove the decision from the human. When the platform pages automatically, it signals that escalation is structural, not personal. Nobody is bothering anyone. The system is doing its job.

---

*See also: [Alarm Levels](../ALARM-LEVELS.md) for escalation thresholds · [ICS-IT Structure](ICS-IT-STRUCTURE.md) for command roles · [Bridge Control](bridge-control.md) for call management*
