import { describe, expect, it } from "vitest"

import { createSessionStore, EMPTY_SESSION, sessionReducer, STORAGE_KEY } from "./session"

const T0 = "2026-09-04T18:14:00.000Z"

function memoryStorage() {
  const map = new Map<string, string>()
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    map,
  }
}

function fakeChannel() {
  const posted: unknown[] = []
  const ch = {
    posted,
    onmessage: null as ((e: MessageEvent) => void) | null,
    postMessage(data: unknown) {
      posted.push(data)
    },
    close() {},
  }
  return ch as unknown as BroadcastChannel & { posted: unknown[] }
}

describe("sessionReducer", () => {
  it("open sets the vin and an idle/blocked authorization", () => {
    expect(sessionReducer(EMPTY_SESSION, { type: "open", vin: "A", canRequest: true })).toEqual({
      vin: "A",
      authorization: { status: "idle" },
    })
    expect(sessionReducer(EMPTY_SESSION, { type: "open", vin: "B", canRequest: false })).toEqual({
      vin: "B",
      authorization: { status: "blocked" },
    })
  })

  it("open with the same vin keeps the current authorization", () => {
    const s = sessionReducer(EMPTY_SESSION, { type: "open", vin: "A", canRequest: true })
    const pending = sessionReducer(s, {
      type: "request",
      otp: "482 193",
      requester: "Fawaz A.",
      at: T0,
    })
    expect(sessionReducer(pending, { type: "open", vin: "A", canRequest: true })).toBe(pending)
  })

  it("open with a different vin resets authorization", () => {
    const s = sessionReducer(EMPTY_SESSION, { type: "open", vin: "A", canRequest: true })
    const pending = sessionReducer(s, {
      type: "request",
      otp: "482 193",
      requester: "Fawaz A.",
      at: T0,
    })
    expect(sessionReducer(pending, { type: "open", vin: "B", canRequest: true })).toEqual({
      vin: "B",
      authorization: { status: "idle" },
    })
  })

  it("forwards authorization actions and returns the same object when nothing changes", () => {
    const s = sessionReducer(EMPTY_SESSION, { type: "open", vin: "A", canRequest: true })
    expect(sessionReducer(s, { type: "approve", authorizationCode: "X", at: T0 })).toBe(s)
    expect(
      sessionReducer(s, { type: "request", otp: "1", requester: "F", at: T0 }).authorization.status
    ).toBe("pending")
  })

  it("preapprove sets the vin and an owner authorization that survives open for the same vin", () => {
    const s = sessionReducer(EMPTY_SESSION, {
      type: "preapprove",
      vin: "A",
      owner: "Daniel Okafor",
      authorizationCode: "OV-AAAA-BBBB",
      at: T0,
    })
    expect(s.vin).toBe("A")
    expect(s.authorization).toMatchObject({ status: "authorized", origin: "owner" })
    expect(sessionReducer(s, { type: "open", vin: "A", canRequest: true })).toBe(s)
  })

  it("buyerRequest sets the vin and a pending buyer request", () => {
    const s = sessionReducer(EMPTY_SESSION, {
      type: "buyerRequest",
      vin: "A",
      buyer: "Fawaz Ahmed",
      otp: "111 222",
      at: T0,
    })
    expect(s).toMatchObject({
      vin: "A",
      authorization: { status: "pending", origin: "buyer", requester: "Fawaz Ahmed" },
    })
  })

  it("clear returns the empty session", () => {
    const s = sessionReducer(EMPTY_SESSION, { type: "open", vin: "A", canRequest: true })
    expect(sessionReducer(s, { type: "clear" })).toEqual(EMPTY_SESSION)
  })
})

describe("createSessionStore", () => {
  it("starts empty, persists on dispatch, and broadcasts", () => {
    const storage = memoryStorage()
    const channel = fakeChannel()
    const store = createSessionStore({ storage, channel })
    expect(store.getState()).toEqual(EMPTY_SESSION)

    let notified = 0
    store.subscribe(() => notified++)
    store.dispatch({ type: "open", vin: "A", canRequest: true })

    expect(notified).toBe(1)
    expect(JSON.parse(storage.map.get(STORAGE_KEY)!)).toEqual(store.getState())
    expect(channel.posted).toHaveLength(1)
  })

  it("hydrates from storage", () => {
    const storage = memoryStorage()
    storage.setItem(STORAGE_KEY, JSON.stringify({ vin: "A", authorization: { status: "blocked" } }))
    const store = createSessionStore({ storage, channel: null })
    expect(store.getState()).toEqual({ vin: "A", authorization: { status: "blocked" } })
  })

  it("ignores corrupt storage", () => {
    const storage = memoryStorage()
    storage.setItem(STORAGE_KEY, "{nope")
    expect(createSessionStore({ storage, channel: null }).getState()).toEqual(EMPTY_SESSION)
  })

  it("applies incoming channel messages", () => {
    const channel = fakeChannel()
    const store = createSessionStore({ storage: null, channel })
    let notified = 0
    store.subscribe(() => notified++)
    const incoming = { vin: "Z", authorization: { status: "idle" } }
    channel.onmessage?.({ data: { state: incoming } } as MessageEvent)
    expect(store.getState()).toEqual(incoming)
    expect(notified).toBe(1)
  })

  it("does not notify or persist when an action is a no-op", () => {
    const storage = memoryStorage()
    const store = createSessionStore({ storage, channel: null })
    let notified = 0
    store.subscribe(() => notified++)
    store.dispatch({ type: "approve", authorizationCode: "X", at: T0 })
    expect(notified).toBe(0)
    expect(storage.map.size).toBe(0)
  })
})
