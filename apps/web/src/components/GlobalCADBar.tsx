import { useState, useRef, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Terminal, X, ChevronRight } from 'lucide-react'
import { INCIDENTS } from '../data/mockData'

// ─── Types ────────────────────────────────────────────────────────────────────

type LogKind = 'echo' | 'ok' | 'err' | 'info' | 'system'

interface LogEntry {
  id: string
  kind: LogKind
  text: string
  ts: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mkId() {
  return Math.random().toString(36).slice(2, 9)
}

function mkEntry(kind: LogKind, text: string): LogEntry {
  return { id: mkId(), kind, text, ts: Date.now() }
}

function parseIncidentId(pathname: string): string | null {
  const m = pathname.match(/^\/admin\/incidents\/(\d+)/)
  return m ? m[1] : null
}

function parseView(pathname: string): 'terminal' | 'focus' | 'classic' | null {
  if (pathname.endsWith('/terminal')) return 'terminal'
  if (pathname.endsWith('/focus')) return 'focus'
  const m = pathname.match(/^\/admin\/incidents\/\d+$/)
  return m ? 'classic' : null
}

// ─── MOM Panel ────────────────────────────────────────────────────────────────

const NAV_COMMANDS = [
  { cmd: 'join <id>',   desc: 'load incident' },
  { cmd: 'what <text>', desc: 'search by description' },
  { cmd: 'ls',          desc: 'list incidents' },
  { cmd: 'new',         desc: 'create incident' },
  { cmd: 'analytics',   desc: 'stats dashboard' },
  { cmd: 'status',      desc: 'system status' },
  { cmd: 'help',        desc: 'show all commands' },
  { cmd: 'clear',       desc: 'clear log' },
]

const INC_COMMANDS = [
  { cmd: 'view terminal', desc: 'CAD command line' },
  { cmd: 'view focus',    desc: 'focus mode' },
  { cmd: 'view classic',  desc: 'default admin view' },
  { cmd: 'pop',           desc: 'open in new window' },
  { cmd: 'leave',         desc: 'exit incident' },
]

function MomPanel({ incidentId, onClose }: { incidentId: string | null; onClose: () => void }) {
  const incident = incidentId ? INCIDENTS.find(i => String(i.id) === incidentId) : null

  return (
    <div className="border border-ops-border bg-[#050505] font-mono text-[11px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ops-border px-4 py-1.5">
        <div className="flex items-center gap-2">
          <Terminal size={11} strokeWidth={1.5} className="text-ops-dim" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-ops-dim">
            MENU OF MENUS — QUICK REF
          </span>
          {incident && (
            <span className="ml-2 text-ops-red text-[10px]">
              [{incident.severity.toUpperCase()} · INC-{incident.id} · PH{incident.phase}]
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-ops-dim hover:text-ops-text transition-colors">
          <X size={11} strokeWidth={1.5} />
        </button>
      </div>

      {/* Command grid */}
      <div className="grid grid-cols-2 divide-x divide-ops-border">
        {/* Navigation */}
        <div className="px-4 py-3">
          <div className="mb-2 text-[9px] uppercase tracking-[0.25em] text-ops-dim">Navigation</div>
          <div className="space-y-1">
            {NAV_COMMANDS.map(c => (
              <div key={c.cmd} className="flex items-baseline gap-3">
                <span className="w-28 shrink-0 text-ops-green">{c.cmd}</span>
                <span className="text-ops-dim">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Incident ops */}
        <div className="px-4 py-3">
          <div className="mb-2 text-[9px] uppercase tracking-[0.25em] text-ops-dim">
            Incident Ops {!incidentId && <span className="text-ops-amber">(join an incident first)</span>}
          </div>
          <div className="space-y-1">
            {INC_COMMANDS.map(c => (
              <div key={c.cmd} className={`flex items-baseline gap-3 ${!incidentId ? 'opacity-30' : ''}`}>
                <span className="w-28 shrink-0 text-ops-amber">{c.cmd}</span>
                <span className="text-ops-dim">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="border-t border-ops-border px-4 py-1 text-[9px] text-ops-dim">
        <span className="text-ops-dim">tip:</span>
        {' '}press{' '}
        <kbd className="border border-ops-border px-1 text-ops-dim">`</kbd>
        {' '}to focus · ESC to close · TAB to complete
      </div>
    </div>
  )
}

// ─── Log Area ─────────────────────────────────────────────────────────────────

const LOG_COLORS: Record<LogKind, string> = {
  echo:   'text-ops-amber',
  ok:     'text-ops-green',
  err:    'text-ops-red',
  info:   'text-ops-dim',
  system: 'text-ops-blue',
}

const LOG_PREFIX: Record<LogKind, string> = {
  echo:   '▸',
  ok:     '✓',
  err:    '✗',
  info:   '·',
  system: '~',
}

function LogArea({ entries }: { entries: LogEntry[] }) {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (el.current) el.current.scrollTop = el.current.scrollHeight
  }, [entries])

  return (
    <div
      ref={el}
      className="max-h-28 overflow-y-auto border-t border-ops-border bg-[#050505] px-4 py-1.5 font-mono text-[11px]"
      style={{ scrollbarWidth: 'none' }}
    >
      {entries.map(e => (
        <div key={e.id} className={`flex items-start gap-2 py-0.5 ${LOG_COLORS[e.kind]}`}>
          <span className="shrink-0 select-none opacity-60">{LOG_PREFIX[e.kind]}</span>
          <span className="break-all">{e.text}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Suggestion Dropdown ──────────────────────────────────────────────────────

const ALL_COMMANDS = [
  'join', 'ls', 'new', 'analytics', 'status', 'what', 'help', 'clear', 'mom',
  'view terminal', 'view focus', 'view classic',
  'pop', 'leave',
]

function Suggestions({
  input,
  onSelect,
}: {
  input: string
  onSelect: (cmd: string) => void
}) {
  const trimmed = input.trim().toLowerCase()
  if (!trimmed) return null

  const matches = ALL_COMMANDS.filter(c => c.startsWith(trimmed) && c !== trimmed)
  if (matches.length === 0) return null

  return (
    <div className="absolute bottom-full left-0 right-0 border border-ops-border bg-[#050505] font-mono text-[11px]">
      {matches.slice(0, 5).map(m => (
        <button
          key={m}
          onClick={() => onSelect(m)}
          className="w-full px-4 py-1 text-left text-ops-dim hover:bg-ops-surface hover:text-ops-text transition-colors"
        >
          <span className="text-ops-green">{m.slice(0, trimmed.length)}</span>
          <span>{m.slice(trimmed.length)}</span>
        </button>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GlobalCADBar() {
  const location = useLocation()
  const navigate = useNavigate()

  const [input, setInput] = useState('')
  const [log, setLog] = useState<LogEntry[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [showMom, setShowMom] = useState(false)
  const [blink, setBlink] = useState(true)

  const inputRef = useRef<HTMLInputElement>(null)
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Detect incident context
  const incidentId = parseIncidentId(location.pathname)
  const currentView = parseView(location.pathname)
  const incident = incidentId ? INCIDENTS.find(i => String(i.id) === incidentId) ?? null : null

  // Prompt coloring
  const isWartime = incidentId !== null
  const isCritical = incident?.severity === 'Critical' || incident?.severity === 'High'
  const promptColor = isWartime
    ? isCritical ? 'text-ops-red' : 'text-ops-orange'
    : 'text-ops-green'

  const promptLabel = isWartime
    ? `INC-${incidentId} ▸`
    : 'majorops ▸'

  // Cursor blink in wartime
  useEffect(() => {
    if (!isWartime) { setBlink(true); return }
    const t = setInterval(() => setBlink(b => !b), 500)
    return () => clearInterval(t)
  }, [isWartime])

  // Global backtick shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement).tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Auto-clear log after 12s inactivity
  const scheduleAutoClear = useCallback(() => {
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current)
    clearTimerRef.current = setTimeout(() => {
      setLog([])
    }, 12_000)
  }, [])

  const emit = useCallback((kind: LogKind, text: string) => {
    setLog(prev => [...prev.slice(-20), mkEntry(kind, text)])
    scheduleAutoClear()
  }, [scheduleAutoClear])

  // ─── Command execution ─────────────────────────────────────────────────────

  const execute = useCallback((raw: string) => {
    const cmd = raw.trim()
    if (!cmd) return

    // Add to history
    setHistory(prev => [cmd, ...prev.slice(0, 49)])
    setHistIdx(-1)
    setInput('')
    setShowMom(false)

    emit('echo', cmd)

    const lower = cmd.toLowerCase()
    const [verb, ...argParts] = lower.split(/\s+/)
    const args = argParts.join(' ')

    // ── join <id>
    if (verb === 'join') {
      const target = args || ''
      const id = target.replace(/^inc-?/i, '')
      if (!id || isNaN(Number(id))) {
        emit('err', `usage: join <incident-id>   e.g. join 1`)
        return
      }
      const found = INCIDENTS.find(i => String(i.id) === id)
      if (!found) {
        emit('err', `INC-${id} not found`)
        return
      }
      emit('ok', `joining INC-${id} · ${found.title}`)
      navigate(`/admin/incidents/${id}`)
      return
    }

    // ── leave
    if (verb === 'leave') {
      if (!incidentId) {
        emit('info', 'not in an incident')
        return
      }
      emit('system', `leaving INC-${incidentId}`)
      navigate('/')
      return
    }

    // ── ls
    if (verb === 'ls') {
      const active = INCIDENTS.filter(i => i.status !== 'Resolved')
      if (active.length === 0) {
        emit('info', 'no active incidents')
        return
      }
      active.forEach(i => {
        emit('info', `INC-${i.id}  [${i.severity.toUpperCase().slice(0,4)}] [PH${i.phase}]  ${i.title}`)
      })
      return
    }

    // ── new
    if (verb === 'new') {
      emit('system', 'opening new incident form')
      navigate('/new')
      return
    }

    // ── analytics / stats
    if (verb === 'analytics' || verb === 'stats') {
      emit('system', 'loading analytics')
      navigate('/analytics')
      return
    }

    // ── what <query> — incident search
    if (verb === 'what' || verb === 'find' || verb === 'search') {
      const q = args.trim()
      if (q) {
        emit('system', `searching: ${q}`)
        navigate(`/search?q=${encodeURIComponent(q)}`)
      } else {
        navigate('/search')
      }
      return
    }

    // ── status / home
    if (verb === 'status' || verb === 'home') {
      emit('system', 'navigating to status page')
      navigate('/')
      return
    }

    // ── view <mode>
    if (verb === 'view') {
      if (!incidentId) {
        emit('err', 'join an incident first')
        return
      }
      const mode = args.trim()
      if (mode === 'terminal') {
        emit('ok', `switching to terminal view`)
        navigate(`/admin/incidents/${incidentId}/terminal`)
        return
      }
      if (mode === 'focus') {
        emit('ok', `switching to focus view`)
        navigate(`/admin/incidents/${incidentId}/focus`)
        return
      }
      if (mode === 'classic' || mode === '') {
        emit('ok', `switching to classic view`)
        navigate(`/admin/incidents/${incidentId}`)
        return
      }
      emit('err', `unknown view: ${mode}   options: terminal · focus · classic`)
      return
    }

    // ── pop
    if (verb === 'pop') {
      if (!incidentId) {
        emit('err', 'join an incident first')
        return
      }
      const url = `/admin/incidents/${incidentId}/terminal`
      window.open(url, `inc-${incidentId}`, 'width=1440,height=900,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes')
      emit('ok', `popped INC-${incidentId} terminal into new window`)
      return
    }

    // ── mom
    if (verb === 'mom') {
      setShowMom(s => !s)
      emit('info', 'menu of menus — press ESC to close')
      return
    }

    // ── clear
    if (verb === 'clear') {
      setLog([])
      return
    }

    // ── help
    if (verb === 'help') {
      emit('info', 'commands: join <id> · what <text> · ls · new · analytics · status')
      emit('info', 'incident: view [terminal|focus|classic] · pop · leave')
      emit('info', 'meta: mom · clear · help')
      emit('info', 'tip: press ` to focus · what.mim.run/<anything> also works')
      return
    }

    // Unknown
    emit('err', `unknown command: ${verb}   type "help" or "mom" for reference`)
  }, [incidentId, navigate, emit])

  // ─── Keyboard handling ────────────────────────────────────────────────────

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      execute(input)
      return
    }

    if (e.key === 'Escape') {
      if (showMom) { setShowMom(false); return }
      setInput('')
      inputRef.current?.blur()
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(next)
      setInput(history[next] ?? '')
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = histIdx - 1
      if (next < 0) {
        setHistIdx(-1)
        setInput('')
      } else {
        setHistIdx(next)
        setInput(history[next] ?? '')
      }
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      const trimmed = input.trim().toLowerCase()
      const match = ALL_COMMANDS.find(c => c.startsWith(trimmed) && c !== trimmed)
      if (match) setInput(match + ' ')
      return
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  const hasLog = log.length > 0

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 select-none">
      {/* MOM overlay */}
      {showMom && (
        <MomPanel incidentId={incidentId} onClose={() => setShowMom(false)} />
      )}

      {/* Log area */}
      {hasLog && !showMom && (
        <LogArea entries={log} />
      )}

      {/* Prompt bar */}
      <div
        className="relative flex items-center border-t border-ops-border bg-[#050505]"
        style={{ height: 32 }}
      >
        {/* Suggestions */}
        <Suggestions
          input={input}
          onSelect={cmd => { setInput(cmd + ' '); inputRef.current?.focus() }}
        />

        {/* Wartime indicator stripe */}
        {isWartime && (
          <div className={`absolute top-0 left-0 right-0 h-px ${isCritical ? 'bg-ops-red' : 'bg-ops-orange'} opacity-70`} />
        )}

        {/* Prompt label */}
        <div
          className={`flex shrink-0 items-center gap-1.5 border-r border-ops-border px-3 font-mono text-[11px] font-semibold tracking-wide ${promptColor} ${isWartime && !blink ? 'opacity-0' : 'opacity-100'}`}
          style={{ height: '100%', minWidth: isWartime ? 110 : 90 }}
        >
          {promptLabel}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => { setInput(e.target.value); setHistIdx(-1) }}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (showMom) setShowMom(false) }}
          placeholder={isWartime
            ? 'view terminal · pop · leave · mom · help'
            : 'join <id> · ls · new · analytics · mom · help'
          }
          className="flex-1 bg-transparent px-3 font-mono text-[11px] text-ops-text placeholder:text-ops-dim/40 outline-none"
          style={{ height: '100%' }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />

        {/* Right side: current view indicator + incident badge */}
        <div className="flex shrink-0 items-center gap-2 border-l border-ops-border px-3 font-mono text-[9px] text-ops-dim">
          {incident && (
            <>
              <span className={isCritical ? 'text-ops-red' : 'text-ops-orange'}>
                {incident.severity.toUpperCase().slice(0, 4)}
              </span>
              <span className="text-ops-border">·</span>
              <span className="uppercase text-ops-dim">{currentView ?? 'classic'}</span>
              <span className="text-ops-border">·</span>
            </>
          )}
          <ChevronRight size={9} strokeWidth={1.5} className="text-ops-dim" />
          <span className="uppercase tracking-widest">
            {isWartime ? `INC-${incidentId}` : 'root'}
          </span>
        </div>
      </div>
    </div>
  )
}
