import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMemoryRouter, RouterProvider } from "react-router"
import { describe, expect, it } from "vitest"

import { getSessionStore } from "@/lib/session"
import { CLEAN_VIN } from "@/lib/vehicles"
import { PhoneScreen } from "./PhoneScreen"

const T0 = "2026-09-04T18:14:00.000Z"

function openPending() {
  const store = getSessionStore()
  store.dispatch({ type: "open", vin: CLEAN_VIN, canRequest: true })
  store.dispatch({ type: "request", otp: "482 193", requester: "Fawaz A.", at: T0 })
  return store
}

function renderPhone() {
  const router = createMemoryRouter(
    [
      { path: "/phone", element: <PhoneScreen /> },
      { path: "/phone/confirm", element: <div>confirm page</div> },
    ],
    { initialEntries: ["/phone"] }
  )
  render(<RouterProvider router={router} />)
  return router
}

describe("PhoneScreen", () => {
  it("shows only the older context message while nothing is requested", () => {
    renderPhone()
    expect(screen.getByRole("region", { name: /registered owner/i })).toBeInTheDocument()
    expect(screen.getByText(/registration for plate/i)).toBeInTheDocument()
    expect(screen.queryByText(/used vehicle information package/i)).not.toBeInTheDocument()
  })

  it("shows the request with a link that opens the confirm page", async () => {
    openPending()
    const router = renderPhone()
    expect(
      screen.getByText(/2023 Mercedes-AMG GLE 63 S 4MATIC\+ \(plate CKXR 214\)/)
    ).toBeInTheDocument()
    const link = screen.getByRole("button", { name: "ovil.on.ca/c/482193" })
    await userEvent.click(link)
    expect(router.state.location.pathname).toBe("/phone/confirm")
  })

  it("names the buyer when the request came from ServiceOntario", () => {
    getSessionStore().dispatch({
      type: "buyerRequest",
      vin: CLEAN_VIN,
      buyer: "Fawaz Ahmed",
      otp: "111 222",
      at: T0,
    })
    renderPhone()
    expect(screen.getByText(/online by Fawaz Ahmed/)).toBeInTheDocument()
  })

  it("shows the confirmation bubble with the reference once authorized", () => {
    const store = openPending()
    store.dispatch({ type: "approve", authorizationCode: "OV-7K2M-9Q3F", at: T0 })
    renderPhone()
    expect(screen.getByText("OV-7K2M-9Q3F")).toBeInTheDocument()
    expect(screen.getByText(/authorization has been recorded/i)).toBeInTheDocument()
  })

  it("shows the declined bubble after a denial and keeps the original link", () => {
    const store = openPending()
    store.dispatch({ type: "deny", at: T0 })
    renderPhone()
    expect(screen.getByText(/request was declined/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "ovil.on.ca/c/482193" })).toBeInTheDocument()
  })

  it("shows nothing new for an owner pre-approval (no SMS was sent)", () => {
    getSessionStore().dispatch({
      type: "preapprove",
      vin: CLEAN_VIN,
      owner: "Daniel Okafor",
      authorizationCode: "OV-AAAA-BBBB",
      at: T0,
    })
    renderPhone()
    expect(screen.queryByText(/used vehicle information package/i)).not.toBeInTheDocument()
  })
})
