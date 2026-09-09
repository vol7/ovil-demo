import { Bell, ChevronRight, Search } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { isValidVin, normalizeVin } from "@/lib/format"
import { OFFICE } from "@/lib/office"
import { findVehicle } from "@/lib/vehicles"

export type Crumb = { label: string; to?: string }

export function TopBar({ crumbs }: { crumbs: Crumb[] }) {
  const navigate = useNavigate()
  const [vin, setVin] = useState("")
  const [invalid, setInvalid] = useState(false)

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const normalized = normalizeVin(vin)
    if (!isValidVin(normalized) || !findVehicle(normalized)) {
      setInvalid(true)
      return
    }
    setVin("")
    navigate(`/vehicle/${normalized}`)
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-6 border-b bg-background px-6">
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-sm">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1
          return (
            <span key={`${crumb.label}-${i}`} className="flex min-w-0 items-center gap-1">
              {i > 0 ? (
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/70" aria-hidden />
              ) : null}
              {crumb.to && !last ? (
                <Link
                  to={crumb.to}
                  className="truncate text-muted-foreground hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={last ? "truncate font-medium" : "truncate text-muted-foreground"}
                  aria-current={last ? "page" : undefined}
                >
                  {crumb.label}
                </span>
              )}
            </span>
          )
        })}
      </nav>

      <div className="flex items-center gap-3">
        <form onSubmit={submit} className="relative hidden md:block" role="search">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            aria-label="Search by VIN"
            placeholder="Search by VIN"
            className="h-8 w-64 pl-8 font-mono text-xs tracking-wider uppercase shadow-none placeholder:font-sans placeholder:text-sm placeholder:tracking-normal placeholder:normal-case"
            value={vin}
            maxLength={17}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={invalid || undefined}
            onChange={(e) => {
              setVin(e.target.value.toUpperCase())
              setInvalid(false)
            }}
          />
        </form>
        <Badge variant="outline" className="hidden gap-1.5 lg:inline-flex">
          <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
          Ontario · Production
        </Badge>
        <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="relative">
          <Bell aria-hidden />
          <span
            className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary ring-2 ring-background"
            aria-hidden
          />
        </Button>
        <span className="hidden text-sm text-muted-foreground xl:inline">{OFFICE.name}</span>
      </div>
    </header>
  )
}
