# Decks API

- GET `/api/users/{userId}/decks` — list decks
- GET `/api/decks/{deckId}` — get deck
- POST `/api/decks` — create deck
- PUT `/api/decks/{deckId}` — update deck
- DELETE `/api/decks/{deckId}` — delete deck

## Sharing

- POST `/api/decks/share` — create short share link
  - Body: `{ deck: object }`
  - Returns: `{ id: string, url: string }`

- GET `/api/decks/share/{id}` — resolve short link
  - Returns: `{ deck: object }`
