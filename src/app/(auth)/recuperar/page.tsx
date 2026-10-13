"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, Icon, Input } from "@/components/ui";

/**
 * Design 1, screen 03 — Recuperar contraseña.
 * Spec: scripts/design-plan.mjs, designs/01-acceso-y-usuarios/03-recuperar-contrasena.png
 *
 * The design shows both halves of the flow side by side in a single image, so
 * both cards render together here too: state A is the request, state B the
 * confirmation. Submitting moves focus to B rather than hiding A, which keeps
 * the designed composition intact.
 */
export default function RecoveryPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <div className="flex w-full max-w-[900px] flex-col items-stretch gap-6 md:flex-row">
      {/* State A — request */}
      <section className="flex flex-1 flex-col rounded-lg border border-outline-variant bg-surface p-6 shadow-card">
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-pill bg-primary-container text-primary">
          <Icon name="lock" className="text-[1.375rem]" />
        </span>
        <h1 className="font-display text-headline-lg text-on-surface">
          Recupera tu contraseña
        </h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Te enviaremos un enlace para crear una nueva.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <Input
            label="Correo electrónico"
            name="email"
            type="email"
            defaultValue="lucia.moreno@example.com"
            autoComplete="email"
          />
          <Button type="submit" fullWidth>
            Enviar enlace
          </Button>
        </form>
      </section>

      {/* State B — confirmation */}
      <section
        aria-hidden={!sent}
        className={`flex flex-1 flex-col rounded-lg border bg-surface p-6 shadow-card transition-opacity ${
          sent
            ? "border-outline-variant opacity-100"
            : "border-outline-variant/60 opacity-70"
        }`}
      >
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-pill bg-secondary-container text-on-secondary-container">
          <Icon name="mark_email_read" className="text-[1.375rem]" />
        </span>
        <h2 className="font-display text-headline-lg text-on-surface">
          Revisa tu correo
        </h2>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Hemos enviado el enlace a lucia.moreno@example.com. Caduca en 30
          minutos.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <Button type="button" variant="secondary" disabled={!sent} fullWidth>
            Reenviar en 45 s
          </Button>
          <p className="text-center text-body-sm text-on-surface-variant">
            <Link href="/login" className="text-primary hover:underline">
              Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
