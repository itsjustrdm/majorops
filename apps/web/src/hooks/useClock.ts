import { useState, useEffect } from 'react'

/** Returns current time as a formatted HH:MM:SS string, updating every second. */
export function useClock(): string {
  const [time, setTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  return time
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

/** Returns elapsed milliseconds since the given ISO timestamp, updating every second. */
export function useElapsed(isoTimestamp: string): number {
  const [elapsed, setElapsed] = useState(() => Date.now() - new Date(isoTimestamp).getTime())

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Date.now() - new Date(isoTimestamp).getTime())
    }, 1000)
    return () => clearInterval(id)
  }, [isoTimestamp])

  return elapsed
}
