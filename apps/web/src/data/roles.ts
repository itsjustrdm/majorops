/**
 * roles.ts — Command role definitions
 *
 * ─── SOURCE OF TRUTH ────────────────────────────────────────────────────────
 * This file is DERIVED from docs/operational/command-roles.md
 * Update the markdown file first. Then sync the changes here.
 * Future: a build script will auto-generate this from the markdown.
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Used by:
 *   - RoleTag component (tooltip text, color, label)
 *   - CommandTeam component (role fields, labels)
 *   - PeerReviewPage (domain labels)
 *   - PresenceRoster (role abbreviations, colors)
 */

export type RoleKey =
  | 'mim'
  | 'sre'
  | 'leader'
  | 'service_manager'
  | 'customer_ops'
  | 'validator'
  | 'responder'
  | 'observer'

export interface RoleDefinition {
  key:        RoleKey
  label:      string        // Display name in UI
  fullName:   string        // Formal title
  abbr:       string        // 3-letter badge abbreviation
  color:      string        // Tailwind text color class
  bgColor:    string        // Tailwind bg color for filled badge
  tooltip:    string        // Sourced from ## Summary in command-roles.md
  responsibilities: string[]
  notYourJob: string[]      // Common boundary violations to highlight
}

// ─── Role definitions ─────────────────────────────────────────────────────────
// tooltip field = Summary section from docs/operational/command-roles.md

