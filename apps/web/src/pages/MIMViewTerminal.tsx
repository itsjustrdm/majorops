/**
 * MIMViewTerminal — "The Terminal"
 *
 * 3-column fixed-viewport layout. Zero page scroll.
 *
 * CLI-first working surface: type a note, or prefix with / for commands.
 * Click any field to edit it inline — no forms, no modals.
 *
 *   >  Rolling back connection pool        ← plain text = bridge note
 *   >  /advance                            ← advance phase
 *   >  /dispatch "DB SRE"                  ← page on-call team
 *   >  /arrived payments                   ← mark team on scene
 *   >  /track "DB Connection Pool"         ← open recovery track
 *   >  /hyp pool exhausted at 847 conns    ← add hypothesis
 *   >  @db-pool confirmed rollback worked  ← note tagged to track
 *   >  /help                               ← list commands
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
  ArrowLeft, Radio, Wrench, Cpu, ChevronRight,
  CheckCircle, Clock, Shield, Plus, Pencil, Terminal,
  AlertCircle,
} from 'lucide-react'
import { WordmarkLogo } from '../components/WordmarkLogo'
import { useIncident } from '../hooks/useIncident'
import { useElapsed } from '../hooks/useClock'
import { formatDurationWithSeconds, phaseLabel } from '../lib/utils'
import { TEAMS } from '../data/mockData'
import type { IncidentParticipant, MicroUpdate, RecoveryPath, TeamPage } from '../types'

// ── Command registry ──────────────────────────────────────────────────────

const CMD_REGISTRY = [
  { cmd: '/advance',  alias: '/next', usage: '/advance',                 desc: 'Advance incident to next phase' },
  { cmd: '/dispatch', alias: '/d',    usage: '/dispatch <team>',         desc: 'Page team on-call (Box1 default)' },
  { cmd: '/arrived',  alias: '/arr',  usage: '/arrived <team>',          desc: 'Mark team as on scene' },
  { cmd: '/track',    alias: '/t',    usage: '/track <name>',            desc: 'Open new recovery track' },
  { cmd: '/hyp',      alias: '/h',    usage: '/hyp <text>',              desc: 'Add hypothesis to active track' },
  { cmd: '/help',     alias: '/?',    usage: '/help',                    desc: 'List available commands' },
]

// ── Types ─────────────────────────────────────────────────────────────────

type CmdEntry = {
  id: string
  timestamp: string
  kind: 'echo' | 'ok' | 'err' | 'info'
  content: string
}

// Unified feed item — either a micro update or a command entry
type FeedItem =
  | ({ _type: 'update' } & MicroUpdate)
  | ({ _type: 'cmd'    } & CmdEntry)

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
      <input
        ref={ref}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter')  { e.preventDefault(); commit() }
          if (e.key === 'Escape') { setDraft(value); setEditing(false) }
        }}
        className={`w-full bg-ops-bg border border-ops-amber/60 text-ops-text px-1.5 py-0.5 focus:outline-none ${className}`}
        spellCheck={false}
      />
    )
  }

  return (
    <div
      onClick={() => { setDraft(value); setEditing(true) }}
      title="click to edit"
      className={`group cursor-text flex items-center gap-1 ${className}`}
    >
      <span className={value ? 'text-ops-text' : 'text-ops-dim/40 italic'}>{value || placeholder}</span>
      <Pencil size={8} strokeWidth={1.5} className="opacity-0 group-hover:opacity-30 transition-opacity shrink-0" />
    </div>
  )
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

function trackStatusColor(status: RecoveryPath['status']) {
  if (status === 'active')     return 'text-ops-amber'
  if (status === 'successful') return 'text-ops-green'
  if (status === 'abandoned')  return 'text-ops-red'
  return 'text-ops-dim'
}

function dispatchStatus(page: TeamPage): { text: string; cls: string } {
  if (page.arrivedAt) return { text: 'on scene', cls: 'text-ops-green' }
  const mins = (Date.now() - new Date(page.pagedAt).getTime()) / 60000
  if (mins > 5) return { text: `${Math.floor(mins)}m overdue`, cls: 'text-ops-orange' }
  return { text: `${Math.floor(mins)}m`, cls: 'text-ops-amber' }
}

function timeHMS(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function MicroIcon({ source }: { source: MicroUpdate['source'] }) {
  if (source === 'bridge') return <Radio  size={9} strokeWidth={1.5} className="text-ops-amber shrink-0" />
  if (source === 'tool')   return <Wrench size={9} strokeWidth={1.5} className="text-ops-blue  shrink-0" />
  return                          <Cpu    size={9} strokeWidth={1.5} className="text-ops-dim   shrink-0" />
}

// ── View switcher ─────────────────────────────────────────────────────────

function ViewSwitcher({ incidentId }: { incidentId: number }) {
  return (
    <div className="flex items-center gap-0 border border-ops-border">
      <Link to={`/admin/incidents/${incidentId}`}
        className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-ops-dim hover:text-ops-text hover:bg-ops-muted transition-colors">Classic</Link>
      <span className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest bg-ops-red text-white">Terminal</span>
      <Link to={`/admin/incidents/${incidentId}/focus`}
        className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-ops-dim hover:text-ops-text hover:bg-ops-muted transition-colors">Focus</Link>
    </div>
  )
}

// ── Command input ─────────────────────────────────────────────────────────

interface CommandInputProps {
  isCritical: boolean
  cmdHistory: string[]
  onSubmit: (input: string) => void
}

function CommandInput({ isCritical, cmdHistory, onSubmit }: CommandInputProps) {
  const [draft, setDraft]           = useState('')
  const [histIdx, setHistIdx]       = useState(-1)
  const [showSuggest, setShowSuggest] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus on mount
  useEffect(() => { inputRef.current?.focus() }, [])

  const accentColor = isCritical ? 'text-ops-red' : 'text-ops-amber'

  const suggestions = draft.startsWith('/')
    ? CMD_REGISTRY.filter(c =>
        c.cmd.startsWith(draft.split(' ')[0]) ||
        c.alias.startsWith(draft.split(' ')[0])
      )
    : []

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (draft.trim()) {
        onSubmit(draft.trim())
        setDraft('')
        setHistIdx(-1)
        setShowSuggest(false)
      }
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, cmdHistory.length - 1)
      setHistIdx(next)
      if (cmdHistory[next] != null) setDraft(cmdHistory[next])
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next)
      setDraft(next === -1 ? '' : cmdHistory[next])
      return
    }

    if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault()
      setDraft(suggestions[0].cmd + ' ')
      setShowSuggest(false)
      return
    }

    if (e.key === 'Escape') {
      setDraft('')
      setHistIdx(-1)
      setShowSuggest(false)
      return
    }
  }

  return (
    <div className="shrink-0 border-t border-ops-border">
      {/* Suggestion dropdown */}
      {showSuggest && suggestions.length > 0 && (
        <div className="border-b border-ops-border bg-ops-muted">
          {suggestions.map((s, i) => (
            <button
              key={s.cmd}
              onMouseDown={e => { e.preventDefault(); setDraft(s.cmd + ' '); inputRef.current?.focus() }}
              className={`w-full flex items-baseline gap-3 px-4 py-1.5 hover:bg-ops-bg transition-colors ${i === 0 ? 'bg-ops-bg/60' : ''}`}
            >
              <span className={`font-mono text-[10px] font-700 w-20 text-left ${accentColor}`}>{s.cmd}</span>
              <span className="font-mono text-[10px] text-ops-dim">{s.usage.slice(s.cmd.length)}</span>
              <span className="font-mono text-[9px] text-ops-dim/60 ml-auto">{s.desc}</span>
            </button>
          ))}
          <div className="px-4 py-1 font-mono text-[9px] text-ops-dim/40 border-t border-ops-border">
            tab → complete · ↑↓ → history · esc → clear
          </div>
        </div>
      )}

      {/* Prompt line */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-ops-bg">
        <Terminal size={11} strokeWidth={1.5} className={`shrink-0 ${accentColor}`} />
        <span className={`font-mono text-[12px] font-700 shrink-0 select-none ${accentColor}`}>&gt;</span>
        <input
          ref={inputRef}
          value={draft}
          onChange={e => {
            setDraft(e.target.value)
            setHistIdx(-1)
            setShowSuggest(e.target.value.startsWith('/'))
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
          onFocus={() => setShowSuggest(draft.startsWith('/'))}
          placeholder="type a bridge note  ·  /command for actions  ·  @track to tag"
          className="flex-1 bg-transparent font-mono text-[11px] text-ops-text placeholder:text-ops-dim/30 focus:outline-none"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        {draft && (
          <span className="font-mono text-[9px] text-ops-dim/40 shrink-0">↵</span>
        )}
      </div>
    </div>
  )
}

// ── Feed item renderer ────────────────────────────────────────────────────

function FeedItemRow({ item, trackTitle }: { item: FeedItem; trackTitle?: string }) {
  if (item._type === 'cmd') {
    const c = item
    if (c.kind === 'echo') {
      return (
        <div className="flex gap-2.5 font-mono">
          <span className="text-ops-dim/60 text-[9px] tabular-nums shrink-0 mt-0.5">{timeHMS(c.timestamp)}</span>
          <span className="text-ops-amber/80 text-[11px]">&gt; {c.content}</span>
        </div>
      )
    }
    if (c.kind === 'ok') {
      return (
        <div className="flex gap-2.5 font-mono">
          <span className="text-ops-dim/40 text-[9px] tabular-nums shrink-0 mt-0.5">{timeHMS(c.timestamp)}</span>
          <CheckCircle size={9} strokeWidth={2} className="text-ops-green shrink-0 mt-0.5" />
          <span className="text-ops-green text-[10px] font-body whitespace-pre-line">{c.content}</span>
        </div>
      )
    }
    if (c.kind === 'err') {
      return (
        <div className="flex gap-2.5 font-mono">
          <span className="text-ops-dim/40 text-[9px] tabular-nums shrink-0 mt-0.5">{timeHMS(c.timestamp)}</span>
          <AlertCircle size={9} strokeWidth={2} className="text-ops-red shrink-0 mt-0.5" />
          <span className="text-ops-red/80 text-[10px] font-body">{c.content}</span>
        </div>
      )
    }
    // info (e.g., /help output)
    return (
      <div className="flex gap-2.5">
        <span className="text-ops-dim/40 text-[9px] tabular-nums shrink-0 mt-0.5 font-mono">{timeHMS(c.timestamp)}</span>
        <div className="text-ops-dim text-[10px] font-mono whitespace-pre-line">{c.content}</div>
      </div>
    )
  }

  // micro update
  const u = item
  const sourceColor = u.source === 'bridge' ? 'text-ops-amber' : u.source === 'tool' ? 'text-ops-blue' : 'text-ops-dim'

  return (
    <div className="flex gap-2.5 group">
      <MicroIcon source={u.source} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`font-mono text-[9px] uppercase tracking-widest ${sourceColor}`}>{u.source}</span>
          <span className="font-mono text-[9px] text-ops-dim/60 tabular-nums">{timeHMS(u.timestamp)}</span>
          {trackTitle && (
            <span className="font-mono text-[9px] text-ops-dim">· {trackTitle}</span>
          )}
        </div>
        <p className="font-body text-[11px] text-ops-text leading-relaxed">{u.content}</p>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function MIMViewTerminal() {
  const { id } = useParams<{ id: string }>()
  const {
    incident, advancePhase, postMicroUpdate, markTeamArrived,
    addRecoveryPath, addHypothesis, pageTeam, updatePathBet,
  } = useIncident(Number(id))

  const impactElapsed = useElapsed(incident?.alert.issueTime ?? new Date().toISOString())
  const phaseElapsed  = useElapsed(incident?.phaseEnteredAt  ?? new Date().toISOString())

  // Command feed entries (echoes + results — local, not persisted)
  const [cmdFeed, setCmdFeed]     = useState<CmdEntry[]>([])
  const [cmdHistory, setCmdHistory] = useState<string[]>([])

  const feedRef = useRef<HTMLDivElement>(null)

  // Auto-scroll feed on new entries
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = 0
  }, [cmdFeed.length, incident?.microUpdates.length])

  if (!incident) return <Navigate to="/" />

  const isCritical  = incident.severity === 'Critical'
  const isWartime   = isCritical || incident.severity === 'High'
  const activePaths = incident.recoveryPaths.filter(p => p.status === 'active')
  const pendingPages = incident.teamPages.filter(p => !p.arrivedAt)
  const onScene     = incident.participants.filter(p => p.isOnScene && !p.leftAt)
  const rapEsc      = incident.participants.find(p => p.rapidEscalationFlag && p.isOnScene)

  const accentText = isCritical ? 'text-ops-red' : 'text-ops-amber'

  // Merge micro updates and cmd feed, sort newest-first
  const allFeedItems: FeedItem[] = [
    ...incident.microUpdates.map(u  => ({ ...u,  _type: 'update' as const })),
    ...cmdFeed.map(c => ({ ...c, _type: 'cmd'    as const })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  function emit(kind: CmdEntry['kind'], content: string) {
    setCmdFeed(f => [{
      id: `cmd-${Date.now()}-${kind}`,
      timestamp: new Date().toISOString(),
      kind, content,
    }, ...f])
  }

  // ── Command executor ───────────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const execute = useCallback((raw: string) => {
    if (!incident) return

    // Record in history
    setCmdHistory(h => [raw, ...h.slice(0, 49)])

    // Echo
    emit('echo', raw)

    const trimmed = raw.trim()

    // ── @track-name note ──────────────────────────────────────────────
    if (trimmed.startsWith('@')) {
      const space = trimmed.indexOf(' ')
      const alias = space === -1 ? trimmed.slice(1) : trimmed.slice(1, space)
      const note  = space === -1 ? '' : trimmed.slice(space + 1).trim()

      if (!note) {
        emit('err', `Usage: @<track-name> <note>  e.g.  @db-pool rollback in progress`)
        return
      }
      const path = incident.recoveryPaths.find(p =>
        p.title.toLowerCase().includes(alias.toLowerCase()) ||
        p.title.toLowerCase().replace(/\s+/g, '-').includes(alias.toLowerCase())
      )
      if (!path) {
        emit('err', `Track not found: "${alias}" — run /help to see open tracks`)
        return
      }
      postMicroUpdate(note, path.id)
      emit('ok', `Logged to "${path.title}"`)
      return
    }

    // ── /command ──────────────────────────────────────────────────────
    if (trimmed.startsWith('/')) {
      const parts = trimmed.slice(1).trim().split(/\s+/)
      const cmd   = parts[0].toLowerCase()
      const args  = parts.slice(1).join(' ').replace(/^["']|["']$/g, '')

      switch (cmd) {

        case 'advance':
        case 'next': {
          if (incident.phase >= 8) {
            emit('err', 'Incident is already at phase 8: Resolution')
            return
          }
          advancePhase()
          emit('ok', `Phase advanced → ${incident.phase + 1}: ${phaseLabel((incident.phase + 1) as typeof incident.phase)}`)
          return
        }

        case 'dispatch':
        case 'd': {
          if (!args) {
            const teamList = TEAMS.slice(0, 4).map(t => `  "${t.name}"`).join('\n')
            emit('err', `Usage: /dispatch <team-name>\n\nAvailable teams:\n${teamList}\n  (and ${TEAMS.length - 4} more)`)
            return
          }
          const team = TEAMS.find(t =>
            t.name.toLowerCase().includes(args.toLowerCase()) ||
            args.toLowerCase().includes(t.name.toLowerCase().split(' ')[0])
          )
          if (!team) {
            emit('err', `Team not found: "${args}"\n\nTry: /dispatch "Platform Engineering"`)
            return
          }
          pageTeam(team.id, team.name, null, 'Box1')
          emit('ok', `Paged ${team.name} (Box1) — awaiting acknowledgement`)
          return
        }

        case 'arrived':
        case 'arr': {
          if (!args) {
            emit('err', 'Usage: /arrived <team-name>')
            return
          }
          const page = incident.teamPages.find(p =>
            !p.arrivedAt && p.teamName.toLowerCase().includes(args.toLowerCase())
          )
          if (!page) {
            const pending = incident.teamPages.filter(p => !p.arrivedAt)
            if (pending.length === 0) {
              emit('info', 'No pending pages — all teams already on scene')
            } else {
              emit('err', `No match for "${args}"\n\nPending: ${pending.map(p => p.teamName).join(', ')}`)
            }
            return
          }
          markTeamArrived(page.id)
          emit('ok', `${page.teamName} marked on scene`)
          return
        }

        case 'track':
        case 't': {
          if (!args) {
            emit('err', 'Usage: /track <name>  e.g. /track "DB Connection Pool"')
            return
          }
          addRecoveryPath(args, incident.command.mim || 'MIM')
          emit('ok', `Recovery track opened: "${args}"`)
          return
        }

        case 'hyp':
        case 'h': {
          if (!args) {
            emit('err', 'Usage: /hyp <hypothesis text>  e.g. /hyp connection pool exhausted at 847 connections')
            return
          }
          const active = incident.recoveryPaths.filter(p => p.status === 'active')
          if (active.length === 0) {
            emit('err', 'No active recovery tracks. Open one first:\n  /track "your track name"')
            return
          }
          if (active.length === 1) {
            addHypothesis(active[0].id, args)
            emit('ok', `Hypothesis added to "${active[0].title}":\n  "${args}"`)
            return
          }
          // Multiple active tracks — use first one and note it
          addHypothesis(active[0].id, args)
          emit('ok', `Hypothesis added to "${active[0].title}" (first active track):\n  "${args}"`)
          return
        }

        case 'help':
        case '?': {
          const lines = CMD_REGISTRY.map(c =>
            `${c.usage.padEnd(30)} ${c.desc}`
          ).join('\n')
          const trackAliases = incident.recoveryPaths
            .filter(p => p.status === 'active')
            .map(p => `  @${p.title.toLowerCase().replace(/\s+/g, '-')}`)
            .join('\n')
          const full = lines + '\n\nActive track aliases:\n' + (trackAliases || '  (no active tracks)')
          emit('info', full)
          return
        }

        default:
          emit('err', `Unknown command: /${cmd}\n\nType /help for available commands`)
          return
      }
    }

    // ── Plain text → bridge note ──────────────────────────────────────
    postMicroUpdate(trimmed, null)
    // No echo result — the note itself appears in the feed immediately
  }, [incident, advancePhase, postMicroUpdate, markTeamArrived, addRecoveryPath, addHypothesis, pageTeam])

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col bg-ops-bg text-ops-text overflow-hidden font-mono">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="h-11 shrink-0 flex items-center justify-between border-b border-ops-border bg-ops-bg px-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="text-ops-dim hover:text-ops-text transition-colors shrink-0">
            <ArrowLeft size={13} strokeWidth={1.5} />
          </Link>
          <WordmarkLogo wartime={isWartime} size="sm" />
          <div className="h-4 w-px bg-ops-border shrink-0" />
          <span className="text-[11px] font-700 uppercase tracking-wide text-ops-text truncate max-w-xs font-heading">
            #{incident.id} {incident.title}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {rapEsc && (
            <div className="flex items-center gap-1.5 border border-ops-orange/30 bg-ops-orange/10 px-2 py-1">
              <Shield size={10} strokeWidth={1.5} className="text-ops-orange" />
              <span className="text-[9px] uppercase tracking-widest text-ops-orange">{rapEsc.displayName} on bridge</span>
            </div>
          )}
          <ViewSwitcher incidentId={incident.id} />
          <span className={`text-[9px] uppercase tracking-widest font-700 border px-2 py-1 ${
            isCritical ? 'border-ops-red/50 text-ops-red' : 'border-ops-amber/50 text-ops-amber'
          }`}>{incident.severity}</span>
          {incident.phase < 8 && (
            <button
              onClick={advancePhase}
              className="flex items-center gap-1 px-3 py-1 text-[10px] uppercase tracking-widest bg-ops-red text-white hover:bg-ops-red/80 transition-colors"
              title="Advance phase (or type /advance)"
            >
              <ChevronRight size={11} strokeWidth={2} />
              Ph.{incident.phase + 1}
            </button>
          )}
        </div>
      </header>

      {/* ── Phase strip ──────────────────────────────────────────────── */}
      <div className="h-7 shrink-0 flex items-stretch border-b border-ops-border bg-ops-muted">
        {Array.from({ length: 8 }, (_, i) => {
          const n = i + 1
          const active = n === incident.phase
          const done   = n < incident.phase
          return (
            <div key={n} className={`flex-1 flex items-center justify-center border-r border-ops-border last:border-r-0 text-[9px] transition-colors ${
              active ? (isCritical ? 'bg-ops-red/20 text-ops-red font-700' : 'bg-ops-amber/20 text-ops-amber font-700') :
              done   ? 'text-ops-dim/50' : 'text-ops-dim/20'
            }`}>
              {n}
            </div>
          )
        })}
      </div>

      {/* ── Main 3-column ────────────────────────────────────────────── */}
      <main className="flex flex-1 overflow-hidden">

        {/* ── Left: Situation ──────────────────────────────────────── */}
        <aside className="w-52 shrink-0 flex flex-col border-r border-ops-border bg-ops-muted overflow-y-auto">

          {/* Phase */}
          <div className="px-4 pt-4 pb-3 border-b border-ops-border">
            <div className="text-[9px] uppercase tracking-widest text-ops-dim mb-1">Phase</div>
            <div className="flex items-baseline gap-1 mb-0.5">
              <span className={`font-display text-3xl font-900 tabular-nums leading-none ${accentText}`}>
                {incident.phase}
              </span>
              <span className="text-ops-dim text-sm">/8</span>
            </div>
            <div className="text-[11px] font-700 uppercase tracking-wider text-ops-text font-heading">
              {phaseLabel(incident.phase)}
            </div>
            <div className="text-[9px] text-ops-dim mt-0.5">in phase {formatDurationWithSeconds(phaseElapsed)}</div>
            <div className="mt-2 h-0.5 bg-ops-bg overflow-hidden">
              <div className={`h-full ${isCritical ? 'bg-ops-red' : 'bg-ops-amber'}`}
                style={{ width: `${((incident.phase - 1) / 7) * 100}%` }} />
            </div>
          </div>

          {/* Impact */}
          <div className="px-4 pt-3 pb-3 border-b border-ops-border">
            <div className="text-[9px] uppercase tracking-widest text-ops-dim mb-2">Impact</div>
            <div className="space-y-1.5">
              {[
                { label: 'Duration', value: incident.alert.customerCount > 0 ? formatDurationWithSeconds(impactElapsed) : '—', hi: incident.alert.customerCount > 0 },
                { label: 'Users',    value: incident.alert.customerCount > 0 ? incident.alert.customerCount.toLocaleString() : '—', hi: false },
                { label: 'Updates',  value: String(incident.updatesPosted), hi: false },
                { label: 'External', value: incident.alert.externalImpact,  hi: false },
              ].map(row => (
                <div key={row.label} className="flex items-baseline justify-between gap-2">
                  <span className="text-[9px] text-ops-dim">{row.label}</span>
                  <span className={`text-[10px] font-700 tabular-nums ${row.hi ? 'text-ops-orange' : 'text-ops-text'}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Systems */}
          <div className="px-4 pt-3 pb-3 border-b border-ops-border">
            <div className="text-[9px] uppercase tracking-widest text-ops-dim mb-2">Systems</div>
            <div className="space-y-1">
              {incident.affectedSystems.map(s => (
                <div key={s} className="flex items-center gap-1.5">
                  <div className={`h-1 w-1 rounded-full shrink-0 ${isCritical ? 'bg-ops-red' : 'bg-ops-amber'}`} />
                  <span className="text-[10px] text-ops-text truncate font-body">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Command team — click-to-edit */}
          <div className="px-4 pt-3 pb-3">
            <div className="text-[9px] uppercase tracking-widest text-ops-dim mb-2">Command</div>
            <div className="space-y-1.5 text-[10px] font-body">
              {[
                { abbr: 'MIM', val: incident.command.mim },
                { abbr: 'SRE', val: incident.command.sre },
                { abbr: 'LDR', val: incident.command.leader },
                { abbr: 'SVC', val: incident.command.serviceManager },
              ].filter(r => r.val).map(r => (
                <div key={r.abbr} className="flex items-baseline gap-2">
                  <span className="text-[9px] text-ops-dim w-6 shrink-0">{r.abbr}</span>
                  <span className="text-ops-text truncate">{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Center: Feed + CLI ────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Feed header */}
          <div className="shrink-0 px-4 py-1.5 flex items-center gap-2 border-b border-ops-border bg-ops-bg">
            <Radio size={9} strokeWidth={1.5} className="text-ops-dim" />
            <span className="text-[9px] uppercase tracking-widest text-ops-dim">Bridge Log</span>
            <span className="text-[9px] text-ops-dim ml-auto">{allFeedItems.length} entries</span>
          </div>

          {/* Feed */}
          <div ref={feedRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {allFeedItems.length === 0 && (
              <div className="text-center py-12 text-[10px] text-ops-dim">
                No entries yet. Type a note below or /help for commands.
              </div>
            )}
            {allFeedItems.map(item => {
              const trackTitle = item._type === 'update' && item.recoveryPathId
                ? incident.recoveryPaths.find(p => p.id === item.recoveryPathId)?.title
                : undefined
              return (
                <FeedItemRow
                  key={item.id}
                  item={item}
                  trackTitle={trackTitle}
                />
              )
            })}
          </div>

          {/* CLI input */}
          <CommandInput
            isCritical={isCritical}
            cmdHistory={cmdHistory}
            onSubmit={execute}
          />
        </div>

        {/* ── Right: Intelligence ───────────────────────────────────── */}
        <aside className="w-60 shrink-0 flex flex-col border-l border-ops-border overflow-y-auto">

          {/* Presence roster */}
          <div className="px-4 pt-4 pb-3 border-b border-ops-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] uppercase tracking-widest text-ops-dim">On Bridge</span>
              <span className="text-[9px] text-ops-dim">{onScene.length}</span>
            </div>
            <div className="space-y-1.5">
              {incident.participants.filter(p => !p.leftAt).map(p => (
                <div key={p.userId} className={`flex items-center gap-2 ${!p.isOnScene ? 'opacity-35' : ''}`}
                  title={`${p.displayName} · ${p.role}${p.isSilent ? ' · silent' : ''}${p.rapidEscalationFlag ? ' · RAPID ESC' : ''}`}
                >
                  <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${presenceDotClass(p)}`} />
                  <span className={`text-[10px] flex-1 truncate font-body ${!p.isOnScene ? 'line-through text-ops-dim' : 'text-ops-text'}`}>
                    {p.displayName}
                  </span>
                  <span className={`text-[9px] shrink-0 ${ROLE_COLOR[p.role] ?? 'text-ops-dim'}`}>
                    {ROLE_ABBR[p.role] ?? p.role.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery tracks — current bet is click-to-edit */}
          <div className="px-4 pt-3 pb-3 border-b border-ops-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] uppercase tracking-widest text-ops-dim">Tracks</span>
              <button onClick={() => execute('/track "New Track"')}
                className="text-ops-dim hover:text-ops-text transition-colors" title="/track">
                <Plus size={11} strokeWidth={1.5} />
              </button>
            </div>

            {incident.recoveryPaths.length === 0 ? (
              <div className="text-[9px] text-ops-dim font-body">
                No tracks. Type <span className={`${accentText}`}>/track &lt;name&gt;</span>
              </div>
            ) : (
              <div className="space-y-2">
                {incident.recoveryPaths.map(path => (
                  <div key={path.id} className={`border px-3 py-2 ${
                    path.status === 'active'     ? 'border-ops-amber/30 bg-ops-amber/5' :
                    path.status === 'successful' ? 'border-ops-green/20 bg-ops-green/5' :
                                                   'border-ops-border bg-ops-muted opacity-60'
                  }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-ops-text font-body truncate max-w-[120px]">{path.title}</span>
                      <span className={`text-[9px] ${trackStatusColor(path.status)} shrink-0`}>Ph.{path.phase}</span>
                    </div>
                    {/* Inline-editable current bet */}
                    <ClickEdit
                      value={path.currentBet}
                      onSave={bet => updatePathBet(path.id, bet)}
                      placeholder="▸ set current bet"
                      className="text-[9px] font-body leading-snug mb-1"
                    />
                    <div className="flex items-center gap-2 text-[9px] text-ops-dim border-t border-ops-border/30 pt-1.5 mt-1.5">
                      <span>{path.hypotheses.length} hyp.</span>
                      <span>·</span>
                      <span className="truncate">{path.owner.split(' ')[0]}</span>
                      <span className="ml-auto font-mono text-ops-dim/40">
                        @{path.title.toLowerCase().replace(/\s+/g, '-')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dispatch */}
          <div className="px-4 pt-3 pb-4 flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] uppercase tracking-widest text-ops-dim">Dispatch</span>
              {pendingPages.length > 0 && (
                <div className="h-1.5 w-1.5 rounded-full bg-ops-amber animate-pulse" />
              )}
            </div>

            {incident.teamPages.length === 0 ? (
              <div className="text-[9px] text-ops-dim font-body">
                No pages sent. Type <span className={`${accentText}`}>/dispatch &lt;team&gt;</span>
              </div>
            ) : (
              <div className="space-y-2">
                {incident.teamPages.map(page => {
                  const { text, cls } = dispatchStatus(page)
                  return (
                    <div key={page.id}>
                      <div className="flex items-center gap-2">
                        {page.arrivedAt
                          ? <CheckCircle size={9} strokeWidth={2} className="text-ops-green shrink-0" />
                          : <Clock size={9} strokeWidth={1.5} className="text-ops-amber shrink-0" />
                        }
                        <span className="text-[10px] text-ops-text font-body flex-1 truncate">{page.teamName}</span>
                        <span className={`text-[9px] shrink-0 ${cls}`}>{text}</span>
                      </div>
                      {!page.arrivedAt && (
                        <button
                          onClick={() => execute(`/arrived ${page.teamName.split(' ')[0]}`)}
                          className="mt-1 ml-4 text-[9px] text-ops-dim border border-ops-border px-2 py-0.5 hover:text-ops-text hover:border-ops-text/20 transition-colors"
                        >
                          + mark arrived
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  )
}
