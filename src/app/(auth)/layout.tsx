import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";

export const metadata: Metadata = {
  title: "Estudio Salsa — Gestión de clases de salsa",
};

/**
 * DESIGN.md §Layout → auth screens use a split layout instead of the app shell:
 * a 45% brand panel of darkened studio imagery beside a centered form column.
 *
 * The photograph from the design is not part of this repository, so the panel
 * ships as a warm layered gradient that holds the same composition (logotype,
 * lema, dark overlay). Drop a real image in as a background layer when one is
 * licensed; nothing else needs to change.
 */
function BrandPanel() {
  return (
    <aside className="relative hidden w-[45%] overflow-hidden bg-inverse-surface lg:block">
      {/* Warm studio floor-and-light impression, darkened per DESIGN.md §Imagery. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_15%,rgba(224,86,31,0.55),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_85%_85%,rgba(245,158,11,0.4),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-tertiary/25" />
      <div className="absolute inset-0 bg-inverse-surface/55" />

      <div className="relative flex h-full flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-on-primary">
            <Icon name="music_note" className="text-[1.375rem]" />
          </span>
          <span className="font-display text-headline-md text-white">Estudio Salsa</span>
        </Link>

        <div className="max-w-md">
          <p className="font-display text-display-mobile text-white">
            Tu estudio de salsa, en orden
          </p>
          <p className="mt-4 text-body-lg text-white/85">
            Calendario, clases por horas, reservas y facturación en una sola
            pantalla.
          </p>
        </div>

        <p className="text-label uppercase text-white/70">
          Calle Bailén 14 · Madrid
        </p>
      </div>
    </aside>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface-container-low">
      <BrandPanel />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-14">
        {children}
      </main>
    </div>
  );
}
