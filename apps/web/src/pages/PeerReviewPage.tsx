/**
 * PeerReviewPage — Peer MIM Quality Review
 *
 * A structured, repeatable scorecard completed by a peer MIM after incident close.
 * Covers 8 competency domains. Produces a locked review record with a PR-{id} identifier.
 *
 * Route: /admin/incidents/:id/review
 */

import { useState, useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle, XCircle, ChevronRight,
  ClipboardCheck, Lock, Radio,
} from 'lucide-react'
import { WordmarkLogo } from '../components/WordmarkLogo'
import { useIncident } from '../hooks/useIncident'
import { phaseLabel } from '../lib/utils'

// ─── Domain definitions ───────────────────────────────────────────────────────

interface Criterion {
  id: string
  text: string
}

interface Domain {
  id: string
  code: string          // e.g. "C1"
  label: string
  description: string
  criteria: Criterion[]
}

const DOMAINS: Domain[] = [
  {
    id: 'command',
    code: 'C1',
    label: 'Command Presence',
    description: 'Did the MIM establish and hold bridge authority? The MIM coordinates — they do not fix. The bridge should have a clear owner.',
    criteria: [
      { id: 'cmd-1', text: 'MIM opened and formally declared the bridge' },
      { id: 'cmd-2', text: 'MIM held Information Authority — did not cede the floor without deliberate transfer' },
      { id: 'cmd-3', text: 'SMEs were directed, not self-organizing' },
      { id: 'cmd-4', text: 'MIM stayed command-focused, not hands-on-keyboard' },
    ],
  },
  {
    id: 'phase',
    code: 'C2',
    label: 'Phase Discipline',
    description: 'Were phases advanced with clear reasoning? Phase transitions should be deliberate, not automatic.',
    criteria: [
      { id: 'ph-1', text: 'Each phase transition was explicitly stated on the bridge' },
      { id: 'ph-2', text: 'No phase skipped without justification' },
      { id: 'ph-3', text: 'Phase regressions (if any) were recognized and named' },
    ],
  },
  {
    id: 'airtime',
    code: 'C3',
    label: 'Air Time Discipline',
    description: 'Bridge communication follows CAN: Conditions, Actions, Needs. Every word is a shared resource.',
    criteria: [
      { id: 'at-1', text: 'Bridge updates followed CAN format — no speculation without labeling' },
      { id: 'at-2', text: 'Open Air Rule enforced — unanswered questions were explicitly parked with a name and a time' },
      { id: 'at-3', text: 'No extended social conversation or repeated information during active response' },
    ],
  },
  {
    id: 'escalation',
    code: 'C4',
    label: 'Escalation Judgment',
    description: 'Right team, right time. Guardian of Service applies: page now, de-escalate later if needed.',
    criteria: [
      { id: 'esc-1', text: 'No evidence of escalation hesitation given incident scope' },
      { id: 'esc-2', text: 'No over-escalation — teams paged were relevant to the recovery' },
      { id: 'esc-3', text: 'Timebox was set before handing off to each responder' },
    ],
  },
  {
    id: 'comms',
    code: 'C5',
    label: 'Stakeholder Communication',
    description: 'Milestones are what executives and stakeholders see. They must be timely, accurate, and CAN-structured.',
    criteria: [
      { id: 'com-1', text: 'First stakeholder update posted at or before Phase 4' },
      { id: 'com-2', text: 'Updates contained Conditions, Actions, and next ETA' },
      { id: 'com-3', text: 'No speculation or unconfirmed impact in public milestones' },
    ],
  },
  {
    id: 'tracks',
    code: 'C6',
    label: 'Recovery Track Management',
    description: 'Each recovery track needs an owner, a timebox, and a current bet. Tracks should open fast and close with a stated outcome.',
    criteria: [
      { id: 'trk-1', text: 'Recovery tracks were opened within Phase 2' },
      { id: 'trk-2', text: 'Each track had a named owner and a working hypothesis' },
      { id: 'trk-3', text: 'Closed tracks were explicitly resolved — not left open by inertia' },
    ],
  },
  {
    id: 'record',
    code: 'C7',
    label: 'Incident Record Quality',
    description: 'The fireground log must be complete enough to build the After Action without calling anyone. If it was not logged, it did not happen.',
    criteria: [
      { id: 'rec-1', text: 'Micro-updates were logged throughout the incident, not reconstructed after' },
      { id: 'rec-2', text: 'Timeline reflects the actual sequence of events' },
      { id: 'rec-3', text: 'Command team was filled and accurate throughout' },
      { id: 'rec-4', text: 'Alert info (customer count, impact status) was kept current' },
    ],
  },
  {
    id: 'closeout',
    code: 'C8',
    label: 'Close-Out Readiness',
    description: 'The incident is not over when the outage is over. The After Action and Learning Review are part of the response.',
    criteria: [
      { id: 'cls-1', text: 'Resolution milestone was posted with a confirmed close statement' },
      { id: 'cls-2', text: 'After Action scheduled within 24 hours of close' },
      { id: 'cls-3', text: 'All recovery tracks closed with outcomes logged' },
    ],
  },
]

