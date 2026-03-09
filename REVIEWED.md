# REVIEWED.md

> This document is the index and audit trail for the vault consolidation performed on 2026-03-03.
> It records every source reviewed, what was consolidated into the main MajorOps folder, what was not, and why.

---

## Consolidation Summary

**Reviewer:** Claude (Cowork)
**Date:** 2026-03-03
**Source vaults reviewed:** 7
**Source files reviewed:** ~120+ markdown files
**Net new files created in main folder:** 6
**Existing files updated:** 0 (all existing main docs were left intact — they are authoritative)

---

## Sources Reviewed

### 1. `/older obsidian vaults to review/MajorOps/` (Feb 2025)
**Type:** Very early exploration vault
**Content:** One meaningful file (`README.md`). Describes MajorOps as an early research project exploring how emergency-service patterns apply to IT incidents. Emphasizes operating behavior over tools. Intentionally incomplete.
**Value:** Low — conceptually subsumed by all later work.
**Consolidated:** No. Philosophy is baked into current README and PHILOSOPHY.md. Nothing unique here.

---

### 2. `/older obsidian vaults to review/MajorOps.md` (root stub)
**Type:** One-line note
**Content:** Single TODO: "Define recovery personas. IE) Application End User, etc."
**Value:** Marginal — this persona need is captured in current work.
**Consolidated:** No.

---

### 3. `/older obsidian vaults to review/MajroOps.md` (typo vault)
**Type:** Empty file
**Content:** Empty.
**Consolidated:** No.

---

### 4. `/older obsidian vaults to review/majorops-old/` (Aug–Sep 2025)
**Type:** Working codebase vault with multi-platform architecture
**Tech stack:** Jekyll site + Cloudflare Workers API + Node CLI + Docker Compose
**Domain architecture:** majorops.io / api.mim.run / new.mim.run / status.mim.run / bridge.mim.run / docs.mim.run

**Files reviewed:**
- `README.md` — "When systems go down, we stand up" confirmed as canonical tagline. Multi-domain architecture.
- `BRAND.md` — Earlier brand thinking. Peacetime/wartime states present but less developed than current BRAND.md.
- `ROADMAP-V0.5.md` — Earlier roadmap. Jekyll-based structure. Superseded.
- `ROADMAP-SCHEMA.md` — Jekyll collection frontmatter schema for roadmap items. Interesting but architecture-specific.
- `ICS-IT-STRUCTURE.md` — **High value.** Full IT-ICS command structure adapted from fire service ICS. Mermaid diagrams for SEV-1/2/3 structures. Detailed role descriptions for IC, PIO, SO, LO, Ops/Planning/Logistics/Finance chiefs.
- `AS400-PATTERN.md` — Documents the AS/400 terminal visual inspiration for the brand. Interesting historical context.
- `DESIGN-MULTI-PLATFORM.md` — Design thinking for multi-platform deployment. Superseded by current all-Cloudflare architecture.
- `DESIGN-RFC-GOVERNANCE.md` — RFC-style governance concepts. IETF-inspired working group model.
- `REFACTOR.md` — Technical refactoring notes. No longer relevant.
- `DEPLOY.md` / `DEPLOY-DOKPLOY.md` — Docker/Dokploy deployment. Superseded.

**Consolidated:**
- ✅ `ICS-IT-STRUCTURE.md` → `docs/philosophy/ICS-IT-STRUCTURE.md` (adapted for current MajorOps context, removed Jekyll/Docker references)
- ✅ Domain architecture added to context note in REVIEWED.md. Not added to README (current README is authoritative and cleaner).
- ❌ All deployment docs — superseded by current Cloudflare approach.
- ❌ Old BRAND.md — superseded by current BRAND.md.
- ❌ Jekyll-specific schemas — not applicable to current stack.

---

### 5. `/older obsidian vaults to review/IncidentX/` (Aug–Nov 2025)
**Type:** Large multi-sub-vault. Two sections: `core-ops-docs/` (doctrine/governance) and `esm/` (product design).
**Name:** IncidentX / CoreOps / ESM — all names explored for the same idea as MajorOps.

**Sub-vault: `core-ops-docs/`**

Files reviewed and their status:

