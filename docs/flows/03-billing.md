# Flow 3 — Billing

**Question answered:** who owes what, how do they pay it, and can the studio see the
money at a glance?

**Audience:** the **student** buying a pass and paying for classes, and the **studio
admin** running pricing, invoices, and revenue. Pricing is public; everything after
checkout sits behind the app shell with "Facturación" active.

**Stitch project:** `Salsa Studio Manager - Facturacion`
(project `2093881141495994042`, design system `525ed1d326274f1b81ab1966c0fb119f`)
— **8 screens**.

## Screen inventory

| # | Screen id | Purpose | Artifact | Stitch screen id |
| - | --------- | ------- | -------- | ---------------- |
| 1 | `01-tarifas` | Public pricing: drop-in, class pack, monthly plan, plus FAQ. | `designs/03-facturacion/01-tarifas.html` (+ `.png`) | `fb31bbe23f3e4c14b1b45a5b421e2006` |
| 2 | `02-pago` | Checkout: method, card form, billing details, order summary. | `designs/03-facturacion/02-pago.html` (+ `.png`) | `f32d661c2c35485ba0c133bb0520c5ee` |
| 3 | `03-resultado-pago` | Success and failure states side by side. | `designs/03-facturacion/03-resultado-pago.html` (+ `.png`) | `83ab9c49247e4dca81cc9d1052391f5f` |
| 4 | `04-mi-facturacion` | The student's plan, payment methods, and invoice history. | `designs/03-facturacion/04-mi-facturacion.html` (+ `.png`) | `b5be6bbe080b4c9a997f020061765908` |
| 5 | `05-detalle-factura` | A single invoice as a fiscal document, printable. | `designs/03-facturacion/05-detalle-factura.html` (+ `.png`) | `0fe8b74d70e74897b98ee5bb6f127a65` |
| 6 | `06-ingresos` | Admin revenue dashboard: MRR, trend, plan split, debtors. | `designs/03-facturacion/06-ingresos.html` (+ `.png`) | `17909ba43281480f8e03fe8368000141` |
| 7 | `07-facturas` | Admin invoice list with filters, bulk actions, and overdue flags. | `designs/03-facturacion/07-facturas.html` (+ `.png`) | `33de591bdb8d42ab807322edc629b670` |
| 8 | `08-registrar-pago` | Modal for recording a cash, transfer, or terminal payment. | `designs/03-facturacion/08-registrar-pago.html` (+ `.png`) | `62fb962986424c109f1daeb70c4d51c6` |

## Primary flow — student buys a class pack

1. **`01-tarifas`** — the public page opens under a navigation bar (Clases, Tarifas,
   Profesores, Contacto) with the headline "Elige cómo quieres bailar" and "Sin
   matrícula, cancela cuando quieras". Three plans:
   - **Clase suelta** — `15,00 €` (`15,00 € por clase`), secondary action
     "Reservar suelta".
   - **Bono de 10 clases** — `120,00 €` (`12,00 € por clase`), ribbon "Más elegido",
     primary action "Comprar bono".
   - **Mensual ilimitado** — `89,00 €` (`al mes`), secondary action "Suscribirme".

   Below sits a five-row comparison table and an FAQ, with the first question open:
   "¿Puedo cancelar mi suscripción cuando quiera?" → "Sí, desde tu área de
   facturación y sin coste…".
2. **`02-pago`** — a three-step indicator (Carrito → Pago → Confirmación, third
   current). The left column holds the method tabs "Tarjeta" / "Domiciliación SEPA",
   the card fields (`4242 4242 4242 4242`, `12/28`, `•••`), a pre-checked "Guardar
   esta tarjeta para futuros pagos", and "Datos de facturación" (Particular,
   `12345678Z`, `Calle Bailén 14, 2º B, 28005 Madrid`). The right column summarises
   "Bono de 10 clases 120,00 €", "Subtotal 120,00 €", "IVA (21 %) 25,20 €", and
   "Total 145,20 €", with the promo field, the primary "Pagar 145,20 €", and the
   security note "Pago seguro cifrado. No almacenamos los datos de tu tarjeta".
3. **`03-resultado-pago`** — the success card shows a teal check, "¡Pago
   completado!", "Ya puedes reservar tus clases con el bono", and the recap:
   "Referencia PED-2026-0184", "Concepto Bono de 10 clases", "Importe 145,20 €",
   "Método Visa •••• 4242", "Próximo cargo 01/11/2026". Actions are "Reservar mi
   primera clase", "Descargar factura", and "Ir a mi cuenta".
4. **`04-mi-facturacion`** — the pack and plan become permanent: the "Plan actual"
   card shows "Mensual Ilimitado", `89,00 €/mes`, the credits ring "6 de 10",
   "Se renueva el 01/11/2026", the "Renovación automática" switch, and the
   "Cambiar plan" / "Cancelar suscripción" links. "Método de pago" lists
   `Visa •••• 4242` (Caduca 12/28) and `SEPA •••• 8891` marked "Principal". The
   "Historial de facturas" table runs six rows from `V-2026-0184` down to
   `V-2026-0118`, mixing Pagada and one Pendiente, each with a download icon.
