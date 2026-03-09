import type { Incident } from '../types'

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
  },
]

// Derived helpers
export const getIncident = (id: number) => INCIDENTS.find(i => i.id === id) ?? null
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
