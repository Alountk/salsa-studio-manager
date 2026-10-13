"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Icon } from "@/components/ui";

/**
 * Design 1, screen 01 — Inicio de sesión.
 * Spec: scripts/design-plan.mjs, designs/01-acceso-y-usuarios/01-inicio-sesion.png
 *
 * There is no auth backend in this feature (see the non-goals), so the form
 * demonstrates the designed states: an empty or wrong password produces the
 * inline error, and the role selector stands in for the role-based redirect a
 * real session would perform.
 */
export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const role = String(data.get("role") ?? "alumno");

    if (password.trim().length === 0) {
      setError("La contraseña no es correcta");
      return;
    }
    setError(null);
    router.push(role === "alumno" ? "/" : `/?rol=${role}`);
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-8">
        <h1 className="font-display text-headline-lg text-on-surface">
          Inicia sesión
        </h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Gestiona tus clases, tus alumnos y tu facturación.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="lucia.moreno@example.com"
          defaultValue="lucia.moreno@example.com"
        />

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-label uppercase text-on-surface-variant"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-invalid={error ? true : undefined}
              onChange={() => error && setError(null)}
              className={
                error
                  ? "h-11 w-full rounded-sm border border-error bg-error-container/40 px-4 py-3 pr-11 font-sans text-body-md text-on-surface outline-none"
                  : "h-11 w-full rounded-sm border border-outline-variant bg-surface px-4 py-3 pr-11 font-sans text-body-md text-on-surface outline-none transition-shadow focus:border-primary focus:shadow-[var(--focus-ring-input)]"
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-sm text-on-surface-variant transition-colors hover:bg-surface-container-low"
            >
              <Icon name={showPassword ? "visibility_off" : "visibility"} className="text-[1.125rem]" />
            </button>
          </div>
          {error ? (
            <p role="alert" className="mt-1.5 text-body-sm text-error">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4 text-body-sm">
          <label className="flex cursor-pointer items-center gap-2 text-on-surface-variant">
            <input
              type="checkbox"
              name="remember"
              defaultChecked
              className="h-4 w-4 rounded-sm border-outline-variant accent-primary"
            />
            Recordarme
          </label>
          <Link href="/recuperar" className="text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" fullWidth>
          Entrar
        </Button>

        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-outline-variant" />
          <span className="text-body-sm text-on-surface-variant">o</span>
          <span className="h-px flex-1 bg-outline-variant" />
        </div>

        <Button type="button" variant="secondary" icon="g_mobiledata" fullWidth>
          Entrar con Google
        </Button>

        <div>
          <label
            htmlFor="role"
            className="mb-1.5 block text-label uppercase text-on-surface-variant"
          >
            Vista de ejemplo
          </label>
          <select
            id="role"
            name="role"
            defaultValue="alumno"
            className="h-11 w-full rounded-sm border border-outline-variant bg-surface px-4 py-3 font-sans text-body-md text-on-surface outline-none focus:border-primary focus:shadow-[var(--focus-ring-input)]"
          >
            <option value="alumno">Entrar como alumno</option>
            <option value="profesor">Entrar como profesor</option>
            <option value="administracion">Entrar como administración</option>
          </select>
        </div>

        <p className="text-center text-body-sm text-on-surface-variant">
          ¿Aún no eres alumno?{" "}
          <Link href="/registro" className="text-primary hover:underline">
            Crea tu cuenta
          </Link>
        </p>
      </form>
    </div>
  );
}
