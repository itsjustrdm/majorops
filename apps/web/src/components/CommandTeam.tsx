import { Users, Save } from 'lucide-react'
import { useState } from 'react'
import { InlineEdit } from './ui/InlineEdit'
import { SectionLabel } from './ui/Card'
import type { CommandTeam as CommandTeamType } from '../types'

interface CommandTeamProps {
  command: CommandTeamType
  onSave: (command: CommandTeamType) => void
  readOnly?: boolean
}

const ROLES: { key: keyof CommandTeamType; label: string; placeholder: string }[] = [
  { key: 'sre',            label: 'Site Reliability Engineer', placeholder: 'Hands-on engineer' },
  { key: 'mim',            label: 'Major Incident Manager',    placeholder: 'Incident coordinator' },
  { key: 'leader',         label: 'Leader',                    placeholder: 'Team lead or director' },
  { key: 'serviceManager', label: 'Service Manager',           placeholder: 'Service owner' },
  { key: 'customerOps',    label: 'Customer Operations',       placeholder: 'Customer support liaison' },
]

export function CommandTeam({ command, onSave, readOnly = false }: CommandTeamProps) {
  const [draft, setDraft] = useState<CommandTeamType>({ ...command })
  const [saved, setSaved] = useState(false)

  const update = (key: keyof CommandTeamType, value: string) => {
    setDraft(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="border border-ops-border bg-ops-surface">
      <div className="flex items-center justify-between border-b border-ops-border px-5 py-3">
        <div className="flex items-center gap-2">
          <Users size={14} strokeWidth={1.5} className="text-ops-blue" />
          <SectionLabel>Incident Command</SectionLabel>
        </div>
        {!readOnly && (
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              saved
                ? 'border-ops-green/40 bg-ops-green/10 text-ops-green'
                : 'border-ops-border text-ops-dim hover:border-ops-blue/40 hover:text-ops-blue'
            }`}
          >
            <Save size={10} strokeWidth={1.5} />
            {saved ? 'Saved' : 'Save Team'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-0 divide-x divide-ops-border">
        {ROLES.map((role, idx) => (
          <div
            key={role.key}
            className={`px-5 py-4 ${idx === 4 ? 'col-span-2 border-t border-ops-border' : idx >= 2 ? 'border-t border-ops-border' : ''}`}
          >
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ops-dim">
              {role.label}
            </div>
            {readOnly ? (
              <div className="font-body text-sm text-ops-text">{command[role.key] || '—'}</div>
            ) : (
              <InlineEdit
                value={draft[role.key]}
                onSave={val => update(role.key, val)}
                placeholder={role.placeholder}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
