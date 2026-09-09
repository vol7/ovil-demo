import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { allPass, evaluateChecks } from "@/lib/checks"
import { isValidVin, normalizeVin } from "@/lib/format"
import { findVehicle, vehicleTitle, type Vehicle } from "@/lib/vehicles"

const INVALID = "Enter the 17-character VIN (letters I, O and Q are not used)."
const NOT_FOUND = "We could not find an Ontario registration for this VIN."
const NOT_ELIGIBLE =
  "This vehicle cannot be pre-approved online. Please visit a ServiceOntario centre."

export function VinStep({
  onFound,
  cta = "Continue",
}: {
  onFound: (vehicle: Vehicle) => void
  cta?: string
}) {
  const [vin, setVin] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [found, setFound] = useState<Vehicle | null>(null)

  function lookup(event: React.FormEvent) {
    event.preventDefault()
    if (!isValidVin(vin)) return setError(INVALID)
    const vehicle = findVehicle(normalizeVin(vin))
    if (!vehicle) return setError(NOT_FOUND)
    if (!allPass(evaluateChecks(vehicle))) return setError(NOT_ELIGIBLE)
    setError(null)
    setFound(vehicle)
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={found ? (e) => (e.preventDefault(), onFound(found)) : lookup}
      noValidate
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="uvip-vin">Vehicle Identification Number (VIN)</Label>
        <Input
          id="uvip-vin"
          className="h-11 font-mono text-base tracking-wider uppercase placeholder:font-sans placeholder:tracking-normal placeholder:normal-case md:text-base"
          maxLength={17}
          autoComplete="off"
          spellCheck={false}
          placeholder="17 characters"
          value={vin}
          aria-invalid={error ? true : undefined}
          aria-describedby="uvip-vin-hint"
          onChange={(e) => {
            setVin(e.target.value.toUpperCase())
            setError(null)
            setFound(null)
          }}
        />
        <p
          id="uvip-vin-hint"
          className={`text-sm ${error ? "text-destructive" : "text-muted-foreground"}`}
        >
          {error ??
            "Found on your vehicle permit (green ownership), the driver-side dashboard, or the door jamb."}
        </p>
      </div>

      {found ? (
        <div role="status" className="flex flex-col gap-1 rounded-lg border bg-muted/40 p-4">
          <span className="text-xs text-muted-foreground">We found this vehicle</span>
          <span className="text-base font-medium">{vehicleTitle(found)}</span>
          <span className="text-sm text-muted-foreground">
            {found.colour} · Ontario plate{" "}
            <span className="font-mono tracking-wider text-foreground">{found.plate}</span>
          </span>
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" size="lg" className="h-11 px-5">
          {found ? cta : "Find vehicle"}
        </Button>
      </div>
    </form>
  )
}