// ─── Overall assessment options ────────────────────────────────────────────────

type Assessment = 'exceptional' | 'proficient' | 'developing' | 'needs-improvement'

const ASSESSMENT_OPTIONS: { value: Assessment; label: string; color: string }[] = [
  { value: 'exceptional',       label: 'Exceptional',        color: 'text-ops-green' },
  { value: 'proficient',        label: 'Proficient',         color: 'text-ops-amber' },
  { value: 'developing',        label: 'Developing',         color: 'text-ops-orange' },
  { value: 'needs-improvement', label: 'Needs Improvement',  color: 'text-ops-red'   },
]

// ─── Signal rating (1–5 horizontal bars) ─────────────────────────────────────

function SignalRating({
  value,
  onChange,
  locked,
}: {
  value: number
  onChange: (v: number) => void
  locked: boolean
}) {
  const [hovered, setHovered] = useState(0)
  const fill = locked ? value : (hovered || value)

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          disabled={locked}
          onMouseEnter={() => !locked && setHovered(n)}
          onMouseLeave={() => !locked && setHovered(0)}
          onClick={() => !locked && onChange(n)}
          className={`h-4 w-7 transition-colors ${
            n <= fill
              ? value === 0 && !hovered
                ? 'bg-ops-border'
                : n <= (hovered || value)
                  ? n >= 4 ? 'bg-ops-green' : n >= 3 ? 'bg-ops-amber' : 'bg-ops-orange'
                  : 'bg-ops-border'
              : 'bg-ops-border'
          } ${locked ? 'cursor-default' : 'cursor-pointer hover:opacity-80'}`}
        />
      ))}
      <span className="font-mono text-[10px] text-ops-dim ml-1">
        {value === 0 ? '–/5' : `${value}/5`}
      </span>
    </div>
  )
}

// ─── Y/N toggle ───────────────────────────────────────────────────────────────

type BoolAnswer = true | false | null

function YNToggle({
  value,
  onChange,
  locked,
}: {
  value: BoolAnswer
  onChange: (v: BoolAnswer) => void
  locked: boolean
}) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        disabled={locked}
        onClick={() => !locked && onChange(value === true ? null : true)}
        className={`flex items-center gap-1 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest border transition-colors ${
          value === true
            ? 'bg-ops-green/15 border-ops-green/50 text-ops-green'
            : 'border-ops-border text-ops-dim hover:border-ops-green/30 hover:text-ops-green/60'
        } ${locked ? 'cursor-default' : 'cursor-pointer'}`}
      >
        <CheckCircle size={10} strokeWidth={1.5} />
        Y
      </button>
      <button
        disabled={locked}
        onClick={() => !locked && onChange(value === false ? null : false)}
        className={`flex items-center gap-1 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest border transition-colors ${
          value === false
            ? 'bg-ops-red/15 border-ops-red/50 text-ops-red'
            : 'border-ops-border text-ops-dim hover:border-ops-red/30 hover:text-ops-red/60'
        } ${locked ? 'cursor-default' : 'cursor-pointer'}`}
      >
        <XCircle size={10} strokeWidth={1.5} />
        N
      </button>
    </div>
  )
}

// ─── Domain section ───────────────────────────────────────────────────────────

