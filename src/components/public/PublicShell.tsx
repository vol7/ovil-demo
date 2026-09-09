import { ChevronRight } from "lucide-react"

export type Crumb = { label: string; to?: string }

/** Ontario.ca-style chrome for the public (ServiceOntario) surfaces. */
export function PublicShell({
  crumbs,
  children,
  wide = false,
}: {
  crumbs?: Crumb[]
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <div className="theme-so flex min-h-svh flex-col bg-background text-foreground">
      <header className="bg-[#1a1a1a] text-white">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
          <a href="/serviceontario/" className="flex items-center">
            <img
              src="/serviceontario/assets/ontario-logo--desktop.svg"
              alt="Ontario"
              className="h-9 w-auto"
            />
          </a>
          <nav className="flex items-center gap-6 text-sm text-white/85">
            <span className="hidden sm:inline">Topics</span>
            <span className="hidden sm:inline">Search</span>
            <span>Français</span>
          </nav>
        </div>
      </header>
      <div className="bg-[var(--so-green)] text-white">
        <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-between px-6">
          <a href="/serviceontario/" className="flex items-center">
            <img
              src="/serviceontario/assets/serviceontario-logo-2026-06-16.svg"
              alt="ServiceOntario"
              className="h-7 w-auto"
            />
          </a>
          <span className="text-sm text-white/85">Sign in or create an account</span>
        </div>
      </div>

      {crumbs ? (
        <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-6xl px-6 pt-5 text-sm">
          <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-1">
                {i > 0 ? <ChevronRight className="size-3.5" aria-hidden /> : null}
                {c.to ? (
                  <a
                    href={c.to}
                    className="underline-offset-2 hover:text-foreground hover:underline"
                  >
                    {c.label}
                  </a>
                ) : (
                  <span className="text-foreground">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <main className={`mx-auto w-full flex-1 px-6 py-8 ${wide ? "max-w-6xl" : "max-w-2xl"}`}>
        {children}
      </main>

      <footer className="border-t bg-[#1a1a1a] text-white/75">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {["About Ontario", "Accessibility", "Archives", "News", "Privacy", "Terms of use"].map(
              (l) => (
                <span key={l}>{l}</span>
              )
            )}
          </div>
          <span className="text-xs">© King's Printer for Ontario, 2012–2026</span>
        </div>
      </footer>
    </div>
  )
}
