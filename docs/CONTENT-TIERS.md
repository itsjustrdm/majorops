---
draft: false
---

# Content Tiers

MajorOps documentation is a single source of truth. Every `.md` file declares which surfaces it belongs to using frontmatter. The same file can serve multiple tiers simultaneously — different sections of the file render in different places.

---

## The Four Tiers

| Tier | Value | Where it renders | Audience |
|---|---|---|---|
| **Docs** | `docs` | `/docs` inside the MajorOps app | Practitioners learning the framework, onboarding, training |
| **Tooltip** | `tooltip` | Hover popover inside the app, next to terms | MIMs working an active incident |
| **Run Card** | `runcard` | Slide-in drawer inside the incident view | MIMs working an active incident |
| **App Data** | `app-data` | Sourced into a `.ts` file in the React app | The app itself — labels, UI copy, validation, role definitions |

The `app-data` tier is the most direct integration. The markdown is the canonical definition. The `.ts` file in the React codebase is a derived artifact — not independent. Change the markdown, then sync the TypeScript. Future: a build script generates the TypeScript automatically from the markdown.

**Example:** `docs/operational/command-roles.md` → `apps/web/src/data/roles.ts` → `RoleTag` component → tooltip shown on every role badge in the app. One file, four surfaces.

---

## Frontmatter Schema

```yaml
---
title: Human-readable title
tier:
  - docs        # Publish to about.majorops.io — the whole file is rendered
  - tooltip     # Extract the ## Summary section as a hover definition in the app
  - runcard     # Extract the ## Response section as an in-app run card

# Tooltip config — only needed if tier includes "tooltip"
tooltip:
  section: Summary                          # Which ## heading to extract
  trigger: [term one, term two, alias]      # Terms in the UI that get this tooltip

# Run card config — only needed if tier includes "runcard"
runcard:
  section: Response                         # Which ## heading to extract
  affects: [Database SRE, postgresql]       # Match against incident affectedSystems
  phase_trigger: [2, 3, 5]                  # Suggest at these phases in Focus view
  severity: [Critical, High]               # Only surface for these severities

# Standard metadata
tags: [database, infrastructure]
---
```

---

## Section Naming Convention

Within a multi-tier document, use these **reserved heading names** so the app knows what to extract:

| Heading | Used by | Purpose |
|---|---|---|
| `## Summary` | `tooltip` | 2–4 sentence definition. Should stand alone out of context. |
| `## Response` | `runcard` | Operational checklist for active incident response. Short, imperative, scannable. |
| `## Reference` | `docs` | Full practitioner detail. Can be long. Not shown in-app. |
| `## Prevention` | `docs` | Post-incident and architectural guidance. Docs-only. |
| `## Anti-Patterns` | `docs` | What not to do. Docs-only. |

Everything under headings not in this list is treated as `docs`-only by default.

---

## Single-Tier Files

Not everything needs to be in all three tiers. Most governance docs are `docs`-only:

```yaml
---
title: After Action
tier:
  - docs
draft: false
---
```

A glossary term might be `docs` + `tooltip` but never a `runcard`:

```yaml
---
title: CAN Communication Model
tier:
  - docs
  - tooltip
tooltip:
  section: Summary
  trigger: [CAN, CAN model, air time]
---
```

---

## How the App Uses This

The app does not read `.md` files directly at runtime. Instead:

1. A build-time script (future) parses all `.md` files with `tier: tooltip` and outputs a `tooltips.json` — a lookup map of `trigger term → tooltip text`.
2. Similarly, `runcard` files produce a `runcards.json` — keyed by `affects` system tags and phase numbers.
3. The React app imports these JSON files and uses them to:
   - Wrap recognized terms in `<GlossaryTerm>` components that show popovers on hover.
   - Surface relevant run cards in the incident view drawer when `affectedSystems` match.

For now, the JSON files can be maintained manually as the first run cards are built. The build-time parser comes later.

---

## Example: One File, All Three Tiers

See [`docs/operational/db-connection-pool-exhaustion.md`](operational/db-connection-pool-exhaustion.md) for a complete worked example of a single file that renders as a full docs article, an in-app tooltip, and a run card — with different sections used by each surface.

---

## File Locations

| Content type | Location |
|---|---|
| Pure docs (governance, philosophy) | `docs/governance/`, `docs/philosophy/` |
| Cross-tier operational references | `docs/operational/` |
| Run-card-only files | `docs/runcards/` |
| Glossary (docs + tooltip) | `docs/GLOSSARY.md` |
