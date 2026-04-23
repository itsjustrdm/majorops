---
title: Bridge Control
description: Information Authority, air time discipline, the Open Air Rule, and how the MIM runs a major incident bridge call.
---

**The bridge is not a meeting. It is a mission.**

---

## What the Bridge Is

A major incident bridge is an active command operation. Customer impact is accumulating in real time. Every minute of disorganized communication is a minute of extended outage.

The bridge is not a collaboration space. It is not a status meeting. It is not a place to think out loud, catch up socially, or explore possibilities without structure.

It is a place where information moves in one direction at a time, under the control of one person, toward one goal: ending customer impact.

Every word spoken on the bridge has a cost. That cost is measured in the time it takes to say it, and the time it takes everyone else to process it. Wasted words are wasted minutes. Wasted minutes are customer impact.

---

## Information Authority

At any moment on the bridge, exactly one person holds **Information Authority** — the right to speak, and the responsibility to be the source of truth for their domain.

Information Authority is not a fixed role. It transfers. Understanding when and how it transfers is the single most important communication skill on a major incident call.

### The MIM Holds Authority by Default

The MIM opens the bridge. The MIM controls the cadence. The MIM decides who speaks and when. All coordination flows through the MIM.

When the MIM speaks, it is to:
- Assign work to a recovery track
- Request a status update from a team
- Issue a phase advance
- Broadcast a SitRep to the bridge
- Park an open question with a commitment to return

The MIM does not editorialize. Does not speculate. Does not fill silence with uncertainty. If the MIM does not know something, they say: *"Unknown. [Name] is working on it. We'll have an update in [timeframe]."*

### Authority Transfers to the SME On Scene

When a subject matter expert goes hands-on-keyboard — when they are actively investigating, running commands, applying a fix — **they become the information authority for that recovery track.**

This mirrors emergency services exactly. When an officer is in pursuit behind a vehicle, they become the information authority. The dispatcher goes quiet. The officer calls out location, direction, speed, suspect description. Everyone else holds their transmission and listens.

On the bridge: when the DB engineer is in the database actively investigating, they are the only source of truth for what is happening in that recovery track. If they go silent for 20 minutes, the MIM cannot update stakeholders, cannot make resourcing decisions, cannot tell leadership why this is taking as long as it is.

Silence on a recovery track extends the outage.

### The Transfer Protocol

When the MIM activates a SME on a recovery track:

> *"[Name] — you have the floor. Give us conditions in [timeframe]."*

The SME now holds Information Authority for that track. They speak. Everyone else listens and holds.

When the SME has a result:

> *"[Name] — what do you have?"*

The SME reports back in CAN format — Conditions, Actions, Needs. That report transfers authority back to the MIM.

> *"Copy that. [Summary of what was just said]. [MIM's next directive]."*

The MIM acknowledges, confirms understanding, and issues the next instruction. The loop is closed.

---

## Air Time Discipline

Air time is the shared resource of the bridge. Every person on the call is drawing from it when they speak. The MIM's job is to ensure it is spent on information that moves the incident forward.

### What belongs on the bridge:

- Conditions — factual observations about system state
- Actions — what is being done, by whom, with what timebox
- Needs — blockers, escalations, resource requests
- Phase advances and milestone announcements
- Direct questions with a specific recipient and an expected timeframe for an answer

### What does not belong on the bridge:

- Speculation presented as fact
- Thinking out loud without a point
- Social check-ins
- Explanations of how something works rather than what its current state is
- Rehashing information already in the timeline
- Apologies and extended acknowledgments

The MIM is responsible for holding this discipline — not by being rude, but by redirecting clearly:

> *"Let's keep conditions to what we know factually. [Name], what are you seeing?"*

---

## The Open Air Rule

If a question is asked on the bridge, it demands an answer.

Air time was spent to ask it. That means it was judged to be worth the cost. If it was worth asking, it is worth answering. The question does not disappear because the call moved on.

**Open questions are tracked.** If the answer is not immediately available, the MIM parks it explicitly:

> *"We need the uptime figure. [Name], get that for us. We'll come back in 10 minutes."*

Ten minutes later:

> *"[Name] — uptime figure?"*

