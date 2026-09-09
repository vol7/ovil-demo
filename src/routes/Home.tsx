import { Clock, FileWarning, Search, ShieldCheck } from "lucide-react"
import { Link } from "react-router"

import { LookupForm } from "@/components/LookupForm"
import { OutcomeBadge } from "@/components/OutcomeBadge"
import { RecentLookupsTable } from "@/components/RecentLookupsTable"
import { StatTile } from "@/components/StatTile"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatTime } from "@/lib/format"
import { OFFICE } from "@/lib/office"
import { TODAY_STATS } from "@/lib/seed"
import { useSession } from "@/lib/session"
import { findVehicle, vehicleTitle } from "@/lib/vehicles"

function todayLabel(): string {
  return new Date().toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

export function Home() {
  const [session] = useSession()
  const auth = session.authorization
  const liveVehicle = session.vin ? findVehicle(session.vin) : undefined
  const pendingCount = auth.status === "pending" ? 1 : 0
  const casesOpened = TODAY_STATS.casesOpened + (auth.status === "escalated" ? 1 : 0)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <div className="text-sm text-muted-foreground">
          {todayLabel()} · {OFFICE.name} · {OFFICE.counter}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Good day, {OFFICE.clerkFullName.split(" ")[0]}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="size-4 text-muted-foreground" aria-hidden />
            Vehicle lookup
          </CardTitle>
          <CardDescription>
            Look up a vehicle before issuing a used vehicle information package.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LookupForm size="lg" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <StatTile
          label="Lookups today"
          value={TODAY_STATS.lookups}
          hint="Across this office"
          icon={<Search aria-hidden />}
        />
        <StatTile
          label="Authorizations pending"
          value={pendingCount}
          hint={pendingCount ? "Awaiting registered owner" : "Nothing waiting"}
          icon={<Clock aria-hidden />}
        />
        <StatTile
          label="Cases opened"
          value={casesOpened}
          hint="Routed to law enforcement or insurers"
          icon={<FileWarning aria-hidden />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="gap-0 py-0">
          <CardHeader className="border-b py-4">
            <CardTitle>Recent lookups</CardTitle>
            <CardDescription>Latest records retrieved at this counter.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            <RecentLookupsTable limit={5} compact />
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-muted-foreground" aria-hidden />
              Pending authorizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {auth.status === "pending" && liveVehicle ? (
              <Link
                to={`/vehicle/${liveVehicle.vin}`}
                className="flex flex-col gap-2 rounded-lg border p-3 transition-[background-color] hover:bg-muted/60"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{vehicleTitle(liveVehicle)}</span>
                  <OutcomeBadge label="Pending" />
                </div>
                <div className="text-xs text-muted-foreground">
                  Plate <span className="font-mono tracking-wider">{liveVehicle.plate}</span> · sent{" "}
                  {formatTime(auth.sentAt)}
                </div>
              </Link>
            ) : (
              <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed p-4">
                <p className="text-sm text-muted-foreground">
                  No requests are waiting on a registered owner right now.
                </p>
                <Link to="/requests" className={buttonVariants({ variant: "outline", size: "sm" })}>
                  View all requests
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
