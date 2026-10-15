# Feature: design-3-billing

Implement Design 3 — Facturación — as working routes: the public pricing page,
checkout, payment result, the student's billing area, the invoice document, and the
admin revenue dashboard, invoice list and manual payment entry.
Spec of record: `scripts/design-plan.mjs` (the eight screen prompts), the exported
screens in `designs/03-facturacion/`, and `docs/flows/03-billing.md`.

## Non-goals

- Real payment processing, tax calculation or invoice issuance: every screen renders
  designed states over static data, as in the two previous features.
- The invoice-composition screen — it is not designed (flow doc, open question 1);
  "Nueva factura" links to the invoice list where the designed management lives.
- Refunds, dunning, plan change/cancellation flows, promo-code states, SEPA mandate
  flows and 3-D Secure — all explicitly undesigned (flow doc, "Alternate and edge
  paths").
- `/alumnos` remains a placeholder: designed by none of the three features.
- Mobile: every screen is desktop at 1440px, as DESIGN.md specifies.

## Route mapping

| Screen | Route |
| ------ | ----- |
| `01-tarifas` | `/tarifas` — public, no app shell |
| `02-pago` | `/tarifas/pago` — public; entered from "Comprar bono"/"Suscribirme" |
| `03-resultado-pago` | `/tarifas/resultado` — public; entered from "Pagar …" |
| `04-mi-facturacion` | `/facturacion` — app shell (student default) |
| `05-detalle-factura` | `/facturacion/facturas/<número>` — entered from the history row |
| `06-ingresos` | `/facturacion?rol=administracion` — same role-switch pattern as `/` |
| `07-facturas` | `/facturacion/facturas` — admin list |
| `08-registrar-pago` | `/facturacion/facturas?registrar=<número>` — modal over the dimmed list |

**Three IA calls to record:**

1. `/facturacion` is role-aware exactly like `/` (Design 1's precedent): the student
   screen by default, the admin dashboard with `?rol=administracion`. The sidebar
   entry therefore lands students on their own billing and the admin home's links
   carry the role. A teacher has no designed billing surface; `?rol=profesor` falls
   back to the student screen, mirroring the home's fallback.
2. The entry point for screen 08 is the row menu's **"Marcar como pagada"** on a
   non-Pagada invoice of screen 07: recording how an offline payment arrived *is*
   marking the invoice paid, and the modal's context line already names the exact
   invoice (`Factura V-2026-0179 · Javier Ruiz · 15,00 €`). The bulk bar and the
   other two menu options keep their designed behaviour. No menu item is added or
   renamed.
3. Marketing nav and CTA destinations: the export renders every link as `href="#"`.
   Links whose destination *is* designed go to the real route — logo → `/`,
   «Precios» → `/tarifas`, «Iniciar Sesión»/«Reservar Clase»/«Reservar suelta»/
   «Suscribirme»/«Reservar clase de prueba» → `/login` (booking and subscribing
   require an account), «Comprar bono» → `/tarifas/pago`. Links whose destination
   no design covers («Clases», «Horarios», «Profesores», «Eventos», «Contactar por
   WhatsApp», footer legal links) keep the export's inert `#` — inventing a
   destination would promise content that does not exist.

The public chain is reachable from the sidebar: Facturación → "Cambiar plan"
(screen 04) → `/tarifas` → "Comprar bono" → `/tarifas/pago` → "Pagar 145,20 €" →
`/tarifas/resultado`.

## Specs

- **S1** — `/tarifas`: public nav (logo «Estudio Salsa», links «Clases»,
  «Precios» (active), «Horarios», «Profesores», «Eventos», plus «Iniciar Sesión»
  and the primary button «Reservar Clase»); hero eyebrow «PRECIOS
  TRANSPARENTES», `h1` «Elige cómo quieres bailar», subtitle «Sin matrícula
  previa, cuotas ocultas ni compromisos forzados. Cancela o cambia de modalidad
  cuando quieras con total flexibilidad.», trust strip «Sin permanencia · Pago
  seguro con tarjeta y Bizum · Reserva directa online»; three plan cards:
  «Clase suelta» `15,00 €` «/ clase», «Bono de 10 clases» `120,00 €` «/ bono» with
  «12,00 € por clase» + pill «Ahorro de 30 €» and the ribbon «MÁS ELEGIDO»,
  «Mensual ilimitado» `89,00 €` «/ mes», CTAs «Reservar suelta» / «Comprar bono» /
  «Suscribirme»; five-row comparison table with the «Bono 10 clases» column
  highlighted; FAQ of three rows with the first open, «¿Puedo cancelar mi
  suscripción cuando quiera?» → «Sí, desde tu área privada de facturación y sin
  coste alguno ni penalizaciones. Mantendrás el acceso a todas las clases hasta que
  termine el periodo mensual pagado.»; CTA band «¿Aún no sabes qué nivel o ritmo
  elegir?» with «Reservar clase de prueba» / «Contactar por WhatsApp»; footer
  columns «Ubicación y Sala», «Horario de Atención», «Contacto directo», legal
  links and «© 2025 Estudio Salsa S.L.».
- **S2** — `/tarifas/pago`: fondo `#FAF7F4`, cabecera con logo y «Volver a Precios»,
  indicador Carrito → Pago → Confirmación (tercero actual); pestañas «Tarjeta»
  (activa) / «Domiciliación SEPA»; campos con `4242 4242 4242 4242`, `12/28`, `•••`;
  casilla «Guardar esta tarjeta para futuros pagos y cuotas» marcada; «Datos de facturación»
  con Particular, `12345678Z`, `Calle Bailén 14, 2º B, 28005 Madrid`; resumen:
  «Bono de 10 clases» `120,00 €`, «Subtotal base 120,00 €», «IVA (21 %) 25,20 €», «Total
  145,20 €»; campo promocional con «Aplicar»; botón «Pagar 145,20 €»; aviso «Pago seguro cifrado con protocolo TLS. No almacenamos los datos
  completos de tu tarjeta de crédito.»; pie «© 2024 Estudio Salsa. Todos los
  derechos reservados. Pago seguro con encriptación SSL de 256 bits.».
- **S3** — `/tarifas/resultado`: tarjeta centrada de 560px con check teal de 72px,
  «¡Pago completado!», «Ya puedes reservar tus clases con el bono», resumen: Referencia
  `PED-2026-0184` (monoespaciada), Concepto «Bono de 10 clases» con píldora «Salsa Cubana & Estilo», Importe `145,20 €`,
  Método «Visa •••• 4242», «Próximo cargo / Validez» `01/11/2026`, aviso «Hemos
  enviado el comprobante a alicia.salsa@ejemplo.com»; botones «Reservar mi primera
  clase», «Descargar factura», «Ir a mi cuenta»; a la derecha la tarjeta de error
  (diseñada en la misma pantalla): cross rojo, «No hemos podido procesar el pago»,
  «Tu tarjeta ha sido rechazada por el banco. No se ha realizado ningún cargo.»,
  «Reintentar pago», «Usar otro método»; detalle «Variante de error / Pago
  rechazado» y «Código: ERR_CARD_DECLINED_05», enlace «¿Necesitas asistencia
  técnica?»; pie «Transacción encriptada con cifrado SSL de 256 bits. Estudio
  Salsa S.L. © 2026».
- **S4** — `/facturacion` (alumno): cabecera «Mi facturación» + «Añadir método de
  pago»; tarjeta «Plan actual» con «Mensual Ilimitado», `89,00 €/mes`, anillo «6 de
  10» etiquetado «Clases del bono», «Se renueva el 01/11/2026», «Próximo cargo
  89,00 €», interruptor «Renovación automática» activado, enlaces «Cambiar plan» y
  «Cancelar suscripción»; tarjeta «Método de pago» con «Visa •••• 4242» (Caduca
  12/28) y «SEPA •••• 8891» con píldora «Principal»; «Historial de facturas» con
  filtros Año 2026 / Estado Todas y seis filas (`V-2026-0184` … `V-2026-0118`, cinco
  Pagada y `V-2026-0130` Pendiente), número en monoespaciada, importes `89,00 €` /
  `120,00 €` / `15,00 €`, icono de descarga y menú «⋯» por fila.
- **S5** — `/facturacion/facturas/V-2026-0184`: enlace «Volver a mis facturas»,
  título «Factura V-2026-0184», píldora Pagada, «Enviar por correo» y «Descargar
  PDF»; documento de 800px: emisor «Estudio Salsa S.L.», `CIF B-87654321`, «Calle
  Bailén 14, 28005 Madrid», `hola@estudiosalsa.es`; número `V-2026-0184`
  monoespaciado, emisión `01/10/2026`, vencimiento `15/10/2026`, referencia «SEPA
  •••• 8891»; «Facturado a» Lucía Moreno, `NIF 12345678Z`, dirección; dos líneas
  («Mensual Ilimitado · Octubre 2026» 1 / `73,55 €` / 21 % / `89,00 €` — fila
  resaltada en `#FDE8DD`; «Clase suelta extra» 1 / `12,40 €` / 21 % / `15,00 €`);
  resumen «Subtotal 85,95 €», «IVA (21 %) 18,05 €», «Total 104,00 €».
- **S6** — `/facturacion?rol=administracion`: cabecera «Ingresos», periodo «Últimos
  12 meses», «Exportar CSV» y «Nueva factura»; KPIs: «Ingresos recurrentes» `8.340 €`
  chip `+6,2 %`, «Ingresos del mes» `14.320 €` chip `+5,1 %`, «Pendiente de cobro»
  `3.180 €` + píldora «3 facturas», «Bajas» `2,4 %` chip `-0,3 %`; gráfico de barras
  de doce meses (nov 2025 → oct 2026, mes actual resaltado, leyenda Suscripciones /
  Bonos, línea de media); anillo «Reparto por plan» Mensual 58 % / Bono 27 % /
  Suelta 15 %; tabla «Deudores» de cuatro filas con píldora Vencida y enlace «Ver
  todas las facturas»; barra apilada «Métodos de pago» Tarjeta 64 % / SEPA 28 % /
  Efectivo 8 %.
- **S7** — `/facturacion/facturas`: cabecera «Facturas» + «Exportar» + «Nueva
  factura»; filtros (buscador, Estado Vencidas, Periodo Últimos 3 meses, Método
  Todos, «Limpiar filtros»); barra masiva «3 facturas seleccionadas» con «Marcar
  como pagadas», «Reenviar», «Anular»; tabla de ocho filas con casillas, columnas
  NÚMERO…ACCIONES, números monoespaciados, importes alineados a la derecha en cifras
  tabulares; filas Vencida con píldora roja Y barra roja izquierda de 3px; menú «⋯»
  con «Marcar como pagada», «Reenviar por correo», «Anular factura»; pie «Mostrando 1
  a 8 de 42 facturas» y «Total filtrado 3.180 €».
- **S8** — `/facturacion/facturas?registrar=V-2026-0179`: modal de 560px sobre la
  lista atenuada al 45 % con velo `#322C28`; cabecera «Registrar pago» + cerrar;
  contexto «Factura V-2026-0179 · Javier Ruiz · 15,00 €»; Alumno «Javier Ruiz»;
  Importe `15,00 €` / `EUR €`; método en tres botones (Efectivo activo,
  Transferencia, Datafono); Concepto «Clase suelta 25/09/2026»; Fecha `09/10/2026`;
  «Factura asociada» `V-2026-0179`; casillas «Enviar recibo por correo» marcada y
  «Avisar también por WhatsApp» sin marcar; Notas; «Cancelar» y «Registrar pago».
- **S9** — Gates: `npm run lint`, `npm run typecheck`, `npm run build` pass; no hex
  literal in `src/` outside `src/app/globals.css`; no credential in the repository.
- **S10** — All eight designed screens reachable from the sidebar or from Design 1/2
  links; no Design 3 route renders a placeholder; the only remaining placeholder in
  the shell is `/alumnos` (designed by none). Captures at 1440px for the eight
  screens land in `designs/verification/` with status 200 and zero console errors.

## Tasks

| ID | Spec | Route | Commit |
| ---- | ---- | ----- | ------ |
| T1 | S1-S8 | static data `src/lib/billing.ts` | `b49d306` |
| T2 | S1 | `/tarifas` (+ public layout/nav) | `f1a7f15` |
| T3 | S2, S3 | `/tarifas/pago`, `/tarifas/resultado` | `769803d` |
| T4 | S4, S5 | `/facturacion`, `/facturacion/facturas/V-2026-0184` | `341b01a` |
| T5 | S6 | `/facturacion?rol=administracion` | `3ecbd94` |
| T6 | S7, S8 | `/facturacion/facturas` + modal | |
| T7 | S4, S6, S7 | cross-links: admin/student homes, `Cambiar plan`, nav titles | |
| T8 | S9, S10 | verification: gates, 8 captures, link crawl | |

Each task closes with a work-unit commit on `feat/design-3-billing`.

## Findings

1. **Screen 01's footer contradicts the rest of the product on the studio's
   address**: the marketing footer says «Calle del Ritmo 14, 2ª planta · 28004
   Madrid» while screens 02/05 and Design 1's brand panel say «Calle Bailén 14 ·
   28005 Madrid»; it also carries «© 2025» where screen 04 says «© 2026». Each
   screen renders as designed (no silent unification — the same treatment Design 2
   gave its 6,5 h / 18,5 h contradiction); flagged for the user to reconcile.

2. **Screens 02/03 contradict screen 05 on who is paying** (same treatment: render
   as designed, flag it): the checkout prefills cardholder and billing name «Elena
   Morales Gómez» with NIF `12345678Z` — the same NIF screen 05 bills to «Lucía
   Moreno» — and the receipt goes to a third name, `alicia.salsa@ejemplo.com`;
   screen 02's footer also carries «© 2024» where screen 01 says «© 2025» and
   screens 03/04 say «© 2026» (extends finding 1), and its address «Calle Bailén 14,
   2º B» adds a floor the invoice omits. Screen 04's export topbar adds a *fourth*
   identity, «Elena Martínez» / `elena.salsa@madrid.es` — the shared shell renders
   «Lucía Moreno» instead (shell built once, app-scaffold).

## Log

- **L1** — User: "sigue por la siguiente implementacion". Next implementation after
  `design-2-calendar` (complete, 8/8 tasks) is Design 3 — Facturación: the only
  remaining designed set (8 screens in `designs/03-facturacion/`, flow doc
  `docs/flows/03-billing.md`); `/facturacion` is still the shell's last designed
  placeholder (`/alumnos` is designed by none).
- **L2** — Copy precedence (recorded during T1, applies to every screen): where
  `scripts/design-plan.mjs` or `docs/flows/03-billing.md` disagree with the
  exported screen, **the export wins** — T8 compares captures side-by-side with
  `designs/03-facturacion/*.png`. Evidence of divergence: nav (prompt «Clases,
  Tarifas, Profesores, Contacto» vs export «Clases, Precios, Horarios, Profesores,
  Eventos»), hero subtitle, plan units («por clase» vs «/ clase»), ribbon case
  («Más elegido» vs «MÁS ELEGIDO»), FAQ answer. The export's Stitch theme also
  reuses token *names* with different *values* (its `primary` is `#9b2f00` and its
  `primary-container` is `#c2410c`, which is *our* `primary`); `src/` keeps
  DESIGN.md tokens only (S9 forbids hex) and maps export colors by visual role.
  S1 was rewritten to the export's literal strings.
- **L3** — User: "actualiza el handoff para poder continuar en una session nueva".
  Session ends mid-**T3**; this entry is the resume point for a fresh session.
  - **Committed**: T1 `b49d306` · T2 `f1a7f15` (S1 page + public nav components +
    capture `01-tarifas.png` + its screenshot route). S2/S3 were rewritten to the
    export's literals alongside this entry (same treatment as S1 under L2).
  - **On disk, uncommitted (T3 prep; `npm run typecheck` exit 0)**:
    `src/app/globals.css` += payment-network tokens `--color-brand-visa #1434cb`,
    `--color-brand-mc-red #eb001b`, `--color-brand-mc-orange #f79e1b` (hex lives only
    here — S9); `src/components/ui/input.tsx` += `FieldShell.labelAction` (the CVC
    help-button row), `Input.endAdornment` (Visa/Mastercard badges + CVC lock pinned
    at `right-3`, `pointer-events-none`), `Input.mono` (swaps font-sans↔font-mono
    instead of stacking families), `Input.inputClassName` (input-level `pr-24`,
    `tracking-wider`); `src/lib/billing.ts` += `CHECKOUT_ORDER` (item/card/billing;
    12000 / 2520 / 14520), `PAYMENT_RESULT.badge` «Salsa Cubana & Estilo» +
    `receiptEmail` `alicia.salsa@ejemplo.com`, `PAYMENT_FAILURE`
    (`ERR_CARD_DECLINED_05`; attempt `Visa •••• 4242` / 14520).
  - **Not yet written**: `src/components/marketing/checkout-header.tsx` (its own
    stepper header — Carrito ✓ → Pago ✓ → Confirmación actual — plus «Volver a
    Precios» → `/tarifas` and the mobile banner «Paso 3: Confirmación y Pago»),
    `src/app/tarifas/pago/page.tsx`, `src/app/tarifas/resultado/page.tsx`, and the
    `scripts/screenshot.mjs` routes `02-pago` → `/tarifas/pago`,
    `03-resultado-pago` → `/tarifas/resultado`.
  - **T3 decisions**: destinations — «Volver a Precios» → `/tarifas`, «Pagar …» →
    `/tarifas/resultado`, «Reservar mi primera clase» → `/login`, «Ir a mi cuenta» →
    `/facturacion`, «Reintentar pago»/«Usar otro método» → `/tarifas/pago`,
    «Descargar factura» = inert `Button` (non-goal: no real download), help/legal
    links keep `#`. Structure — `Card` primitive for every card, `Select` for Tipo de
    documento, 7/5 grid with `lg:sticky lg:top-24` summary aside; the result screen
    renders *both* designed cards side by side (success `max-w-[560px]` + error
    `lg:w-[400px]`). Type — never stack `font-bold`/`font-semibold` on tokens that
    bake weight, skip `leading-*` on text tokens, 12px floor (export's 11px →
    `text-label`), checkout Total uses `text-display-mobile` (26px), `font-display`
    required with headline/display tokens. Color — export `primary-container`(#c2410c)
    = our `primary`, export `surface-container-high`(peach) = our `primary-container`,
    text on peach → `text-on-primary-container` (AA), hover `#e0561f` =
    `primary-hover`, `#E8E2DC` = `outline-variant`, `#161311` = `on-surface`.
  - **Environment**: dev server on `3101` (`npm run dev -- -p 3101`; PID 24224 at
    handoff — restart if the session took it down); `3100` holds a stale `next start`
    of an old build — never capture against it. Capture: `node scripts/screenshot.mjs
    http://localhost:3101` → `designs/verification/` (+ `manifest.json`, currently the
    T2 run; the Design 1/2 PNGs are dirty from that run — commit with T3 or refresh in
    T8). Side-by-side compare with ffmpeg scale+hstack (T2 pattern, `/tmp/t2cmp`).
  - **Next steps, in order**: 1) write the three files and append the two routes;
    2) `npm run typecheck` && `npm run lint`; 3) capture screens 02/03, compare
    against `02-pago.png` / `03-resultado-pago.png`, fix deltas; 4) fill T3's commit
    hash in the Tasks table (T2's is already filled), commit T3 (prep + pages +
    routes + verification PNGs), update the todo list + Engram mirror; 5) continue
    with T4–T8.
