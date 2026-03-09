import { AlertTriangle, MessageSquare, Activity, Users, Bell } from 'lucide-react'
import { formatTime, formatDateTime } from '../lib/utils'
import type { TimelineEvent } from '../types'

interface TimelineFeedProps {
  events: TimelineEvent[]
}

const iconMap: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  alert:   { icon: AlertTriangle, color: 'text-ops-red',   bg: 'bg-ops-red/10 border-ops-red'   },
  phase:   { icon: Activity,      color: 'text-ops-blue',  bg: 'bg-ops-blue/10 border-ops-blue'  },
  update:  { icon: MessageSquare, color: 'text-ops-amber', bg: 'bg-ops-amber/10 border-ops-amber' },
  command: { icon: Users,         color: 'text-ops-green', bg: 'bg-ops-green/10 border-ops-green' },
  action:  { icon: Bell,          color: 'text-ops-dim',   bg: 'bg-ops-muted border-ops-border'  },
}

export function TimelineFeed({ events }: TimelineFeedProps) {
  const sorted = [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return (
    <div className="space-y-0">
      {sorted.map((event, idx) => {
        const meta = iconMap[event.type] ?? iconMap.action
        const Icon = meta.icon
        const isLast = idx === sorted.length - 1

        return (
          <div key={event.id} className="flex gap-4">
            {/* Icon column */}
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center border ${meta.bg}`}>
                <Icon size={13} strokeWidth={1.5} className={meta.color} />
              </div>
              {!isLast && <div className="w-px flex-1 bg-ops-border" style={{ minHeight: '16px' }} />}
            </div>

            {/* Content */}
            <div className={`flex-1 pb-4 ${isLast ? '' : ''}`}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-body text-sm font-600 text-ops-text">{event.title}</span>
                  {event.visibility === 'public' && (
                    <span className="border border-ops-blue/30 bg-ops-blue/5 px-1.5 py-px font-mono text-[9px] uppercase tracking-widest text-ops-blue">
                      Public
                    </span>
                  )}
                </div>
                <span className="shrink-0 font-mono text-[10px] text-ops-dim tabular-nums">
                  {formatTime(event.timestamp)}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[10px] text-ops-dim">
                  {event.actor} · {formatDateTime(event.timestamp).split(',')[0]}
                </span>
              </div>
              <p className="font-body text-sm text-ops-dim leading-relaxed">{event.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
