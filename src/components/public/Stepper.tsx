import { Check } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

export function StepHeader({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-3 text-sm" aria-label="Progress">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                  done && "bg-primary text-primary-foreground",
                  active && "bg-primary text-primary-foreground ring-4 ring-primary/15",
                  !done && !active && "bg-muted text-muted-foreground"
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : i + 1}
              </span>
              <span className={cn(active ? "font-medium" : "text-muted-foreground")}>{label}</span>
            </span>
            {i < steps.length - 1 ? <span className="h-px w-8 bg-border" aria-hidden /> : null}
          </li>
        )
      })}
    </ol>
  )
}

export function StepPanel({
  step,
  children,
}: {
  step: string | number
  children: React.ReactNode
}) {
  const reduceMotion = useReducedMotion()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={step}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -6, transition: { duration: 0.15 } }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex flex-col gap-6"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