- **L4** — User: "puedes continuar". **T3 complete (S2, S3).**
  - Written: `src/components/marketing/checkout-header.tsx` (brand anchor, three-step
    stepper Carrito ✓ → Pago ✓ → Confirmación actual, SSL badge, «Volver a Precios» →
    `/tarifas`, mobile banner), `src/app/tarifas/pago/page.tsx` (7/5 grid, card/SEPA
    tabs, prefilled card + billing forms, sticky summary with the totals from
    `CHECKOUT_ORDER`, promo row, «Pagar …» → `/tarifas/resultado`, TLS notice, seals,
    support micro-card, checkout footer), `src/app/tarifas/resultado/page.tsx` (both
    designed cards side by side: success `max-w-[560px]` + error `lg:w-[400px]`), and
    the two screenshot routes `02-pago` / `03-resultado-pago`.
  - **Screenshot script fix (own defect)**: each route inherited the previous route's
    viewport, and every page has `min-height: 100%`, so short pages after tall ones
    were captured stretched (02/03 first came out at 1440×2735 with a ~1600px phantom
    gap). `scripts/screenshot.mjs` now resets the viewport to 1440×900 before measuring
    each route; the Design 1/2 captures are refreshed with the fix and committed here.
  - **Side-by-side deltas found and fixed on screen 03**: success check ring
    `ring-[6px]` → `ring-[8px]` (export `ring-8`), error detail `text-xs` → `text-[12px]`
    (export literal). Screen 02 matched at first pass (structure, copy, colors;
    1122 vs 1134 px height at equal width ≈ ±1 %).
  - **Evidence**: `npm run typecheck` 0, `npm run lint` 0, no hex in `src/` outside
    `globals.css`, 19/19 captures 200 with 0 console errors on `:3101`, side-by-side
    against `designs/03-facturacion/02-pago.png` and `03-resultado-pago.png`.
  - T3's hash is filled in the Tasks table after the commit and rides with the next
    task's commit, the same way T1/T2's hashes rode with this one.
