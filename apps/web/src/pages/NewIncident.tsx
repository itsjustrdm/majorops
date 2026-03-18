import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Radio, AlertTriangle, ChevronRight, ArrowLeft } from 'lucide-react'
import { WordmarkLogo } from '../components/WordmarkLogo'
import { useClock } from '../hooks/useClock'
import type { Severity, AlarmLevel } from '../types'

const SEVERITIES: { value: Severity; label: string; sub: string; alarm: AlarmLevel; color: string }[] = [
  { value: 'Critical', label: 'CRITICAL',  sub: 'Full outage · Revenue impact · All hands', alarm: 'Box3', color: 'border-ops-red bg-ops-red/5 text-ops-red hover:bg-ops-red/10' },
  { value: 'High',     label: 'HIGH',      sub: 'Degraded service · Customer impact likely', alarm: 'Box2', color: 'border-ops-orange bg-ops-orange/5 text-ops-orange hover:bg-ops-orange/10' },
  { value: 'Medium',   label: 'MEDIUM',    sub: 'Partial impact · Investigation required', alarm: 'Box2', color: 'border-ops-amber bg-ops-amber/5 text-ops-amber hover:bg-ops-amber/10' },
  { value: 'Low',      label: 'LOW',       sub: 'Minor · Monitoring · Single team', alarm: 'Box1', color: 'border-ops-green bg-ops-green/5 text-ops-green hover:bg-ops-green/10' },
]

const COMMON_SYSTEMS = [
  'Payment API', 'Auth Service', 'Order DB', 'CDN', 'Object Storage',
  'Message Queue', 'API Gateway', 'Search Service', 'Notification Service', 'SSO',
]

