# Billing Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the overbuilt salsa-studio manager into a login-protected billing tool: SQLite persistence for students, invoices, payments, and recurring cuotas, with the visible app trimmed to Inicio / Facturación / Alumnos.

**Architecture:** Next.js 16 App Router with Server Actions over a `better-sqlite3` repository layer (`src/lib/db/*`, first-arg `db: Database` for testability). Hand-rolled session auth: bcrypt password, random token cookie whose SHA-256 lives in SQLite, optimistic gate in `src/proxy.ts`, authoritative check in the `(app)` layout. Cuota invoices generate idempotently from `ensureDueInvoices(today)` on billing reads plus a startup hook. Hidden sections stay in the tree and redirect.

**Tech Stack:** Next.js 16.4 (App Router, Server Actions, `proxy.ts`), React 19.3, Tailwind 4, `better-sqlite3`, `bcryptjs`, `tsx`, Vitest (new).

**Spec:** `docs/superpowers/specs/2026-11-18-billing-simplification-design.md` — the plan argues from the spec; executors read both. Execution mirrors task status in `odd/tasks/billing-simplification.md` (ODD); T1–T14 below are the canonical task IDs.

## Global Constraints

- Read `node_modules/next/dist/docs/` before writing any Next code (AGENTS.md). Verified 2026-11-19: middleware is now **`src/proxy.ts`** exporting named `proxy` (`01-app/01-getting-started/16-proxy.md`). Check the instrumentation guide before Task 13's startup hook.
- Money: integer cents; **entered amounts are net**; `gross = grossOf(net)` (VAT 21%, `src/lib/billing.ts`); lists and balances display gross. Helpers `euros`, `vatOf`, `grossOf`, `STATUS_LABEL` are reused, never re-implemented.
- Dates stored as `YYYY-MM-DD` strings; displayed `dd/MM/yyyy` (existing `AdminInvoice` shape). `today` is always a parameter (`todayIso()` in `src/lib/dates.ts`), never `new Date()` deep inside logic.
- Invoice numbers `V-<year>-<4 digits>`, sequential per year, allocated inside a transaction. Status is derived, never stored: `InvoiceStatus = "paid" | "pending" | "overdue"` (labels Pagada/Pendiente/Vencida).
- UI copy Spanish; code, docs, commit messages English; Conventional Commits; no AI attribution lines.
- Single container, single admin account. Students are records only — **no student login, ever** (spec non-goal, human 2026-11-19).
- `src/lib/**` modules use relative imports internally (no `@/` alias inside `src/lib`) so `tsx` scripts and Vitest run without alias config. `src/app` and `src/components` keep the `@/` alias.
- Hidden sections (`/calendario*`, `/clases*`, `/ajustes`, `/tarifas*`, `/registro`, `/recuperar`) redirect — files are never deleted or restyled.
- Pure domain functions carry unit tests. Thin `next/headers` wrappers (cookie reads, `redirect()`) are verified by `npm run build` plus the Task 14 closure probe.
- Git: create branch `feat/billing-simplification` from current HEAD (stacks on unmerged `feat/design-3-billing`, 25 commits). One commit per task, ~400 authored lines max per commit where practical.
- Commands every task may use: `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`.

## Review Focus

Spec-implied inputs no single happy-path test covers, each pinned in its owning task:

1. **Forged, expired, or just-destroyed session token** must resolve to no session (redirect to `/login`), never render data — tests in Task 6 (`getSessionByToken`: unknown token, expired row, destroyed row).
2. **Billing day 29–31 across February and other short months** must clamp, not skip or double-generate — test in Task 4 (`nextMonthlyDate` + `ensureDueInvoices` Jan 31 → Feb 28 → Mar 31).
3. **Hidden-section redirects must not loop** (`/ajustes` logged out → `/login` once, not bounce `/` ↔ `/login`) — proxy tests in Task 8.
4. **Overpayment or same-invoice duplicate payments** must floor the balance at 0 and keep status `paid` — tests in Task 3.
5. **Sixth consecutive failed login** must be refused by the rate limiter, and a success must clear the counter — tests in Task 6.

---

### Task 1: SQLite foundation, migrations, Vitest

