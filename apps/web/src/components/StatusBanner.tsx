import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'
import type { SystemStatus } from '../data/mockData'
import { systemStatusColor } from '../lib/utils'

interface StatusBannerProps {
  status: SystemStatus
  incidentCount: number
  criticalCount: number
  lastUpdated: Date
}

const statusIcon = (s: SystemStatus) => {
  if (s === 'Operational') return <CheckCircle size={40} strokeWidth={1} className="text-ops-green" />
  if (s === 'Major Outage') return <AlertTriangle size={40} strokeWidth={1} className="text-ops-red" />
  return <AlertCircle size={40} strokeWidth={1} className="text-ops-amber" />
}

const statusBg = (s: SystemStatus) => {
  if (s === 'Operational') return 'border-ops-green/20 bg-ops-green/5'
  if (s === 'Major Outage') return 'border-ops-red/30 bg-ops-red/10'
  return 'border-ops-amber/20 bg-ops-amber/5'
}

export function StatusBanner({ status, incidentCount, criticalCount, lastUpdated }: StatusBannerProps) {
  return (
    <div className={`flex items-center justify-between border px-6 py-5 ${statusBg(status)}`}>
      <div className="flex items-center gap-5">
        {statusIcon(status)}
        <div>
          <h1 className={`font-display text-2xl font-900 uppercase tracking-widest ${systemStatusColor(status)}`}>
            {status}
          </h1>
          <div className="mt-1 flex items-center gap-2 font-mono text-xs text-ops-dim">
            <span className="h-3 w-3 opacity-50">◷</span>
            Last updated: {lastUpdated.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="border border-ops-border bg-ops-muted px-4 py-3 text-center">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ops-dim">Incidents</div>
          <div className="font-display text-xl font-700 text-ops-text">{incidentCount}</div>
        </div>
        {criticalCount > 0 && (
          <div className="border border-ops-red/40 bg-ops-red/10 px-4 py-3 text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ops-red">Critical</div>
            <div className="font-display text-xl font-700 text-ops-red">{criticalCount}</div>
          </div>
        )}
      </div>
    </div>
  )
}
