# Design: Simplified billing core behind an admin login

**Date**: 2026-11-18 · **Status**: approved by the human, 2026-11-19
**Repo**: salsa-studio-manager (Next.js 16, React 19, Tailwind 4, frontend-only today)

## Intent (why)

The project grew past its real purpose. The user's words: the app is "para gestionar
facturas y poco más. Y tener un registro de los que pagan y los que no", and
"nos animamos al hacer el proyecto". Three design flows exist (access, calendar,
billing), six nav sections, three role homes, and marketing pages — while every
figure on screen comes from static modules (`src/lib/billing.ts`,
`src/lib/schedule.ts`) and nothing persists.

The pivot: keep the existing code ("no hace falta borrarlo todo, pero simplifiquemos
y ocultemos lo que no queramos"), reduce the visible product to invoices plus a
record of who paid and who didn't, back it with a real SQLite database, and put a
login in front because "la web estara expuesta" (deployment: "docker con dokploy").

Added after the design review, 2026-11-18: "las cuotas deberian ser recurrentes y
revisables" — monthly fees (cuotas) that generate their invoices automatically and
stay editable.

## Goals

- **G1** Persist students, invoices, payments, and cuotas in SQLite (one file on a
  Docker persistent volume). Registering a payment survives reload and redeploy.
- **G2** Single admin account with a real login. Every visible route is reachable
  only with a valid session; `/login` is the only public page.
- **G3** Visible navigation reduced to three entries: **Inicio** (panel de cobros),
  **Facturación**, **Alumnos** — replacing the current six in `src/lib/nav.ts`.
- **G4** Calendar, Clases, Ajustes, `/tarifas`, role homes, and the signup/recovery
  pages stay in the codebase, out of the navigation, and redirect when visited.
- **G5** Invoice status is derived from recorded data: `Pagada` when recorded
  payments ≥ gross amount, `Vencida` when unpaid past `due_date`, otherwise
  `Pendiente` (same vocabulary as `STATUS_LABEL` in `src/lib/billing.ts`).
- **G6** Runs as one Docker container under Dokploy with a named volume; documented
  backup is a single-file copy (WAL-safe).
- **G7** Recurring cuotas: an active cuota generates its monthly invoice
  automatically — idempotent generation, run at server startup and whenever billing
  pages are read, no external cron — and cuotas are revisables: amount, billing
  day, pause/resume, end. Edits apply only to future invoices.

## Non-goals

- Student or teacher accounts, roles, or sessions. Students are plain data
  records the admin creates and edits ("no tienen porque ser usuarios somos
  nosotros los que creamos a los alumnos y asi asignamos los pagos", human,
  2026-11-19); nobody but the admin ever logs in. The three designed role homes
  (Design 1) stay hidden and unreferenced; role switching via `?rol=` ends.
- Calendar and classes features (Design 2) — hidden, untouched.
- Marketing `/tarifas` pages (plan cards, FAQ, checkout) — hidden, untouched.
- Email delivery of invoices and online payment gateways: payments are recorded
  manually. No tax-filing compliance beyond the Spanish IVA figures already present.
- Deleting hidden code or redesigning the visual system (`DESIGN.md` remains
  authoritative; billing screens keep matching `designs/03-facturacion/` exports).
- Multi-studio/multi-tenant support, external services (Turso, Postgres, Auth.js).
- Class packs ("bonos") and per-class charges from Design 3: only manual invoices
  and monthly cuotas survive the simplification.

## Anti-goals

- No visible route, API path, or data mutation without a valid session.
- No changes to hidden sections' behavior — hiding is navigation + redirects, not
  refactoring.
- No second persistence mechanism alongside SQLite (no JSON files, no localStorage
  fallbacks for real data).
- No duplicate invoice for the same cuota period, and no retroactive rewrite of
  already-issued invoices when a cuota changes.

## Constraints

- **Next.js 16 breaking changes**: read `node_modules/next/dist/docs/` before
  writing code (AGENTS.md) — especially auth/middleware/route-handler docs.
- **Deployment**: Docker + Dokploy on a VPS; TLS and routing handled by
  Dokploy/Traefik; volumes are persistent. SQLite therefore works as originally
  proposed — no Turso/Postgres. Single container (one writer, in-memory rate
  limit and lazy generation stay correct).
- Existing money conventions: integer cents, `euros()` formatting, `VAT_RATE`
  from `src/lib/billing.ts`.
- Existing invoice number format: `V-2026-0184` (`V-<year>-<4 digits>`).
- UI copy is Spanish; generated technical artifacts (code, docs, commit messages)
  are English.
- No test runner exists yet (`package.json` has `lint` and `typecheck` only).

## Approaches considered

| # | Approach | What it trades | Verdict |
|---|----------|----------------|---------|
| A | Trim nav to 3 entries, reframe home as cobros dashboard, hide the rest with redirects; add SQLite + login | Small rework of the home; hidden code kept intact | **Chosen** (user: "podemos ir por la A") |
| B | Single invoice-list screen, students only as a field on invoices | Fastest, but per-student payment history becomes awkward | Rejected — loses the "who pays and who doesn't" ledger feel |
| C | Same as A but sections toggled by a `features.ts` flag | Reversible hiding, extra mechanism with no current need | Rejected as default; adoptable later if a section should return |

Chosen alongside A by explicit user decision: **login** (web will be public),
**SQLite file** storage, **Docker + Dokploy** deployment, **single admin** audience
(no student logins), and **recurring, editable cuotas** (user: "las cuotas
deberian ser recurrentes y revisables").

## Design

### 1. Data layer

- `better-sqlite3` with plain SQL, no ORM. Five tables is not enough complexity to
  justify one.
- Migrations: numbered SQL files in `src/lib/db/migrations/`, applied at startup,
  tracked with `PRAGMA user_version`.
- DB path from `DATABASE_PATH` env (`./data/studio.db` dev, `/data/studio.db`
  container). WAL mode. Single container, so a single writer is guaranteed.
- Tables:
  - `users` — id, email, password_hash (bcrypt), created_at. Expected contents:
    one admin.
  - `students` — id, name, email, phone, notes, created_at.
  - `invoices` — id, number (`V-<year>-<4 digits>`, sequential per year, assigned
    in a transaction), student_id FK, **subscription_id FK (nullable — null means
    a manual invoice)**, concept, net/iva/gross cents, issue_date, due_date.
    Status is **derived**, never stored.
  - `payments` — id, invoice_id FK, amount_cents, paid_at, note. Partial payments
    are representable; UI pre-fills the full amount.
  - `subscriptions` (cuotas) — id, student_id FK, concept, amount_cents,
    billing_day (1–28), status (`active` | `paused` | `ended`), start_date,
    end_date (nullable), next_invoice_date, created_at.
  - `sessions` — id, token_hash (SHA-256), created_at, expires_at, user_id.
- **Generation** (`ensureDueInvoices(today)`): for every `active` cuota with
  `next_invoice_date ≤ today`, inside one transaction: allocate the invoice
  number, insert the invoice, advance `next_invoice_date` by one month — the
  advance in the same transaction is what makes generation idempotent. Called at
  server startup and on billing-page reads (lazy backfill replaces cron). `today`
  is a parameter so tests can drive dates.
- All access goes through a thin repository module (`src/lib/db/*.ts`). The driver
  stays swappable behind this seam — cheap insurance, even though Dokploy settled
  the storage question.
- Dev/demo seed (`npm run seed`) loads students, manual invoices, and cuotas
  derived from today's `billing.ts` mock data. A fresh production deploy starts
  empty (plus its admin).

### 2. Recurring fees (cuotas)

- A cuota is created for a student with concept, amount, and billing day
  (default: the creation day-of-month, clamped to 1–28 — builder call). While
  `active`, its invoice is generated automatically each month by
  `ensureDueInvoices`.
- **Revisables** (my interpretation of the user's word, stated so it can be
  corrected): amount, concept, billing day, pause/resume, and end are all
  editable. Any edit applies **only to future invoices**; issued invoices are
  never rewritten or regenerated, and `ended` cuotas generate nothing further.
  Pausing sets status `paused` (generation skips it); resume recomputes
  `next_invoice_date`.
- Generated invoices are ordinary invoices: derived status, editable while
  unpaid, payment registration identical to manual ones. They carry
  `subscription_id` and are labeled as cuota invoices in lists (presentation
  detail left to the builder).

### 3. Auth and session

- Hand-rolled minimal session auth instead of Auth.js: one account, no OAuth, no
  multi-tenant needs — fewer dependencies and full control over the gate. (My call
  as the designer; noted here per the design contract.)
- `/login` (already designed, `src/app/(auth)/login/page.tsx`) verifies bcrypt
  against `users`. On success: create a `sessions` row storing only the SHA-256 of
  a random 256-bit token; set cookie `httpOnly`, `secure`, `sameSite=lax`.
- Middleware gates every route except `/login`; no session → redirect to `/login`.
- Login hardening: per-IP in-memory rate limit (single container makes in-memory
  consistent), identical generic error for unknown email or wrong password.
- Logout: delete session row, clear cookie, add the control to the topbar (none
  exists today).
- Admin bootstrap: on startup, if `users` is empty, create the admin from
  `ADMIN_EMAIL` + `ADMIN_PASSWORD` env vars (stored only as bcrypt hash).
- Password change/reset: `npm run change-password` script run against the DB
  (Dokploy console or local against the volume) — because self-service recovery
  (`/recuperar`) and signup (`/registro`) are exactly what must not "se cuelen".
  Both redirect to `/login`.

### 4. Visible app

- `src/lib/nav.ts` → three entries: Inicio `/`, Facturación `/facturacion`,
  Alumnos `/alumnos`.
- **Inicio** = panel de cobros: totals pending/overdue, recent invoices, quick
  register-payment. Reuses KPI pieces from `admin-revenue.tsx`/`AdminHome`.
  Reading this page triggers `ensureDueInvoices`.
- **Facturación** = invoice list with status filters, invoice detail, create
  manual invoice, register payment — reusing `invoice-list`, `invoice-document`,
  `register-payment-modal` — plus a **Cuotas** tab: list cuotas (student, amount,
  billing day, status, next invoice date) with create/edit/pause/end. The
  hardcoded folder `facturacion/facturas/V-2026-0184/` becomes a dynamic
  `[numero]` segment.
- **Alumnos** = student list with outstanding balance per student, add/edit
  student (no hard delete while invoices exist), drill-down into that student's
  invoices, payments, and cuota.
- `/facturacion` becomes the admin invoice area (today it is the student billing
  screen or `?rol=administracion` revenue view; those role variants stop rendering).

### 5. Hidden sections

- `/calendario*`, `/clases*`, `/ajustes`, `/tarifas*`, `/registro`, `/recuperar`
  → redirect to `/` (authenticated) or `/login`. Components, lib modules, and
  design docs stay untouched in the tree.
- The role homes (`AdminHome`, `TeacherHome`, `StudentHome`) remain in the codebase
  but the new `/` no longer renders them.

### 6. Docker and Dokploy

- `next.config.ts` → `output: "standalone"`; multi-stage Dockerfile (deps → build
  → slim runtime with `.next/standalone`).
- Debian-based image (`node:*-slim`) so `better-sqlite3` uses its prebuilt
  binaries — avoid musl/alpine surprises.
- Named volume at `/data`; env `DATABASE_PATH=/data/studio.db`. Container start
  applies migrations, bootstraps the admin, runs `ensureDueInvoices`, then starts
  Next.
- Backup: `sqlite3 /data/studio.db ".backup /backups/studio-<date>.db"` (WAL-safe
  while running), scheduled or via Dokploy volume backup. The plan must include
  one restore rehearsal — an untested backup is not a backup.

### 7. Verification

- The plan adds a test runner (Vitest) plus focused tests for: status derivation,
  invoice numbering, auth gate (unauthenticated redirect), payment recording,
  cuota generation idempotency (two runs → one invoice), pause skipping months,
  and amount edits affecting only the next invoice.
- Existing `lint` and `typecheck` run at every task closure; a production build
  must pass before delivery.
- Probe the login and a full create-cuota → generate → register-payment → reload
  cycle against the running container before calling it done.

## What's left to the builder

- Reading the Next 16 docs in `node_modules/next/dist/docs/` before any code
  (middleware, Server Actions, standalone output specifics).
- Exact bcrypt package choice, session lifetime (suggested: 7 days, non-sliding),
  and rate-limit numbers.
- Migration runner mechanics and invoice-number allocation edge cases.
- Billing-day default/clamping details and period labeling on generated invoices;
  presentation of cuota vs manual invoices in lists.
- UI detail for partially paid invoices (status stays `Pendiente`; show recorded
  amount so far — call made here, presentation left to builder).
- Test setup details and the Dockerfile final shape.
