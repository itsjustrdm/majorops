import { useState, useCallback } from 'react'
import type { Incident, CommandTeam, StatusUpdate } from '../types'
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

  return {
    incident,
    updateTitle,
    updateDescription,
    updateCommand,
    advancePhase,
    postUpdate,
    updateAlertField,
  }
}

export function useAllIncidents() {
  const [incidents] = useState<Incident[]>(() => Object.values(store))
  return incidents
}
