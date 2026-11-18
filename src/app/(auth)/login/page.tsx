"use client";

import { useActionState, useState } from "react";
import { Button, Icon, Input } from "@/components/ui";
import { login, type LoginState } from "./actions";

/**
 * Design 1, screen 01 — Inicio de sesión, wired to real authentication
 * (spec S4). The designed markup stays; the demo role selector, fake
 * validation, Google button, "recordarme", and the signup/recovery links are
 * gone: there is exactly one admin account and exactly one way in.
 */
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {
    error: null,
  });

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

      <form action={formAction} className="flex flex-col gap-5" noValidate>
        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
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
              aria-invalid={state.error ? true : undefined}
              className={
                state.error
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
          {state.error ? (
            <p role="alert" className="mt-1.5 text-body-sm text-error">
              {state.error}
            </p>
          ) : null}
        </div>

        <Button type="submit" fullWidth disabled={pending}>
          {pending ? "Entrando…" : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
