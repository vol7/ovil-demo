import { formatDate, formatOdometer } from "./format"
import type { OdometerReading, Vehicle } from "./vehicles"

export type CheckId = "stolen" | "writeOff" | "collision" | "odometer" | "duplicate" | "lien"

export type CheckStatus = "pass" | "fail"

export type Check = {
  id: CheckId
  label: string
  status: CheckStatus
  detail: string
  source: string
}

const LABELS: Record<CheckId, string> = {
  stolen: "Stolen vehicle report",
  writeOff: "Insurer write-off",
  collision: "Collision record",
  odometer: "Odometer consistency",
  duplicate: "Duplicate identity",
  lien: "Active lien",
}

export const SOURCES: Record<CheckId, string> = {
  stolen: "CPIC · Canadian Police Information Centre",
  writeOff: "Insurance Bureau of Canada",
  collision: "Ontario collision reporting",
  odometer: "MTO registration history",
  duplicate: "MTO vehicle registry",
  lien: "Ontario PPSR",
}

function check(id: CheckId, status: CheckStatus, detail: string): Check {
  return { id, label: LABELS[id], status, detail, source: SOURCES[id] }
}

function odometerCheck(readings: OdometerReading[]): Check {
  const sorted = [...readings].sort((a, b) => a.date.localeCompare(b.date))
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]
    const curr = sorted[i]
    if (curr.km < prev.km) {
      return check(
        "odometer",
        "fail",
        `Rollback: ${formatOdometer(prev.km)} on ${formatDate(prev.date)}, then ${formatOdometer(curr.km)} on ${formatDate(curr.date)}`
      )
    }
  }
  const last = sorted[sorted.length - 1]
  return check(
    "odometer",
    "pass",
    `${sorted.length} readings, consistent · last ${formatOdometer(last.km)} on ${formatDate(last.date)}`
  )
}

export function evaluateChecks(vehicle: Vehicle): Check[] {
  const r = vehicle.records
  return [
    r.stolenReport
      ? check(
          "stolen",
          "fail",
          `Reported stolen ${formatDate(r.stolenReport.reportedOn)} · ${r.stolenReport.agency}`
        )
      : check("stolen", "pass", "No active report on CPIC"),
    r.writeOff
      ? check(
          "writeOff",
          "fail",
          `${r.writeOff.reason} · ${r.writeOff.insurer}, ${formatDate(r.writeOff.declaredOn)}`
        )
      : check("writeOff", "pass", "No total-loss declaration on file"),
    r.collision
      ? check(
          "collision",
          "fail",
          `${r.collision.severity} · ${r.collision.location}, ${formatDate(r.collision.occurredOn)}`
        )
      : check("collision", "pass", "No collision reported"),
    odometerCheck(r.odometerReadings),
    r.duplicateIdentity
      ? check("duplicate", "fail", r.duplicateIdentity.detail)
      : check("duplicate", "pass", "VIN and plate match a single registration"),
    r.lien
      ? check("lien", "fail", `${r.lien.holder} · registered ${formatDate(r.lien.registeredOn)}`)
      : check("lien", "pass", "No lien registered"),
  ]
}

export function allPass(checks: Check[]): boolean {
  return checks.every((c) => c.status === "pass")
}

export function failingChecks(checks: Check[]): Check[] {
  return checks.filter((c) => c.status === "fail")
}
