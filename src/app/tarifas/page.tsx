import type { Metadata } from "next";
import { Icon, LinkButton } from "@/components/ui";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { PlanCards } from "@/components/marketing/plan-cards";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { Faq } from "@/components/marketing/faq";

export const metadata: Metadata = {
  title: "Precios y Tarifas | Estudio Salsa",
};

/**
 * `/tarifas` — Design 3, screen 01 (S1). Public page: no app shell, sticky
 * marketing header and footer around the hero, plan cards, comparison table,
 * FAQ and closing CTA banner. Copy verbatim from the export; destinations
 * follow route mapping IA call 3 (odd/tasks/design-3-billing.md).
 */
const TRUST = [
  { icon: "check_circle", label: "Sin permanencia" },
  { icon: "lock", label: "Pago seguro con tarjeta y Bizum" },
  { icon: "flash_on", label: "Reserva directa online" },
] as const;

export default function TarifasPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-[var(--content-max-width)] flex-1 px-4 py-8 md:px-8">
        {/* Hero */}
        <section className="mx-auto mb-16 max-w-3xl pt-4 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-pill bg-primary-container px-3 py-1 text-label uppercase text-on-primary-container">
            <Icon name="verified" className="text-[15px]" />
            <span>Precios transparentes</span>
          </div>
          <h1 className="mb-3 font-display text-display text-on-surface">
            Elige cómo quieres bailar
          </h1>
          <p className="mb-6 text-body-lg text-on-surface-variant">
            Sin matrícula previa, cuotas ocultas ni compromisos forzados.
            Cancela o cambia de modalidad cuando quieras con total flexibilidad.
          </p>
          <div className="inline-flex flex-wrap items-center justify-center gap-4 rounded-pill bg-surface px-5 py-2 text-body-sm text-on-surface-variant shadow-sm sm:gap-6">
            {TRUST.map((item, index) => (
              <span key={item.label} className="contents">
                {index > 0 ? (
                  <span aria-hidden className="font-bold text-surface-dim">
                    •
                  </span>
                ) : null}
                <span className="flex items-center gap-1.5">
                  <Icon name={item.icon} className="text-lg text-secondary" />
                  {item.label}
                </span>
              </span>
            ))}
          </div>
        </section>

        <PlanCards />
        <ComparisonTable />
        <Faq />

        {/* Closing CTA banner */}
        <section className="relative mb-12 overflow-hidden rounded-lg bg-primary-container p-8 text-center shadow-card md:p-12">
          <div className="relative z-10 mx-auto max-w-2xl">
            <h3 className="mb-3 font-display text-headline-lg text-on-surface">
              ¿Aún no sabes qué nivel o ritmo elegir?
            </h3>
            <p className="mb-6 text-body-md text-on-surface-variant">
              Ven a conocernos, te asesoramos personalmente en recepción y te
              invitamos a una prueba de nivel sin ningún compromiso.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <LinkButton href="/login">Reservar clase de prueba</LinkButton>
              <LinkButton href="#" variant="secondary">
                Contactar por WhatsApp
              </LinkButton>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
