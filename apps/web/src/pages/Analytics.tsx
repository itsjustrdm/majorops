import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, BarChart2, Clock, Target, TrendingDown, TrendingUp,
  Shield, Activity, AlertTriangle, CheckCircle, Zap, Radio,
  ChevronUp, ChevronDown, Minus
} from 'lucide-react'
import { WordmarkLogo } from '../components/WordmarkLogo'

// ── Types ──────────────────────────────────────────────────────────────────
type Period = '30d' | '90d' | '180d'

// ── Mock analytics data ────────────────────────────────────────────────────

const mttrTrend = [
  { month: 'Oct', p1: 98,  p2: 187 },
  { month: 'Nov', p1: 112, p2: 210 },
  { month: 'Dec', p1: 87,  p2: 195 },
  { month: 'Jan', p1: 74,  p2: 168 },
  { month: 'Feb', p1: 63,  p2: 142 },
  { month: 'Mar', p1: 58,  p2: 131 },
]

const mttaTrend = [
  { month: 'Oct', value: 14.2 },
  { month: 'Nov', value: 12.8 },
  { month: 'Dec', value: 11.1 },
  { month: 'Jan', value: 9.4  },
  { month: 'Feb', value: 8.7  },
  { month: 'Mar', value: 7.2  },
]

const incidentVolume = [
  { week: 'W40', p1: 2, p2: 5, p3: 11 },
  { week: 'W41', p1: 1, p2: 7, p3: 9  },
  { week: 'W42', p1: 3, p2: 4, p3: 14 },
  { week: 'W43', p1: 0, p2: 6, p3: 10 },
  { week: 'W44', p1: 2, p2: 3, p3: 12 },
  { week: 'W45', p1: 1, p2: 8, p3: 8  },
  { week: 'W46', p1: 4, p2: 5, p3: 11 },
  { week: 'W47', p1: 1, p2: 4, p3: 13 },
  { week: 'W48', p1: 2, p2: 6, p3: 9  },
  { week: 'W49', p1: 0, p2: 5, p3: 10 },
  { week: 'W50', p1: 3, p2: 3, p3: 12 },
  { week: 'W51', p1: 1, p2: 7, p3: 8  },
]

const phaseDurationData = [
  { phase: 'Alert',       p1: 6,  p2: 9,  p3: 14 },
  { phase: 'Gather',      p1: 12, p2: 18, p3: 28 },
  { phase: 'Assess',      p1: 8,  p2: 14, p3: 22 },
  { phase: 'Initial',     p1: 14, p2: 22, p3: 38 },
  { phase: 'Isolation',   p1: 9,  p2: 16, p3: 29 },
  { phase: 'Mitigation',  p1: 11, p2: 19, p3: 34 },
  { phase: 'Recovery',    p1: 7,  p2: 13, p3: 21 },
  { phase: 'Resolution',  p1: 5,  p2: 8,  p3: 14 },
]

const teamDispatchScores = [
  { team: 'Platform Engineering',  score: 9.2, avgBridge: 3.4, avgAck: 1.1, dispatches: 47, trend: 'up' },
  { team: 'Database SRE',          score: 8.7, avgBridge: 4.1, avgAck: 1.4, dispatches: 38, trend: 'up' },
  { team: 'Payments Engineering',  score: 8.1, avgBridge: 4.8, avgAck: 1.8, dispatches: 52, trend: 'flat' },
  { team: 'Auth & Identity',       score: 7.6, avgBridge: 5.9, avgAck: 2.1, dispatches: 29, trend: 'up' },
  { team: 'Cloud Infrastructure',  score: 7.2, avgBridge: 6.3, avgAck: 2.4, dispatches: 33, trend: 'down' },
  { team: 'Network Operations',    score: 6.8, avgBridge: 7.1, avgAck: 2.8, dispatches: 21, trend: 'flat' },
  { team: 'Security Operations',   score: 6.1, avgBridge: 8.4, avgAck: 3.2, dispatches: 14, trend: 'up' },
  { team: 'Customer Operations',   score: 5.4, avgBridge: 11.2, avgAck: 4.1, dispatches: 18, trend: 'down' },
]

