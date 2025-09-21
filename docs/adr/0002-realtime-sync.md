# ADR 0002: Realtime Sync Strategy

- Status: Accepted
- Date: 2025-09-21

## Context

We need realtime synchronization for deck state and later gameplay with predictable ordering and idempotency.

## Decision

- Transport: WebSocket with exponential backoff reconnection and heartbeat.
- Server-authoritative model with per-channel sequence numbers (`seq`).
- Client sends updates with idempotency IDs; server deduplicates per channel.
- Events documented in `docs/technical/REALTIME_EVENT_SCHEMA.md`.

## Consequences

- Deterministic reconciliation on the client using server state and `seq`.
- Requires server memory for idempotency and state; suitable for dev scale.

## Alternatives Considered

- Optimistic client authority: simpler UX but complex conflict resolution.
- SSE: simpler but not bidirectional; not sufficient for game actions.
