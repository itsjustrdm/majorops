# MajorOps Brand Guide

> This is the authoritative reference for all visual and voice decisions. If a component, page, or piece of copy contradicts this document, the document wins. `brand.css` is the direct implementation of the decisions below.

---

## Identity

**Name:** MajorOps
**Tagline (Primary):** WHEN SYSTEMS GO DOWN, WE STAND UP
**Tagline (Secondary):** COMMAND BY DESIGN. CALM UNDER PRESSURE.

**What we are:** A purpose-built incident command platform for Major Incident Managers. Not a generic ITSM tool. Not a help desk. The operational layer between chaos and resolution.

---

## Logo

### The Wordmark: `>` + `MAJOR` + `ops`

Three-part wordmark. No icon, no box. The `>` terminal prompt is tucked in at ~55% of the wordmark size — smaller, optically below baseline, a command-line nod without competing with the name. Two fonts, two weights, two states. The logo itself communicates operational status.

| Element | Peace Time | War Time |
|---|---|---|
| `>` prompt font | IBM Plex Mono 400 | IBM Plex Mono 700 |
| `>` prompt size | ~55% of wordmark height | ~55% of wordmark height |
| `>` prompt color | AS/400 Green Dim `#008800` | Fire Red `#CC0000` |
| `>` prompt animation | static | blink 1.5s infinite |
| `MAJOR` font | Orbitron 700 | Orbitron 900 |
| `MAJOR` color | Smoke `#CCCCCC` | Fire Red `#CC0000` |
| `MAJOR` tracking | 3px | 4px |
| `ops` font | IBM Plex Mono 400 | IBM Plex Mono 700 |
| `ops` color | AS/400 Green `#00CC00` | White `#FFFFFF` |
| `ops` tracking | -1px | -1px |
| `ops` case | lowercase | lowercase |

### The Prompt Character

The `>` is IBM Plex Mono — the same font as `ops`. It sits at ~55% of the wordmark's display size, optically positioned 2px below the baseline, with 4px of space before `MAJOR`. In peacetime it's a dim green: present but quiet. In wartime it blinks red — the only automatic animation in the entire interface. It signals that the system is executing.

### Peace Time — Default State

Used everywhere by default: website, docs, marketing, email, business cards, social.
Communicates: ready, professional, operational. Green = systems healthy, team trained, procedures in place.

```
> MAJOR ops
↑ dim green static, small
       ↑ Orbitron 700, smoke gray (#CCCCCC), 3px tracking
              ↑ IBM Plex Mono 400, AS/400 green (#00CC00), -1px tracking
```

### War Time — Active Incident

Used when an active incident exists. Application switches logo state dynamically.
Communicates: MAJOR incident active, command engaged, all hands responding.

```
> MAJOR ops
↑ red, blinking (1.5s)
       ↑ Orbitron 900, Fire Red (#CC0000), 4px tracking, heavier weight
              ↑ IBM Plex Mono 700, white (#FFFFFF), -1px tracking, heavier weight
```

**Severity variants:**
- Critical / P1: Fire Red `#CC0000` — pulsing border-pulse animation
- High / P2: `#FF6600`
- Medium / P3: `#FFAA00`

### Size Scale

| Context | `>` size | `MAJOR` size | `ops` size |
|---|---|---|---|
| Hero / display | 30px | 56px | 56px |
| Navigation | 18px | 32px | 32px |
| Compact | 11px | 20px | 20px |
| Minimum | 8px | 14px | 14px |

### Logo Rules

- Never stretch or distort
- Never use mixed case — `MAJOR` is always all-caps, `ops` is always lowercase
- The `>` prompt is always present — never omit it
- Never replace Orbitron with another font for `MAJOR`
- Never replace IBM Plex Mono with another font for `ops` or `>`
- Minimum size: 14px for the wordmark — below this, use text only
- Clear space: minimum 16px on all sides
- The prompt `>` is the only element that animates — and only in wartime

---

## Color

All colors are defined as CSS variables in `brand.css`. Always reference variables — never hardcode hex values in components.

### Core Palette

| Name | Variable | Hex | Usage |
|---|---|---|---|
| Fire Red | `--color-fire-red` | `#CC0000` | Primary brand, alerts, critical state, CTAs |
| Fire Red Dark | `--color-fire-red-dark` | `#990000` | Hover states, pressed states |
| Fire Red Light | `--color-fire-red-light` | `#FF3333` | Highlights, emphasis |
| AS/400 Green | `--color-green` | `#00CC00` | Operational/healthy, success, secondary accents |
| AS/400 Green Bright | `--color-green-bright` | `#00FF00` | Active indicators, live status |
| AS/400 Green Dim | `--color-green-dim` | `#008800` | Muted success, background tints |
| Signal Black | `--color-black` | `#0A0A0A` | Primary background (dark mode default) |
| Signal White | `--color-white` | `#FFFFFF` | Primary text on dark backgrounds |

