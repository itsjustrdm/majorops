import { Timer, Users, AlertTriangle, Activity, MessageSquare } from 'lucide-react'
import { useElapsed } from '../hooks/useClock'
import { formatDurationWithSeconds, phaseLabel, durationColor } from '../lib/utils'
import type { Incident } from '../types'

interface FixedFooterBarProps {
  incident: Incident
}

export function FixedFooterBar({ incident }: FixedFooterBarProps) {
  const totalElapsed = useElapsed(incident.detectedAt)
  const impactElapsed = useElapsed(incident.alert.issueTime)

  const tiles = [
    {
      icon: <Timer size={16} strokeWidth={1.5} className={durationColor(totalElapsed)} />,
      label: 'Total Duration',
      value: formatDurationWithSeconds(totalElapsed),
      className: durationColor(totalElapsed),
    },
    {
      icon: <AlertTriangle size={16} strokeWidth={1.5} className="text-ops-orange" />,
      label: 'Customer Impact',
      value: formatDurationWithSeconds(impactElapsed),
      className: 'text-ops-orange',
    },
    {
      icon: <Users size={16} strokeWidth={1.5} className="text-ops-text" />,
      label: 'Affected Users',
      value: incident.alert.customerCount > 0 ? incident.alert.customerCount.toLocaleString() : 'None confirmed',
      className: incident.alert.customerCount > 0 ? 'text-ops-orange' : 'text-ops-dim',
    },
    {
      icon: <Activity size={16} strokeWidth={1.5} className="text-ops-amber" />,
      label: 'Current Phase',
      value: `${incident.phase}/8 — ${phaseLabel(incident.phase)}`,
      className: 'text-ops-amber',
    },
    {
      icon: <MessageSquare size={16} strokeWidth={1.5} className="text-ops-blue" />,
      label: 'Updates Posted',
      value: incident.updatesPosted.toString(),
      className: 'text-ops-blue',
    },
  ]

  return (
    <div className="fixed bottom-8 left-0 right-0 z-40 flex border-t border-ops-border bg-ops-bg">
      {tiles.map((tile, i) => (
        <div
          key={i}
          className={`flex flex-1 items-center gap-3 border-r border-ops-border px-4 py-3 last:border-r-0`}
        >
          {tile.icon}
          <div className="min-w-0">
            <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim">{tile.label}</div>
            <div className={`font-mono text-sm font-700 tabular-nums ${tile.className}`}>{tile.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
