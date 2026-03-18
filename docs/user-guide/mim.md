# MIM Operator Guide

> The MIM is the 911 dispatcher, not the paramedic: routes signals, sets cadence, and clears noise so specialists can fix fast.

---

## What MajorOps (mim.run) Is

Before 911, cities had central alarm offices. When someone pulled a Gamewell fire alarm box on the street, it sent a coded telegraph signal to the central station. The operator received it, identified the box number, and dispatched the right companies — automatically, without asking a single question. The signal was standardized. The response was predetermined. The operator ran the response.

That model is 150 years old. It works. MajorOps (served on `mim.run`) is that idea, applied to IT incidents, running in any browser.

Traditional incident management tools were built for ITSM workflows — ticket queues, approval chains, shift handoffs. They inherited the same problem that legacy CAD systems developed: purpose-built for a fixed workstation, complex to operate, and completely wrong for the 90 seconds after a P1 alarm fires.

**MajorOps is a browser-native incident command interface.** No installed software. No VPN required. Any device with a browser is a fully capable fireground. A MIM can be running a Box 3 incident from a phone, a borrowed laptop, or a secondary monitor within seconds of paging.

The alert is the signal. The alarm level determines the tier. The run card is the dispatch protocol. The MIM runs the response. The structure is the same as it was in 1880. The software is finally built for 2026.

---

## Opening an Incident

### new.mim.run — the Call for Service URL

The fastest way to open an incident is `new.mim.run`.

This is the **Call for Service** entrypoint. Any authenticated MIM can navigate to it from any browser and be in the fireground within seconds. It is the IT equivalent of a dispatcher accepting a call — the minimum viable intake that starts the clock and activates the command structure.

**Required fields to open:**

| Field | What to enter |
|---|---|
| **Title** | What broke. One line. e.g. `prod-payments-api not responding` |
| **Severity** | Critical · High · Medium · Low |
| **Affected Systems** | What services or components are impacted. Start with what you know. |
| **Bridge URL** | Paste your Zoom, Meet, or Teams link. If you don't have one yet, leave blank and add it on the fireground. |

That is it. You do not need root cause. You do not need a full impact assessment. You do not need to know which team owns the affected system.

Open the incident. Get on the bridge. Gather from there.

> **The fastest wrong answer is better than the slowest right answer.** You can update severity, title, and affected systems from the fireground. You cannot get that first 5 minutes back if you spend it on the intake form.

### Alarm Level Mapping

When you select severity at intake, the alarm level determines the response posture that activates:

| Severity | Alarm Level | What it triggers |
|---|---|---|
| **Critical** | Box 3 | Full command structure, executive notification, run card activation |
| **High** | Box 2 | Active MIM, stakeholder notification, multi-team response |
| **Medium** | Box 1 | Single responder, MIM on standby |
| **Low** | Box 0 | Triage only — monitor, no bridge |

If you are unsure, **default to the higher level.** The cost of over-responding is wasted effort. The cost of under-responding is a P1 that was managed like a P3 for the first 20 minutes.

---

## The Fireground

