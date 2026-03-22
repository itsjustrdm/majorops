// ─── Theme types ──────────────────────────────────────────────────────────────

export type Theme = 'slate' | 'graphite' | 'dusk'

export interface ThemeMeta {
  id:          Theme
  label:       string
  description: string
  indicator:   string   // Unicode glyph shown in the switcher
}

export const THEMES: ThemeMeta[] = [
  {
    id:          'graphite',
    label:       'Graphite',
    description: 'Cool stone grey — high legibility, bright environments',
    indicator:   '○',
  },
  {
    id:          'slate',
    label:       'Slate',
    description: 'Dark navy — balanced depth, easy on the eyes (default)',
    indicator:   '◑',
  },
  {
    id:          'dusk',
    label:       'Dusk',
    description: 'Warm charcoal — dark with real layer depth, never flat',
    indicator:   '●',
  },
]

const STORAGE_KEY = 'ops-theme'
const DEFAULT:    Theme = 'slate'

// ─── Public API ───────────────────────────────────────────────────────────────

export function getTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored && THEMES.some(t => t.id === stored)) return stored
  } catch {
    // SSR / private-browsing
  }
  return DEFAULT
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // ignore
  }
}

/** Call once before first render to avoid flash-of-wrong-theme */
export function initTheme(): void {
  applyTheme(getTheme())
}
