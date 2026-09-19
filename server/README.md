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

## What is implemented

- Account registration and login with salted `scrypt` password hashes.
- Bearer-token sessions persisted locally in `server/data/db.json` (ignored by
  Git and created on first run).
- Host-created sessions for 2–4 players, join codes and character selection.
- Authoritative lobby/start state and shared movie/scene stage.
- Per-player decisions. A decision resolves only after every active player has
  submitted their own value, then the server broadcasts the resolved choices.
- Server-Sent Events (`GET /api/sessions/:code/events`) for live lobby and game
  updates.

The existing Single Player and Local pass-the-phone modes remain client-only.
The next integration step is to connect the Online mode UI to these endpoints
and then route the existing movie engine through the server's authoritative
decision events.

## Useful environment variables

```bash
set PORT=8787
set HOST=0.0.0.0
set ALLOW_ORIGIN=http://192.168.1.20:8787
npm run server
```

Do not expose this development server directly to the public internet. For
remote testing we will add HTTPS/auth hardening and a hosted deployment or a
secure tunnel after the LAN flow is verified.