The fireground is your command interface for the duration of the incident. Everything you need is in one view — no tab-switching, no hunting for context.

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  ›MAJORops [WARTIME]          [Clock]    INC-###        │  ← Top bar
├─────────────────────────────────────────────────────────┤
│  [Phase Bar: Alert → Gather → Assess → ... → Resolution] │  ← Phase progress
├──────────────────────────────────┬──────────────────────┤
│                                  │                       │
│  Incident title (click to edit)  │  Phase Command Panel  │
│  Description (click to edit)     │                       │
│                                  │  · Current phase info │
│  Alert Info    Command Team      │  · AI suggestion      │
│                                  │  · Phase notes        │
│  Timeline Feed                   │  · Advance Phase      │
│                                  │  · Quick Update post  │
│  Status Updates                  │                       │
│                                  │                       │
├──────────────────────────────────┴──────────────────────┤
│  Duration · Impact · Users · Phase · Updates            │  ← Fixed footer
└─────────────────────────────────────────────────────────┘
```

### The Wordmark

The `›MAJORops` wordmark in the top bar tells you the operational state at a glance:

- **Red, blinking** — Wartime. One or more active incidents are running. You are live.
- **Green (AS/400 phosphor)** — Peacetime. No active incidents.

This is intentional. The interface changes posture when something is wrong. You should never have to wonder if you are looking at a live incident or a historical view.

### Three Fireground Views

The MIM fireground has three views. All three show the same incident — they differ in what they surface and how fast you can operate.

| View | URL | When to use |
|---|---|---|
| **Classic** | `/admin/incidents/:id` | Default. Full situational overview — command team, phase panel, timeline, milestones, dispatch, recovery paths. |
| **Terminal** | `/admin/incidents/:id/terminal` | Active operations. 3-column fixed viewport, unified micro-update feed, CAD command line at the bottom. Type to post bridge notes or run commands without lifting your hands. |
| **Focus** | `/admin/incidents/:id/focus` | High-noise P1s. Single-surface, max-width, no sidebars. Just the current bet, phase guidance, and the essentials. |

Switch between views using the view switcher in the header, or use the CAD bar: `view terminal`, `view focus`, `view classic`.

The **Terminal view** is the recommended default for active P1 and P2 incidents. It is built around the assumption that you are typing constantly. The command line at the bottom accepts bridge notes (`anything you type and hit Enter`) and slash commands (`/dispatch`, `/advance`, `/hyp`). The unified feed sorts micro-updates and command results chronologically, newest first.

---

### Fixed Footer Bar

Always visible. Five tiles that give you the operational snapshot without scrolling:

- **Duration** — Total time since incident opened. Color shifts from green → amber → red as time extends.
- **Impact** — Time since the alert fired. Tracks the customer-facing clock.
- **Users** — Confirmed affected customer count from alert intake.
- **Phase** — Current phase name and number.
- **Updates** — Count of published status updates.

### Click-to-Edit Fields

Every field on the fireground is editable in place. Click any title, description, role name, or impact field to edit it directly. Press **Enter** or click away to save. Press **Escape** to cancel.

You should not need to navigate to a separate edit view for anything. The fireground is the edit view.

---

## Running the 8 Phases

### Overview

| Phase | Name | Your primary job |
|---|---|---|
| 1 | **Alert** | Confirm the alert is real. Get the right people paged. Open the bridge. |
| 2 | **Gather** | Assemble the team on the bridge. Collect conditions from all affected systems. |
| 3 | **Assess** | Determine scope and blast radius. Confirm or adjust severity. Identify the fault domain. |
| 4 | **Initial** | Cut the first stakeholder milestone. Set the next update ETA. Get leadership in the loop. |
| 5 | **Isolation** | Root cause confirmed. Keep the team focused on the fault domain. Block noise. |
| 6 | **Mitigation** | Remediation is running. Track recovery tracks. Timebox each team's work. |
| 7 | **Validation** | Recovery applied. Confirm across all affected systems. Do not close early. |
| 8 | **Resolution** | Incident closed. Cut the resolution milestone. Schedule the After Action. |

Phases advance forward only. Use the **Advance Phase** button in the Phase Command Panel when conditions are met — not on a timer.

---

### Phase 1 — Alert

You have been paged or you opened the incident yourself. The clock is running.

**Your checklist:**

1. Confirm the alert is real — not a monitoring false positive.
2. Open the incident at `new.mim.run` if not already opened.
3. Page or direct-message the on-call SRE for the affected system.
4. Open the bridge. Paste the URL into the incident.
5. Update the `Affected Systems` field with what you know.
6. Advance to Phase 2 once at least one technical responder is on the bridge.

**Do not** spend Phase 1 trying to gather conditions. That is Phase 2's job.

---

### Phase 2 — Gather

The team is assembling. Your job is information collection, not diagnosis.

**Your job on the bridge:**

Use the **CAN format** for every team check-in:

> "App team — Conditions, Actions, Needs?"

Every team reports: what they observe, what they are doing, what they are blocked on. You synthesize. You do not diagnose.

**Timeboxing:**

Open explicit timeboxes for information gathering. "I need conditions from App and Database in 5 minutes." When the timebox expires, take what you have and move forward. Do not let information-gathering become a second incident.

**On the fireground:**

- Post internal timeline notes as information comes in. The timeline is your record.
- Update `Description` as the picture becomes clearer.
- Update `Affected Systems` as scope expands.
- Assign the Command Team roles if not already done.

Advance to Phase 3 once you have initial conditions from all known affected systems.

---

### Phase 3 — Assess

You have conditions. Now you make the call.

**Key decisions in this phase:**

- **Severity correct?** If actual blast radius is larger or smaller than intake, adjust severity now. This changes alarm level and stakeholder notification requirements.
- **External impact?** Update the `External Impact` flag on the Alert Info panel. This determines what goes in stakeholder communications.
- **Customer count?** Update the `Customer Count` field with the best available number. Use the word "approximately" if you are not certain.

**Advancing to Phase 4:**

You are ready for Phase 4 when:

- Scope is reasonably bounded (even if not fully known)
- Severity is confirmed or adjusted
- You know what the immediate next technical step is

You do not need root cause to advance to Phase 4.

---

### Phase 4 — Initial Communication

This is the most important phase for stakeholder management. **The first milestone sets the tone for the entire incident.**

**Cut your first milestone:**

Use the Quick Update section in the Phase Command Panel, or use the AI Draft button to generate a starting point. Edit before publishing. A good first milestone:

- States what is known (not what is suspected)
- Confirms impact scope and customer count
- Names the recovery approach (even if high-level)
- Sets a realistic next update ETA — typically 20–30 minutes

**The AI Draft button:**

The AI generates a contextual draft based on the current incident state — title, description, phase, timeline events, severity, and affected systems. It is a starting point, not a press release. Read it. Edit what is wrong. Do not publish AI output without review.

**Cadence commitment:**

When you publish the milestone, you are making a commitment. The `nextUpdateEta` field drives the cadence badge visible to stakeholders and executives. When that timestamp passes without a new milestone, the badge turns overdue. Overdue badges erode trust faster than bad news.

If your ETA slips, cut a brief holding milestone immediately: "Recovery track in progress. Next update in 15 minutes."

---

### Phase 5 — Isolation

Root cause is identified. The fault domain is known.

**Your job in this phase:**

- Keep the team focused on the fault domain. Do not let scope creep introduce unrelated changes.
- Document the root cause in the `Description` field. This becomes the record.
- Open recovery tracks for each team with explicit timeboxes.
- Update `Business Impact` and `Customer Impact Summary` with current confirmed numbers and statement.

**What isolation does not mean:**

Isolation in the MajorOps model means the *fault domain is isolated* — you know what is broken. It does not mean the customer impact is contained. That is Mitigation's job.

---

### Phase 6 — Mitigation

Remediation is running. This is often the longest phase.

**Running recovery tracks:**

Each recovery track has an owner, a goal, and a timebox. Check in on each track at your cadence commitment. If a track's timebox expires without a result, either extend it (with a new timebox) or escalate.

**Posting updates:**

Cut a milestone at every meaningful change:

- Recovery track failed — new approach being taken
- Customer impact changed (better or worse)
- ETA changed
- Vendor escalation opened or resolved

Do not wait for "good news" to communicate. Stakeholders need signal, not silence.

**Monitoring transition:**

When the primary recovery action has been applied and systems are showing improvement but not fully confirmed, you may advance to Phase 7 (Validation). Do not advance to Monitoring status until Phase 7 is complete.

---

### Phase 7 — Validation

The fix is in. Now you confirm it worked — across every affected system.

**Validation checklist:**

- Each affected system team confirms recovery individually on the bridge
- Error rates, latency, and health checks are back within normal bounds
- Synthetic monitoring (if available) shows green
- No customer complaints arriving since the recovery was applied

**The 10-minute rule:**

Do not advance to Resolution or change status to Resolved until at least 10 minutes of clean validation has passed for Critical and High incidents. Premature closure followed by re-opening is worse for stakeholder trust than a slightly longer validation window.

When validation is complete, update `status` to `Monitoring` and advance to Phase 8.

---

### Phase 8 — Resolution

The incident is over. Your last job is a clean close.

**Resolution checklist:**

1. Change `status` to `Resolved`.
2. Cut the **resolution milestone** — mark it as resolution. Include:
   - Confirmed customer impact (final numbers)
   - What was done to resolve it
   - Root cause summary (brief — detail goes in the Learning Review)
   - After Action scheduled date/time
3. Update `resolvedAt` timestamp if not auto-set.
4. Release technical responders from the bridge.
5. Schedule the After Action within 72 hours.

**The resolution milestone is your paper trail.** It is what the executive team reads the next morning. Write it like a professional close.

---

## Command Team Management

The Command Team panel shows the five assigned roles for the incident. All fields are editable in place on the fireground — click to edit, Enter to save.

| Role | Responsibility |
|---|---|
| **SRE** | Technical lead. Owns recovery tracks. Reports conditions in CAN format. |
| **MIM** | You. Command and communications. Does not fix. |
| **Leader** | Incident Commander / escalation authority. Escalation point for severity changes and resource unlocks. |
| **Service Manager** | Service owner liaison. Knows the system, the vendor contacts, and the on-call rotation. |
| **Customer Ops** | Owns customer-facing communication and support queue awareness. |

**Reassigning mid-incident** is supported and expected. If the on-call SRE is unavailable or a different team needs to be engaged, update the role field. The change is automatically logged to the timeline.

---

## The Timeline

The timeline is the fireground record. Everything that happens during the incident is logged here — phase transitions, command changes, update posts, and manual notes.

**Types:**

| Icon | Type | Logged by |
|---|---|---|
| 🔴 Alert | `alert` | Automatic — incident open, alert fired |
| 🔵 Phase | `phase` | Automatic — phase advances |
| 🟡 Update | `update` | Automatic — milestone or status update posted |
| 🟢 Command | `command` | Automatic — command team changes |
| ⚪ Action | `action` | Manual — MIM notes, timebox calls, decisions |

Post manual timeline entries liberally during the incident. They are your notes. They feed the Learning Review. They feed the AI context for exec brief generation.

**Visibility:**

Timeline events can be `public` or `internal`. Internal events are not visible in the public status page. When in doubt, mark operational notes as internal.

---

## AI-Assisted Features

Three AI capabilities are available on the fireground. All of them are **starting points**, not final outputs. Review and edit before publishing anything.

### AI Phase Suggestion

Available in the Phase Command Panel. Shows a contextual recommendation for the current phase based on the incident state — what to do next, what to watch out for, typical failure modes at this phase.

Useful for less-experienced MIMs or high-noise situations where it is easy to lose track of the phase agenda.

### AI Draft Update

Available in the Quick Update section. Generates a draft status update based on current incident state — title, description, phase, timeline events, and severity. Good at capturing "what we know and what we're doing" in stakeholder language.

Edit it. The AI does not know things that are not in the incident record. If you have verbal bridge information that has not been logged to the timeline, log it first — then generate the draft.

### AI Exec Brief

Available from the incident header. Generates a one-paragraph executive summary formatted for the Exec view. Pulls from `businessImpact`, `customerImpactSummary`, `riskLevel`, `execSummary`, and the most recent milestone.

Run this at Phase 4 and again at Resolution. It saves time and reduces the chance of sending a technically-accurate-but-incomprehensible brief to leadership.

---

## Public Status Page

Everything in mim.run has a dual view — the fireground (what you see) and the public status page (what everyone else sees).

The public status page at `mim.run` or a custom status domain shows:

- Active incidents with severity, phase, and last update time
- Public timeline entries and status updates
- The bridge link (if you want responders to find it)
- Alert info and affected systems

**You control what is public** through the visibility toggle on updates and timeline events. Internal entries never surface. Public entries are visible to anyone with the URL.

For Critical incidents, assume the public status page link is being shared. Post public updates even if you are heads-down on the fireground. Silence on the public page during a P1 is its own kind of failure.

---

## Common Mistakes

**Opening the incident too late.**
The incident start time should be when the problem began, not when you finished gathering enough information to feel comfortable declaring. Open early. Adjust severity if needed.

**Letting Phase 2 run indefinitely.**
Gathering is not an end state. Time-box your information collection. If you do not have full conditions in 10 minutes, take partial conditions and assess with what you have.

**Skipping the first milestone.**
The first milestone is often skipped in high-noise P1s because the MIM is fully absorbed in the technical response. Set a personal rule: no more than 20 minutes into a declared incident without a stakeholder update.

**Publishing AI drafts without editing.**
The AI draft is contextually grounded but it does not know your organization, your vendor names, your customer names, or anything you have not entered into the incident record. Read it before publishing.

**Closing before full validation.**
A premature close followed by a reopening is highly visible and damages trust. Wait for the clean window. 10 minutes of confirmed green is worth more than a 5-minute faster close.

**Not scheduling the After Action before you leave the bridge.**
If the After Action is not scheduled on the resolution milestone, it does not get scheduled. The bridge close is your last moment of organizational attention on this incident. Use it.

---

## Keyboard Reference

| Action | How |
|---|---|
| Edit any field | Click the field |
| Save edit | `Enter` (single-line) · Click away (multi-line) |
| Cancel edit | `Esc` |
| Focus CAD bar | `` ` `` (backtick) from anywhere |
| Open new incident | `new.mim.run` · CAD bar: `new` |
| Search by description | `what.mim.run/<text>` · CAD bar: `what <text>` |
| Find by ID | CAD bar: `join 1234` |
| List active incidents | CAD bar: `ls` |
| Switch to terminal view | CAD bar: `view terminal` |
| Switch to focus view | CAD bar: `view focus` |
| Pop out to window | CAD bar: `pop` |
| Quick-key reference | CAD bar: `mom` |
| Advance phase | Phase Command Panel → Advance Phase button |
| Post bridge note (terminal) | Type note → `Enter` in terminal input |
| Post slash command (terminal) | `/advance`, `/dispatch <team>`, `/hyp <text>` |
| Post quick update (classic) | Phase Command Panel → Quick Actions |
| Generate AI draft | Phase Command Panel → AI Draft button |
| Generate exec brief | Incident header → AI Exec Brief |

