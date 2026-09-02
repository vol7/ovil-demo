import { useEffect, useState } from "react"

function remainingLabel(expiresAt: string, now: number): string {
  const ms = Math.max(0, new Date(expiresAt).getTime() - now)
  const total = Math.floor(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":")
}

export function Countdown({ expiresAt }: { expiresAt: string }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span className="font-mono tabular-nums" aria-live="off">
      {remainingLabel(expiresAt, now)}
    </span>
  )
}
