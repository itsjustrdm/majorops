import { Navigate, useParams } from 'react-router-dom'
import { Printer, Timer, Info } from 'lucide-react'
import { useState } from 'react'
import { useIncident } from '../hooks/useIncident'
import { AudienceHeader } from '../components/AudienceHeader'
import { PhaseBar } from '../components/PhaseBar'
import { CadenceBadge } from '../components/CadenceBadge'
import { MilestoneList } from '../components/MilestoneList'
import { Card, SectionLabel } from '../components/ui/Card'
import { formatDuration, formatRelative } from '../lib/utils'
import { useElapsed } from '../hooks/useClock'

export default function Executive() {
  const { id } = useParams<{ id: string }>()
  const { incident } = useIncident(Number(id))
  const [printMode, setPrintMode] = useState(false)

  if (!incident) return <Navigate to="/" />

  const duration = useElapsed(incident.detectedAt)
  const affected = incident.alert.customerCount
  const latestMilestone = incident.milestones[incident.milestones.length - 1]
  const latestUpdate = incident.updates[incident.updates.length - 1]

  return (
    <div className={`min-h-screen font-body ${printMode ? 'bg-white text-black' : 'bg-ops-bg text-ops-text'}`}>
      <AudienceHeader incident={incident} audienceLabel="Executive Brief" />
      <div className="border-b border-ops-border">
        <PhaseBar currentPhase={incident.phase} showNumbers severity={incident.severity} />
      </div>

      <main className="mx-auto max-w-6xl px-6 py-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-heading text-xl font-800 uppercase tracking-wide">{incident.title}</h1>
            <p className="max-w-3xl font-body text-sm leading-relaxed text-ops-dim">
              {incident.execSummary}
            </p>
            <CadenceBadge nextUpdateEta={incident.nextUpdateEta} lastCommunicatedAt={incident.lastCommunicatedAt} />
          </div>
          <button
            onClick={() => setPrintMode(!printMode)}
            className="inline-flex items-center gap-2 border border-ops-border px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-ops-dim hover:text-ops-text"
          >
            <Printer size={14} strokeWidth={1.5} />
            {printMode ? 'Exit Print View' : 'Print-friendly'}
          </button>
        </div>

        <Card className={`${printMode ? 'bg-white text-black' : ''} px-5 py-5`}>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <SectionLabel className="mb-2">Business Impact</SectionLabel>
              <p className="font-body text-sm leading-relaxed">{incident.businessImpact}</p>
              <SectionLabel className="mt-4 mb-2">Customer Impact</SectionLabel>
              <p className="font-body text-sm leading-relaxed">{incident.customerImpactSummary}</p>
              <SectionLabel className="mt-4 mb-2">Risk Level</SectionLabel>
              <p className="font-heading text-sm font-700 uppercase">{incident.riskLevel}</p>
            </div>
            <div>
              <SectionLabel className="mb-2">Key Metrics</SectionLabel>
              <ul className="space-y-1 font-mono text-xs">
                <li className="flex justify-between"><span>Time Open</span><span>{formatDuration(duration)}</span></li>
                <li className="flex justify-between"><span>Affected Users</span><span>{affected > 0 ? affected.toLocaleString() : 'None'}</span></li>
                <li className="flex justify-between"><span>Status</span><span>{incident.status}</span></li>
                <li className="flex justify-between"><span>Phase</span><span>{incident.phase}/8</span></li>
              </ul>
            </div>
            <div>
              <SectionLabel className="mb-2">Comms</SectionLabel>
              <div className="font-mono text-xs text-ops-dim">Last update {latestUpdate ? formatRelative(latestUpdate.timestamp) : '—'}</div>
              <div className="font-mono text-xs text-ops-dim">Next ETA {incident.nextUpdateEta ? formatRelative(incident.nextUpdateEta) : '—'}</div>
            </div>
          </div>
        </Card>

        <Card className={`${printMode ? 'bg-white text-black' : ''} px-5 py-5`}>
          <div className="mb-3 flex items-center gap-2">
            <Timer size={14} strokeWidth={1.5} className="text-ops-dim" />
            <SectionLabel className="mb-0">Latest Milestone</SectionLabel>
          </div>
          {latestMilestone ? (
            <div className="space-y-1">
              <div className="font-heading text-md font-700 uppercase">{latestMilestone.title}</div>
              <p className="font-body text-sm leading-relaxed">{latestMilestone.body}</p>
              <div className="font-mono text-[10px] text-ops-dim">
                Cut {formatRelative(latestMilestone.cutAt)} by {latestMilestone.cutBy}
              </div>
            </div>
          ) : (
            <p className="font-body text-sm text-ops-dim">No milestones published yet.</p>
          )}
        </Card>

        <MilestoneList milestones={incident.milestones} initialCount={3} title="Full milestone log" />

        <Card className={`${printMode ? 'bg-white text-black' : ''} px-5 py-5`}>
          <div className="mb-2 flex items-center gap-2">
            <Info size={14} strokeWidth={1.5} className="text-ops-dim" />
            <SectionLabel className="mb-0">Additional Notes</SectionLabel>
          </div>
          <p className="font-body text-sm leading-relaxed">{incident.audienceNotes || 'No additional exec notes.'}</p>
        </Card>
      </main>
    </div>
  )
}
