import { useState, useCallback } from 'react'
import type { Incident, CommandTeam, StatusUpdate, RecoveryPath, Hypothesis, MicroUpdate, TeamPage, AlarmLevel } from '../types'
import { INCIDENTS } from '../data/mockData'

type IncidentStore = Record<number, Incident>

// Module-level mutable store (simulates a server-side store)
const store: IncidentStore = Object.fromEntries(INCIDENTS.map(i => [i.id, { ...i }]))

export function useIncident(id: number) {
  const [incident, setIncident] = useState<Incident | null>(() => store[id] ?? null)

  const updateTitle = useCallback((title: string) => {
    setIncident(prev => {
      if (!prev) return prev
      store[id] = { ...prev, title }
      return { ...prev, title }
    })
  }, [id])

  const updateDescription = useCallback((description: string) => {
    setIncident(prev => {
      if (!prev) return prev
      store[id] = { ...prev, description }
      return { ...prev, description }
    })
  }, [id])

  const updateCommand = useCallback((command: CommandTeam) => {
    setIncident(prev => {
      if (!prev) return prev
      store[id] = { ...prev, command }
      return { ...prev, command }
    })
  }, [id])

  const advancePhase = useCallback(() => {
    setIncident(prev => {
      if (!prev || prev.phase >= 8) return prev
      const next = (prev.phase + 1) as Incident['phase']
      const updated = { ...prev, phase: next, phaseEnteredAt: new Date().toISOString() }
      store[id] = updated
      return updated
    })
  }, [id])

  const postUpdate = useCallback((content: string, visibility: 'public' | 'internal') => {
    setIncident(prev => {
      if (!prev) return prev
      const newUpdate: StatusUpdate = {
        id: `u${Date.now()}`,
        content,
        visibility,
        author: 'R. Castillo', // TODO: replace with auth user
        timestamp: new Date().toISOString(),
      }
      const updated = {
        ...prev,
        updates: [...prev.updates, newUpdate],
        updatesPosted: prev.updatesPosted + 1,
      }
      store[id] = updated
      return updated
    })
  }, [id])

  const updateAlertField = useCallback(<K extends keyof Incident['alert']>(
    key: K,
    value: Incident['alert'][K]
  ) => {
    setIncident(prev => {
      if (!prev) return prev
      const updated = { ...prev, alert: { ...prev.alert, [key]: value } }
      store[id] = updated
      return updated
    })
  }, [id])

  // ─── Recovery Path Operations ────────────────────────────────────────────

  const addRecoveryPath = useCallback((title: string, owner: string) => {
    setIncident(prev => {
      if (!prev) return prev
      const newPath: RecoveryPath = {
        id: `path-${Date.now()}`,
        incidentId: String(id),
        title,
        owner,
        status: 'active',
        phase: 1,
        phaseEnteredAt: new Date().toISOString(),
        currentBet: '',
        hypotheses: [],
        openedAt: new Date().toISOString(),
        closedAt: null,
        notes: '',
      }
      const updated = { ...prev, recoveryPaths: [...prev.recoveryPaths, newPath] }
      store[id] = updated
      return updated
    })
  }, [id])

  const advancePathPhase = useCallback((pathId: string) => {
    setIncident(prev => {
      if (!prev) return prev
      const paths = prev.recoveryPaths.map(p =>
        p.id === pathId && p.phase < 8 ? { ...p, phase: (p.phase + 1) as RecoveryPath['phase'] } : p
      )
      const updated = { ...prev, recoveryPaths: paths }
      store[id] = updated
      return updated
    })
  }, [id])

  const regressPathPhase = useCallback((pathId: string) => {
    setIncident(prev => {
      if (!prev) return prev
      const paths = prev.recoveryPaths.map(p =>
        p.id === pathId && p.phase > 1 ? { ...p, phase: (p.phase - 1) as RecoveryPath['phase'] } : p
      )
      const updated = { ...prev, recoveryPaths: paths }
      store[id] = updated
      return updated
    })
  }, [id])

  const updatePathBet = useCallback((pathId: string, currentBet: string) => {
    setIncident(prev => {
      if (!prev) return prev
      const paths = prev.recoveryPaths.map(p =>
        p.id === pathId ? { ...p, currentBet } : p
      )
      const updated = { ...prev, recoveryPaths: paths }
      store[id] = updated
      return updated
    })
  }, [id])

  const addHypothesis = useCallback((pathId: string, title: string) => {
    setIncident(prev => {
      if (!prev) return prev
      const newHyp: Hypothesis = {
        id: `hyp-${Date.now()}`,
        incidentId: String(id),
        recoveryPathId: pathId,
        title,
        status: 'active',
        evidence: '',
        raisedBy: 'R. Castillo',
        raisedAt: new Date().toISOString(),
        resolvedAt: null,
        resolution: null,
      }
      const paths = prev.recoveryPaths.map(p =>
        p.id === pathId ? { ...p, hypotheses: [...p.hypotheses, newHyp] } : p
      )
      const updated = { ...prev, recoveryPaths: paths }
      store[id] = updated
      return updated
    })
  }, [id])

  // ─── Micro Update Operations ─────────────────────────────────────────────

  const postMicroUpdate = useCallback((content: string, pathId: string | null) => {
    setIncident(prev => {
      if (!prev) return prev
      const newUpdate: MicroUpdate = {
        id: `mu-${Date.now()}`,
        incidentId: String(id),
        content,
        source: 'bridge',
        author: 'R. Castillo',
        timestamp: new Date().toISOString(),
        recoveryPathId: pathId,
        milestoneId: null,
      }
      const updated = { ...prev, microUpdates: [...prev.microUpdates, newUpdate] }
      store[id] = updated
      return updated
    })
  }, [id])

  // ─── Team Dispatch Operations ─────────────────────────────────────────────

  const pageTeam = useCallback((
    teamId: string,
    teamName: string,
    contactName: string | null,
    alarmLevel: AlarmLevel
  ) => {
    setIncident(prev => {
      if (!prev) return prev
      const newPage: TeamPage = {
        id: `page-${Date.now()}`,
        incidentId: String(id),
        teamId,
        teamName,
        contactName: contactName ?? null,
        alarmLevel,
        pagedAt: new Date().toISOString(),
        acknowledgedAt: null,
        arrivedAt: null,
        pagedBy: 'R. Castillo',
        notes: null,
      }
      const updated = { ...prev, teamPages: [...prev.teamPages, newPage] }
      store[id] = updated
      return updated
    })
  }, [id])

  const markTeamArrived = useCallback((pageId: string) => {
    setIncident(prev => {
      if (!prev) return prev
      const pages = prev.teamPages.map(p =>
        p.id === pageId ? { ...p, arrivedAt: new Date().toISOString() } : p
      )
      const updated = { ...prev, teamPages: pages }
      store[id] = updated
      return updated
    })
  }, [id])

  return {
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
  }
}

export function useAllIncidents() {
  const [incidents] = useState<Incident[]>(() => Object.values(store))
  return incidents
}
