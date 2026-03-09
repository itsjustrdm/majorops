import { useState, useRef, useEffect } from 'react'
import { Pencil } from 'lucide-react'

interface InlineEditProps {
  value: string
  onSave: (value: string) => void
  placeholder?: string
  className?: string
  inputClassName?: string
  multiline?: boolean
  label?: string
}

export function InlineEdit({
  value,
  onSave,
  placeholder = '—',
  className = '',
  inputClassName = '',
  multiline = false,
  label,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select()
      }
    }
  }, [editing])

  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed !== value) onSave(trimmed || value)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) { e.preventDefault(); commit() }
    if (e.key === 'Escape') cancel()
  }

  const baseInput = `w-full bg-ops-muted border border-ops-red px-2 py-1 font-body text-sm text-ops-text outline-none focus:border-ops-red-hi ${inputClassName}`

  if (editing) {
    return (
      <div className={`relative ${className}`}>
        {label && <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-ops-dim">{label}</div>}
        {multiline ? (
          <textarea
            ref={inputRef as React.Ref<HTMLTextAreaElement>}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder={placeholder}
            className={`${baseInput} resize-none`}
          />
        ) : (
          <input
            ref={inputRef as React.Ref<HTMLInputElement>}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={baseInput}
          />
        )}
        <div className="mt-1 flex gap-2">
          <button onClick={commit} className="font-mono text-[10px] text-ops-green hover:text-ops-green/80">
            ↵ save
          </button>
          <button onClick={cancel} className="font-mono text-[10px] text-ops-dim hover:text-ops-text">
            esc cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`group relative cursor-pointer ${className}`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {label && <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-ops-dim">{label}</div>}
      <div className="flex items-start gap-2">
        <span className={`flex-1 font-body text-sm ${value ? 'text-ops-text' : 'text-ops-dim italic'}`}>
          {value || placeholder}
        </span>
        <Pencil
          size={11}
          className="mt-0.5 shrink-0 text-ops-dim opacity-0 transition-opacity group-hover:opacity-100"
          strokeWidth={1.5}
        />
      </div>
    </div>
  )
}
