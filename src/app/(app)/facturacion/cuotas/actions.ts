"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseCuotaForm, updateCuotaForm } from "@/lib/actions/cuota-actions";
import { todayIso } from "@/lib/dates";
import { getDb } from "@/lib/db";
import { setSubscriptionStatus } from "@/lib/db/subscriptions";

export type CuotaFormState = { error: string | null };

function readCuotaForm(formData: FormData) {
  return {
    studentId: Number(formData.get("studentId")),
    concept: String(formData.get("concept") ?? ""),
    netEuros: String(formData.get("netEuros") ?? ""),
    billingDay: Number(formData.get("billingDay")),
    startDate: String(formData.get("startDate") ?? ""),
  };
}

/** Create a cuota, then return to the cuotas list (spec S6). */
export async function createCuotaAction(
  _prev: CuotaFormState,
  formData: FormData,
): Promise<CuotaFormState> {
  const result = parseCuotaForm(getDb(), readCuotaForm(formData), todayIso());
  if (!result.ok) return { error: result.error };

  revalidatePath("/facturacion/cuotas");
  redirect("/facturacion/cuotas");
}

/** Edit a cuota (future invoices only), then return to the list. */
export async function updateCuotaAction(
  _prev: CuotaFormState,
  formData: FormData,
): Promise<CuotaFormState> {
  const result = updateCuotaForm(getDb(), Number(formData.get("id")), readCuotaForm(formData));
  if (!result.ok) return { error: result.error };

  revalidatePath("/facturacion/cuotas");
  redirect("/facturacion/cuotas");
}

/** Pause, resume, or end a cuota from the edit page's status form. */
export async function setCuotaStatusAction(formData: FormData): Promise<void> {
  const status = String(formData.get("status") ?? "");
  if (status !== "active" && status !== "paused" && status !== "ended") return;

  setSubscriptionStatus(getDb(), Number(formData.get("id")), status);
  revalidatePath("/facturacion/cuotas");
  redirect("/facturacion/cuotas");
}
