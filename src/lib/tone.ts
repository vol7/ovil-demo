export type Tone = "success" | "danger" | "info" | "warning" | "neutral"

/** Map a status label to a colour tone. */
export function toneFor(label: string): Tone {
  switch (label.toLowerCase()) {
    case "clear":
    case "authorized":
    case "closed":
      return "success"
    case "blocked":
    case "escalated":
      return "danger"
    case "pending":
    case "open":
      return "info"
    case "frozen":
    case "under review":
    case "expired":
      return "warning"
    default:
      return "neutral"
  }
}
