import { describe, expect, it } from "vitest"

import { FORCE_STATES, forcedSession } from "./forceStates"
import { activeAuthorization, EMPTY_SESSION, sessionReducer } from "./session"
import { CLEAN_VIN, CLONED_VIN, findVehicle } from "./vehicles"

const NOW = new Date("2026-09-09T14:00:00.000Z")

describe("forcedSession", () => {
  it("produces a session for every listed control", () => {
    for (const { key } of FORCE_STATES) {
      const s = forcedSession(key, NOW)
      if (key === "idle") {
        expect(s).toEqual(EMPTY_SESSION)
        continue
      }
      const active = activeAuthorization(s)
      expect(active, key).not.toBeNull()
      expect(findVehicle(active!.vin), key).toBeDefined()
    }
  })

  it("points the clean states at the clean vehicle and the failures at the cloned one", () => {
    expect(forcedSession("authorized", NOW).activeVin).toBe(CLEAN_VIN)
    expect(forcedSession("blocked", NOW).activeVin).toBe(CLONED_VIN)
    expect(forcedSession("escalated", NOW).activeVin).toBe(CLONED_VIN)
  })

  it("distinguishes the two pending origins and carries a link", () => {
    expect(activeAuthorization(forcedSession("pending", NOW))?.state).toMatchObject({
      origin: "clerk",
      link: expect.stringMatching(/^[a-z2-9]{16}$/),
    })
    expect(activeAuthorization(forcedSession("pendingBuyer", NOW))?.state).toMatchObject({
      origin: "buyer",
    })
  })

  it("marks the issued state with a package number", () => {
    expect(activeAuthorization(forcedSession("issued", NOW))?.state).toMatchObject({
      status: "authorized",
      issued: { packageNumber: "UVIP-2026-09-09-4821" },
    })
  })
})

describe("force action", () => {
  it("replaces whatever the session is doing", () => {
    const pending = forcedSession("pending", NOW)
    const next = sessionReducer(pending, { type: "force", session: forcedSession("issued", NOW) })
    expect(activeAuthorization(next)?.state).toMatchObject({ status: "authorized" })
  })
})
