# Realtime API

- WS `/ws` — WebSocket endpoint
  - Heartbeat: client `ping` with `ts`; server replies `pong` with `ts`
  - Deck events:
    - `deck.subscribe` `{ deckId }`
    - `deck.update` `{ deckId, action: add|remove|clear, cardId?, id }`
    - Server broadcasts `deck.state.update` `{ deckId, state, seq }`

## Monitoring

- Client beacons RTT and stats to `/api/rum`
- Server metrics available at `GET /api/metrics/realtime`
