import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Countdown } from "./Countdown"

describe("Countdown", () => {
  it("renders the remaining time as HH:MM:SS", () => {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    render(<Countdown expiresAt={expiresAt} />)
    expect(screen.getByText(/^23:59:5\d$/)).toBeInTheDocument()
  })

  it("clamps at zero once expired", () => {
    render(<Countdown expiresAt={new Date(Date.now() - 1000).toISOString()} />)
    expect(screen.getByText("00:00:00")).toBeInTheDocument()
  })
})
