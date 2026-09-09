import type { AuthorizationState } from "./authorization"

export type ActivityEvent = {
  id: string
  at: string
  title: string
  detail?: string
  tone: "neutral" | "info" | "success" | "warning" | "danger"
}

/** Timeline derived from the timestamps present in the authorization state. */
export function deriveActivity(
  state: AuthorizationState,
  openedAt: string | null,
  clerk: string
): ActivityEvent[] {
  const events: ActivityEvent[] = []
  if (openedAt) {
    events.push({
      id: "lookup",
      at: openedAt,
      title: "Record retrieved",
      detail: `Lookup by ${clerk}`,
      tone: "neutral",
    })
  }
  switch (state.status) {
    case "idle":
      break
    case "blocked":
      if (openedAt) {
        events.push({
          id: "blocked",
          at: openedAt,
          title: "Transaction blocked",
          detail: "Record checks returned conflicts",
          tone: "danger",
        })
      }
      break
    case "escalated":
      if (openedAt) {
        events.push({
          id: "blocked",
          at: openedAt,
          title: "Transaction blocked",
          detail: "Record checks returned conflicts",
          tone: "danger",
        })
      }
      events.push({
        id: "escalated",
        at: state.escalatedAt,
        title: "Escalated for review",
        detail: `Case ${state.caseReference}`,
        tone: "danger",
      })
      break
    case "pending":
      events.push(sentEvent(state))
      break
    case "authorized":
      if (state.origin === "owner") {
        events.push({
          id: "preapproved",
          at: state.approvedAt,
          title: "Pre-approved by registered owner",
          detail: `Online via ServiceOntario · Reference ${state.authorizationCode}`,
          tone: "success",
        })
        break
      }
      events.push(sentEvent(state), {
        id: "approved",
        at: state.approvedAt,
        title: "Owner approved",
        detail: `Reference ${state.authorizationCode}`,
        tone: "success",
      })
      break
    case "frozen":
      events.push(sentEvent(state), {
        id: "frozen",
        at: state.frozenAt,
        title: state.reason === "denied" ? "Owner denied" : "No response within 24h",
        detail: "Transaction frozen and flagged for security review",
        tone: "warning",
      })
      break
  }
  return events.sort((a, b) => a.at.localeCompare(b.at))
}

function sentEvent(state: {
  origin: "clerk" | "owner" | "buyer"
  requester: string
  sentAt: string
}): ActivityEvent {
  return state.origin === "buyer"
    ? {
        id: "sent",
        at: state.sentAt,
        title: "Pre-approval requested online",
        detail: `By ${state.requester} · owner texted`,
        tone: "info",
      }
    : {
        id: "sent",
        at: state.sentAt,
        title: "Authorization requested",
        detail: "Confirmation link sent to registered owner",
        tone: "info",
      }
}
