import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import type { AuthorizationState } from "@/lib/authorization"
import { CLEAN_VIN, findVehicle } from "@/lib/vehicles"
import { PhoneMock } from "./PhoneMock"

const vehicle = findVehicle(CLEAN_VIN)!
const pending: AuthorizationState = {
  status: "pending",
  otp: "482 193",
  sentAt: "2026-09-02T18:14:00.000Z",
  expiresAt: "2026-09-03T18:14:00.000Z",
}

function renderPhone(state: AuthorizationState) {
  const onApprove = vi.fn()
  const onDeny = vi.fn()
  render(<PhoneMock vehicle={vehicle} state={state} onApprove={onApprove} onDeny={onDeny} />)
  return { onApprove, onDeny }
}

describe("PhoneMock", () => {
  it("renders nothing while idle", () => {
    renderPhone({ status: "idle" })
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument()
  })

  it("shows the SMS with the code and approve/deny while pending", async () => {
    const { onApprove, onDeny } = renderPhone(pending)
    expect(screen.getByRole("complementary", { name: /registered owner/i })).toBeInTheDocument()
    expect(
      screen.getByText(/2023 Mercedes-AMG GLE 63 S 4MATIC\+ \(plate CKXR 214\)/)
    ).toBeInTheDocument()
    expect(screen.getByText(/482 193/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: /^approve$/i }))
    expect(onApprove).toHaveBeenCalledTimes(1)
    await userEvent.click(screen.getByRole("button", { name: /^deny$/i }))
    expect(onDeny).toHaveBeenCalledTimes(1)
  })

  it("shows the owner's YES reply once authorized", () => {
    renderPhone({
      status: "authorized",
      otp: "482 193",
      sentAt: pending.sentAt,
      authorizationCode: "OV-7K2M-9Q3F",
      approvedAt: "2026-09-02T18:16:30.000Z",
    })
    expect(screen.getByText("YES 482 193")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /^approve$/i })).not.toBeInTheDocument()
  })

  it("shows the NO reply when denied", () => {
    renderPhone({ status: "frozen", reason: "denied", frozenAt: "2026-09-02T18:16:30.000Z" })
    expect(screen.getByText("NO")).toBeInTheDocument()
  })

  it("shows an expired notice on timeout", () => {
    renderPhone({ status: "frozen", reason: "timeout", frozenAt: "2026-09-02T18:16:30.000Z" })
    expect(screen.getByText(/expired/i)).toBeInTheDocument()
  })
})
