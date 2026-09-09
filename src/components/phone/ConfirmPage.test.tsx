import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMemoryRouter, RouterProvider } from "react-router"
import { describe, expect, it } from "vitest"

import { getSessionStore } from "@/lib/session"
import { CLEAN_VIN } from "@/lib/vehicles"
import { ConfirmPage } from "./ConfirmPage"

const T0 = "2026-09-04T18:14:00.000Z"

function renderConfirm() {
  const router = createMemoryRouter(
    [
      { path: "/phone/confirm", element: <ConfirmPage /> },
      { path: "/phone", element: <div>thread</div> },
    ],
    { initialEntries: ["/phone/confirm"] }
  )
  render(<RouterProvider router={router} />)
  return router
}

describe("ConfirmPage", () => {
  it("explains an inactive link when nothing is pending", () => {
    renderConfirm()
    expect(screen.getByText(/no longer active/i)).toBeInTheDocument()
  })

  it("shows the request summary and approves through the shared session", async () => {
    const store = getSessionStore()
    store.dispatch({ type: "open", vin: CLEAN_VIN, canRequest: true })
    store.dispatch({ type: "request", otp: "482 193", requester: "Fawaz A.", at: T0 })
    renderConfirm()
    expect(screen.getByText("2023 Mercedes-AMG GLE 63 S 4MATIC+")).toBeInTheDocument()
    expect(screen.getByText(/Fawaz A\. · in person at MTO Toronto Downtown/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Approve" }))
    expect(store.getState().authorization.status).toBe("authorized")
    expect(await screen.findByText("Authorization recorded")).toBeInTheDocument()
    expect(screen.getByText(/^OV-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/)).toBeInTheDocument()
  })

  it("names the buyer and declines", async () => {
    const store = getSessionStore()
    store.dispatch({ type: "buyerRequest", vin: CLEAN_VIN, buyer: "Fawaz Ahmed", otp: "1", at: T0 })
    renderConfirm()
    expect(screen.getByText(/Fawaz Ahmed · online via ServiceOntario/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Decline" }))
    expect(store.getState().authorization).toMatchObject({ status: "frozen", reason: "denied" })
    expect(await screen.findByText("Request declined")).toBeInTheDocument()
  })

  it("navigates back to the thread", async () => {
    const store = getSessionStore()
    store.dispatch({ type: "buyerRequest", vin: CLEAN_VIN, buyer: "Fawaz Ahmed", otp: "1", at: T0 })
    store.dispatch({ type: "approve", authorizationCode: "OV-AAAA-BBBB", at: T0 })
    const router = renderConfirm()
    await userEvent.click(screen.getByRole("button", { name: /back to messages/i }))
    expect(router.state.location.pathname).toBe("/phone")
  })
})
