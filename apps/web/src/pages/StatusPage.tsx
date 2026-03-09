import { Link } from 'react-router-dom'
import { LogIn, Radio } from 'lucide-react'
import { WordmarkLogo } from '../components/WordmarkLogo'
import { StatusBanner } from '../components/StatusBanner'
import { IncidentCard } from '../components/IncidentCard'
import { useClock } from '../hooks/useClock'
import { useAllIncidents } from '../hooks/useIncident'
import { getSystemStatus } from '../data/mockData'

export default function StatusPage() {
  const clock = useClock()
  const incidents = useAllIncidents()
  const active = incidents.filter(i => i.status !== 'Resolved')
  const systemStatus = getSystemStatus()
  const hasWartime = active.some(i => i.severity === 'Critical' || i.severity === 'High')
  const criticalCount = active.filter(i => i.severity === 'Critical').length

  return (
    <div className="min-h-screen bg-ops-bg text-ops-text font-body">
      {/* Top header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ops-border bg-ops-bg px-6 py-3">
        <div className="flex items-center gap-4">
          <WordmarkLogo wartime={hasWartime} size="md" />
          <div className="hidden h-4 w-px bg-ops-border sm:block" />
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-ops-dim sm:block">
            Major Incident Operations
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tabular-nums text-ops-dim">{clock}</span>
          <Link
            to="/login"
            className="flex items-center gap-2 border border-ops-border px-4 py-2 font-heading text-xs font-700 uppercase tracking-widest text-ops-dim transition-colors hover:border-ops-red/40 hover:text-ops-red"
          >
            <LogIn size={12} strokeWidth={1.5} />
            MIM Login
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        {/* System status banner */}
        <StatusBanner
          status={systemStatus}
          incidentCount={active.length}
          criticalCount={criticalCount}
          lastUpdated={new Date()}
        />

        {/* Active incidents */}
        {active.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio size={14} strokeWidth={1.5} className="text-ops-red" />
                <h2 className="font-heading text-sm font-700 uppercase tracking-widest text-ops-text">
                  Active Incidents
                </h2>
              </div>
              <span className="font-mono text-xs text-ops-dim">
                {active.length} incident{active.length !== 1 ? 's' : ''} in progress
              </span>
            </div>

            <div className="space-y-4">
              {active.map(incident => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          </section>
        )}

        {/* All clear state */}
        {active.length === 0 && (
          <div className="border border-ops-green/20 bg-ops-green/5 px-8 py-12 text-center">
            <div className="mb-2 font-display text-3xl font-900 uppercase tracking-widest text-ops-green">
              All Systems Operational
            </div>
            <div className="font-mono text-xs text-ops-dim">
              No active incidents. Monitoring all systems.
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="border-t border-ops-border pt-6 text-center">
          <p className="font-mono text-[10px] text-ops-dim">
            This page updates automatically. All viewers are internal staff.{' '}
            <Link to="/login" className="text-ops-red hover:text-ops-red-hi underline">
              MIM Login →
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
