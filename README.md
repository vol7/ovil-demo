# OVIL demo prototype

Clickable prototype of the OVIL clerk portal plus the registered owner's phone,
built for screen recording two demo scenarios. No backend, no persistence beyond
the browser, invented data. Specs and plans live in `docs/superpowers/`.

## Run

    pnpm install
    pnpm dev           # http://localhost:5173

## Recording

Open **http://localhost:5173/demo** (the hub, not part of the product). It opens
each surface in its own window and shows the live session:

| Surface | Route | Record at |
| --- | --- | --- |
| ServiceOntario (public) | `/serviceontario` → `/uvip` | 1440×900 |
| Clerk portal | `/` (sign-in → `/home`) | 1440×900 |
| Registered owner phone | `/phone` (thread) → `/phone/confirm` | 390×844 |

All windows share one session through `localStorage` + `BroadcastChannel`, so
a request sent from the portal or from ServiceOntario appears on the phone, and
the owner's answer on the phone updates the portal. Use the hub's **Reset
session** between takes.

## Demo VINs

| Scenario | VIN | What happens |
| --- | --- | --- |
| 1 · Clean vehicle | `4JGFB8KB5PA812634` | All checks pass. Request owner authorization; approve or deny from the phone. |
| 2 · Cloned VIN | `5TDEBRCH7SS041927` | Write-off, collision and duplicate identity fail. Request disabled; escalate. |
| 3 · Buyer pre-request | `4JGFB8KB5PA812634` | On ServiceOntario choose "Buying this vehicle", send the request; owner taps the SMS link and approves; clerk lookup shows the authorization on file. The owner can also pre-approve directly ("The registered owner"). |

Both are the first two rows under "Recent lookups" so you can click instead of typing.

## Demo controls

Press `Shift+D` on a vehicle page to open the hidden panel: owner approves,
owner denies, simulate 24h timeout, reset session. The same buttons are always
visible on `/demo`.

## Scripts

    pnpm test          # vitest
    pnpm build         # tsc + vite build
    pnpm lint
    pnpm typecheck