**Files:**
- Create: `src/lib/db/index.ts`, `src/lib/db/migrations/001-init.sql`, `vitest.config.ts`
- Modify: `package.json` (deps + scripts)
- Test: `src/lib/db/index.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces (every later task uses these exactly):
  ```ts
  // src/lib/db/index.ts
  export function openDb(path: string): Database;   // opens SQLite (WAL unless ":memory:"), runs pending migrations once
  export function getDb(): Database;                // process singleton; path = process.env.DATABASE_PATH ?? "./data/studio.db"
  ```

- [ ] **Step 1: Add deps and test script** — `npm i better-sqlite3 bcryptjs && npm i -D @types/better-sqlite3 vitest tsx`; add `"test": "vitest run"` to `package.json`.
- [ ] **Step 2: Write the failing test**

```ts
// src/lib/db/index.test.ts
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { openDb } from "./index";

describe("openDb", () => {
  it("creates all tables and applying migrations twice is a no-op", () => {
    const path = join(mkdtempSync(join(tmpdir(), "studio-db-")), "test.db");
    const db = openDb(path);
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
      .map((r) => (r as { name: string }).name);
    expect(tables).toEqual(expect.arrayContaining(
      ["users", "students", "invoices", "payments", "subscriptions", "sessions"]));
    db.close();
    openDb(path); // re-open: already-migrated file must not re-apply or throw
  });
});
```

- [ ] **Step 3: Run and see it fail** — `npm test` → FAIL (module not found).
- [ ] **Step 4: Implement** — `001-init.sql` with the six tables from spec §1 (`users`, `students`, `invoices` incl. `subscription_id`, `payments`, `subscriptions`, `sessions`; FKs `ON DELETE RESTRICT` for invoices→students). Migration runner: read `path.join(process.cwd(), "src/lib/db/migrations")`, apply files in lexical order for versions above `PRAGMA user_version`, then set it — inside a transaction per file.
- [ ] **Step 5: Run and see it pass** — `npm test` → PASS.
- [ ] **Step 6: Commit** — `feat(db): sqlite foundation with versioned migrations and vitest`

### Task 2: Students and invoices repository with derived status

**Files:**
- Create: `src/lib/dates.ts`, `src/lib/db/students.ts`, `src/lib/db/invoices.ts`
- Test: `src/lib/db/invoices.test.ts`, `src/lib/dates.test.ts`

**Interfaces:**
- Consumes: `openDb` (T1), `vatOf`/`grossOf`/`InvoiceStatus` from `src/lib/billing.ts` (relative import `../billing`).
- Produces:
  ```ts
  // src/lib/dates.ts
  export function todayIso(): string;                                  // local date YYYY-MM-DD
  export function formatEs(iso: string): string;                       // "2026-11-19" -> "19/11/2026"
  export function addDays(iso: string, days: number): string;
  export function nextMonthlyDate(fromIso: string, billingDay: number): string; // clamped 1..28 for billingDay, else day-of-month clamp
  // src/lib/db/students.ts
  export interface Student { id: number; name: string; email: string | null; phone: string | null; notes: string | null; createdAt: string }
  export interface StudentInput { name: string; email?: string; phone?: string; notes?: string }
  export function listStudents(db: Database): Student[];
  export function getStudent(db: Database, id: number): Student | null;
  export function createStudent(db: Database, input: StudentInput): Student;   // no delete exists
  export function updateStudent(db: Database, id: number, input: StudentInput): Student;
  // src/lib/db/invoices.ts
  export type InvoiceFilter = "all" | "paid" | "pending" | "overdue";
  export interface Invoice {
    id: number; number: string; studentId: number; studentName: string;
    subscriptionId: number | null; concept: string;
    netCents: number; ivaCents: number; grossCents: number;
    issueDate: string; dueDate: string;
  }
  export interface InvoiceWithStatus extends Invoice { status: InvoiceStatus; paidCents: number }
  export function listInvoices(db: Database, filter?: InvoiceFilter): InvoiceWithStatus[]; // issueDate DESC, number DESC
  export function getInvoiceByNumber(db: Database, number: string): InvoiceWithStatus | null;
  export function createManualInvoice(db: Database, input: {
    studentId: number; concept: string; netCents: number; issueDate: string; dueDate: string;
  }): Invoice;                       // iva/gross derived via vatOf/grossOf; number allocated in tx
  export function invoiceStatus(grossCents: number, dueDate: string, paidCents: number, today: string): InvoiceStatus;
  export function toAdminInvoice(inv: InvoiceWithStatus): import("../billing").AdminInvoice; // maps dates via formatEs, status verbatim
  ```

- [ ] **Step 1: Write the failing tests** — `formatEs("2026-11-19") === "19/11/2026"`; numbering: two `createManualInvoice` on 2026 → `"V-2026-0001"`, `"V-2026-0002"`; status: `invoiceStatus(12100, "2026-11-15", 0, "2026-11-10") === "pending"`, same with `today = "2026-11-16"` → `"overdue"`, `paidCents = 12100` → `"paid"`.
- [ ] **Step 2: Run and see it fail** — `npm test` → FAIL.
- [ ] **Step 3: Implement** `dates.ts` and the two repositories (no payment logic yet: `paidCents` reads `SUM(payments.amount_cents)`, always 0 until T3 — write the query now so T3 only adds writing).
- [ ] **Step 4: Run and see it pass** — `npm test` → PASS.
- [ ] **Step 5: Commit** — `feat(db): students and invoice repositories with derived status`

### Task 3: Payment recording

**Files:**
- Create: `src/lib/db/payments.ts`
- Test: `src/lib/db/payments.test.ts`

**Interfaces:**
- Consumes: `getInvoiceByNumber`, `InvoiceWithStatus` (T2).
- Produces:
  ```ts
  export interface Payment { id: number; invoiceId: number; amountCents: number; paidAt: string; note: string | null }
  export function recordPayment(db: Database, input: {
    invoiceNumber: string; amountCents: number; paidAt: string; note?: string;
  }): Payment;                          // throws PaymentError if invoice missing or amountCents <= 0
  export function listPayments(db: Database, invoiceId: number): Payment[];
  export function studentOutstandingCents(db: Database, studentId: number, today: string): number; // sum(gross - paid) over unpaid, floored at 0 per invoice
  export class PaymentError extends Error {}
  ```

- [ ] **Step 1: Write the failing tests** — invoice gross `12100`: pay `5000` → status `"pending"`, `studentOutstandingCents` `7100`; pay `7100` → `"paid"`, outstanding `0`; third payment `1000` → still `"paid"`, outstanding `0` (never negative — Review Focus 4); `recordPayment` unknown number → throws `PaymentError`.
- [ ] **Step 2: Run and see it fail** → FAIL.
- [ ] **Step 3: Implement** — insert + return; status/balance come from existing derived queries.
- [ ] **Step 4: Run and see it pass** → PASS.
- [ ] **Step 5: Commit** — `feat(db): payment recording with floored outstanding balance`

### Task 4: Cuotas (subscriptions) and idempotent generation

**Files:**
- Create: `src/lib/db/subscriptions.ts`
- Test: `src/lib/db/subscriptions.test.ts`

**Interfaces:**
- Consumes: `createManualInvoice` internals (share the same tx helper), `nextMonthlyDate` (T2).
- Produces:
  ```ts
  export type CuotaStatus = "active" | "paused" | "ended";
  export interface Subscription {
    id: number; studentId: number; studentName: string; concept: string;
    amountCents: number;           // NET cents (Global Constraints)
    billingDay: number;            // stored value clamped to 1..28 by create/update (UI rejects >28 with a friendly error)
    status: CuotaStatus; startDate: string; endDate: string | null;
    nextInvoiceDate: string; createdAt: string;
  }
  export interface SubscriptionInput { studentId: number; concept: string; amountCents: number; billingDay: number; startDate: string }
  export function listSubscriptions(db: Database): Subscription[];
  export function createSubscription(db: Database, input: SubscriptionInput): Subscription; // nextInvoiceDate = max(startDate, today-rule per billingDay)
  export function updateSubscription(db: Database, id: number,
    input: Pick<SubscriptionInput, "concept" | "amountCents" | "billingDay">): Subscription; // affects FUTURE invoices only
  export function setSubscriptionStatus(db: Database, id: number,
    status: "active" | "paused" | "ended"): Subscription;   // resume recomputes nextInvoiceDate >= today; ended sets endDate
  export function ensureDueInvoices(db: Database, today: string): { created: string[] }; // invoice numbers created
  ```

- [ ] **Step 1: Write the failing tests** (Review Focus 2 lives here):
  - Idempotency: cuota `billingDay` due `today` → `ensureDueInvoices(db, d)` twice → exactly 1 invoice with that `subscription_id`; second call returns `{ created: [] }`.
  - Pause: `status: "paused"` → run → `created: []`.
  - Future-only edit: generate month 1; `updateSubscription` amount `20000 → 25000`; generate month 2 → month-2 invoice `netCents === 25000`, month-1 invoice still `20000`.
  - Clamp: `billingDay: 31` is stored clamped to `28` → run(`"2026-01-28"`) advances `nextInvoiceDate` `"2026-01-28 → 2026-02-28 → 2026-03-28"`; `billingDay: 15` advances `"2026-01-15 → 2026-02-15 → 2026-03-15"` (also proves `nextMonthlyDate` for short months via a Feb-28 case in `dates.test.ts`).
- [ ] **Step 2: Run and see it fail** → FAIL.
- [ ] **Step 3: Implement** — one transaction per due cuota: allocate number, insert invoice (concept + amount from cuota, `issueDate = today`, `dueDate = today + 14 days` via `addDays`), advance `nextInvoiceDate = nextMonthlyDate(next, billingDay)` — advance in the same tx is the idempotency guarantee.
- [ ] **Step 4: Run and see it pass** → PASS.
- [ ] **Step 5: Commit** — `feat(billing): recurring cuotas with idempotent invoice generation`

### Task 5: Seed and change-password scripts

**Files:**
- Create: `scripts/seed.ts`, `scripts/change-password.ts`
- Modify: `package.json` (`"seed": "tsx scripts/seed.ts"`, `"change-password": "tsx scripts/change-password.ts"`)
- Test: `src/lib/db/seed.test.ts`

**Interfaces:**
- Consumes: repositories T2–T4, `hashPassword` not yet (password script lands here but uses bcryptjs directly: `bcryptjs.hashSync(pw, 10)`).
- Produces:
  ```ts
  // scripts/seed.ts exports for testability
  export function runSeed(db: Database, today: string): { students: number; invoices: number; cuotas: number };
  // scripts/change-password.ts: CLI  npx tsx scripts/change-password.ts <email> <newPassword>
  ```

- [ ] **Step 1: Write the failing test** — `runSeed` on `:memory:` with `today "2026-11-19"` → 8 students, 10 invoices (4 `paid`, 3 `pending`, 3 `overdue`), 3 cuotas (2 `active`, 1 `paused`); second `runSeed` on same db → all counts 0 (guard: exits when `students` non-empty).
- [ ] **Step 2: Run and see it fail** → FAIL.
- [ ] **Step 3: Implement** — student names reused from `ADMIN_INVOICES`/`DEBTORS` in `billing.ts`; invoices dated relative to `today` so all three statuses occur; change-password updates `users.password_hash` (error + exit 1 when email unknown).
- [ ] **Step 4: Run and see it pass** → PASS; smoke `DATABASE_PATH=./data/dev.db npm run seed` and `npm run change-password -- admin@example.com newpass123` (then log in with it in `npm run dev`).
- [ ] **Step 5: Commit** — `feat(scripts): demo seed and password reset CLI`

### Task 6: Auth core — passwords, sessions, rate limit

**Files:**
- Create: `src/lib/auth/password.ts`, `src/lib/auth/users.ts`, `src/lib/auth/session.ts`, `src/lib/auth/rate-limit.ts`, `.env.example`
- Modify: `.gitignore` (add `!.env.example` after the `.env*` line)
- Test: `src/lib/auth/auth.test.ts`

**Interfaces:**
- Consumes: T1 db.
- Produces:
  ```ts
  // password.ts
  export function hashPassword(plain: string): string;                 // bcryptjs cost 10
  export function verifyPassword(plain: string, hash: string): boolean;
  // users.ts
  export interface User { id: number; email: string; passwordHash: string }
  export function ensureAdminUser(db: Database, email: string, password: string): void; // no-op if any user exists
  export function findUserByEmail(db: Database, email: string): User | null;
  export function setPassword(db: Database, userId: number, plain: string): void;
  // session.ts
  export const SESSION_COOKIE = "studio_session";
  export const SESSION_TTL_DAYS = 7;
  export function createSession(db: Database, userId: number, now: string): string;  // returns raw token; row stores sha256 hex
  export function getSessionByToken(db: Database, token: string | undefined, now: string): { sessionId: number; userId: number } | null;
  export function destroySessionByToken(db: Database, token: string): void;
  // rate-limit.ts (module-level Map; single container)
  export function registerAttempt(key: string): { allowed: boolean };
  export function clearAttempts(key: string): void;                    // MAX_ATTEMPTS = 5 per key per minute
  ```

- [ ] **Step 1: Write the failing tests** (Review Focus 1 and 5 live here):
  - `verifyPassword("secret", hashPassword("secret")) === true`; wrong password → false.
  - `ensureAdminUser` creates once; second call with a different password leaves the original hash valid.
  - Roundtrip: `createSession` → `getSessionByToken` returns the userId; unknown token → `null`; row with `expires_at` in the past (insert directly with SQL) → `null`; after `destroySessionByToken` → `null`.
  - Rate limit: 5 × `registerAttempt("ip")` all `allowed: true`; 6th `allowed: false`; after `clearAttempts` → `true` again (Review Focus 5).
- [ ] **Step 2: Run and see it fail** → FAIL.
- [ ] **Step 3: Implement** + create `.env.example` (`DATABASE_PATH`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` — dev values only, no real secrets) and wire `getDb()` to call `ensureAdminUser` when both `ADMIN_*` vars are set.
- [ ] **Step 4: Run and see it pass** → PASS.
- [ ] **Step 5: Commit** — `feat(auth): session tokens, bcrypt passwords, and login rate limiting`

