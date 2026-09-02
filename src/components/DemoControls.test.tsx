import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import type { AuthorizationState } from "@/lib/authorization"
import { DemoControls } from "./DemoControls"

const pending: AuthorizationState = {
  status: "pending",
  otp: "482 193",
  sentAt: "2026-09-02T18:14:00.000Z",
  expiresAt: "2026-09-03T18:14:00.000Z",
}

function renderControls(state: AuthorizationState) {
  const handlers = {
    onApprove: vi.fn(),
    onDeny: vi.fn(),
    onTimeout: vi.fn(),
    onReset: vi.fn(),
  }
  render(<DemoControls state={state} {...handlers} />)
  return handlers
}

describe("DemoControls", () => {
  it("is hidden until Shift+D is pressed, and toggles back off", async () => {
    renderControls(pending)
    expect(screen.queryByRole("region", { name: /demo controls/i })).not.toBeInTheDocument()
    await userEvent.keyboard("{Shift>}D{/Shift}")
    expect(screen.getByRole("region", { name: /demo controls/i })).toBeInTheDocument()
    await userEvent.keyboard("{Shift>}D{/Shift}")
    expect(screen.queryByRole("region", { name: /demo controls/i })).not.toBeInTheDocument()
  })

  it("does not toggle when typing in an input", async () => {
    render(<input aria-label="field" />)
    renderControls(pending)
    await userEvent.click(screen.getByLabelText("field"))
    await userEvent.keyboard("{Shift>}D{/Shift}")
    expect(screen.queryByRole("region", { name: /demo controls/i })).not.toBeInTheDocument()
  })

  it("dispatches owner actions while pending", async () => {
    const h = renderControls(pending)
    await userEvent.keyboard("{Shift>}D{/Shift}")
    await userEvent.click(screen.getByRole("button", { name: /owner approves/i }))
    await userEvent.click(screen.getByRole("button", { name: /owner denies/i }))
    await userEvent.click(screen.getByRole("button", { name: /simulate 24h timeout/i }))
    await userEvent.click(screen.getByRole("button", { name: /reset scenario/i }))
    expect(h.onApprove).toHaveBeenCalledTimes(1)
    expect(h.onDeny).toHaveBeenCalledTimes(1)
    expect(h.onTimeout).toHaveBeenCalledTimes(1)
    expect(h.onReset).toHaveBeenCalledTimes(1)
  })

  it("disables owner actions when not pending", async () => {
    renderControls({ status: "idle" })
    await userEvent.keyboard("{Shift>}D{/Shift}")
    expect(screen.getByRole("button", { name: /owner approves/i })).toBeDisabled()
    expect(screen.getByRole("button", { name: /owner denies/i })).toBeDisabled()
    expect(screen.getByRole("button", { name: /simulate 24h timeout/i })).toBeDisabled()
    expect(screen.getByRole("button", { name: /reset scenario/i })).toBeEnabled()
  })
})
