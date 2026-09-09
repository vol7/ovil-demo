import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { toneFor, type Tone } from "@/lib/tone"

const TONES: Record<Tone, string> = {
  success:
    "border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  danger: "border-transparent bg-destructive/10 text-destructive",
  info: "border-transparent bg-primary/10 text-primary",
  warning: "border-transparent bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  neutral: "border-transparent bg-muted text-muted-foreground",
}

const DOTS: Record<Tone, string> = {
  success: "bg-emerald-500",
  danger: "bg-destructive",
  info: "bg-primary",
  warning: "bg-amber-500",
  neutral: "bg-muted-foreground/60",
}

export function OutcomeBadge({ label, className }: { label: string; className?: string }) {
  const tone = toneFor(label)
  return (
    <Badge variant="outline" className={cn("gap-1.5 pl-1.5", TONES[tone], className)}>
      <span className={cn("size-1.5 rounded-full", DOTS[tone])} aria-hidden />
      {label}
    </Badge>
  )
}
