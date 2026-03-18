import { useState } from 'react'
import { Send, Radio, Wrench, Cpu } from 'lucide-react'
import { SectionLabel } from './ui/Card'
import { formatRelative } from '../lib/utils'
import type { MicroUpdate, MicroUpdateSource } from '../types'

const SOURCE_ICON: Record<MicroUpdateSource, JSX.Element> = {
  bridge: <Radio size={10} strokeWidth={1.5} className="text-ops-amber" />,
  tool:   <Wrench size={10} strokeWidth={1.5} className="text-ops-blue" />,
  system: <Cpu size={10} strokeWidth={1.5} className="text-ops-dim" />,
}

const SOURCE_LABEL: Record<MicroUpdateSource, string> = {
  bridge: 'Bridge',
  tool:   'Tool',
  system: 'System',
}

const SOURCE_COLOR: Record<MicroUpdateSource, string> = {
  bridge: 'text-ops-amber',
  tool:   'text-ops-blue',
  system: 'text-ops-dim',
}

interface MicroUpdateFeedProps {
  updates: MicroUpdate[]
  onPost: (content: string, pathId: string | null) => void
  pathOptions: Array<{ id: string; title: string }>
}

export function MicroUpdateFeed({ updates, onPost, pathOptions }: MicroUpdateFeedProps) {
  const [draft, setDraft] = useState('')
  const [selectedPath, setSelectedPath] = useState<string>('none')
  const [posted, setPosted] = useState(false)

  const sorted = [...updates].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  const handlePost = () => {
    if (!draft.trim()) return
    onPost(draft.trim(), selectedPath === 'none' ? null : selectedPath)
    setDraft('')
    setPosted(true)
    setTimeout(() => setPosted(false), 1500)
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Radio size={13} strokeWidth={1.5} className="text-ops-amber" />
        <SectionLabel>Fireground Log</SectionLabel>
        <span className="font-mono text-[10px] text-ops-dim">raw CAD notes · any participant</span>
      </div>

      {/* Compose */}
      <div className="mb-4 border border-ops-border bg-ops-surface">
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handlePost()
          }}
          placeholder="Log what's happening now — no format required. CAN encouraged. Ctrl+Enter to post."
          rows={2}
          className="w-full bg-transparent px-3 py-2.5 font-body text-xs text-ops-text placeholder-ops-dim/40 outline-none resize-none"
        />
        <div className="flex items-center gap-2 border-t border-ops-border px-3 py-2">
          <select
            value={selectedPath}
            onChange={e => setSelectedPath(e.target.value)}
            className="bg-ops-muted border border-ops-border px-2 py-1 font-mono text-[10px] text-ops-dim outline-none cursor-pointer flex-1"
          >
            <option value="none">— Incident-wide</option>
            {pathOptions.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <button
            onClick={handlePost}
            className={`flex items-center gap-1.5 border px-4 py-1.5 font-mono text-[10px] uppercase tracking-wide transition-colors shrink-0 ${
              posted
                ? 'border-ops-green/40 bg-ops-green/10 text-ops-green'
                : 'border-ops-amber/40 bg-ops-amber/10 text-ops-amber hover:bg-ops-amber/20'
            }`}
          >
            <Send size={10} strokeWidth={1.5} />
            {posted ? 'Logged' : 'Log'}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-0">
        {sorted.length === 0 && (
          <p className="font-mono text-[10px] text-ops-dim text-center py-4">
            No fireground notes yet. Log what's happening.
          </p>
        )}
        {sorted.map((u, i) => (
          <div
            key={u.id}
            className={`flex gap-3 py-2.5 ${i < sorted.length - 1 ? 'border-b border-ops-border/40' : ''}`}
          >
            <div className="flex flex-col items-center pt-1 shrink-0 gap-1">
              {SOURCE_ICON[u.source]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`font-mono text-[9px] uppercase tracking-wide ${SOURCE_COLOR[u.source]}`}>
                  {SOURCE_LABEL[u.source]}
                </span>
                <span className="font-body text-[10px] text-ops-dim">{u.author}</span>
                <span className="font-mono text-[9px] text-ops-dim ml-auto">{formatRelative(u.timestamp)}</span>
              </div>
              <p className="font-body text-xs text-ops-text leading-snug">{u.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
