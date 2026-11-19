import Link from "next/link";
import { Fragment } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * Design 3, screen 02 — checkout-only header (S2): the brand anchor, the
 * three-step order stepper (Carrito ✓ → Pago ✓ → Confirmación actual), the SSL
 * badge, the way back to the price list and the mobile stepper banner.
 *
 * The export gives the steps no destination, so they are labels, not links.
 * Destinations follow route mapping IA call 3 (odd/tasks/design-3-billing.md):
 * the logo goes home and «Volver a Precios» to `/tarifas`.
 */
const STEPS = [
  { label: "Carrito", state: "done" },
  { label: "Pago", state: "done" },
  { label: "Confirmación", state: "current" },
] as const;

export function CheckoutHeader() {
  return (
    <>
      <header className="sticky top-0 z-30 h-16 w-full border-b border-outline-variant bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-transform duration-100 active:scale-95"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-on-primary shadow-sm">
              <Icon name="music_note" filled className="text-xl" />
            </span>
            <span className="font-display text-headline-md tracking-tight text-primary">
              Estudio Salsa
            </span>
          </Link>

          <nav aria-label="Progreso del pedido" className="hidden items-center gap-3 md:flex">
            {STEPS.map((step, index) => (
              <Fragment key={step.label}>
                {index > 0 ? (
                  <span
                    aria-hidden
                    className={cn(
                      "h-0.5 w-8 rounded-full",
                      index === STEPS.length - 1 ? "bg-primary" : "bg-secondary",
                    )}
                  />
                ) : null}
                {step.state === "done" ? (
                  <span className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-on-secondary">
                      <Icon name="check" filled className="text-[15px]" />
                    </span>
                    <span className="text-body-sm font-semibold text-secondary">{step.label}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span
                      aria-current="step"
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-on-primary text-label ring-4 ring-primary-container"
                    >
                      3
                    </span>
                    <span className="text-body-sm font-semibold text-primary">{step.label}</span>
                  </span>
                )}
              </Fragment>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <span className="hidden items-center gap-1.5 rounded-pill border border-outline-variant bg-surface-container px-3 py-1 text-label text-on-surface-variant sm:flex">
              <Icon name="lock" filled className="text-base text-secondary" />
              <span>Pago seguro SSL 256-bit</span>
            </span>
            <Link
              href="/tarifas"
              className="flex items-center gap-1 text-body-sm font-medium text-on-surface-variant transition-colors duration-150 hover:text-primary active:scale-95"
            >
              <Icon name="arrow_back" className="text-[18px]" />
              <span>Volver a Precios</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile stepper banner — visible below md, where the desktop stepper hides. */}
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container px-4 py-2.5 text-body-sm md:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-on-primary text-label">
            3
          </span>
          <span className="font-semibold text-primary">Paso 3: Confirmación y Pago</span>
        </div>
        <span className="flex items-center gap-1 text-label text-secondary">
          <Icon name="verified_user" filled className="text-sm" />
          SSL Activo
        </span>
      </div>
    </>
  );
}
