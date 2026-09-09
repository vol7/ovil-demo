import { Search } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { isValidVin, normalizeVin } from "@/lib/format"
import { findVehicle } from "@/lib/vehicles"
import { cn } from "@/lib/utils"

export const INVALID_MESSAGE = "Enter a 17-character VIN (letters I, O and Q are not used)."
export const NOT_FOUND_MESSAGE = "No record found for this VIN."

export function LookupForm({ size = "default" }: { size?: "default" | "lg" }) {
  const navigate = useNavigate()
  const [vin, setVin] = useState("")
  const [error, setError] = useState<string | null>(null)
  const large = size === "lg"

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!isValidVin(vin)) {
      setError(INVALID_MESSAGE)
      return
    }
    const normalized = normalizeVin(vin)
    if (!findVehicle(normalized)) {
      setError(NOT_FOUND_MESSAGE)
      return
    }
    navigate(`/vehicle/${normalized}`)
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={submit} noValidate>
      <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
      <div className="flex gap-2">
        <Input
          id="vin"
          className={cn(
            "font-mono tracking-wider uppercase placeholder:font-sans placeholder:tracking-normal placeholder:normal-case",
            large && "h-11 text-base md:text-base"
          )}
          maxLength={17}
          autoComplete="off"
          spellCheck={false}
          placeholder="17 characters"
          value={vin}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "vin-error" : "vin-hint"}
          onChange={(e) => {
            setVin(e.target.value.toUpperCase())
            setError(null)
          }}
        />
        <Button
          type="submit"
          size={large ? "lg" : "default"}
          className={large ? "h-11 px-4" : undefined}
        >
          <Search data-icon="inline-start" aria-hidden />
          Look up
        </Button>
      </div>
      {error ? (
        <p id="vin-error" className="text-sm text-destructive">
          {error}
        </p>
      ) : (
        <p id="vin-hint" className="text-sm text-muted-foreground">
          Found on the driver-side dashboard, door jamb, or registration permit.
        </p>
      )}
    </form>
  )
}
