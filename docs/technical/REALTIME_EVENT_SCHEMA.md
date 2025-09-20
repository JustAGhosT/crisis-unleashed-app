# Real-time Event Schema (v0)

This document defines the minimal event envelope and core events used by the Crisis Unleashed realtime channel.

## Envelope

```json
{
  "type": "string",   // event name (required)
  "payload": {},       // event-specific data (optional)
  "ts": 1737417600000, // client or server timestamp in ms (optional)
  "id": "uuid",       // optional idempotency key (optional)
  "v": 0               // schema version (optional, default 0)
}
```

- type: lowercase words separated by dots, e.g. "ping", "game.state.update", "player.action".
- payload: arbitrary JSON data for the event.
- ts: epoch millis when event created (client or server); used for ordering/rtt.
- id: optional idempotency key for de-duplication.
- v: event version (0 while iterating).

## Core events

- ping
  - Direction: client -> server
  - Payload: { "ts": number }
  - Response: server sends `pong` with same ts

- pong
  - Direction: server -> client
  - Payload: { "ts": number, "rtt"?: number }

- game.state.update
  - Direction: server -> client
  - Payload: {
      "gameId": string,
      "state": object, // authoritative slice or diff
      "seq": number    // monotonically increasing sequence number
    }

- player.action
  - Direction: client -> server
  - Payload: {
      "gameId": string,
      "playerId": string,
      "action": string,
      "params": object,
      "id"?: string // idempotency key
    }
  - Response: ack or error

- deck.subscribe
  - Direction: client -> server
  - Payload: { "deckId": string, "id"?: string }
  - Response: `deck.state.update`

- deck.update
  - Direction: client -> server
  - Payload: { "deckId": string, "action": "add"|"remove"|"clear", "cardId"?: string, "id": string }
  - Response: `ack` then broadcast `deck.state.update`

- ack
  - Direction: server -> client
  - Payload: { "event": string, "ok": boolean, "id"?: string }

- error
  - Direction: server -> client
  - Payload: { "code": string, "message": string, "id"?: string }

## Transport

- Primary: WebSocket `/ws`
- Reconnection: client exponential backoff with jitter
- Heartbeat: client `ping` every 15s; server responds with `pong`
- Idempotency: clients MUST send unique `id` per update to avoid duplicates; server keeps a short-lived `id` set per deck channel
- Ordering: server maintains `seq` and includes it in `deck.state.update`

## Idempotency and ordering (draft)

- Clients SHOULD attach `id` to `player.action` to enable safe retries
- Servers SHOULD process actions in order per `gameId` and `playerId`