| File | Assessed Value | Action |
|---|---|---|
| `00-intro/north-star.md` | High — v1.8, detailed doctrine statement | ✅ Synthesized into PHILOSOPHY.md |
| `00-intro/project-vision.md` | Medium — overlaps with README | ❌ Superseded |
| `00-intro/features.md` | Medium | ❌ Superseded by current README |
| `00-intro/what-is-coreops.md` | Medium | ❌ Superseded |
| `00-intro/marketing-vision.md` | Low | ❌ Not consolidated |
| `00-intro/data.md` | Low | ❌ Not consolidated |
| `00-intro/service-offerings.md` | Medium | ❌ Not consolidated |
| `00-intro/roles-and-sites.md` | Medium | ❌ Superseded by personas work |
| `01-response-plans/alarm-levels.md` | **High** — Box 0–3 escalation system | ✅ → `docs/ALARM-LEVELS.md` |
| `01-response-plans/conditions-and-confidence.md` | High — CAN methodology | ✅ Incorporated into PHILOSOPHY.md |
| `01-response-plans/escalation-flow.md` | Medium | ❌ Partially in alarm levels |
| `01-response-plans/callforhelp.md` | Medium | ❌ Partially in current README |
| `01-response-plans/mutual-aid.md` | Medium | ❌ Not yet consolidated — future governance doc |
| `02-certification/*` | Medium | ❌ Not consolidated — future Phase 8 work |
| `03-training/*` | Medium | ❌ Not consolidated — future Phase 8 work |
| `04-governance/charter.md` | Medium | ❌ Not consolidated |
| `04-governance/raci.md` | High | ❌ Not consolidated — needs full working group context |
| `04-governance/response-reputation-score.md` | **High** — NPS-style gamification | ✅ → `docs/governance/RESPONSE-REPUTATION.md` |
| `04-governance/gamified-sre-pathing.md` | High — SRE Champion Badge | ✅ Incorporated into RESPONSE-REPUTATION.md |
| `04-governance/gamified-feedback-loop.md` | High | ✅ Incorporated into RESPONSE-REPUTATION.md |
| `04-governance/gamified-recognition.md` | Medium | ✅ Incorporated into RESPONSE-REPUTATION.md |
| `04-governance/gamified-elite-oncall.md` | Medium | ✅ Incorporated into RESPONSE-REPUTATION.md |
| `04-governance/binary-scorecard.md` | Medium | ❌ Not consolidated — needs RACI context |
| `04-governance/feedback-loops.md` | Medium | ❌ Not consolidated |
| `04-governance/delegation.md` | Low | ❌ Not consolidated |
| `04-governance/incident-automation.md` | Medium | ❌ Future feature |
| `04-governance/documentation-standards.md` | Medium | ❌ Future |
| `05-reference/glossary.md` | **High** — shared vocabulary | ✅ → `docs/GLOSSARY.md` |
| `05-reference/pir.md` | **High** — PIR current state + problems | ✅ → `docs/governance/PIR.md` |
| `05-reference/peacetime-wartime.md` | Low — stub, mostly TODOs | ❌ Concept is in BRAND.md already |
| `05-reference/ietf.md` | Medium | ❌ Background reference only |
| `05-reference/ntsb.md` | Medium | ❌ Background reference only |
| `05-reference/ssot.md` | Medium | ❌ Concept in README |
| `05-reference/scorecards.md` | Medium | ❌ Not consolidated |
| `05-reference/sme-role-mapping.md` | Medium | ❌ Not consolidated |
| `06-accreditation/*` | Low — incomplete stubs | ❌ Not consolidated |

**Sub-vault: `esm/docs/`**

| File/Folder | Assessed Value | Action |
|---|---|---|
| `data-models/incident.md` | Medium | ❌ Superseded by current DATA_MODEL.md |
| `data-models/mtm.md` | Medium | ❌ Not consolidated |
| `data-models/task.md` | Medium | ❌ Not consolidated |
| `data-models/user.md` | Medium | ❌ Superseded |
| `activities/MTM.md` | **High** — Multi-Tenant Meeting agenda and flow | ✅ Referenced in PIR.md, full detail preserved in archive |
| `activities/shift-handover.md` | High | ❌ Not consolidated — future feature |
| `activities/retrospective-review.md` | Medium | ❌ Not consolidated |
| `persona/operator.md` | Medium | ❌ Stub |
| `persona/rsm.md` | Medium | ❌ Not consolidated |
| `persona/gsoc.md` | Medium | ❌ Not consolidated |
| `persona/comms-operator.md` | Medium | ❌ Not consolidated |
| `persona/escalation-operator.md` | Medium | ❌ Not consolidated |
| `persona/toc.md` | Medium | ❌ Not consolidated |
| `persona/client-comms.md` | Medium | ❌ Not consolidated |
| `persona/validator.md` | Medium | ❌ Not consolidated |
| `problems/telephone-game.md` | High | ❌ Concept baked into PHILOSOPHY.md |
| `problems/customer-alerting.md` | High | ❌ Concept in roadmap |
| `problems/shift-handover-manual-tracking.md` | High | ❌ Future feature |
| `features/task-management.md` | Medium | ❌ Not consolidated |
| `features/handover-dashboards.md` | Medium | ❌ Not consolidated |
| `features/recovery-paths.md` | Medium | ❌ Superseded by current implementation |

**Sub-vault: `esm/` (product/brand notes)**

- `brand.md` — Brand notes, superseded by current BRAND.md.
- `Product-Pitch.md` — ESM product pitch. Valuable conceptual framing, but enterprise-sales angle not yet needed.

---

