-- 001-init.sql — initial schema for the billing core.
-- Money is integer cents; dates are ISO strings (YYYY-MM-DD); invoice status
-- is DERIVED at query time and intentionally has no column.

CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE students (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  notes      TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE subscriptions (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id        INTEGER NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  concept           TEXT NOT NULL,
  amount_cents      INTEGER NOT NULL CHECK (amount_cents > 0),
  billing_day       INTEGER NOT NULL CHECK (billing_day BETWEEN 1 AND 28),
  status            TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
  start_date        TEXT NOT NULL,
  end_date          TEXT,
  next_invoice_date TEXT NOT NULL,
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE invoices (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  number          TEXT NOT NULL UNIQUE,
  student_id      INTEGER NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE RESTRICT,
  concept         TEXT NOT NULL,
  net_cents       INTEGER NOT NULL CHECK (net_cents >= 0),
  iva_cents       INTEGER NOT NULL CHECK (iva_cents >= 0),
  gross_cents     INTEGER NOT NULL CHECK (gross_cents >= 0),
  issue_date      TEXT NOT NULL,
  due_date        TEXT NOT NULL
);

CREATE TABLE payments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id  INTEGER NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  paid_at     TEXT NOT NULL,
  note        TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE sessions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

CREATE INDEX idx_invoices_student ON invoices(student_id);
CREATE INDEX idx_invoices_issue_date ON invoices(issue_date DESC);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_subscriptions_student ON subscriptions(student_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);
