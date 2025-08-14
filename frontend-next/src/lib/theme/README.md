# Faction theming tokens and selection

This folder centralizes spectral faction tokens and the theme selection mechanism for the Next.js app.

## Modules

- `faction-theme.ts` — Strongly typed tokens for all factions.
- `theme-context.tsx` — `FactionThemeProvider` and `useFactionTheme()` to share the active faction.
- `use-faction-key.ts` — Consolidated selection hook.

## Tokens

See `faction-theme.ts` for the `FACTION_TOKENS` map and types:

- `mainBg` — Base page background classes.
- `glowTop`, `glowBottom` — Gradient glows for decorative layers.
- `pillBorder`, `pillBg`, `pillText`, `ring` — Accent classes.
- `svg` — Small hero badge size and variant (triangle, diamond, hex, leaf, flame, orb, gear).

## Selection order

The active faction key is resolved by `useFactionKey()` in this order:

1. Query param: `?faction=<key>`
2. Cookie: `theme:active=<key>`
3. Single feature flag: `theme:active=<key>` (string value)
4. Fallback: `default`

> Recommendation: Prefer the `theme:active` cookie or a single string flag to avoid boolean flag proliferation.

## Usage

Wrap a page with the provider or reuse the themed shell:

- Landing (`app/page.tsx`) uses `FactionThemeProvider` directly.
- Factions and Cards pages use `FactionsThemeShell` for consistent background and motion-safe glows.

SSR note: If you need SSR to honor the cookie before hydration, read `theme:active` from the request cookies in the route/page and pass it to `FactionThemeProvider` as `initial`.

## Accessibility

All decorative animations are guarded with `motion-safe:` and include `motion-reduce:` fallbacks (reduced opacity, no animation).
