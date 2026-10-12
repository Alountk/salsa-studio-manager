import type { ReactNode } from "react";

/*
 * Temporary landing while app-scaffold task 5 builds the Design 1 routes.
 * Replaced by the authenticated home once the role-aware entry points exist.
 */
export default function Home(): ReactNode {
  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-6 bg-background px-6 py-16">
      <p className="text-label uppercase text-on-surface-variant">
        Estudio Salsa
      </p>
      <h1 className="text-display-mobile text-center font-display text-on-surface">
        Gestión de clases de salsa
      </h1>
      <p className="max-w-md text-center text-body-md text-on-surface-variant">
        El esqueleto de la aplicación y el sistema de diseño de DESIGN.md ya
        están conectados.
      </p>
    </main>
  );
}
