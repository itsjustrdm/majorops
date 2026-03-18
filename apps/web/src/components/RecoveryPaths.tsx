import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, GitBranch, CheckCircle2, XCircle, Pause, User } from 'lucide-react'
import { SectionLabel } from './ui/Card'
import { phaseLabel } from '../lib/utils'
import type { RecoveryPath, Hypothesis, PhaseNumber } from '../types'

// ─── Hypothesis card ──────────────────────────────────────────────────────────

function HypothesisCard({ h }: { h: Hypothesis }) {
  const colors: Record<Hypothesis['status'], string> = {
    active:     'border-ops-amber/40 bg-ops-amber/5 text-ops-amber',
    validated:  'border-ops-green/40 bg-ops-green/5 text-ops-green',
    eliminated: 'border-ops-border bg-ops-muted text-ops-dim line-through',
    discarded:  'border-ops-border bg-ops-bg text-ops-dim',
  }
  const labels: Record<Hypothesis['status'], string> = {
    active: 'ACTIVE', validated: 'VALIDATED', eliminated: 'ELIMINATED', discarded: 'DISCARDED',
  }

  return (
    <div className={`border px-3 py-2 ${colors[h.status]}`}>
      <div className="flex items-start gap-2 justify-between">
        <p className={`font-body text-xs leading-snug ${h.status === 'eliminated' ? 'text-ops-dim line-through' : 'text-ops-text'}`}>
          {h.title}
        </p>
        <span className={`shrink-0 font-mono text-[9px] uppercase tracking-widest ${colors[h.status]}`}>
          {labels[h.status]}
        </span>
      </div>
      {h.evidence && (
        <p className="mt-1 font-mono text-[10px] text-ops-dim leading-snug">{h.evidence}</p>
      )}
    </div>
  )
}

// ─── Recovery path row ────────────────────────────────────────────────────────

const statusIcons: Record<RecoveryPath['status'], JSX.Element> = {
  active:     <span className="inline-block h-2 w-2 rounded-full bg-ops-amber animate-pulse" />,
  successful: <CheckCircle2 size={12} strokeWidth={1.5} className="text-ops-green" />,
  abandoned:  <XCircle size={12} strokeWidth={1.5} className="text-ops-dim" />,
  paused:     <Pause size={12} strokeWidth={1.5} className="text-ops-dim" />,
}

const pathBorder: Record<RecoveryPath['status'], string> = {
  active:     'border-ops-amber/30',
  successful: 'border-ops-green/30',
  abandoned:  'border-ops-border',
  paused:     'border-ops-border',
}

interface PathRowProps {
  path: RecoveryPath
  onAdvancePhase: (pathId: string) => void
  onRegressPhase: (pathId: string) => void
  onUpdateBet: (pathId: string, bet: string) => void
  onAddHypothesis: (pathId: string, title: string) => void
}

