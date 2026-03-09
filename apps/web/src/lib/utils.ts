import type { Severity, IncidentStatus, PhaseNumber } from '../types'
import { PHASES } from '../types'

// ─── Duration formatting ──────────────────────────────────────────────────────

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m`
  if (m > 0) return `${m}m ${s.toString().padStart(2, '0')}s`
  return `${s}s`
}

export function formatDurationWithSeconds(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`
  return `${m}m ${s.toString().padStart(2, '0')}s`
}

// ─── Relative time ────────────────────────────────────────────────────────────

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ${(m % 60).toString().padStart(2, '0')}m ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString([], {
    month: 'numeric', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

// ─── Phase helpers ────────────────────────────────────────────────────────────

export function phaseLabel(n: PhaseNumber): string {
  return PHASES[n - 1]?.name ?? `Phase ${n}`
}

export function phaseDescription(n: PhaseNumber): string {
  return PHASES[n - 1]?.description ?? ''
}

export function phaseState(phase: PhaseNumber, current: PhaseNumber): 'complete' | 'active' | 'future' {
  if (phase < current) return 'complete'
  if (phase === current) return 'active'
  return 'future'
}

// ─── Severity colors ──────────────────────────────────────────────────────────

export function severityColor(severity: Severity): string {
  switch (severity) {
    case 'Critical': return 'text-ops-red'
    case 'High':     return 'text-ops-orange'
    case 'Medium':   return 'text-ops-amber'
    case 'Low':      return 'text-ops-green'
  }
}

export function severityBg(severity: Severity): string {
  switch (severity) {
    case 'Critical': return 'bg-ops-red/10 border-ops-red text-ops-red'
    case 'High':     return 'bg-ops-orange/10 border-ops-orange text-ops-orange'
    case 'Medium':   return 'bg-ops-amber/10 border-ops-amber text-ops-amber'
    case 'Low':      return 'bg-ops-green/10 border-ops-green text-ops-green'
  }
}

export function statusBg(status: IncidentStatus): string {
  switch (status) {
    case 'Active':      return 'bg-ops-red/10 border-ops-red text-ops-red'
    case 'Monitoring':  return 'bg-ops-amber/10 border-ops-amber text-ops-amber'
    case 'Resolved':    return 'bg-ops-green/10 border-ops-green text-ops-green'
  }
}

// Duration urgency — turns amber then red as time increases
export function durationColor(ms: number): string {
  const hours = ms / (1000 * 60 * 60)
  if (hours >= 2) return 'text-ops-orange'
  if (hours >= 1) return 'text-ops-amber'
  return 'text-ops-text'
}

// ─── System status colors ─────────────────────────────────────────────────────

export function systemStatusColor(status: string): string {
  switch (status) {
    case 'Operational':        return 'text-ops-green'
    case 'Degraded Performance': return 'text-ops-amber'
    case 'Partial Outage':     return 'text-ops-orange'
    case 'Major Outage':       return 'text-ops-red'
    default:                   return 'text-ops-dim'
  }
}
