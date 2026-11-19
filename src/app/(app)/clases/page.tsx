import { Icon, LinkButton, Card } from "@/components/ui";

/**
 * `/clases` — a navigation index, not a designed screen.
 *
 * Design 2 has no "Clases" screen: it designs a builder, an availability
 * editor, a roster and a teacher week, all of which need somewhere to live under
 * the sidebar entry the design system does define. Leaving the entry pointing at
 * a placeholder would advertise four screens the shell could not reach, so this
 * page lists them. It is labelled as navigation deliberately.
 */

const ENTRIES = [
  {
    href: "/clases/nueva",
    icon: "add_task",
    title: "Crear clase por horas",
    description:
      "Construye la clase por bloques de hora y revísala en el calendario antes de crearla.",
  },
  {
    href: "/clases/disponibilidad",
    icon: "edit_calendar",
    title: "Disponibilidad",
    description: "Define cuándo puede dar clases cada profesor y dónde están sus huecos libres.",
  },
  {
    href: "/clases/lista",
    icon: "fact_check",
    title: "Lista y asistencia",
    description: "Pasa lista de la clase, revisa el pago y registra quién ha venido.",
  },
  {
    href: "/clases/mi-semana",
    icon: "view_week",
    title: "Mi semana",
    description: "Tu agenda de la semana con las horas libres marcadas y las clases de sustitución.",
  },
];

export default function ClassesIndexPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="font-display text-headline-lg text-on-surface">Clases</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Índice de acceso a las cuatro pantallas de gestión de clases.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {ENTRIES.map((entry) => (
          <Card key={entry.href} className="flex flex-col gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-container text-primary">
              <Icon name={entry.icon} className="text-[1.5rem]" />
            </span>
            <h3 className="font-display text-headline-sm text-on-surface">{entry.title}</h3>
            <p className="flex-1 text-body-md text-on-surface-variant">{entry.description}</p>
            <LinkButton href={entry.href} variant="secondary" icon="arrow_forward" className="self-start">
              Abrir
            </LinkButton>
          </Card>
        ))}
      </div>
    </div>
  );
}
