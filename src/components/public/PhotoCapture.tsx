import { Camera, Check } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

type Phase = "idle" | "scanning" | "verified"

/** Specimen card, not a real licence. */
const LICENCE_SRC = "/licence-sample.jpg"
const SCAN_MS = 1400

function Brackets() {
  const corners = [
    "top-1.5 left-1.5 border-t-2 border-l-2",
    "top-1.5 right-1.5 border-t-2 border-r-2",
    "bottom-1.5 left-1.5 border-b-2 border-l-2",
    "bottom-1.5 right-1.5 border-b-2 border-r-2",
  ]
  return (
    <>
      {corners.map((c) => (
        <span
          key={c}
          className={`absolute size-5 rounded-[3px] border-neutral-400/80 ${c}`}
          aria-hidden
        />
      ))}
    </>
  )
}

/**
 * Mocked "take a photo of your licence" step. The card rests on a white surface,
 * a scan line sweeps the whole surface, then the result resolves to Verified.
 */
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
      reduceMotion ? 50 : SCAN_MS
    )
    return () => window.clearTimeout(id)
  }, [phase, onVerified, reduceMotion])

  return (
    <div className="flex flex-col gap-3 rounded-md border bg-muted/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">Photo of your driver&apos;s licence</span>
          <span className="text-sm text-muted-foreground">
            We match the photo against the licence number you entered. It is not stored.
          </span>
        </div>
        {phase === "verified" ? (
          <motion.span
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-emerald-700"
            initial={reduceMotion ? false : { opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Check className="size-4" strokeWidth={2.5} aria-hidden />
            Verified
          </motion.span>
        ) : null}
      </div>

      {/* White surface the card rests on. 12px of it plus the card's 2px radius makes 14px. */}
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-[14px] bg-white p-3 outline-1 outline-black/10"
        aria-live="polite"
      >
        <img
          src={LICENCE_SRC}
          alt="Sample Ontario driver's licence"
          className={`block w-full ${
            phase === "idle" ? "opacity-90 brightness-95" : "opacity-100"
          }`}
        />

        {phase === "idle" ? <Brackets /> : null}

        {phase === "scanning" ? (
          <>
            <motion.div
              className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-primary/25 to-transparent"
              initial={{ top: "-4rem" }}
              animate={{ top: ["-4rem", "100%", "-4rem"] }}
              transition={{ duration: SCAN_MS / 1000, ease: "easeInOut" }}
              aria-hidden
            />
            <motion.div
              className="absolute inset-x-0 h-0.5 bg-primary shadow-[0_0_14px_3px_var(--color-primary)]"
              initial={{ top: "0%" }}
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: SCAN_MS / 1000, ease: "easeInOut" }}
              aria-hidden
            />
          </>
        ) : null}
      </div>

      {phase === "idle" ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Place the front of your licence on a flat surface, inside the frame.
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={() => setPhase("scanning")}
          >
            <Camera data-icon="inline-start" aria-hidden />
            Take photo
          </Button>
        </div>
      ) : phase === "scanning" ? (
        <span className="text-sm text-muted-foreground">Checking your licence&hellip;</span>
      ) : (
        <span className="text-sm text-muted-foreground">
          Licence verified against the registered owner of this vehicle.
        </span>
      )}
    </div>
  )
}
