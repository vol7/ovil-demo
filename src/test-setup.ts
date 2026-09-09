import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach, beforeEach } from "vitest"

import { createSessionStore, setSessionStore } from "@/lib/session"

// Fresh, in-memory session per test so state never leaks between files.
beforeEach(() => {
  setSessionStore(createSessionStore({ storage: null, channel: null }))
})

afterEach(() => {
  cleanup()
  setSessionStore(null)
})
