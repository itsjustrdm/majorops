# Stakeholder View (10,000 ft)

The Stakeholder view delivers a concise, always-current snapshot for internal stakeholders who need signal without fireground detail.

## What you see
- **Phase + cadence**: current phase label, with a cadence badge that turns overdue when the next ETA passes.
- **Milestones**: latest milestones (expandable) with status-at-cut and promised next update.
- **Impact panels**: business impact and customer impact summaries.
- **What happens next**: checklist derived from the current phase to set expectations.
- **Bridge + systems**: bridge link and affected systems for deeper follow-up.

## How cadence works
- `nextUpdateEta` sets the countdown; when in the past, the badge shows `Overdue by Xm`.
- `lastCommunicatedAt` records the last outbound comms time shown alongside the badge.
- Update the next ETA whenever the plan changes to avoid overdue states.

## When to use
- Sharing situational awareness with product/ops stakeholders.
- Providing predictable update timing during high-noise phases.

## Tips
- Keep milestone bodies concise (1–2 sentences) and include the next step/ETA.
- If impact or severity changes, cut a new milestone even if only a few minutes have passed.
