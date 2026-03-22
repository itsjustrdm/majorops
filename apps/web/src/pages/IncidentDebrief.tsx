/**
 * IncidentDebrief — The Post-Game Scoreboard
 *
 * Accessible when an incident is at Phase 8 (Resolution) or status Resolved.
 * A peer MIM or the MIM themselves can open this after the incident closes.
 *
 * Sections:
 *   1. Mission Banner — dramatic summary header
 *   2. Key Numbers — 4 KPI cards with baseline delta arrows
 *   3. Phase Breakdown — horizontal bar chart of phase durations
 *   4. Command Scores — Credit Karma–style score reveal with deltas
 *   5. Coach's Note — rule-generated specific feedback
 *   6. Peer Review status
 *
 * Route: /admin/incidents/:id/debrief
 */

import { useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
  ArrowLeft, TrendingUp, TrendingDown, Minus,
  CheckCircle, AlertTriangle, ChevronRight, ClipboardCheck,
} from 'lucide-react'
import { WordmarkLogo } from '../components/WordmarkLogo'
import { useIncident } from '../hooks/useIncident'
import {
  computePhaseDurations, computeKpis, computeCreditScores,
  generateCoachNote, computeGrade, GRADE_META, SEVERITY_BASELINES,
} from '../lib/debrief'
import { phaseLabel } from '../lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtMin(min: number | null): string {
  if (min === null) return '—'
  if (min < 60) return `${min}m`
  return `${Math.floor(min / 60)}h ${min % 60}m`
}

function DeltaBadge({ delta, invertColor = false }: { delta: number; invertColor?: boolean }) {
  const isGood = invertColor ? delta > 0 : delta < 0
  if (delta === 0) return <Minus size={10} strokeWidth={1.5} className="text-ops-dim" />
  const cls = isGood ? 'text-ops-green' : 'text-ops-orange'
  return (
    <span className={`flex items-center gap-0.5 font-mono text-[10px] ${cls}`}>
      {delta < 0 ? <TrendingDown size={10} strokeWidth={1.5} /> : <TrendingUp size={10} strokeWidth={1.5} />}
      {delta > 0 ? '+' : ''}{delta}m
    </span>
  )
}

// ─── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, baseline, unit = '', invertColor = false,
}: {
  label: string
  value: number | null
  baseline: number
  unit?: string
  invertColor?: boolean
}) {
  const delta     = value !== null ? value - baseline : null
  const isGood    = delta !== null ? (invertColor ? delta > 0 : delta < 0) : null
  const valueColor = isGood === null
    ? 'text-ops-dim'
    : isGood ? 'text-ops-green' : value !== null && Math.abs(delta!) / baseline < 0.15 ? 'text-ops-amber' : 'text-ops-orange'

  return (
    <div className="border border-ops-border bg-ops-surface px-5 py-5">
      <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-3">{label}</div>
      <div className={`font-mono text-3xl font-700 tabular-nums leading-none mb-1 ${valueColor}`}>
        {value !== null ? fmtMin(value) : '—'}
        {unit && value !== null && <span className="text-lg ml-1">{unit}</span>}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="font-mono text-[9px] text-ops-dim">vs {fmtMin(baseline)} baseline</span>
        {delta !== null && <DeltaBadge delta={delta} invertColor={invertColor} />}
      </div>
    </div>
  )
}

// ─── Phase bar ────────────────────────────────────────────────────────────────

