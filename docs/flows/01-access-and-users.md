# Flow 1 — Access and users

**Question answered:** who is this person, and what does the product show them after
they prove it?

**Audience:** three roles with genuinely different needs — the **student** who wants to
book a class, the **teacher** who wants today's rosters, and the **studio admin** who
wants money and exceptions. This flow decides which of those three homes the user
lands on.

**Stitch project:** `Salsa Studio Manager - Acceso y usuarios`
(project `6775861207096503195`, design system `ef9fee23b77b4be1a75efdc46fa1d84b`)
— **7 screens**.

## Screen inventory

| # | Screen id | Purpose | Artifact | Stitch screen id |
| - | --------- | ------- | -------- | ---------------- |
| 1 | `01-inicio-sesion` | Sign in with email and password, with the failure state inline. | `designs/01-acceso-y-usuarios/01-inicio-sesion.html` (+ `.png`) | `67ac9843435a4463a3ef478be8c2dc8c` |
| 2 | `02-registro-alumno` | Create a student account, including password strength and terms acceptance. | `designs/01-acceso-y-usuarios/02-registro-alumno.html` (+ `.png`) | `bcf78897c12c4f96b8938597b944eaee` |
| 3 | `03-recuperar-contrasena` | Both halves of password recovery — request and confirmation — in one image. | `designs/01-acceso-y-usuarios/03-recuperar-contrasena.html` (+ `.png`) | `ad5b5d9f9b9449518e64b4deaa27f455` |
| 4 | `04-inicio-alumno` | Student home: the next class, the week ahead, and credit balance. | `designs/01-acceso-y-usuarios/04-inicio-alumno.html` (+ `.png`) | `4c9d10347f5d48d09309fbf88b4c3451` |
| 5 | `05-inicio-profesor` | Teacher home: today's schedule, the class needing attendance, weekly hours. | `designs/01-acceso-y-usuarios/05-inicio-profesor.html` (+ `.png`) | `61f7ef4c6fc14b59a87b69a92f293cd7` |
| 6 | `06-inicio-administracion` | Admin home: KPIs, a compact week, and an attention queue. | `designs/01-acceso-y-usuarios/06-inicio-administracion.html` (+ `.png`) | `a472dad01da94bd081ef810a1081f980` |
| 7 | `07-perfil-y-ajustes` | Account data, security, notifications, and the current membership. | `designs/01-acceso-y-usuarios/07-perfil-y-ajustes.html` (+ `.png`) | `8b54b32a63dc488dbeb34ddf8051528d` |

Screens 1–3 are entry screens and therefore use the split layout — a darkened studio
photograph on the left carrying the logotype, a 420px form column on the right. Screens
4–7 use the full app shell: 240px sidebar, 64px top bar, content on `#FAF7F4`.

## Primary flow — new student

1. **`01-inicio-sesion`** — the user has no account. They take the footer link
   "¿Aún no eres alumno? Crea tu cuenta".
2. **`02-registro-alumno`** — they fill "Nombre", "Apellidos", "Correo electrónico",
   "Teléfono" (prefixed `+34`) and a password whose strength meter reads
   "Seguridad: alta" once three of four segments fill. The terms checkbox is
   pre-checked, then they press "Crear cuenta".
3. **Role routing** — self-registration always produces the **student** role. The
   separate link "¿Eres profesor o administrador? Solicita acceso" is the only
   entry point for the other two roles, and it leaves the application rather than
   offering an inline form.
4. **`04-inicio-alumno`** — the student lands on their home. The screen greets
   "Hola, Lucía" with the subtitle "Tienes 3 clases reservadas esta semana", leads
   with the "Tu próxima clase" card (Salsa Intermedio, Marcos Delgado, Sala 1,
   martes 13/10/2026, 19:30 - 21:00, countdown "en 2 días"), shows the five-day
   "Tu semana" strip, the credit ring reading "6 de 10", and closes with "Siguiente
   pago" and "Últimas facturas".
