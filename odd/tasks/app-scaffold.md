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
| 4 | Build the shared app shell (sidebar, top bar, content frame) | done | `(app)` route group + `AppShell`; 6 routes build; layout constants emitted as `:root` vars (Tailwind pruned them from `@theme`) |
| 5 | Implement the seven Design 1 routes | done | 6 routes covering 7 screens (`/` renders the three homes via `?rol=`); build 12 pages, eslint 0, tsc clean |
| 6 | Verification: lint + typecheck + build + visual spot-check | done | eslint 0 problems, tsc clean, build 12 pages; 7 screenshots at 1440px captured 200 with 0 console errors under `designs/verification/` |

Each task closes with a work-unit commit on `feat/app-scaffold`.

## Commits

| Task | Commit | Subject |
| ---- | ------ | ------- |
| 1 | `4b64572` | scaffold Next.js 16 app with TypeScript and Tailwind v4 |
| 2 | `3bf678f` | port DESIGN.md tokens into the Tailwind v4 theme |
| 3 | `a069591` | add shared UI primitives from DESIGN.md |
| 4 | `6efd1fa` | add the shared app shell and section placeholders |
| 5a | `3f6db17` | implement the Design 1 access screens |
| 5b | `be97a99` | implement the three role-aware homes and settings |
| 6 | this commit | verification artifacts and the fixes they forced |

## Defects found by verification

Each was caught by a check rather than by reading the code:

1. **Tailwind pruned the layout tokens.** `--sidebar-width`, `--topbar-height`
   and `--content-max-width` were declared in `@theme`, where no utility
   namespace matches them, so the variables were dropped before any utility
   could read them and `w-sidebar` silently generated nothing. Moved to
   `:root`, consumed as `w-[var(--sidebar-width)]`.
2. **Material Symbols never loaded.** Turbopack discards a remote
   `@import url()` from bundled CSS, so every icon rendered as its ligature
   text (`music_note`, `visibility`). Restored as a `<link>` in the root
   layout; the emitted HTML now carries it. The related
   `no-page-custom-font` warning is an App Router false positive — the root
   layout is the `_document` equivalent — suppressed with that justification.
3. **`searchParams` blocked prerender.** Next 16 refuses to read it outside a
   Suspense boundary; `/` is now a Partial Prerender with the role read in a
   streamed child.
4. **The scaffold's `.git` was copied over the repository's.** `cp -R` of a
   create-next-app output merged a fresh Git repo into ours and repointed
   `HEAD`. Recovered with no data loss: `git symbolic-ref` back to
   `feat/app-scaffold`, then an index-only `git reset --mixed HEAD`; tracked
   content was verified byte-identical to `ee8df77`.

## Notes

- Keep `designs/` as the visual reference of record; do not import HTML from it.
- `docs/flows/01-access-and-users.md` is the behavioral spec for the routes.
- The package-local binary for the native review is stale in the current Pi session
  (see previous session notes); `/reload` is required before a native review can run.
