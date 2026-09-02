export type AuthorizationState =
  | { status: "idle" }
  | { status: "blocked" }
  | { status: "pending"; otp: string; sentAt: string; expiresAt: string }
  | {
      status: "authorized"
      otp: string
      sentAt: string
      authorizationCode: string
      approvedAt: string
    }
  | { status: "frozen"; reason: "denied" | "timeout"; frozenAt: string }
  | { status: "escalated"; caseReference: string; escalatedAt: string }

export type AuthorizationAction =
  | { type: "request"; otp: string; at: string }
  | { type: "approve"; authorizationCode: string; at: string }
  | { type: "deny"; at: string }
  | { type: "timeout"; at: string }
  | { type: "escalate"; caseReference: string; at: string }
  | { type: "reset"; canRequest: boolean }

export const AUTHORIZATION_WINDOW_MS = 24 * 60 * 60 * 1000

export function initialState(canRequest: boolean): AuthorizationState {
  return canRequest ? { status: "idle" } : { status: "blocked" }
}

export function authorizationReducer(
  state: AuthorizationState,
  action: AuthorizationAction
): AuthorizationState {
  switch (action.type) {
    case "request": {
      if (state.status !== "idle") return state
      const sent = new Date(action.at)
      return {
        status: "pending",
        otp: action.otp,
        sentAt: action.at,
        expiresAt: new Date(sent.getTime() + AUTHORIZATION_WINDOW_MS).toISOString(),
      }
    }
    case "approve": {
      if (state.status !== "pending") return state
      return {
        status: "authorized",
        otp: state.otp,
        sentAt: state.sentAt,
        authorizationCode: action.authorizationCode,
        approvedAt: action.at,
      }
    }
    case "deny": {
      if (state.status !== "pending") return state
      return { status: "frozen", reason: "denied", frozenAt: action.at }
    }
    case "timeout": {
      if (state.status !== "pending") return state
      return { status: "frozen", reason: "timeout", frozenAt: action.at }
    }
    case "escalate": {
      if (state.status !== "blocked") return state
      return {
        status: "escalated",
        caseReference: action.caseReference,
        escalatedAt: action.at,
      }
    }
    case "reset":
      return initialState(action.canRequest)
  }
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

function pick(alphabet: string, length: number, random: () => number): string {
  let out = ""
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(random() * alphabet.length)]
  }
  return out
}

export function generateOtp(random: () => number = Math.random): string {
  const digits = pick("0123456789", 6, random)
  return `${digits.slice(0, 3)} ${digits.slice(3)}`
}

export function generateAuthorizationCode(
  random: () => number = Math.random
): string {
  return `OV-${pick(CODE_ALPHABET, 4, random)}-${pick(CODE_ALPHABET, 4, random)}`
}

export function generateCaseReference(
  date: Date,
  random: () => number = Math.random
): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  const seq = String(Math.floor(random() * 10000)).padStart(4, "0")
  return `OVIL-${yyyy}-${mm}-${dd}-${seq}`
}
