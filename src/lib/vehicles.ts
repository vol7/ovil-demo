import { normalizeVin } from "./format"

export type OdometerReading = { date: string; km: number; source: string }

export type VehicleRecords = {
  stolenReport: { reportedOn: string; agency: string } | null
  writeOff: { insurer: string; declaredOn: string; reason: string } | null
  collision: { occurredOn: string; location: string; severity: string } | null
  odometerReadings: OdometerReading[]
  duplicateIdentity: { detail: string } | null
  lien: { holder: string; registeredOn: string } | null
}

export type Vehicle = {
  vin: string
  year: number
  make: string
  model: string
  trim: string
  colour: string
  bodyStyle: string
  plate: string
  registeredOn: string
  odometerKm: number
  owner: { name: string; phoneLast4: string; city: string }
  lastInspection: string
  riskTier: "high-value" | "standard"
  records: VehicleRecords
}

export const CLEAN_VIN = "4JGFB8KB5PA812634"
export const CLONED_VIN = "5TDEBRCH7SS041927"

export const DEMO_VEHICLES: Vehicle[] = [
  {
    vin: CLEAN_VIN,
    year: 2023,
    make: "Mercedes-AMG",
    model: "GLE 63 S",
    trim: "4MATIC+",
    colour: "Obsidian Black",
    bodyStyle: "SUV",
    plate: "CKXR 214",
    registeredOn: "2023-04-18",
    odometerKm: 31240,
    owner: { name: "Daniel Okafor", phoneLast4: "0917", city: "Toronto, ON" },
    lastInspection: "2025-04-11",
    riskTier: "high-value",
    records: {
      stolenReport: null,
      writeOff: null,
      collision: null,
      odometerReadings: [
        { date: "2023-04-18", km: 42, source: "Dealer delivery" },
        { date: "2024-05-02", km: 14880, source: "Service record" },
        { date: "2025-04-11", km: 31240, source: "Registration renewal" },
      ],
      duplicateIdentity: null,
      lien: null,
    },
  },
  {
    vin: CLONED_VIN,
    year: 2025,
    make: "Toyota",
    model: "Highlander",
    trim: "Platinum",
    colour: "Wind Chill Pearl",
    bodyStyle: "SUV",
    plate: "BWTP 903",
    registeredOn: "2025-02-03",
    odometerKm: 8410,
    owner: { name: "Priya Raghunathan", phoneLast4: "5528", city: "Whitby, ON" },
    lastInspection: "2025-08-20",
    riskTier: "high-value",
    records: {
      stolenReport: null,
      writeOff: {
        insurer: "Aviva Canada",
        declaredOn: "2025-06-14",
        reason: "Total loss following collision",
      },
      collision: {
        occurredOn: "2025-06-12",
        location: "Hwy 401 near Whitby, ON",
        severity: "Severe — airbag deployment",
      },
      odometerReadings: [
        { date: "2025-02-03", km: 12, source: "Dealer delivery" },
        { date: "2025-06-12", km: 6200, source: "Collision report" },
        { date: "2025-08-20", km: 8410, source: "Registration" },
      ],
      duplicateIdentity: {
        detail: "Same VIN active on Ontario plate CRHM 118 since August 20, 2025",
      },
      lien: null,
    },
  },
]

export function findVehicle(vin: string): Vehicle | undefined {
  const needle = normalizeVin(vin)
  return DEMO_VEHICLES.find((v) => v.vin === needle)
}

export function vehicleTitle(vehicle: Vehicle): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`
}
