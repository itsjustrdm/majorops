import { Link } from 'react-router-dom'
import { WordmarkLogo } from '../components/WordmarkLogo'
import { ArrowRight, LogIn, Shield } from 'lucide-react'

export default function Login() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ops-bg px-6 py-10 text-ops-text">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-7rem] top-[-8rem] h-[22rem] w-[22rem] rounded-full bg-ops-red/14 blur-3xl" />
        <div className="absolute right-[-9rem] bottom-[-7rem] h-[24rem] w-[24rem] rounded-full bg-ops-blue/10 blur-3xl" />
        <div className="ops-grid-bg absolute inset-0 opacity-60" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <section className="ops-panel px-8 py-10 sm:px-10 sm:py-12">
          <div className="max-w-2xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ops-red">
              Secure Command Access
            </div>
            <div className="mt-4">
              <WordmarkLogo wartime={false} size="lg" href="/login" />
            </div>
            <h1 className="mt-8 font-display text-4xl font-900 uppercase leading-[0.95] tracking-[0.18em] text-ops-text sm:text-5xl">
              Enter the incident command surface.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-ops-dim sm:text-base">
              Access is restricted to Major Incident Managers and operational responders. Once
              authenticated, you can move directly into live bridge coordination, role-aware
              views, and post-incident review workflows.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ['Role-aware views', 'MIM, stakeholder, and executive perspectives stay aligned.'],
                ['Structured phases', 'Response follows the command model instead of ad hoc chat.'],
                ['Fast handoff', 'Critical context remains visible across every operating surface.'],
              ].map(([title, description]) => (
                <div key={title} className="border border-ops-border bg-ops-bg/55 px-4 py-4 backdrop-blur-sm">
                  <div className="font-heading text-sm font-700 uppercase tracking-[0.08em] text-ops-text">
                    {title}
                  </div>
                  <p className="mt-2 text-xs leading-6 text-ops-dim">{description}</p>
                </div>
              ))}
            </div>

            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ops-dim transition-colors hover:text-ops-red"
            >
              <ArrowRight size={12} strokeWidth={1.7} className="rotate-180" />
              Back to status board
            </Link>
          </div>
        </section>

        <section className="ops-panel mx-auto w-full max-w-md px-8 py-8 sm:px-10">
          <div className="flex items-center gap-2">
            <Shield size={14} strokeWidth={1.5} className="text-ops-red" />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ops-dim">
              Zero Trust Authentication
            </span>
          </div>

          <h2 className="mt-5 font-heading text-2xl font-700 uppercase tracking-[0.08em] text-ops-text">
            MIM Access
          </h2>
          <p className="mt-3 text-sm leading-7 text-ops-dim">
            Sign in with your organization account to open the command workspace for live incident
            management and protected operational views.
          </p>

          <div className="mt-6 border border-ops-border bg-ops-bg/55 px-4 py-4 backdrop-blur-sm">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ops-dim">
              Access policy
            </div>
            <p className="mt-2 text-xs leading-6 text-ops-dim">
              Cloudflare Access validates identity before routing responders into the protected
              admin console.
            </p>
          </div>

          <a
            href="/admin/incidents/1"
            className="mt-6 flex w-full items-center justify-center gap-2 bg-ops-red py-3.5 font-heading text-sm font-700 uppercase tracking-[0.14em] text-white transition-colors hover:bg-ops-red-hi"
          >
            <LogIn size={14} strokeWidth={1.5} />
            Sign In with SSO
          </a>

          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ops-dim">
            Protected by Cloudflare Access
          </p>
        </section>
      </div>
    </div>
  )
}