function PathRow({ path, onAdvancePhase, onRegressPhase, onUpdateBet, onAddHypothesis }: PathRowProps) {
  const [expanded, setExpanded] = useState(path.status === 'active')
  const [editingBet, setEditingBet] = useState(false)
  const [betDraft, setBetDraft] = useState(path.currentBet)
  const [newHyp, setNewHyp] = useState('')
  const [showHypInput, setShowHypInput] = useState(false)

  const activeHyps = path.hypotheses.filter(h => h.status === 'active').length
  const allHyps = path.hypotheses.length

  return (
    <div className={`border ${pathBorder[path.status]} bg-ops-surface`}>
      {/* Path header */}
      <div
        className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-ops-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {statusIcons[path.status]}
          <span className="font-heading text-sm font-700 uppercase tracking-wide text-ops-text truncate">
            {path.title}
          </span>
          <span className="shrink-0 font-mono text-[10px] text-ops-dim border border-ops-border px-1.5 py-0.5">
            Phase {path.phase} · {phaseLabel(path.phase)}
          </span>
          {activeHyps > 0 && (
            <span className="shrink-0 font-mono text-[10px] text-ops-amber border border-ops-amber/30 px-1.5 py-0.5">
              {activeHyps} active hyp{activeHyps !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 text-ops-dim">
            <User size={10} strokeWidth={1.5} />
            <span className="font-mono text-[10px]">{path.owner}</span>
          </div>
          {expanded ? <ChevronDown size={12} strokeWidth={1.5} className="text-ops-dim" /> : <ChevronRight size={12} strokeWidth={1.5} className="text-ops-dim" />}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-ops-border px-4 py-3 space-y-3">
          {/* Current bet */}
          <div>
            <div className="mb-1 font-mono text-[9px] uppercase tracking-widest text-ops-dim">Current Bet</div>
            {editingBet ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={betDraft}
                  onChange={e => setBetDraft(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { onUpdateBet(path.id, betDraft); setEditingBet(false) }
                    if (e.key === 'Escape') setEditingBet(false)
                  }}
                  className="flex-1 bg-ops-muted border border-ops-amber/40 px-2 py-1 font-body text-xs text-ops-text outline-none"
                />
                <button
                  onClick={() => { onUpdateBet(path.id, betDraft); setEditingBet(false) }}
                  className="border border-ops-amber/40 px-3 py-1 font-mono text-[10px] text-ops-amber hover:bg-ops-amber/10"
                >Save</button>
              </div>
            ) : (
              <p
                className="font-body text-sm text-ops-text cursor-pointer hover:text-ops-amber transition-colors"
                onClick={() => setEditingBet(true)}
                title="Click to edit"
              >
                {path.currentBet || <span className="text-ops-dim italic">No current bet — click to set</span>}
              </p>
            )}
          </div>

          {/* Phase controls */}
          {path.status === 'active' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRegressPhase(path.id)}
                disabled={path.phase <= 1}
                className="border border-ops-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-ops-dim hover:text-ops-text hover:border-ops-text/20 transition-colors disabled:opacity-30"
              >
                ← Regress
              </button>
              <span className="font-mono text-[10px] text-ops-dim flex-1 text-center">
                Phase {path.phase} / 8 — {phaseLabel(path.phase)}
              </span>
              <button
                onClick={() => onAdvancePhase(path.id)}
                disabled={path.phase >= 8}
                className="border border-ops-amber/40 bg-ops-amber/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-ops-amber hover:bg-ops-amber/20 transition-colors disabled:opacity-30"
              >
                Advance →
              </button>
            </div>
          )}

          {/* Hypotheses */}
          {allHyps > 0 && (
            <div className="space-y-1.5">
              <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim">
                Hypotheses ({activeHyps} active of {allHyps})
              </div>
              {path.hypotheses.map(h => <HypothesisCard key={h.id} h={h} />)}
            </div>
          )}

          {/* Add hypothesis */}
          <div>
            {showHypInput ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={newHyp}
                  onChange={e => setNewHyp(e.target.value)}
                  placeholder="State your hypothesis..."
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newHyp.trim()) { onAddHypothesis(path.id, newHyp.trim()); setNewHyp(''); setShowHypInput(false) }
                    if (e.key === 'Escape') setShowHypInput(false)
                  }}
                  className="flex-1 bg-ops-muted border border-ops-border px-2 py-1 font-body text-xs text-ops-text placeholder-ops-dim/50 outline-none focus:border-ops-amber/40"
                />
                <button
                  onClick={() => { if (newHyp.trim()) { onAddHypothesis(path.id, newHyp.trim()); setNewHyp(''); setShowHypInput(false) }}}
                  className="border border-ops-amber/30 px-3 py-1 font-mono text-[10px] text-ops-amber hover:bg-ops-amber/10"
                >Add</button>
              </div>
            ) : (
              <button
                onClick={() => setShowHypInput(true)}
                className="flex items-center gap-1.5 font-mono text-[10px] text-ops-dim hover:text-ops-amber transition-colors"
              >
                <Plus size={10} strokeWidth={1.5} />
                Add hypothesis
              </button>
            )}
          </div>

          {/* MIM notes */}
          {path.notes && (
            <div className="border-t border-ops-border pt-2">
              <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-1">Notes</div>
              <p className="font-body text-xs text-ops-dim leading-snug">{path.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────

interface RecoveryPathsProps {
  paths: RecoveryPath[]
  onAdvancePhase: (pathId: string) => void
  onRegressPhase: (pathId: string) => void
  onUpdateBet: (pathId: string, bet: string) => void
  onAddPath: (title: string, owner: string) => void
  onAddHypothesis: (pathId: string, title: string) => void
}

export function RecoveryPaths({ paths, onAdvancePhase, onRegressPhase, onUpdateBet, onAddPath, onAddHypothesis }: RecoveryPathsProps) {
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newOwner, setNewOwner] = useState('')

  const activePaths = paths.filter(p => p.status === 'active')
  const closedPaths = paths.filter(p => p.status !== 'active')

  const handleAdd = () => {
    if (!newTitle.trim()) return
    onAddPath(newTitle.trim(), newOwner.trim() || 'Unassigned')
    setNewTitle('')
    setNewOwner('')
    setShowAdd(false)
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch size={13} strokeWidth={1.5} className="text-ops-amber" />
          <SectionLabel>Recovery Paths</SectionLabel>
          {activePaths.length > 0 && (
            <span className="font-mono text-[10px] text-ops-amber">
              {activePaths.length} active
            </span>
          )}
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 font-mono text-[10px] text-ops-dim hover:text-ops-text transition-colors"
        >
          <Plus size={10} strokeWidth={1.5} />
          Open Track
        </button>
      </div>

      {/* Add new path */}
      {showAdd && (
        <div className="mb-3 border border-ops-amber/30 bg-ops-amber/5 p-3 space-y-2">
          <div className="font-mono text-[9px] uppercase tracking-widest text-ops-amber mb-2">
            Open New Recovery Track
          </div>
          <input
            autoFocus
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Track title (e.g. DB Connection Pool)"
            className="w-full bg-ops-bg border border-ops-border px-3 py-1.5 font-body text-xs text-ops-text placeholder-ops-dim/50 outline-none focus:border-ops-amber/40"
          />
          <input
            value={newOwner}
            onChange={e => setNewOwner(e.target.value)}
            placeholder="Owner (e.g. M. Torres)"
            className="w-full bg-ops-bg border border-ops-border px-3 py-1.5 font-body text-xs text-ops-text placeholder-ops-dim/50 outline-none focus:border-ops-amber/40"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 bg-ops-amber/20 border border-ops-amber/40 py-1.5 font-mono text-[10px] uppercase tracking-wide text-ops-amber hover:bg-ops-amber/30 transition-colors"
            >Open Track</button>
            <button
              onClick={() => setShowAdd(false)}
              className="border border-ops-border px-4 py-1.5 font-mono text-[10px] text-ops-dim hover:text-ops-text"
            >Cancel</button>
          </div>
        </div>
      )}

      {paths.length === 0 && !showAdd && (
        <div className="border border-dashed border-ops-border px-4 py-6 text-center">
          <p className="font-mono text-[10px] text-ops-dim">No recovery paths opened yet.</p>
          <p className="font-mono text-[10px] text-ops-dim">Open a track when you identify a parallel workstream.</p>
        </div>
      )}

      <div className="space-y-2">
        {activePaths.map(p => (
          <PathRow
            key={p.id}
            path={p}
            onAdvancePhase={onAdvancePhase}
            onRegressPhase={onRegressPhase}
            onUpdateBet={onUpdateBet}
            onAddHypothesis={onAddHypothesis}
          />
        ))}
        {closedPaths.map(p => (
          <PathRow
            key={p.id}
            path={p}
            onAdvancePhase={onAdvancePhase}
            onRegressPhase={onRegressPhase}
            onUpdateBet={onUpdateBet}
            onAddHypothesis={onAddHypothesis}
          />
        ))}
      </div>
    </div>
  )
}