- **L5** — **T4 complete (S4, S5).**
  - Written: `src/components/billing/student-billing.tsx` (screen 04 canvas: plan
    card with the 6/10 credits ring and auto-renew switch, payment-methods card with
    the Visa/SEPA rows, six-row invoice history with filters + pagination,
    institutional footer), `src/components/billing/invoice-document.tsx` (screen 05:
    action bar + 800px sheet with issuer/buyer blocks, line table with the
    highlighted first row, right-aligned totals and legal note),
    `src/app/(app)/facturacion/page.tsx` (role routing mirroring `/` — student by
    default, the admin slot documented for T5, `?rol=profesor` falls back to the
    student screen per IA call 1),
    `src/app/(app)/facturacion/facturas/V-2026-0184/page.tsx` (static segment: only
    the designed invoice resolves, any other number is a 404 rather than an
    invented document — non-goal, no invoice composition), screenshot routes
    `04-mi-facturacion`/`05-detalle-factura`, and `--color-brand-visa-navy` in
    globals.css (hex stays there — S9).
  - **Own defect found and fixed**: the VISA badge rendered blank on the first
    capture — `bg-brand-visa-navy` was absent from the served stylesheet because
    the dev server's chunk cache predated the globals.css token. Rebuilding `.next`
    regenerated it (class + var verified in the served CSS, badge verified in a
    zoomed capture); all captures redone afterwards.
  - **Side-by-side vs exports 04/05**: structure, copy and figures match (89,00 €,
    6/10, 85,95/18,05/104,00 €, six rows, «Mostrando 6 de 18 facturas
    registradas», legal note). Accepted deltas: (a) `StatusPill` renders uppercase
    «PAGADA» where the exports show «Pagada» — shared Design-1 primitive, changing
    it would re-open screens of Designs 1/2; (b) the shared topbar title reads
    «Facturación» where screen 04 shows «Mi facturación» and screen 05 a
    «Facturación › Detalle de Comprobante» breadcrumb — nav titles are T7's task;
    (c) shared-shell chrome («Lucía Moreno» avatar, plan card in the sidebar) differs
    from each export's own shell variant («Elena Martínez», «Sede Central»,
    «PLATAFORMA DE GESTIÓN») — app-scaffold's "shell built once" wins, as in
    Design 2; (d) the export PNGs are viewport captures (~1025px) that cut the
    table mid-way, so only the region they show is compared (ours 1075px at 1280
    for the same content region).
  - **Evidence**: `npm run typecheck` 0, `npm run lint` 0, no hex in `src/` outside
    `globals.css`, 21/21 captures status 200 with 0 console errors on `:3101`,
    side-by-side against `designs/03-facturacion/04-mi-facturacion.png` and
    `05-detalle-factura.png`.
