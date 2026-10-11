# Flow 2 — Calendar and classes

**Question answered:** when is there a class, where, who teaches it, and how is it
created for a specific hour block?

**Audience:** the **studio admin** who owns the schedule, the **teacher** who works
their own hours and takes attendance, and the **student** who books. This is the
operational core of the product — the screens that decide whether the studio's week
actually fits together.

**Stitch project:** `Salsa Studio Manager - Calendario y clases`
(project `7073475385354350392`, design system `8b3e71b2135846a490d9c4e258d764e6`)
— **8 screens**, all inside the app shell with "Calendario" or "Clases" active in the
sidebar.

## Screen inventory

| # | Screen id | Purpose | Artifact | Stitch screen id |
| - | --------- | ------- | -------- | ---------------- |
| 1 | `01-calendario-mes` | Month overview with filters and the waitlist/unassigned rail. | `designs/02-calendario-y-clases/01-calendario-mes.html` (+ `.png`) | `866ff3b572c441cb825e35e6ae2bbe38` |
| 2 | `02-calendario-semana` | The hour grid: 56px rows, seven day columns, duration-proportional blocks. | `designs/02-calendario-y-clases/02-calendario-semana.html` (+ `.png`) | `770bca08e0dd48ffbfd63491e0e5afa1` |
| 3 | `03-detalle-clase` | Class detail drawer with price, occupancy, and the booking action. | `designs/02-calendario-y-clases/03-detalle-clase.html` (+ `.png`) | `97eaf74d69a64586a6821ea5797b252e` |
| 4 | `04-mis-reservas` | The student's own bookings, past attendance, and waitlist state. | `designs/02-calendario-y-clases/04-mis-reservas.html` (+ `.png`) | `190798207e6f4063b79619d23c4d1b5a` |
| 5 | `05-crear-clase` | The create-class-by-hours builder with live preview and conflict warning. | `designs/02-calendario-y-clases/05-crear-clase.html` (+ `.png`) | `732f1d54e0794ab98be9418b3c2e19bc` |
| 6 | `06-editor-disponibilidad` | Weekly availability for a teacher and a room, plus blackout dates. | `designs/02-calendario-y-clases/06-editor-disponibilidad.html` (+ `.png`) | `4ffdeedea57c46c58c03cbad77883dee` |
| 7 | `07-lista-y-asistencia` | Teacher roster with present/late/absent marking and totals. | `designs/02-calendario-y-clases/07-lista-y-asistencia.html` (+ `.png`) | `89db51af794f44f7924723d9cb981d61` |
| 8 | `08-mi-semana-profesor` | The teacher's own week with free-hour gaps and substitution opt-in. | `designs/02-calendario-y-clases/08-mi-semana-profesor.html` (+ `.png`) | `ba480bceaaad43ada62048ffb384cd5e` |

## Primary flow — admin builds a week

1. **`06-editor-disponibilidad`** — before anything can be scheduled, the admin
   sets what exists. With Profesor "Marcos Delgado" and Sala "Todas las salas"
   selected, the weekly grid shows available windows as terracotta-outlined blocks,
   closed hours shaded, and existing classes drawn inside with their name. The day
   headers total the hours (`6 h`, `8 h`, `—` for the closed Sunday). The right rail
   summarises "32 h disponibles por semana", "6,5 h ya programadas", "25,5 h libres",
   and lists exceptions "01/11/2026 - Festivo" and "24/12/2026 - Cierre". The admin
   finishes with "Copiar esta semana a todas" and "Guardar disponibilidad".
2. **`02-calendario-semana`** — the working view. Hour rows run 07:00–23:00 at 56px,
   day headers are sticky, and a terracotta current-time line crosses the grid. Each
   class block is positioned at its start time with a height proportional to
   duration, and carries the time range, class name, room, teacher, and occupancy
   such as `12/16`. A visible free gap at 12:00–17:00 shows a ghost "+ Añadir clase".
   The legend at the foot maps level to colour.
3. **`05-crear-clase`** — the builder, split into a 720px form and a 380px preview
   column. The admin moves through five sections:
   - **Qué clase** — "Título de la clase" `Salsa Intermedio`, "Estilo" `Salsa en
     línea`, "Nivel" `Intermedio`, "Descripción".
   - **Cuándo** — "Fecha" `martes, 13/10/2026` with a calendar, "Hora de inicio"
     `19:30`, and the duration stepper: `1 h` / `1,5 h` / `2 h` / "Personalizado".
     `1,5 h` is active, and the preview bar beneath labels the block `19:30` →
     `21:00`.
   - **Dónde y quién** — "Sala 1" and "Profesor Marcos Delgado" with avatar.
   - **Aforo y precio** — "Plazas disponibles" `16`, "Precio por clase" `15,00 €`,
     "Créditos de bono" `1`.
   - **Repetición** — "No se repite" selected, with "Semanal" plus weekday buttons
     as the alternative.

   The right column shows the block exactly as it will appear in the calendar, the
   confirmation "SIN CONFLICTOS DETECTADOS" with a teal icon, and a summary of
   "Duración 1,5 h", "Plazas 16", "Precio 15,00 €", with "Guardar como plantilla".
