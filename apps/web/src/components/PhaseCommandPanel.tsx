import { useState } from 'react'
import { Activity, Send, ChevronRight, Sparkles, Loader2 } from 'lucide-react'
import { SectionLabel } from './ui/Card'
import { phaseLabel, phaseDescription } from '../lib/utils'
import { draftStatusUpdate, suggestPhaseAction } from '../lib/ai'
import type { Incident } from '../types'

interface PhaseCommandPanelProps {
  incident: Incident
  onAdvancePhase: () => void
  onPostUpdate: (content: string, visibility: 'public' | 'internal') => void
}

export function PhaseCommandPanel({ incident, onAdvancePhase, onPostUpdate }: PhaseCommandPanelProps) {
  const [phaseNotes, setPhaseNotes] = useState('')
  const [updateText, setUpdateText] = useState('')
  const [updatePublic, setUpdatePublic] = useState(true)
  const [draftLoading, setDraftLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [suggestionLoading, setSuggestionLoading] = useState(false)
  const [posted, setPosted] = useState(false)

  const nextPhase = incident.phase < 8 ? incident.phase + 1 : null
  const currentLabel = phaseLabel(incident.phase)
  const currentDesc = phaseDescription(incident.phase)

  const handleDraftUpdate = async () => {
    setDraftLoading(true)
    try {
      const draft = await draftStatusUpdate(incident)
      setUpdateText(draft)
    } finally {
      setDraftLoading(false)
    }
  }

  const handleSuggestAction = async () => {
    setSuggestionLoading(true)
    try {
      const suggestion = await suggestPhaseAction(incident.phase, incident.id)
      setAiSuggestion(suggestion)
    } finally {
      setSuggestionLoading(false)
    }
  }

  const handlePostUpdate = () => {
    if (!updateText.trim()) return
    onPostUpdate(updateText, updatePublic ? 'public' : 'internal')
    setUpdateText('')
    setPosted(true)
    setTimeout(() => setPosted(false), 2000)
  }

  return (
    <div className="flex flex-col divide-y divide-ops-border border border-ops-border bg-ops-surface">
      {/* Current Phase */}
      <div className="bg-ops-red/5 border-b border-ops-red/20 px-4 py-4">
        <div className="mb-3 flex items-center gap-2">
          <Activity size={13} strokeWidth={1.5} className="text-ops-red" />
          <SectionLabel className="text-ops-red">Current Phase</SectionLabel>
        </div>

        <div className="mb-1 font-heading text-base font-700 uppercase tracking-wide text-ops-text">
          {incident.phase}/8 — {currentLabel}
        </div>
        <div className="mb-3 font-body text-xs text-ops-dim">{currentDesc}</div>

        {/* AI Phase Suggestion */}
        <div className="mb-3">
          <button
            onClick={handleSuggestAction}
            disabled={suggestionLoading}
            className="flex items-center gap-1.5 font-mono text-[10px] text-ops-amber hover:text-ops-amber/80 transition-colors disabled:opacity-50"
          >
            {suggestionLoading
              ? <Loader2 size={10} strokeWidth={1.5} className="animate-spin" />
              : <Sparkles size={10} strokeWidth={1.5} />
            }
            AI: What should I do right now?
          </button>
          {aiSuggestion && (
            <div className="mt-2 border border-ops-amber/20 bg-ops-amber/5 px-3 py-2">
              <p className="font-body text-xs leading-relaxed text-ops-text">{aiSuggestion}</p>
            </div>
          )}
        </div>

        {/* Phase Notes */}
        <div className="mb-3">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-ops-dim">
            Document Current Phase Activity
          </div>
          <textarea
            value={phaseNotes}
            onChange={e => setPhaseNotes(e.target.value)}
            placeholder={`What's happening in ${currentLabel}? Document decisions, actions, findings...`}
            rows={3}
            className="w-full bg-ops-muted border border-ops-border px-3 py-2 font-body text-xs text-ops-text placeholder-ops-dim/50 outline-none focus:border-ops-red/50 resize-none"
          />
          <button className="mt-1.5 flex items-center gap-1.5 w-full justify-center border border-ops-border py-2 font-mono text-[10px] uppercase tracking-widest text-ops-dim hover:text-ops-text hover:border-ops-text/20 transition-colors">
            <Send size={10} strokeWidth={1.5} />
            Log Phase Documentation
          </button>
        </div>

        {/* Advance Phase */}
        {nextPhase && (
          <div>
            <button
              onClick={onAdvancePhase}
              className="flex w-full items-center justify-center gap-2 bg-ops-red py-3 font-heading text-sm font-700 uppercase tracking-widest text-white transition-colors hover:bg-ops-red-hi"
            >
              <ChevronRight size={14} strokeWidth={2} />
              Advance to Phase {nextPhase}
            </button>
            <div className="mt-1.5 text-center font-mono text-[10px] text-ops-dim">
              Next: {phaseLabel(nextPhase as Incident['phase'])}
            </div>
          </div>
        )}

        {incident.phase === 8 && (
          <div className="text-center font-mono text-[10px] text-ops-green">
            ✓ Final phase reached. Schedule PIR.
          </div>
        )}
      </div>

      {/* Quick Actions — Post Update */}
      <div className="px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <SectionLabel>Quick Actions</SectionLabel>
          <button
            onClick={handleDraftUpdate}
            disabled={draftLoading}
            className="flex items-center gap-1 font-mono text-[10px] text-ops-amber hover:text-ops-amber/80 transition-colors disabled:opacity-50"
          >
            {draftLoading
              ? <Loader2 size={9} strokeWidth={1.5} className="animate-spin" />
              : <Sparkles size={9} strokeWidth={1.5} />
            }
            AI Draft
          </button>
        </div>

        <div className="mb-2 font-mono text-[9px] uppercase tracking-widest text-ops-dim">
          Post Status Update
        </div>
        <textarea
          value={updateText}
          onChange={e => setUpdateText(e.target.value)}
          placeholder="Update internal staff on progress..."
          rows={3}
          className="w-full bg-ops-muted border border-ops-border px-3 py-2 font-body text-xs text-ops-text placeholder-ops-dim/50 outline-none focus:border-ops-red/50 resize-none"
        />

        <div className="my-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="pub-check"
            checked={updatePublic}
            onChange={e => setUpdatePublic(e.target.checked)}
            className="accent-ops-red"
          />
          <label htmlFor="pub-check" className="cursor-pointer font-mono text-[10px] text-ops-dim hover:text-ops-text">
            Visible to all internal staff
          </label>
        </div>

        <button
          onClick={handlePostUpdate}
          className={`flex w-full items-center justify-center gap-2 border py-2.5 font-heading text-xs font-700 uppercase tracking-widest transition-colors ${
            posted
              ? 'border-ops-green/40 bg-ops-green/10 text-ops-green'
              : 'border-ops-amber/30 bg-ops-amber/5 text-ops-amber hover:bg-ops-amber/10'
          }`}
        >
          <Send size={11} strokeWidth={1.5} />
          {posted ? 'Posted' : 'Post Update'}
        </button>
      </div>
    </div>
  )
}
