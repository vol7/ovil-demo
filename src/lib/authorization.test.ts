import { describe, expect, it } from "vitest"

import {
  AUTHORIZATION_WINDOW_MS,
  authorizationReducer,
  generateAuthorizationCode,
  generateCaseReference,
  generateOtp,
  initialState,
  type AuthorizationState,
} from "./authorization"

const T0 = "2026-09-02T18:14:00.000Z"
const T1 = "2026-09-02T18:16:30.000Z"

function pending(): AuthorizationState {
  return authorizationReducer(initialState(true), {
    type: "request",
    otp: "482 193",
    at: T0,
  })
}

describe("initialState", () => {
  it("is idle when a request is allowed", () => {
    expect(initialState(true)).toEqual({ status: "idle" })
  })
  it("is blocked when a request is not allowed", () => {
    expect(initialState(false)).toEqual({ status: "blocked" })
  })
})

describe("authorizationReducer", () => {
  it("request moves idle to pending with a 24h expiry", () => {
    const state = pending()
    expect(state).toMatchObject({ status: "pending", otp: "482 193", sentAt: T0 })
    if (state.status !== "pending") throw new Error("expected pending")
    expect(new Date(state.expiresAt).getTime() - new Date(T0).getTime()).toBe(
      AUTHORIZATION_WINDOW_MS
    )
  })

  it("approve moves pending to authorized", () => {
    const state = authorizationReducer(pending(), {
      type: "approve",
      authorizationCode: "OV-7K2M-9Q3F",
      at: T1,
    })
    expect(state).toEqual({
      status: "authorized",
      otp: "482 193",
      sentAt: T0,
      authorizationCode: "OV-7K2M-9Q3F",
      approvedAt: T1,
    })
  })

  it("deny moves pending to frozen (denied)", () => {
    expect(authorizationReducer(pending(), { type: "deny", at: T1 })).toEqual({
      status: "frozen",
      reason: "denied",
      frozenAt: T1,
    })
  })

  it("timeout moves pending to frozen (timeout)", () => {
    expect(authorizationReducer(pending(), { type: "timeout", at: T1 })).toEqual({
      status: "frozen",
      reason: "timeout",
      frozenAt: T1,
    })
  })

  it("escalate moves blocked to escalated", () => {
    const state = authorizationReducer(initialState(false), {
      type: "escalate",
      caseReference: "OVIL-2026-09-02-0417",
      at: T1,
    })
    expect(state).toEqual({
      status: "escalated",
      caseReference: "OVIL-2026-09-02-0417",
      escalatedAt: T1,
    })
  })

  it("reset returns to the initial state for the given permission", () => {
    expect(authorizationReducer(pending(), { type: "reset", canRequest: true })).toEqual({
      status: "idle",
    })
    expect(authorizationReducer(pending(), { type: "reset", canRequest: false })).toEqual({
      status: "blocked",
    })
  })

  it("ignores invalid transitions and returns the same state object", () => {
    const blocked = initialState(false)
    expect(authorizationReducer(blocked, { type: "request", otp: "000 000", at: T0 })).toBe(blocked)
    const idle = initialState(true)
    expect(authorizationReducer(idle, { type: "approve", authorizationCode: "x", at: T0 })).toBe(
      idle
    )
    expect(authorizationReducer(idle, { type: "escalate", caseReference: "x", at: T0 })).toBe(idle)
    const authorized = authorizationReducer(pending(), {
      type: "approve",
      authorizationCode: "OV-AAAA-BBBB",
      at: T1,
    })
    expect(authorizationReducer(authorized, { type: "deny", at: T1 })).toBe(authorized)
  })
})

describe("code generators", () => {
  it("generateOtp yields six digits grouped in threes", () => {
    expect(generateOtp()).toMatch(/^\d{3} \d{3}$/)
    expect(generateOtp(() => 0.5)).toBe("555 555")
  })
  it("generateAuthorizationCode yields OV-XXXX-XXXX without ambiguous characters", () => {
    const code = generateAuthorizationCode()
    expect(code).toMatch(/^OV-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/)
  })
  it("generateCaseReference embeds the date and a 4-digit sequence", () => {
    expect(generateCaseReference(new Date(2026, 8, 2), () => 0.0417)).toBe("OVIL-2026-09-02-0417")
  })
})
