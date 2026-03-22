/**
 * RoleTag — role badge with tooltip
 *
 * Hover any role badge to see the role's definition, pulled directly from
 * roles.ts (which is sourced from docs/operational/command-roles.md).
 *
 * One source of truth → docs site + app tooltip + UI labels.
 *
 * Usage:
 *   <RoleTag role="mim" name="R. Castillo" />
 *   <RoleTag role="sre" abbr />                  ← abbreviation-only badge
 *   <RoleTag role="leader" />                    ← role label, no name
 */

import { useState, useRef, useEffect } from 'react'
import { ExternalLink } from 'lucide-react'
import { getRoleDefinition, type RoleKey } from '../data/roles'

interface RoleTagProps {
  role:  RoleKey | string
  name?: string           // Person's name (optional)
  abbr?: boolean          // Show only the abbreviation badge, not the full label
  size?: 'sm' | 'md'
}

export function RoleTag({ role, name, abbr = false, size = 'md' }: RoleTagProps) {
  const def = getRoleDefinition(role)
  const [open, setOpen] = useState(false)
  const ref  = useRef<HTMLDivElement>(null)
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  function onEnter() {
    tRef.current = setTimeout(() => setOpen(true), 200)
  }
  function onLeave() {
    if (tRef.current) clearTimeout(tRef.current)
    setOpen(false)
  }

  if (!def) {
    // Unknown role — render plain
    return (
      <span className="font-mono text-[10px] text-ops-dim uppercase tracking-widest">
        {role}
      </span>
    )
  }

  const badgeSize = size === 'sm'
    ? 'px-1.5 py-0.5 text-[9px]'
    : 'px-2 py-1 text-[10px]'

  return (
    <div
      ref={ref}
      className="relative inline-block"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Badge */}
      <div className="flex items-center gap-1.5 cursor-default select-none">
        <span
          className={`font-mono uppercase tracking-widest border ${badgeSize} ${def.color} border-current/30 bg-current/5`}
        >
          {def.abbr}
        </span>
        {!abbr && (
          <span className={`font-body ${size === 'sm' ? 'text-[11px]' : 'text-sm'} text-ops-text`}>
            {name || def.label}
          </span>
        )}
        {!abbr && name && (
          <span className={`font-mono ${size === 'sm' ? 'text-[9px]' : 'text-[10px]'} ${def.color} opacity-60`}>
            {def.abbr}
          </span>
        )}
      </div>

      {/* Tooltip popover */}
      {open && (
        <div
          className="absolute bottom-full left-0 mb-2 z-50 w-72 border border-ops-border bg-ops-bg shadow-lg"
          onMouseEnter={() => tRef.current && clearTimeout(tRef.current)}
          onMouseLeave={onLeave}
        >
          {/* Header */}
          <div className={`border-b border-ops-border px-3 py-2.5 flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-[9px] uppercase tracking-widest border px-1.5 py-0.5 ${def.color} border-current/40`}>
                {def.abbr}
              </span>
              <span className="font-heading text-[12px] font-700 uppercase tracking-wide text-ops-text">
                {def.fullName}
              </span>
            </div>
            <a
              href="/docs/operational/command-roles/"
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-ops-dim hover:text-ops-text transition-colors shrink-0"
              title="Full role guide"
            >
              <ExternalLink size={9} strokeWidth={1.5} />
            </a>
          </div>

          {/* Tooltip body — sourced from roles.ts → command-roles.md */}
          <div className="px-3 py-3">
            <p className="font-body text-[12px] text-ops-dim leading-relaxed mb-3">
              {def.tooltip}
            </p>

            {/* Responsibilities — compact list */}
            <div className="space-y-1">
              {def.responsibilities.slice(0, 3).map((r, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className={`font-mono text-[9px] mt-0.5 shrink-0 ${def.color}`}>›</span>
                  <span className="font-body text-[11px] text-ops-dim leading-snug">{r}</span>
                </div>
              ))}
              {def.responsibilities.length > 3 && (
                <div className="font-mono text-[9px] text-ops-dim/50 pl-3.5">
                  +{def.responsibilities.length - 3} more in full guide
                </div>
              )}
            </div>
          </div>

          {/* "Not your job" — a compact warning row if it exists */}
          {def.notYourJob.length > 0 && (
            <div className="border-t border-ops-border px-3 py-2 bg-ops-surface">
              <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-1.5">
                Not this role's job
              </div>
              <p className="font-body text-[11px] text-ops-dim leading-snug">
                {def.notYourJob[0]}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * RoleAbbrBadge — just the colored abbreviation chip, with tooltip.
 * Useful in presence rosters and tight layouts.
 */
export function RoleAbbrBadge({ role, size = 'md' }: { role: RoleKey | string; size?: 'sm' | 'md' }) {
  return <RoleTag role={role} abbr size={size} />
}
