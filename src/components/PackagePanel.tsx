import { CircleCheck, Clock, ShieldAlert, Snowflake } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useState } from "react"

import { Countdown } from "@/components/Countdown"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AuthorizationState } from "@/lib/authorization"
import { allPass, failingChecks, type Check } from "@/lib/checks"
import { formatDate, formatTime } from "@/lib/format"
import type { Vehicle } from "@/lib/vehicles"

type Props = {
  vehicle: Vehicle
  checks: Check[]
  state: AuthorizationState
  onRequest: (applicant: string) => void
  onEscalate: () => void
  /** While false, the verdict (helper + blocked box) is held back until checks settle. */
  settled?: boolean
}

function StatusBox({
  tone,
  icon,
  title,
  children,
}: {
  tone: "info" | "success" | "danger" | "warning"
  icon: React.ReactNode
  title: string
  children?: React.ReactNode
}) {
  const tones = {
    info: "border-primary/30 bg-primary/5",
    success: "border-emerald-600/30 bg-emerald-50",
    danger: "border-destructive/30 bg-destructive/5",
    warning: "border-amber-500/40 bg-amber-50",
  } as const
  return (
    <div
      role="status"
      className={`flex gap-3 rounded-xl border p-4 text-foreground ${tones[tone]}`}
    >
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="text-sm font-medium">{title}</div>
        {children}
      </div>
    </div>
  )
}

export function PackagePanel({
  vehicle,
  checks,
  state,
  onRequest,
  onEscalate,
  settled = true,
}: Props) {
  const reduceMotion = useReducedMotion()
  const [applicant, setApplicant] = useState("Fawaz A.")
  // A buyer who started the request online is the applicant at the counter.
  const shownApplicant = "origin" in state && state.origin === "buyer" ? state.requester : applicant
  const canRequest = allPass(checks)
  const failing = failingChecks(checks)
  const requestDisabled = !canRequest || state.status !== "idle"
  const editable = state.status === "idle" || state.status === "blocked"
  const showStatus = state.status !== "idle" && (state.status !== "blocked" || settled)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Used vehicle package</CardTitle>
        <CardDescription>
          Owner authorization is required before a package is issued for this vehicle.
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="applicant">Applicant</Label>
          {editable ? (
            <Input
              id="applicant"
              value={applicant}
              onChange={(e) => setApplicant(e.target.value)}
            />
          ) : (
            <div
              id="applicant"
              className="flex h-9 items-center rounded-md border border-dashed px-2.5 text-sm"
            >
              {shownApplicant}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {state.status === "authorized" ? null : (
            <Button size="lg" disabled={requestDisabled} onClick={() => onRequest(applicant)}>
              Request owner authorization
            </Button>
          )}
          {canRequest && state.status === "idle" ? (
            <p className="text-sm text-muted-foreground">
              A one-time code will be sent to the registered owner&apos;s phone ending in{" "}
              {vehicle.owner.phoneLast4}.
            </p>
          ) : null}
          {!canRequest && settled && state.status !== "blocked" && state.status !== "escalated" ? (
            <p className="text-sm text-destructive">
              Authorization unavailable: {failing.length} record{" "}
              {failing.length === 1 ? "check" : "checks"} failed.
            </p>
          ) : null}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {showStatus ? (
            <motion.div
              key={state.status}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={
                reduceMotion
                  ? undefined
                  : { opacity: 0, y: -12, filter: "blur(4px)", transition: { duration: 0.15 } }
              }
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {state.status === "blocked" ? (
                <StatusBox
                  tone="danger"
                  icon={<ShieldAlert className="size-4 text-destructive" aria-hidden />}
                  title="Transaction blocked"
                >
                  <p className="text-sm text-muted-foreground">
                    {failing.length} record {failing.length === 1 ? "check" : "checks"} failed. This
                    VIN cannot be transferred until the flagged records are resolved.
                  </p>
                  <div className="mt-2">
                    <Button variant="destructive" onClick={onEscalate}>
                      Escalate to Insurance Hub / Law Enforcement
                    </Button>
                  </div>
                </StatusBox>
              ) : null}

              {state.status === "escalated" ? (
                <StatusBox
                  tone="danger"
                  icon={<ShieldAlert className="size-4 text-destructive" aria-hidden />}
                  title="Escalated for review"
                >
                  <p className="text-sm text-muted-foreground">
                    Do not release the vehicle. Case opened at {formatTime(state.escalatedAt)}
                  </p>
                  <p className="font-mono text-sm tracking-wider">{state.caseReference}</p>
                </StatusBox>
              ) : null}

              {state.status === "pending" ? (
                <StatusBox
                  tone="info"
                  icon={<Clock className="size-4 text-primary" aria-hidden />}
                  title={
                    state.origin === "buyer"
                      ? "Awaiting registered owner"
                      : "Request sent to registered owner"
                  }
                >
                  {state.origin === "buyer" ? (
                    <p className="text-sm text-muted-foreground">
                      Requested online by {state.requester} at {formatTime(state.sentAt)} via
                      ServiceOntario.
                    </p>
                  ) : null}
                  <p className="text-sm text-muted-foreground">
                    Expires in <Countdown expiresAt={state.expiresAt} />
                  </p>
                  <p className="text-sm text-muted-foreground">Waiting for response…</p>
                </StatusBox>
              ) : null}

              {state.status === "authorized" ? (
                <StatusBox
                  tone="success"
                  icon={<CircleCheck className="size-4 text-emerald-600" aria-hidden />}
                  title={
                    state.origin === "owner"
                      ? "Authorization on file"
                      : "Authorized by registered owner"
                  }
                >
                  {state.origin === "owner" ? (
                    <p className="text-sm text-muted-foreground">
                      Pre-approved online by the registered owner on{" "}
                      {formatDate(state.approvedAt.slice(0, 10))} via ServiceOntario · valid until{" "}
                      {formatDate(state.validUntil.slice(0, 10))}
                    </p>
                  ) : state.origin === "buyer" ? (
                    <p className="text-sm text-muted-foreground">
                      Requested online by {state.requester} · approved by the owner at{" "}
                      {formatTime(state.approvedAt)}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Approved by the owner at {formatTime(state.approvedAt)} from the confirmation
                      link
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">Authorization reference</p>
                  <p className="font-mono text-base tracking-wider">{state.authorizationCode}</p>
                  <p className="mt-1 text-sm font-medium text-emerald-700">
                    Clear to proceed with used vehicle package.
                  </p>
                </StatusBox>
              ) : null}

              {state.status === "frozen" ? (
                <StatusBox
                  tone="warning"
                  icon={<Snowflake className="size-4 text-amber-600" aria-hidden />}
                  title="Frozen — flagged for security review"
                >
                  <p className="text-sm text-muted-foreground">
                    {state.reason === "denied"
                      ? "Owner denied the request."
                      : "No response within 24 hours."}{" "}
                    Recorded at {formatTime(state.frozenAt)}
                  </p>
                </StatusBox>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