const hypothesisCategories = [
  { name: 'Deployment',      validated: 15, eliminated: 6,  discarded: 4, total: 25 },
  { name: 'DB Connection',   validated: 12, eliminated: 8,  discarded: 3, total: 23 },
  { name: 'Config Drift',    validated: 11, eliminated: 7,  discarded: 3, total: 21 },
  { name: 'Auth/Network',    validated: 9,  eliminated: 11, discarded: 2, total: 22 },
  { name: 'Cache/Storage',   validated: 7,  eliminated: 14, discarded: 5, total: 26 },
  { name: 'Third Party',     validated: 5,  eliminated: 9,  discarded: 7, total: 21 },
]

const cadenceTrend = [
  { month: 'Oct', value: 81 },
  { month: 'Nov', value: 84 },
  { month: 'Dec', value: 87 },
  { month: 'Jan', value: 89 },
  { month: 'Feb', value: 92 },
  { month: 'Mar', value: 94 },
]

const radarDimensions = [
  { label: 'MTTA',     value: 82, target: 75 },
  { label: 'MTTR',     value: 76, target: 70 },
  { label: 'Cadence',  value: 91, target: 90 },
  { label: 'Dispatch', value: 78, target: 80 },
  { label: 'Coverage', value: 88, target: 85 },
  { label: 'Signal',   value: 85, target: 80 },
]

// ── Pure SVG Line chart ───────────────────────────────────────────────────

interface LinePoint { month: string; value: number }

function SvgLineChart({
  data, series, height = 180, yMax, yUnit = '', targetLine
}: {
  data: Record<string, unknown>[]
  series: { key: string; color: string; label: string }[]
  height?: number
  yMax: number
  yUnit?: string
  targetLine?: number
}) {
  const W = 560
  const H = height
  const padL = 36, padR = 8, padT = 12, padB = 28
  const chartW = W - padL - padR
  const chartH = H - padT - padB

  const xStep = chartW / (data.length - 1)
  const yScale = (v: number) => chartH - (v / yMax) * chartH

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(t => {
        const y = padT + chartH * t
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#1A1A1A" strokeWidth={1} />
            <text x={padL - 4} y={y + 4} textAnchor="end" fontSize={8} fill="#666" fontFamily="IBM Plex Mono">
              {Math.round(yMax * (1 - t))}{yUnit}
            </text>
          </g>
        )
      })}

      {/* Target line */}
      {targetLine != null && (
        <line
          x1={padL} y1={padT + yScale(targetLine)}
          x2={W - padR} y2={padT + yScale(targetLine)}
          stroke="#22C55E" strokeWidth={1} strokeDasharray="4 4"
        />
      )}

      {/* X axis labels */}
      {data.map((d, i) => (
        <text
          key={i} x={padL + i * xStep} y={H - 6}
          textAnchor="middle" fontSize={8} fill="#666" fontFamily="IBM Plex Mono"
        >
          {d.month as string}
        </text>
      ))}

      {/* Series lines */}
      {series.map(s => {
        const points = data
          .map((d, i) => `${padL + i * xStep},${padT + yScale(d[s.key] as number)}`)
          .join(' ')
        return (
          <g key={s.key}>
            <polyline points={points} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" />
            {data.map((d, i) => (
              <circle
                key={i}
                cx={padL + i * xStep}
                cy={padT + yScale(d[s.key] as number)}
                r={3} fill={s.color}
              />
            ))}
          </g>
        )
      })}
    </svg>
  )
}

// ── Radar chart (SVG polygon) ─────────────────────────────────────────────

