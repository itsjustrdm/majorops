/**
 * content.ts — single source of truth bridge.
 *
 * The Vite build plugin reads docs/**\/*.md at build time and exports
 * structured data via the virtual:docs module. This file re-exports that
 * data in the shapes the rest of the app expects, so every component
 * pulls from the same markdown files — no hardcoded copies.
 *
 * To change a phase name or description: edit docs/user-guide/mim.md.
 * To change alarm levels: edit docs/ALARM-LEVELS.md.
 * The UI updates automatically on next build / HMR.
 */

import { phases as rawPhases, alarmLevels as rawAlarmLevels } from 'virtual:docs'
import type { PhaseNumber } from '../types'

// ─── Phase definitions ────────────────────────────────────────────────────────

export interface PhaseDefinition {
  number: PhaseNumber
  name: string
  /** One-line operator job description (from the phase summary table). */
  description: string
  /** Full section body markdown (from ### Phase N in mim.md). */
  detail: string
  /** Optional decorative icon — not sourced from docs, purely UI. */
  icon?: string
}

const PHASE_ICONS: Record<number, string> = {
  1: '📡', 2: '🔍', 3: '📊', 4: '📢',
  5: '🔬', 6: '🔧', 7: '✅', 8: '🏁',
}

export const PHASES: PhaseDefinition[] = rawPhases.map(p => ({
  number: p.number as PhaseNumber,
  name:   p.name,
  description: p.summary,
  detail: p.detail,
  icon:   PHASE_ICONS[p.number],
}))

// ─── Alarm level definitions ──────────────────────────────────────────────────

export interface AlarmLevelDefinition {
  box: number
  severity: string
  characteristics: string
  response: string
}

export const ALARM_LEVELS: AlarmLevelDefinition[] = rawAlarmLevels
