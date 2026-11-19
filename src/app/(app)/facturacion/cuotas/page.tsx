import Link from "next/link";
import { connection } from "next/server";
import { Avatar, Card, Icon, LinkButton, StatusPill, TBody, TD, THead, TH, TR, Table, type StatusKind } from "@/components/ui";
import { euros, grossOf } from "@/lib/billing";
import { formatEs } from "@/lib/dates";
import { getDb } from "@/lib/db";
import { listSubscriptions, type CuotaStatus, type Subscription } from "@/lib/db/subscriptions";

/**
 * `/facturacion/cuotas` — the cuotas list (spec S6: "recurrentes y
 * revisables"). Every figure comes from the repository; statuses map onto the
 * design's pill vocabulary with explicit labels (the pill set has no
 * active/paused/ended kinds).
 */
const CUOTA_PILL: Record<CuotaStatus, { status: StatusKind; label: string }> = {
  active: { status: "confirmed", label: "Activa" },
  paused: { status: "waitlist", label: "En pausa" },
  ended: { status: "cancelled", label: "De baja" },
};

function CuotaStatusPill({ status }: { status: CuotaStatus }) {
  const pill = CUOTA_PILL[status];
  return <StatusPill status={pill.status} label={pill.label} />;
}

export default async function CuotasPage() {
  await connection();
  const cuotas = listSubscriptions(getDb());

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:items-end">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-display text-on-surface">Cuotas</h2>
            <span className="rounded-pill bg-surface-container-highest px-2.5 py-0.5 text-label text-primary">
              {cuotas.length} cuotas
            </span>
          </div>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Cuotas mensuales: se factura sola cada mes y todo cambio afecta solo a facturas futuras.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LinkButton href="/facturacion/cuotas/nueva" icon="add">
            Nueva cuota
          </LinkButton>
        </div>
      </section>

      {cuotas.length === 0 ? (
        <Card as="section" className="px-6 py-12 text-center">
          <p className="text-body-md text-on-surface-variant">
            Todavía no hay cuotas recurrentes. Crea la primera y el estudio empezará a facturar sola
            cada mes.
          </p>
          <div className="mt-4">
            <LinkButton href="/facturacion/cuotas/nueva" icon="add">
              Nueva cuota
            </LinkButton>
          </div>
        </Card>
      ) : (
        <div className="overflow-visible rounded-lg border border-outline-variant bg-surface shadow-card">
          <Table>
            <THead>
              <TH>Alumno</TH>
              <TH>Concepto</TH>
              <TH numeric>Base</TH>
              <TH numeric>Total (IVA incl.)</TH>
              <TH numeric>Día</TH>
              <TH>Próxima factura</TH>
              <TH className="text-center">Estado</TH>
              <TH className="w-16 text-center">Acciones</TH>
            </THead>
            <TBody>
              {cuotas.map((cuota: Subscription) => (
                <TR key={cuota.id}>
                  <TD>
                    <span className="flex items-center gap-3">
                      <Avatar name={cuota.studentName} size={32} />
                      <span className="font-medium text-on-surface">{cuota.studentName}</span>
                    </span>
                  </TD>
                  <TD className="font-medium text-on-surface-variant">{cuota.concept}</TD>
                  <TD numeric className="font-semibold tabular-figures">
                    {euros(cuota.amountCents)}
                  </TD>
                  <TD numeric className="tabular-figures text-on-surface-variant">
                    {euros(grossOf(cuota.amountCents))}
                  </TD>
                  <TD numeric className="tabular-figures text-on-surface-variant">
                    {cuota.billingDay}
                  </TD>
                  <TD className="text-body-sm tabular-figures text-on-surface-variant">
                    {cuota.status === "ended" ? "—" : formatEs(cuota.nextInvoiceDate)}
                  </TD>
                  <TD className="text-center">
                    <CuotaStatusPill status={cuota.status} />
                  </TD>
                  <TD className="text-center">
                    <Link
                      href={`/facturacion/cuotas/${cuota.id}`}
                      aria-label={`Editar cuota de ${cuota.studentName}`}
                      className="mx-auto flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                    >
                      <Icon name="chevron_right" />
                    </Link>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      )}
    </div>
  );
}
