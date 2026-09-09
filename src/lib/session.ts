import { useSyncExternalStore } from "react"

import {
  authorizationReducer,
  buyerPendingState,
  initialState,
  preapprovedState,
  type AuthorizationAction,
  type AuthorizationState,
} from "./authorization"

export type SessionState = {
  vin: string | null
  authorization: AuthorizationState
}

export type SessionAction =
  | { type: "open"; vin: string; canRequest: boolean }
  | { type: "clear" }
  | { type: "preapprove"; vin: string; owner: string; authorizationCode: string; at: string }
  | { type: "buyerRequest"; vin: string; buyer: string; otp: string; at: string }
  | AuthorizationAction

export const EMPTY_SESSION: SessionState = { vin: null, authorization: { status: "idle" } }

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "open":
      if (state.vin === action.vin) return state
      return { vin: action.vin, authorization: initialState(action.canRequest) }
    case "clear":
      return EMPTY_SESSION
    case "preapprove":
      return { vin: action.vin, authorization: preapprovedState(action) }
    case "buyerRequest":
      return { vin: action.vin, authorization: buyerPendingState(action) }
    default: {
      const next = authorizationReducer(state.authorization, action)
      return next === state.authorization ? state : { ...state, authorization: next }
    }
  }
}

export const STORAGE_KEY = "ovil-demo:session:v1"
export const CHANNEL_NAME = "ovil-demo"

type Listener = () => void

export type SessionStore = {
  getState: () => SessionState
  dispatch: (action: SessionAction) => void
  subscribe: (listener: Listener) => () => void
}

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">

function readStorage(storage: StorageLike | null): SessionState | null {
  if (!storage) return null
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<SessionState>
    if (!parsed || typeof parsed !== "object" || !parsed.authorization) return null
    return { vin: parsed.vin ?? null, authorization: parsed.authorization }
  } catch {
    return null
  }
}

function safeStorage(): StorageLike | null {
  try {
    if (typeof window === "undefined") return null
    const s = window.localStorage
    s.getItem(STORAGE_KEY)
    return s
  } catch {
    return null
  }
}

function safeChannel(): BroadcastChannel | null {
  try {
    if (typeof BroadcastChannel === "undefined") return null
    return new BroadcastChannel(CHANNEL_NAME)
  } catch {
    return null
  }
}

export function createSessionStore(
  options: { storage?: StorageLike | null; channel?: BroadcastChannel | null } = {}
): SessionStore {
  const storage = options.storage === undefined ? safeStorage() : options.storage
  const channel = options.channel === undefined ? safeChannel() : options.channel
  let state: SessionState = readStorage(storage) ?? EMPTY_SESSION
  const listeners = new Set<Listener>()

  function setState(next: SessionState) {
    if (next === state) return
    state = next
    listeners.forEach((l) => l())
  }

  function persist(next: SessionState) {
    try {
      storage?.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* storage unavailable: memory only */
    }
    try {
      channel?.postMessage({ state: next })
    } catch {
      /* channel unavailable */
    }
  }

  if (channel) {
    channel.onmessage = (event: MessageEvent<{ state?: SessionState }>) => {
      const incoming = event.data?.state
      if (incoming && incoming.authorization) setState(incoming)
    }
  }

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key !== STORAGE_KEY) return
      const incoming = readStorage(storage)
      if (incoming) setState(incoming)
    })
  }

  return {
    getState: () => state,
    dispatch(action) {
      const next = sessionReducer(state, action)
      if (next === state) return
      persist(next)
      setState(next)
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

let defaultStore: SessionStore | null = null

export function getSessionStore(): SessionStore {
  if (!defaultStore) defaultStore = createSessionStore()
  return defaultStore
}

/** Test hook: replace the singleton (pass null to reset). */
export function setSessionStore(store: SessionStore | null) {
  defaultStore = store
}

export function useSession(): [SessionState, (action: SessionAction) => void] {
  const store = getSessionStore()
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState)
  return [state, store.dispatch]
}
