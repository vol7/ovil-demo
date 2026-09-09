import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { type AuthorizationState } from "@/lib/authorization"
import { evaluateChecks } from "@/lib/checks"
import { CLEAN_VIN, CLONED_VIN, findVehicle } from "@/lib/vehicles"
import { PackagePanel } from "./PackagePanel"

const clean = findVehicle(CLEAN_VIN)!
const cloned = findVehicle(CLONED_VIN)!

function renderPanel(state: AuthorizationState, vehicle = clean) {
  const onRequest = vi.fn()
  const onEscalate = vi.fn()
  render(
    <PackagePanel
      vehicle={vehicle}
      checks={evaluateChecks(vehicle)}
      state={state}
      onRequest={onRequest}
      onEscalate={onEscalate}
    />
  )
  return { onRequest, onEscalate }
}

describe("PackagePanel", () => {
  it("idle: request button enabled and calls onRequest", async () => {
    const { onRequest } = renderPanel({ status: "idle" })
    const button = screen.getByRole("button", { name: /request owner authorization/i })
    expect(button).toBeEnabled()
    expect(screen.getByText(/phone ending in 0917/)).toBeInTheDocument()
    await userEvent.click(button)
    expect(onRequest).toHaveBeenCalledWith("Fawaz A.")
  })

  it("blocked: request disabled with reason, escalate available", async () => {
    const { onEscalate } = renderPanel({ status: "blocked" }, cloned)
    expect(screen.getByRole("button", { name: /request owner authorization/i })).toBeDisabled()
    expect(screen.getByText(/3 record checks failed/)).toBeInTheDocument()
    expect(screen.getByText("Transaction blocked")).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: /escalate/i }))
    expect(onEscalate).toHaveBeenCalledTimes(1)
  })

  it("escalated: shows the case reference", () => {
    renderPanel(
      {
        status: "escalated",
        caseReference: "OVIL-2026-09-02-0417",
        escalatedAt: "2026-09-02T18:16:30.000Z",
      },
      cloned
    )
    expect(screen.getByText("Escalated for review")).toBeInTheDocument()
    expect(screen.getByText("OVIL-2026-09-02-0417")).toBeInTheDocument()
  })

  it("pending: shows the countdown", () => {
    renderPanel({
      status: "pending",
      origin: "clerk",
      requester: "Fawaz A.",
      otp: "482 193",
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000 - 1000).toISOString(),
    })
    expect(screen.getByText("Request sent to registered owner")).toBeInTheDocument()
    expect(screen.getByText(/^23:59:5\d$/)).toBeInTheDocument()
    expect(screen.getByText(/waiting for response/i)).toBeInTheDocument()
  })

  it("authorized: shows the code and the clear-to-proceed line", () => {
    renderPanel({
      status: "authorized",
      origin: "clerk",
      requester: "Fawaz A.",
      otp: "482 193",
      sentAt: "2026-09-02T18:14:00.000Z",
      authorizationCode: "OV-7K2M-9Q3F",
      approvedAt: "2026-09-02T18:16:30.000Z",
      validUntil: "2026-10-02T18:16:30.000Z",
    })
    expect(screen.getByText("Authorized by registered owner")).toBeInTheDocument()
    expect(screen.getByText("OV-7K2M-9Q3F")).toBeInTheDocument()
    expect(screen.getByText(/clear to proceed with used vehicle package/i)).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: /request owner authorization/i })
    ).not.toBeInTheDocument()
  })

  it("authorized by owner pre-approval: shows on-file wording and validity", () => {
    renderPanel({
      status: "authorized",
      origin: "owner",
      requester: "Daniel Okafor",
      otp: "",
      sentAt: "2026-09-02T18:14:00.000Z",
      authorizationCode: "OV-K3PM-7HQ2",
      approvedAt: "2026-09-02T18:14:00.000Z",
      validUntil: "2026-10-02T18:14:00.000Z",
    })
    expect(screen.getByText("Authorization on file")).toBeInTheDocument()
    expect(screen.getByText(/pre-approved online by the registered owner/i)).toBeInTheDocument()
    expect(screen.getByText(/valid until October 2, 2026/)).toBeInTheDocument()
  })

  it("pending from a buyer: names the buyer", () => {
    renderPanel({
      status: "pending",
      origin: "buyer",
      requester: "Fawaz Ahmed",
      otp: "482 193",
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600_000).toISOString(),
    })
    expect(screen.getByText("Awaiting registered owner")).toBeInTheDocument()
    expect(screen.getByText(/requested online by Fawaz Ahmed/i)).toBeInTheDocument()
  })

  it("frozen: shows the reason", () => {
    renderPanel({
      status: "frozen",
      origin: "clerk",
      requester: "Fawaz A.",
      reason: "timeout",
      otp: "482 193",
      sentAt: "2026-09-02T18:14:00.000Z",
      frozenAt: "2026-09-02T18:16:30.000Z",
    })
    expect(screen.getByText(/flagged for security review/i)).toBeInTheDocument()
    expect(screen.getByText(/no response within 24 hours/i)).toBeInTheDocument()
  })
})
