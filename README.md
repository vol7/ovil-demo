# OVIL demo prototype

Clickable prototype of the OVIL clerk portal, built for screen recording two demo
scenarios. No backend, no persistence, invented data. Spec and plan live in
`docs/superpowers/`.

## Run

    npm install
    npm run dev        # http://localhost:5173

Record at 1440×900 in a clean Chrome window.

## Demo VINs

| Scenario | VIN | What happens |
| --- | --- | --- |
| 1 · Clean vehicle | `4JGFB8KB5PA812634` | All checks pass. Request owner authorization, approve from the phone. |
| 2 · Cloned VIN | `5TDEBRCH7SS041927` | Write-off, collision and duplicate identity fail. Request disabled; escalate. |

Both are listed under "Recent lookups" so you can click instead of typing.

## Demo controls

Press `Shift+D` on a vehicle page to open the hidden panel: owner approves,
owner denies, simulate 24h timeout, reset scenario. Press again to hide.

## Scripts

    npm test           # vitest
    npm run build      # tsc + vite build
    npm run lint