function RadarChart() {
  const cx = 140, cy = 140, r = 100
  const n = radarDimensions.length
  const angle = (i: number) => (i / n) * 2 * Math.PI - Math.PI / 2

  const toXY = (i: number, frac: number) => ({
    x: cx + r * frac * Math.cos(angle(i)),
    y: cy + r * frac * Math.sin(angle(i)),
  })

  const valuePoints = radarDimensions.map((d, i) => toXY(i, d.value / 100))
  const outerPoints = radarDimensions.map((_, i) => toXY(i, 1))

  const toPolyline = (pts: { x: number; y: number }[]) =>
    pts.map(p => `${p.x},${p.y}`).join(' ')

  const gridLevels = [0.25, 0.5, 0.75, 1]

  return (
    <svg viewBox="0 0 280 280" className="w-full" style={{ height: 280 }}>
      {/* Grid rings */}
      {gridLevels.map(level => {
        const pts = radarDimensions.map((_, i) => toXY(i, level))
        return (
          <polygon
            key={level}
            points={toPolyline(pts)}
            fill="none"
            stroke="#2A2A2A"
            strokeWidth={1}
          />
        )
      })}

      {/* Spokes */}
      {outerPoints.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#2A2A2A" strokeWidth={1} />
      ))}

      {/* Value polygon */}
      <polygon
        points={toPolyline(valuePoints)}
        fill="#CC0000" fillOpacity={0.15}
        stroke="#CC0000" strokeWidth={2}
      />

      {/* Dots */}
      {valuePoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#CC0000" />
      ))}

      {/* Labels */}
      {radarDimensions.map((d, i) => {
        const labelPt = toXY(i, 1.22)
        return (
          <text
            key={i} x={labelPt.x} y={labelPt.y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={9} fill="#888" fontFamily="IBM Plex Mono"
          >
            {d.label}
          </text>
        )
      })}

      {/* Score labels on dots */}
      {valuePoints.map((p, i) => (
        <text
          key={i} x={p.x} y={p.y - 8}
          textAnchor="middle" fontSize={8} fill="#CC0000" fontFamily="IBM Plex Mono"
        >
          {radarDimensions[i].value}
        </text>
      ))}
    </svg>
  )
}

// ── Stacked bar chart ─────────────────────────────────────────────────────

