import type { KeyboardEvent } from "react"

/**
 * Enter-to-submit for inputs that deliberately sit outside a <form>.
 *
 * The VIN fields are form-less on purpose: Chrome classifies a labelled VIN field as
 * vehicle data and offers to save it to Google Wallet on form submission, which would
 * interrupt a recording. No submit event, no prompt.
 */
export function submitOnEnter(run: () => void) {
  return (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return
    event.preventDefault()
    run()
  }
}
