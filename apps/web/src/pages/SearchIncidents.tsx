import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Search, ArrowRight, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { INCIDENTS } from '../data/mockData'
import type { Incident } from '../types'

// ─── Config ───────────────────────────────────────────────────────────────────

// How many days back a resolved incident still surfaces in search
const RESOLVED_WINDOW_DAYS = 7

// Score threshold to trigger an auto-redirect on a single result
const AUTO_REDIRECT_SCORE = 2

// ─── Scoring ──────────────────────────────────────────────────────────────────
//
// Simple word-overlap score. Enough for "payment processing" → "Payment Processing Degradation".
// No external dependency, runs in-browser instantly.

function scoreIncident(incident: Incident, query: string): number {
  if (!query.trim()) return 0

  const words = query.toLowerCase().split(/\s+/).filter(Boolean)

  const haystack = [
    incident.title,
    incident.description,
    incident.severity,
    incident.status,
    ...(incident.affectedSystems ?? []),
    incident.command?.sre ?? '',
    incident.command?.mim ?? '',
  ]
    .join(' ')
    .toLowerCase()

  let score = 0
  for (const word of words) {
    if (haystack.includes(word)) score += 1
    // Bonus: exact phrase match in title gets extra weight
    if (incident.title.toLowerCase().includes(word)) score += 1
  }

  return score
}

// ─── Filtering ────────────────────────────────────────────────────────────────

