import { InvoiceDocument } from "@/components/billing/invoice-document";

/**
 * `/facturacion/facturas/V-2026-0184` — Design 3, screen 05 (S5). Static
 * segment: V-2026-0184 is the only invoice with a designed fiscal document
 * (INVOICE_DETAIL), and it is entered from the history row of screen 04
 * (route mapping, feature doc). Any other invoice number resolves to a 404
 * rather than an invented document — non-goal: no invoice composition.
 */
export default function InvoiceDetailPage() {
  return <InvoiceDocument />;
}
