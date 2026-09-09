# OVIL demo prototype

Clickable prototype of the OVIL clerk portal plus the registered owner's phone,
built for screen recording two demo scenarios. No backend, no persistence beyond
the browser, invented data. Specs and plans live in `docs/superpowers/`.

## Run

    pnpm install
    pnpm dev           # http://localhost:5173

## Recording

Open **http://localhost:5173/** (the hub, not part of the product). It opens
each surface in its own window and shows the live session:

| Surface | Route | Record at |
| --- | --- | --- |
| ServiceOntario (public) | `/serviceontario` → `/uvip` | 1440×900 |
| Clerk portal | `/portal` (sign-in → `/portal/home`) | 1440×900 |
| Registered owner phone | `/phone` (thread) → `/phone/confirm` | 390×844 |

All windows share one session. `localStorage` is the single source of truth,
keyed by VIN, and windows only ping each other to re-read it, so browsing never
changes state and several vehicles can hold state at once. The phone follows the
most recent request. Use the hub's **Reset session** between takes, or **Force
state** to jump straight to one beat. Illegal transitions are logged to the
console in dev as `[ovil] ignored …`.

The shot list is `docs/screenplay.md`. Title cards and the final cut are a
Remotion project in `video/` (see `video/README.md`): drop CleanShot exports
into `video/public/clips/` and render.

## ServiceOntario page

`public/serviceontario/` is a browser save of https://www.ontario.ca/page/serviceontario
(Sept 9, 2026) with all scripts removed, the theme's fonts and images mirrored
under `theme/`, and two additions: a "Get a Used Vehicle Information Package
(UVIP)" card leading Popular services, and a matching link in the Vehicles
column. Both point at `/uvip`. A small Vite middleware serves it at
`/serviceontario/` instead of the React app. The UVIP form pages reuse the
theme's fonts and colours so the hand-off feels continuous.

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

## Hosting

`vercel.json` and `public/_redirects` route `/serviceontario` to the static page
and everything else to the app, so a one-shot deploy on Vercel or Netlify
behaves like `pnpm dev`. Session sync is per browser profile, so open every
surface from the same browser and not from an incognito window.

## Scripts

    pnpm test          # vitest
    pnpm build         # tsc + vite build
    pnpm lint
    pnpm typecheck
