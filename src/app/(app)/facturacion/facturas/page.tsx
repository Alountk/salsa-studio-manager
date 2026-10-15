import { Suspense, type ReactNode } from "react";
import { InvoiceList } from "@/components/billing/invoice-list";
import { RegisterPaymentModal } from "@/components/billing/register-payment-modal";
import { ADMIN_INVOICES } from "@/lib/billing";

/**
 * `/facturacion/facturas` — Design 3, screen 07 (S7) plus, with
 * `?registrar=<número>`, screen 08's modal over the dimmed list (route
 * mapping IA call 2: the modal opens from the row menu's «Marcar como
 * pagada»). A designed instance resolves only for invoice numbers in
 * ADMIN_INVOICES; any other `registrar` value renders the plain list rather
 * than an invented dialog (non-goals: no payment recording, no composition).
 *
 * The query lives in `searchParams`, which Next 16 refuses to read outside a
 * Suspense boundary during prerender — same streamed-child pattern as `/` and
 * `/facturacion`.
 */
export default function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ registrar?: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <InvoicesScreen searchParams={searchParams} />
    </Suspense>
  );
}

async function InvoicesScreen({
  searchParams,
}: {
  searchParams: Promise<{ registrar?: string }>;
}): Promise<ReactNode> {
  const { registrar } = await searchParams;
  const invoice = registrar
    ? ADMIN_INVOICES.find((entry) => entry.number === registrar)
    : undefined;

  return (
    <>
      <InvoiceList />
      {invoice ? <RegisterPaymentModal invoice={invoice} /> : null}
    </>
  );
}
