import { ArrowRight, Car, ChevronRight, IdCard } from "lucide-react"
import { Link } from "react-router"

import { PublicShell } from "@/components/public/PublicShell"

const POPULAR = [
  "Renew a driver's licence",
  "Renew a health card",
  "Get renewal reminders",
  "Change your address",
  "Register a birth",
  "Getting married",
]

const VEHICLES = [
  "Buy or sell used vehicles",
  "Register a vehicle",
  "Register a farm vehicle",
  "Register an out-of-province vehicle",
  "Change information on a vehicle permit",
  "Get a 10-day temporary vehicle permit",
  "Automatic licence plate renewal",
  "Order a personalized licence plate",
  "Vintage licence plate for a classic car",
  "Get a vehicle record",
  "Garage licence",
]

export function ServiceOntario() {
  return (
    <PublicShell wide>
      <div className="flex flex-col gap-12">
        <section className="flex flex-col gap-3 rounded-2xl bg-muted/60 p-10">
          <h1 className="text-4xl font-semibold tracking-tight">We are here to help</h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Complete your services online, or find a location near you and book an appointment.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Popular services</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR.map((label) => (
              <li
                key={label}
                className="flex items-center justify-between gap-3 rounded-lg border bg-card px-5 py-4 text-base font-medium"
              >
                {label}
                <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Car className="size-5 text-primary" aria-hidden />
            <h2 className="text-2xl font-semibold tracking-tight">Vehicles</h2>
          </div>

          <Link
            to="/uvip"
            className="group flex items-center justify-between gap-6 rounded-xl border-2 border-primary/30 bg-primary/5 px-6 py-5 transition-[background-color,border-color] duration-150 hover:border-primary/60 hover:bg-primary/10"
          >
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <IdCard className="size-5" aria-hidden />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold">
                  Get a Used Vehicle Information Package (UVIP)
                </span>
                <span className="text-sm text-muted-foreground">
                  Selling or buying a used vehicle? Pre-approve the package online so it is ready at
                  the counter. New for high-value vehicles.
                </span>
              </div>
            </div>
            <ArrowRight
              className="size-5 shrink-0 text-primary transition-transform duration-150 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>

          <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {VEHICLES.map((label) => (
              <li
                key={label}
                className="border-b py-3 text-base text-primary underline-offset-2 hover:underline"
              >
                {label}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PublicShell>
  )
}
