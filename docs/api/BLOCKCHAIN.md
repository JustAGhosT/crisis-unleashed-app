# Blockchain API

- GET `/api/blockchain/health` — service health
- GET `/api/blockchain/networks` — supported networks

## Operations

- POST `/api/blockchain/mint` — queue mint operation
- POST `/api/blockchain/transfer` — queue NFT transfer

## Status & Monitoring

- GET `/api/blockchain/operations/status/{outbox_id}` — operation status
- GET `/api/blockchain/operations/stats` — operations statistics
- GET `/api/blockchain/operations` — list operations (filters: `status`, `blockchain`, `limit`, `offset`)
- GET `/api/blockchain/operations/failed` — list failed operations
- POST `/api/blockchain/operations/retry/{outbox_id}` — retry failed op
