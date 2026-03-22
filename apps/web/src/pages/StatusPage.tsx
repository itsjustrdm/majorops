import { Link } from 'react-router-dom'
import { Activity, ArrowRight, LogIn, Radio, ShieldAlert, Waypoints } from 'lucide-react'
import { WordmarkLogo } from '../components/WordmarkLogo'
import { StatusBanner } from '../components/StatusBanner'
import { IncidentCard } from '../components/IncidentCard'
import { ThemeSwitcher } from '../components/ThemeSwitcher'
import { NavMenu } from '../components/NavMenu'
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
  const nextUpdate = active[0]?.nextUpdateEta

  return (
    <div className="relative min-h-screen overflow-hidden bg-ops-bg text-ops-text font-body">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-10rem] h-[26rem] w-[26rem] rounded-full bg-ops-red/12 blur-3xl" />
        <div className="absolute right-[-10rem] top-24 h-[24rem] w-[24rem] rounded-full bg-ops-blue/10 blur-3xl" />
        <div className="ops-grid-bg absolute inset-0 opacity-60" />
      </div>

      {/* Top header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ops-border bg-ops-bg/80 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <WordmarkLogo wartime={hasWartime} size="md" />
          <div className="hidden h-4 w-px bg-ops-border sm:block" />
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-ops-dim sm:block">
            Major Incident Operations
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-xs tabular-nums text-ops-dim sm:block">{clock}</span>
          <ThemeSwitcher />
          <NavMenu />
          <Link
            to="/login"
            className="flex items-center gap-2 border border-ops-border px-4 py-2 font-heading text-xs font-700 uppercase tracking-widest text-ops-dim transition-colors hover:border-ops-red/40 hover:text-ops-red"
          >
            <LogIn size={12} strokeWidth={1.5} />
            MIM Login
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 py-8">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
          <div className="ops-panel px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="border border-ops-red/30 bg-ops-red/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-ops-red">
                Live Operational Picture
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ops-dim">
                Updated {clock}
              </span>
            </div>

            <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)]">
              <div>
                <h1 className="max-w-3xl font-display text-4xl font-900 uppercase leading-[0.95] tracking-[0.2em] text-ops-text sm:text-5xl">
                  Incident Command, Presented Clearly.
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-ops-dim sm:text-base">
                  A modern command surface for active incidents, executive communication, and
                  structured response. The public board stays readable under pressure while the
                  command system remains one click away.
                </p>

                <div className="mt-8">
                  <StatusBanner
                    status={systemStatus}
                    incidentCount={active.length}
                    criticalCount={criticalCount}
                    lastUpdated={new Date()}
                  />
                </div>
              </div>

              <div className="grid gap-3 self-start">
                <div className="border border-ops-border bg-ops-bg/55 px-4 py-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ops-dim">
                    <Activity size={12} strokeWidth={1.5} />
                    Active incidents
                  </div>
                  <div className="mt-3 font-display text-4xl font-900 tabular-nums text-ops-text">
                    {active.length}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-ops-dim">
                    Public-facing incident summaries with dedicated stakeholder and executive views.
                  </p>
                </div>

                <div className="border border-ops-border bg-ops-bg/55 px-4 py-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ops-dim">
                    <ShieldAlert size={12} strokeWidth={1.5} />
                    Critical exposure
                  </div>
                  <div className="mt-3 font-display text-4xl font-900 tabular-nums text-ops-red">
                    {criticalCount}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-ops-dim">
                    Escalated incidents remain visually separated so the command path is obvious.
                  </p>
                </div>

                <div className="border border-ops-border bg-ops-bg/55 px-4 py-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ops-dim">
                    <Waypoints size={12} strokeWidth={1.5} />
                    Next update ETA
                  </div>
                  <div className="mt-3 font-heading text-xl font-700 uppercase tracking-[0.08em] text-ops-text">
                    {nextUpdate
                      ? new Date(nextUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Standing by'}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-ops-dim">
                    Communication rhythm stays visible to reduce status-page drift.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="ops-panel px-6 py-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ops-dim">
              Operator access
            </div>
            <h2 className="mt-3 font-heading text-2xl font-700 uppercase tracking-[0.08em] text-ops-text">
              Switch from public board to command mode.
            </h2>
            <p className="mt-4 text-sm leading-7 text-ops-dim">
              Move from customer-safe visibility into the MIM workspace, incident analytics,
              and operating documentation without losing context.
            </p>

            <div className="mt-6 space-y-3">
              <Link
                to="/login"
                className="flex items-center justify-between border border-ops-red/40 bg-ops-red px-4 py-3 font-heading text-sm font-700 uppercase tracking-[0.14em] text-white transition-colors hover:bg-ops-red-hi"
              >
                <span className="flex items-center gap-2">
                  <LogIn size={14} strokeWidth={1.7} />
                  Enter MIM Console
                </span>
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
              <Link
                to="/about"
                className="flex items-center justify-between border border-ops-border bg-ops-bg/60 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ops-dim transition-colors hover:border-ops-red/40 hover:text-ops-text"
              >
                Platform overview
                <ArrowRight size={12} strokeWidth={1.7} />
              </Link>
              <Link
                to="/docs/index.md"
                className="flex items-center justify-between border border-ops-border bg-ops-bg/60 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ops-dim transition-colors hover:border-ops-red/40 hover:text-ops-text"
              >
                Documentation
                <ArrowRight size={12} strokeWidth={1.7} />
              </Link>
            </div>
          </aside>
        </section>

        {/* Active incidents */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio size={14} strokeWidth={1.5} className="text-ops-red" />
              <h2 className="font-heading text-sm font-700 uppercase tracking-widest text-ops-text">
                Active Incidents
              </h2>
            </div>
            <span className="font-mono text-xs text-ops-dim">
              {active.length > 0
                ? `${active.length} incident${active.length !== 1 ? 's' : ''} in progress`
                : 'No live incidents'}
            </span>
          </div>

          {active.length > 0 && (
            <div className="space-y-4">
              {active.map(incident => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          )}

          {active.length === 0 && (
            <div className="ops-panel px-8 py-14 text-center">
              <div className="font-display text-3xl font-900 uppercase tracking-[0.2em] text-ops-green">
                All Systems Operational
              </div>
              <div className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ops-dim">
                No active incidents are currently affecting service. The monitoring surface remains
                live and ready for the next command cycle.
              </div>
            </div>
          )}
        </section>

        {/* Footer note */}
        <div className="mt-10 border-t border-ops-border pt-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ops-dim">
            This page updates automatically for internal viewers.{' '}
            <Link to="/login" className="text-ops-red transition-colors hover:text-ops-red-hi">
              MIM Login →
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
