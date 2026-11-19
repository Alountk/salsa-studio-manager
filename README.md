# salsa_studio_manager

Web application for managing a salsa dance studio's **billing**: students,
invoices, manual payments, and recurring monthly fees (cuotas) — with who pays
and who doesn't always visible at a glance.

**Scope after the billing simplification** (2026-11): the visible product is
three sections — **Inicio** (cobros dashboard), **Facturación** (invoices +
cuotas) and **Alumnos** (records, balances, history) — behind a single-admin
login. The earlier calendar/classes/marketing work remains in the tree but is
hidden: those routes redirect and no navigation links to them (spec decision:
hide, don't delete).

## Architecture

- **Next.js 16** (App Router, Server Actions, `src/proxy.ts` auth gate) +
  React 19 + Tailwind 4.
- **SQLite** via `better-sqlite3` — one file at `DATABASE_PATH`
  (`/data/studio.db` in Docker), WAL mode, plain-SQL migrations applied on
  boot (`src/lib/db/migrations/`, `PRAGMA user_version`). Repository modules
  in `src/lib/db/` with `db` as the first parameter.
- **Auth**: one admin (bcrypt), session = random token cookie whose SHA-256
  lives in SQLite, 7-day expiry, 5-attempts/minute login rate limit. No
  signup, no self-service recovery — password resets run
  `npm run change-password` (or `docker exec … pnpm change-password`).
- **Cuotas**: active recurring fees generate their monthly invoice
  idempotently at server start (`src/instrumentation.ts`) and whenever billing
  pages are read; edits affect future invoices only; billing days clamp to 1–28.
- Rendering is classic/dynamic (`cacheComponents` is off — see the note in
  `next.config.ts`): every authenticated page reads the session and the
  database per request.

## Development

```bash
pnpm install
cp .env.example .env.local      # ADMIN_EMAIL / ADMIN_PASSWORD for your dev admin
pnpm dev

pnpm test                       # Vitest unit tests (repositories, auth, form cores)
pnpm lint && pnpm typecheck && pnpm build
pnpm seed                       # demo data (8 students, 10 invoices, 3 cuotas); skips if populated
pnpm change-password -- <email> <newPassword>
```

## Deployment (Dokploy)

Dockerfile at the repo root; persistent volume at `/data`. Environment,
backup (WAL-safe) and the **restore procedure** are documented in
[docs/deploy/dokploy.md](docs/deploy/dokploy.md) — rehearse the restore once
before relying on the backup.

## Design heritage

The product was designed as three high-fidelity Google Stitch flows (access,
calendar, billing) exported under `designs/`, with the design system in
[DESIGN.md](DESIGN.md) and per-flow walkthroughs in `docs/flows/`. Billing
screens still follow those exports; the simplification removed their inert
demo affordances in favour of real data.

## Specification and plan

- Spec (approved): `docs/superpowers/specs/2026-11-18-billing-simplification-design.md`
- Implementation plan: `docs/superpowers/plans/2026-11-19-billing-simplification.md`
- Feature tracking: `odd/tasks/billing-simplification.md`

## License

[MIT](LICENSE) — © 2026 Raul Marchan Catala.