export default function NewIncident() {
  const navigate = useNavigate()
  const clock = useClock()
  const [step, setStep] = useState<'severity' | 'details' | 'review'>('severity')

  // Form state
  const [severity, setSeverity] = useState<Severity | null>(null)
  const [summary, setSummary] = useState('')
  const [bridgeUrl, setBridgeUrl] = useState('')
  const [systems, setSystems] = useState<string[]>([])
  const [systemInput, setSystemInput] = useState('')
  const [mim, setMim] = useState('')
  const [sre, setSre] = useState('')

  const selectedSev = SEVERITIES.find(s => s.value === severity)

  const toggleSystem = (sys: string) => {
    setSystems(prev =>
      prev.includes(sys) ? prev.filter(s => s !== sys) : [...prev, sys]
    )
  }

  const addCustomSystem = () => {
    const trimmed = systemInput.trim()
    if (trimmed && !systems.includes(trimmed)) {
      setSystems(prev => [...prev, trimmed])
    }
    setSystemInput('')
  }

  const handleOpen = () => {
    // In real app: POST to API, get incident ID, navigate to /admin/incidents/:id
    navigate('/admin/incidents/1')
  }

  return (
    <div className="min-h-screen bg-ops-bg text-ops-text font-body">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ops-border bg-ops-bg px-6 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1.5 font-mono text-xs text-ops-dim hover:text-ops-text">
            <ArrowLeft size={13} strokeWidth={1.5} />
          </Link>
          <WordmarkLogo wartime size="md" />
          <div className="hidden h-4 w-px bg-ops-border sm:block" />
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-ops-red sm:block">
            New Call for Service
          </span>
        </div>
        <span className="font-mono text-xs tabular-nums text-ops-dim">{clock}</span>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Radio size={18} strokeWidth={1.5} className="text-ops-red" />
            <h1 className="font-display text-2xl font-900 uppercase tracking-widest text-ops-text">
              Open Incident
            </h1>
          </div>
          <p className="font-mono text-xs text-ops-dim">
            Complete in under 10 seconds. Command starts before engineers context-switch.
          </p>
        </div>

        {/* Step: Severity */}
        {step === 'severity' && (
          <div className="space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ops-dim mb-4">
              1 of 3 — What is the alarm level?
            </div>
            {SEVERITIES.map(s => (
              <button
                key={s.value}
                onClick={() => { setSeverity(s.value); setStep('details') }}
                className={`w-full flex items-center justify-between border px-5 py-4 transition-colors ${s.color}`}
              >
                <div className="text-left">
                  <div className="font-heading text-base font-700 uppercase tracking-widest">{s.label}</div>
                  <div className="font-mono text-[10px] mt-0.5 opacity-80">{s.sub}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] border border-current px-2 py-0.5 opacity-60">
                    {s.alarm}
                  </span>
                  <ChevronRight size={14} strokeWidth={1.5} />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step: Details */}
        {step === 'details' && selectedSev && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest text-ops-dim">
                2 of 3 — Incident details
              </div>
              <button onClick={() => setStep('severity')} className="font-mono text-[10px] text-ops-dim hover:text-ops-text">
                ← Change severity
              </button>
            </div>

            {/* Selected severity badge */}
            <div className={`flex items-center gap-3 border px-4 py-2.5 ${selectedSev.color}`}>
              <AlertTriangle size={14} strokeWidth={1.5} />
              <div>
                <div className="font-heading text-sm font-700 uppercase tracking-widest">{selectedSev.label}</div>
                <div className="font-mono text-[10px] opacity-70">{selectedSev.sub}</div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-ops-dim mb-1.5">
                Incident Summary *
              </label>
              <input
                autoFocus
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="What is broken? (e.g. Payment API elevated errors — DB connection pool)"
                className="w-full bg-ops-surface border border-ops-border px-4 py-3 font-body text-sm text-ops-text placeholder-ops-dim/40 outline-none focus:border-ops-red/50"
              />
            </div>

            {/* Affected systems */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-ops-dim mb-1.5">
                Affected Systems
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {COMMON_SYSTEMS.map(sys => (
                  <button
                    key={sys}
                    onClick={() => toggleSystem(sys)}
                    className={`border px-2.5 py-1 font-mono text-[10px] transition-colors ${
                      systems.includes(sys)
                        ? 'border-ops-red/50 bg-ops-red/10 text-ops-red'
                        : 'border-ops-border text-ops-dim hover:border-ops-text/30 hover:text-ops-text'
                    }`}
                  >
                    {sys}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={systemInput}
                  onChange={e => setSystemInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addCustomSystem() }}
                  placeholder="Add custom system…"
                  className="flex-1 bg-ops-surface border border-ops-border px-3 py-1.5 font-body text-xs text-ops-text placeholder-ops-dim/40 outline-none"
                />
                <button onClick={addCustomSystem} className="border border-ops-border px-3 font-mono text-[10px] text-ops-dim hover:text-ops-text">
                  Add
                </button>
              </div>
            </div>

            {/* Bridge URL */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-ops-dim mb-1.5">
                Bridge URL
              </label>
              <input
                value={bridgeUrl}
                onChange={e => setBridgeUrl(e.target.value)}
                placeholder="https://teams.microsoft.com/bridge/... or Zoom/Meet link"
                className="w-full bg-ops-surface border border-ops-border px-4 py-2.5 font-body text-sm text-ops-text placeholder-ops-dim/40 outline-none focus:border-ops-red/30"
              />
            </div>

            {/* Command */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ops-dim mb-1.5">MIM</label>
                <input
                  value={mim}
                  onChange={e => setMim(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-ops-surface border border-ops-border px-3 py-2 font-body text-sm text-ops-text placeholder-ops-dim/40 outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ops-dim mb-1.5">SRE Lead</label>
                <input
                  value={sre}
                  onChange={e => setSre(e.target.value)}
                  placeholder="Technical lead"
                  className="w-full bg-ops-surface border border-ops-border px-3 py-2 font-body text-sm text-ops-text placeholder-ops-dim/40 outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => setStep('review')}
              disabled={!summary.trim()}
              className="w-full bg-ops-red py-4 font-heading text-sm font-700 uppercase tracking-widest text-white transition-colors hover:bg-ops-red-hi disabled:opacity-40"
            >
              Review & Open Incident →
            </button>
          </div>
        )}

        {/* Step: Review */}
        {step === 'review' && selectedSev && (
          <div className="space-y-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ops-dim">
              3 of 3 — Confirm and open
            </div>

            <div className="border border-ops-red/30 bg-ops-red/5">
              <div className="border-b border-ops-red/20 px-5 py-3">
                <div className={`font-heading text-xs font-700 uppercase tracking-widest ${selectedSev.color.split(' ')[2]}`}>
                  {selectedSev.label} — {selectedSev.alarm}
                </div>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-0.5">Summary</div>
                  <p className="font-body text-sm text-ops-text">{summary}</p>
                </div>
                {systems.length > 0 && (
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-1">Affected Systems</div>
                    <div className="flex flex-wrap gap-1.5">
                      {systems.map(s => (
                        <span key={s} className="border border-ops-border px-2 py-0.5 font-mono text-[10px] text-ops-dim">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {bridgeUrl && (
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-0.5">Bridge</div>
                    <div className="font-mono text-[10px] text-ops-blue truncate">{bridgeUrl}</div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 pt-1 border-t border-ops-border">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-0.5">MIM</div>
                    <div className="font-body text-xs text-ops-text">{mim || 'Unassigned'}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-0.5">SRE Lead</div>
                    <div className="font-body text-xs text-ops-text">{sre || 'Unassigned'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="font-mono text-[10px] text-ops-dim text-center">
              Opening this incident will notify command team and start the clock.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('details')}
                className="border border-ops-border px-6 py-4 font-mono text-xs text-ops-dim hover:text-ops-text transition-colors"
              >
                ← Edit
              </button>
              <button
                onClick={handleOpen}
                className="flex-1 bg-ops-red py-4 font-heading text-sm font-700 uppercase tracking-widest text-white hover:bg-ops-red-hi transition-colors"
              >
                Open Incident — Phase 1: Alert
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
