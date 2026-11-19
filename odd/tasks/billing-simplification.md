# Feature: billing-simplification

**Objective**: Pivot the overbuilt salsa-studio-manager into a login-protected billing tool — SQLite persistence, 3 visible sections (Inicio/Facturación/Alumnos), recurring editable cuotas — hiding (not deleting) everything else.
**Branch**: `feat/billing-simplification` (from `feat/design-3-billing` @ 8c3ab8f) · **Delivery**: ask-on-risk — no git remote configured; chain strategy is asked before the first push/PR (ledger ruling, setup) · **Test runner**: `npm test` (Vitest, added in T1) · **Spec**: `docs/superpowers/specs/2026-11-18-billing-simplification-design.md` · **Plan**: `docs/superpowers/plans/2026-11-19-billing-simplification.md`

## Specs

**S1 — Persistence.** The user: "si, podriamos hacer una base de datos con sqlite, creia que lo habiamos hecho ya." Students, invoices, payments, and cuotas live in a SQLite file (`DATABASE_PATH`, WAL). Acceptance: registering a payment survives reload and redeploy. Checks: T1–T4 unit tests; T14 probe step 5.

**S2 — Simplify and hide, don't delete.** The user: "no hace falta borrarlo todo, pero simplifiquemos y ocultemos lo que no queramos." Nav reduced to `/`, `/facturacion`, `/alumnos`; `/calendario*`, `/clases*`, `/ajustes`, `/tarifas*`, `/registro`, `/recuperar` redirect; their files stay untouched. Acceptance: hidden URLs return redirects, no content. Checks: T8 nav + proxy tests; T14 probe step 6.

**S3 — Core purpose.** The user: "gestionar facturas y poco más. Y tener un registro de los que pagan y los que no." Invoice list/detail/create plus payment registration with derived status (`Pagada`/`Pendiente`/`Vencida`), balances floored at 0, per-student history. Checks: T2/T3 tests; T10/T12 build + dev smoke.

**S4 — Admin login.** The user: "podemos ir por la A pero con Login para que no se cuele nadie ya que la web estara expuesta." Single admin account (bcrypt), 7-day session cookie (SHA-256 in DB), optimistic proxy gate + authoritative `requireUser()` in the layout, per-IP rate limit (5/min), no signup or self-service recovery (script instead). Acceptance: every visible route redirects to `/login` without a session; 6th failed attempt refused. Checks: T6/T7 tests; T14 probes 1–3.

**S5 — Deployment.** The user: "docker con dokploy." Standalone Next build, Debian-based image, named volume at `/data`, env `DATABASE_PATH`/`ADMIN_EMAIL`/`ADMIN_PASSWORD`, WAL-safe backup + rehearsed restore. Checks: T13 build/run smoke; T14 probe step 7.

**S6 — Recurring, revisable cuotas.** The user: "a ver las cuotas deberian ser recurrentes y revisables." Active cuota generates its monthly invoice idempotently (`ensureDueInvoices`, generation at startup + billing reads); amount/concept/billing day/pause/end editable, **future invoices only**; issued invoices never rewritten; billing day clamped 1–28. Checks: T4 tests (idempotency, pause, future-only edit, clamp); T11 tests + smoke.

**S7 — Students are records, never users.** The user: "no tienen porque ser usuarios somos nosotros los que creamos a los alumnos y asi asignamos los pagos y etc..." Admin creates/edits students from Alumnos; no student login exists anywhere; no hard delete while invoices exist. Checks: T12 tests + build; no auth path for students in T6/T7 tests.

## Tasks

Route: **inline** for all tasks (executing-plans; `subagent` tool permission-denied in this runtime — ledgered at setup).

| ID | S# | Task | Route | Status | Commit |
|----|----|------|-------|--------|--------|
| T1 | S1 | SQLite foundation, migrations, Vitest | inline | done | c8f9d3a |
| T2 | S1, S3 | Students + invoices repository, derived status | inline | done | e9a40b6 |
| T3 | S1, S3 | Payment recording, floored balance | inline | done | 790a39c |
| T4 | S1, S6 | Cuotas + idempotent generation | inline | done | 5c8ac14 |
| T5 | S3 | Seed + change-password scripts | inline | done | 2d4d091 |
| T6 | S4 | Auth core: passwords, sessions, rate limit | inline | done | a3f9f3f |
| T7 | S4 | Login/logout, proxy gate, layout gate | inline | done | f4c18e2 |
| T7b | S4, S5 | Next 16.4.6 security upgrade (2 critical RCE + 1 high DoS advisories; user: "dale") | inline | done | da9b1aa |
| T8 | S2 | Nav trim + hidden-section redirects | inline | done | fd931e9 |
| T9 | S3 | Inicio cobros dashboard | inline | done | 0972cdb |
| T10 | S3 | Facturación: list, detail, create, payment | inline | done | 866d956 |
| T11 | S6 | Cuotas management UI | inline | done | 903cb13 |
| T12 | S7 | Alumnos area | inline | done | d1554c6 |
| T13 | S5 | Docker + Dokploy + startup hook | inline | pending | — |
| T14 | S1–S7 | Closure: full suite, probe cycle, README | inline | pending | — |

## Log

**L1 (2026-11-18, original request, verbatim):** "analiza el proyecto, y planifica un simplificador, creo que nos animamos al hacer el proyecto, cuando realmente es para gestionar facturas y poco más. Y tener un registro de los que pagan y los que no. no hace falta borrarlo todo, pero simplifiquemos y ocultemos lo que no queramos. Que me recomiendas?"

**L2 (2026-11-18):** User: "si, podriamos hacer una base de datos con sqlite, creia que lo habiamos hecho ya." Verified: no DB existed (no deps, no .db files, no schema) — mock data only.

**L3 (2026-11-18):** Approaches A/B/C presented; user: "podemos ir por la A pero con Login para que no se cuele nadie ya que la web estara expuesta."

**L4 (2026-11-18):** Hosting question; user: "docker con dokploy" → SQLite file on named volume confirmed (no Turso/Postgres).

**L5 (2026-11-19):** Builder-check question on billing model; user: "a ver las cuotas deberian ser recurrentes y revisables." Design updated (G7, subscriptions table, ensureDueInvoices).

**L6 (2026-11-19):** Design approved — "parece que esta bien, como controlamos los alumnas, no tienen porque ser usuarios somos nosotros los que creamos a los alumnos y asi asignamos los pagos y etc..." → S7 added to spec, doc marked approved.

**L7 (2026-11-19):** Plan written and self-reviewed (7 fixes); user chose native execution: "me parece bien, arranca."

**L8 (2026-11-19, rulings):** In-place branch instead of worktree; delivery-strategy ask deferred to first push/PR (no remote configured); subagent-based execution unavailable (permission denied) → inline route for T1–T14. See `.superpowers/sdd/2026-11-19-billing-simplification/progress.md` ledger for pre-flight interface rows and per-task rulings.

**L9 (2026-11-19):** Next's build stopped with a security nudge: `pnpm audit` showed 2 critical unauthenticated RCEs in next 16.4.0 (GHSA-2464-fhr4-w9xw, GHSA-673q-mjm6-r5xr) patched at ≥16.4.1, plus 1 high DoS; latest is 16.4.6. User decision, verbatim: "dale" → upgraded to 16.4.6 as task T7b; audit clean, 36/36 tests, lint, typecheck, and build all green on the new version.
