import { Car } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { formatDate, formatOdometer, maskName } from "@/lib/format"
import { vehicleTitle, type Vehicle } from "@/lib/vehicles"

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono text-sm tracking-wider" : "text-sm"}>{value}</dd>
    </div>
  )
}

export function VehicleHeader({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card>
      <CardContent className="gap-6">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Car className="size-6" aria-hidden />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-medium">{vehicleTitle(vehicle)}</h1>
            <p className="text-sm text-muted-foreground">
              {vehicle.colour} · {vehicle.bodyStyle} · Ontario plate{" "}
              <span className="font-mono tracking-wider">{vehicle.plate}</span>
            </p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4">
          <Field label="VIN" value={vehicle.vin} mono />
          <Field label="Plate" value={vehicle.plate} mono />
          <Field label="Registered on" value={formatDate(vehicle.registeredOn)} />
          <Field label="Odometer at registration" value={formatOdometer(vehicle.odometerKm)} />
          <Field label="Registered owner" value={maskName(vehicle.owner.name)} />
          <Field label="Owner phone" value={`••• ••• ${vehicle.owner.phoneLast4}`} />
          <Field label="Colour" value={vehicle.colour} />
          <Field label="Body style" value={vehicle.bodyStyle} />
        </dl>
      </CardContent>
    </Card>
  )
}
