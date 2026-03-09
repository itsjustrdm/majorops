---
title: Signal Flow
draft: true
---

# Signal Flow — Standardized Inbound → Outbound

> MajorOps as middleware: normalize noisy signals, run the runcard engine, and emit clean escalations with minimal friction.

```mermaid
flowchart TD
  subgraph INBOUND ["Inbound Signals"]
    A1["Monitoring alerts (PagerDuty, Datadog)"]
    A2["Human reports (Slack, voice, form)"]
    A3["Vendor webhooks"]
    A4["API / CLI (mim new)"]
  end

  subgraph MIDDLEWARE ["Middleware"]
    B["Intake & normalize"]
    C["Deduplicate & correlate"]
    D["Classify severity -> alarm level"]
    E["Runcard engine (assign roles, cadence, open bridge)"]
    F["Create / update incident (D1 + realtime state)"]
  end

  subgraph OUTBOUND ["Outbound & Views"]
    G["Fireground UI (MIM / Ops)"]
    H["Voice bridge link"]
    I["Comms fan-out (Slack/Teams, Email, Status page)"]
    J["Stakeholder / Exec dashboards"]
    K["Automation hooks (KPIs, webhooks)"]
  end

  A1 --> B
  A2 --> B
  A3 --> B
  A4 --> B
  B --> C --> D --> E --> F
  F --> G
  F --> H
  F --> I
  F --> J
  F --> K

  %% Low-friction lanes
  A2 -. minimal prompts .-> H
  A4 -. API speed path .-> E
```

**Low-friction lane:** DevOps can hit the API/CLI or give a minimal human report and jump straight to bridge + standardized comms; the runcard engine fills roles/cadence at API speed.

**Standardization:** The runcard and KPI layers ensure every outbound signal is consistent, auditable, and reusable across scorecards.
