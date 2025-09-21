# Auth API

## Password Reset

- POST `/api/auth/reset/request`
  - Body: `{ email: string }`
  - Returns: `{ ok: boolean, token?: string, expiresAt?: number }` (token only in dev)
  - Rate limit: 5 per 10 minutes (per IP+email)

- POST `/api/auth/reset`
  - Body: `{ token: string, newPassword: string }`
  - Returns: `{ ok: boolean }`

## Email Verification

- POST `/api/auth/verify/request`
  - Body: `{ email: string }`
  - Returns: `{ ok: boolean, token?: string, expiresAt?: number }` (token only in dev)
  - Rate limit: 5 per 10 minutes (per IP+email)

- POST `/api/auth/verify`
  - Body: `{ token: string }`
  - Returns: `{ ok: boolean }`

## Session / NextAuth

- GET/POST `/api/auth/[...nextauth]`
  - NextAuth route handlers (Credentials, Google, Discord)
  - JWT strategy with `authUser` embedded

## Notes

- CSRF: state-changing routes are protected via double-submit cookie; include `X-CSRF-Token` header.
- Roles: `authUser.role` embedded in JWT; middleware guards `/admin/*`.
