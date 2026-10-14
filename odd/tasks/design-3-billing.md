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

**Two IA calls to record:**

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

The public chain is reachable from the sidebar: Facturación → "Cambiar plan"
(screen 04) → `/tarifas` → "Comprar bono" → `/tarifas/pago` → "Pagar 145,20 €" →
`/tarifas/resultado`.

## Specs

- **S1** — `/tarifas`: public nav bar (logo «Estudio Salsa», enlaces Clases,
  Tarifas, Profesores, Contacto, botón primario «Reservar clase»); título «Elige
  cómo quieres bailar», subtítulo «Sin matrícula, cancela cuando quieras»; tres
  tarjetas: «Clase suelta» `15,00 €` «por clase», «Bono de 10 clases» `120,00 €`
  «12,00 € por clase» con píldora «Más elegido», «Mensual ilimitado» `89,00 €`
  «al mes»; tabla comparativa de cinco filas; FAQ con tres filas, la primera abierta
  «¿Puedo cancelar mi suscripción cuando quiera?» → «Sí, desde tu área de
  facturación y sin coste. Mantienes el acceso hasta el final del periodo pagado».
- **S2** — `/tarifas/pago`: fondo `#FAF7F4`, cabecera con logo y «Volver a tarifas»,
  indicador Carrito → Pago → Confirmación (tercero actual); pestañas «Tarjeta»
  (activa) / «Domiciliación SEPA»; campos con `4242 4242 4242 4242`, `12/28`, `•••`;
  casilla «Guardar esta tarjeta para futuros pagos» marcada; «Datos de facturación»
  con Particular, `12345678Z`, `Calle Bailén 14, 2º B, 28005 Madrid`; resumen:
  «Bono de 10 clases» `120,00 €`, «Subtotal 120,00 €», «IVA (21 %) 25,20 €», «Total
  145,20 €»; campo promocional con «Aplicar»; botón «Pagar 145,20 €»; aviso «Pago
  seguro cifrado. No almacenamos los datos de tu tarjeta».
- **S3** — `/tarifas/resultado`: tarjeta centrada de 560px con check teal de 72px,
  «¡Pago completado!», «Ya puedes reservar tus clases con el bono», resumen: Referencia
  `PED-2026-0184` (monoespaciada), Concepto «Bono de 10 clases», Importe `145,20 €`,
  Método «Visa •••• 4242», Próximo cargo `01/11/2026`; botones «Reservar mi primera
  clase», «Descargar factura», «Ir a mi cuenta»; a la derecha la tarjeta de error
  (diseñada en la misma pantalla): cross rojo, «No hemos podido procesar el pago»,
  «Tu tarjeta ha sido rechazada por el banco. No se ha realizado ningún cargo»,
  «Reintentar pago», «Usar otro método».
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
| T1 | S1-S8 | static data `src/lib/billing.ts` | |
| T2 | S1 | `/tarifas` (+ public layout/nav) | |
| T3 | S2, S3 | `/tarifas/pago`, `/tarifas/resultado` | |
| T4 | S4, S5 | `/facturacion`, `/facturacion/facturas/<n>` | |
| T5 | S6 | `/facturacion?rol=administracion` | |
| T6 | S7, S8 | `/facturacion/facturas` + modal | |
| T7 | S4, S6, S7 | cross-links: admin/student homes, `Cambiar plan`, nav titles | |
| T8 | S9, S10 | verification: gates, 8 captures, link crawl | |

Each task closes with a work-unit commit on `feat/design-3-billing`.

## Log

- **L1** — User: "sigue por la siguiente implementacion". Next implementation after
  `design-2-calendar` (complete, 8/8 tasks) is Design 3 — Facturación: the only
  remaining designed set (8 screens in `designs/03-facturacion/`, flow doc
  `docs/flows/03-billing.md`); `/facturacion` is still the shell's last designed
  placeholder (`/alumnos` is designed by none).
