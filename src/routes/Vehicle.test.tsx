import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMemoryRouter, RouterProvider } from "react-router"
import { describe, expect, it } from "vitest"

import { getSessionStore } from "@/lib/session"
import { CLEAN_VIN, CLONED_VIN } from "@/lib/vehicles"
import { Vehicle } from "./Vehicle"

function renderVehicle(vin: string) {
  const router = createMemoryRouter(
    [
      { path: "/vehicle/:vin", element: <Vehicle /> },
      { path: "/lookup", element: <div>lookup page</div> },
    ],
    { initialEntries: [`/vehicle/${vin}`] }
  )
  render(<RouterProvider router={router} />)
  return router
}

describe("Vehicle route", () => {
  it("shows the vehicle identity and masked owner", () => {
    renderVehicle(CLEAN_VIN)
    expect(
      screen.getByRole("heading", { name: "2023 Mercedes-AMG GLE 63 S 4MATIC+" })
    ).toBeInTheDocument()
    expect(screen.getAllByText("D***** O*****").length).toBeGreaterThan(0)
    expect(screen.getAllByText("CKXR 214").length).toBeGreaterThan(0)
    expect(screen.getAllByText("31 240 km").length).toBeGreaterThan(0)
    expect(screen.getAllByText("April 18, 2023").length).toBeGreaterThan(0)
  })

  it("shows not-found for an unknown VIN with a way back", () => {
    renderVehicle("1HGCM82633A004352")
    expect(screen.getByText(/no record found/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /back to lookup/i })).toHaveAttribute("href", "/lookup")
  })

  it("opens the vehicle in the shared session", () => {
    renderVehicle(CLEAN_VIN)
    expect(getSessionStore().getState()).toEqual({
      vin: CLEAN_VIN,
      authorization: { status: "idle" },
    })
  })

  it("starts idle for the clean vehicle and moves to pending on request", async () => {
    renderVehicle(CLEAN_VIN)
    await userEvent.click(screen.getByRole("button", { name: /request owner authorization/i }))
    expect(screen.getByText("Request sent to registered owner")).toBeInTheDocument()
    expect(getSessionStore().getState().authorization.status).toBe("pending")
    expect(screen.getByText("Authorization requested")).toBeInTheDocument()
  })

  it("starts blocked for the cloned vehicle and can escalate", async () => {
    renderVehicle(CLONED_VIN)
    expect(screen.getByRole("button", { name: /request owner authorization/i })).toBeDisabled()
    await userEvent.click(
      await screen.findByRole("button", { name: /escalate/i }, { timeout: 3000 })
    )
    expect(screen.getByText("Escalated for review")).toBeInTheDocument()
    expect(await screen.findByText(/^OVIL-\d{4}-\d{2}-\d{2}-\d{4}$/)).toBeInTheDocument()
  })

  it("reflects an approval made from another surface", async () => {
    renderVehicle(CLEAN_VIN)
    await userEvent.click(screen.getByRole("button", { name: /request owner authorization/i }))
    getSessionStore().dispatch({
      type: "approve",
      authorizationCode: "OV-7K2M-9Q3F",
      at: new Date().toISOString(),
    })
    expect(await screen.findByText("Authorized by registered owner")).toBeInTheDocument()
    expect(screen.getByText("OV-7K2M-9Q3F")).toBeInTheDocument()
  })

  it("freezes when the owner denies", async () => {
    renderVehicle(CLEAN_VIN)
    await userEvent.click(screen.getByRole("button", { name: /request owner authorization/i }))
    getSessionStore().dispatch({ type: "deny", at: new Date().toISOString() })
    expect(await screen.findByText(/owner denied the request/i)).toBeInTheDocument()
    expect(screen.getByText("Frozen — flagged for security review")).toBeInTheDocument()
  })
})
