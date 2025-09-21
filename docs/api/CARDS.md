# Cards API

- GET `/api/cards/search`
  - Query: `faction?, type?, rarity?, costMin?, costMax?, search?, page=1, pageSize=20`
  - Returns: `{ cards: Card[], total: number, page: number, pageSize: number }`
  - Source: `CARDS_SOURCE_URL` or `CARDS_SOURCE_FILE` with TTL cache and schema validation.

- GET `/api/cards/{cardId}`
  - Returns: `Card`

- GET `/api/users/{userId}/cards`
  - Returns: `UserCard[]` (placeholder)
