import { render, screen } from "@testing-library/react"
import { createMemoryRouter, RouterProvider } from "react-router"
import { describe, expect, it } from "vitest"

import { CLEAN_VIN } from "@/lib/vehicles"
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
})
