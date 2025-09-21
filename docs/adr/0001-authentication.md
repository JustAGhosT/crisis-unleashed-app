# ADR 0001: Authentication Strategy

- Status: Accepted
- Date: 2025-09-21

## Context

We require email/password, social login, sessions, roles, CSRF protection, and rate limiting for select routes.

## Decision

- Use NextAuth (JWT strategy) with Credentials, Google, and Discord providers.
- Embed `authUser` (id, role, etc.) in JWT; expose role in session.
- Protect routes via Next.js middleware; admin routes require role=admin.
- Implement CSRF double-submit cookie for state-changing endpoints.

## Consequences

- Middleware and client code can consistently read role claims.
- CSRF enforcement requires token issuance and header wiring in clients.

## Alternatives Considered

- Session-based strategy using server-stored sessions: more infra, less portable across edges.
