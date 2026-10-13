"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Icon, Input } from "@/components/ui";

/**
 * Design 1, screen 02 — Registro de alumno.
 * Spec: scripts/design-plan.mjs, designs/01-acceso-y-usuarios/02-registro-alumno.png
 */
export default function SignupPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(true);

  /* Four segments with a written label, as designed — never colour alone. */
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const labels = ["Seguridad: muy baja", "Seguridad: baja", "Seguridad: media", "Seguridad: alta"];
    return { score, label: labels[Math.max(score - 1, 0)] ?? labels[0] };
  }, [password]);

  const FILLED = ["bg-error", "bg-tertiary", "bg-tertiary", "bg-secondary"];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accepted) return;
    router.push("/");
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-8">
        <h1 className="font-display text-headline-lg text-on-surface">
          Crea tu cuenta de alumno
        </h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Empieza hoy y reserva tu primera clase.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre" name="firstName" defaultValue="Lucía" autoComplete="given-name" />
          <Input label="Apellidos" name="lastName" defaultValue="Moreno" autoComplete="family-name" />
        </div>

        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          defaultValue="lucia.moreno@example.com"
          autoComplete="email"
        />

        <Input
          label="Teléfono"
          name="phone"
          type="tel"
          defaultValue="+34 612 345 678"
          autoComplete="tel"
          hint="Te avisamos por SMS si cambia el horario de tu clase."
        />

        <div>
          <label
            htmlFor="signup-password"
            className="mb-1.5 block text-label uppercase text-on-surface-variant"
          >
            Contraseña
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 w-full rounded-sm border border-outline-variant bg-surface px-4 py-3 font-sans text-body-md text-on-surface outline-none transition-shadow focus:border-primary focus:shadow-[var(--focus-ring-input)]"
          />
          <div className="mt-2 flex items-center gap-3">
            <div className="flex flex-1 gap-1.5" aria-hidden="true">
              {[0, 1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={`h-1.5 flex-1 rounded-pill ${
                    index < strength.score ? FILLED[strength.score - 1] : "bg-surface-container-highest"
                  }`}
                />
              ))}
            </div>
            <span className="text-label text-on-surface-variant">{strength.label}</span>
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-body-sm text-on-surface-variant">
          <input
            type="checkbox"
            name="terms"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border-outline-variant accent-primary"
          />
          Acepto las condiciones y la política de privacidad.
        </label>

        <Button type="submit" fullWidth disabled={!accepted}>
          Crear cuenta
        </Button>

        <p className="text-center text-body-sm text-on-surface-variant">
          ¿Eres profesor o administrador?{" "}
          <Link href="/recuperar" className="text-primary hover:underline">
            Solicita acceso
          </Link>
        </p>

        <p className="flex items-center justify-center gap-2 text-body-sm text-on-surface-variant">
          <Icon name="arrow_back" className="text-[1rem]" />
          <Link href="/login" className="hover:text-primary">
            Volver al inicio de sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
