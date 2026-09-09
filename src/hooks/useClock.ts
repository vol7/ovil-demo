import { useEffect, useState } from "react"

/** Current time, refreshed every 30 s. Used by the phone status bar. */
export function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])
  return now
}
