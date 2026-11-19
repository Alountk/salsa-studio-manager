import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { Card, Icon, LinkButton, StatusPill, TBody, TD, THead, TH, TR, Table } from "@/components/ui";
import { euros } from "@/lib/billing";
import { formatEs, todayIso } from "@/lib/dates";
import { getDb } from "@/lib/db";
import { listInvoices } from "@/lib/db/invoices";
import { studentOutstandingCents } from "@/lib/db/payments";
import { getStudent } from "@/lib/db/students";
import { listSubscriptions } from "@/lib/db/subscriptions";
import { updateStudentAction } from "../actions";
import { StudentForm } from "../student-form";

/**
 * `/alumnos/[id]` — one student's file: outstanding balance, editable fields,
 * full invoice history with amounts paid, and their cuota (link into the
 * cuota editor). No delete control (spec S7: no hard delete while invoices
 * exist).
 */
export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;
  const studentId = Number(id);
  const db = getDb();
  const student = getStudent(db, studentId);
  if (!student) notFound();

  const today = todayIso();
  const outstandingCents = studentOutstandingCents(db, studentId, today);
  const invoices = listInvoices(db).filter((invoice) => invoice.studentId === studentId);
  const cuotas = listSubscriptions(db).filter(
    (cuota) => cuota.studentId === studentId && cuota.status !== "ended",
  );
  const activeCuota = cuotas.find((cuota) => cuota.status === "active");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/alumnos"
          className="group inline-flex w-fit items-center gap-1.5 text-body-sm text-on-surface-variant transition-colors hover:text-primary"
        >
          <Icon
            name="arrow_back"
            className="text-base transition-transform group-hover:-translate-x-0.5"
          />
          Volver a Alumnos
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-headline-lg text-on-surface">{student.name}</h2>
          <span
            className={
              outstandingCents > 0
                ? "rounded-pill bg-error-container px-2.5 py-0.5 text-label text-error"
                : "rounded-pill bg-secondary-container px-2.5 py-0.5 text-label text-on-secondary-container"
            }
          >
            {outstandingCents > 0 ? `Debe ${euros(outstandingCents)}` : "Al día"}
          </span>
        </div>
      </div>

      {/* Editable record */}
      <section>
        <h3 className="mb-4 font-display text-headline-sm text-on-surface">Ficha</h3>
        <StudentForm
          action={updateStudentAction}
          student={student}
          submitLabel="Guardar cambios"
          cancelHref="/alumnos"
        />
      </section>

      {/* Cuota */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-display text-headline-sm text-on-surface">Cuota mensual</h3>
          {!activeCuota ? (
            <LinkButton href="/facturacion/cuotas/nueva" variant="secondary" size="compact" icon="add">
              Nueva cuota
            </LinkButton>
          ) : null}
        </div>
        {cuotas.length === 0 ? (
          <Card className="px-5 py-6 text-body-md text-on-surface-variant">
            Sin cuota recurrente: se factura a mano desde Facturación.
          </Card>
        ) : (
          cuotas.map((cuota) => (
            <Card key={cuota.id} className="mb-3 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-body-md font-medium text-on-surface">{cuota.concept}</p>
                  <p className="text-body-sm text-on-surface-variant">
                    {euros(cuota.amountCents)} base + IVA · día {cuota.billingDay} · próxima factura{" "}
                    {cuota.status === "paused"
                      ? "al reanudar"
                      : formatEs(cuota.nextInvoiceDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill
                    status={cuota.status === "active" ? "confirmed" : "waitlist"}
                    label={cuota.status === "active" ? "Activa" : "En pausa"}
                  />
                  <Link
                    href={`/facturacion/cuotas/${cuota.id}`}
                    className="text-body-sm font-medium text-primary hover:underline"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </section>

      {/* Invoice history */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-display text-headline-sm text-on-surface">Facturas</h3>
          <LinkButton href="/facturacion/nueva" variant="secondary" size="compact" icon="add">
            Nueva factura
          </LinkButton>
        </div>
        {invoices.length === 0 ? (
          <Card className="px-5 py-6 text-body-md text-on-surface-variant">
            Todavía no hay facturas para este alumno.
          </Card>
        ) : (
          <div className="overflow-visible rounded-lg border border-outline-variant bg-surface shadow-card">
            <Table>
              <THead>
                <TH>Número</TH>
                <TH>Concepto</TH>
                <TH>Emitida</TH>
                <TH>Vencimiento</TH>
                <TH numeric>Total</TH>
                <TH numeric>Pagado</TH>
                <TH className="text-center">Estado</TH>
              </THead>
              <TBody>
                {invoices.map((invoice) => (
                  <TR key={invoice.number}>
                    <TD>
                      <Link
                        href={`/facturacion/facturas/${invoice.number}`}
                        className="font-mono text-body-sm font-medium text-primary hover:underline"
                      >
                        {invoice.number}
                      </Link>
                    </TD>
                    <TD className="font-medium text-on-surface-variant">{invoice.concept}</TD>
                    <TD className="text-body-sm tabular-figures text-on-surface-variant">
                      {formatEs(invoice.issueDate)}
                    </TD>
                    <TD className="text-body-sm tabular-figures text-on-surface-variant">
                      {formatEs(invoice.dueDate)}
                    </TD>
                    <TD numeric className="font-semibold tabular-figures">
                      {euros(invoice.grossCents)}
                    </TD>
                    <TD numeric className="tabular-figures text-on-surface-variant">
                      {euros(invoice.paidCents)}
                    </TD>
                    <TD className="text-center">
                      <StatusPill status={invoice.status} />
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
}