export const ROLE_DEFINITIONS: Record<RoleKey, RoleDefinition> = {

  mim: {
    key:      'mim',
    label:    'MIM',
    fullName: 'Major Incident Manager',
    abbr:     'MIM',
    color:    'text-ops-red',
    bgColor:  'bg-ops-red',
    tooltip:  'The MIM is the 911 dispatcher, not the paramedic. They hold command authority on the bridge, coordinate all responders, and make every escalation and phase decision. They do not touch keyboards or troubleshoot systems — their job is to run the call.',
    responsibilities: [
      'Open the bridge and formally declare the incident',
      'Assign and manage recovery tracks with named owners',
      'Set and enforce timeboxes for all diagnostic and remediation actions',
      'Make all escalation decisions — who gets paged, when, and at what alarm level',
      'Post all stakeholder milestones and manage the next-update cadence',
      'Advance phases with deliberate judgment',
      'Close the incident and schedule the After Action',
    ],
    notYourJob: [
      'Running queries, pushing changes, or accessing systems directly',
      'Letting the bridge run itself while helping on a recovery track',
      'Speculating on root cause in public milestones',
      'Waiting for consensus before paging',
    ],
  },

  sre: {
    key:      'sre',
    label:    'SRE',
    fullName: 'Site Reliability Engineer',
    abbr:     'SRE',
    color:    'text-ops-amber',
    bgColor:  'bg-ops-amber',
    tooltip:  'The SRE is the technical recovery lead on the bridge. They own the recovery tracks, manage the SMEs doing hands-on work, and are the primary technical voice the MIM listens to. They translate diagnostic findings into actionable hypotheses and recovery options.',
    responsibilities: [
      'Own all active recovery tracks',
      'Direct SMEs — assign tasks, set timeboxes, collect findings',
      'Report track status to the MIM at regular intervals',
      'Raise and update hypotheses as evidence develops',
      'Recommend mitigation options — the MIM decides which to execute',
      'Validate recovery across all affected systems before signaling resolution',
    ],
    notYourJob: [
      'Making escalation decisions',
      'Posting stakeholder updates',
      'Self-assigning to hands-on work while owning the recovery tracks',
      'Declaring resolution unilaterally',
    ],
  },

  leader: {
    key:      'leader',
    label:    'Leader',
    fullName: 'Recovery Director',
    abbr:     'LDR',
    color:    'text-ops-orange',
    bgColor:  'bg-ops-orange',
    tooltip:  'The Recovery Director holds escalation authority beyond what the MIM and SRE can approve — vendor escalations, executive communications, emergency change approval. They observe and act when needed. They do not run the bridge.',
    responsibilities: [
      'Authorize actions requiring leadership sign-off',
      'Own executive communications when the incident warrants it',
      'Hold the Major Technical Meeting (MTM) for extended Critical incidents',
      'Make organizational decisions outside the MIM\'s authority',
      'Protect the MIM\'s ability to run the bridge without interference',
    ],
    notYourJob: [
      'Chairing the bridge',
      'Overriding the MIM\'s escalation or phase decisions in real time',
      'Requiring on-demand updates outside the milestone cadence',
      'Adding people to the bridge without coordinating with the MIM',
    ],
  },

  service_manager: {
    key:      'service_manager',
    label:    'Service Manager',
    fullName: 'Service Manager',
    abbr:     'SVC',
    color:    'text-ops-blue',
    bgColor:  'bg-ops-blue',
    tooltip:  'The Service Manager owns the business relationship with affected services and vendors. They translate the incident into business impact language, manage vendor escalations, and ensure the right service owners are engaged.',
    responsibilities: [
      'Translate incident impact into business terms for executive audiences',
      'Own vendor escalation — know the SLA, make the call, track the RCA commitment',
      'Engage service owners not already on the bridge',
      'Confirm and maintain external impact status',
      'Own the vendor section of the After Action',
    ],
    notYourJob: [
      'Speaking on the bridge unless addressed by the MIM',
      'Independently communicating with customers or executives',
      'Making recovery decisions',
    ],
  },

  customer_ops: {
    key:      'customer_ops',
    label:    'Customer Ops',
    fullName: 'Customer Operations',
    abbr:     'OPS',
    color:    'text-ops-blue',
    bgColor:  'bg-ops-blue',
    tooltip:  'Customer Ops owns the customer-facing impact layer — support queues, known error articles, customer communications, and SLA exposure tracking. They are the bridge between the incident and the customers experiencing it.',
    responsibilities: [
      'Monitor and report support volume related to the incident',
      'Publish and maintain the known error article',
      'Track SLA exposure and flag when thresholds are approaching',
      'Advise the MIM on customer impact severity and timing',
      'Coordinate with the Service Manager on external comms',
    ],
    notYourJob: [
      'Sending customer communications without MIM approval',
      'Escalating independently to vendors or service owners',
      'Deciding when the incident is resolved from the customer perspective',
    ],
  },

  validator: {
    key:      'validator',
    label:    'Validator',
    fullName: 'Recovery Validator',
    abbr:     'VAL',
    color:    'text-ops-green',
    bgColor:  'bg-ops-green',
    tooltip:  'The Validator confirms that recovery actions are working as expected across all affected systems. They are the last check before the MIM signals resolution — independent eyes on the metrics.',
    responsibilities: [
      'Confirm recovery across all affected systems and services',
      'Check each metric against pre-incident baseline',
      'Report validation status to the MIM — not to recovery track owners',
    ],
    notYourJob: [
      'Directing recovery actions',
      'Declaring resolution — that\'s the MIM after the validator signals clear',
    ],
  },

  responder: {
    key:      'responder',
    label:    'Responder',
    fullName: 'Responder',
    abbr:     'RSP',
    color:    'text-ops-dim',
    bgColor:  'bg-ops-muted',
    tooltip:  'A Responder is a technical specialist contributing to a specific recovery track. They take direction from the SRE or recovery track owner, log their actions, and report findings up the chain.',
    responsibilities: [
      'Execute assigned recovery tasks within their timebox',
      'Log every action taken — what, when, result',
      'Report findings to their track owner, not directly to the MIM',
    ],
    notYourJob: [
      'Self-directing beyond their assigned task',
      'Speaking directly on the bridge unless asked',
      'Making decisions about when a track is complete',
    ],
  },

  observer: {
    key:      'observer',
    label:    'Observer',
    fullName: 'Observer',
    abbr:     'OBS',
    color:    'text-ops-dim',
    bgColor:  'bg-ops-muted',
    tooltip:  'An Observer is on the bridge in a silent, learning capacity. They do not speak, act, or contribute to recovery unless explicitly invited by the MIM. Their presence is acknowledged but they hold no operational role.',
    responsibilities: [
      'Monitor the bridge in silent mode',
      'Take notes for personal learning or accreditation purposes',
    ],
    notYourJob: [
      'Speaking on the bridge',
      'Suggesting actions or hypotheses',
      'Acting on anything observed without explicit MIM invitation',
    ],
  },
}

// ─── Ordered list for display ─────────────────────────────────────────────────
// Command roles first (MIM, SRE, Leader, SVC, OPS), then bridge roles

export const COMMAND_ROLES: RoleKey[] = ['mim', 'sre', 'leader', 'service_manager', 'customer_ops']
export const BRIDGE_ROLES:  RoleKey[] = ['validator', 'responder', 'observer']
export const ALL_ROLES:     RoleKey[] = [...COMMAND_ROLES, ...BRIDGE_ROLES]

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getRoleDefinition(key: string): RoleDefinition | undefined {
  return ROLE_DEFINITIONS[key as RoleKey]
}

export function getRoleAbbr(key: string): string {
  return ROLE_DEFINITIONS[key as RoleKey]?.abbr ?? key.toUpperCase().slice(0, 3)
}

export function getRoleColor(key: string): string {
  return ROLE_DEFINITIONS[key as RoleKey]?.color ?? 'text-ops-dim'
}

export function getRoleTooltip(key: string): string {
  return ROLE_DEFINITIONS[key as RoleKey]?.tooltip ?? ''
}
