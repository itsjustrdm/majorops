import { useState } from 'react'
import { THEMES, getTheme, applyTheme } from '../lib/theme'
import type { Theme } from '../lib/theme'

export function ThemeSwitcher() {
  const [current, setCurrent] = useState<Theme>(getTheme)

  function handleSwitch(id: Theme) {
    applyTheme(id)
    setCurrent(id)
  }

  return (
    <div
      className="flex items-center border border-ops-border"
      title="Switch display theme"
    >
      {THEMES.map((t, i) => (
        <button
          key={t.id}
          onClick={() => handleSwitch(t.id)}
          title={t.description}
          className={`
            flex items-center gap-1 px-2.5 py-1
            font-mono text-[9px] uppercase tracking-widest
            transition-colors
            ${i > 0 ? 'border-l border-ops-border' : ''}
            ${current === t.id
              ? 'bg-ops-red text-white'
              : 'text-ops-dim hover:text-ops-text hover:bg-ops-muted'
            }
          `}
        >
          <span className="text-[10px] leading-none">{t.indicator}</span>
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  )
}
