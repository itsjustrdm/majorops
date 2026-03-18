import type {
  Incident, RecoveryPath, Hypothesis, MicroUpdate,
  IncidentParticipant, Team, TeamPage
} from '../types'

// ─── Teams ────────────────────────────────────────────────────────────────────

export const TEAMS: Team[] = [
  { id: 't1', name: 'Platform Engineering',  division: 'Engineering',   onCallRotation: 'PagerDuty / platform-eng-oncall', defaultAlarmLevel: 'Box2', isActive: true },
  { id: 't2', name: 'Database SRE',          division: 'Engineering',   onCallRotation: 'PagerDuty / db-sre-oncall',       defaultAlarmLevel: 'Box2', isActive: true },
  { id: 't3', name: 'Network Operations',    division: 'Infrastructure', onCallRotation: 'PagerDuty / netops-oncall',      defaultAlarmLevel: 'Box2', isActive: true },
  { id: 't4', name: 'Payments Engineering',  division: 'Engineering',   onCallRotation: 'PagerDuty / payments-oncall',     defaultAlarmLevel: 'Box3', isActive: true },
  { id: 't5', name: 'Security Operations',   division: 'Security',      onCallRotation: 'PagerDuty / soc-oncall',          defaultAlarmLevel: 'Box2', isActive: true },
  { id: 't6', name: 'Cloud Infrastructure',  division: 'Infrastructure', onCallRotation: 'PagerDuty / cloud-infra-oncall', defaultAlarmLevel: 'Box2', isActive: true },
  { id: 't7', name: 'Customer Operations',   division: 'Operations',    onCallRotation: 'PagerDuty / custops-oncall',      defaultAlarmLevel: 'Box1', isActive: true },
  { id: 't8', name: 'Auth & Identity',       division: 'Engineering',   onCallRotation: 'PagerDuty / auth-oncall',         defaultAlarmLevel: 'Box2', isActive: true },
]

// ─── Recovery paths + hypotheses for INC-1 ────────────────────────────────────

const inc1Hypotheses: Hypothesis[] = [
  {
    id: 'h1', incidentId: '1', recoveryPathId: 'rp1',
    title: 'Connection pool saturated by overnight batch job spike',
    status: 'validated',
    evidence: 'Pool metrics show 100% utilization starting 02:14 UTC. Batch job logs confirm 3x normal query volume during maintenance window.',
    raisedBy: 'M. Torres', raisedAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    resolution: 'Confirmed. Batch job query pattern changed — full table scans holding connections open.',
  },
  {
    id: 'h2', incidentId: '1', recoveryPathId: 'rp1',
    title: 'Recent config change caused pool size reduction',
    status: 'eliminated',
    evidence: 'Config history reviewed. No pool size changes in 6 days. Ruled out.',
    raisedBy: 'M. Torres', raisedAt: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    resolution: 'No pool config changes in last 6 days. Config drift ruled out.',
  },
  {
    id: 'h3', incidentId: '1', recoveryPathId: 'rp2',
    title: 'Fraud detection service holding transactions in queue',
    status: 'active',
    evidence: 'Fraud service queue depth is 3x normal. Investigating whether this is cause or effect of payment failures.',
    raisedBy: 'R. Castillo', raisedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    resolvedAt: null, resolution: null,
  },
]

const inc1RecoveryPaths: RecoveryPath[] = [
  {
    id: 'rp1', incidentId: '1',
    title: 'DB Connection Pool',
    status: 'successful',
    phase: 6,
    phaseEnteredAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    owner: 'M. Torres',
    currentBet: 'Increase pool size limit + kill stale connections from batch job',
    hypotheses: inc1Hypotheses.filter(h => h.recoveryPathId === 'rp1'),
    openedAt: new Date(Date.now() - 1000 * 60 * 72).toISOString(),
    closedAt: null,
    notes: 'Batch job was holding connections open with full table scans. Pool increase deployed. Monitoring recovery.',
  },
  {
    id: 'rp2', incidentId: '1',
    title: 'Fraud Detection Queue Backlog',
    status: 'active',
    phase: 3,
    phaseEnteredAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    owner: 'J. Park',
    currentBet: 'Drain fraud queue backlog, assess if it is blocking payment completion',
    hypotheses: inc1Hypotheses.filter(h => h.recoveryPathId === 'rp2'),
    openedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    closedAt: null,
    notes: 'Opened after DB path identified. Fraud queue depth anomalous — may be secondary contributing factor.',
  },
]

