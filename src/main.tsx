import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"

import "./index.css"
import { PortalShell } from "@/components/PortalShell"
import { Cases } from "@/routes/Cases"
import { Home } from "@/routes/Home"
import { Hub } from "@/routes/Hub"
import { Lookup } from "@/routes/Lookup"
import { Phone } from "@/routes/Phone"
import { ServiceOntario } from "@/routes/public/ServiceOntario"
import { Uvip } from "@/routes/public/Uvip"
import { UvipBuyer } from "@/routes/public/UvipBuyer"
import { UvipOwner } from "@/routes/public/UvipOwner"
import { ConfirmPage } from "@/components/phone/ConfirmPage"
import { PhoneScreen } from "@/components/phone/PhoneScreen"
import { Requests } from "@/routes/Requests"
import { SignIn } from "@/routes/SignIn"
import { Vehicle } from "@/routes/Vehicle"

const router = createBrowserRouter([
  { path: "/", element: <SignIn /> },
  { path: "/demo", element: <Hub /> },
  {
    path: "/phone",
    element: <Phone />,
    children: [
      { index: true, element: <PhoneScreen /> },
      { path: "confirm", element: <ConfirmPage /> },
    ],
  },
  { path: "/serviceontario", element: <ServiceOntario /> },
  { path: "/uvip", element: <Uvip /> },
  { path: "/uvip/owner", element: <UvipOwner /> },
  { path: "/uvip/buyer", element: <UvipBuyer /> },
  {
    element: <PortalShell />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/lookup", element: <Lookup /> },
      { path: "/vehicle/:vin", element: <Vehicle /> },
      { path: "/requests", element: <Requests /> },
      { path: "/cases", element: <Cases /> },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
