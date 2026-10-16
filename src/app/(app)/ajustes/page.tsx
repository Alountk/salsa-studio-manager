import Link from "next/link";
import { Avatar, Button, Card, CardHeader, Input, ProgressRing, Select, StatusPill, Switch } from "@/components/ui";

/**
 * Design 1, screen 07 — Perfil y ajustes.
 * Spec: scripts/design-plan.mjs, designs/01-acceso-y-usuarios/07-perfil-y-ajustes.png
 * Behaviour: docs/flows/01-access-and-users.md, step 5.
 *
 * The tab strip is rendered as the designed four tabs with "Perfil" active; the
 * other three panels are not designed as separate screens yet, so they are
 * inert tabs here rather than invented UI (the flow document records this).
 */

const TABS = ["Perfil", "Seguridad", "Notificaciones", "Membresía"];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Profile header */}
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-outline-variant bg-surface p-6 shadow-card">
        <div className="flex items-center gap-4">
          <Avatar name="Lucía Moreno" role="student" size={64} />
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-headline-md text-on-surface">Lucía Moreno</h2>
              <StatusPill status="confirmed" label="Alumno" />
            </div>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              lucia.moreno@example.com · +34 612 345 678
            </p>
          </div>
        </div>
        <Button variant="secondary" icon="photo_camera">
          Cambiar foto
        </Button>
      </header>

      {/* Tabs */}
      <nav aria-label="Secciones de la cuenta">
        <ul className="flex gap-6 border-b border-outline-variant">
          {TABS.map((tab, index) => (
            <li key={tab}>
              <button
                type="button"
                aria-current={index === 0 ? "page" : undefined}
                disabled={index !== 0}
                className={
                  index === 0
                    ? "-mb-px border-b-2 border-primary pb-3 text-body-md font-medium text-primary"
                    : "pb-3 text-body-md text-on-surface-disabled"
                }
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Personal data */}
        <Card>
          <CardHeader title="Datos personales" />
          <form className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Nombre" name="firstName" defaultValue="Lucía" />
              <Input label="Apellidos" name="lastName" defaultValue="Moreno" />
              <Input label="Correo electrónico" name="email" type="email" defaultValue="lucia.moreno@example.com" />
              <Input label="Teléfono" name="phone" type="tel" defaultValue="+34 612 345 678" />
              <Input
                label="Fecha de nacimiento"
                name="birthdate"
                type="date"
                defaultValue="1994-06-12"
              />
              <Select label="Nivel" name="level" defaultValue="intermedio">
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </Select>
              <Select
                label="Preferencia de estilo"
                name="style"
                defaultValue="linea"
                className="sm:col-span-2"
              >
                <option value="linea">Salsa en línea</option>
                <option value="cubana">Salsa cubana</option>
                <option value="bachata">Bachata</option>
              </Select>
            </div>
            <div className="flex justify-end gap-3 border-t border-outline-variant pt-5">
              <Button variant="ghost" type="button">
                Descartar
              </Button>
              <Button type="submit">Guardar cambios</Button>
            </div>
          </form>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Membresía" />
            <div className="flex items-center gap-5">
              <ProgressRing value={6} total={10} size={88} stroke={7}>
                <span className="font-display text-body-lg tabular-figures text-on-surface">
                  6 de 10
                </span>
              </ProgressRing>
              <div>
                <p className="text-body-md font-medium text-on-surface">Mensual Ilimitado</p>
                <p className="text-headline-sm tabular-figures text-on-surface">79,00 €/mes</p>
                <p className="text-body-sm text-on-surface-variant">Clases del bono</p>
              </div>
            </div>
            <p className="mt-4 text-body-sm tabular-figures text-on-surface-variant">
              Se renueva el 01/11/2026
            </p>
            <div className="mt-4 flex justify-between text-body-sm">
              <Link href="/tarifas" className="text-primary hover:underline">
                Cambiar plan
              </Link>
              <button type="button" className="text-error hover:underline">
                Cancelar suscripción
              </button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Notificaciones" />
            <div className="flex flex-col gap-5">
              <Switch
                label="Recordatorio 24 h antes por correo"
                description="Un aviso con el horario y la sala de tu clase."
                defaultChecked
              />
              <Switch
                label="Aviso de plaza libre en lista de espera"
                description="Te escribimos en cuanto alguien libera su plaza."
                defaultChecked
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
