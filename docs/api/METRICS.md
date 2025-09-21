# Metrics API

- GET `/api/metrics/realtime`
  - Returns realtime server metrics: `{ connections, messages_rx, messages_tx, errors, channels, started_at }`

## Notes

- Client sends RTT/stats beacons to `/api/rum` (see RUM docs).
