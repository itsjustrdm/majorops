import { Users, Shield, AlertTriangle } from 'lucide-react'
import { SectionLabel } from './ui/Card'
import { formatRelative } from '../lib/utils'
import type { IncidentParticipant, ParticipantRole } from '../types'

const ROLE_LABELS: Record<ParticipantRole, string> = {
  mim:             'MIM',
  sre:             'SRE',
  leader:          'Leader',
  service_manager: 'Svc Mgr',
  customer_ops:    'Cust Ops',
  validator:       'Validator',
  responder:       'Responder',
  observer:        'Observer',
}

const ROLE_COLORS: Record<ParticipantRole, string> = {
  mim:             'text-ops-red border-ops-red/30',
  sre:             'text-ops-amber border-ops-amber/30',
  leader:          'text-ops-orange border-ops-orange/30',
  service_manager: 'text-ops-blue border-ops-blue/30',
  customer_ops:    'text-ops-blue border-ops-blue/30',
  validator:       'text-ops-green border-ops-green/30',
  responder:       'text-ops-text border-ops-border',
  observer:        'text-ops-dim border-ops-border',
}

interface PresenceRosterProps {
  participants: IncidentParticipant[]
}

export function PresenceRoster({ participants }: PresenceRosterProps) {
  const onScene = participants.filter(p => p.isOnScene)
  const departed = participants.filter(p => !p.isOnScene)
  const leaders = onScene.filter(p => p.role === 'leader')
  const hasLeader = leaders.length > 0

  return (
    <div>
      {/* Leader presence banner */}
      {hasLeader && (
        <div className="mb-3 flex items-center gap-2 border border-ops-orange/30 bg-ops-orange/5 px-3 py-2">
          <Shield size={12} strokeWidth={1.5} className="text-ops-orange shrink-0" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ops-orange">Leader On Scene</div>
            <div className="font-mono text-[10px] text-ops-dim">
              {leaders.map(l => l.displayName).join(', ')} — escalation authority available
            </div>
          </div>
        </div>
      )}

      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={12} strokeWidth={1.5} className="text-ops-dim" />
          <SectionLabel>On Scene ({onScene.length})</SectionLabel>
        </div>
      </div>

      <div className="space-y-1">
        {onScene.map(p => (
          <div key={`${p.userId}-${p.joinedAt}`} className="flex items-center gap-2 py-1.5 border-b border-ops-border/50 last:border-0">
            {/* Presence dot */}
            <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${p.isSilent ? 'bg-ops-dim' : 'bg-ops-green'} ${!p.isSilent ? 'animate-pulse' : ''}`} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-body text-xs text-ops-text truncate">{p.displayName}</span>
                {p.rapidEscalationFlag && (
                  <AlertTriangle size={9} strokeWidth={1.5} className="text-ops-orange shrink-0" />
                )}
              </div>
              <div className="font-mono text-[9px] text-ops-dim">
                +{formatRelative(p.joinedAt)}
                {p.isSilent && ' · silent'}
              </div>
            </div>

            <span className={`shrink-0 border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide ${ROLE_COLORS[p.role]}`}>
              {ROLE_LABELS[p.role]}
            </span>
          </div>
        ))}

        {departed.length > 0 && (
          <div className="mt-2 pt-2 border-t border-ops-border">
            <div className="mb-1 font-mono text-[9px] uppercase tracking-widest text-ops-dim">Departed</div>
            {departed.map(p => (
              <div key={`${p.userId}-departed`} className="flex items-center gap-2 py-1 opacity-50">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-ops-dim" />
                <span className="flex-1 font-body text-xs text-ops-dim">{p.displayName}</span>
                <span className="font-mono text-[9px] text-ops-dim">{ROLE_LABELS[p.role]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
