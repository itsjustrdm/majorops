// ─── Core enums ──────────────────────────────────────────────────────────────

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low'
export type IncidentStatus = 'Active' | 'Monitoring' | 'Resolved'
export type PhaseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type ExternalImpact = 'Yes' | 'No' | 'Unknown' | 'Likely'
export type TimelineEventType = 'phase' | 'update' | 'command' | 'alert' | 'action'
export type UpdateVisibility = 'public' | 'internal'
export type RiskLevel = 'Low' | 'Medium' | 'High'
export type KpiVisibility = 'internal' | 'exec'
export type KpiSource = 'worker' | 'ui' | 'import' | 'cli'

// ─── Phase metadata ───────────────────────────────────────────────────────────

export interface PhaseDefinition {
  number: PhaseNumber
  name: string
  description: string
  icon: string
}

export const PHASES: PhaseDefinition[] = [
  { number: 1, name: 'Alert',      description: 'Incident detected. Initial triage underway.',           icon: '📡' },
  { number: 2, name: 'Gather',     description: 'Assembling team. Collecting diagnostic data.',           icon: '🔍' },
  { number: 3, name: 'Assess',     description: 'Scope and impact being determined.',                     icon: '📊' },
  { number: 4, name: 'Initial',    description: 'Initial communication and stakeholder updates.',         icon: '📢' },
  { number: 5, name: 'Isolation',  description: 'Root cause identified. Isolating the fault domain.',    icon: '🔬' },
  { number: 6, name: 'Mitigation', description: 'Active remediation underway.',                          icon: '🔧' },
  { number: 7, name: 'Validation', description: 'Recovery validated across affected systems.',            icon: '✅' },
  { number: 8, name: 'Resolution', description: 'Incident closed. PIR to follow within 72 hours.',       icon: '🏁' },
]

// ─── Command team ─────────────────────────────────────────────────────────────

export interface CommandTeam {
  sre: string
  mim: string
  leader: string
  serviceManager: string
  customerOps: string
}

// ─── Timeline event ───────────────────────────────────────────────────────────

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description: string
  actor: string
  timestamp: string      // ISO string
  visibility?: UpdateVisibility
  phaseNumber?: PhaseNumber
}

// ─── Status update ────────────────────────────────────────────────────────────

export interface StatusUpdate {
  id: string
  content: string
  visibility: UpdateVisibility
  author: string
  timestamp: string
}

// ─── Milestones (Stakeholder/Exec comms) ─────────────────────────────────────

export interface Milestone {
  id: string
  title: string
  body: string
  statusAtCut: IncidentStatus
  nextUpdateEta: string | null
  cutBy: string
  cutAt: string
  isResolution?: boolean
}

// ─── Alert info ───────────────────────────────────────────────────────────────

export interface AlertInfo {
  alertId: string
  customerCount: number
  issueTime: string
  resolveTime: string | null
  externalImpact: ExternalImpact
}

// ─── Core incident ────────────────────────────────────────────────────────────

export interface Incident {
  id: number
  title: string
  description: string
  severity: Severity
  status: IncidentStatus
  phase: PhaseNumber
  phaseEnteredAt: string
  detectedAt: string
  resolvedAt: string | null
  affectedSystems: string[]
  bridgeUrl: string | null
  command: CommandTeam
  alert: AlertInfo
  timeline: TimelineEvent[]
  updates: StatusUpdate[]
  updatesPosted: number
  milestones: Milestone[]
  nextUpdateEta: string | null
  lastCommunicatedAt: string | null
  businessImpact: string
  customerImpactSummary: string
  riskLevel: RiskLevel
  execSummary: string
  audienceNotes?: string
}

// ─── Derived / computed ───────────────────────────────────────────────────────

export interface IncidentMetrics {
  totalDurationMs: number
  impactDurationMs: number
  affectedUsers: number
  currentPhaseLabel: string
  updatesPosted: number
}

// ─── KPI definitions and observations ────────────────────────────────────────

export interface KpiDefinition {
  slug: string           // machine identifier, e.g., "mttr"
  name: string           // display label
  description: string
  formula: string        // human-readable description
  units: string          // minutes, percent, count
  targets?: Record<string, number | string> // optional thresholds by severity/persona
  dataSources?: string[]
  visibility: KpiVisibility
  owner: string
  reviewCadence?: string
  updatedAt?: string
}

export interface KpiObservation {
  id: string
  kpiSlug: string
  incidentId: string
  timestamp: string      // ISO string
  value: number
  units: string
  source: KpiSource
  confidence?: number
  metadata?: Record<string, unknown>
}
