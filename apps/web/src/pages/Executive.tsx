import { Navigate, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowUpRight, Info, Printer, Timer, Waves } from 'lucide-react'
import { useState } from 'react'
import { useIncident } from '../hooks/useIncident'
import { AudienceHeader } from '../components/AudienceHeader'
import { PhaseBar } from '../components/PhaseBar'
import { CadenceBadge } from '../components/CadenceBadge'
import { MilestoneList } from '../components/MilestoneList'
import { Card, SectionLabel } from '../components/ui/Card'
import { formatDuration, formatRelative, phaseLabel } from '../lib/utils'
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
  const nextEtaLabel = incident.nextUpdateEta
    ? new Date(incident.nextUpdateEta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Not set'
  const summaryTone =
    incident.severity === 'Critical'
      ? 'border-ops-red/30 bg-ops-red/10 text-ops-red'
      : incident.severity === 'High'
        ? 'border-ops-orange/30 bg-ops-orange/10 text-ops-orange'
        : 'border-ops-amber/30 bg-ops-amber/10 text-ops-amber'

  return (
    <div className={`relative min-h-screen font-body ${printMode ? 'bg-white text-black' : 'bg-ops-bg text-ops-text'}`}>
      {!printMode && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-ops-red/12 blur-3xl" />
          <div className="absolute right-[-8rem] top-32 h-[24rem] w-[24rem] rounded-full bg-ops-blue/10 blur-3xl" />
          <div className="ops-grid-bg absolute inset-0 opacity-50" />
        </div>
      )}

      <AudienceHeader incident={incident} audienceLabel="Executive Brief" />
      <div className="border-b border-ops-border">
        <PhaseBar currentPhase={incident.phase} showNumbers severity={incident.severity} />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 py-6 space-y-5">
        <section className={`${printMode ? 'border border-black/20 bg-white' : 'ops-panel'} px-6 py-6 sm:px-8 sm:py-8`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-4xl">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ops-dim">
                Enterprise Situation Brief
              </div>
              <h1 className="mt-4 font-display text-3xl font-900 uppercase leading-[0.95] tracking-[0.16em] sm:text-5xl">
                {incident.title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-ops-dim sm:text-base">
                {incident.execSummary}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <CadenceBadge nextUpdateEta={incident.nextUpdateEta} lastCommunicatedAt={incident.lastCommunicatedAt} />
                <span className={`inline-flex items-center gap-2 border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] ${summaryTone}`}>
                  <AlertTriangle size={12} strokeWidth={1.5} />
                  {incident.riskLevel} risk
                </span>
              </div>
            </div>

            <button
              onClick={() => setPrintMode(!printMode)}
              className="inline-flex items-center gap-2 border border-ops-border px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-ops-dim transition-colors hover:text-ops-text"
            >
              <Printer size={14} strokeWidth={1.5} />
              {printMode ? 'Exit Print View' : 'Print-friendly'}
            </button>
          </div>

          <div className="mt-8 grid gap-3 lg:grid-cols-4">
            {[
              ['Time open', formatDuration(duration), `Detected ${formatRelative(incident.detectedAt)}`],
              ['Affected users', affected > 0 ? affected.toLocaleString() : 'None', incident.customerImpactSummary],
              ['Current posture', `${incident.status}`, `Phase ${incident.phase}/8 · ${phaseLabel(incident.phase)}`],
              ['Next comms', nextEtaLabel, latestUpdate ? `Last update ${formatRelative(latestUpdate.timestamp)}` : 'No external update yet'],
            ].map(([label, value, detail]) => (
              <div
                key={label}
                className={`${printMode ? 'border border-black/15 bg-white' : 'border border-ops-border bg-ops-bg/55 backdrop-blur-sm'} px-4 py-4`}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ops-dim">{label}</div>
                <div className="mt-3 font-display text-3xl font-900 uppercase tracking-[0.08em] text-ops-text">
                  {value}
                </div>
                <p className="mt-2 text-xs leading-5 text-ops-dim">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
          <Card className={`${printMode ? 'bg-white text-black' : 'ops-panel'} px-6 py-6`}>
            <div className="mb-5 flex items-center gap-2">
              <Waves size={14} strokeWidth={1.5} className="text-ops-dim" />
              <SectionLabel className="mb-0">Bottom Line</SectionLabel>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="font-heading text-lg font-700 uppercase tracking-[0.08em] text-ops-text">
                  Business impact
                </div>
                <p className="mt-3 text-sm leading-7 text-ops-dim">{incident.businessImpact}</p>
              </div>
              <div>
                <div className="font-heading text-lg font-700 uppercase tracking-[0.08em] text-ops-text">
                  Customer impact
                </div>
                <p className="mt-3 text-sm leading-7 text-ops-dim">{incident.customerImpactSummary}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className={`${printMode ? 'border border-black/15 bg-black/[0.02]' : 'border border-ops-border bg-ops-bg/50'} px-4 py-4`}>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ops-dim">Affected systems</div>
                <div className="mt-3 font-heading text-sm font-700 uppercase tracking-[0.08em] text-ops-text">
                  {incident.affectedSystems.slice(0, 2).join(' / ')}
                </div>
                <div className="mt-2 text-xs leading-5 text-ops-dim">
                  {incident.affectedSystems.length > 2
                    ? `Plus ${incident.affectedSystems.length - 2} additional system${incident.affectedSystems.length > 3 ? 's' : ''}`
                    : 'Primary systems shown'}
                </div>
              </div>
              <div className={`${printMode ? 'border border-black/15 bg-black/[0.02]' : 'border border-ops-border bg-ops-bg/50'} px-4 py-4`}>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ops-dim">Executive concern</div>
                <div className="mt-3 font-heading text-sm font-700 uppercase tracking-[0.08em] text-ops-text">
                  {incident.riskLevel} enterprise exposure
                </div>
                <div className="mt-2 text-xs leading-5 text-ops-dim">
                  Severity, duration, and customer blast radius remain visible in one place.
                </div>
              </div>
              <div className={`${printMode ? 'border border-black/15 bg-black/[0.02]' : 'border border-ops-border bg-ops-bg/50'} px-4 py-4`}>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ops-dim">Update cadence</div>
                <div className="mt-3 font-heading text-sm font-700 uppercase tracking-[0.08em] text-ops-text">
                  {incident.nextUpdateEta ? formatRelative(incident.nextUpdateEta) : 'Not scheduled'}
                </div>
                <div className="mt-2 text-xs leading-5 text-ops-dim">
                  Last external brief {incident.lastCommunicatedAt ? formatRelative(incident.lastCommunicatedAt) : 'not posted'}.
                </div>
              </div>
            </div>
          </Card>

          <Card className={`${printMode ? 'bg-white text-black' : 'ops-panel'} px-6 py-6`}>
            <div className="mb-5 flex items-center gap-2">
              <Timer size={14} strokeWidth={1.5} className="text-ops-dim" />
              <SectionLabel className="mb-0">Latest Milestone</SectionLabel>
            </div>
            {latestMilestone ? (
              <div>
                <div className="inline-flex items-center gap-2 border border-ops-border bg-ops-bg/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ops-dim">
                  <ArrowUpRight size={12} strokeWidth={1.5} />
                  Cut {formatRelative(latestMilestone.cutAt)}
                </div>
                <div className="mt-4 font-heading text-xl font-700 uppercase tracking-[0.08em] text-ops-text">
                  {latestMilestone.title}
                </div>
                <p className="mt-4 text-sm leading-7 text-ops-dim">{latestMilestone.body}</p>
                <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ops-dim">
                  Published by {latestMilestone.cutBy}
                </div>
              </div>
            ) : (
              <p className="font-body text-sm text-ops-dim">No milestones published yet.</p>
            )}

            <div className="mt-6 border-t border-ops-border pt-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ops-dim">Executive note</div>
              <p className="mt-3 text-sm leading-7 text-ops-dim">
                {incident.audienceNotes || 'No additional exec notes.'}
              </p>
            </div>
          </Card>
        </section>

        <MilestoneList milestones={incident.milestones} initialCount={3} title="Published milestone log" />

        <Card className={`${printMode ? 'bg-white text-black' : 'ops-panel'} px-6 py-6`}>
          <div className="mb-3 flex items-center gap-2">
            <Info size={14} strokeWidth={1.5} className="text-ops-dim" />
            <SectionLabel className="mb-0">Briefing Notes</SectionLabel>
          </div>
          <p className="max-w-4xl text-sm leading-7 text-ops-dim">
            This view is deliberately biased toward executive comprehension: what is happening,
            how bad it is, what changed most recently, and when leadership should expect the next
            update.
          </p>
        </Card>
      </main>
    </div>
  )
}
