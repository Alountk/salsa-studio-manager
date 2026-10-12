# Feature: app-scaffold

## Goal

Stand up the real web application for `salsa_studio_manager` and land **Design 1
(Access and users)** as working routes rendered by the shared primitives, so the
project moves from exported design artifacts to running code.

The repository already contains the design system (`DESIGN.md`), 23 exported screen
artifacts, and three flow documents. This feature consumes them.

## Non-goals

- Designs 2 (Calendar and classes) and 3 (Billing) — separate features.
- Any backend, database, authentication provider, or payment integration. Screens
  render with static local data; wiring real services is a later feature.
- Pixel-perfect screenshot diffing in CI. Visual checks are manual spot-checks here.

## Stack decision

Chosen so the existing artifacts port with the least friction:

- **Next.js (App Router) + TypeScript** — file-system routing maps straight onto the
  23 designed screens; leaves room for server routes later.
- **Tailwind CSS v4** — the exported HTML already speaks Tailwind utility classes, so
  markup moves over nearly verbatim. Tokens move into `@theme`.
- **Google Fonts (Outfit, Inter) + Material Symbols Outlined** — exactly what the
  exported screens load, so type and iconography stay identical.

Alternative rejected: Vite + React Router. It is lighter, but Next.js buys route-level
server rendering for the eventual authenticated area at no extra decision cost.

## Acceptance criteria

1. `npm run build`, `npm run lint` and `npm run typecheck` all pass on a clean install.
2. Every token in `DESIGN.md` (colors, type scale, spacing, radius, elevation) is
   declared once in Tailwind's theme; no hard-coded hex appears in components.
3. The app shell — 240px sidebar, 64px top bar, `#faf7f4` content canvas — is shared
   by every authenticated route, not copied per page.
4. The seven Design 1 screens are reachable routes and match their exported PNG
   counterparts in structure, copy, and colour.
5. No credential is written into this repository.

## Tasks

| # | Task | Status | Evidence |
| - | ---- | ------ | -------- |
| 1 | Scaffold Next.js + TS + Tailwind v4 at the repository root; verify build | done | `next build` ✓ Next.js 16.4.0 + TS + 4 static pages; `eslint` 0 errors; `tsc --noEmit` clean |
| 2 | Port `DESIGN.md` tokens into the Tailwind theme and global styles | done | `@theme` in `globals.css` with 40 color tokens, 11 text styles, radius/shadow/focus/layout; 0 hex outside `globals.css` |
| 3 | Build the shared primitives from `DESIGN.md` §Components | done | 11 primitives in `src/components/ui/`; typecheck ✓, eslint 0, CSS output verified for every theme utility |
| 4 | Build the shared app shell (sidebar, top bar, content frame) | pending | layout component, reused by routes |
| 5 | Implement the seven Design 1 routes | pending | routes render, PNG spot-check |
| 6 | Verification: lint + typecheck + build + visual spot-check | pending | command output |

Each task closes with a work-unit commit on `feat/app-scaffold`.

## Notes

- Keep `designs/` as the visual reference of record; do not import HTML from it.
- `docs/flows/01-access-and-users.md` is the behavioral spec for the routes.
- The package-local binary for the native review is stale in the current Pi session
  (see previous session notes); `/reload` is required before a native review can run.
