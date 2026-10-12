import Link from "next/link";
import { Button, Card, CardHeader, Icon } from "@/components/ui";

/**
 * Landing for a sidebar section that belongs to Design 2 or Design 3 and has
 * not been built yet. Kept in the shell's own task so the sidebar never links
 * to a 404; replaced by the real section when its feature lands.
 */
export function SectionPlaceholder({
  title,
  design,
  description,
}: {
  title: string;
  design: "2 — Calendario y clases" | "3 — Facturación";
  description: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-container text-primary">
          <Icon name="construction" className="text-[1.25rem]" />
        </span>
        <div>
          <h2 className="font-display text-headline-md text-on-surface">{title}</h2>
          <p className="text-body-sm text-on-surface-variant">
            Pendiente del Diseño {design}
          </p>
        </div>
      </header>

      <Card>
        <CardHeader title="Sección prevista" />
        <p className="max-w-prose text-body-md text-on-surface-variant">
          {description}
        </p>
        <div className="mt-6">
          <Link href="/">
            <Button variant="secondary" icon="arrow_back">
              Volver a Inicio
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