const inc1MicroUpdates: MicroUpdate[] = [
  { id: 'mu1', incidentId: '1', recoveryPathId: 'rp1', milestoneId: null, content: 'DB pool at 100% utilization. Batch job still running. Killing long-running connections now.', author: 'M. Torres', timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(), source: 'bridge' },
  { id: 'mu2', incidentId: '1', recoveryPathId: null, milestoneId: 'm1', content: 'Stakeholder email sent. ETA committed at 60 minutes from now.', author: 'R. Castillo', timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(), source: 'bridge' },
  { id: 'mu3', incidentId: '1', recoveryPathId: 'rp1', milestoneId: null, content: 'Pool size increase deployed. Error rate dropping — from 40% to 22% over last 5 min. Continuing to monitor.', author: 'M. Torres', timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), source: 'bridge' },
  { id: 'mu4', incidentId: '1', recoveryPathId: 'rp2', milestoneId: null, content: 'Fraud queue at 4,200 items vs normal 1,400. Investigating cause — may be independent or downstream of payment failures.', author: 'J. Park', timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(), source: 'tool' },
  { id: 'mu5', incidentId: '1', recoveryPathId: null, milestoneId: null, content: 'Acme Corp confirmed they are seeing errors starting 02:20 UTC. 47 failed transactions, all payment type.', author: 'K. Nguyen', timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), source: 'tool' },
  { id: 'mu6', incidentId: '1', recoveryPathId: 'rp1', milestoneId: null, content: 'Error rate now 8%. Pool holding stable. Batch job terminated and rescheduled for off-peak. Watching for full recovery.', author: 'M. Torres', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), source: 'bridge' },
]

const inc1Participants: IncidentParticipant[] = [
  { incidentId: '1', userId: 'r.castillo@company.com', displayName: 'R. Castillo', role: 'mim', joinedAt: new Date(Date.now() - 1000 * 60 * 85).toISOString(), leftAt: null, isOnScene: true, isSilent: false, rapidEscalationFlag: false },
  { incidentId: '1', userId: 'm.torres@company.com',   displayName: 'M. Torres',   role: 'sre', joinedAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(), leftAt: null, isOnScene: true, isSilent: false, rapidEscalationFlag: false },
  { incidentId: '1', userId: 's.okafor@company.com',   displayName: 'S. Okafor',   role: 'leader', joinedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), leftAt: null, isOnScene: true, isSilent: true, rapidEscalationFlag: true },
  { incidentId: '1', userId: 'j.park@company.com',     displayName: 'J. Park',     role: 'service_manager', joinedAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(), leftAt: null, isOnScene: true, isSilent: false, rapidEscalationFlag: false },
  { incidentId: '1', userId: 'k.nguyen@company.com',   displayName: 'K. Nguyen',   role: 'customer_ops', joinedAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(), leftAt: null, isOnScene: true, isSilent: true, rapidEscalationFlag: false },
  { incidentId: '1', userId: 'a.lin@company.com',      displayName: 'A. Lin',      role: 'validator', joinedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), leftAt: null, isOnScene: true, isSilent: true, rapidEscalationFlag: false },
  { incidentId: '1', userId: 'b.chen@company.com',     displayName: 'B. Chen',     role: 'responder', joinedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), leftAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), isOnScene: false, isSilent: false, rapidEscalationFlag: false },
]

const inc1TeamPages: TeamPage[] = [
  { id: 'tp1', incidentId: '1', teamId: 't4', teamName: 'Payments Engineering', contactName: 'M. Torres (on-call)', pagedAt: new Date(Date.now() - 1000 * 60 * 82).toISOString(), acknowledgedAt: new Date(Date.now() - 1000 * 60 * 79).toISOString(), arrivedAt: new Date(Date.now() - 1000 * 60 * 77).toISOString(), pagedBy: 'R. Castillo', alarmLevel: 'Box3', notes: null },
  { id: 'tp2', incidentId: '1', teamId: 't2', teamName: 'Database SRE', contactName: 'J. Park (on-call)', pagedAt: new Date(Date.now() - 1000 * 60 * 72).toISOString(), acknowledgedAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(), arrivedAt: new Date(Date.now() - 1000 * 60 * 68).toISOString(), pagedBy: 'R. Castillo', alarmLevel: 'Box3', notes: null },
  { id: 'tp3', incidentId: '1', teamId: 't1', teamName: 'Platform Engineering', contactName: null, pagedAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(), acknowledgedAt: null, arrivedAt: null, pagedBy: 'R. Castillo', alarmLevel: 'Box2', notes: 'Paged for fraud queue investigation. Awaiting response.' },
]

