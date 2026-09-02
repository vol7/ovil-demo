import { Link, useParams } from "react-router"

import { RecordChecks } from "@/components/RecordChecks"
import { VehicleHeader } from "@/components/VehicleHeader"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { evaluateChecks } from "@/lib/checks"
import { findVehicle } from "@/lib/vehicles"

export function Vehicle() {
  const { vin = "" } = useParams<{ vin: string }>()
  const vehicle = findVehicle(vin)

  if (!vehicle) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="items-start gap-4">
          <p className="text-sm">No record found for this VIN.</p>
          <Link to="/lookup" className={buttonVariants({ variant: "outline" })}>
            Back to lookup
          </Link>
        </CardContent>
      </Card>
    )
  }

  const checks = evaluateChecks(vehicle)

  return (
    <div className="flex flex-col gap-6">
      <VehicleHeader vehicle={vehicle} />
      <RecordChecks checks={checks} />
    </div>
  )
}
