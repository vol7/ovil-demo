import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMemoryRouter, RouterProvider } from "react-router"
import { describe, expect, it } from "vitest"

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
    expect(screen.getByText("D***** O*****")).toBeInTheDocument()
    expect(screen.getAllByText("CKXR 214").length).toBeGreaterThan(0)
    expect(screen.getByText("31 240 km")).toBeInTheDocument()
    expect(screen.getByText("April 18, 2023")).toBeInTheDocument()
  })

  it("shows not-found for an unknown VIN with a way back", () => {
    renderVehicle("1HGCM82633A004352")
    expect(screen.getByText(/no record found/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /back to lookup/i })).toHaveAttribute(
      "href",
      "/lookup"
    )
  })

  it("starts idle for the clean vehicle and moves to pending on request", async () => {
    renderVehicle(CLEAN_VIN)
    await userEvent.click(screen.getByRole("button", { name: /request owner authorization/i }))
    expect(screen.getByText("Request sent to registered owner")).toBeInTheDocument()
  })

  it("starts blocked for the cloned vehicle and can escalate", async () => {
    renderVehicle(CLONED_VIN)
    expect(screen.getByRole("button", { name: /request owner authorization/i })).toBeDisabled()
    await userEvent.click(screen.getByRole("button", { name: /escalate/i }))
    expect(screen.getByText("Escalated for review")).toBeInTheDocument()
    expect(screen.getByText(/^OVIL-\d{4}-\d{2}-\d{2}-\d{4}$/)).toBeInTheDocument()
  })
})