### Gray Scale

| Name | Variable | Hex | Usage |
|---|---|---|---|
| Charcoal | `--color-charcoal` | `#1A1A1A` | Card backgrounds, elevated surfaces |
| Slate | `--color-slate` | `#2A2A2A` | Borders, dividers, secondary surfaces |
| Storm | `--color-storm` | `#404040` | Inactive elements, borders |
| Fog | `--color-fog` | `#808080` | Secondary text, labels, metadata |
| Smoke | `--color-smoke` | `#CCCCCC` | Tertiary text, disabled states |
| Paper | `--color-paper` | `#F5F5F5` | Light mode backgrounds (print only) |

### Status Colors (Semantic)

| State | Variable | Color | Notes |
|---|---|---|---|
| Critical / P1 | `--color-status-critical` | `#CC0000` (Fire Red) | Full fire red |
| High / P2 | `--color-status-high` | `#FF6600` | Orange — distinct from critical |
| Medium / P3 | `--color-status-medium` | `#FFAA00` | Amber |
| Low / P4 | `--color-status-low` | `#00CC00` (Green) | Operational green |
| Active | `--color-status-active` | `#CC0000` | Same as critical |
| Monitoring | `--color-status-monitoring` | `#FFAA00` | Amber — watch state |
| Resolved | `--color-status-resolved` | `#00CC00` | Green — healthy |

### Color Rules

- **Dark mode is the default.** All interfaces render on Signal Black unless explicitly print context.
- Fire Red is for alerts, actions, and critical states — not decoration.
- AS/400 Green is for healthy/operational states and secondary highlights.
- Never use Fire Red and AS/400 Green together at large scale — they fight. Use one as accent.
- Never use gradients in the primary interface.

---

## Typography

All fonts loaded from Google Fonts. No custom font files required for web.

### Font Stack

| Role | Font | Weights | Variable |
|---|---|---|---|
| Logo `MAJOR` / Display | Orbitron | 700, 900 | `--font-display` |
| Headers | Saira Condensed | 600, 700, 800 | `--font-heading` |
| UI / Body | IBM Plex Sans | 400, 500, 600 | `--font-body` |
| Logo `ops` / Code / Terminal | IBM Plex Mono | 400, 500, 700 | `--font-mono` |

> **Note on Orbitron:** Chosen for `MAJOR` and hero display because it has unimpeachable command-center authority. When a CISO sees it, they don't think "trendy startup." The geometric precision appeals to engineering minds without being decorative.

> **Note on Saira Condensed:** Used for headers because it's space-efficient, industrial, and reads fast under stress. It has the condensed authority of emergency services typography without feeling sci-fi.

### Type Scale

| Name | Variable | Size | Weight | Tracking | Usage |
|---|---|---|---|---|---|
| Display | `--text-display` | 48px | 700 | 2px | Hero numbers, major headings |
| H1 | `--text-h1` | 32px | 700 | 2px | Page titles |
| H2 | `--text-h2` | 24px | 700 | 1px | Section headers |
| H3 | `--text-h3` | 18px | 600 | 1px | Card headers, subsections |
| Body Large | `--text-body-lg` | 16px | 400 | 0 | Primary body copy |
| Body | `--text-body` | 14px | 400 | 0 | Default UI text |
| Small | `--text-small` | 12px | 400 | 1px | Labels, metadata |
| Micro | `--text-micro` | 10px | 500 | 2px | Tags, uppercase labels |

### Typography Rules

- Headers use Saira Condensed. Body and UI use IBM Plex Sans. Code and terminal output use IBM Plex Mono.
- Uppercase labels always use `--text-micro` with 2px letter-spacing. Never uppercase body copy.
- Line height: 1.6 for body, 1.3 for headers, 1.1 for display.
- Never center-align body text. Left-align everything except status-page hero numbers.

---

## Geometry

### Border Radius

**Zero. No border radius anywhere.**

MajorOps uses hard edges throughout. This is intentional — it reflects emergency services and operational interfaces (command centers, CAD systems, dispatch terminals). Rounded corners signal consumer apps. We are not a consumer app.

### Borders

| Usage | Width | Color |
|---|---|---|
| Card borders | 1px | `--color-slate` |
| Section accents / underlines | 2px | `--color-fire-red` |
| Logo icon border | 3px | `--color-green` |
| Critical/alert borders | 2px | `--color-fire-red` |
| Active phase indicator | 2px | current severity color |
| Terminal-style containers | 2px | `--color-green` |

### Shadows

Single shadow definition. Used sparingly — on elevated cards only, never decoratively.

```css
--shadow-card: 0 8px 24px rgba(0, 0, 0, 0.4);
```

