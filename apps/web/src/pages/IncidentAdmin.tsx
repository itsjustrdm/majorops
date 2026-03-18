import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Pencil, BarChart2 } from 'lucide-react'
import { SeverityBadge, StatusBadge } from '../components/ui/Badge'
import { PhaseBar } from '../components/PhaseBar'
import { BridgeBanner } from '../components/BridgeBanner'
import { MetricsSidebar } from '../components/MetricsSidebar'
import { PhaseCommandPanel } from '../components/PhaseCommandPanel'
import { TimelineFeed } from '../components/TimelineFeed'
import { CommandTeam } from '../components/CommandTeam'
import { AlertInfoPanel } from '../components/AlertInfoPanel'
import { FixedFooterBar } from '../components/FixedFooterBar'
import { RecoveryPaths } from '../components/RecoveryPaths'
import { MicroUpdateFeed } from '../components/MicroUpdateFeed'
import { PresenceRoster } from '../components/PresenceRoster'
import { DispatchPanel } from '../components/DispatchPanel'
import { MilestoneList } from '../components/MilestoneList'
import { Card, SectionLabel } from '../components/ui/Card'
import { InlineEdit } from '../components/ui/InlineEdit'
import { WordmarkLogo } from '../components/WordmarkLogo'
import { useIncident } from '../hooks/useIncident'
import { useElapsed } from '../hooks/useClock'
import { formatDurationWithSeconds, phaseLabel, phaseDescription } from '../lib/utils'
import { Activity, MessageSquare } from 'lucide-react'

type Tab = 'fireground' | 'dispatch' | 'milestones' | 'timeline'

const TABS: { id: Tab; label: string }[] = [
  { id: 'fireground', label: 'Fireground' },
  { id: 'dispatch',   label: 'Dispatch' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'timeline',   label: 'Timeline' },
]

