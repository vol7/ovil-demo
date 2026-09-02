import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMemoryRouter, RouterProvider } from "react-router"
import { describe, expect, it } from "vitest"

import { SignIn } from "./SignIn"

function renderSignIn() {
  const router = createMemoryRouter(
    [
      { path: "/", element: <SignIn /> },
      { path: "/lookup", element: <div>lookup page</div> },
    ],
    { initialEntries: ["/"] }
  )
  render(<RouterProvider router={router} />)
  return router
}

describe("SignIn", () => {
  it("shows the portal name and a sign-in form", () => {
    renderSignIn()
    expect(screen.getByRole("heading", { name: /authorized user portal/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it("navigates to /lookup on submit", async () => {
    const router = renderSignIn()
    await userEvent.type(screen.getByLabelText(/username/i), "mchen")
    await userEvent.type(screen.getByLabelText(/password/i), "secret")
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }))
    expect(router.state.location.pathname).toBe("/lookup")
    expect(screen.getByText("lookup page")).toBeInTheDocument()
  })
})
