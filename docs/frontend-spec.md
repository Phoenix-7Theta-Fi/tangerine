# Tangerine Web — implementation spec (v1)

Build the `apps/web` package: a **dark-only** React + Vite + TypeScript app with
two screens, **Feed** and **Chat**, talking to the Tangerine API. No onboarding,
signup, or auth screens — identity is mocked with a user switcher.

The backend is already built and running. Do **not** modify anything outside
`apps/web/`.

## Stack & constraints

- Vite + React + TypeScript (strict). Package name `@tangerine/web`.
- Dependencies kept small: `react`, `react-dom`, `socket.io-client`. No UI kit,
  no state library, no router. Use plain CSS (one global stylesheet + CSS
  variables) or CSS modules. Hand-rolled is fine and preferred.
- Dev server on port 5173. API base from `import.meta.env.VITE_API_URL ?? 'http://localhost:3001'`.
- Must pass `pnpm build` (tsc + vite build) with no type errors.
- Dark mode only. Near-black background (#0b0b0d), elevated surfaces (#151518),
  subtle borders (#26262b), tangerine accent (#ff7a1a). Inter/system font stack.
  Rounded cards, comfortable spacing, readable at a glance. No emoji-only UI.
- Add `apps/web/.env.example` with `VITE_API_URL=http://localhost:3001`.

## Mock auth

- On load, `GET {API}/api/users?limit=50` to populate a **user switcher**
  (top bar `<select>`: `DisplayName (@handle)`).
- Persist the selected user id in `localStorage` (`tangerine.userId`). Default to
  the first user if none stored.
- Every REST call sends header `x-user-id: <selectedId>`.
- Socket connects with `io(API, { auth: { userId } })`.

## API contract (already live — do not change)

All REST paths are prefixed with `/api`. All require `x-user-id`.

- `GET /users?limit=50` → `{ items: User[], nextCursor }`
  - `User = { id, handle, displayName, avatarUrl, role, headline, region, isCelebrity, online?, isFollowing }`
- `GET /users/me` → full profile
- `GET /users/:id` → profile
- `POST /users/:id/follow` / `DELETE /users/:id/follow` → `{ following, followerCount, isCelebrity }`
- `GET /feed?limit=20&cursor=<opaque>` → `{ items: Post[], nextCursor }`
- `POST /posts` body `{ body, mediaUrl? }` → `Post`
- `GET /posts/:id` → `Post`
- `DELETE /posts/:id`
- `POST /posts/:id/like` / `DELETE /posts/:id/like` → `{ liked, likeCount }`
- `GET /posts/:id/comments` → `Comment[]`
- `POST /posts/:id/comments` body `{ body }` → `Comment`
- `GET /users/:id/posts?limit=20&cursor=` → `{ items, nextCursor }`
- `GET /conversations` → `Conversation[]`
  - `Conversation = { id, type, title, lastMessageAt, unreadCount, members: User[], lastMessage: { body, senderId, createdAt } | null }`
- `POST /conversations/direct` body `{ userId }` → `{ id, type, title, members }`
- `GET /conversations/:id/messages?limit=30&cursor=<seq>` → `{ items: Message[], nextCursor }`
- `POST /conversations/:id/messages` body `{ body, clientMsgId? }` → `Message`
- `POST /conversations/:id/read` body `{ seq }` → `{ conversationId, userId, seq }`

```
Post = { id, body, mediaUrl: string|null, createdAt: ISOstring,
         author: { id, handle, displayName, avatarUrl, role, headline, isCelebrity },
         likeCount, commentCount, shareCount, liked: boolean }
Message = { id, conversationId, senderId, body, seq, type, createdAt, clientMsgId }
Comment = { id, postId, authorId, body, createdAt, author: {...} }
```

## Socket events (server is the source of truth)

Connect: `io(API, { auth: { userId } })`.

Client → server:
- `conversation:join` `{ conversationId }` (call when opening a thread)
- `message:read` `{ conversationId, seq }`
- `typing` `{ conversationId }`
- `presence:heartbeat` (every ~30s)

Server → client:
- `message:new` `MessageDto` — append if it belongs to the open conversation; otherwise bump the conversation list.
- `read:update` `{ conversationId, userId, seq }`
- `typing:update` `{ conversationId, userId }`
- `presence:update` `{ userId, online }`

## Screens

### Feed (default)
- Top bar: app name "Tangerine", user switcher, connection indicator (socket connected).
- Composer card: textarea + "Post" button → `POST /posts`, prepend the returned post.
- Feed list: newest first. Each post: avatar, author name, `@handle`, headline,
  relative time, body, like button (optimistic toggle, shows count), comment count.
  Use `GET /feed`; "Load more" button uses `nextCursor` (keyset pagination — never offsets).
- Clicking an author opens a lightweight profile panel/drawer showing bio,
  counts, and a Follow/Following toggle, plus their posts (`GET /users/:id/posts`).
- Right rail (desktop): "Suggested practitioners" from `GET /users?role=PRACTITIONER&limit=6`
  with Follow buttons.

### Chat
- Left column: conversation list from `GET /conversations` (avatar/initials,
  title, last message preview, unread badge, relative time). Selecting a
  conversation loads messages and calls `conversation:join`.
- Right column: message thread. Own messages right-aligned, others left.
  Group by sender/time. Load older via `nextCursor`. Composer sends via socket
  `message:send` (with a `clientMsgId` you generate) and optimistically renders;
  reconcile on `message:new`/ack, dedupe by message id.
- Mark read (`message:read`) for the highest visible seq when opening/scrolling.
- Typing indicator: emit `typing` on input (throttled ~1/sec) and show
  "typing…" from `typing:update`.
- Start a new DM: pick a practitioner from the Feed suggestions or a small
  "New message" control using `POST /conversations/direct`, then open it.
- Show online dot on conversation members using `presence:update` / `online`.

## Quality bar

- Loading and empty states everywhere (skeletons or "Loading…", friendly empties).
- Errors surface as a small toast/inline message, never a blank screen.
- Relative timestamps ("3m", "2h", "Mar 4").
- Accessible: buttons are `<button>`, inputs have labels/aria, focus styles.
- Keep components in `src/components/`, API client in `src/lib/api.ts`,
  socket client in `src/lib/socket.ts`, types in `src/lib/types.ts`,
  formatting helpers in `src/lib/format.ts`.
- A short `apps/web/README.md` explaining how to run it.
