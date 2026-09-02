import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMemoryRouter, RouterProvider } from "react-router"
import { describe, expect, it } from "vitest"

import { CLEAN_VIN, CLONED_VIN } from "@/lib/vehicles"
import { Lookup } from "./Lookup"

function renderLookup() {
  const router = createMemoryRouter(
    [
      { path: "/lookup", element: <Lookup /> },
      { path: "/vehicle/:vin", element: <div>vehicle page</div> },
    ],
    { initialEntries: ["/lookup"] }
  )
  render(<RouterProvider router={router} />)
  return router
}

describe("Lookup", () => {
  it("rejects a malformed VIN without navigating", async () => {
    const router = renderLookup()
    await userEvent.type(screen.getByLabelText(/vin/i), "ABC123")
    await userEvent.click(screen.getByRole("button", { name: /look up/i }))
    expect(screen.getByText(/17-character VIN/i)).toBeInTheDocument()
    expect(router.state.location.pathname).toBe("/lookup")
  })

  it("reports an unknown VIN", async () => {
    renderLookup()
    await userEvent.type(screen.getByLabelText(/vin/i), "1HGCM82633A004352")
    await userEvent.click(screen.getByRole("button", { name: /look up/i }))
    expect(screen.getByText(/no record found/i)).toBeInTheDocument()
  })

  it("navigates to the vehicle for a known VIN, normalizing case", async () => {
    const router = renderLookup()
    await userEvent.type(screen.getByLabelText(/vin/i), CLEAN_VIN.toLowerCase())
    await userEvent.click(screen.getByRole("button", { name: /look up/i }))
    expect(router.state.location.pathname).toBe(`/vehicle/${CLEAN_VIN}`)
  })

  it("lists recent lookups that navigate on click", async () => {
    const router = renderLookup()
    await userEvent.click(screen.getByRole("button", { name: new RegExp(CLONED_VIN) }))
    expect(router.state.location.pathname).toBe(`/vehicle/${CLONED_VIN}`)
  })
})
