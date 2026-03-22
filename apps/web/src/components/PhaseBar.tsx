import { useState } from 'react'
import { PHASES } from '../lib/content'
import type { PhaseNumber, TimelineEvent } from '../types'
import { phaseState, formatTime, formatDuration } from '../lib/utils'

/** Extract up to `max` ordered-list lines from a detail block. */
function extractChecklist(detail: string, max = 4): string[] {
  return detail
    .split('\n')
    .map(l => l.trim())
    .filter(l => /^\d+\./.test(l))
    .slice(0, max)
    .map(l => l.replace(/^\d+\.\s*/, ''))
}

interface PhaseBarProps {
  currentPhase: PhaseNumber
  showNumbers?: boolean
  severity?: string
  timeline?: TimelineEvent[]
}

function buildPhaseTimings(timeline: TimelineEvent[]): Partial<Record<PhaseNumber, string>> {
  const map: Partial<Record<PhaseNumber, string>> = {}
  for (const ev of timeline) {
    if (ev.type === 'phase' && ev.phaseNumber && !map[ev.phaseNumber]) {
      map[ev.phaseNumber] = ev.timestamp
    }
  }
  return map
}

function msBetween(fromIso: string, toIso: string): number {
  return new Date(toIso).getTime() - new Date(fromIso).getTime()
}

export function PhaseBar({
  currentPhase,
  showNumbers = false,
  severity,
  timeline = [],
}: PhaseBarProps) {
  const isPriority = severity === 'Critical' || severity === 'High'
  const [hoveredPhase, setHoveredPhase] = useState<PhaseNumber | null>(null)
  const phaseTimings = buildPhaseTimings(timeline)

  return (
    <div className="flex w-full gap-px">
      {PHASES.map((phase, idx) => {
        const phaseNum = phase.number as PhaseNumber
        const state = phaseState(phaseNum, currentPhase)
        const isFirst = idx === 0
        const isLast = idx === PHASES.length - 1
        const isHovered = hoveredPhase === phaseNum

        const enteredAt = phaseTimings[phaseNum]
        const nextEnteredAt = phaseTimings[(phase.number + 1) as PhaseNumber]

        // ── Chevron clip-path: indent left edge (except first), point right edge (except last)
        const leftIndent = isFirst ? '0' : '10px'
        const clipPath = `polygon(${leftIndent} 0, ${isLast ? '100%' : 'calc(100% - 10px)'} 0, 100% 50%, ${isLast ? '100%' : 'calc(100% - 10px)'} 100%, ${leftIndent} 100%, ${isFirst ? '0' : '10px'} 50%)`

        // ── Solid-enough fills so the chevron shape reads clearly
        const bg = {
          complete: 'bg-ops-green/25',
          active:   isPriority ? 'bg-ops-red/30' : 'bg-ops-red/20',
          future:   'bg-ops-muted',
        }[state]

        const text = {
          complete: 'text-ops-green',
          active:   'text-white',
          future:   'text-ops-dim',
        }[state]

        const border = {
          complete: 'outline outline-1 outline-ops-green/50',
          active:   `outline outline-1 outline-ops-red${isPriority ? ' animate-border-pulse' : ''}`,
          future:   'outline outline-1 outline-ops-border/60',
        }[state]

        return (
          <div
            key={phaseNum}
            className={`relative flex flex-1 items-center justify-center py-2.5 cursor-default transition-colors ${bg} ${border} ${text}`}
            style={{ clipPath }}
            onMouseEnter={() => setHoveredPhase(phaseNum)}
            onMouseLeave={() => setHoveredPhase(null)}
          >
            <div className="min-w-0 text-center px-3">
              {/* Number + indicator */}
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className={`font-mono text-[9px] font-700 tabular-nums leading-none ${state === 'future' ? 'opacity-40' : 'opacity-70'}`}>
                  {String(phase.number).padStart(2, '0')}
                </span>
                {state === 'complete' && (
                  <span className="text-[8px] leading-none opacity-80">✓</span>
                )}
                {state === 'active' && (
                  <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-none bg-current ${isPriority ? 'animate-pulse' : ''}`} />
                )}
              </div>
              {/* Phase name */}
              <div className={`truncate font-heading text-[11px] font-700 uppercase tracking-wide ${state === 'future' ? 'opacity-35' : ''}`}>
                {phase.name}
              </div>
            </div>

            {/* ── Tooltip — appears BELOW the bar so it isn't clipped ── */}
            {isHovered && (
              <div
                className="absolute top-full z-50 mt-1.5 min-w-[220px] max-w-[280px] border border-ops-border bg-ops-bg shadow-2xl pointer-events-none"
                style={{ left: '50%', transform: 'translateX(-50%)' }}
              >
                {/* Arrow notch pointing up */}
                <div
                  className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-l border-t border-ops-border bg-ops-bg"
                />

                {/* Header */}
                <div className={`relative px-3 py-1.5 border-b border-ops-border ${
                  state === 'active'   ? 'bg-ops-red/15'   :
                  state === 'complete' ? 'bg-ops-green/10' :
                  'bg-ops-muted'
                }`}>
                  <span className="font-heading text-[11px] font-700 uppercase tracking-wide text-ops-text">
                    Phase {phase.number} · {phase.name}
                  </span>
                </div>

                {/* Body */}
                <div className="relative px-3 py-2 space-y-1.5">
                  {/* Timing rows — only for reached phases */}
                  {state !== 'future' && (
                    enteredAt ? (
                      <>
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="font-mono text-[8px] uppercase tracking-widest text-ops-dim">Entered</span>
                          <span className="font-mono text-[10px] text-ops-text tabular-nums">{formatTime(enteredAt)}</span>
                        </div>
                        {nextEnteredAt && (
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="font-mono text-[8px] uppercase tracking-widest text-ops-dim">Duration</span>
                            <span className="font-mono text-[10px] text-ops-green tabular-nums">
                              {formatDuration(msBetween(enteredAt, nextEnteredAt))}
                            </span>
                          </div>
                        )}
                        {state === 'active' && (
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="font-mono text-[8px] uppercase tracking-widest text-ops-dim">Active for</span>
                            <span className="font-mono text-[10px] text-ops-amber tabular-nums">
                              {formatDuration(msBetween(enteredAt, new Date().toISOString()))}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="font-mono text-[9px] text-ops-dim">No timing data</p>
                    )
                  )}

                  {/* Primary job summary — always shown */}
                  <div className={`${state !== 'future' ? 'pt-1.5 border-t border-ops-border/40' : ''}`}>
                    <p className="font-mono text-[8px] uppercase tracking-widest text-ops-dim mb-1">
                      {state === 'future' ? 'Upcoming' : state === 'active' ? 'Your job' : 'Was'}
                    </p>
                    <p className="font-body text-[10px] leading-snug text-ops-text">{phase.description}</p>
                  </div>

                  {/* Checklist preview — from mim.md detail section */}
                  {phase.detail && (state === 'active' || state === 'future') && (() => {
                    const items = extractChecklist(phase.detail, state === 'active' ? 4 : 3)
                    if (!items.length) return null
                    return (
                      <div className="pt-1 border-t border-ops-border/40">
                        <p className="font-mono text-[8px] uppercase tracking-widest text-ops-dim mb-1.5">Checklist</p>
                        <ol className="space-y-0.5">
                          {items.map((item, i) => (
                            <li key={i} className="flex gap-1.5 items-baseline">
                              <span className="font-mono text-[8px] text-ops-red shrink-0 tabular-nums">{i + 1}.</span>
                              <span className="font-body text-[9px] leading-snug text-ops-dim">{item}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