function StackedBarChart({
  data, keys, colors, height = 180
}: {
  data: Record<string, unknown>[]
  keys: string[]
  colors: string[]
  height?: number
}) {
  const maxTotal = Math.max(...data.map(d => keys.reduce((s, k) => s + (d[k] as number), 0)))

  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => {
        const total = keys.reduce((s, k) => s + (d[k] as number), 0)
        const heightPct = total / maxTotal
        return (
          <div key={i} className="flex-1 flex flex-col gap-0 items-stretch" style={{ height: `${heightPct * 100}%` }}>
            {keys.map((k, ki) => {
              const segPct = ((d[k] as number) / total) * 100
              return (
                <div
                  key={k}
                  style={{ flex: `0 0 ${segPct}%`, backgroundColor: colors[ki], opacity: 0.85 }}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// ── Stat tile ──────────────────────────────────────────────────────────────

function StatTile({
  label, value, sub, icon: Icon, trendLabel, trendDir, color = 'text-ops-text'
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  trendLabel?: string
  trendDir?: 'good' | 'bad'
  color?: string
}) {
  const tc = trendDir === 'good' ? 'text-ops-green' : trendDir === 'bad' ? 'text-ops-red' : 'text-ops-dim'
  return (
    <div className="border border-ops-border bg-ops-surface px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ops-dim">{label}</span>
        <Icon size={14} strokeWidth={1.5} className="text-ops-dim" />
      </div>
      <div className={`font-display text-2xl font-900 tabular-nums ${color}`}>{value}</div>
      {sub && <div className="mt-1 font-mono text-[10px] text-ops-dim">{sub}</div>}
      {trendLabel && (
        <div className={`mt-2 font-mono text-[10px] ${tc}`}>{trendLabel}</div>
      )}
    </div>
  )
}

function SectionHeader({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <div className="h-px w-4 bg-ops-red shrink-0" />
        <h2 className="font-heading text-xs font-700 uppercase tracking-widest text-ops-text">{children}</h2>
      </div>
      {sub && <p className="mt-0.5 ml-6 font-mono text-[10px] text-ops-dim">{sub}</p>}
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 9 ? 'text-ops-green border-ops-green/40 bg-ops-green/10' :
    score >= 8 ? 'text-ops-blue border-ops-blue/40 bg-ops-blue/10' :
    score >= 7 ? 'text-ops-amber border-ops-amber/40 bg-ops-amber/10' :
    score >= 6 ? 'text-ops-orange border-ops-orange/40 bg-ops-orange/10' :
                 'text-ops-red border-ops-red/40 bg-ops-red/10'
  return (
    <span className={`inline-flex items-center border px-2 py-0.5 font-mono text-xs font-700 tabular-nums ${cls}`}>
      {score.toFixed(1)}
    </span>
  )
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up')   return <ChevronUp size={12} className="text-ops-green" strokeWidth={2} />
  if (trend === 'down') return <ChevronDown size={12} className="text-ops-red" strokeWidth={2} />
  return <Minus size={12} className="text-ops-dim" strokeWidth={2} />
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Analytics() {
  const [period, setPeriod] = useState<Period>('90d')

  return (
    <div className="min-h-screen bg-ops-bg pb-20 text-ops-text font-body">

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ops-border bg-ops-bg px-6 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 font-mono text-xs text-ops-dim hover:text-ops-text transition-colors">
            <ArrowLeft size={13} strokeWidth={1.5} />
          </Link>
          <WordmarkLogo wartime={false} size="sm" />
          <div className="hidden h-4 w-px bg-ops-border sm:block" />
          <div className="flex items-center gap-1.5">
            <BarChart2 size={13} strokeWidth={1.5} className="text-ops-dim" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-ops-dim">Stats for Nerds</span>
          </div>
        </div>
        <div className="flex items-center gap-0 border border-ops-border">
          {(['30d', '90d', '180d'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                period === p ? 'bg-ops-red text-white' : 'text-ops-dim hover:text-ops-text'
              }`}
            >{p}</button>
          ))}
        </div>
      </header>

      {/* Page title strip */}
      <div className="border-b border-ops-border bg-ops-surface px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-end justify-between">
          <div>
            <h1 className="font-display text-xl font-900 uppercase tracking-widest text-ops-text">
              Operations Intelligence
            </h1>
            <p className="font-mono text-[10px] text-ops-dim mt-1">
              Incident performance · Response readiness · Pattern analysis — last {period}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-4 font-mono text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-ops-green animate-pulse" />
              <span className="text-ops-dim">Live data pipeline</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6 space-y-8">

        {/* ── Top KPI tiles ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatTile label="MTTR P1" value="58m" sub="Target: 120m" icon={Clock}
            trendDir="good" trendLabel="↓41% vs Oct" color="text-ops-green" />
          <StatTile label="MTTR P2" value="131m" sub="Target: 240m" icon={Clock}
            trendDir="good" trendLabel="↓30% vs Oct" color="text-ops-blue" />
          <StatTile label="MTTA" value="7.2m" sub="Target: ≤10m" icon={Radio}
            trendDir="good" trendLabel="↓49% vs Oct" color="text-ops-green" />
          <StatTile label="Cadence" value="94%" sub="On-time updates" icon={Target}
            trendDir="good" trendLabel="↑13pts vs Oct" color="text-ops-green" />
          <StatTile label="P1+P2 Vol." value="24" sub="This period" icon={AlertTriangle}
            trendDir="good" trendLabel="↓18% vs prior" color="text-ops-amber" />
          <StatTile label="Hyp. Hit" value="48%" sub="First hyp. validated" icon={Zap}
            trendDir="good" trendLabel="↑11pts vs Oct" color="text-ops-blue" />
        </div>

        {/* ── Radar + MTTA trend ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="border border-ops-border bg-ops-surface px-5 py-5">
            <SectionHeader sub="Composite readiness score across 6 operational dimensions">
              Ops Readiness Radar
            </SectionHeader>
            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <RadarChart />
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {radarDimensions.map(d => (
                <div key={d.label} className="flex items-center gap-2">
                  <div
                    className="h-1.5 w-1.5 shrink-0"
                    style={{ backgroundColor: d.value >= d.target ? '#22C55E' : '#F59E0B' }}
                  />
                  <span className="font-mono text-[9px] text-ops-dim">{d.label}</span>
                  <span className="font-mono text-[9px] text-ops-text ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-ops-border bg-ops-surface px-5 py-5">
            <SectionHeader sub="Mean time from alert issue to first MIM action (phase 1→2) · Target ≤10m">
              MTTA — Acknowledge Velocity
            </SectionHeader>
            <SvgLineChart
              data={mttaTrend}
              series={[{ key: 'value', color: '#CC0000', label: 'MTTA' }]}
              yMax={20}
              yUnit="m"
              targetLine={10}
              height={220}
            />
            <div className="mt-2 flex items-center gap-4 font-mono text-[10px] text-ops-dim">
              <div className="flex items-center gap-1.5"><div className="h-1 w-6 bg-ops-red" /> MTTA actual</div>
              <div className="flex items-center gap-1.5">
                <div className="h-px w-6 border-t border-dashed border-ops-green" /> P1 target (10m)
              </div>
            </div>
          </div>
        </div>

        {/* ── MTTR trend ───────────────────────────────────────────── */}
        <div className="border border-ops-border bg-ops-surface px-5 py-5">
          <SectionHeader sub="Mean time to resolve — by severity. P1 target 120m · P2 target 240m">
            MTTR Trend — Resolution Velocity
          </SectionHeader>
          <SvgLineChart
            data={mttrTrend}
            series={[
              { key: 'p1', color: '#CC0000', label: 'P1 Critical' },
              { key: 'p2', color: '#F59E0B', label: 'P2 High' },
            ]}
            yMax={250}
            yUnit="m"
            height={220}
          />
          <div className="mt-2 flex items-center gap-6 font-mono text-[10px] text-ops-dim">
            <div className="flex items-center gap-1.5"><div className="h-1.5 w-5 bg-ops-red" /> P1 Critical</div>
            <div className="flex items-center gap-1.5"><div className="h-1.5 w-5 bg-ops-amber" /> P2 High</div>
          </div>
        </div>

        {/* ── Team Dispatch Credit ──────────────────────────────────── */}
        <div className="border border-ops-border bg-ops-surface px-5 py-5">
          <SectionHeader sub="Response readiness score per team — modeled on ISO Public Protection Classification (1–10 scale)">
            Team Dispatch Credit — Response Readiness
          </SectionHeader>

          <div className="mb-4 flex items-start gap-4 border border-ops-border bg-ops-muted px-4 py-3">
            <Shield size={14} strokeWidth={1.5} className="mt-0.5 shrink-0 text-ops-blue" />
            <p className="font-mono text-[10px] text-ops-dim leading-relaxed">
              Score aggregates page-to-bridge latency, page-to-ack latency, and dispatch volume.{' '}
              <span className="text-ops-green">9–10</span> = elite readiness.{' '}
              <span className="text-ops-amber">6–7</span> = training opportunity.{' '}
              <span className="text-ops-red">Below 6</span> = rota review conversation.
              This is operational data — not a performance ranking.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="grid grid-cols-12 gap-2 font-mono text-[9px] uppercase tracking-widest text-ops-dim px-3 pb-1 border-b border-ops-border">
              <div className="col-span-4">Team</div>
              <div className="col-span-2 text-center">Score</div>
              <div className="col-span-2 text-center">Avg Bridge</div>
              <div className="col-span-2 text-center">Avg Ack</div>
              <div className="col-span-1 text-center">Pages</div>
              <div className="col-span-1 text-center">Trend</div>
            </div>

            {teamDispatchScores.map((team, i) => (
              <div key={team.team} className="grid grid-cols-12 gap-2 items-center px-3 py-2.5 border border-ops-border bg-ops-bg hover:bg-ops-muted transition-colors">
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-ops-dim w-4">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-body text-xs text-ops-text">{team.team}</span>
                  </div>
                  <div className="ml-6 mt-1.5 h-1 bg-ops-muted overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${team.score * 10}%`,
                        backgroundColor: team.score >= 9 ? '#22C55E' : team.score >= 8 ? '#3B82F6' : team.score >= 7 ? '#F59E0B' : team.score >= 6 ? '#EA580C' : '#CC0000'
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-2 text-center"><ScoreBadge score={team.score} /></div>
                <div className="col-span-2 text-center font-mono text-xs tabular-nums text-ops-text">
                  {team.avgBridge.toFixed(1)}<span className="text-ops-dim text-[9px]">m</span>
                </div>
                <div className="col-span-2 text-center font-mono text-xs tabular-nums text-ops-text">
                  {team.avgAck.toFixed(1)}<span className="text-ops-dim text-[9px]">m</span>
                </div>
                <div className="col-span-1 text-center font-mono text-xs tabular-nums text-ops-dim">{team.dispatches}</div>
                <div className="col-span-1 flex justify-center"><TrendIcon trend={team.trend} /></div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3">
            {[
              { range: '9.0–10', label: 'Elite', color: '#22C55E', count: teamDispatchScores.filter(t => t.score >= 9).length },
              { range: '7.5–8.9', label: 'Strong', color: '#3B82F6', count: teamDispatchScores.filter(t => t.score >= 7.5 && t.score < 9).length },
              { range: '6.0–7.4', label: 'Developing', color: '#F59E0B', count: teamDispatchScores.filter(t => t.score >= 6 && t.score < 7.5).length },
              { range: '<6.0', label: 'Review', color: '#CC0000', count: teamDispatchScores.filter(t => t.score < 6).length },
            ].map(tier => (
              <div key={tier.range} className="border border-ops-border bg-ops-muted px-3 py-2 flex items-center gap-2">
                <div className="h-2 w-2 shrink-0" style={{ backgroundColor: tier.color }} />
                <div>
                  <div className="font-mono text-[9px] text-ops-dim">{tier.range}</div>
                  <div className="font-heading text-xs font-700 uppercase">{tier.label} ({tier.count})</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Volume + Phase Duration ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="border border-ops-border bg-ops-surface px-5 py-5">
            <SectionHeader sub="Incident frequency by severity — weekly rolling view">
              Incident Volume
            </SectionHeader>
            <div className="mb-2">
              <StackedBarChart
                data={incidentVolume}
                keys={['p1', 'p2', 'p3']}
                colors={['#CC0000', '#F59E0B', '#3B82F6']}
                height={180}
              />
            </div>
            <div className="flex items-center gap-0 border-t border-ops-border pt-2">
              {incidentVolume.map((d, i) => (
                <div key={i} className="flex-1 text-center font-mono text-[8px] text-ops-dim">{d.week}</div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4 font-mono text-[10px] text-ops-dim">
              <div className="flex items-center gap-1.5"><div className="h-2 w-4 bg-ops-red" /> P1</div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-4 bg-ops-amber" /> P2</div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-4 bg-ops-blue" /> P3</div>
            </div>
          </div>

          <div className="border border-ops-border bg-ops-surface px-5 py-5">
            <SectionHeader sub="Average minutes per phase by severity — where does time actually go?">
              Phase Duration Analysis
            </SectionHeader>
            <div className="space-y-2 mt-2">
              {phaseDurationData.map(row => {
                const maxVal = 40
                return (
                  <div key={row.phase} className="flex items-center gap-3">
                    <div className="w-20 font-mono text-[9px] uppercase tracking-wide text-ops-dim shrink-0 text-right">{row.phase}</div>
                    <div className="flex-1 flex gap-0.5">
                      {(['p1', 'p2', 'p3'] as const).map((sev, idx) => {
                        const colors = ['#CC0000', '#F59E0B', '#3B82F6']
                        return (
                          <div key={sev} className="flex-1 h-6 bg-ops-muted relative overflow-hidden">
                            <div
                              className="absolute inset-y-0 left-0 transition-all"
                              style={{ width: `${(row[sev] / maxVal) * 100}%`, backgroundColor: colors[idx], opacity: 0.7 }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-ops-text/80 tabular-nums">
                              {row[sev]}m
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              <div className="flex items-center gap-3">
                <div className="w-20" />
                <div className="flex-1 flex gap-0.5 font-mono text-[9px] text-ops-dim">
                  <div className="flex-1 text-center">P1</div>
                  <div className="flex-1 text-center">P2</div>
                  <div className="flex-1 text-center">P3</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Hypothesis + Cadence ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="border border-ops-border bg-ops-surface px-5 py-5">
            <SectionHeader sub="Which hypothesis categories validate most — informs first-line investigation strategy">
              Hypothesis Effectiveness
            </SectionHeader>
            <div className="space-y-2 mt-2">
              {hypothesisCategories.map(cat => {
                const validatedPct = (cat.validated / cat.total) * 100
                const eliminatedPct = (cat.eliminated / cat.total) * 100
                const discardedPct = (cat.discarded / cat.total) * 100
                return (
                  <div key={cat.name} className="flex items-center gap-3">
                    <div className="w-24 font-mono text-[9px] text-ops-dim shrink-0">{cat.name}</div>
                    <div className="flex-1 h-5 bg-ops-muted flex overflow-hidden">
                      <div style={{ width: `${validatedPct}%`, backgroundColor: '#22C55E', opacity: 0.85 }} />
                      <div style={{ width: `${eliminatedPct}%`, backgroundColor: '#CC0000', opacity: 0.5 }} />
                      <div style={{ width: `${discardedPct}%`, backgroundColor: '#2A2A2A' }} />
                    </div>
                    <div className="font-mono text-[9px] tabular-nums text-ops-green w-8 text-right">
                      {Math.round(validatedPct)}%
                    </div>
                  </div>
                )
              })}
              <div className="mt-3 flex items-center gap-4 font-mono text-[10px] text-ops-dim">
                <div className="flex items-center gap-1.5"><div className="h-2 w-4 bg-ops-green" /> Validated</div>
                <div className="flex items-center gap-1.5"><div className="h-2 w-4 bg-ops-red/50" /> Eliminated</div>
                <div className="flex items-center gap-1.5"><div className="h-2 w-4 bg-ops-border" /> Discarded</div>
              </div>
            </div>
          </div>

          <div className="border border-ops-border bg-ops-surface px-5 py-5">
            <SectionHeader sub="Milestones delivered on or before committed ETA · Target ≥90%">
              Update Cadence Adherence
            </SectionHeader>
            <SvgLineChart
              data={cadenceTrend}
              series={[{ key: 'value', color: '#22C55E', label: 'On-Time %' }]}
              yMax={100}
              yUnit="%"
              targetLine={90}
              height={200}
            />
            <div className="mt-2 flex items-center gap-4 font-mono text-[10px] text-ops-dim">
              <div className="flex items-center gap-1.5"><div className="h-1 w-6 bg-ops-green" /> Adherence</div>
              <div className="flex items-center gap-1.5">
                <div className="h-px w-6 border-t border-dashed border-ops-green" /> Target (90%)
              </div>
            </div>
          </div>
        </div>

        {/* ── Insight strip ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-ops-green/20 bg-ops-green/5 px-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={13} strokeWidth={1.5} className="text-ops-green" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-ops-green">On Track</span>
            </div>
            <p className="font-body text-sm text-ops-text">MTTA has improved 49% since October. P1 incidents are being acknowledged in under 8 minutes — beating the 10-minute target consistently since January.</p>
          </div>
          <div className="border border-ops-amber/20 bg-ops-amber/5 px-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={13} strokeWidth={1.5} className="text-ops-amber" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-ops-amber">Watch</span>
            </div>
            <p className="font-body text-sm text-ops-text">Cloud Infrastructure and Customer Operations are trending below dispatch credit targets. Rota manager review recommended within 30 days.</p>
          </div>
          <div className="border border-ops-blue/20 bg-ops-blue/5 px-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={13} strokeWidth={1.5} className="text-ops-blue" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-ops-blue">Insight</span>
            </div>
            <p className="font-body text-sm text-ops-text">Deployment hypotheses validate at 60% — highest of any category. Consider making Deployment the default first-hypothesis for P1 incidents involving recent releases.</p>
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <div className="border-t border-ops-border pt-6 flex items-center justify-between font-mono text-[10px] text-ops-dim">
          <div>All metrics computed from structured incident records. No manual data entry required.</div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-ops-green animate-pulse" />
            MajorOps · mim.run
          </div>
        </div>
      </div>
    </div>
  )
}