- **L6** — **T5 complete (S6).**
  - Written: `src/components/billing/admin-revenue.tsx` (header row with the
    «Últimos 12 meses» select, «Exportar CSV» and «Nueva factura» → the designed
    invoice list; four KPI cards from `KPIS` with the delta chip / «3 emitidas»
    pill; the twelve-month stacked chart with legend, mean badge, current-month
    ring + «14.320 €» tag and range/growth footer; the «Reparto por plan» donut
    with its exact exported dasharray geometry and legend; the «Deudores» table
    (four rows, `StatusPill overdue`, retry icon-button) with the
    «443,20 € (4 de 3.180 € acumulados)» footer and the inert WhatsApp button;
    the «Métodos de pago» stacked bar + three detail rows + gateway footer),
    `src/app/(app)/facturacion/page.tsx` now registers `administracion:
    <AdminRevenue />`, and `scripts/screenshot.mjs` gained `06-ingresos` →
    `/facturacion?rol=administracion`.
  - **globals.css tokens (S9)**: `--color-series-bonos #fb923c` (export's
    «Bonos & Clases» bar/segment/donut legend) and `--color-series-efectivo
    #d97706` (cash share of the payment bar) as implementation tokens — same
    treatment as the T3 payment-network badges; no DESIGN.md role exists for
    either hex (L3 mapping doesn't cover them).
  - **Own defect found and fixed**: the first capture rendered the chart bars
    single-colour, the donut's third arc and the payment bar's cash segment
    blank — the dev server's compiled CSS chunk predated the new `@theme` block
    (same failure class as T4's VISA badge: `grep series` = 0 in the served
    stylesheet). Rebuilding `.next` regenerated it; `bg-series-*`, `stroke-`
    and `text-series-efectivo` verified in the served CSS, then all captures
    were redone. Pixel checks confirm `#fb923c`/`#c2410c` stacked segments and
    the `#fb923c` donut arc.
  - **Side-by-side vs export 06**: structure, copy and figures match (KPIs
    8.340/14.320/3.180/2,4 %, «3 emitidas», chart range Nov 2025 – Oct 2026,
    donut 8.305,60/3.866,40/2.148,00 € at 58/27/15 %, debtors 89,00/120,00/
    89,00/145,20 € with «14/21/28/35 días», «Total pendiente mostrado: 443,20 €»,
    payment mix 9.164,80/4.009,60/1.145,60 € at 64/28/8 %, «+27,8 %»). Accepted
    deltas carry over from T4: (a) `StatusPill` renders uppercase «VENCIDA»
    where the export shows «Vencida» (shared primitive); (b) the shared topbar
    title reads «Facturación» (T7); (c) shared-shell chrome («Lucía Moreno»
    avatar, student plan card in the sidebar) vs the export's «Carmen R.»/
    «Panel Administrativo» — shell built once.
  - **Evidence**: `npm run typecheck` 0, `npm run lint` 0, no hex in `src/`
    outside `globals.css`, 22/22 captures status 200 with 0 console errors on
    `:3101`, side-by-side against `designs/03-facturacion/06-ingresos.png`.
  - T5's hash is filled in the Tasks table after the commit and rides with the
    next task's commit, the same way T1–T4's hashes rode with later ones.
- **L7** — **T6 complete (S7, S8).**
  - Written: `src/components/billing/invoice-list.tsx` (screen 07 canvas:
    header + «42 emitidas» pill + «Exportar»/«Nueva factura»; filter bar with
    search, the designed active Estado select (border/tint/primary label —
    composed locally because the shared `Select` cannot restyle the control
    without stacking conflicting colour utilities), Periodo/Método selects and
    «Limpiar filtros»; bulk bar «3 facturas seleccionadas · Total acumulado:
    180,00 €» with the three bulk actions; nine-column table over
    `ADMIN_INVOICES` with checkboxes, per-row avatars, mono numbers,
    overdue rows carrying BOTH the red pill and the 3px left bar, the export's
    open row menu on V-2026-0179 whose «Marcar como pagada» enters the modal
    (IA call 2); footer with recuento, 5-page pagination and «Total filtrado:
    3.180,00 €»), `src/components/billing/register-payment-modal.tsx` (screen
    08: 560px dialog on the `inverse-surface/45` veil + backdrop blur, context
    line, Alumno/Importe/method selector with Efectivo active/Concepto/Fecha/
    Factura asociada/checkboxes with designed state/Notas, Cancelar + close →
    the list, inert «Registrar pago»), `src/app/(app)/facturacion/facturas/
    page.tsx` (streamed `?registrar=` resolves only for ADMIN_INVOICES numbers;
    any other value renders the plain list — no invented dialog), and the
    screenshot routes `07-facturas` / `08-registrar-pago`.
  - **Own defect found and fixed**: the modal's Importe initially rendered
    `15,00 €` (full `euros()` output) where the export shows bare `15,00`
    with the separate «EUR €» suffix — now strips the symbol; re-captured.
  - **Side-by-side vs exports 07/08**: structure, copy and figures match
    (42 emitidas, Estado: Vencidas, 8 rows V-2026-0179…0188 with the designed
    statuses/dates/amounts, 180,00 € selected, 3.180,00 € filtrado, modal
    context «Factura V-2026-0179 · Javier Ruiz · 15,00 €», «Clase suelta
    25/09/2026», «09/10/2026», «V-2026-0179 (Pendiente - 15,00 €)», email/WhatsApp
    hints, pre-filled Notas). Veil verified by pixel (background ≈ (162,160,158)
    = 45% over `inverse-surface`). Accepted deltas carry over: (a) `StatusPill`
    uppercase «VENCIDA»/«PAGADA»/«PENDIENTE» vs export sentence case (shared
    primitive); (b) shared topbar/sidebar chrome («Lucía Moreno», student plan
    card) vs the export's «Marta R.»/«Sede Central» shell (built once); (c)
    export row-menu demo sits `right-6 top-10` over narrower rows — ours
    anchors the same 48-wide menu to the acciones cell.
  - **Evidence**: `npm run typecheck` 0, `npm run lint` 0 (2 warnings fixed in
    pass), no hex in `src/` outside `globals.css`, 24/24 captures status 200
    with 0 console errors on `:3101`, side-by-side against
    `designs/03-facturacion/07-facturas.png` and `08-registrar-pago.png`.
  - T6's hash is filled in the Tasks table after the commit and rides with the
    next task's commit, the same way T1–T5's hashes rode with later ones.