5. **`05-detalle-factura`** — the document itself: issuer block (Estudio Salsa S.L.,
   `CIF B-87654321`, `Calle Bailén 14, 28005 Madrid`), invoice number `V-2026-0184`
   in monospace with issue `01/10/2026`, due `15/10/2026`, and payment reference
   `SEPA •••• 8891`; the "Facturado a" block for Lucía Moreno; two line items
   (Mensual Ilimitado · Octubre 2026 and Clase suelta extra) with quantity, unit
   price, VAT %, and total; and the summary "Subtotal 85,95 €", "IVA (21 %) 18,05 €",
   "Total 104,00 €". The header actions are "Enviar por correo" and "Descargar PDF".

## Admin flow — collect and reconcile

1. **`06-ingresos`** — the dashboard opens on "Últimos 12 meses" with four KPIs
   ("Ingresos recurrentes 8.340 €" +6,2 %, "Ingresos del mes 14.320 €" +5,1 %,
   "Pendiente de cobro 3.180 €", "Bajas 2,4 %"). It carries a twelve-month revenue
   bar chart, a "Reparto por plan" donut (Mensual 58 %, Bono 27 %, Suelta 15 %), a
   "Deudores" table of overdue rows, and a stacked payment-method bar
   (Tarjeta 64 %, SEPA 28 %, Efectivo 8 %).
2. **`07-facturas`** — filters by alumno, estado, periodo, and método; a bulk bar
   for selected rows with "Marcar como pagadas", "Reenviar", "Anular"; then the
   table (NÚMERO, ALUMNO, CONCEPTO, EMITIDA, VENCIMIENTO, IMPORTE, ESTADO,
   ACCIONES). Overdue rows carry both a red status pill and a 3px red left border —
   the design's only row-level exception signal. The footer shows "Mostrando 1 a 8
   de 42 facturas" and the filtered total "3.180 €".
3. **`08-registrar-pago`** — for money that arrives offline. The modal sits over the
   dimmed invoice list and opens with the context line "Factura V-2026-0179 ·
   Javier Ruiz · 15,00 €". It captures Alumno, Importe `15,00 €`, a three-way
   method selector (Efectivo / Transferencia / Datafono), Concepto "Clase suelta
   25/09/2026", Fecha `09/10/2026`, the associated invoice, "Enviar recibo por
   correo" (checked), "Avisar también por WhatsApp" (unchecked), and optional notes.

## Alternate and edge paths

- **Payment failure is designed.** Screen 3 shows the alternate card: a red cross,
  "No hemos podido procesar el pago", "Tu tarjeta ha sido rechazada por el banco. No
  se ha realizado ningún cargo", with "Reintentar pago" and "Usar otro método".
  Three other outcomes are **not** designed: a timeout/unknown result, a 3-D Secure
  challenge, and a partial charge.
- **Promo codes** — the field and "Aplicar" exist on screen 2, but no applied or
  invalid state is drawn.
- **SEPA direct debit** — selectable on screen 2, yet no mandate acceptance, debit
  notification, or failed-direct-debit path exists.
- **Dunning** — overdue invoices are visible in screens 6 and 7, but there is no
  reminder, suspension, or write-off flow.
- **Voids and refunds** — "Anular" appears in the bulk menu of screen 7; the
  confirmation, refund, and credit-restoration steps are absent.
- **Plan change and cancellation** — linked from screen 4, not designed here.
- **Multi-currency and manual tax rates** — every amount is EUR with a flat 21 %
  Spanish VAT; nothing in the design varies either.

## Cross-design handoffs

- Every checkout ends as an invoice line the student sees in
  [Flow 1 — Access and users](01-access-and-users.md) ("Últimas facturas", the
  "Siguiente pago" card, and the "Membresía" tab).
- Drop-in class charges originate from the booking drawer in
  [Flow 2 — Calendar and classes](02-calendar-and-classes.md), and the credit ring
  that this flow replenishes is the same ring shown in Flow 1 and Flow 2.
- The "Deudores" panel in screen 6 and the overdue rows in screen 7 are what surface
  in the admin attention queue on the Flow 1 admin home.

## Open questions

1. **Who issues an invoice?** Screens 7 and 8 let the admin manage invoices, but
   only screen 8 ("Nueva factura" → "Registrar pago") hints at manual creation; the
   invoice-composition screen itself is missing.
2. **What taxes apply to class packs and to international students?** A flat 21 %
   is assumed everywhere with no exemption or intra-EU B2B handling.
3. **Refund policy** is entirely undesigned despite "Anular" and "Cancelar
   suscripción" both existing as links.
4. **Proration** on plan change — not specified.
5. **Revenue recognition for packs** — a 10-class pack bought in one month spans
   several; the dashboard's revenue split by plan does not say which basis it uses.
6. **Failed payment → booking lockout** — nothing states whether an overdue invoice
   blocks new reservations, which the studio will care about on day one.
