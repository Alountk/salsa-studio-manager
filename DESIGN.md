---
name: Salsa Studio Manager
colors:
  surface: '#ffffff'
  surface-dim: '#ede7e1'
  surface-bright: '#ffffff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf7f4'
  surface-container: '#f6f1eb'
  surface-container-high: '#f0eae3'
  surface-container-highest: '#e9e2da'
  surface-variant: '#f3ede7'
  on-surface: '#161311'
  on-surface-variant: '#6b625c'
  inverse-surface: '#322c28'
  inverse-on-surface: '#f7f2ed'
  outline: '#8b8079'
  outline-variant: '#e8e2dc'
  surface-tint: '#c2410c'
  primary: '#c2410c'
  on-primary: '#ffffff'
  primary-container: '#fde8dd'
  on-primary-container: '#7a2a0c'
  secondary: '#0f766e'
  on-secondary: '#ffffff'
  secondary-container: '#ccfbf1'
  on-secondary-container: '#0b4f4a'
  tertiary: '#b45309'
  on-tertiary: '#ffffff'
  tertiary-container: '#fef3c7'
  on-tertiary-container: '#7a3e06'
  error: '#b91c1c'
  on-error: '#ffffff'
  error-container: '#fee2e2'
  on-error-container: '#7f1d1d'
  background: '#faf7f4'
  on-background: '#161311'
typography:
  display:
    fontFamily: Outfit
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Outfit
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Outfit
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  metric:
    fontFamily: Outfit
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-tabular:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  button-text:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

A working operations tool for a real dance studio, not a marketing site. The audience
is the studio manager booking rooms and chasing invoices, the teacher taking
attendance at the door, and the student booking a class on their phone between two
other things.

The style is **Warm Operational**: terracotta and mango carry the salsa energy, while
the surrounding surfaces stay a calm warm off-white so that dense calendars, rosters
and invoice tables remain effortless to read. Decisions are driven by legibility, not
decoration.

- **Desktop-first.** Studio staff work on laptops. Every in-app screen is designed at
  1440px and degrades to 1024px. Mobile is reserved for the student booking surface.
- **Numbers are first-class.** Times, prices, occupancy and totals use tabular figures
  and right-aligned columns.
- **Brand lives at the edges.** Photography, the display face and the saturated
  terracotta appear on public and entry surfaces — login, sign-up, pricing. Inside the
  application the chrome recedes and the data is loud.
- **No SaaS clichés.** No gradient hero fills, no glassmorphism, no oversized rounded
  cards, no purple-to-pink accents. Restrained radii between 6px and 14px only.

## Colors

- **Primary (Terracotta `#c2410c`)**: the single action color. Primary buttons, active
  sidebar item, focused input border, selected calendar day, chart series 1. Hover
  lightens toward `#e0561f`, pressed darkens to `#9a3412`.
- **Primary Container (`#fde8dd`)**: selected table rows, active nav item background,
  subtle accent fills, the stacked portion of a progress meter.
- **Secondary (Teal `#0f766e`)**: success and settlement. `Paid`, `Present`,
  `Confirmed`, positive deltas, chart series 3.
- **Tertiary (Amber `#b45309` / container `#fef3c7`)**: attention without alarm. `Few
  spots left`, `Pending`, `Late`, `Renews soon`, chart series 2.
- **Error (`#b91c1c` / container `#fee2e2`)**: `Overdue`, `Absent`, `Cancelled`,
  destructive actions, invalid fields.
- **Neutral ink ladder**: `on-surface #161311` for headings, `on-surface-variant
  #6b625c` for body and labels, `#a79e97` for disabled text only.
- **Rules and dividers**: `outline-variant #e8e2dc` for hairlines, calendar grid lines
  and table dividers.
- **Canvas**: `background #faf7f4` sits behind white `surface` cards, so cards read as
  raised without heavy borders.

Status is **never** communicated by color alone. Every status carries an icon and a
text label inside its pill.

## Typography

- **Outfit** carries display, headings and metric values. Geometric and warm — it gives
  the product a personality without costing legibility.
- **Inter** carries every piece of UI: body copy, table cells, labels, buttons, form
  hints. It stays crisp down to 12px, which is where most of this product lives.
- **Tabular figures** (`font-variant-numeric: tabular-nums`) are mandatory on times,
  prices, occupancy counts, credit balances and column totals.
- **Uppercase eyebrow labels** use `label` with `0.04em` tracking, for table headers
  and metric captions.
- Reference numbers such as `INV-2026-0184` render in a monospace stack so digits align
  when scanned down a column.
- Never go below 12px. Never use more than two weights in a single view.

## Layout & Spacing

A 12-column grid on a 1440px canvas, 1280px maximum content width, `margin-desktop` of
32px and a 24px gutter.

- **Desktop (1024px+)**: the app shell is a 240px left sidebar, a 64px top bar, and a
  content area on `background`. Page padding is 32px. Cards are separated by 24px.
- **Tablet (768–1023px)**: the sidebar collapses to a 64px icon rail; summary side
  panels fold beneath the primary content.
- **Mobile (below 768px)**: a bottom tab bar replaces the sidebar, tables become
  stacked cards, and the calendar drops to an agenda list. Used for the student
  surface only.

Rhythm follows strict multiples of 4px. Structural cards use compact 20–24px padding to
maximise visible data density. Sections are separated by `outline-variant` hairlines
rather than generous empty space.

