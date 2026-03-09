import { Link } from 'react-router-dom'
import { WordmarkLogo } from './WordmarkLogo'
import { SeverityBadge, StatusBadge } from './ui/Badge'
import type { Incident } from '../types'

interface AudienceHeaderProps {
  incident: Incident
  audienceLabel: string
  backHref?: string
}

export function AudienceHeader({ incident, audienceLabel, backHref = '/' }: AudienceHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ops-border bg-ops-bg px-6 py-3">
      <div className="flex items-center gap-3">
        <Link to={backHref} className="font-mono text-xs text-ops-dim hover:text-ops-text transition-colors">
          ← Back
        </Link>
        <div className="flex items-center gap-3">
          <WordmarkLogo wartime={incident.severity === 'Critical'} size="sm" />
          <div className="h-4 w-px bg-ops-border" />
          <span className="font-heading text-xs font-700 uppercase tracking-widest text-ops-text">{audienceLabel}</span>
          <span className="font-mono text-[10px] text-ops-dim">Incident #{incident.id}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SeverityBadge severity={incident.severity} />
        <StatusBadge status={incident.status} />
      </div>
    </header>
  )
}
