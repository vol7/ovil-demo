/** Short link shown in the SMS; deterministic from the one-time code. */
export function smsLink(otp: string): string {
  return `ovil.on.ca/c/${otp.replace(/\s+/g, "")}`
}
