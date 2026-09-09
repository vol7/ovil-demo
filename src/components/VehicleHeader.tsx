import { Car, Check, Copy, ShieldAlert, ShieldCheck } from "lucide-react"
import { useState } from "react"

import { OutcomeBadge } from "@/components/OutcomeBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

function CopyVin({ vin }: { vin: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard?.writeText(vin)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label={copied ? "VIN copied" : "Copy VIN"}
      onClick={copy}
      className="text-muted-foreground"
    >
      {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
    </Button>
  )
}

export function VehicleHeader({ vehicle, blocked }: { vehicle: Vehicle; blocked: boolean }) {
  return (
    <Card>
      <CardContent className="gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Car className="size-6" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="flex flex-col gap-1.5">
              <h1 className="text-xl font-semibold tracking-tight">{vehicleTitle(vehicle)}</h1>
              <p className="text-sm text-muted-foreground">
                {vehicle.colour} · {vehicle.bodyStyle} · Ontario plate{" "}
                <span className="font-mono tracking-wider text-foreground">{vehicle.plate}</span>
              </p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-muted-foreground">VIN</span>
                <span className="font-mono tracking-wider">{vehicle.vin}</span>
                <CopyVin vin={vehicle.vin} />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <OutcomeBadge label={blocked ? "Blocked" : "Clear"} />
            <Badge variant="outline">Registered · Ontario</Badge>
            {vehicle.riskTier === "high-value" ? (
              <Badge variant="outline" className="gap-1.5">
                {blocked ? (
                  <ShieldAlert className="text-destructive" aria-hidden />
                ) : (
                  <ShieldCheck className="text-primary" aria-hidden />
                )}
                High-value model · owner authorization required
              </Badge>
            ) : null}
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-5 md:grid-cols-3 xl:grid-cols-6">
          <Field label="Registered on" value={formatDate(vehicle.registeredOn)} />
          <Field label="Odometer at registration" value={formatOdometer(vehicle.odometerKm)} />
          <Field label="Registered owner" value={maskName(vehicle.owner.name)} />
          <Field label="Owner phone" value={`••• ••• ${vehicle.owner.phoneLast4}`} mono />
          <Field label="Last inspection" value={formatDate(vehicle.lastInspection)} />
          <Field
            label="Active lien"
            value={vehicle.records.lien ? vehicle.records.lien.holder : "None"}
          />
        </dl>
      </CardContent>
    </Card>
  )
}
