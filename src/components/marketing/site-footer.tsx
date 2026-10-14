import { Icon } from "@/components/ui";

/**
 * Design 3, screen 01 — marketing footer: brand column plus three info
 * columns, legal links and copyright line, all verbatim from the export.
 *
 * The address and the © 2025 line contradict screens 02/05 and Design 1
 * (Finding 1 in odd/tasks/design-3-billing.md); rendered as designed until the
 * user reconciles them.
 */
const LEGAL_LINKS = [
  "Términos y Condiciones",
  "Política de Privacidad",
  "Preguntas Frecuentes",
  "Contacto y Ubicación",
];

export function SiteFooter() {
  return (
    <footer className="w-full bg-surface-container px-4 py-12 text-on-surface md:px-8">
      <div className="mx-auto w-full max-w-[var(--content-max-width)]">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-headline-sm font-display text-primary">
              <Icon name="music_note" filled className="text-xl" />
              Estudio Salsa
            </p>
            <p className="text-body-sm text-on-surface-variant">
              Pasión y técnica en cada compás. Formación en ritmos latinos,
              salsa cubana, salsa en línea y bachata en el centro de la ciudad.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-headline-sm font-display text-on-surface">
              Ubicación y Sala
            </h4>
            <p className="text-body-sm text-on-surface-variant">
              Calle del Ritmo 14, 2ª planta
              <br />
              28004 Madrid, España
              <br />
              Metro Tribunal / Chueca
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-headline-sm font-display text-on-surface">
              Horario de Atención
            </h4>
            <p className="text-body-sm text-on-surface-variant">
              Lunes a Viernes: 16:30 - 22:30
              <br />
              Sábados: 10:30 - 14:00 (Talleres)
              <br />
              Domingos: Social mensual
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-headline-sm font-display text-on-surface">
              Contacto directo
            </h4>
            <p className="mb-2 text-body-sm text-on-surface-variant">
              Teléfono: +34 912 345 678
              <br />
              WhatsApp: +34 600 123 456
            </p>
            <span className="flex items-center gap-1 text-label text-secondary">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              Recepción abierta para inscripciones
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant/50 pt-8 md:flex-row">
          <div className="flex flex-wrap items-center gap-6">
            {LEGAL_LINKS.map((label) => (
              <a
                key={label}
                href="#"
                className="text-body-sm text-on-surface-variant transition-colors hover:text-primary"
              >
                {label}
              </a>
            ))}
          </div>
          <p className="text-body-sm text-on-surface-variant">
            © 2025 Estudio Salsa S.L. Pasión y técnica en cada compás. Todos
            los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
