export function normalizeVin(input: string): string {
  return input.replace(/\s+/g, "").toUpperCase()
}

export function isValidVin(input: string): boolean {
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(normalizeVin(input))
}

export function maskName(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .map((part) => part[0] + "*".repeat(Math.max(part.length - 1, 1)))
    .join(" ")
}

export function formatOdometer(km: number): string {
  const grouped = km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return `${grouped} km`
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  })
}
