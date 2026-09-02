import { CircleCheck, CircleX } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { failingChecks, type Check } from "@/lib/checks"

export function RecordChecks({ checks }: { checks: Check[] }) {
  const reduceMotion = useReducedMotion()
  const failing = failingChecks(checks)
  const summary =
    failing.length === 0
      ? `${checks.length} of ${checks.length} checks passed`
      : `${failing.length} of ${checks.length} checks failed`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record checks</CardTitle>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.ul
          className="flex flex-col divide-y"
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          {checks.map((check) => {
            const pass = check.status === "pass"
            return (
              <motion.li
                key={check.id}
                className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
                }}
              >
                {pass ? (
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                ) : (
                  <CircleX className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium">{check.label}</span>
                    <Badge variant={pass ? "secondary" : "destructive"}>
                      {pass ? "Pass" : "Fail"}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{check.detail}</span>
                </div>
              </motion.li>
            )
          })}
        </motion.ul>
      </CardContent>
    </Card>
  )
}
