import { generateAuthorizationCode } from "@/lib/authorization"
import { useSession } from "@/lib/session"

/** Owner-side actions, dispatched to the shared session. Used by the hidden panel and the hub. */
export function useOwnerActions() {
  const [session, dispatch] = useSession()
  const now = () => new Date().toISOString()
  return {
    session,
    pending: session.authorization.status === "pending",
    approve: () =>
      dispatch({ type: "approve", authorizationCode: generateAuthorizationCode(), at: now() }),
    deny: () => dispatch({ type: "deny", at: now() }),
    timeout: () => dispatch({ type: "timeout", at: now() }),
    reset: () => dispatch({ type: "clear" }),
  }
}
