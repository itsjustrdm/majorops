import { PHASES } from '../types'
import type { PhaseNumber } from '../types'
import { phaseState } from '../lib/utils'

interface PhaseBarProps {
  currentPhase: PhaseNumber
  showNumbers?: boolean   // admin view shows numbers; public shows names only
  severity?: string       // for pulsing border on active phase
}

export function PhaseBar({ currentPhase, showNumbers = false, severity }: PhaseBarProps) {
  const isPriority = severity === 'Critical' || severity === 'High'

  return (
    <div className="flex w-full">
      {PHASES.map((phase, idx) => {
        const state = phaseState(phase.number as PhaseNumber, currentPhase)
        const isLast = idx === PHASES.length - 1

        const colors = {
          complete: 'bg-ops-green/10 border-ops-green text-ops-green',
          active:   `bg-ops-red/10 border-ops-red text-ops-red ${isPriority ? 'animate-border-pulse' : ''}`,
          future:   'bg-ops-muted border-ops-border text-ops-dim',
        }

        return (
          <div
            key={phase.number}
            className={`relative flex flex-1 items-center border px-3 py-2 ${colors[state]} ${isLast ? '' : 'mr-px'}`}
            style={{ clipPath: isLast ? undefined : 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)' }}
          >
            <div className="min-w-0 flex-1 text-center">
              {showNumbers && (
                <div className={`font-mono text-[9px] font-700 ${state === 'future' ? 'text-ops-dim' : ''}`}>
                  {phase.number}
                </div>
              )}
              <div className={`truncate font-heading text-xs font-700 uppercase tracking-wide ${showNumbers ? '' : 'text-[10px]'}`}>
                {phase.name}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
