# Feature: design-2-calendar

## Goal

Implement Design 2 — Calendar and classes — as working routes on top of the
existing app shell: the month and week calendars over the hour grid, the class
detail and booking drawer, the student's own bookings, the create-class-by-hours
builder with its live preview and conflict check, the availability editor, and
the teacher's roster, attendance and week.

Spec of record: `scripts/design-plan.mjs` (the eight screen prompts), the exported
screens in `designs/02-calendario-y-clases/`, and `docs/flows/02-calendar-and-classes.md`.

## Non-goals

- Real scheduling logic: conflict detection, capacity enforcement, recurrence
  expansion and drag-to-reschedule are presented as designed states over static
  data. Making them work is a backend feature.
- Designs 1 and 3 changes, and any student-profile screen (Design 2 designs none).
- Mobile: every screen is desktop, as DESIGN.md specifies for staff surfaces.

## Route mapping

The sidebar keeps its six entries; these screens live underneath them.

| Screen | Route |
| ------ | ----- |
| `01-calendario-mes` | `/calendario` (default segment) |
| `02-calendario-semana` | `/calendario?vista=semana` |
| `03-detalle-clase` | `/calendario?clase=<id>` — drawer over the dimmed grid |
| `04-mis-reservas` | `/calendario/mis-reservas` |
| `05-crear-clase` | `/clases/nueva` |
| `06-editor-disponibilidad` | `/clases/disponibilidad` |
| `07-lista-y-asistencia` | `/clases/lista` |
| `08-mi-semana-profesor` | `/clases/mi-semana` |

**One IA call to record:** Design 2 has no "Clases" index screen, yet the sidebar
has a `Clases` entry that must lead somewhere once its four screens exist. `/clases`
becomes a navigation index of those four — deliberately labelled as navigation, not
as a designed screen. The alternative, leaving the sidebar pointing at the current
placeholder, is worse: the shell would advertise four screens it cannot reach.

## Acceptance criteria

1. `npm run lint`, `npm run typecheck` and `npm run build` pass; no hex literal in
   `src/` outside `src/app/globals.css`.
2. The week grid is a real time grid: 07:00–23:00 at 56px per hour, seven day
   columns, class blocks positioned and sized by their start time and duration.
3. The create-class screen shows the hour-block duration stepper and a preview
   whose block width tracks the chosen duration; the clean-state conflict message
   renders.
4. All eight designed screens are reachable from the sidebar or from Design 1,
   and no Design 2 route renders a placeholder. Two routes the shell links to
   remain placeholders on purpose: `/facturacion` belongs to Design 3 and
   `/alumnos` is designed by none of the three features — both out of scope here.
   (Amended: the original wording said no shell link at all could render a
   placeholder, which this feature cannot satisfy.)
5. Captures at 1440px for all eight screens land in `designs/verification/` with
   status 200 and zero console errors.
6. No credential is written into this repository.

## Tasks

| # | Task | Status | Evidence |
| - | ---- | ------ | -------- |
| 1 | Static scheduling data for the eight screens | done | `src/lib/schedule.ts` — 19 classes, 3 rooms/teachers, availability, roster, bookings; derived totals reproduce the designed 32 h / 6,5 h / 25,5 h exactly; tsc ✓ eslint ✓ |
| 2 | Month view (`01`) and week grid (`02`) with the segmented control | done | 15 hour rows measured at exactly 56px, 0 header/label overlaps, 19 blocks sized by duration with 0 clipped, 9 captures 200/0 console errors |
| 3 | Class detail drawer (`03`) and student bookings (`04`) | done | drawer over dimmed grid driven by `?clase=`; occupancy bar measured 75% (324/432px, 12 de 16); `/calendario/mis-reservas` builds; 11 captures 200/0 console errors |
| 4 | Create class by hours (`05`) with duration stepper and live preview | done | bar measured 50/75/100% and block 18/28/38px for 1/1,5/2h; end time updates; 12 captures 200/0 console errors |
| 5 | Availability editor (`06`) | done | summary computed at exactly 32 h / 6,5 h / 25,5 h; day header `6 h · 6 h · 6 h · 6 h · 6 h · 2 h · —`; 14 hour labels, 0 clipped; 13 captures 200/0 |
| 6 | Roster and attendance (`07`) plus teacher week (`08`) | done | tally initialises at exactly `Presentes 10 · Retrasos 1 · Ausencias 1` and recomputes live (9/1/2 after a mark); teacher week shows 6,5 h / 42 / 25,5 h agreeing with screen 06; 15 captures 200/0 |
| 7 | Clases index and Design 1 cross-links | done | `/clases` replaced by a four-entry index; crawl of 14 linked routes: 0 non-200, all 8 Design 2 screens reachable; the 2 remaining placeholders are `/alumnos` and `/facturacion`, both out of scope |
| 8 | Verification: lint, typecheck, build, 8 captures | done | 15/15 checks pass: tsc 0, eslint 0 avisos, build ok, 0 hex fuera de globals, 0 credenciales, las 8 pantallas a 200 con 0 errores de consola, 16 capturas sin fallos, ninguna ruta del Diseño 2 placeholder |

## Commits

| Task | Commit | Subject |
| ---- | ------ | ------- |
| 1 | `d4822b4` | add static scheduling data for Design 2 |
| 2 | `5172f5c` | add the calendar month and week views |
| 3 | `b3a8409` | add the class detail drawer and student bookings |
| 4 | `02d45a4` | add the create-class-by-hours builder |
| 5 | `6df7b2a` | add the availability editor |
| 6 | `c916114` | add the class roster and the teacher's week |
| 7 | `531b96c` | add the Clases index and wire Design 1 cross-links |
| 8 | this commit | verification evidence |

