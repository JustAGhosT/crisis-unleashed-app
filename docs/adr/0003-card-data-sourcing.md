# ADR 0003: Card Data Sourcing

- Status: Accepted
- Date: 2025-09-21

## Context
Card data should be fetched from a configurable source with caching and a local fallback.

## Decision
- Backend `/api/cards/search` loads from `CARDS_SOURCE_URL` (remote) or `CARDS_SOURCE_FILE` (local) with TTL (`CARDS_SOURCE_TTL`).
- Validate schema minimally (array of objects with `id`, `name`, `type`).
- Cache in in-memory DB attributes with last fetched timestamp.

## Consequences
- Flexible deployments without code changes; resilience via local/embedded fallback.
- Minimal validation prevents obviously bad payloads from poisoning cache.

## Alternatives Considered
- Direct frontend fetch from CDN: tighter coupling, CORS complexity, and no central caching.
