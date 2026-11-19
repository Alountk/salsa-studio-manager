import Link from "next/link";
import { connection } from "next/server";
import { Avatar, Card, Icon, LinkButton, TBody, TD, THead, TH, TR, Table } from "@/components/ui";
import { euros } from "@/lib/billing";
import { todayIso } from "@/lib/dates";
import { getDb } from "@/lib/db";
import { listStudents } from "@/lib/db/students";
import { studentOutstandingCents } from "@/lib/db/payments";

/**
 * `/alumnos` — the student ledger view (spec S3/S7): who owes what, with a
 * link per student into their invoices, payments, and cuota. Replaces the
 * design-2 placeholder (that feature stays hidden). No delete anywhere.
 */
export default async function StudentsPage() {
  await connection();
  const db = getDb();
  const today = todayIso();

  const rows = listStudents(db).map((student) => ({
    student,
    outstandingCents: studentOutstandingCents(db, student.id, today),
  }));

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:items-end">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-display text-on-surface">Alumnos</h2>
            <span className="rounded-pill bg-surface-container-highest px-2.5 py-0.5 text-label text-primary">
              {rows.length} alumnos
            </span>
          </div>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Quién paga y quién no, con el detalle de facturas y cuotas de cada alumno.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LinkButton href="/alumnos/nuevo" icon="add">
            Nuevo alumno
          </LinkButton>
        </div>
      </section>

      {rows.length === 0 ? (
        <Card as="section" className="px-6 py-12 text-center">
          <p className="text-body-md text-on-surface-variant">
            Todavía no hay alumnos dados de alta.
          </p>
          <div className="mt-4">
            <LinkButton href="/alumnos/nuevo" icon="add">
              Nuevo alumno
            </LinkButton>
          </div>
        </Card>
      ) : (
        <div className="overflow-visible rounded-lg border border-outline-variant bg-surface shadow-card">
          <Table>
            <THead>
              <TH>Alumno</TH>
              <TH>Contacto</TH>
              <TH numeric>Pendiente</TH>
              <TH className="w-16 text-center">Acciones</TH>
            </THead>
            <TBody>
              {rows.map(({ student, outstandingCents }) => (
                <TR key={student.id}>
                  <TD>
                    <span className="flex items-center gap-3">
                      <Avatar name={student.name} size={32} />
                      <Link
                        href={`/alumnos/${student.id}`}
                        className="font-medium text-on-surface hover:text-primary hover:underline"
                      >
                        {student.name}
                      </Link>
                    </span>
                  </TD>
                  <TD className="text-body-sm text-on-surface-variant">
                    {student.email ?? "—"}
                    {student.phone ? ` · ${student.phone}` : ""}
                  </TD>
                  <TD numeric className="font-semibold tabular-figures">
                    {outstandingCents > 0 ? (
                      <span className="text-error">{euros(outstandingCents)}</span>
                    ) : (
                      <span className="text-on-surface-variant">—</span>
                    )}
                  </TD>
                  <TD className="text-center">
                    <Link
                      href={`/alumnos/${student.id}`}
                      aria-label={`Ver ficha de ${student.name}`}
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
