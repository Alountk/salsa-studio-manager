import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/app-shell";

export const metadata: Metadata = {
  title: "Estudio Salsa — Gestión de clases de salsa",
};

/**
 * Route group for the authenticated area. Group segments do not appear in the
 * URL, so `src/app/(app)/page.tsx` still serves `/`.
 */
export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
