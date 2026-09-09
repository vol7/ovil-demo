import { OutcomeBadge } from "@/components/OutcomeBadge"
import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatTime } from "@/lib/format"
import { REQUEST_ROWS, type RequestRow } from "@/lib/seed"
import { useSession } from "@/lib/session"
import { findVehicle, vehicleTitle } from "@/lib/vehicles"

function liveRow(
  vin: string | null,
  auth: ReturnType<typeof useSession>[0]["authorization"]
): RequestRow | null {
  const vehicle = vin ? findVehicle(vin) : undefined
  if (!vehicle) return null
  switch (auth.status) {
    case "pending":
      return {
        reference: "—",
        vehicle: vehicleTitle(vehicle),
        plate: vehicle.plate,
        applicant: auth.origin === "buyer" ? `${auth.requester} (online)` : auth.requester,
        status: "Pending",
        when: `Today, ${formatTime(auth.sentAt)}`,
      }
    case "authorized":
      return {
        reference: auth.authorizationCode,
        vehicle: vehicleTitle(vehicle),
        plate: vehicle.plate,
        applicant:
          auth.origin === "owner"
            ? "Registered owner (pre-approval)"
            : auth.origin === "buyer"
              ? `${auth.requester} (online)`
              : auth.requester,
        status: "Authorized",
        when: `Today, ${formatTime(auth.approvedAt)}`,
      }
    case "frozen":
      return {
        reference: "—",
        vehicle: vehicleTitle(vehicle),
        plate: vehicle.plate,
        applicant: auth.origin === "buyer" ? `${auth.requester} (online)` : auth.requester,
        status: auth.reason === "timeout" ? "Expired" : "Frozen",
        when: `Today, ${formatTime(auth.frozenAt)}`,
      }
    default:
      return null
  }
}

export function Requests() {
  const [session] = useSession()
  const live = liveRow(session.vin, session.authorization)
  const rows = live ? [live, ...REQUEST_ROWS] : REQUEST_ROWS

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Authorization requests"
        description="Owner authorizations requested from this office in the last 7 days."
      />
      <Card className="gap-0 py-0">
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Reference</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Plate</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow
                  key={`${row.plate}-${i}`}
                  className={i === 0 && live ? "bg-primary/[0.03]" : undefined}
                >
                  <TableCell className="pl-6 font-mono text-xs tracking-wider">
                    {row.reference}
                  </TableCell>
                  <TableCell className="font-medium">{row.vehicle}</TableCell>
                  <TableCell className="font-mono tracking-wider">{row.plate}</TableCell>
                  <TableCell>{row.applicant}</TableCell>
                  <TableCell>
                    <OutcomeBadge label={row.status} />
                  </TableCell>
                  <TableCell className="pr-6 text-right text-muted-foreground">
                    {row.when}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
