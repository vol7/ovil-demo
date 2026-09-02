import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="p-6 text-sm">OVIL</main>
  </StrictMode>
)
