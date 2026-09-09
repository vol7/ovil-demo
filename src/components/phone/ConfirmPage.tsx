import { Check, ChevronLeft, Lock, X } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useNavigate } from "react-router"

import { StatusBar } from "@/components/phone/PhoneChrome"
import { smsLink } from "@/lib/sms"
import { Button } from "@/components/ui/button"
import { generateAuthorizationCode } from "@/lib/authorization"
import { formatDate, formatTime } from "@/lib/format"
import { OFFICE } from "@/lib/office"
import { useSession } from "@/lib/session"
import { findVehicle, vehicleTitle } from "@/lib/vehicles"

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5">
      <dt className="text-xs text-neutral-500">{label}</dt>
      <dd className="text-[15px] text-neutral-900">{value}</dd>
    </div>
  )
}

function ResultIcon({ ok }: { ok: boolean }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      initial={reduceMotion ? false : { scale: 0.25, opacity: 0, filter: "blur(4px)" }}
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", duration: 0.35, bounce: 0 }}
      className={`flex size-16 items-center justify-center rounded-full ${ok ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-700"}`}
    >
      {ok ? (
        <Check className="size-8" strokeWidth={2.5} aria-hidden />
      ) : (
        <X className="size-8" strokeWidth={2.5} aria-hidden />
      )}
    </motion.div>
  )
}

/** One-page yes/no opened from the SMS link. Rendered inside the phone frame. */
export function ConfirmPage() {
  const [session, dispatch] = useSession()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const state = session.authorization
  const vehicle = session.vin ? findVehicle(session.vin) : undefined
  const at = () => new Date().toISOString()

  const approve = () =>
    dispatch({ type: "approve", authorizationCode: generateAuthorizationCode(), at: at() })
  const decline = () => dispatch({ type: "deny", at: at() })

  const active =
    vehicle &&
    (state.status === "pending" || state.status === "authorized" || state.status === "frozen")

  return (
    <div
      role="region"
      aria-label="Owner confirmation page"
      className="flex h-full w-full flex-col bg-[#f7f7f8] text-neutral-900"
    >
      <StatusBar />
      {/* Browser-ish address bar */}
      <div className="flex items-center gap-2 px-3 pb-2">
        <button
          type="button"
          onClick={() => navigate("/phone")}
          className="flex size-8 items-center justify-center rounded-full text-[#0a84ff]"
          aria-label="Back"
        >
          <ChevronLeft className="size-6" strokeWidth={2.25} aria-hidden />
        </button>
        <div className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-white text-[13px] text-neutral-700 ring-1 ring-black/10">
          <Lock className="size-3" aria-hidden />
          {active ? smsLink(state.otp) : "ovil.on.ca"}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <header className="flex items-center gap-2 border-b border-black/10 bg-white px-5 py-3">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-[11px] font-bold tracking-wide text-primary-foreground">
            OV
          </span>
          <span className="text-sm font-semibold tracking-wide">OVIL</span>
          <span className="ml-auto text-xs text-neutral-500">Owner authorization</span>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          {!active ? (
            <motion.section key="expired" className="flex flex-col gap-3 p-5">
              <h1 className="text-xl font-semibold tracking-tight">
                This link is no longer active
              </h1>
              <p className="text-[15px] text-neutral-600">
                The request it pointed to has expired or was already answered.
              </p>
            </motion.section>
          ) : state.status === "pending" ? (
            <motion.section
              key="ask"
              className="flex flex-col gap-5 p-5"
              exit={
                reduceMotion ? undefined : { opacity: 0, y: -8, transition: { duration: 0.15 } }
              }
            >
              <div className="flex flex-col gap-1.5">
                <h1 className="text-xl font-semibold tracking-tight">
                  Approve a Used Vehicle Information Package?
                </h1>
                <p className="text-[15px] text-neutral-600">
                  Someone is asking for the UVIP for a vehicle registered to you. Only approve if
                  you are selling it.
                </p>
              </div>

              <dl className="divide-y divide-black/10 rounded-2xl bg-white px-4 ring-1 ring-black/10">
                <Row
                  label="Vehicle"
                  value={<span className="font-medium">{vehicleTitle(vehicle)}</span>}
                />
                <Row
                  label="Plate"
                  value={<span className="font-mono tracking-wider">{vehicle.plate}</span>}
                />
                <Row
                  label="Requested by"
                  value={
                    state.origin === "buyer"
                      ? `${state.requester} · online via ServiceOntario`
                      : `${state.requester} · in person at ${OFFICE.name}`
                  }
                />
                <Row label="Requested" value={`Today at ${formatTime(state.sentAt)}`} />
                <Row
                  label="Expires"
                  value={`${formatDate(state.expiresAt.slice(0, 10))} at ${formatTime(state.expiresAt)}`}
                />
              </dl>

              <div className="mt-1 flex flex-col gap-2.5">
                <Button size="lg" className="h-12 rounded-xl text-[15px]" onClick={approve}>
                  Approve
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl bg-white text-[15px]"
                  onClick={decline}
                >
                  Decline
                </Button>
              </div>
              <p className="text-center text-xs text-neutral-500">
                Your response is recorded with the Ontario Vehicle Identity Ledger.
              </p>
            </motion.section>
          ) : (
            <motion.section
              key={`result-${state.status}`}
              className="flex flex-col items-center gap-4 px-5 pt-10 text-center"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ResultIcon ok={state.status === "authorized"} />
              {state.status === "authorized" ? (
                <>
                  <h1 className="text-xl font-semibold tracking-tight">Authorization recorded</h1>
                  <p className="text-[15px] text-neutral-600">
                    The UVIP for your {vehicleTitle(vehicle)} can now be issued. This authorization
                    is valid until {formatDate(state.validUntil.slice(0, 10))}.
                  </p>
                  <div className="mt-1 flex flex-col items-center gap-0.5 rounded-2xl bg-white px-6 py-3 ring-1 ring-black/10">
                    <span className="text-xs text-neutral-500">Reference</span>
                    <span className="font-mono text-lg tracking-wider">
                      {state.authorizationCode}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-xl font-semibold tracking-tight">Request declined</h1>
                  <p className="text-[15px] text-neutral-600">
                    No package will be issued for your {vehicleTitle(vehicle)}. The transaction has
                    been flagged for security review.
                  </p>
                </>
              )}
              <Button
                variant="ghost"
                className="mt-2 text-[#0a84ff]"
                onClick={() => navigate("/phone")}
              >
                Back to Messages
              </Button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
