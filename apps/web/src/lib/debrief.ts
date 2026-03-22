/**
 * debrief.ts — Post-incident scoring and coach note generation
 *
 * All scores are computed deterministically from incident data.
 * "Baseline" figures are mock team averages keyed to severity.
 * Credit score deltas reflect this incident's contribution to the rolling average.
 */

import type { Incident, TimelineEvent } from '../types'

// ─── Baselines by severity ─────────────────────────────────────────────────────

export const SEVERITY_BASELINES = {
  Critical: { mttrMin: 120, mttmMin: 75,  firstUpdateMin: 15, dispatches: 4 },
  High:     { mttrMin: 90,  mttmMin: 55,  firstUpdateMin: 20, dispatches: 3 },
  Medium:   { mttrMin: 45,  mttmMin: 28,  firstUpdateMin: 30, dispatches: 2 },
  Low:      { mttrMin: 25,  mttmMin: 15,  firstUpdateMin: 45, dispatches: 1 },
} as const

// ─── Phase target durations (minutes) ─────────────────────────────────────────

export const PHASE_TARGETS: Record<number, number> = {
  1: 5,   // Alert — fast
  2: 10,  // Gather
  3: 15,  // Assess
  4: 8,   // Initial comms — should be quick
  5: 25,  // Isolation — can be long
  6: 30,  // Mitigation
  7: 15,  // Validation
  8: 5,   // Resolution
}

// ─── Phase durations from timeline ────────────────────────────────────────────

export interface PhaseDuration {
  phase: number
  label: string
  durationMin: number
  targetMin: number
  status: 'fast' | 'ok' | 'slow'
}

const PHASE_LABELS: Record<number, string> = {
  1: 'Alert', 2: 'Gather', 3: 'Assess', 4: 'Initial',
  5: 'Isolation', 6: 'Mitigation', 7: 'Validation', 8: 'Resolution',
}

export function computePhaseDurations(incident: Incident): PhaseDuration[] {
  // Extract phase transition events from timeline, sorted chronologically
  const phaseEvents: TimelineEvent[] = incident.timeline
    .filter(e => e.type === 'phase' && e.phaseNumber !== undefined)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  const durations: PhaseDuration[] = []
  const now = Date.now()

  for (let i = 0; i < phaseEvents.length; i++) {
    const evt    = phaseEvents[i]
    const ph     = evt.phaseNumber!
    const start  = new Date(evt.timestamp).getTime()
    const end    = i < phaseEvents.length - 1
      ? new Date(phaseEvents[i + 1].timestamp).getTime()
      : (incident.resolvedAt ? new Date(incident.resolvedAt).getTime() : now)
    const min    = Math.max(1, Math.round((end - start) / 60000))
    const target = PHASE_TARGETS[ph] ?? 20

    durations.push({
      phase:       ph,
      label:       PHASE_LABELS[ph] ?? `Ph${ph}`,
      durationMin: min,
      targetMin:   target,
      status:      min <= target * 0.9 ? 'fast' : min <= target * 1.4 ? 'ok' : 'slow',
    })
  }

  // If no timeline events, synthesize from detectedAt + resolvedAt
  if (durations.length === 0 && incident.resolvedAt) {
    const totalMin = Math.round(
      (new Date(incident.resolvedAt).getTime() - new Date(incident.detectedAt).getTime()) / 60000
    )
    // Distribute across phases proportionally to targets
    const totalTarget = Object.values(PHASE_TARGETS).reduce((a, b) => a + b, 0)
    for (let ph = 1; ph <= 8; ph++) {
      const target = PHASE_TARGETS[ph] ?? 15
      const min    = Math.round((target / totalTarget) * totalMin)
      durations.push({
        phase:       ph,
        label:       PHASE_LABELS[ph] ?? `Ph${ph}`,
        durationMin: Math.max(1, min),
        targetMin:   target,
        status:      min <= target * 0.9 ? 'fast' : min <= target * 1.4 ? 'ok' : 'slow',
      })
    }
  }

  return durations
}

// ─── Key KPIs ─────────────────────────────────────────────────────────────────

export interface DebriefKpis {
  mttrMin: number | null         // total incident duration
  mttmMin: number | null         // alert → mitigation entry (phase 6)
  firstUpdateMin: number | null  // detectedAt → first milestone
  trackCount: number
  trackSuccessful: number
  teamsPaged: number
  updatesPosted: number
  hypothesesTotal: number
  hypothesesValidated: number
}