### Task 7: Login/logout flow, proxy gate, layout gate

**Files:**
- Create: `src/proxy.ts`, `src/app/(auth)/login/actions.ts`, `src/lib/auth/login-core.ts`, `src/lib/auth/guards.ts`
- Modify: `src/app/(auth)/login/page.tsx` (remove role selector, wire `useActionState`), `src/components/shell/topbar.tsx` (logout button), `src/app/(app)/layout.tsx`
- Test: `src/proxy.test.ts`, `src/lib/auth/guards.test.ts`

**Interfaces:**
- Consumes: everything in T6; `redirect` from `next/navigation`.
- Produces:
  ```ts
  // login/actions.ts
  "use server";
  export type LoginState = { error: string | null };
  export async function login(prev: LoginState, formData: FormData): Promise<LoginState>;
  // Pure core, tested: src/lib/auth/login-core.ts
  export type AttemptResult = { ok: true; userId: number } | { ok: false; error: string };
  export function attemptLogin(db: Database, email: string, password: string, key: string): AttemptResult;
  // guards.ts (thin, next/headers wrappers — build+probe verified)
  export async function requireUser(): Promise<{ userId: number }>;     // no/invalid session -> redirect("/login")
  // proxy.ts
  export function proxy(request: NextRequest): NextResponse;
  export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|ico)$).*)"] };
  ```

