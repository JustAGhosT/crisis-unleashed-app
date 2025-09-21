# API Index

## Auth

- POST `/api/auth/reset/request` — request password reset (dev: returns token)
- POST `/api/auth/reset` — perform password reset with token
- POST `/api/auth/verify/request` — request email verification (dev: returns token)
- POST `/api/auth/verify` — confirm email verification with token
- GET/POST `/api/auth/[...nextauth]` — NextAuth handlers (login/social)

See also: `AUTH.md`

## Cards

- GET `/api/cards/search` — search cards (filters: faction, type, rarity, costMin, costMax, search, page, pageSize)
- GET `/api/cards/{cardId}` — get card details
- GET `/api/users/{userId}/cards` — user collection (placeholder)

See also: `CARDS.md`

## Decks

- GET `/api/users/{userId}/decks` — list user decks
- GET `/api/decks/{deckId}` — get deck by id
- POST `/api/decks` — create deck
- PUT `/api/decks/{deckId}` — update deck
- DELETE `/api/decks/{deckId}` — delete deck
- POST `/api/decks/share` — create short share link
- GET `/api/decks/share/{id}` — resolve share link

See also: `DECKS.md`

## Realtime

- WS `/ws` — realtime channel (see `docs/technical/REALTIME_EVENT_SCHEMA.md`)
  - `deck.subscribe`, `deck.update`, `pong`, `deck.state.update`

See also: `REALTIME.md`

## Blockchain

- GET `/api/blockchain/health` — blockchain service health
- GET `/api/blockchain/networks` — supported networks
- POST `/api/blockchain/mint` — queue mint operation
- POST `/api/blockchain/transfer` — queue transfer operation
- GET `/api/blockchain/operations/status/{outbox_id}` — operation status
- GET `/api/blockchain/operations/stats` — operations statistics
- GET `/api/blockchain/operations` — list operations (status, blockchain, limit, offset)
- GET `/api/blockchain/operations/failed` — list failed operations
- POST `/api/blockchain/operations/retry/{outbox_id}` — retry failed op

See also: `BLOCKCHAIN.md`

## Metrics

- GET `/api/metrics/realtime` — realtime server metrics (connections, messages, errors, channels)

See also: `METRICS.md`