Dedicated layouts: the **calendar week grid** is seven day columns with 56px hour rows
from 07:00 to 23:00 and a sticky day header; **auth screens** use a 45% brand panel of
darkened studio photography beside a centered 420px form column; **modals** are 560px
wide, or 720px for the class builder.

## Elevation & Depth

Depth comes from the canvas/surface contrast first and from shadow second.

- **Canvas → card**: `background #faf7f4` behind `surface #ffffff` with a 1px
  `outline-variant` border. This alone separates most layers.
- **Card elevation**: `0 1px 2px rgba(22,19,17,0.06), 0 8px 24px -12px rgba(22,19,17,0.12)`.
- **Popover / dropdown**: `0 12px 32px -8px rgba(22,19,17,0.18)`.
- **Modal**: `0 24px 64px -16px rgba(22,19,17,0.28)` over an `inverse-surface` backdrop
  at 45% opacity.
- Shadows are always warm ink-tinted, never pure black. No shadow exceeds 0.28 alpha.

## Shapes

Restrained and consistent.

- `6px` — inputs, selects, badges, compact buttons.
- `10px` — buttons, chips, calendar event blocks, time-slot stepper segments.
- `14px` — cards, panels, modals, the class-detail drawer.
- `999px` — status pills, avatars, toggles, the credits-remaining ring.
- Calendar event blocks get a 4px left accent bar in the class-level color; the block
  radius itself stays 10px.
- Never mix a pill and a sharp corner in the same component group.

## Components

### Buttons
- **Primary**: `primary` fill, `on-primary` text, `10px` radius, 44px height, 12px/20px
  padding, `button-text` type. Hover `#e0561f`, pressed `#9a3412`,
  focus ring `0 0 0 3px rgba(194,65,12,0.25)`.
- **Secondary**: `surface` fill, `on-surface` text, 1px `outline-variant` border.
  Hover background `surface-container`.
- **Ghost**: no fill or border, `on-surface-variant` text, hover background
  `surface-container-low`.
- **Danger**: `error` fill, `on-error` text. Reserved for cancel, void and delete.
- **Compact**: 36px height, used inside table toolbars and calendar headers.
- Every button takes an optional leading icon with an 8px gap.

### Inputs, selects and pickers
- 44px height, 1px `outline-variant` border, `6px` radius, `surface` fill, 12px/16px
  padding, `on-surface-variant` placeholder.
- Focus: `primary` border plus a 3px `rgba(194,65,12,0.25)` ring. Invalid: `error`
  border with an `error-container` tint and a message below in `body-sm`.
- Labels sit above the field in `label` style, uppercase, `on-surface-variant`, 6px
  gap.
- **Time range picker**: a start-time select paired with a **duration stepper** offering
  `1 h`, `1,5 h`, `2 h` and `Personalizado`, above a proportional preview bar showing
  how the block will occupy the calendar.

### Calendar
- **Month view**: seven-column grid, day cells with a date number and up to three
  compact event chips plus a `+2 más` overflow line. Today's cell has a `primary`
  number on a `primary-container` circle.
- **Week view**: 56px hour rows, faint `outline-variant` hour lines, `primary` line for
  the current time, day headers sticky with the date and weekday.
- **Event block**: `primary-container` fill (tinted by class level), 4px left accent
  bar, `10px` radius, showing time range, class name in `on-surface`, room, teacher and
  occupancy `12/16`. Height is proportional to duration. Hover raises the card
  elevation and reveals a drag handle.

### Tables
- 48px rows, sticky `surface-container` header in `label` style, `outline-variant` row
  dividers, no zebra striping.
- Numeric and currency columns are right-aligned with tabular figures.
- Row hover is `primary-container` at 40% opacity. Every row ends with a `⋯` action
  menu.
- Overdue rows carry a 3px `error` left border as well as their status pill.

### Cards and metrics
- **Card**: `surface` fill, 1px `outline-variant` border, `14px` radius, `card`
  elevation, 24px padding, optional header row with a `headline-sm` title and a ghost
  action on the right.
- **Metric card**: uppercase `label` caption, `metric` value in Outfit tabular, a delta
  chip in teal or error, and an optional 40px sparkline.
- **Credits ring**: a 999px progress ring in `primary` on `surface-container-highest`,
  with the remaining count as a `headline-md` value in the center.

### Status pills
Rounded, icon plus text, `label` type, `primary-container`-style tinted background:
`Pagada` (teal), `Pendiente` (amber), `Vencida` (error), `Cancelada` (neutral ink),
`Borrador` (neutral ink), `Lista de espera` (blue `#1d4ed8` on `#eef2ff`),
`Presente` (teal), `Ausente` (error), `Retraso` (amber).

### Avatars
32px, initials on `primary-container`, `10px` text, with a 2px ring in the role color:
student `outline-variant`, teacher `primary`, admin `on-surface`.

### Imagery
Warm documentary photography of a latin dance studio — wooden floor, warm practical
lights, mirrored wall, dancers mid-turn, shot slightly from the side. Always full-bleed
and darkened with `inverse-surface` at 55% whenever text sits on top. Photography
appears only on login, sign-up, password recovery and pricing. Never inside
dashboards, calendars, tables or invoices.

### Empty states and skeletons
Centered 48px icon in `outline`, one sentence in `body-md`, one primary action. Loading
uses skeletons in `surface-container-high` with the real layout's shape.