export function computeKpis(incident: Incident): DebriefKpis {
  const detected = new Date(incident.detectedAt).getTime()
  const resolved = incident.resolvedAt ? new Date(incident.resolvedAt).getTime() : null
  const mttrMin  = resolved ? Math.round((resolved - detected) / 60000) : null

  // Phase 6 entry from timeline
  const mitigationEvt = incident.timeline
    .filter(e => e.type === 'phase' && e.phaseNumber === 6)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())[0]
  const mttmMin = mitigationEvt
    ? Math.round((new Date(mitigationEvt.timestamp).getTime() - detected) / 60000)
    : null

  // First milestone
  const firstMilestone = incident.milestones
    .sort((a, b) => new Date(a.cutAt).getTime() - new Date(b.cutAt).getTime())[0]
  const firstUpdateMin = firstMilestone
    ? Math.round((new Date(firstMilestone.cutAt).getTime() - detected) / 60000)
    : null

  const allHyps = incident.recoveryPaths.flatMap(p => p.hypotheses)

  return {
    mttrMin,
    mttmMin,
    firstUpdateMin,
    trackCount:           incident.recoveryPaths.length,
    trackSuccessful:      incident.recoveryPaths.filter(p => p.status === 'successful').length,
    teamsPaged:           incident.teamPages.length,
    updatesPosted:        incident.updatesPosted,
    hypothesesTotal:      allHyps.length,
    hypothesesValidated:  allHyps.filter(h => h.status === 'validated').length,
  }
}

// ─── Credit scores ────────────────────────────────────────────────────────────
// Deterministic mock — seeded by incident ID so it's stable on re-render.

export interface CreditScore {
  label: string
  before: number
  after:  number
  delta:  number
  max:    number
}

function seedRng(seed: number) {
  // Simple LCG for deterministic values
  let s = seed
  return (n: number) => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return Math.abs(s) % n
  }
}

export function computeCreditScores(incident: Incident, kpis: DebriefKpis): CreditScore[] {
  const rng      = seedRng(incident.id * 17 + 3)
  const baseline = SEVERITY_BASELINES[incident.severity]

  // How did this incident perform relative to baseline?
  const mttrRatio  = kpis.mttrMin && baseline.mttrMin
    ? kpis.mttrMin / baseline.mttrMin  // < 1 means faster than baseline
    : 1
  const commsRatio = kpis.firstUpdateMin && baseline.firstUpdateMin
    ? kpis.firstUpdateMin / baseline.firstUpdateMin
    : 1

  // Command score: 600–950 range, seeded base + performance delta
  const baseCommand = 680 + rng(180)
  const cmdDelta    = Math.round(
    (mttrRatio < 1 ? 12 : mttrRatio < 1.2 ? 4 : -6) +
    (commsRatio < 1 ? 8 : commsRatio < 1.2 ? 2 : -4) +
    (kpis.trackSuccessful > 0 ? 5 : 0) +
    (rng(10) - 3)  // some randomness
  )

  // Team dispatch score
  const baseTeam   = 640 + rng(200)
  const teamDelta  = Math.round(
    (incident.teamPages.filter(p => p.arrivedAt).length / Math.max(1, incident.teamPages.length) > 0.8 ? 8 : -4) +
    (rng(8) - 2)
  )

  // Bridge efficiency score
  const baseBridge = 610 + rng(220)
  const bridgeDelta = Math.round(
    (kpis.updatesPosted >= 3 ? 6 : kpis.updatesPosted >= 1 ? 2 : -8) +
    (rng(10) - 4)
  )

  return [
    {
      label:  'MIM Command Score',
      before: baseCommand,
      after:  Math.min(999, Math.max(300, baseCommand + cmdDelta)),
      delta:  cmdDelta,
      max:    1000,
    },
    {
      label:  'Team Dispatch Score',
      before: baseTeam,
      after:  Math.min(999, Math.max(300, baseTeam + teamDelta)),
      delta:  teamDelta,
      max:    1000,
    },
    {
      label:  'Bridge Efficiency',
      before: baseBridge,
      after:  Math.min(999, Math.max(300, baseBridge + bridgeDelta)),
      delta:  bridgeDelta,
      max:    1000,
    },
  ]
}

// ─── Coach's note ─────────────────────────────────────────────────────────────

export interface CoachNote {
  positives: string[]
  improvements: string[]
  closing: string
}

