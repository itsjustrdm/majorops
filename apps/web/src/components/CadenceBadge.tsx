import { Clock } from 'lucide-react'
import { useMemo } from 'react'

interface CadenceBadgeProps {
  nextUpdateEta: string | null
  lastCommunicatedAt?: string | null
  className?: string
}

function formatEta(eta: string | null): string {
  if (!eta) return 'Not set'
  const diffMs = new Date(eta).getTime() - Date.now()
  const diffMinutes = Math.round(Math.abs(diffMs) / 60000)
  if (diffMs >= 0) return `Due in ${diffMinutes}m`
  return `Overdue by ${diffMinutes}m`
}

export function CadenceBadge({ nextUpdateEta, lastCommunicatedAt, className = '' }: CadenceBadgeProps) {
  const state = useMemo<'ok' | 'overdue' | 'unset'>(() => {
    if (!nextUpdateEta) return 'unset'
    return new Date(nextUpdateEta).getTime() < Date.now() ? 'overdue' : 'ok'
  }, [nextUpdateEta])

  const label = formatEta(nextUpdateEta)
  const last = lastCommunicatedAt ? new Date(lastCommunicatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'

  const color = state === 'overdue'
    ? 'border-ops-orange/60 bg-ops-orange/10 text-ops-orange'
    : state === 'unset'
      ? 'border-ops-border text-ops-dim'
      : 'border-ops-green/50 bg-ops-green/10 text-ops-green'

  return (
    <span className={`inline-flex items-center gap-2 border px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${color} ${className}`}>
      <Clock size={12} strokeWidth={1.5} />
      {label}
      <span className="text-ops-dim">| Last comms {last}</span>
    </span>
  )
}
