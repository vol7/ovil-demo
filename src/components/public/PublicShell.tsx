import { ChevronRight } from "lucide-react"
import { Link } from "react-router"

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
          <Link to="/serviceontario" className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="size-6 text-[#c9b8e6]"
              aria-hidden
              fill="currentColor"
            >
              <path d="M12 3c1.6 2.2 2.4 4.3 2.4 6.2 0 .5-.1 1-.2 1.5 1.3-1 2.9-1.6 4.8-1.7 1.6 0 3 .4 4 1.1-1.6 2.3-3.6 3.6-5.9 3.9-.5.1-1 .1-1.5 0 1 1.3 1.5 2.9 1.5 4.7 0 1.6-.4 3-1.1 4-2.3-1.6-3.6-3.6-3.9-5.9L12 15.6l-.1 1.2c-.3 2.3-1.6 4.3-3.9 5.9-.7-1-1.1-2.4-1.1-4 0-1.8.5-3.4 1.5-4.7-.5.1-1 .1-1.5 0-2.3-.3-4.3-1.6-5.9-3.9 1-.7 2.4-1.1 4-1.1 1.9.1 3.5.7 4.8 1.7-.1-.5-.2-1-.2-1.5C9.6 7.3 10.4 5.2 12 3z" />
            </svg>
            <span className="text-xl font-semibold tracking-tight">Ontario</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-white/85">
            <span className="hidden sm:inline">Topics</span>
            <span className="hidden sm:inline">Search</span>
            <span>Français</span>
          </nav>
        </div>
      </header>
      <div className="border-b bg-primary text-primary-foreground">
        <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-between px-6">
          <Link to="/serviceontario" className="text-base font-semibold tracking-tight">
            ServiceOntario
          </Link>
          <span className="text-sm text-primary-foreground/80">Log in to continue</span>
        </div>
      </div>

      {crumbs ? (
        <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-6xl px-6 pt-5 text-sm">
          <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-1">
                {i > 0 ? <ChevronRight className="size-3.5" aria-hidden /> : null}
                {c.to ? (
                  <Link
                    to={c.to}
                    className="underline-offset-2 hover:text-foreground hover:underline"
                  >
                    {c.label}
                  </Link>
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
