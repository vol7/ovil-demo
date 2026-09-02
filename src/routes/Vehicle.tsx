import { useReducer } from "react"
import { Link, useParams } from "react-router"

import { PackagePanel } from "@/components/PackagePanel"
import { RecordChecks } from "@/components/RecordChecks"
import { VehicleHeader } from "@/components/VehicleHeader"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  authorizationReducer,
  generateAuthorizationCode,
  generateCaseReference,
  generateOtp,
  initialState,
} from "@/lib/authorization"
import { allPass, evaluateChecks } from "@/lib/checks"
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
  const checks = evaluateChecks(vehicle)
  const canRequest = allPass(checks)
  const [state, dispatch] = useReducer(authorizationReducer, canRequest, initialState)

  const now = () => new Date().toISOString()
  const onRequest = () => dispatch({ type: "request", otp: generateOtp(), at: now() })
  const onApprove = () =>
    dispatch({ type: "approve", authorizationCode: generateAuthorizationCode(), at: now() })
  const onDeny = () => dispatch({ type: "deny", at: now() })
  const onTimeout = () => dispatch({ type: "timeout", at: now() })
  const onEscalate = () =>
    dispatch({ type: "escalate", caseReference: generateCaseReference(new Date()), at: now() })
  const onReset = () => dispatch({ type: "reset", canRequest })

  // onApprove, onDeny, onTimeout and onReset are consumed by PhoneMock (Task 10)
  // and DemoControls (Task 11). Keep them referenced to satisfy noUnusedLocals.
  void onApprove
  void onDeny
  void onTimeout
  void onReset

  return (
    <div className="flex flex-col gap-6">
      <VehicleHeader vehicle={vehicle} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <RecordChecks checks={checks} />
        <PackagePanel
          vehicle={vehicle}
          checks={checks}
          state={state}
          onRequest={onRequest}
          onEscalate={onEscalate}
        />
      </div>
    </div>
  )
}
