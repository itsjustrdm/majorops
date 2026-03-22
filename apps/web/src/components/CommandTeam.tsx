import { Users, Save } from 'lucide-react'
import { useState } from 'react'
import { InlineEdit } from './ui/InlineEdit'
import { SectionLabel } from './ui/Card'
import { RoleTag } from './RoleTag'
import { ROLE_DEFINITIONS } from '../data/roles'
import type { CommandTeam as CommandTeamType } from '../types'
import type { RoleKey } from '../data/roles'

interface CommandTeamProps {
  command:   CommandTeamType
  onSave:    (command: CommandTeamType) => void
  readOnly?: boolean
}

// Maps CommandTeam object keys → role keys in roles.ts
// Single source of truth: docs/operational/command-roles.md → roles.ts → here
const ROLES: { key: keyof CommandTeamType; roleKey: RoleKey }[] = [
  { key: 'mim',            roleKey: 'mim'             },
  { key: 'sre',            roleKey: 'sre'             },
  { key: 'leader',         roleKey: 'leader'          },
  { key: 'serviceManager', roleKey: 'service_manager' },
  { key: 'customerOps',    roleKey: 'customer_ops'    },
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
        {ROLES.map(({ key, roleKey }, idx) => {
          const def = ROLE_DEFINITIONS[roleKey]
          return (
            <div
              key={key}
              className={`px-5 py-4 ${idx === 4 ? 'col-span-2 border-t border-ops-border' : idx >= 2 ? 'border-t border-ops-border' : ''}`}
            >
              {/* Role label — hoverable, shows tooltip from roles.ts/command-roles.md */}
              <div className="mb-2">
                <RoleTag role={roleKey} size="sm" />
              </div>

              {/* Person's name — editable */}
              {readOnly ? (
                <div className="font-body text-sm text-ops-text">
                  {command[key] || <span className="text-ops-dim italic">unassigned</span>}
                </div>
              ) : (
                <InlineEdit
                  value={draft[key]}
                  onSave={val => update(key, val)}
                  placeholder={def?.fullName ?? 'assign…'}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
