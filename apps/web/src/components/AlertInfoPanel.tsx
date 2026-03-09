import { Bell, Save } from 'lucide-react'
import { useState } from 'react'
import { InlineEdit } from './ui/InlineEdit'
import { SectionLabel } from './ui/Card'
import type { AlertInfo, ExternalImpact } from '../types'

interface AlertInfoPanelProps {
  alert: AlertInfo
  onSave: <K extends keyof AlertInfo>(key: K, value: AlertInfo[K]) => void
  readOnly?: boolean
}

const IMPACT_OPTIONS: ExternalImpact[] = ['Yes', 'No', 'Unknown', 'Likely']

export function AlertInfoPanel({ alert, onSave, readOnly = false }: AlertInfoPanelProps) {
  const [saved, setSaved] = useState(false)

  const save = <K extends keyof AlertInfo>(key: K, value: AlertInfo[K]) => {
    onSave(key, value)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="border border-ops-amber/20 bg-ops-surface">
      <div className="flex items-center justify-between border-b border-ops-border px-5 py-3">
        <div className="flex items-center gap-2">
          <Bell size={14} strokeWidth={1.5} className="text-ops-amber" />
          <SectionLabel className="text-ops-amber">Alert Information</SectionLabel>
        </div>
        {!readOnly && (
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
            className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              saved
                ? 'border-ops-green/40 bg-ops-green/10 text-ops-green'
                : 'border-ops-amber/30 text-ops-amber hover:bg-ops-amber/5'
            }`}
          >
            <Save size={10} strokeWidth={1.5} />
            {saved ? 'Saved' : 'Save Alert Data'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-0 divide-x divide-ops-border">
        {/* Alert ID */}
        <div className="px-5 py-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ops-dim">Alert ID</div>
          {readOnly ? (
            <div className="font-mono text-sm text-ops-text">{alert.alertId || '—'}</div>
          ) : (
            <InlineEdit
              value={alert.alertId}
              onSave={val => save('alertId', val)}
              placeholder="e.g. INC-0001"
              inputClassName="font-mono"
            />
          )}
        </div>

        {/* Customer Count */}
        <div className="px-5 py-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ops-dim">Customer Count</div>
          {readOnly ? (
            <div className="font-mono text-sm text-ops-text">{alert.customerCount.toLocaleString()}</div>
          ) : (
            <InlineEdit
              value={String(alert.customerCount)}
              onSave={val => save('customerCount', parseInt(val, 10) || 0)}
              placeholder="0"
              inputClassName="font-mono"
            />
          )}
        </div>

        {/* Issue Time */}
        <div className="border-t border-ops-border px-5 py-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ops-dim">Issue Time</div>
          <div className="font-mono text-sm text-ops-text">
            {new Date(alert.issueTime).toLocaleString()}
          </div>
        </div>

        {/* Resolve Time */}
        <div className="border-t border-ops-border px-5 py-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ops-dim">Resolve Time</div>
          <div className="font-mono text-sm text-ops-dim">{alert.resolveTime ?? '—'}</div>
        </div>

        {/* External Impact */}
        <div className="col-span-2 border-t border-ops-border px-5 py-4">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ops-dim">External Customer Impact</div>
          {readOnly ? (
            <div className={`inline-flex border px-3 py-1.5 font-heading text-sm font-700 uppercase tracking-widest ${
              alert.externalImpact === 'Yes'
                ? 'border-ops-red/40 bg-ops-red/10 text-ops-red'
                : 'border-ops-border text-ops-dim'
            }`}>
              {alert.externalImpact}
            </div>
          ) : (
            <div className="flex gap-2">
              {IMPACT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => save('externalImpact', opt)}
                  className={`border px-4 py-2 font-heading text-xs font-700 uppercase tracking-widest transition-colors ${
                    alert.externalImpact === opt
                      ? opt === 'Yes'
                        ? 'border-ops-red bg-ops-red/10 text-ops-red'
                        : 'border-ops-amber bg-ops-amber/10 text-ops-amber'
                      : 'border-ops-border text-ops-dim hover:border-ops-border hover:text-ops-text'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
