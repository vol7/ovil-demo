import { generateAuthorizationCode } from "@/lib/authorization"
import { activeAuthorization, useSession } from "@/lib/session"

/** Owner-side actions against the active request. Used by the hidden panel and the hub. */
export function useOwnerActions() {
  const [session, dispatch] = useSession()
  const active = activeAuthorization(session)
  const vin = active?.vin
  const now = () => new Date().toISOString()
  return {
    session,
    active,
    pending: active?.state.status === "pending",
    approve: () =>
      vin &&
      dispatch({
        type: "approve",
        vin,
        authorizationCode: generateAuthorizationCode(),
        at: now(),
      }),
    deny: () => vin && dispatch({ type: "deny", vin, at: now() }),
    timeout: () => vin && dispatch({ type: "timeout", vin, at: now() }),
    reset: () => dispatch({ type: "clear" }),
  }
}
