import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"

import "./index.css"
import { PortalShell } from "@/components/PortalShell"
import { Lookup } from "@/routes/Lookup"
import { SignIn } from "@/routes/SignIn"
import { Vehicle } from "@/routes/Vehicle"

const router = createBrowserRouter([
  { path: "/", element: <SignIn /> },
  {
    element: <PortalShell />,
    children: [
      { path: "/lookup", element: <Lookup /> },
      { path: "/vehicle/:vin", element: <Vehicle /> },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
