import { describe, expect, it } from "vitest"

import { allPass, evaluateChecks, failingChecks } from "./checks"
import { CLEAN_VIN, CLONED_VIN, findVehicle, type Vehicle } from "./vehicles"

const clean = findVehicle(CLEAN_VIN)!
const cloned = findVehicle(CLONED_VIN)!

describe("evaluateChecks", () => {
  it("returns six checks in a fixed order", () => {
    expect(evaluateChecks(clean).map((c) => c.id)).toEqual([
      "stolen",
      "writeOff",
      "collision",
      "odometer",
      "duplicate",
      "lien",
    ])
  })

  it("passes everything for the clean vehicle", () => {
    const checks = evaluateChecks(clean)
    expect(checks.every((c) => c.status === "pass")).toBe(true)
    expect(allPass(checks)).toBe(true)
    expect(failingChecks(checks)).toEqual([])
  })

  it("fails write-off, collision and duplicate for the cloned vehicle", () => {
    const checks = evaluateChecks(cloned)
    expect(failingChecks(checks).map((c) => c.id)).toEqual(["writeOff", "collision", "duplicate"])
    expect(allPass(checks)).toBe(false)
  })

  it("includes the insurer and date in the write-off detail", () => {
    const writeOff = evaluateChecks(cloned).find((c) => c.id === "writeOff")!
    expect(writeOff.detail).toContain("Aviva Canada")
    expect(writeOff.detail).toContain("June 14, 2025")
  })

  it("fails odometer consistency when a later reading is lower", () => {
    const rolledBack: Vehicle = {
      ...clean,
      records: {
        ...clean.records,
        odometerReadings: [
          { date: "2023-04-18", km: 42, source: "Dealer delivery" },
          { date: "2024-05-02", km: 54000, source: "Service record" },
          { date: "2025-04-11", km: 31240, source: "Registration renewal" },
        ],
      },
    }
    const odometer = evaluateChecks(rolledBack).find((c) => c.id === "odometer")!
    expect(odometer.status).toBe("fail")
    expect(odometer.detail).toContain("54 000 km")
    expect(odometer.detail).toContain("31 240 km")
  })
})
