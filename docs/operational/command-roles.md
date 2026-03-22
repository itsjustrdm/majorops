---
title: Command Roles
tier:
  - docs      # Full role guide on about.majorops.io
  - tooltip   # Each role's ## Summary → hover definition in the app on role badges
  - app-data  # Structured role data → sourced into apps/web/src/data/roles.ts
              # When you change a role definition here, update roles.ts to match.
              # Future: a build script will auto-generate roles.ts from this file.

tooltip:
  # Each role uses its own ## Summary as the tooltip text.
  # Trigger terms are the role name and its common aliases.
  roles:
    mim:
      section: "MIM — Major Incident Manager"
      trigger: [MIM, Major Incident Manager, incident commander, IC]
    sre:
      section: "SRE — Site Reliability Engineer"
      trigger: [SRE, Site Reliability Engineer, technical recovery lead]
    leader:
      section: "Leader — Recovery Director"
      trigger: [Leader, Recovery Director, incident lead, LDR]
    service_manager:
      section: "Service Manager"
      trigger: [Service Manager, SVC, service mgr]
    customer_ops:
      section: "Customer Operations"
      trigger: [Customer Ops, Customer Operations, OPS, custops]

app-data:
  source: apps/web/src/data/roles.ts
  # Keys in roles.ts that map to this file:
  #   ROLE_DEFINITIONS — one entry per role
  #   Each entry: label, fullName, abbr, color, tooltip, responsibilities[], notYourJob[]

tags: [command, roles, bridge, ICS]
draft: false
---

# Command Roles

The MajorOps command team is modeled on the Incident Command System — adapted for IT operations. Five roles. Each with a defined lane. Nobody crosses lanes during an active incident.

> The bridge has one commander. Everyone else is a resource.

---

## MIM — Major Incident Manager

### Summary

The MIM is the **911 dispatcher, not the paramedic**. They hold command authority on the bridge, coordinate all responders, and make every escalation and phase decision. They do not touch keyboards, write queries, or troubleshoot systems. Their job is to run the call — not fix the problem.

### Responsibilities

- Open the bridge and formally declare the incident
- Assign and manage recovery tracks with named owners
- Set and enforce timeboxes for every diagnostic and remediation action
- Make all escalation decisions — who gets paged, when, and at what alarm level
- Post all stakeholder milestones and manage the next-update cadence
- Advance phases with deliberate judgment
- Close the incident and schedule the After Action

### What They Don't Do

- Run queries, push changes, or access systems directly
- Let the bridge run itself while they "help" on a recovery track
- Speculate on root cause in public milestones
- Wait for consensus before paging — they page, then explain

### Certification

MIM certification is required before running an active incident. Candidates complete the MajorOps accreditation track, shadow certified MIMs on real incidents, and pass a practical assessment. Peer Reviews feed their rolling Command Score.

---

## SRE — Site Reliability Engineer

### Summary

The SRE is the **technical recovery lead** on the bridge. They own the recovery tracks, manage the SMEs doing hands-on work, and are the primary technical voice the MIM listens to. They translate diagnostic findings into actionable hypotheses and recovery options.

### Responsibilities

- Own all active recovery tracks
- Direct SMEs — assign tasks, set timeboxes, collect findings
- Report track status to the MIM at regular intervals (not when asked)
- Raise and update hypotheses as evidence develops
- Recommend mitigation options — the MIM decides which to execute
- Validate recovery across all affected systems before signaling resolution

### What They Don't Do

- Make escalation decisions — that's the MIM
- Post stakeholder updates — that's the MIM
- Self-assign to hands-on work while owning the recovery tracks
- Declare resolution unilaterally

### Relationship to the MIM

The SRE and MIM operate as a command pair. The SRE owns the technical domain; the MIM owns the bridge and communications. Neither crosses into the other's lane. If they disagree on direction, the MIM's call stands on the bridge — but the SRE's technical judgment governs what goes into the recovery tracks.

---

## Leader — Recovery Director

### Summary

The **Recovery Director** (Leader) is senior leadership's representative on the bridge. They hold escalation authority that exceeds what the MIM and SRE can approve on their own — vendor escalations, executive communications, resource unlocks, emergency change approval. They observe and act when needed; they don't run the bridge.

### Responsibilities

- Authorize actions that require leadership sign-off (emergency changes, vendor escalations above SLA)
- Own executive and board-level communications when the incident warrants it
- Hold the Major Technical Meeting (MTM) for extended Critical incidents
- Make organizational decisions that fall outside the MIM's authority
- Protect the MIM's ability to run the bridge without organizational interference

### What They Don't Do

- Chair the bridge — that's the MIM
- Override the MIM's escalation or phase decisions in real time
- Require updates on demand — they get the same milestones everyone else does
- Add people to the bridge without coordinating with the MIM

---

## Service Manager

### Summary

The **Service Manager** owns the business relationship with affected services and vendors. They translate the technical incident into business impact language, manage vendor escalations, and ensure the right service owners are engaged. They are the MIM's liaison to the business and to external parties.

### Responsibilities

- Translate incident impact into business terms for executive and customer audiences
- Own vendor escalation — know the SLA, make the call, track the RCA commitment
- Engage service owners who aren't already on the bridge
- Confirm external impact status (Yes / No / Likely / Unknown) and keep it current
- Own the vendor section of the After Action

### What They Don't Do

- Speak on the bridge unless the MIM addresses them
- Independently communicate with customers or executives — that goes through the MIM
- Make recovery decisions

### Vendor Accountability

If a vendor is involved, the Service Manager is accountable for the vendor RCA. "We're waiting on them" is not a closed item. They set a date, track it, and escalate if it passes. This is non-negotiable.

---

## Customer Operations

### Summary

**Customer Ops** owns the customer-facing impact layer — support queues, known error articles, customer communications, and SLA exposure tracking. They are the bridge between the incident and the customers experiencing it.

### Responsibilities

- Monitor and report support volume related to the incident
- Publish and maintain the known error article for customer-facing issues
- Track SLA exposure and flag when thresholds are approaching
- Advise the MIM on customer impact severity and communication timing
- Coordinate with the Service Manager on external comms

### What They Don't Do

- Send customer communications without the MIM's approval of content
- Escalate independently to vendors or service owners
- Decide when the incident is resolved from the customer perspective — that's the MIM

---

## Role Absence Protocol

Not every incident will have all five roles filled immediately. When a role is unfilled:

| Unfilled role | Who covers |
|---|---|
| SRE | MIM assigns the most senior technical responder as acting SRE |
| Leader | MIM escalates to their direct manager at Phase 3 or above for Critical incidents |
| Service Manager | MIM covers vendor and business liaison duties until filled |
| Customer Ops | Service Manager covers customer impact tracking until filled |

**The MIM role cannot be uncovered.** If the active MIM must leave the bridge, they formally hand off command to a certified peer MIM before stepping away. An uncovered bridge is the only true command failure.

---

## Role Color Reference

Used in the app for presence indicators and role badges.

| Role | Abbreviation | Display Color |
|---|---|---|
| MIM | MIM | Red — command |
| SRE | SRE | Amber — technical |
| Leader | LDR | Orange — authority |
| Service Manager | SVC | Blue — business |
| Customer Operations | OPS | Blue — customer |
| Validator | VAL | Green — confirmed recovery |
| Responder | RSP | Dim — working |
| Observer | OBS | Dim — watching |

---

*This file is the source of truth for command role definitions. It feeds three surfaces: the docs site (full article), in-app tooltips on role badges (Summary sections), and the structured role data in `apps/web/src/data/roles.ts` (app-data tier). Update this file first. Then sync `roles.ts`.*
