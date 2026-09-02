import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import type { AuthorizationState } from "@/lib/authorization"
import { OFFICE } from "@/lib/office"
import { vehicleTitle, type Vehicle } from "@/lib/vehicles"

type Props = {
  vehicle: Vehicle
  state: AuthorizationState
  onApprove: () => void
  onDeny: () => void
}

function Bubble({ from, children }: { from: "ovil" | "owner"; children: React.ReactNode }) {
  const owner = from === "owner"
  return (
    <div className={`flex ${owner ? "justify-end" : "justify-start"}`}>
      <div
        className={
          owner
            ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
            : "max-w-[85%] rounded-2xl rounded-bl-sm bg-neutral-200 px-3 py-2 text-sm text-neutral-900"
        }
      >
        {children}
      </div>
    </div>
  )
}

export function PhoneMock({ vehicle, state, onApprove, onDeny }: Props) {
  const reduceMotion = useReducedMotion()
  const visible =
    state.status === "pending" || state.status === "authorized" || state.status === "frozen"
  const otp = state.status === "pending" || state.status === "authorized" ? state.otp : null

  return (
    <AnimatePresence>
      {visible ? (
        <motion.aside
          aria-label="Registered owner's phone"
          className="w-[300px] shrink-0"
          initial={reduceMotion ? false : { opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, x: 32 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="rounded-[2.25rem] border-8 border-neutral-900 bg-white shadow-xl">
            <div className="flex flex-col gap-3 px-4 pt-8 pb-6">
              <div className="text-center">
                <div className="text-xs font-medium text-neutral-500">Messages</div>
                <div className="text-sm font-semibold text-neutral-900">OVIL</div>
              </div>

              <div className="flex flex-col gap-2">
                <Bubble from="ovil">
                  OVIL: A used vehicle package was requested for your {vehicleTitle(vehicle)} (plate{" "}
                  {vehicle.plate}) at {OFFICE.name}. Approve with code{" "}
                  <span className="font-semibold tabular-nums">{otp ?? "••• •••"}</span> or deny.
                  Expires in 24 hours.
                </Bubble>

                {state.status === "authorized" ? (
                  <>
                    <Bubble from="owner">YES {state.otp}</Bubble>
                    <Bubble from="ovil">Thanks — your authorization has been recorded.</Bubble>
                  </>
                ) : null}

                {state.status === "frozen" && state.reason === "denied" ? (
                  <>
                    <Bubble from="owner">NO</Bubble>
                    <Bubble from="ovil">
                      Understood. The transaction has been frozen and flagged for review.
                    </Bubble>
                  </>
                ) : null}

                {state.status === "frozen" && state.reason === "timeout" ? (
                  <div className="text-center text-xs text-neutral-500">
                    Request expired — no response within 24 hours.
                  </div>
                ) : null}
              </div>

              {state.status === "pending" ? (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={onDeny}>
                    Deny
                  </Button>
                  <Button onClick={onApprove}>Approve</Button>
                </div>
              ) : null}
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
