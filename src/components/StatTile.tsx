import { Card, CardContent } from "@/components/ui/card"

export function StatTile({
  label,
  value,
  hint,
  icon,
}: {
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <Card size="sm">
      <CardContent className="gap-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{label}</span>
          {icon ? <span className="text-muted-foreground/70 [&>svg]:size-4">{icon}</span> : null}
        </div>
        <div className="text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
        {hint ? <div className="text-xs text-muted-foreground">{hint}</div> : null}
      </CardContent>
    </Card>
  )
}
