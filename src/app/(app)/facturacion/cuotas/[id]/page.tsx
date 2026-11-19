import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { listSubscriptions } from "@/lib/db/subscriptions";
import { EditCuotaForm } from "./edit-cuota-form";

/** `/facturacion/cuotas/[id]` — edit a cuota and change its status (spec S6). */
export default async function CuotaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;
  const cuotaId = Number(id);
  const cuota = listSubscriptions(getDb()).find((entry) => entry.id === cuotaId);
  if (!cuota) notFound();

  return <EditCuotaForm cuota={cuota} />;
}
