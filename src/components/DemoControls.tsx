import { X } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import type { AuthorizationState } from "@/lib/authorization"

type Props = {
  state: AuthorizationState
  onApprove: () => void
  onDeny: () => void
  onTimeout: () => void
  onReset: () => void
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target.closest("input, textarea, select, [contenteditable='true']") !== null
  )
}

export function DemoControls({ state, onApprove, onDeny, onTimeout, onReset }: Props) {
  const [open, setOpen] = useState(false)
  const pending = state.status === "pending"

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
      if (!event.shiftKey || event.key.toLowerCase() !== "d") return
      if (isEditable(event.target)) return
      event.preventDefault()
      setOpen((v) => !v)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  if (!open) return null

  return (
    <section
      aria-label="Demo controls"
      className="fixed bottom-4 left-4 z-50 w-64 rounded-lg border bg-background p-3 shadow-lg"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Demo controls
        </span>
        <Button variant="ghost" size="icon-xs" aria-label="Close" onClick={() => setOpen(false)}>
          <X aria-hidden />
        </Button>
      </div>
      <div className="flex flex-col gap-1.5">
        <Button variant="outline" size="sm" disabled={!pending} onClick={onApprove}>
          Owner approves
        </Button>
        <Button variant="outline" size="sm" disabled={!pending} onClick={onDeny}>
          Owner denies
        </Button>
        <Button variant="outline" size="sm" disabled={!pending} onClick={onTimeout}>
          Simulate 24h timeout
        </Button>
        <Button variant="secondary" size="sm" onClick={onReset}>
          Reset scenario
        </Button>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">Shift+D to hide</p>
    </section>
  )
}
