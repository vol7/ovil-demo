import { Lock, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignIn() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  return (
    <main className="grid min-h-svh lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 15%, white 0, transparent 40%), radial-gradient(circle at 85% 80%, white 0, transparent 45%)",
          }}
          aria-hidden
        />
        <div className="relative flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-white/15 text-xs font-bold tracking-wide ring-1 ring-white/25">
            OV
          </span>
          <span className="text-sm font-semibold tracking-wide">OVIL</span>
        </div>
        <div className="relative flex max-w-md flex-col gap-4">
          <h2 className="text-3xl font-semibold tracking-tight">
            Vehicle identity, verified at the counter.
          </h2>
          <p className="text-base text-primary-foreground/80">
            Look up a registration, run record checks across police, insurer and ministry sources,
            and confirm every transfer with the registered owner before a package is issued.
          </p>
          <ul className="mt-2 flex flex-col gap-2 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4" aria-hidden /> Six record checks in one lookup
            </li>
            <li className="flex items-center gap-2">
              <Lock className="size-4" aria-hidden /> Owner authorization by one-time code
            </li>
          </ul>
        </div>
        <div className="relative text-xs text-primary-foreground/60">
          Ontario Ministry of Transportation · Authorized users only
        </div>
      </section>

      <section className="flex items-center justify-center bg-background p-6">
        <div className="flex w-full max-w-sm flex-col gap-8">
          <div className="flex flex-col gap-1.5">
            <div className="mb-3 flex items-center gap-2 text-primary lg:hidden">
              <Lock className="size-4" aria-hidden />
              <span className="text-xs font-semibold tracking-wide uppercase">OVIL</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Authorized User Portal</h1>
            <p className="text-sm text-muted-foreground">
              Sign in with your ministry credentials to look up vehicle records.
            </p>
          </div>
          <form
            className="flex flex-col gap-5"
            onSubmit={(event) => {
              event.preventDefault()
              navigate("/home")
            }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <span className="text-xs text-muted-foreground">Forgot password?</span>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="mt-1">
              Sign in
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Authorized users only. Access is logged and audited.
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}