- [ ] **Step 1: Write the failing tests**:
  - `attemptLogin` wrong password → `{ ok: false, error: "La contraseña no es correcta" }` (copy reused from the current login page); 6th failure → `{ ok: false, error: "Demasiados intentos. Prueba de nuevo en un minuto." }`; success after `clearAttempts` path → `{ ok: true, userId }`.
  - Proxy unit tests with `new NextRequest(url, { headers })`: `/` without cookie → 307 to `/login`; `/facturacion` without cookie → `/login`; `/` with any `studio_session` cookie → allowed (no `location` header — optimistic presence check only, per Next's proxy guidance; authoritative check is `requireUser` in the layout).
- [ ] **Step 2: Run and see it fail** → FAIL.
- [ ] **Step 3: Implement** — `login()` = `attemptLogin` + on success `cookies().set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 7*24*3600 })` + `redirect("/")`; on failure return state. Login page: delete role selector, fake validation, and the demo `defaultValue="lucia.moreno@example.com"`, use `useActionState(login, { error: null })`, keep designed markup. Layout: `await requireUser()` first line. Topbar: `<form action={logoutAction}>` with `logoutAction` = `destroySessionByToken` + `redirect("/login")`, `Button` labeled "Cerrar sesión". Rate-limit key = first `x-forwarded-for` entry from `headers()`, fallback `"local"`.
- [ ] **Step 4: Run tests, lint, typecheck, build** → PASS (`npm test && npm run lint && npm run typecheck && npm run build`).
- [ ] **Step 5: Commit** — `feat(auth): login, logout, and route gating via proxy`

### Task 8: Navigation simplification and hidden-section redirects

**Files:**
- Modify: `src/lib/nav.ts`, `src/proxy.ts`, `src/components/shell/topbar.tsx` (drop `rol` arg)
- Test: `src/lib/nav.test.ts`, extend `src/proxy.test.ts`

**Interfaces:**
- Consumes: proxy from T7.
- Produces: `NAV_ITEMS` exactly `["/", "/facturacion", "/alumnos"]`; `titleForPath(pathname: string): string` (signature drops `rol`; `ROLE_TITLES` removed). Titles added: `/facturacion/cuotas` → "Cuotas", `/facturacion/nueva` → "Nueva factura", `/alumnos/nuevo` → "Nuevo alumno"; stale `/facturacion/facturas/V-2026-0184` entry removed; `/facturacion` → "Facturación".

- [ ] **Step 1: Write failing tests** — `NAV_ITEMS.map(n => n.href)` deep-equals `["/", "/facturacion", "/alumnos"]`; proxy: for each of `/calendario`, `/clases/nueva`, `/ajustes`, `/tarifas`, `/registro`, `/recuperar` — with cookie → redirect `/` (Review Focus 3: assert the target is exactly `/` or `/login`, never a loop partner); without cookie → `/login`.
- [ ] **Step 2: Run and see it fail** → FAIL.
- [ ] **Step 3: Implement** — proxy checks hidden paths *before* the general auth gate; `titleForPath` loses the role parameter; topbar call updated.
- [ ] **Step 4: Run and see it pass** → PASS; `npm run build`.
- [ ] **Step 5: Commit** — `feat(nav): trim to billing trio and redirect hidden sections`

### Task 9: Inicio — cobros dashboard

**Files:**
- Create: `src/components/home/billing-dashboard.tsx` (server component)
- Modify: `src/app/(app)/page.tsx` (replace role-home dispatch)
- Test: none new — domain logic is T2–T4 tested; verify with build (Global Constraints).

**Interfaces:**
- Consumes: `listInvoices`, `invoiceStatus` derivation via `listInvoices`, `ensureDueInvoices`, `todayIso`, existing `MetricCard`, `StatusPill`, `Button` from `@/components/ui`.
- Produces: `BillingDashboard` props: `{ kpis: { pendingCents: number; overdueCents: number; collectedMonthCents: number }; recent: InvoiceWithStatus[] }`.

- [ ] **Step 1: Implement** — page: `const db = getDb(); const today = todayIso(); ensureDueInvoices(db, today);` compute KPIs from `listInvoices(db)`, `recent` = first 8; render KPI cards + recent table (student, number, gross via `euros`, `StatusPill`) linking to `/facturacion/facturas/[numero]`. Role-home imports removed from `page.tsx` (files stay — spec non-goal).
- [ ] **Step 2: Check** — `npm run lint && npm run typecheck && npm run build` → PASS; visual check `npm run dev` shows the dashboard at `/` after login.
- [ ] **Step 3: Commit** — `feat(home): cobros dashboard replaces role homes`

### Task 10: Facturación — list, detail, new invoice, register payment

**Files:**
- Create: `src/app/(app)/facturacion/layout.tsx` (tabs: Facturas | Cuotas), `src/app/(app)/facturacion/nueva/page.tsx` + `actions.ts`, `src/app/(app)/facturacion/facturas/[numero]/page.tsx`
- Move: `src/app/(app)/facturacion/facturas/V-2026-0184/page.tsx` → `[numero]` segment (git mv, then adapt)
- Modify: `src/app/(app)/facturacion/page.tsx`, `src/components/billing/invoice-list.tsx`, `src/components/billing/invoice-document.tsx`, `src/components/billing/register-payment-modal.tsx`
- Test: `src/lib/actions/billing-actions.test.ts` (pure validation core)

**Interfaces:**
- Consumes: T2–T4 repos; `AdminInvoice` shape unchanged for list rendering.
- Produces:
  ```ts
  // invoice-list.tsx
  export function InvoiceList({ invoices }: { invoices: AdminInvoice[] });  // internal ADMIN_INVOICES read removed; markup untouched
  // invoice-document.tsx
  export function InvoiceDocument({ invoice, student, payments }: {
    invoice: InvoiceWithStatus; student: Student; payments: Payment[];
  });
  // register-payment-modal.tsx
  export function RegisterPaymentModal({ invoice }: { invoice: AdminInvoice }); // submit -> server action
  // pure validation, tested: src/lib/actions/billing-actions.ts
  export type InvoiceFormResult = { ok: true; number: string } | { ok: false; error: string };
  export function parseInvoiceForm(db: Database, form: {
    studentId: number; concept: string; netEuros: string; issueDate: string; dueDate: string;
  }, today: string): InvoiceFormResult;   // netEuros "45,50" or "45.50" -> cents; errors: "Selecciona un alumno", "El importe debe ser mayor que 0", "La fecha de vencimiento no puede ser anterior a la de emisión"
  ```

- [ ] **Step 1: Write the failing tests** for `parseInvoiceForm`: valid input → `{ ok: true, number: "V-2026-0001" }`; each error case above; `"45,50"` → `netCents 4550`.
- [ ] **Step 2: Run and see it fail** → FAIL.
- [ ] **Step 3: Implement** — `/facturacion` page: `ensureDueInvoices` + `listInvoices` → `toAdminInvoice` → `InvoiceList`; `nueva`: student `<Select>` from `listStudents`, concept, net euros (helper text shows computed IVA + total via `vatOf`/`grossOf`), issue date default `today`, due date default `addDays(today, 14)`; action `createInvoice` = `parseInvoiceForm` + `createManualInvoice` + `redirect`; `[numero]`: `getInvoiceByNumber` (not found → `notFound()`), `InvoiceDocument`, and when `0 < paidCents < grossCents` a visible line `"Pagado {euros(paidCents)} de {euros(grossCents)}"` while the status pill stays Pendiente (spec: partial payment UI), payment modal posting `recordPayment` action + `revalidatePath`; detail title falls back to prefix rule from T8.
- [ ] **Step 4: Check** — focused tests + `npm run build` → PASS; dev smoke: create invoice → detail shows → register full payment → `StatusPill` turns Pagada → reload keeps it.
- [ ] **Step 5: Commit** — `feat(billing): invoice list, detail, creation, and payment against sqlite`

### Task 11: Cuotas management UI

**Files:**
- Create: `src/app/(app)/facturacion/cuotas/page.tsx`, `.../cuotas/nueva/page.tsx`, `.../cuotas/[id]/page.tsx`, `src/app/(app)/facturacion/cuotas/actions.ts`
- Test: pure cores colocated (`parseCuotaForm`) in `src/lib/actions/cuota-actions.test.ts`

**Interfaces:**
- Consumes: T4 repository; `parseInvoiceForm`-style validation pattern from T10.
- Produces: `parseCuotaForm(db, form: { studentId; concept; netEuros; billingDay; startDate }, today)` → `{ ok: true; id } | { ok: false; error }` with errors `"Selecciona un alumno"`, `"El importe debe ser mayor que 0"`, `"El día de cobro debe estar entre 1 y 28"`. Server actions: `createCuota`, `updateCuota` (concept/netEuros/billingDay), `setCuotaStatus`.

- [ ] **Step 1: Write failing tests** — the three validation errors; valid `"50"` → `5000` cents; `billingDay 31` → error (UI hint: "Entre 1 y 28 para evitar meses raros").
- [ ] **Step 2: Run and see it fail** → FAIL.
- [ ] **Step 3: Implement** — list page: table (alumno, concepto, base `euros(amountCents)`, total `euros(grossOf(amountCents))`, día, estado pill, próxima factura) + "Nueva cuota"; edit page: form + status buttons (Pausar / Reanudar / Dar de baja) + visible note `"Los cambios solo afectan a facturas futuras."`; new/edit create actions redirect back to the list with `revalidatePath`.
- [ ] **Step 4: Check** — tests + `npm run build` → PASS; dev smoke: create cuota with billing day = today → invoice appears on Inicio immediately; pause → no new invoice next run.
- [ ] **Step 5: Commit** — `feat(billing): cuotas management UI`

### Task 12: Alumnos area

**Files:**
- Create: `src/app/(app)/alumnos/nuevo/page.tsx`, `src/app/(app)/alumnos/[id]/page.tsx`, `src/app/(app)/alumnos/actions.ts`
- Modify: `src/app/(app)/alumnos/page.tsx`
- Test: `parseStudentForm` tests (`src/lib/actions/student-actions.test.ts`)

**Interfaces:**
- Consumes: T2/T3/T4 repos (`studentOutstandingCents`, `listSubscriptions`).
- Produces: `parseStudentForm(form: { name; email; phone; notes })` → `{ ok: true } | { ok: false; error: "El nombre es obligatorio" }`; actions `createStudentAction`, `updateStudentAction`, `updateStudentCuotaAction`… no — cuota edits stay in T11 actions (single owner per file).

- [ ] **Step 1: Write failing test** — empty name → error; valid → ok (trimmed values).
- [ ] **Step 2: Run and see it fail** → FAIL.
- [ ] **Step 3: Implement** — list: name, contact, outstanding via `studentOutstandingCents` (`euros`), link to detail; `/alumnos/nuevo` form → redirect detail; `[id]`: editable fields inline (server action), invoice history table (number, dates, gross, status, paid), payments per invoice, active cuota card + "Nueva cuota" link to `/facturacion/cuotas/nueva`. No delete control anywhere (spec: no hard delete).
- [ ] **Step 4: Check** — tests + `npm run build` → PASS; dev smoke: add student → invoice → cuota → balances line up.
- [ ] **Step 5: Commit** — `feat(students): student records with balances and history`

### Task 13: Docker, Dokploy deployment, startup hook

**Files:**
- Create: `Dockerfile`, `.dockerignore`, `docs/deploy/dokploy.md`
- Modify: `next.config.ts` (`output: "standalone"`), `package.json` (`tsx` moved to `dependencies` so `docker exec` can run seed/change-password)

**Interfaces:**
- Consumes: `getDb()` bootstrap (T6), `ensureDueInvoices` (T4).
- Produces: container contract — env `DATABASE_PATH=/data/studio.db`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`; named volume mounted at `/data`; port 3000.

- [ ] **Step 1: Verify conventions** — read `node_modules/next/dist/docs/` instrumentation guide (`grep -ri instrumentation node_modules/next/dist/docs | head`). If Next 16 still runs `src/instrumentation.ts` → `register()` on server boot, create it to call `getDb()` (migrations + admin bootstrap) and `ensureDueInvoices(getDb(), todayIso())`. If not, document in `docs/deploy/dokploy.md` that generation-on-billing-read (T9/T10) is the guaranteed path and startup generation is skipped — never block the task on this.
- [ ] **Step 2: Implement Dockerfile** — multi-stage: `deps` (`npm ci` on `node:22-slim`; if `better-sqlite3` prebuild is unavailable add `python3 make g++`), `build` (`npm run build`), `runner` (copy `.next/standalone`, `.next/static`, `public/`, plus `src/lib/db/migrations` and `scripts/` + `src/lib` + `tsconfig.json` + `package.json` for exec tools; `CMD ["sh","-c","node server.js"]`). `.dockerignore`: `node_modules`, `.next`, `.git`, `designs`, `odd`, `docs`, `*.md`.
- [ ] **Step 3: Build and smoke** — `docker build -t salsa-studio .` → success; `docker run --rm -e DATABASE_PATH=/data/studio.db -e ADMIN_EMAIL=admin@example.com -e ADMIN_PASSWORD=devpass123 -p 3000:3000 -v salsa-data:/data salsa-studio` → `curl -fs localhost:3000/login` returns HTML; `curl -fs localhost:3000/` redirects to `/login`; login with admin creds works; volume file exists (`docker exec … ls -la /data`).
- [ ] **Step 4: Write `docs/deploy/dokploy.md`** — Dokploy Dockerfile provider setup, env vars (names only, no secrets), volume mount `/data`, backup command `sqlite3 /data/studio.db ".backup /backups/studio-$(date +%F).db"` (WAL-safe, runs while live), restore procedure, **and a note that the first restore must be rehearsed** (Task 14 executes it).
- [ ] **Step 5: Commit** — `feat(deploy): standalone docker image with persistent sqlite volume`

### Task 14: Closure — full verification, probe cycle, docs

**Files:**
- Modify: `README.md` (scope now: billing tool; remove "Current stage: design" framing; document env, seed, test), `odd/tasks/billing-simplification.md` (mirror final status — created at execution start)

- [ ] **Step 1: Full suite** — `npm test && npm run lint && npm run typecheck && npm run build` → all PASS; record any failure as known/pending instead of claiming success.
- [ ] **Step 2: Probe cycle against the running container** (fresh volume):
  1. `/` unauthenticated → redirected to `/login` (no data leaked).
  2. Wrong password ×6 → generic error, then rate-limit message.
  3. Correct login → dashboard; logout → session dead (`/facturacion` → `/login`).
  4. Seed via `docker exec … npm run seed`; create student; create cuota with today's billing day → invoice appears on Inicio with the next number.
  5. Register a partial payment → still Pendiente with correct remainder; complete it → Pagada; **reload → all state persists** (the spec's core promise).
  6. `/calendario`, `/tarifas`, `/registro` → redirect, no content.
  7. Backup: `docker exec … sqlite3 /data/studio.db ".backup /tmp/b.db"` → copy out; wipe volume; restore file → data returns (**restore rehearsal**, T13 doc).
- [ ] **Step 3: Update README** to the new scope and link the spec.
- [ ] **Step 4: Final commit** — `docs: reflect billing-only scope in readme` — then report: result per spec G1–G7, every failed/skipped/pending check, and the `Risk:` line (expected: **item 2 (authentication/credentials)** — name it only if the implemented auth matches the plan; otherwise `Risk: none` with reason).
