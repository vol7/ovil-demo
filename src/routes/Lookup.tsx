import { History, Search } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { isValidVin, normalizeVin } from "@/lib/format"
import { DEMO_VEHICLES, findVehicle, vehicleTitle } from "@/lib/vehicles"

const INVALID_MESSAGE = "Enter a 17-character VIN (letters I, O and Q are not used)."
const NOT_FOUND_MESSAGE = "No record found for this VIN."

export function Lookup() {
  const navigate = useNavigate()
  const [vin, setVin] = useState("")
  const [error, setError] = useState<string | null>(null)

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
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-base font-medium">Vehicle lookup</h1>
          </CardTitle>
          <CardDescription>
            Look up a vehicle before issuing a used vehicle information package.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3" onSubmit={submit} noValidate>
            <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
            <div className="flex gap-2">
              <Input
                id="vin"
                className="font-mono tracking-wider uppercase placeholder:normal-case"
                maxLength={17}
                autoComplete="off"
                spellCheck={false}
                placeholder="17 characters"
                value={vin}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "vin-error" : undefined}
                onChange={(e) => {
                  setVin(e.target.value.toUpperCase())
                  setError(null)
                }}
              />
              <Button type="submit">
                <Search aria-hidden />
                Look up
              </Button>
            </div>
            {error ? (
              <p id="vin-error" className="text-sm text-destructive">
                {error}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Found on the driver-side dashboard, door jamb, or registration.
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-4 text-muted-foreground" aria-hidden />
            Recent lookups
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-0">
          {DEMO_VEHICLES.map((vehicle, index) => (
            <div key={vehicle.vin}>
              {index > 0 ? <Separator /> : null}
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 rounded-md px-2 py-3 text-left hover:bg-muted"
                onClick={() => navigate(`/vehicle/${vehicle.vin}`)}
              >
                <span className="font-mono text-sm tracking-wider">{vehicle.vin}</span>
                <span className="text-sm text-muted-foreground">{vehicleTitle(vehicle)}</span>
              </button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