export default function IncidentAdmin() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('fireground')
  const {
    incident,
    updateTitle,
    updateDescription,
    updateCommand,
    advancePhase,
    postUpdate,
    updateAlertField,
    addRecoveryPath,
    advancePathPhase,
    regressPathPhase,
    updatePathBet,
    addHypothesis,
    postMicroUpdate,
    pageTeam,
    markTeamArrived,
  } = useIncident(Number(id))

  const impactElapsed = useElapsed(incident?.alert.issueTime ?? new Date().toISOString())

  if (!incident) return <Navigate to="/" />

  const pathOptions = incident.recoveryPaths
    .filter(p => p.status === 'active')
    .map(p => ({ id: p.id, title: p.title }))

  const hasWartime = incident.severity === 'Critical' || incident.severity === 'High'
  const pendingPages = incident.teamPages.filter(p => !p.arrivedAt).length

  return (
    <div className="min-h-screen bg-ops-bg pb-20 text-ops-text font-body">
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ops-border bg-ops-bg px-6 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="flex items-center gap-1.5 font-mono text-xs text-ops-dim hover:text-ops-text transition-colors shrink-0">
            <ArrowLeft size={13} strokeWidth={1.5} />
          </Link>
          <WordmarkLogo wartime={hasWartime} size="sm" />
          <div className="hidden h-4 w-px bg-ops-border sm:block shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <InlineEdit
              value={`#${incident.id} ${incident.title}`}
              onSave={val => updateTitle(val.replace(/^#\d+\s*/, ''))}
              className="min-w-0"
              inputClassName="font-heading font-700 uppercase tracking-wide"
            />
            <Pencil size={11} className="shrink-0 text-ops-dim" strokeWidth={1.5} />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
          <Link
            to="/analytics"
            className="hidden sm:flex items-center gap-1.5 border border-ops-border px-3 py-1.5 font-mono text-[10px] text-ops-dim hover:text-ops-text hover:border-ops-text/20 transition-colors"
          >
            <BarChart2 size={11} strokeWidth={1.5} />
            Analytics
          </Link>
        </div>
      </header>

      {/* Phase bar */}
      <div className="border-b border-ops-border">
        <PhaseBar currentPhase={incident.phase} showNumbers severity={incident.severity} />
      </div>

      {/* Tabs */}
      <div className="border-b border-ops-border bg-ops-surface">
        <div className="mx-auto max-w-7xl px-6 flex items-center">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-ops-red text-ops-text'
                  : 'border-transparent text-ops-dim hover:text-ops-text'
              }`}
            >
              {tab.label}
              {tab.id === 'dispatch' && pendingPages > 0 && (
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-ops-amber animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex gap-6">
          {/* Left: tab content */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* ─── FIREGROUND TAB ─────────────────────────────── */}
            {activeTab === 'fireground' && (
              <>
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

                  {incident.updates.slice(-1).map((update) => (
                    <div key={update.id} className="border border-ops-border bg-ops-muted border-l-2 border-l-ops-amber px-4 py-3 mb-3">
                      <div className="mb-1 flex items-center gap-2">
                        <Activity size={11} strokeWidth={1.5} className="text-ops-amber" />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-ops-amber">Latest Update</span>
                        <span className="font-mono text-[10px] text-ops-dim">{new Date(update.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="font-body text-sm text-ops-text">{update.content}</p>
                    </div>
                  ))}

                  <div className="grid grid-cols-3 divide-x divide-ops-border border-t border-ops-border pt-4">
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
                    <div className="pl-4">
                      <SectionLabel className="mb-1">Impact Duration</SectionLabel>
                      <div className={`font-mono text-sm font-700 tabular-nums ${incident.alert.customerCount > 0 ? 'text-ops-orange' : 'text-ops-dim'}`}>
                        {incident.alert.customerCount > 0 ? formatDurationWithSeconds(impactElapsed) : '—'}
                      </div>
                    </div>
                  </div>
                </Card>

                <BridgeBanner bridgeUrl={incident.bridgeUrl} />

                <Card className="px-5 py-5">
                  <RecoveryPaths
                    paths={incident.recoveryPaths}
                    onAdvancePhase={advancePathPhase}
                    onRegressPhase={regressPathPhase}
                    onUpdateBet={updatePathBet}
                    onAddPath={addRecoveryPath}
                    onAddHypothesis={addHypothesis}
                  />
                </Card>

                <Card className="px-5 py-5">
                  <MicroUpdateFeed
                    updates={incident.microUpdates}
                    onPost={postMicroUpdate}
                    pathOptions={pathOptions}
                  />
                </Card>

                <CommandTeam command={incident.command} onSave={updateCommand} />

                <Card className="grid grid-cols-3 divide-x divide-ops-border">
                  <div className="px-5 py-4">
                    <SectionLabel className="mb-2">Description</SectionLabel>
                    <InlineEdit value={incident.description} onSave={updateDescription} multiline placeholder="Describe the incident…" />
                  </div>
                  <div className="px-5 py-4">
                    <SectionLabel className="mb-2">Affected Systems</SectionLabel>
                    <div className="space-y-1">{incident.affectedSystems.map(s => <div key={s} className="font-body text-sm text-ops-text">{s}</div>)}</div>
                  </div>
                  <div className="px-5 py-4">
                    <SectionLabel className="mb-2">Detected At</SectionLabel>
                    <div className="font-mono text-sm text-ops-text">{new Date(incident.detectedAt).toLocaleString()}</div>
                  </div>
                </Card>

                <AlertInfoPanel alert={incident.alert} onSave={updateAlertField} readOnly={false} />
              </>
            )}

            {/* ─── DISPATCH TAB ───────────────────────────────── */}
            {activeTab === 'dispatch' && (
              <Card className="px-5 py-5">
                <DispatchPanel
                  teamPages={incident.teamPages}
                  incidentId={String(incident.id)}
                  onPage={pageTeam}
                  onMarkArrived={markTeamArrived}
                />
              </Card>
            )}

            {/* ─── MILESTONES TAB ─────────────────────────────── */}
            {activeTab === 'milestones' && (
              <MilestoneList milestones={incident.milestones} />
            )}

            {/* ─── TIMELINE TAB ───────────────────────────────── */}
            {activeTab === 'timeline' && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Activity size={14} strokeWidth={1.5} className="text-ops-dim" />
                  <SectionLabel>Incident Timeline ({incident.timeline.length} events)</SectionLabel>
                </div>
                <TimelineFeed events={incident.timeline} />
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="w-72 shrink-0">
            <div className="sticky top-24 space-y-4">
              <div className="border border-ops-border bg-ops-surface">
                <div className="px-4 py-3">
                  <PresenceRoster participants={incident.participants} />
                </div>
              </div>
              <div className="border border-ops-border bg-ops-surface divide-y divide-ops-border">
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