function PhaseBar({
  phase, label, durationMin, targetMin, status, maxMin,
}: {
  phase: number; label: string; durationMin: number; targetMin: number
  status: 'fast' | 'ok' | 'slow'; maxMin: number
}) {
  const pct     = Math.min(100, (durationMin / maxMin) * 100)
  const targPct = Math.min(100, (targetMin / maxMin) * 100)
  const barColor = status === 'fast' ? 'bg-ops-green' : status === 'ok' ? 'bg-ops-amber' : 'bg-ops-orange'
  const labelColor = status === 'fast' ? 'text-ops-green' : status === 'ok' ? 'text-ops-amber' : 'text-ops-orange'

  return (
    <div className="flex items-center gap-3 group">
      <div className="flex items-center gap-2 w-28 shrink-0">
        <span className="font-mono text-[9px] text-ops-dim w-3">{phase}</span>
        <span className="font-mono text-[10px] text-ops-dim truncate">{label}</span>
      </div>

      <div className="flex-1 relative h-4 bg-ops-muted overflow-hidden">
        {/* Target marker */}
        <div
          className="absolute top-0 bottom-0 w-px bg-ops-border/60 z-10"
          style={{ left: `${targPct}%` }}
        />
        {/* Actual bar */}
        <div
          className={`h-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center gap-2 w-28 shrink-0 justify-end">
        <span className={`font-mono text-[11px] tabular-nums ${labelColor}`}>{fmtMin(durationMin)}</span>
        <span className="font-mono text-[9px] text-ops-dim/50">/{targetMin}m</span>
      </div>
    </div>
  )
}

// ─── Credit score card ────────────────────────────────────────────────────────

function CreditScoreCard({
  label, before, after, delta, max,
}: {
  label: string; before: number; after: number; delta: number; max: number
}) {
  const afterPct  = (after / max) * 100
  const isUp      = delta > 0
  const deltaColor = isUp ? 'text-ops-green' : delta < 0 ? 'text-ops-orange' : 'text-ops-dim'
  const barColor   = afterPct >= 80 ? 'bg-ops-green' : afterPct >= 65 ? 'bg-ops-amber' : 'bg-ops-orange'

  return (
    <div className="border border-ops-border bg-ops-surface px-5 py-5">
      <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-4">{label}</div>

      {/* Score reveal */}
      <div className="flex items-end gap-3 mb-4">
        <div className="font-mono text-4xl font-700 tabular-nums text-ops-text leading-none">{after}</div>
        <div className="flex flex-col pb-0.5 gap-0.5">
          <span className={`flex items-center gap-1 font-mono text-sm font-700 ${deltaColor}`}>
            {isUp ? <TrendingUp size={13} strokeWidth={2} /> : delta < 0 ? <TrendingDown size={13} strokeWidth={2} /> : <Minus size={13} strokeWidth={2} />}
            {delta > 0 ? '+' : ''}{delta}
          </span>
          <span className="font-mono text-[9px] text-ops-dim">from {before}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-ops-muted overflow-hidden mb-1">
        <div
          className={`h-full transition-all duration-1000 ${barColor}`}
          style={{ width: `${afterPct}%` }}
        />
      </div>
      <div className="flex justify-between font-mono text-[9px] text-ops-dim">
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

// ─── View switcher ─────────────────────────────────────────────────────────────

function ViewSwitcher({ incidentId, isResolved }: { incidentId: number; isResolved: boolean }) {
  return (
    <div className="flex items-center border border-ops-border">
      <Link to={`/admin/incidents/${incidentId}`}
        className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-ops-dim hover:text-ops-text hover:bg-ops-muted transition-colors">
        Classic
      </Link>
      <Link to={`/admin/incidents/${incidentId}/terminal`}
        className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-ops-dim hover:text-ops-text hover:bg-ops-muted transition-colors border-l border-ops-border">
        Terminal
      </Link>
      <Link to={`/admin/incidents/${incidentId}/focus`}
        className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-ops-dim hover:text-ops-text hover:bg-ops-muted transition-colors border-l border-ops-border">
        Focus
      </Link>
      <Link to={`/admin/incidents/${incidentId}/review`}
        className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-ops-amber/70 hover:text-ops-amber hover:bg-ops-muted transition-colors border-l border-ops-border">
        Review
      </Link>
      <span className={`px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest border-l border-ops-border ${
        isResolved ? 'bg-ops-green text-black' : 'bg-ops-muted text-ops-dim cursor-not-allowed'
      }`}>
        Debrief
      </span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IncidentDebrief() {
  const { id }       = useParams<{ id: string }>()
  const { incident } = useIncident(Number(id))

  const phases    = useMemo(() => incident ? computePhaseDurations(incident) : [], [incident])
  const kpis      = useMemo(() => incident ? computeKpis(incident)          : null, [incident])
  const scores    = useMemo(() => incident && kpis ? computeCreditScores(incident, kpis) : [], [incident, kpis])
  const coach     = useMemo(() => incident && kpis ? generateCoachNote(incident, kpis, phases) : null, [incident, kpis, phases])
  const grade     = useMemo(() => incident && kpis ? computeGrade(kpis, phases, incident) : null, [incident, kpis, phases])
  const gradeMeta = grade ? GRADE_META[grade] : null

  if (!incident) return <Navigate to="/" />

  const isResolved  = incident.status === 'Resolved' || incident.phase === 8
  const hasWartime  = incident.severity === 'Critical' || incident.severity === 'High'
  const baseline    = SEVERITY_BASELINES[incident.severity]
  const maxPhaseMin = phases.length > 0 ? Math.max(...phases.map(p => p.durationMin)) * 1.15 : 60

  const mttrMin   = kpis?.mttrMin ?? null
  const totalMin  = mttrMin ?? (
    incident.resolvedAt
      ? Math.round((new Date(incident.resolvedAt).getTime() - new Date(incident.detectedAt).getTime()) / 60000)
      : null
  )

  return (
    <div className="min-h-screen bg-ops-bg text-ops-text font-body">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-ops-border bg-ops-bg px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link to={`/admin/incidents/${incident.id}`} className="text-ops-dim hover:text-ops-text transition-colors shrink-0">
            <ArrowLeft size={13} strokeWidth={1.5} />
          </Link>
          <WordmarkLogo wartime={hasWartime} size="sm" />
          <div className="h-4 w-px bg-ops-border shrink-0" />
          <div className="font-mono text-[11px] text-ops-dim truncate">
            INC-{incident.id} · Debrief
          </div>
        </div>
        <ViewSwitcher incidentId={incident.id} isResolved={isResolved} />
      </header>

      {/* Not available yet */}
      {!isResolved && (
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <div className="border border-ops-border bg-ops-surface px-8 py-10">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ops-dim mb-4">Debrief Locked</div>
            <p className="font-body text-sm text-ops-dim leading-relaxed mb-6">
              The Debrief becomes available when the incident reaches Phase 8 (Resolution) or is marked Resolved.
            </p>
            <div className="font-mono text-[10px] text-ops-dim">
              Current: Phase {incident.phase} — {phaseLabel(incident.phase)}
            </div>
          </div>
        </div>
      )}

      {isResolved && (
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

          {/* ── 1. Mission Banner ─────────────────────────────────────────── */}
          <div className={`border-2 ${gradeMeta?.border ?? 'border-ops-green/30'} bg-ops-surface`}>
            <div className={`border-b ${gradeMeta?.border ?? 'border-ops-green/30'} px-6 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <CheckCircle size={16} strokeWidth={1.5} className="text-ops-green" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-ops-green">Incident Closed</span>
              </div>
              {gradeMeta && (
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-3xl font-700 ${gradeMeta.color}`}>{grade}</span>
                  <div>
                    <div className={`font-mono text-[10px] uppercase tracking-widest ${gradeMeta.color}`}>{gradeMeta.label}</div>
                    <div className="font-mono text-[9px] text-ops-dim">overall</div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-6">
              <h1 className="font-heading text-2xl font-700 uppercase tracking-wide text-ops-text mb-1 leading-tight">
                {incident.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ops-dim border border-ops-border px-2 py-0.5">
                  {incident.severity}
                </span>
                <span className="font-mono text-[10px] text-ops-dim">INC-{incident.id}</span>
                {totalMin !== null && (
                  <span className="font-mono text-[10px] text-ops-text">{fmtMin(totalMin)} total</span>
                )}
                {incident.alert.customerCount > 0 && (
                  <span className="font-mono text-[10px] text-ops-dim">
                    {incident.alert.customerCount.toLocaleString()} customers affected
                  </span>
                )}
              </div>

              {/* Command row */}
              <div className="flex flex-wrap gap-6 mt-5 pt-5 border-t border-ops-border/40">
                {Object.entries({
                  MIM:    incident.command.mim,
                  SRE:    incident.command.sre,
                  Leader: incident.command.leader,
                }).map(([role, name]) => name ? (
                  <div key={role}>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-0.5">{role}</div>
                    <div className="font-body text-sm text-ops-text">{name}</div>
                  </div>
                ) : null)}
              </div>
            </div>
          </div>

          {/* ── 2. Key Numbers ────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-4 bg-ops-amber shrink-0" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-ops-dim">The Numbers</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <KpiCard
                label="MTTR"
                value={kpis?.mttrMin ?? null}
                baseline={baseline.mttrMin}
              />
              <KpiCard
                label="MTTM"
                value={kpis?.mttmMin ?? null}
                baseline={baseline.mttmMin}
              />
              <KpiCard
                label="First Update"
                value={kpis?.firstUpdateMin ?? null}
                baseline={baseline.firstUpdateMin}
              />
              <div className="border border-ops-border bg-ops-surface px-5 py-5">
                <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-3">Recovery Tracks</div>
                <div className="font-mono text-3xl font-700 tabular-nums text-ops-text leading-none mb-1">
                  {kpis?.trackSuccessful}/{kpis?.trackCount}
                </div>
                <div className="font-mono text-[9px] text-ops-dim mt-2">successful / opened</div>
              </div>
            </div>
          </div>

          {/* ── 3. Phase Breakdown ────────────────────────────────────────── */}
          {phases.length > 0 && (
            <div className="border border-ops-border bg-ops-surface">
              <div className="flex items-center justify-between border-b border-ops-border px-5 py-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ops-dim">Phase Breakdown</div>
                <div className="flex items-center gap-4 font-mono text-[9px] text-ops-dim">
                  <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 bg-ops-green opacity-70" />fast</span>
                  <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 bg-ops-amber opacity-70" />on track</span>
                  <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 bg-ops-orange opacity-70" />slow</span>
                </div>
              </div>
              <div className="px-5 py-5 space-y-3">
                {phases.map(p => (
                  <PhaseBar key={p.phase} {...p} maxMin={maxPhaseMin} />
                ))}
                <div className="pt-2 border-t border-ops-border/30 font-mono text-[9px] text-ops-dim">
                  Vertical marker shows phase target duration. Bars extending past the marker ran over.
                </div>
              </div>
            </div>
          )}

          {/* ── 4. Command Scores ─────────────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-4 bg-ops-amber shrink-0" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-ops-dim">Command Scores</span>
              <span className="font-mono text-[9px] text-ops-dim/50">rolling average · this incident's contribution</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {scores.map(s => (
                <CreditScoreCard key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* ── 5. Coach's Note ───────────────────────────────────────────── */}
          {coach && (
            <div className="border border-ops-border bg-ops-surface">
              <div className="border-b border-ops-border px-5 py-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ops-dim">Coach's Note</div>
              </div>

              <div className="px-5 py-5">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                  {/* What landed */}
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-ops-green mb-3">
                      What landed
                    </div>
                    {coach.positives.length > 0 ? (
                      <ul className="space-y-3">
                        {coach.positives.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle size={11} strokeWidth={1.5} className="text-ops-green shrink-0 mt-0.5" />
                            <p className="font-body text-[13px] text-ops-text leading-snug">{item}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-body text-[13px] text-ops-dim italic">Nothing flagged positively — check record completeness.</p>
                    )}
                  </div>

                  {/* Work on this */}
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-ops-amber mb-3">
                      Work on this
                    </div>
                    {coach.improvements.length > 0 ? (
                      <ul className="space-y-3">
                        {coach.improvements.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <AlertTriangle size={11} strokeWidth={1.5} className="text-ops-amber shrink-0 mt-0.5" />
                            <p className="font-body text-[13px] text-ops-text leading-snug">{item}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-body text-[13px] text-ops-dim italic">Nothing flagged for improvement this incident.</p>
                    )}
                  </div>
                </div>

                {/* Closing */}
                <div className="border-t border-ops-border pt-5">
                  <p className="font-body text-sm text-ops-dim leading-relaxed italic">
                    "{coach.closing}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── 6. Peer Review ────────────────────────────────────────────── */}
          <div className="border border-ops-border bg-ops-surface px-5 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardCheck size={13} strokeWidth={1.5} className="text-ops-amber" />
                <div className="font-mono text-[10px] uppercase tracking-widest text-ops-dim">Peer Review</div>
              </div>
              <Link
                to={`/admin/incidents/${incident.id}/review`}
                className="flex items-center gap-1.5 font-mono text-[10px] text-ops-amber/80 hover:text-ops-amber border border-ops-amber/30 px-3 py-1.5 transition-colors"
              >
                {true /* mock: no review submitted yet */ ? 'Start Review' : 'View Review'}
                <ChevronRight size={11} strokeWidth={1.5} />
              </Link>
            </div>
            <p className="font-body text-[12px] text-ops-dim mt-3 leading-relaxed">
              No peer review submitted yet for this incident. A certified peer MIM can complete the C1–C8 scorecard at any time after close.
            </p>
          </div>

          {/* Spacer for CAD bar */}
          <div className="h-4" />
        </div>
      )}
    </div>
  )
}