4. **`01-calendario-mes`** — the admin confirms the result at a glance. The month
   grid (`Octubre 2026`) carries up to three chips per day with a "+2 más" overflow;
   today's number sits in a terracotta circle. Filters above cover Sala, Profesor,
   Nivel, and a class search. The right rail lists "Listas de espera" and
   "Sin asignar" — the two queues that need a human decision. "Crear clase" is the
   primary action in the header.
5. **`02-calendario-semana`** — a selected block gains a 2px terracotta border and a
   drag handle, indicating reschedule by drag.

## Primary flow — student books a class

1. **`02-calendario-semana`** or **`01-calendario-mes`** — the student browses and
   clicks a block or chip.
2. **`03-detalle-clase`** — a 480px drawer opens over the dimmed calendar. It shows
   the level pill, teacher card (Marcos Delgado), Sala 1, `martes, 13/10/2026`,
   `19:30 - 21:00`, duration `1,5 h`, a two-line description, and the price
   comparison "Clase suelta 15,00 €" against "Con bono 1 crédito" with "Te quedan
   6 créditos". The occupancy bar reads "12 de 16 plazas" with the 4 remaining
   highlighted and the pill "Pocas plazas". Actions are "Reservar clase" (primary),
   "Entrar en lista de espera", "Añadir a mi calendario", and the policy note
   "Cancelación gratuita hasta 4 horas antes".
3. **`04-mis-reservas`** — the student sees the confirmation in their own list.
   "Próximas clases" is grouped into "Esta semana" and "Próxima semana"; each row
   offers "Reprogramar" and "Cancelar" beside a status pill (Confirmada, or Lista de
   espera). "Clases pasadas" records attendance as Presente / Ausente / Retraso, and
   the right rail summarises "18 presentes · 2 retrasos · 1 ausencia" as an 86 %
   attendance bar.

## Teacher flow

1. **`08-mi-semana-profesor`** — the teacher sees only their own week: three metrics
   ("Horas impartidas 18,5 h", "Alumnos distintos 42", "Horas libres 25,5 h"), their
   class blocks, free gaps hatched and labelled "Libre", and Sunday closed with
   "No disponible". A "Puedo sustituir" switch accepts substitution requests.
2. **`07-lista-y-asistencia`** — opening a class shows the header (Salsa Intermedio,
   `martes, 13/10/2026`, `19:30 - 21:00`, `Sala 1`, `12 de 16 plazas`) over a roster
   table: avatar and email, booking type (Bono / Suelta), payment status (Pagada /
   Pendiente), a three-way attendance control (Presente / Retraso / Ausente), and a
   note icon. The footer tallies "Presentes 10 · Retrasos 1 · Ausencias 1" with
   "Marcar todos presentes" and "Guardar asistencia".

## Alternate and edge paths

- **Room or teacher conflict** — screen 5 is designed in the *clean* state
  ("SIN CONFLICTOS DETECTADOS"). The conflicting variant is implied by the copy
  but not drawn.
- **Full class** — screen 3 shows "Pocas plazas" at 12/16; a sold-out class and its
  forced waitlist entry are not designed.
- **Drag-to-reschedule** — screen 2 implies it with the drag handle, but there is no
  confirmation, undo, or notification step for moving a class.
- **Cancelling a booking** — screen 4 exposes "Cancelar", but the confirmation
  dialog, credit refund timing, and the 4-hour cutoff enforcement are not designed.
- **Capacity overflow from a waitlist** — "Lista de espera" appears in screens 1, 3
  and 4, but no screen shows a student being promoted off the waitlist.
- **Recurring series management** — screen 5 offers "Semanal" repetition, yet there
  is no screen for editing, splitting, or cancelling an entire series.
- **Room filtering** — screen 1 filters by Sala, but there is no rooms/teachers
  administration screen anywhere in this design.

## Cross-design handoffs

- "Reservar clase" consumes a credit or charges a drop-in class — both land in
  [Flow 3 — Billing](03-billing.md) as an invoice line.
- "Siguiente pago", the credit ring, and overdue invoices link back to
  [Flow 1 — Access and users](01-access-and-users.md) for the account context.

## Open questions

1. **Conflict handling is the biggest gap.** A week-grid schedule product lives or
   dies on what happens when two bookings collide; the design only shows the happy
   message.
2. **Who may create a class?** Screen 5 is written for an admin, but screen 5's
   "Crear clase" also appears as a teacher quick action in Flow 1. Permissions are
   not resolved.
3. **Prerequisites and levels** — nothing blocks an advanced student from booking a
   beginner class, or vice versa.
4. **Room capacity versus class capacity** — screen 5 asks for "Plazas" but no
   screen states each room's maximum, so the conflict rule is ambiguous.
5. **Timezone and studio opening hours** — the grid hard-codes 07:00–23:00 with no
   configuration screen for it.
6. **Cancellation policy enforcement** — "Cancelación gratuita hasta 4 horas antes"
   is stated in screen 3 but has no designed enforcement or exception path.
