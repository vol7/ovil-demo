import { LogOut } from "lucide-react"
import { Link, Outlet } from "react-router"

import { Button } from "@/components/ui/button"
import { OFFICE } from "@/lib/office"

export function PortalShell() {
  return (
    <div className="min-h-svh bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
          <Link to="/lookup" className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-wide text-primary uppercase">
              OVIL
            </span>
            <span className="text-sm text-muted-foreground">
              Authorized User Portal
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-right leading-tight">
              <div className="font-medium">{OFFICE.clerk}</div>
              <div className="text-xs text-muted-foreground">
                {OFFICE.name} · {OFFICE.counter}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              render={<Link to="/" />}
              aria-label="Sign out"
            >
              <LogOut aria-hidden />
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
