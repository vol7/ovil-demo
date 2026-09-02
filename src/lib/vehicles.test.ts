import { describe, expect, it } from "vitest"

import { isValidVin } from "./format"
import {
  CLEAN_VIN,
  CLONED_VIN,
  DEMO_VEHICLES,
  findVehicle,
  vehicleTitle,
} from "./vehicles"

describe("DEMO_VEHICLES", () => {
  it("contains two vehicles with valid, unique VINs", () => {
    expect(DEMO_VEHICLES).toHaveLength(2)
    const vins = DEMO_VEHICLES.map((v) => v.vin)
    expect(new Set(vins).size).toBe(2)
    for (const vin of vins) expect(isValidVin(vin)).toBe(true)
  })

  it("has a clean Mercedes and a cloned Highlander", () => {
    const clean = findVehicle(CLEAN_VIN)!
    const cloned = findVehicle(CLONED_VIN)!
    expect(clean.make).toBe("Mercedes-AMG")
    expect(Object.values(clean.records).filter((r) => r === null)).toHaveLength(5)
    expect(cloned.model).toBe("Highlander")
    expect(cloned.records.writeOff).not.toBeNull()
    expect(cloned.records.collision).not.toBeNull()
    expect(cloned.records.duplicateIdentity).not.toBeNull()
    expect(cloned.records.stolenReport).toBeNull()
    expect(cloned.records.lien).toBeNull()
  })
})

describe("findVehicle", () => {
  it("is case- and whitespace-insensitive", () => {
    expect(findVehicle(" 4jgfb8kb5pa812634 ")?.vin).toBe(CLEAN_VIN)
  })
  it("returns undefined for unknown VINs", () => {
    expect(findVehicle("1HGCM82633A004352")).toBeUndefined()
  })
})

describe("vehicleTitle", () => {
  it("joins year, make, model and trim", () => {
    expect(vehicleTitle(findVehicle(CLEAN_VIN)!)).toBe(
      "2023 Mercedes-AMG GLE 63 S 4MATIC+"
    )
  })
})
