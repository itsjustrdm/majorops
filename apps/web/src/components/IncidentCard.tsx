import type { MouseEvent } from 'react'
import { ChevronRight, BarChart2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SeverityBadge, CriticalDurationBadge } from './ui/Badge'
import { useElapsed } from '../hooks/useClock'
import { formatDuration, phaseLabel, durationColor } from '../lib/utils'
import type { Incident } from '../types'

interface IncidentCardProps {
  incident: Incident
  adminMode?: boolean
}

// Severity → left-border accent + top color strip
function severityAccent(s: string) {
  switch (s) {
    case 'Critical': return { border: 'border-l-4 border-l-ops-red',    strip: 'bg-ops-red/10 border-b border-ops-red/20',    dot: 'bg-ops-red' }
    case 'High':     return { border: 'border-l-4 border-l-ops-orange', strip: 'bg-ops-orange/10 border-b border-ops-orange/20', dot: 'bg-ops-orange' }
    case 'Medium':   return { border: 'border-l-4 border-l-ops-amber',  strip: 'bg-ops-amber/5 border-b border-ops-amber/15',   dot: 'bg-ops-amber' }
    default:         return { border: 'border-l-4 border-l-ops-green',  strip: 'bg-ops-green/5 border-b border-ops-green/15',   dot: 'bg-ops-green' }
  }
}

export function IncidentCard({ incident, adminMode = false }: IncidentCardProps) {
  const navigate = useNavigate()
  const totalElapsed = useElapsed(incident.detectedAt)
  const isLongRunning = totalElapsed > 2 * 60 * 60 * 1000 // >2h
  const accent = severityAccent(incident.severity)

  const handleClick = () => {
    navigate(adminMode ? `/admin/incidents/${incident.id}` : `/incidents/${incident.id}`)
  }

  const go = (path: string) => (e: MouseEvent) => {
    e.stopPropagation()
    navigate(path)
  }

  return (
    <div
      className={`border border-ops-border bg-ops-surface cursor-pointer transition-colors hover:border-ops-red/40 group ${accent.border}`}
      onClick={handleClick}
    >
      {/* Severity color strip + header */}
      <div className={`px-5 pt-3 pb-3 ${accent.strip}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-block h-2 w-2 shrink-0 ${accent.dot}`} />
            <SeverityBadge severity={incident.severity} />
            {isLongRunning && <CriticalDurationBadge />}
            <span className="border border-ops-border bg-ops-muted/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ops-dim">
              Incident #{incident.id}
            </span>
          </div>
          <ChevronRight
            size={16}
            strokeWidth={1.5}
            className="shrink-0 text-ops-dim transition-transform group-hover:translate-x-0.5 group-hover:text-ops-red"
          />
        </div>

        <h2 className="mt-2 font-heading text-lg font-700 uppercase tracking-wide text-ops-text">
          {incident.title}
        </h2>
        <p className="mt-1 font-body text-sm leading-relaxed text-ops-dim line-clamp-2">
          {incident.description}
        </p>
      </div>

      {/* Sub-cards strip */}
      <div className="grid grid-cols-4 divide-x divide-ops-border border-t border-ops-border">
        {/* Current Phase */}
        <div className="px-4 py-3">
          <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-1.5 flex items-center gap-1">
            <BarChart2 size={10} strokeWidth={1.5} /> Current Phase
          </div>
          <div className="font-heading text-sm font-700 uppercase text-ops-text">
            {phaseLabel(incident.phase)}
          </div>
          {/* Mini phase progress */}
          <div className="mt-2 flex gap-0.5">
            {Array.from({ length: 8 }, (_, i) => {
              const n = i + 1
              const state = n < incident.phase ? 'done' : n === incident.phase ? 'active' : 'future'
              return (
                <div
                  key={n}
                  className={`h-1.5 flex-1 ${
                    state === 'done'   ? 'bg-ops-green' :
                    state === 'active' ? 'bg-ops-red' :
                    'bg-ops-border'
                  }`}
                />
              )
            })}
          </div>
          <div className="mt-1 font-mono text-[9px] text-ops-dim">
            Entered {new Date(incident.phaseEnteredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Duration */}
        <div className="px-4 py-3">
          <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-1.5">◷ Duration</div>
          <div className={`font-mono text-lg font-700 tabular-nums leading-tight ${durationColor(totalElapsed)}`}>
            {formatDuration(totalElapsed)}
          </div>
          <div className="mt-1 font-mono text-[9px] text-ops-dim">
            Started {new Date(incident.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Impact */}
        <div className={`px-4 py-3 ${incident.alert.customerCount > 0 ? 'border-l border-ops-red/20 bg-ops-red/5' : ''}`}>
          <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-1.5">
            👥 Impact
          </div>
          <div className={`font-mono text-lg font-700 tabular-nums leading-tight ${incident.alert.customerCount > 0 ? 'text-ops-orange' : 'text-ops-dim'}`}>
            {incident.alert.customerCount > 0 ? incident.alert.customerCount.toLocaleString() : '—'}
          </div>
          <div className="mt-1 font-mono text-[9px] text-ops-dim">
            {incident.alert.externalImpact}
          </div>
        </div>

        {/* Systems */}
        <div className="px-4 py-3">
          <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-1.5">
            ◎ Systems
          </div>
          <div className="font-body text-xs text-ops-text leading-snug">
            {incident.affectedSystems.slice(0, 2).join(', ')}
            {incident.affectedSystems.length > 2 && (
              <span className="text-ops-dim"> +{incident.affectedSystems.length - 2}</span>
            )}
          </div>
          <div className="mt-1 font-mono text-[9px] text-ops-dim">Affected infrastructure</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t border-ops-border px-5 py-3 sm:flex-row sm:items-center sm:justify-between bg-ops-muted/40">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={go(`/incidents/${incident.id}`)}
            className="border border-ops-border bg-ops-muted px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ops-dim hover:text-ops-text hover:border-ops-red/30 transition-colors"
          >
            Public
          </button>
          <button
            onClick={go(`/stakeholders/${incident.id}`)}
            className="border border-ops-border bg-ops-muted px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ops-dim hover:text-ops-text hover:border-ops-red/30 transition-colors"
          >
            Stakeholder
          </button>
          <button
            onClick={go(`/executives/${incident.id}`)}
            className="border border-ops-border bg-ops-muted px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ops-dim hover:text-ops-text hover:border-ops-red/30 transition-colors"
          >
            Executive
          </button>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-ops-dim hover:text-ops-text transition-colors">
          <BarChart2 size={11} strokeWidth={1.5} />
          {(() => {
            const last = incident.timeline[incident.timeline.length - 1]
            const ts = last?.timestamp ?? incident.detectedAt
            return `Last updated: ${new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          })()}
        </div>
      </div>
    </div>
  )
}
