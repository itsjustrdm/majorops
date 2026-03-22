/**
 * MIMViewFocus — "The Runway"
 *
 * Single surface, one thing at a time.
 * The MIM has one job per phase. This view surfaces it.
 *
 * Phase hero (dominant) → Recovery tracks (horizontal) →
 * Compose (always immediate) → Feed → Collapsible context
 *
 * No sidebar. No tabs. No busywork.
 */

import { useState, useRef, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
  ArrowLeft, ChevronRight, Radio, Wrench, Cpu, Shield, CheckCircle,
  Clock, ChevronDown, ChevronUp, Plus, ExternalLink, Pencil,
} from 'lucide-react'
import { WordmarkLogo } from '../components/WordmarkLogo'
import { useIncident } from '../hooks/useIncident'
// ── Inline click-to-edit ──────────────────────────────────────────────────

function ClickEdit({
  value, onSave, placeholder = 'click to set', className = '',
}: {
  value: string
  onSave: (v: string) => void
  placeholder?: string
  className?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(value)
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { if (editing) ref.current?.focus() }, [editing])
  function commit() { onSave(draft.trim()); setEditing(false) }

  if (editing) {
    return (
      <input ref={ref} value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter')  { e.preventDefault(); commit() }
          if (e.key === 'Escape') { setDraft(value); setEditing(false) }
        }}
        className={`w-full bg-ops-bg border border-ops-amber/60 text-ops-text px-2 py-1 focus:outline-none font-body text-sm ${className}`}
        spellCheck={false}
      />
    )
  }
  return (
    <div onClick={() => { setDraft(value); setEditing(true) }}
      title="click to edit"
      className={`group cursor-text flex items-center gap-1 ${className}`}
    >
      <span className={value ? '' : 'opacity-40 italic'}>{value || placeholder}</span>
      <Pencil size={9} strokeWidth={1.5} className="opacity-0 group-hover:opacity-30 transition-opacity shrink-0" />
    </div>
  )
}
import { useElapsed } from '../hooks/useClock'
import { formatDurationWithSeconds, phaseLabel, phaseDescription } from '../lib/utils'
import type { IncidentParticipant, MicroUpdate, TeamPage } from '../types'

// ── Phase guidance (what the MIM should do right now) ─────────────────────

const PHASE_GUIDANCE: Record<number, string> = {
  1: 'Confirm incident scope. Open the bridge. Get eyes on the alert.',
  2: 'Page on-call rotations. Collect initial diagnostic data. Assign recovery path owners.',
  3: 'Determine customer impact scope. Quantify affected users. Identify blast radius.',
  4: 'Post the first stakeholder update. Set next ETA. Confirm external impact status.',
  5: 'Work recovery tracks. Log hypotheses as they form. Narrow the fault domain.',
  6: 'Log every action taken. Track what\'s been applied, by whom, in what order.',
  7: 'Validate recovery across all affected systems. Check each metric against baseline.',
  8: 'Incident closed. Schedule Learning Review within 72 hours. Debrief the MIM team.',
}

// ── Helpers ───────────────────────────────────────────────────────────────

const ROLE_ABBR: Record<string, string> = {
  mim: 'MIM', sre: 'SRE', leader: 'LDR', service_manager: 'SVC',
  customer_ops: 'OPS', validator: 'VAL', responder: 'RSP', observer: 'OBS',
}

const ROLE_COLOR: Record<string, string> = {
  mim: 'text-ops-red', sre: 'text-ops-amber', leader: 'text-ops-orange',
  service_manager: 'text-ops-blue', customer_ops: 'text-ops-blue',
  validator: 'text-ops-green', responder: 'text-ops-dim', observer: 'text-ops-dim',
}

function presenceDotClass(p: IncidentParticipant) {
  if (!p.isOnScene) return 'bg-ops-border'
  if (p.rapidEscalationFlag) return 'bg-ops-orange animate-pulse'
  if (p.isSilent) return 'bg-ops-dim'
  return 'bg-ops-green animate-pulse'
}

