import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink } from 'lucide-react'
import { WordmarkLogo } from '../components/WordmarkLogo'
import { ThemeSwitcher } from '../components/ThemeSwitcher'
import { NavMenu } from '../components/NavMenu'
import { PHASES } from '../lib/content'

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 border-l-2 border-ops-red pl-3 mb-4">
      <span className="font-mono text-[10px] uppercase tracking-widest text-ops-red">{children}</span>
    </div>
  )
}

// ─── View card — links to a route (to) or static path (href) ─────────────────
function ViewCard({
  label,
  description,
  to,
  href,
  tag,
  tagColor = 'dim',
}: {
  label:       string
  description: string
  to?:         string
  href?:       string
  tag?:        string
  tagColor?:   'red' | 'amber' | 'blue' | 'green' | 'dim'
}) {
  const tagClass = {
    red:   'border-ops-red/30 text-ops-red bg-ops-red/5',
    amber: 'border-ops-amber/30 text-ops-amber bg-ops-amber/5',
    blue:  'border-ops-blue/30 text-ops-blue bg-ops-blue/5',
    green: 'border-ops-green/30 text-ops-green bg-ops-green/5',
    dim:   'border-ops-border text-ops-dim',
  }[tagColor]

  const inner = (
    <>
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-heading text-[12px] font-700 uppercase tracking-wide text-ops-text group-hover:text-white transition-colors">
            {label}
          </span>
          {tag && (
            <span className={`font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 border ${tagClass}`}>
              {tag}
            </span>
          )}
        </div>
        <p className="font-body text-[11px] leading-snug text-ops-dim">{description}</p>
      </div>
      <ArrowRight
        size={12}
        strokeWidth={1.5}
        className="mt-0.5 shrink-0 text-ops-dim group-hover:text-ops-red transition-colors"
      />
    </>
  )

  const cls = "group flex items-start justify-between gap-4 border border-ops-border bg-ops-surface px-5 py-4 transition-colors hover:bg-ops-muted hover:border-ops-red/30"

  if (href) return <a href={href} className={cls}>{inner}</a>
  return <Link to={to!} className={cls}>{inner}</Link>
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function About() {
  return (
    <div className="min-h-screen bg-ops-bg text-ops-text font-body">

      {/* ── Sticky header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ops-border bg-ops-muted px-6 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-ops-dim hover:text-ops-text transition-colors">
            <ArrowLeft size={14} strokeWidth={1.5} />
          </Link>
          <div className="h-4 w-px bg-ops-border" />
          <WordmarkLogo wartime={false} size="sm" />
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <NavMenu />
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="border-b border-ops-border">
        <div className="h-1 w-full bg-ops-red" />
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-ops-red">
            ◈ Major Incident Operations Platform — v0.1.0 alpha
          </div>
          <h1 className="font-display text-5xl font-900 uppercase leading-none tracking-widest text-ops-text sm:text-6xl">
            MajorOps
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-ops-dim">
            A major incident management platform built around a structured eight-phase command
            model. Designed for the engineers, managers, and executives who live through P1s —
            and want something better than a war room on Slack and a shared doc nobody's updating.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 bg-ops-red px-6 py-3 font-heading text-sm font-700 uppercase tracking-widest text-white transition-colors hover:bg-ops-red-hi"
            >
              Open the Platform
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
            <Link
              to="/docs/index.md"
              className="flex items-center gap-2 border border-ops-border px-6 py-3 font-heading text-sm font-700 uppercase tracking-widest text-ops-dim transition-colors hover:text-ops-text hover:border-ops-red/40"
            >
              <BookOpen size={14} strokeWidth={1.5} />
              Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* ── The Problem ────────────────────────────────────────────────── */}
      <section className="border-b border-ops-border">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <SectionTag>The Problem</SectionTag>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl font-700 uppercase tracking-wide text-ops-text mb-4">
                Major Incidents Are Managed By Improvisation.
                <span className="text-ops-red"> That's Why They're Expensive.</span>
              </h2>
              <p className="font-body text-sm leading-relaxed text-ops-dim">
                The average P1 costs an enterprise $300,000 per hour in downtime.† The
                technology to detect failures has never been better. The process for
                responding to them hasn't fundamentally changed in a decade.
              </p>
              <p className="mt-4 font-body text-sm leading-relaxed text-ops-dim">
                When a Critical alert fires at 3am, teams improvise. Who's the MIM?
                Who owns the bridge? Has anyone updated the stakeholders? What's been
                tried? The chaos compounds the cost.
              </p>

              {/* Stat row */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { value: '$300K',  label: 'per hour',        sup: '†' },
                  { value: '67%',    label: 'repeat incidents', sup: '†' },
                  { value: '8',      label: 'command phases',   sup: null },
                ].map(s => (
                  <div key={s.label} className="border border-ops-border bg-ops-surface px-3 py-3 text-center">
                    <div className="font-display text-2xl font-900 uppercase tracking-wide text-ops-red tabular-nums">
                      {s.value}{s.sup && <sup className="text-[10px] ml-0.5 text-ops-dim">{s.sup}</sup>}
                    </div>
                    <div className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-ops-dim">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-2 font-mono text-[8px] text-ops-dim/60 leading-relaxed">
                † Figures cited from Gartner, IDC, and PagerDuty State of Digital Operations reports.
              </p>
            </div>

            <div className="space-y-3">
              {[
                'No single source of truth for incident state',
                'Role confusion during high-stress bridge calls',
                'Stakeholder updates sent late, inconsistently, or not at all',
                'Post-incident reviews that never drive real change',
                'No institutional memory — same failures repeat',
                'MIMs improvising a different process every time',
              ].map(item => (
                <div key={item} className="flex items-start gap-3 border border-ops-border/40 bg-ops-surface px-4 py-3">
                  <span className="mt-0.5 shrink-0 font-mono text-[10px] text-ops-red">✕</span>
                  <span className="font-body text-sm text-ops-dim">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── The Command Model ──────────────────────────────────────────── */}
      <section className="border-b border-ops-border bg-ops-surface">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <SectionTag>The Command Model</SectionTag>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl font-700 uppercase tracking-wide text-ops-text mb-4">
                Eight Phases. One Source of Truth.
                <span className="text-ops-red"> Always.</span>
              </h2>
              <p className="font-body text-sm leading-relaxed text-ops-dim">
                MajorOps is built around a structured eight-phase command model — drawing on
                emergency response patterns, SRE practice, and hard lessons from production
                incidents.
              </p>
              <p className="mt-4 font-body text-sm leading-relaxed text-ops-dim">
                Every incident moves through eight defined phases. Every role has a clear
                mandate. Every transition is recorded. The goal is to eliminate the parts
                of incident response that should never need to be improvised.
              </p>
            </div>

            {/* Phase ladder */}
            <div className="space-y-1.5">
              {PHASES.map(phase => (
                <div
                  key={phase.number}
                  className="flex items-center gap-4 border border-ops-border bg-ops-bg px-4 py-2.5"
                >
                  <span className="shrink-0 font-mono text-[10px] font-700 tabular-nums text-ops-red w-4">
                    {String(phase.number).padStart(2, '0')}
                  </span>
                  <span className="font-heading text-[12px] font-700 uppercase tracking-wide text-ops-text w-20 shrink-0">
                    {phase.name}
                  </span>
                  <span className="font-body text-[11px] text-ops-dim leading-tight">
                    {phase.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What's Built ───────────────────────────────────────────────── */}
      <section className="border-b border-ops-border">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <SectionTag>What's Built</SectionTag>
          <h2 className="font-heading text-2xl font-700 uppercase tracking-wide text-ops-text mb-2">
            Every View, Live
          </h2>
          <p className="mb-8 font-body text-sm text-ops-dim max-w-2xl">
            The platform is a complete frontend implementation — all views below are functional
            and running against mock incident data. Click any to open it.
          </p>

          {/* MIM Command Views */}
          <div className="mb-6">
            <div className="mb-3 font-mono text-[9px] uppercase tracking-widest text-ops-dim border-b border-ops-border pb-2">
              MIM Command — Incident #1 (Critical · Active)
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <ViewCard
                label="Classic View"
                description="Full command interface with phase bar, role panel, recovery paths, and live metrics"
                to="/admin/incidents/1"
                tag="MIM"
                tagColor="red"
              />
              <ViewCard
                label="Terminal View"
                description="Minimal monospace interface for engineers who want less surface area"
                to="/admin/incidents/1/terminal"
                tag="MIM"
                tagColor="red"
              />
              <ViewCard
                label="Focus Mode"
                description="Distraction-free single-column view for sustained command work"
                to="/admin/incidents/1/focus"
                tag="MIM"
                tagColor="red"
              />
            </div>
          </div>

          {/* Stakeholder Views */}
          <div className="mb-6">
            <div className="mb-3 font-mono text-[9px] uppercase tracking-widest text-ops-dim border-b border-ops-border pb-2">
              Stakeholder Surfaces — Incident #1
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <ViewCard
                label="Public Incident"
                description="Status and timeline visible to any subscriber — no login required"
                to="/incidents/1"
                tag="Public"
                tagColor="green"
              />
              <ViewCard
                label="Stakeholder View"
                description="Contextual updates tailored for internal stakeholders and affected teams"
                to="/stakeholders/1"
                tag="Stakeholder"
                tagColor="blue"
              />
              <ViewCard
                label="Executive View"
                description="High-level impact summary for leadership — no technical noise"
                to="/executives/1"
                tag="Executive"
                tagColor="amber"
              />
            </div>
          </div>

          {/* Post-incident */}
          <div className="mb-6">
            <div className="mb-3 font-mono text-[9px] uppercase tracking-widest text-ops-dim border-b border-ops-border pb-2">
              Post-Incident — Incident #1
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <ViewCard
                label="Debrief"
                description="MTTR, phase breakdown, command scoring, and structured lessons learned"
                to="/admin/incidents/1/debrief"
                tag="Post-incident"
                tagColor="dim"
              />
              <ViewCard
                label="Peer Review"
                description="QA scorecard across C1–C8 MIM competency domains with score and notes"
                to="/admin/incidents/1/review"
                tag="Post-incident"
                tagColor="dim"
              />
            </div>
          </div>

          {/* Platform */}
          <div>
            <div className="mb-3 font-mono text-[9px] uppercase tracking-widest text-ops-dim border-b border-ops-border pb-2">
              Platform
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <ViewCard
                label="Status Dashboard"
                description="Public ops status page — all active incidents with severity and phase state"
                to="/"
                tag="Public"
                tagColor="green"
              />
              <ViewCard
                label="Analytics"
                description="Cross-incident MTTR trends, dispatch patterns, and phase efficiency"
                to="/analytics"
                tag="Internal"
                tagColor="dim"
              />
              <ViewCard
                label="Documentation"
                description="Integrated operational playbooks, runbooks, and command-role guides"
                href="/docs/"
                tag="Docs"
                tagColor="dim"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Status ─────────────────────────────────────────────────────── */}
      <section className="border-b border-ops-border bg-ops-surface">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <SectionTag>Project Status</SectionTag>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h2 className="font-heading text-2xl font-700 uppercase tracking-wide text-ops-text mb-4">
                Alpha — Frontend Reference Implementation
              </h2>
              <p className="font-body text-sm leading-relaxed text-ops-dim">
                The current build is a complete frontend with mock data covering the full
                incident lifecycle. The architecture is designed to connect to a real backend
                without structural changes — all data shapes, API routes, and auth patterns
                are documented in the API reference.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to="/api"
                  className="flex items-center gap-2 border border-ops-border px-5 py-2.5 font-heading text-sm font-700 uppercase tracking-widest text-ops-dim transition-colors hover:text-ops-text"
                >
                  API Reference
                  <ExternalLink size={11} strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-ops-red/30 bg-ops-red/5 px-5 py-4">
                <div className="font-heading text-[10px] font-700 uppercase tracking-widest text-ops-red mb-2">
                  In this build
                </div>
                <p className="font-body text-sm text-ops-dim leading-snug">
                  Core incident lifecycle · Phase system · Role clarity · Three stakeholder
                  views · Debrief + peer review · Analytics · Docs integration · API reference
                </p>
              </div>
              <div className="border border-ops-border bg-ops-muted px-5 py-4">
                <div className="font-heading text-[10px] font-700 uppercase tracking-widest text-ops-dim mb-2">
                  Roadmap
                </div>
                <p className="font-body text-sm text-ops-dim leading-snug">
                  Real backend · Team auth · PagerDuty + Slack integration ·
                  AI-assisted debrief · Enterprise SSO
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-ops-border bg-ops-muted">
        <div className="mx-auto max-w-5xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <WordmarkLogo wartime={false} size="sm" />
          <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-ops-dim">
            <Link to="/" className="hover:text-ops-text transition-colors">Dashboard</Link>
            <a href="/docs/" className="hover:text-ops-text transition-colors">Docs</a>
            <a href="/docs/api-reference/" className="hover:text-ops-text transition-colors">API</a>
            <span>v0.1.0-alpha</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
