import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Info, Code2, ExternalLink, ChevronDown } from 'lucide-react'

interface NavItem {
  label:       string
  description: string
  to?:         string   // internal route
  href?:       string   // external link
  icon:        React.ReactNode
  badge?:      string
}

const NAV_ITEMS: NavItem[] = [
  {
    label:       'About MajorOps',
    description: 'Project overview and what this platform is built for',
    to:          '/about',
    icon:        <Info size={14} strokeWidth={1.5} />,
  },
  {
    label:       'Documentation',
    description: 'Operational playbooks, runbooks, and command-role guides',
    to:          '/docs/index.md',
    icon:        <BookOpen size={14} strokeWidth={1.5} />,
  },
  {
    label:       'API Reference',
    description: 'REST endpoints, request/response schemas, auth details',
    to:          '/api-reference',
    icon:        <Code2 size={14} strokeWidth={1.5} />,
    badge:       'v1',
  },
  {
    label:       'about.majorops.io',
    description: 'Public-facing product site',
    href:        'https://about.majorops.io',
    icon:        <ExternalLink size={14} strokeWidth={1.5} />,
    badge:       'soon',
  },
]

export function NavMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest transition-colors ${
          open
            ? 'border-ops-red/60 bg-ops-red/10 text-ops-red'
            : 'border-ops-border text-ops-dim hover:text-ops-text hover:border-ops-border/80'
        }`}
      >
        Resources
        <ChevronDown
          size={9}
          strokeWidth={2}
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-72 border border-ops-border bg-ops-surface shadow-2xl">
          {/* Header */}
          <div className="border-b border-ops-border px-4 py-2 bg-ops-muted">
            <span className="font-mono text-[9px] uppercase tracking-widest text-ops-dim">
              MajorOps Platform
            </span>
          </div>

          {/* Items */}
          <div className="py-1">
            {NAV_ITEMS.map(item => {
              const inner = (
                <div
                  key={item.label}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-ops-muted transition-colors cursor-pointer group"
                >
                  <span className="mt-0.5 shrink-0 text-ops-dim group-hover:text-ops-red transition-colors">
                    {item.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-[12px] font-700 uppercase tracking-wide text-ops-text group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 border border-ops-border text-ops-dim">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 font-body text-[11px] leading-snug text-ops-dim">
                      {item.description}
                    </p>
                  </div>
                </div>
              )

              if (item.to) {
                return (
                  <Link key={item.label} to={item.to} onClick={() => setOpen(false)}>
                    {inner}
                  </Link>
                )
              }

              // Local paths (start with /) stay in the same tab; external URLs open new tab
              const isExternal = item.href?.startsWith('http')
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {inner}
                </a>
              )
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-ops-border px-4 py-2 bg-ops-muted">
            <p className="font-mono text-[8px] text-ops-dim leading-relaxed">
              MajorOps · Major Incident Operations Platform · v0.1.0-alpha
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
