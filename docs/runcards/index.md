---
draft: true
---

# Run Cards

Run cards are pre-defined response references organized in three tiers — Agency, Generic App, and Specific App — mirroring how a 911 center dispatches to multiple agencies, each with their own response plans.

See [Run Card System](../RUNCARD-SYSTEM.md) for the full architecture and ownership model.

---

## Browse All Run Cards

The **Run Card Browser** is an interactive three-column dispatch console. Select an agency to see its generic app cards, then drill into specific app cards where team-authored cards exist.

[Open Run Card Browser :material-open-in-new:](runcard-browser.html){ .md-button .md-button--primary target="_blank" }

---

## Examples by Tier

### Tier 1 — Agency

Agency cards describe the division, its systems, contact chain, and blackout windows. Owned by MIM.

[Accounting & Finance :material-open-in-new:](runcard-agency-accounting.html){ target="_blank" }

---

### Tier 2 — Generic App

Generic app cards provide the response play for a category of system before the specific product is identified. Owned by MIM at launch, transitions to division over time.

[HR Systems :material-open-in-new:](runcard-generic-hr-systems.html){ target="_blank" }

---

### Tier 3 — Specific App

Specific app cards are team-authored and team-owned. Created through the self-service portal (Phase 5+).

[Production Database Unreachable — BOX 3 · P1 :material-open-in-new:](runcard-db-unreachable.html){ target="_blank" }

---

## How Run Cards Relate to Runbooks

A run card is not a runbook. The run card is the command layer — who is on the bridge, what MIM needs to establish, what the release criteria are. The runbook is the diagnostic layer — owned by engineering, lives in the code repo, referenced from the run card's Needs section.

| | Run Card | Runbook |
|---|---|---|
| **Audience** | MIM + command structure | Technical SME |
| **Moment** | First 30 minutes | After isolation |
| **Owner** | MIM (Tier 1/2), Team (Tier 3) | Engineering team |
| **Update cadence** | Post-major, max 1/week | As-needed by team |
