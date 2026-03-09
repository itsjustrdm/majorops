import { severityBg, statusBg } from '../../lib/utils'
import type { Severity, IncidentStatus } from '../../types'

interface SeverityBadgeProps {
  severity: Severity
  className?: string
}

export function SeverityBadge({ severity, className = '' }: SeverityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 font-heading text-xs font-700 uppercase tracking-widest ${severityBg(severity)} ${className}`}
    >
      {severity}
    </span>
  )
}

interface StatusBadgeProps {
  status: IncidentStatus
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 font-heading text-xs font-700 uppercase tracking-widest ${statusBg(status)} ${className}`}
    >
      {status}
    </span>
  )
}

interface LiveDotProps {
  pulse?: boolean
}

export function LiveDot({ pulse = true }: LiveDotProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`inline-block h-2 w-2 rounded-full bg-ops-red ${pulse ? 'animate-pulse-slow' : ''}`}
      />
      <span className="font-mono text-xs uppercase tracking-widest text-ops-red">Live</span>
    </span>
  )
}

interface CriticalDurationBadgeProps {
  label?: string
}

export function CriticalDurationBadge({ label = 'Critical Duration' }: CriticalDurationBadgeProps) {
  return (
    <span className="inline-flex items-center border border-ops-orange/50 bg-ops-orange/10 px-2 py-0.5 font-heading text-xs font-700 uppercase tracking-widest text-ops-orange">
      ⚠ {label}
    </span>
  )
}
