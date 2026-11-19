"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseEuros, parseInvoiceForm } from "@/lib/actions/billing-actions";
import { getDb } from "@/lib/db";
import { PaymentError, recordPayment } from "@/lib/db/payments";

export type InvoiceFormState = { error: string | null };
export type PaymentFormState = { error: string | null };

/** Validate + create the new invoice, then land on its detail page. */
export async function createInvoiceAction(
  _prev: InvoiceFormState,
  formData: FormData,
): Promise<InvoiceFormState> {
  const result = parseInvoiceForm(
    getDb(),
    {
      studentId: Number(formData.get("studentId")),
      concept: String(formData.get("concept") ?? ""),
      netEuros: String(formData.get("netEuros") ?? ""),
      issueDate: String(formData.get("issueDate") ?? ""),
      dueDate: String(formData.get("dueDate") ?? ""),
    },
  );

  if (!result.ok) return { error: result.error };
  redirect(`/facturacion/facturas/${result.number}`);
}

/** Record a payment against an invoice, then reload its detail page. */
export async function recordPaymentAction(
  _prev: PaymentFormState,
  formData: FormData,
): Promise<PaymentFormState> {
  const invoiceNumber = String(formData.get("invoiceNumber") ?? "");
  const amountCents = parseEuros(String(formData.get("amountEuros") ?? ""));
  const paidAt = String(formData.get("paidAt") ?? "");

  if (amountCents === null) return { error: "El importe debe ser mayor que 0" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(paidAt)) {
    return { error: "El formato de la fecha no es válido" };
  }

  try {
    const note = String(formData.get("note") ?? "").trim();
    recordPayment(getDb(), {
      invoiceNumber,
      amountCents,
      paidAt,
      ...(note ? { note } : {}),
    });
  } catch (error) {
    if (error instanceof PaymentError) return { error: error.message };
    throw error;
  }

  revalidatePath(`/facturacion/facturas/${invoiceNumber}`);
  redirect(`/facturacion/facturas/${invoiceNumber}`);
}