Each task closes with a work-unit commit on `feat/design-2-calendar`.

**Scope change on task 1**: the original title promised "data + route
scaffolding". Routes are built together with their own screen instead of being
stubs filled in later, so no route ships half-implemented and nothing exists only
to be replaced. The task therefore delivered the data module alone.

## Findings

Each was caught by a measurement or a screenshot, not by reading the code:

1. **The sticky day header covered a row.** The card carried `overflow-hidden`
   for its rounded corners, which makes the *card* the sticky scrollport. With
   `top-16`, the header pinned 64px into the card while the page was still at
   scroll 0 — measured `header 357..414` sitting over `grid 350..`, hiding the
   `08:00` label entirely. Corners now come from `rounded-t-lg` on the header
   and `rounded-b-lg` on a grid wrapper; after the fix `header 293..350` and
   **0 overlapping labels**.
2. **The first hour label was half behind the header.** A label centred on the
   grid's first line straddles it, so `HOUR_START` now renders below its line.
3. **Month chips were unreadable.** Time and class name shared one flex row with
   the occupancy, so both truncated to `1 B…`. Chips are two lines now (time +
   occupancy, then the name) with the level colour as a `border-l-4`.
4. **One-hour week blocks clipped their last line.** Occupancy moved up beside
   the time; the room/teacher line only renders above 60px. Verified: 19 blocks,
   **0 with `scrollHeight > clientHeight`**.
5. **The capture tool misrepresented the UI.** `fullPage` screenshots scroll and
   stitch, dragging `position: sticky` elements mid-capture, so the evidence PNG
   looked broken while the page was not. The tool now resizes the viewport to
   the document height before shooting, so nothing scrolls.
6. **Design-system gap, recorded not invented.** DESIGN.md says an event block is
   "tinted by class level" but names no hues. The three level colours are
   implementation tokens in `globals.css`; putting them in DESIGN.md would
   rewrite the theme the three Stitch projects were generated from.
7. **The drawer's occupancy bar rendered empty.** The fill was a `<span>`, which
   is inline, so its `width` was ignored. Measured after the fix: 324px fill in
   a 432px track — exactly 75% for 12 de 16 — in amber `#B45309`, the colour
   reserved for four or fewer places left.
8. **Month chips outside the reference week could not open.** Chips for other
   October dates carry a `-<day>` suffix, which `findClass` did not resolve, so
   those clicks would have opened an empty drawer. It now resolves the suffix
   and derives the weekday from the date.
9. **The live preview did not track duration.** A `Math.max(..., 18)` floor on a
   9px-per-hour scale collapsed every duration to the same 18px height, so the
   stepper moved the bar while the calendar block stood still — precisely what
   acceptance criterion 4 asks for. Scale is now 20px per hour with content
   revealed as the block grows: measured 18px / 28px / 38px for 1 h / 1,5 h / 2 h,
   with the bar at 50% / 75% / 100% and the end time following.
10. **Sub-routes showed the brand instead of the page.** `titleForPath` matched
    exactly, so `/clases/nueva` fell back to "Estudio Salsa" in the top bar. It
    now resolves the longest prefix, verified across five routes.
11. **My own check harness was reading the wrong exit code.** Piping
    `npm run typecheck | tail` reported `tail`'s status, so a genuine
    `TS2304: Cannot find name 'i'` passed as clean until `next build` re-ran the
    type check. Checks now capture npm's status directly.
12. **The last hour label was cut in half.** `23:00` sits on the grid's bottom
    line, so centring it pushed half below the card's `overflow-hidden`. The
    first label now renders below its line and the last one above it: 14 labels,
    **0 clipped**, `23:00` measured inside the card at `[954..970]` of
    `[184..971]`.
13. **The exported screens contradict each other.** The availability export
    says Marcos Delgado has **6,5 h** programmed this week; the teacher-home
    export says **18,5 h** for the same teacher and the same week. Both cannot be
    true, so the app computes both figures from the data — screens 06 and 08
    agree at 6,5 h / 25,5 h — and Design 1's teacher home, which still hardcodes
    18,5, is aligned in task 7. This is a contradiction in the source designs,
    not a decision taken here; it is listed as an open question.
14. **The roster tally did not sum to the designed 10/1/1.** One entry was
    `unmarked`, giving 9/1/1/1. Marked as present so the footer matches the
    export and the three counts still total 12.
15. **Missing `TR` import broke typecheck**, and two unused imports in the
    teacher week. Both caught by `tsc` and `eslint` after the harness started
    reporting npm's exit code correctly.
16. **The placeholder crawl reported a false pass.** It searched for "Pertenece
    al Diseño" while the component renders "Pendiente del Diseño", so every
    placeholder looked clean and the check printed 0 problems. Re-run with the
    real marker: 14 linked routes, 2 placeholders (`/alumnos`, `/facturacion`),
    both out of this feature's scope.
17. **Acceptance criterion 4 was unachievable as written.** It demanded that no
    shell link render a placeholder, which cannot hold while Design 3 is not
    built. Amended to the scope this feature actually owns rather than claimed
    as met.
18. **`<Link><Button /></Link>` was invalid HTML in three places.** A button
    nested inside an anchor gives assistive technology two conflicting roles and
    two focus stops. `LinkButton` now shares one `buttonClasses` with `Button`, so
    a link that looks like a button is a single anchor; all three call sites were
    converted.

## Notes

- Reuse the primitives in `src/components/ui/` rather than re-deriving styles; add
  new primitives there only when two screens need the same thing.
- Times, capacities and money are tabular by rule — use `tabular-figures`.
- Native review remains blocked by `package-local-binary-missing` in this Pi
  session; `/reload` is required before `gentle_review inspect` can open a
  candidate.