interface DomainState {
  criteria: Record<string, BoolAnswer>
  signal: number
  notes: string
}

function DomainSection({
  domain,
  state,
  onCriterion,
  onSignal,
  onNotes,
  locked,
}: {
  domain: Domain
  state: DomainState
  onCriterion: (id: string, v: BoolAnswer) => void
  onSignal: (v: number) => void
  onNotes: (v: string) => void
  locked: boolean
}) {
  const answered   = domain.criteria.filter(c => state.criteria[c.id] !== null && state.criteria[c.id] !== undefined)
  const yesCount   = answered.filter(c => state.criteria[c.id] === true).length
  const totalCrit  = domain.criteria.length
  const pctPass    = answered.length > 0 ? Math.round((yesCount / totalCrit) * 100) : null

  return (
    <div className="border border-ops-border bg-ops-surface">
      {/* Section header */}
      <div className="flex items-start justify-between gap-4 border-b border-ops-border px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] text-ops-red uppercase tracking-widest">{domain.code}</span>
            <div className="h-3 w-px bg-ops-border" />
            <h3 className="font-heading text-sm font-700 uppercase tracking-wide text-ops-text">{domain.label}</h3>
          </div>
          <p className="font-body text-[12px] text-ops-dim leading-relaxed">{domain.description}</p>
        </div>
        {/* Section score indicator */}
        <div className="shrink-0 text-right">
          {pctPass !== null ? (
            <div className={`font-mono text-lg font-700 tabular-nums ${
              pctPass >= 80 ? 'text-ops-green' :
              pctPass >= 60 ? 'text-ops-amber' :
              'text-ops-orange'
            }`}>
              {pctPass}%
            </div>
          ) : (
            <div className="font-mono text-lg text-ops-border">—</div>
          )}
          <div className="font-mono text-[9px] text-ops-dim uppercase tracking-widest">criteria</div>
        </div>
      </div>

      {/* Criteria checklist */}
      <div className="px-5 py-4 space-y-3">
        {domain.criteria.map(criterion => (
          <div key={criterion.id} className="flex items-start gap-3">
            <YNToggle
              value={state.criteria[criterion.id] ?? null}
              onChange={v => onCriterion(criterion.id, v)}
              locked={locked}
            />
            <p className={`font-body text-[13px] leading-snug pt-0.5 ${
              state.criteria[criterion.id] === true  ? 'text-ops-text' :
              state.criteria[criterion.id] === false ? 'text-ops-dim line-through' :
              'text-ops-dim'
            }`}>
              {criterion.text}
            </p>
          </div>
        ))}
      </div>

      {/* Signal + notes */}
      <div className="border-t border-ops-border px-5 py-4 space-y-3">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-ops-dim uppercase tracking-widest w-12">Signal</span>
          <SignalRating value={state.signal} onChange={onSignal} locked={locked} />
        </div>

        <div className="flex items-start gap-4">
          <span className="font-mono text-[10px] text-ops-dim uppercase tracking-widest w-12 pt-2">Notes</span>
          {locked ? (
            <p className="font-body text-[12px] text-ops-dim leading-relaxed flex-1 min-h-[1.5rem]">
              {state.notes || <span className="opacity-40 italic">no notes recorded</span>}
            </p>
          ) : (
            <textarea
              value={state.notes}
              onChange={e => onNotes(e.target.value)}
              placeholder="Observations, specific examples, context..."
              rows={2}
              className="flex-1 bg-ops-bg border border-ops-border text-ops-text placeholder:text-ops-dim/40 font-body text-[12px] px-3 py-2 resize-none focus:outline-none focus:border-ops-amber/40 transition-colors leading-relaxed"
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Composite score ───────────────────────────────────────────────────────────

function computeScore(domains: Domain[], states: Record<string, DomainState>): number | null {
  let totalCriteria = 0
  let yesCriteria   = 0
  let totalSignal   = 0
  let signalCount   = 0

  for (const domain of domains) {
    for (const c of domain.criteria) {
      const v = states[domain.id]?.criteria[c.id]
      if (v !== null && v !== undefined) {
        totalCriteria++
        if (v === true) yesCriteria++
      }
    }
    const sig = states[domain.id]?.signal
    if (sig && sig > 0) {
      totalSignal += sig
      signalCount++
    }
  }

  if (totalCriteria === 0 && signalCount === 0) return null

  const criteriaScore = totalCriteria > 0 ? (yesCriteria / totalCriteria) * 100 : 50
  const signalScore   = signalCount   > 0 ? (totalSignal / signalCount / 5) * 100 : criteriaScore

  return Math.round((criteriaScore * 0.6) + (signalScore * 0.4))
}

function scoreLabel(score: number): { label: string; color: string } {
  if (score >= 88) return { label: 'Exceptional',       color: 'text-ops-green'  }
  if (score >= 72) return { label: 'Proficient',        color: 'text-ops-amber'  }
  if (score >= 55) return { label: 'Developing',        color: 'text-ops-orange' }
  return               { label: 'Needs Improvement',  color: 'text-ops-red'    }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function makeInitialState(domains: Domain[]): Record<string, DomainState> {
  const state: Record<string, DomainState> = {}
  for (const domain of domains) {
    state[domain.id] = {
      criteria: Object.fromEntries(domain.criteria.map(c => [c.id, null])),
      signal: 0,
      notes: '',
    }
  }
  return state
}

export default function PeerReviewPage() {
  const { id } = useParams<{ id: string }>()
  const { incident } = useIncident(Number(id))

  const [domainStates, setDomainStates] = useState<Record<string, DomainState>>(
    () => makeInitialState(DOMAINS)
  )
  const [reviewer, setReviewer]         = useState('')
  const [assessment, setAssessment]     = useState<Assessment | ''>('')
  const [narrative, setNarrative]       = useState('')
  const [submitted, setSubmitted]       = useState(false)
  const [submitTime, setSubmitTime]     = useState<string | null>(null)
  const [reviewId] = useState(() => `PR-${String(Math.floor(Math.random() * 9000) + 1000)}`)

  const score = useMemo(() => computeScore(DOMAINS, domainStates), [domainStates])
  const autoLabel = score !== null ? scoreLabel(score) : null

  // Count completion
  const totalCriteria = DOMAINS.flatMap(d => d.criteria).length
  const answeredCriteria = DOMAINS.flatMap(d => d.criteria)
    .filter(c => {
      const v = domainStates[DOMAINS.find(dom => dom.criteria.includes(c))!.id].criteria[c.id]
      return v !== null && v !== undefined
    }).length
  const domainsWithSignal = DOMAINS.filter(d => domainStates[d.id].signal > 0).length
  const completionPct = Math.round(((answeredCriteria / totalCriteria) * 0.7 + (domainsWithSignal / DOMAINS.length) * 0.3) * 100)

  const canSubmit = !submitted && reviewer.trim() && assessment && narrative.trim() &&
    answeredCriteria >= Math.ceil(totalCriteria * 0.8)

  function handleCriterion(domainId: string, criterionId: string, value: BoolAnswer) {
    setDomainStates(prev => ({
      ...prev,
      [domainId]: {
        ...prev[domainId],
        criteria: { ...prev[domainId].criteria, [criterionId]: value },
      },
    }))
  }

  function handleSignal(domainId: string, value: number) {
    setDomainStates(prev => ({
      ...prev,
      [domainId]: { ...prev[domainId], signal: value },
    }))
  }

  function handleNotes(domainId: string, value: string) {
    setDomainStates(prev => ({
      ...prev,
      [domainId]: { ...prev[domainId], notes: value },
    }))
  }

  function handleSubmit() {
    if (!canSubmit) return
    setSubmitted(true)
    setSubmitTime(new Date().toISOString())
  }

  if (!incident) return <Navigate to="/" />

  const hasWartime = incident.severity === 'Critical' || incident.severity === 'High'

  return (
    <div className="min-h-screen bg-ops-bg text-ops-text font-body">

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-ops-border bg-ops-bg px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link to={`/admin/incidents/${incident.id}`} className="text-ops-dim hover:text-ops-text transition-colors shrink-0">
            <ArrowLeft size={13} strokeWidth={1.5} />
          </Link>
          <WordmarkLogo wartime={hasWartime} size="sm" />
          <div className="h-4 w-px bg-ops-border shrink-0" />
          <div className="font-mono text-[11px] text-ops-dim truncate">
            INC-{incident.id} · Peer Review
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {/* View switcher — shows Review as active */}
          <div className="flex items-center border border-ops-border">
            <Link to={`/admin/incidents/${incident.id}`}
              className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-ops-dim hover:text-ops-text hover:bg-ops-muted transition-colors">
              Classic
            </Link>
            <Link to={`/admin/incidents/${incident.id}/terminal`}
              className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-ops-dim hover:text-ops-text hover:bg-ops-muted transition-colors border-l border-ops-border">
              Terminal
            </Link>
            <Link to={`/admin/incidents/${incident.id}/focus`}
              className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-ops-dim hover:text-ops-text hover:bg-ops-muted transition-colors border-l border-ops-border">
              Focus
            </Link>
            <span className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest bg-ops-amber text-black border-l border-ops-border">
              Review
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        {/* ── Review identity bar ────────────────────────────────────────── */}
        <div className="border border-ops-border bg-ops-surface px-5 py-4">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-1">Review ID</div>
              <div className="font-mono text-sm text-ops-amber">{reviewId}</div>
            </div>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-1">Incident</div>
              <div className="font-mono text-sm text-ops-text">INC-{incident.id}</div>
            </div>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-1">MIM Reviewed</div>
              <div className="font-mono text-sm text-ops-text">{incident.command.mim || '—'}</div>
            </div>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-1">Phase at Close</div>
              <div className="font-mono text-sm text-ops-text">{incident.phase}/8 · {phaseLabel(incident.phase)}</div>
            </div>
          </div>
        </div>

        {/* ── Completion + score strip ───────────────────────────────────── */}
        <div className="flex items-center gap-4 px-0">
          {/* Progress bar */}
          <div className="flex-1">
            <div className="flex items-center justify-between font-mono text-[9px] text-ops-dim mb-1.5">
              <span>Completion</span>
              <span>{completionPct}%</span>
            </div>
            <div className="h-1 bg-ops-muted overflow-hidden">
              <div
                className="h-full bg-ops-amber transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>

          {/* Live composite score */}
          <div className="shrink-0 text-right">
            {score !== null ? (
              <>
                <div className={`font-mono text-2xl font-700 tabular-nums leading-none ${autoLabel!.color}`}>
                  {score}
                </div>
                <div className={`font-mono text-[9px] uppercase tracking-widest ${autoLabel!.color}`}>
                  {autoLabel!.label}
                </div>
              </>
            ) : (
              <>
                <div className="font-mono text-2xl text-ops-border">—</div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim">Score</div>
              </>
            )}
          </div>
        </div>

        {/* ── Submitted banner ──────────────────────────────────────────────── */}
        {submitted && submitTime && (
          <div className="flex items-center gap-3 border border-ops-green/30 bg-ops-green/10 px-5 py-4">
            <Lock size={14} strokeWidth={1.5} className="text-ops-green shrink-0" />
            <div className="flex-1">
              <div className="font-heading text-sm font-700 uppercase tracking-wide text-ops-green">
                Review Submitted · {reviewId}
              </div>
              <div className="font-mono text-[11px] text-ops-green/60 mt-0.5">
                Locked by {reviewer} · {new Date(submitTime).toLocaleString()}
              </div>
            </div>
            <Link
              to={`/admin/incidents/${incident.id}`}
              className="flex items-center gap-1.5 font-mono text-[10px] text-ops-dim hover:text-ops-text border border-ops-border px-3 py-1.5 transition-colors"
            >
              Back to Incident
              <ChevronRight size={11} strokeWidth={1.5} />
            </Link>
          </div>
        )}

        {/* ── Domain sections ───────────────────────────────────────────────── */}
        {DOMAINS.map(domain => (
          <DomainSection
            key={domain.id}
            domain={domain}
            state={domainStates[domain.id]}
            onCriterion={(cid, v) => handleCriterion(domain.id, cid, v)}
            onSignal={v => handleSignal(domain.id, v)}
            onNotes={v => handleNotes(domain.id, v)}
            locked={submitted}
          />
        ))}

        {/* ── Overall assessment ────────────────────────────────────────────── */}
        <div className="border border-ops-border bg-ops-surface">
          <div className="border-b border-ops-border px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
              <ClipboardCheck size={13} strokeWidth={1.5} className="text-ops-amber" />
              <h3 className="font-heading text-sm font-700 uppercase tracking-wide text-ops-text">
                Overall Assessment
              </h3>
            </div>
            <p className="font-body text-[12px] text-ops-dim">
              Your overall judgment of this MIM's incident response. Score and signal data inform this — the final call is yours.
            </p>
          </div>

          <div className="px-5 py-5 space-y-5">
            {/* Assessment picker */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ops-dim mb-2.5">Performance Level</div>
              <div className="flex gap-2 flex-wrap">
                {ASSESSMENT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    disabled={submitted}
                    onClick={() => !submitted && setAssessment(opt.value)}
                    className={`px-4 py-2 font-mono text-[11px] uppercase tracking-widest border transition-colors ${
                      assessment === opt.value
                        ? `${opt.color} border-current bg-current/10`
                        : 'text-ops-dim border-ops-border hover:border-ops-text/30 hover:text-ops-text'
                    } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {score !== null && assessment === '' && (
                <div className="mt-2 font-mono text-[10px] text-ops-dim">
                  Score suggests: <span className={autoLabel!.color}>{autoLabel!.label}</span>
                </div>
              )}
            </div>

            {/* Narrative */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ops-dim mb-2">
                Narrative — what stood out, what to work on
              </div>
              {submitted ? (
                <p className="font-body text-sm text-ops-text leading-relaxed">{narrative}</p>
              ) : (
                <textarea
                  value={narrative}
                  onChange={e => setNarrative(e.target.value)}
                  placeholder="Specific observations. What would you want to know if you were this MIM reading your review?"
                  rows={5}
                  className="w-full bg-ops-bg border border-ops-border text-ops-text placeholder:text-ops-dim/40 font-body text-sm px-4 py-3 resize-none focus:outline-none focus:border-ops-amber/40 transition-colors leading-relaxed"
                />
              )}
            </div>

            {/* Reviewer signature */}
            <div className="border-t border-ops-border pt-5">
              <div className="font-mono text-[10px] uppercase tracking-widest text-ops-dim mb-2">
                Reviewer (Peer MIM)
              </div>
              {submitted ? (
                <div className="flex items-center gap-2">
                  <Radio size={11} strokeWidth={1.5} className="text-ops-green" />
                  <span className="font-mono text-sm text-ops-text">{reviewer}</span>
                  <span className="font-mono text-[10px] text-ops-dim">· signed</span>
                </div>
              ) : (
                <input
                  type="text"
                  value={reviewer}
                  onChange={e => setReviewer(e.target.value)}
                  placeholder="Your name — this locks the review"
                  className="w-full max-w-xs bg-ops-bg border border-ops-border text-ops-text placeholder:text-ops-dim/40 font-mono text-sm px-3 py-2 focus:outline-none focus:border-ops-amber/40 transition-colors"
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Submit ─────────────────────────────────────────────────────────── */}
        {!submitted && (
          <div className="flex items-center justify-between gap-4 border border-ops-border bg-ops-surface px-5 py-4">
            <div className="font-mono text-[11px] text-ops-dim">
              {canSubmit
                ? 'Review is ready to submit. This action locks the record.'
                : answeredCriteria < Math.ceil(totalCriteria * 0.8)
                  ? `Complete at least ${Math.ceil(totalCriteria * 0.8)} criteria to submit (${answeredCriteria}/${totalCriteria} done)`
                  : !reviewer.trim()
                    ? 'Enter your name to sign and submit'
                    : !assessment
                      ? 'Select a performance level'
                      : 'Add a narrative before submitting'
              }
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex items-center gap-2 px-6 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                canSubmit
                  ? 'bg-ops-amber text-black hover:bg-ops-amber/80 cursor-pointer'
                  : 'bg-ops-muted text-ops-dim cursor-not-allowed'
              }`}
            >
              <Lock size={12} strokeWidth={1.5} />
              Submit Review
            </button>
          </div>
        )}

        {/* spacer for CAD bar */}
        <div className="h-4" />
      </div>
    </div>
  )
}
