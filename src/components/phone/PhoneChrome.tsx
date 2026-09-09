import { Battery, Signal, Wifi } from "lucide-react"

import { useClock } from "@/hooks/useClock"

export function StatusBar({ dark = false }: { dark?: boolean }) {
  const now = useClock()
  return (
    <div
      className={`flex h-11 shrink-0 items-center justify-between px-6 pt-2 text-[15px] font-semibold ${dark ? "text-white" : "text-black"}`}
    >
      <span className="tabular-nums">
        {now
          .toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" })
          .replace(/\s?[ap]\.?m\.?/i, "")}
      </span>
      <span className="flex items-center gap-1.5">
        <Signal className="size-4" strokeWidth={2.25} aria-hidden />
        <Wifi className="size-4" strokeWidth={2.25} aria-hidden />
        <Battery className="size-5" strokeWidth={2} aria-hidden />
      </span>
    </div>
  )
}