No glow effects. No neon. No drop shadows on text.

---

## Spacing

All spacing uses an 8px base grid.

| Token | Variable | Value |
|---|---|---|
| 2xs | `--space-2xs` | 4px |
| xs | `--space-xs` | 8px |
| sm | `--space-sm` | 12px |
| md | `--space-md` | 16px |
| lg | `--space-lg` | 24px |
| xl | `--space-xl` | 32px |
| 2xl | `--space-2xl` | 48px |
| 3xl | `--space-3xl` | 64px |
| 4xl | `--space-4xl` | 80px |

### Layout

| Context | Value |
|---|---|
| Page max-width | 1200px |
| Page horizontal padding | 24px (mobile), 48px (tablet), 80px (desktop) |
| Card padding | 24px |
| Section gap | 32px |
| Component gap | 16px |

---

## Layout Patterns

### The Three Views

Each view is a standalone HTML page. All three read from the same API. No shared React shell.

**Homepage / Executive View (`/`)**
- Atlassian StatusPage-style. Is anything on fire? Here's what.
- Shows: overall system status, active incident list, severity/duration/impact per card.
- No auth required. This is the 30k ft view.

**Incident Detail / Fireground View (`/incident/:id`)**
- The MIM's working environment during an active incident.
- Structure: three persistent bars (top nav, phase bar, bottom stats) with scrollable detail between.
- Auth required for editing. Read access is open.

**Stakeholder View (`/status`)**
- 10k ft. Same incidents, less noise. Milestone feed, next expected update, current status.
- No auth required.

### Incident Detail Layout (Sticky Bars)

```
┌─────────────────────────────────────────────────┐  ← TOP BAR (sticky)
│ ← #3 Storage Service Regional Failure  [Med][Active] │
├─────────────────────────────────────────────────┤  ← PHASE BAR (sticky)
│ Alert > Gather > [Assess] > Initial > ... > Resolution │
├─────────────────────────────────────────────────┤
│                                                   │
│              SCROLLABLE CONTENT                   │
│                                                   │
├─────────────────────────────────────────────────┤  ← BOTTOM BAR (sticky)
│ 17h 13m | 1,200 affected | 3/8 Assess | 3 updates │
└─────────────────────────────────────────────────┘
```

---

## Phase Bar

The phase bar is a core UI element. These are the rules:

- 8 phases displayed as chevrons in sequence
- Completed phases: `--color-green` background
- Current phase: severity color background (Fire Red for Critical/Active, Amber for Medium, etc.)
- Future phases: `--color-storm` background, `--color-fog` text
- Font: Saira Condensed 700, 13px, 1px letter-spacing, uppercase
- No border radius on chevrons (consistent with overall geometry)
- Chevron clip-path to create the arrow shape — CSS only, no images

---

## Voice & Tone

**Speak like a trusted senior engineer, not a marketing department.**

| Do | Don't |
|---|---|
| "Incident resolved. Duration: 2h 14m." | "We're excited to announce full restoration!" |
| "3 systems affected. P1. MIM assigned." | "We are experiencing some issues at this time." |
| "Phase 6 — Mitigation underway." | "Our team is working hard to fix this." |
| Use: bridge, dispatch, command, phase, fireground | Avoid: ticket, case, synergy, leverage |

**Written content hierarchy:**
1. Status first. Numbers before words.
2. What changed. What's next.
3. Nothing else in the operational view.

**Tone by context:**
- Status pages: Clinical. No emotion. Data only.
- Error states: Direct. No apology. Here's what happened and what's being done.
- Empty states: Short. Matter-of-fact. "No active incidents."
- Buttons / CTAs: Imperative. "Open Incident." "Advance Phase." "Post Update."

---

## Animation

Minimal. Two defined animations only:

```css
/* Cursor blink — logo and terminal elements */
@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
/* duration: 1.5s infinite */

/* Status pulse — live/active indicators only */
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}
/* duration: 2s ease-in-out infinite */
```

No page transitions. No slide-ins. No skeleton loaders with animation. Fast interfaces don't need to apologize for loading.

---

## Print & Media Specs

| Asset | Dimensions |
|---|---|
| Business card | 3.5" × 2" / 88.9mm × 50.8mm |
| Letterhead | 8.5" × 11" (US Letter) |
| Envelope | #10 / 4.125" × 9.5" |
| LinkedIn cover | 1584 × 396px |
| Twitter/X cover | 1500 × 500px |
| Social post | 1200 × 628px |
| Instagram square | 1080 × 1080px |
| Story | 1080 × 1920px |

Print bleed: 0.125" (3mm). Resolution: 300 DPI minimum.

---

*BRAND.md is the source of truth. `brand.css` is the implementation. When in conflict, BRAND.md wins.*
