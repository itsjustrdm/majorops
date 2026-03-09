import { Link, Navigate, useParams } from 'react-router-dom'
import { Activity, AlertTriangle, ArrowRight } from 'lucide-react'
import { useIncident } from '../hooks/useIncident'
import { AudienceHeader } from '../components/AudienceHeader'
import { PhaseBar } from '../components/PhaseBar'
import { CadenceBadge } from '../components/CadenceBadge'
import { MilestoneList } from '../components/MilestoneList'
import { BridgeBanner } from '../components/BridgeBanner'
import { MetricsSidebar } from '../components/MetricsSidebar'
import { Card, SectionLabel } from '../components/ui/Card'
import { formatRelative, phaseLabel, phaseDescription } from '../lib/utils'

function nextStepsForPhase(phase: number): string[] {
  switch (phase) {
    case 2:
      return ['Confirm bridge staffing', 'Collect diagnostic data from owners', 'Log next milestone ETA']
    case 3:
      return ['Validate impact and severity', 'Prep stakeholder comms draft', 'Define mitigation owner']
    case 4:
      return ['Send stakeholder update', 'Publish next-update ETA', 'Stage exec brief snippet']
    case 5:
      return ['Isolate fault domain', 'Confirm blast radius unchanged', 'Update ETA if shifting']
    case 6:
      return ['Monitor mitigation progress', 'Log rollback path if needed', 'Schedule validation checklist']
    case 7:
      return ['Run validation across affected systems', 'Confirm customer impact resolved', 'Prep resolution milestone']
    case 8:
      return ['Publish resolution milestone', 'Schedule PIR window', 'Close bridge and archive logs']
    default:
      return ['Assemble responders', 'Assess scope', 'Publish first stakeholder milestone']
  }
}

export default function Stakeholder() {
  const { id } = useParams<{ id: string }>()
  const { incident } = useIncident(Number(id))

  if (!incident) return <Navigate to="/" />

  const latestUpdate = incident.updates[incident.updates.length - 1]
  const nextSteps = nextStepsForPhase(incident.phase)

  return (
    <div className="min-h-screen bg-ops-bg text-ops-text font-body">
      <AudienceHeader incident={incident} audienceLabel="Stakeholder View" />
      <div className="border-b border-ops-border">
        <PhaseBar currentPhase={incident.phase} showNumbers severity={incident.severity} />
      </div>

      <main className="mx-auto max-w-6xl px-6 py-6 space-y-4">
        {/* Hero */}
        <Card className="px-5 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-heading text-lg font-700 uppercase tracking-wide text-ops-text">
                {incident.title}
              </h1>
              <p className="font-body text-sm text-ops-dim max-w-2xl">{incident.execSummary}</p>
              <div className="flex flex-wrap items-center gap-2">
                <CadenceBadge nextUpdateEta={incident.nextUpdateEta} lastCommunicatedAt={incident.lastCommunicatedAt} />
                <span className="font-mono text-[10px] text-ops-dim">
                  Phase {incident.phase}: {phaseLabel(incident.phase)} · {phaseDescription(incident.phase)}
                </span>
              </div>
            </div>
            <div className="border border-ops-border bg-ops-muted px-4 py-3 text-right">
              <div className="font-mono text-[10px] uppercase tracking-widest text-ops-dim">Last Update</div>
              <div className="font-mono text-sm font-700 text-ops-text">
                {latestUpdate ? formatRelative(latestUpdate.timestamp) : 'No updates yet'}
              </div>
              <div className="mt-2 font-mono text-[10px] text-ops-dim">
                Next ETA sets stakeholder cadence expectations
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            <MilestoneList milestones={incident.milestones} initialCount={2} />

            <Card className="grid grid-cols-1 gap-4 divide-y divide-ops-border md:grid-cols-2 md:divide-y-0 md:divide-x">
              <div className="px-4 py-4">
                <SectionLabel className="mb-2">Business Impact</SectionLabel>
                <p className="font-body text-sm leading-relaxed text-ops-text">{incident.businessImpact}</p>
              </div>
              <div className="px-4 py-4">
                <SectionLabel className="mb-2">Customer Impact</SectionLabel>
                <p className="font-body text-sm leading-relaxed text-ops-text">{incident.customerImpactSummary}</p>
              </div>
            </Card>

            <Card className="px-4 py-4">
              <div className="mb-2 flex items-center gap-2">
                <Activity size={14} strokeWidth={1.5} className="text-ops-dim" />
                <SectionLabel className="mb-0">What happens next</SectionLabel>
              </div>
              <ul className="mt-1 space-y-2">
                {nextSteps.map(step => (
                  <li key={step} className="flex items-start gap-2 font-body text-sm text-ops-text">
                    <ArrowRight size={12} className="mt-0.5 text-ops-dim" />
                    {step}
                  </li>
                ))}
              </ul>
            </Card>

            <BridgeBanner bridgeUrl={incident.bridgeUrl} />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <MetricsSidebar incident={incident} />

            <Card className="px-4 py-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle size={14} strokeWidth={1.5} className="text-ops-orange" />
                <SectionLabel className="mb-0">Risk & Notes</SectionLabel>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ops-dim mb-1">Risk Level</div>
              <div className="font-heading text-sm font-700 uppercase text-ops-text">{incident.riskLevel}</div>
              {incident.audienceNotes && (
                <p className="mt-2 font-body text-sm leading-relaxed text-ops-text">{incident.audienceNotes}</p>
              )}
            </Card>

            <Card className="px-4 py-4">
              <SectionLabel className="mb-2">Affected Systems</SectionLabel>
              <div className="space-y-1">
                {incident.affectedSystems.map(s => (
                  <div key={s} className="font-body text-sm text-ops-text">{s}</div>
                ))}
              </div>
              <div className="mt-3 text-right">
                <Link to={`/incidents/${incident.id}`} className="font-mono text-[10px] uppercase tracking-widest text-ops-red hover:text-ops-red-hi">
                  View detailed timeline →
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
