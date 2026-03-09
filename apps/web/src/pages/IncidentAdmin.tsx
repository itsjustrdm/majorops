import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Pencil } from 'lucide-react'
import { SeverityBadge, StatusBadge } from '../components/ui/Badge'
import { PhaseBar } from '../components/PhaseBar'
import { BridgeBanner } from '../components/BridgeBanner'
import { MetricsSidebar } from '../components/MetricsSidebar'
import { PhaseCommandPanel } from '../components/PhaseCommandPanel'
import { TimelineFeed } from '../components/TimelineFeed'
import { CommandTeam } from '../components/CommandTeam'
import { AlertInfoPanel } from '../components/AlertInfoPanel'
import { FixedFooterBar } from '../components/FixedFooterBar'
import { Card } from '../components/ui/Card'
import { SectionLabel } from '../components/ui/Card'
import { InlineEdit } from '../components/ui/InlineEdit'
import { useIncident } from '../hooks/useIncident'
import { useElapsed } from '../hooks/useClock'
import { formatDurationWithSeconds, phaseLabel, phaseDescription } from '../lib/utils'
import { Activity, MessageSquare } from 'lucide-react'

export default function IncidentAdmin() {
  const { id } = useParams<{ id: string }>()
  const {
    incident,
    updateTitle,
    updateDescription,
    updateCommand,
    advancePhase,
    postUpdate,
    updateAlertField,
  } = useIncident(Number(id))

  // Hooks must be called unconditionally before any early return
  const impactElapsed = useElapsed(incident?.alert.issueTime ?? new Date().toISOString())

  if (!incident) return <Navigate to="/" />

  return (
    <div className="min-h-screen bg-ops-bg pb-20 text-ops-text font-body">
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ops-border bg-ops-bg px-6 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 font-mono text-xs text-ops-dim hover:text-ops-text transition-colors">
            <ArrowLeft size={13} strokeWidth={1.5} />
          </Link>
          <div className="flex items-center gap-2">
            <InlineEdit
              value={`#${incident.id} ${incident.title}`}
              onSave={val => updateTitle(val.replace(/^#\d+\s*/, ''))}
              className="min-w-0"
              inputClassName="font-heading font-700 uppercase tracking-wide"
            />
            <Pencil size={11} className="shrink-0 text-ops-dim" strokeWidth={1.5} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
        </div>
      </header>

      {/* Phase bar — admin shows numbers */}
      <div className="border-b border-ops-border">
        <PhaseBar currentPhase={incident.phase} showNumbers severity={incident.severity} />
      </div>

      {/* Main layout */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex gap-6">
          {/* Left: main content */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Phase hero card */}
            <Card className="px-5 py-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-ops-blue/30 bg-ops-blue/10">
                  <MessageSquare size={18} strokeWidth={1.5} className="text-ops-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-heading text-lg font-700 uppercase tracking-wide text-ops-text">
                    Phase {incident.phase}: {phaseLabel(incident.phase)}
                  </h2>
                  <p className="mt-0.5 font-body text-sm text-ops-dim">{phaseDescription(incident.phase)}</p>
                </div>
              </div>

              {/* Latest update */}
              {incident.updates.slice(-2).reverse().map((update, i) => (
                <div key={update.id} className={`border border-ops-border bg-ops-muted px-4 py-3 mb-2 ${i === 0 ? 'border-l-2 border-l-ops-amber' : ''}`}>
                  <div className="mb-1.5 flex items-center gap-2">
                    <Activity size={11} strokeWidth={1.5} className={i === 0 ? 'text-ops-amber' : 'text-ops-dim'} />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ops-amber">
                      {i === 0 ? 'Latest Activity' : 'Latest Update'}
                    </span>
                    <span className="font-mono text-[10px] text-ops-dim">
                      {new Date(update.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="font-body text-sm text-ops-text">{update.content}</p>
                </div>
              ))}

              {/* Key metrics */}
              <div className="mt-4 grid grid-cols-3 divide-x divide-ops-border border-t border-ops-border pt-4">
                <div className="pr-4">
                  <SectionLabel className="mb-1">MIM</SectionLabel>
                  <div className="font-body text-sm text-ops-text">{incident.command.mim || 'Unassigned'}</div>
                </div>
                <div className="px-4">
                  <SectionLabel className="mb-1">Affected Users</SectionLabel>
                  <div className="font-body text-sm text-ops-text">
                    {incident.alert.customerCount > 0 ? incident.alert.customerCount.toLocaleString() : 'None confirmed'}
                  </div>
                </div>
                <div className={`pl-4 ${incident.alert.customerCount > 0 ? '' : ''}`}>
                  <SectionLabel className="mb-1">Impact Duration</SectionLabel>
                  <div className={`font-mono text-sm font-700 tabular-nums ${incident.alert.customerCount > 0 ? 'text-ops-orange' : 'text-ops-dim'}`}>
                    {incident.alert.customerCount > 0 ? formatDurationWithSeconds(impactElapsed) : '—'}
                  </div>
                </div>
              </div>
            </Card>

            {/* Bridge */}
            <BridgeBanner bridgeUrl={incident.bridgeUrl} />

            {/* Incident info — editable */}
            <Card className="grid grid-cols-3 divide-x divide-ops-border">
              <div className="px-5 py-4">
                <SectionLabel className="mb-2">Description</SectionLabel>
                <InlineEdit
                  value={incident.description}
                  onSave={updateDescription}
                  multiline
                  placeholder="Describe the incident..."
                />
              </div>
              <div className="px-5 py-4">
                <SectionLabel className="mb-2">Affected Systems</SectionLabel>
                <div className="space-y-1">
                  {incident.affectedSystems.map(s => (
                    <div key={s} className="font-body text-sm text-ops-text">{s}</div>
                  ))}
                </div>
              </div>
              <div className="px-5 py-4">
                <SectionLabel className="mb-2">Detected At</SectionLabel>
                <div className="font-mono text-sm text-ops-text">
                  {new Date(incident.detectedAt).toLocaleString()}
                </div>
              </div>
            </Card>

            {/* Alert info — editable */}
            <AlertInfoPanel
              alert={incident.alert}
              onSave={updateAlertField}
              readOnly={false}
            />

            {/* Command team — editable */}
            <CommandTeam
              command={incident.command}
              onSave={updateCommand}
            />

            {/* Timeline */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Activity size={14} strokeWidth={1.5} className="text-ops-dim" />
                <SectionLabel>
                  Incident Timeline ({incident.timeline.length} events)
                </SectionLabel>
              </div>
              <TimelineFeed events={incident.timeline} />
            </div>
          </div>

          {/* Right sidebar — metrics + phase command */}
          <div className="w-72 shrink-0">
            <div className="sticky top-24 space-y-0">
              <div className="border border-ops-border bg-ops-surface divide-y divide-ops-border mb-4">
                <MetricsSidebar incident={incident} />
              </div>
              <PhaseCommandPanel
                incident={incident}
                onAdvancePhase={advancePhase}
                onPostUpdate={postUpdate}
              />
            </div>
          </div>
        </div>
      </div>

      <FixedFooterBar incident={incident} />
    </div>
  )
}
