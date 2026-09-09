import type { AuthorizationState } from "./authorization"
import { activeAuthorization, type SessionState } from "./session"
import { findVehicle, type Vehicle } from "./vehicles"

export type Texted = Extract<AuthorizationState, { status: "pending" | "authorized" | "frozen" }>

/** The request the owner was texted about, if there is one. Pre-approvals send no SMS. */
export function liveThread(session: SessionState): { vehicle: Vehicle; state: Texted } | null {
  const active = activeAuthorization(session)
  if (!active) return null
  const { state } = active
  if (state.status !== "pending" && state.status !== "authorized" && state.status !== "frozen") {
    return null
  }
  if (state.origin === "owner") return null
  const vehicle = findVehicle(active.vin)
  return vehicle ? { vehicle, state } : null
}
