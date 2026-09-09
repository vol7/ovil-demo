/** Demo people for the public flows. Invented. */
export const OWNER = {
  name: "Daniel Okafor",
  licence: "O1234-56789-01234",
  mobile: "(416) 555-0917",
  mobileLast4: "0917",
} as const

export const BUYER = {
  name: "Fawaz Ahmed",
  shortName: "Fawaz A.",
  licence: "A5678-12345-67890",
  mobile: "(647) 555-4410",
  mobileLast4: "4410",
} as const

export function maskLicence(licence: string): string {
  return licence.replace(/[A-Z0-9](?=[A-Z0-9-]{4,}$)/g, "•").replace(/^(.)/, "$1")
}
