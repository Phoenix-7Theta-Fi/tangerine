# Tangerine Web

Dark-only React + Vite frontend for the Tangerine feed and chat demo.

## Run

```bash
pnpm install
pnpm --filter @tangerine/web dev     # http://localhost:5173
```

The API must be running (`pnpm dev:api` from the repo root). The base URL comes
from `VITE_API_URL` (default `http://localhost:3001`) — copy `.env.example` to
`.env` to override.

## What's here

- `src/lib/` — API client (`api.ts`), socket client (`socket.ts`), shared types
  (`types.ts`), formatting helpers (`format.ts`).
- `src/components/` — `Feed`, `Chat` and their pieces (`PostCard`, `Composer`,
  `SuggestedPractitioners`, `ProfileDrawer`, `MessageThread`, `Avatar`,
  `TopBar`).
- `src/App.tsx` — identity bootstrap (the mock-auth user switcher), socket
  lifecycle, and screen routing.

## Notes

- Authentication is mocked: identities are loaded from `GET /api/session/identities`
  and every request carries an `x-user-id` header. There is no login screen — it
  is intentionally out of scope for this demo.
- Realtime uses Socket.IO. The client joins a conversation room when a thread is
  opened, sends with a `clientMsgId` for idempotency, and reconciles the
  server's `message:new` event against an optimistic local message.
