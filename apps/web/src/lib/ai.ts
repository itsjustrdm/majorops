/**
 * AI stub functions — mock responses for UI development.
 * Replace each function body with a real API call when the Worker is wired.
 * All functions return Promise<string> so the swap is a one-liner.
 */

import type { Incident, PhaseNumber } from '../types'
import { phaseLabel } from './utils'

// Simulates network latency
const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

/**
 * Draft a public status update based on current incident state.
 * Real: POST /api/ai/draft-update { incidentId }
 */
export async function draftStatusUpdate(incident: Incident): Promise<string> {
  await delay(800)
  const phase = phaseLabel(incident.phase)
  const affected = incident.alert.customerCount
  const systems = incident.affectedSystems.slice(0, 2).join(' and ')
  return `Our engineering team continues to work on resolving the ${incident.title.toLowerCase()}. We are currently in the ${phase} phase of our incident response. ${affected > 0 ? `Approximately ${affected.toLocaleString()} customers may experience degraded service on ${systems}. ` : ''}We will post another update within 30 minutes or sooner as the situation develops.`
}

/**
 * Suggest a next action for the MIM based on current phase.
 * Real: GET /api/ai/phase-action?phase=N&incidentId=X
 */
export async function suggestPhaseAction(phase: PhaseNumber, _incidentId: number): Promise<string> {
  await delay(400)
  const suggestions: Record<number, string> = {
    1: 'Declare the incident. Assign MIM. Open bridge. Notify SRE on-call.',
    2: 'Pull logs, metrics, and recent change history. Assemble SMEs on bridge.',
    3: 'Determine blast radius. Confirm severity. Notify stakeholders if P1/P2.',
    4: 'Post public status update. Brief exec. Set next update ETA (≤30 min).',
    5: 'Confirm isolation target. Assign single SME to own RCA. Contain blast radius.',
    6: 'Execute mitigation. Monitor key indicators. Do not advance until sustained improvement.',
    7: 'Validate recovery across all affected systems. Get sign-off from each SME.',
    8: 'Close incident. Schedule PIR within 72 hours. Send resolution notification.',
  }
  return suggestions[phase] ?? 'Continue monitoring and document findings.'
}

/**
 * Generate an exec brief summary.
 * Real: POST /api/ai/exec-brief { incidentId }
 */
export async function generateExecBrief(incident: Incident): Promise<string> {
  await delay(1000)
  const dur = Math.round((Date.now() - new Date(incident.detectedAt).getTime()) / 60000)
  return `${incident.severity} severity incident impacting ${incident.affectedSystems.join(', ')}. Duration: ${dur} minutes. ${incident.alert.customerCount > 0 ? `${incident.alert.customerCount.toLocaleString()} customers affected. ` : 'No confirmed external customer impact. '}Engineering is in active ${phaseLabel(incident.phase)} phase. Next MIM update in ≤30 minutes.`
}