5. **`07-perfil-y-ajustes`** — from the avatar menu the student opens settings. The
   tab strip is "Perfil", "Seguridad", "Notificaciones", "Membresía", with "Perfil"
   active: editable personal data plus a "Membresía" card repeating the plan,
   credits, and renewal date.

## Primary flow — returning user

1. **`01-inicio-sesion`** — email and password, "Recordarme" available, and
   "¿Olvidaste tu contraseña?" beside it. Pressing "Entrar" routes by role.
2. **Role routing lands on one of three screens:**
   - student → `04-inicio-alumno`
   - teacher → `05-inicio-profesor`
   - admin → `06-inicio-administracion`
3. **`05-inicio-profesor`** — greets "Buenas tardes, Marcos" and summarises "Hoy
   tienes 4 clases, 6,5 horas de clase". The "Agenda de hoy" list shows 11:00,
   17:00, 19:30 and 21:00 with room, occupancy, and a status pill. The 19:30 row is
   expanded as the class needing attention, with "Pasar lista" as the primary
   action and "Ver alumnos" beside it. The right column carries three metrics —
   "Horas esta semana 18,5" (+2,5), "Alumnos distintos 42", "Listas sin cerrar 2".
4. **`06-inicio-administracion`** — leads with "Resumen del estudio" for
   "Octubre 2026", four KPI cards (Clases este mes 184, Reservas 1.247, Ingresos
   del mes 14.320 €, Facturas pendientes 3.180 €), a compact "Semana en curso", and
   an attention queue whose three rows are an overdue invoice, an unassigned class,
   and a room conflict — each with a "Resolver" link.

## Password recovery

**`03-recuperar-contrasena`** deliberately shows both states side by side, because
the flow has no other screen:

- **State A** — "Recupera tu contraseña", the explanation "Te enviaremos un enlace
  para crear una nueva", a pre-filled email (`lucia.moreno@example.com`), and
  "Enviar enlace".
- **State B** — "Revisa tu correo", "Hemos enviado el enlace a
  lucia.moreno@example.com. Caduca en 30 minutos", a disabled "Reenviar en 45 s",
  and the return link "Volver al inicio de sesión".

## Alternate and edge paths

- **Wrong password is designed.** Screen 1 shows the failure inline: the password
  field takes a red border on an `error-container` tint with the message
  "La contraseña no es correcta". Unknown-email is *not* shown; whether login
  reveals that distinction is undecided (see Open questions).
- **The teacher/admin invite path is not designed.** Screens 1–3 contain no
  invitation acceptance, no role picker at registration, and no admin screen for
  inviting a teacher. The "Solicita access" link implies a request exists
  somewhere outside these seven screens.
- **No session-expiry, logout, or 2FA screens** exist in this design.
- **An empty student home is not designed.** Screen 4 assumes at least one booking
  and a non-zero credit ring; the no-bookings state does not exist.
- **Notification preferences are shown as two switches** on screen 7, but the
  "Notificaciones" tab behind them is not drawn.

## Cross-design handoffs

- Booking and schedule entry points ("Reservar clase", the week strip, "Ver clase")
  continue into [Flow 2 — Calendar and classes](02-calendar-and-classes.md).
- The "Últimas facturas" card, "Siguiente pago", and the "Membresía" tab continue
  into [Flow 3 — Billing](03-billing.md).
- The admin attention queue links to overdue invoices and unassigned classes, so
  it is the one screen that hands off to both sibling flows at once.

## Open questions

1. **How does an admin or teacher get an account?** "Solicita acceso" has no
   designed destination. A request form, an approval queue, and a revoke path are
   all missing.
2. **Does login reveal whether an email is registered?** The designed error is
   password-only; the product decision on account enumeration is not recorded.
3. **Is registration invitation-only?** The screen accepts anyone, but a studio
   usually has a relationship with every student before they sign up.
4. **What drives the "en 2 días" countdown** — local time, studio time, or a
   timezone setting? Nothing in the design declares a timezone.
5. **Membership cancellation** is linked from screen 7 ("Cancelar suscripción")
   but the confirmation, proration, and retention screens belong to Flow 3 and are
   not designed there either.
