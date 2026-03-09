import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Milestone } from '../types'
import { Card } from './ui/Card'
import { StatusBadge } from './ui/Badge'
import { formatDateTime } from '../lib/utils'
import { CadenceBadge } from './CadenceBadge'

interface MilestoneListProps {
  milestones: Milestone[]
  initialCount?: number
  title?: string
}

export function MilestoneList({ milestones, initialCount = 2, title = 'Milestones' }: MilestoneListProps) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? milestones : milestones.slice(0, initialCount)

  return (
    <Card className="px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-sm font-700 uppercase tracking-widest text-ops-text">{title}</h3>
          <span className="rounded-full border border-ops-border bg-ops-muted px-2 py-0.5 font-mono text-[10px] text-ops-dim">
            {milestones.length}
          </span>
        </div>
        {milestones.length > initialCount && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 border border-ops-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ops-dim hover:text-ops-text"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? 'Collapse' : 'Show All'}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {visible.map(m => (
          <div key={m.id} className="border border-ops-border bg-ops-surface px-3 py-3">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <StatusBadge status={m.statusAtCut} />
                {m.isResolution && (
                  <span className="border border-ops-green/40 bg-ops-green/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ops-green">Resolution</span>
                )}
              </div>
              <CadenceBadge nextUpdateEta={m.nextUpdateEta} className="!px-2" />
            </div>
            <div className="font-heading text-sm font-700 uppercase tracking-wide text-ops-text">{m.title}</div>
            <p className="mt-1 font-body text-sm leading-relaxed text-ops-dim">{m.body}</p>
            <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-ops-dim">
              <span>Cut by {m.cutBy}</span>
              <span>{formatDateTime(m.cutAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
