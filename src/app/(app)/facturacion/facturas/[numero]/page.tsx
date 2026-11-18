import { connection } from "next/server";
import { notFound } from "next/navigation";
import { InvoiceDocument } from "@/components/billing/invoice-document";
import { RegisterPaymentModal } from "@/components/billing/register-payment-modal";
import { getDb } from "@/lib/db";
import { getInvoiceByNumber, toAdminInvoice } from "@/lib/db/invoices";
import { listPayments } from "@/lib/db/payments";
import { getStudent } from "@/lib/db/students";

/**
 * `/facturacion/facturas/[numero]` — real invoice detail (spec S3). Replaces
 * the hardcoded V-2026-0184 static segment: any stored number resolves, unknown
 * ones 404. `?registrar` opens the payment modal for unpaid invoices (the list
 * and detail both link there). `await connection()` first (cacheComponents, T9).
 */
export default async function InvoiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ numero: string }>;
  searchParams: Promise<{ registrar?: string }>;
}) {
  await connection();

  const { numero } = await params;
  const db = getDb();
  const invoice = getInvoiceByNumber(db, decodeURIComponent(numero));
  if (!invoice) notFound();

  const student = getStudent(db, invoice.studentId);
  if (!student) notFound();

  const payments = listPayments(db, invoice.id);
  const { registrar } = await searchParams;
  const showModal = registrar !== undefined && invoice.status !== "paid";

  return (
    <>
      <InvoiceDocument invoice={invoice} student={student} payments={payments} />
      {showModal ? <RegisterPaymentModal invoice={toAdminInvoice(invoice)} /> : null}
    </>
  );
}