### 6. `/older obsidian vaults to review/incidentx-spec/` (2025)
**Type:** Spec and constitution documents for IncidentX
**Content:** Library-first constitution, CLI spec, spec/plan/tasks templates, AI prompt engineering for spec generation.
**Value:** Architecture-specific to IncidentX (library-first, test-first CLI). Not applicable to current MajorOps approach.
**Consolidated:** No.

---

### 7. `/older obsidian vaults to review/mim/` (2025)
**Type:** MIM concepts and frameworks vault
**Content:**
- Fire service parallels (ICS → SRE)
- EOCC/SMO (Enterprise Operations Command Center)
- Impact milestones
- Command voice
- MkDocs integration notes

**Value:** Good conceptual content. Fire service parallels and command voice are particularly strong. EOCC concept is a future organizational idea.
**Consolidated:** Fire service parallels synthesized into PHILOSOPHY.md. Command voice concepts incorporated.
**Remaining:** EOCC/SMO is a future organizational concept — not yet consolidated.

---

### 8. `/older obsidian vaults to review/mim-run/` (2025)
**Type:** Earlier MajorOps dashboard project
**Content:** Project plan (Foundation → Backend → Frontend → Polish phases), TODO list, README with dev setup.
**Value:** Architecture-level thinking, mostly superseded. TODO list has some ideas that overlap with current roadmap.
**Consolidated:** No. Roadmap items reviewed against current ROADMAP.md — no gaps found that weren't already captured.

---

### 9. `/older obsidian vaults to review/backup-informkit-first/` (2025)
**Type:** INFORM platform / operational playbook system
**Content:** PPP Framework, user stories for track visualization, CLI logging, frontmatter rendering, build process design.
**Value:** This was a separate product idea (INFORM) — an operational playbook tool that predates MajorOps. Some user stories are directionally useful for future CLI features.
**Consolidated:** No. The architecture is fundamentally different (Markdown/Git-native vs. Cloudflare D1/REST). Concepts noted for future CLI considerations.

---

### 10. `/older obsidian vaults to review/mim-wiki/`
**Type:** Wiki stub
**Content:** Empty.
**Consolidated:** No.

---

## What Was NOT Consolidated (and Why)

The following categories of content were reviewed but not brought into the main folder:

**Architecture from previous stacks** (Jekyll, Docker, MkDocs, Node CLI, Dokploy) — The current all-Cloudflare architecture is the correct direction and is already documented. Importing old deployment docs would create confusion.

**Incomplete stubs** — Many files across all vaults were skeleton documents with 1–10 lines, TODOs, or placeholder headings. These do not add value until developed.

**Certification and training details** — The IncidentX certification framework (06-accreditation, 02-certification) is relevant to Phase 8 of the roadmap but is not yet developed enough to include. Preserved in archive.

**Persona deep-dives** — Persona files in ESM were mostly incomplete. The current README and ICS-IT-STRUCTURE.md provide sufficient role context.

**INFORM/INFORMKIT** — A separate product concept with a different architecture. Kept in archive for potential future reference.

**Governance structures with missing context** — RACI matrix, working group charter, binary scorecard, and accreditation criteria are valuable future documents but cannot be responsibly consolidated without the working group context they depend on.

---

## Files Created in Main Folder

| File | Source Vaults | Notes |
|---|---|---|
| `docs/philosophy/PHILOSOPHY.md` | IncidentX/north-star, mim/, majorops-old/README | Core doctrine synthesis |
| `docs/philosophy/ICS-IT-STRUCTURE.md` | majorops-old/ICS-IT-STRUCTURE.md | Adapted ICS command structure, updated for current context |
| `docs/GLOSSARY.md` | IncidentX/glossary, IncidentX/esm/docs | Shared vocabulary |
| `docs/ALARM-LEVELS.md` | IncidentX/alarm-levels | Box 0–3 alarm system |
| `docs/governance/PIR.md` | IncidentX/pir, IncidentX/esm/docs/activities/MTM | Post Incident Review process |
| `docs/governance/RESPONSE-REPUTATION.md` | IncidentX/gamified-* docs, response-reputation-score | Future gamification framework |

---

## Contradictions Resolved

| Topic | Older versions said | Current version says | Resolution |
|---|---|---|---|
| Phase model | 4 phases (Investigating → Mitigating → Recovering → Resolved) | 8 phases (Alert → Gather → Assess → Initial → Isolation → Mitigation → Validation → Resolution) | 8-phase model is more developed and is the canonical standard. |
| Architecture | Jekyll + Docker + Cloudflare Workers | All-Cloudflare (Workers + D1 + Pages + React) | Current all-Cloudflare is correct. Old architecture is archived. |
| Product name | IncidentX, CoreOps, ESM, MIM.run | MajorOps | MajorOps confirmed canonical. |
| Auth | Google OAuth via Mocha Users Service | Cloudflare Access (planned) | Current README notes both accurately. No update needed. |
| Primary tagline | "When systems go down, we stand up" | Same — confirmed canonical | Consistent. |

---

*REVIEWED.md is the audit trail for this consolidation. Last updated: 2026-03-03.*
