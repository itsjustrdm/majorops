import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ChevronDown, ChevronRight, ArrowLeft, Menu,
  BookOpen, Home, FileText, AlertCircle, Users,
  Shield, Server, Layers, BookMarked, ClipboardList,
} from 'lucide-react'
import { parseMarkdown, extractTitle } from '../lib/markdown'
import docsFiles from 'virtual:docs'

// App-native docs nav. The markdown files remain in /docs, but the React app
// is now the canonical reader and navigation surface.

interface NavLeaf {
  label: string
  file?: string   // .md path relative to docs/
  href?: string   // external URL
}

interface NavSection {
  label: string
  icon?: React.ReactNode
  file?: string   // section IS a direct page (no children)
  items?: NavLeaf[]
}

const NAV: NavSection[] = [
  {
    label: 'Home',
    icon: <Home size={12} />,
    file: 'index.md',
  },
  {
    label: 'Foundations',
    icon: <BookOpen size={12} />,
    items: [
      { label: 'Philosophy',  file: 'philosophy/PHILOSOPHY.md' },
      { label: 'Glossary',    file: 'GLOSSARY.md' },
      { label: 'Domains',     file: 'DOMAINS.md' },
    ],
  },
  {
    label: 'Command Structure',
    icon: <Layers size={12} />,
    items: [
      { label: 'IT-ICS Roles',          file: 'philosophy/ICS-IT-STRUCTURE.md' },
      { label: 'Bridge Control',         file: 'philosophy/bridge-control.md' },
      { label: 'Escalation Framework',   file: 'philosophy/escalation-framework.md' },
    ],
  },
  {
    label: 'Architecture',
    icon: <Server size={12} />,
    items: [
      { label: 'Signal Flow', file: 'architecture/signal-flow.md' },
    ],
  },
  {
    label: 'User Guide',
    icon: <Users size={12} />,
    items: [
      { label: 'MIM Operator Guide',      file: 'user-guide/mim.md' },
      { label: 'Stakeholder View',         file: 'user-guide/stakeholder.md' },
      { label: 'Executive View',           file: 'user-guide/executive.md' },
      { label: 'Personas & User Stories',  file: 'user-guide/personas.md' },
    ],
  },
  {
    label: 'Operations',
    icon: <AlertCircle size={12} />,
    items: [
      { label: 'Alarm Levels',       file: 'ALARM-LEVELS.md' },
      { label: 'Exposure Notation',  file: 'philosophy/EXPOSURE_NOTATION.md' },
      { label: 'Run Card System',    file: 'RUNCARD-SYSTEM.md' },
      { label: 'Run Cards',          file: 'runcards/index.md' },
    ],
  },
  {
    label: 'Governance',
    icon: <Shield size={12} />,
    items: [
      { label: 'After Action',         file: 'governance/after-action.md' },
      { label: 'Peer Review',           file: 'governance/peer-review.md' },
      { label: 'Response Reputation',   file: 'governance/RESPONSE-REPUTATION.md' },
      { label: 'KPI Source of Truth',   file: 'governance/kpis.md' },
    ],
  },
  {
    label: 'Operational Refs',
    icon: <ClipboardList size={12} />,
    items: [
      { label: 'Content Tiers',      file: 'CONTENT-TIERS.md' },
      { label: 'Command Roles',       file: 'operational/command-roles.md' },
      { label: 'DB Pool Exhaustion',  file: 'operational/db-connection-pool-exhaustion.md' },
    ],
  },
  {
    label: 'Reference',
    icon: <FileText size={12} />,
    items: [
      { label: 'API Reference',   href: '/api-reference' },
      { label: 'Data Dictionary', file: 'data-dictionary.md' },
      { label: 'Contributing',    file: 'CONTRIBUTING.md' },
      { label: 'Changelog',       file: 'CHANGELOG.md' },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function allNavLeaves(): { label: string; file: string }[] {
  const result: { label: string; file: string }[] = []
  for (const section of NAV) {
    if (section.file) result.push({ label: section.label, file: section.file })
    if (section.items) {
      for (const item of section.items) {
        if (item.file) result.push({ label: item.label, file: item.file })
      }
    }
  }
  return result
}

function resolveLink(currentFile: string, href: string): string {
  if (href.startsWith('/') || href.startsWith('http')) return href
  const [pathPart, anchor] = href.split('#')
  if (!pathPart) return currentFile + (anchor ? `#${anchor}` : '')
  const dir = currentFile.includes('/')
    ? currentFile.slice(0, currentFile.lastIndexOf('/') + 1)
    : ''
  const joined = dir + pathPart
  const parts = joined.split('/')
  const out: string[] = []
  for (const p of parts) {
    if (p === '..') out.pop()
    else if (p !== '.') out.push(p)
  }
  return out.join('/') + (anchor ? `#${anchor}` : '')
}

function activeSectionsFor(file: string): Set<string> {
  const s = new Set<string>()
  for (const section of NAV) {
    if (section.file === file) s.add(section.label)
    if (section.items?.some(i => i.file === file)) s.add(section.label)
  }
  return s
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const { '*': slug = '' } = useParams<{ '*': string }>()
  const navigate = useNavigate()
  const mainRef = useRef<HTMLDivElement>(null)

  const currentFile = slug || 'index.md'

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const s = new Set<string>()
    for (const section of NAV) {
      if (section.items) s.add(section.label)
    }
    return s
  })

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [currentFile])

  useEffect(() => {
    setExpanded(prev => {
      const next = new Set(prev)
      for (const label of activeSectionsFor(currentFile)) next.add(label)
      return next
    })
  }, [currentFile])

  const raw = docsFiles[currentFile]
  const html = raw ? parseMarkdown(raw) : null
  const isDraft = raw?.includes('draft: true')

  const leaves = allNavLeaves()
  const navEntry = leaves.find(l => l.file === currentFile)
  const pageTitle = navEntry?.label ?? (raw ? extractTitle(raw) : currentFile)

  const handleContentClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest('a')
    if (!anchor) return
    const href = anchor.getAttribute('href')
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) return
    // Let _blank links open naturally (run cards etc.)
    if (anchor.getAttribute('target') === '_blank') return
    e.preventDefault()
    const resolved = resolveLink(currentFile, href)
    if (resolved.endsWith('.md') || docsFiles[resolved]) {
      navigate(`/docs/${resolved}`)
    } else {
      // Non-.md static asset — resolve to absolute path
      const abs = '/' + resolved
      window.open(abs, '_self')
    }
  }, [currentFile, navigate])

  const toggleSection = (label: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  // ── Sidebar leaf ─────────────────────────────────────────────────────────
  const SidebarLeaf = ({ item, indent }: { item: NavLeaf; indent?: boolean }) => {
    const isActive = item.file === currentFile
    const px = indent ? 'pl-7 pr-3' : 'pl-4 pr-3'

    if (item.href) {
      return (
        <a
          href={item.href}
          className={`flex items-center justify-between py-1.5 ${px} font-mono text-[11px] text-ops-dim hover:text-ops-text hover:bg-ops-muted transition-colors`}
        >
          {item.label}
          <span className="text-[9px] text-ops-border">↗</span>
        </a>
      )
    }

    return (
      <Link
        to={`/docs/${item.file}`}
        className={`block py-1.5 ${px} font-mono text-[11px] transition-colors ${
          isActive
            ? 'text-ops-red bg-ops-red/8 border-r-2 border-r-ops-red'
            : 'text-ops-dim hover:text-ops-text hover:bg-ops-muted'
        }`}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-ops-bg overflow-hidden">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="h-9 flex-shrink-0 border-b border-ops-border bg-ops-surface flex items-center px-3 gap-2.5 z-20">
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="text-ops-dim hover:text-ops-text transition-colors p-1"
          title="Toggle sidebar"
        >
          <Menu size={12} />
        </button>

        <Link
          to="/"
          className="flex items-center gap-1.5 text-ops-dim hover:text-ops-red transition-colors group"
        >
          <ArrowLeft size={11} strokeWidth={2} />
          <span className="font-mono text-[9px] uppercase tracking-widest">Platform</span>
        </Link>

        <span className="text-ops-border">·</span>

        <span className="font-mono text-[9px] uppercase tracking-widest text-ops-dim">
          Docs
        </span>

        {pageTitle && (
          <>
            <span className="text-ops-border">·</span>
            <span className="font-mono text-[9px] text-ops-text truncate max-w-[200px]">
              {pageTitle}
            </span>
          </>
        )}
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        {sidebarOpen && (
          <aside className="w-52 flex-shrink-0 border-r border-ops-border bg-ops-surface overflow-y-auto">
            <div className="pt-3 pb-6">
              <div className="px-4 pb-2">
                <span className="font-mono text-[8px] uppercase tracking-widest text-ops-border">
                  Contents
                </span>
              </div>

              {NAV.map(section => {
                if (section.file) {
                  const isActive = section.file === currentFile
                  return (
                    <Link
                      key={section.label}
                      to={`/docs/${section.file}`}
                      className={`flex items-center gap-2 px-4 py-1.5 font-mono text-[11px] transition-colors ${
                        isActive
                          ? 'text-ops-red bg-ops-red/8 border-r-2 border-r-ops-red'
                          : 'text-ops-dim hover:text-ops-text hover:bg-ops-muted'
                      }`}
                    >
                      <span className={isActive ? 'text-ops-red' : 'text-ops-border'}>
                        {section.icon}
                      </span>
                      {section.label}
                    </Link>
                  )
                }

                const isOpen = expanded.has(section.label)
                const hasActive = section.items?.some(i => i.file === currentFile)

                return (
                  <div key={section.label} className="mt-0.5">
                    <button
                      onClick={() => toggleSection(section.label)}
                      className={`flex items-center gap-1.5 w-full text-left px-3 py-1.5 font-heading text-[10px] uppercase tracking-widest transition-colors ${
                        hasActive ? 'text-ops-text' : 'text-ops-dim hover:text-ops-text'
                      }`}
                    >
                      <span className={`shrink-0 ${hasActive ? 'text-ops-red' : 'text-ops-border'}`}>
                        {section.icon}
                      </span>
                      <span className="flex-1 text-left">{section.label}</span>
                      {isOpen
                        ? <ChevronDown size={9} strokeWidth={2} />
                        : <ChevronRight size={9} strokeWidth={2} />
                      }
                    </button>

                    {isOpen && section.items?.map(item => (
                      <SidebarLeaf key={item.label} item={item} indent />
                    ))}
                  </div>
                )
              })}
            </div>
          </aside>
        )}

        {/* ── Content ───────────────────────────────────────────────────── */}
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          {html ? (
            <div className="max-w-[680px] mx-auto px-10 py-10">
              {/* Draft banner */}
              {isDraft && (
                <div className="mb-6 flex items-center gap-3 border border-ops-amber/40 bg-ops-amber/5 px-4 py-2.5">
                  <AlertCircle size={13} className="text-ops-amber shrink-0" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ops-amber">
                    Draft — not approved for publication
                  </span>
                </div>
              )}

              {/* Rendered content */}
              <div
                className="doc-content"
                dangerouslySetInnerHTML={{ __html: html }}
                onClick={handleContentClick}
              />

              <FooterNav currentFile={currentFile} leaves={leaves} />
            </div>
          ) : (
            <div className="max-w-[680px] mx-auto px-10 py-16">
              <div className="font-mono text-[10px] uppercase tracking-widest text-ops-dim mb-2">
                404 · Page not found
              </div>
              <p className="font-mono text-xs text-ops-border mb-6">{currentFile}</p>
              <Link
                to="/docs/index.md"
                className="font-mono text-[10px] uppercase tracking-widest text-ops-red hover:text-ops-red/80 transition-colors"
              >
                ← Docs home
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// ─── Prev / Next footer nav ───────────────────────────────────────────────────

function FooterNav({
  currentFile,
  leaves,
}: {
  currentFile: string
  leaves: { label: string; file: string }[]
}) {
  const idx = leaves.findIndex(l => l.file === currentFile)
  const prev = idx > 0 ? leaves[idx - 1] : null
  const next = idx >= 0 && idx < leaves.length - 1 ? leaves[idx + 1] : null

  if (!prev && !next) return null

  return (
    <div className="mt-16 pt-6 border-t border-ops-border flex justify-between gap-4">
      {prev ? (
        <Link to={`/docs/${prev.file}`} className="flex flex-col items-start group">
          <span className="font-mono text-[8px] uppercase tracking-widest text-ops-border group-hover:text-ops-dim transition-colors mb-0.5">
            ← Previous
          </span>
          <span className="font-mono text-[11px] text-ops-dim group-hover:text-ops-red transition-colors">
            {prev.label}
          </span>
        </Link>
      ) : <div />}

      {next ? (
        <Link to={`/docs/${next.file}`} className="flex flex-col items-end group">
          <span className="font-mono text-[8px] uppercase tracking-widest text-ops-border group-hover:text-ops-dim transition-colors mb-0.5">
            Next →
          </span>
          <span className="font-mono text-[11px] text-ops-dim group-hover:text-ops-red transition-colors">
            {next.label}
          </span>
        </Link>
      ) : <div />}
    </div>
  )
}
