import { MessageSquare, Clock, Activity } from 'lucide-react'
import { useElapsed } from '../hooks/useClock'
import { formatDuration, formatRelative, phaseLabel } from '../lib/utils'
import { SectionLabel } from './ui/Card'
import type { Incident } from '../types'

interface MetricsSidebarProps {
  incident: Incident
}

export function MetricsSidebar({ incident }: MetricsSidebarProps) {
  const duration = useElapsed(incident.detectedAt)
  const lastUpdate = incident.updates[incident.updates.length - 1]

  // Recent activity = last 5 timeline events reversed
  const recent = [...incident.timeline].reverse().slice(0, 5)

  return (
    <div className="flex flex-col gap-0 divide-y divide-ops-border">
      {/* Communications */}
      <div className="px-4 py-4">
        <div className="mb-3 flex items-center gap-2">
          <MessageSquare size={13} strokeWidth={1.5} className="text-ops-blue" />
          <SectionLabel>Communications</SectionLabel>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-ops-dim">Public Updates</span>
            <span className="font-mono text-xs font-700 text-ops-text">
              {incident.updates.filter(u => u.visibility === 'public').length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-ops-dim">Last Update</span>
            <span className="font-mono text-xs text-ops-text">
              {lastUpdate ? formatRelative(lastUpdate.timestamp) : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="px-4 py-4">
        <div className="mb-3 flex items-center gap-2">
          <Activity size={13} strokeWidth={1.5} className="text-ops-amber" />
          <SectionLabel>Live Metrics</SectionLabel>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-ops-dim">Duration</span>
            <span className="font-mono text-xs font-700 tabular-nums text-ops-text">{formatDuration(duration)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-ops-dim">Current Phase</span>
            <span className="font-mono text-xs font-700 text-ops-text">
              {incident.phase}/8
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-ops-dim">Affected</span>
            <span className={`font-mono text-xs font-700 tabular-nums ${incident.alert.customerCount > 0 ? 'text-ops-orange' : 'text-ops-dim'}`}>
              {incident.alert.customerCount > 0 ? incident.alert.customerCount.toLocaleString() : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 py-4">
        <div className="mb-3 flex items-center gap-2">
          <Clock size={13} strokeWidth={1.5} className="text-ops-dim" />
          <SectionLabel>Recent Activity</SectionLabel>
        </div>
        <div className="space-y-2.5">
          {recent.map(event => (
            <div key={event.id} className="flex items-start gap-2">
              <Clock size={11} className="mt-0.5 shrink-0 text-ops-dim" strokeWidth={1.5} />
              <div className="min-w-0">
                <div className="font-mono text-xs text-ops-text leading-tight truncate">{event.title}</div>
                <div className="font-mono text-[10px] text-ops-dim">{formatRelative(event.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
