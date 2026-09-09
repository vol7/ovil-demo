import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router"

import { ActivityTimeline } from "@/components/ActivityTimeline"
import { DemoControls } from "@/components/DemoControls"
import { OdometerHistory, OwnershipCard } from "@/components/OwnershipCard"
import { PackagePanel } from "@/components/PackagePanel"
import { RecordChecks } from "@/components/RecordChecks"
import { VehicleHeader } from "@/components/VehicleHeader"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { deriveActivity } from "@/lib/activity"
import { generateCaseReference, generateOtp } from "@/lib/authorization"
import { allPass, evaluateChecks } from "@/lib/checks"
import { OFFICE } from "@/lib/office"
import { useSession } from "@/lib/session"
import { findVehicle, type Vehicle as VehicleRecord } from "@/lib/vehicles"

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

  return <VehicleView key={vehicle.vin} vehicle={vehicle} />
}

function VehicleView({ vehicle }: { vehicle: VehicleRecord }) {
  const checks = useMemo(() => evaluateChecks(vehicle), [vehicle])
  const canRequest = allPass(checks)
  const [session, dispatch] = useSession()
  const [openedAt] = useState(() => new Date().toISOString())
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    dispatch({ type: "open", vin: vehicle.vin, canRequest })
  }, [dispatch, vehicle.vin, canRequest])

  // Until the store reflects this vehicle, show the initial state for it.
  const state =
    session.vin === vehicle.vin
      ? session.authorization
      : canRequest
        ? ({ status: "idle" } as const)
        : ({ status: "blocked" } as const)

  const now = () => new Date().toISOString()
  const onRequest = (applicant: string) =>
    dispatch({ type: "request", otp: generateOtp(), requester: applicant, at: now() })
  const onEscalate = () =>
    dispatch({ type: "escalate", caseReference: generateCaseReference(new Date()), at: now() })

  const events = deriveActivity(state, openedAt, OFFICE.clerk)

  return (
    <div className="flex flex-col gap-6">
      <VehicleHeader vehicle={vehicle} blocked={!canRequest} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <RecordChecks checks={checks} onSettled={() => setSettled(true)} />
          <OwnershipCard vehicle={vehicle} />
          <OdometerHistory vehicle={vehicle} />
        </div>
        <div className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-0">
          <PackagePanel
            vehicle={vehicle}
            checks={checks}
            state={state}
            onRequest={onRequest}
            onEscalate={onEscalate}
            settled={settled}
          />
          <ActivityTimeline events={events} />
        </div>
      </div>
      <DemoControls />
    </div>
  )
}
