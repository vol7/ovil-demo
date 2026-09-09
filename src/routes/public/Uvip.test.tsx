import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMemoryRouter, RouterProvider } from "react-router"
import { describe, expect, it } from "vitest"

import { getSessionStore } from "@/lib/session"
import { CLEAN_VIN, CLONED_VIN } from "@/lib/vehicles"
import { UvipBuyer } from "./UvipBuyer"
import { UvipOwner } from "./UvipOwner"

function renderAt(path: string, element: React.ReactNode) {
  const router = createMemoryRouter([{ path, element }], { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

async function enterVin(vin: string) {
  await userEvent.type(screen.getByLabelText(/vehicle identification number/i), vin)
  await userEvent.click(screen.getByRole("button", { name: /find vehicle/i }))
}

describe("UVIP owner flow", () => {
  it("rejects a vehicle with record conflicts", async () => {
    renderAt("/uvip/owner", <UvipOwner />)
    await enterVin(CLONED_VIN)
    expect(screen.getByText(/cannot be pre-approved online/i)).toBeInTheDocument()
  })

  it("walks VIN → identity → review and writes an owner pre-approval", async () => {
    renderAt("/uvip/owner", <UvipOwner />)
    await enterVin(CLEAN_VIN)
    expect(screen.getByText("2023 Mercedes-AMG GLE 63 S 4MATIC+")).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Continue" }))

    expect(
      await screen.findByRole("heading", { name: /verify your identity/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled()
    await userEvent.click(screen.getByRole("button", { name: /take photo/i }))
    expect(await screen.findByText("Verified", {}, { timeout: 3000 })).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Continue" }))

    expect(await screen.findByRole("heading", { name: /review and confirm/i })).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: /confirm and pre-approve/i }))

    expect(await screen.findByText("Pre-approval on file")).toBeInTheDocument()
    expect(getSessionStore().getState()).toMatchObject({
      vin: CLEAN_VIN,
      authorization: { status: "authorized", origin: "owner", requester: "Daniel Okafor" },
    })
  })
})

describe("UVIP buyer flow", () => {
  it("walks VIN → details → review and writes a pending buyer request", async () => {
    renderAt("/uvip/buyer", <UvipBuyer />)
    await enterVin(CLEAN_VIN)
    await userEvent.click(screen.getByRole("button", { name: "Continue" }))
    expect(await screen.findByRole("heading", { name: /your details/i })).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Continue" }))
    expect(await screen.findByRole("heading", { name: /review and send/i })).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: /send request to owner/i }))

    expect(await screen.findByText("Request sent to the owner")).toBeInTheDocument()
    expect(screen.getByText(/phone ending in 0917/i)).toBeInTheDocument()
    expect(getSessionStore().getState()).toMatchObject({
      vin: CLEAN_VIN,
      authorization: { status: "pending", origin: "buyer", requester: "Fawaz Ahmed" },
    })
  })
})
