# Spirit Slasher local Online backend

This is the first backend slice for Online mode. It runs on the developer PC
without third-party packages and is suitable for local/LAN testing only.

## Start it

From the project folder:

```bash
npm run server
```

Then open `http://localhost:8787`. The same server also serves the PWA files.
To let an iPhone or another computer on the same Wi-Fi connect, find this PC's
LAN IPv4 address with `ipconfig` and open `http://YOUR-LAN-IP:8787` on that
device. Windows Firewall may need an inbound rule for TCP port `8787`.

## Secure remote testing

For a player outside your home network, run this from the project folder:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-online.ps1
```

The script starts the local server, installs the official `cloudflared` package
with `winget` if needed, and opens a temporary HTTPS Quick Tunnel. Share the
printed `https://….trycloudflare.com` URL with the other player. Because the
app is served from that same URL, its Online client auto-connects to the correct
server; no Server URL typing is needed. The URL changes each time the script
starts and is for testing only. Stop it with `Ctrl+C` when finished.

Do not use a Quick Tunnel for production accounts or persistent sessions. The
repository is also ready for the configured named hostname
`https://slasher.spirituniverse.gr`:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-named-tunnel.ps1
```

That helper starts only `server/server.js`, checks `/api/health`, and starts the
already-installed `cloudflared` service if needed. It never stores a tunnel token
in Git or in the app. The GitHub Pages client defaults its Online account/lobby
requests to the named hostname; the URL can still be overridden in the lobby for
LAN or another test server.

## What is implemented

- Account registration and login with salted `scrypt` password hashes.
- Bearer-token sessions persisted locally in `server/data/db.json` (ignored by
  Git and created on first run).
- Host-created sessions for 2–4 players, join codes and character selection.
- Authoritative lobby/start state and shared movie/scene stage.
- Server-defined `sceneState` with monotonic movie/stage/revision and the last
  resolved decision, published by the active clients as they enter a scene.
- Per-player decisions. A shared decision resolves after every active player has
  submitted their own value. Personal decisions resolve for the active player,
  rotate the turn and unlock the other player after the shared scene advances.
- Sessions and turn state are persisted in `server/data/db.json`, so a refresh,
  closed tab or temporary host disconnect can be resumed with the saved code.
- Lightweight polling for lobby/avatar/pending-choice updates (the frontend uses
  a 1.5-second interval during an active game, avoiding fragile long-lived tunnel
  streams), plus a session-private chat endpoint.
- Server-Sent Events (`GET /api/sessions/:code/events`) remain available for
  compatible clients, but the browser test adapter intentionally uses polling.

The existing Single Player and Local pass-the-phone modes remain client-only.
The Online account/lobby UI and the seeded Movie I/II/III preview engine connect
to these endpoints. Each account runs its own action/outcome while the session
shares the same seed, player group and decision barriers.

Large portraits, maps, logo and audio are requested from the GitHub Pages asset
base (`https://antoniosman.github.io/spirit-slasher/`) so the local/tunnel server
handles mostly small API/session traffic.

## Useful environment variables

```bash
set PORT=8787
set HOST=0.0.0.0
set ALLOW_ORIGIN=https://slasher.spirituniverse.gr,https://antoniosman.github.io
npm run server
```

`ALLOW_ORIGIN` accepts a comma-separated list. Leave it unset during a quick
local test if you need the permissive `*` default.

Do not expose this development server directly to the public internet. For
remote testing, keep the Cloudflare named tunnel in front of it and rotate the
tunnel token immediately if it is ever pasted into chat, a screenshot or Git.
