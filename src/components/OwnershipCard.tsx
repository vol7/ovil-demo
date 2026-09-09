import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatOdometer, maskName } from "@/lib/format"
import type { Vehicle } from "@/lib/vehicles"

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono tracking-wider" : "text-right"}>{value}</dd>
    </div>
  )
}

export function OwnershipCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-4">
        <CardTitle>Ownership and registration</CardTitle>
      </CardHeader>
      <CardContent className="gap-0 py-3">
        <dl className="divide-y">
          <Row label="Registered owner" value={maskName(vehicle.owner.name)} />
          <Row label="Owner address" value={vehicle.owner.city} />
          <Row label="Phone on file" value={`••• ••• ${vehicle.owner.phoneLast4}`} mono />
          <Row label="Plate" value={vehicle.plate} mono />
          <Row label="Registration date" value={formatDate(vehicle.registeredOn)} />
          <Row label="Registration class" value="Passenger · PSGR" />
          <Row label="Previous owners" value="1 (dealer)" />
        </dl>
      </CardContent>
    </Card>
  )
}

export function OdometerHistory({ vehicle }: { vehicle: Vehicle }) {
  const readings = [...vehicle.records.odometerReadings].sort((a, b) =>
    b.date.localeCompare(a.date)
  )
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-4">
        <CardTitle>Odometer history</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-1">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Date</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="pr-6 text-right">Reading</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {readings.map((r) => (
              <TableRow key={r.date}>
                <TableCell className="pl-6">{formatDate(r.date)}</TableCell>
                <TableCell className="text-muted-foreground">{r.source}</TableCell>
                <TableCell className="pr-6 text-right font-mono tabular-nums">
                  {formatOdometer(r.km)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