If the answer still is not available, the MIM escalates the ask or removes the question from the active agenda with an explicit decision:

> *"We're moving forward without uptime data. We'll get it post-incident."*

That is a logged decision. It is in the timeline. It is not forgotten — it is deferred with accountability.

**What is never acceptable:** asking a question on the bridge and then abandoning it 40 minutes later as if it was never asked. If it earned the air time, it earns a resolution.

---

## Effective SME Communication

The MIM depends entirely on the quality of information that SMEs transmit. A technically brilliant engineer who cannot communicate clearly under pressure does not improve the incident — they extend it.

### What effective SME communication sounds like:

> *"DB team — conditions: connection pool at 98% capacity, 340 connections waiting, rejection errors starting at 14:34. Actions: we've increased pool max from 100 to 200, restart of connection broker in progress. Needs: need the app team to confirm they've reduced connection requests from their side."*

That is a CAN report. It took 20 seconds. The MIM now knows exactly what is happening, what is being done, and what is needed next.

### What ineffective SME communication sounds like:

> *"Yeah so we're looking at the database and there's some stuff going on with the connections... it's kind of complicated but basically the pool is having issues... we might try restarting some things..."*

The MIM has no actionable information. Cannot update stakeholders. Cannot identify the blocker. Cannot tell leadership anything specific. The outage continues while everyone waits for clarity that is not coming.

---

## Call Discipline in Practice

### Opening the bridge

The MIM opens every bridge with a standard declaration:

> *"This is [Name], MIM, assuming command of INC-[ID]. We have [severity] impacting [service/region] since [time]. Current phase: [phase]. We are gathering the command team now. This bridge is operational — no background conversations, no side channels during active updates. [Tech Lead], you have the floor for initial conditions."*

This sets the frame immediately. Mission. Impact. Roles. Discipline.

### Managing noise

When non-essential conversation starts:

> *"Let's hold side conversations. [Name], what do you have?"*

No apology. No extended explanation. Redirect and move.

### Cadence commitment

The MIM sets a cadence at the start of the call and keeps it:

> *"We'll do a bridge-wide CAN update every 15 minutes. Recovery tracks report to me, I'll synthesize and broadcast. First update at [time]."*

When the cadence slips, the MIM calls it:

> *"We're past our update window. [Name] — conditions?"*

---

## Leader Presence on the Bridge

When an executive, VP, or Director joins the bridge, it does not change the command structure. The MIM does not relinquish the floor. The bridge does not re-introduce itself. The call does not slow down.

What changes is what is *possible*.

In emergency services, when a battalion chief drives up to a working structure fire, the incident commander does not hand over command. The IC continues running the operation. But every unit on scene now knows: if this gets worse, the escalation decision is immediate. The chief is already here.

That is what a leader joining the bridge represents. Not a takeover. Not a review. An escalation resource — available if needed, silent if not.

**A common failure mode:** the call slows down because someone noticed a VP joined. Engineers become cautious. Language becomes formal. Updates become performances.

This is exactly wrong. A VP joining the bridge is not a performance cue. The MIM continues. The cadence continues. If a command decision is needed:

> *"We have [Name] on the bridge. [Name] — we've been in Isolation for 35 minutes on the DB path. We have two active hypotheses, neither confirmed. Recommend escalating to a Box-3 resource call or authorizing an emergency failover. Your call."*

One directed question. One decision request. Return to recovery.

---

## The Five Rules

1. **One voice at a time.** The MIM controls the floor. Crosstalk is the enemy of clarity under pressure.

2. **CAN format, always.** Conditions first. Then actions. Then needs. In that order, every time.

3. **No open questions abandoned.** Every question asked on the bridge gets an answer or an explicit deferral with accountability.

4. **Information Authority is acknowledged.** When a SME has the floor, they know they have it. When the MIM reclaims it, that is explicit too.

5. **The bridge ends when the MIM says it ends.** Not when the engineer thinks things look okay. Not when the loudest voice says "we're good." The MIM declares resolution, releases the command team, and closes the bridge.

---

*See also: [Command Roles](/command-model/command-roles/) · [Incident Lifecycle](/command-model/incident-lifecycle/) · [Escalation Doctrine](/bridge/escalation/) · [After Action](/governance/after-action/)*