---

## The CAD Bar

A persistent command bar sits at the bottom of every page in MajorOps. 32px. Always visible. It does not scroll away.

**Focusing it:** Press the backtick key (`` ` ``) from anywhere — any page, any state — to focus the CAD bar without touching the mouse.

**Prompt states:**

- `majorops ▸` — green. You are at root. No active incident loaded.
- `INC-1234 ▸` — red or amber, blinking for Critical/High. You are in an active incident.

**Commands:**

```
join 1234         load incident 1234 — navigate to admin view
what payment      search active incidents by description
leave             exit current incident, back to status
ls                list all active incidents inline in the log
new               open create incident form
analytics         stats dashboard
status            system status page
view terminal     switch current incident to terminal view
view focus        switch to focus mode
view classic      switch to default admin view
pop               open terminal in a new 1440×900 window
mom               menu of menus — full quick-key reference overlay
help              print command reference
clear             clear the log
```

**`what` — natural language search:**

Type `what payment processing` or `what auth` to fuzzy-search across all active and recently resolved incidents. If there is one clear match, it redirects automatically. Multiple matches show a picker. This is also available at `what.mim.run/payment processing` — same search, from any browser tab or phone.

**`mom` — menu of menus:**

Toggles a reference panel above the bar with all commands grouped by context. Useful when you are new to the system or handing off mid-incident.

**`pop` — dedicated window:**

Opens the terminal view in a chrome-stripped 1440×900 window. Useful when running a major incident from a secondary monitor or when you want the CAD interface isolated from other browser tabs.

**`ls` — live incident list:**

Prints all active incidents inline in the log area, with ID, severity, phase, and title. Does not navigate away from the current page.

---

## Finding an Incident

You do not need a ticket number to find an active incident in MajorOps.

**By ID (if you have it):**

- CAD bar: `join 1234`
- Browser: `mim.run/incidents/1234` (stakeholder view) or `mim.run/admin/incidents/1234` (MIM view)
- Shortlink: `1234.mim.run` → stakeholder view

**By description (if you don't):**

- CAD bar: `what payment processing`
- Browser: `mim.run/search?q=payment+processing`
- Shortlink: `what.mim.run/payment processing`

Incident IDs are short by design. When you call someone on-call at 2am, you say "the payment processing incident" — not "INC0000334234." The search surface handles that. When there is one clear match, it redirects automatically. When there are several, it shows you a list. When there are none, it shows you everything active so you are never stranded.

---

## Deploying mim.run

The mim.run platform runs on **Cloudflare Workers + D1 + Pages**. The frontend is a Vite + React + TypeScript application deployed to Cloudflare Pages. The API runs as a Cloudflare Worker. The database is D1 (SQLite at the edge).

**Routing:**

| URL | What it is |
|---|---|
| `mim.run` | Public status page — all active incidents |
| `new.mim.run` | Call for Service intake — opens a new incident |
| `mim.run/incidents/:id` | Public incident detail — shareable status link |
| `mim.run/admin/incidents/:id` | MIM fireground — Classic view |
| `mim.run/admin/incidents/:id/terminal` | MIM fireground — Terminal / CAD CLI view |
| `mim.run/admin/incidents/:id/focus` | MIM fireground — Focus mode |
| `mim.run/analytics` | Stats dashboard — MTTx, team scores, phase analysis |
| `mim.run/search?q=…` | Incident search — fuzzy match across active + recent |
| `what.mim.run/anything` | Natural language shortlink → search |
| `1234.mim.run` | Direct shortlink — public stakeholder view |
| `1234.mim.run/terminal` | Direct shortlink — MIM terminal view |
| `mim.run/login` | SSO entry via Cloudflare Access |

The `new.mim.run` subdomain is a redirect target or a dedicated Pages route that deep-links to the new incident form with the intake fields pre-focused. No different URL scheme for authenticated users — Cloudflare Access handles auth transparently before the user hits the React app.

---

*See [Alarm Levels](../ALARM-LEVELS.md) for the full escalation framework. See [Data Dictionary](../data-dictionary.md) for field definitions. See [After Action](../governance/after-action.md) for the Learning Review process.*