function timeHMS(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function MicroIcon({ source }: { source: MicroUpdate['source'] }) {
  if (source === 'bridge') return <Radio  size={11} strokeWidth={1.5} className="text-ops-amber shrink-0 mt-0.5" />
  if (source === 'tool')   return <Wrench size={11} strokeWidth={1.5} className="text-ops-blue  shrink-0 mt-0.5" />
  return                          <Cpu    size={11} strokeWidth={1.5} className="text-ops-dim   shrink-0 mt-0.5" />
}

function sourceColor(source: MicroUpdate['source']) {
  if (source === 'bridge') return 'text-ops-amber'
  if (source === 'tool')   return 'text-ops-blue'
  return 'text-ops-dim'
}

function dispatchStatus(page: TeamPage): { text: string; cls: string } {
  if (page.arrivedAt) return { text: 'on scene', cls: 'text-ops-green' }
  const mins = (Date.now() - new Date(page.pagedAt).getTime()) / 60000
  if (mins > 5) return { text: `${Math.floor(mins)}m overdue`, cls: 'text-ops-orange' }
  return { text: `${Math.floor(mins)}m`, cls: 'text-ops-amber' }
}

// ── View switcher ─────────────────────────────────────────────────────────

function ViewSwitcher({ incidentId }: { incidentId: number }) {
  return (
    <div className="flex items-center gap-0 border border-ops-border">
      <Link
        to={`/admin/incidents/${incidentId}`}
        className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-ops-dim hover:text-ops-text hover:bg-ops-muted transition-colors"
      >Classic</Link>
      <Link
        to={`/admin/incidents/${incidentId}/terminal`}
        className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-ops-dim hover:text-ops-text hover:bg-ops-muted transition-colors"
      >Terminal</Link>
      <span className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest bg-ops-red text-white">
        Focus
      </span>
      <Link
        to={`/admin/incidents/${incidentId}/review`}
        className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-ops-amber/70 hover:text-ops-amber hover:bg-ops-muted transition-colors"
      >Review</Link>
      <Link
        to={`/admin/incidents/${incidentId}/debrief`}
        className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-ops-green/60 hover:text-ops-green hover:bg-ops-muted transition-colors"
      >Debrief</Link>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function MIMViewFocus() {
  const { id } = useParams<{ id: string }>()
  const {
    incident, advancePhase, postMicroUpdate, markTeamArrived, addRecoveryPath, updatePathBet,
  } = useIncident(Number(id))

  const impactElapsed = useElapsed(incident?.alert.issueTime ?? new Date().toISOString())
  const phaseElapsed  = useElapsed(incident?.phaseEnteredAt  ?? new Date().toISOString())

  const [draft, setDraft]               = useState('')
  const [selectedPath, setSelectedPath] = useState<string>('all')
  const [logged, setLogged]             = useState(false)
  const [dispatchOpen, setDispatchOpen] = useState(false)
  const [presenceOpen, setPresenceOpen] = useState(false)

  if (!incident) return <Navigate to="/" />

  const isCritical  = incident.severity === 'Critical'
  const isWartime   = isCritical || incident.severity === 'High'
  const activePaths = incident.recoveryPaths.filter(p => p.status === 'active')
  const pendingPages = incident.teamPages.filter(p => !p.arrivedAt)
  const onScene     = incident.participants.filter(p => p.isOnScene && !p.leftAt)
  const rapEsc      = incident.participants.find(p => p.rapidEscalationFlag && p.isOnScene)

  const sortedUpdates = [...incident.microUpdates]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 12)

  const progressPct = ((incident.phase - 1) / 7) * 100

  const accentBorder = isCritical ? 'border-ops-red/30' : 'border-ops-amber/30'
  const accentBg     = isCritical ? 'bg-ops-red/5'      : 'bg-ops-amber/5'
  const accentText   = isCritical ? 'text-ops-red'      : 'text-ops-amber'
  const accentBar    = isCritical ? 'bg-ops-red'         : 'bg-ops-amber'

  function handlePost() {
    if (!draft.trim()) return
    postMicroUpdate(draft.trim(), selectedPath === 'all' ? null : selectedPath)
    setDraft('')
    setLogged(true)
    setTimeout(() => setLogged(false), 2000)
  }

  return (
    <div className="min-h-screen bg-ops-bg text-ops-text pb-10">

      {/* ── Sticky compact header ─────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-ops-border bg-ops-bg/95 backdrop-blur-sm px-6 py-2.5 flex items-center justify-between">

        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="text-ops-dim hover:text-ops-text transition-colors shrink-0">
            <ArrowLeft size={13} strokeWidth={1.5} />
          </Link>
          <WordmarkLogo wartime={isWartime} size="sm" />
          <div className="h-4 w-px bg-ops-border shrink-0" />

          {/* Compressed vitals */}
          <span className="font-mono text-[10px] text-ops-dim hidden sm:block">
            #{incident.id} · Ph.{incident.phase} ·{' '}
            {incident.alert.customerCount > 0
              ? `${incident.alert.customerCount.toLocaleString()} users · ${formatDurationWithSeconds(impactElapsed)}`
              : 'no confirmed impact'
            }
          </span>

          {/* Presence dots */}
          <div className="flex items-center gap-1 ml-1">
            {onScene.slice(0, 8).map(p => (
              <div
                key={p.userId}
                title={`${p.displayName} [${p.role}]`}
                className={`h-2 w-2 rounded-full ${presenceDotClass(p)}`}
              />
            ))}
            {onScene.length > 8 && (
              <span className="font-mono text-[9px] text-ops-dim">+{onScene.length - 8}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {incident.bridgeUrl && (
            <a
              href={incident.bridgeUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 font-mono text-[9px] text-ops-dim hover:text-ops-text border border-ops-border px-2 py-1 transition-colors"
            >
              <ExternalLink size={9} strokeWidth={1.5} />
              Bridge
            </a>
          )}
          <ViewSwitcher incidentId={incident.id} />
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

        {/* Rapid escalation */}
        {rapEsc && (
          <div className="flex items-center gap-2.5 border border-ops-orange/30 bg-ops-orange/5 px-4 py-2.5">
            <Shield size={12} strokeWidth={1.5} className="text-ops-orange shrink-0" />
            <span className="font-mono text-[11px] text-ops-orange">
              {rapEsc.displayName} is on bridge — rapid escalation is available upon request.
            </span>
          </div>
        )}

        {/* ── Phase hero ────────────────────────────────────────────── */}
        <div className={`border ${accentBorder} ${accentBg} px-6 py-6`}>
          <div className="flex items-start gap-6">
            <div className="flex-1 min-w-0">

              {/* Phase label */}
              <div className={`font-mono text-[10px] uppercase tracking-widest ${accentText} mb-2`}>
                Phase {incident.phase} of 8
              </div>

              {/* Phase name */}
              <h1 className="font-display text-4xl font-900 uppercase tracking-widest text-ops-text leading-none mb-2">
                {phaseLabel(incident.phase)}
              </h1>

              {/* Description */}
              <p className="font-body text-sm text-ops-dim mb-4">{phaseDescription(incident.phase)}</p>

              {/* Progress bar */}
              <div className="h-1 bg-ops-bg overflow-hidden mb-1">
                <div
                  className={`h-full transition-all duration-700 ${accentBar}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between font-mono text-[9px] text-ops-dim mb-5">
                <span>in phase {formatDurationWithSeconds(phaseElapsed)}</span>
                <span>{Math.round(progressPct)}% complete</span>
              </div>

              {/* What to do now */}
              <div className={`border-t ${accentBorder} pt-4`}>
                <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-1">What to do now</div>
                <p className="font-body text-sm text-ops-text">{PHASE_GUIDANCE[incident.phase]}</p>
              </div>
            </div>

            {/* Advance button */}
            {incident.phase < 8 ? (
              <button
                onClick={advancePhase}
                className={`shrink-0 flex flex-col items-center gap-2 border px-5 py-4 font-mono text-[10px] uppercase tracking-widest transition-all hover:scale-[1.02] ${
                  isCritical
                    ? 'border-ops-red text-ops-red hover:bg-ops-red hover:text-white'
                    : 'border-ops-amber text-ops-amber hover:bg-ops-amber hover:text-black'
                }`}
              >
                <ChevronRight size={22} strokeWidth={1.5} />
                <span>Advance</span>
              </button>
            ) : (
              <div className="shrink-0 flex flex-col items-center gap-2 border border-ops-green/30 bg-ops-green/10 px-5 py-4">
                <CheckCircle size={22} strokeWidth={1.5} className="text-ops-green" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-ops-green">Resolved</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Recovery tracks (horizontal scroll) ──────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-4 bg-ops-red shrink-0" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-ops-dim">
              Recovery Tracks
            </span>
            <span className="font-mono text-[10px] text-ops-dim">
              {activePaths.length} active
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {incident.recoveryPaths.map(path => (
              <div
                key={path.id}
                className={`shrink-0 w-52 border px-4 py-4 ${
                  path.status === 'active'
                    ? `${accentBorder} ${accentBg}`
                    : path.status === 'successful'
                    ? 'border-ops-green/20 bg-ops-green/5'
                    : 'border-ops-border bg-ops-muted opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-[9px] uppercase tracking-widest ${
                    path.status === 'active' ? accentText :
                    path.status === 'successful' ? 'text-ops-green' : 'text-ops-dim'
                  }`}>{path.status}</span>
                  <span className={`font-mono text-[9px] ${accentText}`}>Ph.{path.phase}</span>
                </div>
                <div className="font-heading text-sm font-700 text-ops-text mb-1.5">{path.title}</div>
                {/* Inline-editable current bet */}
                <ClickEdit
                  value={path.currentBet}
                  onSave={bet => updatePathBet(path.id, bet)}
                  placeholder="▸ set current bet"
                  className="font-body text-[11px] text-ops-dim leading-snug mb-2"
                />
                <div className="flex items-center gap-3 border-t border-ops-border/30 pt-2 font-mono text-[9px] text-ops-dim">
                  <span>{path.hypotheses.length} hyp.</span>
                  <span className="truncate">{path.owner.split(' ')[0]}</span>
                </div>
              </div>
            ))}

            {/* New track */}
            <button
              onClick={() => addRecoveryPath('New Track', 'MIM')}
              className="shrink-0 w-44 border border-dashed border-ops-border flex flex-col items-center justify-center gap-2 px-4 py-4 text-ops-dim hover:text-ops-text hover:border-ops-text/20 transition-colors"
            >
              <Plus size={18} strokeWidth={1.5} />
              <span className="font-mono text-[9px] uppercase tracking-widest">Open Track</span>
            </button>
          </div>
        </div>

        {/* ── Compose ───────────────────────────────────────────────── */}
        <div className="border border-ops-border bg-ops-surface">
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault()
                handlePost()
              }
            }}
            placeholder="What's happening right now? Tag a track or log incident-wide. (Ctrl+Enter)"
            className="w-full bg-transparent text-sm text-ops-text placeholder:text-ops-dim resize-none px-4 py-4 focus:outline-none font-body leading-relaxed"
            rows={3}
          />
          <div className="border-t border-ops-border px-4 py-2.5 flex items-center justify-between bg-ops-muted">
            <div className="flex items-center gap-2">
              <Radio size={10} strokeWidth={1.5} className="text-ops-amber" />
              <select
                value={selectedPath}
                onChange={e => setSelectedPath(e.target.value)}
                className="bg-transparent font-mono text-[10px] text-ops-dim border border-ops-border px-2 py-0.5 focus:outline-none focus:border-ops-amber/50"
              >
                <option value="all">All tracks</option>
                {activePaths.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
              <span className="hidden sm:block font-mono text-[9px] text-ops-dim/50">ctrl+↵ to post</span>
            </div>
            <button
              onClick={handlePost}
              disabled={!draft.trim()}
              className={`px-5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors disabled:opacity-30 ${
                logged
                  ? 'bg-ops-green text-black'
                  : 'bg-ops-amber text-black hover:bg-ops-amber/80'
              }`}
            >
              {logged ? '✓ Logged' : 'Log Update'}
            </button>
          </div>
        </div>

        {/* ── Update feed ───────────────────────────────────────────── */}
        {sortedUpdates.length > 0 && (
          <div className="space-y-4">
            {sortedUpdates.map(u => (
              <div key={u.id} className="flex gap-3 group">
                <MicroIcon source={u.source} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-mono text-[9px] uppercase tracking-widest ${sourceColor(u.source)}`}>
                      {u.source}
                    </span>
                    <span className="font-mono text-[9px] text-ops-dim tabular-nums">
                      {timeHMS(u.timestamp)}
                    </span>
                    {u.recoveryPathId && (
                      <span className="font-mono text-[9px] text-ops-dim">
                        · {incident.recoveryPaths.find(p => p.id === u.recoveryPathId)?.title ?? 'track'}
                      </span>
                    )}
                  </div>
                  <p className="font-body text-sm text-ops-text leading-relaxed">{u.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Collapsible: Dispatch ─────────────────────────────────── */}
        {incident.teamPages.length > 0 && (
          <div className="border border-ops-border">
            <button
              onClick={() => setDispatchOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ops-dim hover:text-ops-text transition-colors"
            >
              <div className="flex items-center gap-3">
                <span>Dispatch</span>
                <span className="text-ops-text">{incident.teamPages.length} teams</span>
                {pendingPages.length > 0 && (
                  <span className="text-ops-amber">{pendingPages.length} pending</span>
                )}
                {pendingPages.length > 0 && (
                  <div className="h-1.5 w-1.5 rounded-full bg-ops-amber animate-pulse" />
                )}
              </div>
              {dispatchOpen ? <ChevronUp size={12} strokeWidth={1.5} /> : <ChevronDown size={12} strokeWidth={1.5} />}
            </button>

            {dispatchOpen && (
              <div className="border-t border-ops-border px-4 py-4 space-y-3">
                {incident.teamPages.map(page => {
                  const { text, cls } = dispatchStatus(page)
                  return (
                    <div key={page.id} className="flex items-center gap-3">
                      {page.arrivedAt
                        ? <CheckCircle size={12} strokeWidth={1.5} className="text-ops-green shrink-0" />
                        : <Clock       size={12} strokeWidth={1.5} className="text-ops-amber shrink-0" />
                      }
                      <span className="font-body text-sm flex-1">{page.teamName}</span>
                      {page.contactName && (
                        <span className="font-mono text-[10px] text-ops-dim">{page.contactName}</span>
                      )}
                      <span className={`font-mono text-[10px] ${cls}`}>{text}</span>
                      {!page.arrivedAt && (
                        <button
                          onClick={() => markTeamArrived(page.id)}
                          className="font-mono text-[9px] text-ops-dim border border-ops-border px-2 py-0.5 hover:text-ops-text hover:border-ops-text/20 transition-colors"
                        >
                          arrived
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Collapsible: Presence ─────────────────────────────────── */}
        <div className="border border-ops-border">
          <button
            onClick={() => setPresenceOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ops-dim hover:text-ops-text transition-colors"
          >
            <div className="flex items-center gap-3">
              <span>On Bridge</span>
              <span className="text-ops-text">{onScene.length} participants</span>
            </div>
            {presenceOpen ? <ChevronUp size={12} strokeWidth={1.5} /> : <ChevronDown size={12} strokeWidth={1.5} />}
          </button>

          {presenceOpen && (
            <div className="border-t border-ops-border px-4 py-4 space-y-2.5">
              {incident.participants
                .filter(p => !p.leftAt)
                .map(p => (
                  <div key={p.userId} className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${presenceDotClass(p)}`} />
                    <span className={`font-body text-sm flex-1 ${!p.isOnScene ? 'text-ops-dim line-through' : ''}`}>
                      {p.displayName}
                    </span>
                    {p.isSilent && (
                      <span className="font-mono text-[9px] text-ops-dim">silent</span>
                    )}
                    <span className={`font-mono text-[9px] ${ROLE_COLOR[p.role] ?? 'text-ops-dim'}`}>
                      {ROLE_ABBR[p.role] ?? p.role.toUpperCase()}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
