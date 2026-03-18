import { useState } from 'react'
import { Phone, Clock, CheckCircle2, AlertTriangle, ChevronDown } from 'lucide-react'
import { SectionLabel } from './ui/Card'
import { formatRelative } from '../lib/utils'
import type { TeamPage, AlarmLevel } from '../types'
import { TEAMS } from '../data/mockData'

interface DispatchPanelProps {
  teamPages: TeamPage[]
  incidentId: string
  onPage: (teamId: string, teamName: string, contactName: string | null, alarmLevel: AlarmLevel) => void
  onMarkArrived: (pageId: string) => void
}

const ALARM_COLORS: Record<AlarmLevel, string> = {
  Box0: 'text-ops-dim border-ops-border',
  Box1: 'text-ops-green border-ops-green/40',
  Box2: 'text-ops-amber border-ops-amber/40',
  Box3: 'text-ops-red border-ops-red/40',
}

function PageRow({ page, onMarkArrived }: { page: TeamPage; onMarkArrived: (id: string) => void }) {
  const pendingMs = page.arrivedAt
    ? new Date(page.arrivedAt).getTime() - new Date(page.pagedAt).getTime()
    : Date.now() - new Date(page.pagedAt).getTime()
  const pendingMinutes = Math.floor(pendingMs / 60000)
  const isOverdue = !page.arrivedAt && pendingMinutes > 5
  const arrived = !!page.arrivedAt

  return (
    <div className={`border px-3 py-2.5 ${arrived ? 'border-ops-green/20 bg-ops-green/5' : isOverdue ? 'border-ops-orange/30 bg-ops-orange/5' : 'border-ops-border bg-ops-surface'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {arrived
              ? <CheckCircle2 size={11} strokeWidth={1.5} className="text-ops-green shrink-0" />
              : isOverdue
                ? <AlertTriangle size={11} strokeWidth={1.5} className="text-ops-orange shrink-0 animate-pulse" />
                : <Clock size={11} strokeWidth={1.5} className="text-ops-amber shrink-0" />
            }
            <span className="font-heading text-xs font-700 uppercase tracking-wide text-ops-text truncate">
              {page.teamName}
            </span>
            {page.alarmLevel && (
              <span className={`shrink-0 border px-1 py-0.5 font-mono text-[9px] ${ALARM_COLORS[page.alarmLevel]}`}>
                {page.alarmLevel}
              </span>
            )}
          </div>

          {page.contactName && (
            <div className="font-mono text-[10px] text-ops-dim ml-5">{page.contactName}</div>
          )}

          <div className="mt-1 ml-5 flex items-center gap-3">
            <span className="font-mono text-[10px] text-ops-dim">
              Paged {formatRelative(page.pagedAt)}
            </span>
            {arrived ? (
              <span className="font-mono text-[10px] text-ops-green">
                On scene in {pendingMinutes}m
              </span>
            ) : (
              <span className={`font-mono text-[10px] ${isOverdue ? 'text-ops-orange' : 'text-ops-dim'}`}>
                Awaiting — {pendingMinutes}m elapsed
              </span>
            )}
          </div>

          {page.notes && (
            <p className="mt-1 ml-5 font-mono text-[10px] text-ops-dim leading-snug">{page.notes}</p>
          )}
        </div>

        {!arrived && (
          <button
            onClick={() => onMarkArrived(page.id)}
            className="shrink-0 border border-ops-green/30 px-2 py-1 font-mono text-[9px] text-ops-green hover:bg-ops-green/10 transition-colors"
          >
            Mark arrived
          </button>
        )}
      </div>
    </div>
  )
}

export function DispatchPanel({ teamPages, onPage, onMarkArrived }: DispatchPanelProps) {
  const [showForm, setShowForm] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [contactName, setContactName] = useState('')
  const [alarmLevel, setAlarmLevel] = useState<AlarmLevel>('Box2')

  const activeTeams = TEAMS.filter(t => t.isActive)
  const activePages = teamPages.filter(p => !p.arrivedAt)
  const completedPages = teamPages.filter(p => !!p.arrivedAt)

  const handlePage = () => {
    if (!selectedTeamId) return
    const team = activeTeams.find(t => t.id === selectedTeamId)
    if (!team) return
    onPage(selectedTeamId, team.name, contactName.trim() || null, alarmLevel)
    setSelectedTeamId('')
    setContactName('')
    setShowForm(false)
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Phone size={12} strokeWidth={1.5} className="text-ops-dim" />
          <SectionLabel>Dispatch</SectionLabel>
          {activePages.length > 0 && (
            <span className="font-mono text-[10px] text-ops-amber border border-ops-amber/30 px-1.5">
              {activePages.length} pending
            </span>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="font-mono text-[10px] text-ops-dim hover:text-ops-text border border-ops-border px-2.5 py-1 hover:border-ops-text/20 transition-colors"
        >
          Page On-Call
        </button>
      </div>

      {/* Dispatch form */}
      {showForm && (
        <div className="mb-3 border border-ops-amber/30 bg-ops-amber/5 p-3 space-y-2">
          <div className="font-mono text-[9px] uppercase tracking-widest text-ops-amber">Activate On-Call Rotation</div>

          <div className="relative">
            <select
              value={selectedTeamId}
              onChange={e => setSelectedTeamId(e.target.value)}
              className="w-full appearance-none bg-ops-bg border border-ops-border px-3 py-2 font-body text-xs text-ops-text outline-none cursor-pointer pr-7"
            >
              <option value="">Select team…</option>
              {activeTeams.map(t => (
                <option key={t.id} value={t.id}>{t.name} · {t.division}</option>
              ))}
            </select>
            <ChevronDown size={11} strokeWidth={1.5} className="absolute right-2 top-1/2 -translate-y-1/2 text-ops-dim pointer-events-none" />
          </div>

          <input
            value={contactName}
            onChange={e => setContactName(e.target.value)}
            placeholder="Contact name (optional — e.g. Alex Kim on-call)"
            className="w-full bg-ops-bg border border-ops-border px-3 py-2 font-body text-xs text-ops-text placeholder-ops-dim/40 outline-none"
          />

          <div className="flex gap-2">
            {(['Box1', 'Box2', 'Box3'] as AlarmLevel[]).map(lvl => (
              <button
                key={lvl}
                onClick={() => setAlarmLevel(lvl)}
                className={`flex-1 border py-1.5 font-mono text-[10px] transition-colors ${alarmLevel === lvl ? ALARM_COLORS[lvl] + ' bg-current/10' : 'border-ops-border text-ops-dim hover:text-ops-text'}`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="font-mono text-[9px] text-ops-dim">
            On-call rotations only. Named escalation requires MIM or leader authorization.
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handlePage}
              disabled={!selectedTeamId}
              className="flex-1 bg-ops-red/10 border border-ops-red/30 py-2 font-mono text-[10px] uppercase tracking-wide text-ops-red hover:bg-ops-red/20 transition-colors disabled:opacity-40"
            >
              Dispatch On-Call
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-ops-border px-4 py-2 font-mono text-[10px] text-ops-dim hover:text-ops-text"
            >Cancel</button>
          </div>
        </div>
      )}

      {/* Active dispatches */}
      {activePages.length > 0 && (
        <div className="space-y-2 mb-3">
          {activePages.map(p => (
            <PageRow key={p.id} page={p} onMarkArrived={onMarkArrived} />
          ))}
        </div>
      )}

      {/* Completed */}
      {completedPages.length > 0 && (
        <div className="space-y-1.5">
          <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim">Arrived</div>
          {completedPages.map(p => (
            <PageRow key={p.id} page={p} onMarkArrived={onMarkArrived} />
          ))}
        </div>
      )}

      {teamPages.length === 0 && !showForm && (
        <p className="font-mono text-[10px] text-ops-dim text-center py-3">No dispatches yet.</p>
      )}
    </div>
  )
}