export const INCIDENTS: Incident[] = [
  {
    id: 1,
    title: 'Payment Processing Degradation',
    description:
      'Payment gateway reporting elevated failure rates across all regions. Checkout flow impacted. Root cause under investigation — suspected connection pool exhaustion on primary payment DB cluster.',
    severity: 'Critical',
    status: 'Active',
    phase: 4,
    phaseEnteredAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    detectedAt: new Date(Date.now() - 1000 * 60 * 87).toISOString(),
    resolvedAt: null,
    businessImpact: 'Revenue loss from failed checkouts across all regions; projected $220k/hr at current failure rate.',
    customerImpactSummary: 'Approx. 1,200 customers experiencing payment failures; support volume spiking.',
    riskLevel: 'High',
    execSummary: 'Payment failures due to DB connection pool exhaustion. Mitigation deploying; expect stabilization shortly.',
    audienceNotes: 'Bridge staffed; CS updates every 20 minutes; exec line auto-subscribed.',
    nextUpdateEta: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
    lastCommunicatedAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    affectedSystems: ['Payment API', 'Checkout Service', 'Order DB', 'Fraud Detection'],
    bridgeUrl: 'https://teams.microsoft.com/bridge/major-4',
    command: {
      sre: 'M. Torres',
      mim: 'R. Castillo',
      leader: 'S. Okafor',
      serviceManager: 'J. Park',
      customerOps: 'K. Nguyen',
    },
    alert: {
      alertId: 'PAY-9021',
      customerCount: 1200,
      issueTime: new Date(Date.now() - 1000 * 60 * 87).toISOString(),
      resolveTime: null,
      externalImpact: 'Yes',
    },
    updatesPosted: 3,
    updates: [
      {
        id: 'u1',
        content:
          'Payment processing is experiencing elevated error rates affecting approximately 1,200 customers. Engineering is actively investigating. ETA for resolution: 60 minutes.',
        visibility: 'public',
        author: 'K. Nguyen',
        timestamp: new Date(Date.now() - 1000 * 60 * 67).toISOString(),
      },
      {
        id: 'u2',
        content:
          'Our team has identified the root cause and is implementing a fix. Payment API, Checkout Service, and Order DB are affected. We expect to have this resolved within the next hour.',
        visibility: 'public',
        author: 'R. Castillo',
        timestamp: new Date(Date.now() - 1000 * 60 * 47).toISOString(),
      },
      {
        id: 'u3',
        content:
          'Mitigation measures are being deployed. We are closely monitoring the situation and will update once we can confirm resolution.',
        visibility: 'public',
        author: 'R. Castillo',
        timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
      },
    ],
    timeline: [
      {
        id: 't1',
        type: 'alert',
        title: 'Phase 1: Alert',
        description:
          'Initial alert received from monitoring system. PAY-9021 triggered. Multiple alerts correlating to same root cause — P95 latency exceeded 5s threshold.',
        actor: 'PagerDuty',
        timestamp: new Date(Date.now() - 1000 * 60 * 87).toISOString(),
        phaseNumber: 1,
      },
      {
        id: 't2',
        type: 'update',
        title: 'Status Update',
        description:
          'We are investigating reports of payment processing issues. Our engineering team is actively working on the issue. We will provide updates as we learn more.',
        actor: 'K. Nguyen',
        timestamp: new Date(Date.now() - 1000 * 60 * 82).toISOString(),
        visibility: 'public',
      },
      {
        id: 't3',
        type: 'phase',
        title: 'Phase 2: Gather',
        description:
          'SRE team assembled. Initial triage indicates elevated error rate on Payment API — 40% of requests failing. DB connection pool at capacity.',
        actor: 'M. Torres',
        timestamp: new Date(Date.now() - 1000 * 60 * 77).toISOString(),
        phaseNumber: 2,
      },
      {
        id: 't4',
        type: 'phase',
        title: 'Phase 2: Gather',
        description:
          'Logs and metrics collected. Connection pool exhaustion confirmed. No recent deployments identified. Last config change 6 days ago.',
        actor: 'M. Torres',
        timestamp: new Date(Date.now() - 1000 * 60 * 67).toISOString(),
        phaseNumber: 2,
      },
      {
        id: 't5',
        type: 'phase',
        title: 'Phase 3: Assess',
        description:
          'MIM assessment: Critical severity confirmed. 1,200 customers experiencing payment failures. Revenue-impacting transactions delayed. Exec notification sent.',
        actor: 'R. Castillo',
        timestamp: new Date(Date.now() - 1000 * 60 * 57).toISOString(),
        phaseNumber: 3,
      },
      {
        id: 't6',
        type: 'update',
        title: 'Status Update',
        description:
          'Our team has identified the root cause and is implementing a fix. Payment API, Checkout Service, Order DB, and Fraud Detection are affected. ETA: 60 minutes.',
        actor: 'R. Castillo',
        timestamp: new Date(Date.now() - 1000 * 60 * 47).toISOString(),
        visibility: 'public',
      },
      {
        id: 't7',
        type: 'phase',
        title: 'Phase 4: Initial',
        description:
          'Initial stakeholder notification sent. Status page updated. Customer support team briefed on known issues and ETA.',
        actor: 'R. Castillo',
        timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
        phaseNumber: 4,
      },
      {
        id: 't8',
        type: 'update',
        title: 'Status Update',
        description:
          'Mitigation measures are being deployed. We are closely monitoring the situation and will update once we can confirm resolution.',
        actor: 'R. Castillo',
        timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
        visibility: 'public',
      },
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Initial stakeholder notification sent',
        body: 'Confirmed payment failures across all regions; investigating DB connection pool saturation. Stakeholder email sent with ETA 60m.',
        statusAtCut: 'Active',
        nextUpdateEta: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
        cutBy: 'R. Castillo',
        cutAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
      },
      {
        id: 'm2',
        title: 'Root cause isolated',
        body: 'Connection pool exhaustion confirmed. Mitigation rolling out with parameter adjustments and failover prep. Execs notified.',
        statusAtCut: 'Active',
        nextUpdateEta: new Date(Date.now() + 1000 * 60 * 40).toISOString(),
        cutBy: 'R. Castillo',
        cutAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
    ],
    recoveryPaths: inc1RecoveryPaths,
    microUpdates: inc1MicroUpdates,
    participants: inc1Participants,
    teamPages: inc1TeamPages,
  },
  {
    id: 2,
    title: 'Storage Service Regional Failure',
    description:
      'S3-compatible storage service in US-EAST region reporting elevated error rates. Object retrieval failures affecting media delivery and user uploads.',
    severity: 'High',
    status: 'Monitoring',
    phase: 6,
    phaseEnteredAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    detectedAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    resolvedAt: null,
    businessImpact: 'Degraded media delivery for east-coast users; elevated support tickets but no full outage.',
    customerImpactSummary: '340 confirmed users experiencing slow or failed media retrievals.',
    riskLevel: 'Medium',
    execSummary: 'Regional storage degradation; failover to US-WEST underway, monitoring recovery.',
    audienceNotes: 'Stakeholder SMS enabled; exec brief auto-updates every 30 minutes.',
    nextUpdateEta: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // overdue intentionally
    lastCommunicatedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    affectedSystems: ['Object Storage', 'CDN', 'Media Pipeline'],
    bridgeUrl: 'https://teams.microsoft.com/bridge/major-2',
    command: {
      sre: 'A. Reyes',
      mim: 'D. Kim',
      leader: 'P. Osei',
      serviceManager: 'L. Martinez',
      customerOps: 'F. Chen',
    },
    alert: {
      alertId: 'STOR-3760',
      customerCount: 340,
      issueTime: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
      resolveTime: null,
      externalImpact: 'Yes',
    },
    updatesPosted: 5,
    updates: [
      {
        id: 'u4',
        content: 'Storage service regional failure under active mitigation. Monitoring recovery.',
        visibility: 'public',
        author: 'D. Kim',
        timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      },
    ],
    timeline: [
      {
        id: 't9',
        type: 'alert',
        title: 'Phase 1: Alert',
        description: 'STOR-3760 triggered. Object retrieval latency spike detected in US-EAST.',
        actor: 'Datadog',
        timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
        phaseNumber: 1,
      },
      {
        id: 't10',
        type: 'phase',
        title: 'Phase 6: Mitigation',
        description:
          'Failover to US-WEST region initiated. CDN cache warming in progress. Monitoring object retrieval rates.',
        actor: 'A. Reyes',
        timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        phaseNumber: 6,
      },
    ],
    milestones: [
      {
        id: 'm3',
        title: 'Failover initiated',
        body: 'Failover to US-WEST started; cache warming in progress. Expect improvement within 20 minutes.',
        statusAtCut: 'Monitoring',
        nextUpdateEta: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        cutBy: 'D. Kim',
        cutAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      },
    ],
    recoveryPaths: [],
    microUpdates: [],
    participants: [
      { incidentId: '2', userId: 'd.kim@company.com', displayName: 'D. Kim', role: 'mim', joinedAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(), leftAt: null, isOnScene: true, isSilent: false, rapidEscalationFlag: false },
      { incidentId: '2', userId: 'a.reyes@company.com', displayName: 'A. Reyes', role: 'sre', joinedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(), leftAt: null, isOnScene: true, isSilent: false, rapidEscalationFlag: false },
    ],
    teamPages: [],
  },
  {
    id: 3,
    title: 'Auth Service Latency Spike',
    description:
      'Authentication service showing elevated P99 latency. Token validation requests taking 3-8x normal response time. No external customer impact confirmed yet.',
    severity: 'High',
    status: 'Active',
    phase: 3,
    phaseEnteredAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    detectedAt: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
    resolvedAt: null,
    businessImpact: 'Potential auth latency ripple to customer logins; no confirmed failures yet.',
    customerImpactSummary: 'No confirmed external impact; proactive comms to support and execs only.',
    riskLevel: 'Low',
    execSummary: 'Auth latency elevated; pre-emptive investigation. No customer impact confirmed.',
    audienceNotes: 'Exec brief flagged as informational-only; next update contingent on impact confirmation.',
    nextUpdateEta: new Date(Date.now() + 1000 * 60 * 25).toISOString(),
    lastCommunicatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    affectedSystems: ['Auth Service', 'Token Validator', 'SSO Gateway'],
    bridgeUrl: 'https://teams.microsoft.com/bridge/major-3',
    command: {
      sre: 'B. Nakamura',
      mim: 'C. Walsh',
      leader: 'T. Singh',
      serviceManager: 'H. Patel',
      customerOps: '',
    },
    alert: {
      alertId: 'AUTH-0441',
      customerCount: 0,
      issueTime: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
      resolveTime: null,
      externalImpact: 'Unknown',
    },
    updatesPosted: 1,
    updates: [
      {
        id: 'u5',
        content:
          'Auth service latency spike under investigation. No confirmed external impact. Engineering investigating.',
        visibility: 'internal',
        author: 'C. Walsh',
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      },
    ],
    timeline: [
      {
        id: 't11',
        type: 'alert',
        title: 'Phase 1: Alert',
        description: 'AUTH-0441 triggered. P99 latency exceeded 2s threshold on token validation.',
        actor: 'Prometheus',
        timestamp: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
        phaseNumber: 1,
      },
      {
        id: 't12',
        type: 'phase',
        title: 'Phase 2: Gather',
        description: 'B. Nakamura joined bridge. Pulling metrics from auth cluster.',
        actor: 'B. Nakamura',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        phaseNumber: 2,
      },
      {
        id: 't13',
        type: 'phase',
        title: 'Phase 3: Assess',
        description:
          'Latency isolated to token validation path. Suspected upstream dependency on certificate rotation service. No login failures yet — pre-emptive action.',
        actor: 'C. Walsh',
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        phaseNumber: 3,
      },
    ],
    milestones: [
      {
        id: 'm4',
        title: 'Pre-emptive notification',
        body: 'Auth latency elevated; no customer impact. Teams investigating cert rotation dependency.',
        statusAtCut: 'Active',
        nextUpdateEta: new Date(Date.now() + 1000 * 60 * 25).toISOString(),
        cutBy: 'C. Walsh',
        cutAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      },
    ],
    recoveryPaths: [],
    microUpdates: [],
    participants: [
      { incidentId: '3', userId: 'c.walsh@company.com', displayName: 'C. Walsh', role: 'mim', joinedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), leftAt: null, isOnScene: true, isSilent: false, rapidEscalationFlag: false },
      { incidentId: '3', userId: 'b.nakamura@company.com', displayName: 'B. Nakamura', role: 'sre', joinedAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(), leftAt: null, isOnScene: true, isSilent: false, rapidEscalationFlag: false },
    ],
    teamPages: [],
  },
]

// Derived helpers
export const getIncident = (id: number) => INCIDENTS.find(i => i.id === id) ?? null
export const getTeam = (id: string) => TEAMS.find(t => t.id === id) ?? null
export const getActiveTeams = () => TEAMS.filter(t => t.isActive)
export const getActiveIncidents = () => INCIDENTS.filter(i => i.status !== 'Resolved')

// Overall system status derived from active incidents
export type SystemStatus = 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage'
export function getSystemStatus(): SystemStatus {
  const active = getActiveIncidents()
  if (active.length === 0) return 'Operational'
  if (active.some(i => i.severity === 'Critical')) return 'Major Outage'
  if (active.some(i => i.severity === 'High')) return 'Degraded Performance'
  return 'Degraded Performance'
}
