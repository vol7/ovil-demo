import { describe, expect, it } from "vitest"

import { deriveActivity } from "./activity"

const T0 = "2026-09-04T18:10:00.000Z"
const T1 = "2026-09-04T18:14:00.000Z"
const T2 = "2026-09-04T18:16:30.000Z"

describe("deriveActivity", () => {
  it("is empty when nothing is open", () => {
    expect(deriveActivity({ status: "idle" }, null, "M. Chen")).toEqual([])
  })

  it("has only the lookup when idle", () => {
    const events = deriveActivity({ status: "idle" }, T0, "M. Chen")
    expect(events.map((e) => e.id)).toEqual(["lookup"])
    expect(events[0].detail).toBe("Lookup by M. Chen")
  })

  it("lists lookup, request and approval in order", () => {
    const events = deriveActivity(
      {
        status: "authorized",
        origin: "clerk",
        requester: "Fawaz A.",
        otp: "1",
        sentAt: T1,
        authorizationCode: "OV-AAAA-BBBB",
        approvedAt: T2,
        validUntil: T2,
      },
      T0,
      "M. Chen"
    )
    expect(events.map((e) => e.id)).toEqual(["lookup", "sent", "approved"])
    expect(events[2].detail).toContain("OV-AAAA-BBBB")
  })

  it("describes a denial as a warning", () => {
    const events = deriveActivity(
      {
        status: "frozen",
        origin: "clerk",
        requester: "Fawaz A.",
        reason: "denied",
        otp: "1",
        sentAt: T1,
        frozenAt: T2,
      },
      T0,
      "M. Chen"
    )
    expect(events.at(-1)).toMatchObject({ id: "frozen", title: "Owner denied", tone: "warning" })
  })

  it("shows a single pre-approval event for an owner-origin authorization", () => {
    const events = deriveActivity(
      {
        status: "authorized",
        origin: "owner",
        requester: "Daniel Okafor",
        otp: "",
        sentAt: T0,
        authorizationCode: "OV-AAAA-BBBB",
        approvedAt: T0,
        validUntil: T2,
      },
      T1,
      "M. Chen"
    )
    expect(events.map((e) => e.id)).toEqual(["preapproved", "lookup"])
  })

  it("names the buyer for a buyer-origin request", () => {
    const events = deriveActivity(
      {
        status: "pending",
        origin: "buyer",
        requester: "Fawaz Ahmed",
        otp: "1",
        sentAt: T0,
        expiresAt: T2,
      },
      T1,
      "M. Chen"
    )
    expect(events[0]).toMatchObject({ id: "sent", title: "Pre-approval requested online" })
    expect(events[0].detail).toContain("Fawaz Ahmed")
  })

  it("lists blocked then escalated for a cloned vehicle", () => {
    const events = deriveActivity(
      { status: "escalated", caseReference: "OVIL-2026-09-04-0001", escalatedAt: T2 },
      T0,
      "M. Chen"
    )
    expect(events.map((e) => e.id)).toEqual(["lookup", "blocked", "escalated"])
  })
})
