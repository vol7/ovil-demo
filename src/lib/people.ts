/** Demo people for the public flows. Invented. */
export const OWNER = {
  name: "Daniel Okafor",
  licence: "D6101-40706-60905",
  mobile: "(416) 555-0917",
  mobileLast4: "0917",
} as const

export const BUYER = {
  name: "Marcus Beaulieu",
  shortName: "Marcus B.",
  licence: "B2947-51083-64712",
  mobile: "(647) 555-4410",
  mobileLast4: "4410",
} as const

/** Keeps the leading letter and the last four characters, masks the rest. */
export function maskLicence(licence: string): string {
  return licence.slice(0, 1) + licence.slice(1).replace(/[A-Z0-9](?=[A-Z0-9-]{4,}$)/g, "•")
}