function getCandidates(): Incident[] {
  const cutoff = Date.now() - RESOLVED_WINDOW_DAYS * 24 * 60 * 60 * 1000

  return INCIDENTS.filter(i => {
    if (i.status !== 'Resolved') return true
    if (!i.resolvedAt) return true
    return new Date(i.resolvedAt).getTime() >= cutoff
  })
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

const SEV_COLOR: Record<string, string> = {
  Critical: 'text-ops-red border-ops-red/40',
  High:     'text-ops-orange border-ops-orange/40',
  Medium:   'text-ops-amber border-ops-amber/40',
  Low:      'text-ops-dim border-ops-border',
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  Active:     <span className="h-1.5 w-1.5 rounded-full bg-ops-red animate-pulse inline-block" />,
  Monitoring: <span className="h-1.5 w-1.5 rounded-full bg-ops-amber inline-block" />,
  Resolved:   <CheckCircle size={11} strokeWidth={1.5} className="text-ops-green" />,
}

function elapsed(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const m = Math.floor(ms / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ─── Result card ──────────────────────────────────────────────────────────────

function IncidentCard({ incident, query }: { incident: Incident; query: string }) {
  const navigate = useNavigate()

  // Highlight matching words in the title
  const highlighted = useMemo(() => {
    if (!query.trim()) return incident.title
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    let out = incident.title
    for (const w of words) {
      const re = new RegExp(`(${w})`, 'gi')
      out = out.replace(re, '~~$1~~') // placeholder, replaced below
    }
    return out
  }, [incident.title, query])

  const titleParts = highlighted.split(/(~~[^~]+~~)/)

  return (
    <button
      onClick={() => navigate(`/incidents/${incident.id}`)}
      className="group w-full border border-ops-border bg-ops-surface p-4 text-left transition-colors hover:border-ops-text/30 hover:bg-[#111]"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left */}
        <div className="min-w-0 flex-1">
          {/* ID + severity badge */}
          <div className="mb-1.5 flex items-center gap-2">
            <span className={`border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${SEV_COLOR[incident.severity] ?? 'text-ops-dim border-ops-border'}`}>
              {incident.severity}
            </span>
            <span className="font-mono text-[11px] text-ops-dim">INC-{incident.id}</span>
            <span className="flex items-center gap-1 text-[11px] text-ops-dim">
              {STATUS_ICON[incident.status]}
              {incident.status}
            </span>
          </div>

          {/* Title with highlights */}
          <div className="mb-1 font-mono text-sm font-semibold text-ops-text leading-snug">
            {titleParts.map((part, i) =>
              part.startsWith('~~') && part.endsWith('~~')
                ? <mark key={i} className="bg-ops-amber/20 text-ops-amber not-italic">{part.slice(2, -2)}</mark>
                : <span key={i}>{part}</span>
            )}
          </div>

          {/* Affected systems */}
          {incident.affectedSystems?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {incident.affectedSystems.slice(0, 4).map(s => (
                <span key={s} className="border border-ops-border px-1.5 py-px font-mono text-[10px] text-ops-dim">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex shrink-0 flex-col items-end gap-1 text-[11px] text-ops-dim font-mono">
          <div className="flex items-center gap-1">
            <Clock size={10} strokeWidth={1.5} />
            {elapsed(incident.detectedAt)}
          </div>
          <div className="text-[10px]">Ph {incident.phase}</div>
          <ArrowRight size={13} strokeWidth={1.5} className="mt-1 opacity-0 group-hover:opacity-60 transition-opacity" />
        </div>
      </div>
    </button>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SearchIncidents() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialQ = searchParams.get('q') ?? ''
  const [input, setInput] = useState(initialQ)
  const [autoRedirected, setAutoRedirected] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync input → URL (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      if (input.trim()) {
        setSearchParams({ q: input }, { replace: true })
      } else {
        setSearchParams({}, { replace: true })
      }
    }, 200)
    return () => clearTimeout(t)
  }, [input, setSearchParams])

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const candidates = useMemo(getCandidates, [])

  const results = useMemo(() => {
    const q = input.trim()
    if (!q) return candidates.filter(i => i.status !== 'Resolved')

    return candidates
      .map(i => ({ incident: i, score: scoreIncident(i, q) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score || (b.incident.severity === 'Critical' ? 1 : 0))
      .map(r => r.incident)
  }, [input, candidates])

  // Auto-redirect: one result with a good score
  useEffect(() => {
    if (autoRedirected) return
    const q = input.trim()
    if (!q || results.length !== 1) return

    const score = scoreIncident(results[0], q)
    if (score >= AUTO_REDIRECT_SCORE) {
      setAutoRedirected(true)
      // Small delay so the user sees what matched before being taken there
      const t = setTimeout(() => {
        navigate(`/incidents/${results[0].id}`)
      }, 600)
      return () => clearTimeout(t)
    }
  }, [results, input, navigate, autoRedirected])

  const q = input.trim()
  const isSearching = q.length > 0
  const isAutoRedirecting = autoRedirected && results.length === 1

  return (
    <div className="min-h-screen bg-ops-bg font-mono">
      {/* Header bar */}
      <div className="border-b border-ops-border bg-[#050505] px-6 py-4">
        <div className="mx-auto max-w-2xl">
          {/* Breadcrumb */}
          <div className="mb-3 flex items-center gap-2 text-[11px] text-ops-dim">
            <Link to="/" className="hover:text-ops-text transition-colors">majorops</Link>
            <span className="text-ops-border">/</span>
            <span className="text-ops-text">what</span>
          </div>

          {/* Search input */}
          <div className="flex items-center gap-3 border border-ops-border bg-ops-bg px-4 py-3 focus-within:border-ops-text/40 transition-colors">
            <Search size={14} strokeWidth={1.5} className="shrink-0 text-ops-dim" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => { setInput(e.target.value); setAutoRedirected(false) }}
              onKeyDown={e => {
                if (e.key === 'Enter' && results.length === 1) {
                  navigate(`/incidents/${results[0].id}`)
                }
                if (e.key === 'Escape') {
                  setInput('')
                }
              }}
              placeholder="payment processing  ·  auth latency  ·  storage  ·  anything"
              className="flex-1 bg-transparent text-sm text-ops-text placeholder:text-ops-dim/40 outline-none"
              spellCheck={false}
              autoComplete="off"
            />
            {input && (
              <button
                onClick={() => { setInput(''); setAutoRedirected(false); inputRef.current?.focus() }}
                className="text-[11px] text-ops-dim hover:text-ops-text transition-colors"
              >
                clear
              </button>
            )}
          </div>

          {/* Subtext */}
          <p className="mt-2 text-[11px] text-ops-dim">
            {isAutoRedirecting
              ? <span className="text-ops-green">↗ one match — redirecting to INC-{results[0].id}…</span>
              : isSearching
                ? results.length === 0
                  ? <span className="text-ops-amber flex items-center gap-1.5"><AlertTriangle size={11} strokeWidth={1.5} />no active incidents match "{q}"</span>
                  : `${results.length} incident${results.length !== 1 ? 's' : ''} matching "${q}"`
                : `${candidates.filter(i => i.status !== 'Resolved').length} active incident${candidates.filter(i => i.status !== 'Resolved').length !== 1 ? 's' : ''} — type anything to filter`
            }
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-2xl px-6 py-6">
        {results.length === 0 && isSearching ? (
          <div>
            {/* No match — show all active as fallback */}
            <p className="mb-4 text-[11px] text-ops-dim">All active incidents:</p>
            <div className="space-y-2">
              {candidates
                .filter(i => i.status !== 'Resolved')
                .map(i => <IncidentCard key={i.id} incident={i} query="" />)
              }
            </div>

            {/* Recently resolved */}
            {candidates.filter(i => i.status === 'Resolved').length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-[11px] text-ops-dim uppercase tracking-widest">
                  Recently resolved (last {RESOLVED_WINDOW_DAYS} days)
                </p>
                <div className="space-y-2 opacity-50">
                  {candidates
                    .filter(i => i.status === 'Resolved')
                    .map(i => <IncidentCard key={i.id} incident={i} query="" />)
                  }
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {results.map(i => (
              <IncidentCard key={i.id} incident={i} query={q} />
            ))}
          </div>
        )}

        {/* Tip */}
        <p className="mt-8 text-[10px] text-ops-dim/50">
          what.mim.run/payment · what.mim.run/auth outage · press Enter to open single match
        </p>
      </div>
    </div>
  )
}
