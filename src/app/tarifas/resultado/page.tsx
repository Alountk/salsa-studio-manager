import type { Metadata } from "next";
import { Button, Card, Icon, LinkButton } from "@/components/ui";
import { PAYMENT_FAILURE, PAYMENT_RESULT, euros } from "@/lib/billing";

export const metadata: Metadata = {
  title: "Resultado del Pago | Estudio Salsa",
};

/**
 * `/tarifas/resultado` — Design 3, screen 03 (S3). The export renders the
 * success card and the error variant side by side on one screen (a designed
 * comparison, S3 of the feature doc), so both are shown at once: success at
 * `max-w-[560px]`, the error variant at `lg:w-[400px]`.
 *
 * Copy verbatim from the export; destinations follow route mapping IA call 3:
 * «Reservar mi primera clase» → `/login`, «Ir a mi cuenta» → `/facturacion`,
 * «Reintentar pago» / «Usar otro método» → `/tarifas/pago`, «Descargar factura»
 * is an inert Button (no real download — non-goal).
 */
export default function ResultadoPagoPage() {
  return (
    <>
      {/* Discrete header: brand pill only, no app shell (export, screen 03). */}
      <header className="flex w-full items-center justify-center pt-8 pb-2">
        <div className="flex items-center gap-2 rounded-pill border border-outline-variant/30 bg-surface px-4 py-1 shadow-sm">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container/40 text-primary">
            <Icon name="music_note" filled className="text-xl" />
          </span>
          <span className="font-display text-headline-sm tracking-tight text-on-surface">
            Estudio Salsa
          </span>
          <span className="px-1 text-xs font-semibold text-on-surface-variant/40">•</span>
          <span className="text-label text-on-surface-variant">Pasarela Segura</span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1280px] flex-1 items-center justify-center px-4 py-6 md:px-8">
        <div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row lg:items-start">
          {/* 1. Success card (560px). */}
          <Card as="section" className="w-full max-w-[560px]">
            <div className="flex flex-col items-center text-center">
              <span className="mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-secondary-container/40 text-secondary ring-[8px] ring-secondary-container/20">
                <Icon name="check" className="text-[36px]" />
              </span>
              <h1 className="mb-1 font-display text-headline-lg text-on-surface">
                ¡Pago completado!
              </h1>
              <p className="text-body-md text-on-surface-variant">
                Ya puedes reservar tus clases con el bono
              </p>
            </div>

            <div className="mt-6 divide-y divide-outline-variant/40 overflow-hidden rounded-md border border-outline-variant/50 bg-background/50">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-body-sm text-on-surface-variant">Referencia</span>
                <span className="rounded border border-outline-variant/30 bg-surface-container px-2 py-0.5 font-mono text-body-sm font-semibold text-on-surface">
                  {PAYMENT_RESULT.reference}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-body-sm text-on-surface-variant">Concepto</span>
                <span className="flex items-center gap-2">
                  <span className="text-body-md font-semibold text-on-surface">
                    {PAYMENT_RESULT.concept}
                  </span>
                  <span className="rounded-pill border border-primary/10 bg-primary-container px-2 py-0.5 text-label text-on-primary-container">
                    {PAYMENT_RESULT.badge}
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between bg-surface px-4 py-2">
                <span className="text-body-sm font-medium text-on-surface-variant">Importe</span>
                <span className="font-display text-[20px] font-bold tabular-figures text-on-surface">
                  {euros(PAYMENT_RESULT.amountCents)}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-body-sm text-on-surface-variant">Método de pago</span>
                <span className="flex items-center gap-1.5 text-body-sm font-medium text-on-surface">
                  <Icon name="credit_card" className="text-[18px] text-on-surface-variant" />
                  {PAYMENT_RESULT.method}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-body-sm text-on-surface-variant">Próximo cargo / Validez</span>
                <span className="text-body-sm font-semibold tabular-figures text-on-surface">
                  {PAYMENT_RESULT.nextCharge}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-md border border-outline-variant/30 bg-surface-container-low p-2">
              <Icon name="mark_email_read" className="shrink-0 text-xl text-primary" />
              <p className="text-body-sm text-on-surface-variant">
                Hemos enviado el comprobante a{" "}
                <span className="font-medium text-on-surface">{PAYMENT_RESULT.receiptEmail}</span>
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <LinkButton href="/login" fullWidth icon="calendar_month">
                Reservar mi primera clase
              </LinkButton>
              <Button variant="secondary" fullWidth icon="download">
                Descargar factura
              </Button>
              <LinkButton href="/facturacion" variant="ghost" fullWidth>
                Ir a mi cuenta
              </LinkButton>
            </div>
          </Card>

          {/* 2. Error variant card (400px) — designed on the same screen. */}
          <Card as="section" className="w-full self-center lg:w-[400px] lg:self-start">
            <div className="mb-4 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-pill border border-error/15 bg-error-container/60 px-2.5 py-1 text-xs font-semibold text-error">
                <span className="h-1.5 w-1.5 rounded-full bg-error" />
                Variante de error / Pago rechazado
              </span>
              <span className="text-label text-on-surface-variant/50">Simulación</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-error-container/50 text-error ring-[6px] ring-error-container/20">
                <Icon name="close" className="text-[32px]" />
              </span>
              <h2 className="mb-1 font-display text-headline-sm text-on-surface">
                No hemos podido procesar el pago
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Tu tarjeta ha sido rechazada por el banco. No se ha realizado ningún cargo.
              </p>
            </div>

            <div className="mt-4 rounded-md border border-outline-variant/40 bg-background p-2 text-left">
              <div className="flex items-start gap-2">
                <Icon name="info" className="mt-0.5 shrink-0 text-[18px] text-error" />
                <div>
                  <p className="mb-1 font-mono text-xs font-semibold text-error">
                    Código: {PAYMENT_FAILURE.code}
                  </p>
                  <p className="text-[12px] leading-relaxed text-on-surface-variant">
                    Si el problema persiste, contacta con tu entidad bancaria o intenta asociar una
                    nueva tarjeta de débito/crédito.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between rounded-md bg-surface-container/50 px-3 py-2 text-xs text-on-surface-variant">
              <span>
                Intento: <strong className="text-on-surface">{PAYMENT_FAILURE.attemptMethod}</strong>
              </span>
              <span className="font-semibold tabular-figures text-on-surface">
                {euros(PAYMENT_FAILURE.attemptAmountCents)}
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <LinkButton href="/tarifas/pago" fullWidth icon="refresh">
                Reintentar pago
              </LinkButton>
              <LinkButton href="/tarifas/pago" variant="secondary" fullWidth icon="swap_horiz">
                Usar otro método
              </LinkButton>
            </div>

            <div className="mt-3 text-center">
              <a
                href="#"
                className="inline-flex items-center gap-1 text-label text-on-surface-variant transition-colors hover:text-primary"
              >
                <Icon name="help" className="text-[15px]" />
                ¿Necesitas asistencia técnica?
              </a>
            </div>
          </Card>
        </div>
      </main>

      <footer className="w-full py-4 text-center">
        <p className="text-xs text-on-surface-variant/70">
          Transacción encriptada con cifrado SSL de 256 bits. Estudio Salsa S.L. © 2026
        </p>
      </footer>
    </>
  );
}
