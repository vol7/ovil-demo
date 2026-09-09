import { Camera, Check, IdCard } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

type Phase = "idle" | "scanning" | "verified"

/** Mocked "take a photo of your licence" card. Resolves to Verified after a short scan. */
export function PhotoCapture({ onVerified }: { onVerified: () => void }) {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>("idle")

  useEffect(() => {
    if (phase !== "scanning") return
    const id = window.setTimeout(
      () => {
        setPhase("verified")
        onVerified()
      },
      reduceMotion ? 50 : 1400
    )
    return () => window.clearTimeout(id)
  }, [phase, onVerified, reduceMotion])

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">Photo of your driver's licence</span>
          <span className="text-sm text-muted-foreground">
            We match the photo against the licence number you entered. It is not stored.
          </span>
        </div>
        {phase === "verified" ? (
          <span className="flex items-center gap-1 text-sm font-medium text-emerald-700">
            <Check className="size-4" aria-hidden /> Verified
          </span>
        ) : null}
      </div>

      <div
        className="relative flex aspect-[1.586] w-full max-w-xs items-center justify-center overflow-hidden rounded-md border-2 border-dashed bg-background"
        aria-live="polite"
      >
        <IdCard className="size-12 text-muted-foreground/50" strokeWidth={1.25} aria-hidden />
        {phase === "scanning" ? (
          <motion.div
            className="absolute inset-x-0 h-0.5 bg-primary shadow-[0_0_12px_2px_var(--color-primary)]"
            initial={{ top: "4%" }}
            animate={{ top: ["4%", "94%", "4%"] }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            aria-hidden
          />
        ) : null}
        {phase === "verified" ? (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-emerald-50/90"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.span
              className="flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white"
              initial={reduceMotion ? false : { scale: 0.25, filter: "blur(4px)" }}
              animate={{ scale: 1, filter: "blur(0px)" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            >
              <Check className="size-6" strokeWidth={3} aria-hidden />
            </motion.span>
          </motion.div>
        ) : null}
      </div>

      {phase === "idle" ? (
        <Button
          type="button"
          variant="outline"
          className="w-fit"
          onClick={() => setPhase("scanning")}
        >
          <Camera data-icon="inline-start" aria-hidden />
          Take photo
        </Button>
      ) : phase === "scanning" ? (
        <span className="text-sm text-muted-foreground">Checking your licence…</span>
      ) : null}
    </div>
  )
}