export function generateCoachNote(incident: Incident, kpis: DebriefKpis, phases: PhaseDuration[]): CoachNote {
  const baseline = SEVERITY_BASELINES[incident.severity]
  const positives:    string[] = []
  const improvements: string[] = []

  // MTTR
  if (kpis.mttrMin !== null) {
    if (kpis.mttrMin <= baseline.mttrMin * 0.85)
      positives.push(`Recovery time was ${baseline.mttrMin - kpis.mttrMin} minutes under the ${incident.severity} baseline — that's a strong finish.`)
    else if (kpis.mttrMin > baseline.mttrMin * 1.3)
      improvements.push(`Total duration ran ${kpis.mttrMin - baseline.mttrMin}m over the ${incident.severity} baseline. Look at which phase held the clock.`)
  }

  // First update timing
  if (kpis.firstUpdateMin !== null) {
    if (kpis.firstUpdateMin <= baseline.firstUpdateMin * 0.8)
      positives.push(`First stakeholder update was out in ${kpis.firstUpdateMin} minutes — ahead of target. Stakeholders were never in the dark.`)
    else if (kpis.firstUpdateMin > baseline.firstUpdateMin)
      improvements.push(`First milestone posted at ${kpis.firstUpdateMin}m — target is ${baseline.firstUpdateMin}m for ${incident.severity}. The first comms window is the one stakeholders notice most.`)
  }

  // Recovery tracks
  const trackRate = kpis.trackCount > 0 ? kpis.trackSuccessful / kpis.trackCount : 0
  if (kpis.trackCount >= 2 && trackRate >= 0.75)
    positives.push(`${kpis.trackSuccessful} of ${kpis.trackCount} recovery tracks closed successfully. Multiple parallel tracks coordinated well.`)
  else if (kpis.trackCount === 0)
    improvements.push(`No recovery tracks were opened. Even a single track helps the team stay organized under a named hypothesis.`)

  // Hypothesis work
  if (kpis.hypothesesValidated > 0)
    positives.push(`${kpis.hypothesesValidated} hypothesis${kpis.hypothesesValidated > 1 ? 'es' : ''} validated — structured thinking on the fireground.`)

  // Phase discipline
  const slowPhases = phases.filter(p => p.status === 'slow')
  const fastPhases = phases.filter(p => p.status === 'fast')
  if (fastPhases.length >= 4 && slowPhases.length <= 1)
    positives.push(`Phase cadence was tight — ${fastPhases.length} phases ran under target.`)
  if (slowPhases.length >= 2)
    improvements.push(`Phase${slowPhases.length > 1 ? 's' : ''} ${slowPhases.map(p => p.label).join(' and ')} ran over target. Worth reviewing whether those pauses were strategic or drift.`)

  // Updates posted
  if (kpis.updatesPosted >= 4)
    positives.push(`${kpis.updatesPosted} status updates posted — solid comms cadence throughout.`)
  else if (kpis.updatesPosted <= 1)
    improvements.push(`Only ${kpis.updatesPosted} status update${kpis.updatesPosted !== 1 ? 's' : ''} logged. Comms cadence is the first thing stakeholders notice during a long incident.`)

  // Teams dispatched
  if (kpis.teamsPaged >= baseline.dispatches && incident.teamPages.filter(p => p.arrivedAt).length >= kpis.teamsPaged * 0.8)
    positives.push(`All dispatched teams acknowledged and on scene — clean dispatch execution.`)

  // Trim to reasonable size
  const pos = positives.slice(0, 3)
  const imp = improvements.slice(0, 2)

  // Generate closing
  const closing = (() => {
    const won = incident.status === 'Resolved'
    const severity = incident.severity

    if (!won) return `Incident still active at debrief time — check back when it closes.`

    if (pos.length > imp.length) {
      return severity === 'Critical'
        ? `A Critical closed. That's never easy, and this one closed cleaner than most. The work to do is on the margins — the stuff that turns good response into excellent response.`
        : `Clean close. Keep doing what worked here — document the patterns that held up and repeat them.`
    } else if (imp.length > pos.length) {
      return severity === 'Critical'
        ? `Criticals expose every gap in the process — that's the point. The items above are specific, actionable, and fixable before the next one comes in.`
        : `Every incident is a practice run. The items above are worth one focused debrief — not to revisit the incident, but to build the habits that make the next one faster.`
    } else {
      return `Solid run. A few things held, a few things to sharpen. That's the job.`
    }
  })()

  return { positives: pos, improvements: imp, closing }
}

// ─── Overall grade ────────────────────────────────────────────────────────────

export type DebriefGrade = 'A' | 'B' | 'C' | 'D'

export function computeGrade(kpis: DebriefKpis, phases: PhaseDuration[], incident: Incident): DebriefGrade {
  const baseline = SEVERITY_BASELINES[incident.severity]
  let score = 100

  if (kpis.mttrMin !== null && kpis.mttrMin > baseline.mttrMin * 1.5) score -= 20
  else if (kpis.mttrMin !== null && kpis.mttrMin > baseline.mttrMin * 1.15) score -= 8

  if (kpis.firstUpdateMin !== null && kpis.firstUpdateMin > baseline.firstUpdateMin * 1.5) score -= 15
  else if (kpis.firstUpdateMin !== null && kpis.firstUpdateMin > baseline.firstUpdateMin) score -= 6

  const slowPhases = phases.filter(p => p.status === 'slow').length
  score -= slowPhases * 7

  if (kpis.trackCount === 0) score -= 10
  if (kpis.updatesPosted <= 1) score -= 10

  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 50) return 'C'
  return 'D'
}

export const GRADE_META: Record<DebriefGrade, { label: string; color: string; border: string }> = {
  A: { label: 'Exceptional',       color: 'text-ops-green',  border: 'border-ops-green/30' },
  B: { label: 'Proficient',        color: 'text-ops-amber',  border: 'border-ops-amber/30' },
  C: { label: 'Developing',        color: 'text-ops-orange', border: 'border-ops-orange/30' },
  D: { label: 'Needs Improvement', color: 'text-ops-red',    border: 'border-ops-red/30'   },
}
